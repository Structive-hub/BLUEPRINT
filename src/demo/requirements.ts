import {validateDocument} from '../core/model.ts';
import type {RequirementsDocument} from '../core/model.ts';
export type Semantic = 'registeredBooking' | 'chooseDoctor' | 'multipleServices' | 'doctorAgenda' | 'moveAppointment' | 'emailAfterConfirmation' | 'noReception' | 'noPayments' | 'noClinicalData' | 'otherDoctorsUndefined';
export const semanticLabels: Record<Semantic, string> = {
 registeredBooking: 'Prenotazione online di utenti registrati', chooseDoctor: 'Scelta fra medici della stessa specialità', multipleServices: 'Più servizi', doctorAgenda: 'Consultazione agende dei medici', moveAppointment: 'Spostamento da parte del medico', emailAfterConfirmation: 'Email automatica dopo conferma', noReception: 'Esclusa prenotazione via segreteria', noPayments: 'Esclusi pagamenti online', noClinicalData: 'Esclusi anamnesi e dati clinici', otherDoctorsUndefined: 'Permesso su appuntamenti altrui non definito'
};

export function validateDemoDocument(input:unknown):RequirementsDocument{
 const document=validateDocument(input);
 for(const [i,r] of document.requirements.entries())if(!(Object.hasOwn(semanticLabels,r.semantic)||r.semantic==='unmapped'))throw Error('Requisito '+(i+1)+': ID, testo o codice semantico non validi.');
 return document;
}
