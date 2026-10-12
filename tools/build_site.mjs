// Keep original authoring assets in source/downloads; publish the runtime sheets.
import fs from 'node:fs';
import path from 'node:path';
const dist=path.resolve(import.meta.dirname,'../dist'),out=path.join(dist,'client');
const sprites=JSON.parse(fs.readFileSync(path.join(dist,'assets/sprites.js'),'utf8').slice('window.SPRITES='.length,-1)),used=new Set(Object.values(sprites).flatMap(s=>[s.animations,s.formationLeader?.animations].filter(Boolean).flatMap(a=>Object.values(a).map(m=>m.file))));
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
function copy(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const source=path.join(dir,entry.name);if(source===out)continue;
 if(entry.isDirectory()){copy(source);continue}
 const relative=path.relative(dist,source),species=relative.match(/^assets\/(\d+)\//)?.[1];
 if(relative==='assets/sprites_manifest.json'||relative==='assets/moves-source.json')continue;
 if(relative.startsWith('assets/national/')&&!used.has(relative))continue;
 if(species&&Number(species)>151&&Number(species)!==200&&(entry.name.endsWith('-Shadow.png')||entry.name.endsWith('.xml')))continue;
 const target=path.join(out,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);
}}
copy(dist);console.log('Site runtime prepared: '+out);
