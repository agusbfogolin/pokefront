(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Frontera,root.FIELD_MOVE_DATA)})(typeof window!=='undefined'?window:globalThis,function(F,DATA){
'use strict';
const rawNew=F.newState,rawUpgrade=F.upgradeState,rawValid=F.validState,fallsCache=new Map();
const FIELD={
 cut:{badge:'forest',description:'Corta los árboles pequeños marcados y abre un paso.'},
 fly:{badge:'coast',description:'Vuela desde el exterior a una ciudad que ya hayas visitado.'},
 surf:{badge:'river',description:'Entra al agua desde la orilla. Desembarcas al volver a tierra.'},
 strength:{badge:'dunes',description:'Empuja una roca pesada una casilla hacia un espacio libre.'},
 flash:{badge:'campina',description:'Ilumina la cueva hasta que salgas de ella.'},
 'rock-smash':{badge:'marsh',description:'Rompe rocas agrietadas y conserva el paso abierto.'},
 waterfall:{badge:'crater',description:'Sube o baja una cascada mientras usas Surf.'},
 dig:{badge:null,description:'Regresa desde una cueva a su entrada exterior.'},
 teleport:{badge:null,description:'Desde el exterior, vuelve al último centro donde descansaste.'}
};
for(const[key,value]of Object.entries(FIELD))Object.assign(value,DATA[key],{key});
const tileKey=(x,y)=>x+','+y,plain=o=>o&&typeof o==='object'&&!Array.isArray(o);
function ensure(s){s.field??={version:1,maps:{},surfing:null,flash:null,lastCenter:s.lastTown||'campina-town'};return s.field}
function record(s){return ensure(s).maps[s.mapId]??={cleared:{},boulders:{}}}
function supports(c,key){return!!c&&!!FIELD[key]?.species.includes(c.id)}
function user(s,key){return[s.team[s.active],...s.team.filter((_,i)=>i!==s.active)].find(c=>supports(c,key))||null}
function access(s,key){const move=FIELD[key];if(!move)return{ok:false,reason:'Técnica desconocida'};if(move.badge&&!(F.hasFieldBadge?F.hasFieldBadge(s,move.badge):s.badges[move.badge]))return{ok:false,reason:'Medalla '+F.CITY[move.badge].badge+' · '+F.CITY[move.badge].name};const c=user(s,key);return c?{ok:true,user:c,reason:F.DATA[c.id].name}:{ok:false,reason:'Necesitas un Pokémon compatible en tu equipo'}}
function baseTile(id,x,y,seed){const raw=F.mapTile(id,x,y,seed),t={...raw};if(t.boundary||t.landmark)return t;
 if(['tree','pine','palm'].includes(t.obstacle)&&t.detail>.7)t.fieldMove='cut';
 else if(['boulder','basalt'].includes(t.obstacle))t.fieldMove=F.hash(x,y,F.mapSeed(id,seed)+219)>.5?'strength':'rock-smash';
 return t;
}
// Waterfalls occupy water only, away from bridges; the original trail graph stays open.
function falls(id,seed){const key=id+':'+seed;if(fallsCache.has(key))return fallsCache.get(key);const m=F.MAPS[id],candidates=[];
 if(m.kind!=='town'&&['river','marsh','coast'].includes(F.districtBase?.(m.region)||m.region))for(let y=-21;y<=20;y++)for(let x=-30;x<=29;x++){
  const tiles=[-1,0,1].map(dy=>F.mapTile(id,x,y+dy,seed));
  if(tiles.every(t=>t.ground==='water'&&!t.obstacle&&!t.landmark)&&![-1,0,1].some(dx=>[-1,0,1].some(dy=>F.mapTile(id,x+dx,y+dy,seed).ground==='bridge')))candidates.push({tx:x,ty:y,score:F.hash(x,y,F.mapSeed(id,seed)+403)});
 }
 candidates.sort((a,b)=>b.score-a.score);const chosen=candidates.slice(0,1);fallsCache.set(key,chosen);if(fallsCache.size>100)fallsCache.delete(fallsCache.keys().next().value);return chosen;
}
function tile(s,x,y){if(F.MAPS[s.mapId].kind==='gym')return F.gymStateTile(s,x,y);const t=baseTile(s.mapId,x,y,s.seed),f=ensure(s),r=f.maps[s.mapId],k=tileKey(x,y);if(t.boundary||t.landmark)return t;
 if(r?.cleared[k]||r?.boulders[k]){t.obstacle=null;t.tree=false;t.fieldMove=null;t.block=['water','lava','ice','wall'].includes(t.ground);t.deco='pebbles'}
 for(const[origin,p]of Object.entries(r?.boulders||{}))if(p.x===x&&p.y===y){t.obstacle='boulder';t.tree=false;t.block=true;t.fieldMove='strength';t.origin=origin}
 if(t.ground==='water'&&!t.obstacle){t.block=!(f.surfing&&f.surfing.mapId===s.mapId);if(falls(s.mapId,s.seed).some(p=>p.tx===x&&p.ty===y)){t.ground='waterfall';t.fieldMove='waterfall';t.block=true}}
 return t;
}
function walkable(s,x,y){return[-8,8].every(dx=>[-7,7].every(dy=>!tile(s,Math.floor((x+dx)/32),Math.floor((y+dy)/32)).block&&!F.mapBlocked(s.mapId,x+dx,y+dy)))}
function nearest(s,key){const f=ensure(s),px=Math.floor(s.player.x/32),py=Math.floor(s.player.y/32),targets=[];
 for(let y=py-2;y<=py+2;y++)for(let x=px-2;x<=px+2;x++){const t=tile(s,x,y);let move=t.fieldMove;
  if(t.ground==='water'&&!t.obstacle&&!f.surfing)move='surf';
  if(!move||key&&key!==move)continue;const tx=x*32+16,ty=y*32+16,distance=Math.hypot(tx-s.player.x,ty-s.player.y);
  if(distance<64)targets.push({kind:'field',key:'field:'+s.mapId+':'+tileKey(x,y),move,label:FIELD[move].name,tx:x,ty:y,x:tx,y:ty,distance});
 }
 targets.sort((a,b)=>a.distance-b.distance);return targets[0]||null;
}
function target(s,key,wanted){if(!wanted)return nearest(s,key);if(wanted.kind!=='field'||wanted.move!==key||!Number.isInteger(wanted.tx)||!Number.isInteger(wanted.ty))return null;const t=tile(s,wanted.tx,wanted.ty),actual=t.fieldMove||(t.ground==='water'&&!t.obstacle&&!ensure(s).surfing?'surf':null);return actual===key&&Math.hypot(wanted.tx*32+16-s.player.x,wanted.ty*32+16-s.player.y)<64?{...wanted,x:wanted.tx*32+16,y:wanted.ty*32+16}:null}
function destinations(s){return Object.keys(F.CITY).map(id=>id+'-town').filter(id=>s.visitedMaps[id]&&id!==s.mapId)}
function canUse(s,key,options={}){
 if(options.battle)return{ok:false,reason:'Solo fuera de combate'};
 const allowed=access(s,key);if(!allowed.ok)return allowed;const m=F.MAPS[s.mapId],f=ensure(s);if(m.kind==='gym')return{ok:false,reason:'Sal del gimnasio para usar técnicas de campo'};
 if(key==='fly'){if(m.kind==='cave')return{ok:false,reason:'Sal de la cueva para usar Vuelo'};if(!destinations(s).length)return{ok:false,reason:'Visita otra ciudad para poder volar'};if(options.destination&&!destinations(s).includes(options.destination))return{ok:false,reason:'Elige una ciudad visitada'};return{...allowed,chooseDestination:!options.destination}}
 if(key==='teleport')return m.kind==='cave'?{ok:false,reason:'Teletransporte requiere estar al aire libre'}:allowed;
 if(key==='dig')return m.kind==='cave'?allowed:{ok:false,reason:'Excavar se usa dentro de una cueva'};
 if(key==='flash')return m.kind!=='cave'?{ok:false,reason:'Destello se usa dentro de una cueva'}:f.flash===s.mapId?{ok:false,reason:'La cueva ya está iluminada'}:allowed;
 if(key==='surf'&&f.surfing)return{ok:false,reason:'Ya estás usando Surf'};
 const p=target(s,key,options.target);if(!p)return{ok:false,reason:{cut:'Acércate a un árbol pequeño',surf:'Acércate a la orilla',strength:'Acércate a una roca pesada','rock-smash':'Acércate a una roca agrietada',waterfall:'Acércate a una cascada'}[key]};
 if(key==='strength'||key==='waterfall'){
  const dx=p.tx-Math.floor(s.player.x/32),dy=p.ty-Math.floor(s.player.y/32);
  if(Math.abs(dx)+Math.abs(dy)!==1)return{ok:false,reason:'Colócate junto al obstáculo, a una casilla'};
  if(key==='strength'){
   const x=p.tx+dx,y=p.ty+dy,t=tile(s,x,y),occupied=[...F.mapPeople(s),...F.mapExits(s.mapId,s.seed),...F.mapLoot(s.mapId,s.seed).filter(o=>!s.collected[o.key])].some(o=>Math.floor(o.x/32)===x&&Math.floor(o.y/32)===y);
   if(t.block||occupied||F.mapBlocked(s.mapId,x*32+16,y*32+16))return{ok:false,reason:'La roca necesita una casilla libre delante'};
   return{...allowed,target:p,push:{x,y}};
  }
  if(!f.surfing)return{ok:false,reason:'Primero debes usar Surf'};
  if(dx!==0)return{ok:false,reason:'Sube o baja por delante de la cascada'};
  const landing={x:p.x,y:(p.ty+dy)*32+16},t=tile(s,p.tx,p.ty+dy);
  if(t.ground!=='water'||!walkable(s,landing.x,landing.y))return{ok:false,reason:'No hay agua libre al otro lado'};
  return{...allowed,target:p,landing};
 }
 return{...allowed,target:p};
}
function use(s,key,options={}){const check=canUse(s,key,options);if(!check.ok)return check;if(check.chooseDestination)return{ok:false,reason:'Elige una ciudad visitada'};const f=ensure(s),p=check.target,c=check.user;
 if(key==='cut'||key==='rock-smash')record(s).cleared[tileKey(p.tx,p.ty)]=true;
 if(key==='strength'){const r=record(s),origin=tile(s,p.tx,p.ty).origin||tileKey(p.tx,p.ty);r.boulders[origin]=check.push}
 if(key==='surf'){
  f.surfing={mapId:s.mapId,uid:c.uid};if(!walkable(s,p.x,p.y)){f.surfing=null;return{ok:false,reason:'No puedes entrar al agua aquí'}}s.player.x=p.x;s.player.y=p.y;
 }
 if(key==='waterfall'){s.player.x=check.landing.x;s.player.y=check.landing.y}
 if(key==='flash')f.flash=s.mapId;
 if(key==='fly')F.moveToMap(s,options.destination,null);
 if(key==='dig'){const from=s.mapId,to=F.MAPS[from].links.find(id=>F.MAPS[id].kind!=='cave');F.moveToMap(s,to,from)}
 if(key==='teleport'){F.moveToMap(s,f.lastCenter,null);s.player={x:0,y:240,dir:0}}
 F.discoverMap(s);return{ok:true,user:c,move:key,message:F.DATA[c.id].name+' usó '+FIELD[key].name+'.'};
}
function step(s){const f=ensure(s);if(!f.surfing)return;const dry=[-8,8].every(dx=>[-7,7].every(dy=>!['water','waterfall'].includes(tile(s,Math.floor((s.player.x+dx)/32),Math.floor((s.player.y+dy)/32)).ground)));if(dry){f.surfing=null;return true}return false}
function visitCenter(s){if(F.MAPS[s.mapId].kind==='town'){ensure(s).lastCenter=s.mapId;F.healTeam(s)}}
function dark(s){return F.MAPS[s.mapId].kind==='cave'&&ensure(s).flash!==s.mapId}
// Travel resets temporary traversal modes; opened paths and moved rocks persist.
for(const name of ['moveToMap','enterMap','travelTo']){const raw=F[name];F[name]=function(s,...args){const from=s.mapId,result=raw(s,...args);if(result&&from!==s.mapId){const f=ensure(s);f.surfing=null;f.flash=null}return result}}
function valid(s){const f=s.field;if(!f)return true;if(!plain(f)||f.version!==1||!plain(f.maps)||Object.keys(f.maps).length>Object.keys(F.MAPS).length||F.MAPS[f.lastCenter]?.kind!=='town'||!s.visitedMaps[f.lastCenter]||f.flash!==null&&(f.flash!==s.mapId||F.MAPS[s.mapId].kind!=='cave'))return false;
 if(f.surfing!==null&&(!plain(f.surfing)||f.surfing.mapId!==s.mapId||!(F.hasFieldBadge?F.hasFieldBadge(s,'river'):s.badges.river)||!s.team.some(c=>c.uid===f.surfing.uid&&supports(c,'surf'))))return false;
 for(const[id,r]of Object.entries(f.maps)){
  if(!F.MAPS[id]||!plain(r)||!plain(r.cleared)||!plain(r.boulders)||Object.keys(r.cleared).length>3072||Object.keys(r.boulders).length>3072)return false;
  for(const[k,value]of Object.entries(r.cleared)){if(!/^-?\d+,-?\d+$/.test(k)||value!==true)return false;const[x,y]=k.split(',').map(Number);if(!['cut','rock-smash'].includes(baseTile(id,x,y,s.seed).fieldMove))return false}
  const occupied=new Set();for(const[k,p]of Object.entries(r.boulders)){if(!/^-?\d+,-?\d+$/.test(k)||!plain(p)||!Number.isInteger(p.x)||!Number.isInteger(p.y))return false;const[x,y]=k.split(',').map(Number),t=baseTile(id,p.x,p.y,s.seed),position=tileKey(p.x,p.y);if(baseTile(id,x,y,s.seed).fieldMove!=='strength'||t.boundary||t.landmark||['wall','water','lava','ice'].includes(t.ground)||occupied.has(position)||t.obstacle&&!r.cleared[position]&&!r.boulders[position]||F.mapBlocked(id,p.x*32+16,p.y*32+16))return false;occupied.add(position)}
 }
 return true;
}
F.newState=(...args)=>{const s=rawNew(...args);ensure(s);return s};
F.upgradeState=s=>{const previous={...s.player};rawUpgrade(s);ensure(s);if(walkable(s,previous.x,previous.y))s.player=previous;step(s);return s};
F.validState=s=>rawValid(s)&&valid(s);
Object.assign(F,{FIELD_MOVES:FIELD,ensureField:ensure,fieldSupports:supports,fieldAccess:access,fieldTile:tile,fieldWalkable:walkable,nearField:nearest,fieldDestinations:destinations,canUseField:canUse,useField:use,fieldStep:step,fieldDark:dark,visitCenter,fieldWaterfalls:falls});
return F;
});
