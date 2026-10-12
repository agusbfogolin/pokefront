import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),r={window:{}};
for(const f of ['items','moves','species','field-moves'])vm.runInNewContext(fs.readFileSync(new URL('../dist/assets/'+f+'.js',import.meta.url),'utf8'),r);
const F=require('../dist/core.js')(r.window.SPECIES_DATA,r.window.MOVE_DATA,r.window.SPECIES_KITS,r.window.EVOLUTION_DATA,r.window.TYPE_CHART,r.window.EXTRA_MOVE_RULES);
require('../dist/progression.js')(F,r.window.SPECIES_LEARNSETS);require('../dist/campaign.js')(F);require('../dist/economy.js')(F,r.window.ITEM_DATA);require('../dist/gyms.js')(F);require('../dist/field.js')(F,r.window.FIELD_MOVE_DATA);
const C=require('../dist/combat.js')(F),fresh=seed=>F.newState('GYM-'+seed,25),clone=x=>JSON.parse(JSON.stringify(x));
function reachable(s){const start=F.gymLayout(s.mapId,s.seed).spawn,first=[Math.floor(start.x/32),Math.floor(start.y/32)],queue=[first],seen=new Set([first.join(',')]);for(let i=0;i<queue.length;i++){const[x,y]=queue[i];for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){const a=x+dx,b=y+dy,k=a+','+b;if(!seen.has(k)&&F.fieldWalkable(s,a*32+16,b*32+16)){seen.add(k);queue.push([a,b])}}}return seen}
function has(seen,p){return seen.has(Math.floor(p.x/32)+','+Math.floor(p.y/32))}
assert.equal(Object.keys(F.MAPS).length,45);const graph=new Set(['campina-town']),queue=[...graph];for(const id of queue)for(const next of F.MAPS[id].links){assert.ok(F.MAPS[next].links.includes(id));if(!graph.has(next)){graph.add(next);queue.push(next)}}assert.equal(graph.size,45);
let gyms=0;const shapes=new Set();
for(let seed=1;seed<=12;seed++)for(const region of Object.keys(F.CITY)){
 const s=fresh(seed);F.moveToMap(s,region+'-town',null);const door=F.mapExits(s.mapId,s.seed).find(e=>e.target===region+'-gym');assert.ok(door);assert.ok(F.fieldWalkable(s,door.x,door.y));assert.ok(!F.mapTown(s.mapId).points.some(p=>p.kind==='gym'),'leader is indoors');
 const hp=s.team[0].hp=41;assert.ok(F.enterMap(s,door.target));assert.equal(s.team[0].hp,hp);assert.equal(s.lastTown,region+'-town');assert.ok(F.fieldWalkable(s,s.player.x,s.player.y));assert.equal(F.mapLoot(s.mapId,s.seed).length,0);assert.equal(F.mapEncounterAt(s.mapId,0,0,s.seed),null);
 const g=F.gymLayout(s.mapId,s.seed),trials=F.mapPeople(s).filter(p=>p.gymTrial),leader=F.mapPeople(s).find(p=>p.kind==='gym'),enc=F.trainerEncounter(s,leader);assert.equal(trials.length,3);assert.equal(enc.gymId,region);assert.equal(F.canChallengeGym(s,enc).ok,false);assert.ok(has(reachable(s),g.exits[0]));
 for(let i=0;i<3;i++){
  const seen=reachable(s);assert.ok(has(seen,trials[i]),region+' duel '+i+' is reachable');assert.ok(!has(seen,leader),'leader locked');for(const p of trials.slice(i+1))assert.ok(!has(seen,p),'cannot bypass a duel');
  const duel=F.trainerEncounter(s,trials[i]);assert.equal(duel.kind,'trainer');assert.ok(duel.gymTrial);for(const c of duel.team)assert.ok(F.DATA[c.id].types.includes(F.CITY[region].type),'typed pre-duel '+region);
  const b=C.create(s.team[0],duel,22,s.team,0,s.trainer);b.result='escaped';assert.equal(F.economyReward(s,b).money,0);assert.equal(s.trainerWins[duel.key],undefined);
  const win=C.create(s.team[0],duel,22,s.team,0,s.trainer);win.result='win';assert.ok(F.economyReward(s,win).money>0);assert.ok(!s.badges[region]);assert.ok(F.gymStateTile(s,g.gates[i].x,g.gates[i].y).gateOpen);
  const saved=clone(s);assert.ok(F.validState(saved));F.upgradeState(saved);assert.equal(saved.mapId,s.mapId);assert.equal(saved.team[0].hp,41);assert.equal(F.gymProgress(saved).completed,i+1);assert.ok(F.fieldWalkable(saved,saved.player.x,saved.player.y));
  const before=F.gymProgress(s).completed;assert.ok(F.enterMap(s,region+'-town'));assert.ok(F.enterMap(s,region+'-gym'));assert.equal(F.gymProgress(s).completed,before);assert.equal(s.team[0].hp,41);
 }
 const seen=reachable(s);assert.ok(has(seen,leader));assert.equal(seen.size,g.cells.size,'every corridor and dead end connects');assert.ok(F.canChallengeGym(s,enc).ok);
 const b=C.create(s.team[0],enc,22,s.team,0,s.trainer);b.result='win';assert.ok(F.economyReward(s,b).first);assert.ok(s.badges[region]);assert.equal(F.economyReward(s,b).first,false);
 for(const key of ['fly','teleport','dig','flash']){s.badges.coast=true;s.team.push(F.makeCreature(6,50,5));assert.equal(F.canUseField(s,key).ok,false)}
 if(seed===1)shapes.add(JSON.stringify([...g.cells]));gyms++;
}
assert.ok(shapes.size>=7,'regional mazes vary');
// Existing medals keep the leader unlocked, and malformed/wall saves relocate safely.
for(const region of Object.keys(F.CITY)){
 const s=fresh('legacy');s.badges[region]=true;F.moveToMap(s,region+'-gym',null);assert.ok(F.gymProgress(s).ready);assert.ok(F.gymLayout(s.mapId,s.seed).gates.every(g=>F.gymStateTile(s,g.x,g.y).gateOpen));
 s.player={x:-464,y:-496,dir:0};const saved=clone(s);assert.ok(F.validState(saved));F.upgradeState(saved);assert.ok(F.fieldWalkable(saved,saved.player.x,saved.player.y));assert.equal(saved.mapId,s.mapId);
 F.moveToMap(s,region+'-town',null);const leader={kind:'gym',key:'gym:'+region,label:F.CITY[region].leader};assert.equal(F.canChallengeGym(s,F.trainerEncounter(s,leader)).ok,false);
}
console.log('PASS '+gyms+' interiors: 45-map graph, real doors, sequential duels, no bypass, connected mazes, typed teams, gate unlocks, medal rewards, save/revisit/PS, legacy medals and indoor field restrictions.');
