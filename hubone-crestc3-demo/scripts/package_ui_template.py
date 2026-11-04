"""Package a self-contained UI replay that opens without a server or install."""
import base64
import json
import mimetypes
from pathlib import Path
import re
import zipfile

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'preview-site'


def data_url(path):
    mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()


def main():
    data=(SITE/'preview-data.js').read_text(encoding='utf-8')
    bundle=json.loads(data.removeprefix('window.HUBONE_REPLAY=').strip().removesuffix(';'))
    assert bundle['report']['simulated'] and all(e['metadata'].get('simulated') for e in bundle['events'])
    for aid,url in bundle['media'].items():
        bundle['media'][aid]=data_url(SITE/url.removeprefix('./'))
    bundle['frames']={p.parent.name+'/'+p.name:data_url(p) for p in (SITE/'frames').rglob('*.jpg')}
    assets={}
    for p in (SITE/'assets').rglob('*'):
        if p.is_file() and p.suffix in ('.svg','.ttf'):
            assets['./assets/'+p.name]=data_url(p)
    assets['./mark.svg']=data_url(SITE/'mark.svg')
    css='\n'.join((SITE/name).read_text() for name in ['style.css','brand.css','research.css','space.css','space-3d.css'])
    for url,value in assets.items():
        css=css.replace(url,value)
    hook=(SITE/'preview-api.js').read_text(encoding='utf-8')
    hook=hook.replace('const d=window.HUBONE_REPLAY, original=window.fetch.bind(window);',
        '''const d=window.HUBONE_REPLAY, original=window.fetch.bind(window);
 d.reportUrl=URL.createObjectURL(new Blob([d.report.markdown],{type:'text/markdown;charset=utf-8'}));
 d.reportJsonUrl=URL.createObjectURL(new Blob([JSON.stringify(d.report,null,2)],{type:'application/json'}));
 d.eventsUrl=URL.createObjectURL(new Blob([JSON.stringify(d.events,null,2)],{type:'application/json'}));''')
    app=(SITE/'app.js').read_text(encoding='utf-8')
    app=app.replace('./frames/${asset.asset_id}/${esc(e.evidence.snapshot)}',
        '${window.HUBONE_REPLAY.frames[asset.asset_id+"/"+e.evidence.snapshot]}')
    app=app.replace('href="./report.md"','href="${window.HUBONE_REPLAY.reportUrl}"')
    app=app.replace('href="./report.json"','href="${window.HUBONE_REPLAY.reportJsonUrl}"')
    app=app.replace('href="./events.json"','href="${window.HUBONE_REPLAY.eventsUrl}"')
    html=(SITE/'index.html').read_text(encoding='utf-8')
    html=re.sub(r'<link rel="stylesheet"[^>]+>','',html)
    html=html.replace('</head>','<style>'+css+'</style></head>')
    for url,value in assets.items():
        html=html.replace('"'+url+'"','"'+value+'"')
    html=re.sub(r'<script src="\./preview-data\.js[^\"]*"></script>',
        lambda _:'<script>window.HUBONE_REPLAY='+json.dumps(bundle,ensure_ascii=False).replace('<','\\u003c')+';</script>',html)
    html=re.sub(r'<script src="\./preview-api\.js[^\"]*"></script>',lambda _:'<script>'+hook+'</script>',html)
    html=re.sub(r'<script type="module" src="\./app\.js[^\"]*"></script>',
        lambda _: '<script type="module">'+app+'</script>',html)
    output=ROOT/'artifacts/hubone-ui-template.html'
    output.write_text(html,encoding='utf-8')
    archive=ROOT/'artifacts/hubone-ui-template.zip'
    with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        z.write(output,'hubone-ui-template.html')
        z.write(ROOT/'docs/UI_TEMPLATE.md','UI_TEMPLATE.md')
        for p in (ROOT/'frontend').rglob('*'):
            if p.is_file():z.write(p,'source/frontend/'+p.relative_to(ROOT/'frontend').as_posix())
        z.writestr('先看这里.txt','解压后双击 hubone-ui-template.html 即可查看 UI。\n这是 SIMULATED / REPLAY，只读回放，不执行分析或上传。\nsource/ 包含可复用的 HTML、CSS、JS、Logo 与字体。\n')
    with zipfile.ZipFile(archive) as z:assert z.testzip() is None
    print('Offline UI:',output.stat().st_size,'bytes; template ZIP:',archive.stat().st_size,'bytes')


if __name__=='__main__':
    main()
