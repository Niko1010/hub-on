import argparse
from pathlib import Path
import sys

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from adapters.capture import capture_video

if __name__=='__main__':
    parser=argparse.ArgumentParser(description='Capture USB/RTSP on the LOCAL machine')
    parser.add_argument('--source',default='0')
    parser.add_argument('--duration',type=float,default=15)
    parser.add_argument('--output',default='runtime/capture.mp4')
    args=parser.parse_args()
    if not 0<args.duration<=600:
        parser.error('duration must be in (0,600]')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    capture_video(int(args.source) if args.source.isdigit() else args.source,path,args.duration)
    print('Captured. Upload',path,'on the capture page.')
