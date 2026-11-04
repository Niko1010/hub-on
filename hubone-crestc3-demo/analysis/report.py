from datetime import datetime,timezone
import hashlib
import json

from analysis.feedback import analyze_feedback,correlate,SUGGESTIONS
from analysis.decision import evidence_snapshot, generate_decision, legacy_insights, rules_decision
from backend.models import ResearchBrief
from backend.provenance import labels


def build_report(session,events,provider='rules',assets=None):
    if any(e.get('session_id') != session['session_id'] for e in events):
        raise ValueError('报告拒绝混入其他 Session 的证据。')
    evidence_index=evidence_snapshot(session,events,assets)
    facts=analyze_feedback(events)
    correlations=correlate(events)
    if provider in ('llm','mock'):
        decision,generation=generate_decision(session,evidence_index,'mock' if provider=='mock' else None)
        summary=decision['summary']
        insights=legacy_insights(decision)
        method=generation['processing_method']
        engine=f"{method} / {generation['provider']} / {generation['model']}"
        if method=='MOCK': engine+=' · 软件流程测试，未调用 LLM'
    else:
        if provider!='rules': raise ValueError('未知分析方式。')
        method='RULE_BASED'
        engine='RULE_BASED · 离线规则基线（未调用大模型）'
        summary=f"本 Session 包含 {facts['utterance_count']} 条原话、{len(events)} 条事件。以下关注点按产品主题规则归类；不推断总体消费者比例。"
        insights=[]
        for c in facts['clusters']:
            recommendation,experiment=SUGGESTIONS[c['topic']]
            insights.append({'title':c['topic'],
                'finding':f"该主题有 {c['count']} 个反馈分句，来自 {c['utterance_count']} 条原话；其中 {c['negative_count']} 个分句被规则标为负面或混合。应回听复核。",
                'priority':'P1' if c['negative_count']>=2 else 'P2' if c['negative_count'] else 'P3',
                'evidence_ids':c['evidence_ids'],'recommendation':recommendation,
                'next_experiment':experiment,'status':'hypothesis'})
        decision=rules_decision(insights,evidence_index,summary)
        generation={'provider':'rules','model':None,'processing_method':'RULE_BASED','model_inference_executed':False,
                    'schema_version':'evidence-to-decision/1.0','validation':'schema_and_reference_integrity_passed',
                    'semantic_truth_verified':False,'local_hardware_verified':False}
    simulated=session['simulated'] or any(e['metadata'].get('simulated') for e in events)
    evidence={e['event_id']:e for e in events}
    for insight in insights:
        if not insight['evidence_ids'] or not set(insight['evidence_ids']) <= evidence.keys():
            raise ValueError('产品洞察存在无法追溯的证据引用。')
        if any(evidence[i]['source']=='AI_analysis' for i in insight['evidence_ids']):
            raise ValueError('派生洞察不能用另一项派生洞察充当原始证据。')
        insight.update(labels(simulated,method,'EVIDENCE_DERIVED'))
    report={'session':session,'generated_at':datetime.now(timezone.utc).isoformat(),
        'engine':engine,'simulated':simulated,'summary':summary,**facts,
        **labels(simulated,method,'EVIDENCE_DERIVED'),
        'report_type':'Evidence-to-Decision','report_schema_version':'1.0',
        'research':session.get('research') or ResearchBrief().model_dump(),
        'decision_analysis':decision,'generation':generation,'evidence_index':evidence_index,
        'observations':[e for e in evidence_index.values() if e['event_type']!='utterance'],
        'quotes':[e for e in evidence_index.values() if e['event_type']=='utterance'],
        'feedback_processing_method':'RULE_BASED',
        'input_origins':sorted({e['metadata'].get('input_origin','UNVERIFIED') for e in events}),
        'correlations':correlations,'insights':insights,
        'journey':[{'event_id':e['event_id'],'timestamp':e['timestamp'],'source':e['source'],
                    'description':e['description']} for e in events if e['event_type']!='utterance'],
        'user_needs':[{'category':c['topic'],'evidence_ids':c['evidence_ids']} for c in facts['clusters']],
        'evidence':evidence,
        'event_snapshot_sha256':hashlib.sha256(json.dumps(events,sort_keys=True,ensure_ascii=False).encode()).hexdigest(),
        'limitations':['本次为单 Session 研究，不代表消费者总体。',
            '情感与主题规则仅供预筛选，否定、反讽和跨句语境可能误判。',
            '画面人体轨迹与说话人标签没有身份绑定；时间关联不是因果证据。',
            '穿戴、腰带调整、上坡仅在人工标注时出现，未声称模型识别。',
            '产品修改建议、优先级与验证实验均为待验证假设。']}
    if simulated:
        report['limitations'].insert(0,'SIMULATED：包含预设演示资料，不能作为真实消费者研究结论。')
    if method=='MOCK':
        report['limitations'].insert(0,'MOCK：固定软件测试输出，未执行 Ollama、云端 LLM 或本地硬件推理。')
    relationship=report['research']['recording_relationship']
    report['limitations'].append({'unknown':'音视频原始同步关系未知；同 Session 不代表同人或同次采集。',
        'independent':'音视频为独立采集，只能测试时间换算和容器关联，不能解释为同步体验。',
        'same_capture':'同次采集由用户声明，仍需研究员核验时钟、偏移和人物身份。'}[relationship])
    if 'REAL_RECORDING_REFERENCE' in report['input_origins']:
        report['limitations'].append('公开参考录像/语音并非 Crest C3 实测；不得据此确诊产品问题。')
    report['limitations'].append('Schema 与证据 ID 校验只保证结构和引用完整性，不验证模型语义正确、因果关系或研究结论。')
    report['markdown']=render_markdown(report)
    return report


def safe(text):
    return str(text).replace('\n',' ').replace('[','\\[').replace(']','\\]').replace('<','&lt;').replace('>','&gt;')


def tc(t):
    return f'{int(t)//60:02d}:{t%60:04.1f}'


def render_markdown(r):
    if r.get('decision_analysis'):
        from analysis.decision_render import render_decision_markdown
        return render_decision_markdown(r)
    lines=['# HUB ONE × CREST C3 消费者体验研究报告','',
        f"资料标签：{'SIMULATED — 演示资料' if r['simulated'] else '用户输入 / 模型观测，尚未经研究员复核'}",
        f"Session：{r['session']['session_id']}",f"产品：{safe(r['session']['product'])}",
        f"生成时间（UTC）：{r['generated_at']}",f"分析引擎：{r['engine']}",'',
        f"来源分层：输入 {' / '.join(r['input_origins'])}；洞察 {r['processing_method']}；反馈预分类 RULE_BASED。",'',
        '## 1. 体验过程与研究范围',r['summary'],'']
    for j in r['journey']:
        lines.append(f"- {tc(j['timestamp'])} · {j['source']} · {safe(j['description'])} `[E:{j['event_id']}]`")
    lines+=['','## 2. 用户关注点与需求分类']
    for c in r['clusters']:
        lines.append(f"- {safe(c['topic'])}：{c['count']} 个分句 / {c['utterance_count']} 条原话（不是人数）。")
    lines+=['','## 3. 高频关键词','、'.join(f"{k['word']}（{k['count']} 条原话）" for k in r['keywords']) or '暂无关键词。']
    for title,sentiments in [('4. 正面反馈',('positive',)),('5. 负面与混合反馈',('negative','mixed'))]:
        lines+=['','## '+title]
        selected=[f for f in r['feedback'] if f['sentiment'] in sentiments]
        lines += [f"- {tc(f['timestamp'])}「{safe(f['text'])}」`[E:{f['event_id']}]`" for f in selected] or ['暂无。']
    lines+=['','## 6. 使用障碍与反复痛点']
    for c in r['clusters']:
        if c['negative_count']:
            lines.append(f"- {safe(c['topic'])}：{c['negative_count']} 个负面/混合分句。重复描述不等于多个消费者。")
    lines+=['','## 7. 多模态时间关联','以下仅说明时间邻近，不能确认身份或因果。']
    for link in r['correlations']:
        lines.append(f"- 原话 `[E:{link['utterance_id']}]`，{tc(link['start'])}–{tc(link['end'])}，邻近视频事件："+
                     (', '.join(f'`[E:{i}]`' for i in link['video_event_ids']) or '无'))
    lines+=['','## 8. 产品改进假设与优先级']
    for i in r['insights']:
        lines += [f"### {i['priority']} · {safe(i['title'])}（待验证）",safe(i['finding']),
            '建议：'+safe(i['recommendation']), '证据：'+', '.join(f'`[E:{x}]`' for x in i['evidence_ids']),'']
    lines+=['## 9. 下一轮验证实验']
    lines += [f"- {safe(i['title'])}：{safe(i['next_experiment'])}" for i in r['insights']] or ['需要更多体验资料。']
    lines+=['','## 10. 限制、证据索引与原话']
    lines += ['- '+s for s in r['limitations']]
    for eid,e in r['evidence'].items():
        if e['event_type']=='utterance':
            lines.append(f"- `[E:{eid}]` {tc(e['timestamp'])} · {e['source']} · 原文：「{safe(e['metadata'].get('raw_text',e['description']))}」")
    lines+=['',f"事件快照 SHA-256：`{r['event_snapshot_sha256']}`",'']
    return '\n'.join(lines)
