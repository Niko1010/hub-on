import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {SSAOPass} from 'three/addons/postprocessing/SSAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const PALETTE=['#80a4ba','#96a5bb','#81b1b3','#a5a1b9','#8ea7bf','#94b7be'];
const BACKGROUND='#f3f4f6';
// AO uses opaque architectural surfaces, excluding glass, region volumes and demo overlays.
class ArchitecturalAOPass extends SSAOPass {
  _overrideVisibility(){
    super._overrideVisibility();
    this.scene.traverse(o=>{if(o.visible&&(o.userData.aoExcluded||o.isSprite||(o.isMesh&&o.material?.transparent))){o.visible=false;this._visibilityCache.push(o);}});
  }
}
const hash=s=>[...s].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,17);
const xy=(model,p)=>[(p[0]-model.registration.origin_wcs_mm[0])/1000,(p[1]-model.registration.origin_wcs_mm[1])/1000];
function shape(model,footprint){
  const outer=footprint.outer.map(p=>new THREE.Vector2(...xy(model,p)));
  const result=new THREE.Shape(outer);
  for(const ring of footprint.holes||[])result.holes.push(new THREE.Path(ring.map(p=>new THREE.Vector2(...xy(model,p)))));
  return result;
}
function solid(model,footprint,height){return new THREE.ExtrudeGeometry(shape(model,footprint),{depth:height,bevelEnabled:false,curveSegments:2}).rotateX(-Math.PI/2);}
function flat(model,footprint){return new THREE.ShapeGeometry(shape(model,footprint)).rotateX(-Math.PI/2);}
function lineGeometry(model,paths,y=.1){
  const values=[];
  for(const path of paths)for(let i=1;i<path.length;i++){const a=xy(model,path[i-1]),b=xy(model,path[i]);values.push(a[0],y,-a[1],b[0],y,-b[1]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(values,3));return g;
}
function planes(model,segments,height){
  const values=[];
  for(const [start,end]of segments){const a=xy(model,start),b=xy(model,end);values.push(a[0],0,-a[1],b[0],0,-b[1],b[0],height,-b[1],a[0],0,-a[1],b[0],height,-b[1],a[0],height,-a[1]);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(values,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(new Array(values.length/3*2).fill(0),2));g.computeVertexNormals();return g;
}
function label(text,color='#476b97',background='rgba(255,255,255,.94)',width=8){
  const canvas=document.createElement('canvas'),font='500 52px Inter, "PingFang SC", "Microsoft YaHei UI", "Noto Sans SC", sans-serif';
  let c=canvas.getContext('2d');c.font=font;canvas.width=Math.ceil(Math.max(width*40,c.measureText(text).width+64));canvas.height=128;
  c=canvas.getContext('2d');c.fillStyle=background;c.beginPath();c.roundRect(2,2,canvas.width-4,124,18);c.fill();
  c.strokeStyle='rgba(109,147,190,.20)';c.lineWidth=3;c.stroke();c.font=font;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,canvas.width/2,67);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:true,depthWrite:false,toneMapped:false}));s.scale.set(width,width/(canvas.width/128),1);s.userData.labelPixels=canvas.width/4;s.userData.labelAspect=canvas.width/128;s.renderOrder=20;return s;
}
function polygonContains(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export function demoForRegion(region,model){const h=hash(region.spatial_id),cam=model?.demo_camera_wcs_mm;return {simulated:true,input_origin:'SIMULATED',demo_zone_id:'SIM-'+region.spatial_id,
  camera_count:cam&&polygonContains(cam,region.footprint.outer)&&!region.footprint.holes.some(r=>polygonContains(cam,r))?1:0,
  visitors:8+h%24,dwell_seconds:95+h%210,experience_events:1+h%5,
  feedback:['穿起来还可以，但是腰部有点紧。','上坡的时候感觉助力还不错。','走久了之后感觉有一点重。'][h%3],
  event_id:'SIM-E-'+h,session_id:'SIM-SESSION-'+region.floor_id,feedback_status:'SIMULATED / 示例原话，非现场观测'};}

class SpatialScene {
  constructor(host,{models,onSelect,onCamera,onEvent,onChange}){
    this.host=host;this.models=models;this.onSelect=onSelect;this.onCamera=onCamera;this.onEvent=onEvent;this.onChange=onChange;
    this.abort=new AbortController();this.disposed=false;this.floorGroups=new Map();this.regionMeshes=new Map();this.pickables=[];this.cameraRecords=[];this.demoCurves=[];this.selected=null;
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));this.renderer.setClearColor(BACKGROUND);
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.9;
    this.renderer.info.autoReset=false;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.domElement.className='space-webgl';this.renderer.domElement.setAttribute('aria-label','可交互三维建筑模型；拖动旋转，右键平移，滚轮缩放');
    this.renderer.domElement.tabIndex=0;
    this.renderer.domElement.__huboneViewer=this;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color().setRGB(2.2,2.23,2.27);
    const environment=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(this.renderer);
    this.environmentTarget=pmrem.fromScene(environment,.04);this.scene.environment=this.environmentTarget.texture;this.scene.environmentIntensity=.12;
    environment.dispose();pmrem.dispose();
    this.camera=new THREE.OrthographicCamera(-100,100,80,-80,.1,1200);this.camera.position.set(150,150,150);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.13;this.controls.minZoom=.3;this.controls.maxZoom=24;
    this.controls.minPolarAngle=.05;this.controls.maxPolarAngle=Math.PI/2-.025;this.controls.screenSpacePanning=true;
    this.controls.addEventListener('change',()=>{this.invalidate();this.onChange?.(Math.round(this.camera.zoom*100));});
    this.controls.addEventListener('start',()=>{this.focusMotion=null;this.controls.enableDamping=true;});
    this.scene.add(new THREE.HemisphereLight('#f5f7ff','#c0bdb6',.7));this.scene.add(new THREE.AmbientLight('#ffffff',.18));
    const fill=new THREE.DirectionalLight('#dcecff',.7);fill.position.set(70,45,-85);this.scene.add(fill);
    const sun=new THREE.DirectionalLight('#fff4df',2.5);sun.position.set(-30,110,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    Object.assign(sun.shadow.camera,{left:-110,right:110,top:90,bottom:-90,near:1,far:700});sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;sun.shadow.radius=3;
    this.sun=sun;this.scene.add(sun);this.scene.add(sun.target);
    this.wallMaterial=new THREE.MeshStandardMaterial({color:'#f1eee7',roughness:.78,metalness:.015,side:THREE.DoubleSide});
    this.columnMaterial=new THREE.MeshStandardMaterial({color:'#d9d6cf',roughness:.76,metalness:.025});
    this.glassMaterial=new THREE.MeshPhysicalMaterial({color:'#91c6d1',transparent:true,opacity:.36,roughness:.17,metalness:.06,clearcoat:.4,clearcoatRoughness:.2,side:THREE.DoubleSide,depthWrite:false});
    this.slabMaterial=new THREE.MeshStandardMaterial({color:'#dfe1df',roughness:.88,metalness:.015});
    this.cadLineMaterial=new THREE.LineBasicMaterial({color:'#87939f',transparent:true,opacity:.48});
    for(const model of models)this.buildFloor(model);
    const bounds=this.fullBounds();this.modelCenter=bounds.getCenter(new THREE.Vector3());
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(430,340),new THREE.MeshBasicMaterial({color:BACKGROUND,toneMapped:false}));
    ground.material.color.copy(this.scene.background);
    ground.rotation.x=-Math.PI/2;ground.position.set(this.modelCenter.x,-.42,this.modelCenter.z);this.scene.add(ground);
    const shadow=new THREE.Mesh(new THREE.PlaneGeometry(430,340),new THREE.ShadowMaterial({color:'#737d89',opacity:.14}));shadow.rotation.x=-Math.PI/2;shadow.position.copy(ground.position);shadow.position.y+=.002;shadow.receiveShadow=true;this.scene.add(shadow);
    sun.target.position.copy(this.modelCenter);sun.position.add(new THREE.Vector3(this.modelCenter.x,0,this.modelCenter.z));
    this.screenLabels=[];this.scene.traverse(o=>{if(o.isSprite&&o.userData.labelPixels)this.screenLabels.push(o);});
    this.ray=new THREE.Raycaster();this.ndc=new THREE.Vector2();
    host.replaceChildren(this.renderer.domElement);this.resize=new ResizeObserver(()=>this.onResize());this.resize.observe(host);
    this.renderer.domElement.addEventListener('pointerdown',e=>{this.renderer.domElement.focus({preventScroll:true});this.down={x:e.clientX,y:e.clientY};},{signal:this.abort.signal});
    this.renderer.domElement.addEventListener('pointerup',e=>this.pick(e),{signal:this.abort.signal});
    this.renderer.domElement.addEventListener('pointermove',e=>{if(!this.down||e.buttons===0)this.hover(e);},{signal:this.abort.signal});
    this.renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault(),{signal:this.abort.signal});
    if(this.renderer.extensions.has('EXT_color_buffer_float')){
      this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));
      this.ao=new ArchitecturalAOPass(this.scene,this.camera,512,512,16);this.ao.kernelRadius=.85;this.ao.minDistance=.00002;this.ao.maxDistance=.002;
      this.ao.ssaoMaterial.defines.PERSPECTIVE_CAMERA=0;this.ao.depthRenderMaterial.defines.PERSPECTIVE_CAMERA=0;
      this.composer.addPass(this.ao);this.composer.addPass(new OutputPass());
    }
    this.setOptions({floorId:models[0].floor_id,floorDisplay:'both',explode:0,simulated:false,layers:{structure:true,zones:true,cameras:false,coverage:false}});
    this.onResize();this.fit(true);this.renderer.domElement.dataset.ready='true';this.invalidate();
  }
  addMerged(group,geometries,material,cast=true){
    if(!geometries.length)return;
    const geometry=mergeGeometries(geometries.map(g=>g.index?g.toNonIndexed():g),false);
    for(const g of geometries)g.dispose();
    const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=cast;mesh.receiveShadow=true;group.add(mesh);return mesh;
  }
  buildFloor(model){
    const group=new THREE.Group();group.name=model.floor_id;group.userData.model=model;
    const structure=new THREE.Group(),zones=new THREE.Group(),operations=new THREE.Group();zones.userData.aoExcluded=true;operations.userData.aoExcluded=true;group.add(structure,zones,operations);
    this.scene.add(group);this.floorGroups.set(model.floor_id,{group,structure,zones,operations,model});
    const heights=model.demo_height_defaults_mm,columns=[],walls=[],glass=[],stairs=[];
    for(const c of model.components){
      if(c.kind==='column'||c.kind==='wall_solid'){
        const g=solid(model,c.footprint,(c.kind==='column'?heights.column:heights.wall)/1000);(c.kind==='column'?columns:walls).push(g);
      }else if(c.kind==='wall_plane')walls.push(planes(model,c.segments,heights.wall/1000));
      else if(c.kind==='glazing')glass.push(planes(model,c.segments,heights.glazing/1000));
      else if(c.kind==='stair_plan')stairs.push(...c.paths_wcs_xyz_mm);
    }
    for(const [kind,geometries,material,cast]of [['columns',columns,this.columnMaterial,true],['walls',walls,this.wallMaterial,true],['glazing',glass,this.glassMaterial,false]]){const mesh=this.addMerged(structure,geometries,material,cast);if(mesh)mesh.userData.assetType=kind;}
    if(stairs.length){const mesh=new THREE.LineSegments(lineGeometry(model,stairs,.09),this.cadLineMaterial);mesh.userData.assetType='stairs';structure.add(mesh);}
    const slab=[];for(const p of model.presentation_slab.footprints)slab.push(solid(model,p,heights.slab/1000).translate(0,-heights.slab/1000,0));
    const support=this.addMerged(structure,slab,this.slabMaterial);support.userData.provenance='SIMULATED_RECONSTRUCTION';support.userData.assetType='slabs';
    const edge=new THREE.LineSegments(new THREE.EdgesGeometry(support.geometry,28),new THREE.LineBasicMaterial({color:'#aeb6bf',transparent:true,opacity:.28}));edge.userData.assetType='slabs';structure.add(edge);
    for(const [i,region] of [...model.regions].sort((a,b)=>b.area_m2-a.area_m2).entries()){
      const material=new THREE.MeshBasicMaterial({color:PALETTE[hash(region.spatial_id)%PALETTE.length],transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,toneMapped:false});
      const mesh=new THREE.Mesh(flat(model,region.footprint),material);mesh.position.y=.02+i*.0002;mesh.renderOrder=2;
      mesh.userData={kind:'region',region,model,baseColor:material.color.clone()};zones.add(mesh);this.regionMeshes.set(region.spatial_id,mesh);this.pickables.push(mesh);
      const volume=new THREE.Mesh(solid(model,region.footprint,heights.wall/1000*.65),new THREE.MeshBasicMaterial({color:material.color,transparent:true,opacity:.025,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
      volume.geometry.computeBoundingBox();volume.position.y=.025;volume.renderOrder=1;
      volume.userData={kind:'region',region,model,vertical_provenance:'SIMULATED'};zones.add(volume);mesh.userData.volume=volume;this.pickables.push(volume);
    }
    const b=new THREE.Box3().setFromObject(structure),tag=label(`${model.level.toString().padStart(2,'0')}F  /  CAD PLAN`,'#42668e','rgba(255,255,255,.94)',10);
    tag.position.set(b.min.x+5,.7,b.max.z+3);tag.material.depthTest=false;tag.userData.floorLabel=true;group.add(tag);
    this.buildOperations(model,operations);
  }
  buildOperations(model,group){
    const parts={};for(const name of ['activity','heatmap','trajectories','experience','events','cameras','coverage']){parts[name]=new THREE.Group();parts[name].name=name;group.add(parts[name]);}
    group.userData.parts=parts;
    const regions=model.regions.filter(r=>r.method==='CAD_LINEWORK_POLYGONIZATION'&&r.area_m2>25).sort((a,b)=>b.area_m2-a.area_m2).slice(0,5);
    const fallback=regions.length?regions:model.regions.slice(0,3);
    for(const [i,r]of fallback.entries()){
      const pos=xy(model,r.label_wcs_mm),demo=demoForRegion(r,model);
      const tag=label(`${demo.visitors}  /  SIM`,i%2?'#6e62b2':'#278c9e','rgba(255,255,255,.9)',7);tag.position.set(pos[0],.7,-pos[1]);parts.activity.add(tag);
      const marker=label(`↗ ${demo.experience_events}  SIM`,'#a57b37','rgba(255,248,229,.96)',6);marker.position.set(pos[0]+1,2,-pos[1]);
      marker.userData={...marker.userData,kind:'event',model,region:r,demo};parts.events.add(marker);this.pickables.push(marker);
      if(i===0){
        const fill=new THREE.Mesh(flat(model,r.footprint),new THREE.MeshBasicMaterial({color:'#7969d1',transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));fill.position.y=.08;parts.experience.add(fill);
        const text=label('CREST C3 / SIM','#6e62b2','rgba(250,247,255,.95)',10);text.position.set(pos[0],1.5,-pos[1]-2);parts.experience.add(text);
        const base=new THREE.Mesh(new THREE.BoxGeometry(2.6,.7,1.4),new THREE.MeshStandardMaterial({color:'#628abb',roughness:.6}));base.position.set(pos[0],.35,-pos[1]);base.castShadow=true;parts.experience.add(base);
        const top=new THREE.Mesh(new THREE.BoxGeometry(2.9,.12,1.65),new THREE.MeshStandardMaterial({color:'#f8fafc',roughness:.55}));top.position.set(pos[0],.76,-pos[1]);top.castShadow=true;parts.experience.add(top);
      }
      const raw=r.footprint.outer.filter((_,j)=>j%Math.max(1,Math.floor(r.footprint.outer.length/6))===0).slice(0,6);
      const points=raw.map(v=>{let p=[r.label_wcs_mm[0]*.65+v[0]*.35,r.label_wcs_mm[1]*.65+v[1]*.35];if(!polygonContains(p,r.footprint.outer))p=r.label_wcs_mm;const q=xy(model,p);return new THREE.Vector3(q[0],.25,-q[1]);});
      if(points.length>=3){const curve=new THREE.CatmullRomCurve3(points,true,'centripetal');const path=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.14,5,true),new THREE.MeshBasicMaterial({color:i%2?'#8372cf':'#36b8b6',transparent:true,opacity:.8}));parts.trajectories.add(path);
        const dot=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),new THREE.MeshBasicMaterial({color:'#ffffff'}));parts.trajectories.add(dot);this.demoCurves.push({curve,dot,offset:i*.17});}
    }
    this.buildHeatmap(model,parts.heatmap,fallback);
    const bounds=model.source_bounds_wcs_mm,cam=model.demo_camera_wcs_mm||[(bounds[0]+bounds[2])/2,(bounds[1]+bounds[3])/2],c={camera_id:'SIM-'+model.floor_id+'-01',building_id:model.building_id,floor_id:model.floor_id,zone_id:null,x:cam[0],y:cam[1],z:null,direction:35,field_of_view:70,range_mm:9000,stream_url:null,status:'not_connected',simulated:true,input_origin:'SIMULATED'};
    const p=xy(model,[c.x,c.y]);this.cameraRecords.push(c);
    const camera=new THREE.Group();camera.position.set(p[0],2.8,-p[1]);camera.rotation.y=(90+c.direction)*Math.PI/180;
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.4,.8,1.05),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.4}));
    const lens=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.3,12),new THREE.MeshStandardMaterial({color:'#315b85'}));lens.rotation.x=Math.PI/2;lens.position.z=.65;camera.add(body,lens);parts.cameras.add(camera);
    for(const mesh of [body,lens]){mesh.userData={kind:'camera',camera:c,model};this.pickables.push(mesh);}
    const pin=label(`${model.level}F CAM / SIM`,'#38648d','rgba(255,255,255,.98)',7);pin.position.set(p[0],3.7,-p[1]);pin.userData={...pin.userData,kind:'camera',camera:c,model};parts.cameras.add(pin);this.pickables.push(pin);
    const footprint=new THREE.Shape();footprint.moveTo(p[0],-p[1]);const radius=c.range_mm/1000;
    for(let i=0;i<=32;i++){const a=(c.direction-c.field_of_view/2+c.field_of_view*i/32)*Math.PI/180;footprint.lineTo(p[0]+radius*Math.cos(a),-p[1]-radius*Math.sin(a));}footprint.closePath();
    // This shape is constructed in X/Z, then oriented as a horizontal display fan.
    const geo=new THREE.ShapeGeometry(footprint);geo.rotateX(Math.PI/2);
    const fan=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:'#76aee0',transparent:true,opacity:.19,side:THREE.DoubleSide,depthWrite:false}));fan.position.y=.13;parts.coverage.add(fan);
  }
  buildHeatmap(model,group,regions){
    const bounds=model.source_bounds_wcs_mm,canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d');
    for(const [i,r]of regions.entries()){
      const x=(r.label_wcs_mm[0]-bounds[0])/(bounds[2]-bounds[0])*1024,y=(bounds[3]-r.label_wcs_mm[1])/(bounds[3]-bounds[1])*512;
      const g=c.createRadialGradient(x,y,0,x,y,210);g.addColorStop(0,i%2?'rgba(155,74,220,.88)':'rgba(28,200,190,.88)');g.addColorStop(.48,i%2?'rgba(149,101,222,.51)':'rgba(58,182,221,.52)');g.addColorStop(1,'rgba(80,160,220,0)');c.fillStyle=g;c.fillRect(x-210,y-210,420,420);
    }
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=true;
    const mat=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:.86,side:THREE.DoubleSide,depthWrite:false});
    for(const p of model.presentation_slab.footprints){const geo=flat(model,p),pos=geo.attributes.position,uv=[];
      for(let i=0;i<pos.count;i++){const x=pos.getX(i)*1000+model.registration.origin_wcs_mm[0],y=-pos.getZ(i)*1000+model.registration.origin_wcs_mm[1];uv.push((x-bounds[0])/(bounds[2]-bounds[0]),(y-bounds[1])/(bounds[3]-bounds[1]));}
      geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));const mesh=new THREE.Mesh(geo,mat);mesh.position.y=.09;mesh.renderOrder=6;group.add(mesh);
    }
  }
  isVisible(object){let node=object;while(node){if(!node.visible)return false;node=node.parent;}return true;}
  hits(e){const b=this.renderer.domElement.getBoundingClientRect();this.ndc.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);this.ray.setFromCamera(this.ndc,this.camera);return this.ray.intersectObjects(this.pickables.filter(o=>this.isVisible(o)),false);}
  pick(e){const down=this.down;this.down=null;if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5||e.button!==0)return;
    const hits=this.hits(e);if(!hits.length)return;let hit=hits[0];const near=hits.filter(h=>Math.abs(h.distance-hit.distance)<.1&&h.object.userData.kind==='region');
    if(hit.object.userData.kind==='region'&&near.length)hit=near.sort((a,b)=>a.object.userData.region.area_m2-b.object.userData.region.area_m2)[0];
    const d=hit.object.userData;
    if(d.kind==='camera')this.onCamera?.(d.camera);
    else{this.selectRegion(d.region.spatial_id);(d.kind==='event'?this.onEvent:this.onSelect)?.(d.region,d.model);}
  }
  hover(e){this.renderer.domElement.style.cursor=this.hits(e).length?'pointer':'grab';}
  selectRegion(id){for(const [key,mesh]of this.regionMeshes){const active=key===id;mesh.material.color.copy(active?new THREE.Color('#388abd'):mesh.userData.baseColor);mesh.material.opacity=active?.38:.12;mesh.userData.volume.material.color.copy(mesh.material.color);mesh.userData.volume.material.opacity=active?.12:.025;
    if(active&&!mesh.userData.outline){const line=new THREE.LineSegments(new THREE.EdgesGeometry(mesh.userData.volume.geometry,35),new THREE.LineBasicMaterial({color:'#276c9b',transparent:true,opacity:.65,depthWrite:false}));line.position.copy(mesh.userData.volume.position);mesh.parent.add(line);mesh.userData.outline=line;}
    if(mesh.userData.outline)mesh.userData.outline.visible=active;
  }this.selected=id;this.invalidate();}
  setOptions(options){this.options={...this.options,...options};const o=this.options;
    for(const {group,structure,zones,operations,model}of this.floorGroups.values()){
      group.visible=o.floorDisplay==='both'||model.floor_id===o.floorId;
      group.position.y=o.floorDisplay==='both'?(model.level-1)*(model.demo_height_defaults_mm.floor_spacing/1000+o.explode*10):0;
      structure.visible=o.layers.structure!==false;zones.visible=o.layers.zones!==false;
      for(const child of structure.children)if(child.userData.assetType)child.visible=o.assets?.[child.userData.assetType]!==false;
      operations.visible=Boolean(o.simulated);
      for(const [name,part]of Object.entries(operations.userData.parts))part.visible=Boolean(o.layers[name]);
    }this.invalidate();
  }
  fullBounds(){const b=new THREE.Box3();for(const {structure,group}of this.floorGroups.values()){if(group.visible){group.updateMatrixWorld(true);b.union(new THREE.Box3().setFromObject(structure));}}return b;}
  fit(isometric=true){
    const box=this.fullBounds(),center=box.getCenter(new THREE.Vector3());if(box.isEmpty())return;
    this.focusMotion=null;this.focusedRegion=null;this.controls.enableDamping=true;
    const direction=isometric?new THREE.Vector3(1,1,1).normalize():this.camera.position.clone().sub(this.controls.target).normalize();
    this.controls.target.copy(center);this.camera.position.copy(center).addScaledVector(direction,280);this.camera.lookAt(center);this.camera.updateMatrixWorld(true);
    const projected=new THREE.Box3();for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(this.camera.matrixWorldInverse));
    const size=projected.getSize(new THREE.Vector3()),aspect=Math.max(1,this.host.clientWidth)/Math.max(1,this.host.clientHeight);this.halfHeight=Math.max(size.y,size.x/aspect)*.57;
    const radius=Math.max(box.getSize(new THREE.Vector3()).length()*.6,35);this.sun.target.position.copy(center);this.sun.position.copy(center).add(new THREE.Vector3(-radius,radius*1.65,radius*.8));Object.assign(this.sun.shadow.camera,{left:-radius,right:radius,top:radius,bottom:-radius,near:1,far:radius*5});this.sun.shadow.camera.updateProjectionMatrix();
    this.camera.zoom=1;this.updateProjection();this.controls.update();this.onChange?.(100);this.invalidate();
  }
  updateProjection(){const aspect=Math.max(1,this.host.clientWidth)/Math.max(1,this.host.clientHeight),h=this.halfHeight||70;Object.assign(this.camera,{left:-h*aspect,right:h*aspect,top:h,bottom:-h});this.camera.updateProjectionMatrix();}
  onResize(){if(this.disposed)return;const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);this.renderer.setSize(w,h,false);this.updateProjection();this.fit(false);
    if(this.composer){this.composer.setSize(w,h);const ratio=this.renderer.getPixelRatio();this.ao.setSize(Math.round(w*ratio*.65),Math.round(h*ratio*.65));this.ao.enabled=w>=520;}
    this.invalidate();}
  focusRegion(id){
    const mesh=this.regionMeshes.get(id);if(!mesh||!this.isVisible(mesh))return false;
    mesh.parent.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(mesh.userData.volume),center=box.getCenter(new THREE.Vector3()),direction=this.camera.position.clone().sub(this.controls.target).normalize();
    const probe=this.camera.clone();probe.position.copy(center).addScaledVector(direction,280);probe.lookAt(center);probe.updateMatrixWorld(true);
    const projected=new THREE.Box3();for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(probe.matrixWorldInverse));
    const size=projected.getSize(new THREE.Vector3()),zoom=THREE.MathUtils.clamp(Math.min((this.camera.right-this.camera.left)/Math.max(size.x,1),(this.camera.top-this.camera.bottom)/Math.max(size.y,1))*.74,1,10);
    this.focusedRegion=id;this.controls.enableDamping=false;this.focusMotion={start:performance.now(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:420,fromPosition:this.camera.position.clone(),toPosition:probe.position.clone(),fromTarget:this.controls.target.clone(),toTarget:center,fromZoom:this.camera.zoom,toZoom:zoom};this.invalidate();return true;
  }
  projectedBounds(){const box=this.fullBounds(),points=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])points.push(new THREE.Vector3(x,y,z).project(this.camera));return {minX:Math.min(...points.map(v=>v.x)),maxX:Math.max(...points.map(v=>v.x)),minY:Math.min(...points.map(v=>v.y)),maxY:Math.max(...points.map(v=>v.y))};}
  zoom(factor){this.camera.zoom=THREE.MathUtils.clamp(this.camera.zoom/factor,.3,24);this.camera.updateProjectionMatrix();this.onChange?.(Math.round(this.camera.zoom*100));this.invalidate();}
  orbit(angle){const p=this.camera.position.clone().sub(this.controls.target).applyAxisAngle(new THREE.Vector3(0,1,0),angle);this.camera.position.copy(this.controls.target).add(p);this.controls.update();this.invalidate();}
  setExplode(amount){this.setOptions({explode:amount});this.fit(false);}
  projectRegion(id){const mesh=this.regionMeshes.get(id);if(!mesh||!this.isVisible(mesh))return null;const d=mesh.userData,p=xy(d.model,d.region.label_wcs_mm),v=new THREE.Vector3(p[0],.1,-p[1]);mesh.parent.localToWorld(v);v.project(this.camera);const b=this.renderer.domElement.getBoundingClientRect();return {x:b.left+(v.x+1)*b.width/2,y:b.top+(1-v.y)*b.height/2};}
  getDiagnostics(){return {ready:!this.disposed,engine:'Three.js r'+THREE.REVISION,renderCalls:this.renderer.info.render.calls,triangles:this.renderer.info.render.triangles,visibleFloors:[...this.floorGroups].filter(([,f])=>f.group.visible).map(([id])=>id),
    selectedSpatialId:this.selected,cameraPosition:this.camera.position.toArray(),cameraTarget:this.controls.target.toArray(),zoom:this.camera.zoom,simulated:this.options?.simulated,explode:this.options?.explode,
    focusedRegionId:this.focusedRegion||null,focusAnimating:Boolean(this.focusMotion),fitBoundsNDC:this.projectedBounds(),
    rendering:{ambientOcclusion:this.ao?.enabled?'SSAO':this.ao?'OFF_COMPACT_VIEW':'UNAVAILABLE',aoSamples:16,environment:'RoomEnvironment',shadowMapSize:this.sun.shadow.mapSize.x,pixelRatio:this.renderer.getPixelRatio(),wallColor:this.wallMaterial.color.getHexString(),columnColor:this.columnMaterial.color.getHexString(),glassColor:this.glassMaterial.color.getHexString(),glassOpacity:this.glassMaterial.opacity,slabColor:this.slabMaterial.color.getHexString()},
    floorY:Object.fromEntries([...this.floorGroups].map(([id,f])=>[id,f.group.position.y])),
    activeOperations:Object.fromEntries(['activity','heatmap','trajectories','experience','events','cameras','coverage'].map(name=>[name,[...this.floorGroups.values()].filter(f=>f.group.visible&&f.operations.visible&&f.operations.userData.parts[name].visible).length])),
    activeAssets:Object.fromEntries(['walls','columns','glazing','stairs','slabs'].map(name=>[name,[...this.floorGroups.values()].filter(f=>f.group.visible&&f.structure.visible).reduce((a,f)=>a+f.structure.children.filter(c=>c.userData.assetType===name&&c.visible).length,0)])),
    regions:[...this.regionMeshes].filter(([,m])=>this.isVisible(m)).map(([id,m])=>({id,floor_id:m.userData.model.floor_id,area_m2:m.userData.region.area_m2,volumeHeight:m.userData.volume.geometry.boundingBox.max.y-m.userData.volume.geometry.boundingBox.min.y,volumeProvenance:m.userData.volume.userData.vertical_provenance}))};}
  invalidate(){if(this.disposed||this.frame)return;this.frame=requestAnimationFrame(t=>this.draw(t));}
  draw(t){this.frame=null;if(this.disposed)return;
    if(this.focusMotion){const f=this.focusMotion,p=f.duration?Math.max(0,Math.min(1,(t-f.start)/f.duration)):1,ease=1-Math.pow(1-p,3);this.camera.position.lerpVectors(f.fromPosition,f.toPosition,ease);this.controls.target.lerpVectors(f.fromTarget,f.toTarget,ease);this.camera.zoom=THREE.MathUtils.lerp(f.fromZoom,f.toZoom,ease);this.updateProjection();this.onChange?.(Math.round(this.camera.zoom*100));if(p===1){this.focusMotion=null;this.controls.enableDamping=true;}}
    const changed=this.controls.update();const animate=this.options?.simulated&&this.options?.layers.trajectories;
    const unitsPerPixel=(this.camera.top-this.camera.bottom)/this.camera.zoom/Math.max(1,this.host.clientHeight);
    for(const label of this.screenLabels){const w=label.userData.labelPixels*unitsPerPixel;label.scale.set(w,w/(label.userData.labelAspect||4),1);if(label.userData.floorLabel)label.visible=this.host.clientWidth>=520&&(this.options?.floorDisplay==='single'||this.options?.explode>.15);}
    if(animate)for(const d of this.demoCurves)d.dot.position.copy(d.curve.getPointAt((t/24000+d.offset)%1));
    this.renderer.info.reset();
    if(this.composer){this.ao.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix);this.ao.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse);this.composer.render();}else this.renderer.render(this.scene,this.camera);
    if(changed||animate||this.focusMotion)this.invalidate();
  }
  destroy(){this.disposed=true;cancelAnimationFrame(this.frame);this.abort.abort();this.resize.disconnect();this.controls.dispose();
    const geometries=new Set(),materials=new Set(),textures=new Set();this.scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v);}});
    geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());
    this.composer?.passes.forEach(p=>p.dispose?.());this.ao?.ssaoMaterial.dispose();this.ao?.noiseTexture.dispose();this.composer?.dispose();this.environmentTarget?.dispose();
    this.renderer.dispose();this.renderer.forceContextLoss();this.renderer.domElement.remove();
  }
}

export function createSpatialScene(host,options){return new SpatialScene(host,options);}
