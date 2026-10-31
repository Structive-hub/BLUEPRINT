import type { RequirementsDocument } from '../core/model.ts';
export const example: RequirementsDocument = { schemaVersion: 1, title: 'Centro medico collettivo', objective: 'Prenotare servizi online e gestire gli spostamenti degli appuntamenti.', notes: 'Dati sintetici. Requisiti confermati dalla richiesta del 29 ottobre 2026. Nessuna durata standard o regola sui colleghi è stata decisa.', requirements: [
 { id: 'REQ-01', semantic: 'registeredBooking', statement: 'Utenti/pazienti registrati prenotano online.' },
 { id: 'REQ-02', semantic: 'chooseDoctor', statement: 'Il paziente sceglie tra più medici della stessa specialità.' },
 { id: 'REQ-03', semantic: 'multipleServices', statement: 'Il centro offre più servizi.' },
 { id: 'REQ-04', semantic: 'doctorAgenda', statement: 'I medici vedono le agende.' },
 { id: 'REQ-05', semantic: 'moveAppointment', statement: 'I medici possono spostare appuntamenti.' },
 { id: 'REQ-06', semantic: 'emailAfterConfirmation', statement: 'Dopo la conferma dello spostamento viene generata automaticamente una notifica email al paziente.' },
 { id: 'REQ-07', semantic: 'noReception', statement: 'Nessuna prenotazione via segreteria.' },
 { id: 'REQ-08', semantic: 'noPayments', statement: 'Nessun pagamento online.' },
 { id: 'REQ-09', semantic: 'noClinicalData', statement: 'Nessuna acquisizione di anamnesi o dati clinici.' },
 { id: 'REQ-10', semantic: 'otherDoctorsUndefined', statement: 'Il permesso di spostare appuntamenti di altri medici è NON DEFINITO.' }
] };
export const blank: RequirementsDocument = { schemaVersion: 1, title: 'Nuovo progetto', objective: '', notes: 'Usare semantic=unmapped per contenuti fuori dal vocabolario mock.', requirements: [{ id: 'REQ-01', semantic: 'unmapped', statement: 'Descrivi un requisito.' }] };

