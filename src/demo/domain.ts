import type { Blueprint } from '../core/model.ts';
export interface Appointment { id: string; patientId: string; doctorId: string; serviceId: string; start: string; end: string; siteId?: string }
export interface Email { operationId: string; appointmentId: string; to: string; body: string; afterCommit: boolean }
export interface Clinic {
 patients: { id: string; registered: boolean; email: string }[];
 doctors: { id: string; name: string; specialty: string; services: string[]; sites: string[] }[];
 services: { id: string; name: string; specialty: string }[];
 slots: { doctorId: string; start: string; end: string; siteId: string }[];
 appointments: Appointment[]; emails: Email[]; operations: string[];
}
export type Outcome = { status: 'confirmed' | 'proposed' | 'rejected' | 'blocked'; message: string; state: Clinic; trace: string[] };
export interface MoveCommand { operationId: string; actorId: string; appointmentId: string; start: string; end: string; siteId?: string; confirm: boolean }
export type Implementation = 'correct' | 'bug-email-before-confirm' | 'bug-ignore-overlap';
const bindings: Record<string,string> = {'C-REGISTERED':'registered','C-EMAIL':'email','C-OVERLAP':'overlap'};
const active = (m: Blueprint, id: string) => m.elements.some(e => e.id === id && e.approval === 'approved' && (!bindings[id] || e.rule === bindings[id]));
const overlap = (a: {start:string;end:string}, b: {start:string;end:string}) => Date.parse(a.start) < Date.parse(b.end) && Date.parse(b.start) < Date.parse(a.end);
function validInterval(start: string, end: string) { return Number.isFinite(Date.parse(start)) && Number.isFinite(Date.parse(end)) && Date.parse(start) < Date.parse(end); }
export function fixture(): Clinic {
 return {
 patients: [{id:'p1',registered:true,email:'paziente@example.invalid'},{id:'p2',registered:false,email:'ospite@example.invalid'}],
 doctors: [{id:'d1',name:'Dott.ssa Rossi',specialty:'Cardiologia',services:['visita','controllo'],sites:['centro','nord']},{id:'d2',name:'Dott. Bianchi',specialty:'Cardiologia',services:['visita','controllo'],sites:['centro']}],
 services: [{id:'visita',name:'Visita cardiologica',specialty:'Cardiologia'},{id:'controllo',name:'Controllo cardiologico',specialty:'Cardiologia'}],
 slots: [{doctorId:'d1',start:'2026-11-02T09:00:00+01:00',end:'2026-11-02T13:00:00+01:00',siteId:'centro'},{doctorId:'d1',start:'2026-11-02T09:00:00+01:00',end:'2026-11-02T13:00:00+01:00',siteId:'nord'},{doctorId:'d2',start:'2026-11-02T09:00:00+01:00',end:'2026-11-02T13:00:00+01:00',siteId:'centro'}],
 appointments: [{id:'a1',patientId:'p1',doctorId:'d1',serviceId:'visita',start:'2026-11-02T09:00:00+01:00',end:'2026-11-02T09:30:00+01:00',siteId:'centro'},{id:'a2',patientId:'p1',doctorId:'d1',serviceId:'controllo',start:'2026-11-02T10:00:00+01:00',end:'2026-11-02T10:30:00+01:00',siteId:'centro'}], emails: [], operations: []
 };
}
export function choices(c: Clinic, serviceId: string) { const service = c.services.find(s => s.id === serviceId); return c.doctors.filter(d => d.specialty === service?.specialty && d.services.includes(serviceId)); }
function targetError(c: Clinic, a: Appointment, multiSite: boolean, checkOverlap: boolean): string | undefined {
 if (!validInterval(a.start,a.end)) return 'Intervallo non valido: la fine deve seguire l’inizio.';
 const doctor = c.doctors.find(d => d.id === a.doctorId); const service = c.services.find(s => s.id === a.serviceId);
 if (!doctor || !service || doctor.specialty !== service.specialty || !doctor.services.includes(a.serviceId)) return 'Medico o servizio non compatibile.';
 if (multiSite && (!a.siteId || !doctor.sites.includes(a.siteId))) return 'Sede mancante o non associata al medico.';
 if (!c.slots.some(s => s.doctorId === a.doctorId && (!multiSite || s.siteId === a.siteId) && Date.parse(s.start) <= Date.parse(a.start) && Date.parse(s.end) >= Date.parse(a.end))) return 'Orario fuori dalla disponibilità in agenda.';
 const conflict = c.appointments.find(b => b.id !== a.id && b.doctorId === a.doctorId && overlap(a,b));
 if (checkOverlap && conflict) return 'Sovrapposizione con ' + conflict.id + ': il medico è già occupato, anche se la sede è diversa.';
}
export function move(m: Blueprint, original: Clinic, cmd: MoveCommand, impl: Implementation = 'correct'): Outcome {
 const state = structuredClone(original); const trace: string[] = ['Ricevuta operazione ' + cmd.operationId];
 const result = (status: Outcome['status'], message: string): Outcome => ({status,message,state,trace});
 if (!active(m,'F-MOVE') || !active(m,'C-EMAIL') || !active(m,'C-OVERLAP')) return result('blocked','Prima approvare funzione e contratti email/sovrapposizione. Nessuna regola proposta viene attivata implicitamente.');
 if (state.operations.includes(cmd.operationId)) return result('confirmed','Operazione già confermata: nessun nuovo evento email.');
 const a = state.appointments.find(a => a.id === cmd.appointmentId);
 if (!a) return result('rejected','Appuntamento inesistente.');
 if (!state.doctors.some(d => d.id === cmd.actorId)) return result('rejected','Attore medico inesistente.');
 if (cmd.actorId !== a.doctorId) return result('blocked','NON DEFINITO: il permesso sugli appuntamenti di altri medici richiede una decisione. Nessuna modifica o email.');
 const updated = {...a,start:cmd.start,end:cmd.end,...(m.multiSite ? {siteId:cmd.siteId} : {})};
 function enqueue(afterCommit: boolean) {
  state.emails.push({operationId:cmd.operationId,appointmentId:a!.id,to:state.patients.find(p => p.id === a!.patientId)!.email,body:'Appuntamento spostato al ' + cmd.start,afterCommit});
  trace.push(afterCommit ? 'Email accodata dopo commit' : 'BUG: email accodata prima della validazione/conferma');
 }
 if (impl === 'bug-email-before-confirm') enqueue(false);
 const error = targetError(state,updated,m.multiSite,impl !== 'bug-ignore-overlap');
 if (error) {trace.push('Validazione rifiutata; appuntamento invariato'); return result('rejected',error);}
 trace.push('Disponibilità verificata');
 if (!cmd.confirm) return result('proposed','Proposta valida: manca la conferma, nessuna modifica prevista.');
 state.appointments[state.appointments.indexOf(a)] = updated;
 state.operations.push(cmd.operationId); trace.push('Conferma ricevuta; commit appuntamento');
 if (impl !== 'bug-email-before-confirm') enqueue(true);
 return result('confirmed','Spostamento confermato; evento email generato.');
}
export function book(m: Blueprint, original: Clinic, a: Appointment): Outcome {
 const state = structuredClone(original); const result = (status: Outcome['status'],message: string): Outcome => ({status,message,state,trace:[message]});
 if (!active(m,'F-BOOK') || !active(m,'C-REGISTERED') || !active(m,'C-OVERLAP')) return result('blocked','Approvare funzione prenotazione e contratti registrazione/sovrapposizione.');
 if (!state.patients.some(p => p.id === a.patientId && p.registered)) return result('rejected','Prenotazione rifiutata: il paziente non è registrato.');
 if (state.appointments.some(b => b.id === a.id)) return result('rejected','Identificativo prenotazione già presente.');
 const error = targetError(state,a,m.multiSite,true); if (error) return result('rejected',error);
 state.appointments.push(structuredClone(a)); return result('confirmed','Prenotazione registrata.');
}
export function moveCommand(overrides: Partial<MoveCommand> = {}): MoveCommand {
 return {operationId:'op-demo',actorId:'d1',appointmentId:'a1',start:'2026-11-02T11:00:00+01:00',end:'2026-11-02T11:30:00+01:00',siteId:'nord',confirm:true,...overrides};
}

