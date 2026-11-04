"""Evidence-to-Decision contract. Model output is not itself original evidence."""
from typing import Literal
from pydantic import Field
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


def output_schema(event_ids=None):
    """Constrain every citation to the current Session, also checked server-side."""
    schema = DecisionAnalysis.model_json_schema()
    if event_ids:
        def visit(value):
            if isinstance(value,dict):
                if 'evidence_ids' in value.get('properties',{}):
                    value['properties']['evidence_ids']['items']={'type':'string','enum':sorted(event_ids)}
                for child in value.values(): visit(child)
            elif isinstance(value,list):
                for child in value: visit(child)
        visit(schema)
    return schema
