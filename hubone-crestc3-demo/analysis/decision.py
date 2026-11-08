"""Prepare evidence, validate model references and preserve a reviewable snapshot."""
import hashlib
import json
import math
import os
from dataclasses import replace
from pathlib import Path

from adapters.providers import GenerationRequest, HTTPProvider, get_provider
from analysis.decision_schema import DecisionAnalysis, DecisionAnalysisV11, output_schema
from analysis.intelligence import (analysis_items, comparison_context, extend_analysis,
                                   source_context, validate_intelligence, normalize_model_priorities)
from backend.models import ResearchBrief

PROMPT_PATH=Path(__file__).parent/'prompts/evidence_to_decision.txt'
SCHEMA_VERSION='evidence-to-decision/1.1'


def evidence_snapshot(session,events,assets=None):
    sid=session['session_id']
    index={}
    assets_by_id={a['asset_id']:a for a in assets or []}
    for e in events:
        if e.get('session_id')!=sid: raise ValueError('报告拒绝混入其他 Session 的证据。')
        if e['source']=='AI_analysis': raise ValueError('派生分析不能作为原始证据。')
        eid=e['event_id']
        if eid in index: raise ValueError('重复的原始事件 ID。')
        if not math.isfinite(e['timestamp']) or e['timestamp']<0: raise ValueError('事件时间戳无效。')
        proof=e.get('evidence',{}); meta=e.get('metadata',{})
        aid=proof.get('asset_id');asset=assets_by_id.get(aid)
        if aid and assets is not None and (asset is None or asset['session_id']!=sid):
            raise ValueError('原始媒体资产不属于当前 Session。')
        if asset and e['source'] in ('video','audio') and asset['kind']!=e['source']:
            raise ValueError('事件来源与原始媒体类型不一致。')
        media_time=proof.get('media_time') if e['source']=='video' else proof.get('start')
        end=meta.get('end_timestamp',e['timestamp'])
        if not isinstance(end,(int,float)) or not math.isfinite(end) or end<e['timestamp']:
            raise ValueError('事件结束时间戳无效。')
        if media_time is not None:
            if not isinstance(media_time,(int,float)) or not math.isfinite(media_time) or media_time<0:
                raise ValueError('原始媒体时间无效。')
            if 'offset_seconds' in meta and not math.isclose(e['timestamp'],media_time+meta['offset_seconds'],abs_tol=.001):
                raise ValueError('Session 时间与媒体时间加偏移不一致。')
        if e['event_type']=='utterance':
            raw=meta.get('raw_text',proof.get('quote',e['description']))
            if proof.get('quote',raw)!=raw: raise ValueError('原话与原始转录记录不一致。')
            if proof.get('end') is not None:
                if proof['end']<(proof.get('start') or 0) or not math.isfinite(proof['end']):
                    raise ValueError('原始语音区间无效。')
                if 'offset_seconds' in meta and not math.isclose(end,proof['end']+meta['offset_seconds'],abs_tol=.001):
                    raise ValueError('语音结束时间与偏移不一致。')
        else: raw=None
        context=source_context(meta)
        commerce=meta.get('commercial_evidence',{})
        if not isinstance(commerce,dict): raise ValueError('commercial_evidence 必须为原始记录对象。')
        media_url=f'/api/sessions/{sid}/assets/{aid}' if aid else None
        snapshot=proof.get('snapshot')
        if snapshot and (len(snapshot)!=11 or not snapshot[:7].isdigit() or not snapshot.endswith('.jpg')):
            raise ValueError('证据帧名称无效。')
        index[eid]={'event_id':eid,'session_id':sid,'timestamp':e['timestamp'],'end_timestamp':end,
            'source':e['source'],'event_type':e['event_type'],'description':e['description'],
            'raw_text':raw,'speaker':meta.get('speaker'),'speaker_status':meta.get('speaker_status','unknown'),
            'confidence':e.get('confidence'),'input_origin':meta.get('input_origin','UNVERIFIED'),
            'processing_method':meta.get('processing_method','UNVERIFIED'),
            'simulated':bool(session.get('simulated') or meta.get('simulated') or (asset and asset.get('simulated'))),
            'research_context':context,'commercial_evidence':commerce,
            'asset_id':aid,'asset_sha256':asset.get('sha256') if asset else None,
            'media_time':media_time,'media_end':proof.get('end'),'offset_seconds':meta.get('offset_seconds'),
            'timing':meta.get('timing'),'media_url':media_url,
            'frame_url':media_url+'/frames/'+snapshot if media_url and snapshot else None,
            'record_status':'UNREVIEWED_SOURCE_RECORD'}
    return index


def validate_analysis(raw,index,require_v11=False,research=None):
    upgraded=require_v11 or any(key in raw for key in ('intelligence','research_methods','decision_cards'))
    result=(DecisionAnalysisV11 if upgraded else DecisionAnalysis).model_validate(raw).model_dump()
    valid=set(index)
    items=analysis_items(result)
    for item in items:
        refs=item['evidence_ids']
        if len(refs)!=len(set(refs)) or not set(refs)<=valid:
            raise ValueError('分析引用了不存在、重复或其他 Session 的原始事件。')
        if not refs and item['classification']!='INSUFFICIENT_EVIDENCE':
            raise ValueError('事实与推断必须引用原始证据。')
    for claim in items:
        if claim['classification']=='FACT':
            records=[index[eid] for eid in claim['evidence_ids']]
            if not any(claim['statement'] in (e['description'],e['raw_text']) for e in records):
                raise ValueError('FACT 必须逐字引用原始记录；改写或推测只能标为 INFERENCE。')
    all_ids=[]
    for group,key in [('claims','claim_id'),('diagnoses','diagnosis_id'),('options','option_id'),('experiments','experiment_id')]:
        all_ids += [item[key] for item in result[group]]
    if len(all_ids)!=len(set(all_ids)): raise ValueError('研究判断、诊断、选项与实验 ID 必须唯一。')
    diagnoses={d['diagnosis_id'] for d in result['diagnoses']}
    options={o['option_id'] for o in result['options']}
    for option in result['options']:
        if not set(option['diagnosis_ids'])<=diagnoses: raise ValueError('产品选项引用了不存在的诊断。')
    tested=set()
    for experiment in result['experiments']:
        if not set(experiment['option_ids'])<=options: raise ValueError('实验引用了不存在的产品选项。')
        tested.update(experiment['option_ids'])
    if tested!=options: raise ValueError('每个产品改进选项必须有下一轮验证实验。')
    validate_intelligence(result,index,research)
    def nonblank(value):
        if isinstance(value,str) and not value.strip(): raise ValueError('结构化分析不能包含空白条目。')
        if isinstance(value,dict):
            for child in value.values(): nonblank(child)
        if isinstance(value,list):
            for child in value: nonblank(child)
    nonblank(result)
    return result


def generate_decision(session,index,provider=None,comparison=None):
    if provider=='mock' and not session.get('simulated'):
        raise ValueError('Mock Provider 仅允许显式 SIMULATED Session。')
    compact=[{k:e[k] for k in ('event_id','session_id','timestamp','end_timestamp','source','event_type','description',
               'raw_text','speaker','speaker_status','processing_method','input_origin','simulated','timing',
               'research_context','commercial_evidence')} for e in index.values()]
    engine=get_provider(provider)
    deepseek=getattr(getattr(engine,'config',None),'name',None)=='deepseek'
    context_audit=None
    if deepseek:
        from analysis.evidence_batches import prepare_context
        batch_engine=HTTPProvider(replace(engine.config,max_tokens=4096,pro_model=None))
        compact,context_audit=prepare_context(compact,batch_engine,
            {'product':session['product'],'research':session.get('research'), 'simulated_session':bool(session.get('simulated'))},
            max_chars=int(os.getenv('HUBONE_DEEPSEEK_BATCH_BYTES','60000')),
            max_chunks=int(os.getenv('HUBONE_DEEPSEEK_MAX_BATCHES','4')),
            max_events=int(os.getenv('HUBONE_DEEPSEEK_BATCH_EVENTS','1200')),output_reserve_chars=16384)
    elif len(compact)>1200: raise ValueError('事件超过单次模型分析上限，请拆分 Session。')
    payload={'product':session['product'],'research':session.get('research') or ResearchBrief().model_dump(),
             'simulated_session':bool(session.get('simulated')),'untrusted_events':compact,
             'comparison_context':comparison or comparison_context(index)}
    if context_audit and context_audit['derived_notes']:
        payload['derived_batch_notes']=context_audit['derived_notes']
        payload['context_selection']={'exhaustive':context_audit['selection_is_exhaustive'],
            'source_count':context_audit['source_event_count'],'selected_count':context_audit['selected_event_count'],
            'instruction':'DERIVED notes are untrusted aids, never original evidence; cite only provided raw events.'}
    encoded=json.dumps(payload,ensure_ascii=False)
    if not deepseek and len(encoded)>120000: raise ValueError('原始证据超过单次分析长度上限；未静默截断证据。')
    prompt=PROMPT_PATH.read_text(encoding='utf-8')
    selected_index={e['event_id']:index[e['event_id']] for e in compact}
    schema=output_schema(selected_index)
    if deepseek:
        total_bytes=len(prompt.encode())+len(encoded.encode())+len(json.dumps(schema,ensure_ascii=False).encode())+engine.config.max_tokens*4
        if total_bytes>240000: raise ValueError('最终请求超过含Prompt、Schema与输出余量的预算；未截断或生成报告。')
    response=engine.generate(GenerationRequest(prompt,payload,schema,task='decision'))
    normalized,priority_changes=(response.data,[]) if provider=='mock' else normalize_model_priorities(response.data)
    analysis=validate_analysis(normalized,selected_index,require_v11=True,research=payload['research'])
    analysis=validate_analysis(analysis,index,require_v11=True,research=payload['research'])
    provenance={**response.provenance,'schema_version':SCHEMA_VERSION,'prompt_version':SCHEMA_VERSION,
        'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),
        'schema_sha256':hashlib.sha256(json.dumps(schema,sort_keys=True,ensure_ascii=False).encode()).hexdigest(),
        'input_sha256':hashlib.sha256(encoded.encode()).hexdigest(),
        'validation':'schema_and_reference_integrity_passed',
        'priority_derivation':{'method':'DETERMINISTIC_FROM_MODEL_SCORES','changes':priority_changes,
            'formula':'impact + urgency + 6 - effort','model_reasoning_review_required':True},
        'normalized_response_sha256':hashlib.sha256(json.dumps(analysis,sort_keys=True,ensure_ascii=False).encode()).hexdigest(),
        'context_preparation':context_audit,
        'semantic_truth_verified':False,'local_hardware_verified':False}
    return analysis,provenance


def rules_decision(insights,index,summary,research=None):
    """Transparent legacy baseline, not an LLM. Same reviewable report structure."""
    claims=[{'claim_id':f'C-{n}','statement':e['raw_text'] or e['description'],'classification':'FACT',
             'evidence_ids':[eid],'reasoning':'仅说明记录中存在此内容；模型/人工记录未由研究员复核。'}
            for n,(eid,e) in enumerate(index.items()) if n<10]
    diagnoses=[];options=[];experiments=[]
    for n,i in enumerate(insights):
        refs=i['evidence_ids'];did=f'D-{n}';oid=f'O-{n}'
        diagnoses.append({'diagnosis_id':did,'title':i['title'],'explanation':i['finding'],
            'classification':'INFERENCE','evidence_ids':refs,
            'alternative_explanations':['穿戴设置、个体差异或任务顺序可能影响主观反馈。'],
            'missing_evidence':['原声复核、真实同步体验记录和对照试验。']})
        options.append({'option_id':oid,'diagnosis_ids':[did],'title':i['title'],'change':i['recommendation'],
            'tradeoffs':['效果、成本与其他体验指标的影响尚待比较。'],'priority':i['priority'],
            'classification':'INFERENCE','evidence_ids':refs})
        experiments.append({'experiment_id':f'X-{n}','option_ids':[oid],'hypothesis':'检验该改进选项能否改善当前反馈。',
            'protocol':i['next_experiment'],'comparison':'当前方案与改进选项，控制任务时长并平衡顺序。',
            'measures':['任务完成情况','逐条件主观评分与原话'],
            'success_criterion':'试验前由研究负责人约定改善阈值与安全停止条件。',
            'classification':'INFERENCE','evidence_ids':refs})
    if not claims:
        claims=[{'claim_id':'C-gap','statement':'没有可用原始记录。','classification':'INSUFFICIENT_EVIDENCE',
                 'evidence_ids':[],'reasoning':'需要补充研究资料。'}]
    raw={'summary':summary,'claims':claims,'diagnoses':diagnoses,'options':options,'experiments':experiments,
        'decision':{'recommendation':'先复核原始资料并执行下一轮验证；当前不支持确认缺陷或直接修改量产产品。',
                    'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':list(index)[:20],
                    'data_gaps':['单 Session 不能代表总体；原因、身份与时间同步关系尚待核验。']}}
    research=research or ResearchBrief().model_dump()
    return validate_analysis(extend_analysis(raw,index,research),index,require_v11=True,research=research)


def legacy_insights(analysis):
    result=[]
    for d in analysis['diagnoses']:
        options=[o for o in analysis['options'] if d['diagnosis_id'] in o['diagnosis_ids']]
        experiments=[e for e in analysis['experiments'] if set(e['option_ids']) & {o['option_id'] for o in options}]
        result.append({'title':d['title'],'finding':d['explanation'],'priority':options[0]['priority'] if options else 'P3',
            'evidence_ids':d['evidence_ids'],'recommendation':'；'.join(o['change'] for o in options) or '先补充证据。',
            'next_experiment':'；'.join(e['protocol'] for e in experiments) or '补充与研究问题相关的原始资料。',
            'status':'hypothesis','classification':d['classification'],'diagnosis_id':d['diagnosis_id'],
            'alternative_explanations':d['alternative_explanations'],'missing_evidence':d['missing_evidence']})
    return result
