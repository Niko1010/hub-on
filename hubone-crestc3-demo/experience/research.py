"""Evidence-gated four-role research workflow; existing decision validation reused."""
import json
from collections import Counter

from analysis.decision import evidence_snapshot, rules_decision, generate_decision
from analysis.feedback import analyze_feedback, correlate, SUGGESTIONS
from backend.models import ResearchBrief
from experience.core import evidence_index, framework, digest, utc, load_source
from experience.acl import is_acl

def behavior_sources(store,records,sid):
    latest={}
    for run in records.list(sid,'behavior_run'):
        key=json.dumps({k:run['source_ref'].get(k) for k in ('kind','asset_id')},sort_keys=True)
        latest[key]=run
    states=[]
    for key,run in latest.items():
        try:
            current=load_source(store,sid,run['source_ref'])['fingerprint']
            status='CURRENT' if current==run['source_fingerprint'] else 'SOURCE_CHANGED'
        except (KeyError,ValueError,FileNotFoundError): current=None;status='SOURCE_UNAVAILABLE'
        states.append({'record_id':run['record_id'],'status':status,'current_fingerprint':current,
            'frozen_fingerprint':run['source_fingerprint'],'run':run})
    return states

def current_research_fingerprint(store,records,sid):
    value={'research':store.session(sid).get('research'),'events':store.events(sid),'assets':store.assets(sid),'context':records.context(sid),
        'business':records.list(sid,'business_input'),'annotations':records.list(sid,'annotation'),
        'behavior_runs':[{k:v for k,v in state.items() if k!='run'} for state in behavior_sources(store,records,sid)],
        'audio_runs':records.list(sid,'audio_run')}
    if is_acl(store.session(sid)):
        try:source=load_source(store,sid,{'kind':'live'})['fingerprint']
        except (KeyError,ValueError):source=None
        value['acl']={'source':source,'stages':records.list(sid,'acl_stage'),'feedback':records.list(sid,'acl_feedback'),
            'feedback_links':records.list(sid,'acl_feedback_link'),
            'visual_timeline':{kind:records.list(sid,kind) for kind in
                ('acl_timeline_import','acl_timeline_review','acl_timeline_feedback_link')},
            'behavior_runs':[{'record_id':r['record_id'],'source_fingerprint':r['source_fingerprint']} for r in records.list(sid,'acl_behavior_run')]}
    return digest(value)


def require_llm_authorization(session,context):
    from adapters.providers import ProviderConfig,is_loopback
    from urllib.parse import urlparse
    import os
    config=ProviderConfig.from_env()
    if not is_loopback(urlparse(config.base_url).hostname):
        approved=(session['simulated'] or (context['authorization_status']=='AUTHORIZED' and bool(context['authorization_reference'])))
        if not (config.name=='deepseek' and urlparse(config.base_url).hostname=='api.deepseek.com'
                and urlparse(config.base_url).scheme=='https' and urlparse(config.base_url).port in (None,443) and approved
                and os.getenv('HUBONE_DEEPSEEK_CLOUD_ENABLED')=='1'):
            raise ValueError('Cloud research is NOT CONNECTED without explicit project authorization; no data transmitted')
    return config


def _business_events(store,records,sid):
    session=store.session(sid)
    events=[]
    for record in records.list(sid,'business_input'):
        # A user-entered value is a source statement, never an automatic CRM/POS connection.
        text=f"{record['metric_id']}: {json.dumps(record['value'],ensure_ascii=False)} {record['unit']}".strip()
        events.append({'event_id':'business:'+record['record_id'],'session_id':sid,
            'timestamp':record['timestamp'],'source':'manual','event_type':'business_input',
            'description':text,'confidence':None,'evidence':{},
            'metadata':{'simulated':session['simulated'] or record['source_mode']=='SIMULATED',
                'input_origin':record['source_type'],'processing_method':'MANUAL',
                'verification_status':record['verification_status'],'original_record_id':record['record_id']}})
    return events

def run_research(store,records,sid,provider='rules'):
    session=store.session(sid); context=records.context(sid)
    acl_mode=is_acl(session); acl_context=None; acl_event_selection=None
    acl_fingerprint=current_research_fingerprint(store,records,sid) if acl_mode else None
    if context['authorization_status']=='DENIED' or context['deletion_status']=='REQUESTED':
        raise ValueError('Research processing is paused by project data policy')
    definition=framework()
    original=[e for e in store.events(sid) if e['source']!='AI_analysis']
    trusted_index=evidence_index(store,sid)
    excluded=[]; events=[]
    for event in original:
        meta=event.get('metadata',{})
        reason=None
        if meta.get('research_scope')=='REFERENCE_TECHNICAL_TEST': reason='REFERENCE_TECHNICAL_TEST is not consumer feedback'
        if not session['simulated'] and trusted_index[event['event_id']]['simulated']:
            reason='SIMULATED excluded from real research (Session/Event/Asset provenance)'
        if reason: excluded.append({'event_id':event['event_id'],'reason':reason})
        else: events.append(event)
    index={e['event_id']:trusted_index[e['event_id']] for e in events}
    business_events=_business_events(store,records,sid)
    index.update(evidence_snapshot(session,business_events,[]))
    events.extend(business_events)
    research=session.get('research') or ResearchBrief().model_dump()
    product_verified=bool(context.get('product_present_verified') and context.get('product_evidence_refs'))
    if context.get('research_purpose'):
        research={**research,'objective':context['research_purpose']}
    if context['environment']=='HOME_TEST' and not product_verified and not acl_mode:
        research={**research,'question':'家庭测试的真实感知证据支持哪些基础观察，哪些体验结论仍缺少材料？',
            'tasks':['基础行为与感知质量核验','主动表达和原始证据复核'],
            'decision_to_support':'明确下一次真实产品体验研究需要采集的证据；不推断样机体验结果。'}
    effective_session={**session,'research':research}
    if acl_mode:
        from experience.acl import observation_context,stage_context
        observations,acl_context=observation_context(store,records,sid)
        acl_stages=stage_context(store,records,sid)
        index.update({k:v for k,v in observations.items() if session['simulated'] or not v['simulated']})
        quotes=[e for e in events if e['event_type']=='utterance']
        feedback={'feedback':[{'text':e['metadata'].get('raw_text',e['description']),'event_id':e['event_id'],
            'topic':e['metadata'].get('feedback_label','未分类人工反馈'),'method':'HUMAN_INPUT'} for e in quotes],
            'keywords':[],'clusters':[],'pain_points':[],'sentiments':{},'utterance_count':len(quotes),
            'method':'ACL原始人工反馈；不套用Crest C3主题/助力建议；分类请查看Flash初整。'}
    else:feedback=analyze_feedback(events)
    # Stage 1 / Observation Agent: read-only tools, no model on per-frame data.
    timeline=[{'evidence_id':e['event_id'],'timestamp':e['timestamp'],'source':e['source'],
               'description':e['description']} for e in sorted(events,key=lambda e:e['timestamp'])]
    trace=[{'role':'Observation Agent','method':'RULE_BASED','tools':['Session.read','Event.read','Evidence.resolve'],
        'input_count':len(events),'output':'evidence_timeline','model_inference_executed':False}]
    # Stage 2 / Research Agent: existing text rules, no invented quotes or product state.
    insights=[]
    if product_verified and not acl_mode:
        for cluster in feedback['clusters']:
            suggestion,experiment=SUGGESTIONS[cluster['topic']]
            insights.append({'title':cluster['topic'],'finding':f"记录中有{cluster['utterance_count']}条原话被主题规则归到这一类别，需原声复核。",
                'evidence_ids':cluster['evidence_ids'],'recommendation':suggestion,
                'next_experiment':experiment,'priority':'P2'})
    trace.append({'role':'Research Agent','method':'RULE_BASED','tools':['Feedback.analyze'],
        'output':'themes_and_research_gaps','model_inference_executed':False})
    summary=f"当前研究范围为1个Session、{len(index)}条原始证据记录；消费者身份、理解、购买及潜在需求只按直接证据判断。"
    if provider=='rules':
        analysis=rules_decision(insights,index,summary,research)
        generation={'provider':'rules','model':None,'processing_method':'RULE_BASED','model_inference_executed':False,
            'validation':'existing_decision_schema_and_evidence_reference_checks','semantic_truth_verified':False}
    elif provider=='llm':
        # Reuse the established gateway and its schema/reference/FACT guards.
        # Local-only project data cannot silently go to a configured cloud endpoint.
        config=require_llm_authorization(session,context)
        if acl_mode:
            if config.name!='deepseek':raise ValueError('ACL decision requires the configured official DeepSeek provider')
            from experience.acl import single_request_preflight,protocol,select_model_evidence,model_selection_context
            from analysis.intelligence import comparison_context
            model_index,acl_event_selection=select_model_evidence(index)
            single_request_preflight(effective_session,model_index)
            comparison=comparison_context(model_index)
            comparison['acl_context']={'protocol':protocol(),'observation_selection':model_selection_context(acl_context),
                'event_selection':model_selection_context(acl_event_selection),
                'human_feedback_records':records.list(sid,'acl_feedback'),
                'stage_context':acl_stages,
                'candidate_policy':'RULE_BASED and AI_ASSISTED visual-review candidates are DERIVED, never original Events or HUMAN_VERIFIED facts.',
                'product_presence_verified':product_verified,
                'instruction':('分别回答穿戴过程的已知记录、哪里比较复杂、用户原话以及待验证问题。'
                    'stage_context是实际记录；protocol只是计划。已有人证反馈但时间未知不等于没有体验反馈。'
                    'visual_timeline列出视频回看的独立候选片段、逐项审核状态、原始Observation与反馈关系。'
                    'AI_ASSISTED候选是可追溯定位线索，不能提升为FACT或HUMAN_VERIFIED；REJECTED不支持动作结论。'
                    '分别列出已确认和待确认片段，只使用HUMAN_VERIFIED片段的actual_duration_seconds作为实际持续时间。'
                    '多个片段之间没有连续性证据，不以候选总跨度计算绑带或运动时长。'
                    'OBSERVATION_SEQUENCE是原始采样帧回放，不冒充已保存的连续MP4；未来球场运动验证尚未进行。'
                    '反馈与阶段的TOPIC_ASSOCIATION只表达主题相关，不证明动作完成或时间同步。'
                    '只依据原始机器字段、明确人工阶段及反馈；未知时间写未知，不从规则候选或反馈录入时间反推。'
                    '不得从姿态确认穿戴、疗效或安全。FACT逐字引用，解释为INFERENCE，实际缺失项为INSUFFICIENT_EVIDENCE。'
                    'claims/diagnoses/options/experiments与全部finding_id全局唯一；finding_id分别使用AUD-/BEH-/EXP-/DIA-/COM-/DEC-命名空间。'
                    'decision_cards.option_id仍引用现有选项，不创造新选项。')}
            analysis,generation=generate_decision(effective_session,model_index,comparison=comparison)
        else:analysis,generation=generate_decision(effective_session,index)
    else: raise ValueError('Unknown research provider')
    trace.append({'role':'Evidence Agent','method':'RULE_BASED','tools':['Evidence.resolve','Decision.validate_analysis'],
        'output':'FACT / INFERENCE / INSUFFICIENT_EVIDENCE','model_inference_executed':False})
    trace.append({'role':'Decision Agent','method':generation['processing_method'],'tools':['Decision.rules_decision' if provider=='rules' else 'ModelGateway.generate'],
        'output':'reviewable_hypotheses_and_experiments','model_inference_executed':generation['model_inference_executed']})

    business=records.list(sid,'business_input')
    dimensions=[]
    for dimension in definition['dimensions']:
        metric_values=[]
        for metric in dimension['metrics']:
            supplied=[r for r in business if r['metric_id']==metric['id'] and (session['simulated'] or r['source_mode']!='SIMULATED')]
            verified=[r for r in supplied if r['verification_status']=='HUMAN_VERIFIED']
            metric_values.append({'metric_id':metric['id'],'name':metric['name'],
                'status':'SIMULATED' if supplied and session['simulated'] else 'HUMAN_VERIFIED' if verified else 'INSUFFICIENT_EVIDENCE',
                'values':[{'value':r['value'],'unit':r['unit'],'record_id':r['record_id'],'evidence_refs':r['evidence_refs'],
                    'source_type':r['source_type'],'verification_status':r['verification_status']} for r in supplied],
                'definition':metric['definition'],'calculation':metric['calculation'],
                'limitations':metric['exclusions']})
        dimensions.append({'id':dimension['id'],'name':dimension['name'],'metrics':metric_values})

    temporal=correlate([e for e in events if not e['event_id'].startswith('business:')])
    for item in temporal:
        item.update(relation='TEMPORAL_CONTEXT_ONLY',time_alignment_status=context['time_alignment_status'],
            speaker_track_association='UNASSOCIATED',identity_verified=False,
            status='CANDIDATE' if context['time_alignment_status']=='HUMAN_VERIFIED' else 'UNVERIFIED_ALIGNMENT')
    behavior_states=behavior_sources(store,records,sid)
    current_runs=[state['run'] for state in behavior_states if state['status']=='CURRENT']
    behavior_counts=Counter(p['label'] for r in current_runs for p in r['predictions'] if p.get('status')=='CANDIDATE')
    evidence_list=[{'evidence_id':key,**value} for key,value in index.items()]
    templates=[]
    for template in definition['report_templates']:
        metric_ids={m['id'] for dimension in definition['dimensions'] if dimension['id'] in template.get('dimensions',[])
                    for m in dimension['metrics']}
        supplied=[r for r in business if r['metric_id'] in metric_ids]
        relevant_ids={'business:'+r['record_id'] for r in supplied}
        relevant_claims=[c for c in analysis['claims'] if set(c['evidence_ids']) & relevant_ids]
        templates.append({'template':template,'research_question':template.get('question',research['question']),
            'sample_scope':{'sessions':1,'unique_consumers':None,'simulated':session['simulated']},
            'status':'DRAFT_REQUIRES_HUMAN_REVIEW','data_sources':sorted({r['source_type'] for r in supplied}),
            'FACT':[c for c in relevant_claims if c['classification']=='FACT'],
            'INFERENCE':[c for c in relevant_claims if c['classification']=='INFERENCE'],
            'INSUFFICIENT_EVIDENCE':['仅保留与此研究模块相关且经过复核的证据；缺失指标不自动填充。'],
            'evidence_ids':sorted(relevant_ids),'findings_status':'INSUFFICIENT_EVIDENCE',
            'observations':supplied,
            'product_recommendations':[o for o in analysis['options'] if product_verified and set(o['evidence_ids']) & relevant_ids],
            'next_experiments':[e for e in analysis['experiments'] if product_verified and set(e['evidence_ids']) & relevant_ids],
            'limitations':['No consumer population inference from one Session.','Template is a reviewable research container, not eight verified conclusions.']})
    report={'schema_version':'experience-intelligence/1.2','session_id':sid,'product_positioning':'Consumer Experience Intelligence Platform',
        'created_at':utc(),'status':'DRAFT_REQUIRES_HUMAN_REVIEW','publication_status':'NOT_PUBLISHED',
        'simulated':session['simulated'],'research':research,'workflow':trace,'generation':generation,
        'decision_analysis':analysis,'dimensions':dimensions,'feedback':feedback,'timeline':timeline,
        'evidence_index':evidence_list,'excluded_evidence':excluded,'temporal_links':temporal,
        'behavior_summary':{'counts_are_sampled_candidates_not_independent_actions':True,'candidates':dict(behavior_counts),
            'verification_status':'RULE_BASED','run_ids':[r['record_id'] for r in current_runs],
            'source_states':[{k:v for k,v in state.items() if k!='run'} for state in behavior_states]},
        'report_templates':templates,'crest_c3_template':definition['crest_c3_template'],
        'product_interaction_status':'UNKNOWN' if not product_verified else 'REQUIRES_DIRECT_INTERACTION_EVIDENCE',
        'cad_status':'NOT_CONNECTED','unique_consumer_count':None,
        'source_snapshot_sha256':current_research_fingerprint(store,records,sid),
        'limitations':['规则输出不等于已训练的行为分类；模型框置信度不等于行为准确率。',
            '时间接近不证明声音与人体Track属于同一个人，也不证明因果关系。',
            '曝光机会、注意、理解、满意、购买意向和真实转化不能相互替代。',
            '没有人工真值不输出正式动作准确率；没有产品交互证据不输出穿戴结论。',
            '会员/CRM/POS目前为有授权的人工导入接口，不代表外部系统已连接。',
            '所有正式研究发布需要人工审核；本接口不公开发布。']}
    if acl_mode:
        from experience.acl import protocol
        if current_research_fingerprint(store,records,sid)!=acl_fingerprint:
            raise ValueError('ACL source changed during model analysis; draft was not saved')
        report.pop('crest_c3_template',None)
        report.update(product=session['product'],research_type=protocol()['research_type'],product_template=protocol(),
            observation_selection=acl_context,event_selection=acl_event_selection,acl_stage_records=records.list(sid,'acl_stage'),
            human_feedback=records.list(sid,'acl_feedback'),stage_context=acl_stages,
            acl_visual_timeline=acl_stages['visual_timeline'],
            source_snapshot_sha256=acl_fingerprint,
            method='MODEL_BASED' if generation['model_inference_executed'] else 'RULE_BASED',verification_status='NOT_VERIFIED')
        acl_runs=[r for r in records.list(sid,'acl_behavior_run') if r['source_fingerprint']==acl_context['source_fingerprint']]
        report['behavior_summary']={'counts_are_sampled_candidates_not_independent_actions':True,
            'candidates':acl_runs[-1]['candidate_sample_counts'] if acl_runs else {},
            'method':'RULE_BASED','verification_status':'NOT_VERIFIED',
            'run_ids':[r['record_id'] for r in acl_runs],
            'source_status':'CURRENT' if acl_runs else 'INSUFFICIENT_EVIDENCE'}
        report['limitations']+=protocol()['limitations']
    report['report_sha256']=digest(report)
    return report
