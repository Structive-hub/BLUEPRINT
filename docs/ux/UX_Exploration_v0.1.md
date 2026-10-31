# BLUEPRINT — UX Exploration & Interaction Principles

**Versione:** 0.1 — Snapshot delle riflessioni UX  
**Data:** 29 ottobre 2026  
**Stato:** Documento di esplorazione, non specifica definitiva  
**Scopo:** Conservare analisi, principi e decisioni da utilizzare per progettare e confrontare i primi mockup dell'interfaccia di Blueprint.  
**Perimetro:** UX/UI del prodotto **Blueprint**, ambiente visuale per la progettazione, implementazione, verifica e supervisione dello sviluppo software. Il **Centro Medico** è soltanto un progetto dimostrativo, non il prodotto da costruire.

> **Principio guida**  
> La complessità non va eliminata né mostrata tutta insieme: va **stratificata attraverso le interazioni**. La stessa informazione deve essere esplorabile a diversi livelli e da prospettive diverse, senza perdere il contesto.

---

## 1. Cosa stiamo cercando di progettare

Blueprint non è un semplice editor di diagrammi e non è un gestionale per prenotazioni. È un ambiente di sviluppo in cui un modello semantico condiviso rappresenta **intenzioni, entità, funzioni, moduli, relazioni, comportamenti, vincoli, stati, verifiche ed evidenze**; differenti interfacce ne mostrano prospettive parziali. L'utente deve poter progettare, approfondire, collegare, modificare, verificare e — in fasi successive — assegnare l'implementazione ad agenti AI senza perdere il controllo delle decisioni.

L'interfaccia deve combinare due sensazioni:

- **IDE professionale:** concentrazione, orientamento, strumenti precisi, navigazione rapida, codice e controlli disponibili.
- **Ambiente di vibe coding:** accesso semplice, interazioni dirette, proposte in linguaggio naturale, risultati e revisioni facilmente esplorabili.

L'estetica non deve forzare il funzionamento. L'onboarding, il lavoro nel canvas, l'approfondimento di un elemento e la revisione del codice appartengono allo stesso percorso, ma non devono occupare contemporaneamente tutto lo schermo.

### 1.1 Decisioni, preferenze e ipotesi: legenda

- **[CONFERMATO DALL'UTENTE]** Indicazione esplicita emersa nella discussione.
- **[DIREZIONE PROPOSTA]** Raccomandazione da testare nei mockup, non decisione approvata.
- **[DA VALIDARE]** Scelta progettuale aperta o rischio da verificare.
- **[FUTURO]** Capacità prevista nel prodotto, non necessariamente nel primo mockup/MVP.

### 1.2 Registro delle decisioni

| ID | Stato | Indicazione | Implicazione |
| --- | --- | --- | --- |
| UX-001 | **[CONFERMATO DALL'UTENTE]** | Preferenza per un'interfaccia **scura**, adatta a sessioni di lavoro prolungate | I mockup partono da dark mode; evitare grandi superfici bianche |
| UX-002 | **[CONFERMATO DALL'UTENTE]** | Il feeling deve richiamare gli IDE e i prodotti di vibe coding | Evitare l'estetica da dashboard gestionale tradizionale |
| UX-003 | **[CONFERMATO DALL'UTENTE]** | **n8n piace molto** come riferimento | Il suo canvas e la logica di esplorazione sono il principale benchmark visivo da studiare |
| UX-004 | **[CONFERMATO DALL'UTENTE]** | La **complessità va stratificata tramite interazioni**, viste, clic, collegamenti e approfondimenti | Progettare stati d'interfaccia e percorsi, non solo schermate statiche |
| UX-005 | **[DIREZIONE PROPOSTA]** | Un **modello semantico unico** alimenta più viste | Cambiare prospettiva non deve creare copie divergenti dei dati |
| UX-006 | **[DIREZIONE PROPOSTA]** | L'elemento selezionato resta selezionato passando tra viste, quando pertinente | Persistenza del contesto di navigazione |
| UX-007 | **[DIREZIONE PROPOSTA]** | I **collegamenti sono oggetti ispezionabili**, non linee decorative | Relazioni con tipo, proprietà, vincoli, provenienza e conseguenze |
| UX-008 | **[DIREZIONE PROPOSTA]** | L'AI è contestuale e richiamabile, non necessariamente una chat fissa | Canvas e modello mantengono la centralità |
| UX-009 | **[DIREZIONE PROPOSTA]** | Palette **Graphite** e componenti sobri come punto di partenza | Da confrontare con Midnight e Obsidian; nessuna palette ancora approvata |
| UX-010 | **[DA VALIDARE]** | La distinzione tra clic, doppio clic, hover e comando esplicito | Verificare scopribilità, accessibilità e alternative touch/tastiera |
| UX-011 | **[DA VALIDARE]** | Semantic zoom, sottografi e livelli C4 come meccanismi di riduzione del rumore | Verificare se migliorano la comprensione in grafi reali |

---

## 2. Benchmark comparativo: quattro applicazioni

I prodotti osservati affrontano problemi diversi. Non vanno copiati integralmente: occorre estrarre **pattern di interazione** pertinenti a Blueprint.

### 2.1 n8n — Panoramica, nodi e comprensione dei collegamenti

**La sua lezione più forte:** rendere leggibile un processo complesso nella vista d'insieme e spostare i dettagli nel contesto del nodo.

**Punti di forza da studiare**

1. **Canvas centrale ampio:** il grafo è il protagonista; griglia e bordi restano secondari.
2. **Nodi compatti e riconoscibili:** nome, funzione, stato e collegamenti prima dei parametri minuti.
3. **Flussi direzionali visibili:** le connessioni aiutano a capire cosa influenza cosa.
4. **Inserimento contestuale:** la creazione di un nuovo passo avviene vicino a quello esistente.
5. **Ispezione focalizzata:** selezionare/aprire un nodo permette di concentrarsi su configurazione, ingressi e uscite.
6. **Separazione tra struttura e dati:** il canvas non viene sovraccaricato da ogni parametro.
7. **Feedback operativo:** stati, esecuzioni, risultati ed errori rendono visibile cosa è avvenuto.
8. **Debugging locale:** test ed esecuzione parziale riducono l'area da indagare.
9. **Dati di test riutilizzabili:** input riproducibili agevolano il debugging.
10. **Sottoworkflow:** parti del sistema possono essere incapsulate in unità navigabili o riutilizzabili.
11. **Zoom, panoramica e minimappa:** utili per orientarsi in grafi di media dimensione.
12. **Controlli disponibili nel contesto:** le azioni rilevanti appaiono vicino all'elemento interessato.

**Traduzione in Blueprint:** overview dei moduli, poi funzioni/entità, poi dettaglio di una singola funzione; l'ispezione mostra proprietà e relazioni senza costringere a leggere tutto il progetto.

**Cosa NON importare:** presumere che ogni relazione sia un flusso eseguibile. `Medico → appartiene a → Specialità` è una relazione semantica, non un ordine di esecuzione. Evitare canvas sempre più affollati e fili illeggibili.

### 2.2 Unreal Engine Blueprints — Profondità operativa e precisione

**La sua lezione più forte:** il grafo può essere un ambiente di lavoro semantico ed eseguibile, non una fotografia di componenti.

**Punti di forza da studiare**

1. **Porte tipizzate:** il tipo di collegamento è comprensibile e può essere validato.
2. **Trascinamento da porta a porta:** la creazione di relazioni è diretta e spaziale.
3. **Ricerca/azioni contestuali:** trascinando una connessione compaiono possibili nodi o azioni compatibili.
4. **Pannello Details:** proprietà dell'elemento selezionato senza ingombrare il canvas.
5. **Proprietà avanzate comprimibili:** esposizione progressiva anche dentro l'ispettore.
6. **Gerarchia di funzioni, variabili, grafi e componenti:** un indice persistente del sistema.
7. **Breadcrumb e schede:** ingresso nei sottografi mantenendo l'orientamento.
8. **Funzioni e sottografi:** incapsulamento e riuso.
9. **Breakpoint e visual debugging:** comprensione del percorso operativo ed evidenze su ciò che succede.
10. **Evidenziazione e ricerca:** individuazione delle dipendenze senza seguire manualmente ogni cavo.
11. **Scorciatoie e comandi professionali:** velocità per utenti esperti senza obbligare i principianti a usarli.
12. **Distinzione visiva dei tipi:** porte, nodi e segnali hanno riconoscibilità semantica.

**Traduzione in Blueprint:** collegamenti con regole; ispettore contestuale che cambia secondo entità, funzione, modulo, relazione o vincolo; sottografi navigabili; comportamento operativo disponibile quando necessario.

**Cosa NON importare:** esposizione precoce di troppe porte, eventi e dettagli di basso livello. Il grafo dell'intero progetto deve rimanere progettuale; la programmazione visuale dettagliata è un possibile approfondimento locale, non necessariamente il primo livello.

### 2.3 Cursor — Supervisione degli agenti e revisione del lavoro

**La sua lezione più forte:** distinguere ciò che è stato chiesto, ciò che è stato realizzato e ciò che deve essere verificato, rendendo il codice accessibile su richiesta.

**Punti di forza da studiare**

1. **Orientamento al lavoro delegato:** attività degli agenti leggibili a livello di risultato.
2. **Passaggio tra panoramica e IDE:** possibilità di approfondire senza cambiare prodotto.
3. **Diff e file modificati:** revisione delle modifiche prima dell'accettazione.
4. **Contesto navigabile:** dal problema al file, dal file alla modifica, dalla modifica alla verifica.
5. **Checkpoint e storia delle operazioni:** possibilità di esaminare o ripristinare stati precedenti.
6. **Lavori paralleli:** supervisione di più interventi in contemporanea.
7. **Pannelli combinabili:** codice, agenti, risultati e browser non devono necessariamente competere nello stesso spazio.
8. **Browser/anteprima integrati:** confronto tra comportamento osservato e codice.
9. **Annotazioni puntuali:** riduzione dell'ambiguità nelle richieste di correzione.
10. **Test/log come evidenze:** affermazioni dell'agente verificabili tramite risultati accessibili.

**Traduzione in Blueprint:** seleziono una funzione del modello, vedo incarichi AI associati, proposte, stato delle implementazioni, test, differenze e file. La vista iniziale mostra il risultato; il codice è un livello d'approfondimento.

**Cosa NON importare:** fare della chat o di un elenco di agenti il centro permanente di ogni schermata. Il contesto deve vivere negli oggetti del Blueprint, non esclusivamente nella cronologia delle conversazioni.

### 2.4 Lovable — Ingresso semplice, intenzione e manipolazione diretta

**La sua lezione più forte:** iniziare da un'intenzione è facile; l'utente può osservare un risultato e correggerlo nel suo contesto senza dover apprendere immediatamente gli strumenti tecnici.

**Punti di forza da studiare**

1. **Linguaggio naturale come punto di partenza:** un utente può descrivere cosa vuole costruire.
2. **Anteprima vicina alla richiesta:** il risultato è verificabile senza cambiare ambiente.
3. **Separazione tra confronto/pianificazione ed esecuzione:** la richiesta non deve sempre modificare immediatamente il progetto.
4. **Approvazione prima della costruzione:** l'utente mantiene un punto di controllo.
5. **Selezione visuale dell'elemento:** indicare con precisione cosa cambiare.
6. **Modifica contestuale:** il prompt riguarda l'oggetto selezionato, non l'intero progetto.
7. **Cronologia e iterazioni:** rendere reversibile la sperimentazione.
8. **Accesso progressivo al codice:** strumenti tecnici disponibili senza essere obbligatori.
9. **Riduzione delle decisioni iniziali:** l'onboarding può partire da un documento o da poche domande pertinenti.
10. **Feedback rapido:** esito della richiesta visibile in tempi brevi.

**Traduzione in Blueprint:** importo un documento o descrivo un progetto; l'AI propone una struttura; seleziono `Sposta appuntamento` e chiedo una modifica circoscritta; vedo differenze e conseguenze prima di approvare.

**Cosa NON importare:** interazione *prompt-only*. Rinominare un elemento, collegarlo, cambiare una proprietà o riorganizzare il canvas devono essere azioni dirette e deterministiche.

### 2.5 Sintesi: cosa ereditiamo e perché

| Esigenza di Blueprint | Benchmark | Pattern da testare | Rischio da evitare |
| --- | --- | --- | --- |
| Leggere un progetto senza conoscere ogni dettaglio | n8n | Canvas pulito, nodi compatti | Groviglio di connessioni |
| Modificare il sistema attraverso il grafo | Unreal | Porte, relazioni tipizzate, azioni contestuali | Micro-dettagli tecnici mostrati troppo presto |
| Approfondire un singolo elemento | n8n + Unreal | Ispettore + vista focalizzata | Troppi popup |
| Passare tra livelli architetturali | C4 come riferimento concettuale; Unreal/n8n per UX | Gerarchia, breadcrumb, sottografi | Perdere il contesto nel salto |
| Governare l'AI | Cursor + Lovable | Piano → proposta → diff → approvazione | Chat che diventa fonte unica dello stato |
| Capire problemi e conseguenze | Cursor + n8n | Evidenze e percorsi evidenziati | Spiegazioni senza prova |
| Onboarding accessibile | Lovable | Intenzione/documento → proposta ispezionabile | Generazione incontrollata |

---

## 3. Modello UX: stratificazione della complessità

La UI non è una collezione di pagine scollegate. Si muove lungo **quattro assi indipendenti**:

| Asse | Domanda | Esempi |
| --- | --- | --- |
| **Profondità** | Quanto voglio approfondire? | Progetto → Modulo → Entità/Funzione → Dimensione → Codice |
| **Prospettiva** | Cosa voglio osservare? | Struttura, comportamento, relazioni, vincoli, impatto, implementazione |
| **Contesto** | Quale oggetto sto osservando? | Medico, Agenda, `Sposta appuntamento`, relazione `lavora in` |
| **Attività** | Quale lavoro sto svolgendo? | Progettare, implementare, verificare, revisionare |

**Regola UX:** cambiare prospettiva o attività non deve cancellare senza motivo la selezione o la posizione logica dell'utente. Se seleziono `Sposta appuntamento` nella Struttura, passando ai Vincoli dovrei osservare i vincoli pertinenti a quella funzione, oppure ricevere una spiegazione chiara dell'assenza di risultati.

### 3.1 Cinque livelli di approfondimento di un oggetto

| Livello | Cosa vedo | Interazione ipotizzata | Esempio: Medico |
| --- | --- | --- | --- |
| **L1 Panoramica** | Identità, tipo, ruolo nel sistema, stato sintetico | Osservazione del nodo | `Medico` come entità |
| **L2 Ispezione** | Proprietà principali e collegamenti rilevanti | Clic / selezione | Identificativo, specializzazione, relazioni |
| **L3 Focus** | Dimensioni, proprietà avanzate, comportamenti | Doppio clic o comando `Apri` | Dimensioni organizzativa, temporale, autorizzativa |
| **L4 Relazioni e vincoli** | Dipendenze, regole, conseguenze possibili | Clic su una relazione / cambia vista | `Medico → lavora in → Sede` |
| **L5 Implementazione** | File, codice, test, log, lavoro agenti, evidenze | `Apri implementazione` | Sorgenti e test della gestione medico |

**Nota:** questi livelli sono un modello di accesso, non cinque finestre obbligatorie né una sequenza che ogni utente deve percorrere. Un utente esperto può saltare direttamente al livello desiderato. La gerarchia non è necessariamente una singola linea: una relazione può essere approfondita senza passare dal codice.

### 3.2 Disclosure progressiva nello stesso pannello

Anche l'ispettore deve avere livelli:

- **Essenziale:** nome, tipo, descrizione breve, stato, azioni più frequenti.
- **Relazioni:** elenco e navigazione verso oggetti collegati.
- **Dimensioni:** sezioni comprimibili per proprietà organizzative, temporali, autorizzative ecc.
- **Vincoli e verifiche:** regole collegate e loro stato, con riferimenti alle evidenze.
- **Avanzato:** provenienza, versioni, metadati, riferimenti a codice e modelli tecnici.

L'utente non deve vedere contemporaneamente tutto ciò che il sistema conosce.

### 3.3 Semantic zoom [DA VALIDARE]

Proposta di tre granularità visuali nello **stesso** canvas:

1. **Lontano:** cluster/moduli, etichette sintetiche, conteggi e stato aggregato.
2. **Normale:** nodi leggibili, tipo, poche relazioni principali, problemi pertinenti.
3. **Vicino:** più dettagli, porte, direzioni delle relazioni e azioni contestuali.

Il semantic zoom non deve semplicemente rimpicciolire lo stesso contenuto: deve cambiare **quale** informazione viene mostrata. L'apparizione di porte e dettagli non deve causare salti imprevedibili del layout.

---

## 4. Architettura dell'interfaccia proposta

### 4.1 Workspace modulare [DIREZIONE PROPOSTA]

| Regione | Funzione | Comportamento |
| --- | --- | --- |
| **Top bar** | Progetto, breadcrumb, ricerca globale, stato, azioni principali | Sempre riconoscibile, contenuto compatto |
| **Navigation rail sinistra** | Accesso a viste/attività e sezioni | Compatta; espandibile su richiesta |
| **Area centrale** | Canvas, sottografo, codice, vincoli, impatto, anteprima | Superficie primaria, ampia e con più modalità |
| **Inspector destro** | Attributi della selezione | Contestuale, ridimensionabile, richiudibile |
| **Pannello inferiore** | Verifiche, terminale, log, problemi | Chiuso o ridotto se non serve |
| **AI assistant** | Proposte, chiarimenti, delega e revisione | Richiamabile globalmente o su elemento selezionato |

**Direzione estetica:** superfici scure, rumore visivo ridotto, pochi colori d'accento, informazioni dense ma leggibili, pannelli senza bordi pesanti, controlli che appaiono quando pertinenti.

### 4.2 Tre modalità di lavoro [DIREZIONE PROPOSTA]

- **Progetta:** priorità al canvas, alla gerarchia, all'ispettore e ai vincoli.
- **Sviluppa:** priorità a codice, file, terminale; il Blueprint resta contestualmente navigabile.
- **Verifica:** priorità a impatto, vincoli, problemi, evidenze e differenze.

Le modalità non sono database separati né applicazioni indipendenti: sono **disposizioni e strumenti differenti applicati al medesimo modello**. Non dovrebbero impedire all'utente di aprire una vista in una modalità diversa.

### 4.3 Navigazione gerarchica

Ispirazione **C4 per i livelli architetturali** e pattern di breadcrumb/sottografi di Unreal:

`Workspace → Progetto → Sistema/Contesto → Modulo → Componente → Funzione/Entità`

Questa sequenza è **esemplificativa**: la nomenclatura e la gerarchia effettiva del modello vanno progettate, non assunte equivalenti a C4 o SysML. Tornare a un livello superiore non deve cancellare le modifiche o il contesto dell'oggetto visitato.

---

## 5. Oggetti del canvas e comportamento delle interazioni

### 5.1 I nodi sono rappresentazioni, non la struttura fondamentale

Un **nodo visuale** può rappresentare un'entità, una funzione, un modulo, un vincolo, un evento, un sottosistema o altri elementi modellati. La sua semantica deriva dal **tipo dell'oggetto**, non dal semplice fatto che appaia come una card.

**Informazioni minime sul nodo:** nome; tipo; identificazione visiva non basata solo sul colore; indicatore discreto di stato o criticità quando pertinente. Dettagli profondi solo su selezione/zoom.

**Stati di approvazione, implementazione e verifica devono essere distinti.** `Approvato` non equivale a `Implementato`; `Implementato` non equivale a `Verificato`.

### 5.2 Pattern di selezione [DA VALIDARE]

| Interazione | Proposta | Obiettivo UX |
| --- | --- | --- |
| Hover su nodo | Evidenziare nodo, porte rilevanti e collegamenti vicini; tooltip breve | Orientamento rapido |
| Clic su nodo | Selezionare + aggiornare ispettore, senza cambiare canvas | Ispezione leggera |
| Doppio clic / `Apri` | Entrare in focus o sottografo dell'oggetto | Approfondimento |
| Clic su collegamento | Selezionare la relazione e mostrarne i dettagli | Relazioni come oggetti di primo livello |
| Hover su collegamento | Evidenziare estremi, direzione e tipo | Tracciare i legami |
| Trascinamento da porta | Suggerire destinazioni/tipi compatibili | Creazione guidata |
| Selezione multipla | Operazioni di raggruppamento e analisi comune | Lavoro su sottosistemi |
| Ricerca globale | Risultato → evidenziazione nel canvas/ispettore | Accesso diretto, senza navigazione manuale |
| Breadcrumb/Indietro | Risalire nel contesto precedente | Orientamento e recupero |

**Accessibilità:** ogni interazione importante deve avere un'alternativa da tastiera o comando esplicito. Le azioni non possono dipendere soltanto da hover, doppio clic o colore.

### 5.3 Relazioni come oggetti selezionabili

Una relazione `Medico — lavora in → Sede` non è solo una linea. Il suo ispettore può mostrare:

- **Identità e tipo:** `lavora in`, relazione organizzativa.
- **Origine e destinazione:** Medico, Sede.
- **Semantica/cardinalità:** da definire nel modello; non presumere che sia sempre molti-a-molti.
- **Vincoli applicabili:** regole collegate alla relazione.
- **Provenienza e affidabilità:** requisito esplicito, inferenza AI, proposta, approvazione.
- **Impatto:** dipendenze effettivamente dedotte e possibilità da verificare.
- **Azioni:** modifica, elimina con valutazione degli impatti, mostra vicinato, apri evidenze.

Il clic su una linea deve mantenere visibili gli estremi selezionati e permettere di navigare a entrambi.

### 5.4 Tipi di collegamenti [DA VALIDARE]

Distinguere visivamente (e nel modello) almeno:

- **Relazione strutturale:** appartenenza, composizione, specializzazione.
- **Dipendenza:** A richiede o utilizza B.
- **Flusso operativo/dati:** ingresso, uscita, evento, chiamata.
- **Vincolo:** regola che riguarda un elemento o una relazione.
- **Tracciabilità:** requisito → modello → implementazione → verifica.

Non tutte le relazioni devono avere porte eseguibili. Il tipo determina azioni possibili, direzione, validazioni e rappresentazione.

### 5.5 Analisi d'impatto: rappresentare il grado di certezza

Il sistema deve distinguere almeno:

1. **Conseguenza deterministica:** deriva da un collegamento o una regola formalmente presenti.
2. **Possibile conseguenza:** deduzione o rischio che richiede indagine.
3. **Informazione mancante:** il modello non contiene abbastanza elementi per rispondere.
4. **Conseguenza verificata:** esiste una prova/test collegato; esplicitare quale.

Non presentare le ipotesi generate dall'AI come fatti o come test riusciti.

---

## 6. AI nell'interfaccia: contestuale, non dominante

### 6.1 Workflow da studiare [DIREZIONE PROPOSTA]

`Intenzione o documento → proposta di struttura → ispezione delle differenze → approvazione → implementazione delegata → verifiche → revisione`

L'AI può proporre un nuovo nodo o un collegamento, ma la UI deve mostrare **che cosa cambierebbe nel modello** e quali decisioni richiedono l'utente.

### 6.2 Punti d'ingresso per l'assistente

- **Globale:** “Aiutami a definire la struttura del progetto”.
- **Su un nodo:** “Aggiungi il comportamento di proposta di nuovi orari a questa funzione”.
- **Su una relazione:** “Quali vincoli sono interessati se la cardinalità cambia?”.
- **Su un problema:** “Spiegami il motivo del controllo fallito e le evidenze”.
- **Su una proposta/diff:** “Che cosa hai modificato rispetto alla decisione approvata?”.

Ogni conversazione contestuale deve riferirsi a un'identità stabile dell'oggetto, non soltanto al testo di una chat passata.

### 6.3 Supervisione agenti [FUTURO]

Vista di sintesi: incarichi, stato, parti del modello coinvolte, file modificati, verifiche, risultati, differenze, questioni aperte. Dalla sintesi si può aprire il codice o il log, senza imporlo come primo passo.

---

## 7. Direzione visuale: dark, sobria, leggibile

**Confermato:** preferenza per uno sfondo scuro. **Non confermati:** palette, valori esatti, contrasto finale, font, dimensioni e iconografia.

### 7.1 Palette candidate per mockup

| Nome | Background | Panel | Elevated | Accent | Carattere |
| --- | --- | --- | --- | --- | --- |
| **Graphite** [preferenza iniziale proposta] | `#14171C` | `#20252E` | `#2C3340` | `#98A8FF` | Neutra, professionale, poco invadente |
| **Midnight** | `#101625` | `#1C2638` | `#2A3951` | `#67B9D9` | Tecnica e blu |
| **Obsidian** | `#19191B` | `#29282D` | `#39363E` | `#C6A6FF` | Morbida e sofisticata |

**Guardrail visivi:**

- Evitare nero assoluto ovunque; usare gerarchie di superfici.
- Non affidare i significati semantici soltanto al colore: icone, label, forma e testo.
- Sfruttare un colore d'accento per selezione/focus/azioni prioritarie, non per decorazione diffusa.
- Evitare ombre spettacolari, gradienti invadenti, glow permanenti e rumore visivo.
- Verificare contrasto di testo piccolo, codici, link, collegamenti sottili e stati di focus.
- Conservare una buona densità informativa senza comprimere i controlli essenziali.
- Prevedere stati di hover, focus tastiera, selezione, errore, proposta, approvazione, verifica.

---

## 8. Anti-pattern da evitare

1. **Grafo globale gigantesco:** mostrare tutti i nodi e tutte le relazioni insieme.
2. **Canvas trattato come immagine:** connessioni puramente grafiche prive di semantica o effetti sul modello.
3. **Ispettore infinito:** centinaia di campi senza raggruppamenti, ricerca e progressive disclosure.
4. **Popup a cascata:** ogni clic apre una nuova modale e fa perdere il contesto.
5. **Chat come unico registro:** decisioni e requisiti rintracciabili soltanto nei prompt.
6. **Ambiguità degli stati:** approvato, implementato e verificato fusi in una sola etichetta.
7. **Dipendenza dal prompt:** obbligare a usare l'AI per normali operazioni CRUD.
8. **Semantic zoom cosmetico:** stessa densità informativa, solo più piccola.
9. **Relazioni senza identità:** linee non selezionabili, non modificabili o prive di provenienza.
10. **Analisi d'impatto teatrale:** risultati predefiniti che fingono generalità o certezza.
11. **Cambio vista che resetta la selezione:** costringe a cercare sempre lo stesso elemento.
12. **Onboarding con modellazione totale upfront:** troppi concetti tecnici prima di poter lavorare.

---

## 9. Criteri UX verificabili per i mockup

Non basta che i mockup “sembrino moderni”. Devono mostrare che si può lavorare con complessità crescente.

| ID | Scenario / requisito | Evidenza richiesta nel mockup |
| --- | --- | --- |
| M-01 | Capire il progetto in una prima occhiata | Canvas con moduli/nodi, gerarchia e stato, senza ispettore invasivo |
| M-02 | Selezionare un'entità | Il canvas resta visibile; l'ispettore mostra solo i dati pertinenti |
| M-03 | Selezionare una relazione | La linea e i due estremi si evidenziano; compaiono tipo e proprietà |
| M-04 | Approfondire un nodo | Accesso a dimensioni e sottoelementi; breadcrumb e ritorno |
| M-05 | Cambiare vista mantenendo il contesto | Stessa selezione in Struttura/Vincoli/Impatto quando applicabile |
| M-06 | Aggiungere una relazione | Ricerca o suggerimenti di connessioni compatibili; azione esplicita |
| M-07 | Individuare un problema | Stato evidente, messaggio comprensibile, collegamento a vincolo/evidenza |
| M-08 | Distinguere fatto e ipotesi | Indicatori e testo che separano vincoli approvati da proposte/possibilità |
| M-09 | Utilizzare l'AI contestualmente | Azione “Chiedi all'AI su questo elemento”, senza occupare sempre metà schermo |
| M-10 | Gestire un canvas grande | Zoom semantico, raggruppamento, filtri, ricerca e focus locale |
| M-11 | Orientarsi dopo l'approfondimento | Breadcrumb, back, titolo progetto/modulo sempre riconoscibili |
| M-12 | Operare senza mouse | Controlli importanti accessibili da tastiera e focus distinguibile |

**Test consigliato:** mostrare ogni mockup senza spiegazioni, chiedere “Dove mi trovo? Cosa è selezionato? Cosa puoi fare adesso? Dove troveresti le relazioni, i vincoli o il codice?”. Raccogliere i punti di esitazione prima di fissare il layout.

---

## 10. Brief operativo per la prima esplorazione dei mockup

### 10.1 Contesto comune ai tre stati

- **Applicazione:** Blueprint, ambiente di sviluppo.
- **Progetto aperto:** `Centro Medico` (esclusivamente caso di esempio).
- **Vista:** `Struttura`.
- **Aspetto:** dark, ispirazione n8n, strumenti IDE compatti, superficie centrale dominante.
- **Dati d'esempio:** modulo `Prenotazioni`; entità `Medico`, `Paziente`, `Agenda`, `Appuntamento`, `Sede`; funzione `Sposta appuntamento`; relazione `Medico → lavora in → Sede`.
- **Coerenza:** stesso viewport, stesse posizioni di base, stesso canvas e stessa struttura dati fra i mockup.
- **Vincolo:** rappresentare *Blueprint che modella* il sistema medico, non una UI usata da pazienti o medici per prenotare visite.

### Mockup A — Nessun elemento selezionato

**Domanda da risolvere:** l'utente capisce che sta osservando la struttura di un progetto software e riconosce le azioni possibili senza istruzioni?

Mostrare:

- Top bar con nome progetto, breadcrumb e vista.
- Navigation rail con le sezioni principali.
- Canvas pulito con moduli e pochi elementi chiave; tipi riconoscibili.
- Controlli zoom, ricerca e filtri accessibili ma discreti.
- Nessun ispettore dettagliato invadente; eventuale pannello neutro compatto.
- Uno stato di progetto non ambiguo.

**Criterio di successo:** la gerarchia è comprensibile a colpo d'occhio.

### Mockup B — Entità `Medico` selezionata

**Domanda da risolvere:** si riesce ad approfondire l'oggetto senza perdere la struttura?

Mostrare:

- Nodo `Medico` selezionato, suoi collegamenti pertinenti evidenziati.
- Ispettore con nome, tipo, breve descrizione, proprietà principali, stato.
- Sezioni comprimibili `Dimensioni`, `Relazioni`, `Vincoli`, `Implementazione` (non tutte aperte).
- Azioni `Apri`, `Mostra dipendenze`, `Chiedi all'AI`, `Modifica` visibili in modo gerarchico.
- Canvas leggibile anche con pannello ispettore aperto.

**Criterio di successo:** l'utente comprende il livello corrente e trova il percorso per approfondire senza confondere proprietà con relazioni.

### Mockup C — Relazione `Medico → lavora in → Sede` selezionata

**Domanda da risolvere:** l'utente percepisce che il collegamento è un oggetto di dominio modificabile e verificabile?

Mostrare:

- Relazione selezionata; estremi riconoscibili e focalizzati.
- Ispettore della **relazione**, non dell'entità.
- Tipo, direzione, cardinalità (da validare), provenienza e stato di approvazione.
- Vincoli collegati e conseguenze potenziali chiaramente distinti.
- Azioni `Modifica relazione`, `Mostra conseguenze`, `Apri evidenze`.
- Possibilità di raggiungere facilmente `Medico` e `Sede`.

**Criterio di successo:** il collegamento non appare come un semplice ornamento grafico.

### 10.2 Dopo i primi tre mockup, non prima

Se i tre stati funzionano, sviluppare una seconda tranche:

- **D — Focus su funzione:** dettagli di `Sposta appuntamento`, ingressi, uscite, comportamento e vincoli.
- **E — Vista Vincoli:** stesso oggetto, nuova prospettiva.
- **F — Vista Impatto:** modifica di una relazione, dipendenze certe, ipotesi e dati mancanti.
- **G — Vista Sviluppo:** proposta AI e diff, passando dal modello al codice.
- **H — Zoom semantico:** stesso grafo a tre granularità.

---

## 11. Questioni aperte, da decidere sui mockup

1. Clic semplice, doppio clic, tasto `Apri`: quale combinazione è più riconoscibile e accessibile?
2. L'ispettore laterale è permanente, overlay temporaneo o adattivo alla dimensione della finestra?
3. Nella panoramica mostriamo solo moduli o anche qualche entità/funzione rilevante?
4. Come distinguiamo a colpo d'occhio relazioni strutturali, operative, di dipendenza e di tracciabilità?
5. Come garantiamo che i collegamenti rimangano leggibili con decine/centinaia di nodi?
6. Qual è il livello giusto di dettaglio per ogni zoom senza nascondere informazioni indispensabili?
7. Come visualizziamo contemporaneamente lo stato progettuale e quello implementativo evitando proliferazione di badge?
8. Quando una vista è una proiezione del modello e quando l'utente sta davvero modificando quel modello?
9. Come mostrare l'AI contestuale senza farle competere visivamente con il canvas?
10. Quale palette e quale densità visiva funzionano meglio in una sessione di lavoro prolungata?
11. Che cosa succede quando un elemento selezionato non è rappresentabile nella vista successiva?
12. Come rappresentiamo in modo comprensibile una relazione proposta, ma non ancora approvata?

---

## 12. Principi sintetici da non perdere

1. **Il canvas mostra la struttura; l'ispettore mostra il dettaglio.**
2. **I nodi rappresentano oggetti del modello; i collegamenti sono oggetti del modello.**
3. **La complessità emerge tramite selezione, focus, viste e approfondimenti, non tutti insieme.**
4. **Profondità, prospettiva, contesto e attività sono assi differenti.**
5. **Passare da una vista a un'altra non deve rompere la continuità del contesto.**
6. **Le relazioni tipizzate devono avere significato e possibilità di verifica.**
7. **La UI separa deciso, proposto, implementato e verificato.**
8. **L'AI assiste su oggetti e modifiche precise; non sostituisce le normali interazioni.**
9. **Il codice è raggiungibile, ma non occupa necessariamente il primo livello.**
10. **Il primo mockup deve dimostrare la qualità delle interazioni, non fingere che il motore tecnico sia già completo.**

---

## 13. Riferimenti di partenza

- [n8n — Documentazione ufficiale](https://docs.n8n.io/)
- [Unreal Engine — Blueprint Visual Scripting](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine)
- [Cursor — Documentazione](https://cursor.com/docs)
- [Lovable — Documentazione](https://docs.lovable.dev/)
- [C4 Model](https://c4model.com/)
- [SysML v2 — OMG](https://www.omg.org/spec/SysML/2.0/)

**Nota sulle fonti:** questo file conserva le osservazioni UX e le proposte emerse nella conversazione; non sostituisce una specifica tecnica certificata dei prodotti citati. I pattern sono riferimenti e non implicano che Blueprint debba riprodurre esattamente le loro implementazioni.

---

## 14. Prossimo passo

**Non sviluppare l'intero IDE.** Produrre tre mockup coerenti dello **stesso workspace**: A nessuna selezione, B entità selezionata, C relazione selezionata. Confrontarli sui criteri M-01…M-12. Congelare la struttura di navigazione soltanto dopo aver verificato chiarezza, densità e accessibilità delle interazioni.

**Fine snapshot v0.1.** Le decisioni nuove andranno riportate in un successivo changelog, senza riscrivere retroattivamente le preferenze già espresse.