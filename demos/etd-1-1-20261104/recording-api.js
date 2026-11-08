/* Explicit real-recording transport. A disconnected API never falls back to fixtures. */
(() => {
  const mode = new URLSearchParams(location.search).get('mode');
  const enabled = mode === 'recording' || mode === 'live';
  const encode = encodeURIComponent;
  const assetPath = (sid, aid) => `/api/sessions/${encode(sid)}/assets/${encode(aid)}`;
  window.HUBONE_RECORDING = {
    enabled,
    isLive: mode === 'live',
    apiUrl: path => enabled ? '/api' + path : './api' + path,
    mediaUrl: (sid, aid) => assetPath(sid, aid),
    playbackUrl: (sid, aid) => `${assetPath(sid, aid)}/playback`,
    frameUrl: (sid, aid, name) => `${assetPath(sid, aid)}/frames/${encode(name)}`,
    async observations(sid, aid, signal) {
      let offset = 0, record = null, frames = [];
      do {
        const query = new URLSearchParams({offset: String(offset), limit: '1000'});
        if (record) query.set('run_id', record.run_id);
        const response = await fetch(`${assetPath(sid, aid)}/observations?${query}`, {signal, cache: 'no-store'});
        if (!response.ok) {
          const error = await response.json();
          throw Error(error.detail || `Observation API: ${response.status}`);
        }
        const page = await response.json();
        record ||= page;
        frames.push(...page.frames);
        offset += page.frames.length;
        if (!page.frames.length) break;
      } while (offset < record.total);
      return {...record, frames};
    },
    decorate() {
      if (!enabled) return;
      document.title = 'HUB ONE · Integrated Demo 1.3 · '+(mode==='live'?'RTSP 采集':'录像检测');
      document.querySelector('.api-link').textContent = '本地 API · 视觉数据';
      document.querySelector('.space-preview-note').textContent = 'CAD SOURCE · 观前街1号 · 家庭录像未绑定此建筑 · CAD 轨迹 NOT CONNECTED';
      document.querySelector('.c3-preview-note').textContent = '本地视觉数据 · RTSP 的 LIVE 状态以实际采集连接为准；录像 REAL_RECORDING、历史 REPLAY 与 SIMULATED 分别标记。家庭画面不映射观前街 CAD。';
      const replay = new URL(location.href); replay.search = '?mode=replay'; replay.hash = '#report';
      const demo = document.querySelector('#demo-btn');
      demo.textContent = '打开原 REPLAY';
      demo.onclick = () => location.assign(replay.href);
      document.querySelector('#new-session').textContent = '＋ 新建 Session';
    }
  };
})();
