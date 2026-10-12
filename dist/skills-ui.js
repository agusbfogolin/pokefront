// Progression menus share the live state; all purchases are saved immediately.
window.createSkillUI=function(api){
'use strict';
const F=window.Frontera,$=id=>document.getElementById(id),escape=api.escape;
let tab='trainer',index=0,type='electric',move='',learningPage=0;const practice=window.createLearningUI(api,out=>{if(out.passed)move=out.key;render()});
const titles={trainer:'Entrenador general',type:'Especialidad por tipo',pokemon:'Desarrollo del Pokémon',move:'Dominio de cada ataque'};
const notes={trainer:'Ganas un punto por cada nivel de entrenador y cada nivel exige más experiencia (50 XP al vencer, 40 al descubrir una región, 15 al investigar un tipo nuevo).',type:'Un solo fondo de puntos compartido por todos los tipos: tú eliges en cuál gastarlo. Se gana con la XP de todos los tipos y cada punto cuesta más que el anterior. Las filas altas piden XP de ese tipo.',pokemon:'Ganas 1 punto cada vez que el Pokémon sube de nivel peleando. Los Caramelos Raros y las capturas no dan puntos. Aprender una técnica cuesta 1 punto.',move:'Ganas 1 punto cada 2 subidas de nivel por combate, compartido por todos los ataques del Pokémon: con 1 punto mejoras un solo aspecto de un solo ataque. Las filas altas piden XP de práctica de ese ataque.'};
function subject(){return tab==='type'?type:tab==='trainer'?null:{index,move}}
function info(c,key){return F.moves({...c,progression:{...c.progression,loadout:[key,key,key]}})[0]}
function standing(s,c){
 const sub=subject(),earned=F.skillEarned(s,tab,sub),used=F.skillSpent(s,tab,sub);
 if(tab==='trainer'){const level=F.trainerLevel(s.trainer.xp);return'Nivel de entrenador '+level+' · '+Math.floor(s.trainer.xp)+' XP'+(level<99?' · siguiente nivel a los '+F.trainerXP(level+1)+' XP':'')+' · '+used+' de '+earned+' puntos gastados'}
 if(tab==='type'){const total=Object.values(s.trainer.types).reduce((n,p)=>n+p.xp,0);return F.TYPE[type][0]+': '+Math.floor(s.trainer.types[type].xp)+' XP · puntos compartidos: '+used+' de '+earned+' gastados · siguiente punto a los '+F.typeCost(earned+1)+' XP totales ('+Math.floor(total)+')'}
 if(tab==='pokemon')return'Nivel '+c.level+' · '+(c.progression.levelGain||0)+' subidas por combate · '+used+' de '+earned+' puntos gastados (incluye técnicas aprendidas)';
 return'Práctica de este ataque: '+Math.floor(c.progression.moves[move]?.xp||0)+' XP · puntos de ataques del Pokémon: '+used+' de '+earned+' gastados'
}
function render(){
 const s=F.ensureProgress(api.state()),locked=!!api.battle();index=F.clamp(index,0,s.team.length-1);const c=s.team[index],p=c.progression;type=F.typeIds.includes(type)?type:F.typeIds[0];if(!p.learned.includes(move))move=p.learned[0];
 $('skillTitle').textContent=titles[tab];$('skillNote').textContent=notes[tab];$('skillLock').textContent=locked?'Termina el combate para gastar puntos, aprender o equipar.':'Los puntos de habilidad son independientes del entrenamiento de estadísticas. No hay reasignación: elige con cuidado.';
 for(const b of document.querySelectorAll('[data-skilltab]')){const selected=b.dataset.skilltab===tab;b.classList.toggle('selected',selected);b.setAttribute('aria-selected',String(selected))}
 $('skillPokemonLabel').classList.toggle('hidden',tab==='trainer'||tab==='type');$('skillTypeLabel').classList.toggle('hidden',tab!=='type');$('skillMoveLabel').classList.toggle('hidden',tab!=='move');
 $('skillPokemon').innerHTML=s.team.map((c,i)=>'<option value="'+i+'">'+escape(F.DATA[c.id].name)+' · Nv. '+c.level+' · #'+(i+1)+'</option>').join('');$('skillPokemon').value=String(index);
 $('skillType').innerHTML=F.typeIds.map(t=>'<option value="'+t+'">'+F.TYPE[t][0]+' · '+Math.floor(s.trainer.types[t].xp)+' XP</option>').join('');$('skillType').value=type;
 $('skillMove').innerHTML=p.learned.map(k=>'<option value="'+k+'">'+escape(info(c,k).name)+(p.loadout.includes(k)?' · equipado':'')+'</option>').join('');$('skillMove').value=move;
 const sub=subject(),tree=F.skillTree(s,tab,sub);$('skillChoice').textContent='Cada rango cuesta 1 punto. Las habilidades piden nivel o experiencia (fila) y rangos en habilidades anteriores. Mayúsculas + clic gasta hasta 5 puntos seguidos.';
 $('skillPoints').textContent=F.skillPoints(s,tab,sub)+' puntos disponibles';$('skillXP').textContent=standing(s,c);
 renderTree(s,tree,locked);
 for(const b of document.querySelectorAll('[data-skill]'))b.onclick=e=>{if(api.battle())return;let bought=0;for(let i=0;i<(e.shiftKey?5:1);i++){if(!F.buySkill(api.state(),tab,subject(),b.dataset.skill))break;bought++}if(bought){api.save();api.refresh();render();api.toast('Habilidad mejorada.')}};
 $('skillLoadout').classList.toggle('hidden',tab!=='move');$('skillLearning').classList.toggle('hidden',tab!=='pokemon');$('skillSubject').innerHTML='';
 if(tab==='pokemon'||tab==='move'){api.icon($('skillSubject'),c.id,64);const text=document.createElement('div');text.innerHTML='<b>'+escape(F.DATA[c.id].name)+'</b><small>'+(tab==='move'?escape(info(c,move).description)+(move==='transform'?' Las mejoras de Transformación se aplican a las cuatro técnicas copiadas durante la pelea.':''):'Los puntos de desarrollo se ganan al subir de nivel peleando y se gastan en este árbol o en aprender técnicas.')+'</small>';$('skillSubject').append(text)}
 if(tab==='move')renderLoadout(c,locked);if(tab==='pokemon')renderLearning(c,locked);
}
function renderTree(s,tree,locked){
 const nodes=F.TREES[tab],access=F.skillAccess(s,tab,subject()),cols=F.SKILL_COLUMNS[tab],byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
 $('skillProgression').innerHTML='<p>'+escape(access.label)+(access.tier<6?' · Próxima fila: '+escape(access.next):' · Todas las filas abiertas')+'.</p>';
 function card(n){const r=F.skillRank(tree,n.id),can=F.canBuySkill(s,tab,subject(),n.id),total=n.parts.map(x=>x[0]+({'%':v=>(Math.round(v*1000)/10).toString().replace('.',','),s:v=>String(Math.round(v*100)/100).replace('.',','),px:v=>String(v),pt:v=>String(v)})[x[2]](x[1]*r)+({'%':' %',s:' s',px:' px',pt:' pt'})[x[2]]+' '+x[3]).join(' · ');
  const needs=n.requires.length?'Requiere: '+n.requires.map(q=>escape(byId[q.id].name)+' '+q.rank).join(', '):'Sin requisitos';
  return '<button data-skill="'+n.id+'" data-skill-tier="'+n.tier+'" class="skillnode d2node '+(r?'learned ':'')+(r>=n.max?'maxed ':'')+(can.tierLocked?'tierlocked ':'')+(can.prereqLocked?'prereqlocked ':'')+(can.ok?'available':'')+'" '+(locked||!can.ok?'disabled':'')+'><span class="noderank">'+r+' / '+n.max+'</span><span class="nodecol">'+escape(cols[n.col])+'</span><strong>'+escape(n.name)+'</strong><small>'+escape(n.description)+'</small>'+(r?'<span class="nodenow">Ahora: '+escape(total)+'</span>':'')+'<span class="skillorigin">'+needs+'</span><em>'+(locked?'Disponible al terminar':escape(can.reason))+'</em></button>';}
 let html='<div class="d2tree"><div class="d2corner"></div>'+cols.map(name=>'<h3 class="d2col">'+escape(name)+'</h3>').join('');
 for(let t=1;t<=6;t++){html+='<div class="d2tier '+(t<=access.tier?'open':'closed')+'"><b>Fila '+t+'</b><small>'+escape(access.requirements[t])+'</small></div>';for(let col=0;col<3;col++){const n=nodes.find(n=>n.tier===t&&n.col===col);html+=n?card(n):'<div class="d2empty"></div>'}}
 $('skillTree').innerHTML=html+'</div>';
}
function renderLoadout(c,locked){
 const p=c.progression,slots=Array.from({length:F.isFinal(c)?5:4},(_,slot)=>slot===4?p.ultimate:p.loadout[slot]);$('equippedMoves').innerHTML=slots.map((key,slot)=>'<label>'+(slot===4?'5 · Definitiva (1 uso)':'Técnica '+(slot+1))+'<select data-equip="'+slot+'" '+(locked||slot>p.loadout.length&&slot<4?'disabled':'')+'>'+(!key?'<option value="" selected disabled>Sin aprender</option>':'')+p.learned.map(k=>'<option value="'+k+'" '+(k===key?'selected':'')+'>'+escape(info(c,k).name)+'</option>').join('')+'</select></label>').join('');
 for(const select of document.querySelectorAll('[data-equip]')){select.value=slots[Number(select.dataset.equip)];select.onchange=()=>{if(!api.battle()&&F.equipMove(api.state(),index,Number(select.dataset.equip),select.value)){api.save();api.refresh();api.toast('Técnica equipada.')}else api.toast('Cada técnica debe ocupar una sola casilla regular.');render()}}
 const m=info(c,move);$('moveDetails').textContent=m.name+' · '+F.TYPE[m.type][0]+' · '+m.cost+' stamina · '+m.cooldown+' s de recarga'+(m.power?' · Potencia de arena '+Number(m.power.toFixed(1)):'')+(m.duration?' · Estado '+Number(m.duration.toFixed(1))+' s':'')+(F.isFinal(c)?' · La definitiva conserva su uso al cambiar de compañero.':' · Evoluciona hasta la última etapa para habilitar la definitiva.');
}
function renderLearning(c,locked){
 const p=c.progression,legal=F.learnCatalog(c),scope=$('learningScope').value||'compatible',query=$('learningSearch').value.trim().toLocaleLowerCase('es'),filter=$('learningType').value;
 const unique=new Map();for(const[key,m]of Object.entries(F.MOVE_DATA))if(!unique.has(m.id))unique.set(m.id,{key,level:1,cost:1});
 let list=(scope==='all'?[...unique.values()].map(e=>legal.find(v=>v.key===e.key)||e):legal).filter(e=>{const m=F.MOVE_DATA[e.key];return(!query||m.name.toLocaleLowerCase('es').includes(query)||e.key.includes(query))&&(!filter||m.type===filter)&&(scope!=='ready'||F.canLearnMove(api.state(),index,e.key).ok)});
 const next=legal.find(e=>e.method==='level'&&!p.learned.includes(e.key));learningPage=F.clamp(learningPage,0,Math.max(0,Math.ceil(list.length/24)-1));$('learningCount').textContent=p.loadout.length+' / 4 técnicas equipadas. '+(next?'Por nivel: '+F.MOVE_DATA[next.key].name+' · Nv. '+next.level+'. ':'')+list.length+' movimientos · '+legal.length+' compatibles con '+F.DATA[c.id].name+' · '+unique.size+' en el catálogo. Aprende con la prueba; al llenar cuatro espacios elige qué técnica reemplazar.';
 $('learningList').innerHTML=list.slice(learningPage*24,learningPage*24+24).map(e=>{const known=p.learned.includes(e.key),can=F.canLearnMove(api.state(),index,e.key),ready=!locked&&can.ok,m=info(c,e.key);return '<div class="learncard"><div><b>'+escape(m.name)+'</b><small>'+F.TYPE[m.type][0]+' · '+(m.power?'Ataque':'Estado')+(m.generation?' · Gen. '+m.generation:'')+' · '+(legal.some(v=>v.key===e.key)?(e.method==='level'?'Por nivel · ':'Entrenamiento · ')+'Nv. '+e.level:'Técnica especial / no compatible')+'</small><p>'+escape(m.description)+'</p></div><button class="secondary" data-learn="'+e.key+'" '+(!ready?'disabled':'')+'>'+(known?'Aprendida':locked?'En combate':escape(can.reason))+'</button></div>'}).join('')||'<p>No hay movimientos con estos filtros.</p>';
 $('learningPage').textContent=(learningPage+1)+' / '+Math.max(1,Math.ceil(list.length/24));$('learningPrev').disabled=learningPage===0;$('learningNext').disabled=(learningPage+1)*24>=list.length;
 for(const b of document.querySelectorAll('[data-learn]'))b.onclick=()=>{if(!api.battle())practice.open(index,b.dataset.learn)};
}
$('learningType').innerHTML='<option value="">Todos</option>'+[...F.typeIds,'shadow'].map(t=>'<option value="'+t+'">'+F.TYPE[t][0]+'</option>').join('');
for(const id of ['learningSearch','learningScope','learningType'])$(id)[id==='learningSearch'?'oninput':'onchange']=()=>{learningPage=0;render()};$('learningPrev').onclick=()=>{learningPage--;render()};$('learningNext').onclick=()=>{learningPage++;render()};
function open(which='trainer'){if(api.battle()?.result)return;tab=which;index=api.state().active;type=F.DATA[api.state().team[index].id].types[0];move='';render();api.openDialog('skillsDialog')}
function map(){if(api.worldMap)return api.worldMap();
 const s=api.state();$('mapCanvas').innerHTML='';const canvas=document.createElement('canvas');canvas.width=600;canvas.height=440;canvas.setAttribute('aria-label','Mapa de las nueve regiones, Ciudad Brote y tu posición.');$('mapCanvas').append(canvas);const ctx=canvas.getContext('2d'),scale=3/64,center={x:300,y:220},range=600/scale;
 for(let y=0;y<440;y+=8)for(let x=0;x<600;x+=8){const r=F.regionAt((x+4-center.x)/scale,(y+4-center.y)/scale,s.seed);ctx.fillStyle=r.color;ctx.fillRect(x,y,8,8)}
 ctx.strokeStyle='#eff0d080';ctx.lineWidth=1;for(const [dx,dy] of [[1,0],[0,1],[1,1],[1,-1]]){ctx.beginPath();ctx.moveTo(center.x-dx*range*scale,center.y-dy*range*scale);ctx.lineTo(center.x+dx*range*scale,center.y+dy*range*scale);ctx.stroke()}
 const b=F.TOWN.bounds;ctx.fillStyle='#e9e5ca';ctx.fillRect(center.x+b.left*scale,center.y+b.top*scale,(b.right-b.left)*scale,(b.bottom-b.top)*scale);ctx.fillStyle='#223d32';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText('Ciudad Brote',300,220);
 const markers=[['forest',138,73],['highlands',300,38],['frost',472,73],['river',94,213],['coast',510,213],['marsh',132,355],['dunes',300,401],['crater',468,355]];ctx.font='bold 12px sans-serif';for(const [id,x,y] of markers){ctx.fillStyle='#173c31';ctx.fillText(F.REGIONS[id].name,x,y)}
 const x=F.clamp(center.x+s.player.x*scale,8,592),y=F.clamp(center.y+s.player.y*scale,8,432);ctx.fillStyle='#183c31';ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f7f4d7';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#faf4d6';ctx.font='bold 10px sans-serif';ctx.fillText('TÚ',x,F.clamp(y-12,12,428));
 $('mapPosition').textContent='Estás en '+(F.inTown(s.player.x,s.player.y)?F.TOWN.name:F.regionAt(s.player.x,s.player.y,s.seed).name)+' · '+Math.floor(s.player.x/32)+', '+Math.floor(s.player.y/32)+'. Los caminos salen de Brote en las ocho direcciones.';
 $('regionList').innerHTML=Object.entries(F.REGIONS).map(([id,r])=>'<div class="regioncard"><span class="regionswatch" style="background:'+r.color+'"></span><div><b>'+r.name+'</b><small>'+r.direction+' · '+r.species.length+' especies · '+(s.visitedRegions?.[id]?'Descubierta':'Por explorar')+'</small><p>'+r.description+'</p></div></div>').join('');
 api.openDialog('mapDialog');return canvas;
}
$('skillPokemon').onchange=()=>{index=Number($('skillPokemon').value);move='';render()};$('skillType').onchange=()=>{type=$('skillType').value;render()};$('skillMove').onchange=()=>{move=$('skillMove').value;render()};for(const b of document.querySelectorAll('[data-skilltab]'))b.onclick=()=>{tab=b.dataset.skilltab;render()};
return{open,render,map};
};
