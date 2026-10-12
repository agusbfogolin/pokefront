import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),r={window:{}};
for(const f of ['items','moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);
const C=require('../dist/combat.js')(F),clone=x=>JSON.parse(JSON.stringify(x));
const fresh=()=>F.newState('HEALTH',25),enc={kind:'wild',key:'health-test',creature:F.makeCreature(19,5,42)};
const fight=s=>C.create(s.team[s.active],enc,44,s.team,s.active,s.trainer);
const use=(s,key,index=0)=>F.useItem(s,key,{index,combat:C});

for(const result of ['win','caught','escaped','loss']){
 const s=fresh();s.team.push(F.makeCreature(7,5,52));const b=fight(s);b.intro=0;
 // Damage two distinct companions; recovery must not be recreated by switching.
 C.hit(b,1,0,60,'normal',false);const first=b.roster[0].hp;
 assert.ok(C.switchPokemon(b,1));C.hit(b,1,0,60,'normal',false); // replacement has a short iframe
 b.fighters[0].iframe=0;C.hit(b,1,0,60,'normal',false);const second=b.roster[1].hp;
 assert.ok(first<b.roster[0].maxHP&&second<b.roster[1].maxHP);
 b.result=result;C.persistHealth(b);assert.equal(s.team[0].hp,first);assert.equal(s.team[1].hp,second);
 const saved=clone(s);assert.ok(F.validState(saved));F.upgradeState(saved);
 for(let i=0;i<3;i++){F.ensureProgress(saved);F.ensureEconomy(saved)}
 const next=fight(saved);assert.equal(next.roster[0].hp,first);assert.equal(next.roster[1].hp,second);
 assert.equal(next.fighters[1].hp,next.fighters[1].maxHP,'enemy starts a fresh encounter');
 console.log('PASS '+result+': active/reserve PS survive damage, save, reload and next fight');
}
{
 const s=fresh();s.team.push(F.makeCreature(7,5,52));F.creatureHealth(s.team[1]);F.setCreatureHP(s.team[0],0);
 const b=fight(s);assert.equal(b.playerIndex,1);assert.equal(b.roster[0].hp,0);b.intro=0;
 assert.equal(C.switchPokemon(b,0),false);F.setCreatureHP(s.team[1],0);assert.equal(fight(s),null);
 assert.equal(use(s,'potion').ok,false,'potion cannot revive');F.addItem(s,'revive');assert.ok(use(s,'revive').ok);
 assert.equal(s.team[0].hp,s.team[0].maxHP*.5);assert.equal(F.itemCount(s,'revive'),0);
 const count=F.itemCount(s,'potion');s.team[0].hp=1;assert.ok(use(s,'potion').ok);
 assert.equal(s.team[0].hp,Math.min(s.team[0].maxHP,121));assert.equal(F.itemCount(s,'potion'),count-1);
 F.healTeam(s);const bag=clone(s.items);assert.equal(use(s,'potion').ok,false);assert.deepEqual(clone(s.items),bag);
 assert.ok(s.team.every(c=>c.hp===c.maxHP));console.log('PASS fainting, healthy replacement, outdoor potion/revive, no-effect inventory and center recovery');
}
{
 const s=fresh(),c=s.team[0];c.hp=c.maxHP-25;const currentHP=c.hp,oldMax=c.maxHP;c.level++;
 F.creatureHealth(c);assert.ok(c.maxHP>oldMax);assert.equal(c.hp,currentHP,'level growth does not heal');
 c.progression.levelGain=5;assert.ok(F.buySkill(s,'pokemon',{index:0},'discipline'));assert.ok(F.buySkill(s,'pokemon',{index:0},'resolve'));F.creatureHealth(c);assert.equal(c.hp,currentHP,'HP skill does not heal');
 F.setCreatureHP(c,0);c.level++;F.creatureHealth(c);assert.equal(c.hp,0,'levels never revive');
 for(const value of [-1,Infinity,NaN,c.maxHP+1]){const bad=clone(s);bad.team[0].hp=value;assert.equal(F.validState(bad),false)}
 const old=clone(s);for(const c of old.team){delete c.hp;delete c.maxHP}const identity=old.team[0].uid;
 assert.ok(F.validState(old));F.upgradeState(old);assert.equal(old.team[0].uid,identity);assert.equal(old.team[0].hp,old.team[0].maxHP);
 old.team[0].hp=3;F.upgradeState(old);assert.equal(old.team[0].hp,3);console.log('PASS exact PS across capacity growth, fainted growth, invalid saves and one-time legacy initialization');
}
{
 const s=fresh();s.team.push(F.makeCreature(7,5,52));const b=fight(s);b.roster[0].hp=43.5;b.roster[1].hp=0;b.result='win';C.persistHealth(b);
 s.team[0].xp=F.xpNext(s.team[0])-1;const oldMax=s.team[0].maxHP;
 assert.ok(F.award(s.team[0],10)>0);F.rewardBattle(s,b);F.economyReward(s,b);
 // Result rendering, autosave and closing all repeat synchronization after XP rewards.
 for(let i=0;i<5;i++){C.persistHealth(b);F.ensureProgress(s);F.ensureEconomy(s)}
 assert.ok(s.team[0].maxHP>oldMax);assert.equal(s.team[0].hp,43.5);assert.equal(s.team[1].hp,0);
 const saved=clone(s);F.upgradeState(saved);const next=fight(saved);assert.equal(next.roster[0].hp,43.5);assert.equal(next.roster[1].hp,0);
 console.log('PASS reward-driven level growth and repeated result/save/close synchronization retain exact active/reserve PS');
}
