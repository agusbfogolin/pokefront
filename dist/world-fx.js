/* Capa de pulido gráfico del mundo (Pokémon Frontera).
   Sombras suaves, mezcla de suelos, agua con espuma y destellos, árboles que se mecen, luz ambiental,
   sombras de nubes y partículas por bioma. Es una capa opcional: game.js la llama mediante window.WorldFX
   y, si falla o no está cargada, el mundo se dibuja exactamente como antes. No toca datos ni lógica.
   Luz de sol: arriba a la izquierda (las sombras caen hacia abajo y a la derecha). Casillas de 32 px. */
(function(root){'use strict';
const S={getTile:null,frame:new Map(),T:0,time:0,reduced:false,kind:'route',base:'campina',seed:0,sp:0,lights:[],on:true,dead:false,mapId:''};
try{const q=root.location&&root.location.search||'';if(/[?&]fx=(off|0)\b/.test(q)||(root.localStorage&&root.localStorage.getItem('frontera.fx')==='off'))S.on=false}catch(e){}
const rc=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
function h2(x,y,s){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul((s|0)+1013,1274126177);h=Math.imul(h^(h>>>13),1103515245);h^=h>>>16;return(h>>>0)/4294967296}
const wrap=(v,p)=>((v%p)+p)%p;
const seedNum=s=>{if(typeof s==='number')return s|0;s=String(s||'');let h=7;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h|0};
const safe=(fn,fallback)=>function(){if(S.dead||!S.on)return fallback?fallback.apply(this,arguments):undefined;try{return fn.apply(this,arguments)}catch(e){S.dead=true;try{console.warn('WorldFX desactivado:',e)}catch(_){}return fallback?fallback.apply(this,arguments):undefined}};

/* ---------- Estado por fotograma ---------- */
function begin(o){S.getTile=o.getTile;S.reduced=!!o.reduced;S.time=o.time||0;S.T=S.reduced?0:S.time;S.kind=o.kind||'route';S.base=o.base||'campina';
 const sd=seedNum(o.seed);S.seed=sd;S.sp=(Math.abs(sd)%97)*.13;const ep=(o.mapId||'')+'|'+sd;if(ep!==CH.epoch){CH.epoch=ep;CH.map.clear()}S.mapId=o.mapId||'';CH.frame++;S.frame.clear();S.lights.length=0}
function nb(tx,ty){const k=(tx+8192)*16384+(ty+8192);let t=S.frame.get(k);if(t===undefined){t=S.getTile(tx,ty)||null;S.frame.set(k,t)}return t}
function cls(t){
 if(!t)return'none';if(t.boundary)return'solid';if(t.gym)return'gym';if(t.ground==='bridge')return'bridge';if(t.obstacle==='cliff')return'cliff';
 switch(t.ground){case'water':case'waterfall':return'water';case'lava':return'lava';case'ice':return'ice';case'wall':return'wall';case'dungeon':return'floor';case'trail':case'paved':return'path';case'sand':return'sand';case'snow':return'snow';case'rock':return'rock';default:return'grass'}
}
const isWallC=k=>k==='wall'||(k==='solid'&&S.kind==='cave');
const isLand=k=>k!=='water'&&k!=='bridge'&&k!=='none'&&k!=='ice'&&k!=='lava'&&k!=='gym';

/* ---------- Pequeños lienzos en caché (sprites de objetos, fragmentos de suelo) ---------- */
function mkCanvas(w,h){try{if(typeof document!=='undefined'&&document.createElement){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');if(g)return{cv,g}}}catch(e){}return null}
/* Caché de fragmentos de suelo: cada fragmento de 8x8 casillas (256 px) se pinta una sola vez con todo lo estático
   (suelo base, pulido de esta capa y decoraciones) y después se copia con un único drawImage por fotograma. */
const CH={map:new Map(),epoch:'',frame:0,fail:false};
const CHT=8,CHP=CHT*32;
function chunkOf(cx,cy,paint){
 const key=(cx+4096)*8192+(cy+4096);let e=CH.map.get(key);
 if(e===undefined){const t0=S.perf?performance.now():0;const m=mkCanvas(CHP,CHP);if(!m){CH.fail=true;return null}
  for(let j=0;j<CHT;j++)for(let i=0;i<CHT;i++){const tx=cx*CHT+i,ty=cy*CHT+j,t=nb(tx,ty);if(isStaticTile(t))paint(m.g,i*32,j*32,t,tx,ty)}
  e={cv:m.cv,used:0};CH.map.set(key,e);if(S.perf){(S.perfLog=S.perfLog||[]).push(Math.round((performance.now()-t0)*10)/10)}
  if(CH.map.size>96){for(const[k,v]of CH.map)if(v.used<CH.frame-2)CH.map.delete(k)}}
 e.used=CH.frame;return e.cv}
function isStaticTile(t){return!!t&&!t.gym&&t.ground!=='water'&&t.ground!=='waterfall'&&t.ground!=='lava'&&t.ground!=='ice'&&t.ground!=='bridge'}
/* Dibuja los fragmentos que cubren la pantalla. Devuelve true si el suelo estático ya está pintado. */
function ground(c,camera,x0,y0,paint){
 if(!S.on||S.dead||S.noChunks||CH.fail||!S.getTile)return false;
 try{const cx0=Math.floor((x0-1)/CHT),cx1=Math.floor((x0+31)/CHT),cy0=Math.floor((y0-1)/CHT),cy1=Math.floor((y0+19)/CHT);
  for(let cy=cy0;cy<=cy1;cy++)for(let cx=cx0;cx<=cx1;cx++){const cv=chunkOf(cx,cy,paint);if(!cv)return false;c.drawImage(cv,Math.floor(cx*CHP-camera.x),Math.floor(cy*CHP-camera.y))}
  // precarga una ficha del anillo exterior por fotograma para que caminar no genere tirones
  let budget=1;for(let cy=cy0-1;cy<=cy1+1&&budget>0;cy++)for(let cx=cx0-1;cx<=cx1+1&&budget>0;cx++){if(cy>=cy0&&cy<=cy1&&cx>=cx0&&cx<=cx1)continue;if(!CH.map.has((cx+4096)*8192+(cy+4096))){chunkOf(cx,cy,paint);budget--}}
  return true}catch(e){S.dead=true;try{console.warn('WorldFX desactivado:',e)}catch(_){}return false}}
function invalidate(){CH.map.clear()}
const sprites=new Map();
function bake(key,w,h,fn){if(S.noSprites)return null;let s=sprites.get(key);if(s!==undefined)return s;s=null;const m=mkCanvas(w,h);if(m){fn(m.g);s=m.cv}sprites.set(key,s);if(sprites.size>400){sprites.clear()}return s}

/* ---------- Manchas suaves de suelo (celdas de 8 px; horizontales contiguas se fusionan) ---------- */
function patch(px,py,s){return Math.sin(px*.105+Math.sin(py*.07+s)*1.9)+Math.sin(py*.118+Math.cos(px*.066-s)*1.7)+.6*Math.sin((px+py)*.19+s*2)}
function paintMask(c,x,y,dark,light){
 const bx=S.tx*32,by=S.ty*32,ga=c.globalAlpha;c.globalAlpha=.7;
 for(let j=0;j<4;j++){let i=0;const q=[0,0,0,0];for(let k=0;k<4;k++){const v=patch(bx+k*8,by+j*8,S.sp);q[k]=v>1.2?2:v<-1.2?1:0}
  while(i<4){const v=q[i];if(!v){i++;continue}let e=i+1;while(e<4&&q[e]===v)e++;c.fillStyle=v===1?dark:light;c.fillRect(x+i*8,y+j*8,(e-i)*8,8);i=e}}
 c.globalAlpha=ga}

/* ---------- Paletas y bordes ---------- */
const GRASS={pradera:['#97b57c','#6c9460','#c2d6a0'],bosque:['#749568','#56784e','#a0bd8c'],selva:['#537e59','#386244','#88b472'],pantano:['#727f59','#556543','#9ba67a']};
const BIOME_I={pradera:0,bosque:1,selva:2,pantano:3};
const RANK={water:0,sand:1,path:2,rock:3,snow:3,grass:4};
function baseCol(t,k){
 if(k==='grass')return(GRASS[t.biome]||GRASS.pradera)[0];
 if(k==='snow')return'#cdd9d4';if(k==='rock')return t.biome==='volcán'?'#78685d':'#98a49a';if(k==='sand')return'#cfb97e';
 return t.ground==='paved'?'#bfc0a7':'#c3bc94';
}
/* Franja irregular del suelo vecino de mayor rango que entra 2-4 px en esta casilla. side: 0 N, 1 E, 2 S, 3 W */
function ragged(c,x,y,side,col,lip,tx,ty){
 const d=[];for(let i=0;i<16;i++)d.push(2+Math.floor(h2(tx*16+i,ty*4+side,S.seed+77)*3));
 const strip=(depth,color)=>{c.fillStyle=color;let i=0;while(i<16){if(d[i]<depth){i++;continue}let e=i+1;while(e<16&&d[e]>=depth)e++;
  if(side===0)c.fillRect(x+i*2,y,(e-i)*2,depth);else if(side===2)c.fillRect(x+i*2,y+32-depth,(e-i)*2,depth);else if(side===3)c.fillRect(x,y+i*2,depth,(e-i)*2);else c.fillRect(x+32-depth,y+i*2,depth,(e-i)*2);i=e}};
 if(lip){strip(2,lip);strip(3,lip);strip(4,lip);}
 // el borde oscuro asoma 1 px por debajo de cada nivel
 const lvl=(depth)=>{c.fillStyle=col;let i=0;while(i<16){if(d[i]<depth){i++;continue}let e=i+1;while(e<16&&d[e]>=depth)e++;
  const dd=depth-(lip?1:0);if(side===0)c.fillRect(x+i*2,y,(e-i)*2,dd);else if(side===2)c.fillRect(x+i*2,y+32-dd,(e-i)*2,dd);else if(side===3)c.fillRect(x,y+i*2,dd,(e-i)*2);else c.fillRect(x+32-dd,y+i*2,dd,(e-i)*2);i=e}};
 lvl(2);lvl(3);lvl(4);
}
function blend(c,x,y,t,k,cn,tx,ty,nbTiles){
 const r=RANK[k];if(r===undefined||r<=0)return;
 for(let s=0;s<4;s++){const nk=cn[s],nr=RANK[nk];if(nr===undefined||nr<=r)continue;
  const nt=nbTiles[s];if(nk==='path'&&nt&&nt.ground==='paved')continue;
  ragged(c,x,y,s,baseCol(nt,nk),nk==='grass'?'rgba(40,86,52,.30)':null,tx,ty)}
}
/* Sombra proyectada por acantilados y muros (sol arriba-izquierda) */
function cast(c,x,y,cn,cave){
 const col=cave?'0,8,14':'22,44,44';
 if(cn[0]==='cliff'||isWallC(cn[0])){c.fillStyle='rgba('+col+','+(cave?.30:.24)+')';c.fillRect(x,y,32,3);c.fillStyle='rgba('+col+','+(cave?.19:.15)+')';c.fillRect(x,y+3,32,3);c.fillStyle='rgba('+col+','+(cave?.09:.07)+')';c.fillRect(x,y+6,32,3)}
 if(cn[3]==='cliff'||isWallC(cn[3])){c.fillStyle='rgba('+col+','+(cave?.22:.17)+')';c.fillRect(x,y,3,32);c.fillStyle='rgba('+col+','+(cave?.11:.08)+')';c.fillRect(x+3,y,3,32)}
}

/* ---------- Casillas: parte estática (va al fragmento de suelo) y parte animada (cada fotograma) ---------- */
const WHITE55='rgba(238,252,246,.62)',WHITE30='rgba(220,244,240,.34)';
let tuftCv=null;
function tuftAtlas(){if(tuftCv!==null)return tuftCv;tuftCv=false;const m=mkCanvas(27,36);if(!m)return tuftCv;const g=m.g;
 for(let b=0;b<4;b++){const p=GRASS[['pradera','bosque','selva','pantano'][b]];for(let s=-1;s<=1;s++){const X=(s+1)*9+1,Y=b*9+6;
  g.fillStyle='rgba(30,70,45,.22)';g.fillRect(X-1,Y+1,7,1);g.fillStyle=p[1];g.fillRect(X,Y-3,1,4);g.fillRect(X+4,Y-3,1,4);g.fillStyle=p[2];g.fillRect(X+2,Y-5,1,6);g.fillRect(X+2+s,Y-6,1,1);g.fillStyle=p[1];g.fillRect(X+1+s,Y-4,1,1)}}
 tuftCv=m.cv;return tuftCv}
/* ---------- Decoración suelta (sin colisión): flores, hongos, arbustos, huesos, brasas... ---------- */
function shadowEll(c,x,y,rx,ry){c.fillStyle='rgba(16,42,34,.22)';ell(c,x+1,y,rx,ry)}
function bush(c,x,y,pal){shadowEll(c,x+2,y,8,2);c.fillStyle=pal[0];ell(c,x,y-4,7,5);c.fillStyle=pal[1];ell(c,x-1,y-5,6,4);c.fillStyle=pal[2];ell(c,x-3,y-7,3,2);rc(c,pal[3]||pal[2],x-4,y-8,2,1)}
const FLOWERS=[['#fffbe8','#f2d34a'],['#f7a8c4','#fff1f6'],['#f2d34a','#fff6b0'],['#8ab4f0','#e6f0ff'],['#e8765f','#ffd1c4'],['#c79af0','#f3e6ff']];
function flowers(c,x,y,h,n){const f=FLOWERS[Math.floor(h*FLOWERS.length*7)%FLOWERS.length];
 for(let i=0;i<n;i++){const X=x+Math.floor(h2(i,Math.floor(h*999),1)*12)-6,Y=y+Math.floor(h2(i,Math.floor(h*999),2)*8)-4;rc(c,'#4e7a45',X,Y+2,1,3);rc(c,'#6c9a52',X-1,Y+3,1,1);rc(c,f[0],X,Y-1,1,3);rc(c,f[0],X-1,Y,3,1);rc(c,f[1],X,Y,1,1)}}
function mushroom(c,x,y,glow){const cap=glow?'#6fd6c8':'#d2543f',dot=glow?'#e2fff6':'#fff4dc';shadowEll(c,x+1,y+1,4,1);rc(c,'#efe3c9',x,y-2,2,3);rc(c,'#c9b896',x+1,y-2,1,3);rc(c,cap,x-2,y-4,6,2);rc(c,cap,x-1,y-5,4,1);rc(c,dot,x-1,y-4,1,1);rc(c,dot,x+2,y-5,1,1)}
function leafLitter(c,x,y,h){const cols=['#d99a3d','#c26a2d','#e6c04e','#9c5a2c'];for(let i=0;i<5;i++){rc(c,cols[(i+Math.floor(h*9))%4],x+Math.floor(h2(i,Math.floor(h*999),3)*20)-10,y+Math.floor(h2(i,Math.floor(h*999),4)*10)-5,2,1)}}
function decorGrass(c,x,y,t,tx,ty){
 if(t.obstacle||t.deco)return;const u=h2(tx,ty,200),b=t.biome,k=t.town?.6:1,X=x+8+Math.floor(h2(tx,ty,201)*16),Y=y+12+Math.floor(h2(tx,ty,202)*14);
 if(b==='bosque'){if(u<.07*k)mushroom(c,X,Y,false),mushroom(c,X+6,Y+3,false);else if(u<.17*k)leafLitter(c,X,Y,u);else if(u<.2*k)bush(c,X,Y,['#2d5a3d','#3f7a48','#5f9a58','#93c46c'])}
 else if(b==='selva'){if(u<.06*k){rc(c,'#4a8f5a',X-3,Y,7,2);rc(c,'#7cc263',X-2,Y-1,5,1);rc(c,'#e06fae',X,Y-3,2,2);rc(c,'#ffd1e6',X,Y-3,1,1)}else if(u<.13*k)leafLitter(c,X,Y,u)}
 else if(b==='pantano'){if(u<.07*k){rc(c,'#6a7a4a',X,Y-6,1,8);rc(c,'#4d3a2a',X-1,Y-9,3,4);rc(c,'#7a5c3d',X-1,Y-9,1,3)}else if(u<.11*k){c.fillStyle='rgba(72,104,110,.7)';ell(c,X,Y,6,2);rc(c,'rgba(200,230,230,.5)',X-3,Y-1,3,1)}}
 else if(b==='montaña'){if(u<.08*k)flowers(c,X,Y,u,3);else if(u<.12*k)bush(c,X,Y,['#4a6a54','#5f8466','#86a884','#b4cdaa'])}
 else{if(u<.13*k)flowers(c,X,Y,u,3);else if(u<.17*k)bush(c,X,Y,['#2d5a3d','#3f7a48','#5f9a58','#93c46c'])}
}
function decorSand(c,x,y,t,tx,ty){
 if(t.obstacle||t.deco)return;const u=h2(tx,ty,210),X=x+8+Math.floor(h2(tx,ty,211)*16),Y=y+12+Math.floor(h2(tx,ty,212)*14);
 if(S.base==='coast'){if(u<.03){rc(c,'#e8825f',X-3,Y,7,1);rc(c,'#e8825f',X,Y-3,1,7);rc(c,'#e8825f',X-2,Y-2,1,1);rc(c,'#e8825f',X+2,Y-2,1,1);rc(c,'#e8825f',X-2,Y+2,1,1);rc(c,'#e8825f',X+2,Y+2,1,1);rc(c,'#ffd0a8',X,Y,1,1)}else if(u<.07){rc(c,'#f4e9e1',X,Y,4,2);rc(c,'#d9a79b',X+1,Y+1,2,1)}else if(u<.09){rc(c,'#7a6a4e',X-5,Y,11,2);rc(c,'#a08c68',X-5,Y,11,1)}}
 else{if(u<.09){for(let i=-2;i<=2;i++){rc(c,'#b89f58',X+i*2,Y-3+Math.abs(i),1,4-Math.abs(i)+1);rc(c,'#d9c47a',X+i*2,Y-4+Math.abs(i),1,1)}rc(c,'#8a7440',X-5,Y+2,11,1)}
  else if(u<.1){rc(c,'#efe8d4',X,Y,6,2);rc(c,'#efe8d4',X+5,Y-2,3,3);rc(c,'#d3cbb2',X+1,Y+2,5,1);rc(c,'#3b3a36',X+6,Y-1,1,1)}}
}
function decorSnow(c,x,y,t,tx,ty){
 if(t.obstacle||t.deco)return;const u=h2(tx,ty,220),X=x+8+Math.floor(h2(tx,ty,221)*16),Y=y+12+Math.floor(h2(tx,ty,222)*14);
 if(u<.09){c.fillStyle='rgba(120,150,190,.45)';ell(c,X+1,Y+1,8,3);c.fillStyle='#f4f9fb';ell(c,X,Y,7,3);c.fillStyle='#ffffff';ell(c,X-2,Y-1,3,1)}
 else if(u<.13){rc(c,'#6e5a46',X,Y,7,1);rc(c,'#6e5a46',X+2,Y-2,1,3);rc(c,'#6e5a46',X+5,Y-3,1,3);rc(c,'#f4f9fb',X,Y-1,5,1)}
 else if(u<.16){rc(c,'#7fd0e0',X,Y,2,4);rc(c,'#bdeef5',X,Y,1,3);rc(c,'#7fd0e0',X+3,Y+1,2,3);rc(c,'#e6fbff',X+3,Y+1,1,2)}
}
function decorRock(c,x,y,t,tx,ty){
 if(t.obstacle||t.deco)return;const u=h2(tx,ty,230),X=x+8+Math.floor(h2(tx,ty,231)*16),Y=y+12+Math.floor(h2(tx,ty,232)*14);
 if(t.biome==='volcán'){if(u<.07){rc(c,'#2a1410',X-1,Y-1,10,3);rc(c,'#f08a3a',X,Y,3,1);rc(c,'#ffd27a',X+1,Y,1,1);rc(c,'#f08a3a',X+3,Y+1,3,1);rc(c,'#f08a3a',X+6,Y,2,1);rc(c,'#c4491f',X+1,Y+1,2,1)}else if(u<.1){rc(c,'#1d1a1c',X,Y-2,3,4);rc(c,'#4a4650',X,Y-2,1,3);rc(c,'#1d1a1c',X+4,Y,2,2)}}
 else if(u<.08){rc(c,'rgba(120,150,96,.6)',X,Y,7,3);rc(c,'rgba(160,190,120,.6)',X+1,Y,3,1)}
 else if(u<.13){shadowEll(c,X+1,Y+2,5,1);rc(c,'#7c8e80',X,Y-1,4,3);rc(c,'#a5b4a0',X,Y-1,2,1);rc(c,'#7c8e80',X+5,Y+1,3,2);rc(c,'#a5b4a0',X+5,Y+1,1,1)}
}
function decorCave(c,x,y,t,tx,ty){
 const u=h2(tx,ty,240),X=x+8+Math.floor(h2(tx,ty,241)*16),Y=y+14+Math.floor(h2(tx,ty,242)*12);
 if(u<.07){rc(c,'rgba(20,28,28,.3)',X+1,Y+2,8,1);rc(c,'#7f8c75',X,Y,3,2);rc(c,'#a8b49a',X,Y,2,1);rc(c,'#7f8c75',X+4,Y+1,2,2);rc(c,'#6a7664',X+7,Y+1,2,1)}
 else if(u<.1&&(S.base==='marsh'||S.base==='forest'||S.base==='river'))mushroom(c,X,Y,true);
}
function grassS(c,x,y,t,tx,ty,cn){
 const p=GRASS[t.biome]||GRASS.pradera;
 paintMask(c,x,y,'rgba(28,74,48,.085)','rgba(250,250,190,.075)');decorGrass(c,x,y,t,tx,ty);
 const d=t.detail;
 if(d>.78){const X=x+6+Math.floor(h2(tx,ty,23)*18),Y=y+8+Math.floor(h2(tx,ty,24)*8);rc(c,p[1],X,Y-2,1,3);rc(c,p[2],X+1,Y-3,1,4);rc(c,p[1],X+2,Y-2,1,3)}
 for(let s=0;s<4;s++)if(cn[s]==='water'){c.fillStyle='rgba(40,70,48,.30)';if(s===0)c.fillRect(x,y,32,2);else if(s===2)c.fillRect(x,y+30,32,2);else if(s===3)c.fillRect(x,y,2,32);else c.fillRect(x+30,y,2,32)}
}
function grassA(c,x,y,t,tx,ty){
 const d=t.detail;if(!(d>.12&&d<.66))return;
 const bx=4+Math.floor(h2(tx,ty,21)*22),by=11+Math.floor(h2(tx,ty,22)*17),sw=S.reduced?0:Math.round(Math.sin(S.T*1.7+tx*.8+ty*.5)),at=tuftAtlas();
 if(at){c.drawImage(at,(sw+1)*9,(BIOME_I[t.biome]||0)*9,8,8,x+bx-1,y+by-6,8,8)}
 else{const p=GRASS[t.biome]||GRASS.pradera,X=x+bx,Y=y+by;rc(c,p[1],X,Y-3,1,4);rc(c,p[2],X+2,Y-5,1,6);rc(c,p[1],X+4,Y-3,1,4)}
}
function pathS(c,x,y,t,tx,ty,cn,nt){
 if(t.plan==='farm')return;
 if(t.ground==='trail'){
  paintMask(c,x,y,'rgba(110,86,50,.10)','rgba(255,246,200,.12)');
  const a=h2(tx,ty,31);if(a>.45){const X=x+3+Math.floor(h2(tx,ty,32)*22),Y=y+4+Math.floor(h2(tx,ty,33)*22);rc(c,'rgba(120,104,70,.55)',X,Y+1,3,2);rc(c,'rgba(240,232,196,.7)',X,Y,2,1)}
  if(a<.3){const X=x+5+Math.floor(h2(tx,ty,34)*20),Y=y+6+Math.floor(h2(tx,ty,35)*20);rc(c,'rgba(120,104,70,.45)',X,Y,2,1);rc(c,'rgba(120,104,70,.35)',X+4,Y+5,1,1)}
  blend(c,x,y,t,'path',cn,tx,ty,nt)
 }else{
  paintMask(c,x,y,'rgba(70,74,60,.07)','rgba(255,255,236,.09)');
  for(let s=0;s<4;s++)if(cn[s]==='grass'){if(s===0){rc(c,'#8a967c',x,y,32,2);rc(c,'rgba(255,255,230,.28)',x,y+2,32,1)}else if(s===2){rc(c,'rgba(255,255,230,.30)',x,y+29,32,1);rc(c,'#8a967c',x,y+30,32,2)}else if(s===3){rc(c,'#8a967c',x,y,2,32);rc(c,'rgba(255,255,230,.28)',x+2,y,1,32)}else{rc(c,'rgba(255,255,230,.30)',x+29,y,1,32);rc(c,'#8a967c',x+30,y,2,32)}}
  const a=h2(tx,ty,36);if(a>.7){rc(c,'rgba(70,74,60,.22)',x+6+Math.floor(a*10),y+8+Math.floor(h2(tx,ty,37)*14),6,1)}
 }
}
function sandS(c,x,y,t,tx,ty,cn,nt){
 paintMask(c,x,y,'rgba(138,104,40,.09)','rgba(255,244,190,.13)');
 if(h2(tx,ty,31)>.32){const rx=3+Math.floor(h2(tx,ty,32)*10),ry=6+Math.floor(h2(tx,ty,33)*16);rc(c,'rgba(240,226,170,.55)',x+rx,y+ry,13,1);rc(c,'rgba(176,146,84,.38)',x+rx+2,y+ry+1,13,1);rc(c,'rgba(176,146,84,.30)',x+rx+14,y+ry+2,5,1)}
 if(S.base==='coast'&&h2(tx,ty,38)>.93){rc(c,'#f4e9e1',x+9,y+20,3,2);rc(c,'#d9a79b',x+10,y+22,2,1)}
 for(let s=0;s<4;s++)if(cn[s]==='water'){c.fillStyle='rgba(112,86,44,.20)';if(s===0)c.fillRect(x,y,32,5);else if(s===2)c.fillRect(x,y+27,32,5);else if(s===3)c.fillRect(x,y,5,32);else c.fillRect(x+27,y,5,32)}
 decorSand(c,x,y,t,tx,ty);blend(c,x,y,t,'sand',cn,tx,ty,nt)
}
function snowS(c,x,y,t,tx,ty,cn,nt){
 paintMask(c,x,y,'rgba(98,130,176,.12)','rgba(255,255,255,.16)');
 if(h2(tx,ty,45)>.88){rc(c,'rgba(120,150,190,.35)',x+8,y+20,7,2);rc(c,'rgba(255,255,255,.65)',x+9,y+19,5,1)}
 decorSnow(c,x,y,t,tx,ty);blend(c,x,y,t,'snow',cn,tx,ty,nt)
}
function twinkle(c,X,Y){c.fillStyle='#ffffff';c.fillRect(X,Y,1,1);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(X-1,Y,3,1);c.fillRect(X,Y-1,1,3)}
function snowA(c,x,y,t,tx,ty){
 if(S.reduced||h2(tx,ty,41)>=.34)return;const ph=(S.T*.8+h2(tx,ty,42)*9)%3.2;
 if(ph<.22)twinkle(c,x+4+Math.floor(h2(tx,ty,43)*22),y+4+Math.floor(h2(tx,ty,44)*22))
}
function rockS(c,x,y,t,tx,ty,cn,nt){
 const hot=t.biome==='volcán';
 paintMask(c,x,y,hot?'rgba(30,14,12,.085)':'rgba(40,58,56,.09)',hot?'rgba(255,196,150,.055)':'rgba(255,255,236,.08)');
 const a=h2(tx,ty,51);
 if(a>.72){const X=x+4+Math.floor(h2(tx,ty,52)*22),Y=y+6+Math.floor(h2(tx,ty,53)*20);rc(c,'rgba(20,20,20,.28)',X+1,Y+2,5,2);rc(c,hot?'#8c7a68':'#aeb8a6',X,Y,4,3);rc(c,'rgba(255,255,235,.38)',X,Y,2,1)}
 else if(a<.12){const X=x+6+Math.floor(h2(tx,ty,54)*14),Y=y+8+Math.floor(h2(tx,ty,55)*14);rc(c,'rgba(20,18,18,.32)',X,Y,5,1);rc(c,'rgba(20,18,18,.32)',X+4,Y+1,3,1);rc(c,'rgba(20,18,18,.32)',X+6,Y+2,1,3)}
 decorRock(c,x,y,t,tx,ty);blend(c,x,y,t,'rock',cn,tx,ty,nt)
}
function rockA(c,x,y,t,tx,ty){
 if(S.reduced||t.biome!=='volcán'||h2(tx,ty,56)>=.2)return;const ph=(S.T*.6+h2(tx,ty,57)*7)%4;
 if(ph<.9)rc(c,'rgba(255,150,60,'+(.85-ph*.8).toFixed(2)+')',x+5+Math.floor(h2(tx,ty,58)*22),y+5+Math.floor(h2(tx,ty,59)*22),1,1)
}
function waterA(c,x,y,t,tx,ty,cn){
 const T=S.T,mar=t.biome==='pantano';
 for(let j=0;j<2;j++)for(let i=0;i<2;i++){const px=tx*32+i*16,py=ty*32+j*16,v=Math.sin(px*.035+T*.6)+Math.sin(py*.041-T*.45+px*.012);if(v>1.0)rc(c,'rgba(232,255,244,.075)',x+i*16,y+j*16,16,16);else if(v<-1.0)rc(c,'rgba(10,58,90,.085)',x+i*16,y+j*16,16,16)}
 for(let k=0;k<2;k++){const row=5+Math.floor(h2(tx,ty,3+k)*22),ofs=Math.floor(T*(4+k*2)+h2(tx,ty,6+k)*32)%38-3,x0=Math.max(0,ofs-6),x1=Math.min(32,ofs+6);if(x1>x0){rc(c,'rgba(236,252,246,.38)',x+x0,y+row,x1-x0,1);rc(c,'rgba(10,58,90,.14)',x+x0+1,y+row+1,Math.max(0,x1-x0-2),1)}}
 if(!S.reduced&&h2(tx,ty,9)<.38){const ph=(S.T*.9+h2(tx,ty,10)*7)%3.4;if(ph<.2)twinkle(c,x+4+Math.floor(h2(tx,ty,11)*24),y+4+Math.floor(h2(tx,ty,12)*24))}
 if(mar&&h2(tx,ty,13)>.76){const X=x+5+Math.floor(h2(tx,ty,14)*14),Y=y+8+Math.floor(h2(tx,ty,15)*14);rc(c,'rgba(20,50,36,.35)',X+1,Y+4,9,1);rc(c,'#4e7a45',X+1,Y,7,1);rc(c,'#5f8c4f',X,Y+1,9,2);rc(c,'#4e7a45',X+1,Y+3,7,1);rc(c,'#697f75',X+5,Y+1,3,1);if(h2(tx,ty,16)>.6){rc(c,'#f4b3cb',X+3,Y-1,2,2);rc(c,'#fff0f5',X+3,Y-1,1,1)}}
 if(isLand(cn[0])||cn[0]==='bridge'){rc(c,'rgba(8,44,66,.24)',x,y,32,4);rc(c,'rgba(8,44,66,.11)',x,y+4,32,4)}
 if(isLand(cn[3])||cn[3]==='bridge'){rc(c,'rgba(8,44,66,.19)',x,y,4,32);rc(c,'rgba(8,44,66,.09)',x+4,y,4,32)}
 const th=1+Math.round((Math.sin(T*1.6+tx*.9+ty*1.1)+1)*.9);
 for(let s=0;s<4;s++){if(!isLand(cn[s]))continue;
  for(let i=0;i<8;i++){if(h2(tx*8+i,ty+s*31,4)<.2)continue;
   if(s===0){rc(c,WHITE55,x+i*4,y,4,th);rc(c,WHITE30,x+i*4,y+th,4,2)}
   else if(s===2){rc(c,WHITE55,x+i*4,y+32-th,4,th);rc(c,WHITE30,x+i*4,y+30-th,4,2)}
   else if(s===3){rc(c,WHITE55,x,y+i*4,th,4);rc(c,WHITE30,x+th,y+i*4,2,4)}
   else{rc(c,WHITE55,x+32-th,y+i*4,th,4);rc(c,WHITE30,x+30-th,y+i*4,2,4)}}}
}
function lavaS(c,x,y,t,tx,ty){paintMask(c,x,y,'rgba(70,16,8,.30)','rgba(255,220,130,.14)')}
function lavaA(c,x,y,t,tx,ty){
 if(!S.reduced){const ph=(S.T*.7+h2(tx,ty,51)*5)%3;if(ph<1.3){const r=1+Math.floor(ph*3),X=x+6+Math.floor(h2(tx,ty,52)*18),Y=y+6+Math.floor(h2(tx,ty,53)*18);rc(c,'#f9d57e',X-r,Y-r,r*2,r*2);rc(c,'#fff2b8',X-1,Y-1,2,2)}}
 S.lights.push([x+16,y+16,46,'255,120,40',.5,h2(tx,ty,54)*6.28]);
}
function iceS(c,x,y,t,tx,ty){
 if(h2(tx,ty,61)>.35){const X=x+4+Math.floor(h2(tx,ty,62)*12),Y=y+4+Math.floor(h2(tx,ty,63)*12);for(let i=0;i<9;i++)rc(c,'rgba(255,255,255,.55)',X+i,Y+8-i,1,1);rc(c,'rgba(255,255,255,.3)',X+3,Y+9,6,1)}
}
function iceA(c,x,y,t,tx,ty){
 if(S.reduced||h2(tx,ty,64)>=.4)return;const ph=(S.T*.8+h2(tx,ty,65)*7)%3;
 if(ph<.2)twinkle(c,x+4+Math.floor(h2(tx,ty,66)*22),y+4+Math.floor(h2(tx,ty,67)*22))
}
function wallS(c,x,y,t,tx,ty,cn){
 if(!isWallC(cn[0])){rc(c,'rgba(225,245,235,.13)',x,y,32,2)}
 if(!isWallC(cn[2])&&cn[2]!=='none'){rc(c,'rgba(0,0,0,.14)',x,y+22,32,4);rc(c,'rgba(0,0,0,.24)',x,y+26,32,6)}
 if(h2(tx,ty,71)>.86){const X=x+3+Math.floor(h2(tx,ty,72)*18);rc(c,'rgba(86,130,80,.55)',X,y+13,7,2);rc(c,'rgba(120,170,100,.45)',X+1,y+12,3,1)}
}
function floorS(c,x,y,t,tx,ty,cn){
 const a=h2(tx,ty,61);
 if(a>.84){const X=x+6+Math.floor(h2(tx,ty,62)*14),Y=y+7+Math.floor(h2(tx,ty,63)*14);rc(c,'rgba(16,26,26,.30)',X,Y,6,1);rc(c,'rgba(16,26,26,.30)',X+5,Y+1,3,1);rc(c,'rgba(16,26,26,.30)',X+7,Y+2,1,4)}
 else if(a<.1&&(S.base==='forest'||S.base==='marsh'||S.base==='campina')){const X=x+4+Math.floor(h2(tx,ty,64)*18),Y=y+8+Math.floor(h2(tx,ty,65)*16);rc(c,'rgba(78,128,72,.55)',X,Y,8,3);rc(c,'rgba(118,168,98,.5)',X+2,Y-1,4,1)}
 else if(a>.5&&a<.58&&(S.base==='river'||S.base==='coast')){const X=x+5+Math.floor(h2(tx,ty,66)*12),Y=y+9+Math.floor(h2(tx,ty,67)*12);rc(c,'rgba(110,170,190,.45)',X,Y,12,4);rc(c,'rgba(235,250,255,.4)',X+2,Y+1,4,1)}
 decorCave(c,x,y,t,tx,ty);cast(c,x,y,cn,true);
}
function cliffS(c,x,y,t,tx,ty,cn){
 // la cara frontal ya viene dibujada con detalle; aquí solo se matiza la superficie de la meseta
 if(t.edgeSouth)return;
 paintMask(c,x,y,'rgba(34,48,44,.08)','rgba(255,255,230,.08)');
 if(h2(tx,ty,85)>.8){const X=x+5+Math.floor(h2(tx,ty,86)*18),Y=y+6+Math.floor(h2(tx,ty,87)*10);rc(c,'rgba(20,24,20,.22)',X+1,Y+2,4,1);rc(c,'rgba(255,255,230,.2)',X,Y,3,2)}
}
const STATIC={grass:grassS,path:pathS,sand:sandS,snow:snowS,rock:rockS,lava:lavaS,ice:iceS,wall:wallS,floor:floorS,cliff:cliffS};
const ANIM={grass:grassA,snow:snowA,rock:rockA,water:waterA,lava:lavaA,ice:iceA};
const castable={grass:1,path:1,sand:1,snow:1,rock:1};
function staticTile(c,x,y,t,tx,ty){
 const k=cls(t),st=STATIC[k];if(!st)return;
 const nt=[nb(tx,ty-1),nb(tx+1,ty),nb(tx,ty+1),nb(tx-1,ty)],cn=[cls(nt[0]),cls(nt[1]),cls(nt[2]),cls(nt[3])];
 S.tx=tx;S.ty=ty;st(c,x,y,t,tx,ty,cn,nt);if(castable[k])cast(c,x,y,cn,S.kind==='cave')}
const staticTileS=safe(staticTile);
/* Parte animada de una casilla que ya está en un fragmento (macollas, destellos, brasas) */
const animTile=safe(function(c,x,y,t,tx,ty){const an=ANIM[cls(t)];if(an&&an!==waterA&&an!==lavaA&&an!==iceA)an(c,x,y,t,tx,ty)});
/* Casilla completa (estática + animada): agua, lava, hielo, puentes y cuando no hay caché de fragmentos */
const tile=safe(function(c,x,y,t,tx,ty){
 if(S.noTiles||!S.getTile||!t||t.gym||t.boundary||t.ground==='waterfall')return;
 const k=cls(t),st=STATIC[k],an=ANIM[k];if(!st&&!an)return;
 const nt=[nb(tx,ty-1),nb(tx+1,ty),nb(tx,ty+1),nb(tx-1,ty)],cn=[cls(nt[0]),cls(nt[1]),cls(nt[2]),cls(nt[3])];
 S.tx=tx;S.ty=ty;
 if(st){st(c,x,y,t,tx,ty,cn,nt);if(castable[k])cast(c,x,y,cn,S.kind==='cave')}
 if(an)an(c,x,y,t,tx,ty,cn,nt);
});

/* ---------- Sombras y objetos ---------- */
function ell(c,cx,cy,rx,ry){for(let j=-ry;j<=ry;j++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(j*j)/((ry+.6)*(ry+.6)))));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}}
function shadowDraw(c,x,y,rx,ry,a,ox){ox=ox||0;c.fillStyle='rgba(16,42,34,'+(a*.55).toFixed(3)+')';ell(c,x+ox,y+1,rx,ry);c.fillStyle='rgba(16,42,34,'+a.toFixed(3)+')';ell(c,x+ox+1,y+1,Math.round(rx*.72),Math.max(1,Math.round(ry*.66)))}
function shadow(c,x,y,rx,ry,a,ox){
 const w=2*(rx+(ox||0)+3),h=2*ry+6,key='sh|'+rx+'|'+ry+'|'+a+'|'+(ox||0),sp=bake(key,w,h,g=>shadowDraw(g,Math.ceil(w/2)-(ox||0),ry+2,rx,ry,a,ox));
 if(sp)c.drawImage(sp,Math.round(x)-Math.ceil(w/2)+(ox||0),Math.round(y)-ry-2);else shadowDraw(c,x,y,rx,ry,a,ox)}
function buildingShadow(c,x,bottom,w){c.fillStyle='rgba(16,42,34,.15)';c.fillRect(Math.round(x+8),Math.round(bottom),w+4,4);c.fillStyle='rgba(16,42,34,.10)';c.fillRect(Math.round(x+13),Math.round(bottom+4),w,4);c.fillStyle='rgba(16,42,34,.05)';c.fillRect(Math.round(x+18),Math.round(bottom+8),w-6,4)}
const SH={tree:[22,7,.26,9],pine:[17,6,.26,7],palm:[25,6,.24,13],cactus:[10,4,.24,4],crystal:[18,4,.20,3],stump:[13,4,.24,3],rock:[16,5,.27,3],pillar:[11,4,.26,5],basalt:[16,5,.27,3]};
const HI='rgba(214,240,150,.34)',HI2='rgba(255,255,214,.26)',LO='rgba(8,34,30,.34)',LO2='rgba(8,34,30,.22)';
function extras(c,x,y,t,k){
 const d=t.detail||0;
 if(k==='crystal'){
  S.lights.push([x,y-15,52,'110,225,236',.55,d*6.28]);
  if(!S.reduced){const ph=(S.time*.9+d*9)%2.6;if(ph<.25){for(const [tx2,ty2] of [[-10,-22],[-1,-35],[9,-23]]){rc(c,'#ffffff',x+tx2,y+ty2,2,2);rc(c,'rgba(255,255,255,.7)',x+tx2-1,y+ty2+.5,4,1)}}}
 }
}
const DIM={tree:[72,36,70,60],pine:[72,36,70,60],palm:[92,46,64,54],cactus:[44,22,50,40],rock:[60,30,46,34],basalt:[60,30,46,34],stump:[44,22,36,28],pillar:[48,24,56,44]};
const FM_DIM={cut:[56,28,52,46],strength:[56,28,40,30]},FM_SH={cut:[15,5,.26,6],strength:[17,5,.27,3]};
const obstacle=safe(function(c,x,y,t,draw){
 const fm=t.fieldMove,k=t.obstacle,TA=root.TownArt,s=(fm&&FM_SH[fm])||SH[k]||(TA&&TA.SH[k])||SH.rock;
 if(S.noObst){draw(c,x,y,t);return}
 if(k==='crystal'){shadow(c,x,y,s[0],s[1],s[2],s[3]);draw(c,x,y,t);extras(c,x,y,t,k);return}
 const v=Math.floor((t.detail||0)*16),cold=(root.Frontera?.districtBase?.(t.region||'')||t.region)==='frost',key='ob|'+(fm?'fm-'+fm+'-':'')+k+'|'+(t.biome||'')+'|'+(cold?1:0)+'|'+v+'|'+(t.variant||''),
  dm=(fm&&FM_DIM[fm])||DIM[k]||(TA&&TA.DIM[k])||DIM.rock,OW=dm[0],OX=dm[1],OH=dm[2],OY=dm[3],
  sp=bake(key,OW,OH,g=>{const tt=Object.assign({},t,{detail:(v+.5)/16});shadowDraw(g,OX,OY,s[0],s[1],s[2],s[3]);draw(g,OX,OY,tt);extras(g,OX,OY,tt,k)});
 if(!sp){shadowDraw(c,x,y,s[0],s[1],s[2],s[3]);draw(c,x,y,t);extras(c,x,y,t,k);return}
 const X=x-OX,Y=y-OY;let o1=0,o2=0;
 if(k==='lamp')S.lights.push([x,y-48,72,'255,206,120',.42,(t.detail||0)*6.28]);
 if((k==='tree'||k==='pine'||k==='palm'||k==='oak'||k==='orchard'||k==='blossom')&&!fm&&!S.reduced){
  const a=Math.sin(S.T*1.15+(t.detail||0)*37),gust=.55+.45*Math.sin(S.T*.33),thr=.95-.5*gust,amp=k==='palm'?1.25:1;
  o1=Math.abs(a)>thr/amp?(a>0?1:-1):0;o2=Math.abs(a)>.9?(a>0?1:-1):0}
 if(!o1&&!o2){c.drawImage(sp,X,Y);return}
 c.drawImage(sp,0,0,OW,OY-40,X+o1,Y,OW,OY-40);c.drawImage(sp,0,OY-40,OW,18,X+o2,Y+OY-40,OW,18);c.drawImage(sp,0,OY-22,OW,OH-OY+22,X,Y+OY-22,OW,OH-OY+22);
},function(c,x,y,t,draw){draw(c,x,y,t)});

/* ---------- Luz ambiente, nubes y partículas ---------- */
const GRADE={default:['rgba(255,238,170,.07)','rgba(40,70,110,.06)'],frost:['rgba(235,245,255,.06)','rgba(60,90,150,.11)'],crater:['rgba(255,170,90,.08)','rgba(90,20,30,.12)'],dunes:['rgba(255,214,120,.10)','rgba(150,70,40,.08)'],coast:['rgba(255,245,200,.06)','rgba(20,90,140,.07)'],marsh:['rgba(200,230,160,.05)','rgba(40,80,60,.14)'],forest:['rgba(255,240,150,.06)','rgba(20,60,50,.12)'],cave:['rgba(120,160,200,.04)','rgba(10,20,40,.18)']};
const gradeCache=new Map();
function grade(c,W,H){const key=(S.kind==='cave'?'cave':S.base);let g=gradeCache.get(key);
 if(g===undefined){g=null;const m=mkCanvas(64,36);if(m){const p=GRADE[key]||GRADE.default,gr=m.g.createLinearGradient(0,0,64,36);gr.addColorStop(0,p[0]);gr.addColorStop(1,p[1]);m.g.fillStyle=gr;m.g.fillRect(0,0,64,36);g=m.cv}gradeCache.set(key,g)}
 if(g){const sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(g,0,0,W,H);c.imageSmoothingEnabled=sm}
 else{const p=GRADE[key]||GRADE.default,gr=c.createLinearGradient(0,0,W,H);gr.addColorStop(0,p[0]);gr.addColorStop(1,p[1]);c.fillStyle=gr;c.fillRect(0,0,W,H)}}
let clouds=null;
function buildClouds(){
 if(clouds)return clouds;clouds=[];
 try{if(typeof document==='undefined'||!document.createElement)return clouds;
  const w=128,h=64;
  for(let n=0;n<3;n++){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');if(!g||!g.createImageData)return clouds;const img=g.createImageData(w,h),bl=[];
   for(let i=0;i<7;i++)bl.push([28+h2(n,i,1)*72,18+h2(n,i,2)*28,18+h2(n,i,3)*14,10+h2(n,i,4)*8]);
   for(let y=0;y<h;y++)for(let x=0;x<w;x++){let f=0;for(const b of bl){const dx=(x-b[0])/b[2],dy=(y-b[1])/b[3],d=dx*dx+dy*dy;if(d<1)f+=1-d}
    const edge=Math.min(1,Math.min(x,w-1-x)/6,Math.min(y,h-1-y)/4);f*=edge;const lv=f>1.05?3:f>.55?2:f>.18?1:0;if(!lv)continue;const i=(y*w+x)*4;img.data[i]=18;img.data[i+1]=44;img.data[i+2]=52;img.data[i+3]=[0,5,9,13][lv]}
   g.putImageData(img,0,0);clouds.push(cv)}
 }catch(e){clouds=[]}
 return clouds}
function cloudShadows(c,W,H,cam){
 const cl=buildClouds();if(!cl.length)return;
 const PW=5200,PH=3400,SW=512,SH2=256,T=S.T;
 c.save();c.imageSmoothingEnabled=false;
 for(let i=0;i<2;i++){const sx=wrap(h2(i,3,5)*PW+(9+i*1.7)*T-cam.x,PW)-SW,sy=wrap(h2(i,4,6)*PH+(3+i*.6)*T-cam.y,PH)-SH2;
  if(sx<W&&sx+SW>0&&sy<H&&sy+SH2>0)c.drawImage(cl[i%cl.length],Math.round(sx),Math.round(sy),SW,SH2)}
 c.restore()}
let PX=0,PY=0;
function pp(i,s,W,H,vx,vy,par,cam){const PW=W+40,PH=H+40;PX=wrap(h2(i,s,1)*PW+vx*S.time-cam.x*par,PW)-20;PY=wrap(h2(i,s,2)*PH+vy*S.time-cam.y*par,PH)-20}
const fadeY=H=>{const f=(PY+20)/(H+40);return Math.min(1,f*7,(1-f)*7)};
const fadeX=W=>{const f=(PX+20)/(W+40);return Math.min(1,f*7,(1-f)*7)};
function snow(c,W,H,cam){
 for(let big=0;big<2;big++){c.fillStyle=big?'rgba(247,252,255,.92)':'rgba(236,246,255,.58)';
  for(let i=0;i<(big?26:56);i++){pp(i,big+40,W,H,-10-big*3,(big?46:26)+h2(i,7,3)*16,big?1:.7,cam);const sw=Math.sin(S.time*1.1+i*1.7)*(big?7:4);c.fillRect(Math.round(PX+sw),Math.round(PY),big?2:1,big?2:1)}}
}
function embers(c,W,H,cam){
 c.save();c.globalCompositeOperation='lighter';
 for(let i=0;i<34;i++){pp(i,50,W,H,h2(i,8,3)*10-3,-(16+h2(i,9,3)*28),.9,cam);const f=(PY+20)/(H+40),a=fadeY(H),x=PX+Math.sin(S.time*1.3+i*2.1)*6;
  c.fillStyle='rgba(255,110,40,'+(.10*a).toFixed(3)+')';c.fillRect(Math.round(x)-2,Math.round(PY)-2,5,5);
  c.fillStyle=f>.66?'rgba(255,214,130,'+(.9*a).toFixed(2)+')':f>.33?'rgba(255,150,70,'+(.85*a).toFixed(2)+')':'rgba(224,80,45,'+(.8*a).toFixed(2)+')';c.fillRect(Math.round(x),Math.round(PY),2,2)}
 c.restore()}
function sandWind(c,W,H,cam){
 c.fillStyle='rgba(247,231,178,.30)';
 for(let i=0;i<22;i++){pp(i,60,W,H,190+h2(i,10,3)*90,14,1.1,cam);const a=fadeX(W);if(a<.3)continue;c.fillRect(Math.round(PX),Math.round(PY),8+Math.floor(h2(i,11,3)*10),1)}
 c.fillStyle='rgba(247,231,178,.5)';for(let i=0;i<14;i++){pp(i+40,61,W,H,230+h2(i,12,3)*80,10,1.2,cam);if(fadeX(W)<.3)continue;c.fillRect(Math.round(PX),Math.round(PY),2,1)}
}
function gulls(c,W,H,cam){
 c.fillStyle='rgba(10,40,50,.20)';
 for(let i=0;i<3;i++){const PW=W+500,x=wrap(h2(i,3,13)*PW+(34+i*7)*S.time-cam.x*1.05,PW)-250,y=wrap(h2(i,4,14)*H+Math.sin(S.time*.4+i)*28-cam.y*1.05,H+120)-60,f=Math.floor(S.time*5+i)%3;
  if(x<-12||x>W+12)continue;c.fillRect(Math.round(x)-6,Math.round(y)+(f===1?-1:f===2?1:0),4,1);c.fillRect(Math.round(x)+3,Math.round(y)+(f===1?-1:f===2?1:0),4,1);c.fillRect(Math.round(x)-2,Math.round(y)+1,5,1);c.fillRect(Math.round(x),Math.round(y)+2,1,2)}
}
function fireflies(c,W,H,cam,n,rgb){
 c.save();c.globalCompositeOperation='lighter';
 for(let i=0;i<n;i++){const PW=W+40,PH=H+40,bx=h2(i,3,23)*PW,by=h2(i,4,24)*PH,x=wrap(bx+Math.sin(S.time*(.18+h2(i,5,1)*.2)+i)*50-cam.x*.95,PW)-20,y=wrap(by+Math.sin(S.time*(.23+h2(i,6,1)*.2)+i*2)*34-cam.y*.95,PH)-20,a=Math.max(0,Math.sin(S.time*1.7+i*3.1));
  if(a<.05)continue;c.fillStyle='rgba('+rgb+','+(.13*a).toFixed(3)+')';c.fillRect(Math.round(x)-3,Math.round(y)-3,7,7);c.fillStyle='rgba('+rgb+','+(.95*a).toFixed(2)+')';c.fillRect(Math.round(x),Math.round(y),2,2)}
 c.restore()}
function fog(c,W,H,cam,rgb,a){
 for(let i=0;i<4;i++){const PW=W+760,bw=440,bh=60,x=wrap(h2(i,3,33)*PW+(7+i*3)*S.time-cam.x*.8,PW)-bw-100,y=wrap(h2(i,4,34)*(H+100)-cam.y*.8,H+100)-60;
  c.fillStyle='rgba('+rgb+','+a+')';c.fillRect(Math.round(x),Math.round(y),bw,bh);c.fillRect(Math.round(x)+30,Math.round(y)+10,bw-60,bh-20);c.fillRect(Math.round(x)+70,Math.round(y)+22,bw-140,bh-44)}
}
function leaves(c,W,H,cam){
 const cols=['rgba(155,189,90,.9)','rgba(209,178,76,.9)','rgba(111,158,74,.9)'];
 for(let i=0;i<22;i++){pp(i,70,W,H,-6+h2(i,13,3)*8,20+h2(i,14,3)*16,1.05,cam);const a=fadeY(H);if(a<.4)continue;const x=PX+Math.sin(S.time*1.5+i*1.7)*14;c.fillStyle=cols[i%3];if(Math.floor(S.time*3+i)%2)c.fillRect(Math.round(x),Math.round(PY),3,2);else c.fillRect(Math.round(x),Math.round(PY),2,3)}
}
function petals(c,W,H,cam){
 const cols=['rgba(250,176,204,.95)','rgba(255,214,228,.95)','rgba(246,160,120,.9)'];
 for(let i=0;i<18;i++){pp(i,75,W,H,-8+h2(i,13,3)*10,14+h2(i,14,3)*14,1.04,cam);const a=fadeY(H);if(a<.4)continue;const x=PX+Math.sin(S.time*1.3+i*1.9)*16;c.fillStyle=cols[i%3];if(Math.floor(S.time*3.5+i)%2)c.fillRect(Math.round(x),Math.round(PY),2,2);else c.fillRect(Math.round(x),Math.round(PY),3,1)}
}
function pollen(c,W,H,cam,n,vx,rgb){
 for(let i=0;i<n;i++){pp(i,80,W,H,vx+h2(i,15,3)*6,-2+Math.sin(i)*3,1,cam);const tw=.5+.5*Math.sin(S.time*1.2+i*2.3),x=PX+Math.sin(S.time*.6+i)*5,y=PY+Math.sin(S.time*.8+i*1.3)*4;c.fillStyle='rgba('+rgb+','+(.25+.5*tw).toFixed(2)+')';c.fillRect(Math.round(x),Math.round(y),1,1);if(i%5===0)c.fillRect(Math.round(x),Math.round(y)+1,1,1)}
}
function butterflies(c,W,H,cam){
 const cols=['#ffd24a','#f77f9b','#8bd0ff','#ffffff'];
 for(let i=0;i<4;i++){const PW=W+80,PH=H+80,x=wrap(h2(i,3,43)*PW+Math.sin(S.time*.23+i)*160+S.time*(7+i)-cam.x*1.05,PW)-40,y=wrap(h2(i,4,44)*PH+Math.sin(S.time*.37+i*2)*90-cam.y*1.05,PH)-40,ph=Math.floor(S.time*9+i*3)%3,w=[3,2,1][ph];
  c.fillStyle='rgba(20,40,30,.18)';c.fillRect(Math.round(x)-2,Math.round(y)+9,5,1);
  c.fillStyle=cols[i];c.fillRect(Math.round(x)-w-1,Math.round(y)-1,w,3);c.fillRect(Math.round(x)+2,Math.round(y)-1,w,3);c.fillStyle='#3a3140';c.fillRect(Math.round(x),Math.round(y)-1,1,3)}
}
function motes(c,W,H,cam,rgb,vy,n){
 for(let i=0;i<n;i++){pp(i,90,W,H,3+h2(i,16,3)*4,vy,.9,cam);const a=fadeY(H)*(.25+.35*(.5+.5*Math.sin(S.time*.9+i*2.1)));c.fillStyle='rgba('+rgb+','+a.toFixed(2)+')';c.fillRect(Math.round(PX),Math.round(PY),1,1)}
}
function sparkles(c,W,H,cam,rgb){
 for(let i=0;i<14;i++){pp(i,95,W,H,0,0,.95,cam);const ph=(S.time*.7+h2(i,17,3)*9)%3;if(ph>.3)continue;c.fillStyle='rgba('+rgb+',.9)';c.fillRect(Math.round(PX),Math.round(PY),1,1);c.fillRect(Math.round(PX)-1,Math.round(PY),3,1);c.fillRect(Math.round(PX),Math.round(PY)-1,1,3)}
}
function particles(c,W,H,cam){
 if(S.reduced)return;const b=S.base;
 if(S.kind==='cave'){
  if(b==='crater')embers(c,W,H,cam);else if(b==='frost'){sparkles(c,W,H,cam,'190,240,255');motes(c,W,H,cam,'200,230,245',-4,16)}
  else if(b==='marsh'){fireflies(c,W,H,cam,10,'170,235,110');motes(c,W,H,cam,'170,225,120',-5,16)}
  else if(b==='dunes')motes(c,W,H,cam,'225,205,150',12,26);else motes(c,W,H,cam,'205,225,215',-3,22);
  return}
 switch(b){
  case'frost':snow(c,W,H,cam);break;
  case'crater':embers(c,W,H,cam);break;
  case'dunes':sandWind(c,W,H,cam);break;
  case'coast':gulls(c,W,H,cam);pollen(c,W,H,cam,10,16,'255,252,225');break;
  case'marsh':fog(c,W,H,cam,'205,225,205','.035');fireflies(c,W,H,cam,14,'200,245,110');break;
  case'forest':leaves(c,W,H,cam);fireflies(c,W,H,cam,5,'235,250,150');break;
  case'river':pollen(c,W,H,cam,24,10,'255,248,190');break;
  case'highlands':pollen(c,W,H,cam,20,38,'245,245,235');break;
  default:butterflies(c,W,H,cam);pollen(c,W,H,cam,16,8,'255,246,190');if(S.kind==='town')petals(c,W,H,cam)}
}
const ambient=safe(function(c,W,H,cam,o){
 if(S.kind==='gym')return;
 if(!S.noGrade)grade(c,W,H);
 if(!S.noClouds&&S.kind!=='cave'&&!(o&&o.dark))cloudShadows(c,W,H,cam);
 if(!S.noParticles)particles(c,W,H,cam);
},function(c,W,H){c.fillStyle='#17382c0b';c.fillRect(0,0,W,H)});

/* ---------- Brillos aditivos (después de la oscuridad de las cuevas) ---------- */
const glowCache=new Map();
function glowSprite(rgb,r){const key=rgb+'|'+r;let g=glowCache.get(key);if(g!==undefined)return g;g=null;
 try{if(typeof document!=='undefined'&&document.createElement){const cv=document.createElement('canvas');cv.width=cv.height=r*2;const x=cv.getContext('2d');if(x){const gr=x.createRadialGradient(r,r,0,r,r,r);gr.addColorStop(0,'rgba('+rgb+',1)');gr.addColorStop(.4,'rgba('+rgb+',.38)');gr.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=gr;x.fillRect(0,0,r*2,r*2);g=cv}}}catch(e){g=null}
 glowCache.set(key,g);return g}
const glow=safe(function(c,W,H,cam,o){
 if(S.kind==='gym')return;const dark=!!(o&&o.dark),k=dark?1:.38;
 c.save();c.globalCompositeOperation='lighter';
 if(dark){const f=.85+.15*Math.sin(S.T*7.1)*Math.sin(S.T*2.3+1),sp=glowSprite('255,190,110',170);if(sp){c.globalAlpha=.28*f;c.drawImage(sp,W/2-170,H/2-170)}}
 for(const l of S.lights){if(l[0]<-l[2]||l[0]>W+l[2]||l[1]<-l[2]||l[1]>H+l[2])continue;const sp=glowSprite(l[3],l[2]);if(!sp)continue;c.globalAlpha=Math.min(1,l[4]*k*(.85+.15*Math.sin(S.T*3+l[5])));c.drawImage(sp,Math.round(l[0]-l[2]),Math.round(l[1]-l[2]))}
 c.restore();
});

const shadowS=safe(shadow),buildingShadowS=safe(buildingShadow);
root.WorldFX={begin,tile,ground,isStatic:isStaticTile,staticTile:staticTileS,animTile,invalidate,obstacle,shadow:shadowS,buildingShadow:buildingShadowS,ambient,glow,get enabled(){return S.on&&!S.dead},set enabled(v){S.on=!!v},_state:S};
})(typeof window!=='undefined'?window:globalThis);
