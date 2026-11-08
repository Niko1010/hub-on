"""Append-only visual-review candidates over existing ACL observations.

This module never performs inference, edits source evidence, or promotes an AI
candidate to a human fact. Sampled JPEG playback is not a continuous recording.
"""
from copy import deepcopy
import json
import re
from typing import Literal

from pydantic import Field, model_validator
from backend.models import StrictModel
from experience.core import SourceRef, digest, load_source, utc
from experience.acl import FIELDS, require_acl, _feedback_event

IMPORT = 'acl_timeline_import'
REVIEW = 'acl_timeline_review'
LINK = 'acl_timeline_feedback_link'


class CandidateSegment(StrictModel):
    segment_id: str = Field(min_length=1, max_length=100)
    label: str = Field(min_length=1, max_length=200)
    candidate_start: float = Field(ge=0)
    candidate_end: float = Field(ge=0)
    observation_ids: list[int] = Field(min_length=1, max_length=65)
    notes: str = Field(default='', max_length=2000)

    @model_validator(mode='after')
    def interval(self):
        if self.candidate_end < self.candidate_start:
            raise ValueError('Candidate end precedes start')
        return self


class CandidateGroup(StrictModel):
    group_id: str = Field(min_length=1, max_length=100)
    stage_id: Literal['pick_up', 'wear', 'adjust_straps', 'stand', 'walk', 'remove']
    label: str = Field(min_length=1, max_length=200)
    candidate_start: float = Field(ge=0)
    candidate_end: float = Field(ge=0)
    notes: str = Field(default='', max_length=2000)
    segments: list[CandidateSegment] = Field(min_length=1, max_length=30)

    @model_validator(mode='after')
    def segments_in_window(self):
        if self.candidate_end < self.candidate_start or any(
            s.candidate_start < self.candidate_start or s.candidate_end > self.candidate_end
            for s in self.segments
        ):
            raise ValueError('Independent segments must be within their candidate window')
        if len({s.segment_id for s in self.segments}) != len(self.segments):
            raise ValueError('Duplicate segment ID')
        return self


class TimelineImportInput(StrictModel):
    import_key: str = Field(min_length=1, max_length=150)
    source_fingerprint: str = Field(min_length=64, max_length=64)
    review_reference: str = Field(min_length=1, max_length=1000)
    groups: list[CandidateGroup] = Field(min_length=1, max_length=6)

    @model_validator(mode='after')
    def unique_groups(self):
        if len({g.group_id for g in self.groups}) != len(self.groups):
            raise ValueError('Duplicate group ID')
        return self


class TimelineReviewInput(StrictModel):
    request_id: str = Field(min_length=1, max_length=150)
    group_id: str = Field(min_length=1, max_length=100)
    segment_id: str = Field(min_length=1, max_length=100)
    expected_review_id: str | None = Field(default=None, max_length=100)
    source_fingerprint: str = Field(min_length=64, max_length=64)
    status: Literal['AI_ASSISTED', 'HUMAN_VERIFIED', 'REJECTED']
    human_confirmed: bool = False
    start_observation_id: int | None = Field(default=None, ge=1)
    end_observation_id: int | None = Field(default=None, ge=1)
    notes: str = Field(default='', max_length=2000)


class TimelineFeedbackLinkInput(StrictModel):
    request_id: str = Field(min_length=1, max_length=150)
    feedback_record_id: str = Field(min_length=1, max_length=100)
    feedback_field: Literal['wearing_difficulty', 'adjustment_difficulty', 'operation_convenience',
        'fit', 'comfort', 'removal_difficulty', 'other_issues']
    target: Literal['candidate', 'future_dynamic_validation']
    group_id: str | None = Field(default=None, max_length=100)
    segment_id: str | None = Field(default=None, max_length=100)
    human_confirmed: bool = False
    notes: str = Field(default='', max_length=2000)


def _rows(db, sid, kind):
    return [json.loads(row[0]) for row in db.execute(
        'SELECT payload FROM experience_records WHERE session_id=? AND kind=? ORDER BY rowid', (sid, kind))]


def _source(store, sid, fingerprint=None):
    with store.connect() as db:
        if not db.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='live_sessions'").fetchone():
            raise KeyError('No LIVE source for this Session')
    doc = load_source(store, sid, SourceRef(kind='live'))
    if fingerprint is not None:
        if doc['status'] not in ('STOPPED', 'AVAILABLE', 'FAILED', 'ERROR'):
            raise ValueError('Stop capture before reviewing immutable timeline evidence')
        if doc['fingerprint'] != fingerprint:
            raise ValueError('Source changed; reload the saved observations before reviewing')
    return doc


def _anchor(store, sid, frame):
    name = frame.get('snapshot', '')
    if not re.fullmatch(r'\d{12}\.jpg', name):
        raise ValueError('Invalid original frame name')
    folder = (store.root / 'live_frames' / sid).resolve()
    path = (folder / name).resolve()
    if not path.is_relative_to(folder) or not path.is_file():
        raise ValueError('Original evidence image is unavailable in this Session')
    return {key: frame.get(key) for key in (
        'observation_id', 'timestamp', 'frame_index', 'captured_at', 'evidence_ref', 'frame_url')}


def _by_id(store, sid, doc, oid):
    frame = next((f for f in doc['frames'] if f['observation_id'] == oid), None)
    if frame is None:
        raise ValueError('Observation does not belong to this Session source')
    return _anchor(store, sid, frame)


def _atomic_append(store, sid, kind, key, request, build):
    """The unique PK and write transaction protect retries and concurrent reviewers."""
    rid = digest([sid, kind, key])
    request_hash = digest(request)
    with store.connect() as db:
        db.execute('BEGIN IMMEDIATE')
        row = db.execute('SELECT payload FROM experience_records WHERE record_id=?', (rid,)).fetchone()
        if row:
            saved = json.loads(row[0])
            if saved['request_sha256'] != request_hash:
                raise ValueError('Idempotency key was already used with different content')
            return saved
        value = {**build(db), 'record_id': rid, 'session_id': sid, 'record_kind': kind,
                 'request_sha256': request_hash, 'created_at': utc()}
        db.execute('INSERT INTO experience_records VALUES (?,?,?,?,?)',
                   (rid, sid, kind, value['created_at'], json.dumps(value, ensure_ascii=False, allow_nan=False)))
        return value


def _find_group(imports, group_id):
    matches = [(item, group) for item in imports for group in item['groups'] if group['group_id'] == group_id]
    if len(matches) != 1:
        raise ValueError('Candidate group does not exist uniquely in this Session')
    return matches[0]


def _find_segment(group, segment_id):
    segment = next((s for s in group['segments'] if s['segment_id'] == segment_id), None)
    if segment is None:
        raise ValueError('Candidate segment does not belong to the selected group')
    return segment


def import_timeline(store, records, sid, body):
    require_acl(store, records, sid)

    def build(db):
        doc = _source(store, sid, body.source_fingerprint)
        if not doc['frames']:
            raise ValueError('No saved original frames for timeline import')
        existing = {g['group_id'] for item in _rows(db, sid, IMPORT) for g in item['groups']}
        if existing.intersection(g.group_id for g in body.groups):
            raise ValueError('Candidate group already exists; import is append-only')
        groups = []
        for group in body.groups:
            if group.candidate_start < doc['start'] or group.candidate_end > doc['end']:
                raise ValueError('Candidate window is outside saved observation times')
            value = group.model_dump()
            for segment in value['segments']:
                segment['evidence'] = [_by_id(store, sid, doc, oid) for oid in dict.fromkeys(segment['observation_ids'])]
                # Rounded candidate windows and actual saved-frame anchors are distinct.
                for edge in ('start', 'end'):
                    frame = min(doc['frames'], key=lambda f: abs(f['timestamp'] - segment['candidate_' + edge]))
                    segment[edge + '_anchor'] = _anchor(store, sid, frame)
                segment.update(status='AI_ASSISTED', actual_duration_seconds=None, review_id=None)
            groups.append(value)
        return {'import_key': body.import_key, 'review_reference': body.review_reference,
                'source_fingerprint': doc['fingerprint'], 'source_ref': doc['source_ref'],
                'method': 'AI_ASSISTED_VISUAL_REVIEW', 'verification_status': 'AI_ASSISTED',
                'model_inference_executed': False, 'groups': groups}

    return _atomic_append(store, sid, IMPORT, body.import_key, body.model_dump(), build)


def save_review(store, records, sid, body):
    require_acl(store, records, sid)
    if not body.human_confirmed:
        raise ValueError('Explicit researcher confirmation is required for a review action')

    def build(db):
        doc = _source(store, sid, body.source_fingerprint)
        imported, group = _find_group(_rows(db, sid, IMPORT), body.group_id)
        _find_segment(group, body.segment_id)
        if imported['source_fingerprint'] != doc['fingerprint']:
            raise ValueError('Imported candidate source changed; do not review against different observations')
        previous = [r for r in _rows(db, sid, REVIEW)
                    if r['group_id'] == body.group_id and r['segment_id'] == body.segment_id]
        current_id = previous[-1]['record_id'] if previous else None
        if current_id != body.expected_review_id:
            raise ValueError('Review changed; reload the current segment before saving')
        start = end = duration = None
        if body.status == 'HUMAN_VERIFIED':
            if body.start_observation_id is None or body.end_observation_id is None:
                raise ValueError('Confirmed boundaries require both actual playback observations')
            start = _by_id(store, sid, doc, body.start_observation_id)
            end = _by_id(store, sid, doc, body.end_observation_id)
            if end['timestamp'] < start['timestamp'] or end['frame_index'] < start['frame_index']:
                raise ValueError('End observation precedes start observation')
            duration = end['timestamp'] - start['timestamp']
        elif body.start_observation_id is not None or body.end_observation_id is not None:
            raise ValueError('Unconfirmed/rejected candidates cannot retain confirmed boundaries')
        return {**body.model_dump(), 'method': 'HUMAN_REVIEW', 'verification_status': body.status,
                'start_anchor': start, 'end_anchor': end, 'actual_duration_seconds': duration,
                'source_ref': doc['source_ref'], 'proves_product_success': False}

    return _atomic_append(store, sid, REVIEW, body.request_id, body.model_dump(), build)


def save_timeline_feedback_link(store, records, sid, body):
    require_acl(store, records, sid)
    if not body.human_confirmed:
        raise ValueError('Feedback association requires explicit researcher confirmation')

    def build(db):
        feedback = records.record(sid, body.feedback_record_id, 'acl_feedback')
        event = _feedback_event(store, sid, feedback, body.feedback_field)
        if body.target == 'candidate':
            if not body.group_id:
                raise ValueError('Feedback candidate association requires a group')
            _, group = _find_group(_rows(db, sid, IMPORT), body.group_id)
            if body.segment_id:
                _find_segment(group, body.segment_id)
        elif body.group_id or body.segment_id:
            raise ValueError('Future dynamic validation is not a completed candidate stage')
        # A second click with a new request key must not duplicate the same relation.
        identity = (body.feedback_record_id, body.feedback_field, body.target, body.group_id, body.segment_id)
        for link in _rows(db, sid, LINK):
            if tuple(link.get(k) for k in ('feedback_record_id', 'feedback_field', 'target', 'group_id', 'segment_id')) == identity:
                raise ValueError('This feedback association already exists')
        return {**body.model_dump(), 'feedback_event_id': event['event_id'],
                'original_quote': feedback['values'][body.feedback_field], 'method': 'HUMAN_INPUT',
                'verification_status': 'HUMAN_VERIFIED', 'link_kind': 'TOPIC_ASSOCIATION',
                'proves_causality': False, 'proves_stage_completion': False,
                'target_status': 'NOT_TESTED' if body.target == 'future_dynamic_validation' else 'CANDIDATE_REVIEW_SEPARATE'}

    return _atomic_append(store, sid, LINK, body.request_id, body.model_dump(), build)


def _media(doc):
    return {'kind': 'OBSERVATION_SEQUENCE', 'original_video_status': 'NOT_RECORDED',
            'original_video_url': None, 'frame_count': len(doc['frames']) if doc else 0,
            'limitations': 'Saved sampled frames only; gaps are not continuous video and no audio was recorded.'}


def timeline_context(store, records, sid):
    """Compact report/UI context; original rule candidates remain a separate source."""
    require_acl(store, records, sid)
    imports = records.list(sid, IMPORT)
    reviews = records.list(sid, REVIEW)
    links = records.list(sid, LINK)
    try:
        doc = _source(store, sid)
    except KeyError:
        doc = None
    groups = []
    for imported in imports:
        for original in imported['groups']:
            group = deepcopy(original)
            group['source_fingerprint'] = imported['source_fingerprint']
            group['source_unchanged'] = bool(doc and imported['source_fingerprint'] == doc['fingerprint'])
            group['method'] = 'AI_ASSISTED_VISUAL_REVIEW'
            for segment in group['segments']:
                selected = [r for r in reviews if r['group_id'] == group['group_id'] and r['segment_id'] == segment['segment_id']]
                if selected:
                    last = selected[-1]
                    segment.update(status=last['status'], review_id=last['record_id'], review_notes=last['notes'],
                        actual_duration_seconds=last['actual_duration_seconds'])
                    if last['status'] == 'HUMAN_VERIFIED':
                        segment.update(start_anchor=last['start_anchor'], end_anchor=last['end_anchor'])
                segment['review_count'] = len(selected)
                segment['linked_feedback'] = [l for l in links if l['group_id'] == group['group_id'] and l['segment_id'] == segment['segment_id']]
            statuses = [s['status'] for s in group['segments']]
            group['status'] = statuses[0] if len(set(statuses)) == 1 else 'AI_ASSISTED'
            group['review_counts'] = {status: statuses.count(status) for status in ('AI_ASSISTED', 'HUMAN_VERIFIED', 'REJECTED')}
            # Independent fragments do not certify the intervening time as action.
            group['actual_duration_seconds'] = group['segments'][0]['actual_duration_seconds'] if len(statuses) == 1 else None
            group['duration_basis'] = 'INDIVIDUAL_CONFIRMED_SEGMENTS_ONLY'
            group['linked_feedback'] = [l for l in links if l['group_id'] == group['group_id']]
            groups.append(group)
    feedback = []
    events = store.events(sid)
    for item in records.list(sid, 'acl_feedback'):
        for field, quote in item['values'].items():
            event = _feedback_event(store, sid, item, field, events)
            feedback.append({'feedback_record_id': item['record_id'], 'field': field, 'label': dict(FIELDS)[field],
                             'quote': quote, 'event_id': event['event_id'], 'verification_status': item['verification_status']})
    return {'session_id': sid, 'source_fingerprint': doc['fingerprint'] if doc else None,
            'source_status': doc['status'] if doc else 'NOT_CONNECTED', 'media': _media(doc),
            'groups': groups, 'feedback': feedback, 'feedback_links': links,
            'method': 'AI_ASSISTED_VISUAL_REVIEW', 'model_inference_executed': False,
            'time_unit': 'SESSION_SECONDS', 'display_format': 'MM:SS',
            'limitations': ['AI_ASSISTED candidates are not FACT or HUMAN_VERIFIED.',
                'Actual duration is shown only for explicitly confirmed sampled-frame boundaries.',
                'Candidate windows do not establish continuous action or successful product use.',
                'Feedback topic association does not establish causality.']}


def frame_manifest(store, records, sid, offset=0, limit=500):
    require_acl(store, records, sid)
    doc = _source(store, sid)
    return {'session_id': sid, 'source_fingerprint': doc['fingerprint'], 'source_status': doc['status'],
            **_media(doc), 'total': len(doc['frames']), 'offset': offset, 'limit': limit,
            'items': [_anchor(store, sid, f) for f in doc['frames'][offset:offset + limit]]}
