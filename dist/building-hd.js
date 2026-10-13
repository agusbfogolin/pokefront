/* Edificios «Frontera HD»: arquitectura original con la lectura de la 4ª/5ª generación (tejados de tejas en
   tres cuartos, fachadas con revestimiento, marquesinas, cristaleras y jardineras). Cada edificio se hornea una vez
   en un lienzo y por fotograma solo se animan humo, banderines, farolillos y balizas.
   Mantiene la huella de campaign.js/core.js: puerta en el centro inferior y colisión entre y+30 y h-4. */
(function(root){'use strict';
const OL='#2a3732',OL2='#3d4c46';
const R=(c,col,x,y,w,h)=>{if(w<=0||h<=0)return;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
const hs=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967296};
function shade(hex,f){const n=parseInt(String(hex).slice(1,7),16);if(Number.isNaN(n))return hex;const m=v=>Math.max(0,Math.min(255,Math.round(f<0?v*(1+f):v+(255-v)*f)));return'#'+[n>>16&255,n>>8&255,n&255].map(m).map(v=>v.toString(16).padStart(2,'0')).join('')}
function poly(c,col,pts){c.fillStyle=col;let y0=1e9,y1=-1e9;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}
 for(let y=Math.floor(y0);y<Math.ceil(y1);y++){const yc=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
  xs.sort((p,q)=>p-q);for(let i=0;i+1<xs.length;i+=2){const xa=Math.round(xs[i]),xb=Math.round(xs[i+1]);if(xb>xa)c.fillRect(xa,y,xb-xa,1)}}}
function line(c,col,x0,y0,x1,y1,t=1){c.fillStyle=col;const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){c.fillRect(Math.round(x0+(x1-x0)*i/n),Math.round(y0+(y1-y0)*i/n),t,t)}}
function disc(c,col,cx,cy,rx,ry){c.fillStyle=col;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}}
const FLW=[['#f2557a','#ffd0dc'],['#f6d64a','#fff6b0'],['#ffffff','#f8f0c8'],['#f08a3a','#ffd8b0'],['#b48af0','#efe0ff']];

/* ---------- Piezas ---------- */
function siding(c,x,y,w,h,col,step=4){R(c,col,x,y,w,h);const dk=shade(col,-.13),lt=shade(col,.35);for(let yy=y+step-1;yy<y+h;yy+=step){R(c,dk,x,yy,w,1);R(c,lt,x,yy+1,w,1)}}
function brick(c,x,y,w,h,col){R(c,shade(col,-.28),x,y,w,h);for(let r=0,yy=y;yy<y+h;r++,yy+=5){const off=r%2?5:0;for(let xx=x-off;xx<x+w;xx+=10){const a=Math.max(x,xx+1),b=Math.min(x+w,xx+10);if(b>a){R(c,col,a,yy,b-a,4);R(c,shade(col,.18),a,yy,b-a,1)}}}}
function stone(c,x,y,w,h){R(c,'#6f736c',x,y,w,h);R(c,'#a9aca2',x,y,w,h-1);R(c,'#c7c9bf',x,y,w,1);for(let xx=x+((y*7)%9);xx<x+w;xx+=9)R(c,'#8a8d84',xx,y+1,1,h-2)}
function window_(c,x,y,w,h,o={}){
 R(c,OL,x-1,y-1,w+2,h+2);R(c,o.frame||'#f6f2e6',x,y,w,h);
 const gx=x+2,gy=y+2,gw=w-4,gh=h-4;R(c,'#5f9fca',gx,gy,gw,gh);R(c,'#8cc6e6',gx,gy,gw,Math.ceil(gh*.45));R(c,'#c8ecfa',gx+1,gy+1,Math.max(1,Math.floor(gw*.3)),1);
 for(let i=0;i<Math.min(gw,gh);i+=1)if(i<5)R(c,'rgba(255,255,255,.35)',gx+gw-6+i,gy+gh-1-i,1,1);
 R(c,o.frame||'#f6f2e6',x+(w>>1)-1,y,2,h);if(h>12)R(c,o.frame||'#f6f2e6',x,y+(h>>1)-1,w,2);
 R(c,'#c9c2a8',x-2,y+h+1,w+4,2);R(c,'#e8e2cc',x-2,y+h+1,w+4,1);
 if(o.box){const f=FLW[o.box%FLW.length];R(c,OL,x-2,y+h+3,w+4,6);R(c,'#a0643c',x-1,y+h+3,w+2,5);R(c,'#c4855a',x-1,y+h+3,w+2,1);
  for(let i=0;i<w;i+=3){R(c,'#3f8a3a',x+i,y+h,3,3);R(c,(i/3)%2?f[0]:f[1],x+i+1,y+h-1,2,2)}}
 if(o.shutter){for(const sx of [x-6,x+w+1]){R(c,OL,sx,y-1,5,h+2);R(c,o.shutter,sx+1,y,3,h);for(let yy=y+2;yy<y+h-1;yy+=3)R(c,shade(o.shutter,-.25),sx+1,yy,3,1)}}}
function archWindow(c,cx,y,w,h){const r=w>>1;
 for(let j=0;j<r;j++){const dx=Math.round(Math.sqrt(r*r-(r-j)*(r-j)));R(c,OL,cx-dx-1,y+j,dx*2+2,1)}R(c,OL,cx-r-1,y+r,w+2,h-r+1);
 for(let j=1;j<r;j++){const dx=Math.round(Math.sqrt((r-1)*(r-1)-(r-j)*(r-j)));R(c,j<r*.6?'#8cc6e6':'#6aa8d2',cx-dx,y+j,dx*2,1)}R(c,'#5f9fca',cx-r,y+r,w,h-r);R(c,'#8cc6e6',cx-r,y+r,w,3);
 for(const dx of [-Math.round(r/2),0,Math.round(r/2)])R(c,'#f2eee2',cx+dx,y+2,2,h-2);R(c,'#f2eee2',cx-r,y+r+((h-r)>>1),w,2);R(c,'#c8ecfa',cx-r+2,y+r+2,3,1);
 R(c,'#d6cfb4',cx-r-3,y+h+1,w+6,3)}
function woodDoor(c,cx,bottom,w,h,col='#8a5532'){const x=Math.round(cx-w/2),y=bottom-h;
 R(c,OL,x-2,y-2,w+4,h+2);R(c,shade(col,.3),x-1,y-1,w+2,1);R(c,col,x,y,w,h);
 const pw=(w-6)/2;for(const px of [x+2,x+4+pw]){R(c,shade(col,-.22),Math.round(px),y+3,Math.round(pw),Math.round(h*.4));R(c,shade(col,.18),Math.round(px),y+3,Math.round(pw),1);R(c,shade(col,-.22),Math.round(px),y+Math.round(h*.52),Math.round(pw),Math.round(h*.4))}
 R(c,'#f2cf6a',x+w-5,y+Math.round(h*.5),2,2);R(c,'#c9b083',x-4,bottom,w+8,3);R(c,'#a58b62',x-4,bottom+2,w+8,1)}
function glassDoor(c,cx,bottom,w,h,frame='#7d8f96'){const x=Math.round(cx-w/2),y=bottom-h;
 R(c,OL,x-2,y-2,w+4,h+2);R(c,frame,x-1,y-1,w+2,h+1);R(c,'#4f8fbf',x+1,y+1,w-2,h-1);R(c,'#86c2e8',x+1,y+1,w-2,Math.round(h*.35));
 R(c,frame,cx-1,y,2,h);for(const gx of [x+3,cx+3])R(c,'#d4f0fb',gx,y+3,2,Math.round(h*.6));R(c,'#d4f0fb',x+5,y+3,1,Math.round(h*.3));
 R(c,'#8f9a9a',x-5,bottom,w+10,3);R(c,'#c6cfcc',x-5,bottom,w+10,1)}
function plaque(c,cx,y,text,o={}){c.save();c.font='bold 8px monospace';const tw=Math.ceil(c.measureText(text).width),w=Math.max(40,tw+14),x=Math.round(cx-w/2);
 R(c,OL,x-1,y-1,w+2,13);R(c,o.bg||'#f4ecd0',x,y,w,11);R(c,shade(o.bg||'#f4ecd0',.4),x,y,w,1);R(c,shade(o.bg||'#f4ecd0',-.18),x,y+10,w,1);
 c.fillStyle=o.fg||'#3a4a40';c.textAlign='center';c.textBaseline='alphabetic';c.fillText(text,cx,y+9);c.restore()}
function pot(c,x,y,k){const f=FLW[k%FLW.length];R(c,OL,x-1,y,11,8);R(c,'#b8673f',x,y+1,9,6);R(c,'#d98a5e',x,y+1,9,1);disc(c,'#2f6a3a',x+4,y-2,6,4);disc(c,'#4f9a4f',x+3,y-3,5,3);R(c,f[0],x+1,y-5,2,2);R(c,f[0],x+6,y-4,2,2);R(c,f[1],x+3,y-7,2,2)}
function snowCap(c,pts){poly(c,'#f4f9fb',pts)}

/* ---------- Tejados ---------- */
// Tejado a dos aguas con el hastial hacia el frente (cumbrera vertical): lectura típica de casa en 4ª gen.
function gableRoof(c,w,yr,ye,top,col,o={}){
 const cx=w/2,L=shade(col,.12),M=col,D=shade(col,-.26),DD=shade(col,-.48),HL=shade(col,.42),ov=6,dy=ye-yr;
 const lb=[[cx,top],[cx,yr],[-ov,ye],[-ov,top+dy]],rb=[[cx,top],[cx,yr],[w+ov,ye],[w+ov,top+dy]];
 poly(c,OL,[[cx,top-2],[-ov-2,top+dy-1],[-ov-2,ye+2],[cx,yr+3],[w+ov+2,ye+2],[w+ov+2,top+dy-1]]);
 poly(c,L,lb);poly(c,D,rb);
 // hileras de tejas paralelas al alero
 for(let k=4;k<yr-top+1;k+=5){line(c,shade(col,-.12),cx-1,yr-k,-ov,ye-k);line(c,HL,cx-2,yr-k+1,-ov,ye-k+1);line(c,DD,cx+1,yr-k,w+ov,ye-k);line(c,shade(col,-.12),cx+2,yr-k+1,w+ov,ye-k+1)}
 for(let k=1;k<6;k++){const s=k/6;for(let j=0;j<yr-top;j+=5){const xL=Math.round(cx-(cx+ov)*s),yL=Math.round(yr-j+dy*s);R(c,shade(col,-.18),xL,yL-3,1,3);const xR=Math.round(cx+(cx+ov)*s);R(c,DD,xR,yL-3,1,3)}}
 // cumbrera y canto del alero
 R(c,HL,cx-2,top,2,yr-top+1);R(c,shade(col,-.1),cx,top,2,yr-top+1);
 line(c,'#f3eee0',cx,yr+1,-ov,ye+1,2);line(c,'#d8d1bd',cx,yr+1,w+ov,ye+1,2);
 if(o.snow){poly(c,'#f4f9fb',[[cx,top],[cx,yr-2],[-ov,ye-3],[-ov,top+dy-1]]);poly(c,'#dce9ef',[[cx,top],[cx,yr-2],[w+ov,ye-3],[w+ov,top+dy-1]])}}
// Tejado a cuatro aguas visto desde arriba-frente (cumbrera horizontal)
function hipRoof(c,x0,x1,top,ye,col,o={}){
 const w=x1-x0,ins=Math.min(w*.3,(ye-top)*1.1),ridgeY=top+Math.round((ye-top)*.28),D=shade(col,-.24),DD=shade(col,-.46),HL=shade(col,.4),L=shade(col,.1);
 poly(c,OL,[[x0+ins-1,top-2],[x1-ins+1,top-2],[x1+5,ye+2],[x0-5,ye+2]]);
 poly(c,L,[[x0+ins,top],[x1-ins,top],[x1-ins+ (ins*.25),ridgeY],[x0+ins-(ins*.25),ridgeY]]);
 poly(c,col,[[x0+ins-(ins*.25),ridgeY],[x1-ins+(ins*.25),ridgeY],[x1+4,ye],[x0-4,ye]]);
 poly(c,shade(col,-.08),[[x0+ins,top],[x0+ins-(ins*.25),ridgeY],[x0-4,ye],[x0-4,ye]]);
 poly(c,D,[[x1-ins,top],[x1+4,ye],[x1-ins+(ins*.25),ridgeY]]);
 for(let yy=ridgeY+4;yy<ye-1;yy+=5){const t=(yy-top)/(ye-top),xa=x0+ins-(ins+4)*t,xb=x1-ins+(ins+4)*t;R(c,shade(col,-.14),xa+2,yy,xb-xa-4,1);R(c,HL,xa+2,yy+1,xb-xa-4,1);for(let xx=xa+4+((yy/5)%2)*4;xx<xb-4;xx+=8)R(c,shade(col,-.14),xx,yy-4,1,4)}
 line(c,HL,x0+ins-(ins*.25),ridgeY,x1-ins+(ins*.25),ridgeY);R(c,DD,x0-4,ye-2,w+8,2);R(c,'#e9e3cf',x0-4,ye,w+8,2);
 if(o.snow)poly(c,'#f4f9fb',[[x0+ins,top],[x1-ins,top],[x1-ins+(ins*.25),ridgeY+3],[x0+ins-(ins*.25),ridgeY+3]])}

/* ---------- Edificios ---------- */
function house(c,b,w,h,o){
 const ye=Math.round(h*.47),yr=ye-Math.round(w*.3),top=-18,cx=w/2,wall=b.wall,sd=hs(b.id+b.region);
 // fachada y hastial
 siding(c,2,ye,w-4,h-ye-6,wall);R(c,OL,1,ye,1,h-ye);R(c,OL,w-2,ye,1,h-ye);R(c,shade(wall,-.18),w-10,ye,8,h-ye-6);
 poly(c,shade(wall,-.06),[[cx,yr+3],[4,ye],[w-4,ye]]);for(let yy=yr+8;yy<ye;yy+=4){const t=(yy-yr-3)/(ye-yr-3),hw=(cx-4)*t;R(c,shade(wall,-.17),cx-hw,yy,hw*2,1)}
 // ventanuco redondo del desván
 const ay=Math.round((yr+ye)/2)+3;disc(c,OL,cx,ay,6,6);disc(c,'#f6f2e6',cx,ay,5,5);disc(c,'#6aa8d2',cx,ay,3,3);R(c,'#c8ecfa',cx-2,ay-2,2,1);R(c,'#f6f2e6',cx,ay-3,1,7);
 stone(c,0,h-6,w,6);
 // chimenea de ladrillo sobre el faldón derecho
 const chx=Math.round(w*.68);R(c,OL,chx-1,-14,12,24);brick(c,chx,-13,10,22,'#b05a3a');R(c,OL,chx-2,-16,14,4);R(c,'#8a8a82',chx-1,-15,12,2);
 gableRoof(c,w,yr,ye,top,b.roof,{snow:o.cold});
 woodDoor(c,cx,h-6,20,28,shade(b.roof,-.35));
 R(c,'#4a3a2a',cx-14,h-34,3,1);
 const wy=ye+8,ww=22,wh=18;window_(c,12,wy,ww,wh,{box:Math.floor(sd*5)+1});window_(c,w-12-ww,wy,ww,wh,{box:Math.floor(sd*5)+3});
 // buzón y maceta
 if(w>=120){R(c,OL,w-14,h-24,9,8);R(c,'#d6453d',w-13,h-23,7,6);R(c,'#f08a7a',w-13,h-23,7,1);R(c,'#6a4a2a',w-11,h-16,2,10)}
 pot(c,cx-26,h-14,Math.floor(sd*7));
}
function clinic(c,b,w,h,o){
 const cx=w/2,top=-14,ye=38,red=b.roof,wall=b.wall||'#f2e7d2';
 // cuerpo de dos plantas
 R(c,OL,1,ye-2,w-2,h-ye+2);siding(c,2,ye,w-4,h-ye-8,wall,6);R(c,shade(wall,-.16),w-12,ye,10,h-ye-8);
 R(c,shade(red,-.1),2,ye+24,w-4,4);R(c,shade(red,.25),2,ye+24,w-4,1);R(c,red,2,h-12,w-4,6);R(c,shade(red,-.3),2,h-7,w-4,1);stone(c,0,h-6,w,6);
 for(let i=0;i<4;i++){const wx=10+i*((w-20-16)/3);if(Math.abs(wx+8-cx)<34)continue;window_(c,wx,ye+6,16,12,{})}
 for(const wx of [12,w-12-24])window_(c,wx,ye+34,24,h-ye-56,{});
 hipRoof(c,6,w-6,top,ye,red,{snow:o.cold});
 // marquesina redondeada con emblema
 const mw=Math.min(78,w*.5),my=ye-12,mh=30;
 for(let j=0;j<mh;j++){const k=j/mh,hw=Math.round(mw/2*Math.sqrt(Math.min(1,k*2.2))),col=j<4?shade(red,.3):j<mh-7?red:shade(red,-.28);R(c,OL,cx-hw-1,my+j,hw*2+2,1);R(c,col,cx-hw,my+j,hw*2,1)}
 R(c,OL,cx-mw/2-1,my+mh,mw+2,2);R(c,shade(red,-.45),cx-mw/2,my+mh-2,mw,2);
 for(let j=6;j<mh-8;j+=4)R(c,shade(red,.12),cx-mw/2+6,my+j,mw-12,1);
 disc(c,OL,cx,my+13,10,10);disc(c,'#ffffff',cx,my+13,9,9);disc(c,'#f1ece0',cx+2,my+15,6,6);R(c,'#e0463a',cx-2,my+7,4,12);R(c,'#e0463a',cx-6,my+11,12,4);R(c,'#ff8a7a',cx-2,my+7,4,1);
 glassDoor(c,cx,h-6,36,28);
 if(b.label)plaque(c,cx,my+mh+3,b.label,{bg:'#fff4ec',fg:'#9a2a24'});
 pot(c,cx-32,h-14,1);pot(c,cx+24,h-14,4)}
function market(c,b,w,h,o){
 const cx=w/2,ye=40,top=-6,roof=b.roof,wall=b.wall;
 R(c,OL,1,ye-2,w-2,h-ye+2);siding(c,2,ye,w-4,h-ye-6,wall,5);R(c,shade(wall,-.16),w-12,ye,10,h-ye-6);stone(c,0,h-6,w,6);
 // azotea plana con pretil y paneles (lectura BW)
 R(c,OL,-3,top-2,w+6,ye-top+4);R(c,shade(roof,.15),-2,top-1,w+4,ye-top+1);R(c,roof,0,top+3,w,ye-top-7);
 for(let yy=top+7;yy<ye-6;yy+=7)R(c,shade(roof,-.15),2,yy,w-4,1);for(let xx=10;xx<w-4;xx+=14)R(c,shade(roof,-.15),xx,top+4,1,ye-top-10);
 R(c,shade(roof,.4),-2,top-1,w+4,2);R(c,shade(roof,-.45),-2,ye-4,w+4,3);R(c,'#e9e3cf',-2,ye-1,w+4,2);
 // equipo en la azotea
 R(c,OL,w-44,top+3,22,14);R(c,'#c9cfcc',w-43,top+4,20,12);R(c,'#e6ebe8',w-43,top+4,20,2);for(let i=0;i<4;i++)R(c,'#8f9a9a',w-41+i*5,top+8,3,6);
 // rótulo y toldo
 if(b.label)plaque(c,cx,ye+3,b.label,{bg:'#fff8e6',fg:shade(roof,-.5)});
 const ay=ye+17;for(let i=0,xx=4;xx<w-4;i++,xx+=10){R(c,i%2?'#fbf6ea':roof,xx,ay,10,9)}R(c,OL,3,ay-1,w-6,1);
 for(let xx=4;xx<w-4;xx+=10){disc(c,shade(roof,-.1),xx+5,ay+9,5,2)}R(c,'rgba(0,0,0,.18)',4,ay+11,w-8,2);
 const sw=Math.round((w-58)/2-8);window_(c,8,ay+16,sw,h-ay-30,{frame:'#eef0ea'});window_(c,w-8-sw,ay+16,sw,h-ay-30,{frame:'#eef0ea'});
 // productos en las vitrinas
 for(const bx of [10,w-6-sw])for(let i=0;i<sw-6;i+=7){const f=FLW[(i/7+bx)%FLW.length|0];R(c,f[0],bx+2+i,h-22,5,4);R(c,f[1],bx+2+i,h-22,5,1)}
 glassDoor(c,cx,h-6,30,28,'#7d8f96')}
function gym(c,b,w,h,o){
 const cx=w/2,F=root.Frontera,region=o.region,theme=F.GYM_THEMES?.[region],accent=theme?.accent||'#c9a33c',type=b.gymType||theme?.type||'rock',tcol=(F.TYPE&&F.TYPE[type]&&F.TYPE[type][1])||accent,roof=b.roof,ye=46,top=-22;
 // fachada de piedra clara con zócalo del color del tipo
 R(c,OL,1,ye-2,w-2,h-ye+2);R(c,'#ebe6d6',2,ye,w-4,h-ye-6);for(let yy=ye+6;yy<h-8;yy+=8){R(c,'#d4cdb8',2,yy,w-4,1);for(let xx=6+((yy/8)%2)*12;xx<w-4;xx+=24)R(c,'#d4cdb8',xx,yy-7,1,7)}
 R(c,shade(accent,-.1),2,h-16,w-4,10);R(c,shade(accent,.3),2,h-16,w-4,1);stone(c,0,h-6,w,6);R(c,'#cfc8b2',w-12,ye,10,h-ye-16);
 // tejado de bóveda con nervios
 const rh=ye-top;for(let j=0;j<rh;j++){const k=j/rh,ins=Math.round(18*(1-Math.sqrt(Math.max(0,1-(1-k)*(1-k))))),col=k<.15?shade(roof,.35):k<.5?shade(roof,.12):k<.85?roof:shade(roof,-.3);R(c,OL,ins-6,top+j,w+12-ins*2,1);R(c,col,ins-5,top+j,w+10-ins*2,1)}
 for(let xx=12;xx<w-8;xx+=16)for(let j=2;j<rh-3;j++){const k=j/rh,ins=Math.round(18*(1-Math.sqrt(Math.max(0,1-(1-k)*(1-k)))));if(xx>ins&&xx<w-ins)R(c,shade(roof,-.22),xx,top+j,1,1)}
 R(c,shade(roof,-.5),-6,ye-3,w+12,3);R(c,'#e9e3cf',-6,ye,w+12,2);if(o.cold)for(let j=0;j<5;j++)R(c,'#f4f9fb',18-j*2,top+j,w-36+j*4,1);
 // frontón con emblema del tipo
 poly(c,OL,[[cx-46,ye+1],[cx,ye-20],[cx+46,ye+1]]);poly(c,'#f4efe0',[[cx-42,ye],[cx,ye-17],[cx+42,ye]]);R(c,accent,cx-42,ye-1,84,3);
 disc(c,OL,cx,ye-6,15,14);disc(c,tcol,cx,ye-6,14,13);disc(c,shade(tcol,.35),cx-3,ye-9,8,6);const BA=root.BuildingArt;if(BA&&BA.emblem)BA.emblem(c,cx,ye-6,type,tcol);
 // columnas
 for(const px of [14,w-26,cx-34,cx+22]){R(c,OL,px-1,ye+2,14,h-ye-18);R(c,'#f8f4e8',px,ye+2,12,h-ye-19);R(c,'#d7d0ba',px+8,ye+2,4,h-ye-19);R(c,'#ffffff',px+2,ye+2,2,h-ye-19);R(c,OL,px-3,ye+2,18,3);R(c,'#e4ddc6',px-2,ye+2,16,2);R(c,'#d4cdb8',px-3,h-18,18,3)}
 if(w>170)for(const wx of [32,w-56])window_(c,wx,ye+14,22,24,{frame:'#f2eee2'});
 glassDoor(c,cx,h-6,38,32,shade(accent,-.2));
 if(b.label)plaque(c,cx,h-52,b.label,{bg:'#fff8e0',fg:shade(accent,-.55)})}
function lab(c,b,w,h,o){
 const cx=w/2,ye=40,top=-20,roof=b.roof;
 // planta baja de ladrillo y planta alta revocada
 R(c,OL,1,ye-2,w-2,h-ye+2);brick(c,2,ye+30,w-4,h-ye-36,'#b0664a');siding(c,2,ye,w-4,30,b.wall||'#e8ecdc',6);R(c,'#d8dccd',2,ye+28,w-4,3);R(c,'#9a9c90',2,ye+30,w-4,1);stone(c,0,h-6,w,6);
 R(c,'rgba(0,0,0,.16)',w-12,ye,10,h-ye-6);
 // tejado curvo con claraboya
 const rh=ye-top;for(let j=0;j<rh;j++){const k=j/rh,ins=Math.round(12*(1-Math.sqrt(Math.max(0,1-(1-k)*(1-k))))),col=k<.2?shade(roof,.32):k<.75?roof:shade(roof,-.28);R(c,OL,ins-5,top+j,w+10-ins*2,1);R(c,col,ins-4,top+j,w+8-ins*2,1)}
 R(c,OL,24,top+8,w-48,12);R(c,'#bfe4f2',25,top+9,w-50,10);R(c,'#e6f7fd',25,top+9,w-50,3);for(let xx=34;xx<w-26;xx+=12)R(c,'#7fb0c4',xx,top+9,1,10);
 R(c,shade(roof,-.5),-4,ye-3,w+8,3);R(c,'#e9e3cf',-4,ye,w+8,2);if(o.cold)R(c,'#f4f9fb',8,top,w-16,4);
 // antena y parabólica
 R(c,OL,w-34,top-22,3,24);R(c,'#8f9a9a',w-33,top-22,1,24);disc(c,OL,22,top+3,9,6);disc(c,'#dfe6e6',22,top+2,8,5);disc(c,'#b4bfc0',24,top+3,4,3);R(c,OL,21,top+6,2,6);
 // ventanal de arco en la fachada
 archWindow(c,cx,ye+2,34,24);for(const wx of [14,w-40])window_(c,wx,ye+6,26,16,{frame:'#f2eee2'});
 for(const wx of [14,w-40])window_(c,wx,ye+40,26,h-ye-60,{frame:'#efe8d8'});
 glassDoor(c,cx,h-6,28,28);if(b.label)plaque(c,cx,ye+30,b.label,{bg:'#f4f6ec',fg:'#2f4a5a'});
 pot(c,cx-26,h-14,2);pot(c,cx+17,h-14,0)}
function academy(c,b,w,h,o){
 const cx=w/2,ye=52,top=-8,roof=b.roof;
 R(c,OL,1,ye-2,w-2,h-ye+2);siding(c,2,ye,w-4,h-ye-6,b.wall,6);R(c,shade(b.wall,-.16),w-12,ye,10,h-ye-6);stone(c,0,h-6,w,6);
 hipRoof(c,4,w-4,top,ye,roof,{snow:o.cold});
 // torre central con reloj
 const tw=44,tx=cx-tw/2,tt=-46;R(c,OL,tx-1,tt+16,tw+2,ye-tt-14);siding(c,tx,tt+18,tw,ye-tt-18,shade(b.wall,.05),6);
 poly(c,OL,[[tx-6,tt+19],[cx,tt-6],[tx+tw+6,tt+19]]);poly(c,shade(roof,.15),[[tx-4,tt+17],[cx,tt-3],[cx,tt+17]]);poly(c,shade(roof,-.2),[[cx,tt-3],[tx+tw+4,tt+17],[cx,tt+17]]);
 R(c,shade(b.wall,-.2),tx,tt+44,tw,2);R(c,'#ffffff',tx,tt+46,tw,1);archWindow(c,cx-9,tt+50,12,16);archWindow(c,cx+9,tt+50,12,16);R(c,shade(b.wall,-.2),tx,ye-4,tw,2);disc(c,OL,cx,tt+30,10,10);disc(c,'#fbf7ea',cx,tt+30,9,9);R(c,OL,cx,tt+23,1,8);R(c,OL,cx,tt+30,6,1);for(let a=0;a<12;a++)R(c,'#7d8a84',Math.round(cx+Math.cos(a/6*Math.PI)*7),Math.round(tt+30+Math.sin(a/6*Math.PI)*7),1,1);
 // columnas y ventanas en dos plantas
 for(let i=0;i<6;i++){const wx=12+i*((w-24-20)/5);if(Math.abs(wx+10-cx)<26)continue;window_(c,wx,ye+8,20,14,{});window_(c,wx,ye+36,20,Math.max(12,h-ye-60),{box:i+1})}
 for(const px of [cx-30,cx+22]){R(c,OL,px-1,ye,10,h-ye-6);R(c,'#fbf7ea',px,ye,8,h-ye-7);R(c,'#ddd6c0',px+5,ye,3,h-ye-7)}
 woodDoor(c,cx,h-6,30,32,'#5a6f8a');if(b.label)plaque(c,cx,ye+4,b.label,{bg:'#eef3fa',fg:'#2f4a6a'})}
function guild(c,b,w,h,o){
 // casa de especialidades: templo con aleros curvos, columnas lacadas y farolillos
 const cx=w/2,ye=66,top=-10,roof=b.roof,lac='#b8352f';
 R(c,OL,1,ye-2,w-2,h-ye+2);R(c,'#efe6d2',2,ye,w-4,h-ye-8);for(let xx=2;xx<w-4;xx+=4)R(c,'#e0d6be',xx,ye,1,h-ye-8);
 stone(c,-4,h-8,w+8,8);R(c,'#cfc6ae',-4,h-10,w+8,2);
 // celosías
 for(const wx of [20,w-56]){R(c,OL,wx-1,ye+12,38,30);R(c,'#7a4a2a',wx,ye+13,36,28);R(c,'#f3ead2',wx+2,ye+15,32,24);for(let i=wx+2;i<wx+34;i+=6)R(c,'#9a6a40',i,ye+15,1,24);for(let j=ye+15;j<ye+39;j+=6)R(c,'#9a6a40',wx+2,j,32,1)}
 for(const px of [8,w-16,cx-34,cx+26]){R(c,OL,px-1,ye,10,h-ye-9);R(c,lac,px,ye,8,h-ye-10);R(c,shade(lac,.35),px+1,ye,2,h-ye-10);R(c,'#e7c46a',px-1,ye+2,10,2);R(c,'#e7c46a',px-1,h-14,10,2)}
 woodDoor(c,cx,h-8,36,34,'#6a3a22');
 // tejado de dos niveles con puntas levantadas
 const eave=(y0,y1,inset,col)=>{const H=y1-y0;for(let j=0;j<H;j++){const k=j/H,ins=inset*(1-k),lift=Math.round(5*Math.pow(1-k,3));R(c,OL,ins-8,y0+j-lift,w+16-ins*2,1);R(c,j<3?shade(col,.35):k<.8?col:shade(col,-.3),ins-7,y0+j-lift,w+14-ins*2,1)}
  for(let xx=0;xx<w;xx+=6)R(c,shade(col,-.2),xx,y0+3,1,H-6);R(c,OL,-8,y1-1,w+16,2);R(c,'#e9cf7a',-8,y1-3,w+16,1)};
 eave(top+18,ye,38,roof);eave(top-10,top+20,62,shade(roof,.06));
 R(c,'#e7c46a',cx-18,top-14,36,3);disc(c,OL,cx,top+30,9,9);disc(c,'#f6e7b0',cx,top+30,8,8);const BA=root.BuildingArt;if(BA&&BA.emblem)BA.emblem(c,cx,top+30,'psychic','#ad81c2');
 if(o.cold){R(c,'#f4f9fb',24,top-12,w-48,3);R(c,'#f4f9fb',8,top+16,w-16,3)}
 if(b.label)plaque(c,cx,ye+2,b.label,{bg:'#fbf1d8',fg:'#5a2a6a'})}
function dojo(c,b,w,h,o){
 const cx=w/2,ye=58,top=-14,tile='#5a6470';
 R(c,OL,1,ye-2,w-2,h-ye+2);R(c,'#7a5534',2,ye,w-4,h-ye-8);
 // paneles shoji
 for(let px=10;px<w-14;px+=28){if(Math.abs(px+12-cx)<24)continue;R(c,OL,px-1,ye+8,26,h-ye-24);R(c,'#f6f1e2',px,ye+9,24,h-ye-26);for(let i=px+6;i<px+24;i+=6)R(c,'#a8865e',i,ye+9,1,h-ye-26);for(let j=ye+15;j<h-16;j+=7)R(c,'#a8865e',px,j,24,1)}
 for(let px=2;px<w-4;px+=28)R(c,'#4a321e',px,ye,4,h-ye-8);stone(c,-2,h-8,w+4,8);R(c,'#5e4026',-2,h-11,w+4,3);
 // tejado de tejas grises con caballete
 const H=ye-top;for(let j=0;j<H;j++){const k=j/H,ins=Math.round(26*(1-k)),lift=j<4?0:0,col=k<.12?'#8a949e':k<.85?(j%4===0?'#4a535d':tile):'#3c444d';R(c,OL,ins-7,top+j-lift,w+14-ins*2,1);R(c,col,ins-6,top+j,w+12-ins*2,1)}
 for(let xx=0;xx<w;xx+=5){R(c,'#454e57',xx,top+6,1,H-8)}
 R(c,OL,20,top-5,w-40,6);R(c,'#7c8792',21,top-4,w-42,4);R(c,'#a9b2bb',21,top-4,w-42,1);for(const ex of [16,w-22])R(c,OL,ex,top-9,6,7);
 R(c,'#2f363d',-7,ye-3,w+14,3);if(o.cold)R(c,'#f4f9fb',22,top-4,w-44,3);
 // puerta corredera
 R(c,OL,cx-21,h-44,42,36);R(c,'#f6f1e2',cx-20,h-43,40,34);for(let i=cx-20;i<cx+20;i+=5)R(c,'#a8865e',i,h-43,1,34);R(c,'#4a321e',cx-1,h-43,2,34);R(c,'#c9b083',cx-24,h-8,48,3);
 if(b.label)plaque(c,cx,ye+1,b.label,{bg:'#f6ecd0',fg:'#6a2a1a'})}

const KIND=b=>b.id.startsWith('house')?'house':b.id==='clinic'?'clinic':b.id==='market'?'market':b.id==='gym'?'gym':b.id==='lab'?'lab':b.id==='academy'?'academy':b.id==='guild'?'guild':b.id==='school'?'dojo':null;
const DRAW={house,clinic,market,gym,lab,academy,guild,dojo};
const ML=20,MR=26,MT=64,MB=10,cache=new Map();
function bake(b,region){
 const k=KIND(b);if(!k)return null;const w=b.w,h=b.h,key=[b.id,region,w,h,b.roof,b.wall,b.label,b.gymType||''].join('|');let e=cache.get(key);if(e!==undefined)return e;e=null;
 try{if(typeof document!=='undefined'){const cv=document.createElement('canvas');cv.width=w+ML+MR;cv.height=h+MT+MB;const g=cv.getContext('2d');if(g){g.translate(ML,MT);
  // sombra proyectada hacia abajo a la derecha (sol arriba-izquierda)
  g.fillStyle='rgba(16,42,34,.20)';g.beginPath();g.moveTo(w-2,6);g.lineTo(w+MR-4,18);g.lineTo(w+MR-4,h+MB-2);g.lineTo(10,h+MB-2);g.lineTo(4,h);g.lineTo(w-2,h);g.closePath();g.fill();
  DRAW[k](g,b,w,h,{region,cold:region==='frost'});e=cv}}}catch(err){e=null;try{console.warn('BuildingHD',b.id,err)}catch(_){}}
 if(cache.size>64)cache.clear();cache.set(key,e);return e}
function dynamic(c,b,x,y,w,h,time,k){
 const still=root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches,T=still?0:time;
 if(k==='house'){const chx=x+Math.round(w*.68)+5,sy=y-18;for(let i=0;i<4;i++){const t=still?(.2+i*.25):((T*.3+i/4+hs(b.id))%1),a=(1-t)*.5,rr=2+Math.round(t*4);c.globalAlpha=Math.max(0,a);disc(c,'#f2f4f2',chx+Math.round(Math.sin(t*6+i)*3+t*8),sy-Math.round(t*30),rr,rr);c.globalAlpha=1}}
 if(k==='gym'){const accent=root.Frontera.GYM_THEMES?.[b.__region]?.accent||'#e05a3a';for(const px of [x+4,x+w-6]){R(c,OL,px,y-40,2,22);const sw=Math.round(Math.sin(T*3+px)*1.5);for(let j=0;j<7;j++)R(c,j%2?accent:'#fff7d4',px+2,y-39+j,11-j+sw,1)}}
 if(k==='lab'){const on=still||Math.floor(T*1.6)%2===0;R(c,on?'#ff5a4a':'#7a2a28',x+w-34,y-46,3,3);if(on){c.fillStyle='rgba(255,90,70,.25)';c.fillRect(x+w-37,y-49,9,9)}}
 if(k==='guild'||k==='dojo'){const ly=k==='guild'?y+60:y+52;for(const lx of [x+18,x+w-26]){const sw=Math.round(Math.sin(T*1.8+lx)*1);R(c,'#3a2a1c',lx+3+sw,ly-6,1,6);R(c,OL,lx+sw-1,ly,10,12);R(c,'#d6453d',lx+sw,ly+1,8,10);R(c,'#f28a6a',lx+sw+1,ly+2,2,7);R(c,'#f0c85a',lx+sw,ly+1,8,1);R(c,'#f0c85a',lx+sw,ly+10,8,1)}}
}
function draw(c,b,x,y,time){
 const region=root.Frontera?.districtBase?.(b.region||'campina')||b.region||'campina',k=KIND(b);if(!k)return false;
 const cv=bake(b,region);if(!cv)return false;b.__region=region;
 const X=Math.round(x),Y=Math.round(y);c.drawImage(cv,X-ML,Y-MT);dynamic(c,b,X,Y,b.w,b.h,time||0,k);return true}
root.BuildingHD={draw,kinds:Object.keys(DRAW)};
})(typeof window!=='undefined'?window:globalThis);
