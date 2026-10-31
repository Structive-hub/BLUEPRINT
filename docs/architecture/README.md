# Architettura operativa di Blueprint

Questa pagina descrive il codice **attualmente presente**, senza attribuire al prodotto funzionalità soltanto pianificate.

## Organizzazione del codice

| Modulo | Percorso | Responsabilità |
| --- | --- | --- |
| Applicazione | [`src/app/main.tsx`](../../src/app/main.tsx) | Stato delle schermate, navigazione, comandi del modello e integrazione dei componenti |
| Modello | [`src/core/model.ts`](../../src/core/model.ts) | Strutture tipizzate di documento, elementi, relazioni, decisioni e grafo |
| Comandi del grafo | [`src/core/graph.ts`](../../src/core/graph.ts) | Creazione e modifica dei nodi e delle relazioni, porte e controlli strutturali |
| Dipendenze | [`src/core/dependencies.ts`](../../src/core/dependencies.ts) | Attraversamento delle relazioni e individuazione dei candidati da riesaminare |
| Interfaccia d'impatto | [`src/features/impact/ImpactView.tsx`](../../src/features/impact/ImpactView.tsx) | Visualizzazione delle analisi |
| Grafo visuale | [`src/features/graph/GraphEditor.tsx`](../../src/features/graph/GraphEditor.tsx) | Interazione con nodi, porte, collegamenti e proprietà |
| Persistenza | [`src/core/persistence.ts`](../../src/core/persistence.ts) | Memorizzazione locale, serializzazione, importazione e validazioni |
| Interpretazione generale | [`src/core/interpreter.ts`](../../src/core/interpreter.ts) | Modello vuoto e conservazione di requisiti senza inferire concetti di dominio |
| Adapter dimostrativo | [`src/demo/interpreter.ts`](../../src/demo/interpreter.ts) | Mock Centro Medico e baseline storica |
| Scenario dimostrativo | [`src/demo/`](../../src/demo/) | Dati, operazioni e verifiche del Centro Medico |
| Stili | [`src/styles/`](../../src/styles/) e [`src/features/graph/graph.css`](../../src/features/graph/graph.css) | Aspetto visuale attuale |
| Test | [`tests/`](../../tests/) | Test del nucleo, del grafo e delle regressioni |

## Principi di coordinamento

1. **Un solo modello:** il documento, gli elementi e le relazioni alimentano le diverse viste. Un cambiamento grafico deve aggiornare gli stessi dati usati dal resto dell'applicazione.
2. **Semantica esplicita:** il catalogo delle relazioni in `src/core/graph.ts` stabilisce quali tipi di nodi possono collegarsi e la direzione dell'analisi d'impatto.
3. **Identità e provenienza:** gli oggetti del modello hanno ID, stato di approvazione e informazioni sull'origine, secondo il supporto effettivamente implementato.
4. **Persistenza locale:** il workspace è conservato nel browser tramite `localStorage`, con importazione ed esportazione JSON. Non è una sincronizzazione cloud né collaborazione in tempo reale.
5. **Esempio separato:** il Centro Medico è un test del sistema, non una funzionalità commerciale di Blueprint.

## Limiti attuali da non nascondere

- L'interfaccia è prevalentemente italiana, coerentemente con la **lingua iniziale approvata**. Le traduzioni inglesi sono rinviate a un incremento futuro. Il pannello di recupero dell'avvio ha già un dizionario e un selettore IT/EN; il resto dell'applicazione non è bilingue.
- **Predisposizione all'internazionalizzazione ancora aperta:** `src/app/main.tsx` e i componenti contengono testi UI direttamente nel codice; non esiste una gestione globale delle risorse linguistiche. Il dizionario di `src/app/startup-recovery.js` copre soltanto il recupero d'avvio. La separazione dei testi UI dai dati e dagli identificatori, senza duplicare layout o modello, resta un requisito da attuare e verificare. Prima del passaggio alla Fase 2 occorre riesaminarne il perimetro; il consolidamento documentale e il rinvio delle traduzioni non ne dimostrano il completamento.
- Le porte attuali verificano compatibilità per **categorie di nodi e tipi di relazione**, non tutti i vincoli semantici specifici del dominio.
- L'analisi delle dipendenze produce **candidati da riesaminare**; non dimostra in modo generale che il codice debba cambiare.
- Non sono integrati agenti AI reali, ambiente completo di editing del codice, collaborazione concorrente o sincronizzazione tra dispositivi.
- Il campo legacy `multiSite` rimane nel formato v1 per compatibilità: non è utilizzato dal core per assegnare comportamenti di dominio.
- Le verifiche automatiche esistenti non costituiscono una prova esaustiva dell'UX o di tutte le semantiche possibili.

## Esecuzione

Dalla **radice del repository**, con Node.js 22.18 o successivo:

```sh
npm ci
npm test
npm run demo
npm run build
npm run dev
```

La build generata nella cartella `dist/` non è versionata. Per servire la build dopo la compilazione: `npm start`.

Le regole obbligatorie per gli agenti e la roadmap sono rispettivamente in [AGENTS.md](../../AGENTS.md) e nel [README](../../README.md).


## Confine core/demo consolidato

Il core non importa `src/demo`, `src/app` o `src/features`. I codici semantici dei requisiti sono identificatori aperti validati sintatticamente; i binding di verifica sono stringhe opache, mai eseguite dal parser. Accettare un binding non significa implementarne o verificarne il comportamento.

Il catalogo sanitario, il mock precedente e la proposta legacy multisede vivono in `src/demo/requirements.ts`, `src/demo/interpreter.ts` e `src/demo/legacy-impact.ts`. L'adapter demo conserva la validazione del proprio catalogo; il core può rappresentare documenti di altri domini.

`createRepository(storage, initialModel)` riceve il progetto iniziale per iniezione. Senza factory crea un modello generale vuoto; l'applicazione fornisce esplicitamente `createBaseline` del Centro Medico. Questo modifica un dettaglio di composizione, non il formato salvato.

**Compatibilità:** nessuna nuova versione, chiave di storage o migrazione automatica. Schema, formato workspace, ID, binding legacy, approvazioni e provenienza conservati. `multiSite` rimane richiesto dal parser v1 per leggere esattamente i modelli storici. Un test importa l'esempio storico e confronta identificatori e dati.

## Catena di distribuzione

`scripts/build.mjs` invoca TypeScript, Vite e il generatore con Node direttamente, senza concatenare shell intermedie. `vite.config.mjs` produce il manifest al momento della compilazione; il generatore non può attribuire ai vecchi asset l'impronta dei nuovi sorgenti.

`scripts/build-info.mjs` normalizza CRLF/LF per l'impronta sorgenti e verifica i digest degli asset. È un controllo di coerenza, non una firma crittografica di provenienza. Il launcher verifica che risponda il proprio processo, non un HTTP 200 estraneo.

Il bootstrap rende diagnosticabili errori di caricamento/React/capacità browser senza leggere o cancellare il workspace. Il documento autonomo mantiene lo stesso bootstrap e inietta bundle e CSS; il supporto `file://` viene provato con un profilo Chromium isolato.

Decisioni, risultati e limiti: [Consolidamento Fase 1](phase-1-consolidation.md).

## Avvisi di licenza nella distribuzione

`THIRD_PARTY_NOTICES.txt` è un input del digest dei sorgenti. Vite lo emette nella distribuzione e il manifest ne registra il digest. Il generatore incorpora nel documento autonomo gli avvisi verificati come testo non eseguibile; le copie HTML mantengono così copyright e condizioni dei componenti terzi anche senza file esterni. Il workflow include inoltre gli avvisi nel pacchetto distribuibile. Questi avvisi non concedono una licenza sui materiali originali: la decisione di consultazione pubblica senza licenza generale di riutilizzo è comunicata nell'[avviso sui diritti](../../DIRITTI.md), separato dalle licenze dei componenti di terzi.

I rapporti storici sono conservati come documentazione dell'archivio privato. Per stato del repository pubblico indipendente, prove e limiti leggere [Preparazione e pubblicazione](public-preparation.md). Il flusso Git operativo di Codex è definito in [AGENTS.md](../../AGENTS.md#61-flusso-git-operativo-di-codex).
