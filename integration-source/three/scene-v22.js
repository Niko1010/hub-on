/* New overlay only; the frozen Integrated 1.2 adapter owns all scene infrastructure. */
import {createSpatialScene as createBaselineScene} from './scene-integrated-1.2.js';
import {createSpatialLayerManager} from './spatial-layer-manager-v22.js';
import {createExperienceAreaOverlay} from './experience-area-overlay-v22.js';
export {demoForRegion} from './scene-integrated-1.2.js';

export function createSpatialScene(host,options){
  const view=createBaselineScene(host,options),layers=createSpatialLayerManager(view);
  layers.add('experience',createExperienceAreaOverlay(view));
  const draw=view.draw.bind(view),diagnostics=view.getDiagnostics.bind(view),destroy=view.destroy.bind(view);
  view.setExperienceArea=options=>layers.set('experience',options);
  view.getSpatialLayers=()=>layers.diagnostics();
  view.getDiagnostics=()=>({...diagnostics(),spatialLayers:layers.diagnostics()});
  const audit=typeof location!=='undefined'&&new URLSearchParams(location.search).get('layerAudit')==='1';
  let previous='';
  view.draw=t=>{draw(t);if(audit){const snapshot=JSON.stringify({presentation:view.getPresentation(),layers:layers.diagnostics()});
    if(snapshot!==previous){previous=snapshot;console.debug('HUBONE_V22_AUDIT '+snapshot);}}};
  view.destroy=()=>{layers.dispose();destroy();};
  view.invalidate();return view;
}
