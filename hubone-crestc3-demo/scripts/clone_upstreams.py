"""Reproduce source inspection checkouts; never change existing repositories."""
import argparse
import json
from pathlib import Path
import subprocess

ROOT=Path(__file__).resolve().parents[1]


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--directory',default=str(ROOT.parents[1]/'upstream'))
    args=parser.parse_args()
    destination=Path(args.directory).resolve()
    destination.mkdir(parents=True,exist_ok=True)
    manifest=json.loads((ROOT/'docs/upstream-manifest.json').read_text())
    for repo in manifest:
        target=destination/repo['name']
        if target.exists():
            print('Preserved existing checkout:',target)
            continue
        subprocess.run(['git','clone','--no-checkout',repo['url'],str(target)],check=True)
        subprocess.run(['git','-C',str(target),'checkout','--detach',repo['commit']],check=True)
        print(repo['name'],repo['commit'])


if __name__=='__main__':
    main()
