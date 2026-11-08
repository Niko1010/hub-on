"""Readable decision report. Provenance/media links are generated from stored evidence."""
from analysis.intelligence import MODULES


def safe(value):
    return str(value).replace('\n',' ').replace('`','\\`').replace('[','\\[').replace(']','\\]').replace('<','&lt;').replace('>','&gt;')


def tc(t): return f'{int(t)//60:02d}:{t%60:04.1f}'


def refs(ids): return ', '.join(f'`[E:{eid}]`' for eid in ids) or '无可引用证据'


def status(item):
    return {'FACT':'FACT · 记录事实（未复核）','INFERENCE':'INFERENCE · 研究推断 / 待验证',
            'INSUFFICIENT_EVIDENCE':'INSUFFICIENT_EVIDENCE · 证据不足'}[item['classification']]


def render_decision_markdown(r):
    a=r['decision_analysis'];b=r['research'];g=r['generation']
    lines=['# HUB ONE × CREST C3 · Evidence-to-Decision 决策型研究报告','',
        '资料来源：'+('SIMULATED · 模拟资料，不能作为真实消费者研究结论' if r['simulated'] else '用户输入 / 原始记录，待研究员复核'),
        '处理方式：'+r['engine'],f"模型推理已执行：{'是（不代表结论已验证）' if g['model_inference_executed'] else '否'}",
        f"Session：{r['session']['session_id']}",f"产品：{safe(r['session']['product'])}",
        '显式研究范围：'+', '.join(s['session_id'] for s in r.get('sessions',[r['session']])),
        f"生成时间（UTC）：{r['generated_at']}",
        '判断标签：FACT 只表示原始记录存在；INFERENCE 表示解释/建议；INSUFFICIENT_EVIDENCE 表示不能确认。','',
        '## 1. 研究问题、目标与计划任务',
        '研究问题：'+safe(b['question']),'研究目标：'+safe(b['objective']),
        '待支持的决定：'+safe(b['decision_to_support']),
        '以下任务为研究计划，不能据此声称参与者已经完成：']
    lines += ['- PLAN · '+safe(t) for t in b['tasks']]
    lines += ['','## 2. 消费者可观察行为记录（FACT 记录层）',
              '仅列出已存储的观察；行为规则、人工标注和模型识别分别保留方法，不把迹象升级为已证实动作。']
    for e in r['observations']:
        lines += [f"- Session {e['session_id']} · {tc(e['timestamp'])} · {e['source']} / {e['processing_method']} / {e['input_origin']}：{safe(e['description'])} {refs([e['event_id']])}"]
    if not r['observations']: lines+=['没有行为记录；不推断任务完成情况。']
    lines += ['','## 3. 消费者原话 / 原始转录（FACT 记录层）',
              'ASR 原文可能有误；说话人未知时保持未知。原话表达主观感受，不等于客观产品性能。']
    for e in r['quotes']:
        lines += [f"- Session {e['session_id']} · {tc(e['timestamp'])}–{tc(e['end_timestamp'])} · {safe(e['speaker'] or '说话人未知')} · {e['processing_method']}：「{safe(e['raw_text'])}」 {refs([e['event_id']])}"]
    if not r['quotes']: lines+=['没有原始语音或文本反馈。']
    lines += ['','## 4. 多模态证据与统一时间戳',
        '音视频采集关系（用户声明）：'+b['recording_relationship'],
        'Session 时间 = 文件时间 + offset_seconds；时间邻近不确认同人、真实同步或因果。']
    for c in r['correlations']:
        lines += [f"- Session {c.get('session_id',r['session']['session_id'])} · {tc(c['start'])}–{tc(c['end'])} · 语音 {refs([c['utterance_id']])} ↔ 邻近视频 {refs(c['video_event_ids'])}"]
    if not r['correlations']: lines+=['没有可用的段级时间关联。']
    lines += ['','## 5. 研究判断、问题诊断及替代解释',
              '综合说明（INFERENCE · 待验证）：'+safe(a['summary'])]
    for c in a['claims']:
        lines += [f"### {c['claim_id']} · {status(c)}",safe(c['statement']),
                  '判断依据 / 限制：'+safe(c['reasoning']),'原始证据：'+refs(c['evidence_ids'])]
    for d in a['diagnoses']:
        lines += [f"### {d['diagnosis_id']} · {safe(d['title'])} · {status(d)}",safe(d['explanation']),
                  '原始证据：'+refs(d['evidence_ids']),'替代解释（均未验证）：']
        lines += ['- '+safe(v) for v in d['alternative_explanations']]
        lines += ['缺少证据：']+['- '+safe(v) for v in d['missing_evidence']]
    if not a['diagnoses']: lines+=['INSUFFICIENT_EVIDENCE · 当前没有足以提出产品问题诊断的相关证据。']
    lines += ['','## 6. 产品改进选项（INFERENCE · 尚未实施）']
    for o in a['options']:
        lines += [f"### {o['option_id']} · {o['priority']} · {safe(o['title'])}",
            '关联诊断：'+', '.join(o['diagnosis_ids']),'改进选项：'+safe(o['change']),
            '取舍与风险（待验证）：'+'；'.join(safe(v) for v in o['tradeoffs']),
            '原始证据：'+refs(o['evidence_ids'])]
    if not a['options']: lines+=['证据不足，暂不提出具体产品修改。']
    lines += ['','## 7. 下一轮验证实验（INFERENCE · 计划，尚无结果）']
    for e in a['experiments']:
        lines += [f"### {e['experiment_id']} · 验证选项 {', '.join(e['option_ids'])}",
            '待验证假设：'+safe(e['hypothesis']),'比较条件：'+safe(e['comparison']),
            '执行步骤：'+safe(e['protocol']),'记录指标：'+'；'.join(safe(v) for v in e['measures']),
            '预定成功标准（不是已测结果）：'+safe(e['success_criterion']),'依据：'+refs(e['evidence_ids'])]
    if not a['experiments']: lines+=['先补充与研究问题相关的原始资料，再预注册验证实验。']
    d=a['decision']
    lines += ['','## 8. 当前决策及证据缺口',status(d),safe(d['recommendation']),'决策依据：'+refs(d['evidence_ids']),'尚缺：']
    lines += ['- '+safe(v) for v in d['data_gaps']]
    if a.get('intelligence'):
        lines += ['','## 六类研究分析 · Evidence-to-Decision 1.1',
                  'SIMULATED · 以下新增商业与研究内容仅为模拟假设，不是真实研究结论。' if r['simulated']
                  else '以下为原始记录与待复核解释；商业机会、成本收益和资源建议均需验证。']
        for key,(title,coverage) in MODULES.items():
            module=a['intelligence'][key]
            lines += ['','### '+title,'研究范围：'+coverage]
            for f in module['findings']:
                lines += [f"- {safe(f['topic'])} · {status(f)} · 证据强度 {f['evidence_strength']}：{safe(f['statement'])}",
                          '支持证据：'+refs(f['evidence_ids']),
                          '限制：'+'；'.join(safe(v) for v in f['limitations'])]
                if f['commercial_signal']!='NONE':
                    lines += [f"商业证据门槛：{f['commercial_signal']}；直接证据：{refs(f['direct_evidence_ids'])}"]
            lines += ['待补资料：'+'；'.join(safe(v) for v in module['data_gaps'])]
        lines += ['','## 产品决策卡 · 改进方案与资源分配',
                  '所有方案和打分为待验证估计；预计影响不是已实现收益。']
        for card in a['decision_cards']:
            lines += [f"### {card['option_id']} · {card['priority']} · {safe(card['decision_question'])}",
                '支持证据：'+refs(card['evidence_ids']),
                '证据强度：'+card['evidence_strength']+'（待复核；预期商业机会不是已实现结果）',
                '替代解释：'+'；'.join(safe(v) for v in card['alternative_explanations']),
                '目标用户：'+safe(card['target_audience']),'预期影响：'+safe(card['expected_impact']),
                '改进成本与收益依据：'+safe(card['cost_estimate']),
                '方案风险：'+'；'.join(safe(v) for v in card['risks']),
                f"优先级评分：{card['priority_score']}/15；影响 {card['impact']}，紧迫性 {card['urgency']}，投入 {card['effort']}。",
                '评分依据：'+safe(card['scoring_basis']),'下一轮验证：'+', '.join(card['experiment_ids']),
                '成功指标（预注册）：'+'；'.join(safe(v) for v in card['success_metrics']),
                '决策负责人：'+safe(card['decision_owner']),
                '决策后的效果追踪：'+safe(card['follow_up_plan'])+' · '+card['tracking_status']]
        if not a['decision_cards']: lines+=['没有获得证据支持的产品选项；先补充证据，不强造改进决策卡。']
        lines += ['','## 研究方法选择（计划，尚未执行）']
        for method in a['research_methods']:
            lines += ['### '+method['name']+' · '+method['status'],
                '选择依据：'+safe(method['rationale']),
                '所需资料：'+'；'.join(safe(v) for v in method['data_requirements']),
                '适用限制：'+'；'.join(safe(v) for v in method['limitations'])]
    if r.get('comparison'):
        comparison=r['comparison']
        lines += ['','## 多参与者与多场景比较','分组依据为显式研究标签；记录数量不等于参与者人数、转化或因果效果。']
        lines += [f"- Session {s['session_id']} · 产品 {safe(s['product'])} · "
                  f"音视频采集关系（仅此 Session 的用户声明）：{s['research']['recording_relationship']}"
                  for s in comparison.get('session_contexts',[])]
        labels={'session':'多 Session','participant':'参与者（Session 内）','segment':'客群标签',
                'product':'多产品互动','camera':'多机位','condition':'体验条件','task':'任务','zone':'空间区域'}
        for key,dimension in comparison['dimensions'].items():
            lines += ['### '+labels[key]]
            for group in dimension['groups']:
                lines += [f"- {safe(group['label'])} · 范围 {safe(group['session_scope'] or '显式选择的 Session')} · "
                          f"{group['record_count']} 条记录{' · SIMULATED' if group['simulated'] else ''}：{refs(group['evidence_ids'])}"]
            if dimension['unlabelled_evidence_ids']:
                lines += [f"未标注：{len(dimension['unlabelled_evidence_ids'])} 条记录，未推测归属。"]
        for link in comparison['cross_camera_links']:
            lines += [f"- 跨机位人工关联 {safe(link['association_id'])} · Session {link['session_id']} · "
                      f"{link['status']}：{refs(link['evidence_ids'])}"]
        lines += ['- '+safe(v) for v in comparison['limitations']]
    lines += ['','## 9. 方法、限制与验证边界']+['- '+safe(v) for v in r['limitations']]
    lines += [f"- 反馈关键词、正负向预分类和相似反馈聚类：RULE_BASED；不冒充 LLM 结果。",
              f"- Schema：{g['schema_version']}；引用校验：{g['validation']}。",
              '- 本报告不证明本地 Ollama、RTX 5070 性能或摄像头/麦克风已验证。',
              '', '## 10. 完整原始证据索引']
    for eid,e in r['evidence_index'].items():
        lines += [f"### [E:{eid}]",f"Session {e['session_id']} · {tc(e['timestamp'])}–{tc(e['end_timestamp'])} · {e['source']} / {e['event_type']}",
            f"输入 {e['input_origin']} · 处理 {e['processing_method']} · UNREVIEWED_SOURCE_RECORD",
            '原始文本：'+safe(e['raw_text'] or e['description'])]
        if e['media_url']:
            seek=e['media_time'] or 0
            lines += [f"原始媒体：{e['media_url']}#t={seek}",
                      f"文件时间：{e['media_time']}；偏移：{e['offset_seconds']}；资产 SHA-256：{e['asset_sha256'] or '未提供'}"]
            if e['frame_url']: lines+=['证据帧：'+e['frame_url']]
        else: lines+=['没有关联媒体资产；仅能追溯到已保存的文本/人工记录。']
    lines += ['',f"事件快照 SHA-256：`{r['event_snapshot_sha256']}`",'']
    return '\n'.join(lines)
