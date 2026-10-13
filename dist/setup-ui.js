// Pantalla «¿Cómo quieres jugar?»: modo de juego, duración y semilla antes de conocer al profesor.
window.SetupUI={
 mode:'classic',
 mount(){
  const F=window.Frontera,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const card=(group,def,extra)=>'<button type="button" role="radio" class="setup-card setup-'+group+'" data-'+group+'="'+def.id+'" aria-checked="false"><i aria-hidden="true">'+def.icon+'</i><span><b>'+esc(def.name)+'</b><small>'+esc(extra)+'</small></span></button>';
  $('setupModes').innerHTML=Object.values(F.GAME_MODES).map(m=>card('mode',m,m.tag)).join('');
  $('setupPaces').innerHTML=Object.values(F.GAME_PACES).map(p=>card('pace',p,p.need?p.need+(p.need===1?' gimnasio':' gimnasios')+' por región':'Tú decides')).join('');
  window.PaceControls.mount($('welcomeCustom'));
  const render=()=>{const mode=F.GAME_MODES[this.mode],pace=$('welcomePace').value,p=F.GAME_PACES[pace];
   for(const b of document.querySelectorAll('#setupModes .setup-card')){const on=b.dataset.mode===this.mode;b.classList.toggle('selected',on);b.setAttribute('aria-checked',String(on))}
   for(const b of document.querySelectorAll('#setupPaces .setup-card')){const on=b.dataset.pace===pace;b.classList.toggle('selected',on);b.setAttribute('aria-checked',String(on))}
   $('setupModeRules').innerHTML='<p>'+esc(mode.copy)+'</p><ul>'+mode.rules.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul>';
   $('welcomeCustom').classList.toggle('hidden',pace!=='custom');
   let total=p.need?p.need*9:null;if(pace==='custom'){const c=window.PaceControls.read($('welcomeCustom'));total=c.gens.length*c.need}
   $('setupSummary').innerHTML='<b>'+esc(mode.name)+'</b> · '+esc(p.name)+' · '+(total?total+' medallas para completar la campaña':'')+(this.mode==='free'?' · todas las regiones abiertas':'');};
  $('setupModes').onclick=e=>{const b=e.target.closest('[data-mode]');if(!b)return;this.mode=b.dataset.mode;render()};
  $('setupPaces').onclick=e=>{const b=e.target.closest('[data-pace]');if(!b)return;$('welcomePace').value=b.dataset.pace;render()};
  $('welcomeCustom').addEventListener('change',render);
  $('setupRandomSeed').onclick=()=>{const words=['ROBLE','BRUMA','COMETA','LAGO','CUMBRE','DUNA','FARO','SAUCE','ARCO','NIEVE'];$('welcomeSeed').value=words[Math.floor(Math.random()*words.length)]+'-'+String(Math.floor(Math.random()*9000)+1000)};
  this.render=render;render();
 }
};
