from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, model_validator


def uid() -> str:
    return uuid4().hex


class StrictModel(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)


class ResearchBrief(StrictModel):
    question: str = Field(default='消费者在 Crest C3 穿戴与行走任务中遇到哪些使用障碍，下一轮应验证什么？', min_length=1, max_length=1000)
    objective: str = Field(default='区分可观察记录、消费者主观反馈与研究推断，决定下一轮产品验证。', min_length=1, max_length=1500)
    tasks: list[str] = Field(default_factory=lambda: ['穿戴并调整固定带', '平地行走并描述助力与负重感受'], min_length=1, max_length=20)
    decision_to_support: str = Field(default='选择下一轮产品改进选项及验证实验；不直接确认产品缺陷。', min_length=1, max_length=1500)
    recording_relationship: Literal['unknown', 'same_capture', 'independent'] = 'unknown'

    @model_validator(mode='after')
    def nonblank(self):
        if any(not s.strip() for s in [self.question,self.objective,self.decision_to_support,*self.tasks]) or any(len(s)>1000 for s in self.tasks):
            raise ValueError('研究问题、目标和任务不能为空，单项任务不超过 1000 字。')
        return self


class SessionCreate(StrictModel):
    name: str = Field(default='Crest C3 消费者体验', min_length=1, max_length=120)
    product: str = Field(default='探路者 Crest C3 智能运动外骨骼', max_length=160)
    simulated: bool = False
    research: ResearchBrief = Field(default_factory=ResearchBrief)


class Session(SessionCreate):
    session_id: str = Field(default_factory=uid)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class EventInput(StrictModel):
    timestamp: float = Field(ge=0)
    event_type: str = Field(min_length=1, max_length=80)
    source: Literal['video', 'audio', 'AI_analysis', 'manual']
    description: str = Field(min_length=1, max_length=10000)
    confidence: float | None = Field(default=None, ge=0, le=1)
    evidence: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)


class Event(EventInput):
    event_id: str = Field(default_factory=uid)
    session_id: str


class Segment(StrictModel):
    start: float = Field(ge=0)
    end: float = Field(ge=0)
    text: str = Field(min_length=1, max_length=10000)
    speaker: str | None = Field(default=None, max_length=80)
    confidence: float | None = Field(default=None, ge=0, le=1)

    @model_validator(mode='after')
    def ordered(self):
        if self.end < self.start:
            raise ValueError('end must be >= start')
        if not self.text.strip():
            raise ValueError('text cannot be blank')
        return self


class TranscriptInput(StrictModel):
    segments: list[Segment] = Field(min_length=1, max_length=1000)
    offset_seconds: float = Field(default=0, ge=0)
    asset_id: str | None = None


class ProcessInput(StrictModel):
    asset_id: str
    offset_seconds: float = Field(default=0, ge=0)
    zone: list[tuple[float, float]] = Field(
        default_factory=lambda: [(0.05, 0.05), (0.95, 0.05), (0.95, 0.95), (0.05, 0.95)],
        min_length=3, max_length=20,
    )

    @model_validator(mode='after')
    def zone_bounds(self):
        if any(not 0 <= v <= 1 for p in self.zone for v in p):
            raise ValueError('zone must use normalized image coordinates in [0,1]')
        from shapely.geometry import Polygon
        poly = Polygon(self.zone)
        if not poly.is_valid or poly.area <= 0:
            raise ValueError('zone must be a valid polygon with nonzero area')
        return self


class AnalyzeInput(StrictModel):
    provider: Literal['rules', 'llm', 'mock'] = 'rules'


class Insight(StrictModel):
    title: str = Field(min_length=1, max_length=200)
    finding: str = Field(min_length=1, max_length=2000)
    priority: Literal['P1', 'P2', 'P3']
    evidence_ids: list[str] = Field(min_length=1, max_length=100)
    recommendation: str = Field(min_length=1, max_length=2000)
    next_experiment: str = Field(min_length=1, max_length=2000)
    # Model output is always treated as a hypothesis, not a confirmed product defect.
    status: Literal['hypothesis'] = 'hypothesis'


class LLMResult(StrictModel):
    summary: str = Field(min_length=1, max_length=4000)
    insights: list[Insight] = Field(max_length=20)
