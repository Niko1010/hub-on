/* Presentation context only; no camera, consumer or other analytical data. */
import * as THREE from 'three';
import {merged} from './building-envelope-v21.js';

export function buildContext(site,envelope){
  const group=new THREE.Group();group.name='V21_ILLUSTRATIVE_CONTEXT';group.userData={spatial_id:site.spatial_id,input_origin:'SIMULATED'};
  const [x0,y0,x1,y1]=site.bounds_local_xy_m,[bx0,by0,bx1,by1]=envelope.bounds_local_xy_m;
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,y1-y0),new THREE.MeshStandardMaterial({color:'#e5e4df',roughness:.97,metalness:0}));
  ground.rotation.x=-Math.PI/2;ground.position.set((x0+x1)/2,-.28,-(y0+y1)/2);ground.receiveShadow=true;group.add(ground);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,8),new THREE.MeshStandardMaterial({color:'#d0d3d1',roughness:.95}));road.rotation.x=-Math.PI/2;road.position.set((x0+x1)/2,-.27,-by0+16);road.receiveShadow=true;group.add(road);
  const positions=[];
  for(let x=x0;x<x1;x+=3)positions.push(x,-.268,-by0,x,-.268,-by0+11.8);
  for(let z=-by0;z<-by0+12;z+=3)positions.push(x0,-.268,z,x1,-.268,z);
  const grid=new THREE.BufferGeometry();grid.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  group.add(new THREE.LineSegments(grid,new THREE.LineBasicMaterial({color:'#d0d3ce',transparent:true,opacity:.5})));
  const planters=[],trunks=[],leaves=[];
  for(let i=0;i<7;i++){
    const x=bx0+10+(bx1-bx0-20)*i/6,z=-by0+8.4;
    planters.push(new THREE.BoxGeometry(2.4,.45,1.5).translate(x,-.05,z));
    trunks.push(new THREE.CylinderGeometry(.1,.15,2.5,7).translate(x,1.1,z));
    leaves.push(new THREE.SphereGeometry(1.05,7,5).scale(.9,1.25,.9).translate(x,2.8,z));
  }
  const p=merged(group,planters,new THREE.MeshStandardMaterial({color:'#b6bcb6',roughness:.95}),'SIMULATED_PLANTERS');
  const t=merged(group,trunks,new THREE.MeshStandardMaterial({color:'#8e9389',roughness:1}),'SIMULATED_TREE_TRUNKS');
  const l=merged(group,leaves,new THREE.MeshStandardMaterial({color:'#a4ada1',roughness:.96}),'SIMULATED_TREE_CROWNS');
  for(const m of [p,t,l])m.userData.source_kind='ILLUSTRATIVE_CONTEXT';
  return group;
}
