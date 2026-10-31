import test from 'node:test';
import assert from 'node:assert/strict';
import {createBaseline} from '../src/demo/interpreter.ts';
import {approveStructure} from '../src/core/interpreter.ts';
import {approve} from '../src/core/model.ts';
import type {Blueprint,Element} from '../src/core/model.ts';
import {analyzeChange,analyzeDependencies} from '../src/core/impact.ts';
import {approveRelation,breadcrumb,childrenOf,connect,connectPorts,createNode,deleteNode,deleteRelation,editNode,editRelation,ensureGraph,findFreePosition,moveNode,portsFor} from '../src/core/graph.ts';
import {createRepository,parseModel,restoreModel,serializeModel,STORAGE_KEY} from '../src/core/persistence.ts';
import {fixture,move,moveCommand} from '../src/demo/domain.ts';
const actor='Fixture incremento 1';
const base=()=>ensureGraph(createBaseline());
const site=(m:Blueprint)=>createNode(m,{id:'SITE',kind:'entity',label:'Sede',description:'Luogo organizzativo, senza regole mediche automatiche.'},actor,{x:900,y:450});
class MemoryStorage {
 data=new Map<string,string>();fail=false;
 getItem(k:string){return this.data.get(k)??null;}
 setItem(k:string,v:string){if(this.fail)throw Error('QuotaExceededError');this.data.set(k,v);}
}
test('creazione immutabile con origine esplicita, proposta e traccia',()=>{
 const m=base(),n=site(m);assert.equal(m.elements.some(e=>e.id==='SITE'),false);
 const e=n.elements.find(e=>e.id==='SITE')!;assert.equal(e.origin,'explicit');assert.equal(e.approval,'proposed');assert.equal(n.revision,m.revision+1);
 assert.equal(n.graph?.changes.at(-1)?.kind,'add-node');assert.deepEqual(n.graph?.positions.SITE,{x:900,y:450});
 assert.throws(()=>site(n),/già presente/);assert.throws(()=>createNode(m,{id:'__proto__',kind:'entity',label:'x',description:''},actor),/ID/);
});
test('porte: direzione e tipo devono coincidere; estremi compatibili',()=>{
 const m=site(base());assert.ok(portsFor(m.elements.find(e=>e.id==='DOC')!).some(p=>p.id==='out:works-at'));
 const n=connectPorts(m,'DOC','out:works-at','SITE','in:works-at',actor);assert.equal(n.relations.at(-1)?.type,'works-at');
 assert.throws(()=>connectPorts(m,'DOC','out:works-at','SITE','in:depends-on',actor),/stesso tipo/);
 assert.throws(()=>connectPorts(m,'DOC','in:works-at','SITE','in:works-at',actor),/uscita/);
 assert.throws(()=>connect(m,{from:'PAT',to:'SITE',type:'writes'},actor),/incompatibili/);
 assert.throws(()=>connect(n,{from:'DOC',to:'SITE',type:'works-at'},actor),/esiste già/);
 assert.throws(()=>connect(m,{from:'SITE',to:'SITE',type:'depends-on'},actor),/se stesso/);
 assert.throws(()=>connect(m,{from:'missing',to:'SITE',type:'depends-on'},actor),/assente/);
});
test('modifica nodo invalida approvazione e binding, conserva versione e fonte precedente',()=>{
 const m=approve(base(),'C-OVERLAP',actor,'Test');
 const n=editNode(m,'C-OVERLAP',{kind:'constraint',label:'Disponibilità alternativa',description:'Nuova regola non implementata'},actor);
 const e=n.elements.find(e=>e.id==='C-OVERLAP')!;
 assert.equal(e.approval,'proposed');assert.equal(e.rule,undefined);assert.equal(e.origin,'explicit');assert.ok(e.version>m.elements.find(e=>e.id===e.id)!.version);
 assert.equal((n.graph?.changes.at(-1)?.before as Element).rule,'overlap');
 const reapproved=approve(n,'C-OVERLAP',actor,'Nuova regola approvata, ma senza binding');
 assert.equal(move(reapproved,fixture(),moveCommand()).status,'blocked');
});
test('non permette cambio di tipo che invalidi connessioni esistenti',()=>{
 const m=base();assert.throws(()=>editNode(m,'DOC',{kind:'constraint',label:'x',description:'x'},actor),/incompatibili/);
 assert.equal(m.elements.find(e=>e.id==='DOC')?.kind,'entity');
});
test('modifica relazione aggiorna tipo, cardinalità e fonte; cancellazione lascia traccia',()=>{
 let m=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor);const id=m.relations.at(-1)!.id;
 m=editRelation(m,id,{from:'DOC',to:'SITE',type:'depends-on',rationale:'Dipendenza esplicita',cardinality:'N:M'},actor);
 assert.equal(m.relations.at(-1)?.type,'depends-on');assert.equal(m.relations.at(-1)?.approval,'proposed');
 assert.equal(m.relations.at(-1)?.cardinality,'N:M');
 const n=deleteRelation(m,id,actor);assert.ok(!n.relations.some(r=>r.id===id));assert.equal(n.graph?.changes.at(-1)?.kind,'delete-relation');
});
test('cancellazione nodo rimuove solo archi incidenti, non i figli o gli audit',()=>{
 const m=base(),n=deleteNode(m,'MOD-BOOK',actor);
 assert.ok(!n.elements.some(e=>e.id==='MOD-BOOK'));assert.ok(n.elements.some(e=>e.id==='BOOK'));
 assert.ok(!n.relations.some(r=>r.from==='MOD-BOOK'||r.to==='MOD-BOOK'));assert.ok(n.decisions.length>0);
 assert.ok(childrenOf(n,null).some(e=>e.id==='BOOK'));assert.ok(!n.graph?.positions['MOD-BOOK']);
});
test('gerarchia navigabile: contenitore unico e nessun ciclo',()=>{
 let m=createNode(base(),{id:'ROOT',kind:'module',label:'Sistema',description:''},actor);
 m=connect(m,{from:'ROOT',to:'MOD-BOOK',type:'contains'},actor);
 assert.deepEqual(breadcrumb(m,'MOD-BOOK').map(e=>e.id),['ROOT','MOD-BOOK']);
 assert.ok(childrenOf(m,'MOD-BOOK').some(e=>e.id==='BOOK'));
 assert.throws(()=>connect(m,{from:'MOD-BOOK',to:'ROOT',type:'contains'},actor),/cicli/);
 assert.throws(()=>connect(m,{from:'MOD-AGENDA',to:'BOOK',type:'contains'},actor),/solo contenitore/);
});
test('spostamento grafico persistibile, senza impatti semantici',()=>{
 const m=base(),n=moveNode(m,'DOC',{x:1220,y:420},actor);
 assert.deepEqual(n.graph?.positions.DOC,{x:1220,y:420});assert.deepEqual(n.elements,m.elements);
 assert.deepEqual(analyzeChange(n,n.graph!.changes.at(-1)!).impacts,[]);
 assert.throws(()=>moveNode(m,'DOC',{x:NaN,y:10},actor),/non valida/);
});
test('Sede collegata a Medico: risultati ricavati dalle dipendenze del modello',()=>{
 const m=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor);
 const r=analyzeChange(m,m.graph!.changes.at(-1)!);
 assert.deepEqual(r.impacts.find(i=>i.target==='EMAIL')?.path,['DOC','AGENDA','BOOK','EMAIL']);
 for(const id of ['AGENDA','BOOK','EMAIL'])assert.ok(r.impacts.some(i=>i.target===id));
 assert.ok(r.impacts.every(i=>i.classification==='candidate'));
 assert.ok(!m.multiSite);assert.match(r.limit,/Nessuna deduzione/);
});
test('motore indipendente da nomi, ID e dominio: rinomina completa conserva la topologia',()=>{
 const source=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor);
 const mapping=new Map(source.elements.map((e,i)=>[e.id,'X'+i]));
 const m=structuredClone(source);m.elements=m.elements.map(e=>({...e,id:mapping.get(e.id)!,label:'Concetto '+mapping.get(e.id)}));
 m.relations=m.relations.map(r=>({...r,from:mapping.get(r.from)!,to:mapping.get(r.to)!}));
 const r=analyzeDependencies(m,[mapping.get('SITE')!]);
 assert.deepEqual(r.impacts.find(i=>i.target===mapping.get('EMAIL'))?.path,['SITE','DOC','AGENDA','BOOK','EMAIL'].map(id=>mapping.get(id)));
});
test('rimozione di una dipendenza cambia i risultati; nessun esito predefinito',()=>{
 let m=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor);
 const id=m.relations.find(r=>r.from==='BOOK'&&r.to==='AGENDA')!.id;
 m=deleteRelation(m,id,actor);
 assert.ok(!analyzeDependencies(m,['SITE']).impacts.some(i=>i.target==='BOOK'||i.target==='EMAIL'));
});
test('analisi di una cancellazione conserva evidenza degli archi storici',()=>{
 const m=base(),n=deleteNode(m,'DOC',actor),r=analyzeChange(n,n.graph!.changes.at(-1)!);
 assert.ok(r.removedSeeds.includes('DOC'));assert.ok(r.seeds.includes('AGENDA'));assert.ok(r.impacts.some(i=>i.target==='BOOK'));
 const o=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor),edge=o.relations.at(-1)!;
 const d=deleteRelation(o,edge.id,actor);assert.ok(analyzeChange(d,d.graph!.changes.at(-1)!).impacts.some(i=>i.target==='AGENDA'));
});
test('cicli di dipendenza terminano e non duplicano risultati',()=>{
 let m=site(base());m=connect(m,{from:'SITE',to:'DOC',type:'depends-on'},actor);m=connect(m,{from:'DOC',to:'SITE',type:'depends-on'},actor);
 const r=analyzeDependencies(m,['SITE']);assert.equal(new Set(r.impacts.map(i=>i.target)).size,r.impacts.length);assert.ok(r.impacts.length<m.elements.length);
});
test('classificazione dipende dalle approvazioni del percorso, non da etichette certe predefinite',()=>{
 const m=approveStructure(base(),actor);const r=analyzeDependencies(m,['DOC']);assert.equal(r.impacts.find(i=>i.target==='EMAIL')?.classification,'tracked');
 const n=structuredClone(m);n.relations.find(r=>r.from==='BOOK'&&r.to==='AGENDA')!.approval='proposed';
 assert.equal(analyzeDependencies(n,['DOC']).impacts.find(i=>i.target==='EMAIL')?.classification,'candidate');
});
test('local storage: modello, layout, modifiche e approvazioni sopravvivono a una nuova sessione',()=>{
 const storage=new MemoryStorage(),repo=createRepository(storage,base);
 const m=connect(site(repo.model),{from:'DOC',to:'SITE',type:'works-at'},actor);repo.save(m);
 const reopened=createRepository(storage,base);assert.equal(reopened.error,null);assert.equal(serializeModel(reopened.model),serializeModel(m));
 assert.equal(serializeModel(parseModel(serializeModel(m))),serializeModel(m));
});
test('migrazione del prototipo v0 aggiunge layout senza alterare elementi e relazioni',()=>{
 const old=createBaseline(),m=restoreModel(JSON.parse(JSON.stringify(old)));
 assert.equal(JSON.stringify(m.elements),JSON.stringify(old.elements));assert.equal(JSON.stringify(m.relations),JSON.stringify(old.relations));assert.equal(m.graph?.version,1);
});
test('dati corrotti preservati: niente sovrascrittura automatica',()=>{
 const storage=new MemoryStorage();storage.setItem(STORAGE_KEY,'{malformed');const repo=createRepository(storage,base);
 assert.ok(repo.error);assert.throws(()=>repo.save(site(repo.model)),/non leggibile/);assert.equal(storage.getItem(STORAGE_KEY),'{malformed');
 assert.equal(repo.recovery(),'{malformed');repo.save(base(),true);assert.equal(createRepository(storage,base).error,null);
});
test('conflitto fra schede impedisce sovrascrittura silenziosa',()=>{
 const storage=new MemoryStorage(),a=createRepository(storage,base),b=createRepository(storage,base);
 a.save(site(a.model));assert.throws(()=>b.save(moveNode(b.model,'DOC',{x:20,y:20},actor)),/altra scheda|altra|Un’altra/);
 assert.ok(createRepository(storage,base).model.elements.some(e=>e.id==='SITE'));
});
test('quota esaurita: versione salvata intatta e errore esplicito',()=>{
 const storage=new MemoryStorage(),repo=createRepository(storage,base);repo.save(repo.model);const before=storage.getItem(STORAGE_KEY);storage.fail=true;
 assert.throws(()=>repo.save(site(repo.model)),/Quota/);assert.equal(storage.getItem(STORAGE_KEY),before);
});
test('import rifiuta riferimenti mancanti, tipi incompatibili, layout e storico corrotti',()=>{
 const m=base();const dangling=structuredClone(m);dangling.relations[0].to='unknown';assert.throws(()=>restoreModel(dangling));
 const duplicate=structuredClone(m);duplicate.elements.push(duplicate.elements[0]);assert.throws(()=>restoreModel(duplicate));
 const bad=structuredClone(m);bad.graph!.positions.DOC.x=Infinity;assert.throws(()=>restoreModel(bad),/posizione/);
 const deleted=deleteNode(m,'DOC',actor);(deleted.graph!.changes.at(-1)!.before as {relations:unknown}).relations=42;assert.throws(()=>restoreModel(deleted),/storico/);
 assert.throws(()=>restoreModel({format:'blueprint-workspace',version:99,model:m}),/versione/);
});


test('nuovi nodi collocati in spazio libero: nessuna porta coperta da sovrapposizioni iniziali',()=>{ const m=base(),p=findFreePosition(m,{x:60,y:180}); for(const q of Object.values(m.graph!.positions))assert.ok(p.x+218<=q.x||q.x+218<=p.x||p.y+96<=q.y||q.y+96<=p.y); });


test('approvazione di una connessione conserva origine e crea decisione audit',()=>{ const m=connect(site(base()),{from:'DOC',to:'SITE',type:'works-at'},actor),id=m.relations.at(-1)!.id,n=approveRelation(m,id,actor); assert.equal(n.relations.at(-1)?.approval,'approved'); assert.equal(n.relations.at(-1)?.origin,'explicit');assert.equal(m.relations.at(-1)?.approval,'proposed'); assert.equal(n.decisions.at(-1)?.target,id); assert.equal(approveRelation(n,id,actor),n); });
