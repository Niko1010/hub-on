"""Start the existing app; open the browser only after real readiness checks."""
import argparse
import json
from pathlib import Path
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser

ROOT=Path(__file__).resolve().parents[1]


def healthy(base):
    opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(base+'/api/health',timeout=1) as response:
            health=json.load(response)
        with opener.open(base+'/openapi.json',timeout=1) as response:
            schema=json.load(response)
        return health.get('status')=='ok' and schema.get('info',{}).get('title')=='HUB ONE × CREST C3'
    except (OSError,ValueError,urllib.error.URLError):
        return False


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--port',type=int,default=8000)
    parser.add_argument('--no-browser',action='store_true')
    args=parser.parse_args()
    if not 1<=args.port<=65535:
        parser.error('port must be in [1,65535]')
    base=f'http://127.0.0.1:{args.port}'
    if healthy(base):
        print('HUB ONE is already running:',base,flush=True)
        if not args.no_browser:webbrowser.open(base)
        return 0
    with socket.socket() as probe:
        probe.settimeout(1)
        if probe.connect_ex(('127.0.0.1',args.port))==0:
            print(f'Port {args.port} belongs to another service. Try START_WINDOWS.cmd --port 8001',flush=True)
            return 1
    print('Starting HUB ONE. Keep this window open while using the page.',flush=True)
    process=subprocess.Popen([sys.executable,'-m','uvicorn','backend.main:app',
                              '--host','127.0.0.1','--port',str(args.port)],cwd=ROOT)
    try:
        deadline=time.monotonic()+60
        while time.monotonic()<deadline:
            if process.poll() is not None:
                print('The server could not start. Read the actual error above.',flush=True)
                return process.returncode or 1
            if healthy(base):
                print('READY - open this address on THIS computer:',base,flush=True)
                if not args.no_browser:webbrowser.open(base)
                print('Press Ctrl+C to stop the server. Closing this window stops access.',flush=True)
                return process.wait()
            time.sleep(.4)
        print('Server readiness timed out. The browser was not opened.',flush=True)
        return 1
    except KeyboardInterrupt:
        print('\nStopping the local server.',flush=True)
        return 0
    finally:
        if process.poll() is None:
            process.terminate()
            try:process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill();process.wait()


if __name__=='__main__':
    sys.exit(main())
