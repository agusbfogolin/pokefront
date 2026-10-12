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
const LEGENDS=Object.fromEntries(rows.map(line=>{const[idText,district,title,mode,badgeText]=line.split('|'),id=Number(idText),generation=F.DATA[id].generation,region=F.regionKey(generation,district),other=district==='forest'?'river':district==='crater'?'dunes':district==='frost'?'highlands':district==='coast'?'river':district==='highlands'?'coast':district==='marsh'?'forest':district==='dunes'?'highlands':'forest';return[id,{id,generation,district,title,mode,badges:Number(badgeText),level:Number(badgeText)===9?65:Number(badgeText)===7?55:Number(badgeText)===5?45:35,region,shrine:region+'-cave',clueMaps:[region+'-route',F.regionKey(generation,other)+'-deep'],story:stories[district],tokens:tokens[district],color:F.TYPE[F.DATA[id].types[0]][1]}]}));
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x),geometry=new Map();
function ensure(s){s.legends??={version:1,tracked:null,records:{},pending:null};return s.legends}
function record(s,id){return ensure(s).records[id]??={clues:[false,false],solved:false,captured:false,attempts:0,retryVisit:0,lastResult:null}}
function puzzle(s,id){const e=LEGENDS[id],r=F.rng(F.seedNumber(s.seed+':ritual:'+id)),order=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(r()*(i+1));[order[i],order[j]]=[order[j],order[i]];}const target=[1+Math.floor(r()*4),1+Math.floor(r()*4),1+Math.floor(r()*4)],initial=target.map((v,i)=>(v+1+i)%5);const walls=[];for(let y=0;y<5;y++)for(let x=0;x<5;x++)if(x!==0&&y!==4&&r()<.45)walls.push(y*5+x);return{mode:e.mode,order,target,initial,walls,start:0,exit:24};}
function status(s,id){const e=LEGENDS[id],p=record(s,id),local=F.generationProgress(s,e.generation),accessible=F.ensureGenerations(s).unlocked[e.generation]!==undefined;const cooldown=(s.mapVisits[e.shrine]||0)<p.retryVisit;let reason=p.captured?'Encuentro completado':!accessible?'Abre la frontera de '+F.GENERATIONS[e.generation].name:local.completed<e.badges?'Consigue '+e.badges+' medallas en '+F.GENERATIONS[e.generation].name:!p.clues.every(Boolean)?'Encuentra las dos pistas':!p.solved?'Resuelve la prueba del santuario':cooldown?'Sal de esta cueva y vuelve a entrar':ensure(s).pending?'Termina el encuentro en curso':'Santuario preparado';return{...p,accessible,medals:local.completed,ready:accessible&&local.completed>=e.badges&&p.clues.every(Boolean)&&p.solved&&!p.captured&&!cooldown&&!ensure(s).pending,cooldown,reason};}
// Place objectives in connected clearings, away from people, loot and exits.
function allObjects(id,seed){const key=id+':'+seed;if(geometry.has(key))return geometry.get(key);const m=F.MAPS[id];if(!m||['gym','town'].includes(m.kind))return[];const planned=[];for(const e of Object.values(LEGENDS)){if(e.shrine===id)planned.push({eventId:e.id,role:'shrine',clue:-1});e.clueMaps.forEach((map,clue)=>{if(map===id)planned.push({eventId:e.id,role:'clue',clue});});}if(!planned.length)return[];const layout=F.mapLayout(id,seed),used=[...(F.cardSites?.(id,seed)||[]),...F.mapLoot(id,seed),...F.mapPeople({mapId:id,seed}),...F.mapExits(id,seed)],out=[];for(const obj of planned){const start=F.seedNumber(id+':'+obj.eventId+':'+obj.role)%layout.rooms.length;let point=null;for(let n=0;n<layout.rooms.length&&!point;n++){const room=layout.rooms[(start+n)%layout.rooms.length];for(let ring=0;ring<=2&&!point;ring++)for(let dy=-ring;dy<=ring&&!point;dy++)for(let dx=-ring;dx<=ring&&!point;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==ring)continue;const x=(room.x+dx)*32+16,y=(room.y+dy)*32+16;if(F.mapWalkable(id,x,y,seed)&&used.every(p=>Math.hypot(p.x-x,p.y-y)>=58)){point={x,y};used.push(point);}}}if(!point)throw Error('No reachable legendary objective: '+id);const e=LEGENDS[obj.eventId];out.push({...obj,...point,kind:'legend',key:'legend:'+e.id+':'+obj.role+':'+obj.clue,mapId:id,label:(obj.role==='shrine'?'Santuario · ':'Inscripción · ')+e.title,color:e.color});}geometry.set(key,out);if(geometry.size>150)geometry.delete(geometry.keys().next().value);return out;}
function objects(s){ensure(s);return allObjects(s.mapId,s.seed).filter(o=>{const p=record(s,o.eventId);return!p.captured&&(o.role!=='clue'||!p.clues[o.clue])}).map(o=>({...o,locked:F.generationProgress(s,LEGENDS[o.eventId].generation).completed<LEGENDS[o.eventId].badges}));}
function point(s,id,role,clue=-1){const e=LEGENDS[id],map=role==='shrine'?e.shrine:e.clueMaps[clue];return allObjects(map,s.seed).find(o=>o.eventId===Number(id)&&o.role===role&&o.clue===clue);}
function near(s,o){const real=o&&point(s,o.eventId,o.role,o.clue);return!!real&&real.mapId===s.mapId&&Math.hypot(real.x-s.player.x,real.y-s.player.y)<=F.trainerBonuses(s.trainer,s.team[s.active]).interact;}
function collect(s,o){if(!o||o.role!=='clue'||!near(s,o))return false;const e=LEGENDS[o.eventId],p=record(s,o.eventId);if(p.captured||p.clues[o.clue]||F.generationProgress(s,e.generation).completed<e.badges)return false;p.clues[o.clue]=true;ensure(s).tracked=e.id;return true;}
function canRitual(s,id){const e=LEGENDS[id];if(!e)return false;const p=status(s,id);return p.accessible&&p.medals>=e.badges&&p.clues.every(Boolean)&&!p.captured&&!p.cooldown&&!ensure(s).pending&&near(s,point(s,id,'shrine'));}
function solve(s,id,answer){if(!canRitual(s,id))return false;const q=puzzle(s,id);let ok=false;if(q.mode==='order')ok=Array.isArray(answer)&&answer.length===4&&answer.every((v,i)=>v===q.order[i]);else if(q.mode==='balance')ok=Array.isArray(answer)&&answer.length===3&&answer.every((v,i)=>v===q.target[i]);else if(Array.isArray(answer)&&answer.length>1&&answer.length<=50&&answer[0]===0&&answer.at(-1)===24){ok=answer.every((v,i)=>Number.isInteger(v)&&v>=0&&v<25&&!q.walls.includes(v)&&(i===0||Math.abs(v-answer[i-1])===5||Math.floor(v/5)===Math.floor(answer[i-1]/5)&&Math.abs(v-answer[i-1])===1));}if(ok)record(s,id).solved=true;return ok;}
function encounter(s,id){const e=LEGENDS[id];if(!e||!status(s,id).ready||!near(s,point(s,id,'shrine')))return null;const offset=(s.generationJourney.unlocked[e.generation]||0)*8,c=F.makeCreature(e.id,F.clamp(e.level+offset,1,100),F.seedNumber(s.seed+':legend-individual:'+id));return{kind:'legendary',legendId:e.id,key:'legend:'+id,creature:c,type:F.DATA[id].types[0],region:e.region,mapId:e.shrine,biome:F.MAPS[e.shrine].biome||F.REGIONS[e.region].biome,captureLimit:.2,title:e.title};}
function begin(s,enc){if(!enc?.legendId||ensure(s).pending||!encounter(s,enc.legendId)||enc.key!=='legend:'+enc.legendId)return false;const e=LEGENDS[enc.legendId],p=record(s,e.id);p.attempts=Math.min(1e9,p.attempts+1);s.legends.pending={id:e.id,visit:s.mapVisits[e.shrine]||1};return true;}
function resolve(s,b){const id=b?.encounter?.legendId;if(!id||!b.result||b.legendCommitted)return false;b.legendCommitted=true;const p=record(s,id),e=LEGENDS[id];p.lastResult=b.result;if(b.result==='caught'){p.captured=true;p.retryVisit=0;}else p.retryVisit=(s.mapVisits[e.shrine]||1)+1;ensure(s).pending=null;return true;}
function objective(s){const id=ensure(s).tracked;if(!id||!LEGENDS[id])return null;const p=status(s,id),e=LEGENDS[id];if(p.captured)return{event:e,message:'Leyenda completada'};if(!p.accessible||p.medals<e.badges)return{event:e,message:p.reason};const clue=p.clues.findIndex(v=>!v),o=point(s,id,clue<0?'shrine':'clue',clue);return{event:e,point:o,message:p.cooldown?p.reason:clue<0?'Ve al santuario':'Encuentra la pista '+(clue+1)+' / 2'};}
// Only event encounters supply rare species; ordinary trainers and fishing cannot bypass them.
const rawPool=F.regionSpecies,rawNew=F.newState,rawUpgrade=F.upgradeState,rawValid=F.validState;
F.regionSpecies=(...a)=>rawPool(...a).filter(id=>!LEGENDS[id]);
F.newState=(...a)=>{const s=rawNew(...a);ensure(s);return s;};
F.upgradeState=s=>{rawUpgrade(s);const j=ensure(s);for(const c of s.team)if(LEGENDS[c.id])record(s,c.id).captured=true;if(j.pending){const e=LEGENDS[j.pending.id],p=record(s,e.id);p.retryVisit=Math.max(p.retryVisit,(s.mapVisits[e.shrine]||j.pending.visit)+1);p.lastResult='interrupted';j.pending=null;}return s;};
F.validState=s=>{if(!rawValid(s))return false;if(s.legends===undefined)return true;const j=s.legends;if(!plain(j)||j.version!==1||j.tracked!==null&&!LEGENDS[j.tracked]||!plain(j.records)||Object.keys(j.records).length>rows.length)return false;if(j.pending!==null&&(!plain(j.pending)||!LEGENDS[j.pending.id]||!Number.isInteger(j.pending.visit)||j.pending.visit<1||j.pending.visit>1e9))return false;return Object.entries(j.records).every(([id,p])=>LEGENDS[id]&&plain(p)&&Array.isArray(p.clues)&&p.clues.length===2&&p.clues.every(v=>typeof v==='boolean')&&typeof p.solved==='boolean'&&typeof p.captured==='boolean'&&[p.attempts,p.retryVisit].every(v=>Number.isInteger(v)&&v>=0&&v<=1e9)&&[null,'win','caught','loss','escaped','interrupted'].includes(p.lastResult));};
Object.assign(F,{LEGENDS,ensureLegends:ensure,legendRecord:record,legendStatus:status,legendPuzzle:puzzle,legendObjects:objects,allLegendObjects:allObjects,legendPoint:point,collectLegendClue:collect,canLegendRitual:canRitual,solveLegendRitual:solve,legendEncounter:encounter,beginLegendBattle:begin,resolveLegendBattle:resolve,legendObjective:objective});return F;
});
