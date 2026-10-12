window.createFieldUI=function(api){
'use strict';
const F=window.Frontera,$=id=>document.getElementById(id),esc=api.escape;
function locked(){return!!api.battle()||api.locked()}
function render(){const s=api.state();$('fieldLocation').textContent=F.MAPS[s.mapId].name+' · '+(s.field.surfing?'Navegando con Surf':F.fieldDark(s)?'Cueva oscura':'Exploración');
 $('fieldMoves').innerHTML=Object.values(F.FIELD_MOVES).map(move=>{const permission=F.fieldAccess(s,move.key),check=F.canUseField(s,move.key,{battle:api.battle()}),badge=move.badge?'Medalla '+F.CITY[move.badge].badge+' · '+F.CITY[move.badge].name:'Sin medalla requerida';return '<article class="field-card '+(permission.ok?'available':'')+'"><div class="field-title"><b>'+esc(move.name)+'</b><span>'+esc(permission.ok?F.DATA[permission.user.id].name:'Por habilitar')+'</span></div><p>'+esc(move.description)+'</p><small>'+esc(badge)+'</small><button class="secondary" data-fieldmove="'+move.key+'" '+(!check.ok||locked()?'disabled':'')+'>'+esc(check.ok?(check.chooseDestination?'Elegir destino':'Usar '+move.name):check.reason)+'</button></article>'}).join('');
 for(const button of document.querySelectorAll('[data-fieldmove]'))button.onclick=()=>{if(locked())return;const key=button.dataset.fieldmove;if(key==='fly'){chooseFly();return}use(key)};
}
function chooseFly(){if(locked()||!F.canUseField(api.state(),'fly').ok)return;const s=api.state();$('fieldDestinations').classList.remove('hidden');$('fieldDestinations').innerHTML='<h3>Volar a una ciudad visitada</h3><div class="field-destinations">'+F.fieldDestinations(s).map(id=>'<button class="secondary" data-fieldfly="'+id+'">'+esc(F.MAPS[id].name)+'</button>').join('')+'</div>';for(const button of document.querySelectorAll('[data-fieldfly]'))button.onclick=()=>use('fly',null,button.dataset.fieldfly);$('fieldDestinations').scrollIntoView?.({block:'nearest',behavior:'smooth'})}
function use(key,target=null,destination=null){if(locked())return false;const result=F.useField(api.state(),key,{target,destination,battle:api.battle()});if(!result.ok){api.toast(result.reason);return false}$('fieldDialog').close();api.changed();api.toast(result.message);return true}
function open(){if(locked())return;$('fieldDestinations').innerHTML='';$('fieldDestinations').classList.add('hidden');render();api.openDialog('fieldDialog')}
$('fieldClose').onclick=()=>$('fieldDialog').close();return{open,use,render};
};
