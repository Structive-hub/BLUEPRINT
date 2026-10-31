import { approve, getElement } from '../core/model.ts';
import type { Blueprint } from '../core/model.ts';
export interface Impact { target: string; certainty: 'certain' | 'possible' | 'missing'; message: string; path: string[]; evidence: string }
export interface ChangeProposal { id: 'CHANGE-MULTISITE'; baseRevision: number; title: string; contract: string; impacts: Impact[] }
const contract = 'Aggiungere Sede e la relazione Medico↔Sede N:M; ogni intervallo di agenda e prenotazione deve indicare una sede compatibile. Nessuna migrazione automatica. Contenuto email e tempi di trasferimento restano da decidere.';
export function proposeMultiSite(m: Blueprint): ChangeProposal {
 const impacts: Impact[] = [];
 const queue: { id: string; path: string[]; approved: boolean }[] = [{ id: 'DOC', path: ['DOC'], approved: m.elements.some(e => e.id === 'DOC' && e.approval === 'approved') }];
 const seen = new Set<string>();
 while (queue.length) {
  const cur = queue.shift()!; if (seen.has(cur.id)) continue; seen.add(cur.id);
  if (cur.id !== 'DOC') {
   const certain = cur.approved && ['AGENDA', 'BOOK'].includes(cur.id);
   impacts.push({ target: cur.id, certainty: certain ? 'certain' : 'possible', path: cur.path,
    message: cur.id === 'AGENDA' ? 'Distinguere gli intervalli per sede e mantenere il controllo del medico fra sedi.' : cur.id === 'BOOK' ? 'Identificare la sede della prenotazione e validarla rispetto all’agenda.' : 'Rivedere il contenuto della notifica: includere sede/indirizzo? Non ancora deciso.',
    evidence: certain ? 'Conseguenza del contratto proposto e della catena di dipendenze approvata.' : 'Dipendenza candidata o contenuto non formalizzato; non costituisce un obbligo approvato.' });
  }
  for (const r of m.relations.filter(r => r.type === 'depends-on' && r.to === cur.id)) queue.push({ id: r.from, path: [...cur.path, r.from], approved: cur.approved && r.approval === 'approved' && m.elements.some(e => e.id === r.from && e.approval === 'approved') });
 }
 impacts.push({ target: 'DIM-TIME', certainty: 'possible', path: ['DOC', 'DIM-TIME'], message: 'Valutare tempi di trasferimento fra sedi. Nessun tempo minimo inventato.', evidence: 'Ipotesi euristica del catalogo multisede, senza vincolo approvato.' });
 impacts.push({ target: 'Q-COLLEAGUES', certainty: 'missing', path: ['DOC', 'F-MOVE', 'Q-COLLEAGUES'], message: 'Il permesso su appuntamenti altrui resta NON DEFINITO.', evidence: getElement(m, 'Q-COLLEAGUES').provenance.quote });
 return { id: 'CHANGE-MULTISITE', baseRevision: m.revision, title: 'Il medico lavora in più sedi', contract, impacts };
}
export function applyMultiSite(m: Blueprint, p: ChangeProposal, actor: string): Blueprint {
 if (p.id !== 'CHANGE-MULTISITE' || p.baseRevision !== m.revision) throw new Error('Proposta obsoleta: ricalcolare gli impatti sulla revisione corrente.');
 for (const id of ['DOC', 'AGENDA', 'BOOK']) if (!m.elements.some(e => e.id === id && e.approval === 'approved')) throw new Error('Prerequisito mancante o non approvato: ' + id);
 if (!m.relations.every(r => r.approval === 'approved')) throw new Error('Revisionare e approvare prima la topologia delle relazioni in Struttura.');
 if (m.multiSite) return m;
 const n = approve(m, 'DIM-ORG', actor, 'Approvato contratto multisede: ' + contract);
 n.multiSite = true;
 n.elements.push({ id: 'SITE', kind: 'entity', label: 'Sede', description: 'Identità della sede; ogni slot e prenotazione deve riferirla.', origin: 'hypothesis', approval: 'approved', version: 1, provenance: { source: p.id, pointer: '/contract', quote: contract, method: 'Estensione esplicitamente approvata in questa sessione locale' } });
 for (const [from, type, cardinality] of [['DOC','works-at','N:M'], ['AGENDA','depends-on','N:1 per intervallo'], ['BOOK','depends-on','N:1 per prenotazione']] as const) n.relations.push({ id: 'REL-' + (n.relations.length + 1), from, to: 'SITE', type, cardinality, rationale: contract, origin: 'hypothesis', approval: 'approved', source: p.id });
 for (const id of ['DOC','AGENDA','BOOK']) { const e = getElement(n,id); e.version++; }
 return n;
}
