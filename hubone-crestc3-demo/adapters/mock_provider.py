"""Deterministic software-test fixture. This code does not call an LLM."""
import hashlib
import json
from adapters.providers import GenerationResponse


class MockProvider:
    def generate(self,request):
        events=request.payload['untrusted_events']
        if not request.payload.get('simulated_session'):
            raise ValueError('Mock Provider 仅允许显式 SIMULATED Session。')
        originals=[e for e in events if e['source']!='AI_analysis']
        if not originals: raise ValueError('Mock 测试需要原始事件。')
        utterances=[e for e in originals if e['event_type']=='utterance']
        refs=[e['event_id'] for e in (utterances or originals)[:4]]
        fact_events=[e for e in originals if e['source']=='video'][:1]+utterances[:1]
        if not fact_events: fact_events=originals[:1]
        claims=[{'claim_id':f'C{i+1}','statement':e['description'],'classification':'FACT',
                 'evidence_ids':[e['event_id']],'reasoning':'FACT 仅表示模拟记录存在；不是已验证的真实消费者事实。'} for i,e in enumerate(fact_events)]
        claims += [{'claim_id':'C-inference','statement':'演示：舒适度反馈可以形成下一轮对照验证的问题。',
                    'classification':'INFERENCE','evidence_ids':refs,'reasoning':'MOCK 固定软件测试结果；不是模型推理或研究结论。'},
                   {'claim_id':'C-gap','statement':'尚不能确认固定带设计导致不适，也不能确认视频轨迹与说话人相同。',
                    'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':refs,'reasoning':'缺少真实重复试验、身份绑定及同步核验。'}]
        data={'summary':'MOCK / SIMULATED：演示从研究问题、原始记录到下一轮验证决定的完整软件链路；未调用任何语言模型。',
            'claims':claims,
            'diagnoses':[{'diagnosis_id':'D1','title':'演示假设：舒适度与固定带设置需要分开验证',
                'explanation':'模拟原话只能提示研究方向，不能确认设计缺陷。','classification':'INFERENCE','evidence_ids':refs,
                'alternative_explanations':['穿戴松紧或引导方式影响主观感受。','个体体型、任务时长或先前疲劳可能影响反馈。'],
                'missing_evidence':['真实 Crest C3 体验采集与回听复核。','相同参与者不同设置的交叉比较。']}],
            'options':[{'option_id':'O1','diagnosis_ids':['D1'],'title':'先验证穿戴引导与松紧设置',
                'change':'在研究员指导下比较当前穿戴流程与标准化调节流程。','tradeoffs':['增加指导时间；可能只改善操作而非产品结构。'],
                'priority':'P1','classification':'INFERENCE','evidence_ids':refs},
                {'option_id':'O2','diagnosis_ids':['D1'],'title':'再比较腰部接触与受力分布方案',
                'change':'如引导改善仍不足，再比较原固定带与可调整接触垫样件。','tradeoffs':['样件会改变贴合和重量，需要记录安全约束。'],
                'priority':'P2','classification':'INFERENCE','evidence_ids':refs}],
            'experiments':[{'experiment_id':'X1','option_ids':['O1','O2'],
                'hypothesis':'标准化穿戴后仍重复出现的不适，才值得进一步验证接触结构方案。',
                'protocol':'下一轮招募实际参与者，记录尺寸与设置；随机平衡条件顺序，执行等长行走任务，同步录像并追问原话。',
                'comparison':'当前流程 vs 标准化穿戴；必要时原固定带 vs 接触垫样件。',
                'measures':['逐条件舒适评分及原话','调整次数、任务完成情况和不良体验'],
                'success_criterion':'演示性预注册标准：同人舒适评分提高至少 2/10 且无任务完成率下降；实际阈值须研究负责人确认。',
                'classification':'INFERENCE','evidence_ids':refs}],
            'decision':{'recommendation':'仅批准下一轮真实采集与对照实验，不据此批准量产结构修改。',
                'classification':'INSUFFICIENT_EVIDENCE','evidence_ids':refs,
                'data_gaps':['当前全部为模拟素材与 Mock 固定结果。','尚未验证本地模型质量、真实同步关系和消费者身份。']}}
        return GenerationResponse(data,{'provider':'mock','model':'fixture-evidence-to-decision-v1',
            'processing_method':'MOCK','model_inference_executed':False,'response_id':None,'elapsed_seconds':0,
            'response_sha256':hashlib.sha256(json.dumps(data,sort_keys=True,ensure_ascii=False).encode()).hexdigest()})
