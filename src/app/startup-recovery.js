(function(){
 'use strict';
 // Centralized resources for the startup/recovery surface only. No workspace data is read.
 var strings={
  it:{title:'Avvio di Blueprint',waiting:'Caricamento dell’applicazione…',failed:'Blueprint non è riuscito ad avviarsi',help:'I progetti salvati non sono stati cancellati. Non eliminare i dati del browser. Scarica la diagnostica e consulta le istruzioni di avvio.',download:'Scarica diagnostica',details:'Dettagli tecnici',unsupported:'Il browser non offre tutte le funzioni richieste. Usa una versione aggiornata di Chrome, Edge o Firefox.'},
  en:{title:'Starting Blueprint',waiting:'Loading the application…',failed:'Blueprint could not start',help:'Saved projects have not been deleted. Do not clear browser data. Download diagnostics and consult the startup instructions.',download:'Download diagnostics',details:'Technical details',unsupported:'This browser does not provide all required capabilities. Use an up-to-date Chrome, Edge or Firefox.'}
 };
 var lang='it',errors=[],failed=false,ready=false;
 function diagnostic(){return {format:'blueprint-startup-v1',time:new Date().toISOString(),mode:location.protocol==='file:'?'standalone-file':'http',location:location.protocol+'//'+location.host+location.pathname,browser:navigator.userAgent,source:(document.querySelector('meta[name="blueprint-source"]')||{}).content||'development/build',capabilities:{structuredClone:typeof window.structuredClone==='function',randomUUID:!!(window.crypto&&window.crypto.randomUUID),DOMPoint:typeof window.DOMPoint==='function'},errors:errors};}
 function render(){var s=strings[lang];document.getElementById('boot-title').textContent=failed?s.failed:s.title;document.getElementById('boot-help').textContent=failed?s.help:s.waiting;document.getElementById('boot-download').textContent=s.download;document.getElementById('boot-details-title').textContent=s.details;document.getElementById('boot-diagnostic').textContent=JSON.stringify(diagnostic(),null,2);document.getElementById('boot-download').hidden=!failed;document.getElementById('boot-details').hidden=!failed;}
 function fail(error){failed=true;errors.push({message:String(error&&error.message||error),stack:String(error&&error.stack||'')});document.getElementById('blueprint-boot').hidden=false;render();}
 window.BlueprintBoot={ready:function(){if(failed)return;ready=true;document.getElementById('blueprint-boot').hidden=true;},fail:fail};
 document.getElementById('boot-it').onclick=function(){lang='it';render();};
 document.getElementById('boot-en').onclick=function(){lang='en';render();};
 document.getElementById('boot-download').onclick=function(){var a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(diagnostic(),null,2)],{type:'application/json'}));a.href=url;a.download='blueprint-diagnostica.json';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);};
 window.addEventListener('error',function(e){if(!ready||!e.target||e.target===window)fail(e.error||e.message||'Resource load failed');},true);
 window.addEventListener('unhandledrejection',function(e){fail(e.reason||'Unhandled rejection');});
 render();
 if(typeof window.structuredClone!=='function'||!window.crypto||typeof window.crypto.randomUUID!=='function'||typeof window.DOMPoint!=='function')fail(strings.it.unsupported+' / '+strings.en.unsupported);
})();
