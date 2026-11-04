"""Build a read-only static REPLAY of one SIMULATED run for GitHub Pages."""
import json
from pathlib import Path
import shutil

ROOT=Path(__file__).resolve().parents[1]


def main(source=None,runtime_root=None):
    source=Path(source) if source else ROOT/'artifacts/online-preview-run'
    runtime_root=Path(runtime_root) if runtime_root else ROOT/'runtime/online-preview'
    session=json.loads((source/'session.json').read_text(encoding='utf-8'))
    events=json.loads((source/'events.json').read_text(encoding='utf-8'))
    report=json.loads((source/'report.json').read_text(encoding='utf-8'))
    assert session['simulated'] and report['simulated']
    assert all(e['metadata'].get('simulated') is True for e in events)
    sid=session['session_id'];out=ROOT/'preview-site'
    out.mkdir(exist_ok=True)
    for name in ['style.css','brand.css','research.css','space.css','space-3d.css','mark.svg']:
        shutil.copyfile(ROOT/'frontend'/name,out/name)
    shutil.copytree(ROOT/'frontend/assets',out/'assets',dirs_exist_ok=True)
    media={}
    for asset in session['assets']:
        original=runtime_root/'uploads'/sid/asset['filename']
        target=out/'media'/asset['filename'];target.parent.mkdir(exist_ok=True)
        shutil.copyfile(original,target)
        media[asset['asset_id']]='./media/'+asset['filename']
        frames=runtime_root/'frames'/sid/asset['asset_id']
        if frames.is_dir():
            shutil.copytree(frames,out/'frames'/asset['asset_id'],dirs_exist_ok=True)
    # Published evidence links point to exported files, not the private runtime API.
    for entry in report.get('evidence_index',{}).values():
        aid=entry.get('asset_id')
        if aid in media:
            if entry.get('frame_url'):
                old_frame=entry['frame_url']
                frame=entry['frame_url'].rsplit('/',1)[-1]
                entry['frame_url']='./frames/'+aid+'/'+frame
                report['markdown']=report['markdown'].replace(old_frame,entry['frame_url'])
            old=entry.get('media_url');entry['media_url']=media[aid]
            if old: report['markdown']=report['markdown'].replace(old,media[aid])
    report['markdown']='> ONLINE PREVIEW / REPLAY：仅回放 SIMULATED 演示记录，本页不执行模型或接收上传。\n\n'+report['markdown']
    (out/'report.md').write_text(report['markdown'],encoding='utf-8')
    (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'events.json').write_text(json.dumps(events,ensure_ascii=False,indent=2),encoding='utf-8')
    feedback={k:report[k] for k in ['feedback','keywords','clusters','pain_points','sentiments','utterance_count','method']}
    stats={'events':len(events),'utterances':report['utterance_count'],
           'duration_seconds':max(e['metadata'].get('end_timestamp',e['timestamp']) for e in events),
           'report_ready':True}
    payload={'session':session,'events':events,'report':report,'feedback':feedback,'stats':stats,'media':media}
    (out/'preview-data.js').write_text('window.HUBONE_REPLAY='+json.dumps(payload,ensure_ascii=False)+';\n',encoding='utf-8')
    hook='''// STATIC REPLAY ONLY. No online inference or pretend upload endpoints.
(() => {
 const d=window.HUBONE_REPLAY, original=window.fetch.bind(window);
 localStorage.setItem('hubone-preview-session',d.session.session_id);
 const json=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));
 window.fetch=(input,options={})=>{
  const path=String(input);
  if(!path.startsWith('/api/'))return original(input,options);
  const p=path.slice(4), prefix='/sessions/'+d.session.session_id;
  if(!['GET','HEAD'].includes(options.method||'GET')){
   if(p==='/demo')return json({session_id:d.session.session_id,job:{job_id:'replay'}});
   return json({detail:'只读 REPLAY 预览不接收上传或运行分析，请使用完整后端。'},409);
  }
  if(p==='/health')return json({status:'ok',mode:'REPLAY'});
  if(p==='/capabilities')return json({asr_provider:'replay',sample_ready:true});
  if(p==='/sessions')return json([d.session]);
  if(p===prefix)return json(d.session);
  if(p===prefix+'/events')return json(d.events);
  if(p===prefix+'/stats')return json(d.stats);
  if(p===prefix+'/feedback')return json(d.feedback);
  if(p===prefix+'/report')return json(d.report);
  if(p===prefix+'/jobs/replay')return json({status:'completed',progress:1,message:'回放记录已载入；未运行模型'});
  return json({detail:'只读预览中没有此接口'},404);
 };
 const readonly=()=>{
  document.querySelectorAll('[data-action],[data-reprocess],#new-session,#session-sim,#analysis-provider,#research-relationship,input[type=file]').forEach(e=>{
   if(!e.disabled)e.disabled=true;e.title='只读演示记录；在线预览不接收上传、不运行模型';
  });
  document.querySelectorAll('textarea,input[type=number]').forEach(e=>e.readOnly=true);
  const analysis=document.querySelector('#analysis-provider');
  if(analysis&&d.report.processing_method==='MOCK')analysis.value='mock';
 };
 new MutationObserver(readonly).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});readonly();
})();
'''
    (out/'preview-api.js').write_text(hook,encoding='utf-8')
    app=(ROOT/'frontend/app.js').read_text(encoding='utf-8').replace('hubone-session','hubone-preview-session')
    app=app.replace("function mediaUrl(asset){return `/api/sessions/${state.sid}/assets/${asset.asset_id}`;}",
                    'function mediaUrl(asset){return window.HUBONE_REPLAY.media[asset.asset_id];}')
    app=app.replace('${mediaUrl(asset)}/frames/${esc(e.evidence.snapshot)}','./frames/${asset.asset_id}/${esc(e.evidence.snapshot)}')
    app=app.replace('/api/sessions/${state.sid}/report.md','./report.md').replace('/api/sessions/${state.sid}/report.json','./report.json').replace('/api/sessions/${state.sid}/events.json','./events.json')
    app=app.replace('href="./report.md"','download="crestc3-replay-report.md" href="./report.md"')
    app=app.replace('href="./report.json"','download="crestc3-replay-report.json" href="./report.json"')
    app=app.replace('href="./events.json"','download="crestc3-replay-events.json" href="./events.json"')
    a=app.index('function connectStream(){');b=app.index('function stopPreview()',a)
    app=app[:a]+'function connectStream(){}\n'+app[b:]
    app=app.replace("'研究服务在线'","'演示记录回放 · REPLAY'")
    app=app.replace('处理完成 · 结果已保存','示例已回放 · 未运行模型')
    app=app.replace('完整 SIMULATED 链路已运行，可查看时间轴、反馈和报告。','SIMULATED 记录已重新载入；本页没有运行模型。')
    app=app.replace("['capture','◉','实时采集'","['capture','◉','采集记录'")
    (out/'app.js').write_text(app,encoding='utf-8')
    html=(ROOT/'frontend/index.html').read_text(encoding='utf-8').replace('/static/','./')
    html=html.replace('<main>','<main><div class="preview-notice">ONLINE PREVIEW · REPLAY / SIMULATED<br>只读回放已保存的演示记录：可切换页面、播放媒体、查看证据和下载报告。上传、采集及模型推理未在此站点运行。REAL_MODEL / RULE_BASED 标记指原记录的处理方式。</div>')
    html=html.replace('▷ 运行完整演示 <span>SIMULATED</span>','▷ 重新加载示例 <span>SIMULATED / REPLAY</span>')
    html=html.replace('<a href="/docs" target="_blank" rel="noreferrer" class="api-link">API ↗</a>','<span class="api-link">只读预览</span>')
    html=html.replace('<script type="module"','<script src="./preview-data.js?v=0.3.1"></script><script src="./preview-api.js?v=0.3.1"></script><script type="module"')
    (out/'index.html').write_text(html,encoding='utf-8')
    with (out/'style.css').open('a',encoding='utf-8') as f:
        f.write('\n.preview-notice{margin-top:20px;padding:14px 18px;border:1px solid #dbcda8;background:#fff9e8;color:#7e693d;border-radius:7px;font-size:11px;line-height:1.9}.button:disabled{cursor:not-allowed}\n')
    (out/'.nojekyll').touch()
    shutil.copyfile(ROOT/'THIRD_PARTY_NOTICES.md',out/'THIRD_PARTY_NOTICES.md')
    (out/'README.md').write_text('# HUB ONE × CREST C3 online preview\n\nRead-only SIMULATED replay. No uploads, live inference, or secret values.\n',encoding='utf-8')
    print('Static SIMULATED REPLAY built:',out)


if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--replay-source',type=Path)
    parser.add_argument('--runtime-root',type=Path)
    args=parser.parse_args()
    main(args.replay_source,args.runtime_root)
