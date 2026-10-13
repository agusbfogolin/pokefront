// Keyboard navigation shared by every menu, including dialogs rebuilt after an action.
window.createKeyboardUI=function(api){
 'use strict';
 const $=id=>document.getElementById(id),selector='button,a[href],input:not([type="hidden"]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';
 let activeDialog=null,observer=null,lastFocus=null,lastKey='',lastIndex=0,shortcuts=[];
 const portals=new WeakMap(),fine=window.matchMedia?.('(pointer: fine) and (hover: hover)'),coarse=window.matchMedia?.('(pointer: coarse)');
 function setMode(touch){document.body.classList.toggle('touch-input',touch);document.body.classList.toggle('keyboard-input',!touch);$('controllerDeck').hidden=!touch;$('controllerDeck').inert=!touch;}
 setMode(!fine?.matches&&!!(coarse?.matches||window.navigator?.maxTouchPoints));
 function visible(el){if(el.disabled||el.hidden||el.getAttribute?.('aria-hidden')==='true')return false;for(let p=el;p&&p!==document.body;p=p.parentElement){if(p.hidden||p.inert||p.classList?.contains('hidden'))return false;if(p.tagName==='DETAILS'&&!p.open&&el!==p.querySelector('summary'))return false;}return !el.getClientRects||el.getClientRects().length>0;}
 function controls(d){return [...(d.querySelectorAll?.(selector)||[])].filter(visible);}
 function identity(el){if(!el)return '';if(el.id)return el.id;const data=Object.entries(el.dataset||{}).filter(([key])=>!key.startsWith('keyboard'));return data.length?JSON.stringify(data):el.getAttribute?.('aria-label')||[...(el.childNodes||[])].filter(n=>!n.classList?.contains('keyboard-badge')).map(n=>n.textContent).join('')||el.textContent;}
 function focus(el){if(!el)return;el.focus({preventScroll:true});el.scrollIntoView?.({block:'nearest',inline:'nearest'});lastFocus=el;lastKey=identity(el);lastIndex=controls(activeDialog).indexOf(el);}
 function primary(d,list){const ids={welcomeDialog:['welcomeContinue','welcomeNew'],resultDialog:['resultContinue'],adventureMenu:['menuPokemonBtn'],bagDialog:['bagTarget'],shopDialog:['shopBuyTab'],mapDialog:['localMapTab']};for(const id of ids[d.id]||[]){const el=$(id);if(list.includes(el))return el;}return list.find(el=>el.classList.contains('primary')&&!el.classList.contains('modalclose'))||list.find(el=>!el.classList.contains('modalclose'))||list[0];}
 function sync(){const d=activeDialog;if(!d?.open)return;const list=controls(d),actions=list.filter(el=>el.tagName==='BUTTON'&&!el.classList.contains('modalclose'));
  const group=d.querySelector?.('.modalactions,.npcactions,.adventure-menu-grid,.skilltabs');
  const choices=group?[...(group.querySelectorAll?.('button')||[])].filter(visible):actions;
  shortcuts=choices.slice(0,9);
  for(const el of [...(d.querySelectorAll?.('[data-keyboard-shortcut]')||[])])if(!shortcuts.includes(el)){el.removeAttribute('data-keyboard-shortcut');el.removeAttribute('aria-keyshortcuts');el.querySelector('.keyboard-badge')?.remove();}
  shortcuts.forEach((el,i)=>{const key=String(i+1);if(el.dataset.keyboardShortcut===key)return;el.dataset.keyboardShortcut=key;el.setAttribute('aria-keyshortcuts',key);let badge=el.querySelector?.('.keyboard-badge');if(!badge){badge=document.createElement('kbd');badge.className='keyboard-badge';badge.setAttribute('aria-hidden','true');el.append(badge);}badge.textContent=key;});
  if(lastFocus&&(!list.includes(lastFocus)||!d.contains?.(document.activeElement))){const replacement=list.find(el=>lastKey&&identity(el)===lastKey)||list[Math.min(lastIndex,list.length-1)];if(replacement)focus(replacement);}
 }
 function prepare(d){const area=$('gameArea');if(d.id!=='welcomeDialog'&&document.fullscreenElement===area&&!area.contains?.(d)){portals.set(d,{parent:d.parentNode,next:d.nextSibling});area.append(d);}}
 function open(d){observer?.disconnect();activeDialog=d;lastFocus=null;lastKey='';lastIndex=0;
  if(!d.querySelector?.('.dialog-keys')){const hint=document.createElement('p');hint.className='dialog-keys';hint.textContent=d.id==='learningDialog'?'Flechas / WASD: secuencia · Tab: opciones · Enter: confirmar · Esc: volver':'↑ ↓ ← → elegir · Enter / Espacio confirmar · Tab campos · 1–9 atajos · Esc volver';const x=d.querySelector?.('.modalclose');if(x&&x.parentElement===d&&d.insertBefore)d.insertBefore(hint,x.nextSibling);else d.prepend?.(hint);}
  sync();const list=controls(d);if(d.id==='learningDialog'){d.tabIndex=-1;d.focus({preventScroll:true});}else focus(primary(d,list));
  if(window.MutationObserver){observer=new MutationObserver(sync);observer.observe(d,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','hidden','class','open']});}
 }
 function closed(d){if(d.open)return;const portal=portals.get(d);if(portal){if(portal.parent)portal.parent.insertBefore(d,portal.next?.parentNode===portal.parent?portal.next:null);portals.delete(d);}if(activeDialog===d){observer?.disconnect();activeDialog=null;lastFocus=null;api.clearInput();$('game').focus({preventScroll:true});}}
 function cancel(d){const event=new Event('cancel',{cancelable:true});if(d.dispatchEvent(event))d.close();}
 function move(list,current,key){let i=list.indexOf(current);if(i<0)i=0;if(key==='Home')return list[0];if(key==='End')return list.at(-1);if(key==='PageDown'||key==='PageUp')return list[Math.max(0,Math.min(list.length-1,i+(key==='PageDown'?8:-8)))];
  const rect=current?.getBoundingClientRect?.(),dx=key==='ArrowRight'?1:key==='ArrowLeft'?-1:0,dy=key==='ArrowDown'?1:key==='ArrowUp'?-1:0;
  if(rect){const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,candidates=list.filter(el=>el!==current).map(el=>{const r=el.getBoundingClientRect(),x=r.left+r.width/2-cx,y=r.top+r.height/2-cy,forward=dx?x*dx:y*dy,side=dx?Math.abs(y):Math.abs(x);return{el,forward,score:forward+side*3};}).filter(p=>p.forward>4).sort((a,b)=>a.score-b.score);if(candidates.length)return candidates[0].el;}
  return list[Math.max(0,Math.min(list.length-1,i+(dx<0||dy<0?-1:1)))];
 }
 function handle(e){if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return false;if(document.body.classList.contains('touch-input'))api.clearInput();setMode(false);const d=document.querySelector('dialog[open]');if(!d)return false;if(activeDialog!==d)open(d);sync();if(e.defaultPrevented)return true;
  const key=e.key,current=document.activeElement,list=controls(d),typing=current?.matches?.('input,textarea,select')||e.target?.matches?.('input,textarea,select');
  if(key==='Escape'){e.preventDefault();if(!e.repeat)cancel(d);return true;}
  if(key==='Tab'){e.preventDefault();if(list.length){const i=list.indexOf(current);focus(list[(i+(e.shiftKey?-1:1)+list.length)%list.length]);}return true;}
  if(typing)return true;
  if(d.id==='learningDialog'&&['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','w','a','s','d'].includes(key))return true;
  if(d.id==='adventureMenu'&&key.toLowerCase()==='m'){e.preventDefault();d.close();return true;}
  if(['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','Home','End','PageUp','PageDown'].includes(key)){e.preventDefault();focus(move(list,current,key));return true;}
  if(key==='Enter'||key===' '){e.preventDefault();if(!e.repeat){const el=list.includes(current)?current:d.id==='learningDialog'?null:primary(d,list);el?.click();}return true;}
  if(/^[1-9]$/.test(key)){e.preventDefault();if(!e.repeat){const el=shortcuts[Number(key)-1];if(el){focus(el);el.click();}}return true;}return true;
 }
 window.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen'){setMode(true);}else if(e.pointerType==='mouse')setMode(false);});
 document.addEventListener('focusin',e=>{if(activeDialog?.open&&activeDialog.contains?.(e.target)&&controls(activeDialog).includes(e.target)){lastFocus=e.target;lastKey=identity(e.target);lastIndex=controls(activeDialog).indexOf(e.target);}});
 document.querySelectorAll('dialog').forEach(d=>d.addEventListener('close',()=>closed(d)));
 return{handle,prepare,open,sync,setMode,get touch(){return document.body.classList.contains('touch-input')},get focused(){return document.activeElement}};
};
