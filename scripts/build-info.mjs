import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
export const digest=data=>createHash('sha256').update(data).digest('hex');
export function sourceDigest(root){
 const paths=[];
 function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else paths.push(p);}}
 walk(join(root,'src'));
 for(const p of ['index.html','package.json','package-lock.json','tsconfig.json','vite.config.mjs','scripts/build-info.mjs','scripts/build.mjs','scripts/make-standalone.mjs','THIRD_PARTY_NOTICES.txt'])paths.push(join(root,p));
 const hash=createHash('sha256');
 for(const p of paths.sort((a,b)=>relative(root,a).replaceAll('\\','/').localeCompare(relative(root,b).replaceAll('\\','/'),'en'))){
  hash.update(relative(root,p).replaceAll('\\','/')+'\0');hash.update(readFileSync(p,'utf8').replace(/\r\n/g,'\n'));hash.update('\0');
 }
 return hash.digest('hex');
}
export function verifiedBuild(root){
 const dist=join(root,'dist'),manifest=JSON.parse(readFileSync(join(dist,'build-manifest.json'),'utf8'));
 if(manifest.format!=='blueprint-build-v1'||manifest.sourceDigest!==sourceDigest(root))throw Error('Build assente o non allineata ai sorgenti / Build missing or stale.');
 if(!manifest.files||!Object.hasOwn(manifest.files,'index.html'))throw Error('Manifest incompleto / Incomplete manifest.');
 for(const [name,hash] of Object.entries(manifest.files)){
  const p=resolve(dist,name);if(!p.startsWith(resolve(dist)+String.fromCharCode(process.platform==='win32'?92:47))||!existsSync(p)||digest(readFileSync(p))!==hash)throw Error('Build corrotta o incompleta / Damaged build: '+name);
 }
 return manifest;
}
