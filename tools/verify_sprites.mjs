// Verify PMD framing and render the national catalog using the actual game renderer.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require(process.env.CANVAS_MODULE||'/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist'),sandbox={window:{}};
for(const name of ['sprites','species'])vm.runInNewContext(fs.readFileSync(path.join(dist,'assets',name+'.js'),'utf8'),sandbox);
const sprites=sandbox.window.SPRITES,data=sandbox.window.SPECIES_DATA,art=require('../dist/sprite-art.js')(sprites),coverage=JSON.parse(fs.readFileSync(path.join(dist,'assets/sprite-coverage.json')));
assert.equal(Object.keys(sprites).length,1025);assert.equal(coverage.pmdSpecies.length,984);assert.equal(coverage.flatSpecies.length,41);assert.deepEqual(coverage.errors,[]);
const seen=new Set();let definitions=0;
for(const [id,s]of Object.entries(sprites)){
 assert.ok(s.credit&&s.source,'Attribution #'+id);
 for(const group of [s.animations,s.formationLeader?.animations].filter(Boolean))for(const name of ['Idle','Walk','Attack','Shoot','Hurt','Sleep']){
  const m=group[name];assert.ok(m,'Animation '+id+'/'+name);definitions++;
  assert.ok(m.rows===1||m.rows===8);assert.ok(m.w>0&&m.h>0);assert.ok(m.durations.length&&m.durations.every(n=>n>0&&Number.isFinite(n)));
  assert.equal(m.anchors.length,m.rows);assert.equal(m.bounds.length,m.rows);
  for(let row=0;row<m.rows;row++){
   assert.equal(m.anchors[row].length,m.durations.length);assert.equal(m.bounds[row].length,m.durations.length);
   for(let index=0;index<m.durations.length;index++){
    assert.ok(m.anchors[row][index].every(Number.isFinite));const b=m.bounds[row][index];
    if(b)assert.ok(b.every(Number.isFinite)&&b[0]>=0&&b[1]>=0&&b[2]<=m.w&&b[3]<=m.h);
   }
  }
  if(!seen.has(m.file)){const png=fs.readFileSync(path.join(dist,m.file));assert.equal(png.readUInt32BE(16),m.w*m.durations.length,m.file+' width');assert.equal(png.readUInt32BE(20),m.h*m.rows,m.file+' height');seen.add(m.file)}
 }
}
if(process.env.SPRITE_BASELINE){const baseline=JSON.parse(fs.readFileSync(process.env.SPRITE_BASELINE));for(const[id,s]of Object.entries(baseline.manifest))assert.equal(JSON.stringify(sprites[id]),JSON.stringify(s),'Preserved metadata #'+id);for(const[file,sha]of Object.entries(baseline.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),sha,'Preserved file '+file);console.log('PASS: Kanto + #200 metadata and 2120 files unchanged')}
async function imagesFor(id,full=false){const result={};for(const group of [sprites[id].animations,sprites[id].formationLeader?.animations].filter(Boolean))for(const m of full?Object.values(group):[group.Idle])if(!result[m.file]){const im=await loadImage(path.join(dist,m.file));Object.defineProperty(im,'naturalWidth',{value:im.width});result[m.file]=im}return result}
// The original Kanto draw formula must produce identical pixels after renderer extraction.
function legacy(target,images,id,anim,dir,x,y,scale,time,alpha){const m=sprites[id].animations[anim],total=m.durations.reduce((a,b)=>a+b,0);let t=time%total,index=0;while(index<m.durations.length-1&&t>=m.durations[index]){t-=m.durations[index];index++}dir=m.rows===1?0:Math.max(0,Math.min(m.rows-1,(8-dir)%8));const anchor=m.anchors[dir][index]||[m.w/2,m.h/2];target.save();target.globalAlpha=alpha;target.imageSmoothingEnabled=false;target.drawImage(images[m.file],index*m.w,dir*m.h,m.w,m.h,Math.round(x-anchor[0]*scale),Math.round(y-anchor[1]*scale),m.w*scale,m.h*scale);target.restore()}
for(const id of [1,6,25,35,94,129,149,151,200]){const images=await imagesFor(id,true);for(const anim of Object.keys(sprites[id].animations))for(let dir=0;dir<8;dir++)for(const time of [0,.12,.43,1.2]){const a=createCanvas(192,192),b=createCanvas(192,192);legacy(a.getContext('2d'),images,id,anim,dir,96,110,1.75,time,.8);assert.ok(art.draw(b.getContext('2d'),images,id,anim,dir,96,110,1.75,time,.8));assert.deepEqual(a.toBuffer('image/png'),b.toBuffer('image/png'),'Kanto pixels '+id+'/'+anim+'/'+dir)}}
const out=process.env.QA_DIR||path.join(root,'qa');fs.mkdirSync(out,{recursive:true});
// Fit animated portraits to the union of every frame, including changing anchors.
for(let id=152;id<=1025;id++)if(id!==200){
 const p=art.portrait(id,0,true),b=p.bounds,zoom=64*.76/Math.max(b[2]-b[0],b[3]-b[1]),x=32-(b[0]+b[2])/2*zoom,y=32-(b[1]+b[3])/2*zoom,s=sprites[id];
 for(const unit of s.formation?art.units(0):[{x:0,y:0,scale:1}]){
  const m=(unit.leader?s.formationLeader:s).animations.Idle;
  for(let i=0;i<m.durations.length;i++){const box=m.bounds[0][i],a=m.anchors[0][i];if(!box)continue;const edges=[x+(unit.x+(box[0]-a[0])*unit.scale)*zoom,y+(unit.y+(box[1]-a[1])*unit.scale)*zoom,x+(unit.x+(box[2]-a[0])*unit.scale)*zoom,y+(unit.y+(box[3]-a[1])*unit.scale)*zoom];assert.ok(Math.min(...edges)>=0&&Math.max(...edges)<=64,'All Idle frames fit #'+id+'/'+i)}
 }
}
const leaf=createCanvas(6*64,64),leafCtx=leaf.getContext('2d'),leafImages=await imagesFor(152),leafBox=art.portrait(152,0,true).bounds,leafZoom=64*.76/Math.max(leafBox[2]-leafBox[0],leafBox[3]-leafBox[1]);let leafTime=0;
for(let i=0;i<6;i++){art.draw(leafCtx,leafImages,152,'Idle',0,i*64+32-(leafBox[0]+leafBox[2])/2*leafZoom,32-(leafBox[1]+leafBox[3])/2*leafZoom,leafZoom,leafTime+.001);leafTime+=sprites[152].animations.Idle.durations[i]}
fs.writeFileSync(path.join(out,'chikorita-idle.png'),leaf.toBuffer('image/png'));
const ranges=[[1,151],[152,251],[252,386],[387,493],[494,649],[650,721],[722,809],[810,905],[906,1025]];
for(let gen=0;gen<ranges.length;gen++){
 const[start,end]=ranges[gen],cell=96,canvas=createCanvas(cell*10,Math.ceil((end-start+1)/10)*cell),ctx=canvas.getContext('2d');ctx.fillStyle='#f3f1e8';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;
 for(let id=start;id<=end;id++){
  const x=(id-start)%10*cell,y=Math.floor((id-start)/10)*cell,images=await imagesFor(id),{bounds:b,anchor}=art.portrait(id),scale=65/Math.max(b[2]-b[0],b[3]-b[1]);
  ctx.fillStyle=coverage.flatSpecies.includes(id)?'#f5ddcf':'#e7ebdc';ctx.fillRect(x+2,y+2,92,92);
  assert.ok(art.draw(ctx,images,id,'Idle',0,x+48-(b[0]+b[2])/2*scale+anchor[0]*scale,y+39-(b[1]+b[3])/2*scale+anchor[1]*scale,scale));
  ctx.fillStyle='#284434';ctx.textAlign='center';ctx.font='9px sans-serif';ctx.fillText('#'+id+' '+data[id].name,x+48,y+85);
 }
 fs.writeFileSync(path.join(out,'sprites-gen-'+(gen+1)+'.png'),canvas.toBuffer('image/png'));
}
const samples=[152,155,158,252,387,495,650,722,810,906,909,912,870,1008,1025],sheet=createCanvas(8*100,samples.length*94),ctx=sheet.getContext('2d');ctx.fillStyle='#f3f1e8';ctx.fillRect(0,0,sheet.width,sheet.height);
for(let i=0;i<samples.length;i++){
 const id=samples[i],images=await imagesFor(id,true),m=sprites[id].animations.Walk;assert.equal(m.rows,8);assert.ok(m.durations.length>1);assert.ok(!m.proceduralMotion);
 for(let dir=0;dir<8;dir++){
  const a=createCanvas(140,140),b=createCanvas(140,140);art.draw(a.getContext('2d'),images,id,'Walk',dir,70,82,1.8,0);art.draw(b.getContext('2d'),images,id,'Walk',dir,70,82,1.8,m.durations[0]+.001);
  assert.notDeepEqual(a.toBuffer('image/png'),b.toBuffer('image/png'),'Distinct walking frames #'+id+'/'+dir);
  assert.equal(art.frame(id,'Walk',dir).row,(8-dir)%8);art.draw(ctx,images,id,'Walk',dir,50+dir*100,i*94+65,Math.min(2,68/art.extent(id)),.14);ctx.fillStyle='#284434';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('#'+id+' · '+dir,50+dir*100,i*94+86);
 }
}
assert.equal(art.units(0).filter(u=>u.leader).length,1);assert.equal(art.units(0).length,6);
const calls=[];art.draw({save(){},restore(){},drawImage(...a){calls.push(a)}},await imagesFor(870,true),870,'Walk',3,100,100,2,.2);
assert.equal(calls.length,6);assert.equal(new Set(calls.map(a=>a[0])).size,2,'Falinks draws Brass and Trooper');
fs.writeFileSync(path.join(out,'sprite-directions.png'),sheet.toBuffer('image/png'));
console.log('PASS: '+definitions+' definitions / '+seen.size+' PNGs; Kanto pixel parity; 1025 portraits; all new animated portraits fit every Idle frame; eight directions and distinct walking frames; Falinks 1+5 formation');
