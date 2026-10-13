(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera)})(typeof window!=='undefined'?window:globalThis,function(F){
'use strict';
const rawNew=F.newState,rawUpgrade=F.upgradeState,rawValid=F.validState,rawEnsure=F.ensureCampaign,rawReward=F.economyReward;
const districts=Object.keys(F.CITY),originalMaps=Object.values(F.MAPS).map(m=>({...m,links:[...m.links]}));
F.REGIONS.marsh.biome='pantano';F.REGIONS.crater.biome='volcán';
const definitions=[
 [1,'Kanto',[1,4,7,25],'#91ad73','Brote'],
 [2,'Johto',[152,155,158],'#89ad81','Nogal'],
 [3,'Hoenn',[252,255,258],'#68a9a1','Marea'],
 [4,'Sinnoh',[387,390,393],'#a0b4c1','Alba'],
 [5,'Teselia',[495,498,501],'#9da892','Puente'],
 [6,'Kalos',[650,653,656],'#b1a0b5','Flor'],
 [7,'Alola',[722,725,728],'#78bdb0','Palmera'],
 [8,'Galar',[810,813,816],'#879db4','Roble'],
 [9,'Paldea',[906,909,912],'#c3a881','Olivo']
];
const GENERATIONS=Object.fromEntries(definitions.map(([id,name,starters,color,home])=>[id,{id,name,starters,color,home,species:Object.values(F.DATA).filter(p=>p.generation===id).map(p=>p.id)}]));
const base=id=>id.replace(/^g\d+_/,''),genOf=region=>Number(region.match(/^g(\d+)_/)?.[1]||1),regionKey=(gen,district)=>gen===1?district:'g'+gen+'_'+district;
const preferred={campina:['normal','fairy','fighting'],forest:['grass','bug'],river:['water','dragon'],marsh:['poison','ghost','dark'],dunes:['ground','rock','fighting'],crater:['fire'],coast:['water','electric'],highlands:['psychic','electric','flying','steel','dragon'],frost:['ice','fairy']};
function mix(a,b,f=.2){const hex=x=>[1,3,5].map(i=>parseInt(x.slice(i,i+2),16));return'#'+hex(a).map((v,i)=>Math.round(v*(1-f)+hex(b)[i]*f).toString(16).padStart(2,'0')).join('')}
for(const g of Object.values(GENERATIONS)){
 if(g.id===1)continue;
 for(const[district,index]of districts.map((d,i)=>[d,i])){
  const region=regionKey(g.id,district),r=F.REGIONS[district],city=F.CITY[district];
  let species=g.species.filter(id=>F.DATA[id].types.some(t=>preferred[district].includes(t)));
  if(!species.length)species=g.species.filter(id=>!F.DATA[id].rare).slice(0,8);
  F.REGIONS[region]={...r,name:g.name+' · '+r.name,color:mix(r.color,g.color,.32),description:'Territorio de '+g.name+' generado por semilla. Sus familias Pokémon pertenecen a la generación '+g.id+'.',species};
  const typed=g.species.filter(id=>F.DATA[id].types.includes(city.type)&&!F.DATA[id].rare),pool=typed.length?typed:g.species.filter(id=>F.DATA[id].types.includes(city.type));
  F.CITY[region]={...city,name:index===0?'Villa '+g.home:g.name+' · '+city.name,leader:g.name+' · '+city.leader,team:[...new Set([pool[pool.length-1],pool[Math.floor(pool.length/2)],pool[0]])].filter(Boolean),generation:g.id};
 }
 // Cover every species, including unusual mono-types and later evolutionary relatives.
 for(const id of g.species)if(!districts.some(d=>F.REGIONS[regionKey(g.id,d)].species.includes(id)))F.REGIONS[regionKey(g.id,'campina')].species.push(id);
 for(const m of originalMaps){const region=regionKey(g.id,m.region),id=region+'-'+m.id.split('-')[1],levels=m.kind==='cave'?[m.levels[0],Math.max(m.levels[1],...F.REGIONS[region].species.map(id=>F.STAGE_LEVEL[id]||1))]:[...m.levels];F.MAPS[id]={...m,id,region,levels,name:m.kind==='town'?F.CITY[region].name:g.name+' · '+m.name,links:m.links.map(id=>'g'+g.id+'_'+id)};}
}
// Each country has tropical jungle, desert, wetland, mountain and volcanic maps.
for(const g of Object.values(GENERATIONS)){
 const forest=regionKey(g.id,'forest'),jungle=F.MAPS[forest+'-deep'];jungle.biome='selva';jungle.name=g.id===1?'Selva Umbría':g.name+' · Selva de '+g.home;
 for(const[district,name]of[['dunes','Desierto'],['crater','Volcán'],['highlands','Cordillera'],['marsh','Pantano']]){const id=regionKey(g.id,district)+'-deep';F.MAPS[id].name=(g.id===1?'':g.name+' · ')+name+' de '+g.home;}
 if([3,7].includes(g.id)){F.REGIONS[forest].biome='selva';F.REGIONS[forest].name=g.name+' · Selva Tropical';}
}
for(const g of Object.values(GENERATIONS)){
 const home=regionKey(g.id,'campina')+'-town';g.homeMap=home;g.districts=districts.map(d=>regionKey(g.id,d));g.previous=g.id>1?g.id-1:null;g.next=g.id<9?g.id+1:null;
 if(g.next){const next=regionKey(g.next,'campina')+'-town';F.MAPS[home].links.push(next);F.MAPS[next].links.push(home);}
}
function generationOfMap(id){return genOf(F.MAPS[id].region)}
// Campaña corta ("short"): 3 de 9 gimnasios abren la siguiente frontera; los demás siguen disponibles como extra. Sin ajuste = completa.
// Campaña personalizada ("custom"): el jugador elige qué regiones forman la aventura y cuántos gimnasios exige cada una (1–9).
const SHORT_NEED=3,ALL_GENS=Object.keys(GENERATIONS).map(Number);
function need(s){const j=s?.generationJourney;return j?.pace==='custom'?j.custom.need:j?.pace==='short'?SHORT_NEED:9}
// Regions that belong to the campaign (all nine unless customised), in order.
function scope(s){const j=s?.generationJourney;return j?.pace==='custom'?j.custom.gens:ALL_GENS}
// Regions that open when this one is completed: its neighbours inside the campaign.
function neighbours(s,id){const list=scope(s),i=list.indexOf(id);return i<0?[]:[list[i-1],list[i+1]].filter(Boolean)}
function sanitizeCustom(config,origin,extra=[]){const gens=[...new Set([...(Array.isArray(config?.gens)?config.gens:[]).map(Number),origin,...extra])].filter(n=>Number.isInteger(n)&&n>=1&&n<=9).sort((a,b)=>a-b),count=Math.round(Number(config?.need));return{gens,need:Number.isFinite(count)?Math.min(9,Math.max(1,count)):3}}
function progress(s,generation=generationOfMap(s.mapId)){const g=GENERATIONS[generation],completed=g.districts.filter(id=>s.badges?.[id]).length,required=Math.min(need(s),g.districts.length);return{generation,completed,total:g.districts.length,required,complete:completed>=required}}
function sync(s){if(!s.generationJourney){const origin=generationOfMap(s.mapId);s.generationJourney={version:1,origin,starter:s.team[0].id,legacy:true,unlocked:{[origin]:0},visited:{[origin]:true},completed:{},notice:null};}
 const j=s.generationJourney;for(const g of Object.values(GENERATIONS))if(progress(s,g.id).complete){j.completed[g.id]=true;for(const id of neighbours(s,g.id))if(j.unlocked[id]===undefined)j.unlocked[id]=Math.min(8,(j.unlocked[g.id]??0)+1);}
 j.visited[generationOfMap(s.mapId)]=true;return j;
}
function canAccess(s,id){return!!F.MAPS[id]&&sync(s).unlocked[generationOfMap(id)]!==undefined}
function levels(s,id=s.mapId){const m=F.MAPS[id],j=sync(s),offset=(j.unlocked[generationOfMap(id)]??0)*8;return m.levels.map(level=>m.kind==='town'?0:F.clamp(level+offset,1,100));}
function cityInfo(s,region=F.MAPS[s.mapId].region){const c=F.CITY[region],j=sync(s);return{...c,level:Math.min(100,c.level+(j.unlocked[genOf(region)]??0)*8)};}
function town(t,region){const g=GENERATIONS[genOf(region)];if(base(region)!=='campina')return t;return{...F.TOWN,name:F.CITY[region].name,buildings:F.TOWN.buildings.map(b=>({...b,roof:mix(b.roof,g.color,.22)})),points:[...F.TOWN.points,{kind:'waypoint',x:64,y:96,label:'Posta entre regiones'}]};}
function townExits(id,seed){const m=F.MAPS[id],g=GENERATIONS[genOf(m.region)],locations=[[688,16],[688,-560],[16,-560],[-688,-560],[-688,16],[-688,560],[16,560],[688,560],[688,256]];let n=0;
 return m.links.map(target=>{if(F.MAPS[target].kind==='gym')return F.gymDoor(m.region);if(generationOfMap(target)!==g.id){const destination=GENERATIONS[generationOfMap(target)];return{kind:'exit',frontier:true,key:id+':exit:'+target,target,x:destination.id<g.id?-688:688,y:416,label:'Región '+destination.name+' · generación '+destination.id};}const[x,y]=locations[n++];return{kind:'exit',key:id+':exit:'+target,target,x,y,label:F.MAPS[target].name};});
}
function canTravel(s,id){const j=sync(s),g=generationOfMap(s.mapId),m=F.MAPS[s.mapId];return!!GENERATIONS[id]&&id!==g&&j.unlocked[id]!==undefined&&(Math.abs(g-id)===1||j.visited[id]||j.pace==='custom'||j.free)&&(m.kind==='town'||m.kind==='gym'&&progress(s,g).complete);}
function travel(s,id){if(!canTravel(s,id))return false;return F.moveToMap(s,GENERATIONS[id].homeMap,null);}
function worldExits(s){return F.mapExits(s.mapId,s.seed).map(e=>e.frontier?{...e,locked:!canAccess(s,e.target),label:e.label+(!canAccess(s,e.target)?(scope(s).includes(generationOfMap(e.target))?' · frontera cerrada':' · fuera de tu campaña'):' · abierta')}:e);}
function frontierMessage(s){const p=progress(s);return 'Completa '+p.required+' gimnasios de '+GENERATIONS[p.generation].name+' para cruzar ('+Math.min(p.completed,p.required)+' / '+p.required+').';}
// Switching pace never closes a frontier that is already open.
function setPace(s,pace,config){if(!['short','full','custom'].includes(pace))return false;const j=sync(s);if(pace==='custom'){const open=Object.keys(j.unlocked).map(Number);j.custom=sanitizeCustom(config,j.origin,open);j.pace='custom'}else{delete j.custom;if(pace==='short')j.pace='short';else delete j.pace}sync(s);return true}
function hasFieldBadge(s,district){return Object.keys(s.badges||{}).some(id=>base(id)===district);}
function rivalTeam(s,region,level){const g=GENERATIONS[genOf(region)],type=F.DATA[s.generationJourney?.starter||s.team[0].id].types[0],opponent=g.starters[type==='grass'?1:type==='fire'?2:0],team=[opponent];if(level>=11){const available=g.species.filter(id=>F.DATA[id].types.includes('flying')&&!F.DATA[id].rare&&level>=(F.STAGE_LEVEL[id]||1)),bird=g.id===1?17:available.find(id=>F.DATA[id].types.includes('normal'))||available[0];if(bird)team.push(bird);}if(level>=21){const local=F.regionSpecies(region,level).find(id=>!F.DATA[id].rare&&!team.includes(id));if(local)team.push(local);}return team;}
F.newState=(seed,starter,options={})=>{const s=rawNew(seed,starter),origin=F.DATA[starter].generation||1,home=GENERATIONS[origin].homeMap;s.generationJourney={version:1,origin,starter,legacy:false,unlocked:{[origin]:0},visited:{[origin]:true},completed:{},notice:null};if(options.pace==='short')s.generationJourney.pace='short';else if(options.pace==='custom'){s.generationJourney.pace='custom';s.generationJourney.custom=sanitizeCustom(options,origin)}s.mapId=home;s.lastTown=home;s.player={...F.TOWN.spawn,dir:0};s.mapVisits={[home]:1};s.visitedMaps={[home]:true};s.visitedRegions={[regionKey(origin,'campina')]:true};s.fog={};F.discoverMap(s);return s;};
F.upgradeState=s=>{rawUpgrade(s);sync(s);return s;};F.ensureCampaign=s=>{rawEnsure(s);sync(s);return s;};
F.economyReward=(s,b)=>{const g=generationOfMap(s.mapId),before=progress(s,g).complete,r=rawReward(s,b);sync(s);if(!before&&progress(s,g).complete){s.generationJourney.notice=g;r.generationComplete=g;}return r;};
F.validState=s=>{if(!rawValid(s))return false;const j=s.generationJourney;if(!j)return true;const plain=x=>x&&typeof x==='object'&&!Array.isArray(x),number=x=>Number.isInteger(x)&&x>=1&&x<=9;if(!plain(j)||j.version!==1||!number(j.origin)||!F.DATA[j.starter]||typeof j.legacy!=='boolean'||!plain(j.unlocked)||!plain(j.visited)||!plain(j.completed)||j.unlocked[j.origin]!==0||j.unlocked[generationOfMap(s.mapId)]===undefined||j.notice!==null&&!number(j.notice)||j.pace!==undefined&&!['short','custom'].includes(j.pace)||(j.pace==='custom')!==(j.custom!==undefined))return false;if(j.custom!==undefined&&(!plain(j.custom)||!Array.isArray(j.custom.gens)||!j.custom.gens.length||j.custom.gens.some((g,i)=>!number(g)||i&&g<=j.custom.gens[i-1])||!j.custom.gens.includes(j.origin)||!Number.isInteger(j.custom.need)||j.custom.need<1||j.custom.need>9||Object.keys(j.unlocked).some(g=>!j.custom.gens.includes(Number(g)))))return false;return Object.entries(j.unlocked).every(([g,rank])=>number(Number(g))&&Number.isInteger(rank)&&rank>=0&&rank<=8)&&[j.visited,j.completed].every(record=>Object.entries(record).every(([g,v])=>number(Number(g))&&v===true));};
Object.assign(F,{campaignNeed:need,campaignScope:scope,campaignNeighbours:neighbours,setCampaignPace:setPace,GENERATIONS,districtBase:base,districtGeneration:genOf,regionKey,generationOfMap,generationProgress:progress,ensureGenerations:sync,canAccessMap:canAccess,mapLevels:levels,cityInfo,generationTown:town,generationExits:townExits,generationRivalTeam:rivalTeam,canTravelGeneration:canTravel,travelGeneration:travel,worldExits,frontierMessage,hasFieldBadge,generationColor:mix,NATIONAL_IDS:Object.keys(F.DATA).map(Number).sort((a,b)=>a-b)});return F;
});
