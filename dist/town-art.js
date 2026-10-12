/* Arte original de pueblo: suelos (plaza, avenida, huerto, grava) y objetos (setos, vallas, farolas, bancos, puestos...).
   Luz desde arriba-izquierda. Todo es código: fillRect sobre píxeles de 1x1, sin imágenes externas. */
(function(root){'use strict';
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
const D=(c,col,cx,cy,rx,ry)=>{c.fillStyle=col;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}};
const hh=(a,b,s)=>{let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul((s|0)+11,1274126177);h=Math.imul(h^(h>>>13),1103515245);h^=h>>>16;return(h>>>0)/4294967296};
const CFG={cx:16,cy:-16,rx:198,ry:166};

/* ======================= SUELOS ======================= */
const STONE=['#c4c1ab','#bbb8a2','#cbc8b3','#b5b29d'],MORT='#9a9885';
function avenue(c,x,y,t,tx,ty){
 R(c,'#bdbaa4',x,y,32,32);
 for(let r=0;r<4;r++){const off=((r+ty*3+tx)%2)*8,py=y+r*8;
  for(let i=-1;i<3;i++){const px=x+off+i*16,x0=Math.max(px,x),x1=Math.min(px+16,x+32);if(x1<=x0)continue;
   R(c,STONE[Math.floor(hh(tx*3+i,ty*4+r,7)*4)],x0,py,x1-x0,8);
   R(c,'rgba(255,255,240,.30)',x0,py,x1-x0,1);if(px>=x)R(c,'rgba(255,255,240,.22)',px,py,1,8)}
  R(c,MORT,x,py+7,32,1);
  for(let i=-1;i<3;i++){const px=x+off+i*16+15;if(px>=x&&px<x+32)R(c,MORT,px,py,1,8)}}
 if(hh(tx,ty,8)>.82){const X=x+4+Math.floor(hh(tx,ty,9)*22),Y=y+Math.floor(hh(tx,ty,10)*4)*8+7;R(c,'#7fa060',X,Y,4,1);R(c,'#9cbd78',X+1,Y-1,2,1)}
}
function cobble(c,x,y,t,tx,ty,zone){
 // adoquines redondeados escalonados; 'zone' decide el tono (anillo central, banda, borde)
 for(let r=0;r<4;r++){const off=((r+ty*3)%2)*5,py=y+r*8;
  for(let i=-1;i<4;i++){const px=x+off+i*11,w=10,x0=Math.max(px,x),x1=Math.min(px+w,x+32);if(x1<=x0)continue;
   const wx=tx*32+(px-x)+5,wy=ty*32+r*8+4,z=zone(wx,wy),k=hh(tx*5+i,ty*4+r,3);
   const col=z.cols[Math.floor(k*z.cols.length)];
   R(c,z.mort,x0,py,x1-x0,8);R(c,col,Math.max(x0,px+1),py+1,Math.min(x1,px+w)-Math.max(x0,px+1)-0,6);
   R(c,'rgba(255,255,240,.35)',Math.max(x0,px+1),py+1,Math.max(0,Math.min(x1,px+w)-Math.max(x0,px+1)-2),1)}}
}
function curb(c,x,y,e,tx,ty){
 // bordillo de piedra en el borde de la plaza (N,E,S,W = 1,2,4,8)
 if(e&1){R(c,'#7f7966',x,y,32,1);R(c,'#e2dcc6',x,y+1,32,2);R(c,'#bdb69e',x,y+3,32,1);for(let i=0;i<4;i++)R(c,'#9a937e',x+((i*11+ty*5)%32),y+1,1,3)}
 if(e&4){R(c,'#e2dcc6',x,y+25,32,1);R(c,'#c8c1a9',x,y+26,32,3);R(c,'#8c8570',x,y+29,32,2);R(c,'#5f5a4b44',x,y+31,32,1);for(let i=0;i<4;i++)R(c,'#a59e88',x+((i*11+tx*5)%32),y+26,1,3)}
 if(e&8){R(c,'#7f7966',x,y,1,32);R(c,'#e2dcc6',x+1,y,2,32);R(c,'#bdb69e',x+3,y,1,32);for(let i=0;i<4;i++)R(c,'#9a937e',x+1,y+((i*11+ty*5)%32),3,1)}
 if(e&2){R(c,'#e2dcc6',x+28,y,1,32);R(c,'#c8c1a9',x+29,y,2,32);R(c,'#8c8570',x+31,y,1,32);for(let i=0;i<4;i++)R(c,'#a59e88',x+29,y+((i*11+tx*5)%32),2,1)}
}
function plazaZone(wx,wy){
 const dx=wx-CFG.cx,dy=wy-CFG.cy,r=Math.hypot(dx/CFG.rx,dy/CFG.ry),a=Math.atan2(dy,dx);
 const spoke=Math.abs(Math.sin(a*4))*Math.hypot(dx,dy)<9;
 if(r<.17)return{cols:['#cfc8ae','#d6cfb6'],mort:'#a8a18a'};
 if(r<.50)return spoke?{cols:['#d2b898','#d8bf9f'],mort:'#ab9172'}:{cols:['#dcd5bd','#d3ccb4','#e0dac4'],mort:'#aaa38d'};
 if(r<.60)return{cols:['#d2b093','#cba68a','#d8b99d'],mort:'#a98a6d'};
 if(r<.88)return spoke?{cols:['#d2b898','#d8bf9f'],mort:'#ab9172'}:{cols:['#d5ceb5','#cdc6ad','#dad4bd'],mort:'#a8a18a'};
 return{cols:['#b7af98','#aea68f','#bdb59f'],mort:'#8f8873'};
}
function gravel(c,x,y,t,tx,ty){
 R(c,'#d9d4be',x,y,32,32);
 for(let i=0;i<22;i++){const px=x+Math.floor(hh(tx*7+i,ty,21)*30),py=y+Math.floor(hh(tx,ty*7+i,22)*30),k=hh(tx+i,ty,23);R(c,k>.6?'#eee9d4':k>.25?'#c3bea8':'#aaa591',px,py,k>.7?2:1,1+(k>.9?1:0))}
 R(c,'rgba(140,130,100,.12)',x,y+30,32,2);
}
function farm(c,x,y,t,tx,ty){
 R(c,'#6a4d34',x,y,32,32);
 for(let r=0;r<4;r++){const py=y+r*8;R(c,'#85623f',x,py+2,32,3);R(c,'#4f3926',x,py+5,32,1);R(c,'#9a754c',x,py+2,32,1);
  for(let i=0;i<4;i++){const px=x+i*8+((r+tx)%2)*3+1,k=hh(tx*4+i,ty*4+r,5);
   if(k>.18){const ca=k>.6;R(c,'#2f6a3a',px,py-1,5,3);R(c,'#4f9a4f',px+1,py-2,3,2);R(c,'#7ec462',px+2,py-3,1,2);if(ca){R(c,'#e68a3a',px+2,py+1,1,2)}}}}
}
function forestFloor(c,x,y,t,tx,ty){
 R(c,'#335f3e',x,y,32,32);
 for(let i=0;i<5;i++){const px=x+Math.floor(hh(tx*5+i,ty,31)*28),py=y+Math.floor(hh(tx,ty*5+i,32)*28);R(c,hh(i,tx+ty,33)>.5?'#2a5334':'#3f7448',px,py,5,2)}
 if(hh(tx,ty,34)>.8){R(c,'#c9843a',x+8,y+14,2,1);R(c,'#e0b04a',x+20,y+8,2,1)}
}
const FL=[['#f4a9c6','#ffe3ee'],['#f6d64a','#fff3a8'],['#ffffff','#f6f0c0'],['#8ab4f0','#e3efff'],['#c49af0','#f1e3ff'],['#f78f5a','#ffd9c0'],['#ef6f6f','#ffd0d0']];
function meadow(c,x,y,t,tx,ty){
 R(c,'#8fb774',x,y,32,32);
 for(let i=0;i<6;i++){const px=x+Math.floor(hh(tx*6+i,ty,41)*30),py=y+Math.floor(hh(tx,ty*6+i,42)*30);R(c,hh(i,tx,ty)>.5?'#7ea866':'#9cc47c',px,py,3,2)}
 const theme=Math.floor(hh(tx>>1,ty>>1,43)*FL.length),alt=(theme+1+Math.floor(hh(tx,ty,44)*3))%FL.length;
 const n=12;for(let i=0;i<n;i++){const px=x+2+Math.floor(hh(tx*13+i,ty,45)*27),py=y+5+Math.floor(hh(tx,ty*13+i,46)*24),f=FL[hh(i,tx*3+ty,47)>.72?alt:theme];
  R(c,'#4e7a45',px,py+2,1,3);R(c,'#6c9a52',px-1,py+3,1,1);R(c,f[0],px-1,py,3,1);R(c,f[0],px,py-1,1,3);R(c,f[1],px,py,1,1)}
}
function ground(c,x,y,t,tx,ty,time){
 switch(t.plan){
  case'avenue':avenue(c,x,y,t,tx,ty);return true;
  case'plaza':cobble(c,x,y,t,tx,ty,plazaZone);if(t.edge)curb(c,x,y,t.edge,tx,ty);return true;
  case'gravel':gravel(c,x,y,t,tx,ty);return true;
  case'farm':farm(c,x,y,t,tx,ty);return true;
  case'meadow':meadow(c,x,y,t,tx,ty);return true;
  case'outer':forestFloor(c,x,y,t,tx,ty);return true;
 }
 return false;
}
/* decoración sobre suelo: nenúfares y juncos del estanque */
function details(c,x,y,t){
 if(t.deco==='lily'){
  const s=Math.floor((t.detail||0)*1000),n=1+(s%2);
  for(let i=0;i<n;i++){const px=x+6+Math.floor(hh(s,i,51)*18),py=y+8+Math.floor(hh(s,i,52)*16);
   D(c,'rgba(10,50,40,.28)',px+1,py+2,6,2);D(c,'#3f8a4a',px,py,6,3);D(c,'#5fb25a',px-1,py-1,5,2);R(c,'#9fd37a',px-3,py-1,2,1);R(c,'#4f9a52',px,py,6,1);
   if(hh(s,i,53)>.62){R(c,'#f7b8d2',px-1,py-3,3,2);R(c,'#fff0f6',px,py-4,1,2);R(c,'#f08ab4',px-1,py-1,3,1)}}
  return true}
 return false;
}

/* ======================= OBJETOS ======================= */
const DIM={oak:[72,36,70,60],orchard:[72,36,70,60],blossom:[72,36,70,60],hedge:[40,20,38,34],fence:[40,20,36,32],lamp:[28,14,58,52],bench:[40,20,30,26],planter:[40,20,36,32],well:[52,26,62,56],stall:[48,24,62,56],barrel:[30,15,28,24],crates:[40,20,34,30],statue:[40,20,60,54],scarecrow:[40,20,52,46],mailbox:[26,13,36,32],sign:[34,17,40,36]};
const SH={oak:[22,7,.26,9],orchard:[22,7,.26,9],blossom:[22,7,.26,9],hedge:[15,4,.24,1],fence:[15,3,.16,0],lamp:[7,3,.24,2],bench:[15,4,.22,0],planter:[15,4,.22,0],well:[17,5,.26,2],stall:[17,5,.22,0],barrel:[8,3,.24,2],crates:[13,4,.24,1],statue:[12,4,.26,2],scarecrow:[8,3,.2,2],mailbox:[6,2,.2,2],sign:[8,3,.2,2]};
const KINDS=new Set(Object.keys(DIM));
const GRN=['#254f2f','#357a3f','#4f9c4f','#86c468'];
function hedge(c,x,y,t){
 const m=t.variant|0,wOpen=!(m&8),eOpen=!(m&2),nEnd=!(m&1),sEnd=!(m&4),s=Math.floor((t.detail||0)*1000);
 const x0=x-16+(wOpen?2:0),x1=x+16-(eOpen?2:0),w=x1-x0,top=nEnd?y-27:y-32,faceTop=sEnd?y-11:y+1,bot=sEnd?y-1:y;
 R(c,'rgba(16,40,28,.30)',x-16+(wOpen?3:0),y-3,32-(wOpen?3:0)-(eOpen?3:0),5);
 // contorno oscuro y cara superior clara
 R(c,GRN[0],x0,top,w,bot-top+1);
 const ix0=x0+(wOpen?1:0),ix1=x1-(eOpen?1:0);
 R(c,GRN[2],ix0,top+(nEnd?1:0),ix1-ix0,faceTop-top-(nEnd?1:0));
 R(c,GRN[3],ix0+1,top+(nEnd?1:0),ix1-ix0-2,2);
 if(sEnd){R(c,GRN[1],ix0,faceTop,ix1-ix0,bot-faceTop);R(c,GRN[0],ix0,bot-2,ix1-ix0,2);R(c,GRN[0],ix0,faceTop,ix1-ix0,1)}
 const th=faceTop-top;
 for(let i=0;i<14;i++){const px=x0+2+Math.floor(hh(s,i,61)*(w-5)),py=top+2+Math.floor(hh(s,i,62)*Math.max(1,th-3));
  R(c,hh(s,i,67)>.5?GRN[3]:GRN[1],px,py,3,1);R(c,GRN[2],px+1,py+1,2,1)}
 if(sEnd)for(let i=0;i<6;i++){const px=x0+2+Math.floor(hh(s,i,68)*(w-5)),py=faceTop+2+Math.floor(hh(s,i,69)*5);R(c,GRN[0],px,py,3,1);R(c,GRN[2],px+1,py-1,2,1)}
 if(hh(s,3,63)>.6){const f=FL[Math.floor(hh(s,4,64)*FL.length)];for(let i=0;i<4;i++){const px=x0+3+Math.floor(hh(s,i,65)*(w-8)),py=top+3+Math.floor(hh(s,i,66)*Math.max(1,th-6));R(c,f[0],px,py,2,2);R(c,f[1],px,py,1,1)}}
}
function fence(c,x,y,t){
 const m=t.variant|0,N=m&1,E=m&2,S=m&4,Wn=m&8,W='#f2efe4',Sh='#c9c5b4',Dk='#8f8b7a';
 const hor=E||Wn||(!N&&!S);
 R(c,'rgba(16,40,28,.22)',x-(Wn?16:4),y-2,(Wn?16:4)+(E?16:4),3);
 if(hor){
  const x0=Wn?x-16:x-4,x1=E?x+16:x+4;
  // travesaños
  R(c,Dk,x0,y-6,x1-x0,2);R(c,W,x0,y-7,x1-x0,2);R(c,Dk,x0,y-12,x1-x0,2);R(c,W,x0,y-13,x1-x0,2);
  for(let px=Math.floor((x0+2)/4)*4+2;px<x1-1;px+=4){if(Math.abs(px-x)<4)continue;
   R(c,Sh,px,y-14,3,13);R(c,W,px,y-14,2,13);R(c,W,px,y-15,2,1);R(c,'#fff',px,y-14,1,12)}
 }
 if(N||S){
  // tramo en vertical: larguero visto de lado y postes
  const y0=N?y-32:y-18,y1=S?y:y-2;
  R(c,Dk,x-1,y0,3,y1-y0);R(c,W,x-1,y0,2,y1-y0);
  R(c,Sh,x+1,y0,1,y1-y0);
  for(const py of [y-8,y-24]){if(py>y0&&py<y1){R(c,Dk,x-3,py,7,2);R(c,W,x-3,py-1,6,2)}}
 }
 // poste central con tapa
 R(c,Dk,x-3,y-20,6,19);R(c,Sh,x-3,y-20,5,18);R(c,W,x-3,y-20,3,18);R(c,'#fff',x-3,y-21,5,2);R(c,Dk,x-4,y-22,8,1);R(c,W,x-3,y-22,5,1);
 if(!N&&!S&&!E&&!Wn)R(c,Dk,x-4,y-2,8,2);
}
function lamp(c,x,y,t){
 R(c,'#26302d',x-5,y-5,10,5);R(c,'#4c5f59',x-5,y-5,10,2);R(c,'#26302d',x-3,y-7,6,2);
 R(c,'#26302d',x-2,y-44,4,38);R(c,'#4c5f59',x-2,y-44,1,38);R(c,'#6e857d',x-2,y-44,1,20);
 R(c,'#26302d',x-4,y-14,8,2);R(c,'#4c5f59',x-4,y-15,8,1);
 // linterna
 R(c,'#26302d',x-6,y-52,12,2);R(c,'#26302d',x-5,y-54,10,2);R(c,'#4c5f59',x-4,y-55,8,1);R(c,'#26302d',x-1,y-57,2,2);
 R(c,'#26302d',x-6,y-50,12,10);R(c,'#ffe9a0',x-5,y-50,10,9);R(c,'#fff7d4',x-3,y-49,5,6);R(c,'#e8bb54',x+2,y-49,3,9);R(c,'#26302d',x-6,y-41,12,2);R(c,'#26302d',x-1,y-50,2,9);
}
function bench(c,x,y,t){
 const m=t.variant|0,wOpen=!(m&8),eOpen=!(m&2),x0=x-16+(wOpen?2:0),x1=x+16-(eOpen?2:0),w=x1-x0,Wd=['#7a5634','#a67d52','#cfa874','#5a3f26'];
 R(c,'rgba(16,40,28,.26)',x0,y-3,w,5);
 // patas de hierro en los extremos libres
 if(wOpen||(x%64===0)){R(c,'#2b3531',x0+1,y-12,3,12);R(c,'#52655e',x0+1,y-12,1,12)}
 if(eOpen){R(c,'#2b3531',x1-4,y-12,3,12);R(c,'#52655e',x1-4,y-12,1,12)}
 // respaldo
 for(const [by,bh] of [[-26,4],[-21,4]]){R(c,Wd[3],x0,y+by,w,bh+1);R(c,Wd[1],x0,y+by,w,bh);R(c,Wd[2],x0,y+by,w,1)}
 R(c,'#2b3531',x0+1,y-27,2,16);if(eOpen)R(c,'#2b3531',x1-3,y-27,2,16);
 // asiento
 R(c,Wd[3],x0,y-14,w,8);R(c,Wd[1],x0,y-14,w,6);R(c,Wd[2],x0,y-14,w,1);R(c,Wd[0],x0,y-9,w,2);
 for(let px=x0+9;px<x1-3;px+=11)R(c,Wd[0],px,y-13,1,4);
}
function planter(c,x,y,t){
 const s=Math.floor((t.detail||0)*1000),f=FL[s%FL.length],g=FL[(s+3)%FL.length];
 R(c,'rgba(16,40,28,.28)',x-14,y-3,29,5);
 // flores y follaje
 D(c,'#2f6a3a',x,y-19,12,5);D(c,'#4f9a4f',x-1,y-21,11,4);
 for(let i=0;i<10;i++){const px=x-11+Math.floor(hh(s,i,71)*22),py=y-27+Math.floor(hh(s,i,72)*9),fc=i%3?f:g;R(c,fc[0],px,py,3,2);R(c,fc[0],px+1,py-1,1,4);R(c,fc[1],px+1,py,1,1)}
 // caja de piedra
 R(c,'#8a8672',x-14,y-17,28,17);R(c,'#cfc9b2',x-13,y-16,26,15);R(c,'#e3ddc6',x-13,y-16,26,2);R(c,'#aaa48d',x-13,y-5,26,4);R(c,'#8a8672',x-13,y-9,26,1);R(c,'#8a8672',x-1,y-16,1,7);R(c,'#8a8672',x+7,y-8,1,7);R(c,'#8a8672',x-8,y-8,1,7);
}
function well(c,x,y,t){
 R(c,'rgba(16,40,28,.28)',x-18,y-3,38,6);
 // brocal de piedra
 D(c,'#7d7865',x,y-8,15,7);D(c,'#cfc9b2',x,y-11,15,7);R(c,'#a8a28b',x-15,y-11,31,10);R(c,'#cfc9b2',x-15,y-12,31,4);D(c,'#3c3a30',x,y-14,11,4);D(c,'#2a4f6c',x,y-14,10,3);D(c,'#4f8fb8',x-2,y-15,6,1);
 for(let i=0;i<3;i++){R(c,'#8a8672',x-12+i*9,y-8,1,7)}R(c,'#8a8672',x-15,y-8,31,1);R(c,'#b9b39a',x-14,y-6,29,1);
 // poste y tejado
 R(c,'#5a3f26',x-12,y-42,3,32);R(c,'#8a6743',x-12,y-42,1,32);R(c,'#5a3f26',x+10,y-42,3,32);R(c,'#8a6743',x+10,y-42,1,32);
 R(c,'#5a3f26',x-1,y-38,2,16);R(c,'#7a5a3a',x-4,y-24,8,6);R(c,'#4a3220',x-4,y-19,8,1);
 for(let r=0;r<10;r++){const hw=Math.round(20-r*1.9);R(c,r<5?'#c2543f':'#a5412f',x-hw,y-53+r,hw*2+1,1);}
 R(c,'#7d2e24',x-20,y-43,41,2);R(c,'#e0795f',x-6,y-52,10,1);
}
const AWN=[['#d6453d','#f6efe0'],['#3a79c4','#f6efe0'],['#3f9a55','#f6efe0'],['#e0902f','#f6efe0']];
function stall(c,x,y,t){
 const s=Math.floor((t.detail||0)*1000),aw=AWN[s%4];
 R(c,'rgba(16,40,28,.26)',x-17,y-3,35,6);
 // mostrador
 R(c,'#4f3926',x-15,y-14,31,14);R(c,'#8a6743',x-14,y-13,29,12);R(c,'#a67d52',x-14,y-13,29,2);R(c,'#5a3f26',x-14,y-5,29,1);for(let i=0;i<4;i++)R(c,'#6e4f31',x-9+i*8,y-12,1,11);
 // mercancía
 for(let i=0;i<5;i++){const px=x-13+i*6,col=[['#d6453d','#ff8a7a'],['#e8b930','#fff08a'],['#6fb34a','#c4ec8f'],['#e0902f','#ffd08a'],['#a0509a','#e0a0da']][(i+s)%5];D(c,col[0],px+2,y-17,3,3);R(c,col[1],px+1,y-19,1,1)}
 R(c,'#6e4f31',x-14,y-15,29,2);
 // postes y toldo a rayas
 R(c,'#5a3f26',x-15,y-46,2,32);R(c,'#5a3f26',x+14,y-46,2,32);
 for(let i=0;i<8;i++){const px=x-16+i*4;R(c,i%2?aw[1]:aw[0],px,y-50,4,13);R(c,i%2?'#dcd5c4':aw[0],px,y-39,4,3);R(c,'rgba(0,0,0,.14)',px,y-39,4,1);if(!(i%2))R(c,'rgba(255,255,255,.2)',px,y-50,4,2)}
 R(c,'#3a2a1c',x-17,y-51,34,2);
}
function barrel(c,x,y,t){
 R(c,'rgba(16,40,28,.28)',x-9,y-2,19,4);
 R(c,'#4f3926',x-8,y-20,17,20);R(c,'#8a6743',x-7,y-19,15,18);R(c,'#a67d52',x-7,y-19,5,18);R(c,'#6e4f31',x+3,y-19,5,18);
 R(c,'#3b4540',x-8,y-17,17,2);R(c,'#3b4540',x-8,y-6,17,2);R(c,'#6e7e78',x-8,y-17,17,1);R(c,'#6e7e78',x-8,y-6,17,1);
 D(c,'#4f3926',x,y-21,8,3);D(c,'#c29a68',x,y-21,7,2);D(c,'#6e4f31',x,y-21,4,1);
}
function crates(c,x,y,t){
 R(c,'rgba(16,40,28,.28)',x-15,y-2,31,5);
 const box=(bx,by,w,h)=>{R(c,'#4f3926',bx,by,w,h);R(c,'#a67d52',bx+1,by+1,w-2,h-2);R(c,'#c29a68',bx+1,by+1,w-2,2);R(c,'#7a5a3a',bx+1,by+h-4,w-2,3);R(c,'#4f3926',bx+3,by+1,1,h-2);R(c,'#4f3926',bx+w-4,by+1,1,h-2)};
 box(x-14,y-15,16,15);box(x+2,y-12,13,12);box(x-8,y-28,15,13);
 R(c,'#6fb34a',x-6,y-30,4,2);R(c,'#8fd36a',x-5,y-31,2,1);R(c,'#d6453d',x+0,y-30,3,2);
}
function statue(c,x,y,t){
 R(c,'rgba(16,40,28,.30)',x-17,y-3,36,6);
 // escalones y pedestal
 R(c,'#7d7865',x-16,y-8,33,8);R(c,'#cfc9b2',x-15,y-8,31,6);R(c,'#e3ddc6',x-15,y-8,31,2);R(c,'#a8a28b',x-15,y-3,31,2);
 R(c,'#7d7865',x-11,y-22,23,14);R(c,'#cfc9b2',x-10,y-22,21,12);R(c,'#e3ddc6',x-10,y-22,5,12);R(c,'#a8a28b',x+6,y-22,5,12);R(c,'#8a8672',x-12,y-24,25,3);R(c,'#e3ddc6',x-12,y-25,25,2);
 // esfera tipo balón
 const cx=x,cy=y-38;D(c,'#26302d',cx,cy,10,10);
 for(let j=-9;j<=9;j++){const w=Math.round(9*Math.sqrt(1-(j*j)/(9.6*9.6)));if(w<=0)continue;const col=j<-1?(j<-5?'#ff7a68':'#e2504a'):j>1?(j>5?'#c4c6b8':'#e8e6d8'):'#26302d';R(c,col,cx-w,cy+j,w*2,1);if(j<-1&&w>3)R(c,'#a52f33',cx+w-3,cy+j,3,1);if(j>1&&w>3)R(c,'#a9ac9f',cx+w-3,cy+j,3,1)}
 D(c,'#26302d',cx,cy,4,4);D(c,'#f6f5e9',cx,cy,2,2);R(c,'#ffffff',cx-6,cy-6,3,1);
}
function scarecrow(c,x,y,t){
 R(c,'rgba(16,40,28,.22)',x-8,y-2,17,4);
 R(c,'#5a3f26',x-1,y-40,3,40);R(c,'#8a6743',x-1,y-40,1,40);R(c,'#5a3f26',x-13,y-28,27,3);R(c,'#8a6743',x-13,y-29,27,2);
 // camisa remendada y paja
 R(c,'#3a6aa0',x-8,y-29,17,13);R(c,'#5a8cc4',x-8,y-29,17,3);R(c,'#e0b04a',x-4,y-24,4,4);R(c,'#a05a3a',x+2,y-21,3,3);
 R(c,'#e8c25a',x-16,y-27,4,4);R(c,'#e8c25a',x+13,y-27,4,4);R(c,'#e8c25a',x-7,y-16,3,3);R(c,'#e8c25a',x+4,y-16,3,3);
 // cabeza y sombrero
 D(c,'#d9b27c',x,y-35,6,5);R(c,'#2b2018',x-3,y-36,2,2);R(c,'#2b2018',x+2,y-36,2,2);R(c,'#7a3a2a',x-2,y-32,5,1);
 R(c,'#a67d52',x-9,y-41,19,3);R(c,'#c29a68',x-6,y-47,13,6);R(c,'#7a5a3a',x-6,y-43,13,2);
}
function mailbox(c,x,y,t){
 R(c,'rgba(16,40,28,.24)',x-7,y-2,15,3);
 R(c,'#5a3f26',x-1,y-18,3,18);R(c,'#8a6743',x-1,y-18,1,18);
 R(c,'#26405f',x-7,y-30,15,13);R(c,'#3a6aa0',x-6,y-30,13,11);R(c,'#7aa8d8',x-6,y-30,13,2);D(c,'#26405f',x,y-30,7,3);D(c,'#3a6aa0',x,y-31,6,2);R(c,'#1d2d44',x-3,y-24,7,2);
 R(c,'#d6453d',x+7,y-34,2,10);R(c,'#d6453d',x+5,y-35,4,3);
}
function sign(c,x,y,t){
 R(c,'rgba(16,40,28,.24)',x-8,y-2,17,3);
 R(c,'#5a3f26',x-2,y-28,4,28);R(c,'#8a6743',x-2,y-28,2,28);
 R(c,'#5a3f26',x-13,y-37,26,13);R(c,'#e1d3a2',x-12,y-36,24,11);R(c,'#f2e7bd',x-12,y-36,24,2);R(c,'#b8a874',x-12,y-27,24,2);
 R(c,'#4c5f3f',x-8,y-32,13,1);R(c,'#4c5f3f',x-8,y-29,9,1);R(c,'#4c5f3f',x+6,y-33,4,4);R(c,'#4c5f3f',x+5,y-31,6,1);
}
/* árboles: reutilizan el arte natural de TerrainArt con otra paleta / frutos */
function treeLike(c,x,y,t){
 const TA=root.TerrainArt;if(!TA)return;
 const k=t.obstacle,bi=k==='blossom'?'sakura':(k==='oak'&&hh(Math.floor((t.detail||0)*1000),2,81)>.82?'otono':'pradera');
 TA.obstacle(c,x,y,Object.assign({},t,{obstacle:'tree',biome:bi,fieldMove:null}));
 if(k==='orchard'){const s=Math.floor((t.detail||0)*1000);for(let i=0;i<11;i++){const px=x-14+Math.floor(hh(s,i,91)*29),py=y-50+Math.floor(hh(s,i,92)*26);if(((px-x)/15)**2+((py-(y-37))/14)**2>.8)continue;R(c,'#8c2a2a',px,py+1,3,3);R(c,'#e2504a',px,py,3,3);R(c,'#ff9a8a',px,py,1,1)}}
}
const DRAW={oak:treeLike,orchard:treeLike,blossom:treeLike,hedge,fence,lamp,bench,planter,well,stall,barrel,crates,statue,scarecrow,mailbox,sign};
function obstacle(c,x,y,t){const f=DRAW[t.obstacle];if(f)f(c,Math.round(x),Math.round(y),t)}
root.TownArt={ground,details,obstacle,handles:k=>KINDS.has(k),DIM,SH,config:CFG,setPlaza(cx,cy,rx,ry){CFG.cx=cx;CFG.cy=cy;CFG.rx=rx;CFG.ry=ry}};
})(typeof window!=='undefined'?window:globalThis);
