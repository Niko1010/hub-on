/* Opt-in preview wrapper. Existing SpaceView, navigation and business pages are reused. */
import {mountSpace as mountOriginal} from './space.js?space-v2-base=1';

export function mountSpace(root) {
  root.classList.add('space-v2-stage1');
  const view=mountOriginal(root);
  const decorate=()=>{
    const map=root.querySelector('#space-map');
    if(map&&!map.querySelector('.space-v2-view-tag')) {
      const tag=document.createElement('div');tag.className='space-v2-view-tag';
      tag.innerHTML='<span>V2 <b>STAGE 01 · 待验收</b></span><a href="./index.html#space" aria-label="返回原版 Space Intelligence">返回旧版 ↗</a>';
      const key=document.createElement('div');key.className='space-v2-scene-key';
      key.innerHTML='<i></i><span>红色：选择强调</span><span>非客流数据</span>';
      map.append(tag,key);
    }
    const kicker=root.querySelector('.space-map-heading .space-kicker');
    if(kicker&&kicker.textContent!=='ARCHITECTURAL STUDY / V2')kicker.textContent='ARCHITECTURAL STUDY / V2';
  };
  const observer=new MutationObserver(decorate);
  observer.observe(root,{childList:true,subtree:true});decorate();
  const destroy=view.destroy.bind(view);
  view.destroy=()=>{observer.disconnect();root.classList.remove('space-v2-stage1');destroy();};
  return view;
}
