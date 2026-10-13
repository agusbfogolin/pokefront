import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root={window:{}};
for(const file of ['moves','species'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+file+'.js',import.meta.url),'utf8'),root);
const r=root.window,F=require('../dist/core.js')(r.SPECIES_DATA,r.MOVE_DATA,r.SPECIES_KITS,r.EVOLUTION_DATA,r.TYPE_CHART,r.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.SPECIES_LEARNSETS,r.SPECIES_MOVE_LEVELS,r.SPECIES_ULTIMATES);
const C=require('../dist/combat.js')(F);
const close=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ~= ${b}`);
function creature(key,seed=1){const c=F.makeCreature(4,30,seed);c.progression={xp:0,nodes:{},learnSpent:0,learned:[key],loadout:[key],moves:{[key]:{xp:0,nodes:{}}}};return c;}
function fight(key='scratch',gap=300,team){const c=team?.[0]||creature(key),b=C.create(c,{kind:'wild',creature:F.makeCreature(19,30,9)},4,team||[c]);b.intro=0;b.r=()=>0;const[a,d]=b.fighters;a.x=0;a.z=0;d.x=gap;d.z=0;for(const f of b.fighters)f.cd.basic=1000;return b;}
function run(b,seconds=.8,input={}){for(let i=0;i<Math.round(seconds*60);i++)C.step(b,1/60,input,false);}
for(const key of ['scratch','tackle','bite','aqua-jet','quick-attack']){
 const b=fight(key,200),[a,d]=b.fighters,m=C.moves(a)[0],hp=d.hp;
 assert.ok(['melee','lunge'].includes(m.kind),key);assert.ok(C.action(b,0,'m0'));assert.ok(a.approach,key+' approaches');
 close(a.stamina,100-m.cost);close(a.energy,100-m.energyCost);assert.equal(a.iframe,0);C.step(b,0,{},false);assert.ok(a.approach,'HUD refresh cannot cancel attack');close(a.x,0);
 C.step(b,1/60,{},false);assert.ok(a.x>0&&a.y>0,key+' visible leap');assert.ok(a.x<40,'continuous motion');
 run(b);assert.ok(a.x>60&&a.x<=130.01,key+' bounded dash');assert.ok(d.hp<hp,key+' hits from 200');assert.equal(a.approach,null);assert.equal(a.y,0);
 assert.ok(a.cd.m0>0);assert.equal(C.action(b,0,'m0'),false,'cooldown retained');
}
const distant=fight('scratch',500),distantHP=distant.fighters[1].hp;C.action(distant,0,'m0');run(distant);assert.ok(distant.fighters[0].x<=130.01);assert.equal(distant.fighters[1].hp,distantHP,'no remote hit');
const sidestep=fight('scratch',200);C.action(sidestep,0,'m0');run(sidestep,.15);sidestep.fighters[1].z=280;const sideHP=sidestep.fighters[1].hp;run(sidestep);close(sidestep.fighters[0].z,0);assert.equal(sidestep.fighters[1].hp,sideHP,'locked trajectory can miss');
for(const behind of [false,true]){const b=fight('scratch',200),[a,d]=b.fighters,hp=d.hp;C.action(b,0,'m0');run(b,.32);d.x=a.x+(behind?-60:60);d.z=behind?0:40;run(b,.15);assert.equal(d.hp<hp,!behind,'narrow frontal arc, no backward hit');}
for(const z of [150,100]){const b=fight('scratch',200),[a,d]=b.fighters,hp=d.hp;C.action(b,0,'m0');run(b,.32);d.x=a.x+60;d.z=z;run(b,.15);assert.equal(d.hp,hp,'side target outside the narrow arc');}
const dodged=fight('scratch',200),dodgeHP=dodged.fighters[1].hp;C.action(dodged,0,'m0');run(dodged,.15);assert.ok(C.action(dodged,1,'dash',{x:0,z:1}));run(dodged,.35);assert.equal(dodged.fighters[1].hp,dodgeHP,'dodge invulnerability retained');
console.log('PASS contact moves: smooth bounded leap, narrower frontal arc, real contact, misses, dodge, costs/cooldowns and no new invulnerability');

for(const input of [{right:true},{left:true},{up:true},{down:true},{right:true,up:true}]){
 const b=fight('scratch',500),a=b.fighters[0];a.x=-200;a.energy=40;a.stamina=10;
 for(let i=0;i<30;i++){const before=a.stamina;C.step(b,1/60,input,false);assert.ok(a.moving);close(a.energy,40);close(a.stamina-before,(6+40*.1)*.5/60);}
 const energy=a.energy,stamina=a.stamina;C.step(b,1/60,{},false);assert.equal(a.moving,false);close(a.energy-energy,2.3/60);close(a.stamina-stamina,(6+a.energy*.1)/60);
}
const wall=fight('scratch',-500),w=wall.fighters[0];w.x=C.ARENA.halfX;w.energy=40;w.stamina=10;C.step(wall,1/60,{right:true},false);assert.equal(w.moving,false);assert.ok(w.energy>40,'held input against wall is stationary');
const delay=fight('scratch',500),a=delay.fighters[0];a.energy=40;a.stamina=10;a.regenDelay=1.25;run(delay,1,{left:true});close(a.energy,40);close(a.stamina,10);run(delay,.5,{left:true});close(a.energy,40);assert.ok(a.stamina>10);const oldEnergy=a.energy;run(delay,.2);assert.ok(a.energy>oldEnergy);
const ai=fight('scratch',500),enemy=ai.fighters[1];enemy.energy=40;enemy.stamina=10;ai.ai={moveX:-1,moveZ:0};C.step(ai,1/60,{},false);assert.ok(enemy.moving);close(enemy.energy,40);close(enemy.stamina-10,5/60);
const reserves=[creature('scratch'),creature('scratch',2)],bench=fight('scratch',500,reserves);bench.roster[1].energy=40;bench.roster[1].stamina=10;run(bench,.5,{left:true});assert.ok(bench.roster[1].energy>40&&bench.roster[1].stamina>10);
console.log('PASS all walking directions and AI: energy 0, stamina 50%, rest 100%, actual wall movement, recovery delay and reserve recovery');

for(const reason of ['dash','switch','faint','escaped','win']){
 const team=[creature('scratch'),creature('scratch',2)],b=fight('scratch',300,team),a=b.fighters[0];C.action(b,0,'m0');run(b,.1);assert.ok(a.approach&&a.y>0);
 if(reason==='dash'){assert.ok(C.action(b,0,'dash',{x:0,z:1}));assert.equal(a.pending,null);}
 if(reason==='switch')assert.ok(C.switchPokemon(b,1));
 if(reason==='faint'){a.hp=1;C.hit(b,1,0,500,'normal',false);assert.equal(a.hp,0);}
 if(reason==='escaped'){b.fighters[1].hp=b.fighters[1].maxHP*.5;assert.equal(C.attemptEscape(b),'escaped');}
 if(reason==='win'){b.result='win';C.step(b,1/60,{},false);}
 assert.equal(a.approach,null,reason);assert.equal(a.y,0,reason);
}
const ranged=fight('water-gun');assert.ok(C.action(ranged,0,'m0'));assert.equal(ranged.fighters[0].approach,null);run(ranged,.5);close(ranged.fighters[0].x,0);assert.ok(ranged.projectiles.length);
console.log('PASS cancellation on dodge, switch, faint, escape and ending; ranged techniques keep their projectile behavior');
