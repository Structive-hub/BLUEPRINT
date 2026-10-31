# AGENTS.md — Istruzioni operative per Blueprint

Questo file si applica a **tutto il repository** e deve essere letto prima di analizzare, modificare o generare codice. Le istruzioni specifiche dell'utente per una singola attività prevalgono sugli esempi di questo documento, ma non autorizzano ad attribuire al prodotto funzionalità non verificate.

## 1. Identità del prodotto (vincolo non negoziabile)

**Blueprint è un ambiente per progettare, sviluppare, verificare e supervisionare software**, fondato su un modello semantico condiviso e su più viste coordinate. Il diagramma è una delle viste del modello, non la sua unica rappresentazione.

Il **Centro Medico** è soltanto uno scenario dimostrativo per provare il modello. Non inserire nuove schermate per pazienti, medici, appuntamenti, pagamenti o cartelle cliniche, salvo richiesta esplicita relativa a una prova del motore di Blueprint.

Riferimenti di progetto da interpretare, non copiare meccanicamente:

- **Unreal Engine Blueprints:** nodi e collegamenti dotati di tipi, significato e possibili verifiche.
- **C4 Model:** esplorazione dell'architettura a più livelli e mantenimento del contesto.
- **SysML v2:** modello semantico, vincoli, relazioni, requisiti, evidenze e tracciabilità.
- **IDE e strumenti di sviluppo assistiti da AI:** codice accessibile, test, diff, supervisioni e approvazioni. Le integrazioni AI reali appartengono a una fase successiva.

## 2. Lingua di lavoro corrente: italiano; inglese differito

**In questa fase Blueprint si progetta, si implementa, si verifica e si documenta in ITALIANO (`it`).** Il supporto inglese (`en`) è previsto per una fase successiva, da attivare soltanto tramite una nuova decisione progettuale quando il prodotto avrà raggiunto una maturità adeguata. Non è richiesto come condizione per chiudere la Fase 1 o per completare ogni nuovo intervento UI.

Regole operative:

1. Scrivere in italiano i testi visibili all'utente: navigazione, editor, pannelli, controlli, tooltip, dialoghi, notifiche, errori, stati vuoti, etichette accessibili e nuove schermate; verificarli in italiano.
2. Redigere in italiano README, AGENTS, documentazione tecnica, decisioni, UX/UI, specifiche e resoconti. Sono ammessi nomi tecnici, codice, identificatori, termini di standard e convenzioni esterne.
3. Privilegiare prima la definizione della struttura, del comportamento e della UX dell'applicazione. **Non introdurre ora** dizionari IT/EN, selettori di lingua, copie tradotte dei documenti o layout duplicati per la localizzazione.
4. Predisporre la struttura tecnica per la futura internazionalizzazione separando i testi UI da identificatori tecnici, tipi, relazioni e dati persistiti, senza duplicare layout, modello o dati. Questo è un requisito architetturale: verificarne l'attuazione nel codice prima di dichiararlo completato.
5. Non tradurre automaticamente nomi, etichette, descrizioni o documenti inseriti dall'utente nei propri progetti.
6. Quando l'inglese sarà approvato, definire copertura, dizionari o altra soluzione coerente, selettore globale e test di cambio lingua senza perdita di selezione, dati, navigazione o stato di lavoro. Non anticipare l'implementazione.
7. I messaggi IT/EN già presenti nel recupero dell'avvio possono restare; non costituiscono prova di localizzazione dell'applicazione.

**Stato reale:** v0.2 prevalentemente in italiano. Il supporto inglese globale è assente e intenzionalmente rinviato: non descriverlo come implementato. La decisione è registrata in `docs/decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md`.

**Requisito strutturale ancora aperto:** molti testi UI sono direttamente nei componenti e manca un'infrastruttura globale di internazionalizzazione. Il dizionario del solo recupero d'avvio non dimostra che l'applicazione sia tecnicamente predisposta. Prima del passaggio alla Fase 2 occorre mantenere espliciti questo requisito, le evidenze mancanti e il relativo intervento; il rinvio delle traduzioni non lo considera assolto.

## 3. Repository e comandi

Il progetto applicativo si trova **nella radice del repository**. I percorsi operativi sono `src/app`, `src/core`, `src/features/graph`, `src/features/impact`, `src/demo`, `src/styles`, `tests`, `scripts`, `examples` e `docs`. `src/i18n` e il selettore linguistico sono eventuali interventi futuri, non richiesti nella fase attuale.

Stack attuale: React, TypeScript, Vite, Node.js **>=22.18.0**.

Comandi, eseguiti dalla **radice del repository**:

    npm ci
    npm test
    npm run demo
    npm run build
    npm run dev

Il progetto include test in `tests/`, esempi in `examples/` e logiche in `src/`. Alcuni file rappresentativi:

- `src/core/model.ts`: struttura del modello ed elementi semantici.
- `src/core/graph.ts`: operazioni sul grafo, regole attuali di collegamento e modifiche.
- `src/core/persistence.ts`: persistenza, serializzazione e importazione.
- `src/features/graph/GraphEditor.tsx`: editor grafico.
- `src/features/impact/ImpactView.tsx`: vista di analisi d'impatto.
- `src/app/main.tsx`: schermate principali e stato applicativo.
- `src/demo/domain.ts` e `src/demo/verification.ts`: laboratorio dimostrativo e verifiche.

Consultare `README.md`, `docs/architecture/README.md` e il codice effettivo per le istruzioni operative. **Documentare e usare esclusivamente i percorsi presenti nella struttura corrente**. Non dedurre capacità da descrizioni non verificate; `dist/` è generata da `npm run build` e non è versionata.

## 4. Roadmap approvata: non cambiarla autonomamente

1. **Consolidare il nucleo.** Repository Git, elementi con identità stabile, modello condiviso, persistenza, coerenza fra viste e test.
2. **Costruire il vero editor Blueprint.** Nodi e relazioni modificabili, navigazione gerarchica, viste architetturali e dei vincoli.
3. **Rendere operative le relazioni.** Validazione semantica, propagazione d'impatto fondata su regole, distinguendo risultati certi, possibili e sconosciuti.
4. **Collegare l'AI.** Interpretazione di documenti, generazione di proposte, delega dello sviluppo, revisione e approvazione umana.

La **Fase 1 è consolidata nel perimetro tecnico verificato il 30 ottobre 2026**; questo non certifica la chiusura dei requisiti strutturali ancora aperti. Prima del passaggio alla Fase 2, riesaminare tali requisiti, inclusa la predisposizione all'internazionalizzazione, e concordare il relativo perimetro di attuazione. Coordinare gli incrementi con le decisioni UX/UI approvate, senza aggiungere capacità di altre fasi.

## 5. Invarianti del modello

- **Fonte di verità unica:** le viste leggono e modificano lo stesso modello; non duplicare archivi di fatti per ciascuna vista.
- **Identità stabile:** preservare identificatori di elementi e relazioni durante le modifiche ordinarie; evitare riferimenti pendenti dopo eliminazione o importazione.
- **Relazioni tipizzate:** un arco grafico rappresenta un oggetto del modello; i tipi e le regole di compatibilità devono essere verificabili, non soltanto estetici.
- **Provenienza e tracciabilità:** conservare origine dei dati, evidenze, cronologia e motivazione delle modifiche ove previste.
- **Stati distinti:** `proposto`, `approvato`, `implementato` e `verificato` non sono sinonimi. La compatibilità tecnica è separata dall'approvazione umana.
- **Incertezza esplicita:** distinguere impatto deterministico, potenziale, non determinabile e verificato. L'assenza di un impatto trovato non dimostra assenza di rischio.
- **Separazione del dominio demo:** non codificare regole del Centro Medico come se fossero leggi universali di Blueprint.
- **Modifica progressiva:** consentire modelli incompleti mantenendo chiaro quali informazioni sono ancora proposte, sconosciute o richiedono verifica.

## 6. Metodo di lavoro dell'agente

1. **Leggere prima di modificare:** esaminare codice, test, stato Git, documentazione e limiti. Non basarsi soltanto su descrizioni precedenti.
2. **Rispettare il perimetro assegnato:** intervenire solo sulla fase o sull'incremento richiesto. Non aggiungere refactoring, nuove dipendenze, integrazioni AI o redesign UX non necessari.
3. **Evidenziare le decisioni progettuali:** quando una scelta altera requisiti, semantica approvata o comportamento pubblico, proporre una soluzione motivata e ottenere approvazione prima di trattarla come definitiva.
4. **Eseguire verifiche reali:** provare `npm test`, `npm run build` e test specifici per le funzionalità toccate, quando l'ambiente lo consente. Se non sono eseguiti, indicarlo.
5. **Non simulare risultati:** non presentare una demo, un mock o un controllo per casi speciali come garanzia generale.
6. **Proteggere i dati:** non introdurre credenziali, token, informazioni sanitarie reali o altri dati personali nel repository, negli esempi o nei log.
7. **Versionare in modo leggibile:** per tutte le modifiche autorizzate usare un branch dedicato e una Pull Request, con commit descrittivi; non lavorare direttamente su `main` e rispettare il flusso operativo seguente.
8. **Riportare l'esito:** file modificati, ragioni, test eseguiti e relativi risultati, limiti residui e rischi aperti.

Per gli incarichi di **sola analisi/audit**, non modificare il codice, non creare branch, commit o PR e non applicare correzioni senza una successiva richiesta esplicita.

### 6.1. Flusso Git operativo di Codex

Il repository ufficiale è [Structive-hub/BLUEPRINT](https://github.com/Structive-hub/BLUEPRINT), pubblico e consultabile con [diritti riservati](DIRITTI.md), con cronologia indipendente dall'archivio storico privato. Il Ruleset attivo protegge `main`: richiede PR, controlli Linux/Windows riusciti, branch aggiornato, risoluzione delle conversazioni e Squash merge.

1. **Verificare il punto di partenza:** controllare radice Git, branch, stato della working tree e `origin`. Prima di iniziare modifiche, verificare che `main` sia pulito e aggiornato rispetto a `origin/main`, senza eliminare modifiche locali. La destinazione ufficiale è `https://github.com/Structive-hub/BLUEPRINT.git`.
2. **Separare analisi e modifica:** per sola analisi non creare branch, commit o PR senza richiesta. Per modifiche autorizzate lavorare su un branch dedicato derivato da `main`, mai direttamente su `main`.
3. **Usare nomi circoscritti:** rispettare il nome richiesto dal proprietario; negli altri casi scegliere nomi descrittivi e limitati al compito. `chore/git-governance` identifica questo intervento documentale, non un branch generico per attività successive.
4. **Preparare modifiche revisionabili:** creare commit leggibili che includano soltanto il perimetro autorizzato, controllare il diff ed eseguire le verifiche pertinenti. Per le attività di modifica autorizzate pubblicare il branch sul repository ufficiale e aprire una Pull Request verso `main`, riportando cambiamenti, test e limiti.
5. **Mantenere il branch aggiornato:** confrontarlo con `origin/main` durante il lavoro e prima del merge. Integrare gli aggiornamenti necessari senza riscrivere la cronologia o forzare push; risolvere i conflitti preservando le decisioni approvate e rieseguire i controlli interessati.
6. **Attendere entrambe le CI:** prima del merge devono essere riusciti `consolidamento (ubuntu-latest)` e `consolidamento (windows-latest)` sulla revisione corrente della PR. Non considerare sufficienti esiti riferiti a commit precedenti. Le conversazioni di revisione devono essere risolte.
7. **Lasciare il merge al proprietario:** attendere revisione e autorizzazione esplicita del proprietario; non effettuare autonomamente merge e non attivare auto-merge. Per le PR approvate utilizzare esclusivamente **Squash merge**, nel rispetto del Ruleset. La sola disponibilità tecnica del merge non equivale ad autorizzazione.
8. **Non creare worktree automaticamente:** se utili, proporli spiegando scopo, utilità e conseguenze per cartelle, branch e stato Git; attendere autorizzazione esplicita prima di crearli.
9. **Rispettare le protezioni:** non usare force push, bypass del Ruleset o riscritture di cronologia senza autorizzazione specifica. Non interpretare l'autorizzazione a modificare file o aprire una PR come autorizzazione a tali operazioni.
10. **Proteggere identità e dati:** autore e committer devono usare `Structive-hub <221842812+Structive-hub@users.noreply.github.com>`. Verificare i metadati prima della pubblicazione e non includere credenziali, dati riservati, recapiti personali o percorsi locali identificativi in file, commit, descrizioni PR o log.
11. **Lasciare separato l'archivio:** non modificare `BLUEPRINT-archive`, non usarlo come destinazione di push, branch o PR e non trasferirne cronologia o riferimenti Git nel repository ufficiale. Le citazioni storiche nei documenti restano evidenze, non istruzioni operative.

## 7. UX in parallelo

L'esplorazione UX è un filone di lavoro parallelo. Le scelte di layout, aspetto e navigazione non devono essere dedotte arbitrariamente dal prototipo. Quando si implementa una schermata, verificare che rispetti il modello sottostante e i requisiti UX effettivamente approvati.

Il canvas deve permettere esplorazione e approfondimento senza confondere struttura, dettaglio, vincoli e implementazione. Una proposta di interfaccia non equivale a una funzionalità del motore già disponibile.

## 8. Criterio di completamento

Un'attività è conclusa solo quando il comportamento richiesto è presente nel codice, i test pertinenti sono eseguiti con esito riportato e la documentazione riflette la realtà. **Le modifiche visibili all'utente devono essere coerenti e verificate in italiano**; l'inglese non è un criterio di completamento fino all'approvazione del relativo incremento. Se mancano condizioni richieste dal perimetro concordato, descrivere l'attività come parziale.
