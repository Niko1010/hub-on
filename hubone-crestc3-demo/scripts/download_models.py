"""Download official CPU assets with pinned content hashes and TLS verification."""
import argparse
import hashlib
from pathlib import Path
import shutil
import tarfile
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
ASSETS=[
    ('models/yolo11n-pose.pt','https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n-pose.pt',
     '869e83fcdffdc7371fa4e34cd8e51c838cc729571d1635e5141e3075e9319dc0'),
    ('models/silero_vad.onnx','https://raw.githubusercontent.com/snakers4/silero-vad/v5.1.2/src/silero_vad/data/silero_vad.onnx',
     '2623a2953f6ff3d2c1e61740c6cdb7168133479b267dfef114a4a3cc5bdd788f'),
    ('models/sensevoice.tar.bz2','https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17.tar.bz2',
     '7d1efa2138a65b0b488df37f8b89e3d91a60676e416f515b952358d83dfd347e'),
    ('models/melo-tts.tar.bz2','https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-melo-tts-zh_en.tar.bz2',
     'e58351ed7149f290a54534538badd4077cdbe6fddc964b24d0bee870415d1514'),
    ('sample_data/reference.jpg','https://raw.githubusercontent.com/ultralytics/assets/main/im/bus.jpg',
     'c02019c4979c191eb739ddd944445ef408dad5679acab6fd520ef9d434bfbc63'),
]


def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):
            h.update(chunk)
    return h.hexdigest()


def download(relative,url,expected):
    target=ROOT/relative
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.is_file() and digest(target)==expected:
        print('verified',relative)
        return target
    temporary=target.with_suffix(target.suffix+'.part')
    try:
        with urllib.request.urlopen(url,timeout=120) as response,temporary.open('wb') as f:
            shutil.copyfileobj(response,f)
        if digest(temporary)!=expected:
            raise RuntimeError(f'Checksum mismatch: {relative}; refusing to use artifact')
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)
    print('downloaded & verified',relative)
    return target


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--vision-only',action='store_true')
    args=parser.parse_args()
    for relative,url,sha in ASSETS:
        if args.vision_only and relative not in ('models/yolo11n-pose.pt','sample_data/reference.jpg'):
            continue
        path=download(relative,url,sha)
        if path.name=='sensevoice.tar.bz2':
            # Always extract from the verified archive so changed extracted
            # weights cannot masquerade as checked artifacts on a repeat run.
            with tarfile.open(path) as archive:
                archive.extractall(ROOT/'models',filter='data')
        if path.name=='melo-tts.tar.bz2':
            with tarfile.open(path) as archive:
                archive.extractall(ROOT/'models/melo',filter='data')


if __name__=='__main__':
    main()
