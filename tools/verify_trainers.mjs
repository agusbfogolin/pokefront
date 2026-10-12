// Trainer sight uses facing, distance and solid terrain, including diagonal corners.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import{createRequire}from'node:module';
const require=createRequire(import.meta.url),r={window:{}};for(const f of['items','moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);
const vectors={0:[0,1],2:[-1,0],4:[0,-1],6:[1,0]};let trainers=0,hidden=0,visible=0;
function obstructed(s,p,q){const steps=Math.ceil(Math.hypot(q.x-p.x,q.y-p.y)*2);for(let i=0;i<=steps;i++){const x=p.x+(q.x-p.x)*i/steps,y=p.y+(q.y-p.y)*i/steps;for(const dx of[-.001,.001])for(const dy of[-.001,.001]){const t=F.mapTile(s.mapId,Math.floor((x+dx)/32),Math.floor((y+dy)/32),s.seed);if(t.obstacle||t.landmark||t.boundary||t.ground==='wall')return true}}return false}
for(let seed=1;seed<=8;seed++)for(const m of Object.values(F.MAPS)){
 const s=F.newState(seed,25);s.seed=seed;s.mapId=m.id;
 if(m.kind==='town'){const rival=F.mapPeople(s)[0];assert.equal(F.trainerCanSee(s,rival,{x:rival.x,y:rival.y+32}),false);assert.equal(F.spottingTrainer(s),null);continue}
 assert.deepEqual(F.mapPeople(s),F.mapPeople(s),'Facing is stable');
 for(const p of F.mapPeople(s)){
  trainers++;const[dx,dy]=vectors[p.dir];assert.ok(Number.isFinite(dx));
  const front={x:p.x+dx*32,y:p.y+dy*32};assert.ok(F.trainerCanSee(s,p,front),'trainer faces a usable approach');
  assert.equal(F.trainerCanSee(s,p,{x:p.x-dx*32,y:p.y-dy*32}),false,'behind');
  assert.equal(F.trainerCanSee(s,p,{x:p.x+dy*64,y:p.y-dx*64}),false,'outside cone');
  assert.equal(F.trainerCanSee(s,p,{x:p.x+dx*192,y:p.y+dy*192}),false,'out of range');
  s.player=front;assert.equal(F.spottingTrainer(s)?.key,p.key,'closest watcher');
  assert.notEqual(F.spottingTrainer(s,new Set([p.key]))?.key,p.key,'retreat suppression');
  s.trainerWins[p.key]=1;assert.notEqual(F.spottingTrainer(s)?.key,p.key,'defeated trainers do not force a rematch');delete s.trainerWins[p.key];
  for(let f=1;f<=4;f++)for(let lateral=-2;lateral<=2;lateral++){
   const q={x:p.x+dx*f*32+dy*lateral*32,y:p.y+dy*f*32-dx*lateral*32};
   if(Math.abs(lateral*32)>16+f*32*.45||Math.hypot(q.x-p.x,q.y-p.y)>160||!F.mapWalkable(s.mapId,q.x,q.y,s.seed))continue;
   const blocked=obstructed(s,p,q);assert.equal(F.trainerCanSee(s,p,q),!blocked,`${m.id} ${p.key} vision respects terrain`);if(blocked)hidden++;else visible++;
  }
 }
}
assert.ok(hidden>25&&visible>100);
console.log(`PASS ${trainers} trainers: facing, range, cone, safe cities, defeated/ignored challengers and ${hidden} occluded / ${visible} clear sight lines.`);
