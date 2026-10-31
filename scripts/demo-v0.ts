import { writeFileSync, mkdirSync } from 'node:fs';
import {createBaseline} from '../src/demo/interpreter.ts';
import {approveStructure} from '../src/core/interpreter.ts';
import { approve } from '../src/core/model.ts';
import { applyMultiSite, proposeMultiSite } from '../src/demo/legacy-impact.ts';
import { verify } from '../src/demo/verification.ts';
import { example, blank } from '../src/demo/example.ts';
mkdirSync('evidence',{recursive:true});

let m=createBaseline();
m=approve(m,'C-OVERLAP','Fixture CLI (consenso simulato)','Regola adottata esclusivamente per eseguire l’esperimento.');
m=approveStructure(m,'Fixture CLI (consenso simulato)');
const proposal=proposeMultiSite(m);
const evolved=applyMultiSite(m,proposal,'Fixture CLI (consenso simulato)');
const report={generatedAt:new Date().toISOString(),notice:'Approvazioni simulate dal test; non sono decisioni aggiuntive attribuite all’utente. Nessuna AI reale.',baseline:m,proposal,evolved,correct:verify(evolved,'correct'),emailBug:verify(evolved,'bug-email-before-confirm'),overlapBug:verify(evolved,'bug-ignore-overlap')};
writeFileSync('evidence/demo-report.json',JSON.stringify(report,null,2));
writeFileSync('evidence/centro-medico.json',JSON.stringify(example,null,2));
writeFileSync('evidence/modello-vuoto.json',JSON.stringify(blank,null,2));
for(const key of ['correct','emailBug','overlapBug'] as const) {
 console.log('\n'+key);
 for(const r of report[key]) console.log(r.status.toUpperCase()+' '+r.id+' — '+r.message);
}
if(report.correct.some(r=>r.status!=='pass') || !report.emailBug.some(r=>r.status==='fail') || !report.overlapBug.some(r=>r.status==='fail')) process.exitCode=1;
console.log('\nProve complete in evidence/demo-report.json. FAIL nei controlli negativi = difetto rilevato come previsto.');
