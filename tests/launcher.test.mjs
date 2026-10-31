import {copyFixture,removeFixture} from './fs-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {cpSync,mkdirSync,mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve,join,sep} from 'node:path';
import http from 'node:http';
import {once} from 'node:events';
import {startBuiltServer} from '../scripts/serve-built.mjs';
const root=resolve('.'),work=join(root,'work');mkdirSync(work,{recursive:true});
function stage(t,prefix='Avvio Windows & spaces-'){
 const dir=mkdtempSync(join(work,prefix));
 for(const p of ['src','scripts','dist','avvia.cmd','index.html','Blueprint-apri.html','package.json','package-lock.json','tsconfig.json','vite.config.mjs','THIRD_PARTY_NOTICES.txt'])copyFixture(join(root,p),join(dir,p));
 t.after(()=>{assert.ok(resolve(dir).startsWith(work+sep));removeFixture(dir,work);});return dir;
}
async function freePort(){const s=http.createServer();s.listen(0,'127.0.0.1');await once(s,'listening');const port=s.address().port;await new Promise(r=>s.close(r));return port;}
function launch(dir,port,extra={},direct=false){
 return new Promise((resolve,reject)=>{
  const child=spawn(process.platform==='win32'&&!direct?process.env.ComSpec||'cmd.exe':process.execPath,process.platform==='win32'&&!direct?['/d','/c','avvia.cmd']:['scripts/launch.mjs'],{cwd:dir,env:{...process.env,BLUEPRINT_TEST_MODE:'1',BLUEPRINT_PORT:String(port),...extra},windowsHide:true,stdio:['ignore','pipe','pipe']});
  let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);
  const timeout=setTimeout(()=>{child.kill();reject(Error('Timeout launcher: '+output));},120000);
  child.once('error',reject);child.once('exit',code=>{clearTimeout(timeout);resolve({code,output});});
 });
}
test('server distribuito serve HTML/JS/CSS e identifica il processo avviato',async()=>{
 const s=await startBuiltServer({port:0,runId:'unit-test'}),base='http://127.0.0.1:'+s.address().port;
 try{
  const page=await fetch(base),html=await page.text();assert.equal(page.status,200);assert.equal(page.headers.get('x-blueprint-run'),'unit-test');
  for(const path of [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map(m=>m[1])){const r=await fetch(new URL(path,base));assert.equal(r.status,200);await r.text();}
  const no=await fetch(base+'/missing.txt');assert.equal(no.status,404);await no.text();
  const invalid=await fetch(base+'/%ZZ');assert.equal(invalid.status,400);await invalid.text();
  const method=await fetch(base,{method:'POST'});assert.equal(method.status,405);await method.text();
 }finally{s.closeAllConnections();await new Promise(r=>s.close(r));}
});
test('launcher reale: build pronta, percorso con spazi/Unicode/& e nessuna dipendenza installata',async t=>{
 const dir=stage(t,'Avvio Windows è & spazi-'),result=await launch(dir,await freePort());assert.equal(result.code,0,result.output);assert.match(result.output,/Startup check passed/);
 const log=readFileSync(result.output.match(/Log: (.+)/)[1].trim().replace(/^"|"$/g,''),'utf8');assert.match(log,/Mode: built/);assert.match(log,/Node: v/);
});
test('HTTP 200 di un altro processo non viene scambiato per avvio di Blueprint',async t=>{
 const dir=stage(t),s=http.createServer((_q,r)=>r.end('another application'));s.listen(0,'127.0.0.1');await once(s,'listening');
 try{const result=await launch(dir,s.address().port);assert.equal(result.code,1,result.output);assert.doesNotMatch(result.output,/Startup check passed/);const r=await fetch('http://127.0.0.1:'+s.address().port);assert.equal(await r.text(),'another application');assert.match(readFileSync(result.output.match(/Log: (.+)/)[1].trim().replace(/^"|"$/g,''),'utf8'),/EADDRINUSE|occupata/);}
 finally{s.closeAllConnections();await new Promise(r=>s.close(r));}
});
test('build assente: catena JavaScript ricostruisce prima di dichiarare il successo',async t=>{
 const dir=stage(t);const target=resolve(dir,'dist');assert.ok(target.startsWith(resolve(dir)+sep));removeFixture(target,work);
 copyFixture(join(root,'node_modules'),join(dir,'node_modules'));
 const result=await launch(dir,await freePort(),{},true);assert.equal(result.code,0,result.output);assert.match(result.output,/rebuilding from source/);assert.match(result.output,/Startup check passed/);
 assert.match(readFileSync(join(dir,'Blueprint-apri.html'),'utf8'),/name="blueprint-source"/);
});
test('build assente ricostruita dal launcher prima di dichiarare il successo',async t=>{
 const dir=stage(t);
 if(process.platform==='win32'){
  // This is an environment capability probe, not a simulation of the launcher.
  writeFileSync(join(dir,'probe.mjs'),"import {writeFileSync} from 'node:fs';writeFileSync('probe-result.txt','ok');");
  const probe=spawnSync(process.env.ComSpec||'cmd.exe',['/d','/c','node probe.mjs'],{cwd:dir,encoding:'utf8'});
  let writable=false;try{writable=readFileSync(join(dir,'probe-result.txt'),'utf8')==='ok';}catch{}
  if(!writable){if(process.env.BLUEPRINT_REQUIRE_CMD_WRITES==='1')assert.fail('CI Windows: cmd.exe non può scrivere la fixture: '+probe.stderr);t.skip('Host Windows: cmd.exe non riesce a scrivere nella fixture; cold start .cmd non verificabile. '+probe.stderr.slice(0,180));return;}
 }
 const target=resolve(dir,'dist');assert.ok(target.startsWith(resolve(dir)+sep));removeFixture(target,work);
 const result=await launch(dir,await freePort());assert.equal(result.code,0,result.output);assert.match(result.output,/Installing locked dependencies/);assert.match(result.output,/rebuilding from source/);assert.match(result.output,/Startup check passed/);
 assert.match(readFileSync(join(dir,'Blueprint-apri.html'),'utf8'),/name="blueprint-source"/);
});
test('assenza Node: errore Windows leggibile e log anche prima di avviare JavaScript',{skip:process.platform!=='win32'},async t=>{
 const dir=stage(t),result=await launch(dir,await freePort(),{PATH:join(process.env.SystemRoot,'System32')});
 assert.equal(result.code,1,result.output);assert.match(result.output,/Node.js missing/);assert.match(readFileSync(result.output.match(/Log: (.+)/)[1].trim().replace(/^"|"$/g,''),'utf8'),/Node.js missing/);
});
test('anche il server diretto rifiuta build non allineate ai sorgenti',async t=>{
 const dir=stage(t),source=join(dir,'src/core/model.ts');
 writeFileSync(source,readFileSync(source,'utf8')+'\n// changed source\n');
 await assert.rejects(()=>startBuiltServer({port:0,root:join(dir,'dist')}),/stale|allineata/);
});
