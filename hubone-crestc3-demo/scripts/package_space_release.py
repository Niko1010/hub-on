"""Create a portable source/data release; omit runtime DBs, secrets and venvs."""
import argparse
import hashlib
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIRS = ('backend', 'frontend', 'adapters', 'vision', 'audio', 'analysis',
               'database', 'space_intelligence', 'tests', 'scripts', 'docs', 'third_party')
SOURCE_FILES = ('README.md', 'requirements.txt', 'requirements-browser.txt', 'package.json', 'package-lock.json', '.env.example', '.gitignore', '.gitattributes',
                'THIRD_PARTY_NOTICES.md', 'INSTALL_WINDOWS.cmd', 'START_WINDOWS.cmd', 'START_HERE_WINDOWS.md', 'pytest.ini', 'requirements-asr.txt')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--research', action='store_true', help='Include labelled Mock research media and software acceptance records')
    args = parser.parse_args()
    if args.output is None:
        args.output=ROOT/'artifacts'/('hubone-decision-demo.zip' if args.research else 'hubone-space-v0.3.zip')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    files = [ROOT/name for name in SOURCE_FILES]
    for dirname in SOURCE_DIRS:
        files.extend(p for p in (ROOT/dirname).rglob('*') if p.is_file() and not {
            '__pycache__', '.pytest_cache', '.git', '.venv'} & set(p.relative_to(ROOT).parts) and p.suffix != '.pyc')
    # Preserve media preparation instructions/fixtures used by C3, not a live session database.
    files.extend(p for p in (ROOT/'sample_data').rglob('*') if p.is_file() and p.suffix in ('.md', '.json', '.py', '.txt', '.gitkeep'))
    if args.research:
        files.extend(p for p in [ROOT/'sample_data/video.mp4',ROOT/'sample_data/audio.wav'] if p.is_file())
        files.extend(p for p in (ROOT/'artifacts/decision').rglob('*') if p.is_file() and p.suffix in ('.xml','.png','.md','.json'))
    for version in ['v0.2','v0.3']:
        evidence = ROOT/'artifacts'/version
        files.extend(p for p in evidence.rglob('*') if p.is_file() and p.suffix in ('.xml', '.png', '.md', '.json') and not p.name.startswith('export-floor') and not p.name.startswith('floor_1.'))
    files.extend(p for p in (ROOT/'artifacts/cad-inspection').glob('*.png') if p.name.endswith('-1.png') or '-extracted' in p.name)
    files = sorted(set(files))
    with zipfile.ZipFile(args.output, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in files:
            if path.name == '.env' or path.name.endswith(('.sqlite3', '.db')):
                raise ValueError('Runtime credentials/database must not be packaged')
            archive.write(path, 'hubone-crestc3-demo/'+path.relative_to(ROOT).as_posix())
        archive.writestr('hubone-crestc3-demo/models/.gitkeep', '')
        archive.writestr('hubone-crestc3-demo/runtime/.gitkeep', '')
        archive.writestr('先看这里.txt', ('HUB ONE Evidence-to-Decision 软件演示\n\n'
                         '先读 hubone-crestc3-demo/docs/WINDOWS_EVIDENCE_TO_DECISION.md\n'
                         '启动后打开 /#report，点击“运行决策研究演示 · SIMULATED + MOCK”。\n'
                         'Mock 不调用模型；附带媒体为 SIMULATED 照片视频和合成语音。\n'
                         '本轮未验证真实 Ollama、Windows 摄像头/麦克风或 RTX 5070。\n'
                         '样例报告和软件记录：hubone-crestc3-demo/artifacts/decision/\n'
                         '3D 空间模块及原 CAD 保留不变。本包供本地部署，不是 Pages 静态发布包。\n\n' if args.research else '')+
                         'HUB ONE V0.3 Space Intelligence\n\n'
                         '完整项目与真实 CAD、两层 JSON/SVG 已包含。\n'
                         'Windows 安装与启动：hubone-crestc3-demo/docs/SPACE_DEPLOYMENT.md\n'
                         '验收记录：hubone-crestc3-demo/docs/V0.2_ACCEPTANCE_REPORT.md\n'
                         '原始 DXF 和 PDF 保持不变；两份 PDF 页面均为一层，二层 PDF 核对待补充。\n'
                         '摄像头默认 NOT CONNECTED；勾选测试设备才显示 SIMULATED 点位。\n'
                         '本版包含真实可交互 Three.js 三维与二维地图。CAD 平面位置保留，未知高度和支撑楼板明确为 SIMULATED 示意。\n'
                         '三维说明：hubone-crestc3-demo/docs/SPACE_3D_V0.3.md\n')
    with zipfile.ZipFile(args.output) as archive:
        assert archive.testzip() is None
    args.output.with_suffix(args.output.suffix+'.sha256').write_text(hashlib.sha256(args.output.read_bytes()).hexdigest()+'  '+args.output.name+'\n',encoding='utf-8')
    print('Packaged', len(files), 'files:', args.output, f'({args.output.stat().st_size:,} bytes)')


if __name__ == '__main__':
    main()
