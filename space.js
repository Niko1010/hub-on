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
  }
  async init() {
    try {
      const [spaces,floors] = await Promise.all([get('/spaces',this.abort.signal),get('/floors',this.abort.signal)]);
      if(this.abort.signal.aborted)return;
      this.building=spaces.items[0];this.floors=floors.items;
      this.root.innerHTML=this.frame();this.bind();
      const saved=localStorage.getItem('hubone-space-floor');
      await this.floor(this.floors.some(f=>f.floor_id===saved)?saved:this.floors[0].floor_id);
    } catch(error) {this.fail(error);}
  }
  frame() {
    return `<div class="space-location"><div><span class="space-site-code">GQ / 001</span><strong>苏州 · 观前街1号</strong><span>真实建筑数字底图</span></div><div><span class="space-badge cad">CAD SOURCE</span><span class="space-badge">WCS · mm</span><a href="/api/v1/spaces/guanqian-1/report.md" class="space-report-link">CAD 解析报告 ↗</a></div></div>
      <div class="space-workspace">
        <aside class="space-controls space-panel" aria-label="空间地图控制">
          <div class="space-panel-title"><span>楼层导航</span><small>FLOORS</small></div>
          <div class="space-floor-list">${this.floors.map(f=>`<button data-space-floor="${f.floor_id}" aria-pressed="false"><strong>0${f.level}<span>F</span></strong><span>${esc(f.name)}<small>原始 CAD 平面</small></span><b>↗</b></button>`).join('')}</div>
          <div class="space-panel-title space-divider"><span>空间图层</span><small>LAYERS</small></div>
          <div class="space-layer-list">
            <label><input type="checkbox" data-space-layer="structure" checked><span>建筑空间结构<small>原始图层独立保留</small></span><i class="space-layer-dot"></i></label>
            <label><input type="checkbox" data-space-layer="cameras"><span>摄像头位置<small class="space-camera-state">NOT CONNECTED</small></span></label>
            <label><input type="checkbox" data-space-layer="coverage"><span>摄像头覆盖范围<small class="space-camera-state">NOT CONNECTED</small></span></label>
            ${['消费者动线','人流热力图','产品体验事件'].map(t=>`<label class="space-unavailable"><input type="checkbox" disabled><span>${t}<small>NOT CONNECTED</small></span></label>`).join('')}
          </div>
          <div class="space-simulation"><label><input type="checkbox" id="space-simulated"> 测试设备</label><span class="space-badge simulated">SIMULATED</span><p>仅验证位置和覆盖扇形，不代表真实安装点。</p></div>
          <details class="space-cad-layers"><summary>CAD 原始图层 <span id="space-layer-count"></span></summary><div id="space-raw-layers"></div></details>
          <div class="space-controls-note">原始坐标完整保留<br>楼层尚未进行实测配准</div>
        </aside>
        <section class="space-map-panel space-panel" aria-label="建筑空间地图">
          <div class="space-map-heading"><div><span class="space-kicker">BUILDING DIGITAL MAP</span><h2 id="space-map-title">正在读取空间数据</h2></div><span class="space-live-label"><i></i> CAD EXTRACTED</span></div>
          <div class="space-map-tools"><div><button data-space-tool="pan" class="active" aria-pressed="true" title="拖动平移">✥ <span>平移</span></button><button data-space-tool="area" aria-pressed="false" title="框选图纸对象；不会建立业务区域">▧ <span>区域框选</span></button></div><div><button data-space-zoom="out" aria-label="缩小">−</button><button data-space-zoom="in" aria-label="放大">＋</button><button data-space-zoom="fit" aria-label="适配地图">⊡</button></div></div>
          <div class="space-map-viewport" id="space-map" tabindex="0" aria-label="CAD 地图，滚轮缩放、拖动平移；方向键平移，加减键缩放，0 键复位"><div class="space-loading">正在载入真实 CAD 几何…</div></div>
          <div class="space-map-status" role="status"><span id="space-coordinate">X — / Y — mm</span><span id="space-zoom">100%</span><span>CAD Y ↑</span></div>
          <div class="space-map-legend"><span><i class="wall"></i> 墙柱</span><span><i class="window"></i> 门窗</span><span><i class="stair"></i> 楼梯</span><span id="space-sim-legend" hidden><i class="sim"></i> SIMULATED</span><span class="space-legend-help">滚轮缩放 · 拖动平移 · 点击查看</span></div>
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
      if(floor)this.floor(floor.dataset.spaceFloor).catch(error=>this.fail(error));
      if(zoom){if(zoom.dataset.spaceZoom==='fit')this.fit();else this.zoom(zoom.dataset.spaceZoom==='in'?1/1.3:1.3);}
      if(tool){this.areaMode=tool.dataset.spaceTool==='area';this.root.querySelectorAll('[data-space-tool]').forEach(b=>{const active=(b.dataset.spaceTool==='area')===this.areaMode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});this.map.classList.toggle('area-mode',this.areaMode);}
      if(object)this.inspect(this.objects.get(object.dataset.spaceObject));
    },{signal:this.abort.signal});
    this.root.addEventListener('change',async e=>{
      try {
        if(e.target.matches('[data-space-layer]')){this.layers[e.target.dataset.spaceLayer]=e.target.checked;this.applyLayers();}
        if(e.target.matches('[data-cad-layer-control]')){const name=e.target.dataset.cadLayerControl;e.target.checked?this.hiddenCadLayers.delete(name):this.hiddenCadLayers.add(name);this.applyCadVisibility();}
        if(e.target.id==='space-simulated'){
          this.simulated=e.target.checked;this.updateSimulationLabel();await this.loadCameras();
        }
      }catch(error){this.fail(error);}
    },{signal:this.abort.signal});
    this.map=this.root.querySelector('#space-map');
    this.map.addEventListener('wheel',e=>{if(!this.svg)return;e.preventDefault();this.zoom(e.deltaY>0?1.16:1/1.16,this.toSVG(e.clientX,e.clientY));},{passive:false,signal:this.abort.signal});
    this.map.addEventListener('pointerdown',e=>this.pointerDown(e),{signal:this.abort.signal});
    this.map.addEventListener('pointermove',e=>this.pointerMove(e),{signal:this.abort.signal});
    this.map.addEventListener('pointerup',e=>this.pointerUp(e),{signal:this.abort.signal});
    this.map.addEventListener('pointercancel',()=>this.cancelPointer(),{signal:this.abort.signal});
    this.map.addEventListener('keydown',e=>{
      if(!this.svg)return;
      if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();
      if(e.key==='+'||e.key==='=')this.zoom(1/1.3);if(e.key==='-')this.zoom(1.3);if(e.key==='0')this.fit();
      const moves={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};
      if(moves[e.key]){this.view[0]+=moves[e.key][0]*this.view[2];this.view[1]+=moves[e.key][1]*this.view[3];this.setView();}
    },{signal:this.abort.signal});
  }
  async floor(fid) {
    const generation=++this.generation;
    this.floorId=fid;this.svg=null;this.cancelPointer();this.map.innerHTML='<div class="space-loading">正在载入真实 CAD 几何…</div>';
    this.root.querySelectorAll('[data-space-floor]').forEach(b=>{b.classList.toggle('active',b.dataset.spaceFloor===fid);b.setAttribute('aria-pressed',String(b.dataset.spaceFloor===fid));});
    let cached=this.cache.get(fid);
    if(!cached){const [data,svg]=await Promise.all([get(`/floors/${fid}/geometry`,this.abort.signal),get(`/floors/${fid}/map.svg`,this.abort.signal,true)]);cached={data,svg};this.cache.set(fid,cached);}
    if(this.abort.signal.aborted||generation!==this.generation)return;
    this.data=cached.data;this.objects=new Map(this.data.entities.map(e=>[e.entity_id,e]));
    this.containers=new Map(this.data.containers.map(e=>[e.entity_id,e]));
    this.hiddenCadLayers=new Set(this.data.layers.filter(l=>l.off||l.frozen).map(l=>l.name));
    const parsed=new DOMParser().parseFromString(cached.svg,'image/svg+xml');
    if(parsed.querySelector('parsererror')||parsed.documentElement.localName!=='svg')throw Error('CAD SVG 格式错误');
    this.svg=document.importNode(parsed.documentElement,true);this.svg.classList.add('space-cad-svg');this.map.replaceChildren(this.svg);
    this.root.querySelector('#space-map-title').textContent=`${this.data.level}F · ${this.data.name}建筑平面`;
    this.root.querySelector('#space-floor-label').textContent=`${this.data.level}F`;
    this.root.querySelector('#space-entity-count').textContent=num(this.data.entity_count);
    this.root.querySelector('#space-layer-count').textContent=`${this.data.layers.length}`;
    this.root.querySelector('#space-raw-layers').innerHTML=this.data.layers.map(l=>`<label><input type="checkbox" data-cad-layer-control="${esc(l.name)}" ${l.off||l.frozen?'':'checked'}><span title="${esc(l.name)}">${esc(l.name)}</span><small>${l.count}</small></label>`).join('');
    this.applyCadVisibility();
    this.root.querySelector('#space-map-notice').textContent=this.data.level===2?'二层由 CAD 图块与标题确认。上传的两份 PDF 均为一层，二层 PDF 核对待补充。':'一层已与 PDF 建筑轮廓核对；PDF 的阴影范围等标注与 CAD 主平面存在差异，未据 PDF 重绘。';
    this.root.querySelector('#space-source-summary').textContent=`DXF AC1027 · ${this.data.layers.length} 原始图层 · 单位 mm · ${this.data.source.sha256.slice(0,12)}`;
    for(const [kind,suffix] of [['svg','map.svg'],['json','geometry']]){const a=this.root.querySelector(`#space-download-${kind}`);a.href=`/api/v1/floors/${fid}/${suffix}`;a.setAttribute('download',`${fid}.${kind}`);}
    localStorage.setItem('hubone-space-floor',fid);this.clearSelection();this.fit();this.applyLayers();await this.loadCameras();
  }
  fit(){if(!this.svg)return;this.view=[...this.data.svg_view_box];this.setView();}
  setView(){this.svg.setAttribute('viewBox',this.view.join(' '));this.root.querySelector('#space-zoom').textContent=`${Math.round(this.data.svg_view_box[2]/this.view[2]*100)}%`;}
  toSVG(x,y){const p=new DOMPoint(x,y);return p.matrixTransform(this.svg.getScreenCTM().inverse());}
  zoom(factor,point){if(!this.svg)return;const old=this.view;const width=Math.min(this.data.svg_view_box[2]*3,Math.max(this.data.svg_view_box[2]/50,old[2]*factor));factor=width/old[2];point=point||{x:old[0]+old[2]/2,y:old[1]+old[3]/2};this.view=[point.x-(point.x-old[0])*factor,point.y-(point.y-old[1])*factor,width,old[3]*factor];this.setView();}
  pointerDown(e){
    if(!this.svg||e.button!==0)return;e.preventDefault();this.map.focus();this.map.setPointerCapture(e.pointerId);
    this.drag={x:e.clientX,y:e.clientY,point:this.toSVG(e.clientX,e.clientY),view:[...this.view],target:e.target,scale:this.svg.getScreenCTM().a};
    if(this.areaMode){this.selectionRect=document.createElementNS(svgNS,'rect');this.selectionRect.classList.add('space-selection-rect');this.svg.append(this.selectionRect);}
    this.map.classList.add('dragging');
  }
  pointerMove(e){
    if(!this.svg)return;const p=this.toSVG(e.clientX,e.clientY);this.root.querySelector('#space-coordinate').textContent=`X ${num(p.x)} / Y ${num(-p.y)} mm`;
    if(!this.drag)return;
    if(this.areaMode){const x=Math.min(p.x,this.drag.point.x),y=Math.min(p.y,this.drag.point.y);for(const[k,v]of Object.entries({x,y,width:Math.abs(p.x-this.drag.point.x),height:Math.abs(p.y-this.drag.point.y)}))this.selectionRect.setAttribute(k,v);}
    else{this.view=[this.drag.view[0]-(e.clientX-this.drag.x)/this.drag.scale,this.drag.view[1]-(e.clientY-this.drag.y)/this.drag.scale,...this.drag.view.slice(2)];this.setView();}
  }
  pointerUp(e){
    if(!this.drag||!this.svg)return;const d=this.drag,moved=Math.hypot(e.clientX-d.x,e.clientY-d.y)>4;
    if(this.areaMode&&moved&&this.layers.structure){
      const p=this.toSVG(e.clientX,e.clientY),box=[Math.min(p.x,d.point.x),Math.min(-p.y,-d.point.y),Math.max(p.x,d.point.x),Math.max(-p.y,-d.point.y)];
      const ids=this.data.entities.filter(o=>{const b=o.bounds;return this.visible(o)&&b[0]>=box[0]&&b[1]>=box[1]&&b[2]<=box[2]&&b[3]<=box[3];}).map(o=>o.entity_id);
      this.inspectArea(ids,box);
    }else if(!moved){const camera=d.target.closest?.('[data-space-camera]');if(camera)this.inspectCamera(camera.dataset.spaceCamera);else{const hit=d.target.closest?.('[data-entity-id]');if(hit&&this.layers.structure)this.inspect(this.objects.get(hit.dataset.entityId));else{const obj=this.nearest(this.toSVG(e.clientX,e.clientY));if(obj)this.inspect(obj);}}}
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
  clearSelection(){this.selected=[];this.svg?.querySelectorAll('.space-object-selected').forEach(e=>e.classList.remove('space-object-selected'));this.root.querySelector('#space-selection').innerHTML='<div class="space-selection-empty"><span>⌖</span><strong>从地图开始探索</strong><p>点击对象查看原始图层、句柄与坐标；区域框选仅为临时选择。</p></div>';}
  highlight(ids){this.svg.querySelectorAll('.space-object-selected').forEach(e=>e.classList.remove('space-object-selected'));const set=new Set(ids);this.svg.querySelectorAll('[data-entity-id]').forEach(e=>{if(set.has(e.dataset.entityId))e.classList.add('space-object-selected');});this.selected=ids;}
  inspect(obj){
    if(!obj)return;this.highlight([obj.entity_id]);const source=this.data.source_entities[obj.source_handle];
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
  updateSimulationLabel(){this.root.querySelectorAll('.space-camera-state').forEach(e=>e.textContent=this.simulated?'SIMULATED':'NOT CONNECTED');this.root.querySelector('#space-sim-legend').hidden=!this.simulated;}
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
  applyLayers(){if(!this.svg)return;this.svg.querySelectorAll('[data-cad-layer]').forEach(g=>g.classList.toggle('space-structure-hidden',!this.layers.structure));for(const name of ['cameras','coverage'])this.svg.querySelector(`[data-space-device-layer="${name}"]`)?.classList.toggle('space-overlay-hidden',!this.layers[name]||!this.simulated);}
  inspectCamera(id){const c=this.cameraRecords.find(c=>c.camera_id===id);if(!c)return;this.highlight([]);this.root.querySelector('#space-selection').innerHTML=`<div class="space-object-card"><span class="space-badge simulated">SIMULATED</span><h3>测试摄像头</h3><dl>${[['camera_id',c.camera_id],['floor_id',c.floor_id],['zone_id','未关联'],['X / Y (mm)',`${num(c.x)} / ${num(c.y)}`],['Z','未测量'],['方向 / FOV',`${c.direction}° / ${c.field_of_view}°`],['视频流','NOT CONNECTED']].map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="space-detail-note">仅验证坐标映射与扇形绘制；未校准、未考虑墙体遮挡，不是真实覆盖率。</p></div>`;}
  fail(error){if(error.name==='AbortError'||this.abort.signal.aborted)return;const target=this.root.querySelector('#space-map-notice')||this.root;target.innerHTML=`<p class="space-load-error" role="alert">${esc(error.message)}。请确认后端和已生成的空间数据文件可用。</p>`;}
  destroy(){this.abort.abort();this.generation++;this.cancelPointer();}
}

export function mountSpace(root){const view=new SpaceView(root);view.init();return view;}
