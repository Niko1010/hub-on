/* Space-only controller. Existing application shell, router, API and C3 are reused unchanged. */
import {mountSpace as mountOriginal} from './space.js?space-v21-base=1';

export function mountSpace(root){
  root.classList.add('space-v21-stage1');
  const view=mountOriginal(root),abort=new AbortController();
  view.viewMode='3d'; // Preview starts in 3D without writing the old version's saved preference.
  const state={mode:'overview',floors:{floor_1:true,floor_2:true},context:true,roof:true,gap:1};
  const connected=new WeakSet();
  const titles={overview:'观前街1号 · 建筑总览',interior:'观前街1号 · CAD 内部空间',exploded:'观前街1号 · 楼层拆解'};
  function current(){return view.threeView;}
  function set(update){
    Object.assign(state,update);if(update.floors)state.floors={...update.floors};
    current()?.setPresentation(state);decorate();updateLabels();
  }
  function updateLabels(){
    const engine=current();if(!engine?.getFloorScreenAnchors)return;
    const map=root.querySelector('#space-map'),anchors=engine.getFloorScreenAnchors();
    for(const [id,a]of Object.entries(anchors)){
      const label=map.querySelector(`[data-v21-floor-tag="${id}"]`);if(!label)continue;
      label.hidden=!a.visible;
      label.style.left=Math.max(10,Math.min(map.clientWidth-130,a.x-5))+'px';
      label.style.top=Math.max(50,Math.min(map.clientHeight-45,a.y-9))+'px';
    }
  }
  function decorate(){
    const controls=root.querySelector('.space-controls'),map=root.querySelector('#space-map');
    if(!controls||!map)return;
    root.dataset.v21SceneMode=state.mode;
    if(!controls.querySelector('.space-v21-controls')){
      const box=document.createElement('section');box.className='space-v21-controls space-3d-only';
      box.innerHTML=`<div class="space-v21-eyebrow">ARCHITECTURAL VIEW / V2.1</div><div class="space-v21-modes">${[['overview','建筑总览'],['interior','内部空间'],['exploded','楼层拆解']].map(([key,label])=>`<button data-v21-mode="${key}" aria-pressed="false">${label}</button>`).join('')}</div><div class="space-v21-floor-visibility"><label><input type="checkbox" data-v21-floor="floor_1" checked> 01F 一层</label><label><input type="checkbox" data-v21-floor="floor_2" checked> 02F 二层</label></div><label class="space-v21-context-toggle"><input type="checkbox" data-v21-context checked> 场地示意 <small>SIMULATED</small></label><label class="space-v21-roof-toggle"><input type="checkbox" data-v21-roof checked> 屋顶参考重建</label><label class="space-v21-gap">展示分离距离<input type="range" data-v21-gap min="0.6" max="1.25" step="0.05" value="1" aria-label="楼层拆解展示间距"><small>展示偏移，不是实际层高</small></label><button class="space-v21-void-button" data-v21-opening>核对二层中空 ↗</button>`;
      controls.prepend(box);
    }
    if(!map.querySelector('.space-v21-tag')){
      const tag=document.createElement('div');tag.className='space-v21-tag';tag.innerHTML='<b>V2.1 <span>STAGE 01</span></b><a href="./space-v2.html#space">V2 ↗</a><a href="./index.html#space">原版 ↗</a>';
      const key=document.createElement('div');key.className='space-v21-scene-key';key.textContent='外观 · 高度 · 场地为 SIMULATED 展示重建';
      map.append(tag,key);
      for(const [id,text]of [['floor_1','01F · 一层 CAD'],['floor_2','02F · 二层 CAD']]){const label=document.createElement('span');label.className='space-v21-floor-tag';label.dataset.v21FloorTag=id;label.textContent=text;label.hidden=true;map.append(label);}
    }
    const inspector=root.querySelector('.space-inspector-content');
    if(inspector&&!inspector.querySelector('.space-v21-info')){
      const panel=document.createElement('section');panel.className='space-panel space-v21-info';
      panel.innerHTML='<div class="space-panel-title"><span>建筑模型说明</span><small>STAGE 01</small></div><div class="space-v21-info-body"><span class="space-v21-status">PDF REFERENCE / SIMULATED</span><h3>观前街1号</h3><p>白色山墙 · 黑色框架 · 玻璃幕墙<br>沿街门面 · 坡屋面参考重建</p><dl><dt>内部空间</dt><dd>原始 CAD · 1F / 2F</dd><dt>跨层配准</dt><dd>共享 CAD 轴网推导</dd><dt>实际标高 / 高度</dt><dd>未测量 · 数据保留 null</dd><dt>外观尺寸 / 分格</dt><dd>SIMULATED</dd><dt>场地与绿化</dt><dd>SIMULATED</dd></dl><details open><summary>二层中空与楼梯保留区</summary><p>CAD #189F「建-孔」及相邻闭合线网支持一个约 187.19㎡ 洞口；面积为图面推导，非实测。新展示楼板已扣除该区域。</p><p>另保留 4 处楼梯平面区域，不生成普通平面。楼梯真实高差及踏步高度未知。</p><p>一层「上部洞口」目标楼板未确认，未直接切穿一层。</p></details><p class="space-v21-limits">PDF 仅用于外观参考；框架分格、屋顶坡度和全部竖向尺寸为展示参数。内部只建立已有两层，未增加其他楼层。</p><span class="space-v21-stage-note">分析图层：第二阶段 · NOT CONNECTED</span></div>';
      inspector.prepend(panel);
    }
    const provenance=root.querySelector('.space-model-provenance');
    if(provenance&&!provenance.dataset.v21){provenance.dataset.v21='true';provenance.innerHTML='<span>平面 <b>CAD</b></span><span>外观 / 高度 / 场地 <b>SIMULATED</b></span><span>轴网配准 · 未实测</span>';}
    if(view.viewMode==='3d'){
      const title=root.querySelector('#space-map-title');if(title&&title.textContent!==titles[state.mode])title.textContent=titles[state.mode];
    }
    for(const button of root.querySelectorAll('[data-v21-mode]'))button.setAttribute('aria-pressed',String(button.dataset.v21Mode===state.mode));
    for(const input of root.querySelectorAll('[data-v21-floor]'))input.checked=state.floors[input.dataset.v21Floor];
    const canvas=map.querySelector('canvas.space-webgl');
    if(canvas&&current()?.setPresentation&&!connected.has(canvas)){connected.add(canvas);current().setPresentation(state);updateLabels();}
  }
  const observer=new MutationObserver(()=>{decorate();updateLabels();});observer.observe(root,{childList:true,subtree:true});
  root.addEventListener('hubone-v21-draw',updateLabels,{signal:abort.signal});
  root.addEventListener('hubone-v21-change',updateLabels,{signal:abort.signal});
  // Update preview state before the original SpaceView handlers rebuild a floor.
  root.addEventListener('click',e=>{
    const floor=e.target.closest('[data-space-floor]');
    if(floor){state.mode='interior';state.floors={floor_1:false,floor_2:false,[floor.dataset.spaceFloor]:true};}
    if(e.target.closest('[data-space-building]')){state.mode='overview';state.floors={floor_1:true,floor_2:true};}
  },{capture:true,signal:abort.signal});
  root.addEventListener('click',e=>{
    const mode=e.target.closest('[data-v21-mode]');
    if(mode){set({mode:mode.dataset.v21Mode});if(view.drawerMedia.matches)view.setDrawer(false);}
    if(e.target.closest('[data-v21-opening]')){
      state.mode='interior';state.floors={floor_1:false,floor_2:true};current()?.focusOpening();decorate();if(view.drawerMedia.matches)view.setDrawer(false);
    }
  },{signal:abort.signal});
  root.addEventListener('change',e=>{
    if(e.target.matches('[data-v21-floor]')){
      state.floors[e.target.dataset.v21Floor]=e.target.checked;set({mode:state.mode==='overview'?'interior':state.mode});
    }
    if(e.target.matches('[data-v21-context]'))set({context:e.target.checked});
    if(e.target.matches('[data-v21-roof]'))set({roof:e.target.checked});
  },{signal:abort.signal});
  root.addEventListener('input',e=>{if(e.target.matches('[data-v21-gap]'))set({gap:Number(e.target.value)});},{signal:abort.signal});
  decorate();
  const originalDestroy=view.destroy.bind(view);
  view.destroy=()=>{observer.disconnect();abort.abort();root.classList.remove('space-v21-stage1');delete root.dataset.v21SceneMode;originalDestroy();};
  return view;
}
