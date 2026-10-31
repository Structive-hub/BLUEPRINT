import type { Blueprint, GraphChange, Relation, RelationType } from './model.ts';
import { relationRules } from './graph.ts';
export interface DependencyHop { relationId:string; type:RelationType; from:string; to:string; approval:Relation['approval']; rule:string; historical:boolean }
export interface DependencyImpact { target:string; path:string[]; hops:DependencyHop[]; depth:number; classification:'tracked'|'candidate'; message:string }
export interface DependencyReport { revision:number; seeds:string[]; impacts:DependencyImpact[]; unresolved:string[]; removedSeeds:string[]; reason:string; limit:string }
export function analyzeDependencies(m:Blueprint,seeds:string[],change?:GraphChange):DependencyReport{
 const ids=new Set(m.elements.map(e=>e.id));const unique=[...new Set(seeds)];
 // Deleted/rewired relations remain evidence only for the selected change, so removals
 // do not erase the information needed to analyze their previous neighbors.
 const historical:Relation[]=[];
 if(change?.kind==='delete-relation'||change?.kind==='edit-relation')historical.push(change.before as Relation);
 if(change?.kind==='delete-node')historical.push(...((change.before as {relations:Relation[]})?.relations??[]));
 const edges=[...m.relations.map(r=>({r,historical:false})),...historical.filter(r=>r&&r.type in relationRules&&!m.relations.some(x=>x.id===r.id&&x.from===r.from&&x.to===r.to&&x.type===r.type)).map(r=>({r,historical:true}))];
 const queue=unique.map(id=>({id,path:[id],hops:[] as DependencyHop[],tracked:m.elements.find(e=>e.id===id)?.approval==='approved'}));
 const best=new Map<string,{tracked:boolean;depth:number}>();
 for(const q of queue)best.set(q.id,{tracked:q.tracked,depth:0});
 const results=new Map<string,DependencyImpact>();
 for(let cursor=0;cursor<queue.length;cursor++){
  const item=queue[cursor];
  for(const edge of edges){
   const rule=relationRules[edge.r.type];
   for(const direction of rule.propagation){
    const next=direction==='forward'?(edge.r.from===item.id?edge.r.to:null):(edge.r.to===item.id?edge.r.from:null);
    if(!next||item.path.includes(next))continue;
    const tracked=item.tracked&&edge.r.approval==='approved'&&m.elements.find(e=>e.id===next)?.approval==='approved';
    const depth=item.hops.length+1,previous=best.get(next);
    // Prefer an approved path over a shorter candidate path; otherwise shortest path.
    if(previous&&(previous.tracked||!tracked)&&previous.depth<=depth)continue;
    if(previous?.tracked&&!tracked)continue;
    best.set(next,{tracked,depth});
    const hop:DependencyHop={relationId:edge.r.id,type:edge.r.type,from:item.id,to:next,approval:edge.r.approval,rule:rule.explanation,historical:edge.historical};
    const path=[...item.path,next],hops=[...item.hops,hop];
    queue.push({id:next,path,hops,tracked});
    if(!unique.includes(next)&&ids.has(next))results.set(next,{target:next,path,hops,depth,classification:tracked?'tracked':'candidate',message:tracked?'Dipendenza raggiungibile tramite elementi e relazioni approvati: richiede riesame.':'Dipendenza candidata: almeno un elemento o collegamento del percorso è da revisionare.'});
   }
  }
 }
 const impacts=[...results.values()].sort((a,b)=>a.depth-b.depth||a.target.localeCompare(b.target));
 return {revision:m.revision,seeds:unique,impacts,removedSeeds:unique.filter(id=>!ids.has(id)),unresolved:[...new Set([...unique,...impacts.map(i=>i.target)])].filter(id=>m.elements.find(e=>e.id===id)?.approval==='undefined'),reason:change?change.summary:'Analisi di una modifica ipotizzata sugli elementi selezionati.',limit:'Raggiungibilità deterministica secondo il catalogo delle relazioni. Nessuna deduzione di modifiche al codice, email, calendari o regole di dominio non modellate. È mostrato un percorso rappresentativo per elemento, non tutti i percorsi.'};
}
export function analyzeChange(m:Blueprint,change:GraphChange):DependencyReport{
 if(change.kind==='move-node')return {revision:m.revision,seeds:change.nodeIds,impacts:[],unresolved:[],removedSeeds:[],reason:change.summary,limit:'Solo disposizione grafica: nessuna dipendenza semantica viene invalidata.'};
 return analyzeDependencies(m,change.nodeIds,change);
}
