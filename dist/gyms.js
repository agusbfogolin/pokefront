(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera)})(typeof window!=='undefined'?window:globalThis,function(F){
'use strict';
const cache=new Map(),regions=Object.keys(F.CITY);
const THEMES={
 campina:{name:'Cantera de Brote',motif:'stone',floor:'#c9b995',wall:'#68776b',light:'#adb49b',accent:'#d6b869',trainers:['Aprendiz Lito','Exploradora Mara','Montañero Nico'],teams:[[74],[138],[75]]},
 forest:{name:'Jardín de las Raíces',motif:'garden',floor:'#bac899',wall:'#416854',light:'#8aaa75',accent:'#d2de8f',trainers:['Jardinera Iris','Guardabosques Tilo','Botánica Alba'],teams:[[43],[69],[44,46]]},
 river:{name:'Galería de las Mareas',motif:'water',floor:'#bad8d5',wall:'#4c7589',light:'#8db3be',accent:'#73c3cf',trainers:['Nadadora Coral','Pescador Remo','Nadadora Marina'],teams:[[60],[54],[61,90]]},
 marsh:{name:'Invernadero de Bruma',motif:'pipes',floor:'#c6b7cd',wall:'#665573',light:'#9c8aa8',accent:'#c39bd3',trainers:['Investigadora Nila','Técnico Gaspar','Exploradora Malva'],teams:[[23],[88],[24,109]]},
 dunes:{name:'Ruinas de Ocre',motif:'ruins',floor:'#dfc99d',wall:'#8c7053',light:'#c1a475',accent:'#ecd289',trainers:['Arqueóloga Ada','Montañero Damián','Guardián Cairo'],teams:[[27],[50],[104,111]]},
 crater:{name:'Forja de las Brasas',motif:'forge',floor:'#beaa96',wall:'#624e49',light:'#9f8171',accent:'#ed9b61',trainers:['Fogonera Eva','Herrero León','Domador Ciro'],teams:[[37],[58],[77,126]]},
 coast:{name:'Central del Faro',motif:'electric',floor:'#d8d4ae',wall:'#69776d',light:'#abb99a',accent:'#efe083',trainers:['Técnica Chispa','Operador Volt','Ingeniera Luz'],teams:[[100],[81],[25,125]]},
 highlands:{name:'Templo de los Espejos',motif:'mirrors',floor:'#d6c4dd',wall:'#6f638b',light:'#ab9ac0',accent:'#e0b5dc',trainers:['Mentalista Cora','Ilusionista Teo','Médium Celeste'],teams:[[96],[63],[64,122]]},
 frost:{name:'Palacio de Cristal',motif:'crystal',floor:'#d9e9e7',wall:'#668796',light:'#a2c3cd',accent:'#b9eff0',trainers:['Patinadora Neve','Explorador Polar','Guardiana Elsa'],teams:[[87],[91],[87,124]]}
};
for(const region of regions)if(!THEMES[region]){const theme=THEMES[F.districtBase(region)],g=F.GENERATIONS[F.districtGeneration(region)],type=F.CITY[region].type,pool=g.species.filter(id=>F.DATA[id].types.includes(type)&&!F.DATA[id].rare);THEMES[region]={...theme,name:g.name+' · '+theme.name,floor:F.generationColor(theme.floor,g.color,.18),wall:F.generationColor(theme.wall,g.color,.22),light:F.generationColor(theme.light,g.color,.22),teams:[[pool[0]],[pool[Math.min(1,pool.length-1)]],[pool[Math.min(2,pool.length-1)],pool[Math.min(3,pool.length-1)]]],trainers:theme.trainers.map(n=>g.name+' · '+n)};}
for(const region of regions){const city=F.CITY[region],id=region+'-gym';F.MAPS[id]={id,region,kind:'gym',name:'Gimnasio '+city.badge+' · '+THEMES[region].name,levels:[Math.max(5,city.level-6),city.level],bounds:{left:-480,right:480,top:-512,bottom:512},links:[region+'-town']};F.MAPS[region+'-town'].links.push(id)}
const point=(x,y)=>({x:x*32+16,y:y*32+16}),key=(region,i)=>'trainer:'+region+'-gym:'+i;
function layout(id,seed){const cacheKey=id+':'+seed;if(cache.has(cacheKey))return cache.get(cacheKey);const region=F.MAPS[id].region,r=F.rng(F.seedNumber(seed+':gym:'+region)),index=regions.indexOf(region),sign=r()<.5?-1:1,cells=new Set(),path=[];
 const carve=(x,y)=>{if(x>=-14&&x<=13&&y>=-15&&y<=14)cells.add(x+','+y)};
 const room=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)carve(x,y)};
 const line=(a,b)=>{for(let y=Math.min(a.y,b.y);y<=Math.max(a.y,b.y);y++)for(let x=Math.min(a.x,b.x);x<=Math.max(a.x,b.x);x++)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)carve(x+dx,y+dy);path.push([a.x,a.y,b.x,b.y])};
 const gates=[7,0,-7].map((y,i)=>({x:(i%2?-sign:sign)*(7+(index+i)%3),y,index:i,key:key(region,i)}));
 room(-3,11,3,14);let from={x:0,y:13};
 for(const [i,g]of gates.entries()){
  const startY=from.y,turnY=g.y+3,turnX=-Math.sign(g.x)*(4+(index+i)%3);
  const points=[from,{x:turnX,y:startY},{x:turnX,y:turnY},{x:g.x,y:turnY},{x:g.x,y:g.y-2}];
  for(let n=1;n<points.length;n++)line(points[n-1],points[n]);
  // A short dead end rewards reading the route rather than following a straight hall.
  line({x:turnX,y:turnY},{x:turnX-Math.sign(g.x)*(2+(index+i)%4),y:turnY});
  from={x:g.x,y:g.y-2};
 }
 line(from,{x:from.x,y:-12});line({x:from.x,y:-12},{x:0,y:-12});room(-4,-14,4,-11);
 // Every partition has exactly one three-tile opening, controlled by its trainer.
 for(const g of gates)for(let x=-14;x<=13;x++){cells.delete(x+','+g.y);if(Math.abs(x-g.x)<=1)carve(x,g.y)}
 const people=gates.map((g,i)=>({kind:'trainer',gymTrial:true,trialIndex:i,key:g.key,label:THEMES[region].trainers[i],...point(g.x,g.y+2),dir:0,sight:128}));
 people.push({kind:'gym',key:'gym:'+region,label:F.CITY[region].leader,...point(0,-12),dir:0},{kind:'gym-guide',key:'guide:'+id,label:'Guía del gimnasio',...point(-2,13),dir:0});
 const out={cells,gates,people,path,spawn:{...point(0,12),dir:4},leader:point(0,-12),exits:[{kind:'exit',key:id+':exit:'+region+'-town',target:region+'-town',...point(0,14),label:'Salir a '+F.CITY[region].name}],landmarks:[]};cache.set(cacheKey,out);if(cache.size>90)cache.delete(cache.keys().next().value);return out;
}
function progress(s,region=F.MAPS[s.mapId].region){const completed=[0,1,2].filter(i=>s.trainerWins?.[key(region,i)]>0).length,legacy=!!s.badges?.[region];return{completed,total:3,ready:completed===3||legacy,legacy}}
function tile(id,x,y,seed){const m=F.MAPS[id],g=layout(id,seed),open=g.cells.has(x+','+y),boundary=x< -15||x>14||y< -16||y>15;return{ground:open?'gym-floor':'gym-wall',block:!open,boundary,landmark:!open,biome:F.REGIONS[m.region].biome,region:m.region,gym:true,detail:F.hash(x,y,F.mapSeed(id,seed)),motif:THEMES[m.region].motif,gate:g.gates.find(a=>a.y===y&&Math.abs(x-a.x)<=1)?.index,carpet:open&&(y<=-11||y>=11)}}
function stateTile(s,x,y){const t=tile(s.mapId,x,y,s.seed);if(t.gate!==undefined){const p=progress(s),open=p.legacy||s.trainerWins[key(F.MAPS[s.mapId].region,t.gate)]>0;return{...t,ground:'gym-gate',gateOpen:open,block:!open,landmark:true,obstacle:open?null:'gym-gate'}}return t}
function walkable(s,x,y){return[-8,8].every(dx=>[-7,7].every(dy=>!stateTile(s,Math.floor((x+dx)/32),Math.floor((y+dy)/32)).block))}
function relocate(s){if(walkable(s,s.player.x,s.player.y))return s;const tx=Math.floor(s.player.x/32),ty=Math.floor(s.player.y/32);for(let radius=0;radius<=30;radius++)for(let y=ty-radius;y<=ty+radius;y++)for(let x=tx-radius;x<=tx+radius;x++)if(Math.max(Math.abs(x-tx),Math.abs(y-ty))===radius&&walkable(s,x*32+16,y*32+16)){s.player={...point(x,y),dir:0};return s}s.player={...layout(s.mapId,s.seed).spawn};return s}
function town(t,region){return{...t,buildings:t.buildings.map(b=>({...b,region,gymType:b.id==='gym'?F.CITY[region].type:null})),points:t.points.filter(p=>p.kind!=='gym')}}
function door(region){return{kind:'exit',key:region+'-town:exit:'+region+'-gym',target:region+'-gym',x:224,y:-64,label:'Entrar al gimnasio '+F.CITY[region].badge}}
function encounter(s,p){const region=F.MAPS[s.mapId].region,city=F.cityInfo?F.cityInfo(s,region):F.CITY[region],i=p.trialIndex,ids=THEMES[region].teams[i],level=Math.max(5,city.level-6+i*2),team=ids.map((id,n)=>F.makeCreature(id,level,F.seedNumber(s.seed+':'+p.key+':'+n)));return{kind:'trainer',key:p.key,leader:p.label,gymTrial:true,trialIndex:i,region,mapId:s.mapId,team,creature:team[0],biome:'gym'}}
function canChallenge(s,enc){if(enc.kind!=='gym')return{ok:true};const m=F.MAPS[s.mapId];if(m.kind!=='gym'||enc.gymId!==m.region)return{ok:false,message:'Entra al gimnasio para desafiar a su líder.'};const p=progress(s);return p.ready?{ok:true}:{ok:false,message:'Vence primero los tres duelos del gimnasio ('+p.completed+' / 3).'}}
Object.assign(F,{GYM_THEMES:THEMES,gymLayout:layout,gymTile:tile,gymStateTile:stateTile,gymProgress:progress,gymPeople:(id,seed)=>layout(id,seed).people,gymTown:town,gymDoor:door,gymEncounter:encounter,canChallengeGym:canChallenge,gymRelocate:relocate});return F;
});
