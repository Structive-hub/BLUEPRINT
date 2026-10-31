export type Origin = 'explicit' | 'ai-inference' | 'hypothesis';
export type Approval = 'proposed' | 'approved' | 'undefined';
export type Kind = 'entity' | 'function' | 'module' | 'constraint' | 'dimension' | 'question';
// Open semantic codes and verification binding IDs belong to domain adapters, not the core.
export type Semantic = string;
export interface Requirement { id: string; semantic: Semantic | 'unmapped'; statement: string }
export interface RequirementsDocument { schemaVersion: 1; title: string; objective: string; requirements: Requirement[]; notes: string }
export interface Provenance { source: string; pointer: string; quote: string; method: string }
export interface Element { id: string; kind: Kind; label: string; description: string; origin: Origin; approval: Approval; provenance: Provenance; version: number; rule?: string }
export type RelationType = 'contains' | 'reads' | 'writes' | 'depends-on' | 'constrains' | 'notifies' | 'specializes' | 'works-at' | 'describes';
export interface Relation { id: string; from: string; to: string; type: RelationType; rationale: string; origin: Origin; approval: Approval; source: string; cardinality?: string }
export interface Decision { id: string; target: string; revision: number; actor: string; timestamp: string; rationale: string }
export interface Point { x: number; y: number }
export interface GraphChange {
 id: string; revision: number; timestamp: string; actor: string;
 kind: 'add-node' | 'edit-node' | 'delete-node' | 'add-relation' | 'edit-relation' | 'delete-relation' | 'move-node' | 'model-update';
 summary: string; nodeIds: string[]; relationIds: string[]; before: unknown; after: unknown;
}
export interface GraphState { version: 1; positions: Record<string, Point>; changes: GraphChange[] }
export interface Blueprint { graph?: GraphState; schemaVersion: 1; revision: number; document: RequirementsDocument; elements: Element[]; relations: Relation[]; decisions: Decision[]; multiSite: boolean }
export interface InterpreterAdapter { id: string; interpret(document: RequirementsDocument): Blueprint }
export function getElement(m: Blueprint, id: string): Element { const e = m.elements.find(e => e.id === id); if (!e) throw new Error('Elemento ' + id + ' assente'); return e }
export function approve(m: Blueprint, id: string, actor: string, rationale: string): Blueprint {
 const e = getElement(m, id);
 if (e.approval === 'undefined') throw new Error('Questione non definita: serve una decisione di dominio, non un clic di approvazione.');
 if (!actor.trim() || !rationale.trim()) throw new Error('Indicare autore e motivazione.');
 if (e.approval === 'approved') return m;
 const next = structuredClone(m); next.revision++;
 Object.assign(getElement(next, id), { approval: 'approved', version: e.version + 1 });
 next.decisions.push({ id: 'DEC-' + (next.decisions.length + 1), target: id, revision: next.revision, actor: actor.trim(), timestamp: new Date().toISOString(), rationale: rationale.trim() }); return next;
}
export function validateDocument(input: unknown): RequirementsDocument {
 if (!input || typeof input !== 'object') throw new Error('Il documento deve essere un oggetto JSON.');
 const d = input as RequirementsDocument;
 if (d.schemaVersion !== 1 || typeof d.title !== 'string' || !d.title.trim() || typeof d.objective !== 'string' || typeof d.notes !== 'string' || !Array.isArray(d.requirements)) throw new Error('Richiesti schemaVersion=1, title, objective, notes e requirements.');
 if (d.requirements.length > 100) throw new Error('Limite dimostrativo: 100 requisiti.');
 const ids = new Set<string>(); const semantics = new Set<string>();
 for (const [i, r] of d.requirements.entries()) {
  if (!r || typeof r.id !== 'string' || !/^[A-Za-z0-9_-]{1,50}$/.test(r.id) || typeof r.statement !== 'string' || !r.statement.trim() || (typeof r.semantic !== 'string' || !/^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/.test(r.semantic))) throw new Error('Requisito ' + (i + 1) + ': ID, testo o codice semantico non validi.');
  if (ids.has(r.id)) throw new Error('ID duplicato: ' + r.id); ids.add(r.id);
  if (r.semantic !== 'unmapped' && semantics.has(r.semantic)) throw new Error('Codice semantico duplicato: ' + r.semantic); semantics.add(r.semantic);
 }
 return { schemaVersion: 1, title: d.title, objective: d.objective, notes: d.notes, requirements: d.requirements.map(r => ({ id: r.id, semantic: r.semantic, statement: r.statement })) };
}
