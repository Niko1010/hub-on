"""Add V2.1 stage-one preview beside the original and V2, preserving every existing file."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT=Path(__file__).resolve().parents[1]
VERSION='v21-stage1-20261106'
ASSETS=['space-v21.js','space-v21.css','space-v21.bundle.js','space-v21.bundle.js.LEGAL.txt']


def html(original,space='./space.js?v=0.4.0',engine='./space-3d.bundle.js?v=0.4.0'):
    imports={'imports':{space:'./space-v21.js?v='+VERSION,engine:'./space-v21.bundle.js?v='+VERSION}}
    extra='<link rel="stylesheet" href="./space-v21.css?v='+VERSION+'">\n<script type="importmap">'+json.dumps(imports)+'</script>\n'
    return original.replace('</head>',extra+'</head>',1)


def fingerprint(site):
    return {str(p.relative_to(site)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(site.rglob('*'))
            if p.is_file() and not str(p.relative_to(site)).startswith('space-v21')}


def review(site,out):
    result=json.loads((out/'acceptance.json').read_text(encoding='utf-8'));assert result['status']=='passed'
    target=site/'space-v21-review';target.mkdir(exist_ok=True)
    for name in ['acceptance.json','native-acceptance.json','integrity.json','source-integrity.json','void-audit.json','pytest.xml','source.patch','git-diff-stat.txt']:
        if (out/name).is_file():shutil.copyfile(out/name,target/name)
    for file in (out/'screenshots').glob('*.png'):shutil.copyfile(file,target/file.name)
    doc=ROOT/'docs/SPACE_V21_STAGE1_ACCEPTANCE.md'
    if doc.is_file():shutil.copyfile(doc,target/'report.md')
    page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HUB ONE · Space V2.1 第一阶段验收</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#2f4559;font:14px/1.65 Inter,"Microsoft YaHei UI",sans-serif}main{max-width:1800px;padding:28px;margin:auto}h1{font-size:26px;margin:6px 0}h2{font-size:18px}nav{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}a{color:#23518b}nav a{padding:8px 12px;border:1px solid #d4dee8;background:white;border-radius:5px;text-decoration:none}.notice{padding:14px 16px;border-left:3px solid #a47d49;background:#fffaf0;color:#705c40}.shots{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:20px}figure{margin:0;padding:13px;border:1px solid #dde4eb;background:white;border-radius:9px}figcaption{font-weight:600;margin-bottom:10px}img{width:100%;display:block}p{max-width:1200px;color:#546b7f}@media(max-width:800px){main{padding:16px}.shots{grid-template-columns:1fr}}</style></head><body><main><small>HUB ONE / SPACE INTELLIGENCE / V2.1 STAGE 01</small><h1>建筑外观总览与 CAD 楼层拆解</h1><p>保持既有产品框架、导航和 Crest C3 1.1。外观根据用户 PDF 参考重建，内部复用原 CAD；旧版和 V2 均保留。</p><nav><a href="../space-v21.html#space">打开 V2.1 交互预览 ↗</a><a href="../space-v2.html#space">V2 ↗</a><a href="../index.html#space">原版 ↗</a><a href="report.md">验收报告 ↓</a><a href="source.patch">Git Diff ↓</a><a href="acceptance.json">浏览器检查 ↓</a><a href="void-audit.json">洞口核对记录 ↓</a></nav><div class="notice">外立面分格、屋顶、竖向尺寸、铺装和绿化为 SIMULATED；内部仅有 CAD 已提供的 1F / 2F。二层 #189F 洞口约 187.19㎡ 为 CAD 图面推导，已从展示楼板扣除；并非实测面积或可通行性认证。第二阶段分析图层未开发。</div><p>浏览器 CHECKS 项检查通过。实际截图如下，可点击查看原图。</p><div class="shots">FIGURES</div><h2>响应式验收</h2><p>2048×972、1920×1080、1440×900、1024×768、390×844；完整结果见验收记录。</p><p>本阶段完成后等待用户验收，不自动进入第二阶段。原始 CAD、现有 API、全局样式、研究报告与证据媒体保持原样。</p></main></body></html>'''
    names=[('overview.png','建筑外观总览'),('exploded.png','一层 / 二层拆解'),('floor-1.png','一层 CAD 内部'),('floor-2.png','二层 CAD 内部'),('opening.png','CAD #189F 中空核对'),('mobile.png','移动端交互')]
    figures=''.join(f'<figure><figcaption>{label}</figcaption><a href="{name}" target="_blank"><img src="{name}" alt="{label}实际浏览器截图"></a></figure>' for name,label in names)
    page=page.replace('FIGURES',figures).replace('CHECKS',str(result['checks_passed']))
    (target/'index.html').write_text(page,encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--site',type=Path);parser.add_argument('--review',action='store_true');args=parser.parse_args()
    frontend=ROOT/'frontend';out=ROOT/'artifacts/space-v21-stage1';out.mkdir(parents=True,exist_ok=True)
    (frontend/'space-v21.html').write_text(html((frontend/'index.html').read_text(encoding='utf-8')),encoding='utf-8')
    if not args.site:print('Local preview: /static/space-v21.html#space');return
    site=args.site.resolve();before=fingerprint(site);imports=[]
    for name,module in [('app.js','space'),('space.js','space-3d.bundle')]:
        match=re.search(r"import\(['\"](\./"+re.escape(module)+r"\.js\?[^'\"]+)['\"]\)",(site/name).read_text(encoding='utf-8'))
        assert match,'Existing imports changed; review before building';imports.append(match.group(1))
    for name in ASSETS:shutil.copyfile(frontend/name,site/name)
    shutil.copytree(frontend/'space-v21-data',site/'space-v21-data',dirs_exist_ok=True)
    (site/'space-v21.html').write_text(html((site/'index.html').read_text(encoding='utf-8'),*imports),encoding='utf-8')
    after=fingerprint(site);assert before==after,'Existing site files must remain byte-identical'
    (out/'integrity.json').write_text(json.dumps({'existing_demo_files_unchanged':len(before),'protected_sha256':before,'modified_existing_files':[]},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    data=json.loads((frontend/'space-v21-data/surfaces.json').read_text(encoding='utf-8'));(out/'void-audit.json').write_text(json.dumps({'audit':data['audit'],'floor_2_openings':data['floors']['floor_2']['openings'],'floor_1_upper_references':data['floors']['floor_1']['upper_opening_references'],'original_cad_data_sha256':data['original_data_sha256']},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    if args.review:review(site,out)
    print(json.dumps({'preview':str(site/'space-v21.html'),'existing_files_unchanged':len(before),'review':args.review},ensure_ascii=False))


if __name__=='__main__':main()
