"""Prepare WebGL geometry without parsing CAD again or assigning real heights.

Authoritative floor JSON files are read-only. Planar CAD geometry is retained;
vertical display parameters and the presentation slab are explicitly illustrative.
"""
from collections import Counter
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from shapely import make_valid, normalize, set_precision, to_wkb
from shapely.geometry import LineString, Polygon
from shapely.ops import polygonize, unary_union
from shapely.strtree import STRtree

DATA = Path(__file__).resolve().parents[1] / 'data'
GRID_M = .005
RASTER_M = .05
DOOR_CLOSURE_M = 1.0


def polygons(shape):
    if shape.geom_type == 'Polygon':
        return [shape]
    return [p for g in getattr(shape, 'geoms', []) for p in polygons(g)]


def polygon_data(p):
    # Output stays in original CAD WCS millimeters, including the source offset.
    ring = lambda r: [[round(x*1000, 4), round(y*1000, 4)] for x, y in r.coords]
    return {'outer': ring(p.exterior), 'holes': [ring(r) for r in p.interiors]}


def filled_shape(obj):
    """Respect even/odd CAD HATCH rings; never fill a known source hole."""
    result = Polygon()
    for pts in obj['geometry']['paths']:
        if len(pts) < 4 or np.linalg.norm(np.array(pts[0][:2])-np.array(pts[-1][:2])) > .1:
            continue
        p = make_valid(Polygon([(v[0]/1000,v[1]/1000) for v in pts]))
        for part in polygons(p):
            result = result.symmetric_difference(part)
    return result


def model_floor(floor):
    fid=floor['floor_id']
    axis=[c for c in floor['containers'] if c.get('block_name')=='A$C138296ba']
    if len(axis)!=1:
        raise ValueError('Shared axis block is ambiguous; do not guess alignment.')
    matrix=axis[0]['block_to_wcs_matrix44']
    if not np.allclose(np.array(matrix).reshape(4,4)[:3,:3],np.eye(3)):
        raise ValueError('Non-translation axis registration requires review.')
    root=next(c['entity_id'] for c in floor['containers'] if c['source_handle']==floor['root_handle'])
    source=[e for e in floor['entities'] if root in e['insert_chain'] and e['geometry']['kind']=='paths'
            and e['category']!='annotation' and e['effective_layer']!='Defpoints']
    linework=[];line_sources=[];components=[];hatch_regions=[];vertices=[]
    for obj in source:
        layer=obj['effective_layer'];g=obj['geometry'];refs=[obj['entity_id']]
        for pts in g['paths']:
            if len(pts)<2:continue
            line=LineString([(p[0]/1000,p[1]/1000) for p in pts])
            if line.length<.02:continue
            linework.append(set_precision(line,GRID_M));line_sources.append(obj['entity_id'])
            vertices.extend(line.coords)
        shape=filled_shape(obj) if g.get('filled') or obj['dxf_type']=='LWPOLYLINE' else Polygon()
        if obj['dxf_type']=='HATCH' and shape.area>20:
            for p in polygons(shape):
                if p.area>20:hatch_regions.append((p,refs,'CAD_HATCH_BOUNDARY'))
        if obj['category']=='wall_column' and g.get('filled'):
            for p in polygons(shape):
                if .025<p.area<30:
                    x0,y0,x1,y1=p.bounds
                    kind='column' if max(x1-x0,y1-y0)<1.8 and max(x1-x0,y1-y0)/max(.01,min(x1-x0,y1-y0))<3.5 else 'wall_solid'
                    components.append({'spatial_id':obj['entity_id'],'kind':kind,'layer':layer,
                        'source_entity_ids':refs,'footprint':polygon_data(p),'height_mm':None,
                        'semantic_status':'CAD_LAYER_CANDIDATE'})
        if obj['category'] in ('wall_column','door_window') and obj['dxf_type']!='HATCH':
            paths=[]
            for pts in g['paths']:
                simple=LineString([(p[0]/1000,p[1]/1000) for p in pts]).simplify(.005)
                for a,b in zip(simple.coords,list(simple.coords)[1:]):
                    length=np.linalg.norm(np.array(b)-a)
                    if (.7 if obj['category']=='door_window' else 1.15)<=length<=65:
                        paths.append([[round(v*1000,4) for v in a],[round(v*1000,4) for v in b]])
            if paths:components.append({'spatial_id':obj['entity_id'],'kind':'glazing' if obj['category']=='door_window' else 'wall_plane',
                'layer':layer,'source_entity_ids':refs,'segments':paths,'height_mm':None,'thickness_mm':None,
                'semantic_status':'CAD_LAYER_CANDIDATE'})
        if obj['category']=='stair_railing':
            components.append({'spatial_id':obj['entity_id'],'kind':'stair_plan','layer':layer,
                'source_entity_ids':refs,'paths_wcs_xyz_mm':g['paths'],'height_mm':None,
                'semantic_status':'SOURCE_PLAN_ONLY; riser height/profile unknown'})
    # Close small doorway gaps for a presentation support surface only. This is
    # NOT a surveyed slab outline, not an area measurement, and not a new CAD wall.
    xy=np.array(vertices);lo=xy.min(axis=0)-4;hi=xy.max(axis=0)+4
    w,h=np.ceil((hi-lo)/RASTER_M).astype(int)+1
    raster=np.zeros((h,w),np.uint8)
    for line in linework:
        pixels=np.round((np.array(line.coords)-lo)/RASTER_M).astype(np.int32)
        cv2.polylines(raster,[pixels],False,255,1)
    size=round(DOOR_CLOSURE_M/RASTER_M)*2+1
    closed=cv2.morphologyEx(raster,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(size,size)))
    outside=closed.copy();cv2.floodFill(outside,None,(0,0),255)
    solid=cv2.bitwise_or(cv2.bitwise_not(outside),closed)
    contours,_=cv2.findContours(solid,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    slab_parts=[]
    for c in contours:
        if cv2.contourArea(c)*RASTER_M**2<50:continue
        points=cv2.approxPolyDP(c,.6,True)[:,0,:]*RASTER_M+lo
        slab_parts.extend(polygons(make_valid(Polygon(points))))
    if not slab_parts:raise ValueError('No presentation support boundary; retain 2D rather than invent a building.')
    slab=unary_union(slab_parts)
    tree=STRtree(linework)
    regions=[];seen=set()
    faces=[p for p in polygonize(unary_union(linework)) if p.area>18]
    entries=[(p,None,'CAD_LINEWORK_POLYGONIZATION') for p in faces]+hatch_regions
    for p,refs,method in entries:
        p=p.simplify(.005,preserve_topology=True)
        key=hashlib.sha256(to_wkb(normalize(set_precision(p,GRID_M)))).hexdigest()[:18]
        if key in seen:continue
        seen.add(key)
        if refs is None:
            hits=tree.query(p.boundary.buffer(.012))
            refs=sorted({line_sources[i] for i in hits if linework[i].intersection(p.boundary.buffer(.012)).length>.1})
        point=p.representative_point()
        regions.append({'spatial_id':f'guanqian-1:{fid}:region-{key}','region_id':f'guanqian-1:{fid}:region-{key}',
            'floor_id':fid,'building_id':'guanqian-1','zone_id':None,'name':'',
            'footprint':polygon_data(p),'area_m2':round(p.area,2),
            'label_wcs_mm':[round(point.x*1000,4),round(point.y*1000,4)],
            'source_entity_ids':refs,'method':method,'verification_status':'PENDING_REVIEW',
            'input_origin':'USER_PROVIDED_CAD','processing_method':'RULE_BASED','simulated':False})
    regions.sort(key=lambda r:r['spatial_id'])
    for i,r in enumerate(regions):r['name']=f'CAD 空间 {i+1:02d}'
    return {'schema_version':'0.3.0','building_id':'guanqian-1','floor_id':fid,'level':floor['level'],
        'source_sha256':floor['source']['sha256'],'coordinate_system':'guanqian-dxf-wcs','unit':'mm',
        'source_bounds_wcs_mm':[float(v)*1000 for v in (xy[:,0].min(),xy[:,1].min(),xy[:,0].max(),xy[:,1].max())],
        'registration':{'method':'CAD_SHARED_AXIS_BLOCK','axis_block':'A$C138296ba',
            'source_spatial_id':axis[0]['entity_id'],'origin_wcs_mm':matrix[12:15],
            'formula':'x=(cad_x-origin_x)/1000; y=display_elevation; z=-(cad_y-origin_y)/1000',
            'physical_verification':'NOT_SURVEYED'},
        'vertical_reference':floor['vertical_reference'],
        'demo_camera_wcs_mm':[(floor['bounds_wcs_mm'][0]+floor['bounds_wcs_mm'][2])/2,
                              (floor['bounds_wcs_mm'][1]+floor['bounds_wcs_mm'][3])/2],
        'presentation_slab':{'spatial_id':floor['spatial_id']+':presentation-slab','status':'SIMULATED_RECONSTRUCTION',
            'method':'CAD_LINEWORK_RASTER_DOORWAY_CLOSURE','pixel_mm':RASTER_M*1000,'gap_closure_radius_mm':DOOR_CLOSURE_M*1000,
            'footprints':[polygon_data(p) for p in polygons(slab)],'thickness_mm':None,
            'note':'仅为展示支撑面；不是经确认的楼板边界、挑空或建筑面积。闭合缺口是推导，不改写原始CAD。'},
        'components':components,'regions':regions,'business_zones':[],
        'statistics':dict(Counter(c['kind'] for c in components)),
        'model_status':'CAD_PLAN_DERIVED; 3D heights and support slabs are illustrative, not verified BIM',
        'demo_height_defaults_mm':{'wall':3200,'column':3600,'glazing':3100,'floor_spacing':4200,'slab':240,
            'input_origin':'SIMULATED','note':'Display-only parameters. Authoritative heights remain null.'}}


def build():
    report=[]
    for fid in ('floor_1','floor_2'):
        source=DATA/f'{fid}.json';digest=hashlib.sha256(source.read_bytes()).hexdigest()
        model=model_floor(json.loads(source.read_text(encoding='utf-8')))
        assert hashlib.sha256(source.read_bytes()).hexdigest()==digest
        (DATA/f'{fid}_model.json').write_text(json.dumps(model,ensure_ascii=False,separators=(',',':')),encoding='utf-8',newline='\n')
        report.append({'floor_id':fid,'components':model['statistics'],'regions':len(model['regions']),
            'cad_json_unchanged_sha256':digest,'model_status':model['model_status']})
    (DATA/'model_manifest.json').write_text(json.dumps({'schema_version':'0.3.0','floors':report,
        'no_additional_floors':True,'business_zones_confirmed':False,'heights_surveyed':False},ensure_ascii=False,indent=2),encoding='utf-8',newline='\n')
    print(json.dumps(report,ensure_ascii=False))


if __name__=='__main__':build()
