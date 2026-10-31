import { example } from './example.ts';
import {approve} from '../core/model.ts';
import {validateDemoDocument as validateDocument} from './requirements.ts';
import type { Blueprint, Element, InterpreterAdapter, Kind, Semantic } from '../core/model.ts';
export const mockInterpreter: InterpreterAdapter = {
 id: 'mock-deterministico-v1',
 interpret(input) {
  const document = validateDocument(input);
  const m: Blueprint = { schemaVersion: 1, revision: 1, document, elements: [], relations: [], decisions: [], multiSite: false };
  function add(id: string, kind: Kind, label: string, description: string, source?: Semantic, rule?: Element['rule']) {
   const r = document.requirements.find(r => r.semantic === source);
   m.elements.push({ id, kind, label, description, origin: r ? 'explicit' : 'ai-inference', approval: id === 'Q-COLLEAGUES' ? 'undefined' : 'proposed', version: 1, rule,
    provenance: { source: r ? 'Documento requisiti' : mockInterpreter.id, pointer: r ? '/requirements/' + document.requirements.indexOf(r) : '/rules/catalogue-v1', quote: r?.statement ?? description, method: r ? 'Mappatura del codice semantico dichiarato; testo da revisionare' : 'Regola di interpretazione predefinita, senza AI reale' } });
  }
  const has = (s: Semantic) => document.requirements.some(r => r.semantic === s);
  add('MOD-BOOK', 'module', 'Prenotazioni', 'Modulo proposto per coordinare prenotazione e spostamento.');
  add('MOD-AGENDA', 'module', 'Agende', 'Modulo proposto per disponibilità e occupazione.');
  add('MOD-NOTIFY', 'module', 'Notifiche', 'Coda email dimostrativa, senza trasporto SMTP.');
  if (has('registeredBooking')) {
   add('PAT', 'entity', 'Paziente', 'Identità registrata, nessun dato clinico.', 'registeredBooking');
   add('BOOK', 'entity', 'Prenotazione', 'Riferimento a paziente, medico, servizio e intervallo.', 'registeredBooking');
   add('F-BOOK', 'function', 'Prenota online', 'Crea una prenotazione con paziente registrato.', 'registeredBooking');
   add('C-REGISTERED', 'constraint', 'Solo pazienti registrati', 'Una prenotazione richiede un paziente registrato.', 'registeredBooking', 'registered');
  }
  if (has('chooseDoctor')) { add('DOC', 'entity', 'Medico', 'Identità e specialità del professionista.', 'chooseDoctor'); add('SPEC', 'entity', 'Specialità', 'Raggruppa medici fra cui il paziente sceglie.', 'chooseDoctor'); }
  if (has('multipleServices')) add('SERVICE', 'entity', 'Servizio', 'Catalogo di prestazioni senza anamnesi.', 'multipleServices');
  if (has('doctorAgenda')) add('AGENDA', 'entity', 'Agenda', 'Intervalli dimostrativi disponibili per medico.', 'doctorAgenda');
  if (has('moveAppointment')) {
   add('F-MOVE', 'function', 'Sposta appuntamento', 'Proposta → conferma → aggiornamento → coda email.', 'moveAppointment');
   add('C-OVERLAP', 'constraint', 'Nessuna sovrapposizione', 'Inferenza da approvare: un medico non può avere appuntamenti contemporanei, anche fra sedi diverse.', undefined, 'overlap');
  }
  if (has('emailAfterConfirmation')) {
   add('EMAIL', 'entity', 'Notifica email', 'Evento locale generato dopo conferma effettiva.', 'emailAfterConfirmation');
   add('C-EMAIL', 'constraint', 'Email solo dopo conferma', 'Rifiuto e proposta non confermata non generano email. Il contratto tecnico usa un evento per operazione.', 'emailAfterConfirmation', 'email');
  }
  for (const s of ['noReception', 'noPayments', 'noClinicalData'] as const) if (has(s)) add('EX-' + s, 'constraint', { noReception: 'Segreteria esclusa', noPayments: 'Pagamenti esclusi', noClinicalData: 'Dati clinici esclusi' }[s], 'Limite di perimetro: nessuna verifica automatica generale del codice è associata.', s);
  add('Q-COLLEAGUES', 'question', 'Appuntamenti di altri medici', 'NON DEFINITO. Il runtime sospende questa operazione; non è una decisione di divieto.', has('otherDoctorsUndefined') ? 'otherDoctorsUndefined' : undefined);
  add('DIM-TIME', 'dimension', 'Dimensione temporale', 'Intervalli con inizio/fine; durata variabile. Contratto tecnico proposto.');
  add('DIM-ORG', 'dimension', 'Dimensione organizzativa', 'Evoluzione candidata: medico in più sedi. La baseline non afferma che esista una sola sede.');
  m.elements.find(e => e.id === 'DIM-ORG')!.origin = 'hypothesis';
  function link(from: string, type: Blueprint['relations'][number]['type'], to: string, rationale: string, cardinality?: string) {
   if (m.elements.some(e => e.id === from) && m.elements.some(e => e.id === to)) m.relations.push({ id: 'REL-' + (m.relations.length + 1), from, type, to, rationale, cardinality, origin: 'ai-inference', approval: 'proposed', source: mockInterpreter.id });
  }
  for (const id of ['BOOK', 'F-BOOK', 'F-MOVE']) link('MOD-BOOK', 'contains', id, 'Organizzazione tecnica proposta');
  link('MOD-AGENDA', 'contains', 'AGENDA', 'Organizzazione tecnica proposta'); link('MOD-NOTIFY', 'contains', 'EMAIL', 'Organizzazione tecnica proposta');
  link('DOC', 'specializes', 'SPEC', 'Scelta per specialità', 'N:1 (proposta)'); link('AGENDA', 'depends-on', 'DOC', 'L’agenda è associata al medico');
  link('BOOK', 'depends-on', 'AGENDA', 'Prenotare richiede uno slot di agenda'); link('BOOK', 'reads', 'SERVICE', 'La prenotazione identifica un servizio'); link('BOOK', 'reads', 'PAT', 'La prenotazione identifica il paziente');
  link('F-BOOK', 'writes', 'BOOK', 'La funzione crea prenotazioni'); link('F-MOVE', 'writes', 'BOOK', 'La funzione aggiorna prenotazioni'); link('EMAIL', 'depends-on', 'BOOK', 'La notifica descrive lo spostamento confermato'); link('F-MOVE', 'notifies', 'EMAIL', 'Effetto dopo conferma');
  link('C-REGISTERED', 'constrains', 'F-BOOK', 'Prerequisito verificabile'); link('C-OVERLAP', 'constrains', 'F-MOVE', 'Regola proposta di compatibilità'); link('C-EMAIL', 'constrains', 'F-MOVE', 'Contratto sulle notifiche'); link('DIM-TIME', 'describes', 'AGENDA', 'Approfondimento temporale'); link('DIM-ORG', 'describes', 'DOC', 'Approfondimento organizzativo'); link('Q-COLLEAGUES', 'constrains', 'F-MOVE', 'Decisione mancante');
  for (const r of document.requirements.filter(r => r.semantic === 'unmapped')) m.elements.push({ id: 'UNMAPPED-' + r.id, kind: 'question', label: r.id, description: r.statement, origin: 'explicit', approval: 'undefined', version: 1, provenance: { source: 'Documento requisiti', pointer: '/requirements/' + document.requirements.indexOf(r), quote: r.statement, method: 'Contenuto conservato, non interpretato' } });
  return m;
 }
};
export function createBaseline(): Blueprint {
 let m = mockInterpreter.interpret(example);
 // Only the immutable built-in example inherits confirmation from the actual user request.
 for (const e of m.elements.filter(e => e.origin === 'explicit' && e.approval !== 'undefined')) m = approve(m, e.id, 'Utente · richiesta 29/10/2026', 'Fatto esplicito confermato nella richiesta di questo prototipo.');
 return m;
}
