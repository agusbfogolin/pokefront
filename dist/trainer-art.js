// Original, code-native pixel art. Frame coordinates share a fixed foot anchor.
// Eight views, an eight-frame gait and a quiet idle blink; no remote assets.
(()=>{
'use strict';
const W=32,H=44,PALETTE={
 ink:'#293d3a',hair:'#4b4239',hairLight:'#75614a',
 skin:'#eac39b',skinLight:'#f8dbaf',skinShade:'#bc896e',
 cap:'#526b48',capLight:'#82935f',capShade:'#384f3f',
 coat:'#bccc98',coatLight:'#e1e4b6',coatShade:'#829774',
 shirt:'#edf0d0',scarf:'#c97757',scarfShade:'#934f42',
 pants:'#536b72',pantsLight:'#7f9595',pantsShade:'#3b515b',
 boot:'#574c40',bootLight:'#967a55',sole:'#c0b28c',
 pack:'#ac704f',packLight:'#d29a66',packShade:'#784e3e',
 gold:'#e7c681',white:'#fff2d2'
};
const gait=[0,1,2,1,0,-1,-2,-1];
const FEMALE={...PALETTE,hair:'#79513d',hairLight:'#b17d52',coat:'#cf957d',coatLight:'#efc1a0',coatShade:'#a77160',scarf:'#729e91',scarfShade:'#456c66',pack:'#6e9890',packLight:'#acc3a3',packShade:'#456c66'};
const atlases={};
function paint(c,view,step,blink=false,female=false){
 const P=female?FEMALE:PALETTE;
 const swing=step<0?0:gait[step],bounce=step>=0&&step%4===2?-1:0;
 const r=(color,x,y,w,h)=>{c.fillStyle=P[color];c.fillRect(x,y,w,h)};
 const upper=(color,x,y,w,h)=>r(color,x,y+bounce,w,h);
 // Hair is layered behind shoulders; the tied ponytail stays readable in back views.
 if(female){
  if(view===0){upper('ink',9,11,4,14);upper('hair',10,12,2,12);upper('hairLight',10,14,1,8);upper('ink',21,11,4,14);upper('hair',22,12,2,12);upper('hairLight',22,14,1,8)}
  else if(view<3){upper('ink',22,10,5,16);upper('hair',23,11,3,14);upper('hairLight',23,14,1,9);upper('hair',22,24,3,3);upper('gold',23,13,2,2)}
  else{upper('ink',10,10,15,12);upper('hair',11,11,13,10);upper('hairLight',12,14,2,5)}
 }
 function leg(x,y,shift=0){
  r('ink',x+shift,y,6,9);r('pants',x+shift+1,y,4,6);
  r('pantsLight',x+shift+1,y,1,4);r('pantsShade',x+shift+3,y+1,1,5);
  r('ink',x+shift-1,y+6,8,4);r('boot',x+shift,y+6,6,3);
  r('bootLight',x+shift,y+6,4,1);r('sole',x+shift,y+9,6,1);
 }
 function arm(x,y,far=false){
  upper('ink',x,y,5,10);upper(far?'coatShade':'coat',x+1,y,3,6);
  upper(far?'coat':'coatLight',x+1,y,1,4);upper('coatShade',x+1,y+5,3,1);
  upper('skinShade',x+1,y+7,3,3);upper('skin',x+1,y+7,2,2);
 }
 function pack(x,y,w=10){
  upper('ink',x+1,y,w-2,1);upper('ink',x,y+1,w,13);
  upper('packShade',x+1,y+1,w-2,12);upper('pack',x+2,y+2,w-4,10);
  upper('packLight',x+2,y+2,w-4,3);upper('packShade',x+2,y+5,w-4,1);
  upper('gold',x+Math.floor(w/2)-1,y+4,2,2);
  upper('packShade',x+2,y+8,w-4,4);upper('packLight',x+3,y+8,w-6,1);
  upper('pack',x+3,y+9,w-6,2);
 }
 function eye(x,y){
  upper('ink',x,y,2,blink?1:3);
  if(!blink){upper('white',x,y,1,1);upper('hairLight',x+1,y+2,1,1)}
 }
 function frontHead(){
  upper('ink',10,7,13,12);upper('ink',11,18,11,2);
  upper('hair',11,9,11,10);upper('skinShade',10,12,13,4);
  upper('skin',12,10,9,8);upper('skinLight',12,10,7,5);
  upper('hair',11,10,2,4);upper('hair',20,10,2,4);
  eye(13,13);eye(18,13);upper('skinShade',16,16,1,1);
  upper('skinShade',15,18,3,1);
  upper('ink',10,3,13,8);upper('ink',12,2,9,1);
  upper('cap',11,4,11,6);upper('capLight',12,3,8,2);
  upper('capShade',11,8,11,2);upper('capLight',12,5,1,2);
  upper('gold',15,6,3,2);upper('white',16,6,1,1);
  upper('ink',7,10,19,2);upper('cap',8,10,17,1);
  upper('capLight',9,10,6,1);
 }
 function turnedHead(back=false){
  upper('ink',10,7,14,12);upper('ink',12,18,10,2);
  upper('hair',12,9,11,10);upper('hairLight',20,12,2,5);
  upper('skinShade',9,12,5,5);
  upper('skin',10,11,back?3:9,7);upper('skinLight',10,11,back?2:7,3);
  if(!back){upper('hair',19,10,3,6);upper('skinShade',19,14,2,3);eye(11,13);eye(16,12);upper('skinShade',12,18,3,1)}
  else{upper('hair',14,11,8,8);upper('hairLight',15,17,5,1);upper('skinShade',11,16,2,2)}
  upper('ink',10,3,13,8);upper('ink',12,2,9,1);
  upper('cap',11,4,11,6);upper('capLight',12,3,7,2);upper('capShade',20,5,2,5);
  upper('capLight',12,5,1,3);if(!back)upper('gold',12,6,2,2);
  upper('ink',6,10,17,2);upper('cap',7,10,15,1);upper('capLight',8,10,6,1);
 }
 function sideHead(){
  upper('ink',10,7,13,12);upper('ink',8,10,4,8);upper('ink',6,12,4,4);
  upper('hair',14,8,8,11);upper('hairLight',19,12,2,5);
  upper('skinShade',9,10,9,9);upper('skin',9,10,7,8);upper('skinLight',9,10,5,4);
  upper('skin',7,13,3,2);upper('skinShade',14,14,3,3);upper('skin',15,14,1,2);
  eye(10,12);upper('skinShade',9,17,3,1);upper('hair',17,10,4,4);
  upper('ink',10,3,13,8);upper('ink',12,2,9,1);
  upper('cap',11,4,11,6);upper('capLight',12,3,8,2);upper('capShade',19,5,3,5);
  upper('capLight',12,5,1,3);upper('ink',5,10,16,2);upper('cap',6,10,14,1);
  upper('capLight',7,10,6,1);
 }
 if(view===0){
  leg(10,32+Math.max(0,swing));leg(18,32+Math.max(0,-swing));
  arm(7,22+Math.sign(swing),true);arm(23,22-Math.sign(swing));
  upper('ink',10,20,14,13);upper('coatShade',11,21,12,11);
  upper('coat',12,21,10,10);upper('coatLight',12,22,3,6);
  upper('shirt',15,21,4,10);upper('coatShade',14,23,1,8);upper('coatShade',19,23,1,8);
  upper('packShade',12,20,2,7);upper('packLight',13,21,1,5);
  upper('packShade',21,20,1,7);upper('gold',12,25,2,1);
  upper('coatShade',11,29,3,2);upper('coatShade',20,29,3,2);
  upper('ink',12,32,11,1);upper('bootLight',16,32,2,1);
  upper('skinShade',14,18,5,3);upper('skin',15,19,3,2);
  upper('scarfShade',12,20,9,2);upper('scarf',13,20,7,1);upper('scarf',17,22,2,3);
  frontHead();if(female){upper('hair',11,11,2,3);upper('hair',19,11,2,2);upper('hairLight',11,12,1,2)}
 }else if(view===1){
  leg(18,32+Math.max(0,-swing),Math.sign(-swing));leg(10,32+Math.max(0,swing),Math.sign(swing));
  arm(22,21-Math.sign(swing),true);pack(21,20,6);
  upper('ink',10,20,13,13);upper('coatShade',11,21,11,11);upper('coat',11,21,8,10);
  upper('coatLight',12,22,3,6);upper('shirt',11,22,2,8);upper('coatShade',14,23,1,8);
  upper('packShade',18,20,2,10);upper('packLight',18,21,1,7);upper('gold',18,27,2,1);
  arm(7,23+Math.sign(swing));upper('coatShade',13,29,3,2);upper('skinShade',12,18,5,3);
  upper('scarfShade',10,20,10,2);upper('scarf',11,20,6,1);upper('scarf',12,22,2,3);
  turnedHead();
 }else if(view===2){
  leg(16,32+Math.max(0,-swing),-swing);arm(17,21-Math.sign(swing),true);
  pack(21,19,6);leg(13,32+Math.max(0,swing),swing);
  upper('ink',11,20,12,13);upper('coatShade',12,21,10,11);upper('coat',12,21,7,10);
  upper('coatLight',12,22,3,5);upper('coatShade',12,30,6,1);
  upper('packShade',19,20,2,8);upper('packLight',19,21,1,5);
  arm(13,23+Math.sign(swing));upper('gold',19,27,2,1);upper('skinShade',12,18,5,3);
  upper('scarfShade',10,20,11,2);upper('scarf',11,20,7,1);upper('scarf',11,22,2,3);
  sideHead();
 }else if(view===3){
  leg(18,32+Math.max(0,-swing),Math.sign(-swing));leg(10,32+Math.max(0,swing),Math.sign(swing));
  arm(8,22+Math.sign(swing),true);arm(24,22-Math.sign(swing));
  upper('ink',10,20,15,13);upper('coatShade',11,21,13,11);upper('coat',11,21,11,10);
  upper('coatLight',11,22,3,6);upper('packShade',13,19,2,11);pack(14,20,10);
  upper('skinShade',13,18,5,3);upper('scarfShade',12,20,10,1);turnedHead(true);
  if(female){upper('ink',20,14,5,12);upper('hair',21,15,3,10);upper('hairLight',21,17,1,6);upper('gold',21,16,3,2)}
 }else{
  leg(10,32+Math.max(0,swing));leg(18,32+Math.max(0,-swing));
  arm(7,22+Math.sign(swing));arm(24,22-Math.sign(swing),true);
  upper('ink',10,20,15,13);upper('coatShade',11,21,13,11);upper('coat',11,21,12,10);
  upper('coatLight',11,22,2,7);upper('packShade',11,19,2,11);upper('packShade',22,19,2,11);
  pack(12,20,11);upper('scarfShade',12,19,11,2);
  upper('ink',10,7,14,12);upper('hair',11,9,12,9);upper('hairLight',12,16,9,2);
  upper('ink',10,3,14,10);upper('ink',12,2,10,1);
  upper('cap',11,4,12,8);upper('capLight',12,3,9,2);upper('capShade',11,10,12,2);
  upper('capLight',16,5,1,4);upper('capShade',16,10,3,2);upper('gold',17,11,1,1);
  upper('hair',11,13,12,4);upper('hairLight',12,15,2,2);upper('hairLight',19,15,2,2);
  if(female){upper('hair',11,14,12,6);upper('hairLight',12,15,2,3);upper('ink',16,17,5,10);upper('hair',17,18,3,8);upper('hairLight',17,20,1,5);upper('gold',17,18,3,2)}
 }
}
function build(avatar){
 const atlas=document.createElement('canvas');atlas.width=W*10;atlas.height=H*8;
 const c=atlas.getContext('2d');c.imageSmoothingEnabled=false;
 for(let dir=0;dir<8;dir++)for(let frame=0;frame<10;frame++){
  c.save();c.translate(frame*W,dir*H);
  const mirrored=dir>4,view=mirrored?8-dir:dir;
  if(mirrored){c.translate(W,0);c.scale(-1,1)}
  paint(c,view,frame<2?-1:frame-2,frame===1,avatar==='female');c.restore();
 }
 return atlas;
}
function draw(ctx,x,y,dir,distance=0,moving=false,time=0,reducedMotion=false,avatar='male'){
 const key=avatar==='female'?'female':'male';
 const sheet=atlases[key]||(atlases[key]=build(key)),direction=((Math.round(dir)||0)%8+8)%8;
 const frame=moving?2+Math.floor(Math.max(0,distance)/8)%8:(!reducedMotion&&time%4.9>4.7?1:0);
 ctx.save();ctx.imageSmoothingEnabled=false;
 // The shadow stays on the ground while feet and shoulders animate above it.
 ctx.fillStyle='#2444323b';ctx.fillRect(Math.round(x)-10,Math.round(y)-1,21,4);
 ctx.fillStyle='#24443220';ctx.fillRect(Math.round(x)-7,Math.round(y)-2,15,6);
 ctx.drawImage(sheet,frame*W,direction*H,W,H,Math.round(x)-16,Math.round(y)-42,W,H);
 ctx.restore();
}
window.TrainerArt={draw};
})();
