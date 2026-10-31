# Blueprint

**Ambiente sperimentale per progettare, sviluppare, verificare e supervisionare software attraverso un modello semantico condiviso.**

> **Stato:** prototipo v0.2 (incremento 1). **Fase 1 (nucleo) consolidata sul perimetro tecnico verificato il 30 ottobre 2026**. Prima del passaggio alla Fase 2 restano da riesaminare i requisiti strutturali aperti, inclusa la predisposizione all'internazionalizzazione. Le capacità pianificate non sono automaticamente disponibili.

> **Repository ufficiale — 31 ottobre 2026:** [Structive-hub/BLUEPRINT](https://github.com/Structive-hub/BLUEPRINT) è **pubblico e consultabile**, con diritti riservati e cronologia indipendente dall'archivio storico privato. Il commit iniziale è [`4634f8c`](https://github.com/Structive-hub/BLUEPRINT/commit/4634f8cf432d6ce072a01304c827826e2c63d963); la [CI della sincronizzazione documentale `f9fc23a`](https://github.com/Structive-hub/BLUEPRINT/actions/runs/41200946193) è superata su Linux e Windows. `main` è protetto da Ruleset e le modifiche passano da branch dedicati e Pull Request. Le evidenze dell'archivio privato non appartengono alla nuova cronologia. Stato, verifiche e governance: [rapporto di preparazione e pubblicazione](docs/architecture/public-preparation.md).

## Consultazione e diritti riservati

**Blueprint è pubblico e consultabile su GitHub, ma non è distribuito come progetto open source. Non viene concessa una licenza generale di riutilizzo per codice, documentazione e materiali originali.** Restano ferme le condizioni GitHub, comprese consultazione e fork tramite la piattaforma, e le eccezioni previste dalla legge. Gli usi ulteriori richiedono l'autorizzazione dei rispettivi titolari: [avviso sui diritti](DIRITTI.md).

I componenti di terzi mantengono le proprie licenze e attribuzioni, raccolte in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt); l'avviso sui materiali originali non le restringe. La provenienza documentata dei 16 asset UX/UI e la loro visibilità pubblica non certificano la titolarità: la verifica dei diritti sugli asset e sui relativi input resta responsabilità del proprietario e non è attestata dall'audit visivo.

## Che cos'è Blueprint

Blueprint è un ambiente di sviluppo nel quale **entità, funzioni, moduli, relazioni, vincoli, requisiti, stati e verifiche** costituiscono un modello del progetto, esplorabile da prospettive differenti.

Il **Centro Medico** presente nel codice è esclusivamente un *caso dimostrativo* per testare le capacità di Blueprint. Non è il prodotto da realizzare né un modello dati universale.

### Principi di riferimento

- **Unreal Engine Blueprints:** nodi e collegamenti tipizzati, interazione diretta, ispezione e approfondimento dei comportamenti.
- **C4 Model:** livelli architetturali, navigazione dal progetto ai componenti e orientamento nei sottosistemi.
- **SysML v2:** modello semantico condiviso, relazioni e vincoli espliciti, tracciabilità di requisiti e verifiche.
- **Sviluppo assistito dall'AI:** gli agenti possono proporre e, in futuro, implementare modifiche, ma non sostituiscono l'approvazione delle decisioni progettuali.

Le viste devono essere **prospettive dello stesso modello**, non archivi separati. Una relazione è un oggetto dotato di significato, non una linea decorativa. Le modifiche al canvas devono riflettersi nei dati sottostanti.

## Lingua di lavoro: italiano; inglese rinviato

**Decisione del 30 ottobre 2026:** durante la costruzione e il consolidamento della struttura del prodotto, **italiano (`it`) è la lingua di riferimento**. L'inglese (`en`) sarà introdotto successivamente, quando il prodotto raggiungerà un livello di maturità ritenuto adeguato e verrà approvato un incremento specifico. Il supporto bilingue non è un criterio di chiusura della Fase 1 né un obbligo per ogni nuova schermata in questa fase.

- **Interfaccia:** navigazione, editor, pannelli, ispettori, pulsanti, dialoghi, tooltip, messaggi, errori, stati vuoti e accessibilità usano l'italiano. Le funzionalità UI nuove o modificate si verificano in italiano.
- **Documentazione:** README, AGENTS, architettura, decisioni, specifiche e materiali UX/UI sono redatti in italiano, salvo nomi tecnici, codice, convenzioni esterne o diversa decisione esplicita. Non creare copie inglesi dei documenti durante questa fase.
- **Struttura e dati:** la struttura tecnica deve essere predisposta alla futura internazionalizzazione separando testi UI, chiavi tecniche, ID e semantica persistita, senza duplicare layout, modello o dati. È un requisito da attuare e verificare nel codice, distinto dall'implementazione delle traduzioni inglesi, qui non richiesta. Questo consolidamento documentale non introduce dizionari globali, selettori o un modulo `src/i18n/`.
- **Contenuti dell'utente:** nomi, etichette, descrizioni e documenti inseriti nei progetti non vanno modificati né tradotti automaticamente.
- **Futuro inglese:** quando verrà autorizzato, si localizzerà la stessa interfaccia senza duplicare schermate, layout o modello dati; a quel punto saranno definiti copertura, verifica e comportamento del cambio lingua.

**Stato effettivo:** la v0.2 è prevalentemente in italiano; il solo recupero dell'avvio dispone già di testi IT/EN, che possono rimanere. La localizzazione globale inglese non è implementata ed è **rinviata per decisione progettuale**, non considerata soddisfatta.

**Predisposizione tecnica ancora aperta:** molti testi UI sono incorporati in `src/app/main.tsx` e nei componenti; manca una gestione globale delle risorse linguistiche. Il dizionario in `src/app/startup-recovery.js` riguarda soltanto il recupero d'avvio. Non dichiarare quindi completata la predisposizione dell'applicazione: prima del passaggio alla Fase 2 occorre riesaminare il requisito strutturale e concordarne attuazione e verifiche, senza imporre ora le traduzioni inglesi.

Decisione e criteri di chiusura della Fase 1: [Italiano come lingua di lavoro e chiusura della Fase 1](docs/decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md).

## Struttura del repository

La **radice del repository** è anche la radice dell'applicazione **React + TypeScript + Vite**. Non è necessario entrare in sottocartelle per installare, testare o avviare Blueprint.

| Percorso | Responsabilità |
| --- | --- |
| `src/app/` | Avvio, navigazione e stato dell'interfaccia |
| `src/core/` | Modello semantico, operazioni sul grafo, dipendenze e persistenza |
| `src/features/graph/` | Editor visuale a nodi |
| `src/features/impact/` | Vista di analisi d'impatto |
| `src/demo/` | Esempio Centro Medico e verifiche specifiche |
| `src/styles/` | Stili condivisi |
| `tests/` | Test automatici |
| `scripts/` | Script di demo e avvio |
| `examples/` | Modelli dimostrativi e schema dei requisiti |
| `docs/` | Documentazione tecnica, UX e decisioni |
| `.github/workflows/` | Verifiche automatiche GitHub |

I file `package.json`, `index.html`, `README.md`, `AGENTS.md` e `.gitignore` sono nella radice.

Per i confini tra moduli e i limiti attualmente verificati, consultare [**Architettura**](docs/architecture/README.md). Per la conduzione degli agenti utilizzare [**AGENTS.md**](AGENTS.md).

Le traduzioni inglesi sono **rinviate a un incremento futuro**. `src/i18n/` non esiste: la soluzione strutturale per la futura internazionalizzazione resta da definire, implementare e verificare; non richiede necessariamente questo percorso. Il rinvio delle traduzioni non assolve tale requisito.

## Avvio e distribuzione

Il **codice sorgente è l'unica fonte di verità**. Non modificare manualmente `Blueprint-apri.html` o `dist/`.

### HTML autonomo, senza installazione

Aprire **`Blueprint-apri.html`** con un browser moderno. JavaScript, React e CSS sono inclusi: nessun server, Node.js o collegamento di rete è necessario. Il file incluso nel repository viene generato dai sorgenti e controllato in CI.

Per rigenerare entrambi i formati distribuibili dalla radice:

    npm ci
    npm run build
    npm run check:standalone

`build` controlla TypeScript, genera `dist/` e il suo manifest, poi genera l'HTML. Gli avvisi in `THIRD_PARTY_NOTICES.txt` sono inclusi integralmente nell'HTML come testo non eseguibile, disponibili nel sorgente del documento, e copiati anche in `dist/THIRD_PARTY_NOTICES.txt`. Il manifest verifica gli avvisi e il digest dei sorgenti include il file delle notice: una modifica richiede una nuova build. Le distribuzioni CI includono anche il file degli avvisi separato. Questi avvisi disciplinano i componenti di terzi e non concedono una licenza sui materiali originali di Blueprint, per i quali vale l'[avviso sui diritti riservati](DIRITTI.md). Il manifest registra l'impronta dei sorgenti e degli asset. Il generatore rifiuta una build vecchia o danneggiata; `--check` confronta senza scrivere. Versionare l'HTML insieme alle modifiche dei sorgenti. La CI rigenera e rifiuta differenze.

### Windows: versione compilata con server locale

Requisito: **Node.js >=22.18.0**, incluso npm per installare/ricompilare.

Doppio clic su **`avvia.cmd`**. La modalità predefinita serve la build su **http://127.0.0.1:4173/**. Se necessario installa le dipendenze con `npm ci` e ricompila; una build già valida non richiede `node_modules`. Controlla l'identità del processo e della build prima di dichiarare l'avvio riuscito. Una porta occupata produce un errore: non passa automaticamente a un'altra origine.

Il launcher tenta di aprire il browser; se non si apre usare l'indirizzo indicato. `Ctrl+C` arresta il server. Da terminale: `node scripts/launch.mjs --no-browser`. Dopo una build, `npm start` serve soltanto la distribuzione esistente e rifiuta una distribuzione non allineata.

### Sviluppo

    npm ci
    npm run dev

Lo sviluppo usa normalmente **http://127.0.0.1:5173/**. Su Windows è disponibile anche `avvia.cmd --dev`, con porta fissa e controllo del processo. Questa modalità è distinta dalla versione compilata.

### Salvataggi: mantenere browser, percorso e origine

La chiave persistente rimane **`blueprint.workspace.v1`**, formato/schema **1**. L'avvio e i controlli diagnostici non cancellano, migrano o riscrivono automaticamente i salvataggi. Un archivio non valido rimane recuperabile e non viene sovrascritto all'apertura.

`file://`, `http://127.0.0.1:4173`, `http://localhost:4173` e la porta di sviluppo sono contesti di memorizzazione differenti. Per `file://` il comportamento dipende dal browser e anche dal percorso del file: mantenere la vecchia copia e lo stesso profilo browser. Per trasferire un progetto usare **Esporta sessione / Importa modello**, con intervento esplicito dell'utente. Non cancellare dati del sito per tentare una riparazione. Una porta alternativa è possibile solo con `BLUEPRINT_PORT` esplicito e cambia l'origine dei dati.

### Errori e diagnostica

Il launcher conserva console, errori e versione Node in **`blueprint-avvio.log`** (append). Se la cartella non è scrivibile, mostra il percorso del log temporaneo utilizzato. Anche l'assenza di Node produce un messaggio e tenta di conservare un log; la finestra rimane aperta in caso di errore.

Se l'applicazione non parte nel browser, il pannello di avvio offre italiano/inglese, dettagli e **Scarica diagnostica**. Il JSON include browser, modalità, percorso/URL, capacità, errore e impronta della build disponibile; non include il modello del progetto. Esaminare il percorso locale prima di condividerlo.

Se il problema del proprio PC rimane: conservare **log indicato dal launcher**, **JSON diagnostico**, versione browser, modalità/URL o percorso esatto e passaggi/schermata del guasto. Il problema originario del PC non è stato identificato con certezza: vedere [il rapporto di consolidamento](docs/architecture/phase-1-consolidation.md) per le prove riuscite e il limite della console di test Windows.

### Verifiche ripetibili

    npm test
    npm run build
    npm run check:standalone
    npm run test:distribution
    npx playwright install chromium
    npm run test:e2e
    npm run demo
    npm audit

I test browser usano profili temporanei e una porta isolata: non accedono ai progetti del browser dell'utente. La demo scrive in `evidence/`, senza aggiornare `examples/`. Per CI Linux l'installazione del browser include `--with-deps`.

Non utilizzare dati sanitari reali, credenziali o informazioni personali negli esempi.

## Roadmap di prodotto: quattro fasi

| Fase | Obiettivo | Stato indicativo |
| --- | --- | --- |
| **1. Consolidare il nucleo** | Versionamento Git; identità stabile degli elementi; modello comune; persistenza e coerenza tra viste | **Consolidata sul perimetro tecnico verificato (30 ottobre 2026); requisiti strutturali aperti da riesaminare prima della Fase 2** |
| **2. Costruire il vero editor Blueprint** | Nodi e relazioni modificabili; navigazione gerarchica; viste ispirate a Unreal, C4 e SysML v2 | **Prima implementazione v0.2, da completare** |
| **3. Rendere operative le relazioni** | Semantica, controlli di compatibilità, dipendenze, impatti e verifiche dimostrabili | **Da sviluppare e validare** |
| **4. Collegare l'intelligenza artificiale** | Interpretazione assistita dei documenti, proposte sul modello, delega ad agenti con approvazione umana | **Non ancora integrata** |

Le fasi sono il riferimento stabile. Non sostituirle con una roadmap nuova in assenza di una decisione esplicita.

## Metodo di lavoro

1. **Prima verificare il codice esistente** e distinguere funzionalità reali, simulate e pianificate.
2. **Definire l'obiettivo del singolo incremento** e i criteri di verifica, senza allargare autonomamente il perimetro.
3. **Implementare, testare e documentare** le modifiche con riferimenti al modello e alle decisioni approvate.
4. **Usare Git/GitHub** per versionare il lavoro. Per ogni modifica autorizzata usare un branch dedicato e una Pull Request verso `main`, senza worktree automatici. Il Ruleset richiede CI Linux/Windows riuscite, branch aggiornato e conversazioni risolte. Usare Squash merge soltanto dopo revisione e autorizzazione del proprietario; Codex non effettua autonomamente il merge. Il flusso completo è in [AGENTS.md](AGENTS.md#61-flusso-git-operativo-di-codex).
5. **Coordinare l'evoluzione con la UX**, esplorata in parallelo: non considerare i mockup una prova che il motore corrispondente esista già.

Per i dettagli delle operazioni consentite agli agenti, leggere [`AGENTS.md`](AGENTS.md).
