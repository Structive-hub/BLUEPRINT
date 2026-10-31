import {copyFixture,removeFixture} from './fs-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync,readdirSync} from 'node:fs';
import {resolve,join,sep} from 'node:path';
import {execFileSync} from 'node:child_process';
import {standaloneHTML} from '../scripts/make-standalone.mjs';
import {sourceDigest,verifiedBuild} from '../scripts/build-info.mjs';
const root=resolve('.'),work=join(root,'work');mkdirSync(work,{recursive:true});
function fixture(t){
 const dir=mkdtempSync(join(work,'distribution-'));
 for(const p of ['src','scripts','dist','index.html','package.json','package-lock.json','tsconfig.json','vite.config.mjs','THIRD_PARTY_NOTICES.txt'])copyFixture(join(root,p),join(dir,p));
 t.after(()=>{assert.ok(resolve(dir).startsWith(work+sep));removeFixture(dir,work);});return dir;
}
test('HTML autonomo deterministico, generato dalla build corrente',()=>{
 const a=standaloneHTML(),b=standaloneHTML();assert.equal(a,b);assert.equal(a,readFileSync('Blueprint-apri.html','utf8').replace(/\r\n/g,'\n'));
 assert.match(a,/name="blueprint-source"/);assert.doesNotMatch(a,/<script\b[^>]*src=/);
 assert.doesNotMatch(a,/<link\b[^>]*(?:stylesheet|modulepreload)/);
});
test('sorgenti modificati e build vecchia non possono essere etichettati come aggiornati',t=>{
 const dir=fixture(t),old=readFileSync('Blueprint-apri.html','utf8');
 writeFileSync(join(dir,'src/core/model.ts'),readFileSync(join(dir,'src/core/model.ts'),'utf8')+'\n// stale source\n');
 assert.throws(()=>standaloneHTML(dir),/stale|allineata/);assert.equal(readFileSync('Blueprint-apri.html','utf8'),old);
});
test('asset mancante o modificato rifiuta la distribuzione',t=>{
 const dir=fixture(t),manifest=verifiedBuild(dir),asset=Object.keys(manifest.files).find(p=>p.endsWith('.js'));
 writeFileSync(join(dir,'dist',asset),'// damaged');assert.throws(()=>standaloneHTML(dir),/corrotta|Damaged/);
});
test('hash sorgenti indipendente da LF/CRLF e cartella di checkout',t=>{
 const dir=fixture(t),file=join(dir,'src/core/model.ts');
 writeFileSync(file,readFileSync(file,'utf8').replace(/\r\n/g,'\n').replace(/\n/g,'\r\n'));
 assert.equal(sourceDigest(dir),sourceDigest(root));assert.equal(standaloneHTML(dir),standaloneHTML());
});
test('generatore funziona da directory diversa e --check non modifica il file',t=>{
 const dir=fixture(t),before=readFileSync('Blueprint-apri.html');
 execFileSync(process.execPath,[join(root,'scripts/make-standalone.mjs'),'--check'],{cwd:dir});
 assert.deepEqual(readFileSync('Blueprint-apri.html'),before);
});
test('demo e demo:v0 lasciano invariati tutti gli esempi versionati',()=>{
 const names=readdirSync('examples'),before=names.map(p=>[p,readFileSync(join('examples',p),'utf8')]);
 for(const script of ['scripts/demo.ts','scripts/demo-v0.ts'])execFileSync(process.execPath,['--experimental-strip-types',script],{cwd:root});
 for(const [name,content] of before)assert.equal(readFileSync(join('examples',name),'utf8'),content,name);
});
test('checkout CRLF ricompilato produce lo stesso HTML LF, verificabile subito dopo la build',t=>{
 const dir=fixture(t);copyFixture(join(root,'node_modules'),join(dir,'node_modules'));
 function convert(path){
  for(const entry of readdirSync(path,{withFileTypes:true})){
   const file=join(path,entry.name);
   if(entry.isDirectory())convert(file);else writeFileSync(file,readFileSync(file,'utf8').replace(/\r\n/g,'\n').replace(/\n/g,'\r\n'));
  }
 }
 convert(join(dir,'src'));
 for(const p of ['index.html','vite.config.mjs'])writeFileSync(join(dir,p),readFileSync(join(dir,p),'utf8').replace(/\r\n/g,'\n').replace(/\n/g,'\r\n'));
 execFileSync(process.execPath,[join(dir,'scripts/build.mjs')],{cwd:dir});
 const generated=readFileSync(join(dir,'Blueprint-apri.html'),'utf8');
 assert.equal(generated,standaloneHTML());assert.doesNotMatch(generated,/\r/);
 execFileSync(process.execPath,[join(dir,'scripts/make-standalone.mjs'),'--check'],{cwd:dir});
});

test('avvisi di licenza conservati integralmente in HTML, distribuzione e manifest',()=>{
 const notices=readFileSync('THIRD_PARTY_NOTICES.txt','utf8').replace(/\r\n/g,'\n');
 const html=standaloneHTML(),embedded=html.match(/<script type="text\/plain" id="blueprint-third-party-notices">\n([\s\S]*?)\n<\/script>/);
 assert.ok(embedded,'Avvisi incorporati assenti');assert.equal(embedded[1].replaceAll('<\\/script','</script'),notices);
 assert.equal(readFileSync('dist/THIRD_PARTY_NOTICES.txt','utf8'),notices);
 assert.ok(verifiedBuild(root).files['THIRD_PARTY_NOTICES.txt']);
 assert.match(notices,/Copyright \(c\) Meta Platforms/);assert.match(notices,/Permission is hereby granted/);
});

test('avvisi modificati rendono obsoleta la build; avvisi compilati alterati sono rifiutati',t=>{
 const dir=fixture(t),file=join(dir,'THIRD_PARTY_NOTICES.txt');
 writeFileSync(file,readFileSync(file,'utf8')+'\nAvviso aggiuntivo\n');assert.throws(()=>standaloneHTML(dir),/stale|allineata/);
 const other=fixture(t);writeFileSync(join(other,'dist/THIRD_PARTY_NOTICES.txt'),'avvisi alterati');
 assert.throws(()=>standaloneHTML(other),/corrotta|Damaged/);
});