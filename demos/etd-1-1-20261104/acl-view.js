import {mountAclTimeline,renderAclTimelineSummary} from './acl-timeline.js?v=acl-timeline-20261108';
/* ACL study controls: original observations, human records and model drafts stay separate. */
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=value=>`<span class="exp-badge">${esc(value)}</span>`;
const details=(title,value)=>`<details class="exp-detail"><summary>${esc(title)}</summary><pre>${esc(JSON.stringify(value,null,2))}</pre></details>`;
const time=value=>value!==null&&value!==undefined&&Number.isFinite(Number(value))?`${Number(value).toFixed(2)} s`:'未知';
const stageNames={approach:'接近产品',pick_up:'拿取',wear:'穿戴',adjust_straps:'调整绑带',stand:'站立',walk:'行走',remove:'脱下',feedback:'体验反馈'};
export function aclDuration(start,end){return Number.isFinite(start)&&Number.isFinite(end)&&end>=start?end-start:null;}
export function selectAclCandidates(view){
  const recent=view.live_candidates||{},runs=view.behavior_runs||[],saved=runs[runs.length-1];
  const state=(typeof view.source_status==='string'?view.source_status:view.source_status?.status)||recent.capture_status||'NOT_CONNECTED';
  const active=['CONNECTING','LIVE','RECONNECTING','STOPPING'].includes(state);
  if(active&&recent.status==='PROVISIONAL')return {run:recent,label:'PROVISIONAL · 最近采样窗口'};
  if(saved)return {run:saved,label:active?'已保存的历史候选':'FROZEN · 最新保存的全量候选'};
  if(recent.status==='PROVISIONAL')return {run:recent,label:'REPLAY / PROVISIONAL · 末尾窗口，尚未冻结全量'};
  return {run:null,label:'NOT CONNECTED'};
}

export function nearestAclObservation(frames,target){
  if(!Number.isFinite(target)||target<0)return null;
  return frames.filter(f=>Number.isFinite(f.timestamp)).reduce((best,frame)=>!best||Math.abs(frame.timestamp-target)<Math.abs(best.timestamp-target)?frame:best,null);
}

export function mountAclStudy(root,{session,onEvidence=()=>{},focus=null}={}){
  const abort=new AbortController(),sid=encodeURIComponent(session.session_id),base=`/api/sessions/${sid}/experience/acl`;
  let disposed=false,busy=false,data=null,evidence=[],pollTimer=null,selectedFrame=null;
  const stageFrameRefs=new Set(),linkFrameRefs=new Set();
  let timelineView=null;
  root.innerHTML='<div class="exp-status" data-acl-status role="status">正在读取 ACL 独立研究记录…</div><div data-acl-body></div>';
  const $=s=>root.querySelector(s),status=(message,error=false)=>{if(disposed)return;const node=$('[data-acl-status]');node.textContent=message;node.classList.toggle('exp-error',error);};
  function setBusyButtons(disabled){root.querySelectorAll('button').forEach(button=>{if(!button.closest('[data-acl-timeline]'))button.disabled=disabled;});}
  async function request(url,body){
    if(!window.HUBONE_RECORDING?.enabled)throw Error('NOT CONNECTED：ACL真实研究仅使用本地API。');
    const response=await fetch(url,{cache:'no-store',signal:abort.signal,...(body?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
    const result=await response.json();if(!response.ok)throw Error(typeof result.detail==='string'?result.detail:JSON.stringify(result.detail||result));return result;
  }
  async function refresh(){
    [data,evidence]=await Promise.all([request(base),request(`/api/sessions/${sid}/experience/evidence`).then(x=>x.items||[])]);
    if(!disposed)render();
  }
  const evidenceSelect=()=>`<label class="exp-wide">关联原始事件（可多选，不能用模型报告作证据）<select name="evidence_refs" multiple size="3">${evidence.map(e=>`<option value="${esc(e.ref)}">${time(e.timestamp)} · ${esc(e.description||e.ref)}</option>`).join('')}</select></label>`;
  function sourceView(){
    const state=(typeof data.source_status==='string'?data.source_status:data.source_status?.status)||data.live_candidates?.capture_status||'NOT_CONNECTED';
    return `<div class="exp-summary">${badge(state)}${badge(`已保存采样帧：${data.source_sampled_frames??'未知'}`)}</div>${details('实际采集状态',{status:state,source_sampled_frames:data.source_sampled_frames,recent_sampled_frames:data.live_candidates?.sampled_frames||0,window_start:data.live_candidates?.window_start,window_end:data.live_candidates?.window_end})}`;
  }
  function candidateView(){
    const {run,label}=selectAclCandidates(data);
    if(!run)return '<p>NOT CONNECTED · 尚无可读取的行为候选，不补造动作或阶段。</p>';
    const counts=run.candidate_sample_counts||{};
    return `<div class="exp-summary">${badge(run.method||'RULE_BASED')}${badge(label)}${badge('行为准确率 · NOT VERIFIED')}</div><p>${Object.entries(counts).map(([key,value])=>`${esc(key)}：${esc(value)} 个候选样本`).join('；')||'当前没有符合规则的候选样本。'}</p><p>样本计数不是动作发生次数、操作次数或消费者人数。</p>${details('候选区间与原始采样依据',run)}`;
  }
  const feedbackItems=()=>data.feedback_items||[];
  const stageName=id=>data.protocol?.stages?.find(s=>s.id===id)?.name||stageNames[id]||id;
  function feedbackView(){
    return feedbackItems().map(item=>`<article class="exp-template"><h4>${esc(item.label||item.feedback_field)}</h4>${badge(item.verification_status)}<p>${esc(item.original_text??item.value)}</p><p>原话来源：${esc(item.feedback_record_id)} · Event ${esc(item.event_id||'未提供')} · 录入锚点：${time(item.timestamp)}（不代表动作或说话时间；未对齐）</p>${(item.linked_stages||[]).map(link=>`<p>主题关联：${esc(stageName(link.stage_id))}${link.stage_record_id?` · 阶段记录 ${esc(link.stage_record_id)}`:''} ${badge(link.verification_status)} · ${esc(link.link_kind)}<br>关联记录 ${esc(link.link_record_id)} · ${esc(link.notes||'无补充说明')}</p>`).join('')||'<p>尚未关联阶段；原话不等于动作或阶段完成证明。</p>'}</article>`).join('')||'<p>尚无已保存的人工反馈原话；不会由姿态补齐。</p>';
  }
  function recordedStageView(){
    return (data.stage_records||[]).map(record=>`<article class="exp-template"><h4>${esc(stageName(record.stage_id))}</h4>${badge(record.verification_status)}${badge(record.start==null&&record.end==null?'UNKNOWN':record.start==null||record.end==null?'PARTIAL':'RECORDED')}<p>${record.stage_id==='wear'?'穿戴开始':'实际开始'}：${time(record.start)} · ${record.stage_id==='wear'?'用户记录完成':'实际结束'}：${time(record.end)} · 时长：${time(record.duration_seconds)}</p><p>${esc(record.notes||'未补充说明')}</p><p>阶段记录 ${esc(record.record_id)} · 原始证据 ${esc((record.evidence_refs||[]).join(' · ')||'未指定')}</p></article>`).join('')||'<p>尚无人工阶段记录。已有反馈与阶段时间是否已知分别判断。</p>';
  }
  const stageRecordOptions=id=>'<option value="">仅关联阶段主题，不指定某次阶段记录</option>'+(data.stage_records||[]).filter(r=>r.stage_id===id).map(r=>`<option value="${esc(r.record_id)}">${esc(stageName(id))} · ${time(r.start)}–${time(r.end)} · ${esc(r.record_id)}</option>`).join('');
  const frameRefsView=refs=>[...refs].map(ref=>`<input type="hidden" name="evidence_refs" value="${esc(ref)}"><p>已由你选择：${esc(ref)}</p>`).join('');
  function observationView(){
    if(!selectedFrame)return '<p>尚未选择真实采样帧。查找不会自动填写任何阶段时间或证据。</p>';
    const frame=selectedFrame,prefix=`/api/live/sessions/${sid}/frames/`,url=String(frame.frame_url||'');
    const safe=url.startsWith(prefix)&&/^\d{12}\.jpg$/.test(url.slice(prefix.length));
    return `<p>实际 timestamp：${time(frame.timestamp)} · Observation ${esc(frame.observation_id)} · frame_index ${esc(frame.frame_index)}</p><p>采集时间：${esc(frame.captured_at||'未知')} · ${esc(frame.evidence_ref)}</p>${safe?`<img class="exp-evidence-image" alt="当前 Session 原始采样帧，未经模型补帧" src="${esc(url)}"><p><a href="${esc(url)}" target="_blank" rel="noopener">打开原始采样帧</a></p>`:'<p>证据 URL 不属于当前 Session，未显示图片。</p>'}<div class="exp-toolbar"><button type="button" class="button small" data-acl-action="frame-start">用此实际时间填阶段开始</button><button type="button" class="button small" data-acl-action="frame-end">用此实际时间填阶段结束 / 穿戴完成</button><button type="button" class="button small" data-acl-action="frame-link">仅加入反馈关联证据</button></div><p>选择时间不等于确认动作。请先查看原帧，再独立判断是否能记录此阶段。</p>`;
  }
  async function findObservation(){
    const raw=$('[data-acl-frame-time]').value,target=raw.trim()===''?NaN:Number(raw);
    if(!Number.isFinite(target)||target<0)throw Error('请填写希望核对的 Session 秒数。');
    selectedFrame=null;$('[data-acl-frame-result]').innerHTML=observationView();
    let offset=0,total=null,fingerprint=null,frames=[];
    do{
      const page=await request(`/api/sessions/${sid}/experience/observations?kind=live&offset=${offset}&limit=1000`);
      if(page.status!=='STOPPED')throw Error('请先停止采集，再按固定的原始采样记录核验时间。');
      if(total===null){total=page.total;fingerprint=page.fingerprint;}
      if(!Number.isInteger(total)||total<0||total>10000)throw Error('当前快速核验仅支持最多 10,000 帧；请使用原始证据页，不推算缺失时间。');
      if(page.total!==total||page.fingerprint!==fingerprint)throw Error('采样来源已变化，请重新查找。');
      if(!page.frames?.length&&offset<total)throw Error('原始采样分页不完整，未选择近似替代帧。');
      frames.push(...(page.frames||[]));offset=frames.length;
    }while(offset<total);
    selectedFrame=nearestAclObservation(frames,target);
    $('[data-acl-frame-result]').innerHTML=observationView();
    status(selectedFrame?`找到实际采样 ${time(selectedFrame.timestamp)}；目标 ${time(target)} 只是检索条件，尚未填写阶段。`:'此 Session 没有已保存的原始采样帧。');
  }
  function draftStatus(kind){
    const changed=kind==='preliminary'?data.latest_preliminary_source_changed:data.latest_research_source_changed;
    const value=changed===true?'SOURCE_CHANGED':changed===false?'CURRENT':'UNVERIFIED';
    return `${badge(value)}<p>${value==='SOURCE_CHANGED'?'来源已有更新：以下为历史模型草稿，未自动重新调用，不能代表当前补录记录。':value==='CURRENT'?'草案来源快照与当前保存记录一致；仍需人工审核。':value==='NOT_GENERATED'?'尚未生成此类模型草稿。':'草案来源新鲜度尚未核验，不视为最新研究结论。'}</p>`;
  }
  function render(){
    timelineView?.destroy();
    const protocol=data.protocol||{},stages=protocol.stages||[],summary=data.stage_summary||[];
    const stageSummary=Array.isArray(summary)?summary:Object.entries(summary).map(([stage_id,value])=>({stage_id,...value}));
    const feedbackFields=protocol.feedback_fields||[],records=data.stage_records||[],feedback=data.feedback||[];
    const preliminary=data.latest_preliminary,report=data.latest_research;
    $('[data-acl-body]').innerHTML=`<section class="card exp-card"><div class="exp-toolbar"><h3>ACL Knee Brace · 真实可穿戴产品体验</h3><a class="button small" href="#live">实时画面与17点姿态 ↗</a><button class="button small" data-acl-action="evidence">原始证据与姿态回看</button><button class="button small" data-acl-action="refresh">刷新记录</button></div><p>${esc(protocol.research_type||'Wearable Product Experience Test')} · 当前 Session ${esc(session.session_id)}</p><div class="exp-summary">${badge('MODEL_BASED · 人体框 / 17点关键点')}${badge('RULE_BASED · 行为候选')}${badge('HUMAN_VERIFIED · 人工确认')}${badge('CAD · NOT CONNECTED')}</div><p>六组时间轴按独立片段逐一复核；下方折叠的旧八阶段仍是研究计划，不代表已完成。姿态不能证明已穿戴支具、绑带已调整或穿戴正确；没有直接证据和人工确认的阶段保持缺证。人体 Track 不等于消费者身份。</p><div data-acl-source>${sourceView()}</div></section>
      <div data-acl-timeline></div><details class="exp-detail"><summary>旧阶段记录与人工补录（保留原流程，不作为本次六组候选主时间轴）</summary><section class="card exp-card"><h3>旧阶段记录与补录</h3><div class="exp-workflow">${stages.map(stage=>{const id=stage.id||stage.stage_id,item=stageSummary.find(x=>(x.stage_id||x.id)===id)||{};const duration=item.duration_seconds??item.total_duration_seconds;return `<article data-acl-stage="${esc(id)}"><h4>${esc(stage.name||stageNames[id]||id)}</h4><p>阶段核验 ${badge(item.stage_verification_status||'INSUFFICIENT_EVIDENCE')}</p><p>阶段时间 ${badge(item.timing_status||'UNKNOWN')} · ${time(item.start)}–${time(item.end)}</p><p>人工记录区间时长：${time(duration)}</p><p>反馈状态 ${badge(item.feedback_status||'INSUFFICIENT_EVIDENCE')}</p>${(item.linked_feedback||[]).map(f=>`<p>${esc(f.label||f.feedback_field)}：${esc(f.original_text??f.value)} · 原反馈 ${badge(f.verification_status||'NOT_VERIFIED')} · 主题关联 ${badge(f.link_verification_status||'NOT_VERIFIED')}</p>`).join('')}<p>反馈主题关联不证明此阶段发生或完成；未知边界不补齐。</p></article>`;}).join('')}</div>${recordedStageView()}${details('全部人工阶段记录',records)}
      <form data-acl-form="stage" class="exp-form"><h3 class="exp-wide">补录实际体验阶段</h3><p class="exp-wide">时间未知可留空。穿戴的开始与完成分别记录；调整、站立、行走、脱下只填实际观察到的区间。阶段记录不等同支具已正确穿戴。</p><label>阶段<select name="stage_id" required><option value="">请选择已核验阶段</option>${stages.map(s=>`<option value="${esc(s.id||s.stage_id)}">${esc(s.name)}</option>`).join('')}</select></label><label>实际开始 / Session 秒（穿戴开始；未知留空）<input name="start" type="number" min="0" step="any"></label><label>实际结束 / Session 秒（用户记录穿戴完成；未知留空）<input name="end" type="number" min="0" step="any"></label><label>核验依据<textarea name="notes" required maxlength="2000" placeholder="只填写亲自观察或原始证据支持的内容"></textarea></label>${evidenceSelect()}<div class="exp-wide" data-acl-stage-frame-refs>${frameRefsView(stageFrameRefs)}</div><label class="exp-check"><input type="checkbox" name="human_confirmed" required> 我已核验此阶段及已填写内容；未填时间仍未知，不依据姿态猜测成功穿戴</label><button type="submit" class="button">保存人工阶段</button></form><details class="exp-detail"><summary>从原始 Observation 明确选择阶段时间或关联证据</summary><p>只读取本 Session 已保存的真实帧；检索目标不作为事件发生时间，规则候选不会自动填入表单。</p><label>希望核对的 Session 秒数<input data-acl-frame-time type="number" min="0" step="any"></label><button type="button" class="button small" data-acl-action="find-frame">查找最近真实采样帧</button><div data-acl-frame-result>${observationView()}</div></details></section></details>
      <section class="card exp-card" data-acl-section="feedback"><h3>体验者人工反馈原话</h3>${feedbackView()}<p>反馈与视觉观测独立保存。可以只填写实际获得的项目，空白保持未采集；不根据弯腰、驻留或绑带候选推断舒适度。</p><form data-acl-form="feedback" class="exp-form">${feedbackFields.map(f=>`<label>${esc(f.label||f.name)}<textarea name="feedback:${esc(f.id)}" maxlength="2000" placeholder="未采集；请填写体验者实际反馈"></textarea></label>`).join('')}<label>反馈时点 / Session 秒<input name="timestamp" type="number" min="0" step="any" required></label>${evidenceSelect()}<label class="exp-check"><input name="human_confirmed" type="checkbox" required> 我确认以上为实际获得的人工反馈</label><button type="submit" class="button">保存独立人工反馈</button></form>${details('已保存反馈（保留原话与来源）',feedback)}<h3>将已有原话关联到体验阶段</h3><p>追加 TOPIC_ASSOCIATION 主题关系；不会修改反馈原话，不证明动作发生、阶段完成或消费者身份。人工核验默认未选。</p><form data-acl-form="feedback-link" class="exp-form"><label>已存原话<select name="feedback_item" required><option value="">选择一条原话</option>${feedbackItems().map(f=>`<option value="${esc(f.feedback_record_id+'|'+f.feedback_field)}">${esc(f.label||f.feedback_field)} · ${esc(f.original_text??f.value)}</option>`).join('')}</select></label><label>关联阶段<select name="stage_id" data-acl-link-stage required><option value="">请选择阶段主题</option>${stages.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('')}</select></label><label>具体阶段记录（可不选）<select name="stage_record_id" data-acl-link-record>${stageRecordOptions('')}</select></label><label>关联说明<textarea name="notes" maxlength="2000" placeholder="仅说明原话与阶段的主题关系"></textarea></label>${evidenceSelect()}<div class="exp-wide" data-acl-link-frame-refs>${frameRefsView(linkFrameRefs)}</div><label class="exp-check"><input name="human_confirmed" type="checkbox"> 我已人工核验此主题关联（不代表动作或阶段完成）</label><button type="submit" class="button">追加原话关联</button></form>${details('全部追加关联记录',data.feedback_links||[])}</section>
      <section class="card exp-card"><div class="exp-toolbar"><h3>基础行为与支具交互候选</h3><button class="button small" data-acl-action="behaviors">分析已停止采集的行为</button></div><p>复用已保存的 bbox、关键点和 Track。坐姿、站立、弯腰、行走、手膝接近及重复调整均为 RULE_BASED 候选；不重复运行 YOLO，不代表已确认的产品操作。</p><div data-acl-candidates>${candidateView()}</div>${details('全部保存的行为运行',data.behavior_runs||[])}${details('当前证据限制',data.limitations||[])}</section>
      <section class="card exp-card" data-acl-section="research"><div class="exp-toolbar"><h3>DeepSeek 研究分析</h3><button class="button" data-acl-action="preliminary">Flash · 初步整理</button><button class="button" data-acl-action="decision">Pro · Evidence-to-Decision</button></div><h4>当前已保存的体验过程与原话</h4><p>以下读取原始人工记录，独立于模型草稿；时间 UNKNOWN 不代表反馈不存在。</p>${recordedStageView()}${feedbackView()}<p>每次点击只提交一次任务，无自动重试。先由 Flash 整理，再由 Pro 形成待审问题与验证方案；缺少体验行为或反馈时输出 INSUFFICIENT_EVIDENCE。模型分析不是人工审核。</p>${preliminary?`${badge(preliminary.processing_classification||'MODEL_BASED')}<h4>Flash 初步整理</h4><div data-acl-draft-status="preliminary">${draftStatus('preliminary')}</div><p>${esc(preliminary.summary)}</p>${(preliminary.findings||[]).map(f=>`<article class="exp-template"><h4>${esc(f.topic)}</h4>${badge(f.classification)}<p>${esc(f.statement)}</p><p>原始证据：${esc((f.evidence_ids||[]).join(' · ')||'无，保持缺证')}</p></article>`).join('')}${details('整理内容与模型调用记录',preliminary)}`:'<p>Flash：NOT CONNECTED · 当前尚无结果。</p>'}${report?`<div data-acl-section="decision">${badge(report.status||'DRAFT_REQUIRES_HUMAN_REVIEW')}<h4>Pro 研究草稿</h4><div data-acl-draft-status="decision">${draftStatus('decision')}</div><p>${esc(report.decision_analysis?.summary||report.summary)}</p><p>${esc(report.decision_analysis?.decision?.recommendation)}</p>${renderAclTimelineSummary(report.acl_visual_timeline||report.stage_context?.visual_timeline)}${details('研究结果、证据引用与模型来源',report)}</div>`:'<p data-acl-section="decision">Pro：NOT CONNECTED · 当前尚无结果。</p>'}</section>`;
    setBusyButtons(busy);
    timelineView=mountAclTimeline($('[data-acl-timeline]'),{session,onChanged:async()=>{data=await request(base);if(disposed)return;for(const kind of ['preliminary','decision']){const target=$(`[data-acl-draft-status="${kind}"]`);if(target)target.innerHTML=draftStatus(kind);}}});
  }
  async function runJob(value){
    if(!value.job_id)throw Error('后端未返回 Job ID，未追加请求。');
    while(!disposed){const job=await request(`/api/sessions/${sid}/jobs/${encodeURIComponent(value.job_id)}`);status(`${job.status} · ${job.message||job.kind||'处理'} · ${Math.round((job.progress||0)*100)}%`);
      if(job.status==='failed')throw Error(job.error||'任务失败，未自动重试');
      if(job.status==='completed'){await refresh();status('处理完成。候选、人工记录、原始证据与模型草稿分别保留。');return;}
      await new Promise(resolve=>setTimeout(resolve,800));
    }
  }
  async function action(work){if(busy||disposed)return;busy=true;setBusyButtons(true);try{await work();}catch(error){if(error.name!=='AbortError')status(error.message,true);}finally{busy=false;if(!disposed)setBusyButtons(false);}}
  async function pollCandidates(){
    try{if(!busy&&data){const next=await request(base);if(disposed)return;data=next;const target=$('[data-acl-candidates]');if(target)target.innerHTML=candidateView();const source=$('[data-acl-source]');if(source)source.innerHTML=sourceView();}}
    catch(error){if(error.name!=='AbortError')status(`候选更新暂不可用：${error.message}`,true);}
    finally{if(!disposed)pollTimer=setTimeout(pollCandidates,4000);}
  }
  root.addEventListener('submit',event=>{const form=event.target.closest('[data-acl-form]');if(!form)return;event.preventDefault();void action(async()=>{
    const input=new FormData(form),value=name=>String(input.get(name)||''),confirmed=input.get('human_confirmed')==='on';
    if(form.dataset.aclForm!=='feedback-link'&&!confirmed)throw Error('需要由人工明确确认；系统不会代替确认。');
    const refs=[...new Set(input.getAll('evidence_refs'))];
    if(form.dataset.aclForm==='stage'){
      const start=value('start').trim()===''?null:Number(value('start')),end=value('end').trim()===''?null:Number(value('end'));
      if([start,end].some(x=>x!==null&&(!Number.isFinite(x)||x<0))||start!==null&&end!==null&&aclDuration(start,end)===null)throw Error('请填写有效的实际时间；未知边界留空，不填0或推算。');
      await request(base+'/stages',{stage_id:value('stage_id'),start,end,human_confirmed:true,notes:value('notes'),evidence_refs:refs});
      stageFrameRefs.clear();
    }else if(form.dataset.aclForm==='feedback-link'){
      const item=feedbackItems().find(f=>f.feedback_record_id+'|'+f.feedback_field===value('feedback_item'));
      if(!item||!value('stage_id'))throw Error('请选择已保存的原话及对应阶段主题。');
      await request(base+'/feedback-links',{feedback_record_id:item.feedback_record_id,feedback_field:item.feedback_field,stage_id:value('stage_id'),stage_record_id:value('stage_record_id')||null,human_confirmed:confirmed,notes:value('notes'),evidence_refs:refs});
      linkFrameRefs.clear();
    }else{
      const values=Object.fromEntries((data.protocol.feedback_fields||[]).map(f=>[f.id,value('feedback:'+f.id).trim()]).filter(([,v])=>v));
      if(!Object.keys(values).length)throw Error('至少填写一项实际反馈，不能自动补齐。');
      if(Object.values(values).some(value=>value.length>2000))throw Error('每项反馈最多2000字，请保留原意后缩短或分次记录。');
      if(value('timestamp')==='')throw Error('请填写反馈实际时点。');
      await request(base+'/feedback',{timestamp:Number(value('timestamp')),values,human_confirmed:true,evidence_refs:refs});
    }
    await refresh();status('已独立保存人工记录；未改变原始视觉观测。');
  });},{signal:abort.signal});
  root.addEventListener('change',event=>{if(event.target.matches?.('[data-acl-link-stage]'))$('[data-acl-link-record]').innerHTML=stageRecordOptions(event.target.value);},{signal:abort.signal});
  root.addEventListener('click',event=>{const button=event.target.closest('[data-acl-action]');if(!button)return;
    if(button.dataset.aclAction==='evidence'){onEvidence();return;}
    void action(async()=>{const name=button.dataset.aclAction;if(name==='refresh'){await refresh();status('已刷新当前 Session 原始资料。');}
      if(name==='find-frame')await findObservation();
      if(['frame-start','frame-end','frame-link'].includes(name)){
        if(!selectedFrame||!/^observation:\d+$/.test(selectedFrame.evidence_ref||''))throw Error('请先选择当前 Session 的真实 Observation。');
        if(name==='frame-link'){linkFrameRefs.add(selectedFrame.evidence_ref);$('[data-acl-link-frame-refs]').innerHTML=frameRefsView(linkFrameRefs);}
        else{const boundary=name==='frame-start'?'start':'end';$(`[data-acl-form="stage"] [name="${boundary}"]`).value=String(selectedFrame.timestamp);stageFrameRefs.add(selectedFrame.evidence_ref);$('[data-acl-stage-frame-refs]').innerHTML=frameRefsView(stageFrameRefs);}
        status('已按你的选择填写实际采样时间 / Observation；尚未保存或人工确认任何阶段。');
      }
      if(name==='behaviors')await runJob(await request(base+'/behaviors',{source_ref:{kind:'live',asset_id:null}}));
      if(name==='preliminary'||name==='decision')await runJob(await request(base+'/research',{stage:name}));
    });
  },{signal:abort.signal});
  void action(async()=>{await refresh();status('ACL 独立研究 Session 已载入；未知阶段与未采集反馈保持缺证。');if(focus==='timeline')$('[data-acl-timeline]')?.scrollIntoView?.({block:'start'});else if(['research','decision','feedback'].includes(focus))$(`[data-acl-section="${focus}"]`)?.scrollIntoView?.({block:'start'});});
  pollTimer=setTimeout(pollCandidates,4000);
  return {destroy(){disposed=true;timelineView?.destroy();clearTimeout(pollTimer);abort.abort();}};
}
