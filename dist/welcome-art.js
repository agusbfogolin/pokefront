// Original pixel landscape for the title screen. Drawn locally, like the world.
window.WelcomeArt={draw(canvas,avatar){
 const c=canvas.getContext('2d');c.save();c.clearRect(0,0,canvas.width,canvas.height);c.scale(canvas.width/320,canvas.height/240);c.imageSmoothingEnabled=false;
 const rect=(color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};
 const poly=(color,points)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
 rect('#d8e5cb',0,0,320,240);rect('#e8ebcf',0,90,320,40);
 rect('#eedaa1',223,26,28,28);rect('#f4e6bb',219,34,36,13);
 for(const [x,y] of [[30,28],[129,47],[272,69]]){rect('#f3f2db',x,y,38,5);rect('#f3f2db',x+8,y-4,20,4)}
 poly('#a6bcaa',[[0,114],[0,85],[37,47],[80,99],[119,67],[169,122],[216,62],[259,104],[288,75],[320,104],[320,140]]);
 poly('#849f8b',[[0,124],[30,107],[68,116],[104,80],[162,133],[206,92],[249,123],[287,99],[320,111],[320,149]]);
 poly('#5f816d',[[0,126],[32,112],[70,131],[130,112],[173,135],[228,107],[268,130],[320,118],[320,162],[0,162]]);
 rect('#90a96f',0,145,320,95);
 poly('#b9c389',[[0,169],[77,157],[126,175],[221,156],[320,170],[320,194],[213,180],[98,194],[0,190]]);
 poly('#c6b991',[[154,151],[161,151],[168,160],[157,170],[188,188],[173,201],[166,216],[194,240],[136,240],[146,216],[160,198],[139,184],[144,169],[158,160]]);
 poly('#ddd0a4',[[157,154],[160,154],[162,159],[152,170],[178,188],[165,200],[155,215],[175,240],[145,240],[151,216],[160,200],[146,185],[147,170],[161,160]]);
 function house(x,y,roof){rect('#587260',x+2,y+6,30,22);rect('#d9d8b2',x+4,y+10,26,16);rect(roof,x,y,34,10);rect('#e8d8a1',x+4,y-3,26,4);rect('#456956',x+14,y+17,6,10);rect('#a1bdac',x+6,y+14,5,5);rect('#a1bdac',x+23,y+14,5,5)}
 house(123,117,'#a78067');house(174,121,'#768b78');rect('#566d58',160,139,2,19);rect('#dbd2aa',154,141,14,5);
 function tree(x,y,size){rect('#576c45',x-2,y-12,4,13);for(let i=0;i<3;i++){const w=size*(.6+i*.25);poly(i===2?'#41614c':'#54785b',[[x,y-size+4+i*size*.24],[x-w/2,y-13+i*3],[x+w/2,y-13+i*3]])}rect('#789263',x-2,y-size+9,3,size*.3)}
 for(const [x,y,s] of [[15,173,45],[43,161,35],[89,174,29],[241,158,29],[287,174,41],[311,182,51]])tree(x,y,s);
 for(let i=0;i<40;i++){const x=(i*73+11)%320,y=171+(i*29)%69;if(x>125&&x<190)continue;rect(i%4?'#779a62':'#e1c98c',x,y,2,2);if(i%5===0)rect('#536f4e',x+1,y+2,1,3)}
 rect('#697c56',72,193,3,22);rect('#dcc69b',59,190,30,15);rect('#7d906a',62,193,24,2);rect('#aa7659',66,198,16,2);
 c.save();c.translate(211,230);c.scale(2,2);window.TrainerArt.draw(c,0,0,avatar==='female'?7:1,0,false,0,true,avatar);c.restore();
 // Small grass patches frame the foreground without obscuring the path.
 poly('#4e7654',[[0,232],[17,208],[19,220],[29,215],[24,236],[43,225],[39,240],[0,240]]);
 poly('#4e7654',[[275,240],[283,219],[289,232],[301,215],[306,229],[319,210],[320,240]]);
 c.restore();
}};
