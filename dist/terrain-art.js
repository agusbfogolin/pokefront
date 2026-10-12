/* Original pixel scenery for seeded routes and caves. Tile size: 32 px. */
(function(root){'use strict';
const base=region=>root.Frontera?.districtBase(region||'')||region;
const rect=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
function ground(c,x,y,t,tx,ty,time){
 if(t.boundary&&t.town){rect(c,'#54744c',x,y,32,32);if(t.detail>.5){rect(c,'#648452',x+4,y+7,13,5);rect(c,'#75945d',x+6,y+9,5,2)}if(t.edgeEast||t.edgeWest){const dx=t.edgeWest?1:23;rect(c,'#314f3b',x+dx,y,8,32);rect(c,'#77965d',x+dx+1,y,5,32);rect(c,'#b4a476',x+dx+4,y,2,32);if(ty%2===0)rect(c,'#d7c393',x+dx+3,y+11,4,8)}if(t.edgeNorth||t.edgeSouth){const dy=t.edgeNorth?1:23;rect(c,'#314f3b',x,y+dy,32,8);rect(c,'#77965d',x,y+dy+1,32,5);rect(c,'#b4a476',x,y+dy+4,32,2);if(tx%2===0)rect(c,'#d7c393',x+11,y+dy+3,4,8)}return true;}
 if(t.boundary&&['tree','pine'].includes(t.obstacle)){rect(c,base(t.region)==='frost'?'#9bb4b2':'#345b43',x,y,32,32);if(t.detail>.5){rect(c,'#527852',x+3,y+8,16,9);rect(c,'#6b8b59',x+5,y+9,6,3)}return true;}
 const cold=base(t.region)==='frost',hot=base(t.region)==='crater',sand=base(t.region)==='dunes'||base(t.region)==='coast';
 if(t.obstacle==='cliff'){
  const p=cold?['#b7cacc','#8a9fa6','#617982']:hot?['#8c7b63','#6a5c50','#514b46']:sand?['#bdac7c','#96815d','#74694f']:['#95a58b','#748b77','#536c5d'];
  rect(c,p[0],x,y,32,32);if(t.edgeNorth)rect(c,cold?'#e1e9df':'#c2c6a2',x,y,32,3);if(t.edgeWest)rect(c,p[1],x,y,3,32);if(t.edgeEast)rect(c,p[1],x+29,y,3,32);if(t.edgeSouth){rect(c,p[1],x,y+23,32,6);rect(c,p[2],x,y+29,32,3);rect(c,p[0],x+4,y+24,7,2)}if(t.detail>.82){rect(c,p[1],x+9,y+10,10,2);rect(c,p[1],x+17,y+11,2,4)}return true;
 }
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
function details(c,x,y,t){if(!t.deco)return;
 if(t.deco==='reeds'){for(let i=0;i<3;i++){rect(c,'#667b47',x+8+i*6,y+24-i%2*3,2,6);rect(c,'#b3a578',x+7+i*6,y+19-i%2*3,3,6)}}
 else if(t.deco==='fern'){rect(c,'#345c43',x+15,y+14,2,16);for(let i=0;i<4;i++){rect(c,'#518951',x+9+i,y+17+i*3,7-i,2);rect(c,'#67a05a',x+17,y+17+i*3,7-i,2)}}
 else if(t.deco==='pebbles'){rect(c,'#857d67',x+7,y+22,6,3);rect(c,'#b3aa88',x+8,y+21,4,2);rect(c,'#857d67',x+21,y+10,4,3)}
 else{const p=base(t.region)==='frost'?'#a2bcb1':base(t.region)==='forest'?'#557b51':'#799a61';for(let i=0;i<3;i++){rect(c,p,x+9+i*3,y+21-i%2*3,2,5)}if(t.detail>.92){rect(c,'#dfd394',x+19,y+10,3,3);rect(c,'#eee8bb',x+21,y+12,2,2)}}
}
function obstacle(c,x,y,t){const kind=t.obstacle,cold=base(t.region)==='frost';
 rect(c,'#27443133',x-13,y-4,27,8);
 if(kind==='tree'){
  rect(c,'#806748',x-4,y-23,8,23);rect(c,'#355c46',x-17,y-44,34,28);rect(c,'#355c46',x-12,y-55,24,16);rect(c,'#486f4c',x-16,y-43,24,16);rect(c,'#587e51',x-10,y-53,17,17);rect(c,'#77945d',x-8,y-50,7,5);if(t.biome==='selva'){rect(c,'#294f40',x-21,y-39,11,15);rect(c,'#397951',x+11,y-45,11,18);rect(c,'#8caa5c',x-14,y-29,2,18);rect(c,'#b5ba70',x-14,y-13,7,2);rect(c,'#789d57',x+15,y-27,2,15);}return;
 }
 if(kind==='pine'){
  rect(c,'#796b54',x-3,y-23,6,23);const p=cold?['#587d7a','#7fa299','#d6e3d9']:['#345a50','#477463','#659271'];
  for(const [w,h,dy] of [[34,13,-24],[28,14,-36],[20,14,-48],[10,12,-57]]){rect(c,p[0],x-w/2,y+dy,w,h);rect(c,p[1],x-w/2+2,y+dy+1,w-6,5);if(cold)rect(c,p[2],x-w/2+2,y+dy,w-5,4)}return;
 }
 if(kind==='palm'){
  rect(c,'#a28b58',x-3,y-35,6,35);for(let i=0;i<4;i++)rect(c,'#796841',x-3,y-6-i*7,6,2);rect(c,'#477752',x-22,y-39,44,7);rect(c,'#63905d',x-15,y-47,29,8);rect(c,'#63905d',x-25,y-34,10,5);rect(c,'#355f49',x+14,y-34,11,6);rect(c,'#b5aa6f',x-3,y-39,6,5);return;
 }
 if(kind==='cactus'){
  rect(c,'#517a52',x-5,y-31,10,31);rect(c,'#74935b',x-3,y-29,3,26);rect(c,'#517a52',x-13,y-18,10,5);rect(c,'#517a52',x-13,y-25,5,12);rect(c,'#517a52',x+4,y-23,10,5);rect(c,'#517a52',x+9,y-31,5,13);rect(c,'#a2b875',x-2,y-23,2,2);rect(c,'#a2b875',x+10,y-28,2,2);return;
 }
 if(kind==='crystal'){
  for(const [dx,dy,h]of[[-9,-1,18],[0,0,32],[10,1,21]]){rect(c,'#6895a8',x+dx-4,y+dy-h,9,h);rect(c,'#a9d9d7',x+dx-3,y+dy-h+2,4,h-5);rect(c,'#e3eece',x+dx-1,y+dy-h-3,3,6)}return;
 }
 if(kind==='stump'){
  rect(c,'#6a563e',x-11,y-16,22,16);rect(c,'#ad976a',x-12,y-21,24,10);rect(c,'#d0b886',x-8,y-19,16,5);rect(c,'#846a47',x-4,y-17,8,2);rect(c,'#816c45',x-15,y-4,30,4);return;
 }
 const p=kind==='basalt'?['#655e57','#8b7c66','#434b49']:['#7c8e80','#abb69a','#516a5c'];
 if(kind==='pillar'){rect(c,p[2],x-7,y-35,14,35);rect(c,p[1],x-8,y-39,16,7);rect(c,p[0],x-6,y-30,12,28);rect(c,p[1],x-5,y-30,3,23);rect(c,p[2],x-9,y-4,18,4);return}
 rect(c,p[2],x-13,y-21,26,20);rect(c,p[0],x-15,y-17,30,12);rect(c,p[0],x-9,y-28,19,12);rect(c,p[1],x-8,y-26,13,7);rect(c,p[1],x-12,y-18,9,5);rect(c,p[2],x+3,y-13,7,3);if(cold)rect(c,'#d8e5db',x-9,y-27,18,4);
}
function landmark(c,x,y,p,region){
 region=base(region);
 // Scenery beside the clearing, with a clear route to the room's centre.
 const bx=x,by=y;
 if(p.kind==='camp'){
  rect(c,'#42613c33',bx-30,by+2,61,8);rect(c,'#826347',bx-25,by-7,50,12);rect(c,'#c4a16b',bx-21,by-18,42,15);rect(c,'#ddc18b',bx-14,by-27,28,12);rect(c,'#f0d3a0',bx-7,by-34,14,10);rect(c,'#4b5240',bx-6,by-13,12,16);rect(c,'#846746',bx-28,by+2,56,4);rect(c,'#665e49',bx-40,by+11,18,4);rect(c,'#c3985a',bx-34,by+8,6,6);rect(c,'#715f43',bx+30,by-8,15,15);rect(c,'#baa878',bx+31,by-9,13,4);
 }else if(p.kind==='crystals'){obstacle(c,bx-8,by,{obstacle:'crystal',region});obstacle(c,bx+21,by+8,{obstacle:'crystal',region})}
 else{
  const cold=base(region)==='frost',a=cold?'#a7bdba':'#9da386',b=cold?'#78989b':'#74856b';rect(c,'#2d473638',bx-28,by-4,60,14);for(const dx of[-22,20]){rect(c,b,bx+dx-7,by-36,14,36);rect(c,a,bx+dx-8,by-39,16,7);rect(c,a,bx+dx-6,by-30,4,24);rect(c,b,bx+dx-10,by-4,20,6)}rect(c,a,bx-28,by-47,59,8);rect(c,b,bx-23,by-39,48,4);rect(c,'#608357',bx-26,by-46,12,3);rect(c,a,bx-31,by+8,18,6);rect(c,b,bx-12,by+13,12,4);
 }
}
root.TerrainArt={ground,details,obstacle,landmark};
})(typeof window!=='undefined'?window:globalThis);
