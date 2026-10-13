// Code-native small trees, cracked/pushable rocks, waves and cave lighting.
window.FieldArt={
obstacle(c,x,y,t){
 const r=(color,dx,dy,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x+dx),Math.round(y+dy),w,h)};
 const disc=(color,cx,cy,rx,ry)=>{c.fillStyle=color;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(x+cx-w),Math.round(y+cy+j),w*2,1)}};
 const hh=(a,b)=>{let h=Math.imul(a|0,374761393)^Math.imul(b|0,668265263);h=Math.imul(h^(h>>>13),1103515245);h^=h>>>16;return(h>>>0)/4294967296},s=Math.floor((t.detail||0)*1000);
 r('#27443122',-12,-2,25,6);
 if(t.fieldMove==='cut'){
  // arbolito claro y tupido con una muesca en el tronco: se puede talar con Corte
  const P=['#2c6a44','#468f50','#76b85e','#b4dc86'];
  r('#4f3a2a',-3,-14,7,14);r('#72563b',-3,-14,5,14);r('#94704a',-3,-14,2,12);r('#3a2a20',-5,-1,11,1);r('#4f3a2a',-5,-3,11,2);
  r('#f0e0b0',-3,-9,4,2);r('#c9a86a',-1,-8,3,1);r('#7a5a38',-3,-7,3,1);
  const B=[[0,-25,12,10],[-8,-21,7,6],[8,-21,7,6],[0,-33,8,7],[-4,-30,6,5],[5,-30,6,5]];
  for(const b of B)disc(P[0],b[0],b[1]+1,b[2]+1,b[3]+1);for(const b of B)disc(P[1],b[0]-1,b[1],b[2],b[3]);for(const b of B)if(b[2]>6)disc(P[2],b[0]-3,b[1]-2,b[2]-4,b[3]-3);disc(P[3],-4,-31,3,2);disc(P[3],-9,-24,2,2);
  for(let i=0;i<14;i++){const px=-11+Math.floor(hh(s,i)*22),py=-36+Math.floor(hh(s,i+40)*24);if(((px/11)**2+((py+25)/11)**2)>.7)continue;r(i%3?P[3]:P[0],px,py,2,1)}
  r(P[0],-6,-15,13,2);r('#1e3a2e55',-7,-13,15,2);
  r('#ffffff',-1,-39,1,1);
  return}
 if(t.fieldMove==='headbutt'){
  // árbol robusto con una marca ámbar en el tronco: se sacude con Golpe Cabeza
  const P=['#2b5a3e','#3f8049','#6aa356','#a3cf78'];
  r('#4a3626',-4,-16,9,16);r('#6b4f35',-4,-16,6,16);r('#8d6a44',-4,-16,2,14);r('#2f2118',-6,-1,13,1);
  r('#e0a23a',-3,-11,6,4);r('#f4cf72',-2,-10,4,2);r('#7a4b17',-3,-8,6,1);
  const B=[[0,-27,14,11],[-9,-22,8,7],[9,-22,8,7],[0,-35,9,8]];
  for(const b of B)disc(P[0],b[0],b[1]+1,b[2]+1,b[3]+1);for(const b of B)disc(P[1],b[0]-1,b[1],b[2],b[3]);for(const b of B)if(b[2]>6)disc(P[2],b[0]-3,b[1]-2,b[2]-4,b[3]-3);disc(P[3],-4,-33,3,2);
  r('#1e3a2e55',-8,-14,17,2);
  return}
 if(t.fieldMove==='strength'){
  // roca grande y redondeada con marcas de empuje
  const P=['#3f5a5c','#6f8e8e','#9fbdb8','#d6ebe2'];
  disc(P[0],0,-8,16,9);disc(P[0],-1,-14,12,9);disc(P[1],-1,-9,15,8);disc(P[1],-2,-15,11,8);disc(P[2],-5,-13,9,5);disc(P[3],-6,-18,5,2);r(P[3],-11,-12,3,1);
  r(P[0],-11,-4,23,1);r(P[0],-9,-9,19,1);r('#e4e7c7',-8,-13,2,1);r('#e4e7c7',-9,-14,1,3);r('#e4e7c7',6,-13,2,1);r('#e4e7c7',8,-14,1,3);r('#e4e7c7',-6,-13,12,1);
  r('#1b2e2755',-14,-1,31,2);
  return}
 // roca agrietada que se rompe con Golpe roca
 const P=['#4a4038','#7d6c58','#aa9878','#dccb a6'.replace(' ','')];
 disc(P[0],0,-7,15,8);disc(P[0],-2,-13,10,8);disc(P[0],9,-8,6,5);disc(P[1],-1,-8,14,7);disc(P[1],-3,-14,9,7);disc(P[1],8,-9,5,4);disc(P[2],-4,-12,8,5);disc(P[3],-5,-16,4,2);
 r('#2b231d',-1,-20,1,5);r('#2b231d',0,-16,2,1);r('#2b231d',2,-15,1,4);r('#2b231d',3,-11,2,1);r('#2b231d',-6,-9,4,1);r('#2b231d',-7,-8,1,3);r('#2b231d',-9,-5,3,1);
 r('#8a7a62',13,-3,3,2);r('#aa9878',-15,-2,3,2);r('#1b140f55',-13,-1,29,2);
},
waterfall(c,x,y,time){c.fillStyle='#5b899a';c.fillRect(x,y,32,32);c.fillStyle='#b5dedc';for(let i=0;i<5;i++){const sy=(i*9+Math.floor(time*15))%32;c.fillRect(x+3,sy+y,26,2)}c.fillStyle='#e2eedd';c.fillRect(x,y+1,32,3);c.fillRect(x+2,y+27,28,4);c.fillStyle='#416e80';c.fillRect(x,y,2,32);c.fillRect(x+30,y,2,32)},
surf(c,x,y,time){c.save();c.fillStyle='#355f6e50';c.beginPath();c.ellipse(x,y+4,24,9,0,0,Math.PI*2);c.fill();c.strokeStyle='#d1e7d6';c.lineWidth=2;c.beginPath();c.ellipse(x,y+6,23+Math.sin(time*3),7,0,.2,Math.PI*.85);c.stroke();c.beginPath();c.ellipse(x,y+7,16,5,0,Math.PI*1.1,Math.PI*1.8);c.stroke();c.restore()},
darkness(c,w,h){const g=c.createRadialGradient(w/2,h/2,75,w/2,h/2,240);g.addColorStop(0,'#101d2200');g.addColorStop(.4,'#101d2225');g.addColorStop(1,'#101d22ec');c.fillStyle=g;c.fillRect(0,0,w,h)}
};
