import json
import threading
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer

import pytest

from adapters.llm import generate_insights
from analysis.report import build_report
from audio.pipeline import transcript_events
from backend.models import Segment,Session,Event


@pytest.mark.parametrize('simulated,origin,method',[
    (True,'sherpa-onnx/SenseVoice-int8-cpu','REAL_MODEL'),
    (True,'SIMULATED/fixture-sidecar','SIMULATED'),
    (False,'sherpa-onnx/SenseVoice-int8-cpu','REAL_MODEL'),
    (False,'manual_text','MANUAL'),
])
def test_input_origin_is_independent_from_algorithm(simulated,origin,method):
    event=transcript_events('s',[Segment(start=1,end=2,text='腰部有点紧。')],
        simulated=simulated,origin=origin)[0]
    assert event.metadata['processing_method']==method
    assert (event.metadata['input_origin']=='SIMULATED') is simulated
    report=build_report(Session(session_id='s',simulated=simulated).model_dump(),[event.model_dump()])
    assert report['processing_method']=='RULE_BASED'
    assert all(i['processing_method']=='RULE_BASED' for i in report['insights'])
    assert report['simulated']==simulated
    assert 'RULE_BASED' in report['markdown']


def test_report_rejects_wrong_session_and_derived_citations():
    session=Session(session_id='s').model_dump()
    event=Event(session_id='other',timestamp=1,source='manual',event_type='utterance',description='腰部紧').model_dump()
    with pytest.raises(ValueError,match='Session'):
        build_report(session,[event])
    event.update(session_id='s',source='AI_analysis')
    with pytest.raises(ValueError,match='派生'):
        build_report(session,[event])


@pytest.mark.parametrize('provider,with_key',[('ollama',False),('openai',False),('openai',True)])
def test_local_llm_http_contract(provider,with_key,monkeypatch):
    """Real loopback HTTP transport, MOCK responses; this is not LLM inference."""
    received=[]
    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):
            data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
            received.append({'path':self.path,'data':data,'auth':self.headers.get('Authorization')})
            payload={'summary':'MOCK_HTTP 协议验收','insights':[{'title':'腰带体验',
                'finding':'给定原话反馈腰部紧，待验证。','priority':'P2','evidence_ids':['e1'],
                'recommendation':'比较松紧档位','next_experiment':'同人交叉对照测试'}]}
            body=json.dumps({'choices':[{'message':{'content':json.dumps(payload,ensure_ascii=False)}}]}).encode()
            self.send_response(200);self.send_header('Content-Type','application/json')
            self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
        def log_message(self,*args):
            pass
    server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    try:
        monkeypatch.setenv('LLM_PROVIDER',provider)
        monkeypatch.setenv('LLM_BASE_URL',f'http://127.0.0.1:{server.server_port}'+('' if provider=='ollama' else '/v1'))
        monkeypatch.setenv('LLM_MODEL','protocol-test-model')
        # A global remote API key must not be forwarded to an unrelated local server.
        monkeypatch.setenv('OPENAI_API_KEY','test-global-key-must-not-be-forwarded')
        if with_key:monkeypatch.setenv('LLM_API_KEY','test-local-key')
        else:monkeypatch.delenv('LLM_API_KEY',raising=False)
        result=generate_insights([{'event_id':'e1','description':'腰部有点紧。','source':'manual'}],'Crest C3')
        assert result['insights'][0]['evidence_ids']==['e1']
        assert received[0]['path']=='/v1/chat/completions'
        assert received[0]['auth']==('Bearer test-local-key' if with_key else None)
        assert received[0]['data']['model']=='protocol-test-model'
    finally:
        server.shutdown();server.server_close();thread.join(timeout=3)
