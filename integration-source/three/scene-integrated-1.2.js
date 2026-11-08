/* Controlled spatial upgrade: V2.1 structure + approved colors, integrated renderer retained. */
import * as THREE from 'three';
import {createSpatialScene as createV21} from './scene-v21.js';
export {demoForRegion} from './scene.js';

const COLORS=Object.freeze({walls:'#f1f0e8',slabs:'#e7e8e4',columns:'#dfe2dd',glazing:'#b7c7cf'});
const ROLE={walls:'wallMaterial',slabs:'slabMaterial',columns:'columnMaterial',glazing:'glassMaterial'};
const EXTERIOR={PDF_WHITE_WALLS:'#f3f1eb',PDF_GLASS_FACADES:'#b7cdd2',PDF_BLACK_FRAME_GEOMETRY:'#3e494d',
  PDF_REFERENCE_SLOPED_ROOF:'#b4bcc2',PDF_GABLE_END_INFILL:'#f3f1eb'};

export function createSpatialScene(host,options){
  const view=createV21(host,options);
  // Apply to the materials already attached to the actual CAD meshes, after construction.
  for(const f of view.floorGroups.values())for(const mesh of f.structure.children){
    if(!mesh.isMesh||!COLORS[mesh.userData.assetType])continue;
    const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    for(const material of materials){
      if(!material.isMeshStandardMaterial)throw new Error('Unexpected CAD material: '+material.type);
      if(material.vertexColors||mesh.geometry.hasAttribute('color'))throw new Error('CAD vertex colors require explicit review');
      material.color.set(COLORS[mesh.userData.assetType]);
    }
  }
  for(const [name,color]of Object.entries(EXTERIOR)){
    const mesh=view.scene.getObjectByName(name);if(!mesh?.material?.color)throw new Error('Missing approved envelope material: '+name);
    mesh.material.color.set(color);
  }
  // Preserve legacy light color/intensity, exposure, PMREM and AO. Only the shadow
  // frustum must enclose the approved larger slider travel; keep its light transform fixed.
  const sunPosition=view.sun.position.clone(),sunTarget=view.sun.target.position.clone();
  const bounds=new THREE.Box3().setFromObject(view.scene.getObjectByName('V21_PDF_REFERENCE_ENVELOPE'));
  for(const [id,f]of view.floorGroups){const box=new THREE.Box3().setFromObject(f.structure);bounds.union(box);
    if(id==='floor_2')bounds.union(box.clone().translate(new THREE.Vector3(0,view.getDiagnostics().presentation.maxSeparationM,0)));}
  function stabilizeShadowFrustum(){
    view.sun.position.copy(sunPosition);view.sun.target.position.copy(sunTarget);view.scene.updateMatrixWorld(true);
    view.sun.shadow.updateMatrices(view.sun);
    const camera=view.sun.shadow.camera,projected=new THREE.Box3();
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])
      projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
    const pad=4;Object.assign(camera,{left:projected.min.x-pad,right:projected.max.x+pad,
      bottom:projected.min.y-pad,top:projected.max.y+pad,near:Math.max(.1,-projected.max.z-pad),far:-projected.min.z+pad});
    camera.updateProjectionMatrix();view.sun.shadow.needsUpdate=true;
  }
  const fit=view.fit.bind(view),draw=view.draw.bind(view),diagnostics=view.getDiagnostics.bind(view);
  view.fit=(...args)=>{fit(...args);stabilizeShadowFrustum();};
  function audit(){
    const lights=[];view.scene.traverse(o=>{if(o.isLight)lights.push({type:o.type,color:'#'+o.color.getHexString(),intensity:o.intensity,
      groundColor:o.groundColor?'#'+o.groundColor.getHexString():null});});
    return {version:'Integrated Demo 1.2',presentation:view.getPresentation(),
      camera:{position:view.camera.position.toArray(),target:view.controls.target.toArray(),zoom:view.camera.zoom},
      meshes:[...view.floorGroups].flatMap(([floor,f])=>f.structure.children.filter(m=>m.isMesh&&COLORS[m.userData.assetType]).map(mesh=>{
        const m=mesh.material;return {floor,assetType:mesh.userData.assetType,color:'#'+m.color.getHexString(),type:m.type,
          boundToRoleMaterial:m===view[ROLE[mesh.userData.assetType]],roughness:m.roughness,metalness:m.metalness,
          opacity:m.opacity,transparent:m.transparent,vertexColors:m.vertexColors,hasVertexColorAttribute:mesh.geometry.hasAttribute('color'),
          maps:Object.fromEntries(['map','aoMap','lightMap','normalMap'].map(k=>[k,Boolean(m[k])])),
          attributes:Object.fromEntries(Object.entries(mesh.geometry.attributes).map(([k,v])=>[k,{count:v.count,itemSize:v.itemSize}])),
          floorY:f.group.position.y,visible:mesh.visible&&f.group.visible};})),
      exterior:Object.keys(EXTERIOR).map(name=>{const m=view.scene.getObjectByName(name).material;return {name,color:'#'+m.color.getHexString(),type:m.type,roughness:m.roughness,metalness:m.metalness,opacity:m.opacity};}),
      lighting:{lights,exposure:view.renderer.toneMappingExposure,outputColorSpace:view.renderer.outputColorSpace,
        toneMapping:view.renderer.toneMapping,environmentIntensity:view.scene.environmentIntensity,
        ao:view.ao?{kernelRadius:view.ao.kernelRadius,minDistance:view.ao.minDistance,maxDistance:view.ao.maxDistance,enabled:view.ao.enabled}:null,
        shadow:{position:view.sun.position.toArray(),target:view.sun.target.position.toArray(),mapSize:view.sun.shadow.mapSize.toArray(),
          normalBias:view.sun.shadow.normalBias,bias:view.sun.shadow.bias,radius:view.sun.shadow.radius,
          frustum:['left','right','top','bottom','near','far'].map(k=>view.sun.shadow.camera[k])}}};
  }
  const enabled=typeof location!=='undefined'&&new URLSearchParams(location.search).get('materialAudit')==='1';
  let previous='';
  view.draw=t=>{draw(t);if(enabled){const data=JSON.stringify(audit());if(data!==previous){previous=data;console.debug('HUBONE_INTEGRATED_AUDIT '+data);}}};
  view.getDiagnostics=()=>({...diagnostics(),integrated:audit()});
  stabilizeShadowFrustum();view.invalidate();return view;
}
