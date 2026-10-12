// Original code-native pixel architecture, with silhouettes for each city service.
window.BuildingArt=(()=>{
'use strict';
const P={ink:'#344a43',shadow:'#25443138',stone:'#a0aa94',glass:'#9ac6c5',glassLight:'#d7e5d1'};
const r=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
function emblem(c,x,y,type,color){r(c,P.ink,x-12,y-12,24,24);r(c,'#efe5ba',x-10,y-10,20,20);c.fillStyle=color;c.beginPath();switch(type){case 'electric':c.moveTo(x+2,y-9);c.lineTo(x-6,y+1);c.lineTo(x,y+1);c.lineTo(x-2,y+9);c.lineTo(x+7,y-3);c.lineTo(x+1,y-3);break;case 'water':c.moveTo(x,y-9);c.quadraticCurveTo(x-13,y+9,x,y+8);c.quadraticCurveTo(x+13,y+9,x,y-9);break;case 'grass':c.moveTo(x-7,y+7);c.quadraticCurveTo(x-9,y-9,x+8,y-8);c.quadraticCurveTo(x+10,y+5,x-7,y+7);break;case 'fire':c.moveTo(x-8,y+8);c.lineTo(x-7,y-2);c.lineTo(x-3,y+1);c.lineTo(x+1,y-10);c.lineTo(x+8,y+2);c.lineTo(x+5,y+8);break;case 'ice':c.moveTo(x,y-9);c.lineTo(x+7,y);c.lineTo(x,y+9);c.lineTo(x-7,y);break;case 'psychic':c.arc(x,y,8,0,Math.PI*2);break;case 'poison':c.arc(x-3,y,5,0,Math.PI*2);c.arc(x+4,y-4,4,0,Math.PI*2);break;default:c.moveTo(x-8,y+6);c.lineTo(x-7,y-4);c.lineTo(x,y-9);c.lineTo(x+8,y-3);c.lineTo(x+6,y+7)}c.closePath();c.fill()}
function windowPane(c,x,y,w,h,shutters=false){r(c,P.ink,x,y,w,h);r(c,'#ebe4c8',x+2,y+2,w-4,h-4);r(c,P.glass,x+4,y+4,w-8,h-8);r(c,P.glassLight,x+5,y+5,Math.max(3,w/3),2);r(c,'#e8e5c7',x+w/2-1,y+3,2,h-6);r(c,'#e8e5c7',x+3,y+h/2-1,w-6,2);r(c,P.stone,x-2,y+h, w+4,4);if(shutters){r(c,'#627662',x-7,y+2,5,h-2);r(c,'#627662',x+w+2,y+2,5,h-2)}}
const hs=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0)/4294967296};
const FLW=['#f4a9c6','#f6d64a','#ffffff','#ee7f7a','#a9b4f2','#f7a85a'];
function disc(c,color,cx,cy,rx,ry){c.fillStyle=color;for(let j=-ry;j<=ry;j++){const k=1-(j*j)/((ry+.5)*(ry+.5));if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));if(w>0)c.fillRect(Math.round(cx-w),Math.round(cy+j),w*2,1)}}
function pot(c,x,y,seed){r(c,'#7d3f2e',x,y+5,9,1);r(c,'#b5654a',x,y+1,9,5);r(c,'#d68a6a',x,y+1,9,1);r(c,'#8f4a38',x+7,y+2,2,4);
 disc(c,'#2f6a3a',x+4,y-2,5,4);disc(c,'#4f9a4f',x+3,y-3,4,3);const f=FLW[Math.floor(seed*FLW.length)];r(c,f,x+1,y-5,2,2);r(c,f,x+5,y-4,2,2);r(c,'#fff6d0',x+1,y-5,1,1);r(c,f,x+3,y-7,2,2)}
function decor(c,b,w,h,cx,time,o){
 const {house,gym,clinic,shop,lab,dojo,doorW,doorY,paneW,paneH,winY,accent}=o,sd=hs(b.id||'x'),still=!!window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const T=still?0:time;
 // jardineras con flores bajo las ventanas de las casas
 if(house||b.id==='academy'||b.id==='guild'){
  for(const xx of [house?15:22,w-(house?15:22)-paneW]){const by=winY+paneH+4;r(c,'#4d3622',xx-1,by,paneW+2,6);r(c,'#7a5634',xx,by,paneW,5);r(c,'#a67d52',xx,by,paneW,1);
   for(let i=0;i<6;i++){const fx=xx+2+i*Math.floor((paneW-4)/5),fc=FLW[Math.floor(hs((b.id||'')+xx+i)*FLW.length)];r(c,'#3f7a45',fx-1,by-3,4,3);r(c,fc,fx,by-5,2,2);r(c,'#fff6d0',fx,by-5,1,1);if(i%2)r(c,'#3f7a45',fx,by+5,1,2)}}
 }
 // macetas junto a la puerta
 pot(c,cx-doorW/2-17,h-10,sd);pot(c,cx+doorW/2+9,h-10,(sd*7)%1);
 // farolillo junto a la puerta
 if(house||clinic||shop){const lx=cx+doorW/2+7,ly=doorY+4;r(c,'#26302d',lx+1,ly-3,2,4);r(c,'#26302d',lx-1,ly,6,1);r(c,'#ffe9a0',lx,ly+1,4,6);r(c,'#fff7d4',lx+1,ly+2,2,3);r(c,'#26302d',lx-1,ly+7,6,1);c.fillStyle='rgba(255,222,140,.16)';c.fillRect(lx-5,ly-3,14,16)}
 // humo de chimenea
 if(house){const sx=w-25,sy=-5,cnt=still?2:4;for(let i=0;i<cnt;i++){const t=still?(.25+i*.35):((T*.32+i/4+sd)%1),a=(1-t)*.55,rr=2+Math.round(t*4);c.globalAlpha=Math.max(0,a);disc(c,'#eef0ee',sx+Math.round(Math.sin(t*6+i*1.7)*3+t*7),sy-Math.round(t*30),rr,rr);c.globalAlpha=1}}
 // gimnasio: banderines en el tejado
 if(gym){for(const px of [8,w-10]){r(c,'#26302d',px,-4,2,22);const sw=still?0:Math.round(Math.sin(T*3+px)*1.5);for(let j=0;j<6;j++){r(c,j%2?accent:'#fff7d4',px+2,-3+j,10-j+sw,1)}}}
 // laboratorio: baliza roja parpadeante en la antena
 if(lab){const on=still||Math.floor(T*1.6)%2===0;r(c,on?'#ff5a4a':'#7a2a28',26,-13,3,3);if(on){c.fillStyle='rgba(255,90,70,.25)';c.fillRect(23,-16,9,9)}}
 // dojo: farolillos rojos colgando del dintel
 if(dojo){for(const lx of [cx-24,cx+18]){const sw=still?0:Math.round(Math.sin(T*1.8+lx)*1);r(c,'#3a2a1c',lx+3+sw,h-43,1,5);r(c,'#7a2a22',lx+sw,h-38,8,2);r(c,'#d6453d',lx+sw,h-36,8,8);r(c,'#f28a6a',lx+sw+1,h-35,2,6);r(c,'#7a2a22',lx+sw,h-28,8,2);r(c,'#f0c85a',lx+sw+3,h-26,2,3)}}
 // academia: enredadera en las esquinas
 if(b.id==='academy'){for(const [vx,dir] of [[8,1],[w-12,-1]]){for(let yy=44;yy<h-18;yy+=4){const o2=Math.round(Math.sin(yy*.7)*2);r(c,'#2f6a3a',vx+o2,yy,3,5);r(c,'#4f9a4f',vx+o2+dir,yy+1,3,2);if(yy%12===0)r(c,'#f4a9c6',vx+o2+dir*2,yy+2,2,2)}}}
}
function draw(c,b,x,y,time){c.save();c.translate(Math.round(x),Math.round(y));const w=b.w,h=b.h,cx=w/2,region=window.Frontera.districtBase?.(b.region||'campina')||b.region||'campina',type=b.gymType||'rock',theme=window.Frontera.GYM_THEMES?.[region],accent=theme?.accent||'#c3b77c',house=b.id.startsWith('house'),gym=b.id==='gym',clinic=b.id==='clinic',shop=b.id==='market',lab=b.id==='lab',dojo=b.id==='school';
 r(c,P.shadow,8,h-6,w+10,18);r(c,P.ink,3,29,w-6,h-25);r(c,b.wall,7,33,w-14,h-34);r(c,'#ffffff2c',8,34,w-17,4);r(c,'#3b514522',7,h-27,w-14,16);r(c,P.stone,4,h-10,w-8,10);
 // Facade courses are brick, timber, or panelled masonry rather than a flat fill.
 for(let yy=48;yy<h-24;yy+=12){r(c,dojo?'#53674d55':'#827e6030',8,yy,w-16,1);if(!dojo)for(let xx=10+(yy%24?11:0);xx<w-14;xx+=26)r(c,'#827e6024',xx,yy-9,1,9)}
 if(gym){
  r(c,P.ink,0,16,w,24);r(c,theme?.wall||b.roof,3,18,w-6,18);r(c,accent,0,36,w,5);c.fillStyle=theme?.light||'#8da08b';c.beginPath();c.moveTo(4,17);c.lineTo(cx,-6);c.lineTo(w-4,17);c.closePath();c.fill();r(c,P.ink,10,15,w-20,3);r(c,accent,cx-40,12,80,3);
  for(const xx of [14,w-29]){r(c,P.ink,xx-2,42,19,h-48);r(c,'#eee8c8',xx,42,15,h-53);r(c,'#c2bd9a',xx+10,45,3,h-60);r(c,accent,xx-4,42,23,5);r(c,'#d4caab',xx-4,h-14,23,8)}
  for(const xx of [43,w-63]){r(c,theme?.wall||b.roof,xx,51,20,30);r(c,accent,xx+4,55,12,20);r(c,'#ffffff44',xx+5,56,3,18)}emblem(c,cx,19,type,window.Frontera.TYPE[type][1]);
 }else if(clinic){
  r(c,P.ink,0,22,w,21);r(c,'#b96061',3,24,w-6,16);c.fillStyle='#c97974';c.beginPath();c.moveTo(4,24);c.quadraticCurveTo(cx,-7,w-4,24);c.closePath();c.fill();r(c,'#dfaaa0',14,21,w-28,3);r(c,'#f3edce',cx-6,3,12,28);r(c,'#f3edce',cx-14,11,28,11);r(c,'#96575a',10,39,w-20,4);
 }else if(lab){
  r(c,P.ink,0,18,w,24);r(c,b.roof,3,21,w-6,17);r(c,'#a3bab3',13,8,w-26,10);r(c,'#d4dfcc',16,10,w-32,3);r(c,P.ink,w-42,-6,23,21);r(c,'#87b6bb',w-39,-3,17,15);r(c,'#d4e3d2',w-33,-3,3,15);r(c,P.ink,24,-9,5,24);r(c,'#b9d8cf',16,-9,22,5);r(c,'#7ba6a6',16,-5,4,9);
 }else{
  c.fillStyle=P.ink;c.beginPath();c.moveTo(-2,37);c.lineTo(15,8);c.lineTo(w-15,8);c.lineTo(w+2,37);c.closePath();c.fill();c.fillStyle=b.roof;c.beginPath();c.moveTo(3,33);c.lineTo(18,11);c.lineTo(w-18,11);c.lineTo(w-3,33);c.closePath();c.fill();
  for(let yy=15;yy<=31;yy+=5){r(c,'#ffffff21',17,yy,w-34,1);for(let xx=23+(yy%10?5:0);xx<w-20;xx+=15)r(c,'#203b3524',xx,yy,1,5)}r(c,'#344a43',-2,35,w+4,6);r(c,'#d6d5b0',2,40,w-4,3);
  if(house){r(c,P.ink,w-33,-2,16,22);r(c,'#c1ad8b',w-31,0,12,17);r(c,'#786f56',w-34,-3,18,4)}
  if(b.id==='guild'){r(c,'#736182',cx-19,-6,38,20);r(c,'#b9a3bd',cx-15,-3,30,13);emblem(c,cx,16,'psychic','#ad81c2')}
  if(b.id==='academy'){r(c,'#d8c78c',cx-19,12,38,16);r(c,'#f2e8c9',cx-14,15,28,10);r(c,'#687b71',cx-1,15,2,10)}
 }
 const doorW=gym||clinic?38:house?22:30,doorH=Math.min(36,h-53),doorY=h-doorH-8;
 r(c,'#d9cfaa',cx-doorW/2-5,doorY-5,doorW+10,doorH+5);r(c,P.ink,cx-doorW/2-2,doorY-2,doorW+4,doorH+2);r(c,clinic||lab?'#80a7a5':'#73684e',cx-doorW/2,doorY,doorW,doorH);r(c,clinic||lab?'#c2ddd1':'#bba879',cx-doorW/2+3,doorY+3,doorW-6,13);r(c,P.ink,cx-1,doorY,2,doorH);r(c,'#e5d89b',cx+4,doorY+22,3,3);r(c,'#e3dec0',cx-doorW/2-6,h-8,doorW+12,5);r(c,'#a4aa90',cx-doorW/2-10,h-3,doorW+20,3);
 const paneW=house?24:28,paneH=Math.max(17,Math.min(28,h-64));for(const xx of [house?15:22,w-(house?15:22)-paneW])windowPane(c,xx,Math.max(50,doorY+1),paneW,paneH,house);
 if(shop){for(let xx=13;xx<w-13;xx+=14){r(c,Math.floor(xx/14)%2?'#e4d6b7':'#7a9b83',xx,43,14,17);r(c,Math.floor(xx/14)%2?'#c8bda1':'#587660',xx,57,14,5)}r(c,'#705f49',12,61,4,h-68);r(c,'#705f49',w-16,61,4,h-68);r(c,'#b99b60',12,h-23,25,15);r(c,'#7e6d47',14,h-18,21,2)}
 if(dojo){r(c,'#78664b',cx-31,h-42,5,32);r(c,'#78664b',cx+26,h-42,5,32);r(c,'#9fa77b',cx-37,h-45,74,5)}
 if(b.label){r(c,P.ink,cx-50,43,100,15);r(c,'#efe7c6',cx-48,44,96,12);c.fillStyle='#405649';c.font='bold 8px monospace';c.textAlign='center';c.fillText(b.label,cx,53)}
 decor(c,b,w,h,cx,time||0,{house,gym,clinic,shop,lab,dojo,doorW,doorY,paneW,paneH,winY:Math.max(50,doorY+1),accent});
 if(region==='frost'){r(c,'#edf4e8',13,9,w-26,4);r(c,'#d4e7e4',-1,35,w+2,4)}else if(region==='forest'&&house){r(c,'#648950',7,63,3,h-73);r(c,'#89a66b',5,71,8,7)}
 c.restore();
}
return{draw,emblem};
})();
