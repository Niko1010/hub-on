"""Transparent offline baseline; Chinese aspect rules + TF-IDF similarity."""
from collections import Counter
import re

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.provenance import labels

TOPICS = {
    '腰部舒适与固定': ['腰部','腰带','固定带','束缚','勒','太紧'],
    '助力表现': ['助力','上坡','爬坡','省力','动力'],
    '重量与耐久体验': ['重量','重','走久','疲劳','沉'],
    '穿戴与易用性': ['穿戴','穿起来','穿脱','调节','操作'],
    '其他体验': [],
}
LEXICON = ['腰部','固定带','束缚感','上坡','助力','助力不足','重量','走久','穿戴','穿脱','舒适','省力','续航','调节','紧','重']
NEGATIVE = ['不足','不够','太紧','有点紧','束缚','勒','有一点重','有点重','太重','沉','不舒服','疼','麻烦','费力','困难','不好','不满意','疲劳']
POSITIVE = ['还可以','还不错','不错','很好','舒服','满意','省力','方便','轻便','有帮助','足够']
SUGGESTIONS = {
    '腰部舒适与固定': ('调整腰带的可调范围、接触面软垫及受力分布；先确认尺寸与穿戴方法。',
                   '比较两种腰带宽度及松紧设置，记录腰部压迫评分、滑移量和穿戴时间。'),
    '助力表现': ('按坡度与体重评估助力档位和响应时机，保留被肯定的上坡助力体验。',
             '在相同坡度交叉测试助力档位，记录主观用力、步速及响应延迟。'),
    '重量与耐久体验': ('评估重心位置及腰腿负重分配，验证是否需要轻量化或结构调整。',
                    '开展 10/20/30 分钟步行对比，记录重量感、疲劳评分和压迫位置。'),
    '穿戴与易用性': ('优化穿戴步骤、尺寸标记和调节提示。',
                   '邀请首次使用者独立穿戴，记录用时、求助次数和错误步骤。'),
    '其他体验': ('回访并澄清使用情境，再决定改进方向。','追问具体触发情境，复测能否稳定复现。'),
}


def polarity(text):
    # Negation handling is deliberately local and inspectable, not an LLM claim.
    cleaned = text
    for phrase in ['没有束缚感','不觉得重','不重','不紧','不勒','没有不舒服','没有疼','不麻烦','不费力']:
        cleaned = cleaned.replace(phrase, ' 舒服 ')
    neg = any(x in cleaned for x in NEGATIVE)
    pos = any(x in cleaned for x in POSITIVE)
    # Handle explicit negation of an otherwise positive phrase.
    if re.search(r'不(太|怎么|是很)?(方便|舒服|省力|满意)', cleaned):
        neg = True
        cleaned = re.sub(r'不(太|怎么|是很)?(方便|舒服|省力|满意)', '', cleaned)
        pos = any(x in cleaned for x in POSITIVE)
    return 'mixed' if neg and pos else 'negative' if neg else 'positive' if pos else 'neutral'


def analyze_feedback(events):
    utterances = [e for e in events if e['event_type']=='utterance']
    feedback=[]
    for e in utterances:
        raw=e['metadata'].get('raw_text',e['description'])
        for text in re.split(r'[，,。！？!?；;\n]|但是|不过',raw):
            text=text.strip()
            if not text:
                continue
            scores={topic:sum(k in text for k in words) for topic,words in TOPICS.items()}
            topic=max(scores,key=scores.get) if max(scores.values()) else '其他体验'
            sentiment=polarity(text)
            intent='feature_request' if any(k in text for k in ['希望','能不能','需要','建议','想要']) else (
                'reported_difficulty' if sentiment in ('negative','mixed') else 'evaluation')
            feedback.append({'text':text,'quote':raw,'event_id':e['event_id'],
                'timestamp':e['timestamp'],'end_timestamp':e['metadata'].get('end_timestamp',e['timestamp']),
                'topic':topic,'sentiment':sentiment,'intent':intent,'speaker':e['metadata'].get('speaker'),
                'method':'aspect_rules_v1',**labels(e['metadata'].get('simulated',False),'RULE_BASED'),
                'evidence_processing_method':e['metadata'].get('processing_method','UNVERIFIED')})
    keywords=[]
    for word in LEXICON:
        mentions=[e['event_id'] for e in utterances if word in e['description']]
        if mentions:
            keywords.append({'word':word,'count':len(mentions),'evidence_ids':mentions})
    keywords.sort(key=lambda k:(-k['count'],k['word']))
    clusters=cluster_feedback(feedback)
    counts=Counter(f['sentiment'] for f in feedback)
    return {'feedback':feedback,'keywords':keywords,'clusters':clusters,
            'pain_points':[f for f in feedback if f['sentiment'] in ('negative','mixed')],
            'sentiments':{s:counts[s] for s in ['positive','negative','mixed','neutral']},
            'utterance_count':len(utterances),
            'method':'规则情感/主题 + 字符 TF-IDF 相似度；不代表已验证的心理情绪。'}


def cluster_feedback(feedback):
    if not feedback:
        return []
    texts=[f['text'] for f in feedback]
    try:
        vectors=TfidfVectorizer(analyzer='char',ngram_range=(1,3)).fit_transform(texts)
        similarities=cosine_similarity(vectors)
    except ValueError:
        similarities=np.eye(len(texts))
    remaining=set(range(len(texts)))
    clusters=[]
    while remaining:
        seed=min(remaining)
        topic=feedback[seed]['topic']
        # Same product aspect groups paraphrases; similarity supplies a measured
        # within-topic signal, not a claim of semantic equivalence.
        members=[i for i in sorted(remaining) if feedback[i]['topic']==topic]
        remaining.difference_update(members)
        pairs=[float(similarities[i,j]) for i in members for j in members if i<j]
        clusters.append({'topic':topic,'count':len(members),
            'utterance_count':len(set(feedback[i]['event_id'] for i in members)),
            'quotes':[feedback[i] for i in members],
            'evidence_ids':list(dict.fromkeys(feedback[i]['event_id'] for i in members)),
            'mean_text_similarity':round(float(np.mean(pairs)),3) if pairs else None,
            'negative_count':sum(feedback[i]['sentiment'] in ('negative','mixed') for i in members),
            'method':'aspect_grouping+char_tfidf','processing_method':'RULE_BASED'})
    return sorted(clusters,key=lambda c:(-c['negative_count'],-c['count'],c['topic']))


def correlate(events,window=3.0):
    video=[e for e in events if e['source']=='video']
    links=[]
    for e in events:
        if e['event_type']!='utterance':
            continue
        if e['metadata'].get('timing')=='whole_clip_only':
            continue  # A whole-clip transcript cannot support precise alignment.
        start=e['timestamp']
        end=e['metadata'].get('end_timestamp',start)
        candidates=[v for v in video if start-window <= v['timestamp'] <= end+window]
        candidates.sort(key=lambda v:abs(v['timestamp']-start))
        links.append({'utterance_id':e['event_id'],'video_event_ids':[v['event_id'] for v in candidates[:6]],
            'start':start,'end':end,'window_seconds':window,
            'relation':'temporal_context_only','speaker_identity_verified':False})
    return links
