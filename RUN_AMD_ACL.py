"""Launch the unchanged application with separately stored private data/config."""
import argparse,json,os,sqlite3,sys
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument('--private-root',required=True,type=Path)
p.add_argument('--port',type=int,default=8008)
args=p.parse_args()
root=Path(__file__).resolve().parent
private=args.private_root.resolve()
database=private/'data/hubone.sqlite3'
if not database.is_file():raise SystemExit('A verified private 8004 data snapshot is required; no simulated fallback.')
from dotenv import load_dotenv
for name in ('.env','.env.local'):load_dotenv(private/'config'/name,override=True)
os.environ['HUBONE_DATA_DIR']=str(private/'data')
os.environ['HUBONE_INTEGRATED_DEMO_DIR']=str(root/'demos/etd-1-1-20261104')
os.environ['VISION_WEIGHTS']=str(private/'models/yolo11n-pose.pt')
os.environ.setdefault('VISION_DEVICE','auto')
db=sqlite3.connect('file:'+str(database)+'?mode=ro',uri=True)
sessions=[json.loads(row[0]) for row in db.execute('SELECT payload FROM sessions')];db.close()
acl=next((s for s in sessions if s.get('product')=='ACL Knee Brace'),None)
if not acl:raise SystemExit('Original ACL Session is missing; demo will not substitute Crest C3.')
entry='/integrated/?mode=live&study=acl&sid='+acl['session_id']+'#timeline'
print('AMD ACL entry: http://127.0.0.1:'+str(args.port)+entry,flush=True)
app_root=root/'hubone-crestc3-demo'
os.chdir(app_root);sys.path.insert(0,str(app_root));sys.dont_write_bytecode=True
import uvicorn
from backend.main import app as product_app
from starlette.responses import RedirectResponse
async def amd_entry(scope,receive,send):
    if scope['type']=='http' and scope.get('method')=='GET' and scope.get('path')=='/':
        return await RedirectResponse(entry,status_code=302)(scope,receive,send)
    return await product_app(scope,receive,send)
uvicorn.run(amd_entry,host='127.0.0.1',port=args.port,access_log=False)
