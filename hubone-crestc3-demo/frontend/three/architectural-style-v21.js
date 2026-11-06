/* Instance-local presentation only. CAD meshes, floor transforms and source data are untouched. */
import * as THREE from 'three';

export const ARCHITECTURAL_STYLE = Object.freeze({
  wall:'#f5f3ee', column:'#d7dad6', slab:'#e4e6e4', glass:'#bbd6dc',
  metal:'#344047', roof:'#c5c9c6', edge:'#6e7c80', ground:'#eeefec',
  selection:'#c9473e'
});

// The inherited glazing is made of vertical rectangular CAD panes. Diagonal edges
// here are triangulation artifacts, not mullions. Retain the old display object and
// derive a deduplicated line buffer; never alter the pane's geometry or CAD segments.
function glazingEdges(geometry){
  const a=geometry.getAttribute('position'),positions=[],seen=new Set();
  let diagonals=0,duplicates=0;
  for(let i=0;i<a.count;i+=2){
    const p=[a.getX(i),a.getY(i),a.getZ(i)],q=[a.getX(i+1),a.getY(i+1),a.getZ(i+1)];
    if(Math.abs(p[1]-q[1])>1e-5&&Math.hypot(p[0]-q[0],p[2]-q[2])>1e-5){diagonals++;continue;}
    const key=[p,q].map(v=>v.map(n=>Math.round(n*10000)).join(',')).sort().join('|');
    if(seen.has(key)){duplicates++;continue;}
    seen.add(key);positions.push(...p,...q);
  }
  const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  return {geometry:result,input:a.count/2,retained:positions.length/6,diagonals,duplicates};
}

export function applyArchitecturalStyle(view){
  const palette=ARCHITECTURAL_STYLE,scene=view.scene,exterior=scene.getObjectByName('V21_PDF_REFERENCE_ENVELOPE');
  const context=scene.getObjectByName('V21_ILLUSTRATIVE_CONTEXT'),opening=scene.getObjectByName('CAD_OPENING_AUDIT');
  const featureLines=[],slabEdges=[],cadEdges=[],openingLines=opening.children,statistics=[];
  view.wallMaterial.color.set(palette.wall);Object.assign(view.wallMaterial,{roughness:.9,metalness:.01});
  view.columnMaterial.color.set(palette.column);Object.assign(view.columnMaterial,{roughness:.88,metalness:.015});
  view.slabMaterial.color.set(palette.slab);Object.assign(view.slabMaterial,{roughness:.95,metalness:0});
  view.glassMaterial.color.set(palette.glass);Object.assign(view.glassMaterial,{roughness:.24,metalness:.025,clearcoat:.35,clearcoatRoughness:.3});
  view.cadLineMaterial.color.set(palette.edge);
  for(const [id,f]of view.floorGroups){
    for(const object of [...f.structure.children]){
      if(!object.isLineSegments)continue;
      if(object.userData.assetType==='glazing'){
        const derived=glazingEdges(object.geometry);const {geometry,...counts}=derived;statistics.push({floor_id:id,...counts});
        const line=new THREE.LineSegments(derived.geometry,new THREE.LineBasicMaterial({color:palette.edge,transparent:true,opacity:.12,depthWrite:false}));
        line.name='ARCHITECTURAL_GLAZING_EDGES';line.userData={...object.userData,renderOnly:true,floor_id:id,source:'EXISTING_CAD_PANE_DISPLAY_EDGES'};
        f.structure.add(line);featureLines.push(line);cadEdges.push(object);
      }else if(object.userData.assetType==='slabs')slabEdges.push(object);
    }
    // These are the inherited attachment points; analytics remain disabled.
    f.operations.userData.attachment={floor_id:id,coordinate_frame:f.model.coordinate_system,unit:'mm',
      registration:f.model.registration,surface_source:'space-v21-data/surfaces.json',walking_surface_verified:false};
  }
  exterior.traverse(o=>{
    if(!o.isMesh)return;
    const m=o.material;if(!m?.color||m.map)return;
    if(o.name==='PDF_GLASS_FACADES'){m.color.set(palette.glass);Object.assign(m,{opacity:.36,roughness:.24,metalness:.025,clearcoat:.35});}
    else if(o.name==='PDF_BLACK_FRAME_GEOMETRY'){m.color.set(palette.metal);Object.assign(m,{roughness:.66,metalness:.18});}
    else if(o.name==='PDF_REFERENCE_SLOPED_ROOF'){m.color.set(palette.roof);m.roughness=.95;}
    else if(o.name==='PDF_STOREFRONT_FASCIA')m.color.set('#6c6c63');
    else m.color.set(palette.wall);
  });
  const roofEdges=exterior.getObjectByName('PDF_ROOF_EDGES');roofEdges.material.color.set(palette.edge);roofEdges.material.opacity=.12;
  context.traverse(o=>{
    if(o.isLineSegments){o.material.color.set('#ccd1ce');o.material.opacity=.13;}
    if(!o.isMesh)return;
    if(o.geometry.type==='PlaneGeometry')o.material.color.set(o.geometry.parameters.height===8?'#e1e4e1':palette.ground);
    else if(o.name==='SIMULATED_TREE_CROWNS')o.material.color.set('#c1c9bf');
    else if(o.name==='SIMULATED_TREE_TRUNKS')o.material.color.set('#a9b0a5');
    else if(o.name==='SIMULATED_PLANTERS')o.material.color.set('#d0d4ce');
  });
  scene.background.setRGB(2.75,2.78,2.8);view.renderer.toneMappingExposure=.94;scene.environmentIntensity=.16;
  scene.traverse(o=>{
    if(o.isHemisphereLight){o.color.set('#ffffff');o.groundColor.set('#cbc9c2');o.intensity=.75;}
    else if(o.isAmbientLight)o.intensity=.18;
    else if(o.isDirectionalLight&&!o.castShadow){o.color.set('#f1f6f8');o.intensity=.5;}
  });
  view.sun.color.set('#fff9ef');view.sun.intensity=2.65;
  Object.assign(view.sun.shadow,{normalBias:.09,bias:-.00035,radius:4});
  if(view.ao){view.ao.kernelRadius=1.4;view.ao.minDistance=.000035;view.ao.maxDistance=.0045;}

  // A single static light volume covers all floor positions. Moving the slider must
  // not move the sun, resize its shadow projection or change the shadow texel scale.
  scene.updateMatrixWorld(true);
  const shadowBounds=new THREE.Box3().setFromObject(exterior);
  for(const [id,f]of view.floorGroups){
    const b=new THREE.Box3().setFromObject(f.structure);shadowBounds.union(b);
    if(id==='floor_2')shadowBounds.union(b.clone().translate(new THREE.Vector3(0,view.getDiagnostics().presentation.maxSeparationM,0)));
  }
  shadowBounds.union(new THREE.Box3().setFromObject(context));
  const center=shadowBounds.getCenter(new THREE.Vector3()),distance=shadowBounds.getSize(new THREE.Vector3()).length()*1.8;
  const sunPosition=center.clone().addScaledVector(new THREE.Vector3(-.65,1.8,.9).normalize(),distance);
  function stabilizeShadows(){
    view.sun.position.copy(sunPosition);view.sun.target.position.copy(center);
    scene.updateMatrixWorld(true);view.sun.shadow.updateMatrices(view.sun);
    const camera=view.sun.shadow.camera,projected=new THREE.Box3();
    for(const x of [shadowBounds.min.x,shadowBounds.max.x])for(const y of [shadowBounds.min.y,shadowBounds.max.y])for(const z of [shadowBounds.min.z,shadowBounds.max.z])projected.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
    const margin=4;Object.assign(camera,{left:projected.min.x-margin,right:projected.max.x+margin,
      bottom:projected.min.y-margin,top:projected.max.y+margin,near:Math.max(.1,-projected.max.z-margin),far:-projected.min.z+margin});
    camera.updateProjectionMatrix();view.sun.shadow.needsUpdate=true;
  }
  stabilizeShadows();
  let detail=0;
  function update(){
    const overview=view.getPresentation().mode==='overview';
    const unitsPerPixel=(view.camera.top-view.camera.bottom)/view.camera.zoom/Math.max(1,view.host.clientHeight);
    detail=THREE.MathUtils.smoothstep(1/Math.max(unitsPerPixel,.001),7,28);
    for(const line of cadEdges)line.material.opacity=0;
    for(const line of featureLines)line.material.opacity=overview?0:THREE.MathUtils.lerp(.06,.3,detail);
    for(const line of slabEdges){line.material.color.set(palette.edge);line.material.opacity=THREE.MathUtils.lerp(.07,.19,detail);}
    view.cadLineMaterial.opacity=THREE.MathUtils.lerp(.13,.48,detail);
    view.glassMaterial.opacity=overview?.13:.25;
    for(const line of openingLines){line.material.color.set(palette.edge);line.material.opacity=THREE.MathUtils.lerp(.18,.48,detail);}
  }
  update();
  return {update,stabilizeShadows,diagnostics:()=>({profile:'ARCHITECTURAL_ANALYSIS',sharedPalette:palette,
    edgeDetail:detail,glazingEdges:statistics,sourceMeshGeometryMutated:false,
    overviewDuplicateCadGlazingEdgesSuppressed:true,shadowPolicy:'STATIC_FULL_SLIDER_ENVELOPE',
    shadowBounds:{min:shadowBounds.min.toArray(),max:shadowBounds.max.toArray()},
    analyticsDeveloped:false,physicalMobileVerified:false})};
}
