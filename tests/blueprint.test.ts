import test from 'node:test';
import assert from 'node:assert/strict';
import {createBaseline,mockInterpreter} from '../src/demo/interpreter.ts';
import {approveStructure} from '../src/core/interpreter.ts';
import { approve, getElement } from '../src/core/model.ts';
import {validateDemoDocument as validateDocument} from '../src/demo/requirements.ts';
import { example } from '../src/demo/example.ts';
import { applyMultiSite, proposeMultiSite } from '../src/demo/legacy-impact.ts';
import { fixture, move, moveCommand, book, choices } from '../src/demo/domain.ts';
import { verify } from '../src/demo/verification.ts';
function ready() { return approve(createBaseline(),'C-OVERLAP','Fixture test (consenso simulato)','Accettata regola di non sovrapposizione per questo test.'); }
function multi() { const m=approveStructure(ready(),'Fixture test (consenso simulato)'); return applyMultiSite(m,proposeMultiSite(m),'Fixture test (consenso simulato)'); }
test('mappatura deterministica e provenienza puntuale',()=>{
 const a=mockInterpreter.interpret(example); assert.deepEqual(a,mockInterpreter.interpret(example));
 assert.equal(getElement(a,'C-EMAIL').provenance.pointer,'/requirements/5');
 assert.equal(getElement(a,'C-OVERLAP').origin,'ai-inference');
 assert.equal(getElement(a,'DIM-ORG').origin,'hypothesis');
});
test('documenti importati non ereditano approvazioni e metadati non fidati',()=>{
 const a=mockInterpreter.interpret({...example, decisions:[{target:'C-OVERLAP'}]} as typeof example);
 assert.ok(a.elements.every(e=>e.approval!=='approved')); assert.equal(a.decisions.length,0);
});
test('schema rifiuta duplicati, codici sconosciuti e conserva contenuto non mappato',()=>{
 assert.throws(()=>validateDocument({...example,requirements:[example.requirements[0],example.requirements[0]]}),/duplicato/);
 assert.throws(()=>validateDocument({...example,requirements:[{id:'x',semantic:'inventa',statement:'x'}]}),/non validi/);
 const m=mockInterpreter.interpret({...example,requirements:[{id:'x',semantic:'unmapped',statement:'Testo libero non interpretato'}]}); assert.equal(getElement(m,'UNMAPPED-x').approval,'undefined');
});
test('fatti confermati distinti dalle inferenze e dalla questione aperta',()=>{
 const m=createBaseline(); assert.equal(getElement(m,'C-EMAIL').approval,'approved'); assert.equal(getElement(m,'C-OVERLAP').approval,'proposed');
 assert.equal(getElement(m,'Q-COLLEAGUES').approval,'undefined');
 assert.throws(()=>approve(m,'Q-COLLEAGUES','x','x'),/non definita/);
});
test('approvazione immutabile, versionata, motivata e idempotente',()=>{
 const m=createBaseline(); const n=approve(m,'C-OVERLAP','Revisore','Confermo il vincolo.');
 assert.equal(getElement(m,'C-OVERLAP').approval,'proposed'); assert.equal(n.revision,m.revision+1);
 assert.equal(n.decisions.at(-1)?.actor,'Revisore'); assert.equal(getElement(n,'C-OVERLAP').origin,'ai-inference');
 assert.equal(approve(n,'C-OVERLAP','Revisore','Ripetizione'),n); assert.throws(()=>approve(m,'C-OVERLAP','','x'));
});
test('runtime e verifiche restano bloccati per contratti non approvati',()=>{
 assert.equal(move(createBaseline(),fixture(),moveCommand()).status,'blocked');
 assert.ok(verify(createBaseline(),'correct').every(v=>v.status==='blocked'));
});
test('catena impatti deriva dal grafo; certezza richiede relazioni approvate',()=>{
 const m=ready(); const p=proposeMultiSite(m); assert.ok(p.impacts.filter(i=>i.target==='AGENDA'||i.target==='BOOK').every(i=>i.certainty==='possible'));
 const n=approveStructure(m,'Revisore'); const impacts=proposeMultiSite(n).impacts;
 assert.deepEqual(impacts.find(i=>i.target==='EMAIL')?.path,['DOC','AGENDA','BOOK','EMAIL']);
 assert.equal(impacts.find(i=>i.target==='EMAIL')?.certainty,'possible'); assert.equal(impacts.find(i=>i.target==='BOOK')?.certainty,'certain');
 const broken=structuredClone(n); broken.relations=broken.relations.filter(r=>!(r.from==='BOOK'&&r.to==='AGENDA'));
 assert.ok(!proposeMultiSite(broken).impacts.some(i=>i.target==='EMAIL'));
});
test('proposta multisede non muta il modello; applicazione richiede revisione corrente',()=>{
 const m=approveStructure(ready(),'Revisore'); const p=proposeMultiSite(m); assert.equal(m.multiSite,false);
 assert.throws(()=>applyMultiSite({...m,revision:m.revision+1},p,'Revisore'),/obsoleta/);
 const n=applyMultiSite(m,p,'Revisore'); assert.equal(n.multiSite,true); assert.equal(m.multiSite,false);
 assert.equal(n.relations.find(r=>r.type==='works-at')?.cardinality,'N:M'); assert.equal(getElement(n,'Q-COLLEAGUES').approval,'undefined');
});
test('preno online: due medici della stessa specialità e più servizi',()=>{
 const m=ready(); const c=fixture(); assert.equal(c.services.length,2); assert.equal(choices(c,'visita').length,2);
 const r=book(m,c,{id:'a3',patientId:'p1',doctorId:'d2',serviceId:'visita',start:'2026-11-02T11:00:00+01:00',end:'2026-11-02T11:30:00+01:00'});
 assert.equal(r.status,'confirmed'); assert.equal(c.appointments.length,2); assert.equal(r.state.appointments.length,3);
});
test('paziente non registrato rifiutato senza mutazioni',()=>{
 const c=fixture(); const r=book(ready(),c,{...c.appointments[0],id:'a3',patientId:'p2',start:'2026-11-02T11:00:00+01:00',end:'2026-11-02T11:30:00+01:00'});
 assert.equal(r.status,'rejected'); assert.match(r.message,/non è registrato/); assert.deepEqual(r.state,c);
});
test('proposta non confermata: nessuna mutazione e nessuna email',()=>{
 const c=fixture(); const r=move(ready(),c,moveCommand({confirm:false})); assert.equal(r.status,'proposed'); assert.deepEqual(r.state,c);
});
test('conferma: commit prima email e replay senza duplicati',()=>{
 const m=ready(); const c=fixture(); const r=move(m,c,moveCommand()); assert.equal(r.status,'confirmed'); assert.equal(r.state.emails.length,1);
 assert.ok(r.trace.indexOf('Email accodata dopo commit')>r.trace.indexOf('Conferma ricevuta; commit appuntamento'));
 assert.equal(move(m,r.state,moveCommand()).state.emails.length,1); assert.equal(c.emails.length,0);
});
test('permesso colleghi non definito: blocco senza inventare autorizzazioni',()=>{
 const c=fixture(); const r=move(ready(),c,moveCommand({actorId:'d2'})); assert.equal(r.status,'blocked'); assert.match(r.message,/NON DEFINITO/); assert.deepEqual(r.state,c);
});
test('conflitto fra sedi rifiutato e sede obbligatoria dopo approvazione',()=>{
 const m=multi(); const c=fixture();
 const r=move(m,c,moveCommand({start:'2026-11-02T10:00:00+01:00',end:'2026-11-02T10:30:00+01:00',siteId:'nord'}));
 assert.equal(r.status,'rejected'); assert.match(r.message,/Sovrapposizione/); assert.deepEqual(r.state,c);
 assert.match(move(m,c,moveCommand({siteId:undefined})).message,/Sede mancante/);
 assert.equal(move(m,c,moveCommand({siteId:'nord'})).state.appointments[0].siteId,'nord');
});
test('intervalli adiacenti consentiti; intervalli invalidi e fuori agenda rifiutati',()=>{
 const m=ready(); const c=fixture();
 assert.equal(move(m,c,moveCommand({start:'2026-11-02T10:30:00+01:00',end:'2026-11-02T11:00:00+01:00'})).status,'confirmed');
 assert.equal(move(m,c,moveCommand({end:'2026-11-02T10:30:00+01:00'})).status,'rejected');
 assert.equal(move(m,c,moveCommand({start:'2026-11-02T14:00:00+01:00',end:'2026-11-02T14:30:00+01:00'})).status,'rejected');
});
test('oracolo: versione corretta rispetta gli scenari',()=>assert.ok(verify(multi(),'correct').every(r=>r.status==='pass')));
test('controllo negativo reale: email anticipata rilevata con prova',()=>{
 const reports=verify(multi(),'bug-email-before-confirm'); const violation=reports.find(r=>r.id==='V-EMAIL-REJECT')!;
 assert.equal(violation.status,'fail'); assert.equal(violation.proof.after.emails.length,1); assert.equal(violation.proof.outcome,'rejected');
 assert.match(violation.message,/Violazione C-EMAIL/); assert.ok(violation.proof.trace.some(t=>t.startsWith('BUG')));
});
test('controllo negativo reale: sovrapposizione ignorata rilevata',()=>{
 assert.equal(verify(multi(),'bug-ignore-overlap').find(r=>r.id==='V-OVERLAP')?.status,'fail');
 assert.equal(verify(multi(),'bug-ignore-overlap').find(r=>r.id==='V-EMAIL-REJECT')?.constraint,'C-OVERLAP');
});

test('relazioni approvate non promuovono nodi importati a fatti confermati',()=>{ const m=approveStructure(mockInterpreter.interpret(example),'Fixture test'); const p=proposeMultiSite(m); assert.ok(p.impacts.filter(i=>i.target==='AGENDA'||i.target==='BOOK').every(i=>i.certainty==='possible')); assert.throws(()=>applyMultiSite(m,p,'Fixture test'),/non approvato/); });
