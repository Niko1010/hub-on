/* ACL timeline reviews use original sampled frames, not reconstructed video or inferred stage completion. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=value=>`<span class="exp-badge">${esc(value)}</span>`;
export function timelineTime(value){if(!Number.isFinite(value)||value<0)return '未知';return `${String(Math.floor(value/60)).padStart(2,'0')}:${String(Math.floor(value%60)).padStart(2,'0')}`;}
const precise=value=>Number.isFinite(value)?`${timelineTime(value)} · ${value.toFixed(3)} s`:'未知';
export function timelineConfirmedDuration(group){const confirmed=(group.segments||[]).filter(s=>s.status==='HUMAN_VERIFIED'&&Number.isFinite(s.actual_duration_seconds));return confirmed.length?confirmed.reduce((n,s)=>n+s.actual_duration_seconds,0):null;}
export function timelineNearestIndex(frames,time){if(!frames.length||!Number.isFinite(time))return -1;let best=0;frames.forEach((frame,i)=>{if(Math.abs(frame.timestamp-time)<Math.abs(frames[best].timestamp-time))best=i;});return best;}
export function timelineRequest(cache,kind,body,newId){const signature=JSON.stringify(body);if(cache[kind]?.signature===signature)return cache[kind].body;const value={request_id:newId(),...body};cache[kind]={signature,body:value};return value;}

export function renderAclTimelineSummary(snapshot){
  if(!snapshot?.groups)return '<p>该历史草案未包含本次六组视觉时间轴快照；不把当前新增记录冒充旧报告分析。</p>';
  const segments=snapshot.groups.flatMap(group=>group.segments||[]),count=status=>segments.filter(s=>s.status===status).length;
  return `<section class="exp-detail"><h4>报告保存的视觉时间轴快照</h4><p>${snapshot.groups.length} 组 / ${segments.length} 独立片段 · 已确认 ${count('HUMAN_VERIFIED')} · 待确认 ${count('AI_ASSISTED')} · 已拒绝 ${count('REJECTED')}</p><p>Session 分:秒（MM:SS）。未确认片段不计实际时长；多段不视为一个连续操作。来源为原始 JPEG 采样序列，连续 MP4 未保存。</p>${snapshot.groups.map(group=>`<article class="exp-template"><h4>${esc(group.label)}</h4>${badge(group.status)}<p>候选范围 ${timelineTime(group.candidate_start)}–${timelineTime(group.candidate_end)}</p>${(group.segments||[]).map(segment=>`<p>${esc(segment.label||segment.segment_id)} ${badge(segment.status)} · ${segment.status==='HUMAN_VERIFIED'?'确认边界':'候选边界'} ${precise(segment.start_anchor?.timestamp??segment.candidate_start)}–${precise(segment.end_anchor?.timestamp??segment.candidate_end)} · 实际时长 ${segment.status==='HUMAN_VERIFIED'&&Number.isFinite(segment.actual_duration_seconds)?segment.actual_duration_seconds.toFixed(3)+' s':'未知 / 待确认'}<br>原始 Observation：${esc((segment.evidence||[]).map(a=>a.evidence_ref||'observation:'+a.observation_id).join(' · ')||'未提供')}</p>`).join('')}</article>`).join('')}<h4>快照中的原话与主题关联</h4>${(snapshot.feedback||[]).map(item=>`<p><strong>${esc(item.label)}</strong>：${esc(item.quote)}<br>原反馈 Event ${esc(item.event_id)} · ${esc(item.feedback_record_id)}</p>`).join('')||'<p>该报告快照没有原话记录。</p>'}${(snapshot.feedback_links||[]).map(link=>`<p>主题关联：${esc(link.feedback_field)} → ${link.target==='future_dynamic_validation'?'未来动态运动验证（本轮未测试）':esc(snapshot.groups.find(group=>group.group_id===link.group_id)?.label||link.group_id)+(link.segment_id?' / '+esc(link.segment_id):'')} · ${esc(link.notes||'无补充说明')}；非因果结论。</p>`).join('')||'<p>尚无此快照内的人工主题关联。</p>'}<p>证据缺口：AI_ASSISTED 仍待逐段人工核验；未测试的动态运动不作为本次结果；原话不能替代动作边界或成功穿戴证明。</p></section>`;
}

export function mountAclTimeline(root,{session,onChanged=()=>{}}={}){
  const abort=new AbortController(),sid=encodeURIComponent(session.session_id),base=`/api/sessions/${sid}/experience/acl/timeline`,requestCache={};
  let disposed=false,busy=false,timeline=null,frames=[],frameIndex=0,loadedFrame=null,imageLoader=null,imageGeneration=0;
  let playing=false,speed=1,timer=null,selected=null,startAnchor=null,endAnchor=null;
  const $=selector=>root.querySelector(selector),$$=selector=>[...root.querySelectorAll(selector)];
  root.innerHTML=`<section class="card exp-card"><div class="exp-toolbar"><h3>实际体验时间轴 · 六组候选与逐段复核</h3><button type="button" class="button small" data-tl-action="refresh">刷新已保存状态</button></div><p>Session 分:秒（MM:SS）。AI_ASSISTED 是待人工复核的候选；绑带和运动分段分别保存，候选范围不代表连续动作或实际持续时间。</p><div class="exp-status" data-tl-status role="status">正在读取已保存时间轴与原始采样帧…</div><div data-tl-media></div><div class="exp-review-layout"><div><div class="exp-stage"><img class="exp-frame" data-tl-image alt="当前 Session 原始采样帧" hidden></div><p data-tl-frame-state aria-live="polite">未载入采样帧。</p><div class="exp-toolbar"><button class="button small" type="button" data-tl-action="previous">上一帧</button><button class="button small" type="button" data-tl-action="play">播放采样序列</button><button class="button small" type="button" data-tl-action="next">下一帧</button><label>播放速度<select data-tl-speed><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div><label>采样帧索引<input type="range" data-tl-slider min="0" max="0" value="0" step="1" disabled></label><p data-tl-frame-info></p></div><aside class="exp-inspector"><h4>从当前已加载的真实帧取边界</h4><p>只读取真实 timestamp、frame_index、Observation ID。不需要手输时间，不从候选或姿态自动确认。</p><div data-tl-selection>请在下方选择一个独立片段进行复核。</div><div class="exp-toolbar"><button class="button small" type="button" data-tl-action="capture-start" disabled>当前帧设为开始</button><button class="button small" type="button" data-tl-action="capture-end" disabled>当前帧设为结束</button><button class="button small" type="button" data-tl-action="reset-anchors">清空所选边界</button></div><p data-tl-anchors>开始：未选；结束：未选。</p><form class="exp-form" data-tl-form="review"><label class="exp-wide">本次人工处理<select name="status"><option value="HUMAN_VERIFIED">HUMAN_VERIFIED · 确认当前片段</option><option value="REJECTED">REJECTED · 拒绝候选</option><option value="AI_ASSISTED">AI_ASSISTED · 保留待确认</option></select></label><label class="exp-wide">复核说明<textarea name="notes" maxlength="2000" placeholder="记录亲自查看的证据与不确定性"></textarea></label><label class="exp-check exp-wide"><input type="checkbox" name="human_confirmed" required> 我已查看本片段原始采样证据并明确选择本次状态；不据姿态认定成功穿戴</label><button class="button" type="submit">保存本片段复核</button></form></aside></div></section><div class="exp-review-layout"><section class="card exp-card"><h3>六组体验过程</h3><div data-tl-groups></div></section><aside class="card exp-card"><h3>体验者原话 · 与视觉候选分开</h3><p>原话与片段的关联仅表达主题关系，不证明因果、动作发生或完成。球场运动担忧可归入未来动态运动验证，本次没有进行该测试。</p><div data-tl-feedback></div><form class="exp-form" data-tl-form="feedback-link"><label class="exp-wide">选择原话<select name="feedback" data-tl-feedback-select required></select></label><label class="exp-wide">关联对象<select name="target" data-tl-target><option value="candidate">当前体验组 / 独立片段</option><option value="future_dynamic_validation">未来动态运动验证 · 本轮未测试</option></select></label><label class="exp-wide">体验组<select name="group_id" data-tl-link-group></select></label><label class="exp-wide">具体片段（可不选）<select name="segment_id" data-tl-link-segment></select></label><label class="exp-wide">关联说明<textarea name="notes" maxlength="2000" placeholder="只说明原话与主题的关系，不补造因果"></textarea></label><label class="exp-check exp-wide"><input type="checkbox" name="human_confirmed" required> 我明确确认此主题关联；不代表视频已经证明该反馈或未来实验已完成</label><button class="button" type="submit">保存原话关联</button></form></aside></div>`;
  function status(message,error=false){if(disposed)return;const node=$('[data-tl-status]');node.textContent=message;node.classList.toggle('exp-error',error);}
  async function request(path,body){
    if(!window.HUBONE_RECORDING?.enabled)throw Error('NOT CONNECTED：时间轴只读取本地真实 Session API。');
    const response=await fetch(path,{cache:'no-store',signal:abort.signal,...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
    const value=await response.json();if(!response.ok)throw Error(typeof value.detail==='string'?value.detail:JSON.stringify(value.detail||value));return value;
  }
  function safeFrame(frame){const prefix=`/api/live/sessions/${sid}/frames/`,value=String(frame?.frame_url||'');return value.startsWith(prefix)&&/^\d{12}\.jpg$/.test(value.slice(prefix.length))?value:null;}
  function stop(){playing=false;clearTimeout(timer);timer=null;const node=$('[data-tl-action="play"]');if(node)node.textContent='播放采样序列';}
  function controls(){
    $$('button').forEach(button=>button.disabled=busy);
    for(const action of ['previous','next','play'])$(`[data-tl-action="${action}"]`).disabled=busy||!frames.length;
    for(const action of ['capture-start','capture-end'])$(`[data-tl-action="${action}"]`).disabled=busy||!selected||!loadedFrame;
    $('[data-tl-slider]').disabled=busy||!frames.length;
    const unavailable=$('[data-tl-unavailable]');if(unavailable)unavailable.disabled=true;
  }
  function schedule(){
    if(!playing||disposed)return;
    if(frameIndex>=frames.length-1){stop();$('[data-tl-frame-state]').textContent='已到最后一张保存帧；不会循环补造记录。';return;}
    const gap=frames[frameIndex+1].timestamp-frames[frameIndex].timestamp;
    if(gap>1)$('[data-tl-frame-state]').textContent=`采样间隔 ${gap.toFixed(3)} s；间隔内无连续视频，等待下一张原始帧，不插帧。`;
    timer=setTimeout(()=>showFrame(frameIndex+1),Math.max(40,gap*1000/speed));
  }
  function showFrame(index){
    if(disposed||!frames.length)return;
    clearTimeout(timer);timer=null;const token=++imageGeneration;
    if(imageLoader){imageLoader.onload=null;imageLoader.onerror=null;imageLoader.removeAttribute?.('src');}
    frameIndex=Math.max(0,Math.min(frames.length-1,Math.round(index)));loadedFrame=null;
    const frame=frames[frameIndex],url=safeFrame(frame),img=$('[data-tl-image]');img.hidden=true;
    $('[data-tl-slider]').value=String(frameIndex);$('[data-tl-frame-info]').textContent=`${frameIndex+1} / ${frames.length} · ${precise(frame.timestamp)} · frame_index ${frame.frame_index} · Observation ${frame.observation_id}`;
    $('[data-tl-frame-state]').textContent='LOADING · 正在读取这张原始采样帧，加载完成前不能取边界。';controls();
    if(!url){stop();status('原始帧 URL 不属于当前 Session，已拒绝。',true);return;}
    const loader=new Image();imageLoader=loader;
    loader.onload=()=>{if(disposed||token!==imageGeneration)return;loadedFrame=frame;img.src=url;img.hidden=false;$('[data-tl-frame-state]').textContent='原始 JPEG 采样帧已加载；这不是连续 MP4。';controls();schedule();};
    loader.onerror=()=>{if(disposed||token!==imageGeneration)return;loadedFrame=null;stop();$('[data-tl-frame-state]').textContent='FRAME_UNAVAILABLE · 此采样图像读取失败，不用其他帧替代。';controls();};loader.src=url;
  }
  function renderSelection(){
    const group=timeline?.groups?.find(g=>g.group_id===selected?.group_id),segment=group?.segments?.find(s=>s.segment_id===selected?.segment_id);
    $('[data-tl-selection]').innerHTML=segment?`<h4>${esc(group.label)} · ${esc(segment.label||segment.segment_id)}</h4>${badge(segment.status)}<p>当前 review：${esc(segment.review_id||'尚无人工复核')}。开始 / 结束须独立从播放器选取，候选边界没有自动填入。</p>`:'请在下方选择一个独立片段进行复核。';
    $('[data-tl-anchors]').textContent=`开始：${startAnchor?precise(startAnchor.timestamp)+' · Observation '+startAnchor.observation_id:'未选'}；结束：${endAnchor?precise(endAnchor.timestamp)+' · Observation '+endAnchor.observation_id:'未选'}。`;controls();
  }
  function preview(anchor,label){const url=safeFrame(anchor);return anchor?`<div><p>${esc(label)} · Observation ${esc(anchor.observation_id)} · ${precise(anchor.timestamp)}</p>${url?`<button class="button small" type="button" data-tl-action="seek" data-time="${Number(anchor.timestamp)}">跳到 ${timelineTime(anchor.timestamp)}</button><img class="exp-evidence-image" src="${esc(url)}" alt="${esc(label)}原始采样帧" loading="lazy">`:'<p>原始图像不可用</p>'}</div>`:'<p>该边界尚无原始采样依据。</p>';}
  function renderGroups(){
    $('[data-tl-groups]').innerHTML=(timeline.groups||[]).map(group=>{const duration=timelineConfirmedDuration(group);return `<article class="exp-template"><h4>${esc(group.label)}</h4>${badge(group.status)}<p>候选范围：<button class="button small" type="button" data-tl-action="seek" data-time="${Number(group.candidate_start)}">${timelineTime(group.candidate_start)}</button>–<button class="button small" type="button" data-tl-action="seek" data-time="${Number(group.candidate_end)}">${timelineTime(group.candidate_end)}</button></p><p>已确认独立片段时长合计：${duration===null?'未确认，不计算':duration.toFixed(3)+' s'}。合计不代表连续动作；候选总范围不作为实际时长。</p>${(group.segments||[]).map(segment=>`<article class="exp-detail"><h4>${esc(segment.label||segment.segment_id)}</h4>${badge(segment.status)}<p>${segment.status==='HUMAN_VERIFIED'?'已确认边界':'候选边界（尚不能认定动作完成）'}：${precise(segment.start_anchor?.timestamp??segment.candidate_start)}–${precise(segment.end_anchor?.timestamp??segment.candidate_end)}</p><p>实际持续时间：${segment.status==='HUMAN_VERIFIED'&&Number.isFinite(segment.actual_duration_seconds)?segment.actual_duration_seconds.toFixed(3)+' s':'未确认，不计算'}</p><p>Observation 引用：${esc((segment.evidence||[]).map(a=>a.evidence_ref||'observation:'+a.observation_id).join(' · ')||'尚无')}</p><div class="exp-two">${preview(segment.start_anchor,'开始证据')}${preview(segment.end_anchor,'结束证据')}</div><p>连续原始视频：NOT_RECORDED；以上为已保存采样帧。</p><button type="button" class="button small" data-tl-action="review" data-group="${esc(group.group_id)}" data-segment="${esc(segment.segment_id)}">人工复核此片段 / 调整边界</button><p>${esc(segment.notes||'未填写人工说明。')}</p></article>`).join('')}</article>`;}).join('')||'<p>尚未导入体验候选；不在浏览器伪造阶段数据。</p>';
  }
  function renderFeedback(){
    $('[data-tl-feedback]').innerHTML=(timeline.feedback||[]).map(item=>`<article class="exp-template"><h4>${esc(item.label)}</h4>${badge('HUMAN_SOURCE · 体验者原话')}<p>${esc(item.quote)}</p><p>反馈记录 ${esc(item.feedback_record_id)} · Event ${esc(item.event_id)}</p>${(timeline.feedback_links||[]).filter(link=>link.feedback_record_id===item.feedback_record_id&&link.feedback_field===item.field).map(link=>`<p>主题关联：${link.target==='future_dynamic_validation'?'未来动态运动验证 · 本轮未测试':esc(timeline.groups.find(g=>g.group_id===link.group_id)?.label||link.group_id)+(link.segment_id?' · '+esc(link.segment_id):'')} ${badge(link.verification_status||'HUMAN_VERIFIED')}<br>${esc(link.notes||'')} · 非因果结论</p>`).join('')}</article>`).join('')||'<p>尚无保存原话，不用模拟反馈补齐。</p>';
    $('[data-tl-feedback-select]').innerHTML='<option value="">选择一条已存原话</option>'+(timeline.feedback||[]).map(item=>`<option value="${esc(item.feedback_record_id+'|'+item.field)}">${esc(item.label)} · ${esc(item.quote)}</option>`).join('');
    $('[data-tl-link-group]').innerHTML='<option value="">请选择体验组</option>'+(timeline.groups||[]).map(group=>`<option value="${esc(group.group_id)}">${esc(group.label)}</option>`).join('');updateLinkSegments();
  }
  function updateLinkSegments(){const future=$('[data-tl-target]').value==='future_dynamic_validation';$('[data-tl-link-group]').disabled=future;$('[data-tl-link-segment]').disabled=future;const group=timeline?.groups?.find(g=>g.group_id===$('[data-tl-link-group]').value);$('[data-tl-link-segment]').innerHTML='<option value="">仅关联组主题，不指定具体片段</option>'+(group?.segments||[]).map(s=>`<option value="${esc(s.segment_id)}">${esc(s.label||s.segment_id)} · ${timelineTime(s.candidate_start)}–${timelineTime(s.candidate_end)}</option>`).join('');}
  async function reloadTimeline(){
    const next=await request(base);if(disposed)return;
    if(timeline&&frames.length&&next.source_fingerprint!==timeline.source_fingerprint){stop();frames=[];loadedFrame=null;selected=null;startAnchor=endAnchor=null;throw Error('原始采样来源已变化，请点击刷新重新加载；旧边界不会提交。');}
    timeline=next;renderGroups();renderFeedback();renderSelection();
  }
  async function initialize(){
    stop();loadedFrame=null;frames=[];selected=null;startAnchor=endAnchor=null;await reloadTimeline();
    let offset=0,total=null,all=[];
    do{const page=await request(base+`/frames?offset=${offset}&limit=2000`);if(disposed)return;
      if(total===null)total=page.total;
      if(!Number.isInteger(total)||total<0||total>10000)throw Error('本次采样回看最多加载10,000帧；不会补造未读取帧。');
      if(page.total!==total||page.source_fingerprint!==timeline.source_fingerprint)throw Error('原始采样来源已变化，请刷新核对。');
      if(!page.items?.length&&offset<total)throw Error('原始采样帧分页不完整。');
      all.push(...(page.items||[]));offset=all.length;
    }while(offset<total);
    if(all.some((frame,i)=>!Number.isFinite(frame.timestamp)||!Number.isInteger(frame.observation_id)||(i>0&&frame.timestamp<all[i-1].timestamp)))throw Error('采样索引时间无效，未重排或伪造播放顺序。');
    frames=all;$('[data-tl-slider]').max=String(Math.max(0,frames.length-1));
    $('[data-tl-media]').innerHTML=`<p>${badge('OBSERVATION_SEQUENCE')}${badge(timeline.source_status)} · ${frames.length} 张原始 JPEG 帧；无已保存 MP4，无法查看连续原始视频。</p><button type="button" class="button small" disabled aria-disabled="true" data-tl-unavailable>连续原始视频不可用（NOT_RECORDED）</button><p>使用下方采样帧回看器逐帧查看；播放间隔采用原始 timestamp，不补帧、不伪造声音或连续动作。</p>`;
    if(frames.length)showFrame(0);status('已读取保存的候选、原话与真实采样帧；尚未执行任何人工确认。');
  }
  async function action(work){if(busy||disposed)return;busy=true;controls();try{await work();}catch(error){if(error.name!=='AbortError')status(error.message,true);}finally{busy=false;if(!disposed){controls();const unavailable=$('[data-tl-unavailable]');if(unavailable)unavailable.disabled=true;}}}
  root.addEventListener('click',event=>{const button=event.target.closest('[data-tl-action]');if(!button)return;const name=button.dataset.tlAction;if(busy||disposed)return;
    if(name==='refresh'){void action(initialize);return;}
    if(name==='play'){if(playing)stop();else if(frames.length){playing=true;button.textContent='暂停采样播放';if(loadedFrame)schedule();else showFrame(frameIndex);}return;}
    if(name==='previous'||name==='next'){stop();showFrame(frameIndex+(name==='next'?1:-1));return;}
    if(name==='seek'){stop();const target=Number(button.dataset.time),index=timelineNearestIndex(frames,target);if(index>=0){showFrame(index);$('[data-tl-frame-state]').scrollIntoView?.({block:'center'});status(`跳到实际采样 ${precise(frames[index].timestamp)}；候选 ${timelineTime(target)} 仅作定位，不自动确认。`);}return;}
    if(name==='review'){const group=timeline?.groups?.find(g=>g.group_id===button.dataset.group),segment=group?.segments?.find(s=>s.segment_id===button.dataset.segment);if(!segment)return;stop();selected={group_id:group.group_id,segment_id:segment.segment_id,review_id:segment.review_id??null};startAnchor=endAnchor=null;const form=$('[data-tl-form="review"]');form.reset?.();renderSelection();const index=timelineNearestIndex(frames,segment.start_anchor?.timestamp??segment.candidate_start);if(index>=0)showFrame(index);$('[data-tl-selection]').scrollIntoView?.({block:'center'});return;}
    if(name==='reset-anchors'){startAnchor=endAnchor=null;renderSelection();return;}
    if(name==='capture-start'||name==='capture-end'){if(!selected||!loadedFrame){status('请先选片段并等待当前真实帧加载完成。',true);return;}stop();if(name==='capture-start')startAnchor={...loadedFrame};else endAnchor={...loadedFrame};renderSelection();}
  },{signal:abort.signal});
  root.addEventListener('input',event=>{if(event.target.matches?.('[data-tl-slider]')&&!busy){stop();showFrame(Number(event.target.value));}},{signal:abort.signal});
  root.addEventListener('change',event=>{if(event.target.matches?.('[data-tl-speed]')){speed=[.5,1,2,4].includes(Number(event.target.value))?Number(event.target.value):1;clearTimeout(timer);if(playing&&loadedFrame)schedule();}if(event.target.matches?.('[data-tl-target],[data-tl-link-group]'))updateLinkSegments();},{signal:abort.signal});
  root.addEventListener('submit',event=>{const form=event.target.closest('[data-tl-form]');if(!form)return;event.preventDefault();void action(async()=>{
    stop();const input=new FormData(form),value=name=>String(input.get(name)||'');if(input.get('human_confirmed')!=='on')throw Error('必须由你明确确认本次处理；系统不会代选。');
    let body,path;
    if(form.dataset.tlForm==='review'){
      if(!selected)throw Error('请先选择一个独立片段。');const state=value('status');if(!['AI_ASSISTED','HUMAN_VERIFIED','REJECTED'].includes(state))throw Error('未知复核状态。');
      if(state==='HUMAN_VERIFIED'&&(!startAnchor||!endAnchor))throw Error('请从当前真实采样帧分别选择开始和结束。');
      if(state==='HUMAN_VERIFIED'&&startAnchor&&endAnchor&&endAnchor.timestamp<startAnchor.timestamp)throw Error('结束不能早于开始；请在播放器重新选择。');
      body={group_id:selected.group_id,segment_id:selected.segment_id,expected_review_id:selected.review_id,source_fingerprint:timeline.source_fingerprint,status:state,human_confirmed:true,start_observation_id:state==='HUMAN_VERIFIED'?startAnchor.observation_id:null,end_observation_id:state==='HUMAN_VERIFIED'?endAnchor.observation_id:null,notes:value('notes')};path='/reviews';
    }else{
      const item=timeline.feedback.find(f=>f.feedback_record_id+'|'+f.field===value('feedback'));if(!item)throw Error('请选择已保存原话。');const target=value('target');if(!['candidate','future_dynamic_validation'].includes(target))throw Error('未知关联对象。');
      if(target==='candidate'&&!value('group_id'))throw Error('请选择体验组。');
      body={feedback_record_id:item.feedback_record_id,feedback_field:item.field,target,group_id:target==='candidate'?value('group_id'):null,segment_id:target==='candidate'?(value('segment_id')||null):null,human_confirmed:true,notes:value('notes')};path='/feedback-links';
    }
    const payload=timelineRequest(requestCache,path,body,()=>crypto.randomUUID());await request(base+path,payload);
    selected=null;startAnchor=endAnchor=null;form.reset?.();await reloadTimeline();await onChanged();status('已追加保存本次人工处理；原始采样、原话与既有记录保持不变。模型草稿不会自动重算。');
  });},{signal:abort.signal});
  void action(initialize);
  return {destroy(){disposed=true;stop();++imageGeneration;abort.abort();if(imageLoader){imageLoader.onload=null;imageLoader.onerror=null;imageLoader.removeAttribute?.('src');}const img=$('[data-tl-image]');if(img)img.removeAttribute?.('src');}};
}
