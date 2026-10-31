import http from 'node:http';
import {verifiedBuild} from './build-info.mjs';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {once} from 'node:events';
export const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
export function createBuiltServer({root=path.join(projectRoot,'dist'),runId=process.env.BLUEPRINT_RUN_ID||'',buildId}={}){
 let manifest;
 try{manifest=verifiedBuild(path.dirname(path.resolve(root)));}
 catch(error){throw Error('Build non disponibile o non allineata. Esegui npm ci e npm run build. / Build unavailable or stale. Run npm ci and npm run build. '+error.message);}
 const id=buildId||manifest.sourceDigest;
 return http.createServer(async(req,res)=>{
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Blueprint-Build':id,'X-Blueprint-Run':runId};
  try{
   if(!['GET','HEAD'].includes(req.method||'')){res.writeHead(405,headers);res.end();return;}
   const url=new URL(req.url||'/','http://localhost'),pathname=decodeURIComponent(url.pathname);
   const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
   if(!file.startsWith(path.resolve(root)+path.sep)){res.writeHead(403,headers);res.end('Accesso negato / Access denied');return;}
   if(!(await stat(file)).isFile())throw Error('not a file');
   const data=await readFile(file);res.writeHead(200,{...headers,'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
   res.end(req.method==='HEAD'?undefined:data);
  }catch(error){res.writeHead(error instanceof URIError?400:404,headers);res.end('Risorsa non disponibile / Resource unavailable');}
 });
}
export async function startBuiltServer({port=Number(process.env.PORT||4173),...options}={}){
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('Porta non valida / Invalid port');
 const server=createBuiltServer(options);server.listen(port,'127.0.0.1');await once(server,'listening');return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const server=await startBuiltServer();console.log('Blueprint: http://127.0.0.1:'+server.address().port+'/\nCtrl+C per arrestare / Ctrl+C to stop.');
  for(const signal of ['SIGINT','SIGTERM'])process.once(signal,()=>{server.closeAllConnections();server.close();});
 }catch(error){console.error('ERRORE / ERROR: '+error.message);process.exitCode=1;}
}
