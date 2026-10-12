// Evolution cinematic "Resonancia": rune ring that fills with the Pokémon's type colours, converging motes,
// silhouette flicker between the old and the new shape, a heartbeat the player can tap to, and a cancel
// button that works right up to the instant of the change. Nothing is spent until commit() is called.
(function(){'use strict';
const COLORS=['#ffd86b','#ffffff','#7fd8ff','#ff9ec4','#8ee36b'];
const RUNES=12,BEAT=650;
const reduce=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const setVar=(e,k,v)=>{if(e.style&&typeof e.style.setProperty==='function')e.style.setProperty(k,v)};
const add=(parent,...kids)=>{for(const k of kids)parent.append(k);return parent};
const lerp=(a,b,t)=>a+(b-a)*t;
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}

function play(host,o){
 const quick=reduce(),T={charge:quick?600:1500,morph:quick?900:3000};
 const timers=new Set();
 const later=(fn,ms)=>{if(typeof setTimeout!=='function'){fn();return 0}const id=setTimeout(()=>{timers.delete(id);fn()},ms);timers.add(id);return id};
 const clearAll=()=>{if(typeof clearTimeout==='function')for(const id of timers)clearTimeout(id);timers.clear()};
 const tone=(f,l)=>{if(o.tone)try{o.tone(Math.round(f),l)}catch{}};
 const now=()=>Date.now();
 let phase='charge',morphAt=0,syncs=0,taps=0,returned=false,before=null;
 const colors=o.colors&&o.colors.length?o.colors:['#ffd86b','#7fd8ff'];

 host.innerHTML='';
 const root=el('div','evo charge');setVar(root,'--a',colors[0]);setVar(root,'--b',colors[1]||colors[0]);
 const stage=el('div','evo-stage'),aura=el('div','evo-aura'),core=el('div','evo-core');
 const ringA=el('div','evo-ring evo-ring-a'),ringB=el('div','evo-ring evo-ring-b');
 const runes=[];
 for(let i=0;i<RUNES;i++){const r=el('i','evo-rune');setVar(r,'--ang',Math.round(i/RUNES*360)+'deg');add(ringA,r);runes.push(r)}
 const motes=[];
 for(let i=0;i<20;i++){const m=el('i','evo-mote'),a=i/20*Math.PI*2+Math.random()*.4,d=120+Math.random()*50;setVar(m,'--sx',Math.round(Math.cos(a)*d)+'px');setVar(m,'--sy',Math.round(Math.sin(a)*d)+'px');setVar(m,'--c',COLORS[i%COLORS.length]);setVar(m,'--delay',(Math.random()*1.2).toFixed(2)+'s');add(stage,m);motes.push(m)}
 const oldW=el('div','evo-sprite evo-old'),newW=el('div','evo-sprite evo-ghost off');
 if(o.icon){o.icon(oldW,o.fromId,112);o.icon(newW,o.toId,112)}
 const flash=el('div','evo-flash');
 add(stage,aura,ringB,ringA,core,oldW,newW,flash);
 const title=el('p','evo-title','¡'+o.fromName+' está evolucionando!'),sub=el('p','evo-sub','Algo cambia en su interior…');
 const bar=el('div','evo-bar'),fill=el('i');add(bar,fill);
 const tip=el('p','evo-tip','Toca la luz al ritmo del latido, solo por diversión.');
 const body=el('div','evo-body');
 const cancel=el('button','secondary evo-cancel','Cancelar evolución'),note=el('p','evo-note','Puedes cancelar hasta el último instante: no se gasta nada.');
 add(root,stage,title,sub,bar,tip,body,cancel,note);
 add(host,root);

 const setPhase=p=>{phase=p;for(const c of ['charge','morph','reveal','fizzle','failed'])root.classList.remove(c);root.classList.add(p==='done'?'reveal':p==='cancelled'?'fizzle':p)};
 const running=()=>phase==='charge'||phase==='morph';
 const progress=()=>phase==='charge'?0:Math.max(0,Math.min(1,(now()-morphAt)/T.morph));
 const lightRunes=p=>{const n=Math.round(p*RUNES);runes.forEach((r,i)=>r.classList.toggle('on',i<n))};

 // Tapping the stage sends a ripple; if it lands on the heartbeat it shines brighter. Purely cosmetic.
 stage.onclick=()=>{
  if(!running())return;
  taps++;const off=(now()-t0)%BEAT,d=Math.min(off,BEAT-off),perfect=d<140;
  const rip=el('i','evo-ripple'+(perfect?' perfect':''));add(stage,rip);later(()=>rip.remove&&rip.remove(),800);
  if(perfect){syncs++;sub.textContent='¡Sintonía! ×'+syncs;tone(660+syncs*40,.09)}else tone(400,.05);
 };
 const t0=now();

 function lockUI(){cancel.disabled=true;cancel.classList.add('hidden');note.classList.add('hidden');tip.classList.add('hidden')}

 function morph(){
  if(!running())return;
  setPhase('morph');morphAt=now();title.textContent=o.fromName+' se transforma…';sub.textContent='Su forma cambia entre dos siluetas.';
  let shown=false;
  const flick=()=>{
   if(phase!=='morph')return;
   const p=progress();
   if(quick){oldW.classList.toggle('off',p>.5);newW.classList.toggle('off',p<=.5)}
   else{shown=!shown;oldW.classList.toggle('off',shown);newW.classList.toggle('off',!shown);
    const lit=p>.55;oldW.classList.toggle('lit',lit);newW.classList.toggle('lit',lit);
    later(flick,Math.round(lerp(380,55,Math.pow(p,.8))))}
  };
  const tick=()=>{
   if(phase!=='morph')return;
   const p=progress();fill.style.width=Math.round(p*100)+'%';lightRunes(p);tone(300+p*820,.07);
   root.classList.toggle('late',p>.7);
   if(p>=1){commitNow();return}
   later(tick,quick?150:240);
  };
  flick();tick();
 }

 function commitNow(){
  if(!running())return;
  lockUI();clearAll();
  before=o.values?o.values():null;
  let ok=false;try{ok=!!o.commit()}catch{ok=false}
  if(!ok){setPhase('failed');title.textContent='No se pudo completar la evolución';sub.textContent='Nada cambió y no se gastó nada.';
   const back=el('button','primary','Volver');back.onclick=()=>finish('fail');add(body,back);tone(220,.2);return}
  setPhase('done');fill.style.width='100%';lightRunes(1);
  // Real new sprite replaces both silhouettes.
  oldW.remove&&oldW.remove();newW.remove&&newW.remove();
  const real=el('div','evo-sprite evo-final');if(o.icon)o.icon(real,o.toId,128);add(stage,real);
  for(let i=0;i<30;i++){const s=el('i','evo-spark'),a=i/30*Math.PI*2+Math.random()*.3,d=80+Math.random()*80;setVar(s,'--dx',Math.round(Math.cos(a)*d)+'px');setVar(s,'--dy',Math.round(Math.sin(a)*d)+'px');setVar(s,'--c',COLORS[i%COLORS.length]);setVar(s,'--delay',(Math.random()*.3).toFixed(2)+'s');add(stage,s)}
  add(stage,el('i','evo-shock'),el('i','evo-shock s2'));
  title.textContent='¡'+o.fromName+' evolucionó en '+o.toName+'!';
  sub.textContent=syncs>0?'Sintonía perfecta ×'+syncs+' ✦':'Un nuevo capítulo comienza.';
  const after=o.values?o.values():null;
  if(before&&after){
   const stats=el('div','evo-stats');
   (o.labels||[]).forEach((label,i)=>{const gain=after[i]-before[i],row=el('div','evo-stat'+(gain>0?' up':''));setVar(row,'--i',String(i));add(row,el('span','',label),el('em','',before[i]+' → '+after[i]),el('strong','',gain>0?'+'+gain:gain<0?String(gain):'='));add(stats,row)});
   add(body,stats);
  }
  const go=el('button','primary evo-done','Continuar');go.onclick=()=>finish('done');add(body,go);
  [523,659,784,1047,1319,1568].forEach((n,i)=>later(()=>tone(n,.13),i*120));
  later(()=>go.focus&&go.focus(),50);
 }

 function finish(kind){
  if(returned)return;returned=true;clearAll();
  if(kind==='done'){o.onDone&&o.onDone()}else{o.onCancel&&o.onCancel(kind)}
 }

 const ctl={
  get phase(){return phase},
  get taps(){return taps},
  get syncs(){return syncs},
  // Returns true when the evolution was stopped (only possible before the instant of the change).
  cancel(){
   if(!running())return false;
   clearAll();lockUI();setPhase('cancelled');
   oldW.classList.remove('off','lit');newW.classList.add('off');
   title.textContent=o.fromName+' dejó de evolucionar';sub.textContent='Sigue siendo '+o.fromName+'. No se gastó nada.';
   [660,520,392,294].forEach((n,i)=>later(()=>tone(n,.1),i*90));
   const back=el('button','primary','Volver a las opciones');back.onclick=()=>finish('cancel');add(body,back);
   later(()=>back.focus&&back.focus(),30);
   later(()=>finish('cancel'),quick?900:1700);
   return true;
  },
  // Skip straight to the change (used by tests and by the "Saltar" shortcut).
  force(){if(running())commitNow()},
  destroy(){clearAll();returned=true}
 };
 cancel.onclick=()=>ctl.cancel();

 // Opening beat.
 tone(330,.1);later(()=>tone(392,.1),160);
 later(morph,T.charge);
 later(()=>cancel.focus&&cancel.focus(),40);
 return ctl;
}
window.EvolutionFX={play};
})();
