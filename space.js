/* CAD viewer only. Device I/O and CAD extraction live in separate Python modules. */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = value => Number(value).toLocaleString('en-US', {maximumFractionDigits:2});
const svgNS = 'http://www.w3.org/2000/svg';
const categories = {wall_column:'墙柱',door_window:'门窗 / 幕墙',stair_railing:'楼梯 / 栏杆',annotation:'尺寸 / 标注',other:'其他原始实体'};

async function get(path, signal, text=false) {
  const response = await fetch('/api/v1'+path, {signal});
  if (!response.ok) throw Error(`空间数据加载失败：HTTP ${response.status}`);
  return text ? response.text() : response.json();
}

class SpaceView {
  constructor(root) {
    this.root=root;this.abort=new AbortController();this.cache=new Map();this.generation=0;
    this.layers={structure:true,cameras:false,coverage:false};this.simulated=false;this.areaMode=false;
    this.selected=[];this.cameraRecords=[];
    this.layers={...this.layers,zones:true,activity:false,heatmap:false,trajectories:false,experience:false,events:false};
    this.viewMode=localStorage.getItem('hubone-space-view')==='2d'?'2d':'3d';this.floorDisplay='both';this.explode=0;
    this.modelCache=new Map();this.mapGeneration=0;this.assets={walls:true,columns:true,glazing:true,stairs:true,slabs:true};
  }
  async init() {
    try {
      const [spaces,floors] = await Promise.all([get('/spaces',this.abort.signal),get('/floors',this.abort.signal)]);
      if(this.abort.signal.aborted)return;
      this.building=spaces.items[0];this.floors=floors.items;
      this.root.innerHTML=this.frame();this.bind();this.updateModeControls();
      const saved=localStorage.getItem('hubone-space-floor');
      await this.floor(this.floors.some(f=>f.floor_id===saved)?saved:this.floors[0].floor_id);
    } catch(error) {this.fail(error);}
  }
  frame() {
    return `<div class="space-location"><div><span class="space-site-code">GQ / 001</span><strong>苏州 · 观前街1号</strong><span>空间数字孪生</span></div><div class="space-mode-switch" aria-label="地图模式"><button data-space-mode="2d" aria-pressed="false">2D 平面</button><button data-space-mode="3d" aria-pressed="false">3D 数字孪生</button></div><div><span class="space-badge cad">CAD SOURCE</span><a href="/api/v1/spaces/guanqian-1/report.md" class="space-report-link">CAD 解析报告 ↗</a></div></div>
      <div class="space-workspace">
        <aside class="space-controls space-panel" aria-label="空间地图控制">
          <div class="space-panel-title"><span>楼层导航</span><small>FLOORS</small></div>
          <div class="space-floor-list">${this.floors.map(f=>`<button data-space-floor="${f.floor_id}" aria-pressed="false"><strong>0${f.level}<span>F</span></strong><span>${esc(f.name)}<small>原始 CAD 平面</small></span><b>↗</b></button>`).join('')}</div>
          <button class="space-building-view space-3d-only" data-space-building>▱　两层建筑总览</button>
          <div class="space-panel-title space-divider"><span>空间图层</span><small>LAYERS</small></div>
          <div class="space-layer-list">
            <label><input type="checkbox" data-space-layer="structure" checked><span>建筑空间结构<small>原始图层独立保留</small></span><i class="space-layer-dot"></i></label>
            <label><input type="checkbox" data-space-layer="zones" checked><span>CAD 空间区域<small>闭合区域候选 · 待业务确认</small></span></label>
            <label><input type="checkbox" data-space-layer="cameras"><span>摄像头位置<small class="space-camera-state">NOT CONNECTED</small></span></label>
            <label><input type="checkbox" data-space-layer="coverage"><span>摄像头覆盖范围<small class="space-camera-state">NOT CONNECTED</small></span></label>
            ${[['activity','消费者活动'],['heatmap','人流密度热力'],['trajectories','消费者动线'],['experience','产品体验区域'],['events','重点互动事件']].map(([key,t])=>`<label><input type="checkbox" data-space-layer="${key}" data-demo-layer disabled><span>${t}<small class="space-demo-state">NOT CONNECTED</small></span></label>`).join('')}
          </div>
          <div class="space-simulation"><label><input type="checkbox" id="space-simulated"> 演示运营数据</label><span class="space-badge simulated">SIMULATED</span><p>设备、客流、轨迹、展台和反馈均为模拟，无真实接入。</p><button data-space-scenario>加载体验演示 ↗</button></div>
          <details class="space-assets space-3d-only"><summary>空间资产</summary>${[['walls','墙体平面'],['columns','柱体轮廓'],['glazing','门窗 / 幕墙'],['stairs','楼梯平面'],['slabs','示意楼板']].map(([key,name])=>`<label><input type="checkbox" data-space-asset="${key}" checked><span>${name}</span></label>`).join('')}</details>
          <details class="space-cad-layers space-2d-only"><summary>CAD 原始图层 <span id="space-layer-count"></span></summary><div id="space-raw-layers"></div></details>
          <div class="space-controls-note">原始坐标完整保留<br>楼层尚未进行实测配准</div>
        </aside>
        <section class="space-map-panel space-panel" aria-label="建筑空间地图">
          <div class="space-map-heading"><div><span class="space-kicker">SPATIAL DIGITAL TWIN</span><h2 id="space-map-title">正在读取空间数据</h2></div><span class="space-live-label"><i></i> GUANQIAN / 01</span></div>
          <div class="space-map-tools"><div class="space-2d-only"><button data-space-tool="pan" class="active" aria-pressed="true" title="拖动平移">✥ <span>平移</span></button><button data-space-tool="area" aria-pressed="false" title="框选图纸对象；不会建立业务区域">▧ <span>区域框选</span></button></div><div class="space-3d-tools space-3d-only"><button data-space-isometric title="恢复正交等轴测视角">◇ <span>等轴测</span></button><button data-space-orbit title="旋转90度">↻</button><label><input type="checkbox" id="space-exploded"> 楼层分离</label><input type="range" id="space-explode-range" min="0" max="1" value="0" step="0.05" aria-label="楼层展示分离距离"></div><div><button data-space-zoom="out" aria-label="缩小">−</button><button data-space-zoom="in" aria-label="放大">＋</button><button data-space-zoom="fit" aria-label="适配地图">⊡</button></div></div>
          <div class="space-model-provenance space-3d-only"><span>平面位置 <b>CAD</b></span><span>高度 / 支撑楼板 <b>SIMULATED</b></span><span>轴网对齐 · 未实测</span></div>
          <div class="space-map-viewport" id="space-map" tabindex="0" aria-label="CAD 地图，滚轮缩放、拖动平移；方向键平移，加减键缩放，0 键复位"><div class="space-loading">正在载入真实 CAD 几何…</div></div>
          <div class="space-map-status" role="status"><span id="space-coordinate">X — / Y — mm</span><span id="space-zoom">100%</span><span>CAD Y ↑</span></div>
          <div class="space-map-legend"><span><i class="wall"></i> 墙柱</span><span><i class="window"></i> 半透明幕墙</span><span><i class="stair"></i> CAD 空间候选</span><span id="space-sim-legend" hidden><i class="sim"></i> SIMULATED</span><span class="space-legend-help" id="space-gesture-note">拖动旋转 · 右键平移 · 滚轮缩放</span></div>
          <div class="space-map-notice" id="space-map-notice"></div>
        </section>
        <aside class="space-inspector" aria-label="空间数据与对象信息">
          <section class="space-panel"><div class="space-panel-title"><span>空间数据概览</span><small>OVERVIEW</small></div><div class="space-overview-title"><strong id="space-floor-label">—</strong><span>GUANQIAN STREET</span></div>
            <div class="space-metrics"><div><small>CAD 图元</small><strong id="space-entity-count">—</strong><span>原始来源可追溯</span></div><div><small>已确认业务区域</small><strong>—</strong><span>NOT CONNECTED</span></div><div><small>登记真实摄像头</small><strong>0</strong><span>NOT CONNECTED</span></div><div><small>在线真实设备</small><strong>—</strong><span>NOT CONNECTED</span></div></div>
            <p class="space-inventory-note">设备清单尚未提供；0 表示已登记记录数，实际设备数量未知。</p>
            <div class="space-no-metrics">${['区域客流','平均停留时间','消费者互动事件'].map(t=>`<div><span>${t}</span><b>— <small>NOT CONNECTED</small></b></div>`).join('')}</div>
          </section>
          <section class="space-panel space-selection-panel"><div class="space-panel-title"><span>空间对象</span><small>INSPECTOR</small></div><div id="space-selection"><div class="space-selection-empty"><span>⌖</span><strong>从地图开始探索</strong><p>点击墙柱、门窗或文字，查看 CAD 句柄、原始图层与坐标。框选用于临时查看对象集合。</p></div></div></section>
          <section class="space-panel space-bridge"><span class="space-kicker">EXPERIENCE CONNECTION</span><h3>空间 → 行为 → 产品洞察</h3><p>building / floor / zone / camera<br>session / event / timestamp</p><span class="space-badge">NOT CONNECTED</span><a href="/docs#/Space%20Intelligence" target="_blank" rel="noreferrer">查看独立 API ↗</a></section>
        </aside>
      </div><div class="space-source-footer"><span id="space-source-summary">SOURCE · ORIGINAL DXF</span><div><a id="space-download-svg">SVG ↓</a><a id="space-download-json">JSON ↓</a></div></div>`;
  }
  bind() {
    this.root.addEventListener('click',e=>{
      const floor=e.target.closest('[data-space-floor]'),zoom=e.target.closest('[data-space-zoom]'),tool=e.target.closest('[data-space-tool]'),object=e.target.closest('[data-space-object]');
      if(floor){this.floorDisplay='single';this.floor(floor.dataset.spaceFloor).catch(error=>this.fail(error));}
      const mode=e.target.closest('[data-space-mode]');if(mode)this.setMode(mode.dataset.spaceMode);
      if(e.target.closest('[data-space-building]')){this.floorDisplay='both';this.refreshScene();this.threeView?.fit(true);}
      if(e.target.closest('[data-space-isometric]'))this.threeView?.fit(true);
      if(e.target.closest('[data-space-orbit]'))this.threeView?.orbit(Math.PI/2);
      if(e.target.closest('[data-space-scenario]')){this.simulated=true;this.root.querySelector('#space-simulated').checked=true;for(const k of ['activity','heatmap','trajectories','experience','events','cameras','coverage'])this.layers[k]=true;this.root.querySelectorAll('[data-space-layer]').forEach(c=>c.checked=Boolean(this.layers[c.dataset.spaceLayer]));this.updateSimulationLabel();this.applyLayers();this.loadCameras().catch(error=>this.fail(error));if(this.selectedRegion)this.inspectRegion(...this.selectedRegion);}
      if(e.target.closest('[data-space-region-2d]')){const pair=this.selectedRegion;if(pair)this.jumpToRegion2D(...pair).catch(error=>this.fail(error));}
      if(zoom){if(zoom.dataset.spaceZoom==='fit')this.fit();else this.zoom(zoom.dataset.spaceZoom==='in'?1/1.3:1.3);}
      if(tool){this.areaMode=tool.dataset.spaceTool==='area';this.root.querySelectorAll('[data-space-tool]').forEach(b=>{const active=(b.dataset.spaceTool==='area')===this.areaMode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});this.map.classList.toggle('area-mode',this.areaMode);}
      if(object)this.inspect(this.objects.get(object.dataset.spaceObject));
    },{signal:this.abort.signal});
    this.root.addEventListener('change',async e=>{
      try {
        if(e.target.matches('[data-space-layer]')){this.layers[e.target.dataset.spaceLayer]=e.target.checked;this.applyLayers();}
        if(e.target.matches('[data-space-asset]')){this.assets[e.target.dataset.spaceAsset]=e.target.checked;this.refreshScene();}
        if(e.target.matches('[data-cad-layer-control]')){const name=e.target.dataset.cadLayerControl;e.target.checked?this.hiddenCadLayers.delete(name):this.hiddenCadLayers.add(name);this.applyCadVisibility();}
        if(e.target.id==='space-simulated'){
          this.simulated=e.target.checked;this.updateSimulationLabel();this.applyLayers();await this.loadCameras();if(this.selectedRegion)this.inspectRegion(...this.selectedRegion);
        }
        if(e.target.id==='space-exploded'){this.explode=e.target.checked?.7:0;this.root.querySelector('#space-explode-range').value=this.explode;this.threeView?.setExplode(this.explode);}
      }catch(error){this.fail(error);}
    },{signal:this.abort.signal});
    this.root.querySelector('#space-explode-range').addEventListener('input',e=>{this.explode=Number(e.target.value);this.root.querySelector('#space-exploded').checked=this.explode>0;this.threeView?.setExplode(this.explode);},{signal:this.abort.signal});
    this.map=this.root.querySelector('#space-map');
    this.map.addEventListener('wheel',e=>{if(this.viewMode==='3d'||!this.svg)return;e.preventDefault();this.zoom(e.deltaY>0?1.16:1/1.16,this.toSVG(e.clientX,e.clientY));},{passive:false,signal:this.abort.signal});
    this.map.addEventListener('pointerdown',e=>this.pointerDown(e),{signal:this.abort.signal});
    this.map.addEventListener('pointermove',e=>this.pointerMove(e),{signal:this.abort.signal});
    this.map.addEventListener('pointerup',e=>this.pointerUp(e),{signal:this.abort.signal});
    this.map.addEventListener('pointercancel',()=>this.cancelPointer(),{signal:this.abort.signal});
    this.map.addEventListener('keydown',e=>{
      if(!this.svg)return;
      if(this.viewMode==='3d'){if(['+','=','-','0'].includes(e.key))e.preventDefault();if(e.key==='+'||e.key==='=')this.zoom(1/1.3);if(e.key==='-')this.zoom(1.3);if(e.key==='0')this.fit();return;}
      if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();
      if(e.key==='+'||e.key==='=')this.zoom(1/1.3);if(e.key==='-')this.zoom(1.3);if(e.key==='0')this.fit();
      const moves={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};
      if(moves[e.key]){this.view[0]+=moves[e.key][0]*this.view[2];this.view[1]+=moves[e.key][1]*this.view[3];this.setView();}
    },{signal:this.abort.signal});
  }
  async floor(fid) {
    const generation=++this.generation;
    this.floorId=fid;this.svg=null;this.cancelPointer();this.threeView?.destroy();this.threeView=null;this.mapGeneration++;this.map.innerHTML='<div class="space-loading">正在载入真实 CAD 几何…</div>';
    this.root.querySelectorAll('[data-space-floor]').forEach(b=>{b.classList.toggle('active',b.dataset.spaceFloor===fid);b.setAttribute('aria-pressed',String(b.dataset.spaceFloor===fid));});
    let cached=this.cache.get(fid);
    if(!cached){const [data,svg]=await Promise.all([get(`/floors/${fid}/geometry`,this.abort.signal),get(`/floors/${fid}/map.svg`,this.abort.signal,true)]);cached={data,svg};this.cache.set(fid,cached);}
    if(this.abort.signal.aborted||generation!==this.generation)return;
    this.data=cached.data;this.objects=new Map(this.data.entities.map(e=>[e.entity_id,e]));
    this.containers=new Map(this.data.containers.map(e=>[e.entity_id,e]));
    this.hiddenCadLayers=new Set(this.data.layers.filter(l=>l.off||l.frozen).map(l=>l.name));
    const parsed=new DOMParser().parseFromString(cached.svg,'image/svg+xml');
    if(parsed.querySelector('parsererror')||parsed.documentElement.localName!=='svg')throw Error('CAD SVG 格式错误');
    this.svg=document.importNode(parsed.documentElement,true);this.svg.classList.add('space-cad-svg');
    this.root.querySelector('#space-map-title').textContent=`${this.data.level}F · ${this.data.name}建筑平面`;
    this.root.querySelector('#space-floor-label').textContent=`${this.data.level}F`;
    this.root.querySelector('#space-entity-count').textContent=num(this.data.entity_count);
    this.root.querySelector('#space-layer-count').textContent=`${this.data.layers.length}`;
    this.root.querySelector('#space-raw-layers').innerHTML=this.data.layers.map(l=>`<label><input type="checkbox" data-cad-layer-control="${esc(l.name)}" ${l.off||l.frozen?'':'checked'}><span title="${esc(l.name)}">${esc(l.name)}</span><small>${l.count}</small></label>`).join('');
    this.applyCadVisibility();
    this.root.querySelector('#space-map-notice').textContent=this.data.level===2?'二层由 CAD 图块与标题确认。上传的两份 PDF 均为一层，二层 PDF 核对待补充。':'一层已与 PDF 建筑轮廓核对；PDF 的阴影范围等标注与 CAD 主平面存在差异，未据 PDF 重绘。';
    this.root.querySelector('#space-source-summary').textContent=`DXF AC1027 · ${this.data.layers.length} 原始图层 · 单位 mm · ${this.data.source.sha256.slice(0,12)}`;
    for(const [kind,suffix] of [['svg','map.svg'],['json','geometry']]){const a=this.root.querySelector(`#space-download-${kind}`);a.href=`/api/v1/floors/${fid}/${suffix}`;a.setAttribute('download',`${fid}.${kind}`);}
    localStorage.setItem('hubone-space-floor',fid);this.clearSelection();this.applyLayers();await this.showMap();await this.loadCameras();
  }
  updateModeControls(){
    document.body.classList.toggle('space-is-3d',this.viewMode==='3d');this.root.classList.toggle('space-mode-3d',this.viewMode==='3d');this.root.classList.toggle('space-mode-2d',this.viewMode==='2d');
    this.root.querySelectorAll('[data-space-mode]').forEach(b=>{const active=b.dataset.spaceMode===this.viewMode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    this.root.querySelectorAll('[data-space-floor] small').forEach(e=>e.textContent=this.viewMode==='3d'?'CAD 衍生模型':'原始 CAD 平面');const note=this.root.querySelector('#space-gesture-note');if(note)note.textContent=this.viewMode==='3d'?'拖动旋转 · 右键平移 · 滚轮缩放':'滚轮缩放 · 拖动平移 · 点击查看';
  }
  setMode(mode){if(!['2d','3d'].includes(mode))return;this.viewMode=mode;localStorage.setItem('hubone-space-view',mode);this.updateModeControls();if(this.svg)this.showMap().catch(e=>this.fail(e));}
  async model(fid){if(!this.modelCache.has(fid))this.modelCache.set(fid,await get(`/floors/${fid}/model`,this.abort.signal));return this.modelCache.get(fid);}
  sceneOptions(){return {floorId:this.floorId,floorDisplay:this.floorDisplay,explode:this.explode,simulated:this.simulated,layers:this.layers,assets:this.assets};}
  refreshScene(){
    this.threeView?.setOptions(this.sceneOptions());
    this.root.querySelector('[data-space-building]')?.classList.toggle('active',this.floorDisplay==='both');if(this.data){const both=this.viewMode==='3d'&&this.floorDisplay==='both';this.root.querySelector('#space-entity-count').textContent=num(both?this.floors.reduce((a,f)=>a+f.entity_count,0):this.data.entity_count);this.root.querySelector('#space-floor-label').textContent=both?'1F + 2F':this.data.level+'F';}
    if(this.viewMode==='3d'&&this.data){this.root.querySelector('#space-map-title').textContent=this.floorDisplay==='both'?'观前街1号 · 1F + 2F':`${this.data.level}F · ${this.data.name}空间模型`;this.root.querySelector('#space-coordinate').textContent='ORTHOGRAPHIC · 等轴测 / CAD XY';}
  }
  async showMap(){
    const token=++this.mapGeneration;this.threeView?.destroy();this.threeView=null;this.updateModeControls();
    if(this.viewMode==='2d'){
      this.map.replaceChildren(this.svg);this.refreshScene();this.map.classList.remove('is-webgl');this.root.querySelector('#space-map-title').textContent=`${this.data.level}F · ${this.data.name}建筑平面`;this.fit();
      const model=await this.model(this.floorId);if(token!==this.mapGeneration||this.abort.signal.aborted)return;this.render2DRegions(model);if(this.selectedRegion&&this.selectedRegion[0].floor_id===this.floorId)this.mark2DRegion(this.selectedRegion[0].spatial_id);
      return;
    }
    this.map.classList.add('is-webgl');this.map.replaceChildren(Object.assign(document.createElement('div'),{className:'space-loading',textContent:'正在构建三维建筑场景…'}));
    try{
      const [engine,...models]=await Promise.all([import('./space-3d.bundle.js?v=0.3.0'),...this.floors.map(f=>this.model(f.floor_id))]);
      if(token!==this.mapGeneration||this.abort.signal.aborted)return;
      this.engine=engine;this.threeView=engine.createSpatialScene(this.map,{models,onSelect:(r,m)=>this.inspectRegion(r,m),onCamera:c=>this.inspectCameraRecord(c),onEvent:(r,m)=>this.inspectRegion(r,m),onChange:z=>{const el=this.root.querySelector('#space-zoom');if(el)el.textContent=z+'%';}});
      this.refreshScene();this.threeView.fit(true);if(this.selectedRegion)this.threeView.selectRegion(this.selectedRegion[0].spatial_id);
    }catch(e){if(this.abort.signal.aborted)return;this.map.innerHTML='<div class="space-webgl-fallback"><strong>三维视图未能启动</strong><p>需要支持 WebGL 2 的浏览器。二维地图仍可使用。</p><button data-space-mode="2d">切换到 2D 平面</button></div>';throw e;}
  }
  render2DRegions(model){
    this.svg.querySelector('[data-cad-regions]')?.remove();const group=document.createElementNS(svgNS,'g');group.dataset.cadRegions='true';
    for(const region of [...model.regions].sort((a,b)=>b.area_m2-a.area_m2)){
      const p=document.createElementNS(svgNS,'path');p.dataset.spaceRegion=region.spatial_id;p.setAttribute('d',[region.footprint.outer,...region.footprint.holes].map(r=>'M'+r.map(v=>`${v[0]},${-v[1]}`).join(' L')+' Z').join(' '));p.setAttribute('fill-rule','evenodd');p.classList.add('space-cad-region');group.append(p);
    }this.svg.insertBefore(group,this.svg.firstChild);this.applyLayers();
  }
  mark2DRegion(id){this.svg?.querySelectorAll('[data-space-region]').forEach(p=>p.classList.toggle('space-region-selected',p.dataset.spaceRegion===id));}
  async jumpToRegion2D(region,model){if(this.floorId!==region.floor_id)await this.floor(region.floor_id);this.selectedRegion=[region,model];this.setMode('2d');this.inspectRegion(region,model);}
  inspectRegion(region,model){
    this.root.querySelector('.space-inspector').scrollTop=0;this.selectedRegion=[region,model];this.threeView?.selectRegion(region.spatial_id);this.mark2DRegion(region.spatial_id);
    const demo=this.simulated&&this.engine?this.engine.demoForRegion(region,model):null;
    const metric=(name,value,unit='')=>`<div><small>${name}</small><strong>${value}${unit?`<span>${unit}</span>`:''}</strong><em>${demo?'SIMULATED':'NOT CONNECTED'}</em></div>`;
    this.root.querySelector('#space-selection').innerHTML=`<div class="space-object-card space-region-card"><span class="space-badge cad">CAD 区域候选 · 待确认</span>${demo?' <span class="space-badge simulated">SIMULATED 数据</span>':''}<h3>${esc(region.name)} <small>${model.level}F</small></h3><p class="space-detail-note">${esc(region.method==='CAD_HATCH_BOUNDARY'?'原始 CAD 填充边界，不代表业务用途或可使用范围。':'依据 CAD 封闭线网提取；未确认为业务区域。')}</p><div class="space-region-metrics">${metric('摄像头',demo?demo.camera_count:'—')}${metric('消费者数量',demo?demo.visitors:'—')}${metric('平均停留',demo?`${Math.floor(demo.dwell_seconds/60)}:${String(demo.dwell_seconds%60).padStart(2,'0')}`:'—')}${metric('体验事件',demo?demo.experience_events:'—')}</div><div class="space-region-feedback"><small>产品反馈 ${demo?'· SIMULATED':'· NOT CONNECTED'}</small><p>${demo?'“'+esc(demo.feedback)+'”':'尚未关联现场反馈。'}</p></div><dl><dt>空间 ID</dt><dd>${esc(region.spatial_id)}</dd><dt>楼层</dt><dd>${model.level}F / ${esc(region.floor_id)}</dd><dt>图形面积</dt><dd>约 ${num(region.area_m2)} m² <small>推导，非建筑测量</small></dd><dt>业务 Zone</dt><dd>NOT CONNECTED</dd><dt>原始实体</dt><dd>${region.source_entity_ids.length} 个来源 ID</dd><dt>高度 / 标高</dt><dd>未测量 · 展示使用 SIMULATED 参数</dd></dl>${demo?`<p class="space-detail-note">Session ${esc(demo.session_id)}<br>Event ${esc(demo.event_id)}<br>示例原话，不是本建筑的现场研究证据。</p>`:''}<button class="space-region-locate" data-space-region-2d>在 2D 中定位此区域 ↗</button></div>`;
  }
  inspectCameraRecord(c){this.cameraRecords=[...this.cameraRecords.filter(v=>v.camera_id!==c.camera_id),c];this.inspectCamera(c.camera_id);}
  fit(){if(this.viewMode==='3d'){this.threeView?.fit(true);return;}if(!this.svg)return;this.view=[...this.data.svg_view_box];this.setView();}
  setView(){this.svg.setAttribute('viewBox',this.view.join(' '));this.root.querySelector('#space-zoom').textContent=`${Math.round(this.data.svg_view_box[2]/this.view[2]*100)}%`;}
  toSVG(x,y){const p=new DOMPoint(x,y);return p.matrixTransform(this.svg.getScreenCTM().inverse());}
  zoom(factor,point){if(this.viewMode==='3d'){this.threeView?.zoom(factor);return;}if(!this.svg)return;const old=this.view;const width=Math.min(this.data.svg_view_box[2]*3,Math.max(this.data.svg_view_box[2]/50,old[2]*factor));factor=width/old[2];point=point||{x:old[0]+old[2]/2,y:old[1]+old[3]/2};this.view=[point.x-(point.x-old[0])*factor,point.y-(point.y-old[1])*factor,width,old[3]*factor];this.setView();}
  pointerDown(e){
    if(this.viewMode==='3d'||!this.svg||e.button!==0)return;e.preventDefault();this.map.focus();this.map.setPointerCapture(e.pointerId);
    this.drag={x:e.clientX,y:e.clientY,point:this.toSVG(e.clientX,e.clientY),view:[...this.view],target:e.target,scale:this.svg.getScreenCTM().a};
    if(this.areaMode){this.selectionRect=document.createElementNS(svgNS,'rect');this.selectionRect.classList.add('space-selection-rect');this.svg.append(this.selectionRect);}
    this.map.classList.add('dragging');
  }
  pointerMove(e){
    if(this.viewMode==='3d'||!this.svg)return;const p=this.toSVG(e.clientX,e.clientY);this.root.querySelector('#space-coordinate').textContent=`X ${num(p.x)} / Y ${num(-p.y)} mm`;
    if(!this.drag)return;
    if(this.areaMode){const x=Math.min(p.x,this.drag.point.x),y=Math.min(p.y,this.drag.point.y);for(const[k,v]of Object.entries({x,y,width:Math.abs(p.x-this.drag.point.x),height:Math.abs(p.y-this.drag.point.y)}))this.selectionRect.setAttribute(k,v);}
    else{this.view=[this.drag.view[0]-(e.clientX-this.drag.x)/this.drag.scale,this.drag.view[1]-(e.clientY-this.drag.y)/this.drag.scale,...this.drag.view.slice(2)];this.setView();}
  }
  pointerUp(e){
    if(this.viewMode==='3d'||!this.drag||!this.svg)return;const d=this.drag,moved=Math.hypot(e.clientX-d.x,e.clientY-d.y)>4;
    if(this.areaMode&&moved&&this.layers.structure){
      const p=this.toSVG(e.clientX,e.clientY),box=[Math.min(p.x,d.point.x),Math.min(-p.y,-d.point.y),Math.max(p.x,d.point.x),Math.max(-p.y,-d.point.y)];
      const ids=this.data.entities.filter(o=>{const b=o.bounds;return this.visible(o)&&b[0]>=box[0]&&b[1]>=box[1]&&b[2]<=box[2]&&b[3]<=box[3];}).map(o=>o.entity_id);
      this.inspectArea(ids,box);
    }else if(!moved){const selectedRegion=d.target.closest?.('[data-space-region]');if(selectedRegion){const m=this.modelCache.get(this.floorId),r=m?.regions.find(r=>r.spatial_id===selectedRegion.dataset.spaceRegion);if(r)this.inspectRegion(r,m);this.cancelPointer();return;}const camera=d.target.closest?.('[data-space-camera]');if(camera)this.inspectCamera(camera.dataset.spaceCamera);else{const hit=d.target.closest?.('[data-entity-id]');if(hit&&this.layers.structure)this.inspect(this.objects.get(hit.dataset.entityId));else{const obj=this.nearest(this.toSVG(e.clientX,e.clientY));if(obj)this.inspect(obj);}}}
    this.cancelPointer();
  }
  cancelPointer(){this.drag=null;this.selectionRect?.remove();this.selectionRect=null;this.map?.classList.remove('dragging');}
  cadVisible(obj){return !this.hiddenCadLayers.has(obj.effective_layer)&&obj.insert_chain.every(id=>!this.hiddenCadLayers.has(this.containers.get(id)?.effective_layer));}
  applyCadVisibility(){
    // Layer-0 block geometry inherits its INSERT layer; parent layers also gate visibility.
    this.svg.querySelectorAll('[data-cad-layer]').forEach(g=>{g.style.display=g.dataset.cadLayer!=='0'&&this.hiddenCadLayers.has(g.dataset.cadLayer)?'none':'';});
    this.svg.querySelectorAll('[data-entity-id]').forEach(node=>{node.style.display=this.cadVisible(this.objects.get(node.dataset.entityId))?'':'none';});
  }
  visible(obj){return this.layers.structure&&this.cadVisible(obj);}
  nearest(p){
    if(!this.layers.structure)return null;let winner=null,best=8/this.svg.getScreenCTM().a;
    for(const obj of this.data.entities){const b=obj.bounds;if(p.x<b[0]-best||p.x>b[2]+best||-p.y<b[1]-best||-p.y>b[3]+best||!this.visible(obj))continue;
      if(obj.geometry.kind==='text'){const distance=Math.hypot(p.x-obj.geometry.position[0],-p.y-obj.geometry.position[1]);if(distance<best){best=distance;winner=obj;}continue;}
      for(const line of obj.geometry.paths||[]){for(let i=1;i<line.length;i++){const a=line[i-1],b=line[i],dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((p.x-a[0])*dx+(-p.y-a[1])*dy)/length)):0,dist=Math.hypot(p.x-(a[0]+t*dx),-p.y-(a[1]+t*dy));if(dist<best){best=dist;winner=obj;}}}
    }return winner;
  }
  clearSelection(){this.selected=[];this.selectedRegion=null;this.svg?.querySelectorAll('.space-object-selected').forEach(e=>e.classList.remove('space-object-selected'));this.root.querySelector('#space-selection').innerHTML='<div class="space-selection-empty"><span>⌖</span><strong>从地图开始探索</strong><p>点击对象查看原始图层、句柄与坐标；区域框选仅为临时选择。</p></div>';}
  highlight(ids){this.svg.querySelectorAll('.space-object-selected').forEach(e=>e.classList.remove('space-object-selected'));const set=new Set(ids);this.svg.querySelectorAll('[data-entity-id]').forEach(e=>{if(set.has(e.dataset.entityId))e.classList.add('space-object-selected');});this.selected=ids;}
  inspect(obj){
    if(!obj)return;this.selectedRegion=null;this.mark2DRegion(null);this.highlight([obj.entity_id]);const source=this.data.source_entities[obj.source_handle];
    const coords=obj.geometry.position||[(obj.bounds[0]+obj.bounds[2])/2,(obj.bounds[1]+obj.bounds[3])/2];
    this.root.querySelector('#space-selection').innerHTML=`<div class="space-object-card"><span class="space-badge cad">CAD SOURCE · RULE_BASED</span><h3>${esc(categories[obj.category])}</h3>${obj.geometry.text?`<p class="space-object-text">${esc(obj.geometry.text)}</p>`:''}<dl><dt>CAD 类型</dt><dd>${esc(obj.dxf_type)}</dd><dt>原始句柄</dt><dd>${esc(obj.source_handle||'派生图元')}</dd><dt>原始图层</dt><dd>${esc(obj.source_layer)}</dd><dt>生效图层</dt><dd>${esc(obj.effective_layer)}</dd><dt>楼层</dt><dd>${esc(this.data.name)}</dd><dt>来源图块</dt><dd>${esc(obj.source_block)}</dd><dt>插入链深度</dt><dd>${obj.insert_chain.length}</dd><dt>WCS X / Y</dt><dd>${num(coords[0])}<br>${num(coords[1])} mm</dd></dl><p class="space-detail-note">坐标为文本锚点或图元包围框中心，非设备或区域定位。分类按 CAD 图层规则展示，未做 BIM 语义验证。</p><details><summary>原始 DXF 属性 / 变换</summary><pre>${esc(JSON.stringify({entity_id:obj.entity_id,source_dxf:source?.dxf,world_matrix44:obj.world_matrix44},null,2))}</pre></details><a href="/api/v1/floors/${this.floorId}/objects/${obj.entity_id}" target="_blank" rel="noreferrer">原始实体数据 ↗</a></div>`;
  }
  inspectArea(ids,box){
    this.highlight(ids);this.root.querySelector('#space-selection').innerHTML=`<div class="space-object-card"><span class="space-badge">TEMPORARY SELECTION</span><h3>${ids.length} 个 CAD 对象</h3><p class="space-detail-note">临时框选，不是已确认业务区域。仅选择完整落在框内的可见对象。</p><dl><dt>X 范围 mm</dt><dd>${num(box[0])} – ${num(box[2])}</dd><dt>Y 范围 mm</dt><dd>${num(box[1])} – ${num(box[3])}</dd></dl><div class="space-area-objects">${ids.slice(0,12).map(id=>{const o=this.objects.get(id);return `<button data-space-object="${esc(id)}">${esc(o.dxf_type)} · ${esc(o.source_handle)} ↗</button>`;}).join('')||'<p>此框内没有完整对象。</p>'}</div>${ids.length>12?'<p class="space-detail-note">列出前 12 个，可继续点击地图查看其余对象。</p>':''}</div>`;
  }
  async loadCameras(){
    const floorId=this.floorId,generation=this.generation,simulated=this.simulated;
    const response=await get(`/cameras?floor_id=${floorId}&include_simulated=${simulated}`,this.abort.signal);
    if(this.abort.signal.aborted||generation!==this.generation||simulated!==this.simulated||!this.svg)return;
    this.cameraRecords=response.items;this.renderCameras();
  }
  updateSimulationLabel(){this.root.querySelectorAll('[data-demo-layer]').forEach(e=>e.disabled=!this.simulated);this.root.querySelectorAll('.space-demo-state').forEach(e=>e.textContent=this.simulated?'SIMULATED':'NOT CONNECTED');this.root.querySelectorAll('.space-camera-state').forEach(e=>e.textContent=this.simulated?'SIMULATED':'NOT CONNECTED');this.root.querySelector('#space-sim-legend').hidden=!this.simulated;}
  renderCameras(){
    this.svg.querySelectorAll('[data-space-device-layer]').forEach(g=>g.remove());
    for(const name of ['coverage','cameras']){
      const group=document.createElementNS(svgNS,'g');group.dataset.spaceDeviceLayer=name;group.classList.add('space-'+name);
      for(const c of this.cameraRecords){
        const node=document.createElementNS(svgNS,'g');node.dataset.spaceCamera=c.camera_id;
        const title=document.createElementNS(svgNS,'title');title.textContent=`SIMULATED · ${c.camera_id} · 无真实视频流`;node.append(title);
        if(name==='coverage'){
          const r=c.range_mm,angle=c.direction*Math.PI/180,half=c.field_of_view*Math.PI/360;
          const p1=[c.x+r*Math.cos(angle-half),-(c.y+r*Math.sin(angle-half))],p2=[c.x+r*Math.cos(angle+half),-(c.y+r*Math.sin(angle+half))];
          const path=document.createElementNS(svgNS,'path');path.setAttribute('d',`M${c.x},${-c.y} L${p1} A${r},${r} 0 0 0 ${p2} Z`);node.append(path);
        }else{
          const circle=document.createElementNS(svgNS,'circle');circle.setAttribute('cx',c.x);circle.setAttribute('cy',-c.y);circle.setAttribute('r',420);node.append(circle);
          const text=document.createElementNS(svgNS,'text');text.setAttribute('x',c.x+650);text.setAttribute('y',-c.y+150);text.setAttribute('font-size',650);text.textContent='SIMULATED';node.append(text);
        }group.append(node);
      }this.svg.append(group);
    }this.applyLayers();
  }
  applyLayers(){this.refreshScene();if(!this.svg)return;this.svg.querySelector('[data-cad-regions]')?.classList.toggle('space-overlay-hidden',!this.layers.zones);this.svg.querySelectorAll('[data-cad-layer]').forEach(g=>g.classList.toggle('space-structure-hidden',!this.layers.structure));for(const name of ['cameras','coverage'])this.svg.querySelector(`[data-space-device-layer="${name}"]`)?.classList.toggle('space-overlay-hidden',!this.layers[name]||!this.simulated);}
  inspectCamera(id){const c=this.cameraRecords.find(c=>c.camera_id===id);if(!c)return;this.highlight([]);this.root.querySelector('#space-selection').innerHTML=`<div class="space-object-card"><span class="space-badge simulated">SIMULATED</span><h3>测试摄像头</h3><dl>${[['camera_id',c.camera_id],['floor_id',c.floor_id],['zone_id','未关联'],['X / Y (mm)',`${num(c.x)} / ${num(c.y)}`],['Z','未测量'],['方向 / FOV',`${c.direction}° / ${c.field_of_view}°`],['视频流','NOT CONNECTED']].map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="space-detail-note">仅验证坐标映射与扇形绘制；未校准、未考虑墙体遮挡，不是真实覆盖率。</p></div>`;}
  fail(error){if(error.name==='AbortError'||this.abort.signal.aborted)return;const target=this.root.querySelector('#space-map-notice')||this.root;target.innerHTML=`<p class="space-load-error" role="alert">${esc(error.message)}。请确认后端和已生成的空间数据文件可用。</p>`;}
  destroy(){document.body.classList.remove('space-is-3d');this.abort.abort();this.generation++;this.mapGeneration++;this.threeView?.destroy();this.threeView=null;this.cancelPointer();}
}

export function mountSpace(root){const view=new SpaceView(root);view.init();return view;}
