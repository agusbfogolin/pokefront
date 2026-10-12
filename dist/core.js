(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.Frontera=factory(root.SPECIES_DATA,root.MOVE_DATA,root.SPECIES_KITS,root.EVOLUTION_DATA,root.TYPE_CHART,root.EXTRA_MOVE_RULES)})(typeof window!=='undefined'?window:globalThis,function(DATA,MOVE_DATA,KITS,EVOLUTION_DATA,TYPE_CHART,EXTRA_MOVE_RULES){
'use strict';
MOVE_DATA=MOVE_DATA||{};KITS=KITS||{};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function hash(x,y,seed=0){let n=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^(seed|0);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function seedNumber(text){let n=2166136261;for(const c of String(text))n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0}
function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function noise(x,y,scale,seed){x/=scale;y/=scale;let ix=Math.floor(x),iy=Math.floor(y),u=x-ix,v=y-iy;u=u*u*(3-2*u);v=v*v*(3-2*v);return lerp(lerp(hash(ix,iy,seed),hash(ix+1,iy,seed),u),lerp(hash(ix,iy+1,seed),hash(ix+1,iy+1,seed),u),v)}
const TYPE={normal:['Normal','#beb9a1'],fire:['Fuego','#fa855e'],water:['Agua','#64b4f5'],grass:['Planta','#a2d66b'],electric:['Eléctrico','#f2d464'],fighting:['Lucha','#de8b7d'],rock:['Roca','#c9ba89'],ground:['Tierra','#dcb278'],ghost:['Fantasma','#b79ddc'],dragon:['Dragón','#9b88d0'],psychic:['Psíquico','#ef94aa'],steel:['Acero','#a6b8c2'],bug:['Bicho','#b8bc67'],poison:['Veneno','#cc8aca'],flying:['Volador','#a5b4e6'],ice:['Hielo','#9cd9e3'],fairy:['Hada','#edb7d7'],dark:['Siniestro','#948a9c']};
TYPE.shadow=['Oscuro (Colosseum)','#87789e'];
const STAT_NAMES=['PS','Ataque','Defensa','At. especial','Def. especial','Velocidad'];
const NATURE_NAMES=[['Fuerte','Huraña','Audaz','Firme','Pícara'],['Osada','Dócil','Plácida','Agitada','Floja'],['Miedosa','Activa','Seria','Alegre','Ingenua'],['Modesta','Afable','Mansa','Tímida','Alocada'],['Serena','Amable','Grosera','Cauta','Rara']];
const NATURE_ORDER=[1,2,5,3,4];
const KANTO_IDS=Array.from({length:151},(_,i)=>i+1);
const evolutionData=EVOLUTION_DATA||{};
const evolutions=Object.fromEntries(Object.entries(evolutionData).map(([id,options])=>[id,[options[0].target,options[0].cost?'stone':options[0].level]]));
function evolutionOptions(c){return evolutionData[c.id]||[]}
// Same 480-point combat budget for every species; canonical stats define its role.
function combatBase(id){const base=DATA[id].base,mean=base.reduce((a,b)=>a+b,0)/6;let values=base.map(v=>clamp(80+(v-mean)*.7,45,125));
for(let n=0;n<12;n++){const gap=480-values.reduce((a,b)=>a+b,0);if(Math.abs(gap)<.00001)break;const free=values.map((v,i)=>({v,i})).filter(o=>gap>0?o.v<125:o.v>45);for(const o of free)values[o.i]=clamp(o.v+gap/free.length,45,125)}
const rounded=values.map(Math.floor);let left=480-rounded.reduce((a,b)=>a+b,0);const order=values.map((v,i)=>({i,f:v-Math.floor(v)})).sort((a,b)=>b.f-a.f);for(let i=0;i<left;i++)rounded[order[i%6].i]++;return rounded}
const COMBAT_BASE=Object.fromEntries(Object.keys(DATA).map(id=>[id,combatBase(id)]));
function makeCreature(id,level,seed){const r=rng(seed),up=Math.floor(r()*5),down=Math.floor(r()*5);return{id:Number(id),uid:String(seed)+'-'+id,level:clamp(level,1,100),iv:Array.from({length:6},()=>Math.floor(r()*32)),ev:[0,0,0,0,0,0],nature:{name:NATURE_NAMES[up][down],up:up===down?-1:NATURE_ORDER[up],down:up===down?-1:NATURE_ORDER[down]},xp:0,training:0,wins:0}}
// c.ev now stores plain training points (no 252 / 510 EV caps). Each point adds exactly +1 to its stat
// (+6 PS for the health stat). Any single stat may take as many points as you like, but the TOTAL is
// limited by level (1.2 points per level), so a build specialises instead of maxing everything.
function trainedPoints(c,i){return c.ev[i]||0}
function trainBudget(c){return Math.floor(c.level*1.2)}
function trainRoom(c){return Math.max(0,trainBudget(c)-c.ev.reduce((a,b)=>a+b,0))}
function stats(c){return COMBAT_BASE[c.id].map((base,i)=>{const v=Math.floor((2*base+c.iv[i])*c.level/100),t=trainedPoints(c,i);if(i===0)return v+c.level+10+t;return Math.floor((v+5)*(c.nature.up===i?1.1:c.nature.down===i?.9:1))+t})}
function maxHP(c){return Math.max(1,Math.round(stats(c)[0]*6*(api.pokemonBonuses?.(c)?.hp||1)))}
// Keep current PS exactly when rewards, training or evolution increase capacity.
// Recovery is explicit; fainted companions stay at zero. Legacy creatures initialize once.
function creatureHealth(c){const max=maxHP(c);if(!Number.isFinite(c.hp))c.hp=max;c.maxHP=max;c.hp=clamp(c.hp,0,max);return{hp:c.hp,maxHP:max}}
function setCreatureHP(c,hp,maximum=maxHP(c)){c.hp=clamp(hp,0,maximum);c.maxHP=maximum;return creatureHealth(c)}
function healTeam(s){for(const c of s.team)setCreatureHP(c,maxHP(c));return s}
function train(c,i){if(c.training<1||!Number.isInteger(i)||i<0||i>5||trainRoom(c)<1)return false;c.ev[i]++;c.training--;return true}
function xpNext(c){return Math.floor(((c.level+1)**3-c.level**3)/3)+8}
function award(c,amount){c.xp+=amount;let levels=0;while(c.level<100&&c.xp>=xpNext(c)){c.xp-=xpNext(c);c.level++;levels++}if(c.level===100)c.xp=0;c.training+=4;c.wins++;return levels}
function evolve(c,shards,target){const e=evolutionOptions(c).find(e=>target===undefined||e.target===Number(target));if(!e||shards<e.cost||(api.evolutionReady?!api.evolutionReady(c,e):c.level<e.level))return false;c.id=e.target;return true}
const chart=TYPE_CHART||{psychic:{fighting:2,poison:2,psychic:.5,steel:.5},normal:{rock:.5,ghost:0,steel:.5},fire:{grass:2,water:.5,fire:.5,rock:.5,bug:2,steel:2},water:{fire:2,rock:2,ground:2,water:.5,grass:.5},grass:{water:2,rock:2,ground:2,fire:.5,grass:.5,poison:.5,flying:.5,bug:.5,steel:.5},electric:{water:2,flying:2,electric:.5,grass:.5,ground:0},fighting:{normal:2,rock:2,steel:2,poison:.5,flying:.5,bug:.5,ghost:0},rock:{fire:2,flying:2,bug:2,fighting:.5,ground:.5,steel:.5},ground:{fire:2,electric:2,poison:2,rock:2,steel:2,grass:.5,bug:.5,flying:0},ghost:{ghost:2,normal:0},poison:{grass:2,poison:.5,rock:.5,ground:.5,ghost:.5,steel:0},flying:{grass:2,fighting:2,bug:2,electric:.5,rock:.5,steel:.5},steel:{rock:2,fire:.5,water:.5,electric:.5,steel:.5},bug:{grass:2,fire:.5,fighting:.5,poison:.5,flying:.5,ghost:.5,steel:.5}};
function effectiveness(type,defTypes){let m=1;for(const t of defTypes)m*=chart[type]?.[t]??1;return m===0?.25:m>=4?2.2:m>1?1.6:clamp(Math.sqrt(m),.5,1)}
const MOVE_RULES={
 'vine-whip':{kind:'melee',range:180,delay:.42,visual:'vine',description:'Látigos · alcance medio'},
 'razor-leaf':{kind:'projectile',shots:3,spread:.15,speed:300,visual:'leaf',description:'Hojas · abanico'},
 'leech-seed':{kind:'projectile',effect:'seed',duration:8,speed:225,visual:'seed',description:'Drena vida · 8 s'},
 'sludge-bomb':{kind:'projectile',radius:27,effect:'poison',chance:.55,visual:'sludge',description:'Bomba · veneno'},
 'poison-powder':{kind:'cone',range:230,effect:'poison',duration:8,visual:'powder',description:'Veneno · 8 s'},
 'solar-beam':{kind:'beam',range:570,width:24,delay:1.15,visual:'solar',description:'Rayo · carga larga'},
 'sleep-powder':{kind:'cone',range:230,effect:'sleep',duration:2,visual:'powder',description:'Sueño · 2 s'},
 ember:{kind:'projectile',effect:'burn',chance:.3,visual:'fire',description:'Ascuas · quemadura'},
 scratch:{kind:'melee',range:110,visual:'claw',description:'Garras · corto alcance'},
 smokescreen:{kind:'area',range:240,effect:'blind',duration:6,visual:'smoke',description:'Menor precisión · 6 s'},
 flamethrower:{kind:'cone',range:300,delay:.65,effect:'burn',chance:.4,visual:'fire',description:'Cono de fuego'},
 'dragon-rage':{kind:'projectile',power:60,visual:'dragon',description:'Onda de dragón'},
 'air-slash':{kind:'projectile',shots:2,spread:.08,visual:'wind',description:'Cuchillas de aire'},
 'will-o-wisp':{kind:'projectile',effect:'burn',duration:8,visual:'fire',speed:230,description:'Quemadura · 8 s'},
 'water-gun':{kind:'projectile',speed:330,visual:'water',description:'Chorro · a distancia'},
 tackle:{kind:'lunge',range:120,visual:'impact',description:'Carga corta'},
 withdraw:{kind:'self',effect:'shield',duration:7,visual:'shield',description:'Reduce daño · 7 s'},
 'water-pulse':{kind:'projectile',radius:28,effect:'confusion',chance:.35,visual:'water',description:'Onda · confusión'},
 bite:{kind:'melee',range:110,visual:'bite',description:'Mordisco cercano'},
 'hydro-pump':{kind:'beam',width:38,range:520,delay:.8,visual:'water',description:'Chorro potente'},
 'flash-cannon':{kind:'beam',range:470,width:24,visual:'metal',description:'Rayo de acero'},
 'iron-defense':{kind:'self',effect:'shield',duration:9,strength:.5,visual:'shield',description:'Defensa fuerte · 9 s'},
 'quick-attack':{kind:'lunge',range:145,delay:.25,visual:'speed',description:'Avance rápido'},
 'tail-whip':{kind:'cone',range:260,effect:'defDown',duration:7,visual:'ring',description:'Baja defensa · 7 s'},
 'poison-sting':{kind:'projectile',effect:'poison',chance:.45,visual:'needle',description:'Aguja · veneno'},
 glare:{kind:'beam',range:400,effect:'paralysis',duration:7,visual:'eye',description:'Parálisis · 7 s'},
 'thunder-shock':{kind:'beam',range:390,width:30,effect:'paralysis',chance:.25,visual:'electric',description:'Descarga dirigida'},
 'thunder-wave':{kind:'projectile',effect:'paralysis',duration:7,speed:250,visual:'electric',description:'Parálisis · 7 s'},
 thunderbolt:{kind:'beam',range:440,width:32,effect:'paralysis',chance:.35,visual:'electric',description:'Rayo potente'},
 'iron-tail':{kind:'melee',range:150,effect:'defDown',chance:.3,visual:'metal',description:'Cola · baja defensa'},
 agility:{kind:'self',effect:'haste',duration:8,visual:'speed',description:'Velocidad y recarga · 8 s'},
 'confuse-ray':{kind:'projectile',effect:'confusion',duration:7,speed:240,visual:'ghost',description:'Confusión · 7 s'},
 absorb:{kind:'projectile',drain:.75,power:30,visual:'drain',description:'Absorbe vida'},
 acid:{kind:'cone',range:220,effect:'defDown',chance:.4,visual:'sludge',description:'Ácido · baja defensa'},
 'stun-spore':{kind:'cone',range:230,effect:'paralysis',duration:7,visual:'powder',description:'Parálisis · 7 s'},
 'pay-day':{kind:'projectile',shots:3,spread:.2,visual:'coin',description:'Monedas · abanico'},
 screech:{kind:'cone',range:310,effect:'defDown',duration:8,visual:'ring',description:'Baja defensa · 8 s'},
 confusion:{kind:'beam',range:340,effect:'confusion',chance:.35,visual:'psychic',description:'Pulso · confusión'},
 disable:{kind:'beam',range:400,effect:'disable',duration:5,visual:'psychic',description:'Bloquea habilidad 2 · 5 s'},
 'karate-chop':{kind:'melee',range:120,visual:'chop',description:'Golpe físico preciso'},
 'fury-swipes':{kind:'melee',power:60,range:130,visual:'claw',description:'Ráfaga de garras'},
 'focus-energy':{kind:'self',effect:'focus',duration:8,visual:'focus',description:'Aumenta daño · 8 s'},
 roar:{kind:'cone',range:290,effect:'attackDown',duration:7,repel:100,visual:'ring',description:'Aleja y baja ataque'},
 bubble:{kind:'projectile',shots:3,spread:.18,effect:'slow',chance:.4,visual:'bubble',description:'Burbujas · lentitud'},
 hypnosis:{kind:'projectile',effect:'sleep',duration:2,speed:215,visual:'sleep',description:'Sueño · 2 s'},
 'low-kick':{kind:'melee',power:65,range:130,visual:'chop',description:'Patada a corta distancia'},
 'cross-chop':{kind:'melee',range:150,delay:.65,visual:'cross',description:'Golpe cruzado potente'},
 'bulk-up':{kind:'self',effect:'bulk',duration:8,visual:'focus',description:'Ataque y defensa · 8 s'},
 'rock-throw':{kind:'projectile',speed:255,radius:22,visual:'rock',description:'Roca arrojada'},
 'defense-curl':{kind:'self',effect:'shield',duration:7,visual:'shield',description:'Reduce daño · 7 s'},
 'rock-slide':{kind:'targetArea',range:440,areaRadius:115,delay:1,visual:'rock',description:'Zona de rocas'},
 bulldoze:{kind:'area',range:180,effect:'slow',duration:5,visual:'ground',description:'Temblor · lentitud'},
 'magnet-bomb':{kind:'projectile',homing:true,speed:225,radius:22,visual:'metal',description:'Bomba con seguimiento'},
 lick:{kind:'melee',range:120,effect:'paralysis',chance:.35,visual:'ghost',description:'Lengua · parálisis'},
 'shadow-ball':{kind:'projectile',radius:26,visual:'ghost',description:'Bola de sombra'},
 'dream-eater':{kind:'beam',range:400,requires:'sleep',drain:.8,visual:'drain',description:'Drena si está dormido'},
 'rock-tomb':{kind:'targetArea',range:380,areaRadius:100,delay:.9,effect:'slow',duration:5,visual:'rock',description:'Rocas · lentitud'},
 spark:{kind:'lunge',range:135,effect:'paralysis',chance:.3,visual:'electric',description:'Carga eléctrica'},
 rollout:{kind:'lunge',power:65,range:180,delay:.35,visual:'rock',description:'Rodar hacia el rival'},
 charge:{kind:'self',effect:'charge',duration:8,visual:'electric',description:'Potencia eléctrica · 8 s'},
 'sand-attack':{kind:'cone',range:240,effect:'blind',duration:6,visual:'sand',description:'Menor precisión · 6 s'},
 astonish:{kind:'melee',range:130,effect:'attackDown',chance:.35,visual:'ghost',description:'Susto · baja ataque'},
 psybeam:{kind:'beam',range:410,effect:'confusion',chance:.35,visual:'psychic',description:'Rayo · confusión'},
 'fire-blast':{kind:'targetArea',range:430,areaRadius:115,delay:.9,effect:'burn',chance:.3,visual:'fire',description:'Estallido de fuego en zona'},
 psychic:{kind:'beam',range:430,effect:'defDown',chance:.25,visual:'psychic',description:'Impacto mental · baja defensa'},
 'bug-bite':{kind:'melee',range:130,drain:.2,visual:'bite',description:'Mordisco · recupera vida'},
 'electroweb':{kind:'targetArea',range:400,areaRadius:110,delay:.65,effect:'slow',duration:5,visual:'electric',description:'Red eléctrica · lentitud'},
 'string-shot':{kind:'cone',range:330,effect:'slow',duration:8,visual:'vine',description:'Seda · lentitud 8 s'},
 'harden':{kind:'self',effect:'shield',duration:8,visual:'shield',description:'Coraza · reduce daño'},
 'gust':{kind:'projectile',radius:28,visual:'wind',description:'Remolino de aire'},
 'twineedle':{kind:'projectile',shots:2,spread:.08,effect:'poison',chance:.35,visual:'needle',description:'Aguijones · veneno'},
 'poison-jab':{kind:'melee',range:145,effect:'poison',chance:.4,visual:'needle',description:'Estocada venenosa'},
 'hyper-fang':{kind:'melee',range:130,visual:'bite',description:'Colmillo potente'},
 'peck':{kind:'lunge',range:135,delay:.3,visual:'needle',description:'Picotazo rápido'},
 'drill-peck':{kind:'lunge',range:185,visual:'wind',description:'Avance en espiral'},
 'leer':{kind:'beam',range:420,effect:'defDown',duration:8,visual:'eye',description:'Baja defensa · 8 s'},
 'growl':{kind:'cone',range:320,effect:'attackDown',duration:8,visual:'ring',description:'Baja ataque · 8 s'},
 'earth-power':{kind:'targetArea',range:420,areaRadius:115,delay:.8,visual:'ground',description:'Erupción bajo el rival'},
 'toxic':{kind:'projectile',effect:'poison',duration:9,visual:'sludge',description:'Veneno · 9 s'},
 'double-kick':{kind:'melee',range:150,visual:'chop',description:'Patadas encadenadas'},
 'disarming-voice':{kind:'cone',range:330,visual:'ring',description:'Voz de hada · cono'},
 'moonblast':{kind:'projectile',radius:28,effect:'attackDown',chance:.25,visual:'psychic',description:'Luz lunar · baja ataque'},
 'sing':{kind:'cone',range:290,effect:'sleep',duration:2,visual:'sleep',description:'Canción · sueño 2 s'},
 'body-slam':{kind:'lunge',range:150,effect:'paralysis',chance:.25,visual:'impact',description:'Carga · parálisis'},
 'wing-attack':{kind:'melee',range:185,visual:'wind',description:'Barrido de alas'},
 'spore':{kind:'projectile',range:350,speed:245,effect:'sleep',duration:2,visual:'powder',description:'Esporas · sueño 2 s'},
 'reflect':{kind:'self',effect:'shield',duration:8,visual:'psychic',description:'Barrera · reduce daño'},
 'barrier':{kind:'self',effect:'shield',duration:8,visual:'shield',description:'Escudo · reduce daño'},
 'stomp':{kind:'melee',range:135,effect:'slow',chance:.25,visual:'impact',description:'Pisotón · lentitud'},
 'slack-off':{kind:'self',effect:'regen',duration:7,visual:'drain',description:'Regenera vida · 7 s'},
 'slash':{kind:'melee',range:155,visual:'claw',description:'Corte físico'},
 'swords-dance':{kind:'self',effect:'focus',duration:8,visual:'focus',description:'Potencia ataque · 8 s'},
 'ice-beam':{kind:'beam',range:470,width:30,effect:'slow',chance:.35,visual:'ice',description:'Rayo helado · lentitud'},
 'aqua-ring':{kind:'self',effect:'regen',duration:7,visual:'water',description:'Anillo · regenera vida'},
 'pound':{kind:'melee',range:125,visual:'impact',description:'Golpe cercano'},
 'minimize':{kind:'self',effect:'haste',duration:8,visual:'speed',description:'Agilidad · 8 s'},
 'icicle-spear':{kind:'projectile',shots:3,spread:.13,visual:'ice',description:'Carámbanos · abanico'},
 'metal-claw':{kind:'melee',range:145,visual:'metal',description:'Garras de acero'},
 'bone-club':{kind:'melee',range:180,visual:'chop',description:'Golpe con hueso'},
 'bonemerang':{kind:'projectile',shots:2,spread:.08,visual:'bone',description:'Huesos arrojados'},
 'mach-punch':{kind:'lunge',range:155,delay:.25,visual:'chop',description:'Puño veloz'},
 'ice-punch':{kind:'melee',range:145,effect:'slow',chance:.35,visual:'ice',description:'Puño helado · lentitud'},
 'dazzling-gleam':{kind:'area',range:220,visual:'psychic',description:'Destello de hada'},
 'soft-boiled':{kind:'self',effect:'regen',duration:7,visual:'drain',description:'Regenera vida · 7 s'},
 'dragon-breath':{kind:'cone',range:300,effect:'paralysis',chance:.25,visual:'dragon',description:'Aliento · parálisis'},
 'recover':{kind:'self',effect:'regen',duration:7,visual:'drain',description:'Regenera vida · 7 s'},
 'powder-snow':{kind:'cone',range:300,effect:'slow',chance:.3,visual:'ice',description:'Nieve · lentitud'},
 'lovely-kiss':{kind:'projectile',speed:250,effect:'sleep',duration:2,visual:'sleep',description:'Beso · sueño 2 s'},
 'fire-punch':{kind:'melee',range:145,effect:'burn',chance:.35,visual:'fire',description:'Puño de fuego'},
 'vice-grip':{kind:'melee',range:145,visual:'claw',description:'Presa con pinzas'},
 'horn-attack':{kind:'lunge',range:160,visual:'needle',description:'Embestida con cuerno'},
 'work-up':{kind:'self',effect:'focus',duration:8,visual:'focus',description:'Potencia ataque · 8 s'},
 'flail':{power:75,kind:'melee',range:155,lowHP:true,visual:'impact',description:'Más fuerte con poca vida'},
 'splash':{kind:'self',effect:'focus',duration:8,restore:12,visual:'water',description:'Impulso · stamina y ataque'},
 'waterfall':{kind:'lunge',range:170,visual:'water',description:'Avance de agua'},
 'dragon-dance':{kind:'self',effect:'bulk',duration:8,visual:'dragon',description:'Ataque y defensa · 8 s'},
 'aurora-beam':{kind:'beam',range:430,effect:'attackDown',chance:.25,visual:'ice',description:'Aurora · baja ataque'},
 'pin-missile':{kind:'projectile',shots:3,spread:.1,visual:'needle',description:'Ráfaga de agujas'},
 'tri-attack':{kind:'projectile',shots:3,spread:.14,visual:'psychic',description:'Tres pulsos en abanico'},
 'aqua-jet':{kind:'lunge',range:170,delay:.25,visual:'water',description:'Avance acuático rápido'},
 'amnesia':{kind:'self',effect:'shield',duration:8,visual:'psychic',description:'Concentración defensiva'},
 'mist':{kind:'self',effect:'shield',duration:8,visual:'ice',description:'Neblina protectora'},
 'wrap':{kind:'melee',range:165,effect:'slow',chance:.5,visual:'vine',description:'Envoltura · lentitud'},
 'psystrike':{kind:'targetArea',range:460,areaRadius:100,delay:.8,visual:'psychic',description:'Impacto mental en una zona'},
 'ancient-power':{kind:'projectile',radius:28,visual:'rock',description:'Roca ancestral'},
 'transform':{kind:'self',effect:'transform',visual:'psychic',description:'Copia tipo y técnicas del rival',delay:.55}
};
Object.assign(MOVE_RULES,EXTRA_MOVE_RULES||{});
function isFinal(c){return evolutionOptions(c).length===0}
function defaultUltimate(c){const keys=KITS[c.id]||[];return [...keys].sort((a,b)=>(MOVE_DATA[b]?.power||0)-(MOVE_DATA[a]?.power||0))[0]}
function moves(c){const equipped=c.progression?.loadout||KITS[c.id];if(!equipped)throw Error('Missing species kit '+c.id);const kit=equipped.slice(0,4).map((key,slot)=>({key,slot}));if(c.ultimateEligible??isFinal(c))kit.push({key:c.progression?.ultimate||defaultUltimate(c),slot:4});return kit.map(({key,slot:i})=>{const canonical=MOVE_DATA[key],r=MOVE_RULES[key];if(!canonical||!r)throw Error('Missing move '+key);const m={key,...canonical,kind:'projectile',range:450,width:30,radius:18,speed:300,delay:i===0?.4:i===4?.9:.6,cooldown:[2.8,5.5,10,6.5,18][i],cost:[12,21,18,20,32][i],energyCost:[3,6,4,5,9][i],anim:canonical.special||!canonical.power?'Shoot':'Attack',...r,level:1,slot:i,ultimate:i===4};m.originalPower=canonical.power;if(m.power>0)m.power=Math.round((i===4?105:i===0?55:i===3?65:75)*(m.kind==='melee'?1.2:m.kind==='lunge'?1.05:1)*(m.drain>0?.85:1));if(m.ultimate&&m.duration)m.duration*=1.3;return m})}
const TOWN={name:'Ciudad Brote',bounds:{left:-736,right:736,top:-608,bottom:608},spawn:{x:16,y:32},fountain:{x:16,y:-16},buildings:[
{id:'lab',x:-320,y:-224,w:192,h:128,label:'LABORATORIO',roof:'#4c86ab',wall:'#e8ecdc'},
{id:'gym',x:128,y:-224,w:192,h:128,label:'GIMNASIO',roof:'#b04a3e',wall:'#ddd2a8'},
{id:'clinic',x:-64,y:112,w:160,h:112,label:'CENTRO',roof:'#d9606c',wall:'#f2e7d2'},
{id:'house1',x:-320,y:96,w:128,h:96,label:'',roof:'#dc8a3c',wall:'#efe0b8'},
{id:'house2',x:192,y:96,w:128,h:96,label:'',roof:'#4f9a68',wall:'#ece4cc'},
{id:'academy',x:-624,y:-464,w:240,h:144,label:'ACADEMIA',roof:'#3f80ac',wall:'#e3eadb'},
{id:'guild',x:320,y:-480,w:240,h:160,label:'CASA DE TIPOS',roof:'#7d60b4',wall:'#ebe1d2'},
{id:'market',x:-624,y:240,w:208,h:128,label:'MERCADO',roof:'#d27a3a',wall:'#f3e4c4'},
{id:'school',x:368,y:304,w:240,h:128,label:'DOJO',roof:'#a2403c',wall:'#e8e2c4'},
{id:'house3',x:-656,y:-96,w:128,h:112,label:'',roof:'#c4594a',wall:'#ede0bd'},
{id:'house4',x:544,y:-96,w:128,h:112,label:'',roof:'#4a88bc',wall:'#e6e1ca'},
{id:'house5',x:-320,y:352,w:128,h:112,label:'',roof:'#8d62ab',wall:'#e4e5cf'},
{id:'house6',x:128,y:352,w:128,h:112,label:'',roof:'#d9a53c',wall:'#efe5c4'}],points:[
{kind:'professor',x:-224,y:-64,label:'Profesor Ciprés'},
{kind:'gym',x:224,y:-64,label:'Gimnasio Brote'},
{kind:'clinic',x:16,y:240,label:'Centro de descanso'},
{kind:'academy',x:-496,y:-272,label:'Academia del entrenador'},
{kind:'guild',x:448,y:-272,label:'Casa de especialidades'},
{kind:'merchant',x:-520,y:400,label:'Mercado de Brote'},
{kind:'school',x:496,y:464,label:'Dojo de movimientos'},
{kind:'ranger',x:0,y:-528,label:'Guardabosques Lía'}]};
function inTown(x,y){const b=TOWN.bounds;return x>=b.left&&x<b.right&&y>=b.top&&y<b.bottom}
function townBlocked(x,y){if(!inTown(x,y))return false;if(Math.hypot(x-TOWN.fountain.x,y-TOWN.fountain.y)<29)return true;return TOWN.buildings.some(b=>x>b.x+3&&x<b.x+b.w-3&&y>b.y+30&&y<b.y+b.h-4)}
function relocatePlayer(s){if(tile(Math.floor(s.player.x/32),Math.floor(s.player.y/32),s.seed).block||townBlocked(s.player.x,s.player.y))s.player={...TOWN.spawn,dir:0};return s}
const HINT_POOLS={};for(const id of Object.keys(DATA).map(Number))for(const type of DATA[id].types)(HINT_POOLS[type]??=[]).push(id);
const STAGE_LEVEL={};for(const[parent,options]of Object.entries(evolutionData))for(const e of options){if((DATA[parent].generation||1)>(DATA[e.target].generation||1))continue;STAGE_LEVEL[e.target]=Math.max(STAGE_LEVEL[e.target]||1,e.cost?18:e.level);}for(const id of Object.keys(DATA))if(DATA[id].rare)STAGE_LEVEL[id]=45;
function habitatSpecies(type,level){return(HINT_POOLS[type]||[]).filter(id=>level>=(STAGE_LEVEL[id]||1))}
function pickSpecies(pool,r){const weights=pool.map(id=>DATA[id].rare?.12:1),total=weights.reduce((a,b)=>a+b,0);let draw=r()*total;for(let i=0;i<pool.length;i++){draw-=weights[i];if(draw<0)return pool[i]}return pool[pool.length-1]}
function gymEncounter(seed){return{key:'gym-brote',kind:'gym',creature:makeCreature(95,9,seedNumber(seed+':gym:vera')),biome:'gym',leader:'Vera',gymName:'Gimnasio Brote'}}
function claimGymReward(s){if(s.gymWon)return false;s.gymWon=true;s.shards+=3;return true}
// Geography is stable by compass direction; seed noise shapes boundaries and terrain.
const REGIONS={
campina:{name:'Campiña Clara',direction:'Centro',biome:'pradera',color:'#91ad73',description:'Praderas alrededor de Brote; compañeros iniciales, aves y pequeños mamíferos.',species:[1,2,3,16,17,18,19,20,21,22,25,26,29,30,31,32,33,34,35,36,39,40,52,53,83,84,85,113,115,128,132,133,143]},
forest:{name:'Bosque Umbrío',direction:'Noroeste',biome:'bosque',color:'#426e58',description:'Vegetación densa, familias de insectos y plantas. Mew es un hallazgo muy raro.',species:[1,2,3,19,20,29,30,31,10,11,12,13,14,15,43,44,45,46,47,48,49,69,70,71,102,103,114,123,127,151]},
river:{name:'Ribera Musgo',direction:'Oeste',biome:'costa',color:'#6fada7',description:'Agua dulce: Squirtle, Psyduck, Poliwag y Slowpoke. Dratini habita lejos de la ciudad.',species:[7,8,9,54,55,60,61,62,79,80,98,99,118,119,129,130,147,148]},
marsh:{name:'Pantano Bruma',direction:'Suroeste',biome:'bosque',color:'#797b89',description:'Nieblas, veneno y fantasmas: Ekans, Grimer, Gastly y sus familias.',species:[32,33,34,23,24,72,73,88,89,92,93,94,96,97,109,110]},
dunes:{name:'Dunas Ocre',direction:'Sur',biome:'desierto',color:'#c6a374',description:'Tierra, roca y lucha entre arenas: Sandshrew, Diglett, Machop y Geodude.',species:[21,22,52,53,27,28,50,51,56,57,66,67,68,74,75,76,95,104,105,106,107,111,112]},
crater:{name:'Cráter Ámbar',direction:'Sureste',biome:'montaña',color:'#b98062',description:'Una región cálida de fuego: Charmander, Vulpix, Growlithe y Ponyta. Moltres es raro.',species:[4,5,6,37,38,58,59,77,78,126,136,146]},
coast:{name:'Costa Nácar',direction:'Este',biome:'costa',color:'#8bbdc3',description:'Agua marina y fósiles: Shellder, Horsea, Staryu y las familias de Omanyte y Kabuto.',species:[86,87,90,91,98,99,116,117,118,119,120,121,129,130,131,134,138,139,140,141,142]},
highlands:{name:'Altos del Viento',direction:'Norte',biome:'montaña',color:'#93a2a5',description:'Alturas psíquicas y eléctricas: Abra, Magnemite y Voltorb. Zapdos y Mewtwo son raros.',species:[16,17,18,25,26,41,42,63,64,65,81,82,84,85,95,100,101,122,125,135,137,142,145,147,148,149,150]},
frost:{name:'Cumbres de Escarcha',direction:'Noreste',biome:'montaña',color:'#c6d9dd',description:'Hielo y especies adaptadas al frío: Seel, Jynx y Lapras. Articuno aparece muy raramente.',species:[108,35,36,39,40,86,87,113,122,124,131,144]}
};
const SECTORS=['coast','crater','dunes','marsh','river','forest','highlands','frost'];
function regionAt(x,y,seed){const tx=x/32,ty=y/32,radial=Math.hypot(tx,ty),edge=40+noise(tx,ty,30,seed+709)*8;if(radial<edge)return{...REGIONS.campina,id:'campina'};const angle=Math.atan2(ty,tx)+(noise(tx,ty,50,seed+711)-.5)*.10,index=((Math.floor((angle+Math.PI/8)/(Math.PI/4))%8)+8)%8,id=SECTORS[index];return{...REGIONS[id],id}}
function speciesRegions(id){return Object.entries(REGIONS).filter(([,r])=>r.species.includes(Number(id))).map(([id,r])=>({id,name:r.name}))}
function regionSpecies(id,level,type){return(REGIONS[id]?.species||[]).filter(n=>level>=(STAGE_LEVEL[n]||1)&&(!type||DATA[n].types.includes(type)))}
function tile(x,y,seed){const detail=hash(x,y,seed+40);if(inTown(x*32+16,y*32+16)){const road=Math.abs(x)<=1||[-9,-8,-3,-2,7,8,12,13,15,16].includes(y)||[-17,-16,15,16].includes(x)||(Math.abs(x)<=3&&y>=-2&&y<=2);return{biome:'pradera',region:'campina',ground:road?'paved':'grass',town:true,tree:false,block:false,detail}}
const region=regionAt(x*32+16,y*32+16,seed),biome=region.biome,h=noise(x,y,18,seed+101),t=noise(x,y,24,seed+333),trail=Math.abs(x)<=1||Math.abs(y)<=1||Math.abs(Math.abs(x)-Math.abs(y))<1.2;
let ground=region.id==='frost'?'snow':region.id==='crater'?'rock':biome==='costa'?(h<.33?'water':'sand'):biome==='desierto'?'sand':biome==='montaña'?(t<.28?'rock':'grass'):'grass';if(region.id==='marsh'&&h<.23)ground='water';let tree=biome==='bosque'&&detail>.80;if(trail){ground='trail';tree=false}return{biome,region:region.id,ground,tree,detail,block:ground==='water'||tree}}
function encounterAt(cx,cy,seed){const r=rng(seedNumber(seed+':wild:'+cx+':'+cy)),x=cx*8+Math.floor(r()*6)+1,y=cy*8+Math.floor(r()*6)+1;if(inTown(x*32+16,y*32+16))return null;const terrain=tile(x,y,seed);if(terrain.block)return null;const region=regionAt(x*32+16,y*32+16,seed),level=clamp(3+Math.floor(Math.hypot(x,y)/14)+Math.floor(r()*4),3,65),available=regionSpecies(region.id,level);if(!available.length)return null;const id=pickSpecies(available,r),types=DATA[id].types,type=types[Math.floor(r()*types.length)];return{key:cx+','+cy,x:x*32+16,y:y*32+16,type,region:region.id,creature:makeCreature(id,level,seedNumber(seed+':individual:'+cx+':'+cy)),biome:terrain.biome}}
function resourceAt(cx,cy,seed){const r=rng(seedNumber(seed+':loot:'+cx+':'+cy));const x=cx*8+Math.floor(r()*8),y=cy*8+Math.floor(r()*8);if(inTown(x*32+16,y*32+16)||tile(x,y,seed).block)return null;return{key:cx+','+cy,x:x*32+16,y:y*32+16,kind:r()<.6?'berry':'shard'}}
function damage(att,def,power,type,special,r=()=>.5,attForm,defForm){const a=stats(att),d=stats(def),ratio=clamp(a[special?3:1]/d[special?4:2],.55,1.85),stab=DATA[attForm||att.id].types.includes(type)?1.2:1;return Math.max(1,Math.round((power*.25+att.level*.24)*ratio*stab*effectiveness(type,DATA[defForm||def.id].types)*(.92+r()*.16)))}
function newState(seedText,starter){const seed=seedNumber(seedText);return{version:1,seedText:String(seedText),seed,avatar:'male',player:{...TOWN.spawn,dir:0},team:[makeCreature(starter,5,seedNumber(seedText+':starter'))],active:0,balls:8,berries:3,shards:0,completed:{},collected:{},battles:0,discovered:{pradera:true},distance:0,professorGift:false,researchReward:false,gymWon:false,seenTypes:{}}}
function upgradeState(s){s.avatar=s.avatar==='female'?'female':'male';s.professorGift=!!s.professorGift;s.researchReward=!!s.researchReward;s.gymWon=!!s.gymWon;s.seenTypes=s.seenTypes&&typeof s.seenTypes==='object'&&!Array.isArray(s.seenTypes)?s.seenTypes:{};s.team.forEach(c=>{api.ensureCreatureProgress?.(c);creatureHealth(c)});return relocatePlayer(s)}
function validState(s){return s&&s.version===1&&(s.avatar===undefined||['male','female'].includes(s.avatar))&&typeof s.seedText==='string'&&Number.isFinite(s.seed)&&Number.isFinite(s.player?.x)&&Number.isFinite(s.player?.y)&&Array.isArray(s.team)&&s.team.length>0&&s.team.length<2000&&Number.isInteger(s.active)&&s.active>=0&&s.active<s.team.length&&[s.balls,s.berries,s.shards,s.battles].every(v=>Number.isInteger(v)&&v>=0)&&Number.isFinite(s.distance)&&s.distance>=0&&s.completed&&s.collected&&s.discovered&&s.team.every(c=>((c.hp===undefined&&c.maxHP===undefined)||(Number.isFinite(c.hp)&&c.hp>=0&&Number.isInteger(c.maxHP)&&c.maxHP>0&&c.maxHP<=1000000&&c.hp<=c.maxHP))&&DATA[c.id]&&Number.isInteger(c.level)&&c.level>=1&&c.level<=100&&Array.isArray(c.iv)&&c.iv.length===6&&c.iv.every(v=>Number.isInteger(v)&&v>=0&&v<=31)&&Array.isArray(c.ev)&&c.ev.length===6&&c.ev.every(v=>Number.isInteger(v)&&v>=0&&v<=999)&&c.ev.reduce((a,b)=>a+b,0)<=1000&&typeof c.uid==='string'&&Number.isFinite(c.xp)&&c.xp>=0&&Number.isInteger(c.training)&&c.training>=0&&Number.isInteger(c.wins)&&c.wins>=0&&c.nature&&typeof c.nature.name==='string'&&c.nature.name.length<40&&Number.isInteger(c.nature.up)&&Number.isInteger(c.nature.down)&&c.nature.up>=-1&&c.nature.up<=5&&c.nature.down>=-1&&c.nature.down<=5&&c.nature.up!==0&&c.nature.down!==0&&((c.nature.up===-1&&c.nature.down===-1)||(c.nature.up>0&&c.nature.down>0&&c.nature.up!==c.nature.down)))}
const api={REGIONS,regionAt,regionSpecies,speciesRegions,KANTO_IDS,COMBAT_BASE,combatBase,evolutionOptions,isFinal,defaultUltimate,MOVE_DATA,KITS,STAGE_LEVEL,TOWN,inTown,townBlocked,relocatePlayer,HINT_POOLS,habitatSpecies,gymEncounter,claimGymReward,DATA,TYPE,STAT_NAMES,clamp,lerp,hash,seedNumber,rng,noise,makeCreature,stats,maxHP,creatureHealth,setCreatureHP,healTeam,train,trainedPoints,trainBudget,trainRoom,xpNext,award,evolve,evolutions,effectiveness,moves,tile,encounterAt,resourceAt,damage,MOVE_RULES,newState,upgradeState,validState};return api;
});
