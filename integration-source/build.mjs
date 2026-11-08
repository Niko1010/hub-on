/* Build only the integrated spatial bundle with the existing locked toolchain. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dependencyRoot=path.resolve(process.argv[2]||path.join(root,'../hub-on-space-v21-aesthetic/hubone-crestc3-demo'));
const require=createRequire(path.join(dependencyRoot,'package.json')),{build}=require('esbuild');
const threePackage=JSON.parse(await fs.readFile(path.join(dependencyRoot,'node_modules/three/package.json'),'utf8'));
const esbuildVersion=require('esbuild/package.json').version;
if(threePackage.version!=='0.180.0'||esbuildVersion!=='0.25.10')throw new Error('Use the reviewed Three 0.180.0 / esbuild 0.25.10 toolchain');
const site=path.join(root,'demos/etd-1-1-20261104'),bundle=path.join(site,'space-3d.bundle.js');
const license=bundle+'.LEGAL.txt',licenseBefore=await fs.readFile(license);
const result=await build({absWorkingDir:root,entryPoints:['integration-source/three/scene-integrated-product.js'],
  bundle:true,format:'esm',minify:true,target:'es2020',outfile:bundle,legalComments:'linked',metafile:true,
  nodePaths:[path.join(dependencyRoot,'node_modules')]});
if((await fs.readFile(license,'utf8')).replaceAll('\r\n','\n')===licenseBefore.toString().replaceAll('\r\n','\n'))await fs.writeFile(license,licenseBefore);
const engines=Object.keys(result.metafile.inputs).filter(p=>p.endsWith('/three/build/three.core.js'));
if(engines.length!==1)throw new Error('Expected exactly one Three.js core, got '+engines.length);
if(process.argv[3])await fs.writeFile(path.resolve(process.argv[3]),JSON.stringify(result.metafile,null,2));
console.log(JSON.stringify({bundle,threeCoreCopies:engines.length,threeVersion:threePackage.version,
  esbuildVersion,inputs:Object.keys(result.metafile.inputs).length}));
