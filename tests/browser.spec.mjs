import {test,expect,chromium} from '@playwright/test';
import {readFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,join,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
const key='blueprint.workspace.v1';
const legacy=readFileSync('examples/centro-medico-grafo.json','utf8');
const root=resolve('.'),work=join(root,'work');mkdirSync(work,{recursive:true});
async function ready(page,url='/'){
 await page.goto(url);await expect(page.getByRole('heading',{name:'Progetta nel grafo',exact:true})).toBeVisible();
 await expect(page.locator('#blueprint-boot')).toBeHidden();
}
async function model(page){return JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key)).model;}
async function addNode(page,id,label,kind='entity'){
 await page.getByRole('button',{name:'+ Nuovo nodo',exact:true}).click();
 await page.getByRole('textbox',{name:'ID nodo',exact:true}).fill(id);
 await page.getByRole('textbox',{name:'Nome nodo',exact:true}).fill(label);
 await page.getByRole('combobox',{name:'Tipo nodo',exact:true}).selectOption(kind);
 await page.getByRole('textbox',{name:'Descrizione nodo',exact:true}).fill('Contenuto del progetto non tradotto automaticamente.');
 await page.getByRole('button',{name:'Crea nodo',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'ID nodo',exact:true})).toHaveValue(id);
}
async function link(page,from,to,type,fromLabel,toLabel){
 await page.getByRole('combobox',{name:'Tipo di connessione',exact:true}).selectOption(type);
 await page.getByRole('combobox',{name:'Seleziona elemento',exact:true}).selectOption(from);
 await page.getByRole('button',{name:'Uscita '+type+' di '+fromLabel,exact:true}).click();
 await page.getByRole('combobox',{name:'Seleziona elemento',exact:true}).selectOption(to);
 await page.getByRole('button',{name:'Ingresso '+type+' di '+toLabel,exact:true}).click();
}
test('apertura build pronta e navigazione in tutte le viste',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);
 for(const [button,heading] of [
 ['01 Intenzione','Dall’intenzione al modello'],['03 Vincoli','Le intenzioni diventano contratti'],['04 Impatto','Segui le dipendenze del modello'],
 ['05 Laboratorio v0','Metti il comportamento alla prova'],['06 Decisioni','La memoria delle decisioni'],['02 Struttura','Progetta nel grafo']]){
  await page.getByRole('button',{name:button,exact:true}).click();await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();
 }
 expect(errors).toEqual([]);await page.screenshot({path:info.outputPath('build-windows.png'),fullPage:true});
});
test('nessuna riscrittura del modello storico o di altre chiavi al caricamento',async({context,page})=>{
 await context.addInitScript(({key,raw})=>{localStorage.setItem(key,raw);localStorage.setItem('unrelated-test-project','keep');},{key,raw:legacy});
 await ready(page);expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(legacy);
 expect(await page.evaluate(()=>localStorage.getItem('unrelated-test-project'))).toBe('keep');
});
test('CRUD nodi e connessioni, coerenza Vincoli/Impatto, ricaricamento ed export/import',async({page,browser},info)=>{
 await ready(page);await addNode(page,'E2E-SITE','Sede E2E');
 await link(page,'DOC','E2E-SITE','works-at','Medico','Sede E2E');
 let saved=await model(page);const edge=saved.relations.find(r=>r.from==='DOC'&&r.to==='E2E-SITE');expect(edge).toBeTruthy();
 await page.getByRole('button',{name:'04 Impatto',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Notifica email',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'02 Struttura',exact:true}).click();
 await addNode(page,'E2E-RULE','Vincolo E2E','constraint');
 await page.getByRole('button',{name:'03 Vincoli',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Vincolo E2E',exact:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'02 Struttura',exact:true}).click();
 await page.getByRole('textbox',{name:'Nome nodo',exact:true}).fill('Vincolo aggiornato E2E');await page.getByRole('button',{name:'Salva nodo',exact:true}).click();
 await page.getByRole('button',{name:'03 Vincoli',exact:true}).click();await expect(page.getByRole('heading',{name:'Vincolo aggiornato E2E',exact:true}).first()).toBeVisible();
 await page.getByRole('button',{name:'02 Struttura',exact:true}).click();
 await page.getByText('Elenco delle connessioni · '+(await model(page)).relations.length,{exact:true}).click();
 await page.getByRole('button',{name:'DOC works-at E2E-SITE proposed',exact:true}).click();
 await page.getByRole('textbox',{name:'Cardinalità',exact:true}).fill('N:M');await page.getByRole('button',{name:'Salva connessione',exact:true}).click();
 saved=await model(page);expect(saved.relations.find(r=>r.id===edge.id).cardinality).toBe('N:M');
 await page.reload();await expect(page.locator('#blueprint-boot')).toBeHidden();expect((await model(page)).relations.find(r=>r.id===edge.id).cardinality).toBe('N:M');
 const downloading=page.waitForEvent('download');await page.getByRole('button',{name:'Esporta sessione ↓',exact:true}).click();const download=await downloading;
 const exported=info.outputPath('workspace-export.json');await download.saveAs(exported);expect(JSON.parse(readFileSync(exported,'utf8')).model).toEqual(await model(page));
 const isolated=await browser.newContext();const imported=await isolated.newPage();
 try{
  await ready(imported);await imported.locator('input[aria-label="Importa modello Blueprint"]').setInputFiles(exported);
  await expect(imported.getByText('Modello ripristinato e salvato',{exact:true})).toBeVisible();expect(await model(imported)).toEqual(await model(page));
  await imported.reload();await expect(imported.locator('#blueprint-boot')).toBeHidden();expect(await model(imported)).toEqual(await model(page));
 }finally{await isolated.close();}
 await page.getByText('Elenco delle connessioni · '+(await model(page)).relations.length,{exact:true}).click();await page.getByRole('button',{name:'DOC works-at E2E-SITE proposed',exact:true}).click();await page.getByRole('button',{name:'Elimina connessione',exact:true}).click();
 expect((await model(page)).relations.some(r=>r.id===edge.id)).toBe(false);
 await page.getByRole('combobox',{name:'Seleziona elemento',exact:true}).selectOption('E2E-RULE');await page.getByRole('button',{name:'Elimina nodo e collegamenti',exact:true}).click();
 expect((await model(page)).elements.some(e=>e.id==='E2E-RULE')).toBe(false);expect((await model(page)).elements.some(e=>e.id==='E2E-SITE')).toBe(true);
});
test('archivio corrotto e import non valido restano intatti',async({context,page})=>{
 const bad='{archivio-corrotto';
 await context.addInitScript(({key,bad})=>{localStorage.setItem(key,bad);},{key,bad});
 await ready(page);expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(bad);
 await page.locator('input[aria-label="Importa modello Blueprint"]').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"schemaVersion":99}')});
 await expect(page.getByText(/Modello non valido/).first()).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(bad);
});
test('errore di caricamento diagnosticabile in it/en senza perdere il salvataggio',async({context,page},info)=>{
 await context.addInitScript(({key,raw})=>localStorage.setItem(key,raw),{key,raw:legacy});
 await page.route('**/assets/*.js',route=>route.abort());await page.goto('/');
 await expect(page.getByRole('heading',{name:'Blueprint non è riuscito ad avviarsi',exact:true})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(legacy);
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.getByRole('heading',{name:'Blueprint could not start',exact:true})).toBeVisible();
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download diagnostics',exact:true}).click();const d=await pending;const p=info.outputPath('startup-diagnostics.json');await d.saveAs(p);
 const diagnostic=JSON.parse(readFileSync(p,'utf8'));expect(diagnostic.errors.length).toBeGreaterThan(0);expect(JSON.stringify(diagnostic)).not.toContain('Centro medico collettivo');
 await page.getByRole('button',{name:'Italiano',exact:true}).click();await expect(page.getByRole('heading',{name:'Blueprint non è riuscito ad avviarsi',exact:true})).toBeVisible();
});
test('HTML file:// avviato e riaperto su Windows in profilo temporaneo persistente',async({},info)=>{
 const profile=mkdtempSync(join(work,'browser-profile-')),url=pathToFileURL(resolve('Blueprint-apri.html')).href;
 let context;
 try{
  context=await chromium.launchPersistentContext(profile,{headless:true});let page=await context.newPage();const external=[];page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
  await ready(page,url);await addNode(page,'FILE-SAVED','Progetto file persistito');
  const raw=await page.evaluate(k=>localStorage.getItem(k),key);expect(raw).toBeTruthy();expect(external).toEqual([]);
  await page.screenshot({path:info.outputPath('standalone-file-windows.png'),fullPage:true});await context.close();
  context=await chromium.launchPersistentContext(profile,{headless:true});page=await context.newPage();await ready(page,url);
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);expect((await model(page)).elements.some(e=>e.id==='FILE-SAVED')).toBe(true);
 }finally{await context?.close();expect(resolve(profile).startsWith(work+sep)).toBe(true);rmSync(profile,{recursive:true,force:true});}
});
test('browser non compatibile: recupero bilingue invece di pagina bianca',async({context,page})=>{
 await context.addInitScript(()=>Object.defineProperty(window,'structuredClone',{value:undefined,configurable:true}));await page.goto('/');
 await expect(page.getByRole('heading',{name:'Blueprint non è riuscito ad avviarsi',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.getByRole('heading',{name:'Blueprint could not start',exact:true})).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(null);
});
