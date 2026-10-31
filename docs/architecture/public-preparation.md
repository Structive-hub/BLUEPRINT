# Preparazione della nuova versione pubblica di Blueprint

Data: 31 ottobre 2026. Questa copia è stata ottenuta esclusivamente dagli 80 file versionati di `main` dell'archivio privato, snapshot storico `5b4f571850f351a1de44946aa38fa71b7ef08182`. L'identificatore serve a documentare la provenienza; non è un oggetto Git della nuova copia.

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
- Nessuna licenza proprietaria o open source assegnata al codice, ai documenti o agli asset originali di Blueprint.

## Nuova cronologia e riferimenti

La nuova `.git` è vuota e indipendente, senza remote, alternates, vecchi oggetti o commit iniziale. Branch iniziale `main`; identità locale `Structive-hub <221842812+Structive-hub@users.noreply.github.com>`, con `user.useConfigOnly=true`. Nessuna configurazione globale dell'utente modificata.

Il workflow considera soltanto `main`, senza il vecchio branch eliminato. I rapporti tecnici e la decisione linguistica conservano le evidenze originarie, marcate come storiche. I collegamenti operativi alla CI dell'archivio privato sono stati rimossi. Non esiste ancora un nuovo repository GitHub e non è stata eseguita CI remota per questa copia.

## Verifiche effettivamente eseguite

| Controllo | Esito |
| --- | --- |
| Installazione `npm ci` dal lockfile | Riuscita; audit npm 0 vulnerabilità alla data della preparazione |
| Test del nucleo | 45/45 passati |
| TypeScript, Vite e generazione HTML | Passati, usando PowerShell per la shell del singolo comando |
| Controllo HTML autonomo | Passato: allineato a build, sorgenti e notice |
| Distribuzione e launcher | 15 passati, 1 saltato, 0 falliti su 16 |
| Test browser Chromium | 7/7 passati, inclusi recupero IT/EN e HTML `file://` |
| Identità Git autore e committer | Noreply verificata, nessun commit creato |

Il caso saltato è il primo avvio completo tramite `avvia.cmd` senza build: il controllo preliminare riproduce il limite di scrittura di `cmd.exe` su questo host. Il caso equivalente tramite launcher JavaScript e i test con build pronta sono passati. La futura CI Windows mantiene `BLUEPRINT_REQUIRE_CMD_WRITES=1`, che impedisce di nascondere il salto. I test locali non sostituiscono questa verifica remota ancora da eseguire.

## Decisioni e passi ancora aperti

- Decidere la licenza del codice, della documentazione e degli asset originali, senza confonderla con gli avvisi delle dipendenze.
- Confermare i diritti sugli input e sui materiali UX/UI, come indicato nell'audit precedente.
- Dopo l'approvazione del proprietario: creare il nuovo repository, il commit iniziale con identità noreply e la pubblicazione. Nessuna di queste azioni è stata eseguita.
- Configurare protezioni del branch e criteri Actions nel nuovo repository; verificarne la CI su Linux e Windows.
- Mantenere evidenti i requisiti strutturali aperti, inclusa la predisposizione all'internazionalizzazione. Nessuna traduzione inglese globale introdotta o dichiarata completata.

## Integrità finale della preparazione

Verificati 80 file trasferiti senza mancanze, 81 file candidati al futuro commit con il solo nuovo rapporto aggiunto, 16 immagini identiche e 162 collegamenti locali validi. Le correzioni riguardano 13 file dello snapshot: distribuzione generata, notice, catena di build, workflow, fixture/test e documentazione. Nessun file di `src/`, esempio, Baseline UX o Exploration è stato modificato. Nessun artefatto CI originario è presente; gli output locali dei test sono esclusi da Git.

La nuova `.git` non contiene l'oggetto dello snapshot storico, commit o remote. I controlli Git sono stati eseguiti con accesso alla nuova cartella; le assenze di riferimenti in `git fsck` sono attese in un repository senza commit. L'archivio originario rimane pulito e al commit di partenza.

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

A questi si aggiunge soltanto il presente rapporto, non esistente nello snapshot di origine.
