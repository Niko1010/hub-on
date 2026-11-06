"""Prepare presentation-only V2.1 data from existing CAD JSON; never rewrite CAD."""
import hashlib
import json
from pathlib import Path
from collections import Counter
from shapely.geometry import Polygon,LineString,Point,box
from shapely.ops import unary_union,polygonize
from shapely import make_valid,normalize,to_wkb

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'space_intelligence/data'
OUT=ROOT/'frontend/space-v21-data'


def parts(g):
    if g.geom_type=='Polygon':return [g]
    return [p for c in getattr(g,'geoms',[]) for p in parts(c)]


def polygon(p):
    return make_valid(Polygon([(v[0]/1000,v[1]/1000) for v in p['outer']],
        [[(v[0]/1000,v[1]/1000) for v in ring] for ring in p.get('holes',[])]))


def pack(p):
    ring=lambda r:[[round(x*1000,4),round(y*1000,4)] for x,y in r.coords]
    return {'outer':ring(p.exterior),'holes':[ring(r) for r in p.interiors]}


def write(name,value):
    (OUT/name).write_text(json.dumps(value,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')


def main():
    OUT.mkdir(exist_ok=True)
    floors={};audit=[];models={};unchanged={}
    for fid in ['floor_1','floor_2']:
        for name in [fid+'.json',fid+'_model.json']:
            unchanged[name]=hashlib.sha256((DATA/name).read_bytes()).hexdigest()
        f=json.loads((DATA/(fid+'.json')).read_text(encoding='utf-8'));m=json.loads((DATA/(fid+'_model.json')).read_text(encoding='utf-8'));models[fid]=m
        slab=unary_union([polygon(p) for p in m['presentation_slab']['footprints']])
        openings=[];reservations=[];upper=[]
        for e in f['entities']:
            if '上部洞口' in e['effective_layer']:
                upper.append({'source_entity_id':e['entity_id'],'source_handle':e['source_handle'],
                    'source_layer':e['effective_layer'],'target_floor_id':None,
                    'status':'UPPER_OPENING_REFERENCE; target slab not confirmed; do not cut the current floor'})
            elif e['effective_layer']=='建-孔':
                symbol=unary_union([LineString([(v[0]/1000,v[1]/1000) for v in path]) for path in e['geometry']['paths']])
                # The open hole mark splits the surrounding closed plan faces.
                adjacent=[r for r in m['regions'] if r['method']=='CAD_LINEWORK_POLYGONIZATION'
                    and polygon(r['footprint']).boundary.intersection(symbol.buffer(.01)).length>1]
                assert adjacent,'Hole symbol found without a reproducible enclosing CAD boundary'
                boundary=unary_union([polygon(r['footprint']) for r in adjacent])
                assert len(parts(boundary))==1,'Ambiguous hole boundary; do not invent a connecting polygon'
                refs=sorted({sid for r in adjacent for sid in r['source_entity_ids']})
                byid={x['entity_id']:x for x in f['entities']}
                layers=Counter(byid[s]['effective_layer'] for s in refs if s in byid)
                assert any('完成面' in key or '栏杆' in key for key in layers),'Opening has no enclosing plan-surface boundary'
                rails=[x['entity_id'] for x in f['entities'] if '栏杆' in x['effective_layer']
                    and any(LineString([(v[0]/1000,v[1]/1000) for v in path]).distance(boundary.boundary)<.6 for path in x['geometry'].get('paths',[]) if len(path)>1)]
                openings.append({'spatial_id':fid+':opening:'+e['source_handle'],'floor_id':fid,
                    'source_entity_id':e['entity_id'],'source_handle':e['source_handle'],'source_layer':e['effective_layer'],
                    'boundary_region_ids':[r['spatial_id'] for r in adjacent],
                    'boundary_source_entity_ids':refs,'boundary_source_layers':dict(layers),'nearby_railing_source_ids':rails,
                    'footprints':[pack(p) for p in parts(boundary)],'area_m2':round(boundary.area,4),
                    'sample_wcs_mm':[boundary.representative_point().x*1000,boundary.representative_point().y*1000],
                    'method':'CAD_HOLE_MARK_ADJACENT_CLOSED_PLAN_FACES',
                    'input_origin':'USER_PROVIDED_CAD','processing_method':'RULE_BASED',
                    'status':'CAD_INDICATED_OPENING; boundary derived; NOT_SURVEYED'})
        # Reserve only closed stair-plan faces with a CAD up/down annotation.
        stairs=[e for e in f['entities'] if e['effective_layer']=='P★16 楼梯扶梯' and e['geometry']['kind']=='paths']
        lines=[LineString([(v[0]/1000,v[1]/1000) for v in path]) for e in stairs for path in e['geometry']['paths'] if len(path)>1]
        arrows=[e for e in f['entities'] if e['geometry'].get('text') in ['上','下']]
        if lines:
            for p in polygonize(unary_union(lines)):
                arrow=next((e for e in arrows if p.buffer(.15).covers(Point(*[v/1000 for v in e['geometry']['position'][:2]]))),None)
                if not(3<p.area<100) or arrow is None:continue
                refs=sorted(e['entity_id'] for e in stairs if any(LineString([(v[0]/1000,v[1]/1000) for v in path]).intersection(p.boundary.buffer(.02)).length>.2 for path in e['geometry']['paths'] if len(path)>1))
                key=hashlib.sha256(to_wkb(normalize(p))).hexdigest()[:12]
                reservations.append({'spatial_id':fid+':stair-plan:'+key,'footprints':[pack(p)],
                    'area_m2':round(p.area,4),'source_entity_ids':refs,'direction_annotation_id':arrow['entity_id'],
                    'status':'STAIR_PLAN_SURFACE_RESERVED; not a confirmed vertical void',
                    'note':'Preserve original stair lines; no flat walking surface or invented riser heights.'})
        exclusions=unary_union([polygon(p) for r in openings+reservations for p in r['footprints']])
        safe=make_valid(slab.difference(exclusions))
        clipped={}
        for r in m['regions']:
            candidates=sorted(parts(make_valid(polygon(r['footprint']).intersection(safe))),key=lambda p:p.area,reverse=True)
            if candidates:
                p=candidates[0];point=p.representative_point()
                clipped[r['spatial_id']]={'footprint':pack(p),'label_wcs_mm':[point.x*1000,point.y*1000],
                    'status':'CAD_PICKING_PROXY_ONLY; not a business zone or verified walking area'}
        for opening in openings:
            shape=unary_union([polygon(p) for p in opening['footprints']])
            assert safe.intersection(shape).area<1e-7,'Opening incorrectly filled by the presentation slab'
        floors[fid]={'floor_id':fid,'registration':m['registration'],'vertical_reference':m['vertical_reference'],
            'surfaces':[pack(p) for p in parts(safe)],'region_picking_proxies':clipped,
            'openings':openings,'stair_plan_reservations':reservations,'upper_opening_references':upper,
            'walking_surface_verified':False,'surface_status':'SIMULATED_RECONSTRUCTION_WITH_CAD_OPENING_EXCLUSIONS',
            'source_surface_area_m2':slab.area,'display_surface_area_m2':safe.area}
        audit.append({'floor_id':fid,'cad_openings':len(openings),'stair_plan_reservations':len(reservations),
            'upper_references_pending':len(upper),'opening_area_m2':sum(o['area_m2'] for o in openings),
            'note':'Original geometry unchanged. An upper-opening reference is not cut from its source floor.'})
    m=models['floor_2'];origin=m['registration']['origin_wcs_mm']
    outline=unary_union([polygon(p) for p in m['presentation_slab']['footprints']]).simplify(.14,preserve_topology=True)
    outline=max(parts(outline),key=lambda p:p.area)
    local=lambda p:[round(p[0]-origin[0]/1000,6),round(p[1]-origin[1]/1000,6)]
    ring=[local(p) for p in outline.exterior.coords]
    lo=[min(p[i] for p in ring) for i in [0,1]];hi=[max(p[i] for p in ring) for i in [0,1]]
    roof_sections=[];mid_y=(outline.bounds[1]+outline.bounds[3])/2
    for i,(a,b) in enumerate(zip([0,.27,.52,.77],[.27,.52,.77,1])):
        left=outline.bounds[0]+(outline.bounds[2]-outline.bounds[0])*a;right=outline.bounds[0]+(outline.bounds[2]-outline.bounds[0])*b
        for bottom,top in [(outline.bounds[1]-.01,mid_y),(mid_y,outline.bounds[3]+.01)]:
            for p in parts(outline.intersection(box(left,bottom,right,top))):
                roof_sections.append({'outer':[local(v) for v in p.exterior.coords],
                    'eave_m':8.8+[0,.65,-.2,.3][i],'rise_m':1.8,'input_origin':'SIMULATED','source_pdf_pages':[3,4,5]})
    envelope={'building_id':'guanqian-1','spatial_id':'guanqian-1:pdf-reference-envelope:v21',
        'coordinate_frame':'EXISTING_CAD_SHARED_AXIS_LOCAL_METRES','coordinate_formula':'x=(cad_x-origin_x)/1000; z=-(cad_y-origin_y)/1000',
        'reference_floor_id':'floor_2','origin_wcs_mm':origin,'axis_block':'A$C138296ba','cad_unit':'mm','display_unit':'m',
        'registration_status':'CAD_SHARED_AXIS_DERIVED; NOT_SURVEYED','outline_local_xy_m':ring,'bounds_local_xy_m':lo+hi,
        'outline_status':'CAD_LINEWORK_DERIVED_PRESENTATION_ENVELOPE; not a surveyed facade footprint','roof_sections':roof_sections,
        'source_pdf':{'filename':'观前街1 号购物中心（企业介绍）.pdf','pages':[1,2,3,4,5],
            'sha256':'874fe76b49369c9bd8bd87e0a4f78f9b2b1b1ffa0d2873cc5a69f23981c671ea',
            'use':'Visual facade/roof reference only. No measured height or tenant inventory.'},
        'real_dimensions':{'floor_elevation_mm':None,'floor_height_mm':None,'roof_height_mm':None,'frame_section_mm':None},
        'display_parameters':{'input_origin':'SIMULATED','floor_spacing_m':4.2,'eave_height_m':8.8,
            'roof_rise_m':2.0,'gable_height_m':11.8,'frame_width_m':.1,'facade_module_m':2.7,'slab_thickness_m':.24},
        'facade_status':'PDF_REFERENCE_RECONSTRUCTION; all divisions and vertical dimensions SIMULATED',
        'roof_status':'PDF_REFERENCE_RECONSTRUCTION; roof profile and pitch SIMULATED',
        'floor_ids':['floor_1','floor_2'],'extra_floors_created':False}
    site={'building_id':'guanqian-1','spatial_id':'guanqian-1:illustrative-context:v21',
        'status':'SIMULATED','note':'Illustrative paving, planters and trees; not surveyed surrounding assets. No people or analytics.',
        'bounds_local_xy_m':[lo[0]-18,lo[1]-22,hi[0]+18,hi[1]+14]}
    write('surfaces.json',{'schema_version':'2.1-stage1','floors':floors,'audit':audit,
        'original_data_sha256':unchanged,'floor_data_mutated':False})
    write('envelope.json',envelope);write('site.json',site)
    for name,digest in unchanged.items():assert hashlib.sha256((DATA/name).read_bytes()).hexdigest()==digest
    print(json.dumps({'cad_unchanged':True,'audit':audit,'outline_vertices':len(ring)},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
