(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera,root.SPECIES_LEARNSETS,root.SPECIES_MOVE_LEVELS,root.SPECIES_ULTIMATES)})(typeof window!=='undefined'?window:globalThis,function(F,LEARNSETS,LEVELS,ULTIMATES){
'use strict';
LEARNSETS=LEARNSETS||{};LEVELS=LEVELS||{};ULTIMATES=ULTIMATES||{};
const typeIds=Object.keys(F.HINT_POOLS),rawMoves=F.moves,rawNew=F.newState,rawUpgrade=F.upgradeState,rawEvolve=F.evolve,rawValid=F.validState;
const node=(id,name,description,max=1,parent=null,need=1,cost=1)=>({id,name,description,max,parent,need,cost});
const TREES={
 trainer:[node('bond','Vínculo','+5 % de experiencia para el Pokémon activo.'),node('travel','Cartografía','+3 % de velocidad al explorar por rango.',3,'bond'),node('coordination','Coordinación','−0,4 s entre cambios por rango.',3,'bond'),node('tracking','Rastreo','Investiga rastros desde 80 px en vez de 64.',1,'travel',2,2),node('firstaid','Primeros auxilios','Las bayas curan un 20 % más que su efecto base.',1,'coordination',2,2)],
 type:[node('affinity','Afinidad','+5 % de regeneración de energía.'),node('technique','Técnica elemental','+3 % de daño del tipo por rango.',3,'affinity'),node('resilience','Resistencia','−3 % de daño recibido por rango.',3,'affinity'),node('specialist','Especialista','+8 % de duración de estados de ese tipo.',1,'technique',2,2),node('reserve','Reservas','−8 % de coste de energía.',1,'resilience',2,2)],
 pokemon:[node('discipline','Disciplina','+5 % de regeneración de energía. Permite aprender nuevas técnicas.'),node('drive','Impulso','+2 % de daño por rango.',3,'discipline'),node('resolve','Temple','+2 % de vida máxima por rango.',3,'discipline'),node('instinct','Instinto','−8 % de recarga de esquiva.',1,'drive',2,2),node('breathing','Respiración','+8 % de regeneración de stamina.',1,'resolve',2,2)],
 move:[node('mastery','Dominio','−3 % de recarga.'),node('potency','Potencia / control','+4 % de daño y +5 % de duración de estados por rango.',3,'mastery'),node('flow','Fluidez','−3 % de coste de stamina por rango.',3,'mastery'),node('reach','Proyección','+10 % de alcance o duración si es una mejora propia.',1,'potency',2,2),node('rhythm','Ritmo','−8 % de recarga.',1,'flow',2,2)]
};
const PATHS={
 trainer:[{id:'exploration',name:'Exploración',nodes:['travel','tracking']},{id:'support',name:'Apoyo',nodes:['coordination','firstaid']}],
 type:[{id:'offense',name:'Ofensiva',nodes:['technique','specialist']},{id:'defense',name:'Defensa',nodes:['resilience','reserve']}],
 pokemon:[{id:'impulse',name:'Impulso',nodes:['drive','instinct']},{id:'endurance',name:'Resistencia',nodes:['resolve','breathing']}],
 move:[{id:'power',name:'Potencia y alcance',nodes:['potency','reach']},{id:'flow',name:'Fluidez y ritmo',nodes:['flow','rhythm']}]
};
// Each terminal base skill forks twice: specialization, then a final choice.
const EXPANSIONS={
 trainer:{
  tracking:[['trailcraft','Senderismo','+4 % de velocidad de exploración por rango.',[['trailblazer','Explorador experto','+5 % de velocidad de exploración.'],['farwatch','Vista lejana','+20 px de alcance para investigar rastros.']]],['fieldnotes','Cuaderno de campo','+4 % de experiencia del Pokémon por rango.',[['researcher','Investigador','+8 % de experiencia del Pokémon.'],['mentorship','Mentoría','+15 % de experiencia de práctica para los ataques.']]]],
  firstaid:[['quickrelay','Relevo rápido','−0,3 s entre cambios por rango.',[['relaymaster','Maestro del relevo','−0,6 s entre cambios.'],['relayguard','Entrada protegida','+0,25 s de protección al cambiar de compañero.']]],['triage','Triaje','+10 % del efecto base de curación con bayas por rango.',[['fieldmedic','Medicina de campo','+20 % del efecto base de curación con bayas.'],['conservation','Conservación','−3 % de coste de stamina para todas las técnicas.']]]]
 },
 type:{
  specialist:[['channeling','Canalización','+3 % de daño del tipo por rango.',[['exploitation','Ventaja elemental','+5 % de daño del tipo contra objetivos débiles.'],['piercing','Concentración elemental','+4 % de daño del tipo.']]],['lingering','Persistencia','+5 % de duración de estados del tipo por rango.',[['longlasting','Estado prolongado','+10 % de duración de estados del tipo.'],['efficientcast','Estado eficiente','−4 % de energía para técnicas de estado del tipo.']]]],
  reserve:[['composure','Compostura','−3 % de daño recibido por rango.',[['ward','Baluarte elemental','−5 % de daño recibido.'],['recoveryguard','Paso seguro','−5 % de recarga de esquiva.']]],['recharge','Recarga','+4 % de regeneración de energía en reposo por rango.',[['deepreserve','Reserva profunda','−5 % de coste de energía.'],['balance','Equilibrio','+6 % de regeneración de stamina.']]]]
 },
 pokemon:{
  instinct:[['ferocity','Ferocidad','+3 % de daño por rango.',[['overpower','Potencia plena','+6 % de daño.'],['pursuer','Perseguidor','+20 % de distancia máxima de embestida.']]],['agility','Agilidad','−3 % de recarga de esquiva por rango.',[['fleetfoot','Paso veloz','+5 % de velocidad al caminar en combate.'],['evasionmaster','Esquiva experta','−8 % de recarga de esquiva.']]]],
  breathing:[['vitality','Vitalidad','+3 % de vida máxima por rango; conserva los PS actuales.',[['bulwark','Fortaleza','−5 % de daño recibido.'],['enduring','Resistencia plena','+6 % de vida máxima; conserva los PS actuales.']]],['recovery','Recuperación','+4 % de regeneración de stamina por rango.',[['renewal','Renovación','+8 % de regeneración de stamina.'],['economy','Economía de esfuerzo','−4 % de coste de stamina de las técnicas.']]]]
 },
 move:{
  reach:[['impact','Impacto','+3 % de daño y +4 % de duración de estados por rango.',[['finisher','Remate','+6 % de daño y +8 % de duración de estados.'],['amplification','Ampliación','+8 % de alcance; las mejoras propias ganan duración.']]],['precision','Precisión','+3 puntos de precisión y +2 % de críticos por rango; los estados ganan +3 % de duración.',[['surehand','Mano firme','+4 % de críticos; las técnicas de estado ganan +6 % de duración.'],['focuscast','Ejecución concentrada','−4 % de coste de energía.']]]],
  rhythm:[['efficiency','Eficiencia','−3 % de coste de stamina por rango.',[['frugal','Ahorro','−4 % de coste de stamina.'],['lightcast','Ejecución ligera','−6 % de coste de energía.']]],['cadence','Cadencia','−3 % de recarga por rango.',[['tempo','Tempo','−5 % de recarga.'],['readiness','Preparación','−10 % de tiempo de preparación del ataque.']]]]
 }
};
const FORKS=Object.fromEntries(Object.keys(TREES).map(kind=>[kind,{}]));
for(const kind of Object.keys(TREES)){
 for(const n of TREES[kind])n.tier=1;
 for(const [parent,choices]of Object.entries(EXPANSIONS[kind])){
  const path=PATHS[kind].find(p=>p.nodes.includes(parent));FORKS[kind][parent]=[];
  for(const [id,name,description,leaves]of choices){
   TREES[kind].push({...node(id,name,description,2,parent),tier:2,fork:parent});path.nodes.push(id);FORKS[kind][parent].push(id);FORKS[kind][id]=[];
   for(const [leaf,label,detail]of leaves){TREES[kind].push({...node(leaf,label,detail,1,id,2,2),tier:3,fork:id});path.nodes.push(leaf);FORKS[kind][id].push(leaf)}
  }
 }
}
for(const[kind,paths]of Object.entries(PATHS))for(const path of paths)for(const id of path.nodes)TREES[kind].find(n=>n.id===id).path=path.id;
const rank=(p,key)=>p?.nodes?.[key]||0;
function chosenPath(p,kind){return PATHS[kind].find(path=>path.nodes.some(id=>rank(p,id)>0))||null}
function exclusive(p,kind){return PATHS[kind].filter(path=>path.nodes.some(id=>rank(p,id)>0)).length<=1&&Object.values(FORKS[kind]).every(ids=>ids.filter(id=>rank(p,id)>0).length<=1)}
// Legacy investments in both paths are refunded through the existing point wallet.
function migratePaths(p,kind){if(PATHS[kind].filter(path=>path.nodes.some(id=>rank(p,id)>0)).length>1){for(const path of PATHS[kind])for(const id of path.nodes)delete p.nodes[id];return}for(const ids of Object.values(FORKS[kind]))if(ids.filter(id=>rank(p,id)>0).length>1){const remove=new Set(ids);for(const n of TREES[kind])if(remove.has(n.parent))remove.add(n.id);for(const id of remove)delete p.nodes[id]}}
const parents={},stageCache={},tailCache={};
for(const id of Object.keys(F.DATA))for(const e of F.evolutionOptions({id:Number(id)}))(parents[e.target]??=[]).push(Number(id));
function stage(id){return stageCache[id]??=(parents[id]?.length?1+Math.max(...parents[id].map(stage)):1)}
function tail(id){return tailCache[id]??=Math.max(0,...F.evolutionOptions({id:Number(id)}).map(e=>1+tail(e.target)))}
function familyInfo(c){return{stage:Math.min(3,stage(c.id)),stages:Math.min(3,stage(c.id)+tail(c.id))}}
function pokemonTier(c){const f=familyInfo(c);return f.stages>=3?f.stage:f.stages===2?(f.stage===1?1:c.level>=40?3:2):c.level>=40?3:c.level>=20?2:1}
function experienceTier(p,kind){const thresholds=kind==='trainer'?[300,900]:[180,600];return (p?.xp||0)>=thresholds[1]?3:(p?.xp||0)>=thresholds[0]?2:1}
function access(s,kind,subject){
 if(kind==='trainer'||kind==='type'){const p=kind==='trainer'?s.trainer:s.trainer.types[subject],tier=experienceTier(p,kind),thresholds=kind==='trainer'?[300,900]:[180,600];return{tier,label:kind==='trainer'?'Experiencia del entrenador':'Experiencia del tipo',next:tier<3?thresholds[tier-1]+' XP':'Árbol completo',requirements:{2:thresholds[0]+' XP',3:thresholds[1]+' XP'}}}
 const c=s.team[subject?.index??s.active],f=familyInfo(c),tier=pokemonTier(c),requirements=f.stages>=3?{2:'Segunda etapa evolutiva',3:'Tercera etapa evolutiva'}:f.stages===2?{2:'Segunda etapa evolutiva',3:'Segunda etapa y Nv. 40'}:{2:'Nv. 20',3:'Nv. 40'};return{tier,label:f.stages===1?'Desarrollo por nivel':'Etapa evolutiva '+f.stage+' / '+f.stages,next:tier<3?requirements[tier+1]:'Árbol completo',requirements}
}
function spent(p,kind){return TREES[kind].reduce((total,n)=>total+rank(p,n.id)*n.cost,0)+(kind==='pokemon'?(p.learnSpent||0):0)}
function points(p,kind){const earned=kind==='trainer'?2+Math.floor(p.xp/150):kind==='pokemon'?2+Math.floor(p.xp/80):kind==='type'?(p.xp>0?1+Math.floor(p.xp/90):0):1+Math.floor(p.xp/75);return Math.max(0,earned-spent(p,kind))}
function defaultKit(id){return rawMoves({id}).slice(0,4).map(m=>m.key)}
function initialKit(c){const profile=F.DATA[c.id].levelUpMoves;if(!profile)return defaultKit(c.id);return profile.filter(([level])=>level<=c.level).map(([,key])=>key).slice(-4)}
function addKnown(p,key){if(key&&!p.learned.includes(key)){p.learned.push(key);p.moves[key]={xp:0,nodes:{}}}}
function ensureCreature(c){const profile=F.DATA[c.id].levelUpMoves;if(!c.progression){const kit=initialKit(c);c.progression={xp:c.wins*40,nodes:{},learnSpent:0,learned:[...new Set(kit)],loadout:[...kit],moves:{},initialMovesVersion:1}}const p=c.progression;p.learningFailures??={};if(profile&&!p.initialMovesVersion){const untouched=c.level===5&&c.wins===0&&p.learnSpent===0&&Object.values(p.moves).every(m=>m.xp===0&&Object.keys(m.nodes).length===0)&&p.learned.every(k=>defaultKit(c.id).includes(k));if(untouched){const kit=initialKit(c);p.learned=[...kit];p.loadout=[...kit];p.moves={}}p.initialMovesVersion=1}if(F.isFinal(c)&&!p.ultimate){p.ultimate=profile?[...p.learned].sort((a,b)=>F.MOVE_DATA[b].power-F.MOVE_DATA[a].power)[0]:(ULTIMATES[c.id]||[]).find(k=>!p.loadout.includes(k))||F.defaultUltimate(c);addKnown(p,p.ultimate)}migratePaths(p,'pokemon');for(const key of p.learned){p.moves[key]??={xp:0,nodes:{}};migratePaths(p.moves[key],'move')}return p}
function ensureState(s){if(!s.trainer){s.trainer={xp:s.battles*50,nodes:{},types:{}};for(const type of typeIds){let xp=s.seenTypes?.[type]?20:0;for(const c of s.team)if(F.DATA[c.id].types.includes(type))xp+=Math.floor(c.wins*30/F.DATA[c.id].types.length);s.trainer.types[type]={xp,nodes:{}}}}migratePaths(s.trainer,'trainer');for(const type of typeIds){s.trainer.types[type]??={xp:0,nodes:{}};migratePaths(s.trainer.types[type],'type')}for(const c of s.team){ensureCreature(c);F.creatureHealth(c)}s.visitedRegions??={campina:true};s.progressionVersion=4;return s}
function getTree(s,kind,subject){ensureState(s);if(kind==='trainer')return s.trainer;if(kind==='type')return s.trainer.types[subject];const c=s.team[subject?.index??s.active];if(!c)return null;const p=ensureCreature(c);return kind==='pokemon'?p:p.moves[subject?.move]}
function canBuy(s,kind,subject,id){const p=getTree(s,kind,subject),n=TREES[kind]?.find(n=>n.id===id);if(!p||!n)return{ok:false,reason:'No disponible'};const path=chosenPath(p,kind);if(n.path&&path&&n.path!==path.id)return{ok:false,reason:'Camino '+path.name+' elegido',pathLocked:true};const sibling=n.fork&&FORKS[kind][n.fork].find(key=>key!==id&&rank(p,key)>0);if(sibling)return{ok:false,reason:'Elegiste '+TREES[kind].find(v=>v.id===sibling).name,pathLocked:true,forkLocked:true};if(rank(p,id)>=n.max)return{ok:false,reason:'Completado'};const a=access(s,kind,subject);if(n.tier>a.tier)return{ok:false,reason:a.requirements[n.tier],tierLocked:true};if(n.parent&&rank(p,n.parent)<n.need)return{ok:false,reason:TREES[kind].find(v=>v.id===n.parent).name+' '+n.need};if(points(p,kind)<n.cost)return{ok:false,reason:'Necesitas '+n.cost+' punto'+(n.cost>1?'s':'')};return{ok:true,reason:'Aprender · '+n.cost+' punto'+(n.cost>1?'s':'')}}
function buy(s,kind,subject,id){if(!canBuy(s,kind,subject,id).ok)return false;const p=getTree(s,kind,subject);p.nodes[id]=(p.nodes[id]||0)+1;if(kind==='pokemon')F.creatureHealth(s.team[subject?.index??s.active]);return true}
const catalogCache={};
function catalog(c){if(catalogCache[c.id])return catalogCache[c.id];const legal=LEARNSETS[c.id]||defaultKit(c.id),profile=F.DATA[c.id].levelUpMoves,levels=profile&&Object.fromEntries(profile.map(([level,key])=>[key,level]));return catalogCache[c.id]=legal.map(key=>({key,level:F.clamp(profile?levels[key]??Math.max(15,LEVELS[c.id]?.[key]??15):LEVELS[c.id]?.[key]??8,1,100),method:levels?.[key]!==undefined?'level':'training',cost:1})).sort((a,b)=>a.level-b.level||F.MOVE_DATA[a.key].name.localeCompare(F.MOVE_DATA[b.key].name,'es'))}
function canLearn(s,index,key){const c=s.team[index];if(!c)return{ok:false,reason:'Compañero no disponible'};const p=ensureCreature(c),entry=catalog(c).find(e=>e.key===key);if(!entry)return{ok:false,reason:'No compatible'};if(p.learned.includes(key))return{ok:false,reason:'Aprendida'};if(c.level<entry.level)return{ok:false,reason:'Nv. '+entry.level};if((p.learningFailures[key]||0)>=c.level)return{ok:false,reason:c.level===100?'Sin nuevos intentos (Nv. 100)':'Reintentar en Nv. '+(c.level+1),blocked:true};if(rank(p,'discipline')<1)return{ok:false,reason:'Requiere Disciplina'};if(points(p,'pokemon')<entry.cost)return{ok:false,reason:'Necesitas 1 punto'};return{ok:true,reason:'Practicar · 1 punto al aprobar',entry}}
// The saved lock is written at the start: closing or reloading cannot bypass a failed trial.
const trials=new WeakMap();
function beginTrial(s,index,key,now=Date.now()){const can=canLearn(s,index,key);if(!can.ok)return can;const c=s.team[index];if(trials.has(s))return{ok:false,reason:'Ya hay una prueba en curso'};const r=F.rng(F.seedNumber(c.uid+key+c.level)),sequence=Array.from({length:5},()=>Math.floor(r()*4)),trial={index,uid:c.uid,id:c.id,key,level:c.level,sequence,position:0,previewUntil:now+3200,deadline:now+18200};c.progression.learningFailures[key]=c.level;trials.set(s,trial);return{ok:true,...trial,sequence:[...sequence]}}
function finishTrial(s,passed){const t=trials.get(s);if(!t)return{done:true,passed:false};trials.delete(s);const c=s.team[t.index];if(!c||c.uid!==t.uid||c.id!==t.id||c.level!==t.level)return{done:true,passed:false};const p=ensureCreature(c);if(passed&&points(p,'pokemon')>=1&&!p.learned.includes(t.key)){p.learnSpent++;addKnown(p,t.key);const equipped=p.loadout.length<4;if(equipped)p.loadout.push(t.key);delete p.learningFailures[t.key];return{done:true,passed:true,key:t.key,equipped}}return{done:true,passed:false,key:t.key,level:c.level}}
function trialInput(s,value,now=Date.now()){const t=trials.get(s);if(!t)return{done:true,passed:false};if(now<t.previewUntil)return{done:false,preview:true,position:0};if(now>t.deadline||value!==t.sequence[t.position])return finishTrial(s,false);t.position++;return t.position===t.sequence.length?finishTrial(s,true):{done:false,position:t.position}}
function expireTrial(s,now=Date.now()){const t=trials.get(s);return t&&now>t.deadline?finishTrial(s,false):{done:false}}
function learn(){return false} // Learning is awarded only by a completed trial.
function equip(s,index,slot,key){const c=s.team[index];if(!c||!Number.isInteger(slot)||slot<0||slot>4)return false;const p=ensureCreature(c);if(!p.learned.includes(key)||slot===4&&!F.isFinal(c)||slot<4&&slot>p.loadout.length)return false;if(slot===4){p.ultimate=key;return true}const uniqueLegal=new Set(LEARNSETS[c.id]||defaultKit(c.id)).size;if(uniqueLegal>=4&&p.loadout.some((v,i)=>v===key&&i!==slot))return false;p.loadout[slot]=key;return true}
function pokemonBonuses(c){const p=c.progression;return{
 damage:1+.02*rank(p,'drive')+.03*rank(p,'ferocity')+.06*rank(p,'overpower'),
 hp:1+.02*rank(p,'resolve')+.03*rank(p,'vitality')+.06*rank(p,'enduring'),
 energy:1+.05*rank(p,'discipline'),stamina:1+.08*rank(p,'breathing')+.04*rank(p,'recovery')+.08*rank(p,'renewal'),
 dodge:1-.08*rank(p,'instinct')-.03*rank(p,'agility')-.08*rank(p,'evasionmaster'),
 defense:1-.05*rank(p,'bulwark'),walk:1+.05*rank(p,'fleetfoot'),approach:1+.20*rank(p,'pursuer'),staminaCost:1-.04*rank(p,'economy')
}}
function trainerBonuses(trainer,c){const types=c?F.DATA[c.id].types:[],average=id=>types.length?types.reduce((n,t)=>n+rank(trainer?.types?.[t],id),0)/types.length:0;return{
 xp:1+.05*rank(trainer,'bond')+.04*rank(trainer,'fieldnotes')+.08*rank(trainer,'researcher'),
 moveXP:1+.15*rank(trainer,'mentorship'),walk:1+.03*rank(trainer,'travel')+.04*rank(trainer,'trailcraft')+.05*rank(trainer,'trailblazer'),
 switch:Math.max(3,6-.4*rank(trainer,'coordination')-.3*rank(trainer,'quickrelay')-.6*rank(trainer,'relaymaster')),
 switchGuard:.8+.25*rank(trainer,'relayguard'),interact:(rank(trainer,'tracking')?80:64)+20*rank(trainer,'farwatch'),
 berry:(rank(trainer,'firstaid')?.36:.30)+.03*rank(trainer,'triage')+.06*rank(trainer,'fieldmedic'),
 energy:1+.05*average('affinity')+.04*average('recharge'),stamina:1+.06*average('balance'),
 defense:1-.03*average('resilience')-.03*average('composure')-.05*average('ward'),
 energyCost:1-.08*average('reserve')-.05*average('deepreserve'),staminaCost:1-.03*rank(trainer,'conservation'),dodge:1-.05*average('recoveryguard')
}}
function trainerMove(trainer,c,m){const ownTypes=F.DATA[c.id].types;if(!ownTypes.includes(m.type))return m;const p=trainer?.types?.[m.type];return{...m,
 power:Math.round(m.power*(1+.03*rank(p,'technique')+.03*rank(p,'channeling')+.04*rank(p,'piercing'))),
 duration:m.duration?m.duration*(1+.08*rank(p,'specialist')+.05*rank(p,'lingering')+.10*rank(p,'longlasting')):m.duration,
 energyCost:m.energyCost*(1-(m.power===0?.04*rank(p,'efficientcast'):0)),superEffectiveBonus:1+.05*rank(p,'exploitation')
}}
F.moves=function(c){if(!c.progression){c={...c};ensureCreature(c)}const bonus=pokemonBonuses(c);return rawMoves(c).map(m=>{
 if((m.weather||m.terrain)&&!m.duration)m={...m,duration:15};if(m.effect&&m.effect!=='transform'&&!m.duration)m={...m,duration:m.effect==='sleep'?2:7};
 const p=c.progression?.moves?.[m.key],potency=rank(p,'potency'),reach=rank(p,'reach'),impact=rank(p,'impact'),finisher=rank(p,'finisher'),amplification=rank(p,'amplification');
 return{...m,power:Math.round(m.power*(1+.04*potency+.03*impact+.06*finisher)),
 duration:m.duration?m.duration*(1+.05*potency+.04*impact+.08*finisher+(m.power===0?.03*rank(p,'precision')+.06*rank(p,'surehand'):0)+(m.kind==='self'?.10*reach+.08*amplification:0)):m.duration,
 range:m.range*(1+(m.kind==='self'?0:.10*reach+.08*amplification)),
 cost:Math.max(6,Number((m.cost*(1-.03*rank(p,'flow')-.03*rank(p,'efficiency')-.04*rank(p,'frugal'))*bonus.staminaCost).toFixed(1))),
 energyCost:m.energyCost*(1-.04*rank(p,'focuscast')-.06*rank(p,'lightcast')),delay:m.delay*(1-.10*rank(p,'readiness')),
 cooldown:Number((m.cooldown*(1-.03*rank(p,'mastery')-.08*rank(p,'rhythm')-.03*rank(p,'cadence')-.05*rank(p,'tempo'))).toFixed(2)),
 accuracy:m.accuracy?Math.min(100,m.accuracy+3*rank(p,'precision')):m.accuracy,bonusCrit:.02*rank(p,'precision')+.04*rank(p,'surehand'),approachDistance:210*bonus.approach
 }
})};
F.newState=(...args)=>ensureState(rawNew(...args));F.upgradeState=s=>ensureState(rawUpgrade(s));F.evolve=function(c,shards,target){ensureCreature(c);if(!rawEvolve(c,shards,target))return false;ensureCreature(c);return true};
function reveal(s,enc){ensureState(s);const first=!s.seenTypes[enc.type];s.seenTypes[enc.type]=true;if(first){s.trainer.xp+=15;s.trainer.types[enc.type].xp+=20}return first}
function visit(s,id){if(!F.REGIONS[id])return false;ensureState(s);s.visitedRegions??={campina:true};if(s.visitedRegions[id])return false;s.visitedRegions[id]=true;s.trainer.xp+=40;return true}
function rewardBattle(s,b){if(b.progressAwarded)return false;b.progressAwarded=true;if(!['win','caught'].includes(b.result))return false;ensureState(s);s.trainer.xp+=50;for(const a of b.roster.filter(a=>a.participated)){const p=ensureCreature(a.creature);p.xp+=40;const types=F.DATA[a.creature.id].types;for(const t of types)s.trainer.types[t].xp+=30/types.length;for(const [key,count] of Object.entries(a.usedMoves||{}))if(p.moves[key])p.moves[key].xp+=Math.round((15+Math.min(count,30)*10)*trainerBonuses(s.trainer,a.creature).moveXP)}return true}
function record(p,kind,enforce=true,tier=3){return p&&Number.isFinite(p.xp)&&p.xp>=0&&p.xp<=1e9&&p.nodes&&typeof p.nodes==='object'&&!Array.isArray(p.nodes)&&Object.entries(p.nodes).every(([id,v])=>TREES[kind].some(n=>n.id===id&&Number.isInteger(v)&&v>=0&&v<=n.max&&(!v||n.tier<=tier)))&&TREES[kind].every(n=>!rank(p,n.id)||!n.parent||rank(p,n.parent)>=n.need)&&(!enforce||exclusive(p,kind))&&spent(p,kind)<=(kind==='type'?(p.xp>0?1+Math.floor(p.xp/90):0):kind==='trainer'?2+Math.floor(p.xp/150):kind==='pokemon'?2+Math.floor(p.xp/80):1+Math.floor(p.xp/75))}
function validProgress(c,enforce=true){const p=c.progression;if(!p)return true;const cap=Object.keys(F.MOVE_DATA).length,legal=k=>LEARNSETS[c.id]?.includes(k)||defaultKit(c.id).includes(k);if(!record(p,'pokemon',enforce,pokemonTier(c))||!Number.isInteger(p.learnSpent)||p.learnSpent<0||p.learnSpent>cap||!Array.isArray(p.learned)||p.learned.length>cap||new Set(p.learned).size!==p.learned.length||!p.learned.every(legal)||!Array.isArray(p.loadout)||p.loadout.length<1||p.loadout.length>4||Object.keys(p.loadout).length!==p.loadout.length||!p.loadout.every(k=>p.learned.includes(k))||!p.moves||!Object.entries(p.moves).every(([k,v])=>p.learned.includes(k)&&record(v,'move',enforce,pokemonTier(c))))return false;if(!p.learned.every(k=>record(p.moves[k],'move',enforce,pokemonTier(c))))return false;if(p.ultimate&&(!F.isFinal(c)||!p.learned.includes(p.ultimate)))return false;if(p.learningFailures&&(!p.learningFailures||typeof p.learningFailures!=='object'||Array.isArray(p.learningFailures)||!Object.entries(p.learningFailures).every(([key,level])=>legal(key)&&Number.isInteger(level)&&level>=1&&level<=c.level)))return false;return new Set(LEARNSETS[c.id]||defaultKit(c.id)).size<4||new Set(p.loadout).size===p.loadout.length}
F.validState=function(s){if(!rawValid(s))return false;const enforce=s.progressionVersion>=2;if(s.trainer&&(!record(s.trainer,'trainer',enforce,experienceTier(s.trainer,'trainer'))||!s.trainer.types||!Object.entries(s.trainer.types).every(([t,p])=>typeIds.includes(t)&&record(p,'type',enforce,experienceTier(p,'type')))))return false;if(s.visitedRegions&&(!Object.keys(s.visitedRegions).every(id=>F.REGIONS[id]&&s.visitedRegions[id]===true)))return false;return s.team.every(c=>validProgress(c,enforce))};
Object.assign(F,{TREES,SKILL_PATHS:PATHS,SKILL_FORKS:FORKS,skillAccess:access,pokemonSkillTier:pokemonTier,evolutionFamily:familyInfo,skillPath:chosenPath,typeIds,skillRank:rank,skillPoints:points,skillSpent:spent,initialMoves:initialKit,ensureProgress:ensureState,ensureCreatureProgress:ensureCreature,skillTree:getTree,canBuySkill:canBuy,buySkill:buy,learnCatalog:catalog,canLearnMove:canLearn,beginLearnTrial:beginTrial,learnTrialInput:trialInput,expireLearnTrial:expireTrial,cancelLearnTrial:s=>finishTrial(s,false),learnMove:learn,equipMove:equip,pokemonBonuses,trainerBonuses,trainerMove,revealEncounter:reveal,visitRegion:visit,rewardBattle,validProgress});return F;
});
