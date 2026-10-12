// Code-native small trees, cracked/pushable rocks, waves and cave lighting.
window.FieldArt={
obstacle(c,x,y,t){const r=(color,dx,dy,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x+dx),Math.round(y+dy),w,h)};
 r('#27443130',-12,-2,25,6);
 if(t.fieldMove==='cut'){c.save();c.translate(x,y);c.scale(1.3,1.45);x=0;y=0;r('#594d3b',-3,-15,6,15);r('#355a43',-12,-27,24,18);r('#355a43',-8,-32,16,7);r('#759955',-10,-25,17,11);r('#a6bb76',-5,-29,10,7);r('#bc9b6b',-2,-10,3,8);r('#eedca6',-9,-18,3,3);c.restore();return}
 r('#40574e',-13,-20,27,19);r(t.fieldMove==='strength'?'#839b99':'#918c76',-12,-23,24,20);r(t.fieldMove==='strength'?'#bfcdba':'#c2b992',-9,-25,17,8);r('#5c756b',7,-18,6,15);
 if(t.fieldMove==='strength'){r('#e4e7c7',-5,-16,10,3);r('#e4e7c7',-5,-9,10,3);r('#607a70',-7,-22,2,16)}else{r('#594f44',-2,-23,3,9);r('#594f44',-5,-15,5,3);r('#594f44',-5,-14,2,7);r('#594f44',-2,-8,8,2)}
},
waterfall(c,x,y,time){c.fillStyle='#5b899a';c.fillRect(x,y,32,32);c.fillStyle='#b5dedc';for(let i=0;i<5;i++){const sy=(i*9+Math.floor(time*15))%32;c.fillRect(x+3,sy+y,26,2)}c.fillStyle='#e2eedd';c.fillRect(x,y+1,32,3);c.fillRect(x+2,y+27,28,4);c.fillStyle='#416e80';c.fillRect(x,y,2,32);c.fillRect(x+30,y,2,32)},
surf(c,x,y,time){c.save();c.fillStyle='#355f6e50';c.beginPath();c.ellipse(x,y+4,24,9,0,0,Math.PI*2);c.fill();c.strokeStyle='#d1e7d6';c.lineWidth=2;c.beginPath();c.ellipse(x,y+6,23+Math.sin(time*3),7,0,.2,Math.PI*.85);c.stroke();c.beginPath();c.ellipse(x,y+7,16,5,0,Math.PI*1.1,Math.PI*1.8);c.stroke();c.restore()},
darkness(c,w,h){const g=c.createRadialGradient(w/2,h/2,75,w/2,h/2,240);g.addColorStop(0,'#101d2200');g.addColorStop(.4,'#101d2225');g.addColorStop(1,'#101d22ec');c.fillStyle=g;c.fillRect(0,0,w,h)}
};
