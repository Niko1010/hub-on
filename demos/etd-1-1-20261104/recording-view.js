/* Image-space observations only. This module never accesses a CAD scene or floor. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time = value => Number(value || 0).toFixed(2) + ' s';

export function mountRecordingView(root, {session, events, showEvidence}) {
  const api = window.HUBONE_RECORDING, abort = new AbortController();
  const assets = (session?.assets || []).filter(a => a.kind === 'video');
  let data = null, asset = null, raf = 0, generation = 0, activeEvents = [];
  root.innerHTML = `<section class="recording-review">
    <div class="rr-header"><div><div class="eyebrow green">RECORDED VISION / IMAGE COORDINATES</div><h2>真实录像 · 检测与轨迹</h2></div><select id="rr-asset" aria-label="选择录像">${assets.map(a => `<option value="${esc(a.asset_id)}">${esc(a.original_name)}</option>`).join('')}</select></div>
    <div class="rr-badges"><span class="pill" id="rr-source">等待录像</span><span class="pill model">YOLO + IoU Tracking</span><span class="pill">CAD 轨迹 · NOT CONNECTED</span><span class="pill">RTSP LIVE · NOT CONNECTED</span></div>
    <div class="rr-status" id="rr-status">${assets.length ? '正在读取同一 Session 的观测记录…' : '当前 Session 没有视频。请在采集记录中创建 Session 并上传 MP4。'}</div>
    <div class="rr-stats">${[['observations','人体观测','跨采样帧累计'],['tracks','Track ID','本次分析内，非独立消费者'],['peak','同时可见峰值','画面检测，不是全场人数'],['zones','区域进入 / 离开','视频画面 ROI，非 CAD 区域']].map(([id,label,note]) => `<div class="rr-stat"><small>${label}</small><strong id="rr-${id}">—</strong><small>${note}</small></div>`).join('')}</div>
    <p class="small-note">区域计数使用现有画面 ROI 规则：首次在区域内被检测到也会记为进入；漏检和录像结束不自动记为离开。它不是现场门口客流统计。</p>
    <div class="rr-layout"><section class="card"><div class="card-head"><h2>原始录像与采样检测框</h2><span class="sub" id="rr-clock">—</span></div><div class="rr-stage"><video id="rr-video" controls preload="metadata" playsinline></video><canvas id="rr-overlay" aria-label="真实人体检测框及 Track ID"></canvas></div><div class="rr-controls"><label><input id="rr-boxes" type="checkbox" checked> 检测框</label><label><input id="rr-trails" type="checkbox" checked> 最近 10 秒轨迹</label><label>Track <select id="rr-track"><option value="all">全部</option></select></label><button class="button small" id="rr-frame">查看当前证据帧</button></div><img class="rr-snapshot" id="rr-snapshot" hidden alt="现有 YOLO 分析生成的实际证据帧"><div class="card-body small-note">框与轨迹取自实际采样帧，不在漏检间补造位置。原视频继续按自身帧率播放。</div></section>
    <div class="stack"><section class="card"><div class="card-head"><h2>画面坐标轨迹</h2><span class="sub">IMAGE_PIXELS</span></div><canvas class="rr-map" id="rr-map" aria-label="当前录像的画面坐标轨迹"></canvas><div class="card-body small-note">家庭测试环境 · 不归属观前街楼层。轨迹断点保留；不投影至 CAD，不推断跨层或跨摄像头身份。</div></section><section class="card"><div class="card-head"><h2>同一录像的事件时间轴</h2><span class="sub" id="rr-event-count">0 条</span></div><div class="rr-events" id="rr-events"></div></section></div></div>
    <details class="card card-body"><summary>验收标识与数据来源</summary><div class="rr-meta" id="rr-meta"></div></details>
  </section>`;
  const $ = selector => root.querySelector(selector);
  const video = $('#rr-video'), overlay = $('#rr-overlay'), map = $('#rr-map');
  const status = (text, error = false) => { $('#rr-status').textContent = text; $('#rr-status').classList.toggle('error', error); };
  function frameAt(t) {
    if (!data?.frames.length) return null;
    let low=0, high=data.frames.length-1;
    while(low<high){const mid=Math.ceil((low+high)/2);if(data.frames[mid].media_time<=t)low=mid;else high=mid-1;}
    const frame=data.frames[low];
    const gap=data.frames[low+1]?.media_time-frame.media_time || (data.frames[1]?.media_time-data.frames[0]?.media_time) || .5;
    return t >= frame.media_time && t-frame.media_time<=gap*1.5 ? frame : null;
  }
  function draw() {
    if (!data || abort.signal.aborted) return;
    const t=video.currentTime, frame=frameAt(t), selected=$('#rr-track').value;
    const w=data.width,h=data.height, ctx=overlay.getContext('2d'), plot=map.getContext('2d');
    ctx.clearRect(0,0,w,h);plot.clearRect(0,0,w,h);
    plot.fillStyle='#eff5f5';plot.fillRect(0,0,w,h);
    plot.strokeStyle='#d5e2e4';plot.lineWidth=Math.max(1,w/1400);
    for(let i=1;i<8;i++){plot.beginPath();plot.moveTo(i*w/8,0);plot.lineTo(i*w/8,h);plot.moveTo(0,i*h/8);plot.lineTo(w,i*h/8);plot.stroke();}
    const points=data.image_zone.polygon;
    for(const target of [ctx,plot]){target.beginPath();points.forEach(([x,y],i)=>i?target.lineTo(x*w,y*h):target.moveTo(x*w,y*h));target.closePath();target.strokeStyle='rgba(75,181,153,.65)';target.lineWidth=w/700;target.setLineDash([w/150,w/200]);target.stroke();target.setLineDash([]);}
    const histories=new Map();
    for(const sample of data.frames){
      if(sample.media_time<t-10||sample.media_time>t)continue;
      for(const track of sample.tracks){if(selected!=='all'&&track.track_id!==selected)continue;
        if(!histories.has(track.track_id))histories.set(track.track_id,[]);
        histories.get(track.track_id).push({p:track.footpoint,t:sample.media_time,index:sample.frame_index});}
    }
    const sampleGap=(data.frames[1]?.media_time-data.frames[0]?.media_time)||.5;
    const hue=id=>['#36bdcf','#eead61','#a096e1','#e38ca8'][Number(id)%4];
    for(const [id,history] of histories){
      for(const target of ($('#rr-trails').checked?[ctx,plot]:[plot])){
        target.beginPath();let previous=null;
        for(const point of history){if(!previous||point.t-previous.t>sampleGap*1.6)target.moveTo(...point.p);else target.lineTo(...point.p);previous=point;}
        target.strokeStyle=hue(id);target.lineWidth=w/450;target.lineJoin='round';target.stroke();
      }
    }
    for(const track of frame?.tracks||[]){
      if(selected!=='all'&&track.track_id!==selected)continue;
      const [x1,y1,x2,y2]=track.bbox;
      if($('#rr-boxes').checked){ctx.strokeStyle=hue(track.track_id);ctx.lineWidth=w/500;ctx.strokeRect(x1,y1,x2-x1,y2-y1);ctx.font=`600 ${w/70}px sans-serif`;const label=`#${track.track_id}  ${(track.confidence*100).toFixed(0)}%`;ctx.fillStyle='#10232bdc';ctx.fillRect(x1,Math.max(0,y1-w/40),ctx.measureText(label).width+w/80,w/40);ctx.fillStyle='#fff';ctx.fillText(label,x1+w/160,Math.max(w/50,y1-w/150));}
      plot.fillStyle=hue(track.track_id);plot.beginPath();plot.arc(...track.footpoint,w/130,0,Math.PI*2);plot.fill();plot.font=`600 ${w/55}px sans-serif`;plot.fillText('#'+track.track_id,track.footpoint[0]+w/90,track.footpoint[1]);
    }
    $('#rr-clock').textContent=`${time(t)} · ${frame?.tracks.length||0} 人体 · 采样帧 ${frame?.frame_index??'—'}`;
    overlay.dataset.frameIndex=frame?.frame_index??'';overlay.dataset.trackCount=frame?.tracks.length||0;
  }
  function animate(){cancelAnimationFrame(raf);draw();if(!video.paused&&!video.ended)raf=requestAnimationFrame(animate);}
  async function load() {
    const version=++generation;data=null;cancelAnimationFrame(raf);video.pause();
    $('#rr-snapshot').hidden=true;overlay.getContext('2d').clearRect(0,0,overlay.width,overlay.height);map.getContext('2d').clearRect(0,0,map.width,map.height);
    for(const id of ['observations','tracks','peak','zones'])$('#rr-'+id).textContent='—';
    $('#rr-events').innerHTML='';$('#rr-event-count').textContent='0 条';$('#rr-meta').textContent='';
    $('#rr-track').innerHTML='<option value="all">全部</option>';delete $('.recording-review').dataset.runId;
    asset=assets.find(a=>a.asset_id===$('#rr-asset').value);if(!asset)return;
    video.src=api.mediaUrl(session.session_id,asset.asset_id);
    $('#rr-source').textContent=session.simulated||asset.simulated?'SIMULATED':asset.recording_mode||'来源未确认';
    activeEvents=events.filter(e=>e.evidence?.asset_id===asset.asset_id);
    status('正在读取真实 API 观测记录…');
    try{
      const result=await api.observations(session.session_id,asset.asset_id,abort.signal);
      if(version!==generation||abort.signal.aborted)return;data=result;
      if(data.playback_status==='READY')video.src=api.playbackUrl(session.session_id,asset.asset_id);
      activeEvents=activeEvents.filter(e=>e.metadata?.observation_run_id===data.run_id);
      overlay.width=map.width=data.width;overlay.height=map.height=data.height;
      $('.rr-stage').style.aspectRatio=map.style.aspectRatio=`${data.width}/${data.height}`;
      $('#rr-observations').textContent=data.observation_count;
      $('#rr-tracks').textContent=data.track_count;$('#rr-peak').textContent=data.max_simultaneous_tracks;
      const enter=activeEvents.filter(e=>e.event_type==='zone_enter').length,exit=activeEvents.filter(e=>e.event_type==='zone_exit').length;
      $('#rr-zones').textContent=`${enter} / ${exit}`;
      $('#rr-event-count').textContent=`${activeEvents.length} 条`;
      $('#rr-events').innerHTML=activeEvents.map(e=>`<button class="rr-event" data-rr-event="${esc(e.event_id)}"><span>${time(e.evidence.media_time)}</span><span>${esc(e.event_type)} · Track #${esc(e.metadata.track_id)}<small>${esc(e.description)}</small></span></button>`).join('')||'<p class="card-body">没有检测事件；不会生成替代结果。</p>';
      $('#rr-track').innerHTML='<option value="all">全部</option>'+[...new Set(data.frames.flatMap(f=>f.tracks.map(t=>t.track_id)))].map(id=>`<option value="${esc(id)}">#${esc(id)}</option>`).join('');
      $('#rr-meta').innerHTML=[['Session ID',data.session_id],['Asset ID',data.asset_id],['Job ID',data.job_id||'历史分析未记录'],['Observation Run ID',data.run_id],['Event ID',activeEvents[0]?.event_id||'无事件'],['Asset SHA-256',data.asset_sha256],['时间基准',`${data.timestamp_basis} / offset ${data.offset_seconds}s`],['空间绑定','NOT CONNECTED · floor_id=null']].map(([label,value])=>`<div><b>${label}</b> ${esc(value)}</div>`).join('');
      status(`${data.recording_mode} · 已读取 ${data.sampled_frames} 个采样帧、${data.observation_count} 条人体观测。${data.playback_status==='READY'?'播放器使用 H.264 兼容副本，原始录像保留。':''}家庭录像只使用画面坐标；持续 RTSP 和 CAD 轨迹未连接。`);
      $('.recording-review').dataset.runId=data.run_id;draw();
    }catch(error){if(error.name!=='AbortError'&&version===generation){status(error.message,true);$('#rr-meta').textContent=`Session ${session.session_id} / Asset ${asset.asset_id}`;}}
  }
  for(const name of ['timeupdate','seeked','loadeddata','pause','ended'])video.addEventListener(name,draw,{signal:abort.signal});
  video.addEventListener('play',animate,{signal:abort.signal});
  video.addEventListener('error',()=>{if(asset)status('视频播放 NOT CONNECTED：当前浏览器未能解码此视频；检测数据与证据帧独立保留。',true);},{signal:abort.signal});
  for(const id of ['#rr-boxes','#rr-trails','#rr-track'])$(id).addEventListener('change',draw,{signal:abort.signal});
  $('#rr-asset').addEventListener('change',load,{signal:abort.signal});
  $('#rr-frame').addEventListener('click',()=>{const frame=frameAt(video.currentTime);if(!frame)return;$('#rr-snapshot').src=api.frameUrl(session.session_id,asset.asset_id,frame.snapshot);$('#rr-snapshot').hidden=false;},{signal:abort.signal});
  root.addEventListener('click',event=>{const button=event.target.closest('[data-rr-event]');if(!button)return;const e=activeEvents.find(e=>e.event_id===button.dataset.rrEvent);if(e){video.currentTime=e.evidence.media_time;showEvidence(e.event_id);}},{signal:abort.signal});
  if(assets.length)load();
  return {destroy(){generation++;abort.abort();cancelAnimationFrame(raf);video.pause();video.removeAttribute('src');video.load();}};
}
