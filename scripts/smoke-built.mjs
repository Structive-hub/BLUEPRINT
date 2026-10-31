import {startBuiltServer} from './serve-built.mjs';
const server=await startBuiltServer({port:0,runId:'smoke'}),base='http://127.0.0.1:'+server.address().port;
try{
 const r=await fetch(base+'/'),html=await r.text();
 const js=html.match(/src="([^"]+\.js)"/)[1],css=html.match(/href="([^"]+\.css)"/)[1];
 const a=await fetch(base+'/'+js.replace(/^\.\//,''));await a.text();const c=await fetch(base+'/'+css.replace(/^\.\//,''));await c.text();
 const missing=await fetch(base+'/missing.txt');await missing.text();
 console.log(JSON.stringify({html:r.status,javascript:a.status,css:c.status,missing:missing.status,identity:r.headers.get('x-blueprint-run')}));
 if(r.status!==200||a.status!==200||c.status!==200||missing.status!==404||r.headers.get('x-blueprint-run')!=='smoke')throw Error('Smoke test failed');
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
