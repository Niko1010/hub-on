/* Stage-one coordinator: existing renderer + independent architectural presentation groups. */
import * as THREE from 'three';
import {createSpatialScene as createV2Scene} from './scene-integrated-selection.js';
export {demoForRegion} from './scene.js';
import {buildEnvelope} from './building-envelope-v21.js';
import {buildContext} from './site-context-v21.js';
import surfaces from '../space-v21-data/surfaces.json';
import envelope from '../space-v21-data/envelope.json';
import site from '../space-v21-data/site.json';

export function createSpatialScene(host,options){
  const sourceModels=options.models;
  const models=sourceModels.map(m=>{
    const d=surfaces.floors[m.floor_id];
    return {...m,presentation_slab:{...m.presentation_slab,footprints:d.surfaces},
      regions:m.regions.filter(r=>d.region_picking_proxies[r.spatial_id]).map(r=>({...r,...d.region_picking_proxies[r.spatial_id]}))};
  });
  const view=createV2Scene(host,{...options,models});
  const root=new THREE.Group();root.name='V21_CAD_REGISTERED_BUILDING';view.scene.add(root);
  const internal=new THREE.Group();internal.name='ORIGINAL_CAD_INTERIORS';root.add(internal);
  for(const f of view.floorGroups.values())internal.add(f.group);
  const exterior=buildEnvelope(envelope);root.add(exterior);
  const context=buildContext(site,envelope);view.scene.add(context);
  // Remove only the original neutral studio ground in this opt-in instance.
  for(const child of view.scene.children){if(child.isMesh&&child.geometry?.type==='PlaneGeometry')child.visible=false;}
  const [x0,y0,x1,y1]=envelope.bounds_local_xy_m;
  const mode={mode:'overview',floors:{floor_1:true,floor_2:true},context:true,roof:true,separation:0};
  const normalFloorSpacing=envelope.display_parameters.floor_spacing_m;
  const legacyMaxSeparation=Math.max(44,((x1-x0)+(y1-y0))*.37)*1.25;
  const normalBuildingHeight=new THREE.Box3().setFromObject(exterior).getSize(new THREE.Vector3()).y;
  const maxSeparation=Math.max(legacyMaxSeparation*1.5,normalBuildingHeight*1.5); // Display offset only.
  const guides=new THREE.Group();guides.name='DISPLAY_REGISTRATION_GUIDES';root.add(guides);
  const openingHelpers=new THREE.Group();openingHelpers.name='CAD_OPENING_AUDIT';view.floorGroups.get('floor_2').group.add(openingHelpers);
  const origin=sourceModels.find(m=>m.floor_id==='floor_2').registration.origin_wcs_mm;
  for(const hole of surfaces.floors.floor_2.openings){
    for(const p of hole.footprints){
      const points=p.outer.map(v=>new THREE.Vector3((v[0]-origin[0])/1000,.08,-(v[1]-origin[1])/1000));
      const line=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#aa7a48',transparent:true,opacity:.72}));
      line.userData={floor_id:'floor_2',opening_id:hole.spatial_id,cad_handle:hole.source_handle};openingHelpers.add(line);
    }
  }
  const guideMaterial=new THREE.LineDashedMaterial({color:'#80909a',dashSize:1.1,gapSize:.9,transparent:true,opacity:.45});
  const guideGeometry=new THREE.BufferGeometry();guideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(12),3));guideGeometry.setAttribute('lineDistance',new THREE.Float32BufferAttribute(new Float32Array(4),1));
  const guide=new THREE.LineSegments(guideGeometry,guideMaterial);guides.add(guide);
  const baseSet=view.setOptions.bind(view),baseBounds=view.fullBounds.bind(view),baseDiagnostics=view.getDiagnostics.bind(view),baseDraw=view.draw.bind(view),baseFit=view.fit.bind(view),baseHits=view.hits.bind(view);
  const originalFloorLabels=[...view.screenLabels].filter(l=>l.userData.floorLabel);originalFloorLabels.forEach(l=>l.material.opacity=0);
  view.setOptions=o=>{baseSet(o);apply();};
  view.fullBounds=()=>{
    root.updateMatrixWorld(true);
    if(mode.mode==='overview')return new THREE.Box3().setFromObject(exterior);
    return baseBounds();
  };
  view.fit=isometric=>{
    if(isometric){
      const center=view.fullBounds().getCenter(new THREE.Vector3());
      const direction=(mode.mode==='overview'?new THREE.Vector3(1,1.05,1.65):new THREE.Vector3(.6,1.1,1.6)).normalize();
      view.controls.target.copy(center);view.camera.position.copy(center).addScaledVector(direction,280);view.camera.lookAt(center);
    }
    baseFit(false);
  };
  function apply(){
    exterior.visible=mode.mode==='overview';internal.visible=true;openingHelpers.visible=mode.mode!=='overview';context.visible=mode.context&&mode.mode==='overview';guides.visible=mode.mode==='interior'&&mode.separation>0&&mode.floors.floor_1&&mode.floors.floor_2;
    exterior.getObjectByName('PDF_REFERENCE_SLOPED_ROOF').visible=mode.roof;
    exterior.getObjectByName('PDF_ROOF_EDGES').visible=mode.roof;
    exterior.getObjectByName('PDF_GABLE_END_INFILL').visible=mode.roof;
    for(const [id,f]of view.floorGroups){
      const baseline=(f.model.level-1)*normalFloorSpacing;
      f.group.visible=mode.floors[id];f.group.position.y=baseline+(mode.mode==='interior'&&mode.separation>0?(f.model.level-1)*maxSeparation*mode.separation:0);
      f.operations.visible=Boolean(view.options?.simulated)&&mode.mode==='interior';
    }
    for(const line of openingHelpers.children)line.visible=mode.floors.floor_2;
    const y=view.floorGroups.get('floor_2').group.position.y;
    const points=[new THREE.Vector3(x0-2,0,-y0),new THREE.Vector3(x0-2,y,-y0),new THREE.Vector3(x1+2,0,-y1),new THREE.Vector3(x1+2,y,-y1)];
    const positions=guide.geometry.attributes.position;points.forEach((p,i)=>positions.setXYZ(i,p.x,p.y,p.z));positions.needsUpdate=true;
    guide.geometry.attributes.lineDistance.array.set([0,y,0,y]);guide.geometry.attributes.lineDistance.needsUpdate=true;
    view.invalidate();
  }
  view.setPresentation=update=>{
    const modeChanged=update.mode&&update.mode!==mode.mode;
    if(update.mode&&['overview','interior'].includes(update.mode))mode.mode=update.mode;
    if(update.floors)Object.assign(mode.floors,update.floors);
    for(const key of ['context','roof'])if(key in update)mode[key]=update[key];
    if('separation' in update)mode.separation=THREE.MathUtils.clamp(Number(update.separation)||0,0,1);
    if(mode.mode==='overview')mode.separation=0;
    apply();view.fit(Boolean(modeChanged));host.dispatchEvent(new CustomEvent('hubone-v21-change',{bubbles:true}));
  };
  view.setFloorSeparation=amount=>{
    const value=Number(amount);if(!Number.isFinite(value))return;
    mode.mode='interior';mode.separation=THREE.MathUtils.clamp(value,0,1);apply();
    // Continuously enclose the current geometry while retaining the user's viewing direction.
    // No model rebuild, incremental coordinate mutation, camera preset or delayed animation.
    view.focusMotion=null;view.focusedRegion=null;
    const damping=view.controls.enableDamping;view.controls.enableDamping=false;view.controls.update();
    const box=view.fullBounds();
    if(!box.isEmpty()){
      const direction=view.camera.position.clone().sub(view.controls.target).normalize(),center=box.getCenter(new THREE.Vector3());
      view.controls.target.copy(center);view.camera.position.copy(center).addScaledVector(direction,280);view.camera.lookAt(center);view.camera.updateMatrixWorld(true);
      const projected=new THREE.Box3();for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(view.camera.matrixWorldInverse));
      const size=projected.getSize(new THREE.Vector3()),aspect=Math.max(1,host.clientWidth)/Math.max(1,host.clientHeight);view.halfHeight=Math.max(size.y,size.x/aspect)*.57;
      view.camera.zoom=1;view.updateProjection();view.controls.update();view.onChange?.(100);
    }
    view.controls.enableDamping=damping;view.invalidate();host.dispatchEvent(new CustomEvent('hubone-v21-change',{bubbles:true}));
  };
  view.setExplode=view.setFloorSeparation; // Keep the original Demo slider input path.
  view.getPresentation=()=>({...mode,floors:{...mode.floors}});
  view.getFloorScreenAnchors=()=>{
    const b=host.getBoundingClientRect(),result={};
    for(const [id,f]of view.floorGroups){const p=new THREE.Vector3(x0,f.group.position.y+.1,-y0);p.project(view.camera);result[id]={x:(p.x+1)*b.width/2,y:(1-p.y)*b.height/2,visible:mode.mode!=='overview'&&f.group.visible};}
    return result;
  };
  view.getFloorProjectedBounds=()=>{
    const result={},rect=host.getBoundingClientRect();root.updateMatrixWorld(true);
    for(const [id,f]of view.floorGroups){
      const b=new THREE.Box3().setFromObject(f.structure),p=[];
      for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])p.push(new THREE.Vector3(x,y,z).project(view.camera));
      result[id]={left:(Math.min(...p.map(v=>v.x))+1)*rect.width/2,right:(Math.max(...p.map(v=>v.x))+1)*rect.width/2,
        top:(1-Math.max(...p.map(v=>v.y)))*rect.height/2,bottom:(1-Math.min(...p.map(v=>v.y)))*rect.height/2};
    }return result;
  };
  view.projectOpening=()=>{
    const h=surfaces.floors.floor_2.openings[0],ring=h.footprints[0].outer;
    const x=ring.reduce((n,p)=>n+p[0],0)/ring.length,z=ring.reduce((n,p)=>n+p[1],0)/ring.length;
    const p=new THREE.Vector3((x-origin[0])/1000,view.floorGroups.get('floor_2').group.position.y+.05,-(z-origin[1])/1000).project(view.camera),b=host.getBoundingClientRect();
    return {x:b.left+(p.x+1)*b.width/2,y:b.top+(1-p.y)*b.height/2};
  };
  view.focusOpening=()=>{
    view.setPresentation({mode:'interior',floors:{floor_1:false,floor_2:true}});
    const ring=surfaces.floors.floor_2.openings[0].footprints[0].outer;
    const xs=ring.map(p=>(p[0]-origin[0])/1000),zs=ring.map(p=>-(p[1]-origin[1])/1000);
    const target=new THREE.Vector3((Math.min(...xs)+Math.max(...xs))/2,view.floorGroups.get('floor_2').group.position.y,(Math.min(...zs)+Math.max(...zs))/2);
    const delta=view.camera.position.clone().sub(view.controls.target);view.controls.target.copy(target);view.camera.position.copy(target).add(delta);view.camera.zoom=3.1;view.updateProjection();view.controls.update();view.invalidate();
  };
  view.draw=t=>{baseDraw(t);host.dispatchEvent(new CustomEvent('hubone-v21-draw',{bubbles:true}));};
  view.hits=e=>mode.mode==='overview'?[]:baseHits(e); // Do not select CAD regions through an opaque roof.
  view.getDiagnostics=()=>({...baseDiagnostics(),presentation:{version:'V2.1',stage:1,mode:mode.mode,
    visibleInternalFloors:internal.visible?[...view.floorGroups].filter(([,f])=>f.group.visible).map(([id])=>id):[],
    envelopeVisible:exterior.visible,roofVisible:mode.roof,contextVisible:context.visible,contextStatus:'SIMULATED',
    facadeStatus:envelope.facade_status,heightStatus:'SIMULATED',sourceFloorIds:sourceModels.map(m=>m.floor_id),
    analyticsImplemented:false,displayExplodedOffsetM:mode.mode==='interior'?maxSeparation*mode.separation:0,
    separationProgress:mode.separation,maxSeparationM:maxSeparation,legacyMaxSeparationM:legacyMaxSeparation,normalBuildingHeightM:normalBuildingHeight,
    baselineFloorY:{floor_1:0,floor_2:normalFloorSpacing},cameraFraming:'CONTINUOUS_CURRENT_VIEW_FIT',
    registration:sourceModels.map(m=>({floor_id:m.floor_id,...m.registration})),
    openingAudit:surfaces.audit,openingSourceHandle:'189F',openingAreaM2:surfaces.floors.floor_2.openings[0].area_m2,
    flatSurfaceOverOpening:false,walkingSurfaceVerified:false,envelope:exterior.userData.statistics}});
  view.renderer.domElement.dataset.spacePresentation='v21-stage1';
  // Keep the integrated renderer lighting/exposure/AO configuration unchanged.
  apply();view.fit(true);view.invalidate();return view;
}
