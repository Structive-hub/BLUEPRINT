import {defineConfig} from 'vite';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {sourceDigest,digest} from './scripts/build-info.mjs';
const root=fileURLToPath(new URL('.',import.meta.url));
let source='';
export default defineConfig({
 base:'./',
 build:{cssCodeSplit:false,modulePreload:false,rollupOptions:{output:{inlineDynamicImports:true}}},
 plugins:[{
  name:'blueprint-reproducible-distribution',
  configureServer(server){server.middlewares.use((_req,res,next)=>{res.setHeader('X-Blueprint-Run',process.env.BLUEPRINT_RUN_ID||'development');next();});},
  buildStart(){source=sourceDigest(root);},
  transformIndexHtml:{order:'pre',handler(html){
   const script=readFileSync(resolve(root,'src/app/startup-recovery.js'),'utf8').replace(/\r\n?/g,'\n').replaceAll('</script','<\\/script');
   return html.replace(/\r\n?/g,'\n').replace('<!--BLUEPRINT_BOOT_RECOVERY-->','<script>'+script+'</script>');
  }},
  generateBundle(){this.emitFile({type:'asset',fileName:'THIRD_PARTY_NOTICES.txt',source:readFileSync(resolve(root,'THIRD_PARTY_NOTICES.txt'),'utf8').replace(/\r\n/g,'\n')});},
  writeBundle(options,bundle){
   const files=Object.fromEntries(Object.values(bundle).map(f=>[f.fileName,digest(f.type==='chunk'?f.code:f.source)]));
   writeFileSync(resolve(root,options.dir||'dist','build-manifest.json'),JSON.stringify({format:'blueprint-build-v1',sourceDigest:source,files},null,2)+'\n');
  }
 }]
});
