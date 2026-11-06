"""Exercise the real aesthetic entry and reuse unchanged legacy suites against that entry."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import traceback
from unittest.mock import patch

from playwright.sync_api import Page,sync_playwright,expect
from shapely.geometry import Polygon
from shapely.ops import unary_union

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts/space-v21-aesthetic'
BASELINE='f8efd45d880ef88e1657e272c0d77af56a3a3b41'
ENTRY='space-v21-aesthetic.html#space'
SIZES=[(2048,972),(1920,1080),(1440,900),(1024,768),(390,844)]
GEOMETRY="""async c=>{const v=c.__huboneViewer,hash=async a=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',a))].map(n=>n.toString(16).padStart(2,'0')).join(''),out=[];async function add(o,key){if(!o.isMesh)return;const attrs={};for(const [k,a]of Object.entries(o.geometry.attributes))attrs[k]=await hash(a.array);if(o.geometry.index)attrs.index=await hash(o.geometry.index.array);out.push({key,attrs});}for(const [id,f]of v.floorGroups)for(const o of f.structure.children)await add(o,id+':'+o.userData.assetType);for(const group of ['V21_PDF_REFERENCE_ENVELOPE','V21_ILLUSTRATIVE_CONTEXT']){const objects=[];v.scene.getObjectByName(group).traverse(o=>{if(o.isMesh)objects.push(o);});for(const [i,o]of objects.entries())await add(o,group+':'+i+':'+o.name);}return out;}"""
SNAPSHOT="""c=>{const v=c.__huboneViewer;v.scene.updateMatrixWorld(true);const resources=[];v.scene.traverse(o=>{resources.push(o.uuid);if(o.geometry)resources.push(o.geometry.uuid);});const floors=[...v.floorGroups].map(([id,f])=>({id,position:f.group.position.toArray(),matrix:f.group.matrixWorld.toArray()}));return {diag:v.getDiagnostics(),floors,resources,shadow:{position:v.sun.position.toArray(),target:v.sun.target.position.toArray(),projection:v.sun.shadow.camera.projectionMatrix.toArray(),mapSize:v.sun.shadow.mapSize.toArray()},direction:v.camera.position.clone().sub(v.controls.target).normalize().toArray()};}"""


def legacy(kind,url):
    """Only redirect the suite's explicit V2.1 entry; all original assertions stay intact."""
    name='accept_space_v21' if kind=='business' else 'accept_space_v21_slider'
    spec=importlib.util.spec_from_file_location(name,ROOT/'scripts'/(name+'.py'));module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    original=Page.goto
    def goto(page,target,*a,**kw):return original(page,target.replace('space-v21.html#space',ENTRY),*a,**kw)
    argv=[name,'--url',url]
    if kind=='business':argv+=['--output',str(OUT/'legacy-business')]
    with patch.object(Page,'goto',goto),patch.object(sys,'argv',argv):module.main()
    src=OUT/'legacy-business/acceptance.json' if kind=='business' else ROOT/'artifacts/space-v21-slider/acceptance.json'
    data=json.loads(src.read_text());assert data['status']=='passed'
    data['actual_preview_entry']=ENTRY;data['legacy_suite_entry_redirect_only']=True
    (OUT/('regression.json' if kind=='business' else 'slider-regression.json')).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',default='http://127.0.0.1:8057/hub-on/demos/etd-1-1-20261104/');parser.add_argument('--regression',choices=['business','slider']);args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    if args.regression:legacy(args.regression,args.url);return
    base=args.url.rstrip('/')+'/';shots=OUT/'screenshots';shots.mkdir(exist_ok=True)
    checks=[];errors=[];http=[];console=[];states={};responsive=[]
    result={'status':'running','url':base+ENTRY,'browser':'Chromium / SwiftShader','physical_mobile_verified':False,'gpu_performance_tested':False,'analysis_layers_developed':False,'visual_acceptance':'PENDING'}
    def check(name,condition=True):
        if not condition:raise AssertionError(name)
        checks.append(name)
    try:
        files=subprocess.check_output(['git','ls-tree','-r','--name-only',BASELINE],cwd=ROOT.parent,text=True).splitlines()
        for name in files:
            # Honor existing .gitattributes, including CRLF checkout for Windows launchers.
            expected=subprocess.check_output(['git','cat-file','--filters',BASELINE+':'+name],cwd=ROOT.parent)
            if (ROOT.parent/name).read_bytes()!=expected:raise AssertionError('Existing source changed: '+name)
        check('all_'+str(len(files))+'_existing_source_files_byte_identical')
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
            context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1,has_touch=True,timezone_id='Asia/Shanghai')
            page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:http.append([r.status,r.url]) if r.status>=400 else None);page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
            def ready():page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().triangles>1000',timeout=60000)
            def state():return page.locator('canvas.space-webgl').evaluate(SNAPSHOT)
            def fit_ok(s):
                f=s['diag']['fitBoundsNDC'];return min(f['minX'],f['minY'])>=-.94 and max(f['maxX'],f['maxY'])<=.94
            def shot(name):page.wait_for_timeout(180);page.screenshot(path=str(shots/(name+'.png')));print('Captured '+name,flush=True)
            layout="""()=>['.sidebar','.space-controls','#space-map','.space-inspector'].map(s=>{const b=document.querySelector(s).getBoundingClientRect();return {selector:s,x:b.x,y:b.y,width:b.width,height:b.height};})"""
            page.goto(base+'space-v21.html#space',wait_until='networkidle');ready();old_geo=page.locator('canvas.space-webgl').evaluate(GEOMETRY);old_layout=page.evaluate(layout);shot('before-overview')
            old_d=state()['diag'];check('current_v21_still_original',not old_d.get('aesthetic'))
            page.locator('[data-v21-mode="interior"]').click();page.locator('#space-explode-range').fill('0');shot('before-interior')
            page.goto(base+ENTRY,wait_until='networkidle');ready();new_geo=page.locator('canvas.space-webgl').evaluate(GEOMETRY)
            check('all_cad_slab_exterior_roof_and_site_mesh_buffers_identical',new_geo==old_geo)
            check('page_layout_identical_to_current_v21',page.evaluate(layout)==old_layout)
            d=state()['diag'];check('existing_three_engine',d['engine']=='Three.js r180');check('architectural_profile_active',d['aesthetic']['profile']=='ARCHITECTURAL_ANALYSIS')
            check('two_existing_view_buttons',page.locator('[data-v21-mode]').count()==2)
            check('analytics_remain_disabled',not d['aesthetic']['analyticsDeveloped'] and all(n==0 for n in d['activeOperations'].values()))
            stats=d['aesthetic']['glazingEdges'];check('triangulation_display_diagonals_removed',sum(s['diagonals'] for s in stats)==26);check('derived_edge_duplicates_removed',sum(s['duplicates'] for s in stats)==2)
            check('exterior_white_black_glass_roof_preserved',page.locator('canvas.space-webgl').evaluate("c=>['PDF_WHITE_WALLS','PDF_GLASS_FACADES','PDF_BLACK_FRAME_GEOMETRY','PDF_REFERENCE_SLOPED_ROOF'].every(n=>c.__huboneViewer.scene.getObjectByName(n)?.visible)"))
            check('overview_duplicate_glass_edge_suppression',page.locator('canvas.space-webgl').evaluate("c=>[...c.__huboneViewer.floorGroups.values()].every(f=>f.structure.children.filter(o=>o.name==='ARCHITECTURAL_GLAZING_EDGES').every(o=>o.material.opacity===0))"))
            check('desktop_existing_ssao_active',d['rendering']['ambientOcclusion']=='SSAO');check('overview_complete_fit',fit_ok(state()));shot('overview')
            page.evaluate('window.aestheticViewer=document.querySelector("canvas.space-webgl").__huboneViewer')
            page.locator('[data-v21-mode="interior"]').click();rail=page.locator('#space-explode-range');rail.fill('0');baseline=state();requests=[];page.on('request',lambda r:requests.append(r.url))
            floors=page.request.get(base+'space-v21-data/surfaces.json').json()['floors'];hole=floors['floor_2']['openings'][0]
            solid=unary_union([Polygon(p['outer'],p['holes']) for p in floors['floor_2']['surfaces']]).representative_point()
            def ray(point):return page.locator('canvas.space-webgl').evaluate('''(c,p)=>{const v=c.__huboneViewer,f=v.floorGroups.get('floor_2'),o=f.model.registration.origin_wcs_mm;v.scene.updateMatrixWorld(true);v.ray.set(v.camera.position.clone().set((p[0]-o[0])/1000,f.group.position.y+30,-(p[1]-o[1])/1000),v.camera.position.clone().set(0,-1,0));return v.ray.intersectObjects(f.structure.children.filter(o=>o.isMesh&&o.userData.assetType==='slabs'),false).length;}''',point)
            for value in [0,.5,1]:
                rail.fill(str(value));page.wait_for_timeout(80);s=state();states[str(value)]=s
                check(f'{value}_same_viewer_and_resources',page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer===window.aestheticViewer') and s['resources']==baseline['resources'])
                check(f'{value}_absolute_linear_floor2_y',abs(s['floors'][1]['position'][1]-(4.2+133.130625*value))<1e-8)
                check(f'{value}_floor1_stationary',s['floors'][0]==baseline['floors'][0]);check(f'{value}_shadow_projection_and_sun_stable',s['shadow']==baseline['shadow'])
                check(f'{value}_complete_camera_fit',fit_ok(s));check(f'{value}_two_floor_labels',page.locator('[data-v21-floor-tag]:visible').count()==2)
                check(f'{value}_actual_hole_ray_misses_slab',ray(hole['sample_wcs_mm'])==0);check(f'{value}_nearby_solid_ray_hits_slab',ray([solid.x,solid.y])>0)
                shadow_fit=page.locator('canvas.space-webgl').evaluate('''c=>{const v=c.__huboneViewer,cam=v.sun.shadow.camera;v.scene.updateMatrixWorld(true);return [...v.floorGroups.values()].every(f=>{f.structure.children.filter(o=>o.isMesh&&o.geometry.boundingBox).forEach(o=>{});const box=f.structure.children.find(o=>o.isMesh).geometry.boundingBox;const points=[];f.structure.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])points.push(v.camera.position.clone().set(x,y,z).applyMatrix4(o.matrixWorld).project(cam));});return points.every(p=>Math.max(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z))<=1.001);});}''')
                check(f'{value}_floor_meshes_inside_shadow_volume',shadow_fit);shot('interior-'+str(round(value*100)))
            # Exercise both directions without rebuilding meshes, changing CAD or accumulating offsets.
            failed=page.locator('canvas.space-webgl').evaluate('''c=>{const v=c.__huboneViewer,r=document.querySelector('#space-explode-range'),failures=[];for(let i=0;i<202;i++){const p=(i<101?i:201-i)/100;r.value=p;r.dispatchEvent(new Event('input',{bubbles:true}));const d=v.getDiagnostics(),f=d.fitBoundsNDC;if(Math.abs(d.floorY.floor_2-(4.2+133.130625*p))>1e-8||Math.min(f.minX,f.minY)<-.94||Math.max(f.maxX,f.maxY)>.94)failures.push(i);}return failures;}''')
            check('202_forward_reverse_steps_linear_and_fitted',not failed);check('zero_world_matrices_exact',state()['floors']==baseline['floors']);check('resource_ids_constant_after_round_trip',state()['resources']==baseline['resources']);shot('reset-zero')
            check('no_model_network_reload_during_drag',not requests)
            for w,h in SIZES:
                page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(130)
                for value in [0,.5,1]:
                    rail.fill(str(value));s=state();m=page.evaluate('''()=>{const r=document.querySelector('#space-explode-range').getBoundingClientRect();return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,slider:{left:r.left,right:r.right,top:r.top,bottom:r.bottom}};}''')
                    check(f'{w}x{h}_{value}_complete_fit',fit_ok(s));check(f'{w}x{h}_{value}_no_overflow',m['scrollWidth']<=w and m['scrollHeight']<=h+1)
                    check(f'{w}x{h}_{value}_slider_in_view',m['slider']['left']>=0 and m['slider']['right']<=w and m['slider']['bottom']<=h)
                    m['separation']=value;responsive.append(m)
            rail.fill('0');b=rail.bounding_box();cdp=context.new_cdp_session(page);y=b['y']+b['height']/2;x0=b['x']+3;x1=b['x']+b['width']-3
            def touch(start,end,id):
                values=[];cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':start,'y':y,'id':id}]})
                for i in range(1,13):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':start+(end-start)*i/12,'y':y,'id':id}]});values.append(float(rail.input_value()))
                cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});return values
            samples=touch(x0,x1,1);check('native_touch_slider_monotonic',samples[-1]>.99 and all(a<=b for a,b in zip(samples,samples[1:])));check('native_touch_multiple_intermediate_positions',len(set(v for v in samples if 0<v<1))>=7)
            rail.fill('0.5');page.mouse.move(10,5);shot('mobile');touch(x1,x0,2);check('native_touch_returns_exactly_to_zero',state()['floors']==baseline['floors'])
            page.set_viewport_size({'width':1920,'height':1080});page.wait_for_timeout(120);rail.fill('0');page.locator('[data-v21-opening]').click();page.wait_for_timeout(150);check('opening_focus_high_detail',state()['diag']['aesthetic']['edgeDetail']>.5);shot('opening')
            check('focused_hole_still_real_geometry',ray(hole['sample_wcs_mm'])==0)
            check('all_source_mesh_buffers_still_unchanged',page.locator('canvas.space-webgl').evaluate(GEOMETRY)==old_geo)
            check('floor_attachment_uses_existing_group',page.locator('canvas.space-webgl').evaluate("c=>[...c.__huboneViewer.floorGroups].every(([id,f])=>f.operations.parent===f.group&&f.operations.userData.attachment.floor_id===id&&!f.operations.visible)"))
            check('no_javascript_errors',not errors);check('no_http_errors',not http);check('no_webgl_console_errors',not console);browser.close()
        result['status']='passed'
    except Exception as exc:
        result.update(status='failed',failure=str(exc),traceback=traceback.format_exc());raise
    finally:
        result.update(checks_passed=len(checks),checks=checks,states=states,responsive=responsive,javascript_errors=errors,http_errors=http,console_errors=console)
        (OUT/'acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        print(json.dumps({k:v for k,v in result.items() if k not in ['checks','states','responsive']},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
