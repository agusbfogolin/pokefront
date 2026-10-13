/* Gráficos «Frontera HD»: capa opcional sobre el arte original.
   - Paleta viva inspirada en la 4ª/5ª generación: remapea por tono cada color que el mundo pinta (verdes más
     luminosos y saturados, sombras verde azuladas, agua celeste, tierra cálida) sin tocar los sprites de Pokémon.
   - Cámara cercana: game.js dibuja el mundo en un búfer reducido y lo escala sin suavizado.
   - Bosques en muralla de copas, hierba alta de hojas, caminos con esquinas redondeadas y edificios rediseñados.
   Preferencias en localStorage: frontera.art = 'hd' | 'classic', frontera.zoom = '1' | '1.5' | '2'.
   Si algo falla, cada parte vuelve sola al arte clásico. */
(function(root){'use strict';
const store={get(k,d){try{const v=root.localStorage&&root.localStorage.getItem(k);return v==null?d:v}catch(e){return d}},set(k,v){try{root.localStorage&&root.localStorage.setItem(k,v)}catch(e){}}};
const qs=(()=>{try{return root.location&&root.location.search||''}catch(e){return''}})();
const HD=!/[?&]art=classic\b/.test(qs)&&store.get('frontera.art','hd')!=='classic';
const ZOOMS=[1,1.5,2];
let zoom=Number(store.get('frontera.zoom',HD?'1.5':'1'));if(!ZOOMS.includes(zoom))zoom=HD?1.5:1;
const A={hd:HD,ZOOMS,zoom:()=>zoom,setZoom(z){if(ZOOMS.includes(z)){zoom=z;store.set('frontera.zoom',String(z))}},setHD(on){store.set('frontera.art',on?'hd':'classic')},active:false,dead:false};

/* ---------------- Paleta: remapeo por tono ---------------- */
const clamp=(v,a,b)=>v<a?a:v>b?b:v,sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;if(s===0){const v=Math.round(l*255);return[v,v,v]}const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)]}
// Bandas suaves de tono (grados)
const band=(h,a,b,soft=12)=>sstep(a-soft,a+soft,h)*(1-sstep(b-soft,b+soft,h));
let MODE='world';
function grade(r,g,b){
 let[h,s,l]=rgb2hsl(r,g,b);
 if(s<.035)return[r,g,b];
 if(MODE==='gym'){return hsl2rgb(h,clamp(s*1.12,0,.95),l)}
 if(MODE==='cave'&&s<.26&&h>=55&&h<=185){
  // cuevas: suelo de tierra cálida y paredes de roca musgosa (lectura de 4ª gen)
  if(l>.42)return hsl2rgb(32,clamp(.2+s*.9,0,.45),clamp(l-.03,0,1));
  return hsl2rgb(128,clamp(.12+s*.5,0,.3),clamp(l*.86,0,1))}
 const gate=sstep(.07,.17,s),wG=band(h,62,178,10)*gate,wW=band(h,178,240,10),wE=band(h,14,60,10)+band(h,-50,14,6)*0,wR=1-Math.min(1,wG+wW+band(h,14,62,10));
 // verdes: más saturados; claros hacia verde menta-amarillento, oscuros hacia verde azulado
 if(wG>0){const lit=sstep(.42,.66,l),target=150-44*lit,dh=(target-h)*.6,ns=clamp(s*(1.75+.35*lit)+.1,0,.9),dl=l<.5?(l-.5)*.22:(l-.5)*.2+.04;
  h+=dh*wG;s+=(ns-s)*wG;l=clamp(l+dl*wG,0,1)}
 // agua y cielo: celeste brillante
 if(wW>0&&(MODE!=='cave'||s>.2)){const ns=clamp(s*2.3+.12,0,.95),dh=(198-h)*.45,dl=l>.3?.07:.02;h+=dh*wW;s+=(ns-s)*wW;l=clamp(l+dl*wW,0,1)}
 // tierra, madera, arena, piel: algo más cálidas; los cremas muy claros casi no cambian
 const wT=band(h,14,62,10);if(wT>0){const k=1-sstep(.74,.9,l),ns=clamp(s*(1+.38*k)+.02*k,0,.9);s+=(ns-s)*wT}
 // rojos, violetas y demás: un poco más de color
 if(wR>0){const ns=clamp(s*1.22,0,.95);s+=(ns-s)*wR}
 return hsl2rgb(h,s,l)}
const cache=new Map();
function parse(v){
 if(v[0]==='#'){let x=v.slice(1);if(x.length===3||x.length===4)x=[...x].map(ch=>ch+ch).join('');if(x.length!==6&&x.length!==8)return null;const n=parseInt(x.slice(0,6),16);if(Number.isNaN(n))return null;return[n>>16&255,n>>8&255,n&255,x.length===8?parseInt(x.slice(6),16)/255:1]}
 const m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);if(m)return[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]];
 return null}
function remap(v){const ck=MODE+v;let out=cache.get(ck);if(out!==undefined)return out;const p=parse(v);if(!p){out=v}else{const[r,g,b]=grade(p[0],p[1],p[2]);out=p[3]>=1?'rgb('+r+','+g+','+b+')':'rgba('+r+','+g+','+b+','+(+p[3].toFixed(3))+')'}if(cache.size>8000)cache.clear();cache.set(ck,out);return out}
A.remap=remap;
if(HD&&root.CanvasRenderingContext2D){
 try{const P=root.CanvasRenderingContext2D.prototype;
  for(const prop of ['fillStyle','strokeStyle']){const d=Object.getOwnPropertyDescriptor(P,prop);if(!d||!d.set)continue;
   Object.defineProperty(P,prop,{configurable:true,enumerable:d.enumerable,get(){return d.get.call(this)},set(v){d.set.call(this,A.active&&!A.dead&&typeof v==='string'?remap(v):v)}})}
 }catch(e){A.dead=true}
}
/* ---------------- Terreno ---------------- */
let getTile=null,installed=false;
const nbr=(tx,ty)=>{try{return getTile?getTile(tx,ty):null}catch(e){return null}};
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
const hh=(a,b,s)=>{let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul((s|0)+29,1274126177);h=Math.imul(h^(h>>>13),1103515245);h^=h>>>16;return(h>>>0)/4294967296};
const GR={selva:['#537e59','#6d985e'],pantano:['#727f59','#889369'],bosque:['#749568','#83a573'],pradera:['#97b57c','#a8c188']};
const isDirt=t=>!!t&&t.ground==='trail'&&t.plan!=='farm'&&!t.boundary;
const isGrass=t=>!!t&&t.ground==='grass'&&!t.boundary&&!t.tall&&t.plan!=='outer';
const grassCol=t=>t.plan==='meadow'?'#8fb774':(GR[t.biome]||GR.pradera)[0];
const DIRT='#c3bc94',DIRT_LIP='rgba(96,78,44,.32)',GRASS_LIP='rgba(40,86,52,.30)';
// Base de pasto y tierra (misma receta que el motor, con matas en «v» al estilo de la 4ª generación)
function baseGround(c,x,y,t,tx,ty){
 if(t.ground==='grass'){const p=GR[t.biome]||GR.pradera;R(c,p[0],x,y,32,32);
  for(let i=0;i<3;i++){const px=Math.floor(hh(tx+i*11,ty,1)*26),py=Math.floor(hh(tx,ty+i*13,2)*26);R(c,p[1],x+px,y+py,2,2)}
  const dk='#6f9a5c',lt='#c4dc9c';
  for(let i=0;i<3;i++){const px=x+2+Math.floor(hh(tx,ty,10+i)*26),py=y+4+Math.floor(hh(tx,ty,20+i)*24);R(c,dk,px,py,1,2);R(c,dk,px+3,py,1,2);R(c,dk,px+1,py+2,2,1);R(c,lt,px+1,py-1,1,1)}
  if(hh(tx,ty,30)>.86){R(c,hh(tx,ty,31)>.5?'#e0d27b':'#e8ebbb',x+12,y+18,3,3);R(c,'#ffffff',x+11,y+17,2,2)}
  return true}
 if(t.ground==='trail'){R(c,DIRT,x,y,32,32);R(c,'#d5c9a4',x+6,y+9,10,2);R(c,'#d5c9a4',x+20,y+24,5,2);
  for(let i=0;i<4;i++){const px=x+2+Math.floor(hh(tx,ty,40+i)*27),py=y+2+Math.floor(hh(tx,ty,50+i)*27);R(c,hh(tx,ty,60+i)>.5?'#ad9f72':'#ddd2ad',px,py,2,1)}
  return true}
 return false}
// Esquinas redondeadas entre pasto y caminos de tierra
function fillet(c,x,y,corner,col,lip){const Rr=12;
 for(let j=0;j<Rr;j++){const dy=Rr-j-.5,dx=Math.sqrt(Math.max(0,Rr*Rr-dy*dy)),w=Math.round(Rr-dx);if(w<=0)continue;
  const yy=corner<2?y+j:y+31-j,xx=corner===0||corner===2?x:x+32-w;R(c,col,xx,yy,w,1);
  if(lip){const lx=corner===0||corner===2?x+w:x+31-w;R(c,lip,lx,yy,1,1)}}}
function corners(c,x,y,t,tx,ty){
 const me=isDirt(t)?'d':isGrass(t)?'g':null;if(!me||!getTile)return;
 const N=nbr(tx,ty-1),S=nbr(tx,ty+1),W=nbr(tx-1,ty),E=nbr(tx+1,ty),other=me==='d'?isGrass:isDirt;
 const pairs=[[N,W],[N,E],[S,W],[S,E]];
 for(let k=0;k<4;k++){const[a,b]=pairs[k];if(other(a)&&other(b)){const col=me==='d'?grassCol(a):DIRT;fillet(c,x,y,k,col,me==='d'?GRASS_LIP:DIRT_LIP)}}}
/* Hierba alta de hojas (macollas de 16 px, dos filas por casilla) */
const LEAFY={meadow:1,woodland:1,jungle:1,beach:1};
const TALLP={meadow:['#1f5a2b','#2f7a34','#4f9e3e','#86c860','#c8ec8c'],woodland:['#1a4a2c','#286a3a','#3f8a48','#72b868','#b4e09a'],jungle:['#123f28','#1d6a3d','#2f9150','#5cc46c','#a8ec8c'],beach:['#3f6a3a','#5a8f4a','#7cb25c','#a9d27a','#e2f0b0']};
function leaf(c,bx,by,len,lean,P,sw){
 for(let i=0;i<len;i++){const u=i/len,wd=u<.18?1:u<.4?2:u>.86?1:3,px=Math.round(bx+lean*(len-i)*.42+(i<len*.5?sw:sw*.5)),py=by-len+i;
  R(c,P[2],px-(wd>>1),py,wd,1);if(wd>1){R(c,P[3],px-(wd>>1),py,1,1);R(c,P[1],px-(wd>>1)+wd-1,py,1,1)}}
 R(c,P[4],Math.round(bx+lean*len*.42+sw),by-len-1,1,1)}
function clump(c,x,y,P,seed,sw){
 R(c,'rgba(10,40,20,.30)',x+1,y+15,15,1);
 for(let j=0;j<13;j++){const w=[6,10,12,14,15,16,16,16,16,16,16,15,13][j];R(c,P[0],x+8-(w>>1),y+3+j,w,1)}
 const o=Math.floor(seed*3)-1,o2=Math.floor(seed*7)%3-1;
 leaf(c,x+3+o,y+16,10,-1,P,sw);leaf(c,x+12+o2,y+16,10,1,P,sw);leaf(c,x+8,y+16,13,o*.3,P,sw);leaf(c,x+5,y+16,8,-.5,P,sw);leaf(c,x+11,y+16,8,.6,P,sw);
 R(c,P[1],x+2,y+14,12,1);R(c,P[0],x+1,y+15,14,1)}
function tallHD(c,x,y,t,time,front,sway){
 const P=TALLP[t.tall],d=Math.floor((t.detail||0)*977);
 if(!front)R(c,'rgba(20,60,30,.22)',x,y,32,32);
 for(const r of front?[1]:[0,1])for(let k=0;k<2;k++){const cx=x+k*16,cy=y+r*16,sw=sway?Math.round(Math.sin(time*6+cx*.3+cy*.2)*sway):0;clump(c,cx,cy,P,hh(d,r*2+k,70),sw)}}
/* Acantilados de pradera: meseta con el mismo césped y cara de tierra con terrones (estilo 4ª gen) */
const EARTH=['#4a3a26','#6f5536','#8c6d45','#a98a5a','#c6a874'];
function cliffHD(c,x,y,t,tx,ty){
 const cold=t.region&&/frost/.test(t.region),bse=root.Frontera?.districtBase?.(t.region||'')||t.region;if(bse==='frost'||bse==='crater'||bse==='dunes'||bse==='coast')return false;
 baseGround(c,x,y,{ground:'grass',biome:t.biome},tx,ty);
 const S=!!t.edgeSouth,fy=S?6:32;
 if(t.edgeNorth){R(c,'#2f5a32',x,y,32,2);R(c,'#6f9a5a',x,y+2,32,1);R(c,'#d4ecac',x,y+3,32,1);for(let i=0;i<8;i++)if(hh(tx*8+i,ty,90)>.45)R(c,'#7fae62',x+i*4+1,y+1,2,2)}
 if(t.edgeWest){R(c,'#2f5a32',x,y,1,fy);R(c,EARTH[1],x+1,y,3,fy);R(c,EARTH[3],x+1,y,1,fy);R(c,'#5f8f4c',x+4,y,1,fy);R(c,'#d4ecac',x+5,y,1,fy)}
 if(t.edgeEast){R(c,'#5f8f4c',x+26,y,1,fy);R(c,EARTH[1],x+27,y,4,fy);R(c,EARTH[0],x+30,y,1,fy);R(c,'#2f5a32',x+31,y,1,fy)}
 if(S){
  // labio de césped que cae sobre la cara
  R(c,EARTH[2],x,y+fy,32,26);
  for(let i=0;i<16;i++){const d=1+Math.floor(hh(tx*16+i,ty,80)*3);R(c,'#7fae62',x+i*2,y+fy-1,2,d+1);R(c,'#3f6e3e',x+i*2,y+fy+d,2,1)}
  // terrones redondeados en dos hileras
  for(let row=0;row<2;row++){const ry=y+fy+5+row*10,off=(row?6:0)-Math.floor(hh(tx,ty,81+row)*4);
   for(let bx=x+off-12;bx<x+32;bx+=12){const bw=11,x0=Math.max(x,bx),x1=Math.min(x+32,bx+bw);if(x1<=x0)continue;
    R(c,EARTH[0],x0,ry+9,x1-x0,1);R(c,EARTH[1],x0,ry+1,x1-x0,8);
    R(c,EARTH[2],Math.max(x0,bx+1),ry,Math.max(0,Math.min(x1,bx+bw-1)-Math.max(x0,bx+1)),7);
    R(c,EARTH[3],Math.max(x0,bx+2),ry+1,Math.max(0,Math.min(x1,bx+6)-Math.max(x0,bx+2)),2);
    if(bx+2>=x&&bx+2<x+32)R(c,EARTH[4],bx+2,ry+1,2,1);
    if(bx+bw-1>=x&&bx+bw-1<x+32)R(c,EARTH[0],bx+bw-1,ry+2,1,7)}}
  R(c,EARTH[0],x,y+31,32,1);R(c,'rgba(30,20,10,.25)',x,y+30,32,1);
  if(t.edgeWest){R(c,EARTH[0],x,y+fy,1,26);R(c,EARTH[3],x+1,y+fy,1,24)}
  if(t.edgeEast){R(c,EARTH[0],x+31,y+fy,1,26)}
 }
 return true}
function install(){
 if(installed)return;installed=true;
 const TA=root.TerrainArt,FX=root.WorldFX;
 if(FX&&FX.begin){const b0=FX.begin;FX.begin=function(o){getTile=o&&o.getTile||null;return b0.apply(this,arguments)}}
 if(TA){
  const g0=TA.ground,d0=TA.details,t0=TA.tall;
  TA.ground=function(c,x,y,t,tx,ty,time){let done=false;try{if(t.obstacle==='cliff'&&!t.boundary)done=cliffHD(c,x,y,t,tx,ty);if(!done)done=g0.apply(this,arguments);if(!done&&!t.boundary)done=baseGround(c,x,y,t,tx,ty);if(done)corners(c,x,y,t,tx,ty)}catch(e){}return done};
  TA.details=function(c,x,y,t){if(t.tall&&LEAFY[t.tall]){try{tallHD(c,x,y,t,0,false,0);return}catch(e){}}return d0.apply(this,arguments)};
  TA.tall=function(c,x,y,t,time,front,sway){if(LEAFY[t.tall]){try{tallHD(c,x,y,t,time,front,sway);return}catch(e){}}return t0.apply(this,arguments)};
 }
 if(root.BuildingArt&&root.BuildingHD){const d0=root.BuildingArt.draw;root.BuildingArt.draw=function(c,b,x,y,time){try{if(root.BuildingHD.draw(c,b,x,y,time))return}catch(e){try{console.warn('BuildingHD',e)}catch(_){}}return d0.apply(this,arguments)}}
}
A.begin=kind=>{if(!HD)return;if(!installed)install();MODE=kind==='cave'?'cave':kind==='gym'?'gym':'world';A.active=true};A.end=()=>{A.active=false};
root.ArtHD=A;
})(typeof window!=='undefined'?window:globalThis);
