"""Real browser SOFTWARE acceptance. No camera, microphone, GPU or model calls."""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--chromium',default='/usr/bin/chromium')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/decision/browser')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];http_errors=[]
    def check(name,condition=True):
        if not condition: raise AssertionError(name)
        checks.append(name)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1440,'height':1050},accept_downloads=True)
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.on('response',lambda r:http_errors.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
        page.goto(args.base_url+'/#report',wait_until='networkidle')
        expect(page.locator('#health')).to_have_text('研究服务在线')
        page.locator('[data-action="research-demo"]').first.click()
        expect(page.locator('.mock-banner')).to_be_visible(timeout=30000)
        expect(page.locator('.report-paper')).to_contain_text('Evidence-to-Decision')
        check('mock_demo_from_ui')
        check('research_css_loaded',page.locator('.decision-summary').evaluate('e=>getComputedStyle(e).display')=='flex')
        check('ten_report_sections',page.locator('.report-paper h2').count()==10)
        for token in ['FACT','INFERENCE','INSUFFICIENT_EVIDENCE','MOCK','SIMULATED']:
            check('report_label_'+token,token in page.locator('.report-paper').inner_text())
        values=page.locator('#analysis-provider option').evaluate_all('(els)=>els.map(e=>e.value)')
        check('valid_llm_rules_mock_options',set(values)=={'llm','rules','mock'})
        page.locator('#analysis-provider').select_option('llm')
        expect(page.locator('#analysis-provider')).to_have_value('llm')
        check('llm_option_selectable_no_call')
        page.locator('.decision-summary [data-evidence]').first.click()
        expect(page.locator('#evidence-dialog')).to_be_visible()
        expect(page.locator('#evidence-content')).to_contain_text('MOCK')
        check('click_citation_opens_raw_evidence')
        sid=page.evaluate('localStorage.getItem("hubone-session")')
        report=page.request.get(args.base_url+f'/api/sessions/{sid}/report').json()
        has_media=any(e.get('asset_id') for e in report['quotes'])
        if has_media:
            audio=page.locator('#evidence-content audio')
            expect(audio).to_have_count(1)
            page.wait_for_function('()=>document.querySelector("#evidence-content audio").readyState>=1')
            check('audio_file_loaded_at_evidence_offset',abs(audio.evaluate('a=>a.currentTime')-5)<.25)
        page.screenshot(path=str(args.output/'evidence-dialog.png'))
        page.locator('#close-dialog').click()
        for ext in ('md','json'):
            with page.expect_download() as download:
                page.locator(f'a[href$="/report.{ext}"]').click()
            download.value.save_as(args.output/f'download-report.{ext}')
            check('download_'+ext,(args.output/f'download-report.{ext}').stat().st_size>1000)
        page.locator('.research-brief summary').click()
        page.locator('#research-question').fill('如何用真实对照任务区分穿戴设置与接触结构的影响？')
        page.locator('[data-action="save-research"]').click()
        expect(page.locator('.report-paper')).to_have_count(0)
        expect(page.locator('.research-question')).to_contain_text('真实对照任务')
        check('research_edit_invalidates_report')
        page.locator('#analysis-provider').select_option('mock')
        page.locator('[data-action="analyze"]').click()
        expect(page.locator('.mock-banner')).to_be_visible(timeout=30000)
        expect(page.locator('.report-paper')).to_contain_text('真实对照任务')
        check('regenerate_mock_with_new_question')
        for width in (1440,1024,768,390):
            page.set_viewport_size({'width':width,'height':1050})
            page.evaluate('scrollTo(0,0)')
            page.wait_for_timeout(100)
            check('no_horizontal_overflow_'+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            page.screenshot(path=str(args.output/f'report-{width}.png'))
        created=page.request.post(args.base_url+'/api/sessions',data={'name':'Browser non-simulated policy test','simulated':False}).json()
        page.reload(wait_until='networkidle')
        page.locator('#session-select').select_option(created['session_id'])
        expect(page.locator('#session-id')).to_contain_text(created['session_id'][:12])
        check('mock_hidden_for_non_simulated_session',page.locator('#analysis-provider option[value="mock"]').count()==0)
        page.locator('#session-select').select_option(sid)
        expect(page.locator('.mock-banner')).to_be_visible()
        check('no_javascript_errors',not errors)
        check('no_http_errors',not http_errors)
        browser.close()
    result={'status':'passed_software_browser','checks_passed':len(checks),'checks':checks,'session_id':sid,
            'javascript_errors':errors,'http_errors':http_errors,'model_inference_executed':False,
            'camera_microphone_verified':False,'gpu_performance_verified':False,'media_playback':'bundled SIMULATED files only' if has_media else 'no media attached'}
    (args.output/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False,indent=2))


if __name__=='__main__': main()
