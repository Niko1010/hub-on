"""Offline fixtures only; no real provider or model request."""
import copy
from types import SimpleNamespace

import pytest
from analysis.evidence_batches import prepare_context


def events(count=8):
    return [{'event_id': f'e-{n}', 'session_id': 'SIMULATED-SESSION', 'timestamp': float(n),
             'description': f'SIMULATED event {n}', 'raw_text': f'SIMULATED quote {n}' if n % 2 else None,
             'simulated': True, 'source': 'manual'} for n in range(count)]


class FakeProvider:
    def __init__(self, mutate=None):
        self.calls = []; self.mutate = mutate

    def generate(self, request):
        self.calls.append(request)
        records = request.payload['untrusted_events']
        chosen = records[:2]
        data = {'summary': 'SIMULATED derived selection, no consumer truth established.',
            'selected_evidence_ids': [e['event_id'] for e in chosen],
            'quotes': [{'event_id': e['event_id'], 'quote': e['raw_text'] or e['description']} for e in chosen],
            'limitations': ['SIMULATED fixture; not real research.']}
        if self.mutate: self.mutate(data)
        return SimpleNamespace(data=data, provenance={'provider': 'FAKE_OFFLINE', 'model_inference_executed': False})


def test_small_context_is_complete_without_model_call():
    source=events(); provider=FakeProvider(); before=copy.deepcopy(source)
    selected,audit=prepare_context(source,provider,{'question':'TEST'})
    assert selected==before and source==before
    assert provider.calls==[] and audit['mode']=='DIRECT' and audit['selection_is_exhaustive']
    assert audit['source_coverage_ids']==[e['event_id'] for e in source]


def test_two_chunks_keep_every_original_id_and_selected_quote():
    source=events(); before=copy.deepcopy(source); provider=FakeProvider()
    selected,audit=prepare_context(list(reversed(source)),provider,{'question':'TEST'},max_events=4)
    assert source==before and len(provider.calls)==2 and audit['model_calls']==2
    assert not audit['selection_is_exhaustive'] and audit['mode']=='BATCHED_SELECTION'
    assert audit['source_coverage_ids']==[e['event_id'] for e in source]
    assert [e['event_id'] for e in selected]==['e-0','e-1','e-4','e-5']
    assert audit['not_selected_ids']==['e-2','e-3','e-6','e-7']
    assert set(audit['selected_ids'])|set(audit['not_selected_ids'])==set(audit['source_coverage_ids'])
    for request,note in zip(provider.calls,audit['derived_notes']):
        assert request.task=='research' and request.output_mode=='json'
        assert request.schema['properties']['selected_evidence_ids']['items']['enum']==[
            e['event_id'] for e in request.payload['untrusted_events']]
        assert note['classification']=='DERIVED' and not note['use_as_original_evidence']
        for quote in note['quotes']:
            event=next(e for e in selected if e['event_id']==quote['event_id'])
            assert quote['quote']==(event['raw_text'] or event['description'])


def test_batched_selection_is_exhaustive_when_every_event_is_selected():
    source=events(4); provider=FakeProvider()
    selected,audit=prepare_context(source,provider,{},max_events=2)
    assert len(provider.calls)==2 and selected==source
    assert audit['selection_is_exhaustive'] is True
    assert audit['not_selected_ids']==[]
    assert audit['selected_ids']==audit['source_coverage_ids']


@pytest.mark.parametrize('mutation',[
    lambda d:d.update(selected_evidence_ids=['foreign']),
    lambda d:d.update(selected_evidence_ids=[]),
    lambda d:d.update(selected_evidence_ids=['e-0','e-0']),
    lambda d:d['quotes'][0].update(quote='fabricated fact'),
    lambda d:d['quotes'][0].update(event_id='foreign'),
    lambda d:d.update(quotes=[]),
    lambda d:d.update(limitations=[]),
    lambda d:d.update(summary=' '),
    lambda d:d.update(unrequested_field=True),
])
def test_bad_summary_aborts_without_retry_or_next_chunk(mutation):
    provider=FakeProvider(mutation)
    with pytest.raises(ValueError): prepare_context(events(),provider,{},max_events=4)
    assert len(provider.calls)==1


def test_max_chunks_is_checked_before_any_call():
    provider=FakeProvider()
    with pytest.raises(ValueError,match='分段数'): prepare_context(events(),provider,{},max_events=1,max_chunks=4)
    assert not provider.calls


def test_oversize_last_event_preflight_prevents_partial_paid_work():
    source=events(); source[-1]['description']='大'*30000
    provider=FakeProvider()
    with pytest.raises(ValueError,match='单条'): prepare_context(source,provider,{},max_events=4,max_chars=20000)
    assert not provider.calls


def test_utf8_budget_counts_chinese_bytes_and_prompt_schema():
    source=events(2); provider=FakeProvider()
    source[0]['description']='中'*5000
    with pytest.raises(ValueError,match='单条'): prepare_context(source,provider,{},max_chars=14000)
    assert not provider.calls


def test_final_context_budget_refuses_instead_of_dropping_sources():
    provider=FakeProvider()
    with pytest.raises(ValueError,match='最终预算'):
        prepare_context(events(),provider,{},max_events=4,synthesis_max_chars=10)
    assert len(provider.calls)==2


def test_provider_error_stops_once_without_fallback():
    class Broken(FakeProvider):
        def generate(self, request):
            self.calls.append(request)
            raise RuntimeError('OFFLINE_TEST_FAILURE')
    provider=Broken()
    with pytest.raises(RuntimeError,match='OFFLINE_TEST_FAILURE'):
        prepare_context(events(),provider,{},max_events=4)
    assert len(provider.calls)==1


@pytest.mark.parametrize('mutation',[
    lambda e:e.append(copy.deepcopy(e[0])),
    lambda e:e[0].update(timestamp=float('nan')),
    lambda e:e[0].update(timestamp=-1),
    lambda e:e[0].update(session_id=None),
    lambda e:e[0].update(description=' '),
])
def test_invalid_originals_rejected_before_calls(mutation):
    source=events(); mutation(source); provider=FakeProvider()
    with pytest.raises(ValueError): prepare_context(source,provider,{},max_events=4)
    assert not provider.calls
