"""Verify the static build under the /hub-on/ GitHub Pages prefix, without a backend."""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:8021/hub-on/')
    parser.add_argument('--chromium')
    args=parser.parse_args()
    out=ROOT/'artifacts/v0.2/pages';out.mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];bad=[]
    with sync_playwright() as p:
        b=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
        page=b.new_page(viewport={'width':1440,'height':1100})
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
        page.add_init_script("localStorage.setItem('hubone-space-view','2d')")
        page.goto(args.url,wait_until='networkidle')
        page.locator('[data-space-mode="2d"]').click()
        expect(page.locator('#space-map-title')).to_contain_text('1F')
        expect(page.locator('.space-preview-note')).to_be_visible()
        expect(page.locator('.c3-preview-note')).not_to_be_visible()
        assert page.locator('svg [data-entity-id]').count()==5842
        assert page.locator('#space-simulated').is_checked() is False
        checks.append('default_real_cad_space_at_project_prefix')
        floor=page.evaluate("async()=>await (await fetch('/api/v1/floors/floor_1/geometry')).json()")
        assert floor['source']['sha256']=='7843ed6b0ba393213ddcd2bb54187acd9f41cec346702a0e6f32717c0f6b8b48'
        assert floor['vertical_reference']['floor_elevation_mm'] is None
        checks.append('original_xyz_identity_and_unknown_height_preserved')
        box=page.locator('#space-map').bounding_box()
        original=page.locator('svg.space-cad-svg').get_attribute('viewBox')
        page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.wheel(0,-350)
        page.wait_for_function('document.querySelector("#space-zoom").textContent!=="100%"')
        zoomed=page.locator('svg.space-cad-svg').get_attribute('viewBox')
        page.mouse.down();page.mouse.move(box['x']+box['width']/2+50,box['y']+box['height']/2+30,steps=6);page.mouse.up()
        assert page.locator('svg.space-cad-svg').get_attribute('viewBox')!=zoomed
        page.locator('[data-space-zoom="fit"]').click()
        assert page.locator('svg.space-cad-svg').get_attribute('viewBox')==original
        checks.extend(['wheel_zoom','pointer_pan','fit_reset'])
        page.locator('svg text[data-source-handle="50A5"]').click()
        expect(page.locator('#space-selection')).to_contain_text('50A5')
        with page.expect_download() as download:page.locator('[data-space-object-api]').click()
        download.value.save_as(str(out/'object.json'))
        obj=json.loads((out/'object.json').read_text(encoding='utf-8'));assert obj['source_handle']=='50A5' and obj['source_entity']['dxf']['handle']=='50A5'
        checks.append('source_object_inspection_and_json_download')
        for kind in ['svg','json']:
            with page.expect_download() as download:page.locator(f'#space-download-{kind}').click()
            download.value.save_as(str(out/f'floor_1.{kind}'))
            checks.append('static_download_'+kind)
        with page.expect_download() as download:page.locator('.space-report-link').click()
        download.value.save_as(str(out/'CAD-report.md'))
        checks.append('cad_report_download')
        with page.expect_download() as download:page.locator('.space-bridge a').click()
        download.value.save_as(str(out/'Space-API.md'))
        assert '/api/v1/floors' in (out/'Space-API.md').read_text(encoding='utf-8')
        checks.append('api_document_download_without_backend_or_main_source')
        page.locator('[data-space-tool="area"]').click()
        page.mouse.move(box['x']+box['width']*.2,box['y']+box['height']*.3);page.mouse.down()
        page.mouse.move(box['x']+box['width']*.7,box['y']+box['height']*.7,steps=8);page.mouse.up()
        expect(page.locator('#space-selection')).to_contain_text('TEMPORARY SELECTION')
        assert page.locator('.space-object-selected').count()>0
        page.locator('[data-space-tool="pan"]').click();checks.append('temporary_region_selection')
        page.locator('.space-cad-layers summary').click()
        page.locator('[data-cad-layer-control="Q◆01 原始墙柱"]').uncheck()
        assert page.locator('g[data-cad-layer="Q◆01 原始墙柱"]').evaluate('e=>getComputedStyle(e).display')=='none'
        page.locator('[data-cad-layer-control="Q◆01 原始墙柱"]').check()
        page.locator('.space-cad-layers summary').click();checks.append('original_layer_control')
        page.screenshot(path=str(out/'space-floor-1.png'),full_page=True)
        page.locator('[data-space-floor="floor_2"]').click()
        expect(page.locator('#space-map-title')).to_contain_text('2F')
        assert page.locator('svg [data-entity-id]').count()==6722
        expect(page.locator('#space-map-notice')).to_contain_text('二层 PDF 核对待补充')
        checks.append('independent_floor_2_and_reference_warning')
        page.locator('[data-space-layer="cameras"]').check();page.locator('[data-space-layer="coverage"]').check()
        assert page.locator('[data-space-camera]').count()==0
        page.locator('#space-simulated').check()
        expect(page.locator('[data-space-device-layer="cameras"] circle')).to_be_visible()
        expect(page.locator('[data-space-device-layer="coverage"] path')).to_be_visible()
        page.locator('[data-space-device-layer="cameras"] circle').click()
        expect(page.locator('#space-selection')).to_contain_text('SIMULATED')
        checks.append('explicit_simulated_camera_and_fov')
        page.locator('#space-simulated').uncheck();expect(page.locator('[data-space-camera]')).to_have_count(0)
        for width in [1440,1024,768,390]:
            page.set_viewport_size({'width':width,'height':1100})
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            page.screenshot(path=str(out/f'space-floor-2-{width}.png'),full_page=True)
            checks.append(f'space_responsive_{width}')
        for width in [1440,390]:
            page.set_viewport_size({'width':width,'height':1100})
            for tab in ['capture','timeline','feedback','insights','report']:
                page.locator(f'#nav a[href="#{tab}"]').click()
                expect(page.locator('.c3-preview-note')).to_be_visible()
                expect(page.locator('#mode')).to_contain_text('SIMULATED')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                if tab=='capture':
                    page.wait_for_function('document.querySelector("#experience-video")?.videoWidth>0')
                    assert page.locator('input[type=file]').first.is_disabled()
                if tab=='report':expect(page.locator('.report-paper')).to_contain_text('SIMULATED')
                checks.append(f'c3_replay_{tab}_{width}')
        page.locator('#nav a[href="#space"]').click();expect(page.locator('#space-map-title')).to_contain_text('2F')
        checks.append('space_return_after_c3_replay')
        assert not errors,errors
        assert not bad,bad
        b.close()
    (out/'result.json').write_text(json.dumps({'status':'passed','checks':checks,'javascript_errors':errors,'http_errors':bad,'base_url':args.url},ensure_ascii=False,indent=2),encoding='utf-8')
    print('Pages preview passed:',len(checks),'checks; no backend, project prefix, actual CAD and C3 replay.')


if __name__=='__main__':main()
