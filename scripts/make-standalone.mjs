import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,join,sep} from 'node:path';
import {verifiedBuild} from './build-info.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
export function standaloneHTML(projectRoot=root){
 const manifest=verifiedBuild(projectRoot),dist=resolve(projectRoot,'dist');
 const asset=name=>{const p=resolve(dist,name.replace(/^\//,''));if(!p.startsWith(dist+sep))throw Error('Asset fuori da dist');return readFileSync(p,'utf8');};
 let html=readFileSync(join(dist,'index.html'),'utf8'),count=0;
 html=html.replace(/<script\b([^>]*?)\bsrc="([^"]+)"([^>]*)><\/script>/g,(_tag,a,src,b)=>{
  if(!/type="module"/.test(a+b))throw Error('Script esterno inatteso: '+src);
  count++;return '<script type="module">'+asset(src).replaceAll('</script','<\\/script')+'</script>';
 });
 html=html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,(_tag,src)=>'<style>'+asset(src).replaceAll('</style','<\\/style')+'</style>');
 if(count!==1||/<script\b[^>]*\bsrc=|<link\b[^>]*\b(?:stylesheet|modulepreload)/i.test(html))throw Error('La distribuzione deve contenere un solo bundle JS incorporato, senza asset esterni.');
 const notices=asset('THIRD_PARTY_NOTICES.txt').replaceAll('</script','<\\/script');
 html=html.replace('</head>','<script type="text/plain" id="blueprint-third-party-notices">\n'+notices+'\n</script></head>');
 return html.replace('</head>','<meta name="blueprint-source" content="'+manifest.sourceDigest+'"></head>').replace(/\r+\n|\r/g,'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const html=standaloneHTML(),target=join(root,'Blueprint-apri.html');
 if(process.argv.includes('--check')){
  if(readFileSync(target,'utf8').replace(/\r+\n|\r/g,'\n')!==html)throw Error('Blueprint-apri.html non aggiornato. Esegui npm run build.');
  console.log('HTML autonomo verificato: corrisponde alla build e ai sorgenti correnti.');
 }else{writeFileSync(target,html);console.log('Creato Blueprint-apri.html dai sorgenti correnti, senza dipendenze remote.');}
}
