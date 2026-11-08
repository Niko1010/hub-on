import corridors from '../visitor-flow-data/route-corridors.json';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=n=>{n=clamp(n,0,1);return n*n*(3-2*n);};

// Widths are derived from whole swept CAD polygons, never from screen coordinates.
export function createFlowCorridor(route){
  const sections=new Map(corridors.segments.map(s=>[s.segment_id,s]));
  const legs=route.legs.map(leg=>({...leg,corridor:sections.get(leg.segment.id)?.legs.find(c=>c.leg_index===leg.segment.points.indexOf(leg.a))}));
  function width(leg,t){
    const c=leg.corridor;
    if(!c||!(leg.segment.particle_enabled??leg.segment.enabled))return {left:0,right:0};
    const index=Math.max(0,c.windows.findIndex(w=>t<=w.t1+1e-10)),w=c.windows[index];
    if(!w)return {left:0,right:0};
    const a=c.windows[index-1]||w,b=c.windows[index+1]||w,u=clamp((t-w.t0)/(w.t1-w.t0),0,1);
    // Adjacent minima prevent discontinuous lane jumps and stay inside each certified window.
    const edge=smooth(Math.min(t,1-t)*c.length_m/.7);
    const side=key=>(Math.min(a[key],w[key])*(1-u)+Math.min(b[key],w[key])*u)*edge;
    return {left:side('left_m'),right:side('right_m')};
  }
  function sample(progress,lateral=0,widthScale=1){
    const distance=clamp(progress,0,1)*route.totalWeightedLength;
    const leg=legs.find(l=>distance<=l.end)||legs.at(-1),t=clamp((distance-leg.start)/leg.weight,0,1);
    const q=route.sample(progress),space=width(leg,t),normal=leg.corridor?.normal_cad_xy||[0,0];
    const offset=clamp(lateral,-1,1)*clamp(widthScale,0,1)*(lateral<0?space.right:space.left);
    q.position.x+=normal[0]*offset;q.position.z-=normal[1]*offset;
    return {...q,lateralOffset:offset,clearance:space,flowLeg:leg};
  }
  return {sample,width,legs,source:corridors.source||'SIMULATED',maxWidth:1.8};
}
