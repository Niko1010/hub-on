"""Stage-one browser acceptance on the unchanged integrated C3 1.1 replay."""
import argparse
import json
from pathlib import Path
import traceback
from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]
SIZES=[(2048,972),(1920,1080),(1440,900),(1024,768),(390,844)]
GEOMETRY="""async c=>{
  const v=c.__huboneViewer,out=[];
  const hash=async array=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',array))].map(v=>v.toString(16).padStart(2,'0')).join('');
  for(const [floor,{structure,model}] of v.floorGroups){
    for(const o of structure.children.filter(o=>o.isMesh&&!o.userData.presentationOnly)){
      const attributes={};for(const [name,a]of Object.entries(o.geometry.attributes))attributes[name]=await hash(a.array);
      out.push({floor,kind:o.userData.assetType,attributes,index:o.geometry.index?await hash(o.geometry.index.array):null,matrix:o.matrix.toArray()});
    }
  }return out;
}"""


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:8046/hub-on/demos/etd-1-1-20261104/')
    parser.add_argument('--chromium',default='/usr/bin/chromium')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/space-v2-stage1')
    args=parser.parse_args();out=args.output;out.mkdir(parents=True,exist_ok=True)
    base=args.url.rstrip('/')+'/'
    checks=[];errors=[];bad=[];console=[];viewports=[];geometry={};report_images={};snapshots={}
    result={'status':'running','stage':1,'base_url':base,'browser':'Chromium / SwiftShader',
            'physical_gpu_tested':False,'real_devices_tested':False,'model_inference_executed':False}
    def check(name,condition=True):
        if not condition:raise AssertionError(name)
        checks.append(name)
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path=args.chromium,headless=True,
                args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
            for version,entry in [('original','index.html'),('v2','space-v2.html')]:
                print('Checking '+version,flush=True)
                folder=out/version;folder.mkdir(exist_ok=True)
                context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1,
                    has_touch=True,accept_downloads=True,timezone_id='Asia/Shanghai')
                page=context.new_page()
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
                page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
                page.goto(base+entry+'#space',wait_until='networkidle')
                def ready():page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().triangles>1000',timeout=60000)
                def diag():return page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.getDiagnostics()')
                def fit_ok():
                    b=diag()['fitBoundsNDC'];return min(b['minX'],b['minY'])>=-.94 and max(b['maxX'],b['maxY'])<=.94
                ready();d=diag();snapshots[version]=d
                check(version+'_same_engine',d['engine']=='Three.js r180')
                check(version+'_only_two_floors',d['visibleFloors']==['floor_1','floor_2'])
                check(version+'_no_operating_data',not d['simulated'] and all(n==0 for n in d['activeOperations'].values()))
                geometry[version]=page.locator('canvas.space-webgl').evaluate(GEOMETRY)
                check(version+'_correct_presentation',(d.get('presentation',{}).get('version')=='V2')==(version=='v2'))
                for w,h in SIZES:
                    page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(180)
                    page.locator('[data-space-zoom="fit"]').click();page.wait_for_timeout(100)
                    m=page.evaluate("""()=>{const r=document.querySelector('#space-map').getBoundingClientRect();return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,map:{x:r.x,y:r.y,width:r.width,height:r.height},navigation:[...document.querySelectorAll('#nav a')].map(n=>n.textContent),font:getComputedStyle(document.body).fontFamily};}""")
                    check(f'{version}_{w}x{h}_no_outer_overflow',m['scrollWidth']<=w and m['scrollHeight']<=h+1)
                    check(f'{version}_{w}x{h}_full_model_fit',fit_ok())
                    check(f'{version}_{w}x{h}_visible_map',m['map']['height']>250 and m['map']['y']+m['map']['height']<=h)
                    if version=='v2':expect(page.locator('.space-v2-view-tag a')).to_be_visible()
                    m['version']=version;m['rendering']=diag()['rendering'];m['bounds']=diag()['fitBoundsNDC'];viewports.append(m)
                    page.screenshot(path=str(folder/f'{w}x{h}.png'),animations='disabled')
                page.set_viewport_size({'width':1440,'height':900});page.wait_for_timeout(200)
                page.locator('[data-space-zoom="fit"]').click()
                b=page.locator('canvas.space-webgl').bounding_box();x=b['x']+b['width']*.5;y=b['y']+b['height']*.55
                old=diag()['cameraPosition'];page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+65,y+25,steps=8);page.mouse.up();page.wait_for_timeout(100)
                check(version+'_pointer_rotation',diag()['cameraPosition']!=old)
                old=diag()['cameraTarget'];page.mouse.move(x,y);page.mouse.down(button='right');page.mouse.move(x+38,y+15,steps=6);page.mouse.up(button='right');page.wait_for_timeout(100)
                check(version+'_pointer_pan',diag()['cameraTarget']!=old)
                old=diag()['zoom'];page.mouse.move(x,y);page.mouse.wheel(0,-240);page.wait_for_timeout(120)
                check(version+'_wheel_zoom',diag()['zoom']!=old)
                page.locator('[data-space-isometric]').click();check(version+'_isometric_reset',fit_ok() and abs(diag()['zoom']-1)<1e-6)
                page.locator('#space-exploded').check();check(version+'_exploded',diag()['floorY']['floor_2']>10 and diag()['floorY']['floor_1']==0)
                page.screenshot(path=str(folder/'exploded.png'));page.locator('#space-exploded').uncheck()
                page.locator('[data-space-floor="floor_1"]').click();ready();check(version+'_floor1',diag()['visibleFloors']==['floor_1'])
                page.locator('[data-space-floor="floor_2"]').click();ready();check(version+'_floor2',diag()['visibleFloors']==['floor_2'])
                page.locator('.space-assets summary').click();page.locator('[data-space-asset="columns"]').uncheck()
                check(version+'_hide_columns',diag()['activeAssets']['columns']==0)
                page.screenshot(path=str(folder/'columns-hidden.png'));page.locator('[data-space-asset="columns"]').check()
                check(version+'_restore_columns',diag()['activeAssets']['columns']>0)
                chosen=None
                for region in sorted([r for r in diag()['regions'] if 50<r['area_m2']<2200],key=lambda r:r['area_m2'],reverse=True):
                    q=page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.projectRegion(id)',region['id'])
                    if not q or not(b['x']+5<q['x']<b['x']+b['width']-5 and b['y']+5<q['y']<b['y']+b['height']-5):continue
                    page.mouse.click(q['x'],q['y'])
                    if diag()['selectedSpatialId']==region['id']:chosen=region;break
                check(version+'_raycast_selection',chosen is not None)
                expect(page.locator('#space-selection')).to_contain_text(chosen['id'])
                if version=='v2':
                    check('v2_red_selection_only',page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.regionMeshes.get(id).material.color.getHexString()',chosen['id'])=='c9473e')
                    check('v2_cad_derived_edges',page.locator('canvas.space-webgl').evaluate('c=>[...c.__huboneViewer.floorGroups.values()].every(f=>f.structure.children.filter(o=>o.userData.presentationOnly).every(o=>o.userData.provenance.includes("CAD_DERIVED")))'))
                page.screenshot(path=str(folder/'region-selection.png'))
                page.locator('[data-space-focus-region]').click();page.wait_for_function('!document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().focusAnimating')
                check(version+'_region_focus',diag()['focusedRegionId']==chosen['id'] and diag()['zoom']>1)
                page.locator('[data-space-zoom="fit"]').click();check(version+'_fit_after_focus',fit_ok())
                page.locator('[data-space-region-2d]').click();expect(page.locator('svg.space-cad-svg')).to_be_visible()
                check(version+'_2d_same_id',page.locator('svg .space-region-selected').get_attribute('data-space-region')==chosen['id'])
                check(version+'_2d_original_entities',page.locator('svg [data-entity-id]').count()==6722)
                page.screenshot(path=str(folder/'2d.png'));page.locator('[data-space-mode="3d"]').click();ready()
                check(version+'_return_3d_selection',diag()['selectedSpatialId']==chosen['id'])
                page.locator('[data-space-scenario]').click();check(version+'_legacy_simulation_marked',diag()['simulated'] and all(n>0 for n in diag()['activeOperations'].values()))
                page.locator('#space-simulated').uncheck();check(version+'_simulation_can_disable',not diag()['simulated'] and all(n==0 for n in diag()['activeOperations'].values()))
                if version=='v2':
                    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(200)
                    page.locator('[data-space-drawer-toggle]').click();expect(page.locator('#space-controls-panel')).to_have_attribute('aria-modal','true')
                    page.screenshot(path=str(folder/'mobile-drawer.png'));page.keyboard.press('Escape')
                    check('v2_drawer_focus_return',page.locator('[data-space-drawer-toggle]').evaluate('e=>e===document.activeElement'))
                    before=diag()['cameraPosition'];b=page.locator('canvas.space-webgl').bounding_box();x=b['x']+b['width']*.5;y=b['y']+b['height']*.55
                    cdp=context.new_cdp_session(page);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+35,'y':y+15,'id':1}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(100)
                    check('v2_mobile_touch_rotation',diag()['cameraPosition']!=before)
                    page.locator('#space-inspector-details>summary').click();expect(page.locator('#space-inspector-details')).to_have_attribute('open','')
                    page.screenshot(path=str(folder/'mobile-inspector.png'));page.keyboard.press('Escape')
                    check('v2_mobile_inspector_close',not page.locator('#space-inspector-details').evaluate('e=>e.open'))
                # Same C3 app and report must work after destroying the spatial view.
                page.set_viewport_size({'width':1440,'height':1000});page.locator('#nav a[href="#report"]').click()
                expect(page.locator('.report-paper')).to_contain_text('Evidence-to-Decision')
                check(version+'_report11_preserved','1.1' in page.locator('.report-banner').inner_text() and page.locator('.report-paper h2').count()==14)
                check(version+'_v2_scope_removed',not page.locator('#content').evaluate('e=>e.classList.contains("space-v2-stage1")'))
                check(version+'_webgl_disposed',page.locator('canvas.space-webgl').count()==0)
                expect(page.locator('.mock-banner')).to_contain_text('MOCK')
                check(version+'_no_fake_inference',page.locator('[data-action="analyze"]').is_disabled())
                for label in ['FACT','INFERENCE','INSUFFICIENT_EVIDENCE']:check(version+'_classification_'+label,label in page.locator('.report-paper').inner_text())
                # Equal pointer position and settled navigation transitions for pixel comparison.
                page.mouse.move(1400,5);page.wait_for_timeout(300)
                page.screenshot(path=str(folder/'c3-report.png'),animations='disabled');report_images[version]=folder/'c3-report.png'
                report=page.request.get(base+'report.json').json()
                check(version+'_evidence_references',all(i in report['evidence'] for group in ['claims','diagnoses','options','experiments'] for item in report['decision_analysis'][group] for i in item['evidence_ids']))
                check(version+'_mock_provenance',report['processing_method']=='MOCK' and not report['generation']['model_inference_executed'])
                for kind in ['video','audio']:
                    evidence=next(k for k,v in report['evidence_index'].items() if v['source']==kind)
                    button=page.locator(f'.report-paper [data-evidence="{evidence}"]').first
                    button.click();expect(page.locator('#evidence-dialog')).to_be_visible()
                    page.wait_for_function('(kind)=>document.querySelector("#evidence-content "+kind)?.readyState>=1',arg=kind)
                    expected=report['evidence_index'][evidence]['media_time']
                    check(version+'_'+kind+'_evidence_seek',abs(page.locator('#evidence-content '+kind).evaluate('e=>e.currentTime')-expected)<.3)
                    page.locator('#close-dialog').click()
                for ext in ['md','json']:
                    with page.expect_download() as download:page.locator(f'.report-export a[href="./report.{ext}"]').click()
                    download.value.save_as(str(folder/f'report.{ext}'));check(version+'_export_'+ext,(folder/f'report.{ext}').stat().st_size>1000)
                for route,selector in [('timeline','.timeline-list'),('feedback','#content'),('insights','#content'),('capture','#content')]:
                    page.locator(f'#nav a[href="#{route}"]').click();expect(page.locator(selector)).to_be_visible()
                    check(version+'_route_'+route,len(page.locator('#content').inner_text())>50)
                page.locator('#nav a[href="#space"]').click();ready();check(version+'_return_to_space',bool(diag().get('presentation'))==(version=='v2'))
                if version=='v2':
                    check('v2_css_selectors_are_scoped',page.evaluate('''()=>[...document.styleSheets].filter(s=>s.href?.includes('space-v2.css')).every(s=>[...s.cssRules].every(r=>r.cssRules?[...r.cssRules].every(c=>c.selectorText?.startsWith('.space-v2-stage1')):r.selectorText?.startsWith('.space-v2-stage1')))'''))
                    page.locator('.space-v2-view-tag a').click();ready();check('v2_back_to_original',page.url.split('#')[0].endswith('index.html') and 'presentation' not in diag())
                context.close()
            check('architectural_mesh_attributes_identical',geometry['original']==geometry['v2'])
            check('same_floor_offsets_and_bounds',snapshots['original']['floorY']==snapshots['v2']['floorY'] and snapshots['original']['fitBoundsNDC']==snapshots['v2']['fitBoundsNDC'])
            for size in SIZES:
                a,b=[m for m in viewports if (m['width'],m['height'])==size]
                check('same_layout_and_navigation_'+str(size),a['map']==b['map'] and a['navigation']==b['navigation'] and a['font']==b['font'])
            from PIL import Image,ImageChops
            same=ImageChops.difference(Image.open(report_images['original']).convert('RGB'),Image.open(report_images['v2']).convert('RGB')).getbbox() is None
            check('c3_report_pixels_identical',same)
            check('no_javascript_errors',not errors);check('no_http_errors',not bad);check('no_webgl_console_errors',not console)
            browser.close()
        result['status']='passed'
    except Exception as exc:
        result.update(status='failed',failure=str(exc),traceback=traceback.format_exc())
        raise
    finally:
        result.update(checks_passed=len(checks),checks=checks,viewports=viewports,
                      javascript_errors=errors,http_errors=bad,console_errors=console,
                      rendering_snapshots=snapshots,architectural_geometry=geometry)
        (out/'acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(json.dumps({k:v for k,v in result.items() if k not in ['checks','viewports','architectural_geometry','rendering_snapshots']},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
