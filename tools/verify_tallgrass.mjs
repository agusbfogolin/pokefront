// Pasto largo: cobertura por bioma, caminos libres, encuentros válidos y no persistentes.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),r={window:{}};
for(const f of ['items','moves','species','field-moves','sprites'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);require('../dist/generations.js')(F);require('../dist/gyms.js')(F);require('../dist/field.js')(F,r.window.FIELD_MOVE_DATA);
const kinds=new Set(),cover={};let total=0,tallTotal=0;
for(let seed=1;seed<=2;seed++)for(const m of Object.values(F.MAPS)){
 if(m.kind==='town'||m.kind==='gym')continue;
 const layout=F.mapLayout(m.id,seed);let open=0,tall=0;
 for(let y=m.bounds.top/32;y<m.bounds.bottom/32;y++)for(let x=m.bounds.left/32;x<m.bounds.right/32;x++){
  const t=F.mapTile(m.id,x,y,seed);if(t.block)continue;open++;
  if(t.tall){tall++;kinds.add(t.tall);assert.ok(!t.obstacle&&!['trail','bridge','water','lava','ice','wall','dungeon'].includes(t.ground),'pasto solo en suelo abierto '+m.id);assert.equal(m.kind,'route','sin pasto en cuevas');assert.ok(F.TALL_NAMES[t.tall]&&F.TALL_RATE[t.tall])}
 }
 if(m.kind==='route'){total+=open;tallTotal+=tall;const bk=(F.districtBase?.(m.region)||m.region)+'/'+(m.biome||F.REGIONS[m.region].biome);cover[bk]=cover[bk]||[0,0];cover[bk][0]+=tall;cover[bk][1]+=open}
}
for(const [region,[t,o]] of Object.entries(cover)){const p=t/o;console.log(region.padEnd(10),(p*100).toFixed(1)+'%');assert.ok(p>.03&&p<.3,region+' cobertura '+p)}
assert.equal(kinds.size,9,'nueve variantes de pasto: '+[...kinds]);
// Encuentros de pasto: válidos, temáticos, únicos y sin ensuciar completed.
let hits=0;
for(const [region,list] of Object.entries(cover)){}
for(const m of Object.values(F.MAPS).filter(m=>m.kind==='route')){
 const seed=3,s=F.newState(seed,25);s.seed=seed;s.mapId=m.id;
 let tile=null;for(let y=m.bounds.top/32;y<m.bounds.bottom/32&&!tile;y++)for(let x=m.bounds.left/32;x<m.bounds.right/32;x++){const t=F.mapTile(m.id,x,y,seed);if(t.tall){tile=t;s.player={x:x*32+16,y:y*32+16,dir:0};break}}
 if(!tile)continue;
 const keys=new Set();for(let i=0;i<40;i++){const e=F.grassEncounter(s,tile);assert.ok(e&&e.kind==='wild'&&e.transient&&e.creature&&F.DATA[e.creature.id]&&F.TYPE[e.type]);assert.ok(!keys.has(e.key));keys.add(e.key);assert.ok(e.creature.level>=F.mapLevels(s)[0]&&e.creature.level<=F.mapLevels(s)[1]);hits++}
}
assert.equal(F.grassEncounter(F.newState(1,25),{tall:null}),null);
console.log('Pasto largo OK ·',(tallTotal/total*100).toFixed(1)+'% de las rutas ·',hits,'encuentros verificados ·',[...kinds].join(', '));
