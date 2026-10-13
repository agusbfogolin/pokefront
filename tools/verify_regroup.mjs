import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root={window:{}};
for(const file of ['moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+file+'.js',import.meta.url),'utf8'),root);
const r=root.window,F=require('../dist/core.js')(r.SPECIES_DATA,r.MOVE_DATA,r.SPECIES_KITS,r.EVOLUTION_DATA,r.TYPE_CHART,r.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.SPECIES_LEARNSETS,r.SPECIES_MOVE_LEVELS,r.SPECIES_ULTIMATES);
const C=require('../dist/combat.js')(F);
const team=[F.makeCreature(4,30,1),F.makeCreature(7,30,2),F.makeCreature(1,30,3)];
const enemies=[F.makeCreature(19,20,9),F.makeCreature(16,20,8)];
const mk=()=>{const b=C.create(team[0],{kind:'trainer',team:enemies,creature:enemies[0]},4,team,0);return b;};
const run=(b,s)=>{for(let i=0;i<Math.round(s*60);i++)C.step(b,1/60,{},false)};
const home=[{x:-280,z:100},{x:280,z:-100}];
// 1. voluntary switch: recall + release balls, regroup, countdown
let b=mk();run(b,1.5);assert.equal(b.intro,0);b.fighters[0].x=100;b.fighters[0].z=-150;b.fighters[1].x=-50;b.fighters[1].z=200;
assert.equal(C.switchState(b).ready,true);assert.ok(C.switchPokemon(b,1));
assert.equal(b.balls.length,1);assert.equal(b.balls[0].kind,'recall');assert.ok(b.fighters[0].enter);assert.ok(b.intro>1&&b.regroup);
assert.equal(C.switchState(b).ready,false);assert.equal(C.switchState(b).reason,'Reagrupando');assert.equal(C.switchPokemon(b,2),false,'no switch while regrouping');
assert.equal(C.action(b,0,'m0'),false,'no attacks while regrouping');
run(b,.5);assert.ok(b.fighters[0].enter===null||b.fighters[0].enter.t>.45);
run(b,b.intro+.05);assert.equal(b.regroup,null);
for(const i of [0,1])assert.ok(Math.hypot(b.fighters[i].x-home[i].x,b.fighters[i].z-home[i].z)<4,'both regrouped at home '+i);
assert.ok(b.switchCooldown>5&&b.switchCooldown<=6,'cooldown starts after regroup: '+b.switchCooldown);
const cd=b.switchCooldown;run(b,1);assert.ok(Math.abs(b.switchCooldown-(cd-1))<.05,'countdown ticks');assert.equal(C.switchState(b).ready,false);assert.ok(C.switchState(b).remaining>0);
run(b,6);assert.equal(C.switchState(b).ready,true);
// 2. enemy faints -> replacement enters from ball, regroup, winner may switch for free
b=mk();run(b,1.5);b.fighters[0].x=0;b.fighters[0].z=0;b.fighters[1].x=60;b.fighters[1].z=0;
b.fighters[1].hp=1;b.r=()=>0;const e0=b.fighters[1];
// force faint through real damage path
C.hit(b,0,1,9999,'normal',false);
if(b.fighters[1]===e0){e0.hp=0;}
assert.notEqual(b.result,'win');
const replaced=b.fighters[1]!==e0;
if(!replaced){/* faint is internal: use hit */}
assert.ok(replaced,'enemy replaced');assert.ok(b.balls.some(o=>o.kind==='recall'&&o.side===1));assert.ok(b.fighters[1].enter);
assert.equal(b.regroup.canSwitch,true);assert.equal(C.switchState(b).ready,true,'winner can switch during replacement');
assert.equal(b.switchCooldown,0);
run(b,.3);assert.ok(C.switchPokemon(b,2),'free switch in replacement window');assert.equal(b.regroup.canSwitch,false);assert.equal(b.balls.filter(o=>o.side===0).length>=1,true);
run(b,b.intro+.05);for(const i of [0,1])assert.ok(Math.hypot(b.fighters[i].x-home[i].x,b.fighters[i].z-home[i].z)<4,'regrouped after replacement '+i);
// 3. without switching, window lasts and regroups
b=mk();run(b,1.5);b.fighters[1].hp=1;C.hit(b,0,1,9999,'normal',false);assert.ok(b.intro>=2.5);const w=b.fighters[0];
run(b,b.intro+.05);assert.equal(b.fighters[0],w);assert.ok(Math.hypot(w.x-home[0].x,w.z-home[0].z)<4);
console.log('PASS regroup: pokeball recall/release, no actions while regrouping, both return home, visible switch countdown, replacement window with free winner switch');
