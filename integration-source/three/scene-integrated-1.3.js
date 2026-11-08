/* V2.3 adds camera annotations to the frozen V2.2 factory; all scene infrastructure is inherited. */
import {createSpatialScene as createV22} from './scene-v22.js';
import {createSpatialLayerManager} from './spatial-layer-manager-v22.js';
import {createCameraLayer} from './camera-layer-v23.js';
export {demoForRegion} from './scene-v22.js';

export function createSpatialScene(host,options){
  const view=createV22(host,options),layers=createSpatialLayerManager(view),cameras=createCameraLayer(view);
  layers.add('cameras',cameras);
  const spatial=view.getSpatialLayers.bind(view),diagnostics=view.getDiagnostics.bind(view),draw=view.draw.bind(view),destroy=view.destroy.bind(view);
  const onCamera=view.onCamera,onSelect=view.onSelect;
  view.onCamera=c=>{if(c.visualization_version==='V2.3')cameras.select(c.camera_id);onCamera?.(c);};
  view.onSelect=(...args)=>{cameras.select(null);onSelect?.(...args);};
  view.setCameraLayers=options=>layers.set('cameras',options);
  view.getSpatialLayers=()=>({...spatial(),...layers.diagnostics()});
  view.getDiagnostics=()=>{const data=diagnostics();return {...data,integrated:{...data.integrated,version:'Integrated Demo 1.3'},spatialLayers:view.getSpatialLayers()};};
  const audit=typeof location!=='undefined'&&new URLSearchParams(location.search).get('cameraAudit')==='1';
  let previous='';
  view.draw=t=>{cameras.update();draw(t);if(audit){const snapshot=JSON.stringify({presentation:view.getPresentation(),layers:view.getSpatialLayers()});
    if(snapshot!==previous){previous=snapshot;console.debug('HUBONE_V23_AUDIT '+snapshot);}}};
  view.destroy=()=>{layers.dispose();destroy();};
  view.invalidate();return view;
}
