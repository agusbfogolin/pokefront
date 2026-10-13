// Campaign length controls shared by the welcome screen and the atlas: pick the regions of the adventure and the gyms each one needs.
window.PaceControls={
mount(root,{gens=[1,2,3,4,5,6,7,8,9],need=3,locked=[]}={}){
 const F=window.Frontera,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 root.innerHTML='<fieldset class="pace-custom"><legend>Regiones de tu aventura</legend><div class="pace-gens">'+Object.values(F.GENERATIONS).map(g=>'<label><input type="checkbox" value="'+g.id+'" '+(gens.includes(g.id)||locked.includes(g.id)?'checked ':'')+(locked.includes(g.id)?'disabled ':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div><label class="pace-need">Gimnasios por región <select>'+[1,2,3,4,5,6,7,8,9].map(n=>'<option value="'+n+'"'+(n===need?' selected':'')+'>'+n+(n===9?' (todos)':'')+'</option>').join('')+'</select></label><small class="pace-summary" role="status"></small></fieldset>';
 const update=()=>{const v=window.PaceControls.read(root);root.querySelector('.pace-summary').textContent=v.gens.length+' región(es) · '+v.need+' gimnasio(s) por región · '+v.gens.length*v.need+' medallas para terminar. La región de tu inicial siempre se incluye.'};
 root.addEventListener('change',update);update();
},
read(root){return{gens:[...root.querySelectorAll('.pace-gens input:checked')].map(i=>Number(i.value)),need:Number(root.querySelector('.pace-need select').value)}}
};
