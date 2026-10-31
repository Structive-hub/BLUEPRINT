# Preparazione alla consultazione pubblica di Blueprint

Aggiornamento: 31 ottobre 2026. Il [repository ufficiale Structive-hub/BLUEPRINT](https://github.com/Structive-hub/BLUEPRINT) è stato creato ed è **ancora privato**. Il commit iniziale [`4634f8cf432d6ce072a01304c827826e2c63d963`](https://github.com/Structive-hub/BLUEPRINT/commit/4634f8cf432d6ce072a01304c827826e2c63d963) contiene 81 file, inclusi i 16 asset UX/UI, con cronologia indipendente e senza genitori. Autore e committer sono entrambi `Structive-hub <221842812+Structive-hub@users.noreply.github.com>`, verificati direttamente su GitHub.

La copia è stata ottenuta esclusivamente dagli 80 file versionati di `main` dell'archivio storico privato, snapshot `5b4f571850f351a1de44946aa38fa71b7ef08182`, ai quali è stato aggiunto questo rapporto prima del commit iniziale. Lo snapshot documenta la provenienza; non è un oggetto Git della nuova cronologia. Nessuna modifica è stata apportata a BLUEPRINT-archive durante questa preparazione finale.

## Decisione sui diritti e visibilità

Il proprietario ha confermato che Blueprint sarà pubblico e consultabile su GitHub, ma **non sarà distribuito come progetto open source**. Non viene concessa una licenza generale di riutilizzo per codice, documentazione e materiali originali. L'[avviso sui diritti riservati](../../DIRITTI.md) distingue questa decisione dalle licenze dei componenti di terzi e dalle facoltà previste dalle condizioni GitHub, incluse consultazione e fork tramite il servizio, e dalla legge.

Il repository non è stato reso pubblico. La riserva di diritti non certifica la titolarità dei materiali UX/UI: prima del cambio di visibilità il proprietario deve confermare i diritti necessari sugli asset e sui relativi input.

Il proprietario ha fornito una [dichiarazione di provenienza dei materiali UX/UI](../ux/README.md#provenienza-dei-materiali-uxui): ricerca comparativa su prodotti esistenti, analisi progettuale, brainstorming e generazione assistita da intelligenza artificiale. I prodotti studiati sono riferimenti di ricerca, non componenti da riprodurre; le immagini rappresentano proposte esplorative per Blueprint e non interfacce ufficiali dei prodotti esaminati. La verifica visiva non ha individuato riproduzioni riconoscibili di marchi o interfacce di terzi e non certifica legalmente originalità o titolarità. La dichiarazione documenta il processo creativo; non viene interpretata come conferma dei diritti di pubblicazione sugli asset e sui relativi input.

## Trasferimento e conservazione

- Archivio privato lasciato invariato; nessuna vecchia directory `.git`, nessun oggetto Git o artifact CI trasferito.
- Tutti gli 80 file dello snapshot verificati rispetto ai contenuti Git, con i terminatori previsti dagli attributi. I 16 asset UX/UI sono conservati byte per byte.
- `src/`, esempi, modello, persistenza e interfaccia del prodotto restano invariati. Baseline UX v0.2, Exploration v0.1 e miniature relative sono preservate.
- Le dipendenze sono state installate dal lockfile nella copia. `node_modules/`, `dist/`, output delle demo e dei test sono generati locali esclusi da Git, non importati dall'archivio originario.

## Correzioni della distribuzione

- Avvisi di React 19.2.0, React DOM 19.2.0 e Scheduler 0.27.0 conservati dai pacchetti installati; avvisi Vite aggiornati a 7.3.7 e al relativo testo del pacchetto.
- `THIRD_PARTY_NOTICES.txt` incluso fra gli input del digest sorgenti ed emesso in `dist/` con controllo nel manifest.
- Avvisi incorporati integralmente nel file HTML autonomo come testo non eseguibile; pacchetto CI aggiornato per includere anche il file separato.
- Aggiunte regressioni che verificano conservazione delle notice e rifiuto di build obsolete o avvisi compilati alterati.
- Nessuna licenza generale, proprietaria o open source, assegnata ai materiali originali. Gli avvisi di terzi restano integri e separati dall'avviso sui diritti riservati; non sono estesi al codice o agli asset originali di Blueprint.

## Nuova cronologia e riferimenti

Il nuovo repository è stato inizializzato senza trasferire la vecchia `.git`, oggetti o riferimenti storici. Il commit iniziale `4634f8c` è stato pubblicato con push normale su `origin/main`; `origin` punta a `https://github.com/Structive-hub/BLUEPRINT.git`. La verifica iniziale su GitHub ha confermato un solo commit senza genitori e il solo branch `main`. Le successive correzioni documentali proseguono questa cronologia indipendente. Nessun alternates o vecchio oggetto Git è stato trasferito.

Il workflow considera `main` per push e pull request. I rapporti tecnici e la decisione linguistica conservano le evidenze originarie, marcate come storiche. I collegamenti operativi alla CI dell'archivio privato sono stati rimossi. La [CI del nuovo repository, esecuzione 41196069891](https://github.com/Structive-hub/BLUEPRINT/actions/runs/41196069891), verifica il commit iniziale ed è conclusa con successo su Linux e Windows.

## Verifiche della baseline ufficiale

| Controllo | Esito |
| --- | --- |
| Installazione `npm ci` dal lockfile e audit | Riusciti su Linux e Windows; audit 0 vulnerabilità il 31 ottobre 2026 |
| Test del nucleo | 45/45 passati su ciascuna piattaforma |
| TypeScript, Vite e generazione HTML | Passati su entrambe le piattaforme |
| HTML autonomo e confronto con il file versionato | Passati su entrambe; sorgenti, build e notice allineati |
| Distribuzione e launcher su Windows | 16/16 passati, nessun salto, incluso primo avvio tramite `avvia.cmd` |
| Distribuzione e launcher su Linux | 15 passati, 1 salto previsto per il test esclusivamente Windows sull'assenza di Node, nessun fallimento |
| Test browser Chromium | 7/7 passati su ciascuna piattaforma, inclusi recupero IT/EN e HTML `file://` |
| Identità Git autore e committer | Noreply verificata nei metadati locali e su GitHub |
| Contenuti remoti | Tutti gli 81 blob del commit iniziale corrispondono ai file preparati, incluse le 16 immagini |

Nella preparazione locale era stato saltato il primo avvio completo tramite `avvia.cmd` per un limite dell'host. La prova è ora superata nella CI Windows con `BLUEPRINT_REQUIRE_CMD_WRITES=1`: il limite locale non costituisce più una verifica remota aperta. Il solo salto Linux riguarda un caso non applicabile a quella piattaforma.

## Audit di log e artifact della nuova CI

Inventario remoto verificato il 31 ottobre 2026: una sola esecuzione CI e quattro artifact. I log di entrambi i job sono stati letti; tutti e quattro gli ZIP sono stati scaricati e verificati rispetto al digest SHA-256 fornito da GitHub. Sono stati ispezionati anche i due ZIP incorporati nei report HTML: 22 file complessivi oltre ai due contenitori annidati, inclusi JSON, diagnostica, esportazioni del workspace e quattro screenshot esaminati visivamente. Nessun artifact è rimasto inaccessibile.

| Artifact | ID GitHub | Esito e trattamento |
| --- | --- | --- |
| `verifiche-ubuntu-latest` | `13040717483` | Conservabile: report e dati dimostrativi dei test; identità Git noreply, nessun dato personale del proprietario rilevato |
| `verifiche-windows-latest` | `13041101496` | Conservabile: stesso perimetro; screenshot, diagnostica e JSON verificati |
| `distribuzione-ubuntu-latest` | `13041106929` | Conservabile: HTML, manifest e notice; avvisi di terzi completi nel file separato e nell'HTML |
| `distribuzione-windows-latest` | `13040921711` | Conservabile: stessi controlli sugli avvisi, integralmente corrispondenti al repository |

Non sono state rilevate credenziali non mascherate, email personali del proprietario, percorsi del suo computer o dati sanitari reali. Nei log e nei report restano i normali percorsi effimeri dei runner GitHub, l'identità pubblica dell'account e i dati sintetici previsti dai test. Gli indirizzi negli avvisi delle dipendenze sono attribuzioni pubbliche di terzi, non recapiti del proprietario. Gli artifact sono istantanee della baseline; non attestano l'applicazione di aggiornamenti documentali successivi e non concedono una licenza sui materiali originali.

Tutti e quattro gli artifact sono conservabili sotto il profilo dei contenuti esaminati; non è stata effettuata alcuna rimozione o modifica. Questo esito non sostituisce la conferma dei diritti UX/UI. I controlli sui metadati del repository e sui documenti non hanno rilevato recapiti personali o percorsi locali identificativi. Le ricerche automatiche sono state integrate dalla lettura dei report e dal confronto con le fixture dei test; non costituiscono una garanzia assoluta contro ogni possibile informazione sensibile.

## Condizioni prima della pubblicazione pubblica

- **Condizione necessaria:** conferma del proprietario sui diritti di pubblicazione dei 16 asset UX/UI e dei relativi input, inclusi eventuali elementi di terzi. Hash e metadati di provenienza non certificano tali diritti.
- **Operazione ancora da autorizzare:** sincronizzare su GitHub l'aggiornamento documentale sui diritti e sullo stato reale prima di cambiare la visibilità; il commit iniziale è già sul remoto. Questa attività prepara e versiona localmente le sole correzioni documentali, senza push o cambio di visibilità.
- **Decisione già assunta:** consultazione pubblica senza licenza generale di riutilizzo dei materiali originali, come indicato in `DIRITTI.md`. Nessuna ulteriore licenza è introdotta.
- **Miglioramenti successivi:** riesaminare protezioni di `main`, permessi minimi dei workflow, fissaggio delle azioni a commit e durata di conservazione degli artifact. Nessuna impostazione è modificata o dichiarata attiva da questo rapporto.
- Mantenere evidenti i requisiti strutturali aperti, inclusa la predisposizione all'internazionalizzazione. Nessuna traduzione inglese globale introdotta o dichiarata completata.

## Integrità della preparazione iniziale e aggiornamento documentale

Nella preparazione iniziale: 80 file trasferiti senza mancanze, 81 file poi inclusi nel commit iniziale con questo rapporto aggiunto, 16 immagini identiche e 162 collegamenti locali validi. Le correzioni iniziali riguardavano 13 file dello snapshot: distribuzione generata, notice, catena di build, workflow, fixture/test e documentazione. Nessun file di `src/`, esempio, Baseline UX o Exploration è stato modificato. Nessun artifact CI originario è stato trasferito; gli output locali dei test sono esclusi da Git.

La preparazione finale aggiorna soltanto README, indici e stato dell'archivio UX, questo rapporto e il nuovo avviso `DIRITTI.md`. Codice, immagini, Baseline v0.2, Exploration v0.1, workflow, avvisi delle dipendenze e HTML generato restano invariati rispetto a `4634f8c`. L'archivio storico non viene modificato.

Verifiche dell'aggiornamento documentale del 31 ottobre: 178 collegamenti locali validi, 44 miniature cliccabili preservate, nessuna segnalazione nella ricerca di credenziali, email personali o percorsi identificativi nei Markdown. Passati nuovamente `npm test` (45/45), `npm run build` e `npm run check:standalone`, usando PowerShell come shell del singolo comando di build; l'HTML rigenerato è identico al file versionato. Il successivo inserimento della dichiarazione di provenienza ha interessato soltanto quattro Markdown: ricontrollati collegamenti, ancore, miniature e perimetro delle modifiche, senza rieseguire test applicativi per questa sola integrazione testuale. Passato anche `git diff --check`. Nessuna nuova suite di test o dipendenza introdotta. La CI remota citata sopra appartiene al commit iniziale; i successivi commit documentali locali non sono stati pubblicati né sottoposti a una nuova CI remota.

## Inventario dei file trasferiti

Elenco completo degli 80 file dello snapshot, prima delle correzioni nella copia:

- `.gitattributes`
- `.github/workflows/ci.yml`
- `.gitignore`
- `AGENTS.md`
- `Blueprint-apri.html`
- `README.md`
- `THIRD_PARTY_NOTICES.txt`
- `avvia.cmd`
- `docs/README.md`
- `docs/architecture/README.md`
- `docs/architecture/phase-1-consolidation.md`
- `docs/decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md`
- `docs/decisions/README.md`
- `docs/ux/IMPORTAZIONE_VISUALI.md`
- `docs/ux/README.md`
- `docs/ux/UX_Baseline_v0.2.md`
- `docs/ux/UX_Exploration_v0.1.md`
- `docs/ux/comparisons/01_workspace_affiancamento.jpg`
- `docs/ux/comparisons/02_entita_affiancamento.jpg`
- `docs/ux/comparisons/03_relazioni_affiancamento.jpg`
- `docs/ux/comparisons/04_nuove_schermate_panorama.jpg`
- `docs/ux/comparisons/README.md`
- `docs/ux/references/README.md`
- `docs/ux/references/v1/01_workspace_panoramica.png`
- `docs/ux/references/v1/02_entita_selezionata.png`
- `docs/ux/references/v1/03_relazione_impatto.png`
- `docs/ux/references/v2/01_workspace_iniziale.png`
- `docs/ux/references/v2/02_selezione_elemento.png`
- `docs/ux/references/v2/03_dettaglio_elemento.png`
- `docs/ux/references/v2/04_ispezione_relazione.png`
- `docs/ux/references/v2/05_cambio_vista.png`
- `docs/ux/references/v2/06_ai_contestuale.png`
- `docs/ux/references/v2/07_implementazione.png`
- `docs/ux/references/v2/08_revisione_modifiche.png`
- `docs/ux/references/v2/09_navigazione_contesto.png`
- `examples/centro-medico-grafo.json`
- `examples/centro-medico.json`
- `examples/modello-vuoto.json`
- `examples/requisiti.schema.json`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.mjs`
- `scripts/build-info.mjs`
- `scripts/build.mjs`
- `scripts/demo-v0.ts`
- `scripts/demo.ts`
- `scripts/launch.mjs`
- `scripts/make-standalone.mjs`
- `scripts/serve-built.mjs`
- `scripts/smoke-built.mjs`
- `src/app/bootstrap.ts`
- `src/app/main.tsx`
- `src/app/startup-recovery.js`
- `src/app/startup.ts`
- `src/core/dependencies.ts`
- `src/core/graph.ts`
- `src/core/impact.ts`
- `src/core/interpreter.ts`
- `src/core/model.ts`
- `src/core/persistence.ts`
- `src/demo/domain.ts`
- `src/demo/example.ts`
- `src/demo/interpreter.ts`
- `src/demo/legacy-impact.ts`
- `src/demo/requirements.ts`
- `src/demo/verification.ts`
- `src/features/graph/GraphEditor.tsx`
- `src/features/graph/graph.css`
- `src/features/impact/ImpactView.tsx`
- `src/styles/style.css`
- `tests/blueprint.test.ts`
- `tests/browser.spec.mjs`
- `tests/core-independent.test.ts`
- `tests/distribution.test.mjs`
- `tests/fs-fixture.mjs`
- `tests/graph.test.ts`
- `tests/launcher.test.mjs`
- `tsconfig.json`
- `vite.config.mjs`

## File corretti nella copia

- `.github/workflows/ci.yml`
- `Blueprint-apri.html`
- `README.md`
- `THIRD_PARTY_NOTICES.txt`
- `docs/README.md`
- `docs/architecture/README.md`
- `docs/architecture/phase-1-consolidation.md`
- `docs/decisions/2026-10-30-lingua-italiana-e-chiusura-fase-1.md`
- `scripts/build-info.mjs`
- `scripts/make-standalone.mjs`
- `tests/distribution.test.mjs`
- `tests/launcher.test.mjs`
- `vite.config.mjs`

A questi si aggiunse questo rapporto prima del commit iniziale, non esistente nello snapshot di origine. L'inventario precedente descrive il trasferimento storico; la preparazione finale aggiunge `DIRITTI.md` e aggiorna soltanto i documenti indicati sopra.
