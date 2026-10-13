import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root={window:{}};
for(const file of ['moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+file+'.js',import.meta.url),'utf8'),root);
const r=root.window,F=require('../dist/core.js')(r.SPECIES_DATA,r.MOVE_DATA,r.SPECIES_KITS,r.EVOLUTION_DATA,r.TYPE_CHART,r.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.SPECIES_LEARNSETS,r.SPECIES_MOVE_LEVELS,r.SPECIES_ULTIMATES);const C=require('../dist/combat.js')(F),clone=x=>JSON.parse(JSON.stringify(x));

function fresh(id=6){const s=F.newState('BRANCHES',id),c=s.team[0];c.level=60;s.trainer.xp=1e6;for(const p of Object.values(s.trainer.types))p.xp=1e5;c.progression.levelGain=99;
 for(const key of ['ember','slash','air-slash','will-o-wisp'])if(r.SPECIES_LEARNSETS[id].includes(key)){if(!c.progression.learned.includes(key))c.progression.learned.push(key);c.progression.moves[key]??={xp:1e5,nodes:{}};c.progression.moves[key].xp=1e5;}
 for(const m of Object.values(c.progression.moves))m.xp=1e5;
 if(id===6)c.progression.loadout=['ember','slash','air-slash','will-o-wisp'];return s;}
function subject(s,kind){return kind==='trainer'?null:kind==='type'?'fire':kind==='pokemon'?{index:0}:{index:0,move:s.team[0].progression.learned.includes('air-slash')?'air-slash':s.team[0].progression.loadout[0]};}
function buyThrough(s,kind,sub,id,amount=1){const n=F.TREES[kind].find(n=>n.id===id),p=F.skillTree(s,kind,sub);for(const q of n.requires)buyThrough(s,kind,sub,q.id,q.rank);while(F.skillRank(p,id)<amount)assert.ok(F.buySkill(s,kind,sub,id),`${kind}/${id}: ${F.canBuySkill(s,kind,sub,id).reason}`);}
function snapshot(s){const c=s.team[0];return JSON.stringify({p:F.pokemonBonuses(c),t:F.trainerBonuses(s.trainer,c),hp:F.maxHP(c),moves:F.moves(c),typed:F.moves(c).map(m=>F.trainerMove(s.trainer,c,m))});}
let nodesChecked=0;
for(const kind of Object.keys(F.TREES)){
 const nodes=F.TREES[kind];assert.equal(nodes.length,kind==='trainer'||kind==='pokemon'?(kind==='trainer'?16:17):kind==='type'?16:15);
 assert.deepEqual([...new Set(nodes.map(n=>n.tier))].sort(),[1,2,3,4,5,6]);assert.equal(new Set(nodes.map(n=>n.tier+':'+n.col)).size,nodes.length,'one skill per grid cell');
 for(const n of nodes){
  const s=fresh(),sub=subject(s,kind);for(const q of n.requires)buyThrough(s,kind,sub,q.id,q.rank);const before=snapshot(s),p=F.skillTree(s,kind,sub),wallet=F.skillPoints(s,kind,sub);
  assert.ok(F.buySkill(s,kind,sub,n.id));assert.equal(F.skillPoints(s,kind,sub),wallet-n.cost);assert.notEqual(snapshot(s),before,`${kind}/${n.id} has a live effect`);
  const mid=snapshot(s);if(n.max>1){assert.ok(F.buySkill(s,kind,sub,n.id));assert.notEqual(snapshot(s),mid,`${kind}/${n.id} improves with every rank`)}
  while(F.skillRank(p,n.id)<n.max)assert.ok(F.buySkill(s,kind,sub,n.id));assert.equal(F.buySkill(s,kind,sub,n.id),false,'rank cap');
  assert.ok(F.validState(s),`${kind}/${n.id} valid`);const loaded=F.upgradeState(clone(s));assert.deepEqual(F.skillTree(loaded,kind,sub).nodes,p.nodes);
  const bad=clone(s);F.skillTree(bad,kind,sub).nodes[n.id]=n.max+1;assert.equal(F.validState(bad),false,'rank above the maximum rejected');nodesChecked++;
 }
}
console.log(`PASS ${nodesChecked} skills across all four trees: live bonuses on every rank, prerequisites, rank caps, save/reload and invalid-rank rejection`);

const life=fresh(3),lc=life.team[0],lifeSub={index:0};lc.hp=25;const maximum=F.maxHP(lc);buyThrough(life,'pokemon',lifeSub,'vitality',2);assert.ok(F.maxHP(lc)>maximum);assert.equal(lc.hp,25);assert.equal(lc.maxHP,F.maxHP(lc));buyThrough(life,'pokemon',lifeSub,'enduring');assert.equal(lc.hp,25);

function battle(s){const c=s.team[0],b=C.create(c,{creature:F.makeCreature(19,60,99)},3,[c,F.makeCreature(7,60,88)],0,s.trainer);b.intro=0;b.r=()=>.5;b.fighters[0].x=-400;b.fighters[1].x=400;b.fighters.forEach(a=>a.z=0);return b;}

const walking=fresh(),control=battle(clone(walking));buyThrough(walking,'pokemon',{index:0},'fleetfoot');const fast=battle(walking);C.step(fast,1/60,{right:true},false);C.step(control,1/60,{right:true},false);assert.ok(fast.fighters[0].x>control.fighters[0].x);
const relay=fresh();buyThrough(relay,'trainer',null,'relayguard',6);const rb=battle(relay);assert.ok(C.switchPokemon(rb,1));assert.ok(Math.abs(rb.fighters[0].iframe-1.04)<1e-9,'0,04 s per rank on top of 0,8 s');
const practicing=fresh();buyThrough(practicing,'trainer',null,'mentorship',6);const before=practicing.team[0].progression.moves.ember.xp,pb=battle(practicing);pb.roster[0].usedMoves={ember:1};pb.result='win';F.rewardBattle(practicing,pb);assert.equal(practicing.team[0].progression.moves.ember.xp-before,Math.round(25*1.15));
const pursuer=fresh();buyThrough(pursuer,'pokemon',{index:0},'pursuer',5);const pursuit=battle(pursuer),pa=pursuit.fighters[0];pa.x=0;pursuit.fighters[1].x=400;assert.ok(C.action(pursuit,0,'m1'));assert.equal(pa.approach.remaining,156);
console.log('PASS live combat: purchased health keeps PS, walking speed, switch protection, move practice XP and longer melee approach');

const status=fresh(151),sc=status.team[0];for(const key of ['will-o-wisp','rain-dance']){assert.ok(r.SPECIES_LEARNSETS[151].includes(key));if(!sc.progression.learned.includes(key))sc.progression.learned.push(key);sc.progression.moves[key]={xp:1e5,nodes:{}};}
sc.progression.loadout=['will-o-wisp'];const statusDuration=F.moves(sc)[0].duration;buyThrough(status,'move',{index:0,move:'will-o-wisp'},'surehand',2);assert.ok(F.moves(sc)[0].duration>statusDuration,'precision line remains useful for non-damaging states');
const baseline=fresh(151),bc=baseline.team[0];for(const key of ['rain-dance']){if(!bc.progression.learned.includes(key))bc.progression.learned.push(key);bc.progression.moves[key]={xp:1e5,nodes:{}}}bc.progression.loadout=['rain-dance'];sc.progression.loadout=['rain-dance'];buyThrough(status,'move',{index:0,move:'rain-dance'},'potency',10);buyThrough(status,'move',{index:0,move:'rain-dance'},'surehand',2);
const weather=battle(status),plainWeather=battle(baseline);for(const w of [weather,plainWeather]){assert.ok(C.action(w,0,'m0'));for(let i=0;i<35;i++)C.step(w,1/60,{},false)}assert.ok(weather.weather.time>plainWeather.weather.time+1.5,'duration skills affect weather in the real arena');assert.ok(F.validState(status));
console.log('PASS state and weather techniques: duration skills improve states, including live weather timers');

assert.equal(F.effectiveness('water',['fire']),1.6);assert.equal(F.effectiveness('rock',['fire','flying']),2.2);assert.equal(F.effectiveness('electric',['water','ground']),.25);assert.equal(F.effectiveness('fire',['grass','water']),1);assert.equal(F.effectiveness('fire',['water']),Math.sqrt(.5));assert.equal(F.effectiveness('fire',['fire','water']),.5);
const att=F.makeCreature(25,40,2),def=F.makeCreature(19,40,3),base=F.damage(att,def,80,'water',true,()=>.5,25,19),single=F.damage(att,def,80,'water',true,()=>.5,25,4),doubleBase=F.damage(att,def,80,'rock',false,()=>.5,25,19),double=F.damage(att,def,80,'rock',false,()=>.5,25,6);assert.ok(Math.abs(single/base-1.6)<.03);assert.ok(Math.abs(double-doubleBase*2.2)<=2);
console.log('PASS exact weakness factors 1.6 / 2.2 enter damage; resistance, mixed dual types and previous immunity factor retained');
