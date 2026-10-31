# Decisione — Lingua italiana e chiusura della Fase 1

- **Data:** 30 ottobre 2026
- **Stato:** approvata
- **Ambito:** Blueprint; lingua di sviluppo e documentazione, criteri di completamento della Fase 1
- **Roadmap:** invariata, quattro fasi

> **Provenienza storica — preparazione pubblica del 31 ottobre 2026:** questa decisione è conservata dal repository originario privato. I riferimenti alla PR e ai commit sotto riportati sono evidenze storiche, non oggetti della nuova cronologia. Le decisioni approvate e i requisiti aperti restano invariati; i controlli della nuova copia sono nel [rapporto di preparazione](../architecture/public-preparation.md).

## Contesto

La roadmap iniziale definisce la **Fase 1 — Consolidare il nucleo** come verifica di repository e versionamento, identità stabile degli elementi, modello condiviso, persistenza, coerenza tra viste e test. La **Fase 2 — Costruire il vero editor Blueprint** comprende navigazione gerarchica e viste/interazioni dell'editor da completare; UX/UI viene esplorata in parallelo e registrata separatamente.

Dopo un problema di avvio è stata eseguita la PR #1 di consolidamento tecnico. Il suo ambito non si limitava all'avvio: comprendeva distribuzione, isolamento del core dalla demo, compatibilità del formato v1, test del modello e prove browser. La PR #1 è stata integrata in `main` nel commit `eeda41e365ae2c5b295659334a69422c326fbf33`.

I precedenti `README.md` e `AGENTS.md` imponevano una localizzazione IT/EN globale, inclusa ogni nuova UI, come condizione per chiudere i lavori. Tale vincolo anticipava la progettazione definitiva delle schermate, non ancora stabilizzata.

## Opzioni considerate

1. Implementare subito IT/EN globale prima della Fase 2: aumenta ora il lavoro su schermate e interazioni ancora soggette a revisione.
2. Lavorare in italiano e introdurre l'inglese quando la struttura del prodotto sarà sufficientemente matura: **scelta approvata**.
3. Duplicare le schermate o i documenti per lingua: escluso.

## Decisione sulla lingua

- **Lingua corrente:** italiano (`it`) per tutte le nuove schermate, i controlli, i messaggi e la documentazione di progetto (README, AGENTS, architettura, decisioni, UX/UI, specifiche, rapporti).
- I termini tecnici, i nomi di standard, il codice e gli identificatori possono seguire le convenzioni proprie. Non si richiede la traduzione retroattiva dei nomi tecnici.
- **Inglese (`en`):** previsto, ma **rinviato** fino a una decisione specifica in una fase di maturità desiderabile. Non introdurre adesso un selettore globale, dizionari o copie di documenti/layout; non bloccare gli incrementi correnti per mancanza dell'inglese.
- Quando l'inglese sarà autorizzato, dovrà condividere gli stessi layout e il medesimo modello semantico, senza tradurre automaticamente i dati progettuali immessi dall'utente. ID, tipi, chiavi e dati persistiti restano indipendenti dalla lingua.
- Il recupero di avvio già disponibile in IT/EN può rimanere invariato; non equivale a una UI bilingue completa.

## Predisposizione architetturale: requisito e stato effettivo

La struttura tecnica deve consentire l'aggiunta futura dell'inglese senza duplicare layout, modello o dati. La separazione dei testi UI dagli identificatori e dai dati progettuali è un **requisito architetturale**, distinto dalla disponibilità delle traduzioni inglesi. Il rinvio delle traduzioni non elimina questo requisito.

**Stato verificato nel codice al consolidamento:** `src/app/main.tsx` e i componenti contengono ancora molti testi UI direttamente nel codice; `src/i18n/` e una gestione globale delle risorse linguistiche non sono presenti. `src/app/startup-recovery.js` dispone di un dizionario e di una scelta IT/EN limitati al recupero d'avvio. Non è quindi dimostrata né completata una predisposizione tecnica globale. Questa integrazione modifica soltanto documenti.

**Prima del passaggio alla Fase 2:** riesaminare i requisiti strutturali ancora aperti, definire il perimetro dell'intervento per separare testi UI, identificatori e dati, e stabilire le verifiche che ne dimostrino l'attuazione senza duplicazioni. Non è richiesto implementare ora le traduzioni inglesi. Il completamento della predisposizione richiederà evidenze nel codice e nei test, non la sola approvazione di questo documento.

## Verifica dei criteri della Fase 1

| Obiettivo originale | Evidenza disponibile | Esito per la Fase 1 |
| --- | --- | --- |
| Repository Git, versione ufficiale identificabile | Repository GitHub, PR #1 integrata in `main` | Coperto |
| Modello condiviso fra più viste | Architettura `src/core/` e test browser di CRUD/coerenza tra Vincoli e Impatto | Coperto nei flussi testati |
| Identità stabile e operazioni sul modello | `tests/graph.test.ts` e test di compatibilità/importazione | Coperto nei flussi testati |
| Persistenza, esportazione e importazione | `tests/graph.test.ts`, `tests/browser.spec.mjs` | Coperto nei flussi testati |
| Verifiche riproducibili e distribuzione | 45 test del nucleo eseguiti da Codex; CI post-merge riuscita; rapporto di consolidamento con esiti Windows/Linux e browser | Coperto nei controlli disponibili |
| Localizzazione globale IT/EN | Non implementata; requisito introdotto separatamente e ora rinviato | **Fuori dai criteri di chiusura attuali**, non soddisfatto |
| Predisposizione strutturale alla futura internazionalizzazione | Testi UI ancora nei componenti; dizionario limitato al recupero d'avvio | **Aperto: da riesaminare prima del passaggio alla Fase 2**, non attestato dal consolidamento |

**Esito:** la **Fase 1 è consolidata sul perimetro tecnico verificato e sulle evidenze disponibili**. Questo non dichiara completati tutti i requisiti strutturali né autorizza a considerarli assolti prima della Fase 2. Le limitazioni documentate (ad esempio copertura dei test non esaustiva, problemi ambientali non sempre riproducibili, UX da stabilizzare e semantica più avanzata) restano evidenti.

## Conseguenze operative

1. Aggiornare `README.md`, `AGENTS.md` e il rapporto architetturale per distinguere le traduzioni inglesi differite dalla predisposizione strutturale ancora aperta e riflettere il consolidamento verificato della Fase 1.
2. Non modificare il codice del prodotto né la persistenza per questa decisione.
3. UX/UI continua nel proprio filone: `docs/ux/` contiene già la baseline approvata, la ricerca storica e gli inventari visuali. Questi materiali restano preservati; la baseline non è una specifica definitiva né prova di funzioni implementate. I relativi incrementi richiedono il riesame dei requisiti strutturali aperti prima del passaggio alla Fase 2.
4. Nessuna dichiarazione di supporto inglese completo prima della relativa implementazione e dei test.

## Riferimenti

- [Roadmap ufficiale](../../README.md#roadmap-di-prodotto-quattro-fasi)
- [Regole per gli agenti](../../AGENTS.md)
- [Architettura operativa](../architecture/README.md)
- [Rapporto del consolidamento Fase 1](../architecture/phase-1-consolidation.md)
