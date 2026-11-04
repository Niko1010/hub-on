const $ = (q) => document.querySelector(q);
const esc = (x) => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clock = (s=0) => `${String(Math.floor(s/60)).padStart(2,'0')}:${(s%60).toFixed(1).padStart(4,'0')}`;
const iconPaths={
  space:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3ZM9 3v15M15 6v15"/>',
  capture:'<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 9 5-3v12l-5-3"/>',
  timeline:'<path d="M7 3v18M11 6h9M11 12h6M11 18h9"/><circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/>',
  feedback:'<path d="M20 14a4 4 0 0 1-4 4H9l-5 3V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4Z"/><path d="M8 8h8M8 12h5"/>',
  insights:'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
  report:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  microphone:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/>',
  events:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
function icon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.events}</svg>`;}
const pages = [
  ['capture','◉','采集记录','让每一次体验，都有迹可循。','视频、语音与人工观察，在同一个体验 Session 汇合。'],
  ['timeline','≋','体验时间轴','还原体验发生的每一刻。','按统一时间线回看行为、原话和人工观察。'],
  ['feedback','◌','消费者反馈','听见反馈背后的关注点。','保留消费者原话，以产品主题聚合相似反馈。'],
  ['insights','✧','产品洞察','从真实证据，到改进假设。','每个产品建议，都能回到最初的体验证据。'],
  ['report','▤','研究报告','把一次体验，沉淀为研究。','完整研究记录、证据索引与下一轮验证实验。'],
];
// Integrated local review: public CAD-derived viewer and C3 1.1 replay in one shell.
if(!window.HUBONE_REPLAY||window.HUBONE_SPACE_PREVIEW)pages.unshift(['space','⌖','空间智能','Space Intelligence','观前街1号 · 建筑空间数字孪生']);
let spaceView=null,renderGeneration=0;
const state = {sid:localStorage.getItem('hubone-etd-1-1-20261104-session'),session:null,sessions:[],events:[],feedback:null,report:null,comparisonReport:null,
  stats:{},cap:{},page:'capture',filter:'all',busy:false,stream:null,device:null,recorder:null};

async function api(path, opts={}) {
  const headers = opts.body instanceof FormData ? {} : {'Content-Type':'application/json'};
  const res = await fetch('./api'+path,{...opts,headers:{...headers,...opts.headers}});
  if(!res.ok){
    let data;try{data=await res.json();}catch{throw Error(`请求失败：HTTP ${res.status}`);}
    throw Error(typeof data.detail==='string'?data.detail:JSON.stringify(data.detail));
  }
  return res.json();
}
const post=(path,body)=>api(path,{method:'POST',body:JSON.stringify(body)});
function error(e){$('#error-panel').textContent=e.message||String(e);$('#error-panel').hidden=false;}
function clearError(){$('#error-panel').hidden=true;}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,3500);}
function mediaUrl(asset){return window.HUBONE_REPLAY.media[asset.asset_id];}
function evidenceButtons(ids){return ids.map(id=>`<button class="quote-link" data-evidence="${esc(id)}">↗ E:${esc(id.slice(0,7))}</button>`).join('');}
function empty(title,text){return `<div class="empty"><strong>${esc(title)}</strong>${esc(text)}</div>`;}
function requireSession(){if(!state.sid)throw Error('请先新建 Session，或运行完整演示。');}
function isSim(){return state.session?.simulated||state.session?.assets.some(a=>a.simulated)||state.events.some(e=>e.metadata.simulated);}
function sessionBadge(){if(state.page==='space'){$('#mode').className='pill model';$('#mode').textContent='CAD SOURCE · mm';return;}const sim=isSim();$('#mode').className='pill'+(sim?' sim':'');$('#mode').textContent=sim?'SIMULATED · 演示资料':state.sid?'USER INPUT · 待复核':'尚无 Session';}

async function refreshSessions(){
  const sessions=await api('/sessions');
  state.sessions=sessions;
  $('#session-select').innerHTML='<option value="">选择或新建 Session</option>'+sessions.map(s=>`<option value="${esc(s.session_id)}">${esc(s.name)}</option>`).join('');
  $('#session-select').value=state.sid||'';
  return sessions;
}
async function loadData(){
  if(!state.sid)return;
  const sid=state.sid;
  const [session,events,stats,feedback]=await Promise.all([
    api(`/sessions/${sid}`),api(`/sessions/${sid}/events`),api(`/sessions/${sid}/stats`),api(`/sessions/${sid}/feedback`)]);
  if(sid!==state.sid)return;
  Object.assign(state,{session,events,stats,feedback,report:null,comparisonReport:null});
  if(stats.report_ready)state.report=await api(`/sessions/${sid}/report`);
  $('#session-id').textContent='ID '+sid.slice(0,12)+' · SESSION TIME';
  sessionBadge();
}
async function selectSession(sid){
  if(state.recorder?.state==='recording')throw Error('请先停止当前录制。');
  state.stream?.close();state.stream=null;
  stopPreview();
  state.sid=sid||null;state.session=null;state.events=[];state.feedback=null;state.report=null;state.comparisonReport=null;state.stats={};
  $('#job-panel').hidden=true;$('#job-message').textContent='等待新任务';
  localStorage.setItem('hubone-etd-1-1-20261104-session',sid||'');
  $('#session-select').value=sid||'';
  if(sid){await loadData();connectStream();}else sessionBadge();
  render();
}
function connectStream(){}
function stopPreview(){state.device?.getTracks().forEach(t=>t.stop());state.device=null;}
function navigate(){
  const next=location.hash.replace('#','')||'capture';
  if(state.recorder?.state==='recording'){
    toast('请先停止录制，再切换页面。');location.hash=state.page;return;
  }
  stopPreview();state.page=pages.some(p=>p[0]===next)?next:'capture';render();
}
function render(){
  spaceView?.destroy();spaceView=null;const generation=++renderGeneration;
  const page=pages.find(p=>p[0]===state.page);
  const spatial=state.page==='space';document.body.classList.toggle('is-space',spatial);
  $('#nav').innerHTML=pages.map((p,i)=>`${p[0]==='capture'&&!window.HUBONE_REPLAY?'<span class="nav-section-label">CREST C3 EXPERIENCE LAB</span>':''}<a href="#${p[0]}" class="nav-link ${p[0]===state.page?'active':''}"><span class="nav-icon">${icon(p[0])}</span><span class="nav-text">${p[2]}</span><span class="nav-index">0${i+1}</span></a>`).join('');
  $('#breadcrumb').textContent=page[2];$('#page-title').textContent=page[3];$('#page-subtitle').textContent=page[4];
  $('#workspace-context').textContent=spatial?'Space Intelligence':'Crest C3';
  $('#page-eyebrow').textContent=spatial?'HUB ONE / SPACE INTELLIGENCE':'MULTIMODAL CONSUMER RESEARCH';
  $('#footer-product').textContent=spatial?'HUB ONE · SPACE INTELLIGENCE':'HUB ONE × CREST C3';
  $('#footer-note').textContent=spatial?'真实 CAD 几何 · 设备与消费者行为尚未连接':'证据驱动的产品研究 · 所有改进建议均待验证';
  $('#content').innerHTML=spatial?'<div class="card card-body small-note">正在连接空间数据…</div>':({capture:renderCapture,timeline:renderTimeline,feedback:renderFeedback,insights:renderInsights,report:renderReport}[state.page])();
  if(spatial)import('./space.js?v=etd-1-1-20261105-integrated').then(module=>{if(generation===renderGeneration)spaceView=module.mountSpace($('#content'));}).catch(error);
  $('#demo-btn').disabled=state.busy;$('#session-select').disabled=state.busy;$('#new-session').disabled=state.busy;
  sessionBadge();
}
function statCards(){
  const values=[['事件记录',state.stats.events||0,'条','视频 / 语音 / 人工 / 分析'],['语音原话',state.stats.utterances||0,'条','保留原文与时间戳'],['主题关注点',state.feedback?.clusters.length||0,'组','按产品主题聚合'],['体验时间线',clock(state.stats.duration_seconds||0),'','相对于 Session 起点']];
  return `<div class="stats">${values.map(([label,value,unit,note],i)=>`<div class="stat"><div class="stat-label">${label}<span>${icon(["events","microphone","feedback","clock"][i])}</span></div><div class="stat-value">${value}<span>${unit}</span></div><div class="stat-note">${note}</div></div>`).join('')}</div>`;
}
function miniEvents(){
  return state.events.length?state.events.slice(-6).reverse().map(e=>`<div class="mini-event"><span class="event-dot ${esc(e.source)}"></span><time>${clock(e.timestamp)}</time><div><p>${esc(e.description)}</p><small>${sourceLabel(e.source)} · ${esc(e.metadata.processing_method||'UNVERIFIED')}${e.metadata.simulated?' · SIMULATED':''}</small></div></div>`).join(''):empty('等待第一个事件','上传资料后，识别事件会在这里出现。');
}
function sourceLabel(source){return {video:'视频观测',audio:'语音转录',manual:'人工输入',AI_analysis:'研究假设'}[source]||source;}
function provenanceTags(event){
  const m=event.metadata||event;
  const method=m.processing_method||'UNVERIFIED';
  const origin=m.simulated?'SIMULATED':(m.input_origin||'UNVERIFIED');
  const originText={SIMULATED:'SIMULATED',REAL_RECORDING_REFERENCE:'真实参考录像 / 录音',USER_PROVIDED:'用户资料 · 来源待核',MANUAL:'人工录入',EVIDENCE_DERIVED:'引用原始证据',UNVERIFIED:'历史资料 · 未核验'}[origin]||origin;
  const tone=method==='REAL_MODEL'?'model':method==='RULE_BASED'?'rule':'';
  return `<span class="pill ${origin==='SIMULATED'?'sim':''}" title="${esc(origin)}" data-origin="${esc(origin)}">输入 ${esc(originText)}</span> <span class="pill ${tone}">处理 ${esc(method)}</span>`;
}
function assetOffset(asset){
  return state.events.find(e=>e.evidence.asset_id===asset?.asset_id && ['video','audio'].includes(e.source))?.metadata.offset_seconds||0;
}
function renderCapture(){
  const video=state.session?.assets.find(a=>a.kind==='video');
  const audio=state.session?.assets.find(a=>a.kind==='audio');
  const crestReference=video?.input_origin==='REAL_RECORDING_REFERENCE'&&video?.reference_product==='Crest C3';
  return statCards()+researchBrief()+`<div class="content-grid"><section class="card"><div class="card-head"><h2><span class="status-dot"></span> 体验现场</h2><span class="sub">${crestReference?'CREST C3 · 官方参考画面':'YOLO · REAL_MODEL / 行为 · RULE_BASED'}</span></div>
    <div class="video-stage"><span class="overlay-label">${crestReference?'CREST C3 · 官方参考视频':isSim()?'SIMULATED INPUT':'EXPERIENCE · 01'}</span>${video?`<video id="experience-video" controls preload="metadata" src="${mediaUrl(video)}"></video>`:`<div class="video-empty"><svg viewBox="0 0 100 100" fill="none"><rect x="15" y="25" width="52" height="44" rx="10" stroke="currentColor" stroke-width="1.3"/><path d="m67 40 19-9v31l-19-9M31 48h20m-10-10v20" stroke="currentColor" stroke-width="1.3"/></svg><h3>新的产品洞察，从这里开始。</h3><p>上传一段体验视频，或在本地浏览器开启采集。<br>也可以运行完整的 SIMULATED 演示。</p></div>`}<span class="overlay-corner">HUB ONE / EXPERIENCE LAB</span></div>
    <div class="capture-toolbar"><span class="small-note">${video?esc(video.original_name):'MP4 / WebM · 最长 10 分钟'}</span><div><button class="button" data-action="camera">▣ 开启摄像头预览</button> <button class="button" id="record-video" data-action="record-video">● 录制体验</button></div></div>
    ${crestReference?'<p class="device-warning">探路者官方 Crest C3 展会试穿参考片段；与合成语音独立采集，演示事件和研究假设仍为 SIMULATED，不代表视频中人物的真实反馈。<br><a href="https://weibo.com/tv/show/1034:5334827235475466" target="_blank" rel="noreferrer">参考视频来源 ↗</a> · REAL_RECORDING_REFERENCE</p>':''}
    <p class="device-warning">云端不访问本地设备；采集需浏览器权限，且需 HTTPS 或 localhost。录制从本 Session 的所填偏移时间开始。</p>
    <div class="upload-grid"><div class="upload-zone"><label><strong>↥ 上传体验视频</strong><p>MP4 / MOV / AVI / WebM · 200 MB</p><input id="video-file" type="file" accept="video/mp4,video/webm,video/quicktime,.avi"></label><button class="button small" data-action="upload-video">上传并分析视频</button></div><div class="upload-zone"><label><strong>↥ 上传体验语音</strong><p>WAV / MP3 / M4A / OGG / WebM</p><input id="audio-file" type="file" accept="audio/*,.webm"></label><button class="button small" data-action="upload-audio">上传并转录语音</button></div></div>
    <div class="card-body"><div class="form-row"><label>视频起点偏移（秒） <input type="number" id="video-offset" value="${assetOffset(video)}" min="0" step="0.1"></label><label>音频起点偏移（秒） <input type="number" id="audio-offset" value="${assetOffset(audio)}" min="0" step="0.1"></label></div><p class="small-note">独立录制的音视频需要手动填写与 Session 起点的偏移。默认体验区为画面内 5%–95% 矩形；API 支持自定义归一化多边形。</p>${assetList()}</div></section>
    <div class="stack"><section class="card"><div class="card-head"><h2>语音采集</h2><span class="sub">AUDIO INPUT</span></div><div class="card-body"><div class="audio-status"><span class="audio-symbol">${icon("microphone")}</span><div><strong>${audio?'音频已接入':'等待语音输入'}</strong><small>ASR · ${esc(state.cap.asr_provider||'none')} / CPU</small></div></div><div class="waveform" id="waveform" aria-label="音频状态装饰，非实时音量">${'<i></i>'.repeat(43)}</div>${audio?`<audio class="audio-player" controls src="${mediaUrl(audio)}"></audio>`:''}<div class="form-actions"><button class="button small" data-action="microphone" id="record-audio">● 录制麦克风</button></div><p class="small-note">${state.cap.asr_provider==='none'?'尚未配置 ASR。可先用手动转录文本运行完整分析。':'音频为 SIMULATED 演示录音；本页不执行 ASR。'}<br>装饰波形不代表真实音频能量。</p></div></section>
    <section class="card"><div class="card-head"><h2>事件流</h2><a class="sub" href="#timeline">查看全部 ↗</a></div><div class="mini-events" id="mini-events">${miniEvents()}</div></section>
    <section class="card"><div class="card-body"><div class="eyebrow green">NEXT STEP</div><h3 style="font-weight:500;font-size:15px">资料就绪，生成体验洞察。</h3><p class="small-note">规则分析无需密钥。大模型分析需要服务器配置 API，失败会如实显示。</p>${analysisButtons()}</div></section></div></div>
    <details class="details"><summary>＋ 手动输入带时间戳的转录文本 / 人工观察</summary><div class="card-body"><div class="hint-banner">手动文本标记为 MANUAL，不会被记为 ASR。每行格式：起始秒 | 结束秒 | 说话人（可留空） | 原话</div><textarea id="transcript-input" placeholder="5 | 8 | P01 | 穿起来还可以，但是腰部有点紧。&#10;10 | 13 | P01 | 上坡的时候感觉助力还不错。&#10;15 | 18 | P01 | 走久了之后感觉有一点重。"></textarea><div class="form-actions"><button class="button primary" data-action="save-transcript">保存转录文本</button></div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><div class="form-row"><label>时间（秒）<input id="manual-time" type="number" min="0" value="0"></label><input class="input" id="manual-description" placeholder="人工观察，例如：调整腰部固定带"></div><div class="form-actions"><button class="button" data-action="save-manual">记录人工观察</button></div></div></details>
    <div class="process-strip"><div><strong>01 / 采集</strong><small>视频 + 语音</small></div><span>→</span><div><strong>02 / 识别</strong><small>检测 + 转录</small></div><span>→</span><div><strong>03 / 关联</strong><small>统一事件时间线</small></div><span>→</span><div><strong>04 / 洞察</strong><small>证据 + 验证假设</small></div></div>`;
}
function assetList(){
  return `<div class="asset-list">${(state.session?.assets||[]).map(a=>`<div class="asset-row"><span>${a.kind==='video'?'▣':'♩'} ${esc(a.original_name)} <small class="stage-tag">${(a.size/1024/1024).toFixed(1)} MB</small></span><button class="button small" data-reprocess="${a.asset_id}" data-kind="${a.kind}">重新${a.kind==='video'?'分析':'转录'}</button></div>`).join('')}</div>`;
}
function analysisButtons(){
  const selected=state.cap.analysis_provider==='llm'?'llm':'rules';
  return `<div class="analysis-actions"><select id="analysis-provider" aria-label="选择分析引擎"><option value="llm" ${selected==='llm'?'selected':''}>${esc(state.cap.llm_provider||'LLM')} · 配置模型生成</option>${state.session?.simulated?'<option value="mock">MOCK · 软件测试，不调用模型</option>':''}<option value="rules" ${selected==='rules'?'selected':''}>RULE_BASED · 规则基线</option></select><button class="button primary" data-action="analyze">生成报告 · 本地后端功能</button></div>`;
}
function comparisonControls(){
  if(state.sessions.length<2)return '<p class="small-note">多 Session / MOCK 比较需要完整本地后端；本页仅回放此已保存 Session，不生成新比较。</p>';
  return `<details><summary>多 Session 与多场景比较</summary><div class="research-form"><label>选择 2–8 个 Session（可多选）<select id="research-comparison-sessions" multiple size="4">${state.sessions.map(s=>`<option value="${esc(s.session_id)}" ${s.session_id===state.sid?'selected':''}>${esc(s.name)}${s.simulated?' · SIMULATED':''}</option>`).join('')}</select></label><div><button class="button" data-action="compare-research">生成比较报告</button><p class="small-note">使用当前已保存的研究问题和所选分析引擎；比较报告可单独导出。参与者标签保留各自 Session 范围，不据此认定同人复访。</p></div></div></details>`;
}
function researchBrief(){
  if(!state.session)return `<section class="card research-brief"><div class="card-body"><div class="eyebrow">EVIDENCE → DECISION</div><h2>从研究问题开始。</h2><p>新建 Session 后设置研究目标并上传资料，或使用明确标记的 Mock 测试链路。</p><button class="button" data-action="research-demo">新建 MOCK 演示 · 本地后端功能</button></div></section>`;
  const b=state.session.research||{question:'消费者在 Crest C3 穿戴与行走任务中遇到哪些使用障碍，下一轮应验证什么？',objective:'区分原始记录、消费者反馈与研究推断。',tasks:['穿戴并调整固定带','等长行走后口述反馈'],decision_to_support:'确定下一轮产品验证。',recording_relationship:'unknown'};
  return `<section class="card research-brief"><div class="card-head"><h2>研究问题 → 验证决定</h2><span class="sub">EVIDENCE-TO-DECISION 1.1</span></div><div class="card-body"><p class="research-question">${esc(b.question)}</p><details><summary>查看目标、任务与采集关系 · 只读</summary><div class="research-form"><label>具体研究问题<textarea id="research-question" rows="2" maxlength="1000">${esc(b.question)}</textarea></label><label>研究目标<textarea id="research-objective" rows="2" maxlength="1500">${esc(b.objective)}</textarea></label><label>计划任务（每行一项，不代表已经完成）<textarea id="research-tasks" rows="3">${esc(b.tasks.join('\n'))}</textarea></label><label>需要支持的决定<textarea id="research-decision" rows="2" maxlength="1500">${esc(b.decision_to_support)}</textarea></label><label>目标用户（有资料时填写）<input id="research-audience" maxlength="1000" value="${esc(b.target_audience||'')}" placeholder="尚未定义"></label><label>决策负责人<input id="research-owner" maxlength="200" value="${esc(b.decision_owner||'')}" placeholder="待指定"></label><label>音视频原始采集关系<select id="research-relationship">${[['unknown','未知，尚未核验'],['same_capture','同一次采集（用户声明，仍待核验）'],['independent','独立采集，不作真实同步解释']].map(([v,t])=>`<option value="${v}" ${b.recording_relationship===v?'selected':''}>${t}</option>`).join('')}</select></label><div><button class="button" data-action="save-research">保存研究设置</button><p class="small-note">此静态回放不保存研究设置；请使用完整本地后端编辑。</p></div></div></details>${comparisonControls()}<div class="form-actions"><button class="button small" data-action="research-demo">新建 MOCK 演示 · 本地后端功能</button></div></div></section>`;
}
function renderTimeline(){
  const events=state.events.filter(e=>state.filter==='all'||e.source===state.filter);
  return `<div class="section-intro"><div><h2>体验事件时间线 <span class="pill">${events.length} 条事件</span></h2><p>SESSION TIME · 事件时间是相对于共同起点的秒数。</p></div>${state.sid?`<a class="button" download="crestc3-replay-events.json" href="./events.json">↓ 导出事件 JSON</a>`:''}</div><div class="card"><div class="card-head"><div class="timeline-tools">${[['all','全部事件'],['video','视频'],['audio','语音'],['manual','人工'],['AI_analysis','分析']].map(([key,label])=>`<button class="filter ${state.filter===key?'active':''}" data-filter="${key}">${label}</button>`).join('')}</div><span class="sub">按时间排序</span></div><div class="timeline-list">${events.length?events.map(e=>`<article class="timeline-item"><time>${clock(e.timestamp)}</time><span class="timeline-line"></span><div><h3>${esc(e.description)}</h3><div class="event-meta"><span class="pill">${sourceLabel(e.source)}</span>${provenanceTags(e)}<span class="stage-tag">${esc(e.event_type)}</span></div><p>${e.confidence===null?'置信度未提供':`${e.source==='video'?'人体检测':'来源'}置信度 ${(e.confidence*100).toFixed(0)}%（非行为准确率）`} · E:${e.event_id.slice(0,8)}</p></div><button class="button small" data-evidence="${e.event_id}">查看证据 ↗</button></article>`).join(''):empty('时间线还是空的','先上传资料、输入文本，或运行完整演示。')}</div></div>`;
}
function renderFeedback(){
  const f=state.feedback;
  if(!f?.feedback.length)return `<div class="card">${empty('等待消费者的第一句反馈','请先转录音频，或输入带时间戳的原话。')}</div>`;
  const total=f.feedback.length;
  const labels={positive:'正向',negative:'负向',mixed:'混合',neutral:'中性'};
  return `<div class="hint-banner">RULE_BASED · 分析方式：${esc(f.method)} 分句数与原话数均不代表消费者人数。</div><div class="content-grid"><div class="stack"><section class="card"><div class="card-head"><h2>消费者原话</h2><span class="sub">${f.utterance_count} 条原话 / ${total} 个分句</span></div>${f.feedback.map(q=>`<article class="quote-card"><span class="pill ${q.sentiment}">${labels[q.sentiment]}</span> <span class="stage-tag">${esc(q.topic)}</span><blockquote>“${esc(q.text)}”</blockquote><div class="quote-footer"><span>${clock(q.timestamp)} · ${esc(q.speaker||'说话人未知')}${q.simulated?' · SIMULATED':''}</span>${evidenceButtons([q.event_id])}</div></article>`).join('')}</section></div><div class="stack"><section class="card"><div class="card-head"><h2>反馈倾向</h2><span class="sub">RULE_BASED</span></div><div class="card-body"><div class="sentiment-chart">${Object.keys(labels).map(k=>`<div class="${k}" style="width:${f.sentiments[k]/total*100}%"></div>`).join('')}</div><div class="legend">${Object.keys(labels).map(k=>`<span>${labels[k]}<strong>${f.sentiments[k]}</strong></span>`).join('')}</div><p class="small-note">规则预分类，需研究员结合上下文回听复核。</p></div></section><section class="card"><div class="card-head"><h2>高频关键词</h2><span class="sub">按原话计数</span></div><div class="card-body keyword-cloud">${f.keywords.map(k=>`<span class="keyword" style="font-size:${12+Math.min(8,k.count*2)}px">${esc(k.word)}<small>${k.count}</small></span>`).join('')||'<span class="small-note">暂无领域关键词</span>'}</div></section><section class="card"><div class="card-head"><h2>主题聚类</h2><span class="sub">ASPECT + TF-IDF</span></div>${f.clusters.map(c=>`<div class="cluster-row"><strong>${esc(c.topic)}</strong><span class="pill" style="float:right">${c.count} 分句</span><div class="bar"><span style="width:${c.count/total*100}%"></span></div><p class="small-note">${c.utterance_count} 条原话 · ${c.negative_count} 个负面/混合分句<br>组内文本相似度：${c.mean_text_similarity===null?'单句，不计算':c.mean_text_similarity}</p>${evidenceButtons(c.evidence_ids)}</div>`).join('')}</section></div></div>`;
}
function insightDecisionCards(insight,report){
  const a=report.decision_analysis;if(!a?.decision_cards)return '';
  const diagnosis=insight.diagnosis_id||a.diagnoses.find(d=>d.title===insight.title)?.diagnosis_id;
  const options=new Set(a.options.filter(o=>o.diagnosis_ids.includes(diagnosis)).map(o=>o.option_id));
  return a.decision_cards.filter(c=>options.has(c.option_id)).map(c=>`<details><summary>完整决策卡 · ${esc(c.option_id)} · ${esc(c.priority)}</summary><p><strong>决策问题</strong><br>${esc(c.decision_question)}</p><p><strong>支持证据 · ${esc(c.evidence_strength)}</strong><br>${evidenceButtons(c.evidence_ids)}</p>${[
    ['替代解释',c.alternative_explanations.join('；')],['目标用户',c.target_audience],['预期影响（待验证）',c.expected_impact],
    ['成本与收益依据',c.cost_estimate],['方案风险',c.risks.join('；')],
    ['优先级及评分依据',`${c.priority} · ${c.priority_score}/15；影响 ${c.impact}，紧迫性 ${c.urgency}，投入 ${c.effort}。${c.scoring_basis}`],
    ['下一轮验证',c.experiment_ids.join('、')],['成功指标（计划）',c.success_metrics.join('；')],
    ['决策负责人',c.decision_owner],['效果追踪 · '+c.tracking_status,c.follow_up_plan]
  ].map(([label,value])=>`<p><strong>${esc(label)}</strong><br>${esc(value)}</p>`).join('')}</details>`).join('');
}
function renderInsights(){
  if(!state.report)return `<div class="card"><div class="card-body"><div class="section-intro"><div><h2>把已有资料转为产品洞察。</h2><p>需要先运行研究分析；每项建议都会关联原始事件。</p></div>${analysisButtons()}</div></div></div>`;
  const r=state.report;
  return `<div class="section-intro"><div><h2>${r.insights.length} 个产品改进方向</h2><p>${esc(r.engine)}</p></div>${analysisButtons()}</div><div class="hint-banner">${r.simulated?'SIMULATED · 预设演示资料。 ':''}所有改进方向为待验证假设，优先级不是已验证的产品缺陷严重度。</div><div class="insight-grid">${r.insights.map(i=>`<article class="card insight"><span class="priority ${i.priority}">${i.priority}</span><span class="stage-tag" style="float:right">HYPOTHESIS / ${esc(i.processing_method||'UNVERIFIED')} / 待验证</span><h3>${esc(i.title)}</h3><p>${esc(i.finding)}</p><div class="recommendation"><strong>产品修改建议</strong>${esc(i.recommendation)}</div><p><b class="experiment-label">下一轮验证</b><br>${esc(i.next_experiment)}</p><div class="small-note">原始证据</div><div class="evidence-buttons">${evidenceButtons(i.evidence_ids)}</div>${insightDecisionCards(i,r)}</article>`).join('')||empty('当前资料不足以提出有证据的建议','补充消费者原话后重新分析。')}</div><section class="card wide-card"><div class="card-head"><h2>视觉 × 语音 · 时间关联</h2><span class="sub">TEMPORAL CONTEXT ONLY</span></div><div class="card-body"><p class="small-note">仅匹配原话区间前后 3 秒内的视频事件；不确认说话人身份，不推断因果。整段音频只有一个时间范围时不做精细关联。</p>${r.correlations.map(c=>`<div class="mini-event"><time>${clock(c.start)}–${clock(c.end)}</time><div>${evidenceButtons([c.utterance_id])}<span class="stage-tag">　↔　</span>${evidenceButtons(c.video_event_ids)||'<span class="small-note">没有邻近视频事件</span>'}</div></div>`).join('')||'<p class="small-note">暂无可精确关联的语音区间。</p>'}</div></section>`;
}
function markdown(text){
  // Escape before applying a tiny, non-HTML Markdown renderer.
  return text.split('\n').map(line=>{
    const s=esc(line).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\[E:([A-Za-z0-9_-]+)\]/g,(_,id)=>evidenceButtons([id]));
    if(line.startsWith('### '))return `<h3>${s.slice(4)}</h3>`;
    if(line.startsWith('## '))return `<h2>${s.slice(3)}</h2>`;
    if(line.startsWith('# '))return `<h1>${s.slice(2)}</h1>`;
    if(line.startsWith('- '))return `<p>· ${s.slice(2)}</p>`;
    return line?`<p>${s}</p>`:'';
  }).join('');
}
function renderReport(){
  const r=state.comparisonReport||state.report;
  if(!r)return researchBrief()+`<div class="card"><div class="card-body"><div class="section-intro"><div><h2>决策型研究报告尚未生成。</h2><p>先保存研究问题，再从当前 Session 的证据生成报告。模型失败会保留真实错误，不改用 Mock。</p></div>${analysisButtons()}</div><button class="button" data-action="research-demo">运行软件流程演示 · SIMULATED + MOCK</button></div></div>`;
  const a=r.decision_analysis;
  const decision=a?`<section class="decision-summary"><div><div class="eyebrow">CURRENT DECISION / ${esc(a.decision.classification)}</div><h2>${esc(a.decision.recommendation)}</h2><p>研究问题：${esc(r.research.question)}</p>${evidenceButtons(a.decision.evidence_ids)}</div><div class="decision-counts">${[['FACT','记录事实'],['INFERENCE','研究推断'],['INSUFFICIENT_EVIDENCE','证据不足']].map(([key,label])=>`<div><strong>${a.claims.filter(c=>c.classification===key).length}</strong><span>${label}</span></div>`).join('')}</div></section>`:'';
  const exports=state.comparisonReport?'<button class="button outline" data-action="export-comparison-md">↓ 比较 Markdown</button><button class="button outline" data-action="export-comparison-json">↓ 比较 JSON</button><button class="button outline" data-action="close-comparison">返回当前 Session</button>':`<a class="button outline" download="crestc3-replay-report.md" href="./report.md">↓ Markdown</a><a class="button outline" download="crestc3-replay-report.json" href="./report.json">↓ JSON</a>`;
  return researchBrief()+`<div class="report-banner"><div><div class="eyebrow">EVIDENCE → DECISION ${esc(r.report_schema_version||'1.0')} / ${r.simulated?'SIMULATED':'USER INPUT'}</div><h2>${state.comparisonReport?'多 Session 比较':'CREST C3'} · 决策型研究报告</h2><p>${esc(r.engine)} · ${new Date(r.generated_at).toLocaleString('zh-CN')}</p></div><div class="report-export">${exports}</div></div>${r.processing_method==='MOCK'?'<div class="hint-banner mock-banner">MOCK + SIMULATED · 软件流程演示，未执行 LLM、真实设备或 GPU 验证。</div>':''}${decision}<div class="card card-body report-regenerate"><span class="small-note">引用完整性已校验；内容、因果与模型质量仍待研究员复核。</span>${analysisButtons()}</div><article class="report-paper">${markdown(r.markdown)}</article>`;
}

function exportComparison(format){
  if(!state.comparisonReport)throw Error('请先生成比较报告。');
  const content=format==='md'?state.comparisonReport.markdown:JSON.stringify(state.comparisonReport,null,2);
  const url=URL.createObjectURL(new Blob([content],{type:format==='md'?'text/markdown;charset=utf-8':'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=`hubone-comparison.${format}`;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

async function watchJob(job,sid=state.sid){
  state.busy=true;$('#demo-btn').disabled=true;$('#session-select').disabled=true;$('#new-session').disabled=true;
  $('#job-panel').hidden=false;$('#job-panel').classList.remove('done');
  const began=Date.now();
  try{
    while(true){
      const j=await api(`/sessions/${sid}/jobs/${job.job_id}`);
      $('#job-message').textContent=j.message||j.kind;
      $('#job-progress').value=j.progress||0;
      $('#job-status').textContent=`${j.status.toUpperCase()} · ${Math.round((Date.now()-began)/1000)}s`;
      if(j.status==='failed')throw Error(j.error||'任务失败');
      if(j.status==='completed'){
        $('#job-panel').classList.add('done');$('#job-message').textContent='示例已回放 · 未运行模型';
        if(sid===state.sid){await loadData();render();}
        return j;
      }
      await new Promise(r=>setTimeout(r,650));
    }
  }finally{
    state.busy=false;$('#demo-btn').disabled=false;$('#session-select').disabled=false;$('#new-session').disabled=false;
  }
}
async function uploadFile(file,kind){
  const body=new FormData();body.append('kind',kind);body.append('file',file);
  return api(`/sessions/${state.sid}/assets`,{method:'POST',body});
}
function offset(kind){return Number($(`#${kind}-offset`)?.value||0);}
async function processAsset(asset,offsetSeconds){
  const job=await post(`/sessions/${state.sid}/${asset.kind}`,{asset_id:asset.asset_id,offset_seconds:offsetSeconds});
  await watchJob(job);
}
async function showEvidence(id){
  const report=state.comparisonReport||state.report;
  const e=state.events.find(e=>e.event_id===id)||report?.evidence[id];
  if(!e)throw Error('证据已更新，请重新生成报告。');
  let media='',seekTime=0;
  const aid=e.evidence.asset_id;
  const asset=state.session?.assets.find(a=>a.asset_id===aid&&a.session_id===e.session_id);
  const record=report?.evidence_index?.[id];
  const url=record?.media_url||(asset?mediaUrl(asset):null);
  if(url){
    const t=e.evidence.media_time??e.evidence.start??0;
    seekTime=Number(t);
    const src=url+`#t=${t}`;
    if(e.source==='video'){
      if(e.evidence.snapshot)media+=`<img alt="演示证据帧（非真实模型识别）" src="${record?.frame_url||`./frames/${aid}/${esc(e.evidence.snapshot)}`}">`;
      media+=`<video controls src="${src}"></video>`;
    }else media+=`<audio controls src="${src}"></audio>`;
  }
  $('#evidence-content').innerHTML=`<div class="event-meta"><span class="pill">${sourceLabel(e.source)}</span>${provenanceTags(e)}<time>${clock(e.timestamp)}</time></div><blockquote>“${esc(e.metadata.raw_text||e.description)}”</blockquote>${media}<p class="small-note">${e.metadata.origin==='scripted_annotation_not_cv'?'预设人工情境标注，不是模型识别。':'置信度、说话人状态与方法见下方原始记录。'}</p>${e.evidence.event_ids?evidenceButtons(e.evidence.event_ids):''}<pre>${esc(JSON.stringify(e,null,2))}</pre>`;
  const player=$('#evidence-content video,#evidence-content audio');
  if(player){
    // Chromium may ignore a media fragment on static file servers; seek explicitly.
    const seek=()=>{if(Number.isFinite(seekTime)&&seekTime>=0)player.currentTime=Number.isFinite(player.duration)?Math.min(seekTime,player.duration):seekTime;};
    if(player.readyState>=1)seek();else player.addEventListener('loadedmetadata',seek,{once:true});
  }
  $('#evidence-dialog').showModal();
}

async function startPreview(audioOnly=false){
  if(!navigator.mediaDevices?.getUserMedia)throw Error('当前浏览器不可用媒体采集；请通过 HTTPS / localhost 在本地打开，或上传文件。');
  stopPreview();
  state.device=await navigator.mediaDevices.getUserMedia({video:!audioOnly,audio:true});
  if(!audioOnly){
    const stage=$('.video-stage');stage.innerHTML='<video id="local-preview" autoplay muted playsinline></video><span class="overlay-label">LOCAL CAMERA · 仅预览，尚未分析</span>';
    $('#local-preview').srcObject=state.device;
  }
}
async function record(audioOnly){
  const button=$(audioOnly?'#record-audio':'#record-video');
  if(state.recorder?.state==='recording'){
    state.recorder.stop();return;
  }
  requireSession();
  if(!window.MediaRecorder)throw Error('当前浏览器不支持 MediaRecorder，请上传文件。');
  if(!state.device||(!audioOnly&&!state.device.getVideoTracks().length))await startPreview(audioOnly);
  const stream=audioOnly?new MediaStream(state.device.getAudioTracks()):state.device;
  const mime=audioOnly?'audio/webm':'video/webm';
  if(!MediaRecorder.isTypeSupported(mime))throw Error('此浏览器不支持 WebM 录制，请使用 Chrome/Edge。');
  const recorder=new MediaRecorder(stream,{mimeType:mime});
  state.recorder=recorder;const chunks=[];const sid=state.sid;const start=offset(audioOnly?'audio':'video');
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  recorder.onstop=async()=>{
    button.textContent='上传录制中…';button.disabled=true;
    $('#waveform')?.classList.remove('recording');
    try{
      if(sid!==state.sid)throw Error('Session 已改变，录制未保存。');
      const file=new File(chunks,`capture-${Date.now()}.webm`,{type:mime});
      const asset=await uploadFile(file,audioOnly?'audio':'video');
      let audioAsset;
      if(!audioOnly)audioAsset=await uploadFile(file,'audio');
      await processAsset(asset,start);
      if(audioAsset)await processAsset(audioAsset,start);
      toast('采集资料已保存；未配置 ASR 时可补充手动转录。');
    }catch(e){error(e);await loadData();render();}
    finally{stopPreview();state.recorder=null;button.disabled=false;button.classList.remove('record-active');button.textContent=audioOnly?'● 录制麦克风':'● 录制体验';}
  };
  recorder.start(1000);button.textContent='■ 停止录制并分析';button.classList.add('record-active');
  $('#waveform')?.classList.add('recording');toast('正在录制本地设备，停止后上传至当前 Session。');
}

const actions={
  async 'save-research'(){requireSession();const research={...state.session.research,question:$('#research-question').value.trim(),objective:$('#research-objective').value.trim(),tasks:$('#research-tasks').value.split('\n').map(t=>t.trim()).filter(Boolean),decision_to_support:$('#research-decision').value.trim(),recording_relationship:$('#research-relationship').value,target_audience:$('#research-audience').value.trim()||null,decision_owner:$('#research-owner').value.trim()||null};await api(`/sessions/${state.sid}/research`,{method:'PATCH',body:JSON.stringify(research)});await loadData();render();toast('研究问题已保存；请重新生成报告。');},
  async 'compare-research'(){
    requireSession();const session_ids=Array.from($('#research-comparison-sessions').selectedOptions,o=>o.value);
    if(session_ids.length<2||session_ids.length>8)throw Error('请选择 2–8 个不同的 Session。');
    const button=$('[data-action="compare-research"]');state.busy=true;button.disabled=true;button.textContent='正在生成比较报告…';
    $('#session-select').disabled=true;$('#new-session').disabled=true;
    try{state.comparisonReport=await post('/research/compare',{session_ids,provider:$('#analysis-provider').value,research:state.session.research});}
    finally{state.busy=false;button.disabled=false;button.textContent='生成比较报告';$('#session-select').disabled=false;$('#new-session').disabled=false;}
    render();toast('比较报告已生成；原 Session 报告保留。');
  },
  'export-comparison-md':()=>exportComparison('md'),
  'export-comparison-json':()=>exportComparison('json'),
  'close-comparison':()=>{state.comparisonReport=null;render();},
  async 'research-demo'(){if(state.recorder?.state==='recording')throw Error('请先停止录制。');const data=await post('/research/demo',{});await refreshSessions();await selectSession(data.session_id);await watchJob(data.job,data.session_id);location.hash='report';toast('MOCK 软件演示完成，未调用模型。');},
  async 'upload-video'(){requireSession();const file=$('#video-file').files[0];if(!file)throw Error('请选择视频文件。');const start=offset('video');const asset=await uploadFile(file,'video');await loadData();await processAsset(asset,start);},
  async 'upload-audio'(){requireSession();const file=$('#audio-file').files[0];if(!file)throw Error('请选择音频文件。');const start=offset('audio');const asset=await uploadFile(file,'audio');await loadData();await processAsset(asset,start);},
  async analyze(){requireSession();const provider=$('#analysis-provider').value;const job=await post(`/sessions/${state.sid}/analyze`,{provider});await watchJob(job);location.hash='report';},
  async 'save-transcript'(){requireSession();const input=$('#transcript-input').value.trim();if(!input)throw Error('请填写转录文本。');const segments=input.split('\n').filter(x=>x.trim()).map((line,index)=>{
    const fields=line.split('|').map(s=>s.trim());
    if(fields.length<4||fields[0]===''||fields[1]===''||!Number.isFinite(Number(fields[0]))||!Number.isFinite(Number(fields[1])))throw Error(`第 ${index+1} 行格式应为：起始秒 | 结束秒 | 说话人 | 原话`);
    return {start:Number(fields[0]),end:Number(fields[1]),speaker:fields[2]||null,text:fields.slice(3).join('|')};
  });await post(`/sessions/${state.sid}/transcripts`,{segments,offset_seconds:offset('audio')});await loadData();render();toast('转录已保存，来源标记为人工输入。');},
  async 'save-manual'(){requireSession();const description=$('#manual-description').value.trim();if(!description)throw Error('请填写人工观察。');await post(`/sessions/${state.sid}/events`,{timestamp:Number($('#manual-time').value),source:'manual',event_type:'manual_observation',description});await loadData();render();toast('人工观察已记录。');},
  camera:()=>startPreview(false),
  'record-video':()=>record(false),
  microphone:()=>record(true),
};
document.addEventListener('click',async e=>{
  const evidence=e.target.closest('[data-evidence]');const filter=e.target.closest('[data-filter]');
  const action=e.target.closest('[data-action]');const reprocess=e.target.closest('[data-reprocess]');
  try{
    if(evidence){await showEvidence(evidence.dataset.evidence);return;}
    if(filter){state.filter=filter.dataset.filter;render();return;}
    if(!action&&!reprocess)return;
    if(state.busy)throw Error('当前任务运行中，请等待完成。');
    clearError();
    if(reprocess){await processAsset({asset_id:reprocess.dataset.reprocess,kind:reprocess.dataset.kind},offset(reprocess.dataset.kind));return;}
    await actions[action.dataset.action]();
  }catch(err){error(err);}
});
$('#close-dialog').onclick=()=>{$('#evidence-dialog').close();$('#evidence-content').innerHTML='';};
$('#evidence-dialog').addEventListener('close',()=>{$('#evidence-content').innerHTML='';});
$('#session-select').onchange=async e=>{try{clearError();await selectSession(e.target.value);}catch(err){error(err);}};
$('#new-session').onclick=async()=>{
  try{
    if(state.recorder?.state==='recording')throw Error('请先停止当前录制。');
    const name=prompt('体验 Session 名称','Crest C3 · 消费者体验');if(!name?.trim())return;
    $('#content').inert=true;$('#new-session').disabled=true;
    const session=await post('/sessions',{name:name.trim(),simulated:$('#session-sim').checked});await refreshSessions();await selectSession(session.session_id);location.hash='capture';
  }catch(err){error(err);}finally{$('#content').inert=false;$('#new-session').disabled=false;}
};
$('#demo-btn').onclick=async()=>{
  try{
    if(state.recorder?.state==='recording')throw Error('请先停止录制。');
    clearError();state.busy=true;$('#demo-btn').disabled=true;
    const result=await post('/demo',{});await refreshSessions();await selectSession(result.session_id);location.hash='capture';
    await watchJob(result.job,result.session_id);toast('SIMULATED 记录已重新载入；本页没有运行模型。');
  }catch(err){error(err);}finally{state.busy=false;$('#demo-btn').disabled=false;}
};
window.addEventListener('hashchange',navigate);
window.addEventListener('beforeunload',()=>{state.stream?.close();stopPreview();});
async function init(){
  navigate();
  try{
    const [health,cap,sessions]=await Promise.all([api('/health'),api('/capabilities'),refreshSessions()]);
    state.cap=cap;$('#health').textContent=health.status==='ok'?'C3 1.1 · 只读 REPLAY':'服务待检查';
    if(state.sid&&!sessions.some(s=>s.session_id===state.sid))state.sid=null;
    if(state.sid)await selectSession(state.sid);else render();
  }catch(e){$('#health').textContent='服务连接失败';error(e);}
}
init();
