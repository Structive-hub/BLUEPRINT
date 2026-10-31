import { getElement } from './model.ts';
import type { Blueprint, Element, GraphChange, Kind, Point, Relation, RelationType } from './model.ts';
export const nodeKinds: Kind[]=['entity','function','module','constraint','dimension','question'];
export interface RelationRule { label:string; from:Kind[]; to:Kind[]; propagation:('forward'|'reverse')[]; explanation:string }
const all:Kind[]=[...nodeKinds];
export const relationRules:Record<RelationType,RelationRule>={
 'depends-on':{label:'Dipende da',from:all,to:all,propagation:['reverse'],explanation:'Una modifica alla dipendenza richiede la revisione dei suoi dipendenti.'},
 reads:{label:'Legge',from:['entity','function','module'],to:['entity'],propagation:['reverse'],explanation:'Una modifica ai dati letti può interessare chi li legge.'},
 writes:{label:'Scrive',from:['function','module'],to:['entity'],propagation:['forward','reverse'],explanation:'Scrittore e dati scritti sono accoppiati: un cambiamento richiede revisione dell’altro estremo.'},
 contains:{label:'Contiene',from:['module'],to:all,propagation:['reverse'],explanation:'La modifica di una parte viene riepilogata nel suo contenitore, senza implicare la modifica delle altre parti.'},
 constrains:{label:'Vincola',from:['constraint','question'],to:all,propagation:['forward','reverse'],explanation:'Modificare una regola interessa i suoi destinatari; modificare un destinatario richiede riesame dei vincoli.'},
 notifies:{label:'Notifica',from:['function','module'],to:['entity','function','module'],propagation:['forward'],explanation:'Una modifica all’emittente può interessare il destinatario della notifica.'},
 specializes:{label:'Specializza',from:['entity'],to:['entity'],propagation:['reverse'],explanation:'Una modifica al concetto generale può interessare la sua specializzazione.'},
 'works-at':{label:'Opera presso (associazione)',from:['entity'],to:['entity'],propagation:['forward','reverse'],explanation:'Gli estremi di una associazione sono candidati a revisione reciproca. Non deduce comportamenti specifici.'},
 describes:{label:'Descrive',from:['dimension'],to:all,propagation:['forward','reverse'],explanation:'Dimensione ed elemento descritto devono essere riesaminati insieme.'}
};
export type Port={id:string;direction:'in'|'out';type:RelationType;kind:Kind};
export function portsFor(e:Element):Port[] {
 return Object.entries(relationRules).flatMap(([type,rule])=>[
  ...(rule.from.includes(e.kind)?[{id:'out:'+type,direction:'out' as const,type:type as RelationType,kind:e.kind}]:[]),
  ...(rule.to.includes(e.kind)?[{id:'in:'+type,direction:'in' as const,type:type as RelationType,kind:e.kind}]:[])
 ]);
}
export function ensureGraph(m:Blueprint):Blueprint {
 const n=structuredClone(m);
 n.graph??={version:1,positions:{},changes:[]};
 const counters:Record<string,number>={};
 function depth(id:string,seen=new Set<string>()):number{
  if(seen.has(id))return 0; const next=new Set(seen);next.add(id);
  const deps=n.relations.filter(r=>r.from===id&&r.type==='depends-on'&&n.elements.some(e=>e.id===r.to&&e.kind==='entity'));
  return Math.min(5,deps.length?1+Math.max(...deps.map(r=>depth(r.to,next))):0);
 }
 for(const e of n.elements)if(!n.graph.positions[e.id]){
  const col=e.kind==='entity'?depth(e.id):nodeKinds.indexOf(e.kind)%4;
  const group=e.kind==='entity'?'entity-'+col:e.kind;
  const row=counters[group]??0;counters[group]=row+1;
  n.graph.positions[e.id]={x:60+col*290,y:(e.kind==='entity'?70:850+Math.floor(nodeKinds.indexOf(e.kind)/4)*450)+row*145};
 }
 return n;
}
export function recordChange(m:Blueprint,change:Omit<GraphChange,'id'|'revision'|'timestamp'>):Blueprint {
 const n=ensureGraph(m); n.revision=m.revision+1;
 n.graph!.changes.push({...structuredClone(change),id:'CHANGE-'+crypto.randomUUID(),revision:n.revision,timestamp:new Date().toISOString()});
 return n;
}
function actorName(actor:string){if(!actor.trim())throw Error('Indica l’autore della modifica.');return actor.trim();}
export function createNode(m:Blueprint,input:{id:string;kind:Kind;label:string;description:string},actor:string,position?:Point):Blueprint {
 if(!/^[A-Za-z0-9_-]{1,50}$/.test(input.id)||['__proto__','constructor','prototype'].includes(input.id))throw Error('ID: usa da 1 a 50 lettere, numeri, trattini o underscore.');
 if(m.elements.some(e=>e.id===input.id))throw Error('ID già presente: '+input.id);
 if(!input.label.trim()||!nodeKinds.includes(input.kind))throw Error('Tipo e nome del nodo sono obbligatori.');
 const e:Element={...input,label:input.label.trim(),origin:'explicit',approval:input.kind==='question'?'undefined':'proposed',version:1,provenance:{source:'Editor umano · '+actorName(actor),pointer:'/elements/'+input.id,quote:input.description,method:'Creazione esplicita nell’editor; definizione da revisionare'}};
 const n=ensureGraph(m);n.elements.push(e);
 if(position){if(!validPoint(position))throw Error('Posizione non valida.');n.graph!.positions[e.id]=position;}
 return recordChange(n,{kind:'add-node',actor:actorName(actor),summary:'Creato '+e.label,nodeIds:[e.id],relationIds:[],before:null,after:e});
}
export function editNode(m:Blueprint,id:string,patch:Pick<Element,'label'|'description'|'kind'>,actor:string):Blueprint {
 const before=getElement(m,id);if(!patch.label.trim()||!nodeKinds.includes(patch.kind))throw Error('Tipo e nome del nodo sono obbligatori.');
 const n=ensureGraph(m);const e=getElement(n,id);
 if(before.label===patch.label.trim()&&before.description===patch.description&&before.kind===patch.kind)return m;
 Object.assign(e,patch,{label:patch.label.trim(),approval:patch.kind==='question'?'undefined':'proposed',origin:'explicit',version:before.version+1,provenance:{source:'Editor umano · '+actorName(actor),pointer:'/elements/'+id,quote:patch.description,method:'Modifica umana; fonte precedente conservata nel registro'}});
 // Existing executable bindings must not survive arbitrary semantic edits.
 delete e.rule;
 for(const r of n.relations.filter(r=>r.from===id||r.to===id))validateRelation(n,r,r.id);
 return recordChange(n,{kind:'edit-node',actor:actorName(actor),summary:'Modificato '+e.label+'; approvazione da riesaminare',nodeIds:[id],relationIds:n.relations.filter(r=>r.from===id||r.to===id).map(r=>r.id),before,after:e});
}
export function deleteNode(m:Blueprint,id:string,actor:string):Blueprint{
 const e=getElement(m,id);const removed=m.relations.filter(r=>r.from===id||r.to===id);
 const n=ensureGraph(m);n.elements=n.elements.filter(e=>e.id!==id);n.relations=n.relations.filter(r=>r.from!==id&&r.to!==id);delete n.graph!.positions[id];
 return recordChange(n,{kind:'delete-node',actor:actorName(actor),summary:'Eliminato '+e.label+' e '+removed.length+' relazioni incidenti; contenuti figli conservati',nodeIds:[id,...removed.flatMap(r=>[r.from,r.to]).filter(x=>x!==id)],relationIds:removed.map(r=>r.id),before:{element:e,relations:removed,position:m.graph?.positions[id]},after:null});
}
export function validateRelation(m:Blueprint,r:Pick<Relation,'from'|'to'|'type'>,ignoreId?:string):void{
 const from=getElement(m,r.from),to=getElement(m,r.to);const rule=relationRules[r.type];
 if(!rule)throw Error('Tipo di relazione sconosciuto.');
 if(from.id===to.id)throw Error('Un nodo non può essere collegato a se stesso.');
 if(!rule.from.includes(from.kind)||!rule.to.includes(to.kind))throw Error('Porte incompatibili: '+r.type+' non collega '+from.kind+' a '+to.kind+'.');
 if(m.relations.some(e=>e.id!==ignoreId&&e.from===r.from&&e.to===r.to&&e.type===r.type))throw Error('Questa connessione esiste già.');
 if(r.type==='contains'){
  if(m.relations.some(e=>e.id!==ignoreId&&e.type==='contains'&&e.to===r.to))throw Error('Un elemento può avere un solo contenitore.');
  const children=m.relations.filter(e=>e.type==='contains'&&e.id!==ignoreId);
  const q=[r.to],seen=new Set<string>();
  while(q.length){const id=q.shift()!;if(id===r.from)throw Error('La gerarchia non può contenere cicli.');if(seen.has(id))continue;seen.add(id);q.push(...children.filter(e=>e.from===id).map(e=>e.to));}
 }
}
export function connect(m:Blueprint,input:Pick<Relation,'from'|'to'|'type'> & {rationale?:string;cardinality?:string},actor:string):Blueprint{
 validateRelation(m,input);
 const n=ensureGraph(m);const r:Relation={...input,id:'REL-'+crypto.randomUUID(),origin:'explicit',approval:'proposed',source:'Editor umano · '+actorName(actor),rationale:input.rationale?.trim()||relationRules[input.type].explanation};
 n.relations.push(r);
 return recordChange(n,{kind:'add-relation',actor:actorName(actor),summary:input.from+' —'+input.type+'→ '+input.to,nodeIds:[input.from,input.to],relationIds:[r.id],before:null,after:r});
}
export function connectPorts(m:Blueprint,sourceId:string,sourcePort:string,targetId:string,targetPort:string,actor:string):Blueprint{
 const a=portsFor(getElement(m,sourceId)).find(p=>p.id===sourcePort),b=portsFor(getElement(m,targetId)).find(p=>p.id===targetPort);
 if(!a||!b||a.direction!=='out'||b.direction!=='in'||a.type!==b.type)throw Error('Collega una porta di uscita a una di ingresso dello stesso tipo.');
 return connect(m,{from:sourceId,to:targetId,type:a.type},actor);
}
export function editRelation(m:Blueprint,id:string,patch:Pick<Relation,'from'|'to'|'type'|'rationale'|'cardinality'>,actor:string):Blueprint{
 const before=m.relations.find(r=>r.id===id);if(!before)throw Error('Connessione assente.');
 validateRelation(m,patch,id);
 const n=ensureGraph(m);const after=n.relations.find(r=>r.id===id)!;Object.assign(after,patch,{approval:'proposed',origin:'explicit',source:'Editor umano · '+actorName(actor)});
 return recordChange(n,{kind:'edit-relation',actor:actorName(actor),summary:'Modificata connessione '+id,nodeIds:[...new Set([before.from,before.to,patch.from,patch.to])],relationIds:[id],before,after});
}
export function deleteRelation(m:Blueprint,id:string,actor:string):Blueprint{
 const r=m.relations.find(r=>r.id===id);if(!r)throw Error('Connessione assente.');
 const n=ensureGraph(m);n.relations=n.relations.filter(r=>r.id!==id);
 return recordChange(n,{kind:'delete-relation',actor:actorName(actor),summary:'Eliminata connessione '+r.from+' → '+r.to,nodeIds:[r.from,r.to],relationIds:[id],before:r,after:null});
}
export function validPoint(p:Point){return !!p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.y>=0&&p.x<=20000&&p.y<=20000;}
export function moveNode(m:Blueprint,id:string,point:Point,actor:string):Blueprint{
 getElement(m,id);if(!validPoint(point))throw Error('Posizione non valida.');
 const n=ensureGraph(m),before=n.graph!.positions[id];if(before.x===point.x&&before.y===point.y)return m;
 n.graph!.positions[id]={...point};
 return recordChange(n,{kind:'move-node',actor:actorName(actor),summary:'Spostato il nodo '+id+' sul canvas (nessuna modifica semantica)',nodeIds:[id],relationIds:[],before,after:point});
}
export function childrenOf(m:Blueprint,parent:string|null):Element[]{
 return parent===null?m.elements.filter(e=>!m.relations.some(r=>r.type==='contains'&&r.to===e.id)):m.elements.filter(e=>m.relations.some(r=>r.type==='contains'&&r.from===parent&&r.to===e.id));
}
export function breadcrumb(m:Blueprint,id:string|null):Element[]{
 const result:Element[]=[];let cur=id;const seen=new Set<string>();
 while(cur){if(seen.has(cur))throw Error('Ciclo nella gerarchia.');seen.add(cur);result.unshift(getElement(m,cur));cur=m.relations.find(r=>r.type==='contains'&&r.to===cur)?.from??null;}
 return result;
}

export function trackModelUpdate(before:Blueprint,next:Blueprint,actor:string):Blueprint {
 const n=ensureGraph(next);
 if(n.graph!.changes.at(-1)?.revision===n.revision)return n;
 const nodeIds=[...new Set([...before.elements,...n.elements].map(e=>e.id))].filter(id=>JSON.stringify(before.elements.find(e=>e.id===id))!==JSON.stringify(n.elements.find(e=>e.id===id)));
 const changedRelations=[...new Set([...before.relations,...n.relations].map(e=>e.id))].filter(id=>JSON.stringify(before.relations.find(e=>e.id===id))!==JSON.stringify(n.relations.find(e=>e.id===id)));
 for(const id of changedRelations){for(const r of [before.relations.find(r=>r.id===id),n.relations.find(r=>r.id===id)])if(r)nodeIds.push(r.from,r.to);}
 n.graph!.changes.push({id:'CHANGE-'+crypto.randomUUID(),revision:n.revision,timestamp:new Date().toISOString(),actor,kind:'model-update',summary:'Revisione di definizioni, documento o approvazioni',nodeIds:[...new Set(nodeIds)],relationIds:changedRelations,before:null,after:null});
 return n;
}

export function findFreePosition(m:Blueprint,preferred:Point):Point {
 const positions=Object.values(ensureGraph(m).graph!.positions),w=218,h=96,gap=10;
 for(let row=0;row<60;row++)for(let col=0;col<40;col++){
  const p={x:Math.max(20,Math.round(preferred.x+col*260)),y:Math.max(20,Math.round(preferred.y+row*140))};
  if(!validPoint(p)||p.x>19500||p.y>19500)continue;
  if(positions.every(q=>p.x+w+gap<=q.x||q.x+w+gap<=p.x||p.y+h+gap<=q.y||q.y+h+gap<=p.y))return p;
 }
 throw Error('Nessuno spazio libero vicino alla posizione richiesta.');
}

export function approveRelation(m:Blueprint,id:string,actor:string):Blueprint {
 const before=m.relations.find(r=>r.id===id);if(!before)throw Error('Connessione assente.');
 if(before.approval==='undefined')throw Error('Relazione non definita: specificare prima il comportamento.');
 if(before.approval==='approved')return m;
 const n=ensureGraph(m),r=n.relations.find(r=>r.id===id)!;r.approval='approved';
 const next=recordChange(n,{kind:'edit-relation',actor:actorName(actor),summary:'Approvata connessione '+r.from+' —'+r.type+'→ '+r.to,nodeIds:[r.from,r.to],relationIds:[id],before,after:r});
 next.decisions.push({id:'DEC-'+(next.decisions.length+1),target:id,revision:next.revision,actor:actorName(actor),timestamp:new Date().toISOString(),rationale:'Approvata definizione della relazione mostrata nell’editor.'});
 return next;
}
