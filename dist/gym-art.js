// Readable indoor tiles and barriers; every solid wall matches the tile collision.
window.GymArt=(()=>{
'use strict';
const r=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
function tile(c,x,y,t,tx,ty,time){const p=window.Frontera.GYM_THEMES[t.region];if(!p)return;
 if(t.ground==='gym-wall'){
  r(c,'#202f32',x,y,32,32);r(c,p.wall,x+1,y+1,30,30);r(c,p.light,x+1,y+1,30,7);r(c,'#1d2e333b',x+1,y+25,30,6);r(c,'#ffffff24',x+3,y+2,25,2);r(c,'#1a283524',x+15,y+10,2,14);r(c,p.light,x+3,y+13,9,2);r(c,p.light,x+20,y+23,8,2);
  if((Math.abs(tx*3+ty)%7)===0){switch(p.motif){case 'garden':r(c,'#2a5541',x+3,y+8,6,17);r(c,'#789b62',x+6,y+9,10,5);r(c,'#91af76',x+7,y+18,8,5);break;case 'pipes':case 'electric':r(c,p.accent,x+9,y+10,4,14);r(c,p.accent,x+9,y+20,16,4);r(c,'#f3eac8',x+10,y+11,2,12);break;case 'water':r(c,'#467a92',x+4,y+11,24,12);r(c,'#a2d1d5',x+5,y+12,22,2);break;case 'forge':r(c,'#523e3d',x+6,y+10,20,16);r(c,p.accent,x+10,y+15,11,7);break;case 'mirrors':r(c,p.accent,x+7,y+10,18,17);r(c,'#9fbac5',x+9,y+12,14,13);r(c,'#dce8de',x+11,y+14,2,7);break;case 'crystal':r(c,'#b8e7e6',x+12,y+9,8,17);r(c,'#ecf6e8',x+12,y+9,3,16);break;default:r(c,p.light,x+5,y+12,21,12);r(c,'#1e38383b',x+6,y+21,20,3)}}return;
 }
 r(c,p.floor,x,y,32,32);r(c,'#ffffff26',x+2,y+2,28,2);r(c,'#233b3522',x,y+30,32,2);r(c,'#233b351b',x+30,y,2,32);
 if(t.carpet){r(c,p.wall,x+1,y+1,30,29);r(c,p.accent,x+1,y+1,2,29);r(c,p.accent,x+29,y+1,2,29);if((tx+ty)%3===0)r(c,p.light,x+13,y+12,6,6)}
 if(t.ground==='gym-gate'){
  r(c,p.wall,x,y+3,32,6);r(c,p.accent,x,y+4,32,2);
  if(t.gateOpen){r(c,'#487e66',x+11,y+11,10,7);r(c,'#c2e6a9',x+14,y+11,4,5)}else{r(c,'#253b38',x,y+10,32,18);for(let dx=3;dx<32;dx+=8){r(c,'#c6ccb3',x+dx,y+9,3,20);r(c,'#f1e6c5',x+dx,y+9,1,19)}r(c,p.accent,x+10,y+14,13,8)}
 }
}
function exit(c,x,y,label,entry=false){r(c,'#d1c9a4',x-21,y-13,42,25);r(c,'#658b78',x-19,y-10,38,6);c.fillStyle='#e8ecd5';c.beginPath();c.moveTo(x-7,y+(entry?5:-1));c.lineTo(x,y+(entry?-2:6));c.lineTo(x+7,y+(entry?5:-1));c.closePath();c.fill();if(label){r(c,'#203c32',x-75,y-32,150,16);c.fillStyle='#efead0';c.font='9px monospace';c.textAlign='center';c.fillText(entry?'ENTRAR':'SALIDA',x,y-20)}}
return{tile,exit};
})();
