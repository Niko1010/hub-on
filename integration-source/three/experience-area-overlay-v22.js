import * as THREE from 'three';
import data from '../space-v22-data/experience-areas.json';

export function createExperienceAreaOverlay(view){
  const groups=new Map(),meshes=[],resources=new Set();
  const state={enabled:true,floors:{floor_1:true,floor_2:true}};
  const fill=new THREE.MeshBasicMaterial({color:'#50c5cd',transparent:true,opacity:.5,
    side:THREE.DoubleSide,depthTest:true,depthWrite:false,toneMapped:false,
    polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  const edge=new THREE.LineBasicMaterial({color:'#499da6',transparent:true,opacity:.46,
    depthTest:true,depthWrite:false,toneMapped:false});
  resources.add(fill);resources.add(edge);
  for(const area of data.areas){
    const floor=view.floorGroups.get(area.floor_id);
    if(!floor)throw new Error('Experience area missing registered floor: '+area.floor_id);
    let group=groups.get(area.floor_id);
    if(!group){group=new THREE.Group();group.name='V22_SIMULATED_EXPERIENCE_'+area.floor_id;
      group.position.y=.045;group.userData={layer:'experience-v22',floor_id:area.floor_id,status:'SIMULATED',aoExcluded:true};
      floor.group.add(group);groups.set(area.floor_id,group);}
    const origin=floor.model.registration.origin_wcs_mm;
    const xy=p=>new THREE.Vector2((p[0]-origin[0])/1000,(p[1]-origin[1])/1000);
    area.footprints.forEach((p,index)=>{
      const shape=new THREE.Shape(p.outer.map(xy));
      for(const hole of p.holes)shape.holes.push(new THREE.Path(hole.map(xy)));
      const geometry=new THREE.ShapeGeometry(shape).rotateX(-Math.PI/2);resources.add(geometry);
      const mesh=new THREE.Mesh(geometry,fill);mesh.name=area.id+':'+index;mesh.renderOrder=3;
      mesh.userData={layer:'experience-v22',area_id:area.id,floor_id:area.floor_id,status:'SIMULATED',
        businessBoundaryVerified:false,walkingSurfaceVerified:false,aoExcluded:true};
      // Do not register as a pickable: the existing CAD Inspector remains authoritative.
      group.add(mesh);meshes.push(mesh);
      for(const ring of [p.outer,...p.holes]){
        const points=ring.map(q=>{const v=xy(q);return new THREE.Vector3(v.x,.008,-v.y);});
        const lineGeometry=new THREE.BufferGeometry().setFromPoints(points);resources.add(lineGeometry);
        const line=new THREE.LineLoop(lineGeometry,edge);line.renderOrder=4;line.userData.aoExcluded=true;group.add(line);
      }
    });
  }
  function set(options){
    if('enabled' in options)state.enabled=Boolean(options.enabled);
    if(options.floors)for(const id of groups.keys())if(id in options.floors)state.floors[id]=Boolean(options.floors[id]);
    for(const [id,group]of groups)group.visible=state.enabled&&state.floors[id];
  }
  set(state);
  return {set,
    diagnostics(){view.scene.updateMatrixWorld(true);return {
      status:data.status,businessBoundaryVerified:false,walkingSurfaceVerified:false,
      enabled:state.enabled,floors:{...state.floors},constraintSha256:data.constraint_sha256,
      color:'#'+fill.color.getHexString(),opacity:fill.opacity,depthTest:fill.depthTest,depthWrite:fill.depthWrite,
      polygonOffset:fill.polygonOffset,localElevationM:.045,
      areas:data.areas.map(a=>({id:a.id,floor:a.floor_id,status:a.status,displayAreaM2:a.display_area_m2,sourceRegionIds:a.source_region_ids})),
      groups:[...groups].map(([id,g])=>({floor:id,parentIsFloorGroup:g.parent===view.floorGroups.get(id).group,
        localPosition:g.position.toArray(),worldPosition:g.getWorldPosition(new THREE.Vector3()).toArray(),
        visible:g.visible&&view.floorGroups.get(id).group.visible,meshCount:g.children.filter(x=>x.isMesh).length})),
      meshCount:meshes.length,triangles:meshes.reduce((n,m)=>n+m.geometry.index.count/3,0)
    };},
    dispose(){for(const group of groups.values())group.removeFromParent();for(const resource of resources)resource.dispose();groups.clear();meshes.length=0;resources.clear();}
  };
}
