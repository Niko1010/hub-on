"""Build GitHub Pages: real CAD interaction + explicitly SIMULATED C3 replay.

Only run for a destination where publication of this building data is authorized.
The original V0.1 preview builder stays C3-only for offline template packaging.
"""
import json
import argparse
from pathlib import Path
import shutil
import sys

from build_online_preview import main as build_c3

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from space_intelligence.repository import SpaceRepository


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--replay-source',type=Path)
    parser.add_argument('--runtime-root',type=Path)
    args=parser.parse_args()
    build_c3(args.replay_source,args.runtime_root)
    out=ROOT/'preview-site';data=out/'space-data';api=data/'api';api.mkdir(parents=True,exist_ok=True)
    repo=SpaceRepository()
    for filename in ['floor_1.svg','floor_2.svg','floor_1_model.json','floor_2_model.json','model_manifest.json']:
        shutil.copyfile(repo.root/filename,data/filename)
    # Public viewing does not require complete CAD tags or the original files.
    # The authoritative, lossless JSON and source DXF/PDF stay in the workspace.
    for fid in ['floor_1','floor_2']:
        floor=json.loads((repo.root/f'{fid}.json').read_text(encoding='utf-8'))
        floor['source_entities']={handle:{'dxf_type':e['dxf_type'],
            'dxf':{'handle':handle,'layer':e['dxf'].get('layer','0')}}
            for handle,e in floor['source_entities'].items()}
        for container in floor['containers']:
            container.pop('attributes',None)
        floor['publication_scope']='VIEWER_GEOMETRY_ONLY; original CAD files and DXF tags are not published'
        (data/f'{fid}.json').write_text(json.dumps(floor,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
    metadata={key:repo.metadata[key] for key in ['schema_version','building_id','name','english_name',
        'data_status','simulated','source','pdf_reference','camera_inventory_status','business_zone_status',
        'cross_floor_registration','physical_camera_count','known_camera_records']}
    metadata['floors']=[{key:floor[key] for key in ['floor_id','spatial_id','name','level','bounds_wcs_mm',
        'entity_count','pdf_validation']} for floor in repo.floors.values()]
    metadata['publication_scope']='VIEWER_GEOMETRY_ONLY'
    (data/'spatial_metadata.json').write_text(json.dumps(metadata,ensure_ascii=False),encoding='utf-8')
    for filename in ['spaces.json','floors.json','zones-not-connected.json','cameras-not-connected.json','openapi.json']:
        shutil.copyfile(ROOT/'docs/api-examples'/filename,api/filename)
    for fid in ['floor_1','floor_2',None]:
        payload={'items':repo.cameras(True,fid),'data_status':'SIMULATED','registered_real_devices':0,
                 'physical_device_count':None,'online_real_devices':None,
                 'note':'SIMULATED 测试点，非真实安装位置或覆盖范围；未接入视频流。'}
        (api/f'cameras-{fid or "all"}-simulated.json').write_text(json.dumps(payload,ensure_ascii=False),encoding='utf-8')
    for filename in ['CAD_PARSING_REPORT_V0.2.md','SPACE_API_V0.2.md','SPATIAL_DIGITAL_TWIN.md','V0.2_ACCEPTANCE_REPORT.md','V0.3_ACCEPTANCE_REPORT.md','SPACE_DEPLOYMENT.md','SPACE_3D_V0.3.md','GITHUB_PAGES.md','EVIDENCE_TO_DECISION.md','WINDOWS_EVIDENCE_TO_DECISION.md','DECISION_ACCEPTANCE.md','V0.4_VISUAL_ACCEPTANCE.md']:
        shutil.copyfile(ROOT/'docs'/filename,data/filename)
    review=ROOT/'artifacts/v0.4/visual-review'
    if review.is_dir():shutil.copytree(review,out/'visual-review',dirs_exist_ok=True)
    validation=ROOT/'docs/validation/spatial-v04-validation.json'
    if validation.is_file():shutil.copyfile(validation,out/'validation-v04.json')
    for filename in ['space.js','space-preview.js','space-3d.bundle.js','space-3d.bundle.js.LEGAL.txt','THREE-LICENSE.txt']:
        shutil.copyfile(ROOT/'frontend'/filename,out/filename)
    app=(out/'app.js').read_text(encoding='utf-8')
    original="if(!window.HUBONE_REPLAY)pages.unshift("
    assert original in app,'Primary navigation changed; review static preview integration.'
    app=app.replace(original,"if(!window.HUBONE_REPLAY||window.HUBONE_SPACE_PREVIEW)pages.unshift(")
    app=app.replace("'演示记录回放 · REPLAY'","'空间地图 / C3 示例预览'")
    (out/'app.js').write_text(app,encoding='utf-8')
    html=(out/'index.html').read_text(encoding='utf-8')
    start=html.index('<div class="preview-notice">');end=html.index('</div>',start)+len('</div>')
    html=html[:start]+'''<div class="preview-notice"><span class="space-preview-note"><strong>SPACE INTELLIGENCE · 2D / 3D</strong>　平面来自真实 CAD · 高度与支撑楼板为 SIMULATED 示意 · 摄像头及运营数据 NOT CONNECTED</span><span class="c3-preview-note"><strong>CREST C3 · MOCK / SIMULATED / REPLAY</strong>　决策型研究报告回放，可播放合成素材、查看原始事件并导出；本网页不运行 Ollama、ASR、视觉识别或设备采集。</span></div>'''+html[end:]
    html=html.replace('<script type="module"','<script src="./space-preview.js?v=0.4.0"></script><script type="module"',1)
    (out/'index.html').write_text(html,encoding='utf-8')
    with (out/'space.css').open('a',encoding='utf-8') as f:
        f.write('\n.space-preview-note{display:none}body.is-space .space-preview-note{display:inline}body.is-space .c3-preview-note{display:none}body.is-space .preview-notice{border-color:#d9e5f4;background:#edf4fc;color:#6386b0}\n')
    (out/'README.md').write_text('''# HUB ONE online preview — Evidence-to-Decision + Space Intelligence

https://niko1010.github.io/hub-on/?v=decision-1#report
https://niko1010.github.io/hub-on/?v=0.4#space
https://niko1010.github.io/hub-on/visual-review/

Interactive 2D / 3D CAD-derived floor maps using Three.js. Orthographic isometric view, orbit, pan, zoom, single floors, exploded two-floor view, spatial selection and inspector.
CAD plan coordinates are retained. Unknown heights, display floor spacing and reconstructed support slabs are explicitly SIMULATED, not surveyed BIM.
Operating layers (heatmap, activity, paths, experience, events, cameras/FOV) require explicit SIMULATED opt-in. No furniture is claimed real; the demo experience stand is SIMULATED.
No real camera inventory, live streams, occupancy or consumer tracking is connected.
V0.4 adds a full-height responsive workspace, Inter design tokens, mobile layer drawer / inspector sheet, warm architectural materials, environment lighting, soft shadows, desktop SSAO and selected-region camera focus. The same Three.js r180 engine and unchanged CAD data are retained.
Test devices are opt-in and SIMULATED. Original WCS mm / XYZ / handles / IDs are retained.
Crest C3 includes the Evidence-to-Decision report as an explicitly MOCK / SIMULATED / REPLAY record: research question, observed records, quotes, timestamps, alternative explanations, product options and next experiments.
No LLM inference, GPU/device tests, uploads or capture are executed on this static site. The locally deployable backend is available on main.
Two supplied PDF pages both depict floor 1; independent floor 2 PDF verification is pending.
This branch contains viewer files only. Original DXF/PDF and lossless CAD tags remain private; application source is published separately on main.
''',encoding='utf-8')
    print('Real CAD + C3 SIMULATED preview built:',out)


if __name__=='__main__':
    main()
