"""Exercise WebGL pixels/geometry and pointer interaction, not a static render."""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:8015/#space')
    parser.add_argument('--chromium')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/v0.3/browser')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];bad=[];console=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1600,'height':1100})
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
        page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
        page.goto(args.url,wait_until='networkidle')
        def ready():
            page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().triangles>1000',timeout=45000)
        def diag():return page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.getDiagnostics()')
        ready();d=diag()
        assert d['engine']=='Three.js r180' and set(d['visibleFloors'])=={'floor_1','floor_2'}
        assert d['renderCalls']>0 and d['triangles']>1000
        assert not d['simulated'] and all(v==0 for v in d['activeOperations'].values())
        expect(page.locator('.space-model-provenance')).to_contain_text('SIMULATED')
        assert page.locator('[data-space-layer="heatmap"]').is_disabled()
        checks.extend(['real_webgl_geometry_two_actual_floors','explicit_demo_height_provenance','no_connected_operating_data_by_default'])
        assert d['regions'] and all(r['volumeHeight']>1 and r['volumeProvenance']=='SIMULATED' for r in d['regions'])
        checks.append('translucent_spatial_volumes_with_simulated_height')
        box=page.locator('canvas.space-webgl').bounding_box();x=box['x']+box['width']*.5;y=box['y']+box['height']*.45
        before=diag()['cameraPosition'];page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+70,y+35,steps=9);page.mouse.up()
        page.wait_for_function('(before)=>JSON.stringify(document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().cameraPosition)!==JSON.stringify(before)',arg=before)
        checks.append('pointer_orbit_rotation')
        before=diag()['cameraTarget'];page.mouse.move(x,y);page.mouse.down(button='right');page.mouse.move(x+45,y+20,steps=7);page.mouse.up(button='right')
        page.wait_for_function('(before)=>JSON.stringify(document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().cameraTarget)!==JSON.stringify(before)',arg=before)
        checks.append('right_pointer_pan')
        zoom=diag()['zoom'];page.mouse.move(x,y);page.mouse.wheel(0,-320)
        page.wait_for_function('(z)=>document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().zoom!==z',arg=zoom)
        checks.append('orthographic_wheel_zoom')
        page.locator('[data-space-isometric]').click();assert abs(diag()['zoom']-1)<1e-6
        checks.append('isometric_view_reset')
        page.locator('#space-exploded').check()
        page.wait_for_function('document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().floorY.floor_2>10')
        assert diag()['floorY']['floor_1']==0 and diag()['floorY']['floor_2']>10
        checks.append('actual_exploded_floor_transforms')
        page.screenshot(path=str(args.output/'building-exploded.png'),full_page=True)
        page.locator('[data-space-floor="floor_2"]').click();ready()
        page.wait_for_function('document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().visibleFloors.join()==="floor_2"')
        assert diag()['visibleFloors']==['floor_2'];checks.append('independent_second_floor')
        # Click real projected CAD-region geometry and verify the picked ID reaches the inspector.
        selected=None
        candidates=[r for r in diag()['regions'] if r['floor_id']=='floor_2']
        for r in sorted(candidates,key=lambda r:r['area_m2'],reverse=True):
            q=page.locator('canvas.space-webgl').evaluate('(c,id)=>c.__huboneViewer.projectRegion(id)',r['id'])
            b=page.locator('canvas.space-webgl').bounding_box()
            if q and b['x']+5<q['x']<b['x']+b['width']-5 and b['y']+5<q['y']<b['y']+b['height']-5:
                page.mouse.click(q['x'],q['y']);selected=diag()['selectedSpatialId']
                if selected:break
        assert selected
        expect(page.locator('#space-selection')).to_contain_text(selected)
        expect(page.locator('#space-selection')).to_contain_text('NOT CONNECTED')
        checks.append('raycast_region_highlight_and_inspector_link')
        page.screenshot(path=str(args.output/'selected-region.png'),full_page=True)
        page.locator('.space-assets summary').click()
        page.locator('[data-space-asset="walls"]').uncheck();assert diag()['activeAssets']['walls']==0
        page.locator('[data-space-asset="walls"]').check();assert diag()['activeAssets']['walls']>0
        checks.append('space_asset_visibility')
        page.locator('.space-assets summary').click()
        page.locator('[data-space-region-2d]').click()
        expect(page.locator('svg.space-cad-svg')).to_be_visible()
        expect(page.locator(f'[data-space-region="{selected}"]')).to_have_class('space-cad-region space-region-selected')
        assert page.locator('svg [data-entity-id]').count()==6722
        checks.append('same_spatial_id_3d_to_2d_location')
        page.locator('[data-space-mode="3d"]').click();ready();assert diag()['selectedSpatialId']==selected
        checks.append('same_spatial_id_2d_to_3d_return')
        page.locator('[data-space-scenario]').click()
        page.wait_for_function('document.querySelector("canvas.space-webgl").__huboneViewer.getDiagnostics().simulated')
        assert all(diag()['activeOperations'][k]>0 for k in ['activity','heatmap','trajectories','experience','events','cameras','coverage'])
        expect(page.locator('#space-selection')).to_contain_text('SIMULATED')
        expect(page.locator('#space-selection')).to_contain_text('示例原话')
        checks.append('all_seven_simulated_operating_layers')
        camera_point=page.locator('canvas.space-webgl').evaluate("""c=>{const v=c.__huboneViewer;const pin=v.pickables.find(o=>o.isSprite&&o.userData.kind==='camera'&&o.userData.camera.floor_id==='floor_2');const p=pin.getWorldPosition(pin.position.clone()).project(v.camera);const b=c.getBoundingClientRect();return {x:b.x+(p.x+1)*b.width/2,y:b.y+(1-p.y)*b.height/2};}""")
        page.mouse.click(camera_point['x'],camera_point['y'])
        expect(page.locator('#space-selection')).to_contain_text('SIM-floor_2-01')
        expect(page.locator('#space-selection')).to_contain_text('NOT CONNECTED')
        checks.append('camera_asset_raycast_and_unconnected_stream')
        page.locator('canvas.space-webgl').evaluate('(c,id)=>{const v=c.__huboneViewer;const m=v.regionMeshes.get(id);v.onSelect(m.userData.region,m.userData.model);}',selected)

        page.screenshot(path=str(args.output/'demo-inspector.png'),full_page=True)
        for layer in ['heatmap','trajectories','experience','events','cameras','coverage','activity']:
            page.locator(f'[data-space-layer="{layer}"]').uncheck();assert diag()['activeOperations'][layer]==0
            page.locator(f'[data-space-layer="{layer}"]').check();assert diag()['activeOperations'][layer]>0
            checks.append('independent_layer_'+layer)
        page.locator('[data-space-building]').click();assert set(diag()['visibleFloors'])=={'floor_1','floor_2'}
        page.screenshot(path=str(args.output/'building-demo.png'),full_page=True)
        page.locator('#space-simulated').uncheck()
        assert all(v==0 for v in diag()['activeOperations'].values())
        expect(page.locator('#space-selection')).to_contain_text('NOT CONNECTED')
        checks.append('removing_simulation_removes_metrics_and_overlays')
        for width in [1440,1024,768,390]:
            page.set_viewport_size({'width':width,'height':1100})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            assert diag()['triangles']>0
            page.screenshot(path=str(args.output/f'building-{width}.png'),full_page=True)
            checks.append(f'webgl_responsive_{width}')
        page.set_viewport_size({'width':1440,'height':1100})
        page.locator('#nav a[href="#capture"]').click();expect(page.locator('canvas.space-webgl')).to_have_count(0)
        page.locator('#nav a[href="#space"]').click();ready()
        checks.append('dispose_scene_on_c3_navigation_and_reopen')
        assert not errors,errors
        assert not bad,bad
        assert not console,console
        browser.close()
    result={'status':'passed','url':args.url,'checks':checks,'javascript_errors':errors,'http_errors':bad,'console_errors':console,
            'geometry_origin':'CAD_PLAN_DERIVED','heights':'SIMULATED','slabs':'SIMULATED_RECONSTRUCTION','operating_data':'NOT_CONNECTED / opt-in SIMULATED'}
    (args.output/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Interactive 3D acceptance passed:',len(checks),'checks; actual WebGL and pointer interaction.')


if __name__=='__main__':main()
