/* Product views over the existing SpaceView. No renderer, model, API or business router is created here. */
import {mountSpace as mountSpatial} from './space-integrated-1.3.js?v=integrated-1.3-20261107';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>Number.isFinite(Number(v))?Number(v).toLocaleString('zh-CN',{maximumFractionDigits:1}):'—';
const modules={
  space:{name:'空间管理',en:'SPACE MANAGEMENT',intro:'观前街1号 · 定义空间，连接体验',sections:[['overview','建筑总览'],['interior','内部空间'],['regions','空间区域'],['cameras','摄像头布局'],['assets','空间资产'],['connections','数据连接']]},
  operations:{name:'运营分析',en:'OPERATIONS INTELLIGENCE',intro:'观前街1号 · 理解空间中的消费者行为',sections:[['simulation','客流模拟'],['summary','运营总览'],['heatmap','人群热力'],['routes','消费者动线'],['dwell','停留与体验']]},
  devices:{name:'设备管理',en:'DEVICE MANAGEMENT',intro:'设备台账与接入状态 · 所有示意点位均为 SIMULATED',sections:[['inventory','摄像头设备'],['streams','视频流接入'],['algorithms','算法状态'],['health','设备健康']]}
};
const dailyEstimates={5:6600,5.5:6000,6:5500},meanEstimates={20:167,30:250,45:375,60:500,90:745,120:979};
let controller=null,pendingModule=null,navObserver=null;

function decorateNavigation(){
  const nav=document.querySelector('#nav'),space=nav?.querySelector('a[href="#space"]');if(!space)return;
  space.dataset.hpModule='space';
  const name=space.querySelector('.nav-text');if(name&&name.textContent!==modules.space.name)name.textContent=modules.space.name;
  const icons={operations:'<path d="M4 19V5M4 19h16M8 15l4-5 4 2 4-7"/>',devices:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>'};
  let previous=space;
  for(const key of ['operations','devices']){
    let link=nav.querySelector(`[data-hp-module="${key}"]`);
    if(!link){link=document.createElement('a');link.href='#space';link.className='nav-link hp-product-nav';link.dataset.hpModule=key;link.innerHTML=`<span class="nav-icon"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg></span><span class="nav-text">${modules[key].name}</span><span class="nav-index">${key==='operations'?'02':'03'}</span>`;previous.after(link);}
    previous=link;
  }
  for(const link of nav.querySelectorAll('[data-hp-module]')){
    const active=location.hash==='#space'&&link.dataset.hpModule===(controller?.module||pendingModule||'space');
    link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  }
  [...nav.querySelectorAll('a.nav-link')].forEach((link,index)=>{const badge=link.querySelector('.nav-index'),label=String(index+1).padStart(2,'0');if(badge&&badge.textContent!==label)badge.textContent=label;});
}

/** May also be called by the entry adapter before the first space mount. */
export function initializeProductNavigation(){
  if(navObserver)return;
  const nav=document.querySelector('#nav');if(!nav)return;
  navObserver=new MutationObserver(decorateNavigation);navObserver.observe(nav,{childList:true,subtree:true});
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[data-hp-module]');if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;
    event.preventDefault();
    if(controller&&location.hash==='#space')controller.activate(link.dataset.hpModule);
    else{pendingModule=link.dataset.hpModule;if(location.hash!=='#space')location.hash='space';}
  });
  window.addEventListener('hashchange',decorateNavigation);decorateNavigation();
}
initializeProductNavigation();

export function mountSpace(root){
  const view=mountSpatial(root),abort=new AbortController();
  root.classList.add('hubone-product');
  const state={module:pendingModule||'space',section:null,selectedRegionId:null,intervalMinutes:6,dwellMinutes:30,speed:1,floorFilter:'all',playing:true,routes:false,heatmap:false,highlights:false,timeWindowMinutes:15};
  pendingModule=null;state.section=modules[state.module].sections[0][0];
  let mounted=false,lastScene=null,lastRefresh=0,lastDevices='',lastRegions='',lastSettings='',settingScene=false;
  const $=selector=>root.querySelector(selector),engine=()=>view.threeView;
  const setText=(selector,text)=>{const el=$(selector);if(el&&el.textContent!==String(text))el.textContent=String(text);};
  function flowSettings(){return {enabled:state.module==='operations',playing:state.playing,intervalMinutes:state.intervalMinutes,dwellMinutes:state.dwellMinutes,speed:state.speed,floorFilter:state.floorFilter};}
  function pushSettings(force=false){
    const scene=engine();if(!scene||settingScene)return;
    const settings={flow:flowSettings(),layers:{routes:state.routes,heatmap:state.heatmap,highlights:state.highlights,timeWindowMinutes:state.timeWindowMinutes,selectedRegionId:state.selectedRegionId}};
    const key=JSON.stringify(settings);if(!force&&key===lastSettings)return;
    lastSettings=key;settingScene=true;
    try{scene.setVisitorFlow?.(settings.flow);scene.setAnalyticsLayers?.(settings.layers);}finally{settingScene=false;}
  }
  function existingToggle(selector,checked){const input=$(selector);if(input&&input.checked!==checked){input.checked=checked;input.dispatchEvent(new Event('change',{bubbles:true}));}}
  function presentation(update){
    if(view.viewMode!=='3d')return;
    engine()?.setPresentation?.(update);
  }
  function ensure3D(){if(view.viewMode!=='3d')view.setMode('3d');}
  function activate(module,section){
    if(!modules[module])return;
    const oldModule=state.module;state.module=module;state.section=section||modules[module].sections[0][0];root.scrollTop=0;
    if(!modules[module].sections.some(([key])=>key===state.section))state.section=modules[module].sections[0][0];
    root.dataset.productModule=module;root.dataset.productSection=state.section;delete root.dataset.devicePreview;
    if(module==='operations'){
      ensure3D();presentation(oldModule==='operations'?{mode:'interior'}:{mode:'interior',floors:{floor_1:state.floorFilter!=='floor_2',floor_2:state.floorFilter!=='floor_1'}});
      if(state.section==='heatmap')state.heatmap=true;
      if(state.section==='routes')state.routes=true;
      if(state.section==='dwell')existingToggle('[data-v22-experience]',true);
    }else if(module==='space'){
      if(['overview','interior','regions','cameras'].includes(state.section)){
        presentation(state.section==='overview'?{mode:'overview',floors:{floor_1:true,floor_2:true},separation:0}:{mode:'interior'});
        if(state.section==='regions'){existingToggle('[data-v22-experience]',true);state.highlights=true;}
        if(state.section==='cameras')existingToggle('[data-v23-layer="markers"]',true);
      }
    }
    syncShell();pushSettings();refresh(true);decorateNavigation();
    // ResizeObserver in the existing scene owns canvas sizing. Fit only when returning from a hidden product pane.
    if(oldModule==='devices'&&module!=='devices')queueMicrotask(()=>engine()?.fit?.(false));
    root.dispatchEvent(new CustomEvent('hubone-product-view',{bubbles:true,detail:{module,section:state.section}}));
  }
  function sectionOptions(){return modules[state.module].sections.map(([key,label])=>`<option value="${key}"${key===state.section?' selected':''}>${label}</option>`).join('');}
  function syncShell(){
    if(!mounted)return;
    root.dataset.productModule=state.module;root.dataset.productSection=state.section;
    const m=modules[state.module],signature=state.module+':'+state.section;
    if($('.hp-subnav').dataset.signature!==signature){
      $('.hp-subnav').dataset.signature=signature;
      $('.hp-subnav').innerHTML=m.sections.map(([key,label])=>`<button type="button" data-hp-section="${key}" aria-pressed="${key===state.section}">${label}</button>`).join('');
      $('[data-hp-section-select]').innerHTML=sectionOptions();
    }
    for(const [id,text]of [['#breadcrumb',m.name],['#page-title',m.name],['#page-subtitle',m.intro],['#page-eyebrow','HUB ONE / '+m.en],['#workspace-context',m.name],['#footer-product','HUB ONE · INTEGRATED DEMO 1.3']]){
      const node=document.querySelector(id);if(node&&node.textContent!==text)node.textContent=text;
    }
    const badge=document.querySelector('#mode');if(badge)badge.textContent=state.module==='space'?'CAD SOURCE · mm':'SIMULATED · 本地演示';
    setText('.hp-view-caption',m.sections.find(([key])=>key===state.section)?.[1]||m.name);
    for(const input of root.querySelectorAll('[data-hp-layer]'))input.checked=Boolean(state[input.dataset.hpLayer]);
    $('[data-hp-module-select]').value=state.module;
    for(const node of root.querySelectorAll('[data-hp-page]'))node.hidden=node.dataset.hpPage!==state.section;
    $('.hp-data-pane').hidden=!['assets','connections','inventory','streams','algorithms','health'].includes(state.section);
    $('.hp-operations-bar').hidden=state.module!=='operations';
    $('.hp-analytics-panel').hidden=state.module!=='operations';
    $('.hp-space-help').hidden=state.module!=='space';
    if(state.section==='assets')$('.hp-assets-host .space-assets')?.setAttribute('open','');
    root.querySelectorAll('[data-hp-link-region]').forEach(b=>b.hidden=!state.selectedRegionId);
  }
  function moveLegacyPanels(){
    const overview=$('.space-overview-title')?.closest('section');
    if(overview&&!overview.closest('.hp-assets-host')){
      // Keep original metric IDs and update hooks; only change their presentation location.
      const metrics=overview.querySelector('.space-metrics');
      const rows=[...(metrics?.children||[])];for(const row of rows.slice(2))$('.hp-real-device-counts').append(row);
      const note=overview.querySelector('.space-inventory-note');if(note)$('.hp-real-device-counts').append(note);
      const operations=overview.querySelector('.space-no-metrics');if(operations)$('.hp-connection-host').append(operations);
      $('.hp-assets-host').append(overview);
    }
    const bridge=$('.space-bridge');if(bridge&&!bridge.closest('.hp-connection-host'))$('.hp-connection-host').append(bridge);
    const info=$('.space-inspector-content > .space-v21-info:not(.hp-retained-marker)');
    if(info){
      // The V2.1 adapter checks for this marker before injecting its unchanged provenance card.
      const marker=document.createElement('span');marker.className='space-v21-info hp-retained-marker';marker.hidden=true;info.before(marker);$('.hp-assets-host').append(info);
    }
    const assets=$('.space-controls > .space-assets');if(assets)$('.hp-assets-host').append(assets);
    const legacy=$('.space-layer-list');
    if(legacy&&!legacy.querySelector('.hp-current-layers')){
      const current=document.createElement('div');current.className='hp-current-layers';
      const older=document.createElement('details');older.className='hp-legacy-layers';older.innerHTML='<summary>原有图层与接口状态</summary>';
      for(const row of [...legacy.children])if(!row.querySelector('[data-v23-layer]')&&!row.matches('.space-v23-camera-floors'))older.append(row);
      legacy.append(current,older);
    }
    for(const row of root.querySelectorAll('.space-layer-list > .space-v23-camera-toggle,.space-layer-list > .space-v23-camera-floors'))$('.hp-current-layers')?.append(row);
    const simulation=$('.space-controls > .space-simulation');if(simulation)$('.hp-connection-host').append(simulation);
  }
  function build(){
    if(mounted||!$('.space-workspace'))return;
    const toolbar=document.createElement('section');toolbar.className='hp-toolbar';toolbar.setAttribute('aria-label','产品模块与页面');
    toolbar.innerHTML=`<div class="hp-mobile-navigation"><label>业务模块<select data-hp-module-select>${Object.entries(modules).map(([key,m])=>`<option value="${key}">${m.name}</option>`).join('')}</select></label><label>页面<select data-hp-section-select>${sectionOptions()}</select></label></div><nav class="hp-subnav" aria-label="模块二级导航"></nav><div class="hp-view-line"><strong class="hp-view-caption"></strong><span>同一建筑 · 同一坐标 · Integrated 1.3</span></div>`;
    $('.space-location').before(toolbar);
    const controls=document.createElement('section');controls.className='hp-operations-bar';controls.hidden=true;
    controls.innerHTML=`<div class="hp-simulation-top"><div><span class="hp-eyebrow">VISITOR FLOW ENGINE</span><strong>模拟客流 <span class="hp-badge">SIMULATED</span></strong></div><div class="hp-playback"><button data-hp-play aria-pressed="true">暂停</button><button data-hp-reset>重置</button><label>速度<select data-hp-flow="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label><span class="hp-clock" data-hp-stat="simulationTime">09:30</span></div></div><div class="hp-flow-inputs"><label>入场间隔<select data-hp-flow="intervalMinutes"><option value="5">5 分钟</option><option value="5.5">5.5 分钟</option><option value="6" selected>6 分钟</option></select></label><label>平均停留<select data-hp-flow="dwellMinutes">${Object.keys(meanEstimates).map(x=>`<option value="${x}"${x==='30'?' selected':''}>${x} 分钟</option>`).join('')}</select></label><label>展示楼层<select data-hp-flow="floorFilter"><option value="all">全路径 · 1F + 2F</option><option value="floor_1">一层 · 1F</option><option value="floor_2">二层 · 2F</option></select></label><div class="hp-batch"><span>每批固定</span><b>50 <small>人</small></b></div><div class="hp-batch"><span>当前批次</span><b data-hp-stat="currentBatch">0</b></div></div><div class="hp-kpis">${[['dailyEstimate','每日客流估算','5,500'],['givenMeanOccupancy','平均在场估算','250'],['currentOccupancy','当前模拟在场','0'],['dailyCumulative','当日模拟累计','0']].map(([key,label,value])=>`<div><span>${label}</span><strong data-hp-stat="${key}">${value}</strong><small>人${key==='givenMeanOccupancy'?' · 用户第三版估算':''}</small></div>`).join('')}</div><div class="hp-flow-note"><span>展示粒子 <b data-hp-stat="displayParticleCount">0</b> · 连续密度示意 · 不按粒子反算人数</span><span data-hp-stat="clockScale">模拟时钟</span><span>09:30–20:30 入场 · 21:30 闭馆</span></div><details class="hp-estimate-note"><summary>查看估算口径与闭馆规则</summary><p>每日客流估算与平均在场人数沿用用户第三版测算，分别列示，不随当前粒子数反算。模拟累计、当前在场和展示粒子是不同指标。20:30 后停止生成入场批次，21:30 闭馆；超过闭馆时间的计划停留需要提前离场，当前模拟并非真实客流预测。</p></details>`;
    const routeNotice=document.createElement('details');routeNotice.className='hp-route-notice';routeNotice.hidden=true;routeNotice.dataset.hpRouteNotice='';routeNotice.innerHTML='<summary data-hp-route-summary>分段模拟 · 已检查片段播放 · 跨层 UNVERIFIED · 出口 ROUTE_PENDING</summary><p data-hp-route-notice-detail></p>';controls.prepend(routeNotice);
    const seek=document.createElement('label');seek.className='hp-clock-seek';seek.innerHTML='<span>模拟时钟定位</span><input type="range" data-hp-clock-seek min="0" max="720" value="0" step="1" aria-label="模拟营业时间，09:30至21:30"><small>09:30 → 21:30</small>';
    controls.querySelector('.hp-flow-note').after(seek);
    const routeCounts=document.createElement('div');routeCounts.className='hp-route-counts';routeCounts.innerHTML='<span>已检查片段粒子 <b data-hp-stat="confirmedParticleCount">—</b></span><span>模拟连接粒子 <b data-hp-stat="simulatedConnectionParticleCount">—</b></span><span>待核片段粒子 <b data-hp-stat="pendingParticleCount">—</b><small>不计入可见粒子</small></span><p>CONFIRMED 仅表示 CAD 投影通行检查通过，客流仍为 SIMULATED。跨层与出口连接独立标记；出口 ROUTE_PENDING。</p>';
    controls.querySelector('.hp-flow-note').append(routeCounts);
    const parameters=document.createElement('details');parameters.className='hp-parameters';parameters.innerHTML='<summary>模拟参数与时钟 <span data-hp-parameters-summary>6 分钟 / 批 · 停留 30 分钟 · 全路径 · 每批 50 人</span></summary><div class="hp-parameters-body"></div>';
    const parameterBody=parameters.querySelector('.hp-parameters-body');
    parameterBody.append(controls.querySelector('.hp-flow-inputs'),seek,routeCounts.querySelector('p'),controls.querySelector('.hp-estimate-note'));
    controls.append(parameters);
    toolbar.after(controls);
    const pane=document.createElement('section');pane.className='hp-data-pane';pane.hidden=true;
    pane.innerHTML=`<section data-hp-page="assets" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">SPACE ASSETS</span><h2>空间资产与来源</h2></div><span class="hp-badge hp-neutral">CAD SOURCE</span></div><div class="hp-assets-host"></div></section><section data-hp-page="connections" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">DATA CONNECTION</span><h2>数据来源与连接详情</h2></div></div><div class="hp-source-states"><div><b>SIMULATED</b><span>当前运营、点位及视场演示</span></div><div><b>REAL</b><span>真实设备 / 轨迹尚未接入</span></div><div><b>VALIDATED</b><span>尚未完成现场标定与质量验证</span></div></div><div class="hp-connection-host"></div></section><section data-hp-page="inventory" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">CAMERA INVENTORY</span><h2>摄像头设备台账</h2></div><span class="hp-badge">SIMULATED</span></div><p class="hp-note">这里列出空间模块已有的示意设备。型号、真实安装清单和视频流尚未提供。</p><div class="hp-real-device-counts"></div><div class="hp-table-wrap"><table class="hp-device-table"><thead><tr><th>Camera ID</th><th>楼层</th><th>型号 / 状态</th><th>CAD 安装位置 mm</th><th>方向 / 高度</th><th>操作</th></tr></thead><tbody data-hp-device-rows></tbody></table></div><button class="hp-outline" data-hp-device-preview>展开共享建筑视图</button></section><section data-hp-page="streams" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">VIDEO STREAMS</span><h2>视频流接入</h2></div><span class="hp-badge hp-neutral">NOT_CONNECTED</span></div><p class="hp-note">当前未配置真实 RTSP 地址；主码流、子码流、断流监测尚未接入。</p><div class="hp-table-wrap"><table><thead><tr><th>设备</th><th>主码流</th><th>子码流</th><th>连接 / 断流状态</th></tr></thead><tbody data-hp-stream-rows></tbody></table></div><p class="hp-note">本地演示不收集或保存设备凭据。真实视频接入将在独立接入阶段配置。</p></section><section data-hp-page="algorithms" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">INFERENCE PIPELINE</span><h2>算法运行状态</h2></div><span class="hp-badge hp-neutral">NOT_CONNECTED</span></div><div class="hp-status-grid">${[['YOLO','目标检测'],['ByteTrack','多目标跟踪'],['推理 FPS','—'],['推理延迟','—'],['GPU 显存','—']].map(([label,sub])=>`<article><span>${label}</span><strong>${sub}</strong><small>NOT_CONNECTED</small></article>`).join('')}</div><p class="hp-note">尚未启动真实推理服务；粒子演示不代表 YOLO 或 ByteTrack 的分析结果。</p></section><section data-hp-page="health" hidden><div class="hp-pane-heading"><div><span class="hp-eyebrow">DEVICE HEALTH</span><h2>设备健康状态</h2></div></div><div class="hp-status-grid">${['在线设备','离线设备','连接异常','推理异常'].map(label=>`<article><span>${label}</span><strong>—</strong><small>NOT_CONNECTED</small></article>`).join('')}</div><p class="hp-note">未连接真实设备，无法判定在线、离线或异常数量。示意设备数量不等于真实安装数量。</p></section>`;
    controls.after(pane);
    const layers=document.createElement('details');layers.className='hp-analysis-layers';layers.open=true;
    layers.innerHTML=`<summary>空间分析图层 <span class="hp-badge">SIMULATED</span></summary>${[['routes','游览路线','purple'],['heatmap','人群热力','blue'],['highlights','重点区域','pink']].map(([key,label,color])=>`<label><input type="checkbox" data-hp-layer="${key}"><i class="hp-layer-dot ${color}"></i>${label}</label>`).join('')}<label class="hp-time-window">热力时间窗口<select data-hp-window>${[15,30,60,120].map(n=>`<option value="${n}"${n===state.timeWindowMinutes?' selected':''}>${n} 分钟</option>`).join('')}</select></label>`;
    $('.space-controls').append(layers);
    const quick=document.createElement('div');quick.className='hp-separation-presets';quick.setAttribute('aria-label','楼层分离预设');quick.innerHTML='<button data-hp-separation="0">0%</button><button data-hp-separation="0.5">50%</button><button data-hp-separation="1">100%</button>';
    $('.space-3d-tools').append(quick);
    const help=document.createElement('section');help.className='hp-space-help space-panel';help.innerHTML='<span class="hp-eyebrow">EXPLORE THE BUILDING</span><h3>从空间开始</h3><p>旋转建筑、切换楼层，点击空间或设备查看详情。</p><button data-hp-go="operations:simulation">进入客流模拟 ↗</button>';
    const analytics=document.createElement('section');analytics.className='hp-analytics-panel space-panel';analytics.hidden=true;
    analytics.innerHTML='<div class="hp-pane-heading"><h3>模拟运营状态</h3><span class="hp-badge">SIMULATED</span></div><div class="hp-floor-kpis"><div><span>一层在场</span><b data-hp-stat="floor_1">0</b></div><div><span>二层在场</span><b data-hp-stat="floor_2">0</b></div></div><p class="hp-selected-region" data-hp-selected-region>全建筑 · 全部示意区域</p><button class="hp-clear-filter" data-hp-clear-region hidden>清除区域筛选</button><div data-hp-region-rows class="hp-region-rows"></div><p class="hp-note">区域人数、停留和参与数据来自同一模拟时钟，不是现场观测。体验区域业务边界待确认。</p>';
    $('.space-inspector-content').append(help,analytics);
    mounted=true;moveLegacyPanels();syncShell();
  }
  function records(){const value=engine()?.getDeviceRecords?.();return Array.isArray(value)?value:Array.isArray(value?.items)?value.items:[];}
  function refreshDevices(){
    const cameras=records(),key=JSON.stringify(cameras);if(key===lastDevices)return;lastDevices=key;
    $('[data-hp-device-rows]').innerHTML=cameras.map(c=>`<tr><td><strong>${esc(c.camera_id)}</strong><small>SIMULATED · 未验证</small></td><td>${c.floor_id==='floor_1'?'1F':'2F'}</td><td>型号未提供<small>NOT_CONNECTED</small></td><td>X ${num(c.x)}<br>Y ${num(c.y)}<small>原 CAD WCS</small></td><td>${num(c.direction)}°<br>${num(c.mount_height_mm/1000)} m <small>SIMULATED</small></td><td><button data-hp-locate-camera="${esc(c.camera_id)}">在空间定位 ↗</button></td></tr>`).join('')||'<tr><td colspan="6">正在读取已有摄像头模拟配置…</td></tr>';
    $('[data-hp-stream-rows]').innerHTML=cameras.map(c=>`<tr><td>${esc(c.camera_id)}</td><td>未配置</td><td>未配置</td><td>NOT_CONNECTED</td></tr>`).join('')||'<tr><td colspan="4">尚未接入真实设备</td></tr>';
  }
  function refresh(force=false){
    if(!mounted)return;
    const now=performance.now();if(!force&&now-lastRefresh<250)return;lastRefresh=now;
    const snapshot=engine()?.getVisitorFlow?.()||{},analytics=engine()?.getFlowAnalytics?.()||{};
    const values={dailyEstimate:snapshot.dailyEstimate??dailyEstimates[state.intervalMinutes],givenMeanOccupancy:snapshot.givenMeanOccupancy??meanEstimates[state.dwellMinutes],currentOccupancy:snapshot.currentOccupancy??0,dailyCumulative:snapshot.dailyCumulative??0,currentBatch:snapshot.currentBatch??0,displayParticleCount:snapshot.displayParticleCount??0,confirmedParticleCount:snapshot.confirmedParticleCount,pendingParticleCount:snapshot.pendingParticleCount,simulatedConnectionParticleCount:snapshot.simulatedConnectionParticleCount};
    for(const [key,value]of Object.entries(values))setText(`[data-hp-stat="${key}"]`,num(value));
    setText('[data-hp-stat="simulationTime"]',typeof snapshot.simulationTime==='string'?snapshot.simulationTime:'09:30');
    const seek=$('[data-hp-clock-seek]');if(seek&&document.activeElement!==seek&&Number.isFinite(snapshot.elapsedMinutes))seek.value=snapshot.elapsedMinutes;
    setText('[data-hp-stat="clockScale"]',snapshot.minutesPerRealSecond?`1× 时钟：1 秒 = ${num(snapshot.minutesPerRealSecond)} 模拟分钟`:'模拟时钟');
    const floors=snapshot.floorCounts||analytics.floorCounts||{};
    for(const id of ['floor_1','floor_2'])setText(`[data-hp-stat="${id}"]`,num(floors[id]?.currentOccupancy??floors[id]?.count??floors[id]??0));
    const play=$('[data-hp-play]');if(play){const playing=snapshot.playing??state.playing;play.textContent=snapshot.routeReady===false?'路径待确认':playing?'暂停':'播放';play.disabled=snapshot.routeReady===false;play.setAttribute('aria-pressed',String(playing));}
    const routeNotice=$('[data-hp-route-notice]');routeNotice.hidden=!snapshot.routeNotice&&snapshot.fullRouteVerified!==false&&snapshot.routeReady!==false;
    if(!routeNotice.hidden){
      setText('[data-hp-route-summary]',snapshot.routeReady===false?'路线待确认 · 完整播放暂不可用 · SIMULATED':'分段模拟 · 已检查片段播放 · 跨层 UNVERIFIED · 出口 ROUTE_PENDING');
      setText('[data-hp-route-notice-detail]','SIMULATED · '+(snapshot.routeNotice||(snapshot.routeReady===false?'参考游览路线与 CAD 通道存在待确认差异；完整路线播放暂不可用。运营估算参数仍可查看。':'已检查的楼层片段可以播放，跨层连接为独立模拟；出口 ROUTE_PENDING。完整路线尚未验证。')));
    }
    setText('[data-hp-parameters-summary]',`${state.intervalMinutes} 分钟 / 批 · 停留 ${state.dwellMinutes} 分钟 · ${{all:'全路径',floor_1:'一层',floor_2:'二层'}[state.floorFilter]} · 每批 50 人`);
    const regions=analytics.regionMetrics||snapshot.regionMetrics||[],definitions=analytics.regions||[];
    const raw=Array.isArray(regions)?regions:Object.entries(regions).map(([id,metric])=>({id,...metric}));
    const list=raw.map(r=>({...definitions.find(d=>d.id===(r.regionId||r.id)),...r}));
    const selected=state.selectedRegionId?list.filter(r=>[r.id,r.regionId,r.spatial_id,r.areaId,...(r.sourceRegionIds||[])].includes(state.selectedRegionId)):list;
    const key=JSON.stringify([selected,state.timeWindowMinutes,snapshot.routeReady]);if(key!==lastRegions){lastRegions=key;$('[data-hp-region-rows]').innerHTML=selected.slice(0,8).map(r=>{const window=r.windows?.[state.timeWindowMinutes];return `<div><strong>${esc(r.name||r.label||r.regionId||r.id||'示意区域')}</strong><dl><dt>当前模拟人数</dt><dd>${num(r.currentPeople??r.currentOccupancy??0)}</dd><dt>窗口平均人数</dt><dd>${num(window?.windowAveragePeople)}</dd><dt>窗口平均停留</dt><dd>${num(window?.meanObservedDwellMinutes??r.meanObservedDwellMinutes)} 分钟</dd><dt>窗口体验参与</dt><dd>${num(window?.windowVisitors)}</dd><dt>累计参与</dt><dd>${num(r.cumulativeParticipants)}</dd></dl></div>`;}).join('')||'<p class="hp-note">模拟开始后显示区域活动。尚未关联的 CAD 区域不推定为体验区域。</p>';
      if(snapshot.routeReady===false)$('[data-hp-region-rows]').insertAdjacentHTML('afterbegin','<p class="hp-note">候选路线采样估计；完整通行关系未确认。安全片段热力不能证明全程可通行。</p>');}
    setText('[data-hp-selected-region]',state.selectedRegionId?`区域筛选 · ${state.selectedRegionId}`:'全建筑 · 全部示意区域');
    $('[data-hp-clear-region]').hidden=!state.selectedRegionId;refreshDevices();
  }
  function connectScene(){
    const scene=engine();if(!scene||scene===lastScene)return;
    lastScene=scene;lastSettings='';lastDevices='';
    // V2.2 selects its own initial interior on mount; the product state is applied after all adapters decorate.
    queueMicrotask(()=>{if(abort.signal.aborted||scene!==engine())return;activate(state.module,state.section);pushSettings(true);});
  }
  const observer=new MutationObserver(()=>{build();if(mounted){moveLegacyPanels();connectScene();}});
  observer.observe(root,{childList:true,subtree:true});build();
  root.addEventListener('hubone-v21-draw',()=>{connectScene();refresh();},{signal:abort.signal});
  root.addEventListener('hubone-visitor-flow-change',()=>refresh(true),{signal:abort.signal});
  const originalInspectRegion=view.inspectRegion.bind(view);
  view.inspectRegion=(region,model)=>{
    const simulated=Boolean(region.experience_area_id||region.source==='SIMULATED');
    const id=region.experience_area_id||region.spatial_id||region.id;
    if(simulated){
      view.revealInspector('SIMULATED · 重点 / 体验区域');
      $('#space-selection').innerHTML=`<div class="space-object-card"><span class="space-badge simulated">SIMULATED</span><h3>${esc(region.name||'重点体验区域')}</h3><p class="space-detail-note">演示业务区域，未现场核验。边界约束来自现有展示楼板与 CAD 空间候选，不代表已经确认的业务或可通行区域。</p><dl><dt>示意区域 ID</dt><dd>${esc(id)}</dd><dt>所属楼层</dt><dd>${esc(region.floor_id||model?.floor_id||'—')}</dd><dt>来源区域</dt><dd>${esc(region.sourceRegionId||region.source_region_id||'保留在图层数据中')}</dd><dt>业务验证</dt><dd>未验证</dd></dl></div>`;
    }else originalInspectRegion(region,model);
    state.selectedRegionId=id;
    const card=$('#space-selection .space-object-card');if(card&&!card.querySelector('[data-hp-region-operations]')){const button=document.createElement('button');button.className='space-region-locate';button.dataset.hpRegionOperations=id;button.textContent='在运营分析查看此区域 ↗';card.append(button);}
  };
  const originalInspectCamera=view.inspectCameraRecord.bind(view);
  view.inspectCameraRecord=record=>{
    originalInspectCamera(record);
    const card=$('#space-selection .space-object-card');if(card&&record.visualization_version==='V2.3'&&!card.querySelector('[data-hp-locate-camera]')){const button=document.createElement('button');button.className='space-region-locate';button.dataset.hpLocateCamera=record.camera_id;button.textContent='查看空间安装位置 ↗';card.append(button);}
  };
  root.addEventListener('click',event=>{
    const target=event.target.closest('button');if(!target)return;
    if(target.dataset.hpSection)activate(state.module,target.dataset.hpSection);
    else if(target.dataset.hpGo){const [module,section]=target.dataset.hpGo.split(':');activate(module,section);}
    else if(target.hasAttribute('data-hp-play')){state.playing=!(engine()?.getVisitorFlow?.().playing??state.playing);pushSettings();refresh(true);}
    else if(target.hasAttribute('data-hp-reset')){engine()?.setVisitorFlow?.({action:'reset'});refresh(true);}
    else if(target.dataset.hpSeparation!==undefined){const rail=$('#space-explode-range');if(rail){presentation({mode:'interior'});rail.value=target.dataset.hpSeparation;rail.dispatchEvent(new Event('input',{bubbles:true}));}}
    else if(target.dataset.hpRegionOperations){state.selectedRegionId=target.dataset.hpRegionOperations;activate('operations','dwell');}
    else if(target.hasAttribute('data-hp-clear-region')){state.selectedRegionId=null;pushSettings();refresh(true);}
    else if(target.dataset.hpLocateCamera){
      const id=target.dataset.hpLocateCamera,c=records().find(c=>c.camera_id===id);activate('space','cameras');ensure3D();
      if(c){presentation({mode:'interior',floors:{floor_1:c.floor_id==='floor_1',floor_2:c.floor_id==='floor_2'}});view.inspectCameraRecord({...c,visualization_version:'V2.3'});}
      queueMicrotask(()=>{if(!abort.signal.aborted)engine()?.focusCamera?.(id);});
    }else if(target.hasAttribute('data-hp-device-preview')){const open=root.dataset.devicePreview!=='true';root.dataset.devicePreview=String(open);target.textContent=open?'收起共享建筑视图':'展开共享建筑视图';if(open)queueMicrotask(()=>engine()?.fit?.(false));}
  },{signal:abort.signal});
  root.addEventListener('change',event=>{
    const target=event.target;
    if(target.matches('[data-hp-module-select]'))activate(target.value);
    else if(target.matches('[data-hp-section-select]'))activate(state.module,target.value);
    else if(target.matches('[data-hp-flow]')){
      const key=target.dataset.hpFlow;state[key]=key==='floorFilter'?target.value:Number(target.value);
      if(key==='floorFilter')presentation({mode:'interior',floors:{floor_1:target.value!=='floor_2',floor_2:target.value!=='floor_1'}});
      pushSettings();refresh(true);
    }else if(target.matches('[data-hp-layer]')){state[target.dataset.hpLayer]=target.checked;pushSettings();}
    else if(target.matches('[data-hp-window]')){state.timeWindowMinutes=Number(target.value);pushSettings();refresh(true);}
    else if(target.matches('[data-hp-clock-seek]')){engine()?.setVisitorFlow?.({action:'seek',elapsedMinutes:Number(target.value)});refresh(true);}
  },{signal:abort.signal});
  controller={get module(){return state.module;},activate};initializeProductNavigation();decorateNavigation();
  view.product={activate,getState:()=>({...state}),refresh:()=>refresh(true)};
  const destroy=view.destroy.bind(view);
  view.destroy=()=>{observer.disconnect();abort.abort();if(controller?.activate===activate)controller=null;root.classList.remove('hubone-product');for(const key of ['productModule','productSection','devicePreview'])delete root.dataset[key];destroy();};
  return view;
}
