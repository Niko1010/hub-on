"""V0.4 visual/responsive/interaction acceptance; Chromium software WebGL, not a GPU benchmark."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]
SIZES=[(2048,972),(1920,1080),(1440,900),(1024,768),(390,844)]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:8018/#space')
    parser.add_argument('--chromium',default='/usr/bin/chromium')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/v0.4')
    args=parser.parse_args();out=args.output;(out/'after').mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];bad=[];console=[];viewports=[]
    def check(name,condition=True):
        if not condition:raise AssertionError(name)
        checks.append(name)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
        context=browser.new_context(viewport={'width':2048,'height':972},has_touch=True,device_scale_factor=1)
        page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
        page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
        page.goto(args.url,wait_until='networkidle')
        def ready():page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().triangles>1000',timeout=60000)
        def diag():return page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.getDiagnostics()')
        def fit_ok():
            b=diag()['fitBoundsNDC'];return b['minX']>=-.94 and b['maxX']<=.94 and b['minY']>=-.94 and b['maxY']<=.94
        def drawer():
            if page.viewport_size['width']<1200 and not page.locator('[data-space-drawer-toggle]').get_attribute('aria-expanded')=='true':
                page.locator('[data-space-drawer-toggle]').click()
        ready();check('same_threejs_engine',diag()['engine']=='Three.js r180')
        check('only_two_original_floors',set(diag()['visibleFloors'])=={'floor_1','floor_2'})
        check('no_live_data_claims',not diag()['simulated'] and all(v==0 for v in diag()['activeOperations'].values()))
        for w,h in SIZES:
            page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250)
            page.locator('[data-space-zoom="fit"]').click();page.wait_for_timeout(100)
            m=page.evaluate('''()=>{const r=document.querySelector('#space-map').getBoundingClientRect(),s=getComputedStyle(document.body),root=getComputedStyle(document.documentElement);const small=[...document.querySelectorAll('body *')].filter(e=>e.offsetWidth&&e.offsetHeight&&!e.closest('svg')&&!e.childElementCount&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<12);return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,map:{x:r.x,y:r.y,width:r.width,height:r.height},sidebarPosition:getComputedStyle(document.querySelector('.sidebar')).position,fontFamily:s.fontFamily,interLoaded:document.fonts.check('500 14px Inter'),titleSize:parseFloat(getComputedStyle(document.querySelector('#page-title')).fontSize),smallText:small.map(e=>({class:e.className,text:e.textContent.trim().slice(0,30),size:getComputedStyle(e).fontSize})),inspectorOpen:document.querySelector('#space-inspector-details').open}}''')
            check(f'{w}x{h}_no_outer_scroll',m['scrollWidth']<=w and m['scrollHeight']<=h+1)
            check(f'{w}x{h}_fixed_brand_navigation',m['sidebarPosition']=='fixed')
            check(f'{w}x{h}_map_is_primary',m['map']['height']>=h*.4 and m['map']['y']>=0 and m['map']['y']+m['map']['height']<=h)
            check(f'{w}x{h}_font_system',m['fontFamily'].startswith('Inter') and m['interLoaded'] and 24<=m['titleSize']<=28 and not m['smallText'])
            check(f'{w}x{h}_complete_fit',fit_ok())
            if w<1200:check(f'{w}x{h}_collapsed_inspector',not m['inspectorOpen'])
            if w>=1440:check(f'{w}x{h}_model_width',m['map']['width']>=w*.45)
            m['rendering']=diag()['rendering'];m['bounds']=diag()['fitBoundsNDC'];viewports.append(m)
            page.screenshot(path=str(out/'after'/f'{w}x{h}.png'))
        contrast=page.evaluate('''()=>{const s=getComputedStyle(document.documentElement),lum=hex=>{let a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;};return ['--text-primary','--text-secondary','--text-muted'].map(k=>({token:k,onPanel:(lum('#ffffff')+.05)/(lum(s.getPropertyValue(k).trim())+.05),onPage:(lum(s.getPropertyValue('--surface-page').trim())+.05)/(lum(s.getPropertyValue(k).trim())+.05)}));}''')
        check('design_token_contrast',all(min(c['onPanel'],c['onPage'])>=4.5 for c in contrast))
        page.set_viewport_size({'width':1440,'height':900});page.wait_for_timeout(250)
        d=diag();check('architectural_materials',d['rendering']['wallColor']=='f1eee7' and d['rendering']['glassColor']=='91c6d1' and d['rendering']['slabColor']=='dfe1df')
        check('desktop_real_ssao',d['rendering']['ambientOcclusion']=='SSAO' and d['rendering']['aoSamples']==16)
        check('soft_shadows_and_environment',d['rendering']['shadowMapSize']==2048 and d['rendering']['environment']=='RoomEnvironment')
        check('mobile_quality_scaling',viewports[-1]['rendering']['ambientOcclusion']=='OFF_COMPACT_VIEW')
        b=page.locator('canvas.space-webgl').bounding_box();x=b['x']+b['width']*.5;y=b['y']+b['height']*.55
        old=diag()['cameraPosition'];page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+55,y+25,steps=7);page.mouse.up()
        check('orbit_preserved',diag()['cameraPosition']!=old)
        old=diag()['cameraTarget'];page.mouse.move(x,y);page.mouse.down(button='right');page.mouse.move(x+35,y+18,steps=6);page.mouse.up(button='right')
        check('pan_preserved',diag()['cameraTarget']!=old)
        old=diag()['zoom'];page.mouse.move(x,y);page.mouse.wheel(0,-240);page.wait_for_timeout(100);check('zoom_preserved',diag()['zoom']!=old)
        page.locator('[data-space-isometric]').click();check('view_reset_preserved',abs(diag()['zoom']-1)<1e-6 and fit_ok())
        page.locator('#space-exploded').check();check('exploded_view_preserved',diag()['floorY']['floor_2']>10 and diag()['floorY']['floor_1']==0)
        page.screenshot(path=str(out/'after/exploded.png'));page.locator('#space-exploded').uncheck()
        page.locator('[data-space-floor="floor_2"]').click();ready();check('floor_switch_preserved',diag()['visibleFloors']==['floor_2'])
        page.locator('.space-assets summary').click();page.locator('[data-space-asset="columns"]').uncheck()
        check('columns_hide_preserved',diag()['activeAssets']['columns']==0)
        page.screenshot(path=str(out/'after/columns-hidden.png'));page.locator('[data-space-asset="columns"]').check();check('columns_restore_preserved',diag()['activeAssets']['columns']>0)
        chosen=None
        candidates=[r for r in diag()['regions'] if 50<r['area_m2']<2200]
        for region in sorted(candidates,key=lambda r:r['area_m2'],reverse=True):
            q=page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.projectRegion(id)',region['id'])
            b=page.locator('canvas.space-webgl').bounding_box()
            if not q or not(b['x']+5<q['x']<b['x']+b['width']-5 and b['y']+5<q['y']<b['y']+b['height']-5):continue
            page.mouse.click(q['x'],q['y'])
            if diag()['selectedSpatialId']==region['id']:chosen=region;break
        check('actual_region_raycast',chosen is not None)
        expect(page.locator('#space-selection')).to_contain_text(chosen['id'])
        check('inspector_and_highlight_linked',page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.regionMeshes.get(id).material.opacity>.3',chosen['id']))
        page.locator('[data-space-focus-region]').click()
        page.wait_for_function('document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().focusAnimating===false',timeout=10000)
        check('smooth_region_focus',diag()['focusedRegionId']==chosen['id'] and diag()['zoom']>1)
        page.screenshot(path=str(out/'after/region-focus.png'))
        page.locator('[data-space-zoom="fit"]').click();check('fit_after_focus',fit_ok() and abs(diag()['zoom']-1)<1e-6)
        page.locator('[data-space-region-2d]').click();expect(page.locator('svg.space-cad-svg')).to_be_visible()
        check('shared_spatial_id_in_2d',page.locator('svg [data-space-region].space-region-selected').get_attribute('data-space-region')==chosen['id'])
        check('original_second_floor_geometry',page.locator('svg [data-entity-id]').count()==6722)
        page.locator('[data-space-mode="3d"]').click();ready();check('return_3d_selection',diag()['selectedSpatialId']==chosen['id'])
        page.locator('[data-space-scenario]').click();check('explicit_simulated_layers',diag()['simulated'] and all(v>0 for v in diag()['activeOperations'].values()))
        for layer in ['cameras','coverage','activity','heatmap','trajectories','experience','events']:
            page.locator(f'[data-space-layer="{layer}"]').uncheck();check('layer_'+layer+'_off',diag()['activeOperations'][layer]==0)
            page.locator(f'[data-space-layer="{layer}"]').check()
        page.locator('#space-simulated').uncheck();check('remove_simulated_data',not diag()['simulated'] and all(v==0 for v in diag()['activeOperations'].values()))
        page.set_viewport_size({'width':1024,'height':768});page.wait_for_timeout(200)
        drawer();expect(page.locator('#space-controls-panel')).to_be_visible();check('tablet_drawer_modal',page.locator('#space-controls-panel').get_attribute('aria-modal')=='true')
        page.keyboard.press('Escape');check('drawer_escape_returns_focus',page.locator('[data-space-drawer-toggle]').evaluate('e=>document.activeElement===e'))
        page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(200);drawer();page.screenshot(path=str(out/'after/mobile-drawer.png'))
        check('mobile_drawer_within_viewport',page.locator('#space-controls-panel').bounding_box()['x']+page.locator('#space-controls-panel').bounding_box()['width']<=390)
        page.keyboard.press('Escape');before=diag()['cameraPosition'];b=page.locator('canvas.space-webgl').bounding_box();x=b['x']+b['width']*.5;y=b['y']+b['height']*.55
        cdp=context.new_cdp_session(page);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':1}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+35,'y':y+15,'id':1}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(100)
        check('mobile_touch_rotation',diag()['cameraPosition']!=before)
        page.locator('[data-space-zoom="fit"]').click()
        initial_height=page.locator('#space-map').bounding_box()['height'];page.locator('#space-inspector-details>summary').click()
        expect(page.locator('#space-inspector-details')).to_have_attribute('open','')
        check('mobile_inspector_no_canvas_reflow',abs(page.locator('#space-map').bounding_box()['height']-initial_height)<2)
        page.screenshot(path=str(out/'after/mobile-inspector.png'));page.keyboard.press('Escape')
        check('inspector_escape_collapse',not page.locator('#space-inspector-details').evaluate('e=>e.open'))
        check('no_javascript_errors',not errors);check('no_http_errors',not bad);check('no_webgl_console_errors',not console)
        browser.close()
    result={'status':'passed','checks_passed':len(checks),'checks':checks,'viewports':viewports,'contrast':contrast,
        'javascript_errors':errors,'http_errors':bad,'console_errors':console,'browser':'Chromium / SwiftShader',
        'gpu_performance_verified':False,'real_camera_or_microphone_used':False,'url':args.url}
    (out/'acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k not in ['checks','viewports','contrast']},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
