/* GitHub Pages read-only adapter. Actual CAD files, no remote inference or device I/O. */
(() => {
  window.HUBONE_SPACE_PREVIEW = true;
  if(window.HUBONE_RECORDING?.enabled){
    const base=new URL('.',document.currentScript.src),prefix=new URL('api/v1',base).pathname;
    const upstream=window.fetch.bind(window);
    window.fetch=(input,options={})=>{
      const url=new URL(typeof input==='string'?input:input.url,base);
      if(url.origin===base.origin&&url.pathname.startsWith(prefix+'/')){
        const target='/api/v1'+url.pathname.slice(prefix.length)+url.search;
        return upstream(typeof input==='string'?target:new Request(new URL(target,location.origin),input),options);
      }
      return upstream(input,options);
    };
    return;
  }
  const base = new URL('.', document.currentScript.src);
  const apiRoot = new URL('api/v1', base).pathname;
  const upstream = window.fetch.bind(window);
  const ids = new Set(['floor_1', 'floor_2']);
  const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json'}});
  const native = (path, options={}) => upstream(new URL(path, base).href, options);
  const read = async path => {const response=await native(path);if(!response.ok)throw Error('预览数据读取失败');return response.json();};
  const unavailable = () => json({detail:'这是静态只读预览；上传、设备连接和模型分析请使用完整后端。'},409);

  function asset(path) {
    const floor = path.match(/^\/floors\/(floor_[12])\/(geometry|map\.svg|model)$/);
    if(floor)return floor[2]==='model'?`space-data/${floor[1]}_model.json`:`space-data/${floor[1]}.${floor[2]==='geometry'?'json':'svg'}`;
    if(path==='/spaces/guanqian-1/metadata')return 'space-data/spatial_metadata.json';
    if(path==='/spaces/guanqian-1/report.md')return 'space-data/CAD_PARSING_REPORT_V0.2.md';
    return null;
  }
  async function spatial(url, options) {
    if((options.method||'GET').toUpperCase()!=='GET')return unavailable();
    const p=url.pathname.slice(apiRoot.length),q=url.searchParams;
    if(q.has('building_id')&&q.get('building_id')!=='guanqian-1')return json({detail:'Unknown building_id'},404);
    if(q.has('floor_id')&&!ids.has(q.get('floor_id')))return json({detail:'Unknown floor_id'},404);
    if(q.get('zone_id'))return json({detail:'No confirmed business zones'},404);
    const file=asset(p);
    if(file)return native(file);
    if(p==='/spaces')return native('space-data/api/spaces.json');
    if(p==='/floors')return native('space-data/api/floors.json');
    const floor=p.match(/^\/floors\/(floor_[12])$/);
    if(floor){const data=await read('space-data/api/floors.json');return json(data.items.find(f=>f.floor_id===floor[1]));}
    const obj=p.match(/^\/floors\/(floor_[12])\/objects\/([^/]+)$/);
    if(obj){
      const data=await read(`space-data/${obj[1]}.json`),id=decodeURIComponent(obj[2]);
      const entity=[...data.entities,...data.containers].find(e=>e.entity_id===id);
      return entity?json({...entity,source_entity:data.source_entities[entity.source_handle]}):json({detail:'Object not found in floor'},404);
    }
    if(p==='/zones')return native('space-data/api/zones-not-connected.json');
    if(p==='/events')return json({items:[],total:0,offset:0,limit:100,data_status:'NOT_CONNECTED',invalid_binding_count:0,
      note:'静态 CAD 预览未连接行为事件；C3 回放记录不会被自动映射到建筑。'});
    if(p==='/cameras'){
      const value=q.get('include_simulated')||'false';
      if(!['true','false'].includes(value))return json({detail:'Invalid include_simulated'},422);
      if(value==='false')return native('space-data/api/cameras-not-connected.json');
      const fid=q.get('floor_id');
      return native(`space-data/api/cameras-${fid||'all'}-simulated.json`);
    }
    return json({detail:'Static preview route not found'},404);
  }
  window.fetch=(input,options={})=>{
    const url=new URL(typeof input==='string'?input:input.url,base);
    if(url.origin===base.origin&&url.pathname.startsWith(apiRoot+'/'))return spatial(url,options);
    return upstream(input,options);
  };

  function links() {
    document.querySelectorAll('a[href^="./api/v1/"],a[href^="./docs"]').forEach(a=>{
      const href=a.getAttribute('href');
      if(href.startsWith('./docs')){a.href=new URL('space-data/SPACE_API_V0.2.md',base).href;a.download='HUBONE-Space-API-V0.2.md';a.removeAttribute('target');a.textContent='空间 API 说明 ↓';return;}
      const path=new URL(href,base).pathname.slice(apiRoot.length),file=asset(path);
      if(file){a.href=new URL(file,base).href;if(file.endsWith('.md'))a.download='HUBONE-CAD-V0.2.md';return;}
      if(path.includes('/objects/')){a.dataset.spaceObjectApi=href;a.href='#space';a.removeAttribute('target');a.textContent='下载原始实体 JSON ↓';}
    });
  }
  new MutationObserver(links).observe(document.body,{childList:true,subtree:true});links();
  document.addEventListener('click',async e=>{
    const a=e.target.closest('a[data-space-object-api]');if(!a)return;e.preventDefault();
    try {
      const response=await fetch(a.dataset.spaceObjectApi);if(!response.ok)throw Error('实体数据加载失败');
      const data=await response.json(),url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download=data.entity_id.replaceAll(':','-')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(error){const toast=document.querySelector('#toast');toast.textContent=error.message;toast.hidden=false;}
  });
  if(!location.hash)history.replaceState(null,'',location.pathname+location.search+'#report');
})();
