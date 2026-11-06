"""Verify continuous separation, exact zero return, real mouse/touch drag and immutable models."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import traceback
from playwright.sync_api import sync_playwright,expect

ROOT=Path(__file__).resolve().parents[1]
BASE='7d070bcf7a6e08595205ebe829e823f21328da29'
STATE="""c=>{const v=c.__huboneViewer;v.scene.updateMatrixWorld(true);const models=[...v.floorGroups].map(([id,f])=>({id,position:f.group.position.toArray(),matrix:f.group.matrixWorld.toArray()})),ids=[];v.scene.traverse(o=>{ids.push(o.uuid);if(o.geometry)ids.push(o.geometry.uuid);});const h=v.scene.getObjectByName('CAD_OPENING_AUDIT'),f=v.floorGroups.get('floor_2');return {diag:v.getDiagnostics(),models,resourceIds:ids,helperParentIsFloor2:h.parent===f.group,helperY:h.matrixWorld.elements[13],direction:v.camera.position.clone().sub(v.controls.target).normalize().toArray(),floorBounds:v.getFloorProjectedBounds()};}"""


def export_review(site,out):
    r=json.loads((out/'acceptance.json').read_text(encoding='utf-8'));assert r['status']=='passed'
    target=site/'space-v21-slider-review';target.mkdir(exist_ok=True)
    for name in ['acceptance.json','regression.json','pytest.xml','scope-integrity.json','source.patch','git-diff-stat.txt']:
        if (out/name).is_file():shutil.copyfile(out/name,target/name)
    for file in (out/'screenshots').glob('*.png'):shutil.copyfile(file,target/file.name)
    doc=ROOT/'docs/SPACE_V21_SLIDER_ACCEPTANCE.md'
    if doc.is_file():shutil.copyfile(doc,target/'report.md')
    html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HUB ONE · 连续楼层分离验收</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f6fa;color:#304659;font:14px/1.65 Inter,"Microsoft YaHei UI",sans-serif}main{padding:26px;max-width:1800px;margin:auto}h1{font-size:26px;margin:6px 0}nav{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}a{color:#23518b}nav a{border:1px solid #d6e0e8;padding:8px 12px;background:#fff;border-radius:5px;text-decoration:none}.shots{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}figure{margin:0;padding:12px;background:#fff;border:1px solid #dde4eb;border-radius:8px}figcaption{font-weight:600;margin-bottom:8px}img{width:100%;display:block}.notice{padding:12px 15px;background:#fffaf0;border-left:3px solid #ad8653;margin-bottom:18px}p{color:#536d7f}@media(max-width:900px){main{padding:16px}.shots{grid-template-columns:1fr}}</style></head><body><main><small>HUB ONE / SPACE INTELLIGENCE / SLIDER REVIEW</small><h1>内部空间 · 连续楼层分离</h1><p>仅保留建筑总览与内部空间两个观察视图。滑轨始终显示于 3D 工具栏；拖动连续分离，归零恢复正常楼层位置。</p><nav><a href="../space-v21.html?v=slider-20261106#space">打开交互预览 ↗</a><a href="report.md">验收报告 ↓</a><a href="source.patch">Git Diff ↓</a><a href="acceptance.json">实际检查记录 ↓</a></nav><div class="notice">分离只改变展示位置，不修改 CAD、楼层标高或模型数据。外观、高度和场地仍保留原有 SIMULATED 说明。此轮不开发其他功能或下一阶段。</div><p>CHECKS 项滑轨专项检查通过；已实际验证鼠标拖动、手机触摸、同一模型实例、全程可见和归零无误差。</p><div class="shots">FIGURES</div><p><a href="reset-zero.png">查看往返拖动后的归零截图 ↗</a> · <a href="mobile.png">查看手机滑轨截图 ↗</a></p></main></body></html>'''
    figures=''.join(f'<figure><figcaption>{v}% · {label}</figcaption><a href="separation-{v}.png" target="_blank"><img src="separation-{v}.png" alt="{v}% 分离实际截图"></a></figure>' for v,label in [(0,'正常聚合'),(50,'连续分离中'),(100,'最大展示间距')])
    (target/'index.html').write_text(html.replace('FIGURES',figures).replace('CHECKS',str(r['checks_passed'])),encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',default='http://127.0.0.1:8056/hub-on/demos/etd-1-1-20261104/');parser.add_argument('--export-review',type=Path);args=parser.parse_args()
    out=ROOT/'artifacts/space-v21-slider';shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    if args.export_review:export_review(args.export_review,out);return
    base=args.url.rstrip('/')+'/';checks=[];errors=[];bad=[];console=[];states={};metrics=[]
    result={'status':'running','url':base,'browser':'Chromium / SwiftShader','physical_mobile_verified':False,'new_phase_started':False}
    def check(name,condition=True):
        if not condition:raise AssertionError(name)
        checks.append(name)
    try:
        protected=['frontend/three/building-envelope-v21.js','frontend/three/site-context-v21.js']
        protected += ['frontend/space-v21-data/'+name for name in ['envelope.json','site.json','surfaces.json']]
        protected += ['space_intelligence/data/'+fid+suffix for fid in ['floor_1','floor_2'] for suffix in ['.json','_model.json','.svg']]
        repo=ROOT.parent
        for name in protected:
            old=subprocess.check_output(['git','show',BASE+':hubone-crestc3-demo/'+name],cwd=repo)
            check('immutable_'+name,old==(ROOT/name).read_bytes())
        with sync_playwright() as p:
            browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage'])
            context=browser.new_context(viewport={'width':1920,'height':1080},device_scale_factor=1,has_touch=True,timezone_id='Asia/Shanghai');page=context.new_page()
            page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 else None);page.on('console',lambda m:console.append(m.text) if m.type=='error' else None)
            page.goto(base+'space-v21.html#space',wait_until='networkidle');page.wait_for_function('document.querySelector("canvas.space-webgl")?.__huboneViewer?.getDiagnostics().presentation?.maxSeparationM>0',timeout=60000)
            rail=page.locator('#space-explode-range')
            def snapshot():return page.locator('canvas.space-webgl').evaluate(STATE)
            def fit_ok(s):
                b=s['diag']['fitBoundsNDC'];return min(b['minX'],b['minY'])>=-.94 and max(b['maxX'],b['maxY'])<=.94
            check('two_views_only',page.locator('button[data-v21-mode]').count()==2 and page.locator('[data-v21-mode="exploded"]').count()==0)
            expect(rail).to_be_visible();check('overview_slider_enabled',rail.is_enabled());check('fine_continuous_step',rail.get_attribute('step')=='0.001')
            initial=snapshot();check('larger_than_previous_max',initial['diag']['presentation']['maxSeparationM']>=initial['diag']['presentation']['legacyMaxSeparationM']*1.49)
            initial_direction=initial['direction'];rail.fill('0.1');s=snapshot();check('overview_drag_enters_interior',s['diag']['presentation']['mode']=='interior')
            check('drag_preserves_view_direction',max(abs(a-b) for a,b in zip(initial_direction,s['direction']))<1e-8)
            page.locator('button[data-v21-mode="interior"]').click();rail.fill('0.004');check('nonzero_progress_never_shown_as_zero',page.locator('#space-v21-separation').inner_text()=='0.4%' and snapshot()['models'][1]['position'][1]>4.2)
            rail.fill('0');baseline=snapshot()
            check('normal_floor_positions',baseline['models'][0]['position']==[0,0,0] and baseline['models'][1]['position']==[0,4.2,0])
            page.evaluate('window.sliderViewer=document.querySelector("canvas.space-webgl").__huboneViewer')
            data_hash=page.locator('canvas.space-webgl').evaluate('async c=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(c.__huboneViewer.models))))].join(",")')
            lights=page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.scene.children.filter(o=>o.isLight).map(o=>({type:o.type,color:o.color.getHex(),intensity:o.intensity,position:o.position.toArray()}))')
            requests=[];page.on('request',lambda r:requests.append(r.url))
            for value in [0,.5,1]:
                rail.fill(str(value));s=snapshot();states[str(value)]=s
                check('same_instance_'+str(value),page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer===window.sliderViewer'))
                check('linear_floor2_offset_'+str(value),abs(s['models'][1]['position'][1]-(4.2+s['diag']['presentation']['maxSeparationM']*value))<1e-9)
                check('floor1_stationary_'+str(value),s['models'][0]==baseline['models'][0])
                check('no_geometry_recreation_'+str(value),s['resourceIds']==baseline['resourceIds'])
                check('synchronized_opening_'+str(value),s['helperParentIsFloor2'] and abs(s['helperY']-s['models'][1]['position'][1])<1e-9)
                check('fully_visible_'+str(value),fit_ok(s));expect(page.locator('#space-v21-separation')).to_have_text(str(round(value*100))+'%')
                labels=page.locator('[data-v21-floor-tag]:visible').count();check('both_labels_'+str(value),labels==2)
                page.wait_for_timeout(80);page.screenshot(path=str(shots/f'separation-{round(value*100)}.png'))
            failures=page.locator('canvas.space-webgl').evaluate('''c=>{const v=c.__huboneViewer,rail=document.querySelector('#space-explode-range'),failures=[];for(const percent of [...Array(101).keys(),...Array(101).keys()].map((n,i)=>i<101?n:100-n)){rail.value=percent/100;rail.dispatchEvent(new Event('input',{bubbles:true}));const d=v.getDiagnostics(),f=d.fitBoundsNDC;if(Math.abs(d.floorY.floor_2-(4.2+d.presentation.maxSeparationM*percent/100))>1e-9||Math.min(f.minX,f.minY)<-.94||Math.max(f.maxX,f.maxY)>.94)failures.push(percent);}return failures;}''')
            check('202_forward_reverse_positions_linear_and_in_view',not failures)
            reset=snapshot();check('exact_zero_return_matrix',reset['models']==baseline['models']);check('no_resource_growth_after_round_trip',reset['resourceIds']==baseline['resourceIds']);page.screenshot(path=str(shots/'reset-zero.png'))
            check('model_data_not_mutated',data_hash==page.locator('canvas.space-webgl').evaluate('async c=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(JSON.stringify(c.__huboneViewer.models))))].join(",")'))
            check('lighting_unchanged_during_slider',lights==page.locator('canvas.space-webgl').evaluate('c=>c.__huboneViewer.scene.children.filter(o=>o.isLight).map(o=>({type:o.type,color:o.color.getHex(),intensity:o.intensity,position:o.position.toArray()}))'))
            check('no_model_or_network_reload_during_slider',not requests)
            # Real pointer input on the original native range.
            b=rail.bounding_box();y=b['y']+b['height']/2;page.mouse.move(b['x']+4,y);page.mouse.down();samples=[]
            for i in range(1,13):page.mouse.move(b['x']+4+(b['width']-8)*i/12,y);samples.append(float(rail.input_value()))
            page.mouse.up();check('actual_mouse_drag_monotonic',samples[-1]>.99 and all(a<=b for a,b in zip(samples,samples[1:])));check('mouse_has_multiple_intermediate_values',len(set(v for v in samples if 0<v<1))>=7)
            rail.fill('0');check('mouse_drag_returns_exactly',snapshot()['models']==baseline['models'])
            for w,h in [(2048,972),(1920,1080),(1440,900),(1024,768),(390,844)]:
                page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(120)
                for value in [0,.5,1]:
                    rail.fill(str(value));s=snapshot();m=page.evaluate('''()=>{const r=document.querySelector('#space-explode-range').getBoundingClientRect();return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,rail:{left:r.left,right:r.right,top:r.top,bottom:r.bottom}};}''')
                    check(f'{w}x{h}_{value}_fully_visible',fit_ok(s));check(f'{w}x{h}_{value}_no_overflow',m['scrollWidth']<=w and m['scrollHeight']<=h+1)
                    check(f'{w}x{h}_{value}_slider_always_visible',m['rail']['left']>=0 and m['rail']['right']<=w and m['rail']['top']>=0 and m['rail']['bottom']<=h)
                    m['progress']=value;metrics.append(m)
            # Native touch dragging without opening a drawer over the model.
            rail.fill('0');b=rail.bounding_box();x0=b['x']+3;x1=b['x']+b['width']-3;y=b['y']+b['height']/2;cdp=context.new_cdp_session(page)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x0,'y':y,'id':1}]});touch=[]
            for i in range(1,13):
                cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x0+(x1-x0)*i/12,'y':y,'id':1}]});touch.append(float(rail.input_value()))
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});check('actual_touch_drag_monotonic',touch[-1]>.99 and all(a<=b for a,b in zip(touch,touch[1:])));check('touch_has_multiple_intermediate_values',len(set(v for v in touch if 0<v<1))>=7)
            page.screenshot(path=str(shots/'mobile.png'))
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x1,'y':y,'id':2}]})
            for i in range(1,13):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x1-(x1-x0)*i/12,'y':y,'id':2}]})
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});check('touch_zero_returns_exactly',float(rail.input_value())==0 and snapshot()['models']==baseline['models'])
            page.set_viewport_size({'width':1920,'height':1080});rail.fill('1');page.locator('button[data-v21-mode="overview"]').click();s=snapshot();check('overview_reaggregates_before_showing_shell',s['diag']['presentation']['envelopeVisible'] and s['models']==baseline['models'] and float(rail.input_value())==0)
            check('no_javascript_errors',not errors);check('no_http_errors',not bad);check('no_webgl_console_errors',not console);browser.close()
        result['status']='passed'
    except Exception as exc:result.update(status='failed',failure=str(exc),traceback=traceback.format_exc());raise
    finally:
        result.update(checks_passed=len(checks),checks=checks,states=states,responsive=metrics,javascript_errors=errors,http_errors=bad,console_errors=console)
        (out/'acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print(json.dumps({k:v for k,v in result.items() if k not in ['checks','states','responsive']},ensure_ascii=False,indent=2))


if __name__=='__main__':main()
