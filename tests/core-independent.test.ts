import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createEmptyBlueprint,documentInterpreter} from '../src/core/interpreter.ts';
import {createRepository,parseModel,serializeModel} from '../src/core/persistence.ts';
import {createNode,connect} from '../src/core/graph.ts';
import {analyzeDependencies} from '../src/core/dependencies.ts';
import {validateDocument} from '../src/core/model.ts';
test('il core costruisce e persiste un progetto inventario senza concetti sanitari',()=>{
 const document={schemaVersion:1 as const,title:'Magazzino',objective:'Tracciare scorte',notes:'',requirements:[{id:'STOCK',semantic:'inventory.stock',statement:'Le quantità non devono essere negative.'}]};
 const empty=createEmptyBlueprint(document);assert.equal(empty.elements.length,0);assert.equal(empty.relations.length,0);
 let m=createNode(empty,{id:'PRODUCT',kind:'entity',label:'Prodotto',description:'Articolo'},'Test');
 m=createNode(m,{id:'STOCK',kind:'entity',label:'Scorta',description:'Quantità'},'Test');
 m=connect(m,{from:'STOCK',to:'PRODUCT',type:'depends-on'},'Test');
 m.elements[0].rule='inventory.nonnegative';
 const data=new Map<string,string>(),storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);}};
 const repo=createRepository(storage);assert.equal(repo.model.elements.length,0);repo.save(m);
 const reopened=createRepository(storage);assert.equal(serializeModel(reopened.model),serializeModel(m));
 assert.equal(analyzeDependencies(reopened.model,['PRODUCT']).impacts[0].target,'STOCK');
 assert.ok(!serializeModel(m).includes('Medico'));
});
test('interprete generale conserva requisiti sconosciuti senza inventare un dominio',()=>{
 const d={schemaVersion:1 as const,title:'Biblioteca',objective:'Prestiti',notes:'',requirements:[{id:'LOAN',semantic:'library.loan',statement:'Un prestito ha una scadenza.'}]};
 assert.deepEqual(validateDocument(d),d);const m=documentInterpreter.interpret(d);
 assert.equal(m.elements.length,1);assert.equal(m.elements[0].approval,'undefined');assert.equal(m.relations.length,0);
 assert.deepEqual(parseModel(serializeModel(m)).document,d);
});
test('modello v1 storico importato mantiene chiave, ID, binding e flag legacy',()=>{
 const raw=readFileSync(new URL('../examples/centro-medico-grafo.json',import.meta.url),'utf8');
 const input=JSON.parse(raw),m=parseModel(raw);
 assert.equal(m.schemaVersion,1);assert.equal(m.multiSite,input.model.multiSite);
 assert.deepEqual(m.elements,input.model.elements);assert.deepEqual(m.relations,input.model.relations);assert.deepEqual(m.decisions,input.model.decisions);
 assert.equal(serializeModel(m),serializeModel(parseModel(serializeModel(m))));
});
test('i moduli core non importano demo, app o features',()=>{
 const dir=resolve('src/core');
 for(const name of readdirSync(dir).filter(n=>n.endsWith('.ts'))){
  const source=readFileSync(resolve(dir,name),'utf8');
  assert.doesNotMatch(source,/from\s+['"][^'"]*(?:demo|app|features)\//,name);
  assert.doesNotMatch(source,/registeredBooking|emailAfterConfirmation|C-OVERLAP|Q-COLLEAGUES/,name);
 }
});
