// Original pixel scenery and type traces; no Pokémon identity is drawn in a wild trace.
const waR=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
const waD=(c,col,cx,cy,rx,ry)=>{c.fillStyle=col;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}};
const waRM=(()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)')}catch(e){return null}})();
const waRing=(c,col,cx,cy,rx,ry)=>{c.fillStyle=col;const n=Math.max(16,Math.round((rx+ry)*2));for(let i=0;i<n;i++){const a=i/n*Math.PI*2;c.fillRect(Math.round(cx+Math.cos(a)*rx),Math.round(cy+Math.sin(a)*ry),1,1)}};
window.WorldArt={
pokeball(c,x,y){x=Math.round(x);y=Math.round(y);waD(c,'rgba(20,40,32,.30)',x+1,y+4,12,3);
 const cx=x,cy=y-7,rx=12,ry=10;waD(c,'#263a37',cx,cy,rx+1,ry+1);
 for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w<=0)continue;
  const col=j<-1?(j<-6?'#ff7a68':j<-3?'#ee544a':'#d63f3c'):j>1?(j>6?'#c4c6b8':j>3?'#dcdccc':'#f2f1e4'):'#263a37';c.fillStyle=col;c.fillRect(cx-w,cy+j,w*2,1);
  if(j<-1&&w>3){c.fillStyle='#a52f33';c.fillRect(cx+w-3,cy+j,3,1)}if(j>1&&w>3){c.fillStyle='#a9ac9f';c.fillRect(cx+w-3,cy+j,3,1)}}
 waD(c,'#263a37',cx,cy,5,5);waD(c,'#f6f5e9',cx,cy,3,3);waD(c,'#cfd3c4',cx+1,cy+1,2,2);waR(c,'#ffffff',cx-8,cy-7,3,1);waR(c,'#ffffff',cx-9,cy-6,1,2)},
card(c,x,y,color,time){x=Math.round(x);y=Math.round(y);waD(c,'rgba(20,40,32,.26)',x,y+8,12,3);const dy=Math.round(Math.sin(time*2)*2);
 waR(c,'#1f362f',x-12,y-15+dy,25,19);waR(c,'#f4efd3',x-11,y-14+dy,23,17);waR(c,color,x-9,y-12+dy,19,13);waR(c,'rgba(255,255,255,.28)',x-9,y-12+dy,19,3);waR(c,'rgba(0,0,0,.18)',x-9,y-1+dy,19,2);
 waR(c,'#f4e7ad',x-6,y-9+dy,5,5);waR(c,'#fff8d0',x-6,y-9+dy,5,1);waR(c,'#3d6458',x+1,y-8+dy,7,2);waR(c,'#3d6458',x+1,y-4+dy,5,1);if(!(Math.floor(time*2)%5))waR(c,'#ffffff',x+8,y-16+dy,2,2)},
exit(c,x,y,kind,label,beginner=false){x=Math.round(x);y=Math.round(y);
 const cave=kind==='cave',pal=beginner?['#4b7a4a','#7fb06a','#2f5a3a','#b6e790']:cave?['#6b766a','#93a08e','#464f48','#334b3b']:['#a3a285','#d6d2ae','#575745','#e1d9af'];
 waD(c,'rgba(30,58,44,.26)',x+2,y+4,34,7);
 for(const sx of [-27,17]){waR(c,pal[2],x+sx,y-46,10,48);waR(c,pal[0],x+sx+1,y-46,8,47);waR(c,pal[1],x+sx+1,y-46,2,47);waR(c,pal[2],x+sx+7,y-46,2,47);waR(c,pal[2],x+sx+1,y-30,8,1);waR(c,pal[2],x+sx+1,y-14,8,1);
  waR(c,pal[2],x+sx-2,y-53,14,3);waR(c,pal[1],x+sx-1,y-52,12,2);waR(c,pal[0],x+sx-1,y-50,12,2)}
 waR(c,pal[2],x-27,y-51,54,11);waR(c,pal[0],x-27,y-50,54,9);waR(c,pal[1],x-27,y-50,54,2);waR(c,pal[2],x-27,y-42,54,2);
 waR(c,pal[2],x-17,y-44,34,12);waR(c,pal[3],x-16,y-43,32,10);waR(c,'rgba(255,255,255,.30)',x-16,y-43,32,2);
 if(beginner){for(const vx of [-24,-12,8,21]){waR(c,'#3f7a45',x+vx,y-40,2,9);waR(c,'#8cc873',x+vx+1,y-34,2,2);waR(c,'#3f7a45',x+vx-1,y-30,2,2)}}
 else if(cave){for(let i=0;i<5;i++)waR(c,'#334b3b',x-14+i*7,y-43,3,8)}
 c.fillStyle='#2f4636';c.beginPath();c.moveTo(x-9,y-6);c.lineTo(x,y-18);c.lineTo(x+9,y-6);c.fill();c.fillStyle='#e8dfa8';c.beginPath();c.moveTo(x-8,y-7);c.lineTo(x,y-17);c.lineTo(x+8,y-7);c.fill();
 if(label){waR(c,'rgba(16,40,30,.35)',x-98,y-72,200,20);waR(c,'#1d4332',x-100,y-75,200,18);waR(c,'#3d7a5a',x-100,y-75,200,1);waR(c,'#0f2a20',x-100,y-58,200,1);c.fillStyle='#f4f0d2';c.font='9px monospace';c.textAlign='center';c.fillText(label,x,y-62)}},
park(c,x,y){x=Math.round(x);y=Math.round(y);waR(c,'rgba(24,52,40,.20)',x-46,y+21,96,7);
 waR(c,'#5b6a52',x-48,y-25,96,50);waR(c,'#cfd2ad',x-47,y-24,94,43);waR(c,'#eef0cf',x-47,y-24,94,2);waR(c,'#aeb68f',x-47,y+17,94,2);
 waR(c,'#8d9677',x-47,y+19,94,5);waR(c,'#6e7a5d',x-47,y+22,94,2);for(let i=0;i<7;i++)waR(c,'#6e7a5d',x-40+i*14,y+19,1,3);
 waR(c,'#2f5632',x-41,y-18,82,34);waR(c,'#243f27',x-41,y-18,82,2);waR(c,'#3e6a3d',x-41,y-16,82,30);waR(c,'#4d7c47',x-41,y+14,82,2);
 for(let i=0;i<34;i++){const gx=-40+((i*23)%76),gy=-16+((i*41)%28),leaf=i%3?'#4f8a4a':'#6aa85a';waR(c,leaf,x+gx,y+gy+1,5,3);waR(c,'#2f5632',x+gx+1,y+gy+4,4,1);waR(c,leaf,x+gx+2,y+gy-1,1,2)}
 const FL=['#f4b8cc','#f2cf5f','#ffffff','#ee7f7a','#a9b4f2','#f7a85a'];
 for(let i=0;i<46;i++){const gx=-40+((i*37)%78),gy=-16+((i*53)%29),col=FL[(i*5+(i>>2))%6];waR(c,col,x+gx,y+gy,3,3);waR(c,'#fffbe0',x+gx+1,y+gy+1,1,1);waR(c,'rgba(0,0,0,.22)',x+gx,y+gy+3,3,1)}
 // banco de madera
 waR(c,'rgba(24,52,40,.24)',x-28,y+49,58,5);waR(c,'#3b4843',x-25,y+44,3,8);waR(c,'#3b4843',x+22,y+44,3,8);waR(c,'#59655f',x-25,y+44,1,8);waR(c,'#59655f',x+22,y+44,1,8);
 for(const [by,bh] of [[30,3],[34,3]]){waR(c,'#6b4e33',x-29,y+by,58,bh+1);waR(c,'#a67d52',x-29,y+by,58,bh);waR(c,'#cfa874',x-29,y+by,58,1);waR(c,'#8a6743',x-18,y+by+1,1,bh-1);waR(c,'#8a6743',x+9,y+by+1,1,bh-1)}
 waR(c,'#6b4e33',x-29,y+39,58,7);waR(c,'#b2885a',x-29,y+39,58,5);waR(c,'#d9b27c',x-29,y+39,58,1);waR(c,'#8a6743',x-6,y+40,1,4);waR(c,'#8a6743',x+14,y+40,1,4);waR(c,'#5a4128',x-29,y+44,58,2)},
building(ctx,b,x,y){BuildingArt.draw(ctx,b,x,y)},
fountain(c,x,y,time){x=Math.round(x);y=Math.round(y);
 waD(c,'rgba(22,52,42,.22)',x+5,y+10,40,18);
 waD(c,'#4a5a54',x,y+7,35,21);waD(c,'#889a90',x,y+5,34,21);waD(c,'#6f8177',x,y+6,34,20);
 waD(c,'#dfe6d0',x,y,34,21);waD(c,'#c4cdb8',x+1,y+1,32,19);waD(c,'#e9eedc',x-2,y-1,29,17);
 waD(c,'#7c8d85',x,y+1,29,17);waD(c,'#99aaa0',x+1,y+2,28,16);
 waD(c,'#357c8c',x,y+1,27,15);waD(c,'#4f9ca8',x-1,y,25,13);waD(c,'#74c0c4',x-3,y-2,17,8);
 const T=time||0;
 for(let k=0;k<2;k++){const ph=((T*.45+k*.5)%1),rx=4+ph*20,ry=rx*.55;waRing(c,'rgba(236,252,250,'+(0.8*(1-ph)).toFixed(2)+')',x,y+2,rx,ry)}
 waR(c,'rgba(255,255,255,.55)',x-16,y-5,6,1);waR(c,'rgba(255,255,255,.4)',x+8,y+6,7,1);waR(c,'rgba(255,255,255,.4)',x-8,y+9,5,1);
 // pedestal
 waR(c,'#56665f',x-6,y-27,12,26);waR(c,'#9aa99d',x-5,y-27,10,25);waR(c,'#d3dcc7',x-5,y-27,3,25);waR(c,'#6e7e76',x+2,y-27,3,25);waR(c,'#56665f',x-4,y-16,8,1);
 waD(c,'#56665f',x,y-2,10,4);waD(c,'#b9c4b0',x,y-3,9,3);
 waD(c,'#4a5a54',x,y-27,17,7);waD(c,'#8c9d92',x,y-28,16,6);waD(c,'#d9e1cb',x,y-30,16,5);waD(c,'#4f9ca8',x,y-30,12,3);waD(c,'#8bd0d0',x-2,y-31,6,1);
 waR(c,'#9aa99d',x-2,y-40,4,10);waR(c,'#d3dcc7',x-2,y-40,2,10);waD(c,'#d3dcc7',x,y-41,3,2);
 // chorros
 const rm=waRM&&waRM.matches;
 const H=Math.round(8+Math.sin(T*3)*2);waR(c,'rgba(226,248,248,.92)',x-1,y-41-H,2,H+2);waR(c,'rgba(255,255,255,.95)',x-1,y-42-H,2,2);
 for(const sd of [-1,1])for(let i=0;i<6;i++){const t=((rm?0:T*.9)+i/6)%1,px=x+sd*(9+t*14),py=y-33-18*t+44*t*t;waR(c,'rgba(226,248,248,.88)',px-1,py-1,2,2);if(t>.1)waR(c,'rgba(226,248,248,.45)',px-sd*2,py-2,1,2)}
 for(const sd of [-1,1]){const ph=((T*.9+.07)%1);if(ph>.05&&ph<.4)waRing(c,'rgba(236,252,250,'+(.7*(1-ph*2.2)).toFixed(2)+')',x+sd*23,y-1,2+ph*10,1+ph*5)}},
alert(ctx,x,y,elapsed){const lift=Math.sin(Math.min(1,elapsed/.18)*Math.PI)*4;ctx.fillStyle='#27433348';ctx.fillRect(x-9,y-64-lift,20,23);ctx.fillStyle='#f4e9bd';ctx.fillRect(x-10,y-66-lift,20,22);ctx.fillStyle='#c77b52';ctx.fillRect(x-2,y-63-lift,4,11);ctx.fillRect(x-2,y-49-lift,4,3)},
trace(ctx,trace,x,y,near,time,distance){const color=window.Frontera.TYPE[trace.type][1];ctx.save();ctx.globalAlpha=near?.95:distance<190?.60:.28;ctx.fillStyle='#466b4355';ctx.beginPath();ctx.ellipse(x,y,17,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=2;
 switch(trace.type){
 case'grass':ctx.beginPath();ctx.moveTo(x-8,y-2);ctx.quadraticCurveTo(x-12,y-19,x+10,y-22);ctx.quadraticCurveTo(x+10,y-7,x-8,y-2);ctx.fill();ctx.strokeStyle='#5c8052';ctx.beginPath();ctx.moveTo(x-8,y-2);ctx.lineTo(x+5,y-17);ctx.stroke();break;
 case'water':ctx.beginPath();ctx.moveTo(x,y-24);ctx.quadraticCurveTo(x-16,y-5,x,y-2);ctx.quadraticCurveTo(x+16,y-5,x,y-24);ctx.fill();break;
 case'fire':ctx.beginPath();ctx.moveTo(x-9,y-3);ctx.lineTo(x-9,y-12);ctx.lineTo(x-4,y-9);ctx.lineTo(x,y-25);ctx.lineTo(x+9,y-10);ctx.lineTo(x+7,y-3);ctx.closePath();ctx.fill();break;
 case'electric':ctx.beginPath();ctx.moveTo(x+1,y-26);ctx.lineTo(x-8,y-12);ctx.lineTo(x-1,y-12);ctx.lineTo(x-4,y-1);ctx.lineTo(x+9,y-16);ctx.lineTo(x+2,y-16);ctx.closePath();ctx.fill();break;
 case'rock':ctx.fillRect(x-11,y-10,12,9);ctx.fillRect(x+3,y-15,10,11);ctx.fillRect(x-5,y-19,9,8);break;
 case'ghost':ctx.beginPath();ctx.arc(x,y-13,9,Math.sin(time)*.3,Math.PI*1.7);ctx.stroke();ctx.fillRect(x-3,y-15,2,4);ctx.fillRect(x+3,y-15,2,4);break;
 case'poison':ctx.beginPath();ctx.arc(x-5,y-9,5,0,Math.PI*2);ctx.arc(x+6,y-16,5,0,Math.PI*2);ctx.arc(x-6,y-24,3,0,Math.PI*2);ctx.fill();break;
 case'ice':ctx.beginPath();ctx.moveTo(x,y-27);ctx.lineTo(x,y-1);ctx.moveTo(x-10,y-21);ctx.lineTo(x+10,y-7);ctx.moveTo(x+10,y-21);ctx.lineTo(x-10,y-7);ctx.stroke();break;
 case'flying':ctx.beginPath();ctx.moveTo(x-13,y-8);ctx.quadraticCurveTo(x-5,y-25,x+11,y-22);ctx.quadraticCurveTo(x+2,y-9,x-13,y-8);ctx.stroke();ctx.beginPath();ctx.moveTo(x-9,y-9);ctx.lineTo(x+5,y-19);ctx.stroke();break;
 case'bug':ctx.beginPath();ctx.ellipse(x,y-13,6,9,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();for(const dy of [-18,-12,-6]){ctx.moveTo(x-5,dy+y);ctx.lineTo(x-12,dy+y-3);ctx.moveTo(x+5,dy+y);ctx.lineTo(x+12,dy+y-3)}ctx.stroke();break;
 case'psychic':ctx.beginPath();ctx.ellipse(x,y-14,13,8,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(x,y-14,3,0,Math.PI*2);ctx.fill();break;
 case'fairy':ctx.beginPath();ctx.moveTo(x,y-28);ctx.lineTo(x+4,y-17);ctx.lineTo(x+12,y-13);ctx.lineTo(x+4,y-9);ctx.lineTo(x,y);ctx.lineTo(x-4,y-9);ctx.lineTo(x-12,y-13);ctx.lineTo(x-4,y-17);ctx.closePath();ctx.fill();break;
 case'dragon':ctx.beginPath();ctx.moveTo(x-9,y-5);ctx.lineTo(x-5,y-26);ctx.lineTo(x+2,y-12);ctx.lineTo(x+11,y-22);ctx.lineTo(x+7,y-4);ctx.stroke();break;
 case'ground':ctx.beginPath();ctx.moveTo(x-14,y-5);ctx.lineTo(x-5,y-14);ctx.lineTo(x,y-9);ctx.lineTo(x+8,y-20);ctx.lineTo(x+14,y-5);ctx.stroke();break;
 case'steel':ctx.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;const px=x+11*Math.cos(a),py=y-13+11*Math.sin(a);i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y-13,4,0,Math.PI*2);ctx.stroke();break;
 case'fighting':ctx.fillRect(x-7,y-18,14,14);ctx.fillRect(x-9,y-22,5,8);ctx.fillRect(x-2,y-24,4,8);ctx.fillRect(x+4,y-21,4,8);break;
 default:ctx.fillRect(x-8,y-11,6,9);ctx.fillRect(x+2,y-18,6,9);ctx.fillRect(x-8,y-16,2,3);ctx.fillRect(x+2,y-23,2,3)
 }
 if(near){ctx.strokeStyle='#e7ecc8';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y+2,22,9,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#193f31';ctx.fillRect(x-35,y-45,70,15);ctx.fillStyle='#f0f3d7';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(window.Frontera.TYPE[trace.type][0],x,y-34)}ctx.restore()},
sign(c,x,y,text){x=Math.round(x);y=Math.round(y);waR(c,'rgba(24,50,38,.25)',x-14,y-1,30,3);waR(c,'#5a4128',x-3,y-12,6,12);waR(c,'#9a7650',x-2,y-12,3,12);
 waR(c,'#5a4128',x-44,y-33,88,23);waR(c,'#e1d3a2',x-43,y-32,86,21);waR(c,'#f2e7bd',x-43,y-32,86,2);waR(c,'#b8a874',x-43,y-13,86,2);waR(c,'#8a7a52',x-41,y-30,1,1);waR(c,'#8a7a52',x+40,y-30,1,1);waR(c,'#8a7a52',x-41,y-14,1,1);waR(c,'#8a7a52',x+40,y-14,1,1);
 c.fillStyle='#4c5f3f';c.font='bold 8px monospace';c.textAlign='center';c.fillText(text,x,y-18)},
gymArena(ctx){ctx.fillStyle='#293f3d';ctx.fillRect(0,0,960,540);ctx.fillStyle='#486760';ctx.fillRect(0,100,960,325);ctx.fillStyle='#344f48';for(let i=0;i<12;i++)ctx.fillRect(i*90,100,2,325);ctx.fillStyle='#c2cdab';ctx.fillRect(0,420,960,11);ctx.fillStyle='#7f927a';ctx.fillRect(0,431,960,109);ctx.fillStyle='#bac59e';for(let x=0;x<960;x+=80)ctx.fillRect(x,432,2,108);for(let y=458;y<540;y+=27)ctx.fillRect(0,y,960,1);ctx.fillStyle='#e4e4bd';ctx.font='bold 18px monospace';ctx.textAlign='center';ctx.fillText('GIMNASIO BROTE',480,143);ctx.font='12px monospace';ctx.fillText('VERA · TIPO ROCA',480,168);ctx.strokeStyle='#a6b899';ctx.lineWidth=3;ctx.beginPath();ctx.arc(480,281,54,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(426,281);ctx.lineTo(534,281);ctx.stroke();ctx.beginPath();ctx.arc(480,281,12,0,Math.PI*2);ctx.stroke()}
};

window.WorldArt.frontier=function(c,x,y,locked,label){c.save();c.translate(Math.round(x),Math.round(y));
 waD(c,'rgba(24,46,38,.28)',2,5,36,8);
 for(const sx of [-24,15]){waR(c,'#233a32',sx,-39,9,45);waR(c,'#3f5a4e',sx+1,-39,7,44);waR(c,'#5f7d6c',sx+1,-39,2,44);waR(c,'#233a32',sx-2,-45,13,4);waR(c,'#58766a',sx-1,-44,11,2)}
 waR(c,'#5c4c35',-27,-44,54,10);waR(c,'#cdb98a',-27,-43,54,8);waR(c,'#ecdcaa',-27,-43,54,2);waR(c,'#8f7d56',-27,-37,54,2);
 waR(c,locked?'#7e4a3c':'#3e6f45',-18,-36,36,7);waR(c,locked?'#b5836d':'#73986a',-18,-36,36,5);waR(c,'rgba(255,255,255,.25)',-18,-36,36,1);
 if(locked){for(let dx=-12;dx<=12;dx+=8){waR(c,'#53604c',dx,-27,4,29);waR(c,'#b9c8ad',dx,-27,2,28)}waR(c,'#6a5226',-7,-17,14,11);waR(c,'#f0cd7a',-6,-17,12,9);waR(c,'#fbe6a2',-6,-17,12,2);waR(c,'#6a5226',-2,-14,4,4);waR(c,'#6a5226',-5,-21,2,5);waR(c,'#6a5226',3,-21,2,5);waR(c,'#6a5226',-5,-22,10,2)}
 else{c.fillStyle='#2f4636';c.beginPath();c.moveTo(-8,-15);c.lineTo(8,-15);c.lineTo(0,-26);c.closePath();c.fill();c.fillStyle='#ecebb8';c.beginPath();c.moveTo(-6,-16);c.lineTo(6,-16);c.lineTo(0,-24);c.closePath();c.fill()}
 if(label){waR(c,'rgba(16,40,30,.35)',-138,-62,280,19);waR(c,'#1d4332',-140,-65,280,17);waR(c,'#3d7a5a',-140,-65,280,1);waR(c,'#0f2a20',-140,-49,280,1);c.fillStyle='#f6f1d3';c.font='9px monospace';c.textAlign='center';c.fillText(label,0,-52)}c.restore()};
