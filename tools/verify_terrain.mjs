// Terrain invariants: real barriers, connected playable space and safe save migration.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),r={window:{}};
for(const f of ['items','moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);
const expected={campina:['tree','boulder'],forest:['tree','stump'],river:['water','tree'],marsh:['water','stump'],dunes:['cactus','cliff'],crater:['lava','basalt'],coast:['water','palm'],highlands:['cliff','pine'],frost:['ice','crystal']},found=Object.fromEntries(Object.keys(F.CITY).map(id=>[id,new Set()]));
let zones=0,bridges=0,landmarks=0,minDensity=1,maxDensity=0;
for(let seed=1;seed<=12;seed++)for(const m of Object.values(F.MAPS)){
 if(m.kind==='town')continue;zones++;
 const tiles=new Map(),walkable=[];let blocked=0;
 for(let y=m.bounds.top/32;y<m.bounds.bottom/32;y++)for(let x=m.bounds.left/32;x<m.bounds.right/32;x++){
  const t=F.mapTile(m.id,x,y,seed),k=x+','+y;tiles.set(k,t);
  if(t.block)blocked++;else{walkable.push(k);assert.ok(F.mapWalkable(m.id,x*32+16,y*32+16,seed),'player footprint fits '+m.id+' '+k)}
  if(t.obstacle)assert.ok(t.block,'visible obstacle must collide');
  if(t.ground==='bridge'){bridges++;assert.equal(t.block,false);assert.ok(['water','lava','ice'].includes(t.under));}
  if(m.kind==='route'){if(t.obstacle)found[m.region].add(t.obstacle);if(t.block)found[m.region].add(t.ground)}
 }
 const density=blocked/tiles.size;assert.ok(density>.2&&density<.9,`${m.id} seed ${seed}: barrier density ${density}`);minDensity=Math.min(minDensity,density);maxDensity=Math.max(maxDensity,density);
 // A tile-sized player can actually follow every connection, including bridge bends.
 const queue=['0,1'],seen=new Set(queue);for(let i=0;i<queue.length;i++){const[x,y]=queue[i].split(',').map(Number);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+dx)+','+(y+dy);if(tiles.has(k)&&!tiles.get(k).block&&!seen.has(k)){seen.add(k);queue.push(k)}}}
 assert.equal(seen.size,walkable.length,'no isolated walkable pockets: '+m.id+' seed '+seed);
 const s=F.newState(seed,25);s.seed=seed;s.mapId=m.id;
 for(const p of [...F.mapLoot(m.id,seed),...F.mapPeople(s),...F.mapExits(m.id,seed)])assert.ok(F.mapWalkable(m.id,p.x,p.y,seed),p.key+' has space for player');
 for(const p of F.mapLayout(m.id,seed).landmarks){landmarks++;assert.ok(p.footprint.every(a=>tiles.get(a.x+','+a.y).block),'landmark footprint collides');assert.ok(p.footprint.some(a=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((a.x+dx)+','+(a.y+dy)))),'landmark can be approached')}
 for(const from of m.links){F.moveToMap(s,m.id,from);assert.ok(F.mapWalkable(m.id,s.player.x,s.player.y,seed),'safe arrival from '+from)}
 const blockedTile=[...tiles].find(([,t])=>t.block&&!t.landmark),[bx,by]=blockedTile[0].split(',').map(Number);s.player={x:bx*32+16,y:by*32+16,dir:0};s.money=1234;s.collected.persisted=true;const uid=s.team[0].uid;
 F.upgradeState(s);assert.equal(s.mapId,m.id);assert.equal(s.money,1234);assert.equal(s.team[0].uid,uid);assert.equal(s.collected.persisted,true);assert.ok(F.mapWalkable(m.id,s.player.x,s.player.y,seed),'old blocked save relocates safely');
}
for(const [region,types]of Object.entries(expected))for(const type of types)assert.ok(found[region].has(type),region+' has '+type);
assert.ok(bridges>0&&landmarks>0);
console.log(`PASS ${zones} generated zones: ${Math.round(minDensity*100)}–${Math.round(maxDensity*100)}% barriers; all walkable cells connected, points reachable, landmarks solid, arrivals and old saves safe; nine distinct biomes.`);
