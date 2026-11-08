"""Additive research planning and commercial guards; never creates source evidence."""
from collections import defaultdict
from copy import deepcopy
import re


MODULES = {
    'audience': ('Audience Intelligence', '客群识别、目标用户匹配、任务需求与群体差异'),
    'behavioral': ('Behavioral Intelligence', '行为链路、移动停留、商品操作、任务完成与多人互动'),
    'experience': ('Experience Intelligence', '用户原话、障碍、满意因素、需求期望与体验差异'),
    'diagnostic': ('Diagnostic Intelligence', '关键问题、竞争性解释、多模态交叉验证与不确定性'),
    'commercial': ('Commercial Intelligence', '人货匹配、吸引力、场景、购买意向、商业机会与运营'),
    'decision': ('Decision Intelligence', '优先级、改进方案、成本收益、风险、验证与效果追踪'),
}
METHODS = {
    'JTBD': ('任务|需求|动机|场景|job', '使用情境、期望进展、现用替代方案及原话'),
    'STP': ('客群|细分|目标市场|人货|定位|segment', '经授权的客群属性、需求差异和目标市场匹配资料'),
    'Customer Journey': ('链路|旅程|路径|动线|停留|商品接触|触点|journey', '带时间戳的触点顺序、移动停留记录和体验原话'),
    'ISO 9241-11': ('易用|完成|效率|满意|障碍|舒适|穿戴|束缚|负重|usability', '指定用户、目标与情境中的有效性、效率和满意度指标'),
    'Kano Model': ('kano|魅力|必备|期望属性|功能取舍', '功能具备/不具备的成对问卷及受访者反馈'),
    'A/B Testing': ('a/b|对照|因果|陈列|方案效果', '预注册假设、对照条件、分配规则、指标与停止条件'),
    'Hypothesis-driven Research': ('假设|解释|为什么|原因|验证', '竞争性解释、反证、影响因素与下一轮实验'),
}
CONTEXT_KEYS = ('participant_id', 'segment_id', 'product_id', 'camera_id', 'condition_id',
                'task_id', 'zone_id', 'association_id')
SIGNALS = {
    'PURCHASE_INTENT': r'购买意愿|购买意向|购买需求|愿意购买|想买|purchase intent',
    'SALES_CONVERSION': r'销售转化|购买转化|产生.{0,6}销售|成交|sales conversion',
    'REVISIT': r'复访|再次到访|同一人再次|repeat visit',
    'DISPLAY_CAUSALITY': r'(陈列|display).{0,30}(导致|造成|促使|提升|改变)|(由于|因为).{0,15}陈列',
}


def source_context(metadata):
    raw=metadata.get('research_context',{})
    if not isinstance(raw,dict): raise ValueError('research_context 必须是显式标注的对象。')
    result={}
    for key in CONTEXT_KEYS:
        value=raw.get(key)
        if value is None: continue
        if not isinstance(value,str) or not value.strip() or len(value)>200:
            raise ValueError('研究比较标签必须为 1–200 字的显式文本。')
        result[key]=value
    return result


def comparison_context(index):
    """Only compare explicit labels. Participant/camera/association IDs stay local."""
    dimensions={}
    for dimension,key in [('session','session_id'),('participant','participant_id'),('segment','segment_id'),
                          ('product','product_id'),('camera','camera_id'),('condition','condition_id'),
                          ('task','task_id'),('zone','zone_id')]:
        groups={};missing=[]
        for eid,e in index.items():
            label=e['session_id'] if key=='session_id' else e.get('research_context',{}).get(key)
            if label is None:
                missing.append(eid);continue
            scope=e['session_id'] if dimension in ('participant','camera','task','zone') else None
            group=groups.setdefault((scope,label),{'label':label,'session_scope':scope,'evidence_ids':[],
                                                   'record_count':0,'simulated':False})
            group['evidence_ids'].append(eid);group['record_count']+=1
            group['simulated'] |= e['simulated']
        for group in groups.values():
            group['evidence_ids'].sort(key=lambda eid:(index[eid]['session_id'],index[eid]['timestamp'],eid))
        dimensions[dimension]={'groups':list(groups.values()),'unlabelled_evidence_ids':missing}
    associations=defaultdict(list)
    for eid,e in index.items():
        label=e.get('research_context',{}).get('association_id')
        if label: associations[(e['session_id'],label)].append(eid)
    links=[{'session_id':sid,'association_id':label,'evidence_ids':ids,
            'status':'USER_LABELLED_NOT_IDENTITY_VERIFIED'} for (sid,label),ids in associations.items()
           if len({index[eid].get('research_context',{}).get('camera_id') for eid in ids}
                  - {None})>1]
    return {'dimensions':dimensions,'cross_camera_links':links,'cross_session_identity_linking':False,
            'limitations':['参与者、机位和任务标签限定在各自 Session；相同标签、衣着或外观不建立跨 Session 身份。',
                           '分组数量是记录/标签数量，不是去重消费者人数；未标注资料不猜测归属。',
                           '跨机位关联为人工标注关系，仍需核验时钟、覆盖和身份；不自动合并轨迹。',
                           '不同产品、条件和客群标签可横向比较；标签相同不证明条件受控或存在因果。']}


def select_methods(research):
    question=research['question']
    selected=[name for name,(pattern,_) in METHODS.items() if re.search(pattern,question,re.I)][:3]
    if not selected: selected=['Hypothesis-driven Research']
    return [{'name':name,'rationale':f'针对研究问题“{question}”选择此方法，作为下一轮研究计划。',
             'data_requirements':[METHODS[name][1]],
             'limitations':['方法选择不表示已执行研究；缺少所需数据时不生成分群、Kano 分类、因果或统计结果。'],
             'status':'PLANNED'} for name in selected]


def supports_signal(signal,e):
    """Require source records of intent/transactions/controls, not attention proxies."""
    commerce=e.get('commercial_evidence',{})
    if signal=='PURCHASE_INTENT':
        if e['source'] not in ('audio','manual'): return False
        return e['event_type'] in ('utterance','purchase_intent') and bool(re.search(
            r'我.{0,8}(想|打算|愿意|决定|不想|不会|不愿).{0,8}(购买|买|下单)|'
            r'\bI (want to|will|would like to|intend to|do not want to) (buy|purchase)\b',
            e.get('raw_text') or e['description'],re.I))
    if signal=='SALES_CONVERSION':
        return (e['source']=='manual' and e['event_type']=='transaction'
                and bool(commerce.get('transaction_id')) and commerce.get('status')=='completed')
    if signal=='DISPLAY_CAUSALITY':
        return (e['source']=='manual' and e['event_type']=='controlled_experiment'
                and commerce.get('status')=='completed'
                and all(commerce.get(k) for k in ('experiment_id','control','treatment','outcome'))
                and commerce.get('control')!=commerce.get('treatment'))
    # No trusted, consent-aware identity verifier is connected in this application.
    if signal=='REVISIT': return False
    return False


def finding(key,n,topic,statement,refs,classification='INFERENCE',signal='NONE',direct=None):
    return {'finding_id':f'{key}-{n}','topic':topic,'statement':statement,'classification':classification,
            'evidence_ids':refs,'evidence_strength':'NONE' if classification=='INSUFFICIENT_EVIDENCE' else 'LIMITED',
            'limitations':['记录与解释均待研究员复核；模拟资料仅用于软件演示，不能代表真实消费者结论。'],
            'commercial_signal':signal,'direct_evidence_ids':direct or []}


def extend_analysis(analysis,index,research):
    """Transparent 1.1 baseline for RULE_BASED/MOCK only, never an LLM fallback."""
    modules={key:{'findings':[finding(key,0,coverage,'当前资料不足以完整回答：'+coverage,[],
                                     'INSUFFICIENT_EVIDENCE')],
                  'data_gaps':['补充与研究问题匹配、经授权且可追溯的原始记录；以下解释均待验证。']}
             for key,(_,coverage) in MODULES.items()}
    labelled=[eid for eid,e in index.items() if any(k in e.get('research_context',{}) for k in ('participant_id','segment_id'))]
    if labelled:
        modules['audience']['findings'].append(finding('audience',1,'显式参与者/客群标签',
            '可按各 Session 内的参与者与客群标注比较；标签不是身份验证，也不能由外观推断目标客群。',labelled[:100]))
    for key,records in [('behavioral',[e for e in index.values() if e['event_type']!='utterance']),
                        ('experience',[e for e in index.values() if e['event_type']=='utterance'])]:
        modules[key]['findings'] += [finding(key,n+1,'原始记录',e['raw_text'] or e['description'],
                                            [e['event_id']],'FACT') for n,e in enumerate(records[:4])]
    diagnoses=analysis['diagnoses']
    if diagnoses:
        modules['diagnostic']['findings']=[finding('diagnostic',n,d['title'],d['explanation'],d['evidence_ids'],d['classification'])
                                           for n,d in enumerate(diagnoses)]
        modules['diagnostic']['data_gaps']=list(dict.fromkeys(v for d in diagnoses for v in d['missing_evidence']))[:10]
    for n,(signal,label) in enumerate([('PURCHASE_INTENT','直接购买意向'),('SALES_CONVERSION','交易与销售转化'),
                                      ('REVISIT','身份核验与复访'),('DISPLAY_CAUSALITY','陈列与行为因果')],1):
        direct=[eid for eid,e in index.items() if supports_signal(signal,e)][:100]
        statement=(f'存在{label}的原始记录，仅支持按记录范围复核，不外推总体或归因。' if direct
                   else f'缺少{label}的合格直接证据，当前不能确认。')
        modules['commercial']['findings'].append(finding('commercial',n,label,statement,direct,
            'INFERENCE' if direct else 'INSUFFICIENT_EVIDENCE',signal,direct))
    for n,o in enumerate(analysis['options'][:3],5):
        modules['commercial']['findings'].append(finding('commercial',n,'待验证商业/运营机会',
            '仅作为待验证的资源投入选项：'+o['change'],o['evidence_ids']))
    d=analysis['decision']
    modules['decision']['findings']=[finding('decision',0,'当前资源与验证决定',d['recommendation'],
                                            d['evidence_ids'],d['classification'])]
    follow_up=[e for e in index.values() if e['source']=='manual' and e['event_type']=='decision_follow_up']
    modules['decision']['findings'] += [finding('decision',n+1,'决策后原始测量（待复核）',e['description'],
                                               [e['event_id']],'FACT') for n,e in enumerate(follow_up[:7])]
    cards=[]
    for o in analysis['options']:
        linked=[e for e in analysis['experiments'] if o['option_id'] in e['option_ids']]
        alternatives=list(dict.fromkeys(v for d in diagnoses if d['diagnosis_id'] in o['diagnosis_ids']
                                        for v in d['alternative_explanations']))[:8]
        impact,urgency,effort={'P1':(4,5,2),'P2':(3,3,3),'P3':(2,1,4)}[o['priority']]
        cards.append({'option_id':o['option_id'],'decision_question':'是否投入下一轮验证：'+o['title'],
            'evidence_ids':o['evidence_ids'],'evidence_strength':'LIMITED','alternative_explanations':alternatives,
            'target_audience':research.get('target_audience') or '尚未定义目标用户；招募前需确认，不能从衣着或外观推断。',
            'expected_impact':'待验证：'+o['change']+'；尚无实际改善、收入或投资回报测量。',
            'cost_estimate':'待估算：研究工时、招募/样件/运营投入；当前没有成本与收益金额依据。',
            'risks':o['tradeoffs'],'priority':o['priority'],'impact':impact,'urgency':urgency,'effort':effort,
            'priority_score':impact+urgency+6-effort,
            'scoring_basis':'规则基线沿用选项的研究优先级映射初始评分；分数=影响+紧迫性+(6−投入)，'
                            '各项 1–5 分；≥12 为 P1，8–11 为 P2，否则 P3。全部为待校准估计，不是已测商业价值。',
            'experiment_ids':[e['experiment_id'] for e in linked],
            'success_metrics':list(dict.fromkeys(e['success_criterion'] for e in linked))[:10],
            'decision_owner':research.get('decision_owner') or 'UNASSIGNED · 待指定决策负责人',
            'follow_up_plan':'实验前记录基线、指标与停止条件；完成后由决策负责人按相同指标复测，保留不良影响和原始证据，安排复盘。',
            'tracking_status':'PLANNED','classification':'INFERENCE'})
    return {**analysis,'intelligence':modules,'research_methods':select_methods(research),'decision_cards':cards}


def analysis_items(analysis):
    items=[*analysis['claims'],*analysis['diagnoses'],*analysis['options'],*analysis['experiments'],analysis['decision']]
    if 'intelligence' in analysis:
        items += [f for module in analysis['intelligence'].values() for f in module['findings']]
        items += analysis['decision_cards']
    return items


def normalize_model_priorities(raw):
    """Derive redundant model scores without changing evidence or research content.

    This is not evidence validation or semantic repair. The caller must still
    pass the returned analysis through the existing full validation pipeline.
    """
    from analysis.decision_schema import DecisionAnalysisV11

    validated=DecisionAnalysisV11.model_validate(raw)
    option_ids=[option.option_id for option in validated.options]
    card_ids=[card.option_id for card in validated.decision_cards]
    if (len(option_ids)!=len(set(option_ids)) or len(card_ids)!=len(set(card_ids))
            or len(card_ids)!=len(option_ids) or set(card_ids)!=set(option_ids)):
        raise ValueError('Every product option must have exactly one uniquely linked decision card.')
    normalized=deepcopy(raw)
    options={option['option_id']:(i,option) for i,option in enumerate(normalized['options'])}
    changes=[]
    for i,(validated_card,card) in enumerate(zip(validated.decision_cards,normalized['decision_cards'])):
        option_index,option=options[validated_card.option_id]
        score=validated_card.impact+validated_card.urgency+6-validated_card.effort
        priority='P1' if score>=12 else 'P2' if score>=8 else 'P3'
        for item,key,value,path in (
                (card,'priority_score',score,f'decision_cards[{i}].priority_score'),
                (card,'priority',priority,f'decision_cards[{i}].priority'),
                (option,'priority',priority,f'options[{option_index}].priority')):
            if item[key]!=value:
                changes.append({'option_id':validated_card.option_id,'field':path,
                                'old':item[key],'new':value})
                item[key]=value
    return normalized,changes


def validate_intelligence(analysis,index,research=None):
    findings=[f for m in analysis.get('intelligence',{}).values() for f in m['findings']]
    ids=[f['finding_id'] for f in findings]+[c['claim_id'] for c in analysis['claims']]
    ids += [d['diagnosis_id'] for d in analysis['diagnoses']]+[o['option_id'] for o in analysis['options']]
    ids += [e['experiment_id'] for e in analysis['experiments']]
    if len(ids)!=len(set(ids)): raise ValueError('研究模块与原有分析 ID 必须唯一。')
    for f in findings:
        direct=f['direct_evidence_ids']
        if len(direct)!=len(set(direct)) or not set(direct)<=set(f['evidence_ids']):
            raise ValueError('商业直接证据必须是当前发现所引原始证据的子集。')
        if f['classification']=='INSUFFICIENT_EVIDENCE':
            if f['evidence_strength']!='NONE': raise ValueError('证据不足的发现不能声明证据强度。')
            continue
        if f['evidence_strength']=='NONE': raise ValueError('事实与推断必须标注证据强度及限制。')
        if f['evidence_strength']=='CORROBORATED':
            records=[index[eid] for eid in f['evidence_ids']]
            if any(e['simulated'] for e in records) or len({e['source'] for e in records})<2:
                raise ValueError('模拟资料或单一来源不能声明多模态交叉印证。')
        signal=f['commercial_signal']
        if signal!='NONE' and (not direct or not all(supports_signal(signal,index[eid]) for eid in direct)):
            raise ValueError('商业结论缺少合格直接证据；观看、停留、触摸不能替代意向、交易、身份或对照证据。')
    # Also guard legacy narrative fields, so moving a claim outside the commercial module does not bypass the gate.
    narratives=[(c['statement'],c['classification'],c['evidence_ids']) for c in analysis['claims']]
    narratives += [(d['explanation'],d['classification'],d['evidence_ids']) for d in analysis['diagnoses']]
    narratives += [(o['change'],o['classification'],o['evidence_ids']) for o in analysis['options']]
    narratives += [(f['statement'],f['classification'],f['evidence_ids']) for f in findings]
    narratives += [(c[field],c['classification'],c['evidence_ids']) for c in analysis.get('decision_cards',[])
                   for field in ('expected_impact','cost_estimate','scoring_basis')]
    narratives.append((analysis['summary'],'INFERENCE',list(index)))
    decision=analysis['decision'];narratives.append((decision['recommendation'],decision['classification'],decision['evidence_ids']))
    for text,classification,refs in narratives:
        if classification!='INFERENCE': continue
        for sentence in re.split(r'[。；;，,\n]',text):
            if re.search(r'不能|不足以|不代表|不等于|缺少|尚无|不得|待验证|仅作为待验证',sentence): continue
            for signal,pattern in SIGNALS.items():
                if re.search(pattern,sentence,re.I) and not any(supports_signal(signal,index[eid]) for eid in refs):
                    raise ValueError('商业叙述必须引用直接意向、交易或对照记录；复访身份尚无可靠验证入口。')
    if 'intelligence' not in analysis: return
    names=[m['name'] for m in analysis['research_methods']]
    if len(names)!=len(set(names)): raise ValueError('研究方法不能重复或机械堆叠。')
    cards=analysis['decision_cards'];options={o['option_id']:o for o in analysis['options']}
    if len(cards)!=len(options) or {c['option_id'] for c in cards}!=set(options):
        raise ValueError('每个产品改进选项必须恰好有一张决策卡。')
    experiments={e['experiment_id']:e for e in analysis['experiments']}
    for c in cards:
        option=options[c['option_id']]
        if c['evidence_strength']=='CORROBORATED':
            records=[index[eid] for eid in c['evidence_ids']]
            if any(e['simulated'] for e in records) or len({e['source'] for e in records})<2:
                raise ValueError('模拟资料或单一来源不能声明决策卡已获多模态交叉印证。')
        score=c['impact']+c['urgency']+6-c['effort']
        priority='P1' if score>=12 else 'P2' if score>=8 else 'P3'
        if c['priority_score']!=score or c['priority']!=priority or c['priority']!=option['priority']:
            raise ValueError('决策卡评分、优先级及关联选项必须一致。')
        if not set(option['evidence_ids'])<=set(c['evidence_ids']): raise ValueError('决策卡不能丢失选项的支持证据。')
        if len(c['experiment_ids'])!=len(set(c['experiment_ids'])) or not all(
            eid in experiments and c['option_id'] in experiments[eid]['option_ids'] for eid in c['experiment_ids']):
            raise ValueError('决策卡必须关联验证当前选项的有效实验。')
        if research is not None:
            owner=research.get('decision_owner') or 'UNASSIGNED · 待指定决策负责人'
            if c['decision_owner']!=owner: raise ValueError('决策负责人必须来自研究设置；未分配时不得编造。')
