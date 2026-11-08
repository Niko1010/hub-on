/* Camera annotations only. No building geometry, renderer, lights or floor transforms are changed. */
import * as THREE from 'three';
import config from '../space-v23-data/cameras.json';
import coverage from '../space-v23-data/camera-coverage.json';

export function createCameraLayer(view){
  const state={markers:false,coverage:false,floors:{floor_1:true,floor_2:true}};
  const resources=new Set(),floors=new Map(),devices=new Map(),pickers=new Set();
  let selected=null;
  const own=r=>{resources.add(r);return r;};
  const bodyMaterial=own(new THREE.MeshStandardMaterial({color:'#c1819a',roughness:.72,metalness:.03}));
  const selectedBody=own(new THREE.MeshStandardMaterial({color:'#ad5c7d',roughness:.72,metalness:.03}));
  const lensMaterial=own(new THREE.MeshBasicMaterial({color:'#7c4059',toneMapped:false}));
  const arrowMaterial=own(new THREE.MeshBasicMaterial({color:'#b86687',toneMapped:false}));
  const selectedArrow=own(new THREE.MeshBasicMaterial({color:'#8c3156',toneMapped:false}));
  const anchorMaterial=own(new THREE.MeshBasicMaterial({color:'#c17e99',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false,toneMapped:false}));
  const guideMaterial=own(new THREE.LineBasicMaterial({color:'#ae7089',transparent:true,opacity:.35,depthWrite:false,toneMapped:false}));
  const selectedEdge=own(new THREE.LineBasicMaterial({color:'#9d4268',transparent:true,opacity:.9,depthWrite:false,toneMapped:false}));
  const fill=own(new THREE.MeshBasicMaterial({color:'#d895b0',transparent:true,opacity:.21,side:THREE.DoubleSide,
    depthTest:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));
  const boundary=own(new THREE.LineBasicMaterial({color:'#ba758f',transparent:true,opacity:.42,depthTest:true,depthWrite:false,toneMapped:false}));
  // Shared device geometry is illustrative. It is never merged into CAD meshes.
  const bodyGeometry=own(new THREE.BoxGeometry(1.55,.9,1.1));
  const lensGeometry=own(new THREE.CylinderGeometry(.29,.29,.48,12).rotateZ(-Math.PI/2));
  const shaftGeometry=own(new THREE.CylinderGeometry(.07,.07,2.1,8).rotateZ(-Math.PI/2));
  const headGeometry=own(new THREE.ConeGeometry(.34,.85,12).rotateZ(-Math.PI/2));
  const anchorGeometry=own(new THREE.CircleGeometry(.52,20).rotateX(-Math.PI/2));
  const selectionGeometry=own(new THREE.BufferGeometry().setFromPoints(Array.from({length:40},(_,i)=>new THREE.Vector3(Math.cos(i/40*Math.PI*2)*1.25,.16,Math.sin(i/40*Math.PI*2)*1.25))));
  const metadata=c=>({kind:'camera',camera:c,layer:'cameras-v23',camera_id:c.camera_id,floor_id:c.floor_id,aoExcluded:true});
  for(const [id,f]of view.floorGroups){
    const points=new THREE.Group(),fans=new THREE.Group();
    points.name='V23_CAMERA_POINTS_'+id;fans.name='V23_CAMERA_COVERAGE_'+id;
    points.userData={layer:'camera-points-v23',floor_id:id};fans.userData={layer:'camera-coverage-v23',floor_id:id};
    points.visible=fans.visible=false;f.group.add(points,fans);floors.set(id,{points,fans,floor:f});
  }
  for(const source of config.items){
    const c={...source,visualization_version:'V2.3'},f=floors.get(c.floor_id);
    if(!f)throw new Error('Camera has no registered floor: '+c.camera_id);
    const origin=f.floor.model.registration.origin_wcs_mm;
    const local=p=>new THREE.Vector2((p[0]-origin[0])/1000,(p[1]-origin[1])/1000);
    const p=local([c.x,c.y]),anchor=new THREE.Group(),mount=new THREE.Group();
    anchor.name=c.camera_id;anchor.position.set(p.x,0,-p.y);f.points.add(anchor);
    mount.position.y=c.mount_height_mm/1000;mount.rotation.y=c.direction*Math.PI/180;anchor.add(mount);
    const body=new THREE.Mesh(bodyGeometry,bodyMaterial),lens=new THREE.Mesh(lensGeometry,lensMaterial);
    const shaft=new THREE.Mesh(shaftGeometry,arrowMaterial),head=new THREE.Mesh(headGeometry,arrowMaterial);
    lens.position.x=1.02;shaft.position.x=2.16;head.position.x=3.55;
    mount.add(body,lens,shaft,head);
    const dot=new THREE.Mesh(anchorGeometry,anchorMaterial);dot.position.y=.145;anchor.add(dot);
    const guideGeometry=own(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.15,0),new THREE.Vector3(0,c.mount_height_mm/1000,0)]));
    const guide=new THREE.Line(guideGeometry,guideMaterial);anchor.add(guide);
    const selection=new THREE.LineLoop(selectionGeometry,selectedEdge);selection.visible=false;anchor.add(selection);
    for(const mesh of [body,lens,shaft,head,dot]){mesh.userData={...metadata(c),model:f.floor.model};pickers.add(mesh);view.pickables.push(mesh);}
    anchor.traverse(o=>{if(o.isMesh||o.isLine){o.userData.aoExcluded=true;o.castShadow=false;o.receiveShadow=false;}});
    const fanGroup=new THREE.Group();fanGroup.name=c.camera_id+':FAN';f.fans.add(fanGroup);
    const fan=coverage.items.find(v=>v.camera_id===c.camera_id&&v.floor_id===c.floor_id);
    if(!fan)throw new Error('Camera coverage missing: '+c.camera_id);
    for(const footprint of fan.footprints){
      const shape=new THREE.Shape(footprint.outer.map(local));
      for(const ring of footprint.holes)shape.holes.push(new THREE.Path(ring.map(local)));
      const geometry=own(new THREE.ShapeGeometry(shape).rotateX(-Math.PI/2));
      const mesh=new THREE.Mesh(geometry,fill);mesh.position.y=.105;mesh.renderOrder=5;
      mesh.userData={layer:'camera-coverage-v23',camera_id:c.camera_id,floor_id:c.floor_id,source:'SIMULATED',verified:false,aoExcluded:true};
      fanGroup.add(mesh); // Intentionally not a pickable; preserve the CAD Inspector below.
      for(const ring of [footprint.outer,...footprint.holes]){
        const geo=own(new THREE.BufferGeometry().setFromPoints(ring.map(p=>{const v=local(p);return new THREE.Vector3(v.x,.117,-v.y);}))); 
        const line=new THREE.LineLoop(geo,boundary);line.renderOrder=6;line.userData.aoExcluded=true;fanGroup.add(line);
      }
    }
    devices.set(c.camera_id,{c,anchor,mount,body,shaft,head,selection,fanGroup});
  }
  function select(id,notify=false){
    if(id&&!devices.has(id))return;
    const previous=selected;selected=id;
    for(const [key,d]of devices){const active=key===id;d.body.material=active?selectedBody:bodyMaterial;
      d.shaft.material=d.head.material=active?selectedArrow:arrowMaterial;d.selection.visible=active;}
    if(previous&&!selected&&notify)view.host.dispatchEvent(new CustomEvent('hubone-v23-camera-clear',{bubbles:true}));
    view.invalidate();
  }
  function update(){
    const interior=view.getPresentation().mode==='interior';
    for(const [id,f]of floors){f.points.visible=interior&&state.markers&&state.floors[id];f.fans.visible=interior&&state.coverage&&state.floors[id];}
    const active=selected&&devices.get(selected);
    if(active&&!view.isVisible(active.body))select(null,true);
  }
  return {
    set(options){for(const key of ['markers','coverage'])if(key in options)state[key]=Boolean(options[key]);
      if(options.floors)for(const id of floors.keys())if(id in options.floors)state.floors[id]=Boolean(options.floors[id]);update();},
    update,select,
    diagnostics(){view.scene.updateMatrixWorld(true);const rect=view.host.getBoundingClientRect();return {
      source:'SIMULATED',verified:false,wallOcclusionModelled:false,realCoverageRate:null,selected,
      markers:state.markers,coverage:state.coverage,floors:{...state.floors},opacity:fill.opacity,
      depthTest:fill.depthTest,depthWrite:fill.depthWrite,coverageElevationM:.105,
      devices:[...devices.values()].map(d=>{const world=d.mount.getWorldPosition(new THREE.Vector3()),ndc=world.clone().project(view.camera),f=floors.get(d.c.floor_id);
        return {cameraId:d.c.camera_id,floor:d.c.floor_id,source:d.c.source,verified:d.c.verified,
          direction:d.c.direction,fov:d.c.field_of_view,rangeMm:d.c.range_mm,mountHeightMm:d.c.mount_height_mm,
          localPosition:d.mount.getWorldPosition(new THREE.Vector3()).applyMatrix4(f.floor.group.matrixWorld.clone().invert()).toArray(),
          worldPosition:world.toArray(),worldForward:new THREE.Vector3(1,0,0).applyQuaternion(d.mount.getWorldQuaternion(new THREE.Quaternion())).toArray(),
          pointsParentIsFloorGroup:f.points.parent===f.floor.group,coverageParentIsFloorGroup:f.fans.parent===f.floor.group,
          markerVisible:view.isVisible(d.body),coverageVisible:view.isVisible(d.fanGroup),
          screen:{x:rect.left+(ndc.x+1)*rect.width/2,y:rect.top+(1-ndc.y)*rect.height/2},
          coverageTriangles:d.fanGroup.children.filter(m=>m.isMesh).reduce((n,m)=>n+m.geometry.index.count/3,0)};})
    };},
    dispose(){for(const f of floors.values()){f.points.removeFromParent();f.fans.removeFromParent();}
      view.pickables=view.pickables.filter(o=>!pickers.has(o));for(const r of resources)r.dispose();
      resources.clear();pickers.clear();floors.clear();devices.clear();selected=null;}
  };
}
