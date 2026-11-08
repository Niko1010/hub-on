/* One-camera RTSP view. Raw image + independent image-coordinate overlay; no CAD access. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activeStates=new Set(['CONNECTING','LIVE','RECONNECTING','STOPPING']);
const number=(value,digits=1)=>value!==null&&value!==undefined&&Number.isFinite(Number(value))?Number(value).toFixed(digits):'NOT CONNECTED';
const when=value=>value?new Date(value).toLocaleString('zh-CN'):'—';

export function viewMode(status,observation,history=false,now=Date.now()){
  if(!status||status.simulated||observation?.simulated)return 'NOT CONNECTED';
  if(history||status.status==='STOPPED')return observation?'REPLAY':'NOT CONNECTED';
  const age=now-Date.parse(observation?.captured_at||'');
  return status.status==='LIVE'&&status.source_type==='RTSP'&&observation?.source_type==='RTSP'&&observation.session_id===status.session_id&&age>=-1000&&age<5000?'LIVE':'NOT CONNECTED';
}

export function trailSegments(observations,endTime,windowSeconds=10){
  const paths=new Map();let sampleIndex=0;
  for(const observation of observations){
    sampleIndex++;
    if(observation.timestamp<endTime-windowSeconds||observation.timestamp>endTime)continue;
    for(const track of observation.tracks||[]){
      const key=`${observation.connection_epoch}:${track.track_id}`;
      const points=paths.get(key)||[];
      const prior=points[points.length-1];
      points.push({point:track.footpoint,move:!prior||prior.sampleIndex!==sampleIndex-1||observation.timestamp-prior.time>1.5,time:observation.timestamp,sampleIndex,track_id:track.track_id});
      paths.set(key,points);
    }
  }
  return [...paths.values()];
}

const poseLinks=[['left_shoulder','right_shoulder'],['left_shoulder','left_elbow'],['left_elbow','left_wrist'],['right_shoulder','right_elbow'],['right_elbow','right_wrist'],['left_shoulder','left_hip'],['right_shoulder','right_hip'],['left_hip','right_hip'],['left_hip','left_knee'],['left_knee','left_ankle'],['right_hip','right_knee'],['right_knee','right_ankle']];
export function visiblePosePoints(track){
  return (track.keypoints||[]).filter(p=>p.visible&&p.confidence>=.5&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>0&&p.y>0);
}

export function aclSessionRequest(session){
  return {name:'ACL Knee Brace · 真实体验',product:'ACL Knee Brace',simulated:false,
    research:session?.product==='ACL Knee Brace'&&session.research?session.research:{
      question:'ACL功能性膝关节支具的穿戴、调整、行走和脱下过程中有哪些有证据支持的使用障碍？',
      objective:'分别记录真实视觉候选、人工阶段和体验反馈，形成待验证的产品改进与实验方案。',
      tasks:['接近产品','拿取','穿戴','调整绑带','站立','行走','脱下','体验反馈'],
      decision_to_support:'确定下一轮支具操作与体验验证，未核验环节保持INSUFFICIENT_EVIDENCE。',recording_relationship:'unknown'}};
}

export function mountLiveView(root,{session,study=null,onSession=async()=>{}}={}){
  const acl=session?.product==='ACL Knee Brace'||(!session&&study==='acl');
  const abort=new AbortController();let timer=null,disposed=false,pending=false,status=null,current=null;
  const initialBadge=document.querySelector('#mode');if(initialBadge)initialBadge.textContent='RTSP · NOT CONNECTED';
  let historyId='',cursor=0,observations=[],events=[],eventSignature='',frameKey='',imageGeneration=0,pollCount=0,viewGeneration=0;
  root.innerHTML=`<section class="live-review">
    <div class="lv-toolbar"><div><div class="eyebrow green">VISION INTELLIGENCE 1.1 / RTSP HOME TEST</div><h2>${acl?'ACL Knee Brace · 真实体验采集':'真实摄像头持续采集'}</h2></div><div class="lv-actions"><button class="button primary" id="lv-start">${acl?'开始 ACL 真实体验 · 新 Session':'开始采集 · 新 Session'}</button><button class="button" id="lv-stop" disabled>停止采集</button></div></div>
    <div class="lv-badges"><span class="pill" id="lv-mode">NOT CONNECTED</span><span class="pill" id="lv-connection">正在读取连接状态</span><span class="pill">IMAGE_PIXELS</span><span class="pill">CAD 轨迹 · NOT CONNECTED</span></div>
    <div class="lv-message" id="lv-message" role="status">尚未确认摄像头连接。账号和密码仅由本机后端读取。</div>
    <div class="lv-session"><label>采集记录 <select id="lv-history"><option value="">当前采集</option></select></label><span id="lv-session-id">Session —</span></div>
    <div class="lv-layout"><section class="card"><div class="card-head"><h2>摄像头画面与检测图层</h2><span class="sub" id="lv-frame-time">等待真实帧</span></div><div class="lv-stage" id="lv-stage"><span class="lv-empty" id="lv-empty">NOT CONNECTED · 尚无摄像头画面</span><canvas id="lv-overlay" aria-label="RTSP 人体检测框、Track ID 与画面轨迹"></canvas></div><div class="lv-controls"><label><input id="lv-boxes" type="checkbox" checked> 检测框与 Track ID</label><label><input id="lv-trails" type="checkbox" checked> 最近 10 秒轨迹</label><label><input id="lv-pose" type="checkbox" checked> 姿态关键点 · MODEL_BASED</label><button class="button small" id="lv-frame" disabled>查看此帧证据</button></div><p class="card-body small-note" id="lv-pose-summary">关键点等待真实模型输出；动作状态为 RULE_BASED 实验候选。</p><p class="card-body small-note">画面按实际推理采样更新，不是录像冒充直播。轨迹只使用家庭画面像素坐标；漏检、断流和重连之间不强行连接，不归属观前街任何楼层。</p></section>
    <div class="stack"><section class="card"><div class="card-head"><h2>运行指标</h2><span class="sub" id="lv-device">—</span></div><div class="lv-metrics">${[['resolution','实际分辨率'],['source_fps','RTSP 实测 FPS'],['configured_sample_fps','采样上限 FPS'],['sampled_pipeline_fps','采样管线完成 FPS'],['mean_warm_yolo_ms','YOLO 稳态耗时 ms'],['mean_tracking_ms','IoU Tracking 耗时 ms'],['process_cpu_percent','进程 CPU %（100%=1核）'],['gpu_utilization_percent','GPU 使用 %'],['gpu_memory_mb','显存 MB'],['elapsed_seconds','运行时长 s'],['reconnect_count','重连次数']].map(([key,label])=>`<div><span>${label}</span><strong data-lv-metric="${key}">NOT CONNECTED</strong></div>`).join('')}</div><p class="card-body small-note">Track ID 只在本次分析与连接段内标识轨迹，不等于独立消费者人数。管线 FPS 受采样上限约束，不是模型吞吐上限。GPU 使用与显存为整卡指标，包含其他应用。</p></section><section class="card"><div class="card-head"><h2>实时 Event 时间轴</h2><span id="lv-event-count">0 条</span></div><div class="lv-events" id="lv-events"></div></section></div></div>
    <section class="card card-body" id="lv-evidence" hidden><div class="lv-toolbar"><h2>原始事件证据</h2><button class="button small" id="lv-close-evidence">收起</button></div><img id="lv-evidence-image" alt="RTSP 实际采集证据帧"><pre id="lv-evidence-data"></pre></section>
    <details class="card card-body"><summary>采集信息与数据边界</summary><div class="lv-details" id="lv-details"></div><pre id="lv-provenance">模型溯源尚未记录</pre><p class="small-note">区域进入/离开是画面 ROI 规则事件，首次出现在区域内也可能产生进入事件。失踪和采集结束不伪造离开事件。LIVE、历史 REPLAY、上传 REAL_RECORDING 与 SIMULATED 数据分别标记。</p></details>
  </section>`;
  const $=selector=>root.querySelector(selector),canvas=$('#lv-overlay'),stage=$('#lv-stage');
  function message(text,error=false){$('#lv-message').textContent=text;$('#lv-message').classList.toggle('error',error);}
  async function request(path,options={}){
    const response=await fetch('/api'+path,{cache:'no-store',signal:abort.signal,...options});
    const body=await response.json();
    if(!response.ok)throw Error(typeof body.detail==='string'?body.detail:`请求失败 HTTP ${response.status}`);
    return body;
  }
  function frameUrl(observation){
    const value=observation?.frame_url;
    return typeof value==='string'&&value.startsWith(`/api/live/sessions/${encodeURIComponent(observation.session_id)}/frames/`)?value:null;
  }
  function setMode(){
    const mode=viewMode(status,current,Boolean(historyId));
    $('#lv-mode').textContent=mode;$('#lv-mode').className='pill'+(mode==='LIVE'?' model':'');
    const top=document.querySelector('#mode');if(top)top.textContent=mode==='LIVE'?'LIVE · RTSP':mode==='REPLAY'?'REPLAY · RTSP 历史帧':'RTSP · NOT CONNECTED';
    if(status?.status==='LIVE'&&mode==='NOT CONNECTED')message('连接状态为运行中，但尚无新鲜画面 · NOT CONNECTED；旧帧不视为当前直播。');
  }
  function clearFrame(){
    imageGeneration++;current=null;frameKey='';observations=[];cursor=0;
    stage.querySelector('img')?.remove();canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    $('#lv-empty').hidden=false;$('#lv-frame').disabled=true;
    $('#lv-pose-summary').textContent='关键点等待真实模型输出；动作状态为 RULE_BASED 实验候选。';
    events=[];eventSignature='';$('#lv-events').innerHTML='';$('#lv-event-count').textContent='0 条';$('#lv-evidence').hidden=true;
  }
  function draw(){
    if(!current)return;
    const ctx=canvas.getContext('2d'),w=current.width,h=current.height;
    ctx.clearRect(0,0,w,h);
    const color=id=>['#2cc8d6','#e9b069','#b298ed','#e891ab'][String(id).split('').reduce((n,c)=>n+c.charCodeAt(0),0)%4];
    if($('#lv-trails').checked){
      for(const path of trailSegments(observations,current.timestamp)){
        ctx.beginPath();for(const p of path){if(p.move)ctx.moveTo(...p.point);else ctx.lineTo(...p.point);}
        ctx.strokeStyle=color(path[0].track_id);ctx.lineWidth=Math.max(2,w/300);ctx.stroke();
      }
    }
    if($('#lv-boxes').checked)for(const track of current.tracks||[]){
      const [x1,y1,x2,y2]=track.bbox;
      ctx.strokeStyle=color(track.track_id);ctx.lineWidth=Math.max(2,w/350);ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      const text=`#${track.track_id}  ${number(track.confidence*100,0)}%`;ctx.font=`600 ${Math.max(14,w/55)}px sans-serif`;
      const y=Math.max(20,y1-3);ctx.fillStyle='#10212be8';ctx.fillRect(x1,y-20,ctx.measureText(text).width+10,24);ctx.fillStyle='#fff';ctx.fillText(text,x1+4,y);
    }
    let visibleJoints=0;
    for(const track of current.tracks||[]){
      const points=visiblePosePoints(track);visibleJoints+=points.length;
      if(!$('#lv-pose').checked)continue;
      const byName=new Map(points.map(p=>[p.name,p]));
      ctx.strokeStyle='#e8bd7c';ctx.fillStyle='#fff0c9';ctx.lineWidth=Math.max(2,w/400);
      for(const [a,b] of poseLinks){const pa=byName.get(a),pb=byName.get(b);if(!pa||!pb)continue;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke();}
      for(const p of points){ctx.beginPath();ctx.arc(p.x,p.y,Math.max(2,w/200),0,Math.PI*2);ctx.fill();}
    }
    const names={entry:'进入',dwell:'停留',walking:'行走候选',bending:'弯腰候选',hand_raise:'抬手候选'};
    const candidates=(current.tracks||[]).flatMap(t=>Object.entries(t.pose_experiment?.statuses||{}).filter(([,s])=>['CANDIDATE','OBSERVED'].includes(s)).map(([k,s])=>`#${t.track_id} ${names[k]||k} ${s}`));
    $('#lv-pose-summary').textContent=`MODEL_BASED 关键点：${visibleJoints} 个可见点（置信度≥0.5）。RULE_BASED 实验：${candidates.join('；')||'无可确认候选 / 可见性不足'}。没有接入训练过的行为识别模型。`;
    canvas.dataset.poseVisibleCount=visibleJoints;
    canvas.dataset.observationId=current.observation_id;canvas.dataset.trackCount=current.tracks?.length||0;
  }
  function showFrame(observation){
    const url=frameUrl(observation);if(!url||`${observation.session_id}:${observation.observation_id}`===frameKey)return;
    frameKey=`${observation.session_id}:${observation.observation_id}`;
    const version=++imageGeneration,image=new Image();
    image.alt='真实 RTSP 采集画面';image.className='lv-image';
    image.onload=()=>{
      if(disposed||version!==imageGeneration)return;
      stage.querySelector('img')?.remove();stage.insertBefore(image,canvas);$('#lv-empty').hidden=true;
      current=observation;canvas.width=observation.width;canvas.height=observation.height;stage.style.aspectRatio=`${observation.width}/${observation.height}`;
      $('#lv-frame-time').textContent=`${when(observation.captured_at)} · 帧 ${observation.frame_index}`;
      $('#lv-frame').disabled=false;draw();setMode();
    };
    image.onerror=()=>{if(!disposed&&version===imageGeneration){current=null;setMode();message('证据帧读取失败 · NOT CONNECTED，未使用替代画面。',true);}};
    image.src=url;
  }
  async function refreshHistory(){
    const response=await request('/live/sessions');
    if(disposed)return;
    $('#lv-history').innerHTML='<option value="">当前采集</option>'+response.items.map(item=>`<option value="${esc(item.session_id)}">${esc(when(item.started_at))} · ${esc(item.status)} · ${esc(item.session_id.slice(0,8))}</option>`).join('');
    $('#lv-history').value=historyId;
  }
  function renderStatus(data){
    const old=status;status=data;
    if(old?.session_id!==data.session_id)clearFrame();
    $('#lv-connection').textContent=data.status||'NOT_CONNECTED';
    $('#lv-start').disabled=pending||data.credentials_configured===false||activeStates.has(data.status)&&!historyId;
    $('#lv-stop').disabled=pending||Boolean(historyId)||!['CONNECTING','LIVE','RECONNECTING'].includes(data.status);
    $('#lv-session-id').textContent=`Session ${data.session_id||'—'}`;
    const metrics=data.metrics||{};
    for(const node of root.querySelectorAll('[data-lv-metric]')){const key=node.dataset.lvMetric;node.textContent=key==='resolution'?(metrics.width&&metrics.height?`${metrics.width} × ${metrics.height}`:'NOT CONNECTED'):number(metrics[key]??(key==='sampled_pipeline_fps'?metrics.inference_fps:null),key==='reconnect_count'?0:1);}
    $('#lv-device').textContent=(metrics.device||'推理设备未确认')+(metrics.fallback_reason?' · 已回退 CPU':'');
    $('#lv-provenance').textContent=data.vision_provenance?JSON.stringify(data.vision_provenance,null,2):'模型溯源未记录 · 旧 Session 不补造来源';
    $('#lv-details').innerHTML=[['camera_id',data.camera_id],['source_type',data.source_type],['Session',data.session_id],['采集开始',when(data.started_at)],['采集结束',when(data.ended_at)],['坐标','IMAGE_PIXELS'],['floor_id','null · CAD NOT CONNECTED']].map(([label,value])=>`<div><b>${esc(label)}</b> ${esc(value||'—')}</div>`).join('');
    const notes={NOT_CONNECTED:'摄像头未连接。安全配置就绪后点击开始采集。',CONNECTING:'正在连接真实摄像头，等待第一帧。',LIVE:'真实 RTSP 采集中 · 检测与轨迹来自当前摄像头。',RECONNECTING:'视频源中断，正在自动重连；轨迹将开启新的连接段。',STOPPING:'正在停止采集并释放连接及模型资源…',STOPPED:'采集已停止 · 显示最后保存的历史证据，标记为 REPLAY。',ERROR:'采集失败 · 未生成替代画面。'};
    const missingConfig=!historyId&&data.credentials_configured===false?'本机摄像头配置未就绪 · 请在后端项目 .env.local 配置账号和密码；保存后页面自动检测，可直接开始采集。不要在网页输入凭据。':null;
    message(data.error||missingConfig|| (historyId?'REPLAY · 历史采集证据，不代表当前摄像头画面。':notes[data.status]||'NOT CONNECTED'),Boolean(data.error));
    setMode();
  }
  async function poll(){
    if(disposed)return;
    const version=viewGeneration;pollCount++;
    try{
      const data=await request(historyId?`/live/sessions/${encodeURIComponent(historyId)}`:'/live/status');
      if(disposed||version!==viewGeneration)return;renderStatus(data);
      if(data.session_id){
        const sid=encodeURIComponent(data.session_id);
        // This view draws only the recent trail window; avoid replaying an entire long capture on re-entry.
        if(cursor===0&&Number.isInteger(data.latest_observation?.observation_id))cursor=Math.max(0,data.latest_observation.observation_id-200);
        const result=await request(`/live/sessions/${sid}/observations?after=${cursor}&limit=200`);
        if(disposed||version!==viewGeneration)return;
        cursor=result.next_cursor??cursor;
        observations.push(...result.items);observations=observations.slice(-600);
        showFrame(data.latest_observation||result.items[result.items.length-1]);
        if(pollCount%3===0){
          const next=await request(`/sessions/${sid}/events`);if(disposed||version!==viewGeneration)return;events=next;
          const signature=next.map(e=>e.event_id).join(',');
          if(signature!==eventSignature){eventSignature=signature;$('#lv-event-count').textContent=`${next.length} 条`;$('#lv-events').innerHTML=next.slice(-150).reverse().map(e=>`<button class="lv-event" data-lv-event="${esc(e.event_id)}"><span>${number(e.timestamp,2)} s</span><span>${esc(e.event_type)}${e.metadata.track_id?` · Track #${esc(e.metadata.track_id)}`:''}<small>${esc(e.description)}</small></span></button>`).join('');}
        }
      }
      if(pollCount%12===0)await refreshHistory();
    }catch(error){if(error.name!=='AbortError'&&!disposed&&version===viewGeneration){status=null;setMode();$('#lv-connection').textContent='NOT CONNECTED';message(error.message,true);}}
    finally{if(!disposed)timer=setTimeout(poll,500);}
  }
  async function command(action){
    if(pending)return;pending=true;viewGeneration++;let failure=null;$('#lv-start').disabled=true;$('#lv-stop').disabled=true;
    try{
      const options={method:'POST'};
      if(action==='start'&&acl){options.headers={'Content-Type':'application/json'};options.body=JSON.stringify(aclSessionRequest(session));}
      const data=await request(`/live/${action}`,options);if(disposed)return;
      historyId='';clearFrame();renderStatus(data);await refreshHistory();
      if(action==='start'&&data.session_id)await onSession(data.session_id);
    }catch(error){if(!disposed&&error.name!=='AbortError')failure=error.message;}
    finally{pending=false;if(!disposed&&status)renderStatus(status);if(failure&&!disposed)message(failure,true);}
  }
  function showEvidence(event){
    const sid=status?.session_id;
    const observation=event?{session_id:sid,frame_url:event.evidence?.frame_url}:current;
    const url=frameUrl(observation);if(!url)return;
    $('#lv-evidence-image').src=url;$('#lv-evidence-data').textContent=JSON.stringify(event||current,null,2);$('#lv-evidence').hidden=false;
    $('#lv-evidence').scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  $('#lv-start').addEventListener('click',()=>command('start'),{signal:abort.signal});
  $('#lv-stop').addEventListener('click',()=>command('stop'),{signal:abort.signal});
  $('#lv-history').addEventListener('change',()=>{viewGeneration++;historyId=$('#lv-history').value;clearFrame();},{signal:abort.signal});
  $('#lv-frame').addEventListener('click',()=>showEvidence(),{signal:abort.signal});
  $('#lv-close-evidence').addEventListener('click',()=>{$('#lv-evidence').hidden=true;},{signal:abort.signal});
  for(const id of ['#lv-boxes','#lv-trails','#lv-pose'])$(id).addEventListener('change',draw,{signal:abort.signal});
  root.addEventListener('click',event=>{const button=event.target.closest('[data-lv-event]');if(button)showEvidence(events.find(e=>e.event_id===button.dataset.lvEvent));},{signal:abort.signal});
  poll();refreshHistory().catch(()=>{});
  return {destroy(){disposed=true;imageGeneration++;abort.abort();clearTimeout(timer);}};
}
