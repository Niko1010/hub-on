"""Browser acceptance of actual CAD assets, interaction and existing C3 pages.

Requires Playwright separately from production dependencies. Creates one clearly
SIMULATED text-only C3 session in the chosen acceptance server's database.
"""
import argparse
import json
from pathlib import Path
import time

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url', default='http://127.0.0.1:8013')
    parser.add_argument('--chromium', help='Optional system Chromium; otherwise use the Playwright installation')
    parser.add_argument('--output', type=Path, default=ROOT/'artifacts/v0.2/browser')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    checks, errors, failed_resources = [], [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1100})
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda r: failed_resources.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
        page.add_init_script("localStorage.setItem('hubone-space-view','2d')")
        page.goto(args.base_url+'/#space', wait_until='networkidle')
        page.locator('[data-space-mode="2d"]').click()
        page.locator('[data-space-floor="floor_1"]').click()
        expect(page.locator('#space-map-title')).to_contain_text('1F')
        expect(page.locator('#space-entity-count')).to_have_text('5,842')
        assert page.locator('svg.space-cad-svg [data-entity-id]').count() == 5842
        assert page.locator('#space-simulated').is_checked() is False
        assert page.locator('[data-space-device-layer="cameras"] circle').count() == 0
        checks.append('actual_cad_floor_1_and_default_data_isolation')

        def view():
            return list(map(float, page.locator('svg.space-cad-svg').get_attribute('viewBox').split()))

        original = view();box = page.locator('#space-map').bounding_box()
        page.mouse.move(box['x']+box['width']/2, box['y']+box['height']/2)
        page.mouse.wheel(0,-450)
        page.wait_for_function('Number(document.querySelector("#space-zoom").textContent.replace("%","")) > 100')
        assert view()[2] < original[2]
        before = view()
        page.mouse.move(box['x']+box['width']*.5,box['y']+box['height']*.5)
        page.mouse.down();page.mouse.move(box['x']+box['width']*.5+60,box['y']+box['height']*.5+40,steps=8);page.mouse.up()
        assert abs(view()[0]-before[0])>100 and view()[2] == before[2]
        page.locator('[data-space-zoom="fit"]').click();assert view()==original
        checks.extend(['mouse_wheel_zoom','pointer_drag_pan','fit_reset'])

        page.locator('svg text[data-source-handle="50A5"]').click()
        expect(page.locator('#space-selection')).to_contain_text('50A5')
        expect(page.locator('#space-selection')).to_contain_text('DIM_SYMB')
        assert page.locator('.space-object-selected').count()==1
        checks.append('object_inspector_original_handle_layer_xyz_and_matrix')
        page.locator('[data-space-tool="area"]').click()
        page.mouse.move(box['x']+box['width']*.2,box['y']+box['height']*.3)
        page.mouse.down();page.mouse.move(box['x']+box['width']*.65,box['y']+box['height']*.7,steps=10);page.mouse.up()
        expect(page.locator('#space-selection')).to_contain_text('TEMPORARY SELECTION')
        assert page.locator('.space-object-selected').count()>0
        checks.append('temporary_region_selection_without_inventing_business_zones')
        page.locator('[data-space-tool="pan"]').click()
        page.locator('.space-cad-layers summary').click()
        raw = page.locator('[data-cad-layer-control="Q◆01 原始墙柱"]')
        raw.uncheck()
        assert page.locator('g[data-cad-layer="Q◆01 原始墙柱"]').evaluate('e=>getComputedStyle(e).display')=='none'
        raw.check()
        inherited=page.locator('g[data-cad-layer="Q◆01 原始墙柱"] [data-entity-id]').first
        page.locator('[data-cad-layer-control="0"]').uncheck()
        assert inherited.evaluate('e=>getComputedStyle(e).display')=='none'
        page.locator('[data-cad-layer-control="0"]').check()
        assert inherited.evaluate('e=>getComputedStyle(e).display')!='none'
        checks.append('inherited_insert_layer_visibility')
        page.locator('[data-space-layer="structure"]').uncheck()
        assert page.locator('svg [data-cad-layer]').first.evaluate('e=>getComputedStyle(e).display')=='none'
        page.locator('[data-space-layer="structure"]').check()
        page.locator('.space-cad-layers summary').click()
        checks.extend(['original_cad_layer_toggle','structure_layer_toggle'])

        page.locator('[data-space-floor="floor_2"]').click()
        expect(page.locator('#space-map-title')).to_contain_text('2F')
        expect(page.locator('#space-entity-count')).to_have_text('6,722')
        expect(page.locator('#space-map-notice')).to_contain_text('二层 PDF 核对待补充')
        assert page.locator('svg.space-cad-svg [data-entity-id]').count()==6722
        expect(page.locator('#space-selection')).to_contain_text('从地图开始探索')
        checks.append('independent_floor_2_geometry_and_reference_warning')
        page.locator('[data-space-layer="cameras"]').check()
        page.locator('[data-space-layer="coverage"]').check()
        assert page.locator('[data-space-camera]').count()==0
        page.locator('#space-simulated').check()
        expect(page.locator('[data-space-device-layer="cameras"] circle')).to_be_visible()
        expect(page.locator('[data-space-device-layer="coverage"] path')).to_be_visible()
        page.locator('[data-space-device-layer="cameras"] circle').click()
        expect(page.locator('#space-selection')).to_contain_text('SIMULATED')
        expect(page.locator('#space-selection')).to_contain_text('NOT CONNECTED')
        page.screenshot(path=str(args.output/'floor-2-simulated-camera.png'),full_page=True)
        page.locator('#space-simulated').uncheck()
        expect(page.locator('[data-space-camera]')).to_have_count(0)
        checks.extend(['camera_and_fov_opt_in_simulated_only','camera_inspector_no_stream_or_height_claim'])

        for width in [1440,1024,768,390]:
            page.set_viewport_size({'width':width,'height':1100})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            assert page.locator('#space-map').bounding_box()['width']>180
            assert page.locator('.brand-logo').evaluate('e=>e.naturalWidth>0')
            page.screenshot(path=str(args.output/f'floor-2-{width}.png'),full_page=True)
            checks.append(f'space_layout_{width}')
        page.set_viewport_size({'width':1440,'height':1100})
        page.locator('[data-space-floor="floor_1"]').click()
        expect(page.locator('#space-map-title')).to_contain_text('1F')
        page.screenshot(path=str(args.output/'floor-1-desktop.png'),full_page=True)
        for kind in ['svg','json']:
            with page.expect_download() as download:
                page.locator(f'#space-download-{kind}').click()
            download.value.save_as(str(args.output/f'export-floor-1.{kind}'))
        checks.append('download_actual_svg_and_geometry_json')

        # Existing C3 workflow, without running vision/ASR or declaring it real.
        response=page.request.post(args.base_url+'/api/sessions',data={'name':'V0.2 浏览器回归 / SIMULATED','simulated':True})
        assert response.status==201;sid=response.json()['session_id']
        response=page.request.post(args.base_url+f'/api/sessions/{sid}/transcripts',data={'segments':[
            {'start':1,'end':3,'text':'SIMULATED：穿起来还可以，但是腰部有点紧。'},
            {'start':5,'end':7,'text':'SIMULATED：上坡的时候感觉助力还不错。'},
            {'start':9,'end':11,'text':'SIMULATED：走久了之后感觉有一点重。'}]})
        assert response.ok
        job=page.request.post(args.base_url+f'/api/sessions/{sid}/analyze',data={'provider':'rules'}).json()
        deadline=time.monotonic()+30
        while time.monotonic()<deadline:
            status=page.request.get(args.base_url+f'/api/sessions/{sid}/jobs/{job["job_id"]}').json()
            if status['status']=='completed':break
            assert status['status']!='failed',status
            time.sleep(.2)
        else:raise AssertionError('C3 rule analysis timed out')
        page.evaluate('(sid)=>localStorage.setItem("hubone-session",sid)',sid)
        page.goto(args.base_url+'/#capture',wait_until='networkidle')
        page.reload(wait_until='networkidle')
        expect(page.locator('#mode')).to_contain_text('SIMULATED')
        for width in [1440,1024,768,390]:
            page.set_viewport_size({'width':width,'height':1100})
            for tab in ['capture','timeline','feedback','insights','report']:
                page.locator(f'#nav a[href="#{tab}"]').click()
                expect(page.locator(f'#nav a[href="#{tab}"]')).to_have_class('nav-link active')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                assert page.locator('.session-bar').is_visible()
                if tab=='report':expect(page.locator('.report-paper')).to_contain_text('SIMULATED')
                checks.append(f'c3_regression_{tab}_{width}')
        assert page.request.get(args.base_url+'/api/v1/events?include_simulated=true').json()['items']==[]
        checks.append('no_automatic_binding_of_unmapped_c3_events')
        assert not errors,errors
        assert not failed_resources,failed_resources
        browser.close()
    result={'status':'passed','checks':checks,'javascript_errors':errors,'failed_resources':failed_resources,
            'c3_regression_session_id':sid,'c3_fixture_origin':'SIMULATED',
            'cad_origin':'USER_PROVIDED_CAD','pdf_floor_2_status':'PENDING_CORRECT_SECOND_FLOOR_PDF'}
    (args.output/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Space acceptance passed: {len(checks)} checks; real CAD, interaction, responsive layout and C3 regression.')


if __name__=='__main__':
    main()
