import {spawn} from 'node:child_process';
import {appendFileSync,existsSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {randomUUID} from 'node:crypto';
import {verifiedBuild} from './build-info.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),mode=process.argv.includes('--dev')?'development':'built';
const testMode=process.env.BLUEPRINT_TEST_MODE==='1',noBrowser=testMode||process.argv.includes('--no-browser');
const port=Number(process.env.BLUEPRINT_PORT||(mode==='development'?5173:4173)),url='http://127.0.0.1:'+port+'/',runId=randomUUID();
let logFile=join(root,'blueprint-avvio.log'),server=null,exited=false,stopping=false;
try{appendFileSync(logFile,'\n=== Blueprint '+new Date().toISOString()+' ===\n');}
catch(logError){const dir=join(tmpdir(),'blueprint-diagnostics');mkdirSync(dir,{recursive:true});logFile=join(dir,'blueprint-avvio-'+Date.now()+'.log');appendFileSync(logFile,'=== Blueprint ===\nLog locale non disponibile / Local log unavailable: '+logError.message+'\n');}
function say(message,error=false){(error?process.stderr:process.stdout).write(message+'\n');appendFileSync(logFile,message+'\n');}
function mirror(stream,to){stream.on('data',chunk=>{to.write(chunk);appendFileSync(logFile,chunk);});}
function npmCLI(){
 const candidates=[process.env.npm_execpath,join(dirname(process.execPath),'node_modules/npm/bin/npm-cli.js')].filter(Boolean);
 const found=candidates.find(p=>existsSync(p));if(!found)throw Error('npm non trovato. Installa Node.js completo di npm. / npm missing. Install Node.js including npm.');return found;
}
async function command(args, direct=false){
 await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,direct?args:[npmCLI(),...args],{cwd:root,stdio:['ignore','pipe','pipe'],windowsHide:true});
  mirror(child.stdout,process.stdout);mirror(child.stderr,process.stderr);child.once('error',reject);
  child.once('exit',(code,signal)=>code===0?resolve():reject(Error('npm '+args.join(' ')+' fallito / failed: '+(code??signal))));
 });
}
async function dependencies(){
 if(!existsSync(join(root,'node_modules/vite/bin/vite.js'))||!existsSync(join(root,'node_modules/typescript/bin/tsc'))){
  say('Installazione delle dipendenze bloccate / Installing locked dependencies: npm ci');await command(['ci']);
 }
}
async function stop(){
 stopping=true;if(!server||exited)return;
 const done=new Promise(resolve=>server.once('exit',resolve));server.kill();await done;
}
function openBrowser(){
 if(process.platform!=='win32'){say('Apri manualmente / Open manually: '+url);return;}
 const child=spawn('cmd.exe',['/d','/c','start "" "'+url+'"'],{windowsHide:true,stdio:'ignore',detached:true});
 child.on('error',e=>say('Browser non aperto / Browser not opened: '+e.message,true));child.unref();
}
try{
 say('Node: '+process.version+' | '+process.platform+' '+process.arch+' | '+process.execPath);
 say('Cartella / Directory: '+root);say('Modalità / Mode: '+mode);say('URL: '+url);say('Log: '+logFile);
 const [major,minor]=process.versions.node.split('.').map(Number);
 if(major<22||(major===22&&minor<18))throw Error('Richiesto Node.js >=22.18.0 / Node.js >=22.18.0 required.');
 if(!Number.isInteger(port)||port<1||port>65535)throw Error('Porta non valida / Invalid port');
 if(process.env.BLUEPRINT_PORT)say('Porta esplicita: i dati sono separati per origine. / Explicit port: storage is separated by origin.');
 let build;
 if(mode==='built'){
  try{build=verifiedBuild(root);}catch{
   say('Build mancante, incompleta o vecchia: rigenerazione dai sorgenti. / Missing, damaged or stale build: rebuilding from source.');
   await dependencies();await command([join(root,'scripts/build.mjs')],true);build=verifiedBuild(root);
  }
 }else await dependencies();
 const args=mode==='built'?[join(root,'scripts/serve-built.mjs')]:[join(root,'node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port',String(port),'--strictPort'];
 server=spawn(process.execPath,args,{cwd:root,env:{...process.env,PORT:String(port),BLUEPRINT_RUN_ID:runId},stdio:['inherit','pipe','pipe'],windowsHide:true});
 mirror(server.stdout,process.stdout);mirror(server.stderr,process.stderr);
 server.once('error',error=>{exited=true;say('Avvio processo fallito / Process start failed: '+error.message,true);});
 server.once('exit',(code,signal)=>{exited=true;if(!stopping){process.exitCode=1;say('Server arrestato inaspettatamente / Server stopped unexpectedly: '+(code??signal),true);}});
 for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{stop().catch(error=>say(error.message,true));});
 let ready=false;
 for(let attempt=0;attempt<60&&!exited;attempt++){
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(1000)});await response.text();
   ready=response.ok&&(response.headers.get('x-blueprint-run')===runId&&(mode==='development'||response.headers.get('x-blueprint-build')===build.sourceDigest));
   if(ready&&!exited)break;
  }catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
 }
 if(!ready||exited)throw Error('Il processo Blueprint non risponde correttamente. La porta potrebbe essere occupata. / The Blueprint process is not responding correctly. The port may be occupied.');
 say('Blueprint pronto / Blueprint ready: '+url);
 if(testMode){say('Verifica avvio superata / Startup check passed.');await stop();}
 else{
  if(!noBrowser)openBrowser();say('Non cambiare origine per recuperare dati: usa esportazione/importazione. / Keep the same origin; use export/import to transfer projects.');
  if(!exited)await new Promise(resolve=>server.once('exit',resolve));
 }
}catch(error){say('ERRORE / ERROR: '+(error?.stack||String(error)),true);say('Diagnostica conservata / Diagnostics saved: '+logFile,true);process.exitCode=1;await stop();}
