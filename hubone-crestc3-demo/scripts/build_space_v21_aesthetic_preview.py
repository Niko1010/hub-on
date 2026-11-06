"""Add an opt-in aesthetic entry; never rewrite any original Demo or V2.1 asset."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT=Path(__file__).resolve().parents[1]
VERSION='aesthetic-20261106'
ENTRY='space-v21-aesthetic.html'
ASSETS=['space-v21-aesthetic.bundle.js','space-v21-aesthetic.bundle.js.LEGAL.txt']


def html(original):
    pattern=r'(<script type="importmap">)(.*?)(</script>)'
    match=re.search(pattern,original,re.S);assert match,'Expected existing V2.1 import map'
    data=json.loads(match[2]);keys=[k for k,v in data['imports'].items() if v.startswith('./space-v21.bundle.js?')]
    assert len(keys)==1;data['imports'][keys[0]]='./space-v21-aesthetic.bundle.js?v='+VERSION
    return original[:match.start(2)]+json.dumps(data)+original[match.end(2):]


def fingerprints(site):
    return {str(p.relative_to(site)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(site.rglob('*'))
      if p.is_file() and not p.name.startswith('space-v21-aesthetic') and 'space-v21-aesthetic-review' not in p.parts}


def export_review(site,out):
    result=json.loads((out/'acceptance.json').read_text());assert result['status']=='passed'
    target=site/'space-v21-aesthetic-review';target.mkdir(exist_ok=True)
    for name in ['acceptance.json','regression.json','slider-regression.json','scope-integrity.json','pytest.xml','source.patch','git-diff-stat.txt']:
        if (out/name).is_file():shutil.copyfile(out/name,target/name)
    for p in (out/'screenshots').glob('*.png'):shutil.copyfile(p,target/p.name)
    shutil.copyfile(ROOT/'docs/SPACE_V21_AESTHETIC_ACCEPTANCE.md',target/'report.md')
    figures=''.join(f'<figure><figcaption>{label}</figcaption><a href="{name}.png"><img src="{name}.png" alt="{label}实际 WebGL 渲染截图" loading="lazy"></a></figure>' for name,label in [
      ('overview','建筑外观总览'),('interior-0','内部聚合 · 0%'),('interior-50','内部连续分离 · 50%'),('interior-100','内部最大分离 · 100%'),('opening','二层 CAD 中空细节'),('mobile','390 × 844 · 浏览器触摸模拟'),('before-overview','升级前 · 建筑总览'),('before-interior','升级前 · 内部空间'),('reset-zero','连续往返后的归零')])
    page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HUB ONE · 建筑美学统一验收</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#304659;font:14px/1.7 Inter,"Microsoft YaHei UI",sans-serif}main{max-width:1800px;padding:26px;margin:auto}h1{font-size:26px}nav{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}a{color:#23518b}nav a{padding:8px 12px;border:1px solid #d6e0e8;background:white;border-radius:6px;text-decoration:none}.notice{padding:14px;background:#fffaf0;border-left:3px solid #ad8653;margin-bottom:18px}.shots{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}figure{margin:0;padding:12px;border:1px solid #dde4eb;border-radius:8px;background:white}figcaption{font-weight:600;margin-bottom:8px}img{display:block;width:100%}@media(max-width:800px){main{padding:16px}.shots{grid-template-columns:1fr}}</style></head><body><main><small>HUB ONE / SPACE INTELLIGENCE / AESTHETIC REVIEW</small><h1>建筑总览与内部空间 · 美学统一</h1><p>复用现有 V2.1 Three.js 场景、CAD 数据、页面框架和连续楼层滑轨。此入口仅供美学验收，原版、V2 和当前 V2.1 保持原样。</p><nav><a href="../space-v21-aesthetic.html?v=aesthetic-20261106#space">打开美学交互预览 ↗</a><a href="../space-v21.html#space">当前 V2.1 ↗</a><a href="report.md">验收记录 ↓</a><a href="source.patch">Git Diff ↓</a><a href="acceptance.json">实际测试 ↓</a></nav><div class="notice">建筑外观依据用户 PDF 参考重建，竖向尺寸与场地仍为 SIMULATED；CAD 洞口保持真实几何扣除。未开发摄像头、热力或路线。截图来自 Chromium / SwiftShader；手机图为浏览器触摸模拟，尚未在实体手机验证。</div><p>CHECKS 项专项检查通过。以下均为实际交互页面渲染，点击可查看原图。</p><div class="shots">FIGURES</div></main></body></html>'''
    (target/'index.html').write_text(page.replace('FIGURES',figures).replace('CHECKS',str(result['checks_passed'])),encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--site',type=Path);parser.add_argument('--review',action='store_true');args=parser.parse_args()
    frontend=ROOT/'frontend';(frontend/ENTRY).write_text(html((frontend/'space-v21.html').read_text()),encoding='utf-8')
    if not args.site:print('Local preview: /static/'+ENTRY+'#space');return
    site=args.site.resolve();before=fingerprints(site)
    for name in ASSETS:shutil.copyfile(frontend/name,site/name)
    (site/ENTRY).write_text(html((site/'space-v21.html').read_text()),encoding='utf-8')
    assert fingerprints(site)==before,'Existing Demo assets changed'
    out=ROOT/'artifacts/space-v21-aesthetic';out.mkdir(parents=True,exist_ok=True)
    (out/'build-integrity.json').write_text(json.dumps({'existing_demo_files_unchanged':len(before),'protected_sha256':before,'modified_existing_files':[]},indent=2)+'\n')
    if args.review:export_review(site,out)
    print(json.dumps({'preview':str(site/ENTRY),'existing_files_unchanged':len(before),'review':args.review}))


if __name__=='__main__':main()
