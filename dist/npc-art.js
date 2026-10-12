// Original pixel NPCs: role-specific silhouettes, four views and an idle blink.
// A fixed foot anchor keeps their facing aligned with the trainer sight cone.
(()=>{
'use strict';
const W=32,H=44,cache=new Map();
const base={ink:'#293d3a',skin:'#e8bb93',skinLight:'#f6d6ac',skinShade:'#bb866a',hair:'#514436',hairLight:'#887052',coat:'#789689',light:'#b3c5a7',shade:'#4b6c64',accent:'#e0ba73',pants:'#4f6570',boot:'#51483e',white:'#f5edcf'};
const roles={
 shopping:{coat:'#7699b5',light:'#adccda',shade:'#456b85',hair:'#514436',accent:'#ead18d',prop:'bag'},
 professor:{coat:'#e3e7d5',light:'#fff4d9',shade:'#acbeb1',hair:'#c5c8b6',hairLight:'#f2ecd4',accent:'#7ba6a1',glasses:true,prop:'clipboard',longCoat:true},
 clinic:{coat:'#dc9c9a',light:'#f1c1b1',shade:'#ac6d7a',hair:'#8e5747',hairLight:'#bd8262',hat:'nurse',female:true,skirt:true,accent:'#b74b59'},
 academy:{coat:'#668fa2',light:'#a4c8cc',shade:'#476473',glasses:true,prop:'book',accent:'#d6bb75'},
 guild:{coat:'#9b83ad',light:'#c7b0cc',shade:'#685778',female:true,skirt:true,prop:'badge',hair:'#443c61',hairLight:'#77658e'},
 merchant:{coat:'#b69a64',light:'#e4ce96',shade:'#806846',hair:'#695145',hairLight:'#a78162',prop:'pouch',beard:true,hat:'cap',accent:'#d3b17c'},
 school:{coat:'#86ac76',light:'#c0d1a2',shade:'#547b57',prop:'book',hair:'#403e36',hairLight:'#767257',accent:'#deae79'},
 ranger:{coat:'#64855b',light:'#a6b97a',shade:'#405b46',hat:'brim',female:true,pack:true,accent:'#d0ad69'},
 waypoint:{coat:'#789aa5',light:'#b5d0cb',shade:'#4c6b79',hat:'cap',prop:'ticket',accent:'#e4d6a6'},
 rival:{coat:'#91677f',light:'#c59b9e',shade:'#604658',hair:'#3e3a48',hairLight:'#766370',accent:'#d39c61',prop:'ball'},
 explorer:{coat:'#9ba478',light:'#d5d5a5',shade:'#697d55',female:true,pack:true,accent:'#bc8655',hair:'#8c5d3c',hairLight:'#c99b65'},
 hiker:{coat:'#b48260',light:'#d9b57b',shade:'#805944',hat:'beanie',beard:true,pack:true,accent:'#b6bdb2',hair:'#67503c',hairLight:'#9b7850'},
 fisher:{coat:'#7f9eaa',light:'#b8d3cb',shade:'#506c7b',hat:'brim',prop:'rod',accent:'#c4b67c'},
 camper:{coat:'#ba9a76',light:'#ebcc99',shade:'#856c51',female:true,hat:'brim',pack:true,accent:'#d18b91',hair:'#685143',hairLight:'#a37f58'}
};
const gymColors={campina:['#9b9670','#d1c797','#686b53'],forest:['#6e9966','#b0ca88','#426649'],river:['#639aa9','#a7d5d2','#426978'],marsh:['#9980ad','#c6aed1','#615675'],dunes:['#bb9966','#e7cd93','#866b4b'],crater:['#b57257','#e1a776','#814f43'],coast:['#b4a45a','#e4d48e','#797441'],highlands:['#9c86b1','#d4b9d7','#665575'],frost:['#8aaebb','#cee5df','#5b7d91']};
function profile(person,region){
 let role=person.kind==='gym-guide'?'ranger':person.kind;
 if(role==='trainer')role=/Montañero/.test(person.label)?'hiker':/Pescador/.test(person.label)?'fisher':/Campista/.test(person.label)?'camper':'explorer';
 if(role==='gym'){
  const F=window.Frontera,district=F.districtBase?.(region)||region,generation=F.GENERATIONS?.[F.districtGeneration(region)],colors=(gymColors[district]||gymColors.campina).map(c=>generation&&generation.id!==1?F.generationColor(c,generation.color,.4):c);region=district;
  return{key:'gym:'+region+':'+(generation?.id||1),P:{...base,coat:colors[0],light:colors[1],shade:colors[2],female:['campina','river','marsh','highlands','frost'].includes(region),prop:'badge',longCoat:region==='frost',hair:region==='frost'?'#b6b3a9':region==='marsh'?'#594660':'#65503e',hairLight:region==='frost'?'#e2dcca':'#a0805d'}};
 }
 return{key:role,P:{...base,...(roles[role]||roles.school)}};
}
function paint(c,P,view,blink){
 const r=(color,x,y,w,h)=>{c.fillStyle=P[color]||color;c.fillRect(x,y,w,h)};
 const back=view===4,side=view===2;
 function pack(x,y,w=11){r('ink',x,y,w,14);r('shade',x+1,y+1,w-2,12);r('accent',x+2,y+1,w-4,4);r('coat',x+2,y+6,w-4,6);r('light',x+3,y+7,w-6,1);r('white',x+Math.floor(w/2),y+4,2,2)}
 function leg(x){r('ink',x,33,6,10);r('pants',x+1,33,4,7);r('light',x+1,33,1,5);r('boot',x,39,6,3);r('accent',x,39,4,1);r('ink',x-1,42,7,1)}
 function eye(x,y){r('ink',x,y,2,blink?1:3);if(!blink)r('white',x,y,1,1)}
 function hat(){
  if(P.hat==='nurse'){r('ink',10,3,13,7);r('white',11,4,11,5);if(!back){r('accent',15,4,3,5);r('accent',14,5,5,2)}}
  else if(P.hat){r('ink',10,2,13,9);r('shade',11,3,11,7);r('coat',12,3,9,5);r('light',12,3,7,2);if(P.hat==='beanie'){r('ink',10,9,13,3);r('accent',11,9,11,2);r('accent',16,1,3,2)}else{r('ink',P.hat==='brim'?6:side?5:8,10,P.hat==='brim'?21:side?17:18,2);r('accent',P.hat==='brim'?7:side?6:9,10,P.hat==='brim'?19:side?15:16,1);if(!back)r('white',15,6,3,2)}}
 }
 if(P.female){r('ink',9,8,16,18);r('hair',10,9,14,16);r('hairLight',11,12,2,10)}
 if(side&&P.pack)pack(21,20,8);
 leg(side?12:10);leg(side?17:18);
 // Arms and tailored clothes have a dark outline and two light/shadow tones.
 r('ink',side?10:7,22,5,12);r('shade',side?11:8,23,3,7);r('skinShade',side?11:8,30,3,3);
 if(!side){r('ink',23,22,5,12);r('coat',24,23,3,7);r('light',24,23,1,5);r('skin',24,30,3,3)}
 r('ink',10,20,14,P.longCoat?18:P.skirt?17:14);r('shade',11,21,12,P.longCoat?16:P.skirt?15:12);r('coat',12,21,10,P.longCoat?14:P.skirt?13:10);r('light',12,22,3,8);
 if(!back){r('white',15,21,4,10);r('shade',14,23,1,9);r('accent',15,21,4,2);r('ink',11,32,12,1);r('accent',16,32,2,1);if(P.longCoat){r('light',12,33,2,3);r('light',20,33,2,3)}}
 else{r('shade',16,22,1,10);r('light',12,29,9,1);if(P.pack)pack(12,20)}
 if(side){r('ink',18,23,5,11);r('coat',19,23,3,7);r('light',19,23,1,5);r('skin',19,30,3,3)}
 r('skinShade',14,18,5,3);r('skin',15,19,3,2);r('accent',12,20,11,2);
 // Heads are separately drawn for front, profile and back.
 r('ink',10,5,14,14);r('ink',12,18,10,2);r('hair',11,6,12,12);r('hairLight',12,7,9,2);
 if(back){r('hairLight',12,15,10,2);r('skinShade',12,18,10,1);if(P.female){r('ink',17,14,5,12);r('hair',18,15,3,10);r('hairLight',18,17,1,6);r('accent',18,15,3,2)}}
 else if(side){r('ink',8,10,4,8);r('ink',6,12,4,4);r('skinShade',9,10,10,9);r('skin',9,10,7,8);r('skinLight',9,10,5,4);r('skin',7,13,3,2);r('hair',17,9,5,5);r('hairLight',20,14,2,3);eye(10,12);r('skinShade',10,17,3,1);if(P.glasses){r('accent',9,11,5,5);r('ink',10,12,3,3);r('white',10,12,1,1);r('accent',14,12,6,1)}if(P.beard){r('hair',10,17,9,2);r('hairLight',11,17,4,1)}if(P.female){r('ink',22,12,4,14);r('hair',23,13,2,12);r('accent',23,14,2,2)}}
 else{r('skinShade',10,12,14,4);r('skin',12,9,10,10);r('skinLight',12,10,8,5);r('hair',11,8,12,3);r('hair',11,10,2,4);r('hair',21,10,2,4);eye(13,13);eye(19,13);r('skinShade',17,16,1,1);r('skinShade',15,18,4,1);if(P.glasses){r('accent',12,12,5,5);r('accent',18,12,5,5);r('ink',13,13,3,3);r('ink',19,13,3,3);r('white',13,13,1,1);r('white',19,13,1,1);r('accent',17,13,1,1)}if(P.beard){r('hair',12,17,10,3);r('hairLight',13,18,3,1);r('skin',16,17,3,1)}}
 hat();
 if(P.pack&&!back&&!side){r('shade',12,21,2,9);r('accent',12,23,1,5);r('shade',21,21,1,9)}
 if(!back&&P.prop){
  const x=side?8:22;
  if(P.prop==='book'||P.prop==='clipboard'){r('ink',x,26,8,11);r('accent',x+1,27,6,9);r('white',x+2,28,4,7);r('shade',x+2,29,3,1);r('shade',x+2,32,3,1);r('skin',x-1,29,2,4);if(P.prop==='clipboard')r('shade',x+3,26,3,2)}
  if(P.prop==='pouch'){r('ink',x-1,29,8,8);r('shade',x,30,6,6);r('accent',x+1,31,4,4);r('white',x+2,30,2,1)}
  if(P.prop==='rod'){r('ink',3,9,2,30);r('accent',3,14,1,24);r('white',4,10,3,1);r('white',6,11,1,11);r('accent',5,22,3,2);r('skin',3,29,3,3)}
  if(P.prop==='ticket'){r('ink',x,29,7,6);r('white',x+1,30,5,4);r('shade',x+2,31,3,1)}
  if(P.prop==='ball'){r('ink',x,29,6,6);r('#c37462',x+1,30,4,2);r('white',x+1,32,4,2);r('ink',x+2,31,2,2)}
  if(P.prop==='badge'){r('ink',side?13:20,25,4,5);r('accent',side?14:21,25,2,4);r('white',side?14:21,26,1,1)}
 }
}
function build(P){const sheet=document.createElement('canvas');sheet.width=W*2;sheet.height=H*4;const c=sheet.getContext('2d');for(let row=0;row<4;row++)for(let frame=0;frame<2;frame++){c.save();c.translate(frame*W,row*H);if(row===3){c.translate(W,0);c.scale(-1,1)}paint(c,P,row===3?2:row*2,frame===1);c.restore()}return sheet}
function draw(ctx,person,x,y,time=0,region='campina',reducedMotion=false){
 const{key,P}=profile(person,region);let sheet=cache.get(key);if(!sheet){sheet=build(P);cache.set(key,sheet)}
 const dir=((Math.round((person.dir||0)/2)%4)+4)%4;
 // Stagger blinks so the town does not blink in unison.
 const phase=time+key.length*.41,frame=!reducedMotion&&phase%5.2>5.02?1:0;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.fillStyle='#2444323b';ctx.fillRect(Math.round(x)-10,Math.round(y)-1,21,4);ctx.fillStyle='#24443220';ctx.fillRect(Math.round(x)-7,Math.round(y)-2,15,6);
 ctx.drawImage(sheet,frame*W,dir*H,W,H,Math.round(x)-16,Math.round(y)-42,W,H);ctx.restore();
}
window.NpcArt={draw};
})();
