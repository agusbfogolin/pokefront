(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DownloadPackage=factory()})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
async function assemble(pack,readPart,onProgress=()=>{},signal){const chunks=[];let bytes=0;for(const part of pack.parts){if(signal?.aborted)throw new DOMException('Descarga cancelada','AbortError');const content=await readPart(part,signal);if(signal?.aborted)throw new DOMException('Descarga cancelada','AbortError');if(content.byteLength!==part.bytes)throw Error('La descarga quedó incompleta. Vuelve a intentar.');chunks.push(content);bytes+=content.byteLength;onProgress(bytes,pack.bytes)}if(bytes!==pack.bytes)throw Error('El paquete está incompleto.');return new Blob(chunks,{type:'application/zip'})}
return{assemble};
});
