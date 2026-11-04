"""Browser V0.1 acceptance: real loaded assets, computed CSS and evidence media."""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--chromium')
    parser.add_argument('--results',type=Path,default=ROOT/'artifacts/v0.1/acceptance-result.json')
    args=parser.parse_args();results=json.loads(args.results.read_text(encoding='utf-8'))
    out=args.results.parent/'dashboard';out.mkdir(parents=True,exist_ok=True)
    errors=[];resources=[];checks=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1050})
        page.on('pageerror',lambda error:errors.append(str(error)))
        def resource(response):
            if '/static/' in response.url:
                resources.append({'path':response.url.split('/static/')[1],
                    'status':response.status,'content_type':response.headers.get('content-type','')})
        page.on('response',resource)
        for path,content_type in [('/static/style.css','text/css'),('/static/brand.css','text/css'),('/static/app.js','javascript'),('/static/mark.svg','image/svg+xml'),('/static/assets/hubone-logo.svg','image/svg+xml')]:
            response=page.request.get(args.base_url+path)
            assert response.status==200 and content_type in response.headers['content-type']
            assert len(response.body())>100
        page.goto(args.base_url,wait_until='networkidle')
        for kind,sid in [('real',results['real_session_id']),('simulated',results['simulated_session_id'])]:
            page.evaluate('(sid)=>localStorage.setItem("hubone-session",sid)',sid)
            page.reload(wait_until='networkidle')
            expect(page.locator('#session-id')).to_contain_text(sid[:12])
            if kind=='simulated':expect(page.locator('#mode')).to_contain_text('SIMULATED')
            for width in [1440,1024,768,390]:
                page.set_viewport_size({'width':width,'height':1050})
                for tab in ['capture','timeline','feedback','insights','report']:
                    page.locator(f'#nav a[href="#{tab}"]').click()
                    expect(page.locator(f'#nav a[href="#{tab}"]')).to_have_class('nav-link active')
                    style=page.evaluate('''()=>({
                      bg:getComputedStyle(document.body).backgroundColor,
                      sidebar:getComputedStyle(document.querySelector('.sidebar')).position,
                      contentDisplay:getComputedStyle(document.querySelector('#content .card')||document.querySelector('.report-paper')).display,
                      scroll:document.documentElement.scrollWidth, width:innerWidth,
                      cssSheets:document.styleSheets.length,
                      logoLoaded:document.querySelector('.brand img').naturalWidth>0
                    })''')
                    assert style['bg']=='rgb(244, 247, 251)' and style['sidebar']=='fixed'
                    assert style['scroll']<=style['width'] and style['cssSheets']>0 and style['logoLoaded']
                    if tab=='capture':
                        assert page.locator('.stats').evaluate("e=>getComputedStyle(e).display")=='grid'
                        cols=page.locator('.stats').evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').length")
                        assert cols==(4 if width>850 else 2)
                        if kind=='real':
                            expect(page.locator('#video-offset')).to_have_value('2.5')
                            expect(page.locator('#audio-offset')).to_have_value('1.25')
                    if tab=='report':
                        assert page.locator('.report-paper h2').count()>=10
                        expect(page.locator('.report-paper')).to_contain_text('RULE_BASED')
                    if width in (1440,390):
                        page.screenshot(path=str(out/f'{kind}-{tab}-{width}.png'),full_page=True)
                    checks.append({'case':kind,'page':tab,'width':width,'status':'passed'})
            page.set_viewport_size({'width':1440,'height':1050})
            page.locator('#nav a[href="#timeline"]').click()
            expect(page.locator('#content')).to_contain_text('RULE_BASED')
            if kind=='real':
                expect(page.locator('#content')).to_contain_text('REAL_MODEL')
                assert page.locator('[data-origin="REAL_RECORDING_REFERENCE"]').count()>0
                # Fetch the same events the timeline shows, then open exact IDs.
                events=page.request.get(args.base_url+f'/api/sessions/{sid}/events').json()
                video=next(e for e in events if e['source']=='video')
                audio=next(e for e in events if e['source']=='audio')
                for event in [video,audio]:
                    page.locator(f'[data-evidence="{event["event_id"]}"]').first.click()
                    expect(page.locator('#evidence-dialog')).to_be_visible()
                    if event['source']=='video':
                        page.wait_for_function('document.querySelector("#evidence-content img")?.naturalWidth > 0')
                        page.wait_for_function('document.querySelector("#evidence-content video")?.videoWidth > 0')
                    else:
                        page.wait_for_function('document.querySelector("#evidence-content audio")?.readyState >= 1')
                        expect(page.locator('#evidence-content')).to_contain_text('REAL_MODEL')
                    page.locator('#close-dialog').click()
            page.locator('#nav a[href="#report"]').click()
            with page.expect_download() as download:
                page.get_by_text('↓ 导出 Markdown',exact=True).click()
            download.value.save_as(str(out/f'{kind}-download.md'))
        assert not errors,errors
        assert resources and all(r['status'] in (200,304) for r in resources)
        browser.close()
    result={'status':'passed','layout_checks':checks,'loaded_static_resources':resources,
            'javascript_errors':errors,'real_video_and_audio_evidence_loaded':True,'markdown_download':True}
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print('V0.1 Dashboard acceptance passed:',len(checks),'layout checks; CSS/JS/SVG and real media evidence loaded.')


if __name__=='__main__':
    main()
