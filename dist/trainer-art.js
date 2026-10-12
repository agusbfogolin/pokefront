// Original, code-native pixel art for the two protagonists. No remote assets.
// 32x46 cells with a fixed foot anchor, eight views (five drawn, three mirrored),
// a quiet idle (blink + breath) and an eight-frame gait: contact / down / passing / up on each foot.
// Parts are painted as flat shapes, then a coloured outline pass closes the silhouette.
(()=>{
'use strict';
const W=32,H=46,GY=40,TOP=2,FRAMES=19; // GY = neutral sole row (before TOP offset); frames: 0 idle, 1 blink, 2 breath, 3..10 walk, 11..18 run
const COMMON={
 ink:'#1d2733',eye:'#2a2030',eyeLight:'#8a6572',
 skin:'#f2c8a0',skinLight:'#ffe0bc',skinShade:'#d79e7a',skinDark:'#a96a5a',mouth:'#c4786a',blush:'#ec9c8a',
 white:'#fff7e2',gold:'#f4c95d',goldDark:'#c8923a',
 sole:'#e6d9b6',soleShade:'#b8a784'
};
const MALE={...COMMON,
 hair:'#4a3428',hairLight:'#7a563d',hairDark:'#33241c',
 crown:'#2f62ad',crownLight:'#63a0e6',crownShade:'#22477f',crownDeep:'#173160',
 panel:'#f6f0df',panelShade:'#d8cfb6',brim:'#2a5496',brimLight:'#5b8fd4',brimShade:'#183362',
 leaf:'#3f9d5a',leafLight:'#8fdc8a',
 coat:'#f2ab3d',coatLight:'#ffd070',coatShade:'#c77a25',coatDeep:'#94521b',
 shirt:'#f8f2de',shirtShade:'#d7cdb0',
 pants:'#4a5875',pantsLight:'#6a7da3',pantsShade:'#333d57',
 boot:'#764f37',bootLight:'#a3724f',bootShade:'#523626',
 pack:'#3f9d88',packLight:'#78d4b8',packShade:'#2a6f62',packDeep:'#1d4f47',
 roll:'#e6d2a2',rollShade:'#bda26f',strap:'#8a5a3a',strapLight:'#b98660',strapShade:'#5a3825',
 belt:'#4f3526'
};
const FEMALE={...COMMON,
 hair:'#8c4b31',hairLight:'#c47f55',hairDark:'#5c2d20',
 crown:'#f3ebdb',crownLight:'#ffffff',crownShade:'#d4c8b0',crownDeep:'#a99c82',
 panel:'#e85d4e',panelShade:'#b83f3d',brim:'#e85d4e',brimLight:'#ff9a84',brimShade:'#a8383a',
 leaf:'#fff3d6',leafLight:'#ffffff',
 coat:'#39a89c',coatLight:'#7adcc8',coatShade:'#267b78',coatDeep:'#1a5555',
 shirt:'#f8f2de',shirtShade:'#d7cdb0',
 pants:'#454a68',pantsLight:'#666e93',pantsShade:'#31364f',
 boot:'#8d5b40',bootLight:'#bd8760',bootShade:'#5f3b2a',
 pack:'#7f63b0',packLight:'#ad8fdc',packShade:'#5a4283',packDeep:'#3f2e5e',
 roll:'#f1e2bd',rollShade:'#c9b58a',strap:'#7b4a33',strapLight:'#a96f4e',strapShade:'#4f2e1f',
 belt:'#5a3a2a',tie:'#f4c95d'
};
const gaitPose=(step,run)=>{
 if(step<0)return{B:0,fwd:[0,0],lift:[0,0],arm:[0,0],sway:0};
 const a=step/8,ph=[a,(a+.5)%1],TAU=Math.PI*2;
 const fwd=ph.map(p=>Math.cos(TAU*p)),lift=ph.map(p=>Math.max(0,-Math.sin(TAU*p)));
 return{B:(run?[1,0,-2,0]:[1,0,-1,0])[step%4],fwd,lift,arm:[-fwd[0],-fwd[1]],sway:Math.sin(TAU*(a+.12))};
};
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const INK=hexRGB(COMMON.ink);
const atlases={};
function painter(c,P){
 const R=(k,x,y,w,h)=>{if(w<=0||h<=0)return;c.fillStyle=P[k]||k;c.fillRect(Math.round(x),Math.round(y),w,h)};
 // filled ellipse by pixel centres; y0/y1 clip rows, x0/x1 clip columns
 const E=(k,cx,cy,rx,ry,y0=-99,y1=99,x0=-99,x1=99)=>{
  c.fillStyle=P[k]||k;
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){
   if(y<y0||y>y1)continue;const dy=(y+.5-cy)/ry;if(dy*dy>1)continue;
   const hw=rx*Math.sqrt(1-dy*dy);let a=Math.round(cx-hw),b=Math.round(cx+hw);a=Math.max(a,x0);b=Math.min(b,x1+1);
   if(b>a)c.fillRect(a,y,b-a,1)}
 };
 return{R,E};
}
function paint(c,view,step,mode,female,run=false){
 const P=female?FEMALE:MALE,{R,E}=painter(c,P),po=gaitPose(step,run),B=po.B+(mode==='breath'?1:0),blink=mode==='blink',walking=step>=0;
 // running leans the upper body into the direction of travel (left-facing views are mirrored later)
 const LX=run&&(view===1||view===2||view===3)?-1:0;
 const U=(k,x,y,w,h)=>R(k,x+LX,y+B,w,h);
 const UE=(k,cx,cy,rx,ry,y0,y1,x0,x1)=>E(k,cx+LX,cy+B,rx,ry,y0===undefined?-99:y0+B,y1===undefined?99:y1+B,x0===undefined?undefined:x0+LX,x1===undefined?undefined:x1+LX);
 const STR=run?1.4:1,LIFT=run?3.6:2.2,SIDE=run?6:4,SLIFT=run?3.6:2.4,ASW=run?5:3,AV=run?2:1.2;
 const sway=walking?Math.round(po.sway*(run?2.4:1.4)):0;
 const eye=(x,y,w=2)=>{if(blink){U('eye',x,y+2,w,1);return}U('eye',x,y,w,3);U('white',x,y,1,1);U('eyeLight',x+w-1,y+2,1,1)};
 // ----- legs -----
 function legFront(x,i,shade){
  const fw=po.fwd[i],lf=po.lift[i],dy=walking?Math.round(fw*STR-lf*LIFT):0,sole=GY+dy,top=31+B,len=Math.max(1,sole-3-top);
  const col=shade?'pantsShade':'pants';
  R(col,x,top,5,len);R(shade?'pants':'pantsLight',x,top,1,len);R('pantsShade',x+4,top,1,len);
  if(lf>.4)R('pantsShade',x+1,top+Math.max(0,len-2),3,1);
  R('boot',x-1,sole-3,7,3);R('bootLight',x-1,sole-3,4,1);R('bootShade',x+4,sole-2,2,2);R('sole',x-1,sole,7,1);
 }
 function legSide(i,shade){
  const fw=po.fwd[i],lf=po.lift[i],s=walking?Math.round(fw*SIDE):0,dy=walking?-Math.round(lf*SLIFT):0,sole=GY+dy,top=31+B,lx=14+s;
  const back=walking&&fw<-.35&&lf===0,fwdSwing=lf>.5?1:0;
  const col=shade?'pantsShade':'pants',px=lx+(back?1:0)+fwdSwing,len=Math.max(1,sole-4-top+(back?-1:0));
  R(col,px,top,5,len);if(!shade)R('pantsLight',px,top,1,len);R('pantsShade',px+4,top,1,len);
  if(back){R('boot',lx-2,sole-2,4,2);R('boot',lx+2,sole-4,4,3);R('bootLight',lx-2,sole-2,3,1);R('sole',lx-2,sole,4,1);R('sole',lx+2,sole-1,4,1)}
  else{const bx=lx-2+fwdSwing;R('boot',bx,sole-3,7,3);R('bootLight',bx,sole-3,5,1);R('bootShade',bx+5,sole-2,2,2);R('sole',bx,sole,7,1)}
  if(shade){c.fillStyle='rgba(18,26,44,.30)';c.fillRect(lx-2,sole-4,8,5)}
 }
 // ----- arms -----
 function armFront(x,sw,far){
  const dy=Math.round(sw*AV),t=20+dy;
  U('coatDeep',x,t,3,8);U('coatShade',x,t+1,3,7);U(far?'coatShade':'coat',x,t+1,2,6);if(!far)U('coatLight',x,t+1,1,4);
  U('shirt',x,t+8,3,1);U('skinShade',x,t+9,3,3);U('skin',x,t+9,2,2);
 }
 function armSide(x,swingPx,far){
  const t=20,ax=Math.round(x+swingPx);
  U('coatDeep',ax,t,5,9);U(far?'coatShade':'coat',ax+1,t+1,3,7);U('coatShade',ax+4-1,t+1,1,7);if(!far)U('coatLight',ax+1,t+1,1,4);
  U('shirt',ax+1,t+9,3,1);U('skinShade',ax+1,t+10,3,3);U('skin',ax+1,t+10,2,2);
 }
 function pack(x,y,w,h){ // backpack rectangle with flap, buckle and lower pocket
  U('packDeep',x,y,w,h);U('packShade',x+1,y+1,w-2,h-2);U('pack',x+1,y+1,w-3,h-3);U('packLight',x+1,y+1,w-3,2);
  U('packDeep',x+1,y+Math.floor(h/2)-1,w-2,1);U('gold',x+Math.floor(w/2)-1,y+Math.floor(h/2),2,1);
  U('packShade',x+1,y+h-4,w-2,2);
 }
 function bedroll(x,y,w){U('rollShade',x,y,w,4);U('roll',x,y,w,3);U('white',x+1,y,w-3,1);U('strapShade',x+2,y,1,4);U('strapShade',x+w-3,y,1,4)}
 function rollEnd(cx,cy){cx+=LX;E('strapShade',cx,cy+B,3.6,3.3);E('rollShade',cx,cy+B,3.2,2.9);E('roll',cx-.3,cy-.3+B,2.7,2.4);U('rollShade',cx-1,cy-1,2,1);U('rollShade',cx,cy,1,1)}
 // ----- cap pieces (same shapes for both avatars; the palette decides the look) -----
 const dome=(cx,cy,rx,ry,y1,x0,x1)=>{
  UE('crownDeep',cx,cy+.3,rx+.4,ry+.4,0,y1,x0,x1);UE('crownShade',cx,cy+.1,rx,ry,0,y1,x0,x1);UE('crown',cx-.5,cy-.2,rx-.7,ry-.6,0,y1,x0,x1);
  UE('crownLight',cx-2.6,cy-2.6,3.4,2.4,0,y1-1,x0,x1);
 };
 const sprout=(x,y)=>{U('leaf',x,y,1,2);U('leaf',x+2,y,1,2);U('leaf',x+1,y+1,1,2);U('leafLight',x,y,1,1)};
 function brimFront(dx=0){
  U('brimLight',9+dx,9,15,1);U('brim',8+dx,10,17,1);U('brimLight',9+dx,10,6,1);U('brimShade',9+dx,11,15,1);U('skinShade',11+dx,12,11,1);
 }
 function capFront(){
  dome(16,8.1,7.5,6.6,10);
  U('crownShade',12,3,1,6);U('crownShade',20,3,1,6);
  UE('panel',16,7.8,3.1,5.8,0,10,14,18);U('panelShade',18,5,1,5);U('crownDeep',16,1,1,1);
  sprout(15,5);brimFront();
 }
 function faceFront(){
  U('skinShade',14,17,5,3);U('skinShade',9,12,2,3);U('skin',9,12,1,2);U('skinShade',22,12,2,3);U('skin',23,12,1,2);
  UE('skinShade',16,13.3,6.5,5.6);UE('skin',15.7,13,6,5.2);UE('skinLight',14.4,12.2,3.3,2.3,11);
  U('skinShade',12,18,9,1);
  eye(13,14);eye(18,14);U('mouth',15,17,3,1);U('blush',11,16,2,1);U('blush',20,16,2,1);
 }
 function torsoFront(){
  U('coatDeep',10,20,13,11);U('coatShade',10,21,13,10);U('coat',10,21,10,10);U('coat',11,20,11,1);
  U('coatLight',11,21,2,7);U('coatShade',19,22,3,9);U('coatShade',16,22,1,9);U('coatDeep',10,22,1,6);U('coatDeep',22,22,1,6);
  U('shirt',14,19,5,3);U('shirtShade',15,21,3,1);U('coatShade',13,19,1,2);U('coatShade',19,19,1,2);
  U('strapShade',11,20,2,8);U('strap',11,20,1,8);U('strapShade',20,20,2,8);U('strap',20,20,1,8);
  U('strap',13,23,7,1);U('gold',16,22,2,2);U('goldDark',17,23,1,1);
  U('coatDeep',12,27,2,1);U('coatDeep',19,27,2,1);U('belt',10,30,13,2);U('gold',15,30,3,1);
  if(female){U('coatShade',9,30,1,2);U('coatShade',23,30,1,2)}
 }
 const ponytail=(x,y,len,sx)=>{U('hairDark',x+sx,y,5,len);U('hair',x+sx,y,4,len-1);U('hairLight',x+sx,y+1,1,len-4);U('tie',x+sx,y,5,2);U('goldDark',x+sx+4,y+1,1,1);U('hair',x+sx*2-(sx?0:0),y+len-1,4,2)};
 // =================== FRONT ===================
 if(view===0){
  legFront(11,0,false);legFront(17,1,false);
  armFront(7,po.arm[0],false);armFront(23,po.arm[1],true);
  torsoFront();faceFront();
  if(female){U('hair',9,9,3,9);U('hairLight',9,10,1,5);U('hair',21,9,3,9);U('hairDark',23,10,1,7);U('hair',11,12,11,1);U('hair',11,13,3,1);U('hair',19,13,3,1);U('hairLight',12,12,2,1)}
  else{U('hair',10,10,2,4);U('hair',21,10,2,4)}
  capFront();
 }
 // =================== BACK ===================
 else if(view===4){
  legFront(11,0,false);legFront(17,1,false);
  armFront(7,po.arm[0],false);armFront(23,po.arm[1],true);
  U('coatDeep',10,20,13,11);U('coatShade',10,21,13,10);U('coat',10,21,10,10);U('coatDeep',10,22,1,6);U('coatDeep',22,22,1,6);U('belt',10,30,13,2);
  bedroll(9,18,15);pack(11,20,11,11);
  U('strapShade',12,20,2,3);U('strapShade',19,20,2,3);U('strapLight',12,20,1,3);
  U('skinShade',14,17,5,3);
  U('skinShade',9,12,2,3);U('skin',9,12,1,2);U('skinShade',22,12,2,3);U('skin',23,12,1,2);
  UE('hairDark',16,13.4,6.4,5.8);UE('hair',15.7,13,6,5.4);UE('hairLight',13.5,11.6,2.8,1.8,10);
  if(female){U('hair',10,12,3,5);U('hair',20,12,3,5);ponytail(14,12,10,sway)}
  else{U('hair',12,16,9,2);U('hairDark',13,17,7,1)}
  dome(16,8.1,7.5,6.6,11);
  U('crownShade',12,3,1,7);U('crownShade',20,3,1,7);U('crownDeep',16,2,1,9);U('crownDeep',16,1,1,1);
  U('crownDeep',9,10,15,2);U('crownShade',9,10,15,1);
  if(female){U('crownDeep',14,9,5,3);U('hair',15,9,3,3);U('hairLight',15,9,1,2)}
  else{U('panelShade',14,10,5,2);U('panel',14,10,5,1);U('gold',16,11,1,1)}
 }
 // =================== SIDE (faces left) ===================
 else if(view===2){
  const ns=walking?Math.round(po.arm[0]*ASW):0,fs=walking?Math.round(po.arm[1]*ASW):0;
  armSide(13,fs,true);legSide(1,true);
  pack(18,20,7,11);rollEnd(22,19);U('strapShade',17,20,2,11);U('strap',17,20,1,10);
  legSide(0,false);
  U('coatDeep',12,20,9,11);U('coatShade',12,21,9,10);U('coat',12,21,7,10);U('coatLight',12,21,2,7);U('coatShade',17,22,3,9);
  U('shirt',12,19,3,3);U('shirtShade',13,21,2,1);U('belt',12,30,9,2);U('gold',12,30,2,1);U('coatDeep',13,27,3,1);
  if(female)U('coatShade',11,30,1,2);
  armSide(13,ns,false);
  // head
  U('skinShade',15,17,4,3);
  UE('skinShade',15.5,13.3,6.3,5.7);UE('skin',15,12.9,5.9,5.3);UE('skinLight',13.4,12,3,2.2,11);U('skin',8,14,2,2);U('skinLight',9,13,1,1);
  eye(11,13);U('mouth',10,17,2,1);U('blush',12,16,2,1);
  U('skinShade',17,13,3,3);U('skin',17,13,2,2);U('skinDark',18,14,1,1);
  if(female){
   UE('hairDark',19.6,14.6,4.2,6.4,9,22,16,25);UE('hair',19.3,14.2,3.8,6,9,22,16,25);U('hairLight',17,11,1,5);
   U('hair',14,11,3,6);U('hairLight',14,11,1,3);U('hair',12,12,3,2);U('hair',15,17,2,1);
   ponytail(21,12,11,sway);
  }else{
   UE('hairDark',19.8,13,4.4,5.2,9,17,17,24);UE('hair',19.5,12.6,4,4.7,9,16,17,24);U('hairLight',17,11,3,1);U('hair',15,10,2,3);U('hairDark',15,12,1,1);
  }
  dome(16.5,8.1,7.7,6.6,10);
  UE('panel',11.7,7.8,3.5,5.8,0,10,8,13);U('panelShade',13,5,1,5);U('crownShade',17,3,1,7);U('crownShade',21,4,1,6);sprout(9,5);U('crownDeep',16,1,1,1);
  U('crownShade',15,10,10,1);
  if(female)U('crownDeep',22,10,2,1);else{U('panel',21,10,3,1);U('panelShade',21,11,3,1)}
  U('brimLight',6,9,7,1);U('brim',4,10,9,1);U('brimLight',5,10,5,1);U('brimShade',5,11,8,1);U('brimShade',4,11,1,1);U('skinShade',10,12,3,1);
 }
 // =================== FRONT-LEFT 3/4 ===================
 else if(view===1){
  armFront(22,po.arm[1],true);pack(19,20,6,10);U('strapShade',19,20,2,10);rollEnd(22,19);
  legFront(10,1,false);legFront(16,0,false);
  armFront(7,po.arm[0],false);
  U('coatDeep',10,20,12,11);U('coatShade',10,21,12,10);U('coat',10,21,9,10);U('coat',11,20,10,1);
  U('coatLight',11,21,2,7);U('coatShade',18,22,3,9);U('coatShade',14,22,1,9);U('coatDeep',10,22,1,6);
  U('shirt',12,19,5,3);U('shirtShade',13,21,3,1);U('coatShade',11,19,1,2);U('coatShade',17,19,1,2);
  U('strapShade',11,20,2,8);U('strap',11,20,1,8);U('strapShade',18,20,2,8);U('strap',18,20,1,8);U('strap',12,23,7,1);U('gold',14,22,2,2);
  U('belt',10,30,12,2);U('gold',13,30,3,1);U('coatDeep',12,27,2,1);U('coatDeep',18,27,2,1);
  U('skinShade',13,17,5,3);U('skinShade',9,12,2,3);U('skin',9,12,1,2);
  UE('skinShade',15,13.3,6.3,5.6);UE('skin',14.6,13,5.9,5.2);UE('skinLight',13.2,12.2,3.3,2.3,11);
  U('skinShade',11,18,8,1);
  eye(10,14);eye(15,14);U('mouth',12,17,3,1);U('blush',10,16,2,1);U('blush',18,16,1,1);
  U('skinShade',20,12,2,3);U('skin',20,12,1,2);
  if(female){U('hair',9,9,3,9);U('hairLight',9,10,1,5);U('hair',19,9,4,10);U('hairDark',22,10,1,7);U('hair',11,12,10,1);U('hair',11,13,3,1);U('hair',17,13,3,1)}
  else{U('hair',10,10,2,4);U('hair',19,9,4,6);U('hairDark',22,10,1,4)}
  dome(15.5,8.1,7.5,6.6,10);
  U('crownShade',11,3,1,6);U('crownShade',19,3,1,6);
  UE('panel',13,7.8,3.1,5.8,0,10,11,15);U('panelShade',15,5,1,5);U('crownDeep',15,1,1,1);sprout(12,5);
  U('brimLight',6,9,13,1);U('brim',5,10,15,1);U('brimLight',6,10,6,1);U('brimShade',6,11,13,1);U('skinShade',9,12,10,1);U('crownShade',19,9,4,2);
 }
 // =================== BACK-LEFT 3/4 ===================
 else if(view===3){
  armFront(7,po.arm[0],false);armFront(23,po.arm[1],true);
  legFront(10,1,false);legFront(16,0,false);
  U('coatDeep',10,20,13,11);U('coatShade',10,21,13,10);U('coat',10,21,10,10);U('coatDeep',10,22,1,6);U('coatDeep',22,22,1,6);U('belt',10,30,13,2);
  bedroll(10,18,15);pack(12,20,11,11);
  U('strapShade',13,20,2,3);U('strapShade',20,20,2,3);U('strapLight',13,20,1,3);
  U('skinShade',13,17,5,3);
  U('skinShade',9,12,3,4);U('skin',9,12,2,3);U('skinLight',9,12,1,1);U('skinShade',21,12,3,3);U('skin',22,12,1,2);
  UE('hairDark',16,13.4,6.4,5.8,9,18,12,25);UE('hair',16.2,13,6,5.4,9,17,12,25);UE('hairLight',14.5,11.6,2.8,1.8,10);
  U('skinDark',9,15,1,1);
  if(female){U('hair',10,12,3,5);U('hair',20,12,3,5);ponytail(15,12,10,sway)}
  else{U('hair',13,16,8,2);U('hairDark',14,17,6,1)}
  dome(15.5,8.1,7.5,6.6,11);
  U('crownShade',11,3,1,7);U('crownShade',19,3,1,7);U('crownDeep',15,2,1,9);U('crownDeep',15,1,1,1);
  U('crownDeep',8,10,15,2);U('crownShade',8,10,15,1);
  if(female){U('crownDeep',13,9,5,3);U('hair',14,9,3,3);U('hairLight',14,9,1,2)}
  else{U('panelShade',13,10,5,2);U('panel',13,10,5,1);U('gold',15,11,1,1)}
  U('brimShade',6,9,4,3);U('brim',6,10,3,1);U('brimLight',7,9,2,1);
 }
}
function outline(cv){
 const c=cv.getContext('2d'),img=c.getImageData(0,0,W,H),d=img.data,o=new Uint8ClampedArray(d);
 const A=(x,y)=>x<0||y<0||x>=W||y>=H?0:d[(y*W+x)*4+3];
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const i=(y*W+x)*4;if(d[i+3]>40)continue;
  let n=0,r=0,g=0,b=0;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   if(A(x+dx,y+dy)>200){const j=((y+dy)*W+x+dx)*4;r+=d[j];g+=d[j+1];b+=d[j+2];n++}
  }
  if(!n)continue;
  r/=n;g/=n;b/=n;const k=.74;
  o[i]=r*(1-k)+INK[0]*k;o[i+1]=g*(1-k)+INK[1]*k;o[i+2]=b*(1-k)+INK[2]*k;o[i+3]=255;
 }
 img.data.set(o);c.putImageData(img,0,0);
}
function build(avatar){
 const atlas=document.createElement('canvas');atlas.width=W*FRAMES;atlas.height=H*8;
 const ac=atlas.getContext('2d');ac.imageSmoothingEnabled=false;
 const tmp=document.createElement('canvas');tmp.width=W;tmp.height=H;const t=tmp.getContext('2d',{willReadFrequently:true});
 for(let dir=0;dir<8;dir++)for(let frame=0;frame<FRAMES;frame++){
  t.clearRect(0,0,W,H);t.save();t.translate(0,TOP);
  const mirrored=dir>4,view=mirrored?8-dir:dir;
  const step=frame>=3?(frame-3)%8:-1,mode=frame===1?'blink':frame===2?'breath':'idle';
  paint(t,view,step,mode,avatar==='female',frame>=11);t.restore();outline(tmp);
  ac.save();ac.translate(frame*W,dir*H);
  if(mirrored){ac.translate(W,0);ac.scale(-1,1)}
  ac.drawImage(tmp,0,0);ac.restore();
 }
 return atlas;
}
const DIR=[[0,1],[-.7,.7],[-1,0],[-.7,-.7],[0,-1],[.7,-.7],[1,0],[.7,.7]];
const DUST={trail:'196,170,128',paved:'208,200,182',sand:'226,205,150',rock:'176,170,160',snow:'244,250,255',grass:'176,205,150'};
// Soft puffs kicked up at each footfall. They stay where the foot landed, so they are derived from the walked distance only.
function dust(ctx,x,y,dir,distance,ground,run){
 const rgb=DUST[ground];if(!rgb)return;
 const stride=run?40:32,age=distance%stride,step=Math.floor(distance/stride),life=run?18:15;if(age>life)return;
 const u=DIR[dir],side=(step%2?1:-1)*3,k=1-age/life,r=1+Math.floor(age/4)+(run?1:0);
 const px=Math.round(x-u[0]*age-u[1]*side),py=Math.round(y-1-u[1]*age+u[0]*side*.5);
 const a=(ground==='grass'?.26:.46)*k*(run?1.15:1);
 ctx.fillStyle='rgba('+rgb+','+a.toFixed(2)+')';
 ctx.fillRect(px-r,py-1,r*2+1,2);ctx.fillRect(px-r+1,py-2-(r>>1),r*2-1,2);
 if(r>1){ctx.fillRect(px-r-1,py,2,1);ctx.fillRect(px+r,py,2,1)}
 if(run&&age>5)ctx.fillRect(px+(step%2?-r-3:r+2),py-3-(age>>3),2,1);
}
function draw(ctx,x,y,dir,distance=0,moving=false,time=0,reducedMotion=false,avatar='male',ground='',run=false){
 const key=avatar==='female'?'female':'male';
 const sheet=atlases[key]||(atlases[key]=build(key)),direction=((Math.round(dir)||0)%8+8)%8;
 let frame=0;
 if(moving)frame=run?11+Math.floor(Math.max(0,distance)/10)%8:3+Math.floor(Math.max(0,distance)/8)%8;
 else if(!reducedMotion){const t=time%4.9;frame=t>4.7?1:(t>2.4&&t<3.3)?2:0}
 ctx.save();ctx.imageSmoothingEnabled=false;
 // The shadow stays on the ground while feet and shoulders animate above it.
 ctx.fillStyle='#2444323b';ctx.fillRect(Math.round(x)-10,Math.round(y)-1,21,4);
 ctx.fillStyle='#24443220';ctx.fillRect(Math.round(x)-7,Math.round(y)-2,15,6);
 if(moving&&!reducedMotion)dust(ctx,x,y,direction,Math.max(0,distance),ground,run);
 ctx.drawImage(sheet,frame*W,direction*H,W,H,Math.round(x)-16,Math.round(y)-43,W,H);
 ctx.restore();
}
window.TrainerArt={draw};
})();
