"""Only creates labelled fixture events; never calls recognition/model services."""
from backend.models import Event
from backend.provenance import labels


def fixture_events(sid,fixture,assets):
    result=[]
    for raw in fixture['events']:
        item=dict(raw);end=item.pop('end_timestamp',item['timestamp'])
        source=item['source'];aid=assets.get(source)
        evidence={'fixture':'sample_data/decision_session.example.json'}
        if aid:
            evidence['asset_id']=aid
        meta={**labels(True,'MOCK'),'model_inference_executed':False,'offset_seconds':0,
              'origin':'MOCK/fixture-not-recognition','end_timestamp':end}
        if source=='video': evidence['media_time']=item['timestamp']
        if item['event_type']=='utterance':
            evidence.update(quote=item['description'],start=item['timestamp'],end=end)
            meta.update(raw_text=item['description'],cleaned_text=item['description'],timing='scripted',
                        speaker='SIMULATED_P01',speaker_status='scripted_not_diarization')
        result.append(Event(session_id=sid,confidence=None,evidence=evidence,metadata=meta,**item))
    return result
