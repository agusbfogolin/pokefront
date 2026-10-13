// Modos de juego elegidos al crear una partida: Clásico, Relajado, Desafío, Nuzlocke y Exploración libre.
// Se guardan en state.gameMode; las partidas antiguas (sin campo) juegan como Clásico.
(function(F){
 const MODES={
  classic:{id:'classic',name:'Clásico',icon:'◆',tag:'Las reglas de siempre',copy:'El equilibrio original de Frontera: experiencia, dinero y rivales sin ajustes.',rules:['Experiencia y dinero normales','Curar en combate con medicinas','Fronteras por medallas'],xp:1,money:1,enemyDamage:1,playerDamage:1,lossFactor:1,captureLimit:null,battleHeal:true},
  relaxed:{id:'relaxed',name:'Relajado',icon:'❀',tag:'Para disfrutar la historia',copy:'Más experiencia y dinero, rivales que pegan menos y capturas más fáciles. Perder no cuesta dinero.',rules:['+50 % experiencia y dinero','Los rivales hacen 25 % menos daño','Captura desde 50 % de PS','Perder no cobra gastos'],xp:1.5,money:1.5,enemyDamage:.75,playerDamage:1,lossFactor:0,captureLimit:.5,battleHeal:true},
  challenge:{id:'challenge',name:'Desafío',icon:'▲',tag:'Para entrenadores curtidos',copy:'Los rivales pegan más fuerte y no se puede curar durante el combate: prepara el equipo antes de pelear.',rules:['Los rivales hacen 30 % más daño','Sin medicinas durante el combate','Perder cuesta el doble','+20 % experiencia'],xp:1.2,money:1,enemyDamage:1.3,playerDamage:1,lossFactor:2,captureLimit:null,battleHeal:false},
  nuzlocke:{id:'nuzlocke',name:'Nuzlocke',icon:'☠',tag:'Cada decisión pesa',copy:'Solo puedes capturar al primer Pokémon salvaje de cada zona y los que se debilitan se despiden para siempre.',rules:['Una captura por zona: el primer salvaje','Debilitado = liberado para siempre','Leyendas y eventos no cuentan como zona','Si cae todo el equipo, el reto termina y sigues en Clásico'],xp:1,money:1,enemyDamage:1,playerDamage:1,lossFactor:1,captureLimit:null,battleHeal:true},
  free:{id:'free',name:'Exploración libre',icon:'✧',tag:'Sin fronteras cerradas',copy:'Todas las regiones de tu campaña quedan abiertas desde el primer día. Las lejanas tienen Pokémon de más nivel.',rules:['Todas las regiones abiertas','Viaja entre regiones desde cualquier ciudad','Niveles según la distancia a tu región','Las medallas siguen sumando para leyendas'],xp:1,money:1,enemyDamage:1,playerDamage:1,lossFactor:1,captureLimit:null,battleHeal:true}
 };
 const PACES={
  express:{id:'express',name:'Exprés',icon:'1',need:1,copy:'1 gimnasio por región. Una aventura de pocas horas.'},
  short:{id:'short',name:'Corta',icon:'3',need:3,copy:'3 gimnasios por región. El ritmo recomendado.'},
  standard:{id:'standard',name:'Estándar',icon:'5',need:5,copy:'5 gimnasios por región. Más rutas y más combates.'},
  full:{id:'full',name:'Completa',icon:'9',need:9,copy:'Los 9 gimnasios de cada región. La experiencia entera.'},
  custom:{id:'custom',name:'Personalizada',icon:'✎',need:null,copy:'Eliges qué regiones forman la aventura y cuántos gimnasios exige cada una.'}
 };
 const ALL=[1,2,3,4,5,6,7,8,9];
 function mode(s){return MODES[s?.gameMode?.id]||MODES.classic}
 function ensure(s){if(!s.gameMode||!MODES[s.gameMode.id])s.gameMode={id:'classic'};if(s.gameMode.id==='nuzlocke'){s.gameMode.zones??={};s.gameMode.fallen??=[];}return s.gameMode}
 // Duraciones nuevas (Exprés, Estándar) se expresan como campaña personalizada con las nueve regiones.
 function paceOptions(id,custom){if(id==='custom')return{pace:'custom',...custom};if(id==='express'||id==='standard')return{pace:'custom',gens:ALL,need:PACES[id].need,paceLabel:id};return{pace:id==='full'?'full':'short'}}
 function paceLabel(s){const j=s?.generationJourney;if(!j)return PACES.full.name;if(j.paceLabel&&PACES[j.paceLabel]&&j.pace==='custom'&&j.custom?.gens?.length===9&&j.custom.need===PACES[j.paceLabel].need)return PACES[j.paceLabel].name;if(j.pace==='custom')return PACES.custom.name+' · '+j.custom.need+' gim./región';return j.pace==='short'?PACES.short.name:PACES.full.name}
 function openAll(s){const j=F.ensureGenerations(s);j.free=true;for(const g of F.campaignScope(s))if(j.unlocked[g]===undefined)j.unlocked[g]=Math.min(8,Math.abs(g-j.origin));return j}
 const rawNew=F.newState;
 F.newState=(seed,starter,options={})=>{const s=rawNew(seed,starter,options);s.gameMode={id:MODES[options.mode]?options.mode:'classic'};ensure(s);if(options.paceLabel)s.generationJourney.paceLabel=options.paceLabel;if(s.gameMode.id==='free')openAll(s);return s};
 const rawUpgrade=F.upgradeState;F.upgradeState=s=>{rawUpgrade(s);ensure(s);if(s.gameMode.id==='free')openAll(s);return s};
 // Dinero: multiplicador de premios y factor de gastos al perder.
 const rawReward=F.economyReward;
 F.economyReward=(s,b)=>{const r=rawReward(s,b),m=mode(s);if(r.money>0&&m.money!==1){const extra=Math.round(r.money*(m.money-1));s.money=Math.min(1e9,s.money+extra);r.money+=extra}else if(r.money<0&&m.lossFactor!==1){const refund=-r.money,change=Math.round(refund*(m.lossFactor-1));const applied=Math.max(-refund,Math.min(change,s.money));s.money-=applied;r.money-=applied}return r};
 // Aplica el modo a un combate recién creado.
 function prepareBattle(s,b){const m=mode(s);b.modeDamage={enemy:m.enemyDamage,player:m.playerDamage};const enc=b.encounter;if(m.captureLimit&&enc.kind==='wild'&&!enc.legendId&&!enc.uniqueId&&!(enc.captureLimit>m.captureLimit))b.captureLimit=m.captureLimit;return b}
 function captureLimit(b){return b?.captureLimit||b?.encounter?.captureLimit||.35}
 function nuzlockeZone(enc){return enc&&enc.kind==='wild'&&!enc.legendId&&!enc.uniqueId&&!enc.tutorial}
 // Nuzlocke: solo el primer salvaje de cada zona puede capturarse.
 function captureBlocked(s,b){if(mode(s).id!=='nuzlocke'||!b||!nuzlockeZone(b.encounter))return null;const g=ensure(s),zone=g.zones[s.mapId];if(zone&&zone!==b.encounter.key)return 'Nuzlocke: ya tuviste tu encuentro en esta zona.';return null}
 function battleHealBlocked(s){return mode(s).battleHeal?null:'Modo Desafío: no se puede curar durante el combate.'}
 // Al terminar un combate: registra la zona y libera a los Pokémon debilitados.
 function afterBattle(s,b){if(mode(s).id!=='nuzlocke'||!b||b.encounter?.tutorial)return null;const g=ensure(s);if(nuzlockeZone(b.encounter)&&!g.zones[s.mapId])g.zones[s.mapId]=b.encounter.key;
  const team=s.team.map(c=>({c,hp:F.creatureHealth(c).hp})),down=team.filter(x=>x.hp<=0);if(!down.length)return null;
  if(down.length===team.length){g.failed=true;s.gameMode={id:'classic',nuzlockeFailed:true,fallen:g.fallen};return{failed:true,names:down.map(x=>F.DATA[x.c.id].name)}}
  const activeUid=s.team[s.active]?.uid;for(const x of down)g.fallen.push({id:x.c.id,level:x.c.level,map:s.mapId});s.team=s.team.filter(c=>!down.some(x=>x.c===c));const keep=s.team.findIndex(c=>c.uid===activeUid);s.active=keep>=0?keep:Math.max(0,s.team.findIndex(c=>F.creatureHealth(c).hp>0));if(s.active<0)s.active=0;return{released:down.map(x=>F.DATA[x.c.id].name)}}
 function summary(s){const m=mode(s);let extra='';if(m.id==='nuzlocke'){const g=ensure(s);extra=' · '+Object.keys(g.zones).length+' zona(s) usadas · '+g.fallen.length+' caído(s)'}if(s?.gameMode?.nuzlockeFailed)extra=' · reto Nuzlocke terminado';return 'Modo '+m.name+' · Duración '+paceLabel(s)+extra}
 Object.assign(F,{GAME_MODES:MODES,GAME_PACES:PACES,gameMode:mode,ensureGameMode:ensure,paceOptions,paceLabel,prepareModeBattle:prepareBattle,modeCaptureLimit:captureLimit,modeCaptureBlocked:captureBlocked,modeHealBlocked:battleHealBlocked,modeAfterBattle:afterBattle,modeSummary:summary});
})(window.Frontera);
