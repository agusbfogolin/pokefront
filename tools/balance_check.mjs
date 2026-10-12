// Smoke test for trained species against Rattata sparring: not a competitive tier list.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),data={window:{}};
for(const file of ['moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+file+'.js',import.meta.url),'utf8'),data);
const F=require('../dist/core.js')(data.window.SPECIES_DATA,data.window.MOVE_DATA,data.window.SPECIES_KITS,data.window.EVOLUTION_DATA,data.window.TYPE_CHART,data.window.EXTRA_MOVE_RULES);require('../dist/progression.js')(F,data.window.SPECIES_LEARNSETS);const C=require('../dist/combat.js')(F);
const results=[];
for(const id of F.KANTO_IDS){const c=F.makeCreature(id,30,500+id);c.iv=[31,31,31,31,31,31];const attack=F.moves(c)[0].special?3:1;c.nature={name:'Especializada',up:attack,down:attack===1?3:1};c.ev[attack]=252;c.ev[0]=252;c.ev[5]=6;
const b=C.create(c,{creature:F.makeCreature(19,30,404)},19+id);let frame=0;for(;frame<10800&&!b.result;frame++){const [p,e]=b.fighters,m=C.moves(p),dx=e.x-p.x,dz=e.z-p.z,d=C.distance(p,e),range=Math.min(m[0].range,m[1].range),preferred=Math.max(62,range*.68);C.step(b,1/60,{left:dx< -preferred,right:dx>preferred,up:dz< -22,down:dz>22});
if(C.canUse(b,0,'m2').ready&&(m[2].kind==='self'||d<m[2].range*.85))C.action(b,0,'m2');for(const key of m.map((_,i)=>'m'+i).filter(k=>k!=='m2')){const move=m[Number(key[1])];if(d<move.range*.9&&C.canUse(b,0,key).ready)C.action(b,0,key)}
if(c.id===132&&!p.formId)C.action(b,0,'m0');}
results.push({id,name:F.DATA[id].name,result:b.result,seconds:Math.round(frame/60),enemyRemaining:Math.round(b.fighters[1].hp/b.fighters[1].maxHP*100)});}
const wins=results.filter(r=>r.result==='win');const failed=results.filter(r=>r.result!=='win');console.log('TRAINED SPECIES VS RATTATA SPARRING: '+wins.length+'/151 wins');console.log(JSON.stringify(failed));assert.equal(results.length,151);assert.ok(wins.length>=140,'Most trained species should handle same-level sparring');assert.ok(results.every(r=>r.result),'Every species must finish a real fight');assert.ok(results.filter(r=>[10,11,13,14,129,132].includes(r.id)).every(r=>r.result==='win'),'Small species and Ditto must be playable when trained');
