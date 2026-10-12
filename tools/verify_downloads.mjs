import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{assemble}=require('../dist/download-package.js'),dist=path.resolve(import.meta.dirname,'../dist'),manifest=JSON.parse(fs.readFileSync(path.join(dist,'downloads/manifest.json')));
for(const pack of Object.values(manifest)){
 let progress=0;const blob=await assemble(pack,async p=>{assert.ok(p.bytes<=20*1024*1024);const content=fs.readFileSync(path.join(dist,p.url));assert.equal(crypto.createHash('sha256').update(content).digest('hex'),p.sha256);return content},(bytes,total)=>{assert.ok(bytes>progress&&bytes<=total);progress=bytes});
 assert.equal(blob.size,pack.bytes);assert.equal(progress,pack.bytes);assert.equal(crypto.createHash('sha256').update(Buffer.from(await blob.arrayBuffer())).digest('hex'),pack.sha256);
}
await assert.rejects(()=>assemble({parts:[{bytes:2}],bytes:2},async()=>new Uint8Array(1)),/incompleta/);
await assert.rejects(()=>assemble({parts:[{bytes:2}],bytes:3},async()=>new Uint8Array(2)),/incompleto/);
const controller=new AbortController();controller.abort();await assert.rejects(()=>assemble({parts:[{bytes:2}],bytes:2},async()=>new Uint8Array(2),()=>{},controller.signal),{name:'AbortError'});
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(p=>p.isDirectory()?files(path.join(dir,p.name)):[path.join(dir,p.name)])}
const runtime=path.join(dist,'client'),runtimeFiles=files(runtime);let runtimeBytes=0;
for(const file of runtimeFiles){const source=path.join(dist,path.relative(runtime,file)),content=fs.readFileSync(file);assert.equal(Buffer.compare(content,fs.readFileSync(source)),0,'Runtime matches source '+file);assert.ok(content.length<25*1024*1024,file+' exceeds static asset limit');runtimeBytes+=content.length}
assert.ok(runtimeBytes+runtimeFiles.length*1024<256*1024*1024,'Expanded archive size with tar padding');
assert.ok(runtimeFiles.length<20000);
const registry=JSON.parse(fs.readFileSync(path.join(dist,'assets/sprites_manifest.json')));
for(const s of Object.values(registry))for(const a of [s.animations,s.formationLeader?.animations].filter(Boolean))for(const m of Object.values(a))assert.ok(fs.existsSync(path.join(runtime,m.file)),m.file+' published');
for(const file of ['index.html','game.js'])assert.ok(!/href="(?:proyecto|recursos-sprites)\.zip"/.test(fs.readFileSync(path.join(dist,file),'utf8')));
console.log('PASS: both complete ZIPs assemble with matching SHA256; size limits, corrupt/truncated data, cancellation and download links');
