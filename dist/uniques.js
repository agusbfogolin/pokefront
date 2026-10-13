(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera)})(typeof window!=='undefined'?window:globalThis,function(F){
'use strict';
// Unique encounters outside the legend shrines:
//  - SPOTS: a few tiles per region hide a Pokémon that appears nowhere else. They fire when a field move is used on them.
//  - MINIS: canonical mini-events armed with a 10 % roll each time a map is entered; waves of trainer teams, then a capturable boss.
// Every failure (defeat, escape, loss or interruption) halves the odds that the same event appears again (floor 1/16).
const rawNew=F.newState,rawUpgrade=F.upgradeState,rawValid=F.validState,rawUse=F.useField,rawGrass=F.grassEncounter,rawFish=F.fishingEncounter,rawResolve=F.resolveLegendBattle,rawText=F.legendResultText;
const plain=x=>x&&typeof x==='object'&&!Array.isArray(x),decay=n=>Math.pow(.5,Math.min(n||0,4)),BASE_CHANCE=.1,SPOT_CAP=2500;
// move: field move that fires it · gen/districts: where it can happen · rate: share of eligible tiles (before failures)
const SPOTS=[
 {id:'shuckle',species:213,gen:2,move:'rock-smash',districts:['dunes','highlands','crater'],rate:.14,title:'Grieta con jugo fermentado'},
 {id:'carbink',species:703,gen:6,move:'rock-smash',districts:['frost','highlands','dunes'],rate:.14,title:'Roca de cristal'},
 {id:'dwebble',species:557,gen:5,move:'rock-smash',districts:['dunes','highlands','marsh'],rate:.14,title:'Roca de cantera'},
 {id:'glimmet',species:969,gen:9,move:'rock-smash',districts:['highlands','dunes','frost'],rate:.14,title:'Veta brillante'},
 {id:'kangaskhan',species:115,gen:1,move:'strength',districts:['campina','dunes'],rate:.12,title:'Rastro bajo la roca'},
 {id:'nosepass',species:299,gen:3,move:'strength',districts:['dunes','highlands','crater'],rate:.12,title:'Pasadizo tapado'},
 {id:'stonjourner',species:874,gen:8,move:'strength',districts:['highlands','campina','dunes'],rate:.12,title:'Círculo de piedra'},
 {id:'heracross',species:214,gen:2,move:'headbutt',districts:['forest'],rate:.1,title:'Árbol de savia dulce'},
 {id:'munchlax',species:446,gen:4,move:'headbutt',districts:['forest','highlands'],rate:.08,title:'Árbol con miel'},
 {id:'komala',species:775,gen:7,move:'headbutt',districts:['forest','campina'],rate:.08,title:'Árbol de la siesta'},
 {id:'farfetchd',species:83,gen:2,move:'cut',districts:['forest','campina'],rate:.1,title:'Arbolito del puerro'},
 {id:'scyther',species:123,gen:1,move:'cut',districts:['forest','campina'],rate:.1,title:'Maleza que oculta un claro'},
 {id:'dunsparce',species:206,gen:2,move:'flash',districts:null,rate:.35,title:'Marca solo visible con luz'},
 {id:'sableye',species:302,gen:3,move:'flash',districts:null,rate:.35,title:'Zona profunda'},
 {id:'gible',species:443,gen:4,move:'flash',districts:null,rate:.35,title:'Cueva secreta'},
 {id:'feebas',species:349,gen:3,move:'surf',districts:['river','coast','marsh'],rate:.05,title:'Agua escondida'},
 {id:'dratini',species:147,gen:1,move:'waterfall',districts:null,rate:.5,title:'Remanso de la cascada'}
];
// waves: [species list, level step]. Waves are trainer teams (never capturable); only the boss is.
const MINIS=[
 {id:'beedrill',gen:1,district:'forest',trigger:'enter',title:'Enjambre de Beedrill',intro:'¡Un enjambre de Beedrill baja del nido! Aguanta tres oleadas sin descanso.',waves:[[13,13,14],[14,14,15],[15,15,15]],boss:15,bossName:'Beedrill Reina',captureLimit:.15},
 {id:'chansey',gen:1,district:'campina',trigger:'enter',title:'Estampida de Chansey',intro:'¡Una banda de ladrones persigue a una Chansey! Detenlos antes de que alcancen su refugio.',waves:[[19,19,20],[20,52,20]],boss:242,bossName:'Blissey Guardiana',captureLimit:.2},
 {id:'tentacruel',gen:1,district:'coast',trigger:'surf',title:'Invasión de Tentacruel',intro:'¡Las aguas se agitan! Tentacool y Tentacruel rodean tu ruta.',waves:[[72,72,72],[72,73,72]],boss:73,bossName:'Tentacruel Gigante',captureLimit:.15},
 {id:'gyarados',gen:2,district:'river',trigger:'fish',title:'Gyarados rojo',intro:'¡Algo enorme muerde el anzuelo! Un Gyarados enfurecido sale del lago.',waves:[[129,129,129]],boss:130,bossName:'Gyarados Rojo',captureLimit:.15},
 {id:'zubat',gen:2,district:'highlands',trigger:'flash',kinds:['cave'],title:'Enjambre de Zubat',intro:'¡Un enjambre de Zubat sale de la cueva iluminada!',waves:[[41,41,41],[41,42,42],[42,42,42]],boss:169,bossName:'Crobat Reina',captureLimit:.2},
 {id:'poochyena',gen:3,district:'campina',trigger:'grass',title:'Manada de Poochyena',intro:'¡Una manada de Poochyena te rodea entre la hierba alta!',waves:[[261,261,261],[261,261,262]],boss:262,bossName:'Mightyena Alfa',captureLimit:.2},
 {id:'combee',gen:4,district:'forest',trigger:'headbutt',title:'Enjambre de Combee',intro:'¡Una colmena se desploma! Los Combee defienden a su reina.',waves:[[415,415,415],[415,415,415,415]],boss:416,bossName:'Vespiquen Reina',captureLimit:.2},
 {id:'starly',gen:4,district:'campina',trigger:'grass',title:'Bandada de Starly',intro:'¡Una bandada de Starly sobrevuela la hierba alta!',waves:[[396,396,397],[397,397,397]],boss:398,bossName:'Staraptor Líder',captureLimit:.2},
 {id:'venipede',gen:5,district:'marsh',trigger:'enter',title:'Plaga de Venipede',intro:'¡El pantano bulle! Los Venipede salen de la bruma.',waves:[[543,543,543],[543,544,544],[544,544,544]],boss:545,bossName:'Scolipede Gigante',captureLimit:.15},
 {id:'fletchling',gen:6,district:'campina',trigger:'enter',title:'Bandada de Fletchling',intro:'¡Una bandada de Fletchling cae en picado sobre la ruta!',waves:[[661,661,661],[661,662,662]],boss:663,bossName:'Talonflame Líder',captureLimit:.2},
 {id:'wimpod',gen:7,district:'coast',trigger:'enter',title:'Fuga de Wimpod',intro:'¡Los Wimpod huyen de la costa mientras la marea trae atacantes!',waves:[[767,767,767],[767,767,767,767]],boss:768,bossName:'Golisopod Alfa',captureLimit:.2},
 {id:'wooloo',gen:8,district:'campina',trigger:'enter',title:'Rebaño de Wooloo',intro:'¡El rebaño se dispersa y unos atacantes lo acechan!',waves:[[821,821,822],[822,822,822]],boss:832,bossName:'Dubwool Alfa',captureLimit:.2},
 {id:'tandemaus',gen:9,district:'campina',trigger:'enter',title:'Familia de Tandemaus',intro:'¡Una familia de Tandemaus aparece! Cada oleada trae más hermanos.',waves:[[924,924],[924,924,924],[924,924,924,924]],boss:925,bossName:'Maushold Alfa',captureLimit:.2}
];
const SPOT_BY_ID=Object.fromEntries(SPOTS.map(d=>[d.id,d])),MINI_BY_ID=Object.fromEntries(MINIS.map(d=>[d.id,d])),SPOT_SPECIES=new Set(SPOTS.map(d=>d.species));
// Spot species leave ordinary habitats along with their evolutionary families.
for(const d of SPOTS)for(const id of F.evolutionLine(d.species))F.LEGEND_HIDDEN.add(id);
function ensure(s){s.uniques??={version:1,spots:{},caught:{},fails:{},minis:{},armed:null,rolled:null,rolls:0,active:null};return s.uniques}
function mini(s,id){return ensure(s).minis[id]??={fails:0,captured:false,seen:0}}
const district=m=>F.districtBase(m.region),generation=m=>F.districtGeneration(m.region);
function where(s,def){const m=F.MAPS[s.mapId];if(!m||['town','gym'].includes(m.kind))return false;if(generation(m)!==def.gen)return false;if(def.districts&&!def.districts.includes(district(m)))return false;return def.move!=='flash'||m.kind==='cave'}
function ready(s){const u=ensure(s);return s.story?.phase==='done'&&!u.active&&!F.ensureLegends(s).pending&&s.team.some(c=>F.creatureHealth(c).hp>0)}
function chance(s,kind,id){const u=ensure(s);return kind==='mini'?BASE_CHANCE*decay(mini(s,id).fails):(SPOT_BY_ID[id].rate)*decay(u.fails[SPOT_BY_ID[id].species])}
function levelOf(s){const m=F.MAPS[s.mapId];return(F.mapLevels?F.mapLevels(s):m.levels)[1]}
function activate(s,kind,id,extra={}){const u=ensure(s);if(u.active)return false;const m=F.MAPS[s.mapId],level=F.clamp(levelOf(s),3,100);if(kind==='mini'){const r=mini(s,id);r.seen=Math.min(1e9,r.seen+1);u.active={kind,id,stage:'wave',wave:0,level,mapId:s.mapId,inBattle:false,queued:false,attempt:r.seen}}else u.active={kind,id,stage:'boss',wave:0,level:level+2,mapId:s.mapId,spot:extra.spot,inBattle:false,queued:false,attempt:(u.fails[SPOT_BY_ID[id].species]||0)+1};u.armed=null;return true}
// Arm each matching mini-event once per map visit; "enter" events start immediately.
function enteredMap(s){const u=ensure(s),m=F.MAPS[s.mapId],visit=s.mapVisits?.[s.mapId]||0,mark=s.mapId+':'+visit;if(u.rolled===mark)return;u.rolled=mark;u.armed=null;if(!m||['town','gym'].includes(m.kind)||!ready(s))return;for(const def of MINIS){const r=mini(s,def.id);if(r.captured||def.gen!==generation(m)||def.district!==district(m)||!(def.kinds||['route']).includes(m.kind)||F.generationProgress(s,def.gen).completed<1)continue;u.rolls++;if(F.rng(F.seedNumber(s.seed+':mini:'+def.id+':'+mark+':'+r.fails+':'+u.rolls))()>=chance(s,'mini',def.id))continue;if(def.trigger==='enter')activate(s,'mini',def.id);else u.armed={id:def.id,mapId:s.mapId};return}}
function fire(s,trigger){const u=ensure(s);if(!u.armed||u.armed.mapId!==s.mapId||!ready(s))return false;const def=MINI_BY_ID[u.armed.id];if(!def||def.trigger!==trigger)return false;return activate(s,'mini',def.id)}
function spotRoll(s,def,target){const u=ensure(s);if(u.caught[def.species]||!where(s,def)||Object.keys(u.spots).length>=SPOT_CAP)return null;const key=s.mapId+'|'+(target?target.tx+','+target.ty:'map');if(u.spots[key])return null;const seed=F.mapSeed(s.mapId,s.seed)+def.species;return F.hash(target?.tx||0,target?.ty||0,seed)<chance(s,'spot',def.id)?key:null}
// Wrap a successful field move: first a pending mini-event, otherwise a unique spot.
F.useField=(s,key,options={})=>{const probe=F.canUseField(s,key,options),result=rawUse(s,key,options);if(!result.ok)return result;ensure(s);if(fire(s,key))return{...result,message:result.message+' '+MINI_BY_ID[s.uniques.active.id].intro};if(!ready(s))return result;for(const def of SPOTS){if(def.move!==key)continue;const spot=spotRoll(s,def,probe.target);if(!spot)continue;s.uniques.spots[spot]=true;activate(s,'spot',def.id,{spot});return{...result,message:result.message+' ¡Algo se mueve en la '+def.title.toLowerCase()+'!'}}return result};
F.grassEncounter=(s,tile)=>{if(fire(s,'grass'))return null;return rawGrass(s,tile)};
F.fishingEncounter=(s,key)=>{const cast=rawFish(s,key);if(cast&&fire(s,'fish'))return null;return cast};
for(const name of ['moveToMap','enterMap','travelTo']){const raw=F[name];F[name]=function(s,...args){const from=s.mapId,result=raw(s,...args);if(result&&from!==s.mapId)enteredMap(s);return result}}
function creature(def,s,level,seed,boss){const c=F.makeCreature(def,F.clamp(level,1,100),F.seedNumber(seed));if(boss)c.iv=c.iv.map((v,i)=>Math.max(v,26+(F.seedNumber(seed+':'+i)%6)));return c}
function encounter(s){const u=ensure(s),a=u.active;if(!a||!plain(a))return null;const m=F.MAPS[a.mapId],biome=m.biome||F.REGIONS[m.region].biome,common={mapId:a.mapId,region:m.region,biome,uniqueId:a.kind+':'+a.id};
 if(a.kind==='mini'&&a.stage==='wave'){const def=MINI_BY_ID[a.id],ids=def.waves[a.wave],level=a.level+1+a.wave*2,team=ids.map((n,i)=>creature(n,s,level-(ids.length-1-i)+Math.min(i,1),s.seed+':'+a.id+':'+a.attempt+':'+a.wave+':'+i));return{...common,key:'trainer:unique:'+a.id+':'+a.wave,kind:'trainer',leader:def.title+' · oleada '+(a.wave+1)+' / '+def.waves.length,gymName:def.title,team,creature:team[0],uniqueStage:'wave'}}
 if(a.kind==='mini'){const def=MINI_BY_ID[a.id],c=creature(def.boss,s,a.level+6,s.seed+':'+a.id+':boss',true);return{...common,key:'unique:boss:'+a.id,kind:'wild',transient:true,boss:true,noMaster:true,captureLimit:def.captureLimit,title:def.bossName,type:F.DATA[def.boss].types[0],creature:c,x:s.player.x,y:s.player.y,uniqueStage:'boss'}}
 const def=SPOT_BY_ID[a.id];return{...common,key:'unique:spot:'+a.id+':'+a.attempt,kind:'wild',transient:true,captureLimit:.3,title:def.title,type:F.DATA[def.species].types[0],creature:creature(def.species,s,a.level,s.seed+':spot:'+a.id+':'+a.attempt),x:s.player.x,y:s.player.y,uniqueStage:'boss'}}
// The game loop asks for the next encounter whenever nothing else is happening.
function queued(s){const u=ensure(s),a=u.active;if(!a||a.inBattle||a.queued||F.MAPS[s.mapId]?.kind==='town'||s.mapId!==a.mapId)return null;const enc=encounter(s);if(!enc)return null;a.queued=true;const message=a.kind==='mini'?(a.stage==='wave'?(a.wave?MINI_BY_ID[a.id].title+' · oleada '+(a.wave+1)+' / '+MINI_BY_ID[a.id].waves.length:MINI_BY_ID[a.id].intro):'¡'+MINI_BY_ID[a.id].bossName+' aparece! Solo ahora puedes capturarlo.'):'¡'+F.DATA[SPOT_BY_ID[a.id].species].name+' sale de su escondite!';return{encounter:enc,message}}
function abort(s){ensure(s).active=null}
function begin(s,enc){const a=ensure(s).active;if(!enc?.uniqueId||!a||a.inBattle||enc.uniqueId!==a.kind+':'+a.id)return false;a.inBattle=true;a.queued=true;return true}
function fail(s,kind,id){const u=ensure(s);if(kind==='mini')mini(s,id).fails=Math.min(99,mini(s,id).fails+1);else{const species=SPOT_BY_ID[id].species;u.fails[species]=Math.min(99,(u.fails[species]||0)+1)}u.active=null}
function resolve(s,b){const enc=b?.encounter;if(!enc?.uniqueId||!b.result||b.uniqueCommitted)return false;b.uniqueCommitted=true;const u=ensure(s),a=u.active;if(!a||enc.uniqueId!==a.kind+':'+a.id)return false;if(a.stage==='wave'){if(b.result==='win'){a.wave++;a.inBattle=false;a.queued=false;if(a.wave>=MINI_BY_ID[a.id].waves.length)a.stage='boss'}else fail(s,a.kind,a.id);return true}
 if(b.result==='caught'){if(a.kind==='mini')mini(s,a.id).captured=true;else u.caught[SPOT_BY_ID[a.id].species]=true;u.active=null}else fail(s,a.kind,a.id);return true}
F.resolveLegendBattle=(s,b)=>{const first=rawResolve(s,b),second=resolve(s,b);return first||second};
function resultText(s,b){const enc=b?.encounter;if(!enc?.uniqueId)return rawText(s,b);const[kind,id]=enc.uniqueId.split(':'),u=ensure(s),def=kind==='mini'?MINI_BY_ID[id]:SPOT_BY_ID[id];if(!def)return null;const species=kind==='mini'?def.boss:def.species,name=F.DATA[species].name;
 if(b.result==='caught')return{eyebrow:'EVENTO COMPLETADO',title:(kind==='mini'?def.bossName:name)+' se une a ti.',copy:kind==='mini'?'Es un ejemplar especial: solo este evento lo ofrece.':'Solo se encuentra así. Este escondite ya no volverá a aparecer.'};
 if(enc.uniqueStage==='wave'&&b.result==='win'){const a=u.active;return{eyebrow:'OLEADA SUPERADA',title:def.title+' · '+(a?.stage==='boss'?'¡llega el jefe!':'sigue la siguiente oleada'),copy:'Tus PS no se restauran entre oleadas. Pulsa continuar para seguir.'}}
 return{eyebrow:'EVENTO FALLIDO',title:b.result==='win'?'Se escapó entre la maleza.':'Tu equipo vuelve a la ciudad.',copy:'Cada fallo reduce a la mitad la probabilidad de que '+(kind==='mini'?def.title.toLowerCase():'este escondite')+' vuelva a aparecer. Ahora: '+(kind==='mini'?Math.round(chance(s,'mini',id)*1000)/10+' % al entrar en la zona.':Math.round(decay(u.fails[def.species])*100)+' % de las casillas del escondite original.')}}
F.legendResultText=resultText;
const LABEL={campina:'campiña',forest:'bosque',river:'ribera',marsh:'pantano',dunes:'dunas',crater:'cráter',coast:'costa',highlands:'altos',frost:'nieve'};
function rows(s){const u=ensure(s);return[...SPOTS.map(d=>({kind:'spot',id:d.id,generation:d.gen,title:d.title,species:d.species,captured:!!u.caught[d.species],fails:u.fails[d.species]||0,chance:decay(u.fails[d.species]),how:'Usa '+(F.FIELD_MOVES[d.move]?.name||d.move)+' en '+F.GENERATIONS[d.gen].name+(d.districts?' · '+d.districts.map(x=>LABEL[x]).join(', '):d.move==='flash'?' · cuevas':' · cascadas')})),...MINIS.map(d=>({kind:'mini',id:d.id,generation:d.gen,title:d.title,species:d.boss,captured:!!mini(s,d.id).captured,fails:mini(s,d.id).fails,chance:BASE_CHANCE*decay(mini(s,d.id).fails),how:d.intro}))]}
F.newState=(...a)=>{const s=rawNew(...a);ensure(s);return s};
F.upgradeState=s=>{rawUpgrade(s);const u=ensure(s);if(u.active?.inBattle){const a=u.active;fail(s,a.kind,a.id)}else if(u.active)u.active.queued=false;for(const c of s.team){const d=SPOTS.find(x=>x.species===c.id);if(d)u.caught[d.species]=true}return s};
function valid(s){const u=s.uniques;if(u===undefined)return true;if(!plain(u)||u.version!==1||!plain(u.spots)||!plain(u.caught)||!plain(u.fails)||!plain(u.minis)||Object.keys(u.spots).length>SPOT_CAP+8||!Number.isInteger(u.rolls)||u.rolls<0||u.rolls>1e9)return false;
 if(!Object.entries(u.spots).every(([k,v])=>v===true&&/^[\w-]+\|(map|-?\d+,-?\d+)$/.test(k)&&F.MAPS[k.split('|')[0]]))return false;
 if(!Object.entries(u.caught).every(([id,v])=>v===true&&(SPOT_SPECIES.has(Number(id))||MINI_BY_ID[id])))return false;
 if(!Object.entries(u.fails).every(([id,n])=>SPOT_SPECIES.has(Number(id))&&Number.isInteger(n)&&n>=0&&n<=99))return false;
 if(!Object.entries(u.minis).every(([id,r])=>MINI_BY_ID[id]&&plain(r)&&Number.isInteger(r.fails)&&r.fails>=0&&r.fails<=99&&typeof r.captured==='boolean'&&Number.isInteger(r.seen)&&r.seen>=0&&r.seen<=1e9))return false;
 if(u.armed!==null&&(!plain(u.armed)||!MINI_BY_ID[u.armed.id]||!F.MAPS[u.armed.mapId]))return false;if(u.rolled!==null&&typeof u.rolled!=='string')return false;
 const a=u.active;if(a===null)return true;if(!plain(a)||!['mini','spot'].includes(a.kind)||!(a.kind==='mini'?MINI_BY_ID[a.id]:SPOT_BY_ID[a.id])||!['wave','boss'].includes(a.stage)||!F.MAPS[a.mapId]||!Number.isInteger(a.wave)||a.wave<0||a.wave>8||!Number.isInteger(a.level)||a.level<1||a.level>100||!Number.isInteger(a.attempt)||a.attempt<1)return false;
 if(a.kind==='mini'&&a.stage==='wave'&&a.wave>=MINI_BY_ID[a.id].waves.length)return false;return true}
F.validState=s=>rawValid(s)&&valid(s);
Object.assign(F,{UNIQUE_SPOTS:SPOTS,UNIQUE_MINIS:MINIS,ensureUniques:ensure,uniqueRows:rows,uniqueQueued:queued,uniqueEncounter:encounter,beginUniqueBattle:begin,uniqueAbort:abort,uniqueChance:chance,uniqueMini:mini,uniqueEntered:enteredMap});
return F;
});
