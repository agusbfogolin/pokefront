/* Original pixel scenery for seeded routes and caves. Tile size: 32 px. */
(function(root){'use strict';
const base=region=>root.Frontera?.districtBase(region||'')||region;
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
function ground(c,x,y,t,tx,ty,time){
 if(t.plan&&root.TownArt&&root.TownArt.ground(c,x,y,t,tx,ty,time))return true;
 if(t.boundary&&t.town){rect(c,'#54744c',x,y,32,32);if(t.detail>.5){rect(c,'#648452',x+4,y+7,13,5);rect(c,'#75945d',x+6,y+9,5,2)}if(t.edgeEast||t.edgeWest){const dx=t.edgeWest?1:23;rect(c,'#314f3b',x+dx,y,8,32);rect(c,'#77965d',x+dx+1,y,5,32);rect(c,'#b4a476',x+dx+4,y,2,32);if(ty%2===0)rect(c,'#d7c393',x+dx+3,y+11,4,8)}if(t.edgeNorth||t.edgeSouth){const dy=t.edgeNorth?1:23;rect(c,'#314f3b',x,y+dy,32,8);rect(c,'#77965d',x,y+dy+1,32,5);rect(c,'#b4a476',x,y+dy+4,32,2);if(tx%2===0)rect(c,'#d7c393',x+11,y+dy+3,4,8)}return true;}
 if(t.boundary&&['tree','pine'].includes(t.obstacle)){rect(c,base(t.region)==='frost'?'#9bb4b2':'#345b43',x,y,32,32);if(t.detail>.5){rect(c,'#527852',x+3,y+8,16,9);rect(c,'#6b8b59',x+5,y+9,6,3)}return true;}
 const cold=base(t.region)==='frost',hot=base(t.region)==='crater',sand=base(t.region)==='dunes'||base(t.region)==='coast';
 if(t.obstacle==='cliff'){cliffTile(c,x,y,t,tx,ty,cold,hot,sand);return true}
 if(t.ground==='wall'){
  const p=cold?['#536b78','#7593a0','#3a5363']:hot?['#504443','#68554a','#302c2e']:sand?['#796b50','#a09166','#514b39']:['#465b50','#607363','#2f443b'];
  rect(c,p[0],x,y,32,32);rect(c,p[1],x+2,y+2,27,11);rect(c,p[1],x+5,y+18,22,10);rect(c,p[2],x,y+14,32,3);rect(c,p[2],x+15,y+1,3,13);rect(c,p[2],x+3,y+18,2,12);return true;
 }
 if(t.ground==='dungeon'){
  const p=cold?['#859da2','#9fb6b9','#738d95']:hot?['#797363','#8c826b','#625d55']:['#7f8c75','#94a085','#6f806e'];rect(c,p[0],x,y,32,32);rect(c,p[1],x+2,y+2,27,12);rect(c,p[1],x+3,y+18,24,12);rect(c,p[2],x,y+15,32,2);if(t.detail>.75)rect(c,p[2],x+19,y+23,5,2);return true;
 }
 if(['lava','ice','bridge'].includes(t.ground)){
  const kind=t.ground==='bridge'?t.under:t.ground;
  const p=kind==='lava'?['#9d4f37','#df9550','#f2c771']:kind==='ice'?['#8eb7c1','#c0e0df','#e5efe2']:['#639eab','#8cbac0','#c0d9c8'];rect(c,p[0],x,y,32,32);
  const offset=Math.floor(time*2+tx+ty)%3;rect(c,p[1],x+3+offset*2,y+8,12,2);rect(c,p[1],x+17-offset,y+23,10,2);if(t.detail>.65)rect(c,p[2],x+7,y+17,4,2);
  if(t.ground==='bridge'){
   rect(c,'#665942',x,y,32,32);rect(c,'#bca175',x+1,y+1,30,30);
   for(let i=0;i<4;i++)if(t.bridgeAxis==='vertical'){rect(c,'#6c6047',x,y+i*8+7,32,1);rect(c,'#d2bb8d',x+3,y+i*8+2,24,1)}else{rect(c,'#6c6047',x+i*8+7,y,1,32);rect(c,'#d2bb8d',x+i*8+2,y+3,1,24)}
   rect(c,'#5e5942',x+3,y+3,2,2);rect(c,'#5e5942',x+27,y+27,2,2);
  }return true;
 }return false;
}
function details(c,x,y,t){if(t.tall){tall(c,x,y,t,0,false);return}if(!t.deco)return;
 if(root.TownArt&&root.TownArt.details(c,x,y,t))return;
 if(t.deco==='reeds'){for(let i=0;i<3;i++){rect(c,'#667b47',x+8+i*6,y+24-i%2*3,2,6);rect(c,'#b3a578',x+7+i*6,y+19-i%2*3,3,6)}}
 else if(t.deco==='fern'){rect(c,'#345c43',x+15,y+14,2,16);for(let i=0;i<4;i++){rect(c,'#518951',x+9+i,y+17+i*3,7-i,2);rect(c,'#67a05a',x+17,y+17+i*3,7-i,2)}}
 else if(t.deco==='pebbles'){rect(c,'#857d67',x+7,y+22,6,3);rect(c,'#b3aa88',x+8,y+21,4,2);rect(c,'#857d67',x+21,y+10,4,3)}
 else{const p=base(t.region)==='frost'?'#a2bcb1':base(t.region)==='forest'?'#557b51':'#799a61';for(let i=0;i<3;i++){rect(c,p,x+9+i*3,y+21-i%2*3,2,5)}if(t.detail>.92){rect(c,'#dfd394',x+19,y+10,3,3);rect(c,'#eee8bb',x+21,y+12,2,2)}}
}
/* ---------- Pasto largo: vegetación alta adaptada a cada bioma ---------- */
const TALL={
 meadow:{tint:'#2f6a3a',c:['#3e7d3c','#5aa047','#86c45e'],tip:'#c4e68c',shape:'blade'},
 woodland:{tint:'#264f33',c:['#2f6a42','#468a50','#6fb066'],tip:'#a6d68a',shape:'fern'},
 jungle:{tint:'#16452f',c:['#1d6a3d','#2f9150','#5cc46c'],tip:'#a8ec8c',shape:'leaf'},
 reed:{tint:'#3a5530',c:['#52702f','#7a9440','#a3b45c'],tip:'#c9a468',shape:'reed'},
 dune:{tint:'#7a6a34',c:['#8f7d3e','#b39a52','#d4bd72'],tip:'#efdba0',shape:'scrub'},
 ash:{tint:'#3a2f2c',c:['#5a4a42','#7d6858','#a08a72'],tip:'#e8793a',shape:'scrub'},
 beach:{tint:'#6a8a52',c:['#6e9a58','#93bb6c','#bcd78a'],tip:'#e8eab8',shape:'blade'},
 alpine:{tint:'#3d5b4c',c:['#466e58','#5f9070','#8ab88e'],tip:'#c8e3d0',shape:'tuft'},
 frost:{tint:'#5a8896',c:['#6f9aa3','#9cc4c8','#d2ecea'],tip:'#ffffff',shape:'blade'}
};
const fr=(d,i)=>{const v=Math.sin(d*12.9898+i*78.233)*43758.5453;return v-Math.floor(v)};
// front=false: capa estática del suelo. front=true: macollas que se mecen por delante de los pies (sway en píxeles).
function tall(c,x,y,t,time,front,sway){
 const K=TALL[t.tall]||TALL.meadow,d=t.detail||0,rows=front?[2,3]:[0,1,2,3],sw=sway||0;
 if(!front){c.save();c.globalAlpha=.32;c.fillStyle=K.tint;c.fillRect(x,y,32,32);c.restore()}
 for(const row of rows){
  const base=13+row*6;
  for(let col=0;col<3;col++){
   const cx=x+5+col*11+(row%2?5:0)+Math.floor(fr(d,row*3+col)*4)-2,h=9+Math.floor(fr(d,row*3+col+20)*5);
   const bl=K.shape==='fern'?4:K.shape==='leaf'?3:K.shape==='scrub'?4:K.shape==='reed'?2:3;
   for(let k=0;k<bl;k++){
    const lean=(k-(bl-1)/2),bx=cx+Math.round(lean*(K.shape==='leaf'||K.shape==='fern'?2.6:2.2)),bh=h-Math.abs(lean)*1.6+(K.shape==='reed'?3:0),by=y+base,off=sw?Math.round(Math.sin(time*6+bx*.4+by*.2)*sw):0,col1=K.c[(k+row)%3],top=Math.round(bh);
    const lowH=Math.round(top*.55);
    rect(c,K.c[0],bx,by-lowH,2,lowH+1);
    rect(c,col1,bx+Math.round(lean*.8)+off,by-top,2,top-lowH+1);
    if(K.shape==='leaf'||K.shape==='fern'){rect(c,K.c[2],bx+(lean<0?-2:2)+off,by-top+2,2,2)}
    if(K.shape==='reed'){rect(c,K.tip,bx+off-(k?0:0),by-top-3,3,5)}
    else if(K.shape==='scrub'&&t.tall==='ash'&&fr(d,row*7+col+k)>.82){rect(c,K.tip,bx+off,by-top-1,2,2)}
    else rect(c,K.tip,bx+Math.round(lean*.8)+off,by-top-1,2,2)
   }
  }
 }
}
/* ---------- Naturaleza: formas orgánicas con sombreado (luz arriba-izquierda) ---------- */
const hh=(a,b,s)=>{let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263)^Math.imul((s|0)+7,1274126177);h=Math.imul(h^(h>>>13),1103515245);h^=h>>>16;return(h>>>0)/4294967296};
function disc(c,color,cx,cy,rx,ry){c.fillStyle=color;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}}
const TREE_PAL={sakura:['#a34a6e','#d4709a','#eea0c0','#ffd6e6'],otono:['#8a4a22','#c26a2d','#e0993f','#f4d06a'],pradera:['#2d5a3d','#3f7a48','#5f9a58','#93c46c'],bosque:['#274a3c','#376a4a','#4e8a56','#7db06a'],selva:['#1d4a39','#2c7046','#3e9453','#7cc263'],pantano:['#374f37','#50703f','#6c8f4c','#a0ba68'],montaña:['#2b5240','#3c7249','#58915a','#8cbc6c']};

/* ---------- Acantilados: meseta con cara frontal estratificada (la luz viene de arriba-izquierda) ---------- */
const CLIFF_PAL={
 grass:{top:['#88a374','#9dba84','#738f62','#5d7a52'],face:['#b9b394','#948f75','#6b6a59','#47493f'],moss:'#6d9a5a'},
 cold:{top:['#d3dfde','#eaf1ee','#b6c8cb','#9bb0b6'],face:['#c3d3d8','#95adb8','#6b8494','#485f70'],moss:'#a9c8be'},
 hot:{top:['#917f6a','#a4917a','#786a5c','#625649'],face:['#98816a','#735f4e','#53443c','#372d2c'],moss:'#7d6d4d'},
 sand:{top:['#d6c28e','#e6d6a6','#bda977','#a39163'],face:['#d6ba84','#ad9363','#85704b','#5c4b34'],moss:'#a89c5a'}
};
function cliffTile(c,x,y,t,tx,ty,cold,hot,sand){
 const P=CLIFF_PAL[cold?'cold':hot?'hot':sand?'sand':'grass'],T=P.top,Fc=P.face,R=(col,dx,dy,w,h)=>{c.fillStyle=col;c.fillRect(x+dx,y+dy,w,h)},H=i=>hh(tx,ty,i+300),green=!cold&&!hot&&!sand;
 // superficie de la meseta
 R(T[0],0,0,32,32);
 if(green){
  for(let i=0;i<7;i++){const px=1+Math.floor(H(i)*28),py=3+Math.floor(H(i+9)*24);R(T[2],px,py,1,4);R(T[1],px+2,py-1,1,5);R(T[2],px+1,py+3,2,1)}
  for(let i=0;i<3;i++){const px=2+Math.floor(H(i+30)*24),py=4+Math.floor(H(i+33)*22);R(T[1],px,py,5,2);R(T[3],px+1,py+2,4,1)}
 }else{
  for(let i=0;i<5;i++){const px=Math.floor(H(i)*26)+2,py=Math.floor(H(i+9)*26)+2;R(i%2?T[1]:T[2],px,py,3+Math.floor(H(i+20)*4),1+(i%2))}
  if(H(40)>.72){const px=4+Math.floor(H(41)*16),py=6+Math.floor(H(42)*12);R(T[3],px,py,8,1);R(T[3],px+7,py+1,1,4);R(T[1],px+1,py+1,6,1)}
 }
 if(H(55)>.84){const px=4+Math.floor(H(56)*20),py=6+Math.floor(H(57)*16);R(T[3],px,py+3,6,2);R(Fc[1],px,py,6,3);R(Fc[0],px,py,4,1)}
 const SO=t.edgeSouth,fy=SO?8:32;
 if(SO){
  const L=Fc[0],M=Fc[1],D=Fc[2],K=Fc[3];
  // labio de la meseta y cara base
  R(T[1],0,fy-2,32,1);R(L,0,fy-1,32,2);R(M,0,fy+1,32,23);
  // estratos continuos entre casillas: capa clara, media y oscura
  R(L,0,fy+1,32,1);R(D,0,fy+10,32,1);R(D,0,fy+17,32,7);R(K,0,fy+23,32,1);
  // bloques de cada estrato con luz a la izquierda
  const layers=[[fy+2,8],[fy+11,6]];
  layers.forEach(([ly,lh],li)=>{let bx=-Math.floor(H(60+li)*5);while(bx<32){const bw=7+Math.floor(H(64+li*7+bx)*7),x0=Math.max(0,bx),x1=Math.min(32,bx+bw);
    if(x1>x0){R(L,x0,ly,Math.max(1,x1-x0-2),1);if(bx>=0)R(L,bx,ly,1,lh-2);R(D,x1-1<32?x1-1:31,ly+1,1,lh-1);R(D,x0,ly+lh-1,x1-x0,1);if(H(70+bx+li)>.55)R(L,x0+1,ly+2,2,1)}bx+=bw}});
  // grietas verticales irregulares
  for(let i=0;i<2;i++)if(H(80+i)>.42){const gx=4+Math.floor(H(82+i)*22),gy=fy+2+Math.floor(H(84+i)*4),gl=6+Math.floor(H(86+i)*9);R(K,gx,gy,1,gl>>1);R(K,gx+(i?1:-1),gy+(gl>>1),1,gl-(gl>>1));R(D,gx+1,gy,1,gl>>1)}
  // zócalo oscuro y piedras caídas al pie
  R(D,0,fy+19,32,1);
  for(let i=0;i<3;i++){const gx=1+Math.floor(H(100+i)*26),gw=3+Math.floor(H(103+i)*3);R(K,gx,fy+20,gw+1,4);R(D,gx,fy+19,gw,4);R(M,gx,fy+19,gw-1,1)}
  // musgo en el borde
  if(green)for(let i=0;i<3;i++)if(H(110+i)>.4){const gx=1+Math.floor(H(113+i)*27);R(P.moss,gx,fy-2,4+Math.floor(H(116+i)*4),2);R(T[2],gx+1,fy,2,2+Math.floor(H(119+i)*3))}
  if(t.edgeWest){R(D,0,fy,1,24);R(T[3],0,0,1,fy-2);R(L,1,fy,1,18)}
  if(t.edgeEast){R(K,31,fy,1,24);R(D,30,fy,1,23);R(T[3],31,0,1,fy-2)}
 }
 // bordes: luz arriba-izquierda, sombra abajo-derecha
 if(t.edgeNorth){R(T[3],0,0,32,1);R(T[1],0,1,32,2);R(T[2],0,3,32,1)}
 if(t.edgeWest){R(T[3],0,0,1,fy-2);R(T[1],1,t.edgeNorth?3:0,2,fy-2-(t.edgeNorth?3:0))}
 if(t.edgeEast){R(T[2],29,t.edgeNorth?3:0,2,fy-2-(t.edgeNorth?3:0));R(T[3],31,0,1,fy-2)}
}
function tree(c,x,y,t,cold){
 const biome=t.biome,pal=TREE_PAL[biome]||TREE_PAL.pradera,d=t.detail||0,s=Math.floor(d*1000);
 // tronco con raíces
 rect(c,'#4f3a2a',x-3,y-20,7,20);rect(c,'#72563b',x-3,y-20,5,20);rect(c,'#94704a',x-3,y-20,2,18);rect(c,'#4f3a2a',x-7,y-3,15,3);rect(c,'#72563b',x-6,y-4,12,3);rect(c,'#94704a',x-6,y-4,4,2);rect(c,'#3a2a20',x-8,y-1,17,1);rect(c,'#3a2a20',x+3,y-12,1,6);
 if(h2t(s,1)>.5)rect(c,'#3f7a48',x-3,y-9,2,2);
 // copa: lóbulos que se solapan
 const B=[[0,-33,15,13],[-10,-28,9,8],[10,-29,9,8],[0,-45,10,9],[-6,-40,8,7],[7,-40,8,7],[0,-24,13,6]].map((b,i)=>[b[0]+Math.round(hh(s,i,3)*2-1),b[1],b[2],b[3]]);
 for(const b of B)disc(c,pal[0],x+b[0],y+b[1]+1,b[2]+1,b[3]+1);
 for(const b of B)disc(c,pal[1],x+b[0]-1,y+b[1],b[2],b[3]);
 for(const b of B)if(b[2]>7)disc(c,pal[2],x+b[0]-3,y+b[1]-3,b[2]-4,b[3]-4);
 for(const b of [B[3],B[1],B[4]])disc(c,pal[3],x+b[0]-5,y+b[1]-4,Math.max(2,b[2]-7),Math.max(2,b[3]-6));
 // textura de hojas: racimos claros a la izquierda-arriba y oscuros abajo-derecha, siempre dentro de la copa
 const inside=(px,py)=>B.some(b=>{const dx=(px-(x+b[0]))/(b[2]-1),dy=(py-(y+b[1]))/(b[3]-1);return dx*dx+dy*dy<.85});
 for(let i=0;i<34;i++){const px=x-17+Math.floor(hh(s,i,11)*35),py=y-54+Math.floor(hh(s,i,12)*36);if(!inside(px,py))continue;const lit=(px-x)+(py-y)<-36,dark=(px-x)+(py-y)>-20;
  if(lit){rect(c,pal[3],px,py,3,1);rect(c,pal[2],px-1,py+1,2,1)}else if(dark&&i%2){rect(c,pal[0],px,py,3,1);rect(c,pal[1],px+1,py-1,2,1)}else if(i%3===0){rect(c,pal[2],px,py,2,1)}}
 rect(c,pal[0],x-5,y-19,11,2);rect(c,'#1e3a2e66',x-6,y-17,13,2);
 if(biome==='selva'){for(const [vx,vl] of [[-13,9],[-5,6],[9,10],[14,6]]){rect(c,pal[1],x+vx,y-21,1,vl);rect(c,pal[3],x+vx,y-21+vl,2,2)}disc(c,'#2c7046',x+17,y-38,4,3);disc(c,'#3e9453',x+16,y-39,3,2)}
 else if(biome==='pantano'){for(const vx of [-14,-8,-2,6,12]){const l=5+Math.floor(hh(s,vx,5)*6);rect(c,'#8ea78a99',x+vx,y-21,1,l);rect(c,'#a9c0a499',x+vx+1,y-21,1,l-2)}}
 if(cold){disc(c,'#e8f2ee',x-1,y-53,8,3);disc(c,'#ffffff',x-3,y-54,4,1);rect(c,'#e8f2ee',x-16,y-37,5,3);rect(c,'#e8f2ee',x+12,y-39,5,3);rect(c,'#dbe9e6',x-10,y-31,5,2);rect(c,'#dbe9e6',x+8,y-30,4,2)}
}
function h2t(s,k){return hh(s,k,9)}
function pine(c,x,y,t,cold){
 const d=t.detail||0,s=Math.floor(d*1000);
 const p=cold?['#2f5560','#46787a','#6da1a0','#a9cbc4']:['#1f3f38','#2f5f4c','#4a8460','#7cb07a'];
 rect(c,'#4f3a2a',x-3,y-16,7,16);rect(c,'#72563b',x-3,y-16,5,16);rect(c,'#94704a',x-3,y-16,1,14);rect(c,'#3a2a20',x-5,y-1,11,1);rect(c,'#4f3a2a',x-5,y-3,11,3);
 const tiers=[[17,14,-27],[14,14,-38],[11,13,-49],[6,12,-58]];
 for(const [hw,h,top] of tiers){
  for(let i=0;i<h;i++){const w=Math.max(1,Math.round(hw*(i+1)/h)+(i%4===3?1:0)),yy=y+top+i;
   rect(c,p[0],x-w,yy,w*2+1,1);
   rect(c,p[1],x-w+1,yy,Math.max(1,Math.round(w*1.1)),1);
   if(i%3===1&&w>3)rect(c,p[2],x-w+2,yy,Math.max(1,Math.round(w*.55)),1);
   if(i>2&&i%4===0)rect(c,p[3],x-w+3,yy,2,1)}
  // borde inferior irregular y sombra bajo cada piso
  for(let k=-hw;k<=hw;k+=3){rect(c,p[0],x+k,y+top+h,2,1+((k+hw)%2))}
  rect(c,'#142b2766',x-hw+1,y+top+h+1,hw*2-1,2);
  if(cold){for(let i=0;i<4;i++){const w=Math.round(hw*(i+1)/h);rect(c,'#eaf3f0',x-w,y+top+i,w*2+1,1)}rect(c,'#dbe9e6',x-hw,y+top+h-3,4,3);rect(c,'#dbe9e6',x+hw-4,y+top+h-4,4,3);rect(c,'#ffffff',x-3,y+top,3,1)}
 }
 rect(c,p[1],x-1,y-60,2,2);
}
function palm(c,x,y,t){
 const d=t.detail||0,lean=d>.5?1:-1;
 // tronco curvo con anillos
 for(let i=0;i<38;i++){const o=Math.round(Math.sin(i/38*Math.PI*.7)*3*lean),w=i>30?4:5,yy=y-i;rect(c,i%4===0?'#6f5a36':'#a28b58',x+o-Math.floor(w/2),yy,w,1);rect(c,'#c4ad78',x+o-Math.floor(w/2),yy,1,1);rect(c,'#7a6740',x+o+Math.ceil(w/2)-1,yy,1,1)}
 rect(c,'#6f5a36',x-5,y-2,11,2);rect(c,'#a28b58',x-4,y-3,9,2);
 const ox=Math.round(Math.sin(Math.PI*.7)*3*lean),cx=x+ox,cy=y-38;
 // frondas
 const fr=[[-1,-.35,24],[1,-.3,24],[-1,.35,22],[1,.4,22],[-.5,-1,18],[.6,-1,18],[0,.2,14]];
 for(const [dx,dy,L] of fr){for(let k=0;k<=L;k++){const u=k/L,px=cx+dx*L*u,py=cy+dy*L*u*.9+(dy>=0?1:0)*0+Math.pow(u,2)*(dy<-.5?8:12)-Math.sin(u*Math.PI)*(dy<-.5?6:5);
   rect(c,'#2f6b46',px,py,2,2);if(k%2===0)rect(c,'#4d9a55',px,py-1,2,1);if(k%3===0)rect(c,'#7bc66a',px+(dx<0?-1:1),py-1,1,1);if(k>2&&k%2===1){rect(c,'#3a7f4d',px,py+2,1,2)}}}
 rect(c,'#2f6b46',cx-3,cy-1,7,4);rect(c,'#4d9a55',cx-2,cy-2,5,2);
 rect(c,'#7a5a2f',cx-3,cy+2,3,3);rect(c,'#5c4222',cx+1,cy+3,3,3);rect(c,'#b08a4f',cx-3,cy+2,1,1);
}
function cactus(c,x,y,t){
 const d=t.detail||0,pal=['#2d5a3d','#4a7f4f','#6ea45c','#a6cf86'];
 const col=(cx,top,w,h)=>{for(let i=0;i<h;i++){let ww=w;if(i<2)ww=w-2-(i===0?0:0);const xx=cx-Math.floor(ww/2);rect(c,pal[0],xx,top+i,ww,1);if(ww>3){rect(c,pal[1],xx+1,top+i,ww-2,1);rect(c,pal[2],xx+1,top+i,Math.max(1,Math.floor(ww/3)),1)}}rect(c,pal[0],cx+Math.floor(w/2)-2,top+2,2,h-2);for(let i=2;i<h-1;i+=4)rect(c,pal[3],cx-1,top+i,1,1);rect(c,pal[3],cx-Math.floor(w/2)+1,top+3,1,h-6)};
 col(x,y-33,11,33);
 rect(c,pal[0],x-13,y-19,9,6);rect(c,pal[1],x-12,y-19,7,4);col(x-12,y-30,6,12);
 rect(c,pal[0],x+3,y-24,10,6);rect(c,pal[1],x+4,y-24,8,4);col(x+11,y-33,6,10);
 rect(c,'#1e3a2e55',x-9,y-1,22,2);rect(c,'#4a7f4f',x-6,y-2,13,2);
 if(d>.6){rect(c,'#f4a6c4',x-2,y-35,4,3);rect(c,'#fff1f6',x-1,y-35,2,1);rect(c,'#f4a6c4',x+10,y-35,3,2)}
}
function crystal(c,x,y,t){
 const d=t.detail||0;
 const one=(cx,base,w,h,pal)=>{for(let i=0;i<h;i++){const top=h-i;let hw=Math.floor(w/2);if(top<=7)hw=Math.max(1,Math.round(w/2*top/7));const yy=base-i;
   rect(c,pal[0],cx-hw-1,yy,hw*2+3,1);rect(c,pal[1],cx-hw,yy,hw+1,1);rect(c,pal[2],cx+1,yy,hw,1);if(i>3&&i<h-5)rect(c,pal[3],cx-1,yy,1,1)}
  rect(c,pal[3],cx-2,base-h+4,2,3);rect(c,pal[3],cx-1,base-h,1,2);const bw=Math.floor(w/2);rect(c,pal[0],cx-bw-2,base,bw*2+5,1)};
 const P1=['#2f5f78','#8fd4d2','#4f8fa6','#e6f6ea'],P2=['#34508a','#9cc4ee','#5a7fc4','#eaf4ff'],P3=['#4a4f8f','#b9b4ee','#7774c4','#f2efff'];
 const pal=d>.66?P2:d<.25?P3:P1;
 one(x-10,y,9,18,P1);one(x+10,y+1,9,22,pal);one(x,y,12,32,pal===P1?P1:pal);
 rect(c,'#1e3a4a55',x-14,y,29,2);
}
function stump(c,x,y,t){
 const d=t.detail||0;
 rect(c,'#3a2a20',x-13,y-3,27,3);rect(c,'#5e452f',x-11,y-4,23,3);
 for(let i=0;i<14;i++){const w=11-(i>10?(i-10):0)+(i<2?0:0);rect(c,'#4f3a2a',x-w-1,y-4-i,w*2+3,1);rect(c,'#72563b',x-w,y-4-i,w*2,1);rect(c,'#94704a',x-w,y-4-i,3,1)}
 rect(c,'#4f3a2a',x-12,y-17,25,1);
 disc(c,'#8a6a45',x,y-18,12,5);disc(c,'#d0b886',x,y-19,11,4);disc(c,'#b89a62',x,y-19,7,3);disc(c,'#d9c490',x,y-19,4,2);disc(c,'#a8864e',x,y-19,1,1);
 rect(c,'#5f8a47',x-10,y-9,5,3);rect(c,'#7fb05a',x-9,y-10,3,1);
 if(d>.5){rect(c,'#d9d2c0',x+6,y-8,3,3);rect(c,'#b0a998',x+6,y-6,3,1)}
}
function rock(c,x,y,t,cold,kind){
 const d=t.detail||0,s=Math.floor(d*1000),basalt=kind==='basalt';
 if(basalt){
  const pal=['#2f3335','#524f4c','#7a7168','#a89b85'];
  for(const [dx,h,w] of [[-9,22,9],[0,30,10],[9,17,9]]){
   rect(c,pal[0],x+dx-Math.floor(w/2)-1,y-h,w+2,h);rect(c,pal[1],x+dx-Math.floor(w/2),y-h+3,w,h-3);rect(c,pal[2],x+dx-Math.floor(w/2),y-h+3,Math.floor(w/2),h-4);
   disc(c,pal[3],x+dx,y-h+2,Math.floor(w/2),2);rect(c,pal[0],x+dx-Math.floor(w/2)+1,y-h+4,1,h-6);for(let i=6;i<h-2;i+=7)rect(c,pal[0],x+dx-2,y-h+i,4,1)}
  rect(c,'#1e1a1a55',x-17,y-1,35,3);rect(c,pal[0],x-14,y-3,29,3);rect(c,pal[1],x-13,y-4,27,2);
  return}
 const pal=cold?['#566d7a','#8aa2ac','#bcd0d4','#eef6f4']:['#47594f','#76897b','#a2b39a','#d3dcc5'];
 disc(c,pal[0],x,y-7,16,8);disc(c,pal[0],x-2,y-14,11,8);disc(c,pal[0],x+9,y-9,7,6);
 disc(c,pal[1],x-1,y-8,15,7);disc(c,pal[1],x-3,y-15,10,7);disc(c,pal[1],x+8,y-10,6,5);
 disc(c,pal[2],x-4,y-12,9,5);disc(c,pal[2],x-8,y-9,5,3);
 disc(c,pal[3],x-5,y-17,5,2);rect(c,pal[3],x-10,y-12,3,1);
 rect(c,pal[0],x+2,y-14,1,5);rect(c,pal[0],x+3,y-10,3,1);rect(c,pal[0],x-9,y-5,4,1);
 rect(c,'#1b2e2755',x-14,y-1,31,2);
 if(cold){disc(c,'#e8f2ee',x-3,y-20,8,2);rect(c,'#ffffff',x-6,y-21,4,1);rect(c,'#dbe9e6',x-10,y-14,4,2)}
 else if(h2t(s,2)>.45){disc(c,'#5f8a47',x-5,y-20,6,2);rect(c,'#8cbb62',x-8,y-21,3,1);rect(c,'#5f8a47',x-12,y-12,3,2)}
}
function pillar(c,x,y,t){
 const d=t.detail||0,pal=['#3f5448','#6b7d71','#9aa89a','#cfd8c4'];
 rect(c,'#1b2e2755',x-11,y-1,25,3);
 rect(c,pal[0],x-9,y-5,19,5);rect(c,pal[1],x-8,y-6,17,4);rect(c,pal[2],x-8,y-6,6,2);
 rect(c,pal[0],x-6,y-38+(d>.5?4:0),13,34-(d>.5?4:0));rect(c,pal[1],x-5,y-37+(d>.5?4:0),11,32-(d>.5?4:0));rect(c,pal[2],x-5,y-37+(d>.5?4:0),4,32-(d>.5?4:0));
 for(const fx of [x-1,x+3])rect(c,pal[0],fx,y-34,1,28);rect(c,pal[3],x-4,y-34,1,24);
 // capitel roto
 rect(c,pal[0],x-9,y-42+(d>.5?6:0),19,5);rect(c,pal[2],x-8,y-41+(d>.5?6:0),17,3);rect(c,pal[3],x-8,y-41+(d>.5?6:0),7,1);
 if(d>.5){rect(c,pal[0],x+4,y-40,5,3);rect(c,pal[0],x+6,y-42,3,2)}
 rect(c,pal[0],x+2,y-20,1,4);rect(c,pal[0],x+3,y-16,2,1);
 rect(c,'#5f8a47',x-6,y-10,5,5);rect(c,'#7fb05a',x-5,y-11,3,2);rect(c,'#5f8a47',x+5,y-28,3,3);
}
function obstacle(c,x,y,t){const kind=t.obstacle,cold=base(t.region)==='frost';
 if(root.TownArt&&root.TownArt.handles(kind))return root.TownArt.obstacle(c,x,y,t);
 rect(c,'#27443122',x-13,y-4,27,8);
 if(kind==='tree')return tree(c,x,y,t,cold);
 if(kind==='pine')return pine(c,x,y,t,cold);
 if(kind==='palm')return palm(c,x,y,t);
 if(kind==='cactus')return cactus(c,x,y,t);
 if(kind==='crystal')return crystal(c,x,y,t);
 if(kind==='stump')return stump(c,x,y,t);
 if(kind==='pillar')return pillar(c,x,y,t);
 return rock(c,x,y,t,cold,kind);
}
function landmark(c,x,y,p,region){
 region=base(region);
 // Escenografía junto al claro; el centro de la sala queda libre.
 const bx=Math.round(x),by=Math.round(y),cold=region==='frost',hot=region==='crater',sand=region==='dunes'||region==='coast';
 const R=(col,dx,dy,w,h)=>{c.fillStyle=col;c.fillRect(bx+dx,by+dy,w,h)};
 if(p.kind==='camp'){
  const L=cold?'#dfe9ea':'#e6cd95',Sh=cold?'#aebfc6':'#bc9d66',Ed=cold?'#5f7480':'#6d5535',Rb=hot?'#a33d33':'#bf5a42',RbS=hot?'#7d2e2b':'#94432f';
  disc(c,'rgba(28,48,36,.30)',bx+2,by+5,36,8);
  // tienda de campaña: lado izquierdo iluminado, derecho en sombra
  for(let r=0;r<=34;r++){const hw=Math.round(r*26/34),yy=-36+r;R(L,-hw,yy,hw,1);R(Sh,0,yy,hw+1,1);R(Ed,-hw-1,yy,1,1);R(Ed,hw+1,yy,1,1)}
  R(Ed,-27,-2,55,2);R(Sh,-26,-4,53,2);
  for(let r=24;r<=29;r++){const hw=Math.round(r*26/34),yy=-36+r;R(r<27?Rb:RbS,-hw,yy,hw,1);R(r<27?RbS:'#6f2d22',0,yy,hw+1,1)}
  for(let r=14;r<=34;r++){const hw=Math.round((r-14)*7/20)+1,yy=-36+r;R('#2f2c25',-hw,yy,hw*2+1,1)}
  R('#4a4636',-1,-22,2,20);R(L,-8,-20,3,12);R(Sh,5,-20,3,12);
  R('#5d4630',-1,-41,2,7);R(Rb,1,-41,7,3);R(RbS,1,-38,7,1);
  R('#5d4630',-31,-1,3,4);R('#5d4630',29,-1,3,4);R(Ed,-28,0,1,1);
  // fogata con piedras
  disc(c,'#4a4a42',bx+36,by+3,9,4);disc(c,'#8c8c7c',bx+36,by+2,8,3);disc(c,'#2d2a25',bx+36,by+2,5,2);
  R('#6b4a2c',31,-1,12,3);R('#9a6c3e',31,-2,12,1);R('#6b4a2c',34,-5,3,5);R('#6b4a2c',38,-4,3,4);
  R('#ee8a2e',34,-9,5,6);R('#ffd66a',35,-8,3,4);R('#ee8a2e',33,-6,1,2);R('#fff3b8',36,-7,1,2);
  // caja y saco
  R('#4d3a28',-46,-8,14,14);R('#9a7650',-45,-7,12,12);R('#c29a68',-45,-7,12,2);R('#6b4e33',-45,-2,12,1);R('#6b4e33',-40,-7,1,12);
  R('#8a7c58',-36,-4,9,9);R('#b9aa7c',-35,-4,7,3);R('#5f5538',-33,-5,3,1);
 }else if(p.kind==='crystals'){obstacle(c,bx-8,by,{obstacle:'crystal',region});obstacle(c,bx+21,by+8,{obstacle:'crystal',region})}
 else{
  // ruinas: dos columnas (una partida), dintel caído, escombros y musgo
  const A=cold?['#cadada','#9bb3b7','#6d878f','#43585f']:hot?['#a08a72','#7d6957','#584a40','#382e2c']:sand?['#d4c295','#ae9b6d','#82704d','#58492f']:['#bfc2a8','#939c84','#646e5d','#3d453f'],mos=cold?'#a6c4b8':'#5f8a50',mosL=cold?'#cfe3da':'#86b568';
  disc(c,'rgba(28,48,36,.30)',bx+2,by+6,36,8);
  const pillar=(x0,h,broken,seed)=>{
   R(A[3],x0-1,-h,15,h+1);R(A[1],x0,-h,13,h);R(A[0],x0,-h,3,h);R(A[2],x0+9,-h,4,h);R(A[3],x0+12,-h,1,h);R(A[2],x0+6,-h+3,1,h-8);
   if(!broken){R(A[3],x0-3,-h-5,19,6);R(A[1],x0-2,-h-4,17,4);R(A[0],x0-2,-h-4,17,1);R(A[2],x0+11,-h-4,4,4)}
   else{for(let i=0;i<13;i+=2){const d=((i*7+seed)%5);R(A[1],x0+i,-h-d,2,d);R(A[0],x0+i,-h-d,i<4?2:1,d);if(i>8)R(A[2],x0+i,-h-d,2,d)}}
   R(A[3],x0-4,-6,21,7);R(A[1],x0-3,-5,19,5);R(A[0],x0-3,-5,19,1);R(A[2],x0+12,-5,4,5);
   R(mos,x0+1,-h+(broken?-1:4),5,2);R(mosL,x0+2,-h+(broken?-1:4),2,1);R(mos,x0+8,-12,4,3)};
  pillar(-27,38,false,1);pillar(14,24,true,3);
  // dintel partido apoyado en la columna izquierda
  R(A[3],-31,-49,34,9);R(A[1],-30,-48,32,7);R(A[0],-30,-48,32,2);R(A[2],-30,-42,32,1);R(A[2],-8,-48,2,7);R(A[3],-6,-45,6,5);R(A[1],-6,-45,5,3);
  R(mos,-28,-49,12,3);R(mosL,-26,-49,5,1);R(mos,-12,-40,2,6);
  // bloques caídos
  R(A[3],-14,2,16,8);R(A[1],-13,3,14,6);R(A[0],-13,3,14,2);R(A[2],-13,8,14,1);
  R(A[3],26,6,11,6);R(A[1],27,7,9,4);R(A[0],27,7,9,1);R(A[3],-36,6,9,5);R(A[1],-35,7,7,3);R(A[0],-35,7,6,1);
  R(A[2],5,8,5,3);R(A[1],5,8,4,2);R(mos,-14,2,6,2);
 }
}
root.TerrainArt={ground,details,obstacle,landmark,tall};
})(typeof window!=='undefined'?window:globalThis);
