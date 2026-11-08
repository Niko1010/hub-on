/* Instance-local registry. Every overlay is owned by its existing floorGroup. */
export function createSpatialLayerManager(view){
  const layers=new Map();
  return {
    add(id,layer){if(layers.has(id))throw new Error('Duplicate spatial layer: '+id);layers.set(id,layer);},
    set(id,options){const layer=layers.get(id);if(!layer)throw new Error('Unknown spatial layer: '+id);layer.set(options);view.invalidate();},
    diagnostics(){return Object.fromEntries([...layers].map(([id,layer])=>[id,layer.diagnostics()]));},
    dispose(){for(const layer of layers.values())layer.dispose();layers.clear();}
  };
}
