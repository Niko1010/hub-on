// Read-only Evidence-to-Decision 1.1 replay. Never forwards virtual API requests.
(() => {
 if(window.HUBONE_RECORDING?.enabled)return;
 const d=window.HUBONE_REPLAY, original=window.fetch.bind(window);
 const base=new URL('.',document.currentScript.src), apiRoot=new URL('api',base).pathname;
 const readonlyMessage='只读 REPLAY：本页不上传、不采集、不运行识别、LLM 或 MOCK 比较；请使用完整本地后端。';
 localStorage.setItem('hubone-etd-1-1-20261104-session',d.session.session_id);
 const json=(data,status=200)=>Promise.resolve(new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}}));
 window.fetch=(input,options={})=>{
  const url=new URL(typeof input==='string'?input:input.url,base);
  if(url.origin!==base.origin||!url.pathname.startsWith(apiRoot+'/'))return original(input,options);
  const p=url.pathname.slice(apiRoot.length), prefix='/sessions/'+d.session.session_id;
  if(!['GET','HEAD'].includes((options.method||'GET').toUpperCase())){
   if(p==='/demo')return json({session_id:d.session.session_id,job:{job_id:'replay'}});
   return json({detail:readonlyMessage},409);
  }
  if(p==='/health')return json({status:'ok',mode:'REPLAY'});
  if(p==='/capabilities')return json({asr_provider:'replay',analysis_provider:'mock',llm_provider:'OFFLINE',sample_ready:true});
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
   if(!e.disabled)e.disabled=true;e.title=readonlyMessage;
  });
  document.querySelectorAll('textarea,input[type=number],#research-audience,#research-owner').forEach(e=>e.readOnly=true);
  const analysis=document.querySelector('#analysis-provider');
  if(analysis&&d.report.processing_method==='MOCK')analysis.value='mock';
 };
 // Also block synthetic clicks on model/capture actions before the app event handlers run.
 document.addEventListener('click',e=>{if(e.target.closest('[data-action],[data-reprocess],#new-session')){e.preventDefault();e.stopImmediatePropagation();}},true);
 new MutationObserver(readonly).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});readonly();
})();
