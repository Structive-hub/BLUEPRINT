import { createEmptyBlueprint } from './interpreter.ts';
import { ensureGraph, nodeKinds, relationRules, validateRelation, validPoint } from './graph.ts';
import { validateDocument } from './model.ts';
import type { Blueprint } from './model.ts';
export const STORAGE_KEY='blueprint.workspace.v1';
export interface StoragePort {getItem(key:string):string|null;setItem(key:string,value:string):void}
export function serializeModel(model:Blueprint):string {return JSON.stringify({format:'blueprint-workspace',version:1,model});}
const object=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x);
const text=(x:unknown)=>typeof x==='string';
const positive=(x:unknown)=>Number.isInteger(x)&&Number(x)>0;
function assert(ok:unknown,message:string):asserts ok {if(!ok)throw Error('Modello non valido: '+message);}
export function restoreModel(input:unknown):Blueprint{
 assert(object(input),'oggetto JSON richiesto');
 if(input.format!==undefined){assert(input.format==='blueprint-workspace'&&input.version===1,'versione archivio non supportata');}
 const raw=object(input.model)?input.model:input;
 assert(raw.schemaVersion===1&&positive(raw.revision),'versione/revisione');
 validateDocument(raw.document);
 assert(Array.isArray(raw.elements)&&raw.elements.length<=1000,'massimo 1000 elementi');
 assert(Array.isArray(raw.relations)&&raw.relations.length<=5000,'massimo 5000 relazioni');
 assert(Array.isArray(raw.decisions)&&typeof raw.multiSite==='boolean','decisioni o indicatore legacy mancanti');
 const m=structuredClone(raw) as unknown as Blueprint;
 const ids=new Set<string>(),relationIds=new Set<string>();
 for(const e of m.elements){
  assert(object(e)&&text(e.id)&&/^[A-Za-z0-9_-]{1,50}$/.test(e.id)&&!['__proto__','constructor','prototype'].includes(e.id)&&!ids.has(e.id),'ID elemento mancante o duplicato');ids.add(e.id);
  assert(nodeKinds.includes(e.kind)&&text(e.label)&&e.label.trim()&&text(e.description)&&positive(e.version),'tipo, nome o versione del nodo');
  assert(['explicit','ai-inference','hypothesis'].includes(e.origin)&&['proposed','approved','undefined'].includes(e.approval),'origine o approvazione');
  assert(object(e.provenance)&&['source','pointer','quote','method'].every(k=>text((e.provenance as unknown as Record<string,unknown>)[k])),'provenienza');
  assert(e.rule===undefined||(text(e.rule)&&e.rule.length>0&&e.rule.length<=120),'binding eseguibile sconosciuto');
 }
 for(const r of m.relations){
  assert(object(r)&&text(r.id)&&!relationIds.has(r.id),'ID relazione duplicato o assente');relationIds.add(r.id);
  assert(ids.has(r.from)&&ids.has(r.to)&&Object.hasOwn(relationRules,r.type),'estremi o tipo della relazione');
  assert(text(r.source)&&text(r.rationale)&&(r.cardinality===undefined||text(r.cardinality)),'metadati relazione');
  assert(['explicit','ai-inference','hypothesis'].includes(r.origin)&&['proposed','approved','undefined'].includes(r.approval),'stato relazione');
  validateRelation(m,r,r.id);
 }
 for(const d of m.decisions)assert(object(d)&&['id','target','actor','timestamp','rationale'].every(k=>text((d as unknown as Record<string,unknown>)[k]))&&positive(d.revision)&&d.revision<=m.revision,'decisione');
 if(m.graph!==undefined){
  assert(object(m.graph)&&m.graph.version===1&&object(m.graph.positions)&&Array.isArray(m.graph.changes)&&m.graph.changes.length<=2000,'stato grafico');
  for(const [id,p] of Object.entries(m.graph.positions))assert(ids.has(id)&&validPoint(p),'posizione');
  const changes=new Set<string>();
  for(const c of m.graph.changes){
   assert(object(c)&&text(c.id)&&!changes.has(c.id)&&positive(c.revision)&&c.revision<=m.revision,'revisione o ID modifica');changes.add(c.id);
   assert(['add-node','edit-node','delete-node','add-relation','edit-relation','delete-relation','move-node','model-update'].includes(c.kind),'tipo modifica');
   assert(text(c.actor)&&text(c.summary)&&text(c.timestamp)&&Array.isArray(c.nodeIds)&&c.nodeIds.every(text)&&Array.isArray(c.relationIds)&&c.relationIds.every(text),'registro modifiche');
   const isHistoricalRelation=(r:unknown)=>object(r)&&text(r.id)&&text(r.from)&&text(r.to)&&typeof r.type==='string'&&Object.hasOwn(relationRules,r.type)&&['approved','proposed','undefined'].includes(String(r.approval));
   if(c.kind==='delete-relation'||c.kind==='edit-relation')assert(isHistoricalRelation(c.before),'relazione storica');
   if(c.kind==='delete-node')assert(object(c.before)&&Array.isArray(c.before.relations)&&c.before.relations.every(isHistoricalRelation),'nodo storico');
   // Historical snapshots are data only; never executed or promoted to current nodes.
  }
 }
 return ensureGraph(m);
}
export function parseModel(raw:string):Blueprint{
 if(raw.length>4_000_000)throw Error('Archivio troppo grande: limite 4 MB.');
 return restoreModel(JSON.parse(raw));
}
export function createRepository(storage:StoragePort,initialModel:()=>Blueprint=createEmptyBlueprint){
 let expected:string|null=null,error:string|null=null,model:Blueprint;
 try{expected=storage.getItem(STORAGE_KEY);model=expected===null?ensureGraph(initialModel()):parseModel(expected);}
 catch(e){error=e instanceof Error?e.message:String(e);model=ensureGraph(initialModel());}
 return {
  model,error,
  recovery:()=>expected,
  save(next:Blueprint,replaceInvalid=false){
   if(error&&!replaceInvalid)throw Error('Archivio non leggibile. Esporta il recupero e ripristina esplicitamente un modello prima di salvare.');
   if(storage.getItem(STORAGE_KEY)!==expected)throw Error('Un’altra scheda ha modificato il progetto: ricarica la pagina prima di salvare. Questa modifica non è stata applicata.');
   const checked=restoreModel(next),raw=serializeModel(checked);
   storage.setItem(STORAGE_KEY,raw);expected=raw;error=null;this.error=null;this.model=checked;
  }
 };
}
