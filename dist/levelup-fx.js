// Level-up celebration: sprite pop, particle burst, rolling level counter, stat gains, new techniques and points.
(function(){'use strict';
const COLORS=['#ffd86b','#8ee36b','#7fd8ff','#ff9ec4','#ffffff'];
const reduce=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const later=(fn,ms)=>typeof setTimeout==='function'?setTimeout(fn,ms):fn();
const setVar=(e,k,v)=>{if(e.style&&typeof e.style.setProperty==='function')e.style.setProperty(k,v)};
const add=(parent,...kids)=>{for(const k of kids)parent.append(k);return parent};
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function chime(env,notes){if(!env.tone)return;notes.forEach((n,i)=>later(()=>env.tone(n,.11),i*110))}
function render(panel,report,env={}){
 panel.innerHTML='';panel.classList.remove('hidden');
 const stage=el('div','lvl-stage'),ring=el('div','lvl-ring'),sprite=el('div','lvl-sprite');add(stage,ring,sprite);
 if(env.icon)env.icon(sprite,report.id,96);
 for(let i=0;i<22;i++){const p=el('i','lvl-spark'),a=i/22*Math.PI*2+Math.random()*.3,d=70+Math.random()*60;setVar(p,'--dx',Math.round(Math.cos(a)*d)+'px');setVar(p,'--dy',Math.round(Math.sin(a)*d)+'px');setVar(p,'--c',COLORS[i%COLORS.length]);setVar(p,'--delay',(Math.random()*.25).toFixed(2)+'s');add(stage,p)}
 const title=el('p','lvl-title','¡SUBE DE NIVEL!'),level=el('p','lvl-level');level.setAttribute('aria-label',report.name+' sube del nivel '+report.from+' al '+report.to);
 const label=el('span','',report.name+' · Nv. '),num=el('b','lvl-num',String(report.from));add(level,label,num);
 const roll=()=>{const total=report.to-report.from;if(reduce()||typeof requestAnimationFrame!=='function'||total<=0){num.textContent=String(report.to);return}let shown=report.from;const step=()=>{shown++;num.textContent=String(shown);num.classList.remove('bump');void num.offsetWidth;num.classList.add('bump');if(shown<report.to)later(step,Math.max(90,520/total))};later(step,500)};
 roll();
 const stats=el('div','lvl-stats');
 report.stats.forEach((s,i)=>{const gain=s.after-s.before;const row=el('div','lvl-stat'+(gain>0?' up':''));setVar(row,'--i',String(i));add(row,el('span','',s.label),el('em','',s.before+' → '+s.after),el('strong','',gain>0?'+'+gain:'='));add(stats,row)});
 const rewards=el('div','lvl-rewards');
 const chip=(text,cls)=>{const c=el('span','lvl-chip'+(cls?' '+cls:''),text);add(rewards,c);return c};
 if(report.pokemonPoints>0)chip('✦ +'+report.pokemonPoints+' punto'+(report.pokemonPoints>1?'s':'')+' de desarrollo');
 if(report.movePoints>0)chip('✦ +'+report.movePoints+' punto'+(report.movePoints>1?'s':'')+' de ataques');
 if(report.canEvolve)chip('⚡ ¡Puede evolucionar!','evo');
 add(panel,stage,title,level,stats,rewards);
 if(report.newMoves.length){
  const box=el('div','lvl-moves');add(box,el('p','lvl-moves-title','✦ Nuevas técnicas disponibles'));
  const list=el('div','lvl-movelist');
  report.newMoves.slice(0,6).forEach((m,i)=>{const b=el('span','lvl-move');setVar(b,'--i',String(i));add(b,el('small','','NUEVA'),el('b','',m.name),el('em','',(env.typeName?env.typeName(m.type):m.type)+' · Nv. '+m.level));add(list,b)});
  if(report.newMoves.length>6)add(list,el('span','lvl-move more','+'+(report.newMoves.length-6)+' más'));
  add(box,list);
  add(box,el('p','lvl-hint',report.needsDiscipline?'Para aprenderlas activa Disciplina en el árbol del Pokémon.':'Aprenderlas cuesta 1 punto de desarrollo y una prueba de memoria.'));
  if(env.openSkills){const go=el('button','secondary lvl-go','Ir a aprender técnicas');go.onclick=env.openSkills;add(box,go)}
  add(panel,box);
 }
 chime(env,report.newMoves.length?[523,659,784,1047,1319]:[523,659,784,1047]);
 return panel;
}
window.LevelUpFX={render};
})();
