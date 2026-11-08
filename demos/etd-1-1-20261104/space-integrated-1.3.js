/* V2.3 instance adapter. Existing controls, CAD Inspector, router and C3 source remain frozen. */
import {mountSpace as mountV22} from './space-integrated-experience.js?v=integrated-1.3-20261107';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function mountSpace(root){
  const view=mountV22(root),abort=new AbortController(),connected=new WeakSet();root.classList.add('space-v23-preview');
  const state={markers:false,coverage:false,floors:{floor_1:true,floor_2:true}};
  function apply(){view.threeView?.setCameraLayers?.(state);}
  function clearCameraCard(){if(root.querySelector('[data-v23-camera-details]'))view.clearSelection();}
  const inspect=view.inspectCameraRecord.bind(view);
  view.inspectCameraRecord=c=>{
    if(c.visualization_version!=='V2.3')return inspect(c);
    view.selectedRegion=null;view.threeView?.selectRegion(null);view.highlight([]);
    view.revealInspector('SIMULATED · 摄像头设备');
    const values=[['设备 ID',c.camera_id],['所属楼层',c.floor_id==='floor_1'?'01F · 一层':'02F · 二层'],
      ['设备状态','NOT CONNECTED · SIMULATED'],['摄像头方向',c.direction+'° · CAD +X 逆时针'],
      ['水平视场角',c.field_of_view+'° · SIMULATED'],['模拟覆盖距离',c.range_mm/1000+' m · SIMULATED'],
      ['模拟安装高度',c.mount_height_mm/1000+' m · 相对本层'],['数据来源',c.source+' · 未现场标定'],['验证状态','未验证 / verified: false'],['视频流','NOT CONNECTED']];
    root.querySelector('#space-selection').innerHTML=`<div class="space-object-card space-v23-camera-card" data-v23-camera-details="${esc(c.camera_id)}"><span class="space-badge simulated">SIMULATED</span><h3>摄像头设备</h3><dl>${values.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p class="space-detail-note">位置、安装高度、方向、视场角及距离均为演示参数。粉红扇形仅受展示楼板与中空约束，未考虑墙体遮挡、俯仰和现场标定，不代表真实覆盖率。</p></div>`;
  };
  function decorate(){
    const list=root.querySelector('.space-layer-list');
    if(list&&!list.querySelector('[data-v23-layer]')){
      for(const [key,label,detail]of [['markers','摄像头点位','SIMULATED · 方向标记'],['coverage','摄像头视场','SIMULATED · 未现场标定']]){
        const row=document.createElement('label');row.className='space-v23-camera-toggle';
        row.innerHTML=`<input type="checkbox" data-v23-layer="${key}"><span>${label}<small>${detail}</small></span>`;list.append(row);
      }
      const floor=document.createElement('div');floor.className='space-v23-camera-floors';
      floor.innerHTML='<span>设备楼层</span><label><input type="checkbox" data-v23-camera-floor="floor_1" checked>01F</label><label><input type="checkbox" data-v23-camera-floor="floor_2" checked>02F</label><p>点位与视场独立开关 · V2.3<br>演示设备，未接入真实安装清单。</p>';list.append(floor);
    }
    for(const input of root.querySelectorAll('[data-v23-layer]'))input.checked=state[input.dataset.v23Layer];
    for(const input of root.querySelectorAll('[data-v23-camera-floor]')){input.checked=state.floors[input.dataset.v23CameraFloor];input.disabled=!state.markers&&!state.coverage;}
    const badge=root.querySelector('.space-v21-tag b');if(badge&&!badge.dataset.v23){badge.dataset.v23='true';badge.innerHTML='Integrated 1.3 <span>SPACE V2.3</span>';}
    const canvas=root.querySelector('canvas.space-webgl');
    if(canvas&&view.threeView?.setCameraLayers&&!connected.has(canvas)){connected.add(canvas);apply();}
    if(view.viewMode!=='3d')clearCameraCard();
  }
  root.addEventListener('change',e=>{
    if(e.target.matches('[data-v23-layer]'))state[e.target.dataset.v23Layer]=e.target.checked;
    else if(e.target.matches('[data-v23-camera-floor]'))state.floors[e.target.dataset.v23CameraFloor]=e.target.checked;
    else return;apply();decorate();
  },{signal:abort.signal});
  root.addEventListener('hubone-v23-camera-clear',clearCameraCard,{signal:abort.signal});
  const observer=new MutationObserver(decorate);observer.observe(root,{childList:true,subtree:true});decorate();
  const destroy=view.destroy.bind(view);
  view.destroy=()=>{observer.disconnect();abort.abort();root.classList.remove('space-v23-preview');destroy();};
  return view;
}
