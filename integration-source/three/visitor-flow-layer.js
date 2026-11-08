import * as THREE from 'three';
import {createVisitorMotion} from './visitor-flow-motion.js';
import {createFlowCorridor} from './visitor-flow-corridor.js';

// All three visual layers use the existing floor groups and draw loop.
export function createVisitorFlowLayer(view,route){
  const capacity=512,resources=new Set(),groups=new Map(),bands=[];
  const own=r=>{resources.add(r);return r;};
  const corridor=createFlowCorridor(route),motion=createVisitorMotion(route);
  const material=own(new THREE.ShaderMaterial({transparent:true,depthTest:true,depthWrite:false,toneMapped:false,
    uniforms:{pixelRatio:{value:view.renderer.getPixelRatio()}},
    vertexShader:`attribute float opacity;attribute float size;attribute float angle;attribute float glint;
      varying float vAlpha;varying float vAngle;varying float vGlint;uniform float pixelRatio;
      void main(){vAlpha=opacity;vAngle=angle;vGlint=glint;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=size*pixelRatio;}`,
    fragmentShader:`varying float vAlpha;varying float vAngle;varying float vGlint;void main(){
      vec2 p=gl_PointCoord-vec2(.5);float c=cos(vAngle),s=sin(vAngle);p=mat2(c,-s,s,c)*p;
      float d=length(p*vec2(2.,3.2));if(d>1.)discard;
      vec3 color=mix(vec3(.008,.22,.34),vec3(.08,.56,.68),vGlint);
      gl_FragColor=vec4(color,vAlpha*(1.-smoothstep(.1,1.,d)));}`}));
  const wakeMaterial=own(new THREE.ShaderMaterial({transparent:true,depthTest:true,depthWrite:false,toneMapped:false,
    vertexShader:`attribute float opacity;varying float alpha;void main(){alpha=opacity;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying float alpha;void main(){gl_FragColor=vec4(.035,.49,.62,alpha);}`}));
  const bandMaterial=own(new THREE.ShaderMaterial({transparent:true,depthTest:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false,
    uniforms:{time:{value:0},spread:{value:.7},intensity:{value:.15}},
    vertexShader:`attribute vec3 offset;attribute vec3 flowCoord;varying vec3 flow;
      uniform float spread;void main(){flow=flowCoord;gl_Position=projectionMatrix*modelViewMatrix*vec4(position+offset*spread,1.);}`,
    fragmentShader:`varying vec3 flow;uniform float time;uniform float intensity;void main(){
      float edge=pow(max(0.,1.-flow.y*flow.y),.8);
      float softWave=.7+.18*sin(flow.x*.8-time*1.8)+.12*sin(flow.x*1.9+flow.y*2.8-time*2.7);
      float channel=.72+.28*sin(flow.y*4.3+flow.x*.11-time*.18);
      vec3 color=mix(vec3(.008,.25,.36),vec3(.02,.43,.55),softWave*.45);
      gl_FragColor=vec4(color,intensity*edge*(.92+.08*softWave)*(.95+.05*channel)*flow.z);}`}));
  const dynamicGeometry=(vertices,attributes)=>{const g=own(new THREE.BufferGeometry());
    for(const [name,size]of attributes)g.setAttribute(name,new THREE.BufferAttribute(new Float32Array(vertices*size),size).setUsage(THREE.DynamicDrawUsage));
    g.setDrawRange(0,0);return g;};
  const attach=(object,id,suffix)=>{object.name='SIMULATED_VISITOR_FLOW_'+id+suffix;object.frustumCulled=false;object.renderOrder=12;
    object.userData={source:'SIMULATED',aoExcluded:true,layer:'visitor-flow',floor_id:id};
    (id==='stairs'?view.scene:view.floorGroups.get(id).group).add(object);};
  for(const id of ['floor_1','floor_2','stairs']){
    const geometry=dynamicGeometry(capacity,[['position',3],['opacity',1],['size',1],['angle',1],['glint',1]]);
    const points=new THREE.Points(geometry,material);attach(points,id,'');
    const wakeGeometry=dynamicGeometry(capacity*12,[['position',3],['opacity',1]]),wake=new THREE.LineSegments(wakeGeometry,wakeMaterial);attach(wake,id,'_wake');
    groups.set(id,{points,geometry,wake,wakeGeometry,count:0,wakeCount:0});
  }
  for(const leg of corridor.legs){
    if(!leg.corridor||leg.from!==leg.to||!(leg.segment.particle_enabled??leg.segment.enabled))continue;
    const positions=[],offsets=[],coords=[],indices=[],length=leg.corridor.length_m;
    const steps=Math.max(2,Math.ceil(length/.4)),cuts=new Set(Array.from({length:steps+1},(_,i)=>i/steps));
    for(const w of leg.corridor.windows){cuts.add(w.t0);cuts.add(w.t1);}
    const samples=[...cuts].sort((a,b)=>a-b),normal=leg.corridor.normal_cad_xy;
    samples.forEach((t,index)=>{
      const p=(leg.start+leg.weight*t)/route.totalWeightedLength,q=route.sample(Math.min(1,p+(t===0?1e-12:0))),width=corridor.width(leg,t);
      const center=route.local(leg.from,leg.a).lerp(route.local(leg.to,leg.b),t);
      for(const side of [-1,0,1]){
        const span=side<0?width.right:width.left;
        positions.push(center.x,.12,center.z);offsets.push(normal[0]*side*span,0,-normal[1]*side*span);
        coords.push(p*route.totalWeightedLength,side,q.transitionAlpha);
      }
      if(index)for(let side=0;side<2;side++){const a=(index-1)*3+side,b=index*3+side;indices.push(a,b,a+1,b,b+1,a+1);}
    });
    const geometry=own(new THREE.BufferGeometry());geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    geometry.setAttribute('offset',new THREE.Float32BufferAttribute(offsets,3));geometry.setAttribute('flowCoord',new THREE.Float32BufferAttribute(coords,3));geometry.setIndex(indices);
    const mesh=new THREE.Mesh(geometry,bandMaterial);attach(mesh,leg.from,'_band');mesh.renderOrder=11;bands.push({mesh,floorId:leg.from,phase:leg.segment.id});
  }
  let visibleCount=0,pendingCount=0,confirmedCount=0,simulatedConnectionCount=0,heads=[],density={},elapsed=0;
  const show=(sample,filter)=>sample.enabled&&(filter==='all'||filter===sample.floorId)&&view.floorGroups.get(sample.floorId).group.visible&&(!sample.stair||[sample.fromFloorId,sample.toFloorId].every(id=>view.floorGroups.get(id).group.visible));
  function update(statisticalParticles,state,snapshot){
    const visual=snapshot?motion.sample(snapshot):{particles:statisticalParticles,density:{widthScale:0}};
    density=visual.density;elapsed=snapshot?.elapsedMinutes||0;
    view.scene.updateMatrixWorld(true);visibleCount=0;pendingCount=0;confirmedCount=0;simulatedConnectionCount=0;heads=[];
    const enabled=state.enabled&&view.getPresentation().mode==='interior',widthScale=density.widthScale??.75;
    bandMaterial.uniforms.time.value=elapsed;bandMaterial.uniforms.spread.value=widthScale;
    bandMaterial.uniforms.intensity.value=.78+.12*({low:.2,medium:.6,high:1}[density.level]??.5);
    for(const b of bands)b.mesh.visible=enabled&&Boolean(snapshot?.currentOccupancy)&&show({enabled:true,floorId:b.floorId},state.floorFilter);
    for(const g of groups.values()){g.count=0;g.wakeCount=0;g.points.visible=enabled;g.wake.visible=enabled;}
    if(enabled)for(const p of visual.particles){
      const seed=p.lateralSeed??0,lane=seed+(snapshot ? .08*Math.sin(elapsed*.65+(p.phaseSeed??seed*19)) : 0);
      const head=corridor.sample(p.progress,lane,widthScale);
      if(!head.enabled){pendingCount++;continue;}
      const alpha=(p.alpha??1)*head.transitionAlpha;
      if(!show(head,state.floorFilter)||alpha<.01)continue;
      const g=groups.get(head.stair?'stairs':head.floorId);if(g.count>=capacity)continue;
      visibleCount++;if(head.routeClass==='CONFIRMED')confirmedCount++;else simulatedConnectionCount++;
      const n=g.count++,attrs=g.geometry.attributes;
      attrs.position.setXYZ(n,...head.position.toArray());attrs.opacity.setX(n,Math.min(1,(p.alpha??1)*1.65)*head.transitionAlpha);attrs.size.setX(n,(p.size??3.6)*1.18);attrs.glint.setX(n,p.highlight?1:0);
      const ahead=corridor.sample(Math.min(1,p.progress+.0001),lane,widthScale),world=head.position.clone(),forward=ahead.position.clone();
      if(!head.stair){view.floorGroups.get(head.floorId).group.localToWorld(world);view.floorGroups.get(head.floorId).group.localToWorld(forward);}
      world.project(view.camera);forward.project(view.camera);attrs.angle.setX(n,Math.atan2(forward.y-world.y,forward.x-world.x));
      heads.push({particleId:p.particleId||p.id,floorId:head.floorId,phase:head.phase,progress:p.progress,alpha,local:head.position.toArray(),lateralOffset:head.lateralOffset,size:p.size??3.6,highlight:Boolean(p.highlight)});
      if(p.highlight){
        let previous=head;
        for(let tail=1;tail<=5;tail++){
          const q=corridor.sample(Math.max(0,p.progress-tail*(p.trailStep??.00014)),lane,widthScale);
          if(!show(q,state.floorFilter)||q.phase!==head.phase||q.flowLeg!==head.flowLeg)break;
          const wa=g.wakeGeometry.attributes;
          for(const [point,fade]of [[previous,1-(tail-1)/5],[q,1-tail/5]]){
            const k=g.wakeCount++;wa.position.setXYZ(k,...point.position.toArray());wa.opacity.setX(k,alpha*.25*fade);
          }previous=q;
        }
      }
    }
    for(const g of groups.values())for(const [geometry,count]of [[g.geometry,g.count],[g.wakeGeometry,g.wakeCount]]){
      geometry.setDrawRange(0,count);for(const a of Object.values(geometry.attributes))a.needsUpdate=true;}
  }
  const sampleDiagnostics=h=>{const world=view.floorGroups.get(h.floorId).group.localToWorld(new THREE.Vector3(...h.local)),p=world.clone().project(view.camera),rect=view.host.getBoundingClientRect();return {...h,world:world.toArray(),screen:{x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2},renderable:view.isVisible(groups.get(h.floorId).points)};};
  return {update,diagnostics:()=>({source:'SIMULATED',visualOnly:true,visibleParticleCount:visibleCount,pendingParticleCount:pendingCount,confirmedParticleCount:confirmedCount,simulatedConnectionParticleCount:simulatedConnectionCount,particleRepresentsPeople:null,density,
    note:'Continuous visual emission is an abstract density display; operational counts remain in the unchanged batch simulation.',samples:heads.slice(0,12).map(sampleDiagnostics),
    bands:bands.map(b=>({floorId:b.floorId,phase:b.phase,visible:b.mesh.visible,parentIsFloorGroup:b.mesh.parent===view.floorGroups.get(b.floorId).group})),
    groups:[...groups].map(([id,g])=>({floorId:id,vertexCount:g.count,wakeVertexCount:g.wakeCount,parentIsFloorGroup:id==='stairs'?null:g.points.parent===view.floorGroups.get(id).group,visible:g.points.visible}))}),
    dispose(){for(const g of groups.values()){g.points.removeFromParent();g.wake.removeFromParent();}for(const b of bands)b.mesh.removeFromParent();for(const r of resources)r.dispose();}};
}
