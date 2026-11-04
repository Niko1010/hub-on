"""Verify the Mock report under /hub-on/; static server must support HTTP Range."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',default='http://127.0.0.1:8032/hub-on/')
    parser.add_argument('--chromium',default='/usr/bin/chromium')
    args=parser.parse_args();out=ROOT/'artifacts/decision/pages';out.mkdir(parents=True,exist_ok=True)
    checks=[];errors=[];bad=[];api_requests=[]
    def check(name,condition=True):
        if not condition: raise AssertionError(name)
        checks.append(name)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
        page=browser.new_page(viewport={'width':1440,'height':1050},accept_downloads=True)
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None)
        page.on('request',lambda r:api_requests.append(r.url) if '/api/' in r.url else None)
        page.goto(args.url+'?v=decision-1#report',wait_until='networkidle')
        expect(page.locator('.c3-preview-note')).to_contain_text('MOCK')
        expect(page.locator('.mock-banner')).to_be_visible()
        expect(page.locator('.report-paper')).to_contain_text('Evidence-to-Decision')
        check('decision_report_available_without_backend')
        report=page.request.get(args.url+'report.json').json()
        check('explicit_mock_no_inference',report['processing_method']=='MOCK' and report['simulated'] and not report['generation']['model_inference_executed'])
        check('research_question_visible',report['research']['question'] in page.locator('.research-question').inner_text())
        check('ten_decision_report_sections',page.locator('.report-paper h2').count()==10)
        for label in ['FACT','INFERENCE','INSUFFICIENT_EVIDENCE']:
            check('classification_'+label,label in page.locator('.report-paper').inner_text())
        check('mock_selected_but_disabled',page.locator('#analysis-provider').input_value()=='mock' and page.locator('#analysis-provider').is_disabled())
        check('generation_disabled',page.locator('[data-action="analyze"]').is_disabled())
        check('research_edit_disabled',page.locator('#research-relationship').is_disabled())
        check('all_citations_resolve',all(i in report['evidence'] for group in ['claims','diagnoses','options','experiments'] for item in report['decision_analysis'][group] for i in item['evidence_ids']))
        check('static_media_urls',all(not e['media_url'] or e['media_url'].startswith('./media/') for e in report['evidence_index'].values()))
        page.locator('.report-paper [data-evidence]').first.click()
        expect(page.locator('#evidence-dialog')).to_be_visible()
        expect(page.locator('#evidence-content video')).to_have_count(1)
        page.wait_for_function('()=>document.querySelector("#evidence-content video").readyState>=1')
        check('video_evidence_playback',abs(page.locator('#evidence-content video').evaluate('v=>v.currentTime')-1)<.25)
        page.locator('#close-dialog').click()
        page.locator('.decision-summary [data-evidence]').first.click()
        expect(page.locator('#evidence-content audio')).to_have_count(1)
        page.wait_for_function('()=>document.querySelector("#evidence-content audio").readyState>=1')
        check('audio_evidence_seek',abs(page.locator('#evidence-content audio').evaluate('a=>a.currentTime')-5)<.25)
        page.screenshot(path=str(out/'evidence.png'))
        page.locator('#close-dialog').click()
        for ext in ['md','json']:
            with page.expect_download() as download:page.locator(f'.report-export a[href="./report.{ext}"]').click()
            download.value.save_as(str(out/f'report.{ext}'))
            check('export_'+ext,(out/f'report.{ext}').stat().st_size>1000)
        for width in [1440,1024,768,390]:
            page.set_viewport_size({'width':width,'height':1050});page.evaluate('scrollTo(0,0)')
            check('responsive_'+str(width),page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            page.screenshot(path=str(out/f'report-{width}.png'))
        denied=page.evaluate('async()=>{const r=await fetch("/api/sessions/unused/analyze",{method:"POST",body:"{}"});return r.status;}')
        check('static_inference_refused',denied==409)
        check('no_backend_requests',not api_requests)
        check('no_javascript_errors',not errors)
        check('no_http_errors',not bad)
        browser.close()
    result={'status':'passed_static_mock','checks_passed':len(checks),'checks':checks,
        'javascript_errors':errors,'http_errors':bad,'backend_requests':api_requests,
        'model_inference_executed':False,'hardware_verified':False,'base_url':args.url}
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
