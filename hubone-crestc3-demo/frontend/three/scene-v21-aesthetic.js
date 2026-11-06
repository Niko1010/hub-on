/* Opt-in aesthetic adapter. Reuse the complete V2.1 model, controls and separation engine. */
import * as THREE from 'three';
import {createSpatialScene as createV21Scene} from './scene-v21.js';
import {applyArchitecturalStyle} from './architectural-style-v21.js';
export {demoForRegion} from './scene-v21.js';

export function createSpatialScene(host,options){
  const view=createV21Scene(host,options),style=applyArchitecturalStyle(view);
  const fit=view.fit.bind(view),draw=view.draw.bind(view),diagnostics=view.getDiagnostics.bind(view),projection=view.updateProjection.bind(view);
  // Also update display detail during the inherited focus animation, after its zoom
  // changes but before it renders. This avoids a one-frame lag in close-up edges.
  view.updateProjection=(...args)=>{projection(...args);style.update();};
  view.fit=isometric=>{
    if(isometric){
      const center=view.fullBounds().getCenter(new THREE.Vector3()),direction=new THREE.Vector3(.85,1.45,1.55).normalize();
      view.controls.target.copy(center);view.camera.position.copy(center).addScaledVector(direction,280);view.camera.lookAt(center);
    }
    fit(false);style.stabilizeShadows();style.update();
  };
  view.draw=t=>{style.update();draw(t);};
  view.getDiagnostics=()=>({...diagnostics(),aesthetic:style.diagnostics()});
  view.renderer.domElement.dataset.spacePresentation='v21-aesthetic-review';
  view.fit(true);view.invalidate();return view;
}
