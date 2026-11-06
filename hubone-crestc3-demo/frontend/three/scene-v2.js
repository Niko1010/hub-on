/* Stage-one presentation adapter. The original renderer and CAD model stay unchanged. */
import * as THREE from 'three';
import {createSpatialScene as createOriginalScene} from './scene.js';
export {demoForRegion} from './scene.js';

const STYLE = Object.freeze({
  wall:'#e9e7e2', column:'#cfceca', glass:'#b6d5dc', slab:'#d8dad7',
  graphite:'#39444b', region:'#aeb8bc', selection:'#c9473e'
});

export function createSpatialScene(host, options) {
  const view=createOriginalScene(host,options);
  view.wallMaterial.color.set(STYLE.wall);
  Object.assign(view.wallMaterial,{roughness:.83,metalness:.01});
  view.columnMaterial.color.set(STYLE.column);
  Object.assign(view.columnMaterial,{roughness:.8,metalness:.02});
  view.glassMaterial.color.set(STYLE.glass);
  Object.assign(view.glassMaterial,{opacity:.29,roughness:.19,metalness:.08,clearcoat:.65,clearcoatRoughness:.22});
  view.slabMaterial.color.set(STYLE.slab);
  view.cadLineMaterial.color.set(STYLE.graphite);
  view.cadLineMaterial.opacity=.58;

  // A neutral architectural studio; these are rendering settings, not building attributes.
  view.scene.environmentIntensity=.09;
  view.scene.background.setRGB(2.26,2.23,2.17);
  view.scene.traverse(object=>{
    if(object.isHemisphereLight){object.color.set('#ffffff');object.groundColor.set('#b3afa5');object.intensity=.65;}
    else if(object.isAmbientLight)object.intensity=.16;
    else if(object.isDirectionalLight&&!object.castShadow){object.color.set('#e8edf1');object.intensity=.5;}
    if(object.isMesh&&object.material?.isMeshBasicMaterial&&!object.userData.kind&&!object.parent?.userData.model&&object.geometry?.type==='PlaneGeometry')object.material.color.copy(view.scene.background);
    if(object.material?.isShadowMaterial){object.material.color.set('#646a70');object.material.opacity=.23;}
  });
  view.sun.color.set('#fff7ec');view.sun.intensity=3.0;
  view.sun.shadow.radius=3.5;
  if(view.ao){view.ao.kernelRadius=1.05;view.ao.maxDistance=.003;}

  for(const {structure} of view.floorGroups.values()) {
    for(const child of [...structure.children]) {
      if(child.isLineSegments){child.material.color.set('#727c80');child.material.opacity=.27;}
      if(child.isMesh&&child.userData.assetType==='glazing') {
        // Trace existing CAD-derived pane edges only. No new mullion locations or sizes.
        const edges=new THREE.LineSegments(new THREE.EdgesGeometry(child.geometry,35),
          new THREE.LineBasicMaterial({color:STYLE.graphite,transparent:true,opacity:.36,depthWrite:false}));
        edges.userData={assetType:'glazing',presentationOnly:true,
          provenance:'CAD_DERIVED_RENDER_EDGES; metalwork dimensions are not surveyed'};
        structure.add(edges);
      }
    }
  }

  // Red encodes user selection only. It does not claim consumer activity or occupancy.
  for(const mesh of view.regionMeshes.values())mesh.userData.baseColor.set(STYLE.region);
  const originalSelect=view.selectRegion.bind(view);
  view.selectRegion=id=>{
    originalSelect(id);
    for(const [key,mesh] of view.regionMeshes) {
      const selected=key===id;
      mesh.material.color.set(selected?STYLE.selection:STYLE.region);
      mesh.material.opacity=selected?.27:.035;
      mesh.userData.volume.material.color.copy(mesh.material.color);
      mesh.userData.volume.material.opacity=selected?.085:0;
      if(mesh.userData.outline){mesh.userData.outline.material.color.set(STYLE.selection);mesh.userData.outline.material.opacity=.55;}
    }
    view.invalidate();
  };
  view.selectRegion(null);

  const originalDiagnostics=view.getDiagnostics.bind(view);
  view.getDiagnostics=()=>({...originalDiagnostics(),presentation:{version:'V2',stage:1,
    style:'ARCHITECTURAL_STUDY',selectionColor:STYLE.selection,selectionMeaning:'USER_SELECTION_ONLY',
    newBuildingGeometry:false,measuredMetalwork:false,baseRenderer:'UNMODIFIED_V0.4',
    facadeEdgeSource:'EXISTING_CAD_DERIVED_GLAZING',surveyedHeights:false}});
  view.renderer.domElement.dataset.spacePresentation='v2-stage1';
  view.invalidate();
  return view;
}
