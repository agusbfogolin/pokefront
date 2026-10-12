(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera,root.SPECIES_LEARNSETS,root.SPECIES_MOVE_LEVELS,root.SPECIES_ULTIMATES)})(typeof window!=='undefined'?window:globalThis,function(F,LEARNSETS,LEVELS,ULTIMATES){
'use strict';
LEARNSETS=LEARNSETS||{};LEVELS=LEVELS||{};ULTIMATES=ULTIMATES||{};
const typeIds=Object.keys(F.HINT_POOLS),rawMoves=F.moves,rawNew=F.newState,rawUpgrade=F.upgradeState,rawEvolve=F.evolve,rawValid=F.validState,rawAward=F.award;
const VERSION=5;
// ---------- Diablo 2 style trees ----------
// Each skill has several ranks (1 point per rank), sits on a row (tier) with a level / XP requirement and needs
// ranks in earlier skills. There is no exclusive choice and no respec: scarce points force a build.
const fmt=n=>String(Number(n.toFixed(2))).replace('.',',');
const UNIT={'%':n=>fmt(n*100)+' %',s:n=>fmt(n)+' s',px:n=>fmt(n)+' px',pt:n=>fmt(n)+' pt'};
const partText=(x,times=1)=>x[0]+UNIT[x[2]](x[1]*times)+' '+x[3];
const N=(id,name,tier,col,max,requires,parts,note='')=>({id,name,tier,col,max,cost:1,requires:requires.map(([rid,rank])=>({id:rid,rank})),parent:requires[0]?.[0]||null,parts,note,description:parts.map(x=>partText(x)).join(' · ')+' por rango.'+(note?' '+note:'')});
const TREES={
 trainer:[
  N('travel','Cartografía',1,0,10,[],[['+',.008,'%','de velocidad al explorar']]),
  N('tracking','Rastreo',2,0,6,[['travel',3]],[['+',4,'px','de alcance para investigar rastros']],'Base: 64 px.'),
  N('trailcraft','Senderismo',3,0,8,[['travel',5]],[['+',.008,'%','de velocidad al explorar']]),
  N('farwatch','Vista lejana',4,0,6,[['tracking',4]],[['+',5,'px','de alcance para investigar rastros']]),
  N('trailblazer','Explorador experto',6,0,6,[['trailcraft',6],['farwatch',3]],[['+',.01,'%','de velocidad al explorar']]),
  N('coordination','Coordinación',1,1,8,[],[['−',.2,'s','entre cambios de compañero']],'Mínimo: 3 s.'),
  N('firstaid','Primeros auxilios',2,1,8,[['coordination',3]],[['+',.025,'%','de curación de las bayas']]),
  N('quickrelay','Relevo rápido',3,1,6,[['coordination',5]],[['−',.15,'s','entre cambios de compañero']]),
  N('relayguard','Entrada protegida',4,1,6,[['quickrelay',3]],[['+',.04,'s','de protección al cambiar de compañero']],'Base: 0,8 s.'),
  N('triage','Triaje',5,1,8,[['firstaid',5],['relayguard',2]],[['+',.03,'%','de curación de las bayas']]),
  N('relaymaster','Maestro del relevo',6,1,5,[['quickrelay',5],['relayguard',4]],[['−',.15,'s','entre cambios de compañero']]),
  N('bond','Vínculo',1,2,10,[],[['+',.008,'%','de experiencia del Pokémon activo']]),
  N('fieldnotes','Cuaderno de campo',2,2,8,[['bond',3]],[['+',.008,'%','de experiencia del Pokémon']]),
  N('mentorship','Mentoría',3,2,8,[['bond',5]],[['+',.025,'%','de experiencia de práctica de los ataques']]),
  N('researcher','Investigador',5,2,6,[['fieldnotes',5],['mentorship',3]],[['+',.012,'%','de experiencia del Pokémon']]),
  N('conservation','Conservación',6,2,6,[['researcher',4],['mentorship',6]],[['−',.006,'%','de coste de stamina de todas las técnicas']])
 ],
 type:[
  N('technique','Técnica elemental',1,0,10,[],[['+',.008,'%','de daño de técnicas del tipo']]),
  N('channeling','Canalización',2,0,8,[['technique',3]],[['+',.007,'%','de daño de técnicas del tipo']]),
  N('exploitation','Ventaja elemental',3,0,8,[['technique',5]],[['+',.012,'%','de daño contra objetivos débiles']]),
  N('piercing','Concentración elemental',5,0,8,[['channeling',5],['exploitation',3]],[['+',.009,'%','de daño de técnicas del tipo']]),
  N('lingering','Persistencia',1,1,10,[],[['+',.015,'%','de duración de estados del tipo']]),
  N('specialist','Especialista',2,1,8,[['lingering',3]],[['+',.02,'%','de duración de estados del tipo']]),
  N('efficientcast','Estado eficiente',3,1,8,[['lingering',5]],[['−',.012,'%','de energía de las técnicas de estado del tipo']]),
  N('balance','Equilibrio',4,1,8,[['efficientcast',4]],[['+',.012,'%','de regeneración de stamina']]),
  N('longlasting','Estado prolongado',5,1,8,[['specialist',5],['efficientcast',2]],[['+',.02,'%','de duración de estados del tipo']]),
  N('recoveryguard','Paso seguro',6,1,6,[['balance',4],['longlasting',4]],[['−',.008,'%','de recarga de esquiva']]),
  N('affinity','Afinidad',1,2,10,[],[['+',.01,'%','de regeneración de energía']],'Con dos tipos se promedia entre ambos.'),
  N('resilience','Resistencia',2,2,10,[['affinity',3]],[['−',.004,'%','de daño recibido']]),
  N('reserve','Reservas',3,2,8,[['affinity',5]],[['−',.008,'%','de coste de energía']]),
  N('composure','Compostura',4,2,8,[['resilience',4]],[['−',.004,'%','de daño recibido']]),
  N('recharge','Recarga',5,2,8,[['reserve',4],['composure',2]],[['+',.01,'%','de regeneración de energía']]),
  N('ward','Baluarte elemental',6,2,6,[['composure',6],['recharge',3]],[['−',.005,'%','de daño recibido']])
 ],
 pokemon:[
  N('drive','Impulso',1,0,10,[],[['+',.007,'%','de daño']]),
  N('instinct','Instinto',2,0,8,[['drive',3]],[['−',.015,'%','de recarga de esquiva']]),
  N('ferocity','Ferocidad',3,0,10,[['drive',5]],[['+',.008,'%','de daño']]),
  N('pursuer','Perseguidor',4,0,6,[['instinct',4]],[['+',.04,'%','de distancia máxima de embestida']]),
  N('overpower','Potencia plena',5,0,8,[['ferocity',6],['pursuer',2]],[['+',.01,'%','de daño']]),
  N('evasionmaster','Esquiva experta',6,0,6,[['instinct',6],['overpower',4]],[['−',.015,'%','de recarga de esquiva']]),
  N('resolve','Temple',1,1,10,[],[['+',.008,'%','de vida máxima']],'Conserva los PS actuales.'),
  N('breathing','Respiración',2,1,8,[['resolve',3]],[['+',.015,'%','de regeneración de stamina']]),
  N('vitality','Vitalidad',3,1,10,[['resolve',5]],[['+',.008,'%','de vida máxima']],'Conserva los PS actuales.'),
  N('bulwark','Fortaleza',4,1,8,[['vitality',4]],[['−',.006,'%','de daño recibido']]),
  N('recovery','Recuperación',5,1,8,[['breathing',5],['bulwark',2]],[['+',.015,'%','de regeneración de stamina']]),
  N('enduring','Resistencia plena',6,1,8,[['vitality',8],['bulwark',4]],[['+',.01,'%','de vida máxima']],'Conserva los PS actuales.'),
  N('discipline','Disciplina',1,2,10,[],[['+',.01,'%','de regeneración de energía']],'El primer rango permite aprender nuevas técnicas.'),
  N('fleetfoot','Paso veloz',2,2,8,[['discipline',3]],[['+',.01,'%','de velocidad al caminar en combate']]),
  N('economy','Economía de esfuerzo',3,2,10,[['discipline',5]],[['−',.006,'%','de coste de stamina de las técnicas']]),
  N('wellspring','Manantial',5,2,8,[['discipline',7],['economy',4]],[['+',.012,'%','de regeneración de energía']]),
  N('calm','Calma total',6,2,6,[['wellspring',4],['economy',8]],[['−',.007,'%','de coste de stamina de las técnicas']])
 ],
 move:[
  N('potency','Potencia',1,0,10,[],[['+',.012,'%','de daño'],['+',.015,'%','de duración de estados']]),
  N('impact','Impacto',3,0,8,[['potency',5]],[['+',.012,'%','de daño'],['+',.012,'%','de duración de estados']]),
  N('finisher','Remate',5,0,8,[['impact',5]],[['+',.015,'%','de daño'],['+',.015,'%','de duración de estados']]),
  N('mastery','Dominio',1,1,10,[],[['−',.01,'%','de recarga']]),
  N('flow','Fluidez',2,1,8,[['mastery',3]],[['−',.012,'%','de coste de stamina']]),
  N('rhythm','Ritmo',3,1,8,[['mastery',5]],[['−',.012,'%','de recarga']]),
  N('efficiency','Eficiencia',4,1,8,[['flow',4]],[['−',.012,'%','de coste de stamina']]),
  N('cadence','Cadencia',5,1,8,[['rhythm',5],['efficiency',2]],[['−',.01,'%','de recarga']]),
  N('tempo','Tempo',6,1,6,[['cadence',5],['rhythm',6]],[['−',.013,'%','de recarga']]),
  N('precision','Precisión',1,2,10,[],[['+',1,'pt','de precisión'],['+',.003,'%','de críticos'],['+',.005,'%','de duración de estados']],'La duración solo afecta a técnicas de estado.'),
  N('reach','Proyección',2,2,8,[['precision',3]],[['+',.015,'%','de alcance (o de duración en mejoras propias)']]),
  N('focuscast','Ejecución concentrada',3,2,8,[['precision',5]],[['−',.01,'%','de coste de energía']]),
  N('amplification','Ampliación',4,2,8,[['reach',4]],[['+',.012,'%','de alcance (o de duración en mejoras propias)']]),
  N('surehand','Mano firme',5,2,8,[['precision',7],['focuscast',3]],[['+',.005,'%','de críticos'],['+',.008,'%','de duración de estados']],'La duración solo afecta a técnicas de estado.'),
  N('readiness','Preparación',6,2,6,[['focuscast',5],['amplification',3]],[['−',.015,'%','de tiempo de preparación del ataque']])
 ]
};
const NODE=Object.fromEntries(Object.entries(TREES).map(([k,v])=>[k,Object.fromEntries(v.map(n=>[n.id,n]))]));
const COLUMNS={trainer:['Exploración','Apoyo','Formación'],type:['Ofensiva','Técnica','Defensa'],pokemon:['Ofensiva','Resistencia','Aptitud'],move:['Potencia','Fluidez','Precisión y alcance']};
// Row requirements: trainer level / type XP / Pokémon level / move practice XP.
const TIERS={trainer:[1,5,10,18,28,40],type:[0,150,450,900,1600,2600],pokemon:[1,8,16,28,42,58],move:[0,150,450,1000,1900,3200]};
const TIER_TEXT={trainer:v=>'Entrenador Nv. '+v,type:v=>v+' XP del tipo',pokemon:v=>'Nv. '+v,move:v=>v+' XP de práctica'};
for(const kind of Object.keys(TREES))for(const n of TREES[kind])for(const r of n.requires){const parent=NODE[kind][r.id];if(!parent||parent.tier>n.tier||r.rank>parent.max)throw Error('Bad requirement '+kind+'/'+n.id)}
const X={ // per-rank values used by the bonuses; the same numbers build the descriptions above
 pokemon:Object.fromEntries(TREES.pokemon.map(n=>[n.id,n.parts[0][1]])),
 trainer:Object.fromEntries(TREES.trainer.map(n=>[n.id,n.parts[0][1]])),
 type:Object.fromEntries(TREES.type.map(n=>[n.id,n.parts[0][1]])),
 move:Object.fromEntries(TREES.move.map(n=>[n.id,n.parts.map(p=>p[1])]))
};
const rank=(p,key)=>p?.nodes?.[key]||0;
// ---------- Levels and point pools ----------
const trainerXP=l=>Math.round(100*(l-1)**1.6);
function trainerLevel(xp){let l=1;while(l<99&&xp>=trainerXP(l+1))l++;return l}
const typeCost=n=>90*n+15*n*(n-1);
function typeEarned(total){let n=0;while(n<99&&total>=typeCost(n+1))n++;return n}
const tierOf=(kind,value)=>TIERS[kind].filter(v=>value>=v).length;
function subjectCreature(s,subject){return s.team[subject?.index??s.active]}
function access(s,kind,subject){
 let value;
 if(kind==='trainer')value=trainerLevel(s.trainer.xp);
 else if(kind==='type')value=Math.floor(s.trainer.types[subject]?.xp||0);
 else{const c=subjectCreature(s,subject);value=!c?0:kind==='pokemon'?c.level:Math.floor(ensureCreature(c).moves[subject?.move]?.xp||0)}
 const tier=tierOf(kind,value),text=TIER_TEXT[kind],requirements=Object.fromEntries(TIERS[kind].map((v,i)=>[i+1,text(v)]));
 const label={trainer:'Nivel de entrenador '+value,type:'XP del tipo: '+value,pokemon:'Nivel '+value,move:'XP de práctica: '+value}[kind];
 return{tier,value,label,next:tier<6?requirements[tier+1]:'Árbol completo',requirements}
}
const nodesSpent=(p,kind)=>TREES[kind].reduce((total,n)=>total+rank(p,n.id)*n.cost,0);
function typeTotalXP(s){return typeIds.reduce((n,t)=>n+(s.trainer.types[t]?.xp||0),0)}
function earned(s,kind,subject){
 if(kind==='trainer')return trainerLevel(s.trainer.xp);
 if(kind==='type')return typeEarned(typeTotalXP(s));
 const c=subjectCreature(s,subject);if(!c)return 0;const gain=ensureCreature(c).levelGain||0;
 return kind==='pokemon'?1+gain:1+Math.floor(gain/2)
}
function spent(s,kind,subject){
 if(kind==='trainer')return nodesSpent(s.trainer,'trainer');
 if(kind==='type')return typeIds.reduce((n,t)=>n+nodesSpent(s.trainer.types[t],'type'),0);
 const c=subjectCreature(s,subject);if(!c)return 0;const p=ensureCreature(c);
 return kind==='pokemon'?nodesSpent(p,'pokemon')+(p.learnSpent||0):Object.values(p.moves).reduce((n,m)=>n+nodesSpent(m,'move'),0)
}
function points(s,kind,subject){return Math.max(0,earned(s,kind,subject)-spent(s,kind,subject))}
function defaultKit(id){return rawMoves({id}).slice(0,4).map(m=>m.key)}
function initialKit(c){const profile=F.DATA[c.id].levelUpMoves;if(!profile)return defaultKit(c.id);return profile.filter(([level])=>level<=c.level).map(([,key])=>key).slice(-4)}
function addKnown(p,key){if(key&&!p.learned.includes(key)){p.learned.push(key);p.moves[key]={xp:0,nodes:{}}}}
function ensureCreature(c,legacy=false){const profile=F.DATA[c.id].levelUpMoves;if(!c.progression){const kit=initialKit(c);c.progression={xp:c.wins*40,nodes:{},learnSpent:0,learned:[...new Set(kit)],loadout:[...kit],moves:{},initialMovesVersion:1,levelGain:legacy?Math.max(0,c.level-5):0}}const p=c.progression;p.levelGain??=0;p.learningFailures??={};if(profile&&!p.initialMovesVersion){const untouched=c.level===5&&c.wins===0&&p.learnSpent===0&&Object.values(p.moves).every(m=>m.xp===0&&Object.keys(m.nodes).length===0)&&p.learned.every(k=>defaultKit(c.id).includes(k));if(untouched){const kit=initialKit(c);p.learned=[...kit];p.loadout=[...kit];p.moves={}}p.initialMovesVersion=1}if(F.isFinal(c)&&!p.ultimate){p.ultimate=profile?[...p.learned].sort((a,b)=>F.MOVE_DATA[b].power-F.MOVE_DATA[a].power)[0]:(ULTIMATES[c.id]||[]).find(k=>!p.loadout.includes(k))||F.defaultUltimate(c);addKnown(p,p.ultimate)}for(const key of p.learned)p.moves[key]??={xp:0,nodes:{}};return p}
// Old saves used other skills, per-tree XP wallets and 4-EV training: refund everything once, keep XP, moves and stats.
function migrate(s){
 s.trainer.nodes={};for(const t of typeIds)s.trainer.types[t].nodes={};
 for(const c of s.team){
  for(let i=0;i<6;i++)c.ev[i]=Math.floor((c.ev[i]||0)/4);
  let over=c.ev.reduce((a,b)=>a+b,0)-F.trainBudget(c);for(let i=5;over>0&&i>=0;i--){const take=Math.min(over,c.ev[i]);c.ev[i]-=take;c.training+=take;over-=take}
  const p=c.progression;if(p){p.nodes={};for(const m of Object.values(p.moves||{}))m.nodes={};p.levelGain=Math.max(c.level-5,p.learnSpent||0,0)}else ensureCreature(c,true)
 }
}
function ensureState(s){if(!s.trainer){s.trainer={xp:s.battles*50,nodes:{},types:{}};for(const type of typeIds){let xp=s.seenTypes?.[type]?20:0;for(const c of s.team)if(F.DATA[c.id].types.includes(type))xp+=Math.floor(c.wins*30/F.DATA[c.id].types.length);s.trainer.types[type]={xp,nodes:{}}}}for(const type of typeIds)s.trainer.types[type]??={xp:0,nodes:{}};if((s.progressionVersion||0)<VERSION)migrate(s);for(const c of s.team){ensureCreature(c);F.creatureHealth(c)}s.visitedRegions??={campina:true};s.progressionVersion=VERSION;return s}
function getTree(s,kind,subject){ensureState(s);if(kind==='trainer')return s.trainer;if(kind==='type')return s.trainer.types[subject];const c=subjectCreature(s,subject);if(!c)return null;const p=ensureCreature(c);return kind==='pokemon'?p:p.moves[subject?.move]}
function canBuy(s,kind,subject,id){const p=getTree(s,kind,subject),n=NODE[kind]?.[id];if(!p||!n)return{ok:false,reason:'No disponible'};const r=rank(p,id);if(r>=n.max)return{ok:false,reason:'Rango máximo',maxed:true};const a=access(s,kind,subject);if(n.tier>a.tier)return{ok:false,reason:a.requirements[n.tier],tierLocked:true};const missing=n.requires.find(q=>rank(p,q.id)<q.rank);if(missing)return{ok:false,reason:'Requiere '+NODE[kind][missing.id].name+' '+missing.rank,prereqLocked:true};if(points(s,kind,subject)<n.cost)return{ok:false,reason:'Sin puntos disponibles',noPoints:true};return{ok:true,reason:'Subir al rango '+(r+1)+' · '+n.cost+' punto'}}
function buy(s,kind,subject,id){if(!canBuy(s,kind,subject,id).ok)return false;const p=getTree(s,kind,subject);p.nodes[id]=(p.nodes[id]||0)+1;if(kind==='pokemon')F.creatureHealth(subjectCreature(s,subject));return true}
const catalogCache={};
function catalog(c){if(catalogCache[c.id])return catalogCache[c.id];const legal=LEARNSETS[c.id]||defaultKit(c.id),profile=F.DATA[c.id].levelUpMoves,levels=profile&&Object.fromEntries(profile.map(([level,key])=>[key,level]));return catalogCache[c.id]=legal.map(key=>({key,level:F.clamp(profile?levels[key]??Math.max(15,LEVELS[c.id]?.[key]??15):LEVELS[c.id]?.[key]??8,1,100),method:levels?.[key]!==undefined?'level':'training',cost:1})).sort((a,b)=>a.level-b.level||F.MOVE_DATA[a.key].name.localeCompare(F.MOVE_DATA[b.key].name,'es'))}
function canLearn(s,index,key){const c=s.team[index];if(!c)return{ok:false,reason:'Compañero no disponible'};const p=ensureCreature(c),entry=catalog(c).find(e=>e.key===key);if(!entry)return{ok:false,reason:'No compatible'};if(p.learned.includes(key))return{ok:false,reason:'Aprendida'};if(c.level<entry.level)return{ok:false,reason:'Nv. '+entry.level};if((p.learningFailures[key]||0)>=c.level)return{ok:false,reason:c.level===100?'Sin nuevos intentos (Nv. 100)':'Reintentar en Nv. '+(c.level+1),blocked:true};if(rank(p,'discipline')<1)return{ok:false,reason:'Requiere Disciplina'};if(points(s,'pokemon',{index})<entry.cost)return{ok:false,reason:'Necesitas 1 punto'};return{ok:true,reason:'Practicar · 1 punto al aprobar',entry}}
// The saved lock is written at the start: closing or reloading cannot bypass a failed trial.
const trials=new WeakMap();
function beginTrial(s,index,key,now=Date.now()){const can=canLearn(s,index,key);if(!can.ok)return can;const c=s.team[index];if(trials.has(s))return{ok:false,reason:'Ya hay una prueba en curso'};const r=F.rng(F.seedNumber(c.uid+key+c.level)),sequence=Array.from({length:5},()=>Math.floor(r()*4)),trial={index,uid:c.uid,id:c.id,key,level:c.level,sequence,position:0,previewUntil:now+3200,deadline:now+18200};c.progression.learningFailures[key]=c.level;trials.set(s,trial);return{ok:true,...trial,sequence:[...sequence]}}
function finishTrial(s,passed){const t=trials.get(s);if(!t)return{done:true,passed:false};trials.delete(s);const c=s.team[t.index];if(!c||c.uid!==t.uid||c.id!==t.id||c.level!==t.level)return{done:true,passed:false};const p=ensureCreature(c);if(passed&&points(s,'pokemon',{index:t.index})>=1&&!p.learned.includes(t.key)){p.learnSpent++;addKnown(p,t.key);const equipped=p.loadout.length<4;if(equipped)p.loadout.push(t.key);delete p.learningFailures[t.key];return{done:true,passed:true,key:t.key,equipped}}return{done:true,passed:false,key:t.key,level:c.level}}
function trialInput(s,value,now=Date.now()){const t=trials.get(s);if(!t)return{done:true,passed:false};if(now<t.previewUntil)return{done:false,preview:true,position:0};if(now>t.deadline||value!==t.sequence[t.position])return finishTrial(s,false);t.position++;return t.position===t.sequence.length?finishTrial(s,true):{done:false,position:t.position}}
function expireTrial(s,now=Date.now()){const t=trials.get(s);return t&&now>t.deadline?finishTrial(s,false):{done:false}}
function learn(){return false} // Learning is awarded only by a completed trial.
function equip(s,index,slot,key){const c=s.team[index];if(!c||!Number.isInteger(slot)||slot<0||slot>4)return false;const p=ensureCreature(c);if(!p.learned.includes(key)||slot===4&&!F.isFinal(c)||slot<4&&slot>p.loadout.length)return false;if(slot===4){p.ultimate=key;return true}const uniqueLegal=new Set(LEARNSETS[c.id]||defaultKit(c.id)).size;if(uniqueLegal>=4&&p.loadout.some((v,i)=>v===key&&i!==slot))return false;p.loadout[slot]=key;return true}
function pokemonBonuses(c){const p=c.progression,R=id=>rank(p,id),Y=X.pokemon;return{
 damage:1+Y.drive*R('drive')+Y.ferocity*R('ferocity')+Y.overpower*R('overpower'),
 hp:1+Y.resolve*R('resolve')+Y.vitality*R('vitality')+Y.enduring*R('enduring'),
 energy:1+Y.discipline*R('discipline')+Y.wellspring*R('wellspring'),stamina:1+Y.breathing*R('breathing')+Y.recovery*R('recovery'),
 dodge:1-Y.instinct*R('instinct')-Y.evasionmaster*R('evasionmaster'),
 defense:1-Y.bulwark*R('bulwark'),walk:1+Y.fleetfoot*R('fleetfoot'),approach:1+Y.pursuer*R('pursuer'),staminaCost:1-Y.economy*R('economy')-Y.calm*R('calm')
}}
function trainerBonuses(trainer,c){const types=c?F.DATA[c.id].types:[],average=id=>types.length?types.reduce((n,t)=>n+rank(trainer?.types?.[t],id),0)/types.length:0,R=id=>rank(trainer,id),T=X.trainer,Y=X.type;return{
 xp:1+T.bond*R('bond')+T.fieldnotes*R('fieldnotes')+T.researcher*R('researcher'),
 moveXP:1+T.mentorship*R('mentorship'),walk:1+T.travel*R('travel')+T.trailcraft*R('trailcraft')+T.trailblazer*R('trailblazer'),
 switch:Math.max(3,6-T.coordination*R('coordination')-T.quickrelay*R('quickrelay')-T.relaymaster*R('relaymaster')),
 switchGuard:.8+T.relayguard*R('relayguard'),interact:64+T.tracking*R('tracking')+T.farwatch*R('farwatch'),
 berry:.30*(1+T.firstaid*R('firstaid')+T.triage*R('triage')),
 energy:1+Y.affinity*average('affinity')+Y.recharge*average('recharge'),stamina:1+Y.balance*average('balance'),
 defense:1-Y.resilience*average('resilience')-Y.composure*average('composure')-Y.ward*average('ward'),
 energyCost:1-Y.reserve*average('reserve'),staminaCost:1-T.conservation*R('conservation'),dodge:1-Y.recoveryguard*average('recoveryguard')
}}
function trainerMove(trainer,c,m){const ownTypes=F.DATA[c.id].types;if(!ownTypes.includes(m.type))return m;const p=trainer?.types?.[m.type],R=id=>rank(p,id),Y=X.type;return{...m,
 power:Number((m.power*(1+Y.technique*R('technique')+Y.channeling*R('channeling')+Y.piercing*R('piercing'))).toFixed(2)),
 duration:m.duration?m.duration*(1+Y.lingering*R('lingering')+Y.specialist*R('specialist')+Y.longlasting*R('longlasting')):m.duration,
 energyCost:m.energyCost*(1-(m.power===0?Y.efficientcast*R('efficientcast'):0)),superEffectiveBonus:1+Y.exploitation*R('exploitation')
}}
F.moves=function(c){if(!c.progression){c={...c};ensureCreature(c)}const bonus=pokemonBonuses(c),M=X.move;return rawMoves(c).map(m=>{
 if((m.weather||m.terrain)&&!m.duration)m={...m,duration:15};if(m.effect&&m.effect!=='transform'&&!m.duration)m={...m,duration:m.effect==='sleep'?2:7};
 const p=c.progression?.moves?.[m.key],R=id=>rank(p,id),self=m.kind==='self',status=m.power===0;
 const durationMul=1+M.potency[1]*R('potency')+M.impact[1]*R('impact')+M.finisher[1]*R('finisher')+(status?M.precision[2]*R('precision')+M.surehand[1]*R('surehand'):0)+(self?M.reach[0]*R('reach')+M.amplification[0]*R('amplification'):0);
 return{...m,power:Number((m.power*(1+M.potency[0]*R('potency')+M.impact[0]*R('impact')+M.finisher[0]*R('finisher'))).toFixed(2)),
 duration:m.duration?m.duration*durationMul:m.duration,
 range:m.range*(1+(self?0:M.reach[0]*R('reach')+M.amplification[0]*R('amplification'))),
 cost:Math.max(6,Number((m.cost*(1-M.flow[0]*R('flow')-M.efficiency[0]*R('efficiency'))*bonus.staminaCost).toFixed(1))),
 energyCost:m.energyCost*(1-M.focuscast[0]*R('focuscast')),delay:m.delay*(1-M.readiness[0]*R('readiness')),
 cooldown:Number((m.cooldown*(1-M.mastery[0]*R('mastery')-M.rhythm[0]*R('rhythm')-M.cadence[0]*R('cadence')-M.tempo[0]*R('tempo'))).toFixed(2)),
 accuracy:m.accuracy?Math.min(100,m.accuracy+M.precision[0]*R('precision')):m.accuracy,
 bonusCrit:M.precision[1]*R('precision')+M.surehand[0]*R('surehand'),approachDistance:210*bonus.approach
 }
})};
F.newState=(...args)=>ensureState(rawNew(...args));F.upgradeState=s=>ensureState(rawUpgrade(s));F.evolve=function(c,shards,target){ensureCreature(c);if(!rawEvolve(c,shards,target))return false;ensureCreature(c);return true};
// Evolution levels are approximate: every creature has its own personal threshold around the listed level
// (about ±15 %, at least ±2, stable per creature and target). Only natural levels count: levels added with Rare Candy
// (c.candyLevels) never help a Pokémon evolve.
function evolutionLevel(c,target){const e=F.evolutionOptions(c).find(v=>v.target===Number(target));if(!e)return null;const r=F.rng(F.seedNumber(c.uid+':evolution:'+e.target)),spread=Math.max(2,Math.round(e.level*.15));return Math.max(2,e.level+Math.round((r()*2-1)*spread))}
function naturalLevel(c){return c.level-(c.candyLevels||0)}
function evolutionReady(c,e){return naturalLevel(c)>=evolutionLevel(c,e.target)}
// Data for the level-up celebration: stat gains, points earned and techniques that just became available.
function levelUpSnapshot(s,c){const index=s.team.indexOf(c);ensureCreature(c);return{level:c.level,stats:F.stats(c),maxHP:F.maxHP(c),index,pokemon:points(s,'pokemon',{index}),move:points(s,'move',{index}),wasReady:F.evolutionOptions(c).some(e=>evolutionReady(c,e))}}
function levelUpReport(s,c,snap){const index=snap.index,p=ensureCreature(c),stats=F.stats(c);return{id:c.id,name:F.DATA[c.id].name,from:snap.level,to:c.level,stats:F.STAT_NAMES.map((label,i)=>({label,before:i===0?snap.maxHP:snap.stats[i],after:i===0?F.maxHP(c):stats[i]})),pokemonPoints:points(s,'pokemon',{index})-snap.pokemon,movePoints:points(s,'move',{index})-snap.move,newMoves:catalog(c).filter(e=>e.level>snap.level&&e.level<=c.level&&!p.learned.includes(e.key)).map(e=>({key:e.key,name:F.MOVE_DATA[e.key].name,type:F.MOVE_DATA[e.key].type,level:e.level})),needsDiscipline:rank(p,'discipline')<1,canEvolve:!snap.wasReady&&F.evolutionOptions(c).some(e=>evolutionReady(c,e))}}
// Only natural level-ups (combat experience) grant skill points. Rare Candies change c.level directly and grant none.
F.award=function(c,amount){const before=c.level,levels=rawAward(c,amount);if(c.level>before){const p=ensureCreature(c);p.levelGain=Math.min(99,(p.levelGain||0)+c.level-before)}return levels};
function reveal(s,enc){ensureState(s);const first=!s.seenTypes[enc.type];s.seenTypes[enc.type]=true;if(first){s.trainer.xp+=15;s.trainer.types[enc.type].xp+=20}return first}
function visit(s,id){if(!F.REGIONS[id])return false;ensureState(s);s.visitedRegions??={campina:true};if(s.visitedRegions[id])return false;s.visitedRegions[id]=true;s.trainer.xp+=40;return true}
function rewardBattle(s,b){if(b.progressAwarded)return false;b.progressAwarded=true;if(!['win','caught'].includes(b.result))return false;ensureState(s);s.trainer.xp+=50;for(const a of b.roster.filter(a=>a.participated)){const p=ensureCreature(a.creature);p.xp+=40;const types=F.DATA[a.creature.id].types;for(const t of types)s.trainer.types[t].xp+=30/types.length;for(const [key,count] of Object.entries(a.usedMoves||{}))if(p.moves[key])p.moves[key].xp+=Math.round((15+Math.min(count,30)*10)*trainerBonuses(s.trainer,a.creature).moveXP)}return true}
// ---------- Validation ----------
const shape=p=>!!p&&Number.isFinite(p.xp)&&p.xp>=0&&p.xp<=1e9&&!!p.nodes&&typeof p.nodes==='object'&&!Array.isArray(p.nodes);
function nodesOk(p,kind,value){const tier=tierOf(kind,value);return Object.entries(p.nodes).every(([id,v])=>{const n=NODE[kind][id];return n&&Number.isInteger(v)&&v>=0&&v<=n.max&&(!v||n.tier<=tier&&n.requires.every(q=>rank(p,q.id)>=q.rank))})}
function validProgress(c,modern=true){const p=c.progression;if(!p)return true;const cap=Object.keys(F.MOVE_DATA).length,legal=k=>LEARNSETS[c.id]?.includes(k)||defaultKit(c.id).includes(k);
 if(c.candyLevels!==undefined&&(!Number.isInteger(c.candyLevels)||c.candyLevels<0||c.candyLevels>99))return false;
 if(!shape(p)||!Number.isInteger(p.learnSpent)||p.learnSpent<0||p.learnSpent>cap||!Array.isArray(p.learned)||p.learned.length>cap||new Set(p.learned).size!==p.learned.length||!p.learned.every(legal)||!Array.isArray(p.loadout)||p.loadout.length<1||p.loadout.length>4||Object.keys(p.loadout).length!==p.loadout.length||!p.loadout.every(k=>p.learned.includes(k))||!p.moves||!Object.entries(p.moves).every(([k,v])=>p.learned.includes(k)&&shape(v))||!p.learned.every(k=>shape(p.moves[k])))return false;
 if(p.ultimate&&(!F.isFinal(c)||!p.learned.includes(p.ultimate)))return false;
 if(p.learningFailures&&(typeof p.learningFailures!=='object'||Array.isArray(p.learningFailures)||!Object.entries(p.learningFailures).every(([key,level])=>legal(key)&&Number.isInteger(level)&&level>=1&&level<=c.level)))return false;
 if(modern){if(!Number.isInteger(p.levelGain)||p.levelGain<0||p.levelGain>99||!nodesOk(p,'pokemon',c.level)||nodesSpent(p,'pokemon')+p.learnSpent>1+p.levelGain)return false;let moveSpent=0;for(const m of Object.values(p.moves)){if(!nodesOk(m,'move',m.xp))return false;moveSpent+=nodesSpent(m,'move')}if(moveSpent>1+Math.floor(p.levelGain/2))return false;if(c.ev.reduce((a,b)=>a+b,0)>F.trainBudget(c))return false}
 return new Set(LEARNSETS[c.id]||defaultKit(c.id)).size<4||new Set(p.loadout).size===p.loadout.length}
F.validState=function(s){if(!rawValid(s))return false;const modern=s.progressionVersion>=VERSION;
 if(s.trainer){if(!shape(s.trainer)||!s.trainer.types||typeof s.trainer.types!=='object'||!Object.entries(s.trainer.types).every(([t,p])=>typeIds.includes(t)&&shape(p)))return false;
  if(modern){const level=trainerLevel(s.trainer.xp);if(!nodesOk(s.trainer,'trainer',level)||nodesSpent(s.trainer,'trainer')>level)return false;let used=0,total=0;for(const p of Object.values(s.trainer.types)){if(!nodesOk(p,'type',p.xp))return false;used+=nodesSpent(p,'type');total+=p.xp}if(used>typeEarned(total))return false}}
 if(s.visitedRegions&&(!Object.keys(s.visitedRegions).every(id=>F.REGIONS[id]&&s.visitedRegions[id]===true)))return false;return s.team.every(c=>validProgress(c,modern))};
Object.assign(F,{levelUpSnapshot,levelUpReport,evolutionLevel,evolutionReady,naturalLevel,TREES,SKILL_COLUMNS:COLUMNS,SKILL_TIERS:TIERS,skillAccess:access,pokemonSkillTier:c=>tierOf('pokemon',c.level),typeIds,skillRank:rank,skillPoints:points,skillEarned:earned,skillSpent:spent,trainerLevel,trainerXP,typeEarned,typeCost,initialMoves:initialKit,ensureProgress:ensureState,ensureCreatureProgress:ensureCreature,skillTree:getTree,canBuySkill:canBuy,buySkill:buy,learnCatalog:catalog,canLearnMove:canLearn,beginLearnTrial:beginTrial,learnTrialInput:trialInput,expireLearnTrial:expireTrial,cancelLearnTrial:s=>finishTrial(s,false),learnMove:learn,equipMove:equip,pokemonBonuses,trainerBonuses,trainerMove,revealEncounter:reveal,visitRegion:visit,rewardBattle,validProgress});return F;
});
