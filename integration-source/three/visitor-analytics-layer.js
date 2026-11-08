import * as THREE from 'three';
import surfaces from '../space-v21-data/surfaces.json';
import experience from '../space-v22-data/experience-areas.json';

export function createVisitorAnalytics(view,route,simulation){
  const state={routes:false,heatmap:false,highlights:false,flowEnabled:false,timeWindowMinutes:30,selectedRegionId:null};
  const resources=new Set(),floors=new Map(),stairLines=[],pickers=[],screenLabels=[];
  const own=r=>{resources.add(r);return r;};
  const guideMaterial=own(new THREE.LineBasicMaterial({color:'#9c70bc',transparent:true,opacity:.55,depthTest:true,depthWrite:false,toneMapped:false}));
  const red=own(new THREE.LineBasicMaterial({color:'#b55269',transparent:true,opacity:.85,depthTest:true,depthWrite:false,toneMapped:false}));
  const focusFill=own(new THREE.MeshBasicMaterial({color:'#b55269',transparent:true,opacity:.055,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
  const amber=own(new THREE.MeshBasicMaterial({color:'#b98635',transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
  const pendingLine=own(new THREE.LineDashedMaterial({color:'#ba924e',transparent:true,opacity:.64,depthWrite:false,toneMapped:false,dashSize:1,gapSize:1}));
  const pendingRing=own(new THREE.RingGeometry(.55,.78,24).rotateX(-Math.PI/2));
  function geometry(floorId,footprint){
    const project=p=>{const q=route.local(floorId,p);return new THREE.Vector2(q.x,-q.z);};
    const shape=new THREE.Shape(footprint.outer.map(project));for(const h of footprint.holes||[])shape.holes.push(new THREE.Path(h.map(project)));
    return own(new THREE.ShapeGeometry(shape).rotateX(-Math.PI/2));
  }
  for(const [id,floor]of view.floorGroups){
    const group=new THREE.Group(),guides=new THREE.Group(),focus=new THREE.Group(),heat=new THREE.Group(),pending=new THREE.Group();
    group.name='SIMULATED_ANALYTICS_'+id;group.userData={aoExcluded:true,source:'SIMULATED'};group.add(guides,focus,heat,pending);floor.group.add(group);
    const centers=Array.from({length:32},()=>new THREE.Vector3(0,0,0));
    const material=own(new THREE.ShaderMaterial({transparent:true,depthTest:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
      uniforms:{centers:{value:centers}},vertexShader:`varying vec2 localXZ;void main(){localXZ=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec2 localXZ;uniform vec3 centers[32];void main(){float density=0.;for(int i=0;i<32;i++){vec2 d=localXZ-centers[i].xy;density+=centers[i].z*exp(-dot(d,d)/12.);}
        float level=1.-exp(-density*.26);if(level<.015)discard;vec3 color=mix(vec3(.24,.48,.85),vec3(.55,.30,.77),level);
        gl_FragColor=vec4(color,min(.54,level*.6));}`}));
    const addHeat=(footprints,areaId)=>{for(const footprint of footprints){const mesh=new THREE.Mesh(geometry(id,footprint),material);mesh.position.y=.16;mesh.renderOrder=7;mesh.userData={aoExcluded:true,areaId,source:'SIMULATED'};heat.add(mesh);}};
    addHeat(surfaces.floors[id].surfaces,null);
    for(const area of experience.areas.filter(a=>a.floor_id===id)){
      addHeat(area.footprints,area.id);
      for(const fp of area.footprints){
        const mesh=new THREE.Mesh(geometry(id,fp),focusFill);mesh.position.y=.18;mesh.renderOrder=8;
        const region={spatial_id:area.source_region_ids[0]||area.id,region_id:area.id,name:area.name+' · SIMULATED',floor_id:id,area_m2:area.display_area_m2,footprint:fp,source:'SIMULATED',simulated:true,experience_area_id:area.id};
        mesh.userData={kind:'region',region,model:floor.model,aoExcluded:true,layer:'focus-regions'};focus.add(mesh);pickers.push(mesh);view.pickables.push(mesh);
        for(const ring of [fp.outer,...fp.holes]){const line=new THREE.LineLoop(own(new THREE.BufferGeometry().setFromPoints(ring.map(p=>route.local(id,p).setY(.2)))),red);line.renderOrder=9;line.userData.aoExcluded=true;focus.add(line);}
      }
    }
    floors.set(id,{group,guides,focus,heat,pending,centers});
  }
  for(const segment of route.segments){
    if(segment.route_class==='SIMULATED'||segment.enabled===false){
      const stair=segment.kind==='stair';
      const floorId=stair?segment.fromFloorId:segment.floor_id;
      for(const [index,p]of [segment.points[0],segment.points.at(-1)].entries()){
        const id=stair?(index?segment.toFloorId:segment.fromFloorId):floorId;
        const ring=new THREE.Mesh(pendingRing,amber);ring.position.copy(route.local(id,p)).setY(.31);ring.userData={aoExcluded:true,source:'SIMULATED',status:segment.id==='EXIT'?'ROUTE_PENDING':'UNVERIFIED'};floors.get(id).pending.add(ring);
      }
      if(stair||segment.id==='EXIT'){
      const caption=segment.id==='EXIT'?'出口 · ROUTE_PENDING':(segment.id==='STAIR_UP'?'上行':'下行')+' · SIMULATED / UNVERIFIED';
      const canvas=document.createElement('canvas');canvas.width=640;canvas.height=64;const c=canvas.getContext('2d');
      c.fillStyle='rgba(255,249,231,.98)';c.fillRect(0,0,640,64);c.font='30px sans-serif';c.fillStyle='#573805';c.textAlign='center';c.textBaseline='middle';c.fillText(caption,320,32);
      const texture=own(new THREE.CanvasTexture(canvas));texture.colorSpace=THREE.SRGBColorSpace;
      const material=own(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false,toneMapped:false}));
      const label=new THREE.Sprite(material);label.scale.set(13,1.3,1);label.position.copy(route.local(floorId,segment.id==='EXIT'?segment.points.at(-1):segment.points[0])).add(new THREE.Vector3(0,1.25,0));label.userData={aoExcluded:true,labelPixels:220,labelAspect:10};label.renderOrder=18;floors.get(floorId).pending.add(label);view.screenLabels.push(label);screenLabels.push(label);
      }
    }
    if(segment.markerOnly||segment.enabled===false&&!(segment.kind==='stair'&&segment.particle_enabled))continue; // Pending connections have endpoints only, never an implied navigable line.
    const stair=segment.kind==='stair',geometry=own(new THREE.BufferGeometry().setFromPoints(segment.points.map((p,i)=>route.local(stair?(i?segment.toFloorId:segment.fromFloorId):segment.floor_id,p))));
    const line=new THREE.Line(geometry,stair?pendingLine:guideMaterial);if(stair)line.computeLineDistances();line.renderOrder=10;line.userData={aoExcluded:true,source:'SIMULATED'};
    if(stair){view.scene.add(line);stairLines.push({line,segment});}else floors.get(segment.floor_id).guides.add(line);
  }
  let lastHeat='',heatSamples=0;
  function heatUpdate(){
    const s=simulation.snapshot(),key=[Math.floor(s.elapsedMinutes),s.scenarioRevision,state.timeWindowMinutes,state.selectedRegionId].join(':');if(key===lastHeat)return;lastHeat=key;
    const bins=new Map([...floors.keys()].map(id=>[id,new Map()]));heatSamples=0;
    const window=Math.min(state.timeWindowMinutes,s.elapsedMinutes),samples=12;
    for(let n=0;n<samples;n++)for(const p of simulation.particlesAt(s.elapsedMinutes-window*(n+.5)/samples)){
      const q=route.sample(p.progress);if(!q.enabled||q.stair||(state.selectedRegionId&&q.regionId!==state.selectedRegionId))continue;
      const map=bins.get(q.floorId),x=Math.round(q.position.x/2.5)*2.5,z=Math.round(q.position.z/2.5)*2.5,k=x+','+z;
      const previous=map.get(k)||{x,z,weight:0};previous.weight+=p.representedPeople/samples/10;map.set(k,previous);heatSamples++;
    }
    for(const [id,f]of floors){const data=[...bins.get(id).values()].sort((a,b)=>b.weight-a.weight).slice(0,32);
      f.centers.forEach((v,i)=>v.set(data[i]?.x||0,data[i]?.z||0,data[i]?.weight||0));}
  }
  function update(){
    const interior=view.getPresentation().mode==='interior';
    for(const [id,f]of floors){f.group.visible=interior;f.guides.visible=state.routes;f.focus.visible=state.highlights;f.heat.visible=state.heatmap;f.pending.visible=state.routes||state.flowEnabled;
      for(const mesh of f.heat.children)mesh.visible=state.selectedRegionId?mesh.userData.areaId===state.selectedRegionId:mesh.userData.areaId===null;}
    for(const {line,segment}of stairLines){line.visible=interior&&(state.routes||state.flowEnabled)&&[segment.fromFloorId,segment.toFloorId].every(id=>view.floorGroups.get(id).group.visible);
      const a=route.world(segment.fromFloorId,segment.points[0]),b=route.world(segment.toFloorId,segment.points.at(-1));line.geometry.attributes.position.setXYZ(0,...a.toArray());line.geometry.attributes.position.setXYZ(1,...b.toArray());line.geometry.attributes.position.needsUpdate=true;line.geometry.computeBoundingSphere();line.computeLineDistances();}
    if(state.heatmap)heatUpdate();
  }
  function set(options){for(const k of ['routes','heatmap','highlights','flowEnabled'])if(k in options)state[k]=Boolean(options[k]);
    if('timeWindowMinutes'in options){if(![15,30,60,120].includes(Number(options.timeWindowMinutes)))throw Error('Unsupported heatmap time window');state.timeWindowMinutes=Number(options.timeWindowMinutes);}
    if('selectedRegionId'in options){const value=options.selectedRegionId;state.selectedRegionId=experience.areas.find(a=>a.id===value||a.source_region_ids.includes(value))?.id||null;}
    update();view.invalidate();}
  return {set,update,diagnostics:()=>({...state,source:'SIMULATED',verified:false,heatSamples,
    heatMethod:'12 time samples, 2.5m bins, 32 strongest kernels per floor; clipped to existing display slabs and holes, not a verified walkable map',
    regions:experience.areas.map(a=>({id:a.id,regionId:a.id,name:a.name,floorId:a.floor_id,sourceRegionIds:a.source_region_ids,source:'SIMULATED',verified:false}))}),
    dispose(){for(const f of floors.values())f.group.removeFromParent();for(const s of stairLines)s.line.removeFromParent();view.pickables=view.pickables.filter(p=>!pickers.includes(p));view.screenLabels=view.screenLabels.filter(p=>!screenLabels.includes(p));for(const r of resources)r.dispose();}};
}
