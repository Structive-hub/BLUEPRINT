import type { Blueprint } from '../core/model.ts';
import { fixture, move, moveCommand } from './domain.ts';
import type { Clinic, Implementation, MoveCommand, Outcome } from './domain.ts';
export interface Verification {
 id: string; constraint: string; title: string; status: 'pass' | 'fail' | 'blocked';
 message: string; modelRevision: number; implementation: Implementation;
 source: { pointer: string; quote: string }; binding: string;
 proof: { command: MoveCommand; before: Clinic; after: Clinic; outcome: Outcome['status']; trace: string[]; expected: string; actual: string };
}
// Independent oracle: does not call the implementation's overlap/notification helpers.
export function verify(m: Blueprint, implementation: Implementation): Verification[] {
 const scenarios: {id:string;constraint:string;title:string;cmd:MoveCommand;expected:string;check:(before:Clinic,r:Outcome)=>boolean;actual:(r:Outcome)=>string}[] = [
  {id:'V-EMAIL-REJECT',constraint:'C-EMAIL',title:'Spostamento rifiutato: zero email',cmd:moveCommand({start:'2026-11-02T10:00:00+01:00',end:'2026-11-02T10:30:00+01:00'}),expected:'Appuntamento invariato; spostamento rifiutato; 0 email.',
   check:(b,r)=>r.status==='rejected' && JSON.stringify(b.appointments)===JSON.stringify(r.state.appointments) && r.state.emails.length===0,actual:r=>r.status+'; email='+r.state.emails.length},
  {id:'V-EMAIL-PROPOSAL',constraint:'C-EMAIL',title:'Proposta senza conferma: zero email',cmd:moveCommand({confirm:false}),expected:'Appuntamento invariato; sola proposta; 0 email.',
   check:(b,r)=>r.status==='proposed' && JSON.stringify(b.appointments)===JSON.stringify(r.state.appointments) && r.state.emails.length===0,actual:r=>r.status+'; email='+r.state.emails.length},
  {id:'V-EMAIL-CONFIRM',constraint:'C-EMAIL',title:'Conferma: aggiornamento prima della email',cmd:moveCommand(),expected:'Nuovo orario 11:00; 1 email a p1 dopo commit.',
   check:(_b,r)=>r.status==='confirmed' && Date.parse(r.state.appointments[0].start)===Date.parse('2026-11-02T11:00:00+01:00') && r.state.emails.length===1 && r.state.emails[0].to==='paziente@example.invalid' && r.trace.indexOf('Conferma ricevuta; commit appuntamento')>=0 && r.trace.indexOf('Email accodata dopo commit')>r.trace.indexOf('Conferma ricevuta; commit appuntamento'),actual:r=>r.status+'; email='+r.state.emails.length+'; dopo commit='+r.state.emails[0]?.afterCommit},
  {id:'V-OVERLAP',constraint:'C-OVERLAP',title:'Conflitto del medico, anche fra sedi',cmd:moveCommand({start:'2026-11-02T10:00:00+01:00',end:'2026-11-02T10:30:00+01:00'}),expected:'a1 resta alle 09:00, a2 alle 10:00; rifiuto senza sovrapposizioni.',
   check:(b,r)=>r.status==='rejected' && JSON.stringify(b.appointments)===JSON.stringify(r.state.appointments),actual:r=>r.status+'; a1='+r.state.appointments[0].start+'; a2='+r.state.appointments[1].start}
 ];
 return scenarios.map(s=>{
  const before=fixture(); const result=move(m,before,s.cmd,implementation);
  // A confirmed occupied slot violates the prerequisite, not the email ordering rule.
  const constraint=s.id==='V-EMAIL-REJECT' && result.status==='confirmed' ? 'C-OVERLAP' : s.constraint;
  const e=m.elements.find(e=>e.id===constraint);
  const blocked=result.status==='blocked' || e?.approval!=='approved';
  const ok=s.check(before,result);
  return {id:s.id,constraint,title:s.title,status:blocked?'blocked':ok?'pass':'fail',modelRevision:m.revision,implementation,
   message:blocked?'Non eseguito: approvare funzione e contratti necessari.':ok?'Contratto rispettato in questo scenario.':'Violazione '+constraint+': '+s.expected+' Osservato: '+s.actual(result)+'.',
   source:{pointer:e?.provenance.pointer??'',quote:e?.provenance.quote??''},binding:'src/demo/domain.ts → move(); oracolo indipendente in src/demo/verification.ts',
   proof:{command:s.cmd,before,after:result.state,outcome:result.status,trace:result.trace,expected:s.expected,actual:s.actual(result)}
  };
 });
}

