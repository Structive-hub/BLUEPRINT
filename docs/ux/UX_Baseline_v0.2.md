# Blueprint — UX Baseline v0.2

**Data di consolidamento:** 30 ottobre 2026  
**Stato:** baseline delle decisioni UX; **non** specifica definitiva né attestazione di funzionalità implementate.  
**Ambito:** esperienza di lavoro, onboarding iniziale e struttura dell'interfaccia di Blueprint.  
**Origine:** discussioni e confronti tra i mockup v1 (3 schermate), v2 (9 schermate), analisi di n8n, Unreal Blueprints, Cursor e Lovable.  
**Documento precedente:** [UX Exploration v0.1](UX_Exploration_v0.1.md).

> **Regola di lettura:** questa baseline descrive le decisioni sull'esperienza desiderata, non lo stato attuale dell'app. Il codice è la fonte per ciò che è effettivamente implementato. Le references sono esplorative; le etichette presenti in esse non diventano automaticamente requisiti.

> **Aggiornamento linguistico, 30 ottobre 2026:** la [decisione successiva sul consolidamento](../decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md) stabilisce italiano iniziale e inglese futuro, senza obbligo di traduzioni inglesi ora. La predisposizione tecnica all'internazionalizzazione resta un requisito aperto, da riesaminare prima del passaggio alla Fase 2; non è attestata da questa baseline. Le decisioni UX `BUX-*`, il layout e lo snapshot storico Exploration v0.1 restano invariati.

## 1. Decisioni confermate

Ogni ID `BUX-*` appartiene a questa baseline; gli ID `UX-*` di Exploration v0.1 hanno significato storico diverso e non devono essere reinterpretati retroattivamente.

| ID | Stato | Decisione | Motivazione / riferimento |
| --- | --- | --- | --- |
| BUX-001 | **Confermata** | Interfaccia prevalentemente scura, adatta a sessioni prolungate. | Preferenza esplicita; mockup v1/v2. Palette esatta ancora aperta. |
| BUX-002 | **Confermata** | Come **layout del workspace** si preferisce il primo mockup v1, non la versione semplificata v2. | Affiancamento 01: più vicino al feeling di un IDE, senza sacrificare il canvas. |
| BUX-003 | **Confermata** | Pannello **struttura del progetto** inizialmente aperto e leggibile; può essere ridotto e riaperto tramite un comando/tendina. | Affiancamento 01; mantenere orientamento e accesso alla gerarchia. |
| BUX-004 | **Confermata** | **Ispettore destro** contestuale: normalmente non occupa spazio senza selezione; si apre selezionando un elemento o collegamento, e può essere richiuso. | Affiancamenti 01–03; canvas libero quando non si ispeziona nulla. |
| BUX-005 | **Confermata come principio** | **Ispezione rapida** e **approfondimento** sono momenti distinti. | Affiancamento 02; non esporre tutte le proprietà in una sola schermata. |
| BUX-006 | **Confermata come principio** | Le **relazioni sono selezionabili e ispezionabili**: non soltanto linee; l'analisi d'impatto è un approfondimento distinto. | Affiancamento 03; una relazione deve poter esporre significato, estremi, regole e conseguenze. |
| BUX-007 | **Confermata come principio** | Stratificare la complessità tramite selezione, viste, navigazione, collegamenti e approfondimenti, conservando il contesto. | Obiettivo UX esplicito dell'utente; n8n principale riferimento per l'esplorazione. |
| BUX-008 | **Confermata come principio** | Prima della modellazione, il progetto parte da **uno standard documentale caricato o compilato** che delimita obiettivi, inclusioni, esclusioni e decisioni aperte. | Evita che l'AI definisca implicitamente l'ambito del progetto. |
| BUX-009 | **Confermata come principio** | L'AI **non è obbligatoria** nella creazione iniziale del progetto; l'assistenza futura è richiamabile e subordinata alle decisioni umane. | Preservare il controllo di progettazione. |
| BUX-010 | **Confermata come metodo** | Non produrre ulteriori mockup come specifiche prima di aver catalogato elementi, informazioni, operazioni e terminologia. | I mockup attuali hanno contenuti/nomi inventati a scopo esplorativo. |

## 2. Elementi dei riferimenti da riprendere (non implementazioni già approvate)

| Riferimento | Punto di forza da studiare | Da evitare |
| --- | --- | --- |
| **n8n** | Canvas leggibile, nodi compatti, connessioni chiare, ispezione contestuale, lavoro su sottografi, livelli di dettaglio. | Trattare ogni relazione come un flusso temporale o creare grafi illeggibili. |
| **Unreal Blueprints** | Porte tipizzate, creazione di connessioni contestuali, pannello proprietà, navigazione nei sottografi, debugging. | Obbligare tutto il progetto a diventare un enorme grafo eseguibile. |
| **Cursor** | Collegamento tra elementi progettuali e implementazione; diff, test, revisione, monitoraggio dei task. | Esporre codice e chat/agenti continuamente anche quando non pertinenti. |
| **Lovable** | Bassa barriera iniziale, azioni contestuali, proposta/revisione prima dell'esecuzione. | Rendere il prompt obbligatorio o confondere una proposta AI con una modifica approvata. |

I riferimenti ai livelli architetturali del **C4 Model** e ai modelli/constraint di **SysML v2** rimangono principi del prodotto: non sono nomi di schede definiti dall'UX.

## 3. Layout di lavoro — direzione scelta

La disposizione di riferimento deriva da **v1, schermata 01**:

- **Barra superiore**: identità progetto, ricerca globale, accesso alle specifiche/ambito e stato del lavoro (etichette finali da studiare).
- **Navigazione principale**: accesso alle aree di lavoro; la tassonomia definitiva è **aperta**.
- **Pannello struttura**: visibile al primo accesso, navigabile, richiudibile e riapribile.
- **Area centrale**: canvas o contenuto della prospettiva di lavoro; deve restare la superficie dominante.
- **Ispettore destro**: chiuso quando non pertinente; aperto con una selezione; informazioni coerenti con il tipo di oggetto.
- **Pannello inferiore**: test, terminale, problemi e attività disponibili quando utili, non obbligatoriamente estesi.
- **Assistente AI**: richiamabile contestualmente; non deve sostituire la normale modifica diretta.

### 3.1 Comportamento per situazione

| Contesto | Restano raggiungibili | Si apre solo se serve |
| --- | --- | --- |
| Canvas senza selezione | Identità progetto, navigazione, struttura inizialmente aperta, canvas, cambio prospettiva | Ispettore e dettaglio, terminale/test, AI |
| Nodo selezionato | Stessa struttura e vista, nodo evidenziato | Ispettore con informazioni essenziali e azioni |
| Relazione selezionata | Grafo e origine/destinazione evidenziate | Ispettore di relazione; approfondimento di vincoli/impatti |
| Apertura modulo/funzione | Breadcrumb/percorso e contesto del progetto | Sottografo, dettagli specifici, proprietà avanzate |
| Cambiare prospettiva | Identità elemento attuale, ove la selezione sia pertinente | Rappresentazione specifica: struttura, vincoli, impatto, codice |
| Implementazione / verifica | Identità progettuale e riferimento al codice | Editor file, test, terminale, diff, log |
| Proposta AI / revisione | Progetto, origine della modifica e ambito dichiarato | Proposta contestuale, differenze, evidenze, approvazioni |

**Distinguere operazioni:** selezionare ≠ navigare ≠ modificare ≠ approvare.

## 4. Onboarding — principio, non user flow definitivo

1. Apri/crea progetto.
2. Carica **oppure** compila lo **stesso standard documentale**.
3. Rivedi ciò che è esplicitamente incluso, escluso, sconosciuto o da decidere.
4. Conferma una prima versione dell'ambito; la mancanza di alcune decisioni non forza l'AI a inventarle.
5. Inizia a modellare progressivamente nel workspace.

**Non confondere:** documento approvato sull'ambito ≠ architettura generata/approvata ≠ codice implementato/verificato.

La parola di lavoro **«recinto» non è una denominazione UI approvata**. Nomi candidati come *Ambito del progetto*, *Requisiti e limiti*, *Specifiche* vanno valutati insieme a tutti gli altri termini prima di inserirli stabilmente nella UI.

## 5. Questioni aperte — non dedurre dai mockup

| Tema | Stato / domanda |
| --- | --- |
| Terminologia | Nomi delle aree, dei comandi, degli stati e degli oggetti: definire un lessico comprensibile e coerente in **italiano**; inglese previsto in un incremento futuro (vedere `AGENTS.md` e la decisione linguistica). |
| Catalogo degli elementi | Quali oggetti rappresenta Blueprint e quali proprietà/azioni ha ciascuno? Non assumere che le tipologie illustrate siano esaustive. |
| Navigazione principale | Distinguere aree di lavoro, viste e sottolivelli; evitare doppioni «Canvas / Struttura / Schema». |
| Comportamento dell'ispettore | Schede e campi specifici per entità, funzione, modulo, relazione, vincolo; non ancora definiti. |
| Struttura richiudibile | Forma del riduttore/tendina, dimensioni e persistenza delle preferenze: da testare. |
| Selezione e apertura | Clic, doppio clic, scorciatoie, tastiera, touch: proposta da validare. |
| Canvas | Tipi di archi, semantica visuale, porte, filtri, zoom semantico, navigazione di grafi grandi: da progettare. |
| Stato del lavoro | Non confondere proposto, approvato, implementato, verificato; verifiche e loro evidenze. |
| Palette e tipografia | Tema scuro confermato, ma colori esatti, contrasto, icone e token non approvati. |
| Documentazione iniziale | Struttura esatta del modello standard e requisiti minimi per partire da definire. |
| Multilingua | Italiano iniziale; traduzioni inglesi in un incremento futuro. Predisposizione tecnica senza duplicare layout, modello o dati ancora da attuare e verificare; nessuna traduzione automatica dei contenuti dell'utente. |

## 6. Materiali visuali

- Prima serie: **3 mockup** (panoramica, entità selezionata, relazione/impatti).
- Seconda serie: **9 mockup** (workspace iniziale, selezione, approfondimento, relazione, cambio prospettiva, AI, codice, revisione, navigazione).
- Affiancamenti comparativi: **4 tavole**.

Consultare [Inventario delle references](references/README.md) e [Confronti](comparisons/README.md). **Il testo non implica che le immagini siano già nel repository**: i manifest precisano lo stato degli asset.

### Abbinamenti utili

- **v1-01 ↔ v2-01**: workspace iniziale; scelta del layout v1, ma ispettore inizialmente chiuso.
- **v1-02 ↔ v2-09**: ispezione entità e gerarchia; dettagli v1 + navigazione contestuale v2.
- **v1-03 ↔ v2-04**: analisi delle conseguenze vs ispezione della relazione; entrambi necessari, ma non la stessa vista.
- **v2-02/03/05/06/07/08**: situazioni nuove, senza equivalente uno-a-uno in v1.

## 7. Regola per le modifiche successive

Se una decisione cambia, aggiornare questa baseline registrando motivazione e riferimento storico in Git. **Non sovrascrivere retroattivamente l'Exploration v0.1** né trasformare in specifiche i nomi o le metriche inventati nei mockup.

**Prossima attività concordata:** catalogare gli oggetti/informazioni e le operazioni di Blueprint, quindi lavorare sulla terminologia e soltanto dopo progettare user flow e nuovi mockup.
