"""Add an opt-in stage-one Space V2 entry; never rewrite existing demo files."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT=Path(__file__).resolve().parents[1]
VERSION='space-v2-stage1-20261106'
ASSETS=['space-v2.js','space-v2.css','space-v2.bundle.js','space-v2.bundle.js.LEGAL.txt']


def is_preview(name):
    return name in ASSETS+['space-v2.html'] or name.startswith('space-v2-review/')


def preview_html(original,space_import='./space.js?v=0.4.0',engine_import='./space-3d.bundle.js?v=0.4.0'):
    # Import maps affect only this new document. The existing app and engine are preserved.
    mapping={'imports':{
        space_import:f'./space-v2.js?v={VERSION}',
        engine_import:f'./space-v2.bundle.js?v={VERSION}'}}
    extra=f'<link rel="stylesheet" href="./space-v2.css?v={VERSION}">\n  <script type="importmap">'+json.dumps(mapping,separators=(',',':'))+'</script>\n'
    assert '<head>' in original and '</head>' in original and 'app.js?' in original
    return original.replace('</head>',extra+'</head>',1)


def fingerprint(folder):
    return {str(p.relative_to(folder)):hashlib.sha256(p.read_bytes()).hexdigest()
            for p in sorted(folder.rglob('*')) if p.is_file() and not is_preview(str(p.relative_to(folder)))}


def build_review(site,out):
    acceptance=json.loads((out/'acceptance.json').read_text(encoding='utf-8'))
    assert acceptance['status']=='passed','Finish browser acceptance before exporting the review'
    target=site/'space-v2-review';target.mkdir(exist_ok=True)
    for version in ['original','v2']:
        folder=target/version;folder.mkdir(exist_ok=True)
        for file in (out/version).glob('*.png'):shutil.copyfile(file,folder/file.name)
    for name in ['acceptance.json','native-acceptance.json','integrity.json','pytest.xml','build-integrity.json','source.patch','git-diff-stat.txt']:
        if (out/name).is_file():shutil.copyfile(out/name,target/name)
    report=ROOT/'docs/SPACE_V2_STAGE1_ACCEPTANCE.md'
    if report.is_file():shutil.copyfile(report,target/'report.md')
    html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hub One · Space V2 阶段一验收</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#283b50;font:14px/1.65 Inter,"PingFang SC","Microsoft YaHei UI",sans-serif}main{max-width:1880px;margin:auto;padding:28px}h1{font-size:26px;margin:6px 0}h2{font-size:18px}p{max-width:1100px;color:#53667b}a{color:#23518b}nav,.sizes{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0}nav a,button{border:1px solid #cdd9e6;border-radius:6px;background:white;color:#23518b;padding:8px 12px;font:inherit;text-decoration:none;cursor:pointer}button[aria-pressed=true]{background:#23518b;color:white}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0;padding:14px;background:white;border:1px solid #dce3eb;border-radius:9px}figcaption{margin-bottom:9px;font-weight:600}img{width:100%;height:auto;display:block}small{color:#52677c}.notice{border-left:3px solid #b63b34;padding:10px 14px;background:white}.details{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}.stat{font-weight:600;color:#23518b}.tag{font-size:12px;letter-spacing:1.3px;color:#536a81}@media(max-width:760px){main{padding:16px}.comparison,.details{grid-template-columns:1fr}h1{font-size:24px}}
</style></head><body><main><div class="tag">HUB ONE / SPACE INTELLIGENCE / STAGE 01</div><h1>Space V2 · 建筑基础视觉升级</h1><p>沿用既有导航、布局、Crest C3 1.1 报告及真实 CAD 平面。白灰建筑、淡青玻璃、既有幕墙边界细线、柔和光影和红色选择强调。本页图片均来自实际浏览器截图；交互请打开 V2 预览。</p>
<nav><a href="../space-v2.html#space">打开交互 V2 ↗</a><a href="../index.html#space">打开原版 ↗</a><a href="../space-v2.html#report">Crest C3 1.1 报告 ↗</a><a href="report.md">验收报告 ↓</a><a href="source.patch">Git Diff ↓</a><a href="acceptance.json">测试结果 JSON ↓</a></nav>
<div class="notice">阶段一已实现，等待用户视觉验收。建筑高度、示意楼板、跨层展示间距仍为 SIMULATED；深色线仅追踪既有幕墙片边界，不代表已测量金属框架。未新增真实摄像头、客流、路线或建筑结构。</div>
<p class="stat">CHECK_COUNT 项浏览器检查通过 · 原有 ORIGINAL_COUNT 个文件保持原样 · 新旧建筑网格属性一致 · C3 报告截图像素一致</p>
<div class="sizes" aria-label="验收分辨率">SIZE_BUTTONS</div>
<div class="comparison"><figure><figcaption>原版 · 保留</figcaption><a id="original-link" target="_blank" rel="noreferrer"><img id="original" alt="原版实际浏览器截图"></a></figure><figure><figcaption>V2 · 阶段一预览</figcaption><a id="v2-link" target="_blank" rel="noreferrer"><img id="v2" alt="V2 实际浏览器截图"></a></figure></div>
<div class="details"><figure><figcaption>区域选择 · 红色仅表示用户选择</figcaption><a href="v2/region-selection.png" target="_blank"><img src="v2/region-selection.png" alt="区域选中与 Inspector 联动"></a></figure><figure><figcaption>原有楼层分离 · 回归保留</figcaption><a href="v2/exploded.png" target="_blank"><img src="v2/exploded.png" alt="两层楼层分离"></a></figure><figure><figcaption>原有柱体隐藏 · 回归保留</figcaption><a href="v2/columns-hidden.png" target="_blank"><img src="v2/columns-hidden.png" alt="柱体隐藏"></a></figure></div>
<p>阶段二（一二层与体验区域）、阶段三（摄像头）和阶段四（路线、人群、热力）尚未开始。浏览器验证采用 Chromium / SwiftShader；未进行实体 GPU 性能测试、真实设备测试或模型推理。</p>
<script>const buttons=[...document.querySelectorAll('[data-size]')];function show(size){for(const version of ['original','v2']){const path=version+'/'+size+'.png';document.getElementById(version).src=path;document.getElementById(version+'-link').href=path;}buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.size===size)));}buttons.forEach(b=>b.addEventListener('click',()=>show(b.dataset.size)));show('1920x1080');</script></main></body></html>'''
    sizes=['2048x972','1920x1080','1440x900','1024x768','390x844']
    integrity=json.loads((out/'build-integrity.json').read_text(encoding='utf-8'))
    html=html.replace('CHECK_COUNT',str(acceptance['checks_passed'])).replace('ORIGINAL_COUNT',str(integrity['original_files_checked'])).replace('SIZE_BUTTONS',''.join(f'<button data-size="{s}" aria-pressed="false">{s.replace("x"," × ")}</button>' for s in sizes))
    (target/'index.html').write_text(html,encoding='utf-8')
    print('Review:',target)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site',type=Path,help='Existing integrated demo directory, not the entire Pages root')
    parser.add_argument('--output',type=Path,default=ROOT/'artifacts/space-v2-stage1')
    parser.add_argument('--review',action='store_true',help='Export actual screenshots, report and diff after acceptance')
    args=parser.parse_args();frontend=ROOT/'frontend'
    (frontend/'space-v2.html').write_text(preview_html((frontend/'index.html').read_text(encoding='utf-8')),encoding='utf-8')
    if not args.site:
        print('Local preview: /static/space-v2.html#space');return
    site=args.site.resolve()
    assert (site/'preview-data.js').is_file() and (site/'space-data/floor_1_model.json').is_file(),'Expected an existing integrated C3 + space demo'
    imports=[]
    for filename,module in [('app.js','space'),('space.js','space-3d.bundle')]:
        match=re.search(r"import\(['\"](\./"+re.escape(module)+r"\.js\?[^'\"]+)['\"]\)",(site/filename).read_text(encoding='utf-8'))
        assert match, f'Review the existing {filename} import before proceeding'
        imports.append(match.group(1))
    before=fingerprint(site)
    for name in ASSETS:shutil.copyfile(frontend/name,site/name)
    (site/'space-v2.html').write_text(preview_html((site/'index.html').read_text(encoding='utf-8'),*imports),encoding='utf-8')
    after=fingerprint(site)
    changed=[name for name,digest in before.items() if after.get(name)!=digest]
    assert not changed, f'Existing demo files changed: {changed}'
    args.output.mkdir(parents=True,exist_ok=True)
    result={'stage':1,'preview_only':True,'site':str(site),'original_files_checked':len(before),
            'original_files_changed':changed,'protected_sha256':before,
            'added_preview_files':ASSETS+['space-v2.html'],'original_entry':'index.html#space','preview_entry':'space-v2.html#space'}
    (args.output/'build-integrity.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in result.items() if k!='protected_sha256'},ensure_ascii=False,indent=2))
    if args.review:build_review(site,args.output)


if __name__=='__main__':main()
