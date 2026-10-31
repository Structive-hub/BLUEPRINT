# Consolidamento tecnico della Fase 1

> **Documento storico dell'archivio privato, conservato nella preparazione pubblica il 31 ottobre 2026.** I branch, i commit, la PR e gli identificatori CI riportati sotto descrivono esclusivamente il repository originario. Non sono disponibili come riferimenti Git della nuova copia e non vanno usati per checkout, merge o verifica della nuova cronologia. I risultati storici non attestano una CI della nuova copia. Per i controlli attuali leggere [Preparazione pubblica](public-preparation.md).

Data delle prove locali: 30 ottobre 2026. Branch: `codex/phase-1-consolidation`, base `7916ca2`. Nessun merge su `main`. Nessuna funzionalità della Fase 2, integrazione AI o nuova funzione sanitaria.

> **Aggiornamento successivo, 30 ottobre 2026 — stato attuale:** la PR #1 è stata integrata in `main` con commit `eeda41e365ae2c5b295659334a69422c326fbf33`; la CI sul merge è riuscita. Dopo una verifica degli obiettivi originari (modello condiviso, ID stabili, operazioni, persistenza, coerenza fra viste e test), la **Fase 1 è stata chiusa sul perimetro tecnico verificato**. Il precedente requisito di localizzazione inglese è stato **esplicitamente rinviato**, non implementato né considerato soddisfatto. La progettazione UX/UI resta un filone parallelo e prepara la Fase 2. Vedere [decisione progettuale](../decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md). I giudizi e riferimenti al branch contenuti nel rapporto sottostante descrivono la situazione *al momento delle prove*, prima del merge e della nuova decisione.

> **Precisazione del consolidamento documentale, 30 ottobre 2026:** la chiusura indicata sopra riguarda esclusivamente il perimetro tecnico verificato; la Fase 1 è quindi documentata come **consolidata su tale perimetro**. La predisposizione architetturale alla futura internazionalizzazione resta un requisito aperto, distinto dalle traduzioni inglesi rinviate: i testi UI sono ancora in gran parte nei componenti e il dizionario esistente copre solo il recupero d'avvio. Prima del passaggio alla Fase 2 occorre riesaminare i requisiti strutturali residui e concordarne attuazione e verifiche. Nessuna predisposizione globale è implementata o attestata da questa integrazione documentale. La CI sul merge della PR #1 (riferimento storico nell'archivio privato) costituisce evidenza delle verifiche tecniche storiche.

## Esito e possibilità di chiusura (valutazione al momento delle prove)

La base tecnica è consolidata: distribuzione generata dai sorgenti con controllo di coerenza, core separato dal catalogo demo, compatibilità v1 e flussi principali provati nel browser. Il codice ha superato la nuova CI sia Linux sia Windows, incluso il primo avvio completo tramite `avvia.cmd` senza build o dipendenze.

**Ritengo approvabile il consolidamento tecnico della Fase 1 sulla copertura verificata. Non dichiaro integralmente assolti tutti i requisiti della fase:** la localizzazione completa IT/EN rimane assente nell'applicazione; soltanto il recupero dell'avvio è bilingue. Il guasto originario del PC non è stato identificato con certezza e richiede le evidenze indicate sotto se si ripresenta.

La roadmap originale è invariata. Per la chiusura formale occorre considerare esplicitamente il requisito bilingue residuo: questo intervento non lo considera soddisfatto né lo elimina. Nessun passaggio alla Fase 2.

## Problemi effettivamente individuati

1. L'HTML autonomo era uno snapshot generato con un comando separato dalla build, senza confronto automatico con i sorgenti: poteva rimanere indietro.
2. Il launcher precedente usava il server di sviluppo per l'apertura normale e considerava sufficiente una risposta HTTP. Ciò non provava che rispondesse il processo Blueprint corretto.
3. La console si poteva chiudere senza fornire evidenza utile e un errore browser prima del rendering poteva lasciare una pagina senza indicazioni.
4. `core/model.ts` conteneva catalogo e binding sanitari; interprete e persistenza dipendevano dalla baseline demo.
5. Le demo scrivevano modelli generati in `examples/`, modificando file di riferimento.
6. L'audit iniziale segnalava Vite 7.1.12 come dipendenza vulnerabile di gravità alta. Aggiornamento compatibile a **7.3.7**, senza `--force`; audit finale **0 vulnerabilità**.
7. La prima nuova CI ha individuato un difetto ulteriore: la trasformazione HTML con sorgenti CRLF produceva un terminatore duplicato, quindi il controllo falliva perfino sul file appena generato. Normalizzazione anticipata del template e del bootstrap, normalizzazione finale idempotente e test che ricompila realmente un checkout CRLF e confronta l'HTML con quello LF.
8. Le prove Windows hanno mostrato problemi nella catena shell e nella scrittura delle fixture. I comandi compilatore/Vite sono ora invocati direttamente con Node. Rimane una limitazione dell'host: un processo Node lanciato tramite `cmd.exe` può fallire con ENOENT/EBADF anche eseguendo un minimo `writeFileSync` estraneo a Blueprint, su cartelle esistenti e scrivibili dal processo diretto. Il problema è apparso anche senza caratteri speciali: non è corretto attribuirlo esclusivamente a `&` o al prodotto.

## Correzioni e file

| File o gruppo | Modifica e motivo |
| --- | --- |
| `scripts/build.mjs`, `vite.config.mjs` | Unica procedura di build; TypeScript, Vite, manifest e HTML. Singolo bundle incorporabile; invocazioni senza concatenazione di shell. |
| `scripts/build-info.mjs`, `scripts/make-standalone.mjs` | Impronta sorgenti normalizzata LF/CRLF, verifica digest degli asset, generazione riproducibile e controllo senza scrittura. Una build vecchia non può essere rietichettata come corrente. |
| `Blueprint-apri.html`, `index.html`, `.gitattributes` | Artefatto rigenerato, bootstrap diagnosticabile, terminatori prevedibili. Nessuna modifica manuale al bundle. |
| `scripts/launch.mjs`, `avvia.cmd` | Avvio normale della build a 4173; sviluppo esplicito a 5173. Verifica identità processo/build, errore per porta occupata, log persistente e fallback temporaneo, messaggi IT/EN, versione Node controllata. |
| `scripts/serve-built.mjs`, `scripts/smoke-built.mjs` | Server locale per asset realmente compilati, sorgenti/manifest/asset verificati anche nell'avvio diretto, errori HTTP e test su porta effimera. |
| `src/app/bootstrap.ts`, `startup.ts`, `startup-recovery.js`, `main.tsx` | Errori di caricamento/rendering e capacità mancanti diventano diagnosticabili. Dizionario IT/EN del recupero e download JSON; nessun accesso al workspace da parte del diagnostico. |
| `src/core/model.ts`, `interpreter.ts`, `persistence.ts` | Codici semantici generali e binding opachi; modello iniziale generale vuoto e factory iniettata nel repository; nessuna dipendenza dalla demo. |
| `src/demo/interpreter.ts`, `requirements.ts`, `legacy-impact.ts` | Catalogo, baseline, mock e proposta multisede precedenti collocati nel dominio dimostrativo. L'app continua a comporre esplicitamente lo stesso esempio. |
| `scripts/demo.ts`, `demo-v0.ts` | Output generati in `evidence/`; `examples/` rimane immutata. |
| `package.json`, `package-lock.json` | Vite corretto, Playwright bloccato, comandi build/check/test ripetibili. React e TypeScript invariati. |
| `tests/`, `playwright.config.mjs` | Test aggiuntivi di indipendenza, distribuzione, launcher e flussi reali del browser; profili isolati. |
| `.github/workflows/ci.yml`, `.gitignore` | Verifiche su Linux/Windows, confronto HTML versionato, browser e artefatti diagnostici; output locali esclusi da Git. |
| `README.md`, `docs/architecture/README.md`, questo rapporto | Comandi reali, confini dei moduli, compatibilità, decisioni e limiti. Roadmap non modificata. |

## Persistenza e compatibilità

Nessuna nuova versione dello schema o migrazione. Rimangono `blueprint.workspace.v1`, formato workspace v1, `schemaVersion: 1`, ID, approvazioni e provenienza. Il campo legacy `multiSite` viene conservato perché presente negli archivi storici, senza assegnargli un comportamento generale nel core.

La precedente enumerazione sanitaria dei codici semantici diventa un identificatore aperto validato sintatticamente. I binding sono stringhe opache: importarli non comporta esecuzione o verifica. Il validatore demo mantiene il proprio catalogo. Le restrizioni strutturali su relazioni, riferimenti, storico e dimensioni degli archivi rimangono.

`createRepository(storage)` crea un progetto vuoto generale; l'app passa esplicitamente la baseline demo. Non cambia il contenuto dei modelli esistenti. L'apertura di un archivio storico o corrotto non scrive automaticamente nello storage: verificato anche confrontando il testo grezzo prima/dopo.

`file://`, host differenti, porte differenti e profili differenti non condividono necessariamente dati. Per i file anche il percorso conta e il comportamento dipende dal browser. Nessuna copia o migrazione automatica: mantenere il vecchio file e trasferire con export/import esplicito.

## Prove locali effettuate

Ambiente reale: Windows, Node **24.10.0**, Chromium Playwright **156.0.8078.4**. Non è stato utilizzato il profilo personale del browser.

| Verifica | Risultato |
| --- | --- |
| Suite originale più 4 test di indipendenza | **45/45 passati**, inclusi i 41 casi precedenti. |
| TypeScript e Vite, generazione autonoma | Passati con `node scripts/build.mjs` e con npm usando PowerShell come script-shell. |
| npm build con shell cmd predefinita dell'host | Fallita sulla scrittura del file temporaneo Vite; limite riprodotto con un programma minimo indipendente. Non presentata come prova riuscita. |
| Distribuzione e launcher | **13 passati su 14, 1 saltato esplicitamente** per impossibilità di scrittura tramite cmd in questo host. |
| HTML vecchio, server diretto con build vecchia, asset danneggiato, ricompilazione checkout CRLF, directory diversa, nessuna modifica agli esempi | Tutti passati. |
| `avvia.cmd` con build pronta, senza node_modules, percorso con spazi/Unicode/`&` | Passato: verifica HTTP del proprio server e uscita corretta. |
| Porta occupata da un altro server HTTP 200 | Passato: launcher fallisce, non apre un server sbagliato e non arresta l'altro processo. |
| Node assente | Passato: messaggio Windows leggibile e diagnostica conservata nel percorso indicato. |
| Build assente, launcher JavaScript | Passato: ricompilazione e verifica server. |
| Primo avvio JavaScript senza build né dipendenze | Passato: `npm ci`, compilazione, HTML e server, da copia temporanea con spazi e `&`. |
| Primo avvio completo tramite `avvia.cmd` senza build | **Non verificabile nell'host locale**: il test salta dopo una prova cmd minima fallita. **Passato invece in CI Windows**, senza build e dipendenze: il salto è vietato con `BLUEPRINT_REQUIRE_CMD_WRITES=1`. |
| Browser: navigazione sei viste, CRUD nodi/relazioni, vincoli/impatto condivisi, reload, export/import e reload | Passati. |
| Browser: archivio storico e chiavi estranee intatti; archivio corrotto/import non valido | Passati. |
| Browser: errore modulo e capacità mancanti, recupero e download diagnostica IT/EN | Passati. |
| HTML reale `file://`, creazione nodo, chiusura/riapertura dello stesso profilo temporaneo | Passato: stesso salvataggio grezzo, nessuna richiesta HTTP esterna. |
| Totale test browser | **7/7 passati**. |
| `npm audit` dopo aggiornamento | **0 vulnerabilità** alla data delle prove. |
| `examples/` dopo entrambe le demo | Nessuna differenza nei file versionati. |

Il browser automatico prova avvio, interazioni e persistenza, non equivale a un collaudo umano completo. Il tentativo di apertura automatica del browser personale dal launcher non è stato eseguito: i test disabilitano tale azione.

I test di distribuzione richiedono prima la build; il cold start .cmd su un host funzionante esegue anche npm ci e può richiedere rete. Le prove browser e i loro screenshot, export e diagnostica sono prodotti in `test-results/`; il report navigabile è in `playwright-report/`. La CI pubblica questi risultati come artefatti. I profili di prova non sono distribuiti.

## Risultati CI effettivamente osservati

GitHub Actions, esecuzione 41089239708 (riferimento storico nell'archivio privato), revisione codice **b0d994c79252b7a9629f733d9e350b0ddf92e7a5**: entrambi i job conclusi con **successo**. Il successivo aggiornamento di questo rapporto non modifica codice, sorgenti della build o test.

| Ambiente | Core | Distribuzione/avvio | Browser | Altri controlli |
| --- | --- | --- | --- | --- |
| Windows Server 2025, Node 22.18.0 | 45/45 | **14/14, nessun salto** | **7/7** | Build, HTML allineato, esempi intatti, audit 0 |
| Ubuntu, Node 22.18.0 | 45/45 | 13/14; saltato il solo caso Windows «Node assente» | **7/7** | Build, HTML allineato, esempi intatti, audit 0 |

Il cold start Windows usa la vera `avvia.cmd` in una cartella con spazi e `&`, esegue l'installazione, ricompila e deve ottenere la risposta HTTP del proprio server. La prova con build pronta include anche un percorso Unicode. L'apertura `file://` e il mantenimento del salvataggio alla riapertura sono stati verificati nei due job.

Sono disponibili quattro artefatti nella stessa esecuzione: report/diagnostica di ciascuna piattaforma e HTML autonomo/manifest di ciascuna piattaforma. Il confronto in CI contro l'HTML versionato è passato su entrambe: il risultato distribuibile coincide con i sorgenti verificati.

Anche l'avvio locale esplicito `node scripts/launch.mjs --dev` è passato su una porta temporanea, identificando il proprio processo Vite e chiudendolo al termine. La modalità di test non apre il browser dell'utente.

## Verifiche ancora aperte
- Riproduzione del problema specifico del PC dell'utente: raccogliere log di avvio, JSON diagnostico del browser, versione/browser, modalità, URL o percorso esatto e passaggi del guasto. Non occorre condividere dati reali del progetto.
- Apertura automatica del browser predefinito, antivirus/policy aziendali, altri browser/versioni e disponibilità rete su PC diversi non verificati.
- Localizzazione completa dell'applicazione e selettore globale ancora assenti. Nessun redesign effettuato.
- Il campo legacy rimane per compatibilità. Il mock sanitario è un adapter deterministico; non è AI. L'analisi delle dipendenze resta un attraversamento di relazioni, non comprensione completa delle conseguenze progettuali.
- Il manifest rileva disallineamenti e corruzioni; non è una firma di sicurezza. L'audit a zero non garantisce assenza di difetti futuri.

## Comandi

Dalla radice: `npm ci`, `npm test`, `npm run build`, `npm run check:standalone`, `npm run test:distribution`, `npx playwright install chromium`, `npm run test:e2e`, `npm run demo`, `npm audit`.

Nell'host di questa sessione le prove che devono scrivere sono state lanciate con Node direttamente o con npm e `--script-shell` PowerShell, rendendo esplicito il limite di cmd. Questa non è una modifica globale alla configurazione npm dell'utente.

La versione autonoma si apre da `Blueprint-apri.html`; quella compilata da `avvia.cmd` o `node scripts/launch.mjs`; lo sviluppo da `npm run dev` o `avvia.cmd --dev`.
