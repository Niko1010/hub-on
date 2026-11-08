/* Product additions share the frozen Integrated 1.3 renderer, CAD and draw lifecycle. */
import {createSpatialScene as createIntegrated} from './scene-integrated-1.3.js';
import {createVisitorRoute} from './visitor-route.js';
import {createVisitorFlowLayer} from './visitor-flow-layer.js';
import {createVisitorAnalytics} from './visitor-analytics-layer.js';
import {createVisitorSimulation} from '../operations/visitor-simulation.js';
import cameras from '../space-v23-data/cameras.json';
export {demoForRegion} from './scene-integrated-1.3.js';
let sceneSequence=0;

export function createSpatialScene(host,options){
  const view=createIntegrated(host,options),route=createVisitorRoute(view);
  view.renderer.domElement.dataset.productSceneInstance='integrated-product-'+(++sceneSequence);
  const routeReady=route.segments.some(s=>s.particle_enabled??s.enabled);
  const fullRouteVerified=route.network.fullrouteReady===true;
  const simulation=createVisitorSimulation({initialMinute:120,routeResolver:p=>route.sample(p)});
  const flow=createVisitorFlowLayer(view,route),analytics=createVisitorAnalytics(view,route,simulation);
  const state={enabled:false,floorFilter:'all'},draw=view.draw.bind(view),destroy=view.destroy.bind(view),diagnostics=view.getDiagnostics.bind(view);
  let previousTime=null,lastAudit='',lastAuditTime=0;
  const drawDurations=[];
  const routeNotice='CONFIRMED 仅指 CAD 投影通行检查通过，客流仍为 SIMULATED。入口使用已批准的右侧缺口；楼梯连接为 SIMULATED / UNVERIFIED，出口 ROUTE_PENDING。碰撞连接仅标记端点，不显示穿墙粒子；数值时钟继续，不能视为完整物理通路。';
  view.getVisitorFlow=()=>{const s=simulation.snapshot(),rendered=flow.diagnostics();return {...s,...state,routeReady,fullRouteVerified,routeMode:'PARTIAL_CONFIRMED_WITH_SIMULATED_CONNECTIONS',routeNotice,
    simulationTime:s.clockLabel,dailyCumulative:s.cumulativeAdmitted,floorCounts:s.floorOccupancy,
    displayParticleCount:state.enabled&&routeReady?rendered.visibleParticleCount:0,
    confirmedParticleCount:rendered.confirmedParticleCount,pendingParticleCount:rendered.pendingParticleCount,simulatedConnectionParticleCount:rendered.simulatedConnectionParticleCount,
    simulatedParticleCount:s.displayParticleCount,routeStatus:route.network.status,spatialMetricsVerified:false};};
  view.setVisitorFlow=(patch={})=>{
    const settings={};for(const k of ['intervalMinutes','dwellMinutes','speed','minutesPerRealSecond'])if(k in patch)settings[k]=Number(patch[k]);
    if(Object.keys(settings).length)simulation.configure(settings);
    if('enabled'in patch)state.enabled=Boolean(patch.enabled);
    if('floorFilter'in patch){if(!['all','floor_1','floor_2'].includes(patch.floorFilter))throw Error('Invalid visitor floor filter');state.floorFilter=patch.floorFilter;}
    if(patch.action==='reset')simulation.reset();
    if(patch.action==='seek'||'elapsedMinutes'in patch)simulation.seek(Number(patch.elapsedMinutes||0));
    if(patch.playing===false)simulation.pause();
    if(patch.playing===true&&routeReady)simulation.play();
    analytics.set({flowEnabled:state.enabled});previousTime=null;view.invalidate();return view.getVisitorFlow();
  };
  view.setAnalyticsLayers=patch=>analytics.set(patch);
  view.getAnalyticsLayers=()=>analytics.diagnostics();
  view.getFlowAnalytics=()=>{const s=simulation.snapshot(),a=analytics.diagnostics();return {...a,
    routeReady,fullRouteVerified,routeNotice,floorCounts:s.floorOccupancy,regionMetrics:s.regionMetrics,
    regions:a.regions.map(r=>({...r,...s.regionMetrics.find(m=>m.regionId===r.id)})),
    metricsStatus:fullRouteVerified?'SIMULATED':'PROVISIONAL_ROUTE_NOT_VALIDATED'};};
  view.getDeviceRecords=()=>cameras.items.map(c=>({...c,cameraId:c.camera_id,floorId:c.floor_id,status:'NOT_CONNECTED',visualization_version:'V2.3'}));
  view.focusCamera=id=>{
    const c=cameras.items.find(c=>c.camera_id===id);if(!c)return false;
    view.setPresentation({mode:'interior',floors:{floor_1:c.floor_id==='floor_1',floor_2:c.floor_id==='floor_2'}});
    view.setCameraLayers({markers:true,floors:{floor_1:true,floor_2:true}});
    view.scene.updateMatrixWorld(true);const target=route.world(c.floor_id,[c.x,c.y]);target.y+=c.mount_height_mm/1000;
    const delta=view.camera.position.clone().sub(view.controls.target);view.controls.target.copy(target);view.camera.position.copy(target).add(delta);
    view.camera.zoom=Math.max(view.camera.zoom,1.8);view.camera.updateProjectionMatrix();view.controls.update();
    view.onCamera?.({...c,visualization_version:'V2.3'});view.invalidate();return true;
  };
  view.getDiagnostics=()=>({...diagnostics(),visitorFlow:view.getVisitorFlow(),analytics:analytics.diagnostics(),
    productRendering:{sceneInstance:view.renderer.domElement.dataset.productSceneInstance,drawSamples:drawDurations.length,
      meanDrawMs:drawDurations.length?drawDurations.reduce((a,b)=>a+b,0)/drawDurations.length:null,maxDrawMs:drawDurations.length?Math.max(...drawDurations):null},
    visitorRoute:{source:'SIMULATED',partialPlaybackReady:routeReady,runnable:route.network.runtime_ready===true,fullRouteVerified,status:route.network.status,
      segments:route.segments.map(s=>({id:s.id,kind:s.kind,enabled:s.enabled,particleEnabled:s.particle_enabled,routeClass:s.route_class,markerOnly:s.markerOnly,pointCount:s.points.length})),
      blockedConnections:route.segments.filter(s=>!s.particle_enabled).map(s=>({id:s.id,status:s.status,collisions:s.validation?.collisions||[]})),particleRendering:flow.diagnostics()}});
  const audit=typeof location!=='undefined'&&new URLSearchParams(location.search).get('flowAudit')==='1';
  view.draw=t=>{
    const started=performance.now();
    const active=state.enabled&&routeReady&&simulation.snapshot().playing&&view.getPresentation().mode==='interior';
    if(active&&previousTime!==null)simulation.advance(Math.min(.1,Math.max(0,(t-previousTime)/1000)));
    previousTime=active?t:null;
    flow.update(routeReady?simulation.particles():[],{...state,enabled:state.enabled&&routeReady},simulation.snapshot());analytics.update();draw(t);
    drawDurations.push(performance.now()-started);if(drawDurations.length>120)drawDurations.shift();
    if(active)view.invalidate();
    if(audit&&(!active||t-lastAuditTime>1000)){const s=view.getVisitorFlow(),snapshot=JSON.stringify({...s,elapsedMinutes:Math.floor(s.elapsedMinutes),regionMetrics:undefined,
      sceneInstance:view.renderer.domElement.dataset.productSceneInstance,analytics:analytics.diagnostics(),renderedSamples:flow.diagnostics().samples,meanDrawMs:drawDurations.reduce((a,b)=>a+b,0)/drawDurations.length});
      if(snapshot!==lastAudit){lastAudit=snapshot;lastAuditTime=t;console.debug('HUBONE_FLOW_AUDIT '+snapshot);}}
  };
  view.destroy=()=>{flow.dispose();analytics.dispose();destroy();};view.invalidate();return view;
}
