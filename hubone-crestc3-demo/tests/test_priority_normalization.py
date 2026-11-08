"""Offline score derivation tests; no model, network, config or database access."""
from copy import deepcopy
import json

import pytest

from adapters.mock_provider import MockProvider
from adapters.providers import GenerationRequest
from analysis.decision import evidence_snapshot, validate_analysis
from analysis.demo import fixture_events
from analysis.intelligence import normalize_model_priorities
from backend.config import ROOT
from backend.models import ResearchBrief, Session


@pytest.fixture
def scenario():
    fixture=json.loads((ROOT/'sample_data/decision_session.example.json').read_text(encoding='utf-8'))
    session=Session(session_id='priority-normalization-test',simulated=True,
                    research=ResearchBrief(**fixture['research'])).model_dump()
    events=[event.model_dump() for event in fixture_events(session['session_id'],fixture,{})]
    index=evidence_snapshot(session,events)
    payload={'untrusted_events':list(index.values()),'simulated_session':True,
             'research':session['research']}
    raw=MockProvider().generate(GenerationRequest('',payload)).data
    validate_analysis(raw,index,require_v11=True,research=session['research'])
    return raw,index,session['research']


def corrupt_priorities(raw):
    raw['decision_cards'][0].update(impact=4,urgency=5,effort=3,
                                    priority_score=3,priority='P3')
    raw['options'][0]['priority']='P2'


def test_derives_only_redundant_fields_and_audits_old_new_values(scenario):
    raw,index,research=scenario
    corrupt_priorities(raw)
    before=deepcopy(raw)
    normalized,changes=normalize_model_priorities(raw)
    expected=deepcopy(before)
    expected['decision_cards'][0].update(priority_score=12,priority='P1')
    expected['options'][0]['priority']='P1'
    assert normalized==expected
    assert raw==before
    option_id=raw['options'][0]['option_id']
    assert changes==[
        {'option_id':option_id,'field':'decision_cards[0].priority_score','old':3,'new':12},
        {'option_id':option_id,'field':'decision_cards[0].priority','old':'P3','new':'P1'},
        {'option_id':option_id,'field':'options[0].priority','old':'P2','new':'P1'},
    ]
    assert validate_analysis(normalized,index,require_v11=True,research=research)==normalized


@pytest.mark.parametrize('factors,score,priority',[
    ((1,1,5),3,'P3'),((2,2,3),7,'P3'),((3,2,3),8,'P2'),
    ((4,4,3),11,'P2'),((4,5,3),12,'P1'),((5,5,1),15,'P1'),
])
def test_formula_boundaries(scenario,factors,score,priority):
    raw,index,research=scenario
    raw['decision_cards'][0].update(zip(('impact','urgency','effort'),factors))
    normalized,_=normalize_model_priorities(raw)
    card=normalized['decision_cards'][0]
    assert card['priority_score']==score
    assert card['priority']==normalized['options'][0]['priority']==priority
    assert tuple(card[key] for key in ('impact','urgency','effort'))==factors
    validate_analysis(normalized,index,require_v11=True,research=research)


def test_normalization_is_idempotent_and_deeply_detached(scenario):
    raw,_,_=scenario
    corrupt_priorities(raw)
    first,_=normalize_model_priorities(raw)
    second,changes=normalize_model_priorities(first)
    assert second==first and changes==[]
    assert second is not first
    second['decision_cards'][0]['risks'].append('test-only change')
    assert 'test-only change' not in first['decision_cards'][0]['risks']
    assert 'test-only change' not in raw['decision_cards'][0]['risks']


def test_card_order_does_not_change_option_mapping(scenario):
    raw,index,research=scenario
    corrupt_priorities(raw)
    raw['decision_cards'].reverse()
    normalized,changes=normalize_model_priorities(raw)
    card=next(card for card in normalized['decision_cards']
              if card['option_id']==normalized['options'][0]['option_id'])
    assert card['priority_score']==12 and card['priority']=='P1'
    assert normalized['options'][0]['priority']=='P1'
    assert {change['field'] for change in changes}=={
        'decision_cards[1].priority_score','decision_cards[1].priority','options[0].priority'}
    validate_analysis(normalized,index,require_v11=True,research=research)


@pytest.mark.parametrize('mutation',[
    lambda raw:raw['options'].append(deepcopy(raw['options'][0])),
    lambda raw:raw['decision_cards'].append(deepcopy(raw['decision_cards'][0])),
    lambda raw:raw['decision_cards'][1].update(option_id=raw['decision_cards'][0]['option_id']),
    lambda raw:raw['options'][1].update(option_id=raw['options'][0]['option_id']),
    lambda raw:raw['decision_cards'].pop(),
    lambda raw:raw['decision_cards'][0].update(option_id='foreign-option'),
])
def test_rejects_ambiguous_missing_or_foreign_card_mapping(scenario,mutation):
    raw,_,_=scenario
    mutation(raw)
    before=deepcopy(raw)
    with pytest.raises(ValueError,match='exactly one'):
        normalize_model_priorities(raw)
    assert raw==before


@pytest.mark.parametrize('mutation',[
    lambda raw:raw['decision_cards'][0].update(impact=0),
    lambda raw:raw['decision_cards'][0].update(effort=6),
    lambda raw:raw['decision_cards'][0].update(urgency=2.5),
    lambda raw:raw['decision_cards'][0].update(priority_score=99),
    lambda raw:raw['decision_cards'][0].update(priority='P0'),
    lambda raw:raw['decision_cards'][0].pop('impact'),
    lambda raw:raw['decision_cards'][0].update(extra_field='not allowed'),
])
def test_schema_failure_is_not_repaired(scenario,mutation):
    raw,_,_=scenario
    mutation(raw)
    before=deepcopy(raw)
    with pytest.raises(ValueError):
        normalize_model_priorities(raw)
    assert raw==before


@pytest.mark.parametrize('mutation',[
    lambda raw:raw['claims'][0].update(evidence_ids=['foreign-event']),
    lambda raw:raw['claims'][0].update(statement='Fabricated FACT, not verbatim source evidence.'),
    lambda raw:raw['decision_cards'][0].update(experiment_ids=['foreign-experiment']),
    lambda raw:raw['decision_cards'][0].update(decision_owner='Invented owner'),
    lambda raw:raw['decision_cards'][0].update(evidence_strength='CORROBORATED'),
    lambda raw:raw['options'][0].update(diagnosis_ids=['foreign-diagnosis']),
    lambda raw:raw['experiments'][0].update(option_ids=['foreign-option']),
    lambda raw:raw['options'][0].update(change='This observation proves sales conversion.'),
    lambda raw:raw['decision_cards'][0].update(evidence_ids=raw['decision_cards'][0]['evidence_ids'][:1]),
])
def test_score_correction_never_repairs_or_bypasses_evidence_guards(scenario,mutation):
    raw,index,research=scenario
    corrupt_priorities(raw)
    mutation(raw)
    before=deepcopy(raw)
    normalized,changes=normalize_model_priorities(raw)
    assert changes
    restored=deepcopy(normalized)
    for group,field in [('decision_cards','priority_score'),('decision_cards','priority'),('options','priority')]:
        for item,original in zip(restored[group],before[group]):
            item[field]=original[field]
    assert restored==before
    assert raw==before
    with pytest.raises(ValueError):
        validate_analysis(normalized,index,require_v11=True,research=research)


def test_direct_validator_still_rejects_bad_arithmetic(scenario):
    raw,index,research=scenario
    corrupt_priorities(raw)
    with pytest.raises(ValueError):
        validate_analysis(raw,index,require_v11=True,research=research)


def test_no_options_is_a_valid_no_op(scenario):
    raw,_,_=scenario
    raw.update(options=[],decision_cards=[],experiments=[])
    normalized,changes=normalize_model_priorities(raw)
    assert normalized==raw and changes==[]
