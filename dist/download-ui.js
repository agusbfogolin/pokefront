'use strict';
(async()=>{
 const $=id=>document.getElementById(id),key=new URLSearchParams(location.search).get('paquete')==='proyecto'?'proyecto':'sprites';let pack,controller;
 $('title').textContent=key==='proyecto'?'Proyecto completo':'Sprites y datos';$('description').textContent=key==='proyecto'?'Código del juego, herramientas de importación y todos los recursos locales.':'Las 1025 especies, sus hojas disponibles, datos de animación, fuentes y créditos.';
 try{const response=await fetch('downloads/manifest.json');if(!response.ok)throw Error('No se pudo cargar el paquete.');pack=(await response.json())[key];$('size').textContent=(pack.bytes/1024/1024).toFixed(1)+' MB · '+pack.filename;$('status').textContent='El ZIP se guardará cuando termine la descarga.';$('download').disabled=false}catch(error){$('status').textContent=error.message;return}
 $('cancel').onclick=()=>controller?.abort();
 $('download').onclick=async()=>{
  controller=new AbortController();$('download').disabled=true;$('cancel').hidden=false;$('progress').value=0;$('status').textContent='Descargando…';
  try{
   const blob=await DownloadPackage.assemble(pack,async(part,signal)=>{const response=await fetch(part.url,{signal});if(!response.ok)throw Error('No se pudo descargar el archivo. Vuelve a intentar.');const content=await response.arrayBuffer();const digest=await crypto.subtle.digest('SHA-256',content),sha=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');if(sha!==part.sha256)throw Error('El archivo no pasó la verificación. Vuelve a intentar.');return content},(bytes,total)=>{$('progress').value=bytes/total;$('status').textContent='Descargando… '+Math.round(bytes/total*100)+' %'},controller.signal);
   const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=pack.filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);$('status').textContent='Descarga completa. El ZIP está listo para guardar.';
  }catch(error){$('status').textContent=error.name==='AbortError'?'Descarga cancelada.':error.message}finally{$('download').disabled=false;$('cancel').hidden=true;controller=null}
 };
})();
