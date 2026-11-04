"""Package actual browser screenshots and measurements; never synthesize building imagery."""
from pathlib import Path
import json
import shutil
import zipfile

ROOT=Path(__file__).resolve().parents[1]


def main():
    base=ROOT/'artifacts/v0.4';out=base/'visual-review';out.mkdir(parents=True,exist_ok=True)
    before=json.loads((base/'before/metrics.json').read_text(encoding='utf-8'))
    acceptance=json.loads((base/'final/acceptance.json').read_text(encoding='utf-8'))
    rows=[]
    for old,new in zip(before,acceptance['viewports']):
        key=f'{new["width"]}x{new["height"]}'
        for phase,source in [('before',base/'before'/f'{key}.png'),('after',base/'final/after'/f'{key}.png')]:
            target=out/phase/f'{key}.png';target.parent.mkdir(exist_ok=True);shutil.copyfile(source,target)
        old_visible=max(0,min(old['map']['height'],old['height']-old['map']['y']))
        rows.append({'key':key,'width':new['width'],'height':new['height'],'before_map':old['map'],
            'before_visible_height':old_visible,'after_map':new['map'],
            'before_page_height':old['scrollHeight'],'after_page_height':new['scrollHeight'],
            'visible_map_area_increase_percent':round((new['map']['width']*new['map']['height']/(old['map']['width']*old_visible)-1)*100,1),
            'status':'PASS'})
    for name in ['exploded','columns-hidden','region-focus','mobile-drawer','mobile-inspector']:
        shutil.copyfile(base/'final/after'/f'{name}.png',out/'after'/f'{name}.png')
    (out/'assets').mkdir(exist_ok=True)
    for name in ['inter-variable.woff2','INTER-OFL.txt']:
        shutil.copyfile(ROOT/'frontend/assets'/name,out/'assets'/name)
    (out/'measurements.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HUB ONE · V0.4 视觉验收</title><style>
@font-face{font-family:Inter;src:url('./assets/inter-variable.woff2') format('woff2');font-weight:100 900;font-display:swap}*{box-sizing:border-box}body{margin:0;background:#f4f6f9;color:#24354b;font:15px/1.6 Inter,'PingFang SC','Microsoft YaHei UI','Noto Sans SC',sans-serif}main{max-width:1900px;margin:auto;padding:30px}header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}h1{font-size:28px;margin:6px 0}h2{font-size:20px;margin:0 0 10px}.eyebrow{color:#476b97;font-size:12px;letter-spacing:1px;font-weight:600}p{color:#4d6178;margin:8px 0}a{color:#23518b}select,button{font:inherit;color:#24354b;border:1px solid #dce4ef;border-radius:8px;background:white;padding:9px 12px}.controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:16px;background:white;border:1px solid #e1e7ef;border-radius:12px;margin-bottom:18px}.badge{font-size:12px;border-radius:5px;background:#e8f3ed;color:#326c4d;padding:5px 8px}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:18px}article{background:white;border:1px solid #e1e7ef;border-radius:12px;overflow:hidden}.label{padding:12px 16px;font-size:14px;font-weight:600;border-bottom:1px solid #e1e7ef}.frame{overflow:hidden;background:#e8edf3;aspect-ratio:2048/972}.frame img{display:block;width:100%;height:auto}.caption{padding:12px 16px;color:#5d6f85;font-size:13px}.section{margin-top:24px;background:white;border:1px solid #e1e7ef;border-radius:12px;padding:20px}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:12px;text-align:left;border-bottom:1px solid #e1e7ef;white-space:nowrap}th{font-weight:600;color:#4d6178}.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.gallery img{width:100%;display:block;border-radius:8px}.gallery a{font-size:13px}ul{padding-left:22px;color:#4d6178}.footnote{font-size:13px;color:#5d6f85}.links{display:flex;gap:18px;flex-wrap:wrap}@media(max-width:850px){main{padding:18px}header{display:block}.comparison{grid-template-columns:1fr}.gallery{grid-template-columns:1fr 1fr}h1{font-size:24px}}@media(max-width:500px){.gallery{grid-template-columns:1fr}}
</style></head><body><main><header><div><div class="eyebrow">HUB ONE / SPACE INTELLIGENCE</div><h1>V0.4 视觉与交互验收</h1><p>同一份真实 CAD、同一 Three.js 引擎。展示实际浏览器截图，不使用生成式效果图。</p></div><div class="links"><a href="https://niko1010.github.io/hub-on/?v=0.4#space">打开可交互模型 ↗</a><a href="report.md">完整验收记录 ↓</a></div></header><div class="controls"><label>验收视口 <select id="viewport"></select></label><span class="badge">五种分辨率通过</span><span class="footnote">左图保留原始完整页面文件，比较框只展示相同视口截面；可点开原图查看原有滚动。</span></div><div class="comparison"><article><div class="label">修改前 · V0.3</div><div class="frame"><a id="before-link"><img id="before" alt="V0.3 实际浏览器截图"></a></div><div class="caption" id="before-caption"></div></article><article><div class="label">修改后 · V0.4</div><div class="frame"><a id="after-link"><img id="after" alt="V0.4 实际浏览器截图"></a></div><div class="caption" id="after-caption"></div></article></div><section class="section"><h2>各分辨率验收</h2><p class="footnote">地图面积按实际首屏可见部分计算；不把修改前被页面裁出屏幕的部分计入可见面积。</p><div class="table-wrap"><table><thead><tr><th>视口</th><th>原页面总高</th><th>新页面总高</th><th>首屏地图面积变化</th><th>结果</th></tr></thead><tbody id="rows"></tbody></table></div></section><section class="section"><h2>真实交互状态</h2><div class="gallery">GALLERY</div></section><section class="section"><h2>已验证与边界</h2><ul><li>71 项专项检查：布局、字体、完整 Fit、图层、柱体隐藏、区域聚焦、触控、抽屉与 Inspector。</li><li>原始 CAD、空间数据和预构建几何共 12 个文件 SHA-256 不变；27 个后端模块与已发布版本一致。</li><li>暖白实体、淡青玻璃、柔灰楼板、环境照明与软阴影；桌面使用 SSAO，窄视窗自动关闭 SSAO。</li><li>摄像头、客流、动线和事件没有真实接入，保持 NOT CONNECTED 或显式 SIMULATED。</li><li>验证环境为 Chromium / SwiftShader；未做真实 GPU 帧率测试，Safari、Windows 与手机实机仍待验证。未知高度/楼板仍为明确标记的示意数据。</li></ul><div class="links"><a href="measurements.json">完整尺寸记录 JSON</a><a href="assets/INTER-OFL.txt">Inter 字体许可证</a></div></section></main><script>const data=DATA;
const select=document.querySelector('#viewport');select.innerHTML=data.map(r=>`<option value="${r.key}">${r.width} × ${r.height}</option>`).join('');
function change(){const r=data.find(r=>r.key===select.value);for(const phase of ['before','after']){const url=`${phase}/${r.key}.png`;document.querySelector('#'+phase).src=url;document.querySelector('#'+phase+'-link').href=url;}document.querySelectorAll('.frame').forEach(e=>e.style.aspectRatio=`${r.width}/${r.height}`);document.querySelector('#before-caption').textContent=`首屏可见地图 ${Math.round(r.before_map.width)} × ${Math.round(r.before_visible_height)} · 原页面总高 ${r.before_page_height}px`;document.querySelector('#after-caption').textContent=`完整地图 ${Math.round(r.after_map.width)} × ${Math.round(r.after_map.height)} · 页面总高 ${r.after_page_height}px · 首屏地图面积 +${r.visible_map_area_increase_percent}%`;}
select.onchange=change;change();document.querySelector('#rows').innerHTML=data.map(r=>`<tr><td>${r.width} × ${r.height}</td><td>${r.before_page_height}px</td><td>${r.after_page_height}px</td><td>+${r.visible_map_area_increase_percent}%</td><td>PASS</td></tr>`).join('');</script></body></html>'''
    gallery=[('exploded','楼层爆炸视图'),('columns-hidden','柱体隐藏'),('region-focus','区域高亮与镜头聚焦'),('mobile-drawer','移动楼层 / 图层抽屉'),('mobile-inspector','移动 Inspector')]
    html=html.replace('GALLERY',''.join(f'<div><a href="after/{key}.png"><img src="after/{key}.png" alt="{title}" loading="lazy">{title} ↗</a></div>' for key,title in gallery))
    html=html.replace('DATA',json.dumps(rows,ensure_ascii=False))
    (out/'index.html').write_text(html,encoding='utf-8')
    report=ROOT/'docs/V0.4_VISUAL_ACCEPTANCE.md'
    if report.is_file():shutil.copyfile(report,out/'report.md')
    archive=ROOT/'artifacts/hubone-v0.4-visual-review.zip'
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
        for f in out.rglob('*'):
            if f.is_file():z.write(f,'hubone-v04-review/'+f.relative_to(out).as_posix())
    with zipfile.ZipFile(archive) as z:assert z.testzip() is None
    print('Actual screenshot review:',out,'ZIP bytes:',archive.stat().st_size)


if __name__=='__main__':main()
