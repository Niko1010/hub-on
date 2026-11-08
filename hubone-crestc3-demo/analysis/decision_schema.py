"""Evidence-to-Decision contract. Model output is not itself original evidence."""
from typing import Literal
from pydantic import ConfigDict, Field
from backend.models import StrictModel

class Claim(StrictModel):
    claim_id: str = Field(pattern=r'^[A-Za-z0-9_-]{1,80}$')
    statement: str = Field(min_length=1, max_length=2000)
    classification: Literal['FACT', 'INFERENCE', 'INSUFFICIENT_EVIDENCE']
    evidence_ids: list[str] = Field(max_length=100)
    reasoning: str = Field(min_length=1, max_length=2000)


class Diagnosis(StrictModel):
    diagnosis_id: str = Field(pattern=r'^[A-Za-z0-9_-]{1,80}$')
    title: str = Field(min_length=1, max_length=200)
    explanation: str = Field(min_length=1, max_length=2000)
    classification: Literal['INFERENCE', 'INSUFFICIENT_EVIDENCE']
    evidence_ids: list[str] = Field(min_length=1, max_length=100)
    alternative_explanations: list[str] = Field(min_length=1, max_length=8)
    missing_evidence: list[str] = Field(min_length=1, max_length=10)


class ProductOption(StrictModel):
    option_id: str = Field(pattern=r'^[A-Za-z0-9_-]{1,80}$')
    diagnosis_ids: list[str] = Field(min_length=1, max_length=8)
    title: str = Field(min_length=1, max_length=200)
    change: str = Field(min_length=1, max_length=2000)
    tradeoffs: list[str] = Field(min_length=1, max_length=8)
    priority: Literal['P1', 'P2', 'P3']
    classification: Literal['INFERENCE']
    evidence_ids: list[str] = Field(min_length=1, max_length=100)


class Experiment(StrictModel):
    experiment_id: str = Field(pattern=r'^[A-Za-z0-9_-]{1,80}$')
    option_ids: list[str] = Field(min_length=1, max_length=12)
    hypothesis: str = Field(min_length=1, max_length=1500)
    protocol: str = Field(min_length=1, max_length=2000)
    comparison: str = Field(min_length=1, max_length=1500)
    measures: list[str] = Field(min_length=1, max_length=10)
    success_criterion: str = Field(min_length=1, max_length=1500)
    classification: Literal['INFERENCE']
    evidence_ids: list[str] = Field(min_length=1, max_length=100)


class Decision(StrictModel):
    recommendation: str = Field(min_length=1, max_length=2000)
    classification: Literal['INFERENCE', 'INSUFFICIENT_EVIDENCE']
    evidence_ids: list[str] = Field(max_length=100)
    data_gaps: list[str] = Field(min_length=1, max_length=15)


class DecisionAnalysis(StrictModel):
    summary: str = Field(min_length=1, max_length=4000)
    claims: list[Claim] = Field(min_length=1, max_length=25)
    diagnoses: list[Diagnosis] = Field(max_length=8)
    options: list[ProductOption] = Field(max_length=12)
    experiments: list[Experiment] = Field(max_length=12)
    decision: Decision


class ResearchFinding(StrictModel):
    finding_id: str = Field(pattern=r'^[A-Za-z0-9_-]{1,80}$')
    topic: str = Field(min_length=1, max_length=200)
    statement: str = Field(min_length=1, max_length=2000)
    classification: Literal['FACT', 'INFERENCE', 'INSUFFICIENT_EVIDENCE']
    evidence_ids: list[str] = Field(max_length=100)
    evidence_strength: Literal['NONE', 'LIMITED', 'CORROBORATED']
    limitations: list[str] = Field(min_length=1, max_length=10)
    commercial_signal: Literal['NONE', 'PURCHASE_INTENT', 'SALES_CONVERSION', 'REVISIT', 'DISPLAY_CAUSALITY']
    direct_evidence_ids: list[str] = Field(max_length=100)


class IntelligenceModule(StrictModel):
    findings: list[ResearchFinding] = Field(min_length=1, max_length=8)
    data_gaps: list[str] = Field(min_length=1, max_length=10)


class ResearchIntelligence(StrictModel):
    audience: IntelligenceModule
    behavioral: IntelligenceModule
    experience: IntelligenceModule
    diagnostic: IntelligenceModule
    commercial: IntelligenceModule
    decision: IntelligenceModule


class ResearchMethod(StrictModel):
    name: Literal['JTBD', 'STP', 'Customer Journey', 'ISO 9241-11', 'Kano Model', 'A/B Testing', 'Hypothesis-driven Research']
    rationale: str = Field(min_length=1, max_length=1500)
    data_requirements: list[str] = Field(min_length=1, max_length=8)
    limitations: list[str] = Field(min_length=1, max_length=8)
    status: Literal['PLANNED']


class DecisionCard(StrictModel):
    option_id: str
    decision_question: str = Field(min_length=1, max_length=1500)
    evidence_ids: list[str] = Field(min_length=1, max_length=100)
    evidence_strength: Literal['LIMITED', 'CORROBORATED']
    alternative_explanations: list[str] = Field(min_length=1, max_length=8)
    target_audience: str = Field(min_length=1, max_length=1000)
    expected_impact: str = Field(min_length=1, max_length=1500)
    cost_estimate: str = Field(min_length=1, max_length=1500)
    risks: list[str] = Field(min_length=1, max_length=8)
    priority: Literal['P1', 'P2', 'P3']
    impact: int = Field(ge=1, le=5)
    urgency: int = Field(ge=1, le=5)
    effort: int = Field(ge=1, le=5)
    priority_score: int = Field(ge=3, le=15)
    scoring_basis: str = Field(min_length=1, max_length=2000)
    experiment_ids: list[str] = Field(min_length=1, max_length=12)
    success_metrics: list[str] = Field(min_length=1, max_length=10)
    decision_owner: str = Field(min_length=1, max_length=200)
    follow_up_plan: str = Field(min_length=1, max_length=1500)
    tracking_status: Literal['PLANNED']
    classification: Literal['INFERENCE']


class DecisionAnalysisV11(DecisionAnalysis):
    model_config = ConfigDict(title='DecisionAnalysis')
    intelligence: ResearchIntelligence
    research_methods: list[ResearchMethod] = Field(min_length=1, max_length=3)
    decision_cards: list[DecisionCard] = Field(max_length=12)


def output_schema(event_ids=None,version='1.1'):
    """Constrain every citation to the current Session, also checked server-side."""
    if version not in ('1.0','1.1'): raise ValueError('不支持的研究契约版本。')
    schema = (DecisionAnalysisV11 if version=='1.1' else DecisionAnalysis).model_json_schema()
    if event_ids is not None:
        def visit(value):
            if isinstance(value,dict):
                for key,field in value.get('properties',{}).items():
                    if key.endswith('evidence_ids'):
                        field['items']={'type':'string','enum':sorted(event_ids)} if event_ids else {'type':'string','not':{}}
                for child in value.values(): visit(child)
            elif isinstance(value,list):
                for child in value: visit(child)
        visit(schema)
    return schema
