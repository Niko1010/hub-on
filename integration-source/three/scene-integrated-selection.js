import * as THREE from 'three';
import {createSpatialScene as createOriginalScene} from './scene.js';
export {demoForRegion} from './scene.js';
const STYLE={graphite:'#39444b',region:'#aeb8bc',selection:'#c9473e'};
export function createSpatialScene(host,options){
  const view=createOriginalScene(host,options);
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

  return view;
}
