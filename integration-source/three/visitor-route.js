/* CAD-coordinate itinerary. Image pixels are never used by the runtime. */
import * as THREE from 'three';
import network from '../visitor-flow-data/route-network.json';
import experiences from '../space-v22-data/experience-areas.json';

const inside=(p,ring)=>{let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;
}return yes;};
export function areaAt(floorId,p){return experiences.areas.find(a=>a.floor_id===floorId&&a.footprints.some(f=>inside(p,f.outer)&&!f.holes.some(h=>inside(p,h))))?.id||null;}

export function createVisitorRoute(view){
  const local=(id,p)=>{const o=view.floorGroups.get(id).model.registration.origin_wcs_mm;return new THREE.Vector3((p[0]-o[0])/1000,.24,-(p[1]-o[1])/1000);};
  const world=(id,p)=>view.floorGroups.get(id).group.localToWorld(local(id,p));
  const segments=(network.itinerarySegmentIds||network.segments.map(s=>s.id)).map(id=>network.segments.find(s=>s.id===id));
  const legs=[];let total=0;
  for(const segment of segments){
    if(!segment||segment.points.length<2)throw Error('Invalid visitor itinerary segment');
    for(let i=1;i<segment.points.length;i++){
      const a=segment.points[i-1],b=segment.points[i],from=segment.kind==='stair'?segment.fromFloorId:segment.floor_id,to=segment.kind==='stair'?segment.toFloorId:segment.floor_id;
      const la=local(from,a),lb=local(to,b),mid=a.map((v,k)=>(v+b[k])/2);
      const regionId=from===to?areaAt(from,mid):null;
      // Timing uses physical display height once, never the exploded presentation distance.
      const distance=from===to?la.distanceTo(lb):world(from,a).distanceTo(world(to,b));
      const weight=distance*(segment.dwellWeight||1)*(regionId?1.6:1)*(from===to?1:2);
      if(weight<=0)continue;
      legs.push({segment,a,b,from,to,regionId,start:total,end:total+weight,weight});total+=weight;
    }
  }
  if(!total)throw Error('Empty visitor route');
  const ranges=new Map(segments.map((s,i)=>{const items=legs.filter(l=>l.segment===s);return [s.id,{start:items[0].start,end:items.at(-1).end,
    fadeIn:i>0&&!(segments[i-1].particle_enabled??segments[i-1].enabled),fadeOut:i<segments.length-1&&!(segments[i+1].particle_enabled??segments[i+1].enabled)}];}));
  function sample(progress,worldSpace=false){
    const p=Math.max(0,Math.min(1,progress)),distance=p*total;
    const leg=legs.find(l=>distance<=l.end)||legs.at(-1),t=Math.max(0,Math.min(1,(distance-leg.start)/leg.weight));
    const stair=leg.from!==leg.to,floorId=stair?(t<.5?leg.from:leg.to):leg.from;
    const a=worldSpace||stair?world(leg.from,leg.a):local(leg.from,leg.a),b=worldSpace||stair?world(leg.to,leg.b):local(leg.to,leg.b);
    const position=a.lerp(b,t);
    const cad=stair?null:leg.a.map((v,i)=>v+(leg.b[i]-v)*t);
    const range=ranges.get(leg.segment.id),segmentProgress=(distance-range.start)/(range.end-range.start);
    const transitionAlpha=Math.max(0,Math.min(1,range.fadeIn?segmentProgress/.04:1,range.fadeOut?(1-segmentProgress)/.04:1));
    return {position,floorId,fromFloorId:leg.from,toFloorId:leg.to,stair,phase:leg.segment.id,
      enabled:leg.segment.particle_enabled??leg.segment.enabled!==false,
      routeClass:leg.segment.route_class||(leg.segment.enabled?'CONFIRMED':'SIMULATED'),legProgress:t,transitionAlpha,
      regionId:stair?null:areaAt(floorId,cad),cad,progress:p};
  }
  return {sample,segments,legs,local,world,network,totalWeightedLength:total};
}
