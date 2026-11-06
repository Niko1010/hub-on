/* PDF-reference architectural envelope. CAD plan frame; vertical dimensions are SIMULATED. */
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export function span(a,b,y,height,thickness=.1){
  const dx=b[0]-a[0],dz=-(b[1]-a[1]),length=Math.hypot(dx,dz);
  return new THREE.BoxGeometry(length,height,thickness).rotateY(-Math.atan2(dz,dx)).translate((a[0]+b[0])/2,y+height/2,-(a[1]+b[1])/2);
}
export function merged(group,geometries,material,name,cast=true){
  if(!geometries.length)return;
  const prepared=geometries.map(g=>g.index?g.toNonIndexed():g),geometry=mergeGeometries(prepared,false);
  new Set([...geometries,...prepared]).forEach(g=>g.dispose());
  const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.castShadow=cast;mesh.receiveShadow=true;
  mesh.userData={presentationOnly:true,input_origin:'SIMULATED',source_kind:'PDF_REFERENCE',physical_dimensions_verified:false};group.add(mesh);return mesh;
}
export function buildEnvelope(data){
  const group=new THREE.Group();group.name='V21_PDF_REFERENCE_ENVELOPE';
  group.userData={spatial_id:data.spatial_id,status:data.facade_status,source_pdf_pages:[1,2,3,4,5]};
  const p=data.display_parameters,ring=data.outline_local_xy_m,[xmin,ymin,xmax,ymax]=data.bounds_local_xy_m;
  const mid=(ymin+ymax)/2,depth=(ymax-ymin)/2,white=[],glass=[],frames=[],fascia=[];
  const whiteMaterial=new THREE.MeshStandardMaterial({color:'#eeeae2',roughness:.85,metalness:.01,side:THREE.DoubleSide});
  const frameMaterial=new THREE.MeshStandardMaterial({color:'#303b40',roughness:.5,metalness:.32});
  const glassMaterial=new THREE.MeshPhysicalMaterial({color:'#adcbd1',roughness:.16,metalness:.09,clearcoat:.8,clearcoatRoughness:.14,transparent:true,opacity:.38,depthWrite:false,side:THREE.DoubleSide});
  const fasciaMaterial=new THREE.MeshStandardMaterial({color:'#595448',roughness:.8});
  let frameCount=0,paneCount=0;
  for(let i=1;i<ring.length;i++){
    const a=ring[i-1],b=ring[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(length<.25)continue;
    const n=Math.max(1,Math.ceil(length/p.facade_module_m));
    for(let k=0;k<n;k++){
      const A=a.map((v,j)=>v+(b[j]-v)*k/n),B=a.map((v,j)=>v+(b[j]-v)*(k+1)/n),cx=(A[0]+B[0])/2,cy=(A[1]+B[1])/2,t=(cx-xmin)/(xmax-xmin);
      const isWhite=(cy>mid&&((t>.12&&t<.34)||(t>.56&&t<.7)))||(cy<mid&&((t>.225&&t<.265)||(t>.715&&t<.765)));
      const upperWhite=cy<mid&&((t>.1&&t<.31)||(t>.49&&t<.57));
      if(isWhite)white.push(span(A,B,0,p.eave_height_m,.22));
      else{
        glass.push(span(A,B,.1,p.eave_height_m-.2,.035));paneCount++;
        const m=A.map((v,j)=>(v+B[j])/2);
        frames.push(new THREE.BoxGeometry(p.frame_width_m,p.eave_height_m,.17).translate(A[0],p.eave_height_m/2,-A[1]));frameCount++;
        for(const y of [0.12,2.05,4.2,6.25,p.eave_height_m-.06])frames.push(span(A,B,y,.1,.18));
        if(cy<mid)fascia.push(span(A,B,3.25,.42,.23));
        if(upperWhite)white.push(span(A,B,4.5,p.eave_height_m-4.5,.24));
      }
    }
  }
  merged(group,white,whiteMaterial,'PDF_WHITE_WALLS');
  merged(group,glass,glassMaterial,'PDF_GLASS_FACADES',false);
  merged(group,frames,frameMaterial,'PDF_BLACK_FRAME_GEOMETRY');
  merged(group,fascia,fasciaMaterial,'PDF_STOREFRONT_FASCIA');

  // Roof follows the CAD-derived envelope in plan. This pitch is an explicit display parameter.
  const roofParts=[],roofEnds=[];
  for(const section of data.roof_sections){
    const g=new THREE.ShapeGeometry(new THREE.Shape(section.outer.map(v=>new THREE.Vector2(...v)))),position=g.attributes.position;
    const height=y=>section.eave_m+section.rise_m*Math.max(0,1-Math.abs(y-mid)/depth);
    for(let i=0;i<position.count;i++){const x=position.getX(i),y=position.getY(i);position.setXYZ(i,x,height(y),-y);}g.computeVertexNormals();roofParts.push(g);
    for(let i=1;i<section.outer.length;i++){
      const a=section.outer[i-1],b=section.outer[i],v=new THREE.BufferGeometry();
      v.setAttribute('position',new THREE.Float32BufferAttribute([a[0],p.eave_height_m,-a[1],b[0],p.eave_height_m,-b[1],b[0],height(b[1]),-b[1],a[0],p.eave_height_m,-a[1],b[0],height(b[1]),-b[1],a[0],height(a[1]),-a[1]],3));v.computeVertexNormals();roofEnds.push(v);
    }
  }
  const roof=mergeGeometries(roofParts.map(g=>g.toNonIndexed()),false);roofParts.forEach(g=>g.dispose());
  const roofMesh=new THREE.Mesh(roof,new THREE.MeshStandardMaterial({color:'#b7bcb6',roughness:.89,metalness:.025,side:THREE.DoubleSide}));
  roofMesh.name='PDF_REFERENCE_SLOPED_ROOF';roofMesh.castShadow=true;roofMesh.receiveShadow=true;
  roofMesh.userData={presentationOnly:true,input_origin:'SIMULATED',source_pdf_pages:[3,4,5],roof_elevation_verified:false};group.add(roofMesh);
  merged(group,roofEnds,whiteMaterial,'PDF_GABLE_END_INFILL');
  const roofEdges=new THREE.LineSegments(new THREE.EdgesGeometry(roof,24),new THREE.LineBasicMaterial({color:'#7c8786',transparent:true,opacity:.34}));roofEdges.name='PDF_ROOF_EDGES';group.add(roofEdges);

  const frontAt=x=>{
    const ys=[];for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i];if((a[0]<=x&&b[0]>=x)||(b[0]<=x&&a[0]>=x)){const t=(x-a[0])/(b[0]-a[0]||1);if(t>=0&&t<=1)ys.push(a[1]+(b[1]-a[1])*t);}}
    return Math.min(...ys);
  };
  // Source-visible white gable accents, positioned on the CAD-derived frontage, not surveyed facade bays.
  for(const [j,t]of [.245,.74].entries()){
    const x=xmin+(xmax-xmin)*t,w=j?9.2:8.8,y=frontAt(x),h=p.gable_height_m-(j?0:1.3);
    const s=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(w/2,h),new THREE.Vector2(0,h+1.4),new THREE.Vector2(-w/2,h)]);
    const face=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:.22,bevelEnabled:false}),whiteMaterial);face.position.set(x,0,-y+.12);face.castShadow=true;face.receiveShadow=true;face.name='PDF_WHITE_GABLE_'+j;face.userData={input_origin:'SIMULATED',source_pdf_page:4,placement:'PDF_REFERENCE_ALONG_CAD_FRONTAGE'};group.add(face);
    if(j===1){
      const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const c=canvas.getContext('2d');c.fillStyle='#eeeae2';c.fillRect(0,0,256,512);c.textAlign='center';c.font='500 91px "Microsoft YaHei UI",sans-serif';
      for(const [i,ch]of [...'观前1号'].entries()){c.fillStyle=ch==='1'?'#b73d34':'#303b40';c.fillText(ch,128,104+i*112);}
      const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
      const sign=new THREE.Mesh(new THREE.PlaneGeometry(1.65,3.4),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));sign.position.set(x,h*.61,-y+.36);group.add(sign);
    }
  }
  group.userData.statistics={panes:paneCount,frame_posts:frameCount,all_dimensions:'SIMULATED',roof_profile:'PDF_REFERENCE'};
  return group;
}
