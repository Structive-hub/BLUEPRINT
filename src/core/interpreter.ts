import {validateDocument} from './model.ts';
import type {Blueprint,InterpreterAdapter,RequirementsDocument} from './model.ts';
export function createEmptyBlueprint(document:RequirementsDocument={schemaVersion:1,title:'Nuovo progetto',objective:'',notes:'',requirements:[]}):Blueprint{
 return {schemaVersion:1,revision:1,document:validateDocument(document),elements:[],relations:[],decisions:[],multiSite:false};
 // multiSite is a preserved v1 compatibility field. The core assigns no domain behavior.
}
export const documentInterpreter:InterpreterAdapter={
 id:'structured-document-v1',
 interpret(input){
  const m=createEmptyBlueprint(input);
  m.elements=m.document.requirements.map((r,index)=>({
   id:'REQ-'+r.id.slice(0,36)+'-'+index,kind:'question' as const,label:r.id,description:r.statement,origin:'explicit' as const,approval:'undefined' as const,version:1,
   provenance:{source:'Documento requisiti',pointer:'/requirements/'+index,quote:r.statement,method:'Requisito conservato senza inferire concetti del dominio.'}
  }));
  return m;
 }
};
export function approveStructure(m: Blueprint, actor: string): Blueprint {
 if (!actor.trim()) throw new Error('Indicare autore.');
 if (m.relations.every(r => r.approval === 'approved')) return m;
 const n = structuredClone(m); n.revision++;
 for (const r of n.relations) r.approval = 'approved';
 n.decisions.push({ id: 'DEC-' + (n.decisions.length + 1), target: 'RELATIONS', revision: n.revision, actor, timestamp: new Date().toISOString(), rationale: 'Approvata la topologia delle relazioni mostrata in struttura; i singoli elementi mantengono il proprio stato.' }); return n;
}
