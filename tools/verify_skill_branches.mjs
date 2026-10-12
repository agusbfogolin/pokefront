import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root={window:{}};
for(const file of ['moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+file+'.js',import.meta.url),'utf8'),root);
const r=root.window,F=require('../dist/core.js')(r.SPECIES_DATA,r.MOVE_DATA,r.SPECIES_KITS,r.EVOLUTION_DATA,r.TYPE_CHART,r.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.SPECIES_LEARNSETS,r.SPECIES_MOVE_LEVELS,r.SPECIES_ULTIMATES);const C=require('../dist/combat.js')(F),clone=x=>JSON.parse(JSON.stringify(x));
function fresh(id=6){const s=F.newState('BRANCHES',id),c=s.team[0];c.level=60;s.trainer.xp=10000;for(const p of Object.values(s.trainer.types))p.xp=10000;c.progression.xp=10000;
 for(const key of ['ember','slash','air-slash','will-o-wisp'])if(r.SPECIES_LEARNSETS[id].includes(key)){if(!c.progression.learned.includes(key))c.progression.learned.push(key);c.progression.moves[key]??={xp:10000,nodes:{}};c.progression.moves[key].xp=10000;}
 if(id===6)c.progression.loadout=['ember','slash','air-slash','will-o-wisp'];return s;}
function subject(s,kind){return kind==='trainer'?null:kind==='type'?'fire':{index:0,move:s.team[0].progression.learned.includes('air-slash')?'air-slash':s.team[0].progression.loadout[0]};}
function buyThrough(s,kind,sub,id,amount=1){const n=F.TREES[kind].find(n=>n.id===id),p=F.skillTree(s,kind,sub);if(n.parent)buyThrough(s,kind,sub,n.parent,n.need);while(F.skillRank(p,id)<amount){assert.ok(F.buySkill(s,kind,sub,id),`${kind}/${id}: ${F.canBuySkill(s,kind,sub,id).reason}`);}}
function snapshot(s){const c=s.team[0];return JSON.stringify({p:F.pokemonBonuses(c),t:F.trainerBonuses(s.trainer,c),hp:F.maxHP(c),moves:F.moves(c),typed:F.moves(c).map(m=>F.trainerMove(s.trainer,c,m))});}
let branches=0;
for(const kind of Object.keys(F.TREES)){
 const nodes=F.TREES[kind];assert.equal(nodes.length,17);assert.deepEqual([1,2,3].map(t=>nodes.filter(n=>n.tier<=t).length),[5,9,17]);
 for(const n of nodes.filter(n=>n.tier>1)){
  const s=fresh(),sub=subject(s,kind);buyThrough(s,kind,sub,n.parent,n.need);const before=snapshot(s),p=F.skillTree(s,kind,sub),wallet=F.skillPoints(p,kind);assert.ok(F.buySkill(s,kind,sub,n.id));assert.equal(F.skillPoints(p,kind),wallet-n.cost);assert.notEqual(snapshot(s),before,`${kind}/${n.id} has a live effect`);
  const sibling=F.SKILL_FORKS[kind][n.fork].find(id=>id!==n.id);assert.ok(F.canBuySkill(s,kind,sub,sibling).forkLocked);assert.equal(F.buySkill(s,kind,sub,sibling),false);assert.ok(F.validState(s),`${kind}/${n.id} valid`);
  const loaded=F.upgradeState(clone(s));assert.ok(F.canBuySkill(loaded,kind,sub,sibling).forkLocked);assert.deepEqual(F.skillTree(loaded,kind,sub).nodes,p.nodes);
  const bad=clone(s);F.skillTree(bad,kind,sub).nodes[sibling]=1;assert.equal(F.validState(bad),false,'opposite subbranches rejected');branches++;
 }
}
console.log(`PASS ${branches} new skills across all four trees: live bonuses, costs, prerequisites, exclusive forks, save/reload and invalid-branch rejection`);

const evolution=F.newState('EVOLVING',1),c=evolution.team[0];c.progression.xp=10000;const sub={index:0,move:'tackle'};c.progression.moves.tackle.xp=10000;c.level=100;c.hp=17;
assert.equal(F.pokemonSkillTier(c),1);assert.ok(F.canBuySkill(evolution,'pokemon',sub,'ferocity').tierLocked);assert.ok(F.canBuySkill(evolution,'move',sub,'impact').tierLocked);buyThrough(evolution,'pokemon',sub,'instinct');buyThrough(evolution,'move',sub,'reach');const baseNodes=clone(c.progression.nodes),baseMove=clone(c.progression.moves.tackle.nodes),iv=clone(c.iv);
assert.ok(F.evolve(c,3,2));assert.equal(F.pokemonSkillTier(c),2);assert.deepEqual(c.progression.nodes,baseNodes);assert.deepEqual(c.progression.moves.tackle.nodes,baseMove);buyThrough(evolution,'pokemon',sub,'ferocity',2);buyThrough(evolution,'move',sub,'impact',2);assert.ok(F.canBuySkill(evolution,'pokemon',sub,'overpower').tierLocked);assert.ok(F.canBuySkill(evolution,'move',sub,'finisher').tierLocked);
assert.ok(F.evolve(c,3,3));assert.equal(F.pokemonSkillTier(c),3);assert.ok(F.buySkill(evolution,'pokemon',sub,'overpower'));assert.ok(F.buySkill(evolution,'move',sub,'finisher'));assert.equal(c.hp,17);assert.deepEqual(c.iv,iv);assert.ok(F.validState(F.upgradeState(clone(evolution))));
for(const [id,level,tier]of [[132,5,1],[132,20,2],[132,40,3],[19,100,1],[20,20,2],[20,40,3]])assert.equal(F.pokemonSkillTier(F.makeCreature(id,level,9)),tier,`${id} / ${level}`);
const early=F.newState('XP',1);for(const [kind,thresholds]of [['trainer',[300,900]],['type',[180,600]]]){const p=kind==='trainer'?early.trainer:early.trainer.types.grass,sub=kind==='trainer'?null:'grass';for(const [xp,tier]of [[0,1],[thresholds[0]-1,1],[thresholds[0],2],[thresholds[1]-1,2],[thresholds[1],3]]){p.xp=xp;assert.equal(F.skillAccess(early,kind,sub).tier,tier);}}
const fake=clone(evolution);fake.team[0].id=1;assert.equal(F.validState(fake),false,'higher-stage investments cannot be imported into first stage');
console.log('PASS 5/9/17 progression: first/second/third evolution, trainer/type XP, single-stage levels, two-stage finals, exact PS/IV and learned-tree preservation');

const life=fresh(3),lc=life.team[0],lifeSub={index:0};lc.hp=25;const maximum=F.maxHP(lc);buyThrough(life,'pokemon',lifeSub,'vitality',2);assert.ok(F.maxHP(lc)>maximum);assert.equal(lc.hp,25);assert.equal(lc.maxHP,F.maxHP(lc));buyThrough(life,'pokemon',lifeSub,'enduring');assert.equal(lc.hp,25);
function battle(s){const c=s.team[0],b=C.create(c,{creature:F.makeCreature(19,60,99)},3,[c,F.makeCreature(7,60,88)],0,s.trainer);b.intro=0;b.r=()=>.5;b.fighters[0].x=-400;b.fighters[1].x=400;b.fighters.forEach(a=>a.z=0);return b;}
const walking=fresh(),control=battle(clone(walking));buyThrough(walking,'pokemon',{index:0},'fleetfoot');const fast=battle(walking);C.step(fast,1/60,{right:true},false);C.step(control,1/60,{right:true},false);assert.ok(fast.fighters[0].x>control.fighters[0].x);
const relay=fresh();buyThrough(relay,'trainer',null,'relayguard');const rb=battle(relay);assert.ok(C.switchPokemon(rb,1));assert.equal(rb.fighters[0].iframe,1.05);
const practicing=fresh();buyThrough(practicing,'trainer',null,'mentorship');const before=practicing.team[0].progression.moves.ember.xp,pb=battle(practicing);pb.roster[0].usedMoves={ember:1};pb.result='win';F.rewardBattle(practicing,pb);assert.equal(practicing.team[0].progression.moves.ember.xp-before,Math.round(25*1.15));
const pursuer=fresh();buyThrough(pursuer,'pokemon',{index:0},'pursuer');const pursuit=battle(pursuer),pa=pursuit.fighters[0];pa.x=0;pursuit.fighters[1].x=400;assert.ok(C.action(pursuit,0,'m1'));assert.equal(pa.approach.remaining,252);
console.log('PASS live combat: purchased health keeps PS, walking speed, switch protection, move practice XP and longer melee approach');

const status=fresh(151),sc=status.team[0];for(const key of ['will-o-wisp','rain-dance']){assert.ok(r.SPECIES_LEARNSETS[151].includes(key));if(!sc.progression.learned.includes(key))sc.progression.learned.push(key);sc.progression.moves[key]={xp:10000,nodes:{}};}
sc.progression.loadout=['will-o-wisp'];const statusDuration=F.moves(sc)[0].duration;buyThrough(status,'move',{index:0,move:'will-o-wisp'},'precision',2);buyThrough(status,'move',{index:0,move:'will-o-wisp'},'surehand');assert.ok(F.moves(sc)[0].duration>statusDuration,'critical specialization remains useful for non-damaging states');
sc.progression.loadout=['rain-dance'];buyThrough(status,'move',{index:0,move:'rain-dance'},'precision',2);buyThrough(status,'move',{index:0,move:'rain-dance'},'surehand');const weather=battle(status);assert.ok(C.action(weather,0,'m0'));for(let i=0;i<35;i++)C.step(weather,1/60,{},false);assert.ok(weather.weather.time>18,'duration skills affect weather in the real arena');assert.ok(F.validState(status));
console.log('PASS state and weather techniques: precision forks improve duration, including live weather timers');

assert.equal(F.effectiveness('water',['fire']),1.6);assert.equal(F.effectiveness('rock',['fire','flying']),2.2);assert.equal(F.effectiveness('electric',['water','ground']),.25);assert.equal(F.effectiveness('fire',['grass','water']),1);assert.equal(F.effectiveness('fire',['water']),Math.sqrt(.5));assert.equal(F.effectiveness('fire',['fire','water']),.5);
const att=F.makeCreature(25,40,2),def=F.makeCreature(19,40,3),base=F.damage(att,def,80,'water',true,()=>.5,25,19),single=F.damage(att,def,80,'water',true,()=>.5,25,4),doubleBase=F.damage(att,def,80,'rock',false,()=>.5,25,19),double=F.damage(att,def,80,'rock',false,()=>.5,25,6);assert.ok(Math.abs(single/base-1.6)<.03);assert.ok(Math.abs(double-doubleBase*2.2)<=2);
console.log('PASS exact weakness factors 1.6 / 2.2 enter damage; resistance, mixed dual types and previous immunity factor retained');
