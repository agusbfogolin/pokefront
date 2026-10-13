/* Edificios de ciudad con sprites de Tuxemon «Core Buildings» (CC BY-SA 4.0, ver assets/buildings/CREDITOS.md).
   Cada sprite (casillas de 16 px) se dibuja al doble, como el resto del mundo (casillas de 32 px).
   La huella de cada edificio se ajusta al ancho del sprite manteniendo el centro y la base: la puerta y los
   puntos de interacción no se mueven. Si una imagen no carga, se usa el arte por código de building-art.js.
   Menú → «Edificios: Tuxemon / clásicos» o localStorage frontera.edificios = 'clasicos' para volver al anterior. */
(function(root){'use strict';
const F=root.Frontera;
function enabled(){try{if(/[?&]edificios=clasicos\b/.test(root.location&&root.location.search||''))return false;return(root.localStorage&&root.localStorage.getItem('frontera.edificios'))!=='clasicos'}catch(e){return true}}
const ON=enabled();
// Sprites recortados de Tuxemon (ancho × alto en píxeles de origen)
const SPR={centro:[80,64],tienda:[80,64],laboratorio:[80,64],gimnasio:[112,80],academia:[112,80],'casa-tipos':[80,61],dojo:[80,61],'casa-a':[76,90],'casa-b':[76,90],'casa-c':[76,90]};
const S=2,img={};
// Tono suave: baja la saturación para que los edificios combinen con la paleta del mundo
const SAT=.56;
function rgb2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2rgb(h,s,l){h=((h%360)+360)%360/360;if(s===0){const v=Math.round(l*255);return[v,v,v]}const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q,f=t=>{t=(t+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};return[Math.round(f(h+1/3)*255),Math.round(f(h)*255),Math.round(f(h-1/3)*255)]}
function soften(im){try{const cv=document.createElement('canvas');cv.width=im.naturalWidth||im.width;cv.height=im.naturalHeight||im.height;const g=cv.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,cv.width,cv.height),p=d.data,memo=new Map();
 for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const key=(p[i]<<16)|(p[i+1]<<8)|p[i+2];let o=memo.get(key);if(!o){let[h,s,l]=rgb2hsl(p[i],p[i+1],p[i+2]);if(h>200&&h<245)h+=(200-h)*.4;s*=SAT;if(l>.5)l=.5+(l-.5)*.9;o=hsl2rgb(h,s,l);memo.set(key,o)}p[i]=o[0];p[i+1]=o[1];p[i+2]=o[2]}
 g.putImageData(d,0,0);return cv}catch(e){return im}}
function load(k){if(img[k]!==undefined)return img[k];img[k]=null;if(typeof Image!=='function')return null;const im=new Image();im.onload=()=>{img[k]=soften(im)};im.onerror=()=>{img[k]=false};im.src='assets/buildings/'+k+'.png?v=1';return null}
function hue(hex){const n=parseInt(String(hex||'#888888').slice(1,7),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx-mn<.08)return -1;const d=mx-mn;let h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;return h*60}
function sprite(b){
 const id=b.id||'';
 if(id==='clinic')return'centro';if(id==='market')return'tienda';if(id==='lab')return'laboratorio';if(id==='gym')return'gimnasio';if(id==='academy')return'academia';if(id==='guild')return'casa-tipos';if(id==='school')return'dojo';
 if(id.startsWith('house')){const h=hue(b.roof);return h<0||(h>180&&h<300)?'casa-c':(h<25||h>=330)?'casa-b':'casa-a'}
 return null}
// Huella ajustada al sprite: mismo centro y misma base
function fit(b){const k=sprite(b);if(!k)return b;const[sw,sh]=SPR[k],w=sw*S,h=Math.min(b.h,sh*S),bottom=b.y+b.h,cx=b.x+b.w/2;return{...b,x:Math.round(cx-w/2),w,y:bottom-h,h,tux:k}}
function fitList(list){return ON&&Array.isArray(list)?list.map(fit):list}
if(ON&&F){
 if(F.TOWN&&Array.isArray(F.TOWN.buildings)){const fitted=F.TOWN.buildings.map(fit);F.TOWN.buildings.length=0;F.TOWN.buildings.push(...fitted)}
 F.fitBuildings=fitList;for(const k of Object.keys(SPR))load(k);
}
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
function plaque(c,cx,y,text){c.save();c.font='bold 8px monospace';const w=Math.max(36,Math.ceil(c.measureText(text).width)+12),x=Math.round(cx-w/2);R(c,'#344a43',x-1,y-1,w+2,13);R(c,'#efe7c6',x,y,w,11);R(c,'#fbf6e2',x,y,w,1);c.fillStyle='#405649';c.textAlign='center';c.textBaseline='alphabetic';c.fillText(text,cx,y+9);c.restore()}
function disc(c,col,cx,cy,r){c.fillStyle=col;for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(Math.max(0,r*r-j*j)));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}}
function draw(c,b,x,y,time){
 const k=b.tux||sprite(b);if(!k)return false;const im=load(k);if(!im)return false;const[sw,sh]=SPR[k],W=sw*S,H=sh*S;
 const X=Math.round(x+(b.w-W)/2),bottom=Math.round(y+b.h),Y=bottom-H,still=root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches,T=still?0:(time||0);
 const sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;c.drawImage(im,0,0,sw,sh,X,Y,W,H);c.imageSmoothingEnabled=sm;
 // emblema del tipo sobre la claraboya del gimnasio
 if(k==='gimnasio'){const region=F.districtBase?.(b.region||'campina')||b.region||'campina',theme=F.GYM_THEMES?.[region],type=b.gymType||theme?.type||'rock',col=(F.TYPE&&F.TYPE[type]&&F.TYPE[type][1])||theme?.accent||'#c9a33c';disc(c,'#344a43',X+W/2,Y+38,15);disc(c,col,X+W/2,Y+38,14);const BA=root.BuildingArt;if(BA&&BA.emblem)BA.emblem(c,X+W/2,Y+38,type,col)}
 // humo de la chimenea de las casas
 if(k.startsWith('casa-')&&k!=='casa-tipos'){const sx=X+37,sy=Y+8;for(let i=0;i<4;i++){const t=still?(.2+i*.25):((T*.3+i/4+(b.x&7)/8)%1),a=(1-t)*.5,r=2+Math.round(t*4);c.globalAlpha=Math.max(0,a);disc(c,'#eef0ee',sx+Math.round(Math.sin(t*6+i)*3-t*6),sy-Math.round(t*28),r);c.globalAlpha=1}}
 if(b.label)plaque(c,X+W/2,bottom-(k==='gimnasio'||k==='academia'?50:46),b.label);
 return true}
root.BuildingTux={enabled:ON,draw,fit,sprites:SPR};
const BA=root.BuildingArt;
if(ON&&BA){const d0=BA.draw;BA.draw=function(c,b,x,y,time){try{if(draw(c,b,x,y,time))return}catch(e){try{console.warn('BuildingTux',e)}catch(_){}}return d0.apply(this,arguments)}}
})(typeof window!=='undefined'?window:globalThis);
