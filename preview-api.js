// STATIC REPLAY ONLY. No online inference or pretend upload endpoints.
(() => {
 const d=window.HUBONE_REPLAY, original=window.fetch.bind(window);
 localStorage.setItem('hubone-preview-session',d.session.session_id);
 const json=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));
 window.fetch=(input,options={})=>{
  const path=String(input);
  if(!path.startsWith('/api/'))return original(input,options);
  const p=path.slice(4), prefix='/sessions/'+d.session.session_id;
  if((options.method||'GET')==='POST'){
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
  document.querySelectorAll('[data-action],[data-reprocess],#new-session,#session-sim,#analysis-provider,input[type=file]').forEach(e=>{
   if(!e.disabled)e.disabled=true;e.title='只读演示记录；在线预览不接收上传、不运行模型';
  });
  document.querySelectorAll('textarea,input[type=number]').forEach(e=>e.readOnly=true);
 };
 new MutationObserver(readonly).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});readonly();
})();
