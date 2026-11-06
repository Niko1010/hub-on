"""Actual browser acceptance: stage-one envelope, registered floors, voids and unchanged C3."""
import argparse
import json
from pathlib import Path
import traceback
from playwright.sync_api import sync_playwright,expect
from shapely.geometry import Polygon
from shapely.ops import unary_union

ROOT=Path(__file__).resolve().parents[1]
SIZES=[(2048,972),(1920,1080),(1440,900),(1024,768),(390,844)]
MESH_HASH="""async c=>{const result=[],v=c.__huboneViewer,hash=async a=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',a))].map(v=>v.toString(16).padStart(2,'0')).join('');for(const [floor,f]of v.floorGroups)for(const o of f.structure.children.filter(o=>o.isMesh&&o.userData.assetType!=='slabs')){const attrs={};for(const [k,a]of Object.entries(o.geometry.attributes))attrs[k]=await hash(a.array);result.push({floor,kind:o.userData.assetType,attrs});}return result;}"""


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',default='http://127.0.0.1:8051/hub-on/demos/etd-1-1-20261104/');parser.add_argument('--output',type=Path,default=ROOT/'artifacts/space-v21-stage1');args=parser.parse_args()
    base=args.url.rstrip('/')+'/';out=args.output;shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];bad=[];console=[];viewports=[];meshes={};reports={}
    result={'status':'running','stage':1,'url':base,'browser':'Chromium / SwiftShader','physical_gpu_verified':False,'real_devices_tested':False,'analysis_layers_developed':False,'user_visual_acceptance':'PENDING'}
    def check(name,condition=True):
        if not condition:raise AssertionError(name)
        checks.append(name)
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
            context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1,has_touch=True,accept_downloads=True,timezone_id='Asia/Shanghai')
            page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None);page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
            def ready():page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().triangles>1000',timeout=60000)
            def diag():return page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.getDiagnostics()')
            def fit_ok():
                b=diag()['fitBoundsNDC'];return min(b['minX'],b['minY'])>=-.94 and max(b['maxX'],b['maxY'])<=.94
            def mode(value):
                if page.viewport_size['width']<1200 and page.locator('[data-space-drawer-toggle]').get_attribute('aria-expanded')!='true':page.locator('[data-space-drawer-toggle]').click()
                page.locator('button[data-v21-mode="'+value+'"]').click()
            print('Checking V2 baseline and C3',flush=True)
            page.goto(base+'space-v2.html#space',wait_until='networkidle');ready();meshes['v2']=page.locator('canvas.space-webgl').evaluate(MESH_HASH)
            check('v2_remains_available',diag()['presentation']['version']=='V2')
            page.locator('#nav a[href="#report"]').click();expect(page.locator('.report-paper')).to_be_visible();page.mouse.move(1900,4);page.wait_for_timeout(300);page.screenshot(path=str(shots/'c3-before.png'),animations='disabled');reports['before']=shots/'c3-before.png'
            print('Checking V2.1 presentation',flush=True)
            page.goto(base+'space-v21.html#space',wait_until='networkidle');ready()
            check('same_threejs_engine',diag()['engine']=='Three.js r180')
            check('overview_default',diag()['presentation']['mode']=='overview' and diag()['presentation']['envelopeVisible'])
            check('only_original_two_floors',diag()['presentation']['sourceFloorIds']==['floor_1','floor_2'])
            check('source_provenance_explicit',diag()['presentation']['heightStatus']=='SIMULATED' and 'SIMULATED' in page.locator('.space-model-provenance').inner_text())
            check('no_analytical_data',not diag()['simulated'] and all(v==0 for v in diag()['activeOperations'].values()) and not diag()['presentation']['analyticsImplemented'])
            check('actual_frame_geometry',page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.scene.getObjectByName("PDF_BLACK_FRAME_GEOMETRY").geometry.attributes.position.count>100'))
            check('actual_slope_roof_mesh',page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.scene.getObjectByName("PDF_REFERENCE_SLOPED_ROOF").geometry.attributes.position.count>100'))
            meshes['v21']=page.locator('canvas.space-webgl').evaluate(MESH_HASH);check('cad_wall_column_glazing_mesh_buffers_unchanged',meshes['v2']==meshes['v21'])
            for w,h in SIZES:
                page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(180);page.locator('[data-space-zoom="fit"]').click();page.wait_for_timeout(100)
                m=page.evaluate('''()=>{const b=document.querySelector('#space-map').getBoundingClientRect();return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,map:{x:b.x,y:b.y,width:b.width,height:b.height},sidebar:getComputedStyle(document.querySelector('.sidebar')).position};}''')
                check(f'{w}x{h}_no_outer_overflow',m['scrollWidth']<=w and m['scrollHeight']<=h+1)
                check(f'{w}x{h}_complete_fit',fit_ok());check(f'{w}x{h}_map_visible',m['map']['height']>250 and m['map']['y']+m['map']['height']<=h)
                check(f'{w}x{h}_existing_navigation',m['sidebar']=='fixed');expect(page.locator('.space-v21-tag')).to_be_visible()
                viewports.append(m);page.screenshot(path=str(shots/f'overview-{w}x{h}.png'))
                if w==1920:page.screenshot(path=str(shots/'overview.png'))
                if w==390:page.screenshot(path=str(shots/'mobile.png'))
            page.set_viewport_size({'width':1920,'height':1080});page.wait_for_timeout(180)
            # Orbit, pan and zoom must survive the local mode wrapper without resetting on clicks.
            b=page.locator('canvas.space-webgl').bounding_box();x=b['x']+b['width']*.5;y=b['y']+b['height']*.55
            before=diag()['cameraPosition'];page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+60,y+25,steps=8);page.mouse.up();page.wait_for_timeout(100);check('pointer_orbit',diag()['cameraPosition']!=before)
            before=diag()['cameraTarget'];page.mouse.move(x,y);page.mouse.down(button='right');page.mouse.move(x+30,y+15,steps=6);page.mouse.up(button='right');page.wait_for_timeout(100);check('pointer_pan',diag()['cameraTarget']!=before)
            before=diag()['zoom'];page.mouse.move(x,y);page.mouse.wheel(0,-250);page.wait_for_timeout(100);check('wheel_zoom',diag()['zoom']!=before)
            page.locator('[data-space-zoom="fit"]').click();check('fit_reset',fit_ok() and abs(diag()['zoom']-1)<1e-6)
            page.locator('[data-v21-roof]').uncheck();check('roof_can_hide',not page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.scene.getObjectByName("PDF_REFERENCE_SLOPED_ROOF").visible'))
            page.locator('[data-v21-roof]').check();page.locator('[data-v21-context]').uncheck();check('context_can_hide',not diag()['presentation']['contextVisible']);page.locator('[data-v21-context]').check()
            page.evaluate('window.v21Viewer=document.querySelector("canvas.space-webgl").__huboneViewer')
            mode('exploded');check('modes_reuse_same_viewer',page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer===window.v21Viewer'))
            check('exploded_offset_is_separate',diag()['presentation']['displayExplodedOffsetM']>40 and diag()['floorY']['floor_2']>40)
            bounds=page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.getFloorProjectedBounds()');check('floors_do_not_occlude_in_default_exploded_view',bounds['floor_2']['bottom']<bounds['floor_1']['top'])
            check('both_floor_labels',page.locator('[data-v21-floor-tag]:visible').count()==2)
            page.screenshot(path=str(shots/'exploded.png'))
            page.locator('[data-v21-floor="floor_1"]').uncheck();check('floor1_independent_hide',diag()['presentation']['visibleInternalFloors']==['floor_2']);page.locator('[data-v21-floor="floor_1"]').check()
            page.locator('[data-v21-floor="floor_2"]').uncheck();check('floor2_independent_hide',diag()['presentation']['visibleInternalFloors']==['floor_1']);page.locator('[data-v21-floor="floor_2"]').check()
            for fid,name in [('floor_1','floor-1.png'),('floor_2','floor-2.png')]:
                page.locator('[data-space-floor="'+fid+'"]').click();ready();check('original_floor_button_'+fid,diag()['presentation']['mode']=='interior' and diag()['presentation']['visibleInternalFloors']==[fid]);page.screenshot(path=str(shots/name))
            page.locator('.space-assets summary').click();page.locator('[data-space-asset="columns"]').uncheck();check('columns_hide_preserved',diag()['activeAssets']['columns']==0);page.locator('[data-space-asset="columns"]').check();check('columns_restore_preserved',diag()['activeAssets']['columns']>0)
            page.locator('[data-v21-opening]').click();check('opening_focus',diag()['presentation']['visibleInternalFloors']==['floor_2'] and diag()['zoom']>2)
            page.screenshot(path=str(shots/'opening.png'))
            data=page.request.get(base+'space-v21-data/surfaces.json').json()['floors']['floor_2'];hole=data['openings'][0]
            def ray_hits(point):
                return page.locator('canvas.space-webgl').evaluate('''(c,p)=>{const v=c.__huboneViewer,f=v.floorGroups.get('floor_2'),o=f.model.registration.origin_wcs_mm;v.scene.updateMatrixWorld(true);const start=v.camera.position.clone().set((p[0]-o[0])/1000,f.group.position.y+30,-(p[1]-o[1])/1000),direction=start.clone().set(0,-1,0);v.ray.set(start,direction);return v.ray.intersectObjects(f.structure.children.filter(x=>x.isMesh&&x.userData.assetType==='slabs'),false).length;}''',point)
            check('actual_webgl_mesh_has_no_floor_over_cad_void',ray_hits(hole['sample_wcs_mm'])==0)
            polygons=[Polygon(p['outer'],p['holes']) for p in data['surfaces']];point=unary_union(polygons).representative_point()
            check('positive_control_floor_ray_hits',ray_hits([point.x,point.y])>0)
            check('cad_opening_evidence',hole['source_handle']=='189F' and len(hole['boundary_region_ids'])==2 and len(hole['boundary_source_entity_ids'])>2)
            mode('interior');page.locator('[data-space-zoom="fit"]').click()
            # A solid CAD region remains selectable; an opening is never turned into a business zone.
            chosen=None
            for r in sorted(diag()['regions'],key=lambda x:x['area_m2'],reverse=True):
                q=page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.projectRegion(id)',r['id']);b=page.locator('canvas.space-webgl').bounding_box()
                if q and b['x']+8<q['x']<b['x']+b['width']-8 and b['y']+8<q['y']<b['y']+b['height']-8:
                    page.mouse.click(q['x'],q['y'])
                    if diag()['selectedSpatialId']==r['id']:chosen=r;break
            check('cad_region_selection_preserved',chosen is not None);expect(page.locator('#space-selection')).to_contain_text(chosen['id'])
            page.locator('[data-space-mode="2d"]').click();expect(page.locator('svg.space-cad-svg')).to_be_visible();check('original_2d_entities_preserved',page.locator('svg [data-entity-id]').count()==6722)
            page.locator('[data-space-mode="3d"]').click();ready();check('3d_return_preserved',diag()['presentation']['version']=='V2.1')
            page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150);page.locator('[data-space-drawer-toggle]').click();expect(page.locator('#space-controls-panel')).to_have_attribute('aria-modal','true');page.screenshot(path=str(shots/'mobile-drawer.png'));page.keyboard.press('Escape');check('drawer_focus_return',page.locator('[data-space-drawer-toggle]').evaluate('e=>e===document.activeElement'))
            page.locator('#space-inspector-details>summary').click();expect(page.locator('#space-inspector-details')).to_have_attribute('open','');page.screenshot(path=str(shots/'mobile-inspector.png'));page.keyboard.press('Escape');check('inspector_mobile_close',not page.locator('#space-inspector-details').evaluate('e=>e.open'))
            page.set_viewport_size({'width':1920,'height':1080});page.locator('#nav a[href="#report"]').click();expect(page.locator('.report-paper')).to_be_visible();page.mouse.move(1900,4);page.wait_for_timeout(300);page.screenshot(path=str(shots/'c3-after.png'),animations='disabled');reports['after']=shots/'c3-after.png'
            check('v21_scope_removed_on_c3',not page.locator('#content').evaluate('e=>e.classList.contains("space-v21-stage1")'))
            check('webgl_disposed_on_c3',page.locator('canvas.space-webgl').count()==0)
            check('report11_preserved',page.locator('.report-paper h2').count()==14 and '1.1' in page.locator('.report-banner').inner_text())
            report=page.request.get(base+'report.json').json();check('mock_provenance_preserved',report['processing_method']=='MOCK' and not report['generation']['model_inference_executed'])
            check('report_evidence_ids_valid',all(i in report['evidence'] for group in ['claims','diagnoses','options','experiments'] for item in report['decision_analysis'][group] for i in item['evidence_ids']))
            for kind in ['video','audio']:
                eid=next(k for k,v in report['evidence_index'].items() if v['source']==kind);page.locator('.report-paper [data-evidence="'+eid+'"]').first.click();expect(page.locator('#evidence-dialog')).to_be_visible();page.wait_for_function('kind=>document.querySelector("#evidence-content "+kind)?.readyState>=1',arg=kind)
                check('c3_'+kind+'_evidence_seek',abs(page.locator('#evidence-content '+kind).evaluate('e=>e.currentTime')-report['evidence_index'][eid]['media_time'])<.3);page.locator('#close-dialog').click()
            for ext in ['md','json']:
                with page.expect_download() as download:page.locator('.report-export a[href="./report.'+ext+'"]').click()
                download.value.save_as(str(out/('report.'+ext)));check('report_export_'+ext,(out/('report.'+ext)).stat().st_size>1000)
            for route in ['timeline','feedback','insights','capture']:
                page.locator('#nav a[href="#'+route+'"]').click();check('c3_route_'+route,len(page.locator('#content').inner_text())>50)
            page.locator('#nav a[href="#space"]').click();ready();check('return_to_v21',diag()['presentation']['mode']=='overview')
            page.locator('.space-v21-tag a[href="./space-v2.html#space"]').click();ready();check('back_to_v2',diag()['presentation']['version']=='V2')
            from PIL import Image,ImageChops
            check('c3_report_pixels_identical',ImageChops.difference(Image.open(reports['before']).convert('RGB'),Image.open(reports['after']).convert('RGB')).getbbox() is None)
            check('no_javascript_errors',not errors);check('no_http_errors',not bad);check('no_webgl_console_errors',not console)
            browser.close()
        result['status']='passed'
    except Exception as exc:
        result.update(status='failed',failure=str(exc),traceback=traceback.format_exc());raise
    finally:
        result.update(checks_passed=len(checks),checks=checks,viewports=viewports,javascript_errors=errors,http_errors=bad,console_errors=console,mesh_hashes=meshes)
        (out/'acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(json.dumps({k:v for k,v in result.items() if k not in ['checks','viewports','mesh_hashes']},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
