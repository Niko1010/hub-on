"""Optional browser acceptance. pip install -r requirements-browser.txt first."""
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--base-url',default='http://127.0.0.1:8000')
    parser.add_argument('--chromium',default=None,help='Optional system Chromium path')
    args=parser.parse_args()
    out=ROOT/'artifacts/browser';out.mkdir(parents=True,exist_ok=True)
    errors=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path=args.chromium,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1100},device_scale_factor=1)
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('dialog',lambda dialog:dialog.accept('浏览器上传验证 / SIMULATED'))
        page.goto(args.base_url,wait_until='networkidle')
        expect(page.locator('#health')).to_have_text('研究服务在线')
        page.screenshot(path=str(out/'empty.png'),full_page=True)
        # Use the actual one-click path with real video inference and real ASR.
        page.locator('#demo-btn').click()
        expect(page.locator('#job-message')).to_have_text('处理完成 · 结果已保存',timeout=180000)
        expect(page.locator('#mode')).to_contain_text('SIMULATED')
        for name in ['capture','timeline','feedback','insights','report']:
            page.locator(f'#nav a[href="#{name}"]').click()
            expect(page.locator(f'#nav a[href="#{name}"]')).to_have_class('nav-link active')
            page.screenshot(path=str(out/f'{name}.png'),full_page=True)
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        with page.expect_download() as download:
            page.get_by_text('↓ 导出 Markdown',exact=True).click()
        download.value.save_as(str(out/'download.md'))
        assert 'SIMULATED' in (out/'download.md').read_text(encoding='utf-8')
        page.locator('#nav a[href="#timeline"]').click()
        page.locator('[data-evidence]').first.click()
        expect(page.locator('#evidence-dialog')).to_be_visible()
        expect(page.locator('#evidence-content pre')).to_contain_text('event_id')
        page.locator('#close-dialog').click()
        # Verify a small-screen layout too.
        page.set_viewport_size({'width':390,'height':844})
        page.locator('#nav a[href="#capture"]').click()
        page.screenshot(path=str(out/'mobile.png'),full_page=True)
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth')
        page.set_viewport_size({'width':1440,'height':1100})
        # File-upload API path, not just the internal fixture registration.
        with page.expect_response(lambda r:r.url.endswith('/api/sessions') and r.request.method=='POST') as created:
            page.locator('#new-session').click()
        new_sid=created.value.json()['session_id']
        expect(page.locator('#session-id')).to_contain_text(new_sid[:12])
        page.locator('#video-file').set_input_files(str(ROOT/'sample_data/video.mp4'))
        page.locator('[data-action="upload-video"]').click()
        expect(page.locator('#job-message')).to_have_text('处理完成 · 结果已保存',timeout=180000)
        expect(page.locator('#experience-video')).to_be_visible()
        page.locator('#audio-file').set_input_files(str(ROOT/'sample_data/audio.wav'))
        # Wait for a NEW job ID/status rather than mistaking the old success.
        with page.expect_response(lambda r:r.url.endswith('/audio') and r.request.method=='POST') as audio_job:
            page.locator('[data-action="upload-audio"]').click()
        # Server-side terminal state plus UI completion prevents a stale success
        # label from the preceding video job satisfying this assertion.
        expect(page.locator('#job-panel')).not_to_have_class('job-panel done')
        expect(page.locator('#job-message')).to_have_text('处理完成 · 结果已保存',timeout=180000)
        page.locator('[data-action="analyze"]').click()
        expect(page.locator('#content .insight').first).to_be_visible(timeout=180000)
        assert not page.locator('#error-panel').is_visible()
        assert not errors, errors
        browser.close()
    (out/'result.json').write_text(json.dumps({'status':'passed','pages':5,'real_uploads':['video','audio'],
        'markdown_download':True,'evidence_dialog':True,'responsive':True,'javascript_errors':errors},indent=2))
    print('Browser acceptance passed: five pages, real uploads, evidence dialog, Markdown export, responsive layout.')


if __name__=='__main__':
    main()
