// External-entry module: no spatial data, embedded viewer, or network requests.
export function mountSpace(root) {
  root.innerHTML = `<section class="card"><div class="card-body">
    <div class="eyebrow">SPACE 3D · 原有云端演示</div>
    <h2>打开原有 Space 3D 演示</h2>
    <p>空间演示保留在原有云端页面。本页提供独立入口，打开后可使用原有空间交互。</p>
    <p><a class="button primary" href="https://niko1010.github.io/hub-on/#space" target="_blank" rel="noopener noreferrer">在新页面打开 Space 3D ↗</a></p>
    <p class="small-note">当前页面是 Crest C3 决策报告 1.1 的只读回放，不加载空间数据。</p>
  </div></section>`;
  return {destroy() { root.replaceChildren(); }};
}
