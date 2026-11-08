/* V2.2 entry only. Existing SpaceView, V2.1 controls, router and Inspector are reused. */
import {mountSpace as mountBaseline} from './space-integrated-1.2.js?v=integrated-1.2-20261107';

export function mountSpace(root){
  root.classList.add('space-v22-preview');
  const view=mountBaseline(root),abort=new AbortController(),connected=new WeakSet();
  const state={enabled:true,floors:{floor_1:true,floor_2:true}};
  let firstScene=true;
  function apply(){view.threeView?.setExperienceArea?.(state);}
  function decorate(){
    const controls=root.querySelector('.space-v21-controls');
    if(controls&&!root.querySelector('.space-v22-layer-panel')){
      const box=document.createElement('section');box.className='space-v22-layer-panel space-3d-only';
      box.setAttribute('aria-label','V2.2 体验区域图层');
      box.innerHTML='<div class="space-v22-heading">EXPERIENCE AREA <b>V2.2</b></div><label class="space-v22-toggle"><input type="checkbox" data-v22-experience checked><span class="space-v22-swatch"></span>青色体验区域</label><div class="space-v22-floors"><label><input type="checkbox" data-v22-experience-floor="floor_1" checked>一层区域</label><label><input type="checkbox" data-v22-experience-floor="floor_2" checked>二层区域</label></div><p><strong>SIMULATED</strong> · 业务边界待确认<br>楼板仅作几何约束，非已验证可通行区。</p>';
      controls.after(box);
    }
    const badge=root.querySelector('.space-v21-tag b');
    if(badge&&!badge.dataset.v22){badge.dataset.v22='true';badge.innerHTML='Integrated 1.3 <span>SPACE V2.3</span>';}
    const note=root.querySelector('.space-v21-stage-note');
    if(note&&note.textContent!=='体验区与摄像头：SIMULATED · 真实设备未连接')note.textContent='体验区与摄像头：SIMULATED · 真实设备未连接';
    const canvas=root.querySelector('canvas.space-webgl');
    if(canvas&&view.threeView?.setExperienceArea&&!connected.has(canvas)){
      connected.add(canvas);apply();
      if(firstScene){firstScene=false;view.threeView.setPresentation({mode:'interior'});}
    }
    const toggle=root.querySelector('[data-v22-experience]');if(toggle)toggle.checked=state.enabled;
    for(const input of root.querySelectorAll('[data-v22-experience-floor]')){input.checked=state.floors[input.dataset.v22ExperienceFloor];input.disabled=!state.enabled;}
  }
  root.addEventListener('change',event=>{
    if(event.target.matches('[data-v22-experience]'))state.enabled=event.target.checked;
    else if(event.target.matches('[data-v22-experience-floor]'))state.floors[event.target.dataset.v22ExperienceFloor]=event.target.checked;
    else return;
    apply();decorate();
  },{signal:abort.signal});
  const observer=new MutationObserver(decorate);observer.observe(root,{childList:true,subtree:true});decorate();
  const destroy=view.destroy.bind(view);
  view.destroy=()=>{observer.disconnect();abort.abort();root.classList.remove('space-v22-preview');destroy();};
  return view;
}
