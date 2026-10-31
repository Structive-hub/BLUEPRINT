# UX di Blueprint

Questa cartella contiene la **ricerca UX**, le **decisioni consolidate** e l'inventario dei **riferimenti visuali** per Blueprint, ambiente di progettazione e sviluppo software. Non documenta un gestionale di prenotazioni: il Centro Medico è esclusivamente uno scenario dimostrativo.

## Da dove cominciare

1. **[UX Baseline v0.2](UX_Baseline_v0.2.md)** — punto di riferimento operativo delle decisioni approvate il 30 ottobre 2026, delle motivazioni e delle questioni aperte. **Leggere prima di proporre modifiche all'interfaccia.**
2. **[UX Exploration v0.1](UX_Exploration_v0.1.md)** — snapshot immutato delle ipotesi e delle ricerche precedenti su n8n, Unreal Blueprints, Cursor e Lovable; non trasformare retroattivamente le proposte in decisioni.
3. **[References](references/README.md)** — inventario dei mockup v1 (3 schermate) e v2 (9 schermate).
4. **[Comparisons](comparisons/README.md)** — inventario delle 4 tavole comparative.

## Stato di questo archivio

- I **due documenti Markdown** sono presenti nel repository.
- Sono presenti **12 originali PNG** (3 v1 e 9 v2) e **4 tavole comparative JPG**, importati e verificati dallo ZIP `Blueprint_UX_Documentazione_Visuale_Completa.zip`. Le anteprime sono incorporate nelle tabelle di [References](references/README.md) e [Comparisons](comparisons/README.md), con collegamenti relativi agli originali.
- Il [rapporto di importazione](IMPORTAZIONE_VISUALI.md) inventaria tutti i 19 file dello ZIP, documenta le corrispondenze, gli hash e le verifiche. I 16 asset sono presenti anche nel [commit iniziale del repository ufficiale](https://github.com/Structive-hub/BLUEPRINT/commit/4634f8cf432d6ce072a01304c827826e2c63d963), attualmente privato; questo non equivale al cambio di visibilità pubblica.
- I tre Markdown dello ZIP non sostituiscono i documenti correnti: **Baseline v0.2 ed Exploration v0.1 sono preservate integralmente**, incluse decisioni `BUX-*`, ricerca e questioni aperte.
- I mockup sono **riferimenti esplorativi**, non specifiche approvate né prova di funzionalità implementate.
- Fonte, confronto binario e metadati di provenienza non certificano la titolarità. Prima del cambio di visibilità resta necessaria la conferma del proprietario sui diritti di pubblicazione degli asset e dei relativi input. Consultare l'[avviso sui diritti riservati](../../DIRITTI.md), distinto dalle licenze dei componenti di terzi.

## Provenienza dei materiali UX/UI

Dichiarazione del proprietario, 31 ottobre 2026.

Gli asset UX/UI di BLUEPRINT sono stati sviluppati attraverso un processo di ricerca comparativa su prodotti software esistenti, analisi delle relative scelte progettuali, brainstorming e generazione assistita da intelligenza artificiale.

I prodotti analizzati sono stati utilizzati come riferimenti di studio per individuare problemi, approcci e possibili soluzioni progettuali, non come componenti da riprodurre direttamente.

Le immagini documentano proposte esplorative per BLUEPRINT e non rappresentano interfacce ufficiali dei prodotti esaminati.

La verifica visiva effettuata non ha individuato riproduzioni riconoscibili di marchi o interfacce di terzi. Tale verifica non costituisce certificazione legale di originalità o titolarità.

## Regole per chi lavora sull'UX

- Mantenere distinti **ricerca**, **decisioni confermate** e **questioni aperte**.
- Rispettare la [Baseline](UX_Baseline_v0.2.md) prima di disegnare o implementare nuove schermate.
- Non trasformare termini temporanei come **«recinto»** in etichette definitive senza studio della terminologia.
- Documentare i cambiamenti con motivazioni e riferimenti; utilizzare Git per la cronologia, senza sovrascrivere l'Exploration v0.1.
- Ricordare i requisiti di [AGENTS.md](../../AGENTS.md): italiano come lingua iniziale, inglese previsto in un incremento futuro, modello semantico unico, distinzione tra proposta, approvazione, implementazione e verifica. La [decisione del 30 ottobre 2026](../decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md) distingue le traduzioni differite dalla predisposizione tecnica ancora aperta, da riesaminare prima del passaggio alla Fase 2; non duplicare layout, modello o dati.
- Le prossime attività UX concordate sono **catalogo degli oggetti/informazioni**, **terminologia comprensibile**, poi **organizzazione dei contenuti, interazioni e nuovi mockup**. Non è richiesto avviare subito la produzione di user flow dettagliati.
