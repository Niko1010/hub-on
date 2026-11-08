# Integrated Demo 1.3 spatial integration

Current local product slice adds `hubone-product.js` / `hubone-product.css` around the
existing controller, and `three/scene-integrated-product.js` around the existing scene factory.
Space Management is the default home; Operations and Devices reuse that same mounted scene.
Original business navigation and replay content remain available. The approved architecture,
materials, lights, CAD and floor separation implementation are unchanged.

`visitor-flow-data/route-network.json` stores per-floor CAD WCS waypoints, classifications,
obstacle IDs and unresolved connections. Four CAD-checked floor segments animate; stairs and
colliding connectors are marker-only. The exit remains `ROUTE_PENDING`. `CONFIRMED` means
only a CAD projection check, not surveyed walkability. All traffic/regions/devices are SIMULATED.
Numerical batch time continues through pending segments while their particles are hidden and
counted separately. Full physical connectivity is not claimed. See `VERSION_MANAGEMENT.md`.

`operations/visitor-simulation.js` is a pure deterministic model. The new draw wrapper advances
it in the inherited animation loop; no second RAF, renderer or building is created. Heatmaps use
12 time samples, 2.5 m bins and up to 32 kernels per floor, clipped to existing hole-cut display
surfaces. Focus areas reuse independent simulated experience footprints, not new business data.
This slice has its own 319-file rollback snapshot and `outputs/integrated-1.3-flow` evidence.

The main application remains the existing `demos/etd-1-1-20261104/index.html`.
Its business scripts, replay adapters, Session/Event/report/media data and global CSS are unchanged.
The HTML uses spatial-only stylesheets and an import map. `space.js` remains the integrated
controller; `space-integrated-1.2.js` retains the approved V2.1 presentation controls,
`space-integrated-experience.js` adds the existing V2.2 controls, and `space-integrated-1.3.js`
adds the existing V2.3 point/FOV switches and device details to the same instance.
The existing `space-3d.bundle.js` output now bundles this one factory, never two renderers/bundles.

Source provenance:

- `three/scene.js`: exact existing V0.4 source corresponding to the original integrated bundle.
- `three/scene-v21.js`: approved V2.1 coordinator, retaining envelope, hole-safe display
  surfaces and exact continuous slider calculation; legacy SIMULATED operations are kept.
- `three/building-envelope-v21.js`, `site-context-v21.js`, `space-v21-data/*`: exact approved sources/data.
- `three/scene-integrated-selection.js`: existing V2 selection/edge logic, without its lighting or material overrides.
- `three/scene-integrated-1.2.js`: post-construction actual Mesh material colors; original material
  types and non-color PBR values retained. Existing light/exposure/SSAO values retained. Fixed
  shadow frustum covers the approved full travel without changing light intensity or color.
- `three/scene-v22.js`: existing experience-layer adapter, with its baseline import redirected
  to the unchanged `scene-integrated-1.2.js` implementation.
- `three/scene-integrated-1.3.js`: existing V2.3 adapter, using the V2.2 layer and existing camera callbacks.
- `three/spatial-layer-manager-v22.js`, `experience-area-overlay-v22.js`, `camera-layer-v23.js`,
  `space-v22-data/experience-areas.json` and `space-v23-data/*`: byte-identical independent V2.3 dependencies.
  New geometry is attached to the existing floor groups; no new renderer, building or slider offset is created.

Build using existing dependencies, no package/lock changes or downloads:

```powershell
node integration-source/build.mjs D:/path/to/existing/hubone-crestc3-demo
```

The dependency directory must have the existing locked Three 0.180.0 and esbuild 0.25.10.
An optional third argument writes the esbuild metafile outside the application for audit.
The script writes only the spatial bundle; it does not regenerate CAD or business replay data.
Only one Three.js core is permitted in that build graph. No runtime CDN or second bundle is used.

Actual architectural dimensions/heights and the PDF-reference envelope remain SIMULATED.
The imported display slab removes the existing V2.1 CAD-supported opening and four stair-plan
reservations. Authoritative CAD/model JSON, stable IDs, XYZ, normal and UV data are not edited.
V2.2 experience regions and V2.3 cameras are now integrated. Experience regions default on;
camera points and FOV default off, independently. Each floor has three SIMULATED cameras.
Actual installation coordinates/heights/directions/FOV are unverified, and no real coverage rate is claimed.
The 1.2 architectural baseline remains unchanged; the optional independent 1F visual study is not applied.
The added controller uses the original 3D-only visibility classes; architectural help is hidden
in 2D and while the original Inspector displays a selected object. No shared styles are edited.

Rollback uses the complete original integrated directory and its SHA-256 manifest supplied
with local acceptance outputs. No branch reset, commit, push, merge or deployment is performed.
The additional 1.2-to-1.3 rollback snapshot preserves all 307 pre-existing files. See
`VERSION_MANAGEMENT.md` and the separate `outputs/integrated-1.3` delivery records.
