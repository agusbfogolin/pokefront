(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera)})(typeof window!=='undefined'?window:globalThis,function(F){
'use strict';
// These are original Frontera quests, not reconstructions of the official games.
// id | district | title | ritual (order / balance / maze) | local badges
const rows=`
144|frost|El canto del glaciar|order|3
145|coast|La central silenciosa|balance|3
146|crater|El corazón del volcán|maze|3
150|highlands|El laboratorio sellado|balance|9
151|forest|La huella invisible|maze|9
243|highlands|Las huellas de la tormenta|balance|3
244|crater|Las cenizas que caminan|maze|3
245|river|El agua que vuelve a brillar|order|3
249|coast|Las campanas del abismo|order|7
250|highlands|Las plumas del arcoíris|order|7
251|forest|El bosque fuera del tiempo|maze|9
377|dunes|La escritura de piedra|order|5
378|frost|La escritura de hielo|order|5
379|highlands|La escritura de acero|order|5
380|river|El vuelo escarlata|maze|5
381|coast|El vuelo del horizonte|maze|5
382|coast|La marea ancestral|balance|7
383|crater|La grieta del continente|balance|7
384|highlands|El ascenso al cielo|maze|9
385|campina|El deseo de la estrella|order|9
386|dunes|El meteorito dividido|balance|9
480|river|El lago del conocimiento|order|3
481|marsh|El lago de las emociones|maze|3
482|coast|El lago de la voluntad|balance|3
483|highlands|El reloj de la cumbre|order|7
484|river|Las puertas del espacio|maze|7
485|crater|El horno bajo la montaña|balance|5
486|dunes|El despertar del coloso|order|7
487|marsh|El espejo del otro mundo|maze|9
488|coast|El sendero de la luna|maze|7
489|river|Las pequeñas mareas|balance|3
490|coast|El templo de las mareas|order|7
491|marsh|La isla de las pesadillas|maze|9
492|forest|El jardín agradecido|balance|7
493|highlands|El origen de las runas|order|9
494|campina|La llama de la victoria|balance|5
638|highlands|El juramento de acero|order|5
639|dunes|El juramento de piedra|maze|5
640|forest|El juramento del bosque|order|5
641|coast|Los molinos detenidos|maze|5
642|highlands|La tormenta cautiva|balance|5
643|crater|La antorcha de la verdad|order|7
644|coast|La bobina de los ideales|balance|7
645|dunes|La tierra que despierta|balance|7
646|frost|El vacío bajo el hielo|maze|9
647|river|La espada del manantial|maze|7
648|campina|La melodía olvidada|order|7
649|marsh|El archivo del insecto|balance|9
716|forest|Las raíces de la vida|balance|7
717|marsh|Las alas del crepúsculo|maze|7
718|dunes|El equilibrio de la frontera|balance|9
719|frost|La corona de cristal|order|5
720|highlands|Los anillos del umbral|maze|9
721|crater|La presión del vapor|balance|7
772|campina|El expediente sin nombre|order|3
773|highlands|El vínculo de los recuerdos|balance|7
785|coast|El guardián de las chispas|balance|3
786|marsh|El guardián de las luces|maze|3
787|forest|El guardián de las raíces|order|3
788|river|El guardián de la bruma|order|3
789|highlands|La pequeña nube estelar|maze|3
790|frost|El núcleo de las estrellas|balance|5
791|crater|El altar del sol|order|7
792|coast|El altar de la luna|order|7
800|highlands|La luz fragmentada|balance|9
801|campina|El mecanismo del corazón|balance|7
802|marsh|El desafío de la sombra|maze|7
807|coast|La carrera del relámpago|maze|7
808|dunes|Las piezas que se atraen|balance|3
809|highlands|El yunque de metal vivo|order|7
888|forest|La espada del bosque|maze|7
889|highlands|El escudo de la cumbre|order|7
890|crater|El núcleo de la noche roja|balance|9
891|river|La primera torre del valor|maze|3
892|highlands|La última torre del valor|maze|7
893|forest|La llamada de la selva|maze|7
894|coast|Las runas del voltaje|balance|5
895|dunes|Las runas del dragón|order|5
896|frost|La cosecha del hielo|maze|5
897|marsh|La cosecha de la sombra|maze|5
898|forest|La corona del invierno|order|9
905|river|El regreso de la primavera|balance|7
1001|forest|Las tablillas del pantano|order|5
1002|frost|La espada bajo la nieve|maze|5
1003|dunes|El recipiente del desierto|balance|5
1004|crater|Las cuentas de las brasas|order|5
1007|highlands|El eco de la era antigua|maze|9
1008|coast|El eco de la era futura|balance|9
1014|dunes|El pacto de la fuerza|maze|7
1015|marsh|El pacto del ingenio|balance|7
1016|coast|El pacto del encanto|order|7
1017|forest|Las máscaras del santuario|order|7
1024|frost|El prisma de las profundidades|balance|9
1025|marsh|El fruto del silencio|maze|9
`.trim().split('\n');
const tokens={frost:['Nieve','Hielo','Cristal','Deshielo'],coast:['Brisa','Chispa','Trueno','Calma'],crater:['Ceniza','Brasa','Llama','Sol'],forest:['Semilla','Raíz','Hoja','Flor'],river:['Gota','Arroyo','Río','Mar'],marsh:['Niebla','Sombra','Sueño','Alba'],dunes:['Grano','Duna','Roca','Montaña'],highlands:['Eco','Viento','Nube','Estrella'],campina:['Pulso','Paso','Canto','Vínculo']};
const stories={frost:'Un canto queda atrapado en el hielo. Dos inscripciones indican cómo despertar el santuario sin quebrarlo.',coast:'Una señal atraviesa la costa cuando el mar y el cielo se encuentran. Las balizas conservan las dos mitades del mensaje.',crater:'Las brasas dibujan símbolos bajo la ceniza. Sigue las marcas hasta la cámara donde todavía late el volcán.',forest:'Algo antiguo observa entre las raíces. Dos rastros del bosque revelan el camino hasta su refugio.',river:'El manantial lleva un mensaje que solo se entiende río arriba. Reúne sus dos fragmentos antes de entrar al templo.',marsh:'La bruma oculta un umbral y una promesa. Las inscripciones permiten cruzarlo sin perderse entre las sombras.',dunes:'La arena ha enterrado una historia. Dos vestigios de las ruinas conservan la clave de la cámara sellada.',highlands:'En la cumbre, un mecanismo antiguo espera una respuesta. Dos señales en los caminos explican cómo activarlo.',campina:'Un rumor recorre la región desde hace generaciones. Dos recuerdos olvidados conducen a un santuario escondido.'};
// Ultra Beasts (Alola) and Paradox Pokémon (Paldea): same shrine engine, no wild habitat.
const extraRows=`
793|marsh|La grieta que susurra|maze|5|ultra
794|dunes|El pulso del coloso|balance|5|ultra
795|campina|La visitante elegante|order|5|ultra
796|coast|El cable sin fin|order|7|ultra
797|highlands|La torre que flota|balance|7|ultra
798|forest|La hoja que corta|maze|7|ultra
799|crater|La boca sin fondo|balance|9|ultra
803|river|La semilla del portal|order|7|ultra
805|frost|El muro que se apila|maze|7|ultra
806|marsh|El payaso de las chispas|order|9|ultra
984|dunes|El colmillo olvidado|order|7|paradox
985|campina|El grito del pasado|maze|7|paradox
986|marsh|El gorro del bosque antiguo|balance|7|paradox
987|marsh|La melena fantasma|order|9|paradox
988|forest|El ala arcaica|maze|7|paradox
989|coast|La descarga arcaica|balance|7|paradox
1005|crater|El rugido de la luna|maze|9|paradox
1009|river|La estela del pasado|balance|9|paradox
1020|crater|La llama del abismo antiguo|order|9|paradox
1021|highlands|El rayo salvaje|maze|9|paradox
990|dunes|Las ruedas del mañana|balance|7|paradox
991|frost|El fardo de hielo futuro|order|7|paradox
992|highlands|Las manos de hierro|maze|7|paradox
993|forest|El cuello de metal|balance|7|paradox
994|campina|La polilla de acero|order|7|paradox
995|marsh|Las espinas del futuro|maze|7|paradox
1006|coast|El valiente de hierro|order|9|paradox
1010|forest|Las hojas de hierro|balance|9|paradox
1022|dunes|La roca del mañana|maze|9|paradox
1023|highlands|La corona de hierro|order|9|paradox
`.trim().split('\n');
const modes=['order','balance','maze'],districtOfType={fire:'crater',water:'river',grass:'forest',electric:'coast'},starterIds=Object.values(F.GENERATIONS).flatMap(g=>g.starters);
// Starters the player did not choose return as events once half the badges are earned.
const starterRows=starterIds.map((id,i)=>id+'|'+(districtOfType[F.DATA[id].types[0]]||'campina')+'|La promesa de '+F.DATA[id].name+'|'+modes[i%3]+'|0|starter');
const CATEGORY_STORY={ultra:'Una grieta entre mundos deja pasar a una criatura que no pertenece a esta región. Dos señales muestran cómo cerrar el portal sin que se la lleve.',paradox:'Algo de otra era cruza una grieta del tiempo. Dos huellas anacrónicas explican cómo mantener abierto el umbral lo bastante para enfrentarlo.',starter:'Un compañero que no elegiste sigue esperando en su región. Ahora que tu viaje demostró fuerza, su rastro vuelve a aparecer.'};
const HALF_BADGES=Math.ceil(Object.keys(F.CITY).length/2);
// Badge requirements scale with the campaign pace (short: 3 of 9 per region).
const required=(s,e)=>Math.min(e.badges,Math.ceil(e.badges*F.campaignNeed(s)/9)),halfBadges=s=>Math.max(1,Math.ceil(F.campaignScope(s).length*F.campaignNeed(s)/2));
const LEGENDS=Object.fromEntries([...rows.map(l=>l+'|legend'),...extraRows,...starterRows].map(line=>{const[idText,district,title,mode,badgeText,category]=line.split('|'),id=Number(idText),generation=F.DATA[id].generation,region=F.regionKey(generation,district),other=district==='forest'?'river':district==='crater'?'dunes':district==='frost'?'highlands':district==='coast'?'river':district==='highlands'?'coast':district==='marsh'?'forest':district==='dunes'?'highlands':'forest',badges=Number(badgeText);return[id,{id,generation,district,title,mode,category,gate:category==='starter'?'half':null,badges,level:category==='starter'?40:badges===9?65:badges===7?55:badges===5?45:35,region,shrine:region+'-cave',clueMaps:[region+'-route',F.regionKey(generation,other)+'-deep'],story:CATEGORY_STORY[category]||stories[district],tokens:tokens[district],color:F.TYPE[F.DATA[id].types[0]][1]}]}));
// Species that never roam freely: every event species, Naganadel (evolution of Poipole) and each starter family.
const lineOf=id=>{const out=new Set([id]),queue=[id];while(queue.length){const x=queue.pop();for(const e of F.evolutionOptions({id:x}))if(!out.has(e.target)){out.add(e.target);queue.push(e.target)}}let grew=true;while(grew){grew=false;for(const p of Object.keys(F.DATA).map(Number))if(!out.has(p)&&F.evolutionOptions({id:p}).some(e=>out.has(e.target))){out.add(p);grew=true}}return out;};
const HIDDEN=new Set([804]);for(const id of starterIds)for(const x of lineOf(id))HIDDEN.add(x);
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x),geometry=new Map();
function ensure(s){s.legends??={version:1,tracked:null,records:{},pending:null};return s.legends}
function record(s,id){return ensure(s).records[id]??={clues:[false,false],solved:false,captured:false,attempts:0,retryVisit:0,lastResult:null,fails:0,lost:false}}
function puzzle(s,id){const e=LEGENDS[id],r=F.rng(F.seedNumber(s.seed+':ritual:'+id)),order=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]];}const target=[1+Math.floor(r()*4),1+Math.floor(r()*4),1+Math.floor(r()*4)],initial=target.map((v,i)=>(v+1+i)%5);const walls=[];for(let y=0;y<5;y++)for(let x=0;x<5;x++)if(x!==0&&y!==4&&r()<.45)walls.push(y*5+x);return{mode:e.mode,order,target,initial,walls,start:0,exit:24};}
const totalBadges=s=>Object.values(s.badges||{}).filter(Boolean).length,chosenStarter=(s,e)=>e.category==='starter'&&s.generationJourney?.starter===e.id;
// Gate shown to the player: local badges, plus 50 % of every badge for returning starters.
function gate(s,e){const local=F.generationProgress(s,e.generation);if(chosenStarter(s,e))return'Es tu compañero inicial';if(F.ensureGenerations(s).unlocked[e.generation]===undefined)return'Abre la frontera de '+F.GENERATIONS[e.generation].name;if(e.gate==='half'&&totalBadges(s)<halfBadges(s))return'Reúne '+halfBadges(s)+' medallas en total ('+totalBadges(s)+' / '+halfBadges(s)+')';if(local.completed<required(s,e))return'Consigue '+required(s,e)+' medallas en '+F.GENERATIONS[e.generation].name;return''}
// Every failure halves the odds that an event comes back (never below 1/16). Legends instead get one second chance.
function chance(s,id){const e=LEGENDS[id],p=record(s,id);return e.category==='legend'?1:Math.pow(.5,Math.min(p.fails,4))}
function appears(s,id){const p=record(s,id),c=chance(s,id);if(c>=1)return true;return F.rng(F.seedNumber(s.seed+':reappear:'+id+':'+p.fails+':'+(s.mapVisits[LEGENDS[id].shrine]||0)))()<c}
function status(s,id){const e=LEGENDS[id],p=record(s,id),local=F.generationProgress(s,e.generation),accessible=F.ensureGenerations(s).unlocked[e.generation]!==undefined,blocked=gate(s,e),cooldown=(s.mapVisits[e.shrine]||0)<p.retryVisit,fading=!cooldown&&p.fails>0&&!p.captured&&!p.lost&&!appears(s,id),lastChance=e.category==='legend'&&p.fails===1&&!p.captured&&!p.lost;let reason=p.captured?'Encuentro completado':p.lost?'Se marchó para siempre':blocked?blocked:!p.clues.every(Boolean)?'Encuentra las dos pistas':!p.solved?'Resuelve la prueba del santuario':cooldown?'Sal de esta cueva y vuelve a entrar':fading?'El rastro se enfrió ('+Math.round(chance(s,id)*100)+' % de reaparecer). Sal y vuelve a entrar':ensure(s).pending?'Termina el encuentro en curso':lastChance?'Última oportunidad':'Santuario preparado';return{...p,accessible,medals:local.completed,required:required(s,e),halfRequired:halfBadges(s),blocked,chance:chance(s,id),lastChance,ready:!blocked&&p.clues.every(Boolean)&&p.solved&&!p.captured&&!p.lost&&!cooldown&&!fading&&!ensure(s).pending,cooldown,fading,reason};}
// Place objectives in connected clearings, away from people, loot and exits.
function allObjects(id,seed){const key=id+':'+seed;if(geometry.has(key))return geometry.get(key);const m=F.MAPS[id];if(!m||['gym','town'].includes(m.kind))return[];const planned=[];for(const e of Object.values(LEGENDS)){if(e.shrine===id)planned.push({eventId:e.id,role:'shrine',clue:-1});e.clueMaps.forEach((map,clue)=>{if(map===id)planned.push({eventId:e.id,role:'clue',clue});});}if(!planned.length)return[];const layout=F.mapLayout(id,seed),used=[...(F.cardSites?.(id,seed)||[]),...F.mapLoot(id,seed),...F.mapPeople({mapId:id,seed}),...F.mapExits(id,seed)],out=[];for(const obj of planned){const start=F.seedNumber(id+':'+obj.eventId+':'+obj.role)%layout.rooms.length;let point=null;for(let n=0;n<layout.rooms.length&&!point;n++){const room=layout.rooms[(start+n)%layout.rooms.length];for(let ring=0;ring<=2&&!point;ring++)for(let dy=-ring;dy<=ring&&!point;dy++)for(let dx=-ring;dx<=ring&&!point;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==ring)continue;const x=(room.x+dx)*32+16,y=(room.y+dy)*32+16;if(F.mapWalkable(id,x,y,seed)&&used.every(p=>Math.hypot(p.x-x,p.y-y)>=58)){point={x,y};used.push(point);}}}if(!point)throw Error('No reachable legendary objective: '+id);const e=LEGENDS[obj.eventId];out.push({...obj,...point,kind:'legend',key:'legend:'+e.id+':'+obj.role+':'+obj.clue,mapId:id,label:(obj.role==='shrine'?'Santuario · ':'Inscripción · ')+e.title,color:e.color});}geometry.set(key,out);if(geometry.size>150)geometry.delete(geometry.keys().next().value);return out;}
function objects(s){ensure(s);return allObjects(s.mapId,s.seed).filter(o=>{const p=record(s,o.eventId);return!p.captured&&!p.lost&&!chosenStarter(s,LEGENDS[o.eventId])&&(o.role!=='clue'||!p.clues[o.clue])}).map(o=>({...o,locked:!!gate(s,LEGENDS[o.eventId])}));}
function point(s,id,role,clue=-1){const e=LEGENDS[id],map=role==='shrine'?e.shrine:e.clueMaps[clue];return allObjects(map,s.seed).find(o=>o.eventId===Number(id)&&o.role===role&&o.clue===clue);}
function near(s,o){const real=o&&point(s,o.eventId,o.role,o.clue);return!!real&&real.mapId===s.mapId&&Math.hypot(real.x-s.player.x,real.y-s.player.y)<=F.trainerBonuses(s.trainer,s.team[s.active]).interact;}
function collect(s,o){if(!o||o.role!=='clue'||!near(s,o))return false;const e=LEGENDS[o.eventId],p=record(s,o.eventId);if(p.captured||p.lost||p.clues[o.clue]||gate(s,e))return false;p.clues[o.clue]=true;ensure(s).tracked=e.id;return true;}
function canRitual(s,id){const e=LEGENDS[id];if(!e)return false;const p=status(s,id);return!p.blocked&&p.clues.every(Boolean)&&!p.captured&&!p.lost&&!p.cooldown&&!p.fading&&!ensure(s).pending&&near(s,point(s,id,'shrine'));}
function solve(s,id,answer){if(!canRitual(s,id))return false;const q=puzzle(s,id);let ok=false;if(q.mode==='order')ok=Array.isArray(answer)&&answer.length===4&&answer.every((v,i)=>v===q.order[i]);else if(q.mode==='balance')ok=Array.isArray(answer)&&answer.length===3&&answer.every((v,i)=>v===q.target[i]);else if(Array.isArray(answer)&&answer.length>1&&answer.length<=50&&answer[0]===0&&answer.at(-1)===24){ok=answer.every((v,i)=>Number.isInteger(v)&&v>=0&&v<25&&!q.walls.includes(v)&&(i===0||Math.abs(v-answer[i-1])===5||Math.floor(v/5)===Math.floor(answer[i-1]/5)&&Math.abs(v-answer[i-1])===1));}if(ok)record(s,id).solved=true;return ok;}
function encounter(s,id){const e=LEGENDS[id];if(!e||!status(s,id).ready||!near(s,point(s,id,'shrine')))return null;const offset=(s.generationJourney.unlocked[e.generation]||0)*8,c=F.makeCreature(e.id,F.clamp(e.level+offset,1,100),F.seedNumber(s.seed+':legend-individual:'+id));return{kind:'legendary',category:e.category,legendId:e.id,key:'legend:'+id,creature:c,type:F.DATA[id].types[0],region:e.region,mapId:e.shrine,biome:F.MAPS[e.shrine].biome||F.REGIONS[e.region].biome,captureLimit:.2,title:e.title};}
function begin(s,enc){if(!enc?.legendId||ensure(s).pending||!encounter(s,enc.legendId)||enc.key!=='legend:'+enc.legendId)return false;const e=LEGENDS[enc.legendId],p=record(s,e.id);p.attempts=Math.min(1e9,p.attempts+1);s.legends.pending={id:e.id,visit:s.mapVisits[e.shrine]||1};return true;}
// A defeated, escaped, lost or interrupted encounter is a failure: legends get one more chance, other events halve their odds.
function failure(s,id,result){const p=record(s,id),e=LEGENDS[id];p.lastResult=result;p.fails=Math.min(99,p.fails+1);p.retryVisit=(s.mapVisits[e.shrine]||1)+1;if(e.category==='legend'&&p.fails>=2)p.lost=true;}
function resolve(s,b){const id=b?.encounter?.legendId;if(!id||!LEGENDS[id]||!b.result||b.legendCommitted)return false;b.legendCommitted=true;const p=record(s,id);if(b.result==='caught'){p.lastResult='caught';p.captured=true;p.retryVisit=0;}else failure(s,id,b.result);ensure(s).pending=null;return true;}
function resultText(s,b){const id=b?.encounter?.legendId;if(!id||!LEGENDS[id])return null;const e=LEGENDS[id],p=record(s,id),pct=Math.round(chance(s,id)*100);if(b.result==='caught')return{eyebrow:e.category==='legend'?'LEYENDA CAPTURADA':'EVENTO COMPLETADO',title:F.DATA[id].name+' se une a ti.',copy:'Este evento queda completado en el diario.'};const name=F.DATA[id].name;if(p.lost)return{eyebrow:'LEYENDA PERDIDA',title:name+' desapareció.',copy:'Era su segunda oportunidad. No volverá a aparecer en esta partida.'};if(e.category==='legend')return{eyebrow:'ÚLTIMA OPORTUNIDAD',title:b.result==='win'?name+' se retira.':'Tu equipo vuelve a la ciudad.',copy:'Tienes una segunda oportunidad: sal de la cueva y vuelve a entrar. Si fallas otra vez, se perderá para siempre.'};return{eyebrow:'ENCUENTRO FALLIDO',title:b.result==='win'?name+' se retira.':'Tu equipo vuelve a la ciudad.',copy:'Su rastro se debilita: al volver a la cueva solo tendrá un '+pct+' % de probabilidad de reaparecer. Conservas pistas y prueba.'};}
function objective(s){const id=ensure(s).tracked;if(!id||!LEGENDS[id])return null;const p=status(s,id),e=LEGENDS[id];if(p.captured)return{event:e,message:'Leyenda completada'};if(p.lost)return{event:e,message:p.reason};if(p.blocked)return{event:e,message:p.reason};const clue=p.clues.findIndex(v=>!v),o=point(s,id,clue<0?'shrine':'clue',clue);return{event:e,point:o,message:p.cooldown||p.fading?p.reason:clue<0?'Ve al santuario':'Encuentra la pista '+(clue+1)+' / 2'};}
// Only event encounters supply rare species; ordinary trainers and fishing cannot bypass them.
const rawPool=F.regionSpecies,rawNew=F.newState,rawUpgrade=F.upgradeState,rawValid=F.validState,rawRegions=F.speciesRegions;
F.regionSpecies=(...a)=>rawPool(...a).filter(id=>!LEGENDS[id]&&!HIDDEN.has(id));
F.speciesRegions=id=>LEGENDS[id]||HIDDEN.has(Number(id))?[{id:'event',name:'Solo por evento'}]:rawRegions(id);
F.newState=(...a)=>{const s=rawNew(...a);ensure(s);return s;};
F.upgradeState=s=>{rawUpgrade(s);const j=ensure(s);for(const[id,p]of Object.entries(j.records)){p.fails=Number.isInteger(p.fails)?p.fails:0;p.lost=p.lost===true;}for(const c of s.team)if(LEGENDS[c.id]&&!chosenStarter(s,LEGENDS[c.id]))record(s,c.id).captured=true;if(j.pending){const e=LEGENDS[j.pending.id];failure(s,e.id,'interrupted');j.pending=null;}return s;};
F.validState=s=>{if(!rawValid(s))return false;if(s.legends===undefined)return true;const j=s.legends;if(!plain(j)||j.version!==1||j.tracked!==null&&!LEGENDS[j.tracked]||!plain(j.records)||Object.keys(j.records).length>Object.keys(LEGENDS).length)return false;if(j.pending!==null&&(!plain(j.pending)||!LEGENDS[j.pending.id]||!Number.isInteger(j.pending.visit)||j.pending.visit<1||j.pending.visit>1e9))return false;return Object.entries(j.records).every(([id,p])=>LEGENDS[id]&&plain(p)&&Array.isArray(p.clues)&&p.clues.length===2&&p.clues.every(v=>typeof v==='boolean')&&typeof p.solved==='boolean'&&typeof p.captured==='boolean'&&[p.attempts,p.retryVisit].every(v=>Number.isInteger(v)&&v>=0&&v<=1e9)&&(p.fails===undefined||Number.isInteger(p.fails)&&p.fails>=0&&p.fails<=99)&&(p.lost===undefined||typeof p.lost==='boolean')&&[null,'win','caught','loss','escaped','interrupted'].includes(p.lastResult));};
Object.assign(F,{LEGENDS,LEGEND_HIDDEN:HIDDEN,evolutionLine:lineOf,HALF_BADGES,legendHalfBadges:halfBadges,legendRequiredBadges:required,totalBadges,chosenStarter,legendGate:gate,legendChance:chance,legendResultText:resultText,ensureLegends:ensure,legendRecord:record,legendStatus:status,legendPuzzle:puzzle,legendObjects:objects,allLegendObjects:allObjects,legendPoint:point,collectLegendClue:collect,canLegendRitual:canRitual,solveLegendRitual:solve,legendEncounter:encounter,beginLegendBattle:begin,resolveLegendBattle:resolve,legendObjective:objective});return F;
});
