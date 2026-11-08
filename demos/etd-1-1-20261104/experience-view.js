import {mountAclStudy} from './acl-view.js?v=acl-study-timeline-20261108-r2';
/* Consumer Experience Intelligence: additive evidence review, no camera/model/scene creation. */
const esc = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sec = x => Number.isFinite(Number(x)) ? `${Number(x).toFixed(3)} s` : 'UNKNOWN';
const labels = ['ENTERING','EXITING','STATIONARY','WALKING','BENDING','RAISING_HAND','SITTING','STANDING_UP','SQUATTING','UNKNOWN'];
const bones = [[5,6],[5,7],[7,9],[6,8],[8,10],[5,11],[6,12],[11,12],[11,13],[13,15],[12,14],[14,16],[0,1],[0,2],[1,3],[2,4]];
const json = (title, data) => `<details class="exp-detail"><summary>${esc(title)}</summary><pre>${esc(JSON.stringify(data,null,2))}</pre></details>`;
const option = (value,text,current) => `<option value="${esc(value)}"${value===current?' selected':''}>${esc(text)}</option>`;
const badge = value => `<span class="exp-badge">${esc(value)}</span>`;
const field = (name,label,value='',extra='') => `<label>${esc(label)}<input name="${esc(name)}" value="${esc(value)}" ${extra}></label>`;
const check = (name,label) => `<label class="exp-check"><input type="checkbox" name="${esc(name)}">${esc(label)}</label>`;

export function mountExperienceView(container,{session,showEvidence,aclFocus=null}={}) {
  const abort=new AbortController(), sid=session?.session_id, sidPath=encodeURIComponent(sid||'');
  const acl=session?.product==='ACL Knee Brace';
  let aclView=null,pendingAclFocus=aclFocus;
  let disposed=false, busy=false, tab=acl?'acl':'framework', overview=null, definition=null, evidence=[], sourceIndex=0;
  let source=null, pageOffset=0, frameIndex=0, trackFilter='all', frameLoad=0, pageGeneration=0, predictions=null, evaluation=null, selectedRun=null;
  const downloads=new Set();
  container.innerHTML=`<section class="exp-workspace"><header class="exp-heading"><div><div class="eyebrow green">CONSUMER EXPERIENCE INTELLIGENCE</div><h2>消费者体验研究工作台</h2><p>从发生了什么，到还有什么需要验证。保留原始证据、人工判断与研究推断的区别。</p></div><a class="button small" href="#capture">返回采集记录</a></header><div class="exp-status" role="status" aria-live="polite">正在读取当前 Session…</div><nav class="exp-tabs" aria-label="体验研究工作台">${[...(acl?[['acl','ACL 体验流程']]:[]),['framework','六维框架'],['evidence','证据与人工标注'],['audio','语音'],['research','研究与交付'],['settings','研究设置']].map(([id,name])=>`<button type="button" class="button" data-exp-tab="${id}">${name}</button>`).join('')}</nav><div class="exp-panel"></div></section>`;
  const $=q=>container.querySelector(q), $$=q=>[...container.querySelectorAll(q)];
  const status=(message,error=false)=>{if(disposed)return;$('.exp-status').textContent=message;$('.exp-status').classList.toggle('exp-error',error);};
  async function request(path,options={}) {
    if(!window.HUBONE_RECORDING?.enabled)throw Error('NOT CONNECTED：此工作台需要本地后端；静态 REPLAY 保持只读。');
    const response=await fetch('/api'+path,{cache:'no-store',...options,signal:abort.signal,
      headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers}});
    const data=await response.json();if(!response.ok)throw Error(typeof data.detail==='string'?data.detail:JSON.stringify(data.detail||data));return data;
  }
  const path=suffix=>`/sessions/${sidPath}/experience${suffix}`;
  const post=(suffix,body)=>request(path(suffix),{method:'POST',body:JSON.stringify(body)});
  function safeMedia(value) {
    if(typeof value!=='string'||!value.startsWith('/api/'))return null;
    const url=new URL(value,location.origin);
    if(url.origin!==location.origin||url.search||url.hash)return null;
    const assetRoot=`/api/sessions/${sidPath}/assets/`,liveRoot=`/api/live/sessions/${sidPath}/frames/`;
    if(url.pathname.startsWith(assetRoot)&&/^[\w-]+(?:\/playback|\/frames\/\d+\.jpg)?$/.test(url.pathname.slice(assetRoot.length)))return url.pathname;
    if(url.pathname.startsWith(liveRoot)&&/^\d+\.jpg$/.test(url.pathname.slice(liveRoot.length)))return url.pathname;
    return null;
  }
  async function refresh() {
    [overview,definition]=await Promise.all([request(path('')),request('/experience/framework')]);
    try{evidence=(await request(path('/evidence'))).items;}catch(error){evidence=[];status(`证据索引待核验：${error.message}`,true);}
    if(!disposed)render();
  }
  function dimensions(data=definition?.dimensions||[]) {
    return `<div class="exp-dimensions">${data.map(d=>{const metrics=d.metrics||[];return `<article class="card exp-dimension"><div class="exp-card-top"><span>${esc(d.id)}</span>${badge(metrics.some(m=>m.status==='HUMAN_VERIFIED')?'HUMAN_VERIFIED':'证据待补全')}</div><h3>${esc(d.name)}</h3><p>${esc(d.question||d.description||'通过直接证据与授权业务输入核验，不从姿态推测心理。')}</p><p>${metrics.length} 项指标</p><div class="exp-summary">${metrics.slice(0,3).map(m=>badge(m.name)).join('')}</div><details><summary>查看全部 ${metrics.length} 项指标</summary>${metrics.map(m=>`<details><summary>${esc(m.name)} ${m.status?badge(m.status):''}</summary><p>${esc(m.definition)}</p><p>${esc(m.calculation)}</p>${json('来源与限制',{source:m.sources||m.required_sources,limitations:m.exclusions||m.limitations,values:m.values})}</details>`).join('')}</details></article>`;}).join('')}</div>`;
  }
  function render() {
    if(disposed)return;
    $$('[data-exp-tab]').forEach(b=>{const on=b.dataset.expTab===tab;b.classList.toggle('primary',on);b.setAttribute('aria-current',on?'page':'false');});
    aclView?.destroy();aclView=null;
    const panel=$('.exp-panel');
    if(!sid){panel.innerHTML='<div class="card exp-card"><h3>选择一个已有 Session</h3><p>使用页面顶部 Session 选择器。工作台不创建虚构消费者或人工真值。</p></div>';return;}
    if(!overview){panel.innerHTML='<div class="card exp-card">NOT CONNECTED · 尚未读取研究资料。</div>';return;}
    if(acl&&(tab==='acl'||tab==='research')){const focus=tab==='research'?'research':pendingAclFocus;pendingAclFocus=null;panel.innerHTML='';aclView=mountAclStudy(panel,{session,focus,onEvidence:()=>{tab='evidence';render();}});return;}
    const renderers={framework:renderFramework,evidence:renderEvidence,audio:renderAudio,research:renderResearch,settings:renderSettings};
    panel.innerHTML=renderers[tab]();
    if(tab==='evidence'&&source)displayFrame();
  }
  function renderFramework() {
    return `<div class="exp-summary">${badge(overview.simulated?'SIMULATED':'当前 Session 原始资料')}${badge('身份关联 · NOT CONNECTED')}${badge('CAD 映射 · NOT CONNECTED')}</div>${dimensions()}<details class="card exp-card"><summary>记录可追溯的业务证据</summary><p>人工反馈、研究观察与有授权的外部记录分别保留来源。导入记录不代表 CRM / POS 已连接。</p>${businessForm()}</details>${json('当前业务记录',overview.business_inputs)}${json('框架原始定义',definition)}`;
  }
  function businessForm() {
    const metrics=(definition.dimensions||[]).flatMap(d=>(d.metrics||[]).map(m=>({...m,dimension:d.name})));
    return `<form data-exp-form="business" class="exp-form"><label>指标<select name="metric_id" required>${metrics.map(m=>option(m.id,`${m.dimension} · ${m.name}`)).join('')}</select></label>${field('value','原始值（不自动推断）','','required maxlength="4000"')}<label>值类型<select name="value_type"><option value="text">文本</option><option value="number">数字</option><option value="boolean">布尔（true / false）</option></select></label>${field('unit','单位')}${field('timestamp','Session 时间 / 秒',0,'type="number" min="0" step="any" required')}<label>来源<select name="source_type">${['HUMAN_FEEDBACK','RESEARCH_OBSERVATION','CRM_IMPORT','POS_IMPORT','MEMBER_IMPORT','PRODUCT_SENSOR_IMPORT'].map(v=>option(v,v)).join('')}</select></label>${field('external_record_reference','外部原始记录编号（导入时必填）')}<label class="exp-wide">当前 Session 证据（可多选）<select name="evidence_refs" multiple size="4">${evidence.map(e=>option(e.ref,`${sec(e.timestamp)} · ${e.description||e.ref}`)).join('')}</select></label><label class="exp-wide">备注<textarea name="notes" maxlength="2000"></textarea></label>${check('human_confirmed','我已人工核对本条输入与原始来源')}<button class="button" type="submit">保存业务证据</button></form>`;
  }
  function renderEvidence() {
    const sources=overview.sources||[];
    const frozen=source&&['STOPPED','AVAILABLE','FAILED'].includes(source.status);
    return `<section class="card exp-card"><div class="exp-toolbar"><label>已有视觉来源<select data-exp-source>${sources.map((s,i)=>option(String(i),`${s.name} · ${s.source_mode} · ${s.status}`,String(sourceIndex))).join('')}</select></label><button class="button" data-exp-action="load-source" ${sources.length?'':'disabled'}>读取保存的观测</button><button class="button" data-exp-action="behaviors" ${frozen?'':'disabled'}>派生行为候选</button></div><p>不重新推理。RTSP 来源展示已保存采样帧，不是连续录像；正在采集的来源须先在原 LIVE 页面停止，才可固定数据集并标注。</p>${source?`<div class="exp-summary">${badge(source.source_mode)}${badge(source.media_kind==='SAMPLED_FRAMES'?'REPLAY FROM LIVE · 采样证据':'原始录像')}${badge('行为准确率 · NOT_VERIFIED')}</div><div class="exp-review-layout"><div><div class="exp-stage"><img class="exp-frame" alt="当前 Session 的原始采样证据帧"><canvas class="exp-overlay" aria-label="原始保存的人体框及可见关键点"></canvas></div><div class="exp-toolbar"><button class="button small" data-exp-action="previous" ${pageOffset+frameIndex>0?'':'disabled'}>上一采样帧</button><span class="exp-frame-time"></span><button class="button small" data-exp-action="next" ${pageOffset+frameIndex+1<source.total?'':'disabled'}>下一采样帧</button><label>Track<select data-exp-track>${option('all','全部',trackFilter)}${[...new Set(source.frames.flatMap(f=>f.tracks.map(t=>String(t.track_id))))].map(t=>option(t,t,trackFilter)).join('')}</select></label></div><div class="exp-toolbar"><label>本页采样帧<input type="range" data-exp-frame min="0" max="${Math.max(0,source.frames.length-1)}" value="${frameIndex}"></label><span>${pageOffset+1}–${pageOffset+source.frames.length} / ${source.total}</span></div>${safeMedia(source.media_url)?`<details class="exp-detail"><summary>播放原视频（采样标注使用上方逐帧证据）</summary><video controls playsinline preload="metadata" src="${esc(safeMedia(source.media_url))}"></video><p>原录像保留自身时间轴；上方采样帧不在漏检间补造关键点。Session offset：${sec(source.offset_seconds)}。</p></details>`:''}</div><aside class="exp-inspector"><h3>当前帧 Inspector</h3><div class="exp-frame-inspector"></div></aside></div>${annotationForm(frozen)}${json('来源、实际模型及时间依据',{...source,frames:undefined})}`:'<p>尚未选择证据来源。无姿态观测的录像将明确显示 NOT CONNECTED。</p>'}</section><div class="exp-two"><section class="card exp-card"><h3>人工行为标注 · ${overview.annotations.length}</h3>${overview.annotations.length?overview.annotations.slice(-20).map(a=>`<p>${esc(a.label)} · Track ${esc(a.track_id)} · ${sec(a.start)}–${sec(a.end)} ${badge(a.verification_status)}</p>`).join(''):'<p>未提供人工真值；不能报告正式动作准确率。</p>'}${json('全部人工标注',overview.annotations)}${json('完整人工复核区间',overview.reviewed_ranges)}</section><section class="card exp-card"><h3>规则派生与独立验收</h3><p>候选不是人工真值；检测框置信度不是行为准确率。</p><label>已保存的派生结果<select data-exp-run>${overview.behavior_runs.map(r=>option(r.record_id,`${r.created_at} · ${r.candidate_count} candidates`,selectedRun||overview.behavior_runs[0]?.record_id)).join('')}</select></label><div class="exp-toolbar"><button class="button small" data-exp-action="predictions" ${overview.behavior_runs.length?'':'disabled'}>读取前 1,000 条候选</button><button class="button small" data-exp-action="evaluate" ${overview.behavior_runs.length?'':'disabled'}>核验人工复核区间</button></div><p>当前验收集为本 Session / 原视频；不自动生成训练集或人工标注。</p>${predictions?`${json(`规则预测（已加载 ${predictions.predictions.length} / ${predictions.total}）`,predictions)}<button class="button small" data-exp-action="predictions-more" ${predictions.predictions.length<predictions.total?'':'disabled'}>加载更多（最多 1,000 条）</button>`:''}${evaluation?json(`验收状态 · ${evaluation.status}`,evaluation):''}</section></div><section class="card exp-card"><h3>事件证据</h3>${evidence.slice(0,100).map(e=>`<button class="button small" data-exp-evidence="${esc(e.ref)}">${sec(e.timestamp)} · ${esc(e.description||e.ref)}</button>`).join('')||'<p>尚无事件证据。</p>'}<div class="exp-event-detail"></div></section>`;
  }
  function annotationForm(enabled) {
    return `<form data-exp-form="annotation" class="exp-form"><h3 class="exp-wide">人工标注 · Session 时间</h3>${field('track_id','Track ID',trackFilter==='all'?'':trackFilter,'required maxlength="100"')}${field('start','起点 / 秒',source.frames[frameIndex]?.timestamp??source.start,'type="number" min="0" step="any" required')}${field('end','终点 / 秒',source.frames[frameIndex]?.timestamp??source.start,'type="number" min="0" step="any" required')}<label>类别<select name="label">${labels.map(v=>option(v,v)).join('')}</select></label>${check('occluded','遮挡影响判断')}${check('uncertain','此动作无法确定')}${check('human_confirmed','我已观看原始证据并确认此标注')}<label class="exp-wide">标注依据<textarea name="notes" maxlength="2000"></textarea></label><button class="button" type="submit" ${enabled?'':'disabled'}>保存人工标注</button></form><form data-exp-form="review-range" class="exp-form"><h3 class="exp-wide">完整复核区间（独立声明）</h3>${field('track_id','Track ID',trackFilter==='all'?'':trackFilter,'required')}${field('start','起点 / 秒',source.start,'type="number" min="0" step="any" required')}${field('end','终点 / 秒',source.end,'type="number" min="0" step="any" required')}${check('complete','该区间已完整复核，非仅挑选正例')}${check('human_confirmed','我人工确认本复核范围')}<button class="button" type="submit" ${enabled?'':'disabled'}>保存复核范围</button></form>`;
  }
  async function loadPage(offset=0,selectLast=false) {
    const ref=overview.sources[sourceIndex];if(!ref)throw Error('请先选择来源');
    const generation=++pageGeneration,query=new URLSearchParams({kind:ref.kind,offset:String(offset),limit:'300'});
    if(ref.asset_id)query.set('asset_id',ref.asset_id);
    const data=await request(path('/observations?'+query));if(disposed||generation!==pageGeneration)return;
    if(offset&&source&&data.fingerprint!==source.fingerprint)throw Error('源观测已变化，请从首帧重新读取后再标注。');
    source=data;pageOffset=offset;frameIndex=selectLast?Math.max(0,data.frames.length-1):0;render();
    status(`已读取 ${data.frames.length} 帧 / ${data.total}，坐标 IMAGE_PIXELS；CAD NOT CONNECTED。`);
  }
  function displayFrame() {
    const frame=source?.frames[frameIndex],img=$('.exp-frame'),canvas=$('.exp-overlay');if(!img||!canvas)return;
    const ctx=canvas.getContext('2d'),generation=++frameLoad;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(!frame){img.removeAttribute('src');$('.exp-frame-time').textContent='无采样帧';return;}
    $('.exp-frame-time').textContent=`帧 ${frame.frame_index} · Session ${sec(frame.timestamp)}`;
    const range=$('[data-exp-frame]');range.value=frameIndex;
    $('[data-exp-action="previous"]').disabled=pageOffset+frameIndex===0;
    $('[data-exp-action="next"]').disabled=pageOffset+frameIndex+1>=source.total;
    const tracks=frame.tracks.filter(t=>trackFilter==='all'||String(t.track_id)===trackFilter);
    $('.exp-frame-inspector').innerHTML=`<p>${esc(frame.captured_at||'录像内时间')}<br>${esc(frame.evidence_ref)}</p>${tracks.map(t=>`<h4>Track ${esc(t.track_id)}</h4><p>人体检测置信度 ${Number.isFinite(t.confidence)?(100*t.confidence).toFixed(1)+'%':'UNKNOWN'} · 可见关键点 ${(t.keypoints||[]).filter(k=>k.visible).length} / 17</p>${json('原始 bbox / keypoints',t)}`).join('')||'<p>当前帧没有匹配的 Track。</p>'}`;
    const url=safeMedia(frame.frame_url);if(!url){img.removeAttribute('src');status('证据帧 URL 不属于当前 Session，已拒绝。',true);return;}
    img.onload=()=>{if(disposed||generation!==frameLoad)return;canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;const w=canvas.width;ctx.lineWidth=Math.max(1.5,w/450);ctx.font=`600 ${Math.max(13,w/60)}px sans-serif`;
      for(const t of tracks){const box=t.bbox;if(Array.isArray(box)&&box.length===4&&box.every(Number.isFinite)){ctx.strokeStyle='#42c4ca';ctx.strokeRect(box[0],box[1],box[2]-box[0],box[3]-box[1]);ctx.fillStyle='#12353e';ctx.fillText('Track '+t.track_id,box[0]+3,Math.max(18,box[1]-5));}
        const points=t.keypoints||[],visible=k=>k?.visible===true&&Number.isFinite(k.x)&&Number.isFinite(k.y);ctx.strokeStyle='#edc176';for(const [a,b] of bones){if(!visible(points[a])||!visible(points[b]))continue;ctx.beginPath();ctx.moveTo(points[a].x,points[a].y);ctx.lineTo(points[b].x,points[b].y);ctx.stroke();}ctx.fillStyle='#e887a8';for(const k of points){if(!visible(k))continue;ctx.beginPath();ctx.arc(k.x,k.y,Math.max(2,w/220),0,Math.PI*2);ctx.fill();}}
    };
    img.onerror=()=>{if(generation===frameLoad)status('原始证据帧暂不可用。',true);};img.src=url;
  }
  function renderAudio() {
    return `<section class="card exp-card"><h3>本地语音转录与原话证据</h3><p>仅处理已授权资料。转录不识别说话人、不关联人体 Track；音视频时间接近不能证明同一消费者。公开参考语音仅用于 REFERENCE_TECHNICAL_TEST，不纳入消费者反馈。</p><form data-exp-form="audio" class="exp-form"><label>授权类型<select name="status"><option value="UNKNOWN">UNKNOWN · 尚未授权</option><option value="AUTHORIZED">消费者音频 · 人工声明已授权</option><option value="REFERENCE_TEST">现有官方 zh.wav · 独立技术验证</option></select></label>${check('notice_provided','已告知录音、转录与研究用途')}${field('basis','授权依据 / 记录编号','','required')}${field('research_purpose','本次处理目的','','required')}${field('retention_days','保留期 / 天（空白为未知）','','type="number" min="1" max="3650"')}${field('offset_seconds','声明的 Session offset / 秒',0,'type="number" min="0" step="any"')}<label>已有音频 Asset<select name="asset_id"><option value="">上传新文件</option>${(session.assets||[]).filter(a=>a.kind==='audio').map(a=>option(a.asset_id,a.original_name)).join('')}</select></label><label>授权后上传音频<input name="file" type="file" accept="audio/*"></label>${check('confirm_processing','确认以上授权与用途，并开始本地处理')}<button class="button" type="submit">上传 / 转录授权音频</button></form><p>实时麦克风复用原有采集入口；本工作台不会自动打开麦克风。请先在研究设置记录授权及用途。</p><button class="button small" data-exp-action="microphone">前往现有语音采集</button></section>${overview.audio_runs.map(run=>`<section class="card exp-card"><div class="exp-toolbar"><h3>语音 ${esc(run.run_id)}</h3>${badge(run.provenance?.research_scope==='REFERENCE_TECHNICAL_TEST'?'TEST · REFERENCE_TECHNICAL_TEST':run.stats.source_mode)}${badge(run.stats.processing_classification)}</div>${run.transcripts.map(t=>`<article class="exp-transcript"><blockquote>${esc(t.raw_text)}</blockquote><p>媒体 ${sec(t.start)}–${sec(t.end)} · Session ${sec(t.timestamp)} · ${esc(t.research_scope||run.provenance.research_scope||'UNKNOWN')}</p><p>置信度 ${t.confidence===null?'UNKNOWN':esc(t.confidence)} · 身份未关联 · ${esc(t.verification_status)}</p>${safeMedia(`/api/sessions/${sidPath}/assets/${encodeURIComponent(t.asset_id)}`)?`<audio controls preload="none" src="/api/sessions/${sidPath}/assets/${esc(encodeURIComponent(t.asset_id))}#t=${Number(t.start)},${Number(t.end)}"></audio>`:''}</article>`).join('')}${json('原始转录、VAD / 模型哈希及授权声明',run)}</section>`).join('')||'<div class="card exp-card">尚未执行语音分析。真实视频没有音轨时，不生成替代语音。</div>'}`;
  }
  function renderResearch() {
    const report=overview.latest_research;
    return `<section class="card exp-card"><div class="exp-toolbar"><h3>有证据约束的研究工作流</h3><button class="button" data-exp-action="research">运行规则研究</button><button class="button small" data-exp-action="export" ${report?'':'disabled'}>导出完整 JSON</button></div><p>Observation → Research → Evidence → Decision。原始事实、推断、缺证分别保留。默认规则运行，不把规则伪装成大模型推理。</p>${report?`<div class="exp-summary">${badge(report.status)}${badge(report.generation.processing_method)}${badge(report.publication_status)}</div><div class="exp-workflow">${report.workflow.map(w=>`<article><h4>${esc(w.role)}</h4><p>${esc(w.method)} · 模型推理 ${w.model_inference_executed?'是':'否'}</p><p>${esc(w.output)}</p></article>`).join('')}</div><p>${esc(report.research?.question)}</p>${dimensions(report.dimensions)}<h3>研究交付模板</h3><div class="exp-two">${report.report_templates.map((t,i)=>`<article class="exp-template"><h4>${esc(typeof t.template==='object'?(t.template.name||t.template.title||t.template.id):t.template)}</h4>${badge(t.status)}<p>${esc(t.research_question)}</p><button class="button small" data-exp-export-template="${i}">导出此模板 JSON</button>${json('模板证据、缺证与后续验证',t)}</article>`).join('')}</div>${json('FACT / INFERENCE / INSUFFICIENT_EVIDENCE',report.decision_analysis)}${json('证据索引与排除项',{evidence:report.evidence_index,excluded:report.excluded_evidence})}${json('关联边界与限制',{temporal_links:report.temporal_links,limitations:report.limitations})}<form data-exp-form="report-review" class="exp-form"><h3 class="exp-wide">人工审核（仅本地记录，不公开发布）</h3><label>审核结果<select name="decision"><option value="CHANGES_REQUESTED">需要修改 / 补证</option><option value="APPROVED">本地审核认可</option></select></label><label>审核说明<textarea name="notes" required maxlength="3000"></textarea></label>${check('human_confirmed','我已阅读当前报告和原始证据，确认本次审核')}<button class="button" type="submit">保存人工审核</button></form>${json('历史审核记录',overview.reviews)}`:'<p>尚未生成研究草稿。缺少人工真值、消费者反馈、产品交互或业务输入时，输出缺证状态，不自动补齐结论。</p>'}</section>`;
  }
  function renderSettings() {
    const c=overview.context;
    return `<section class="card exp-card"><h3>研究边界与资料授权</h3><p>授权由研究人员声明，系统没有独立验证。保留期为记录字段，不代表自动删除已启用；删除请求会暂停新处理，原始资料需另行审核处置。</p><form data-exp-form="context" class="exp-form"><label>环境<select name="environment">${['UNKNOWN','HOME_TEST','FIELD_STUDY','REFERENCE_TEST'].map(v=>option(v,v,c.environment)).join('')}</select></label><label>研究目的<textarea name="research_purpose" maxlength="2000">${esc(c.research_purpose)}</textarea></label><label>授权状态<select name="authorization_status">${['UNKNOWN','AUTHORIZED','DENIED'].map(v=>option(v,v,c.authorization_status)).join('')}</select></label>${field('authorization_reference','授权记录引用',c.authorization_reference)}${check('notice_provided','重新确认已完成用途告知（不会自动勾选）')}<label>资料访问范围<select name="access_scope">${['LOCAL_ONLY','PROJECT_MEMBERS'].map(v=>option(v,v,c.access_scope)).join('')}</select></label>${field('retention_days','保留期 / 天（未知留空）',c.retention_days??'','type="number" min="1" max="3650"')}<label>删除处理状态<select name="deletion_status">${['ACTIVE','REQUESTED'].map(v=>option(v,v,c.deletion_status)).join('')}</select></label><label>去标识状态<select name="deidentification_status">${['UNKNOWN','RAW','REDACTED'].map(v=>option(v,v,c.deidentification_status)).join('')}</select></label><label>音视频时间关系<select name="time_alignment_status">${['UNKNOWN','USER_PROVIDED','HUMAN_VERIFIED'].map(v=>option(v,v,c.time_alignment_status)).join('')}</select></label><label>时间关系核验依据<textarea name="time_alignment_notes" maxlength="1000">${esc(c.time_alignment_notes)}</textarea></label><button class="button" type="submit">保存研究设置</button></form>${json('当前完整上下文（不改变旧报告设置）',c)}${json('系统边界',overview.limitations)}</section>`;
  }
  function sourceRef(){return {kind:source.source_ref.kind,asset_id:source.source_ref.asset_id||null};}
  async function loadPredictions(more=false) {
    const runId=more?predictions?.record_id:$('[data-exp-run]').value;
    if(!runId)throw Error('请选择派生结果');
    const offset=more?predictions.predictions.length:0;
    if(more&&offset>=predictions.total)return;
    const next=await request(path('/behaviors/'+encodeURIComponent(runId)+`?offset=${offset}&limit=1000`));
    if(disposed)return;
    if(next.record_id!==runId)throw Error('规则结果来源不一致，请重新读取。');
    if(more&&!next.predictions.length&&offset<next.total)throw Error('后续预测未返回，请稍后重试。');
    selectedRun=runId;predictions={...next,predictions:more?[...predictions.predictions,...next.predictions]:next.predictions};
    render();status(`已加载 ${predictions.predictions.length} / ${predictions.total} 条规则记录；未自动读取其余页。`);
  }
  async function job(run) {
    const id=run.job_id;if(!id)throw Error('后端未返回 Job ID');
    while(!disposed){const item=await request(`/sessions/${sidPath}/jobs/${encodeURIComponent(id)}`);status(`${item.status} · ${item.message||item.kind} · ${Math.round((item.progress||0)*100)}%`);
      if(item.status==='failed')throw Error(item.error||'任务失败');if(item.status==='completed'){await refresh();status('处理完成，原始证据和派生记录分别保存。');return item;}
      await new Promise((resolve,reject)=>{const done=()=>{clearTimeout(timer);reject(new DOMException('Disposed','AbortError'));};const timer=setTimeout(()=>{abort.signal.removeEventListener('abort',done);resolve();},700);abort.signal.addEventListener('abort',done,{once:true});});}
  }
  async function action(work) {if(busy)return;busy=true;try{await work();}catch(error){if(error.name!=='AbortError')status(error.message,true);}finally{busy=false;}}
  function download(value,name) {const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));downloads.add(url);const link=document.createElement('a');link.href=url;link.download=name;link.click();URL.revokeObjectURL(url);downloads.delete(url);}
  container.addEventListener('submit',event=>{const form=event.target.closest('[data-exp-form]');if(!form)return;event.preventDefault();void action(async()=>{
    const data=new FormData(form),value=name=>String(data.get(name)||''),num=name=>Number(value(name)),yes=name=>data.get(name)==='on';
    const name=form.dataset.expForm;
    if(name==='annotation'||name==='review-range'){
      if(!source)throw Error('请先读取来源');const body={source_ref:sourceRef(),source_fingerprint:source.fingerprint,track_id:value('track_id'),start:num('start'),end:num('end'),human_confirmed:yes('human_confirmed')};
      if(name==='annotation')Object.assign(body,{label:value('label'),occluded:yes('occluded'),uncertain:yes('uncertain'),notes:value('notes')});else body.complete=yes('complete');
      await post(name==='annotation'?'/annotations':'/reviewed-ranges',body);
    } else if(name==='business'){
      let raw=value('value');if(value('value_type')==='number'){raw=Number(raw);if(!Number.isFinite(raw))throw Error('数值无效');}if(value('value_type')==='boolean'){if(!['true','false'].includes(raw))throw Error('布尔值填写 true 或 false');raw=raw==='true';}
      await post('/business-inputs',{metric_id:value('metric_id'),timestamp:num('timestamp'),value:raw,unit:value('unit'),source_type:value('source_type'),evidence_refs:data.getAll('evidence_refs'),external_record_reference:value('external_record_reference')||null,human_confirmed:yes('human_confirmed'),notes:value('notes')});
    } else if(name==='context'){
      const allowed=['study_id','research_purpose','environment','authorization_status','authorization_reference','notice_provided','access_scope','retention_days','deletion_status','deidentification_status','product_present_verified','product_evidence_refs','consumer_characteristics','membership_reference','time_alignment_status','time_alignment_notes'];
      const body=Object.fromEntries(allowed.filter(k=>k in overview.context).map(k=>[k,overview.context[k]]));
      for(const key of ['research_purpose','environment','authorization_status','access_scope','deletion_status','deidentification_status','time_alignment_status','time_alignment_notes'])body[key]=value(key);
      Object.assign(body,{authorization_reference:value('authorization_reference')||null,notice_provided:yes('notice_provided'),retention_days:value('retention_days')?num('retention_days'):null});await post('/context',body);
    } else if(name==='audio'){
      if(!yes('confirm_processing')||!['AUTHORIZED','REFERENCE_TEST'].includes(value('status')))throw Error('请先明确授权范围并确认本地处理。');
      if(value('status')==='AUTHORIZED'&&!yes('notice_provided'))throw Error('消费者音频需要已告知声明。');
      const authorization={status:value('status'),scope:value('status')==='REFERENCE_TEST'?'REFERENCE_TECHNICAL_TEST':'CONSUMER_RESEARCH',notice_provided:yes('notice_provided'),basis:value('basis'),research_purpose:value('research_purpose'),retention_days:value('retention_days')?num('retention_days'):null,access_scope:'LOCAL_ONLY'};
      let aid=value('asset_id');const file=data.get('file');if(file?.size){const upload=new FormData();upload.append('kind','audio');upload.append('file',file);status('上传已授权音频…');aid=(await request(`/sessions/${sidPath}/assets`,{method:'POST',body:upload})).asset_id;}
      if(!aid)throw Error('请选择已有音频或已授权文件。');await job(await post('/audio',{asset_id:aid,offset_seconds:num('offset_seconds'),authorization}));return;
    } else if(name==='report-review'){
      if(!yes('human_confirmed'))throw Error('审核必须由人工明确确认。');const report=overview.latest_research;await post('/reviews',{report_id:report.record_id,report_sha256:report.report_sha256,human_confirmed:true,decision:value('decision'),notes:value('notes')});
    }
    await refresh();status('已保存；原始观测、旧报告和模型数据保持不变。');
  });},{signal:abort.signal});
  container.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!container.contains(button))return;
    if(button.dataset.expTab){tab=button.dataset.expTab;render();return;}
    if(button.dataset.expExportTemplate!==undefined){const i=Number(button.dataset.expExportTemplate);download(overview.latest_research.report_templates[i],`experience-template-${i+1}.json`);return;}
    void action(async()=>{
      if(button.dataset.expEvidence){const e=evidence.find(x=>x.ref===button.dataset.expEvidence);if(!e)return;const target=$('.exp-event-detail'),frame=safeMedia(e.frame_url),media=safeMedia(e.media_url);target.innerHTML=`${frame?`<img class="exp-evidence-image" alt="事件原始证据" src="${esc(frame)}">`:''}${media?`<a class="button small" href="${esc(media)}" target="_blank" rel="noopener">查看原始媒体</a>`:''}${json('事件原始记录',e)}`;return;}
      switch(button.dataset.expAction){
        case 'load-source':source=null;predictions=null;evaluation=null;await loadPage();break;
        case 'previous':if(frameIndex>0){frameIndex--;displayFrame();}else await loadPage(Math.max(0,pageOffset-300),true);break;
        case 'next':if(frameIndex+1<source.frames.length){frameIndex++;displayFrame();}else await loadPage(pageOffset+source.frames.length);break;
        case 'behaviors':await job(await post('/behaviors',{source_ref:sourceRef()}));break;
        case 'predictions':await loadPredictions();break;
        case 'predictions-more':await loadPredictions(true);break;
        case 'evaluate':evaluation=await post('/evaluate',{behavior_run_id:$('[data-exp-run]').value,train:[]});render();status(`验收状态：${evaluation.status}；未覆盖区间不作为负例。`);break;
        case 'research':await job(await post('/research',{provider:'rules'}));break;
        case 'export':download(overview.latest_research,`experience-${sid}-draft.json`);break;
        case 'microphone':if(overview.context.authorization_status!=='AUTHORIZED'||!overview.context.notice_provided||!overview.context.research_purpose)throw Error('请先在研究设置记录授权、用途与告知，再进入原有语音采集。');location.hash='capture';break;
      }
    });
  },{signal:abort.signal});
  container.addEventListener('change',event=>{const el=event.target;if(el.matches('[data-exp-source]')){pageGeneration++;frameLoad++;sourceIndex=Number(el.value);source=null;predictions=null;evaluation=null;render();}if(el.matches('[data-exp-run]')){selectedRun=el.value;predictions=null;evaluation=null;render();}if(el.matches('[data-exp-track]')){trackFilter=el.value;displayFrame();}if(el.matches('[data-exp-frame]')){frameIndex=Number(el.value);displayFrame();}},{signal:abort.signal});
  if(sid)void action(async()=>{await refresh();status(`Session ${sid} · 研究记录独立于原 Crest C3 / Evidence-to-Decision。`);});else{status('请使用顶部选择器选择已有 Session。');render();}
  return {destroy(){disposed=true;aclView?.destroy();abort.abort();frameLoad++;pageGeneration++;$$('video,audio').forEach(m=>{m.pause();m.removeAttribute('src');m.load();});downloads.forEach(URL.revokeObjectURL);downloads.clear();const img=$('.exp-frame');if(img){img.onload=null;img.onerror=null;}}};
}
