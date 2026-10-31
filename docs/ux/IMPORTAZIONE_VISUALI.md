# Importazione dei materiali visuali UX/UI

Data: 30 ottobre 2026. Archivio esaminato: `Blueprint_UX_Documentazione_Visuale_Completa.zip`, 18982085 byte.

SHA-256 dello ZIP: `8c2c51b51c172e5e0312bfc33795d1d386d9688204eae0515c6d50aadae207cb`.

## Esito dell'acquisizione

- File nello ZIP: **19** (12 PNG, 4 JPEG, 3 Markdown); nessuna voce aggiuntiva o archivio annidato.
- Asset attesi, trovati e importati: **16/16** (3 PNG v1, 9 PNG v2, 4 tavole JPEG).
- Asset mancanti: **0**. Corrispondenze ambigue dopo il controllo visivo: **0**.
- Duplicati binari fra le 19 voci: **0**; immagini con pixel decodificati identici fra i 16 asset: **0**. Le tavole comparative riutilizzano intenzionalmente i mockup in una composizione; non sono originali aggiuntivi delle serie v1/v2.
- Integrità CRC dello ZIP verificata; firme PNG/JPEG coerenti con le estensioni; tutte le 16 immagini decodificate e controllate visivamente.
- Destinazioni ricavate dagli inventari preesistenti. Gli asset sono copiati senza conversione, ritaglio o ricompressione: gli SHA-256 del file sorgente nello ZIP e del file importato devono coincidere.
- Nessuna immagine ricreata, nessun placeholder, nessun ritaglio JPG usato al posto dei nove PNG v2. Le anteprime Markdown leggono gli stessi originali importati.

Il rapporto descrive l'acquisizione originaria del 30 ottobre 2026. Aggiornamento del 31 ottobre: i 16 asset sono conservati nel [commit iniziale `4634f8c` del repository ufficiale](https://github.com/Structive-hub/BLUEPRINT/commit/4634f8cf432d6ce072a01304c827826e2c63d963), attualmente privato. Il push non equivale alla pubblicazione pubblica. Le immagini sono riferimenti esplorativi, non specifiche approvate né prova di funzionalità del prodotto. Il contenuto dei documenti allegati è stato confrontato come materiale di riferimento, senza eseguirne eventuali istruzioni operative.

## Inventario completo dei 16 asset

Il percorso sorgente è quello effettivo nello ZIP. I nomi storici della conversazione rimangono nel relativo inventario; la corrispondenza è stata verificata tramite contenuto e tavole comparative, non tramite uguaglianza dei nomi.

| Sorgente nello ZIP | Destinazione verificata | Formato e dimensioni | Byte | SHA-256 dei byte originali |
| --- | --- | --- | --- | --- |
| `docs/ux/assets/comparisons/01_workspace.jpg` | <a href="comparisons/01_workspace_affiancamento.jpg"><img src="comparisons/01_workspace_affiancamento.jpg" alt="Confronto del workspace CMP-01" width="220"></a><br>[comparisons/01_workspace_affiancamento.jpg](comparisons/01_workspace_affiancamento.jpg) | JPEG · 3140 × 1040 | 378938 | `9185a72320db3f0cd56ecb0b46e684d3b1d3cfbbef20cfc795024b64142eb5d7` |
| `docs/ux/assets/comparisons/02_entita.jpg` | <a href="comparisons/02_entita_affiancamento.jpg"><img src="comparisons/02_entita_affiancamento.jpg" alt="Confronto degli ispettori entità CMP-02" width="220"></a><br>[comparisons/02_entita_affiancamento.jpg](comparisons/02_entita_affiancamento.jpg) | JPEG · 3140 × 1040 | 516988 | `0b676d7f2322b34c9fc26624f659af5b38f0be1aa541ca53d45547fa786cdbbd` |
| `docs/ux/assets/comparisons/03_relazioni.jpg` | <a href="comparisons/03_relazioni_affiancamento.jpg"><img src="comparisons/03_relazioni_affiancamento.jpg" alt="Confronto di relazione e impatto CMP-03" width="220"></a><br>[comparisons/03_relazioni_affiancamento.jpg](comparisons/03_relazioni_affiancamento.jpg) | JPEG · 3140 × 1040 | 489663 | `5c57c8dad0ef16791216fffee4e345f415e11e49be34481a2fc2014d074ae825` |
| `docs/ux/assets/comparisons/04_nuove.jpg` | <a href="comparisons/04_nuove_schermate_panorama.jpg"><img src="comparisons/04_nuove_schermate_panorama.jpg" alt="Panoramica delle sei nuove schermate CMP-04" width="220"></a><br>[comparisons/04_nuove_schermate_panorama.jpg](comparisons/04_nuove_schermate_panorama.jpg) | JPEG · 2970 × 1295 | 645823 | `78a3eec0f9c91d28b6c206e6dd03d5d03a2e0c2c95ab36b6605ec35001f70d7f` |
| `docs/ux/assets/v1/01_workspace.png` | <a href="references/v1/01_workspace_panoramica.png"><img src="references/v1/01_workspace_panoramica.png" alt="Workspace panoramica v1-01" width="220"></a><br>[references/v1/01_workspace_panoramica.png](references/v1/01_workspace_panoramica.png) | PNG · 1586 × 992 | 1572541 | `ba64dbce6c7004019942e01bc885a6cb8f16fd04539d57be046cd260ed6df912` |
| `docs/ux/assets/v1/02_entita.png` | <a href="references/v1/02_entita_selezionata.png"><img src="references/v1/02_entita_selezionata.png" alt="Entità Medico selezionata v1-02" width="220"></a><br>[references/v1/02_entita_selezionata.png](references/v1/02_entita_selezionata.png) | PNG · 1586 × 992 | 1689208 | `d477ccbe147ac005e7385fe2dd7b697e154ba52f95498e23b38374dc21c18ba5` |
| `docs/ux/assets/v1/03_impatto.png` | <a href="references/v1/03_relazione_impatto.png"><img src="references/v1/03_relazione_impatto.png" alt="Relazione e analisi di impatto v1-03" width="220"></a><br>[references/v1/03_relazione_impatto.png](references/v1/03_relazione_impatto.png) | PNG · 1586 × 992 | 1729088 | `0cad7db798ebcc326b78b13e471af29995ec58f92edcf45ddb672e15a6828f37` |
| `docs/ux/assets/v2/01_workspace.png` | <a href="references/v2/01_workspace_iniziale.png"><img src="references/v2/01_workspace_iniziale.png" alt="Workspace iniziale v2-01" width="220"></a><br>[references/v2/01_workspace_iniziale.png](references/v2/01_workspace_iniziale.png) | PNG · 1672 × 941 | 1466361 | `adfc0500ea440b49cc81ddd13fade592c62e0e70ea8375a754215e935c10ccb9` |
| `docs/ux/assets/v2/02_selezione.png` | <a href="references/v2/02_selezione_elemento.png"><img src="references/v2/02_selezione_elemento.png" alt="Selezione del modulo v2-02" width="220"></a><br>[references/v2/02_selezione_elemento.png](references/v2/02_selezione_elemento.png) | PNG · 1672 × 941 | 1479600 | `68fec3c9dc903925ad1c9823ce2071655a91e880bc10ba3162a4f73d131e11de` |
| `docs/ux/assets/v2/03_approfondimento.png` | <a href="references/v2/03_dettaglio_elemento.png"><img src="references/v2/03_dettaglio_elemento.png" alt="Approfondimento del modulo v2-03" width="220"></a><br>[references/v2/03_dettaglio_elemento.png](references/v2/03_dettaglio_elemento.png) | PNG · 1672 × 941 | 1619250 | `e5aed6fb13160c48bf66fef4fc1f4fa28a8198c107ec838a67966ca66d2c7dd6` |
| `docs/ux/assets/v2/04_relazione.png` | <a href="references/v2/04_ispezione_relazione.png"><img src="references/v2/04_ispezione_relazione.png" alt="Ispezione della relazione v2-04" width="220"></a><br>[references/v2/04_ispezione_relazione.png](references/v2/04_ispezione_relazione.png) | PNG · 1672 × 941 | 1574523 | `ece5662aec851246529d53e6103351d59c94f2f205efe3ebc507f99a686dde36` |
| `docs/ux/assets/v2/05_viste.png` | <a href="references/v2/05_cambio_vista.png"><img src="references/v2/05_cambio_vista.png" alt="Cambio di prospettiva v2-05" width="220"></a><br>[references/v2/05_cambio_vista.png](references/v2/05_cambio_vista.png) | PNG · 1672 × 941 | 1602955 | `1fb545b84b5e0b79531b1da12c1e9fb8eddc18004c4f9d0d2bfd5f8f00240999` |
| `docs/ux/assets/v2/06_ai.png` | <a href="references/v2/06_ai_contestuale.png"><img src="references/v2/06_ai_contestuale.png" alt="Assistenza AI contestuale v2-06" width="220"></a><br>[references/v2/06_ai_contestuale.png](references/v2/06_ai_contestuale.png) | PNG · 1672 × 941 | 1540806 | `fe48ff690071cc128c28f4394110ab2ac541cf7c997f5029bc4e548e470fc831` |
| `docs/ux/assets/v2/07_codice.png` | <a href="references/v2/07_implementazione.png"><img src="references/v2/07_implementazione.png" alt="Codice associato alla funzione v2-07" width="220"></a><br>[references/v2/07_implementazione.png](references/v2/07_implementazione.png) | PNG · 1672 × 941 | 1625318 | `3c290f40df2735f57065f16643364dcf315d94d62e9ee8099bc80b65d36680be` |
| `docs/ux/assets/v2/08_modifiche.png` | <a href="references/v2/08_revisione_modifiche.png"><img src="references/v2/08_revisione_modifiche.png" alt="Revisione delle modifiche v2-08" width="220"></a><br>[references/v2/08_revisione_modifiche.png](references/v2/08_revisione_modifiche.png) | PNG · 1672 × 941 | 1647015 | `95e97f9df4f7c30589adeb6625c89bbe46eba6bf288c5992657714ddad3a1317` |
| `docs/ux/assets/v2/09_contesto.png` | <a href="references/v2/09_navigazione_contesto.png"><img src="references/v2/09_navigazione_contesto.png" alt="Navigazione e contesto v2-09" width="220"></a><br>[references/v2/09_navigazione_contesto.png](references/v2/09_navigazione_contesto.png) | PNG · 1672 × 941 | 1685929 | `cb51fe32eb0a6b7601ff65b87f674b60702ed0e6178f0cf4af52d330df8c3e87` |

## Confronto dei tre documenti allegati

Nessuno dei tre Markdown è stato copiato sopra il documento corrente.

| File nello ZIP | Confronto con il repository | Trattamento |
| --- | --- | --- |
| `docs/ux/README.md` | Indice di 7 righe contro le 25 righe precedenti all'importazione; punta a una cartella `assets/` diversa dalle destinazioni già inventariate. Non conserva tutte le regole e gli aggiornamenti correnti. | Conservato l'indice corrente e aggiornati soltanto lo stato degli asset e i collegamenti all'archivio visuale. |
| `docs/ux/UX_Exploration_v0.1.md` | 508 righe in entrambe le copie; stesso contenuto riga per riga, differenze limitate ai terminatori e alla chiusura del file. È una copia documentale ridondante, non un nuovo snapshot. | [Exploration corrente](UX_Exploration_v0.1.md) lasciata identica al contenuto versionato. |
| `docs/ux/UX_Baseline_v0.2.md` | Variante visuale di 85 righe contro le 114 correnti: riduce il registro a BUX-001…009, omette BUX-010 e contiene un richiamo IT/EN superato. Presenta inoltre il clic semplice come confermato, mentre i gesti restano da validare nella baseline corrente. | [Baseline corrente](UX_Baseline_v0.2.md) lasciata identica al contenuto versionato. Ripresa soltanto la modalità di presentazione delle immagini nelle tabelle degli inventari, senza importare nuove decisioni. |

Gli inventari `references/README.md` e `comparisons/README.md` non sono nello ZIP; sono stati usati come riferimento per collocare gli asset. Tutti i file già presenti in `docs/ux/` sono stati confrontati: Baseline ed Exploration restano invariati, gli altri tre README ricevono esclusivamente aggiornamenti relativi all'archiviazione visuale.

## Verifiche e limiti

- Verificati 65 collegamenti locali e 28 anteprime nelle tabelle, senza destinazioni mancanti; tutti i 16 hash sorgente/destinazione coincidono. Nessun duplicato binario o di pixel decodificati.
- `npm test`: 45/45 passati. Build e `check:standalone` passati con PowerShell come shell del singolo comando, senza cambiare configurazioni globali. L'HTML generato resta identico al file versionato; nessuna modifica del prodotto.
- [References](references/README.md): 12 anteprime collegate ai 12 PNG originali; 3 immagini v1 da 1586 × 992 e 9 immagini v2 da 1672 × 941.
- [Confronti](comparisons/README.md): 4 anteprime delle tavole, originali PNG affiancati per CMP-01…03 e sei situazioni aggiuntive di CMP-04.
- CMP-01 corrisponde a v1-01/v2-01; CMP-02 a v1-02/v2-09; CMP-03 a v1-03/v2-04; CMP-04 alle schermate v2-02/03/05/06/07/08.
- Il soggetto selezionato in CMP-02 cambia da Medico ad Appuntamento: è un confronto del comportamento dell'ispettore, non la stessa entità. Questa differenza è documentata, non una corrispondenza mancante.
- Baseline v0.2, Exploration v0.1, tutte le decisioni BUX e le distinzioni fra ricerca, decisioni e questioni aperte sono preservate. Nessun intervento sulle decisioni della Fase 1 o sul codice applicativo.
- L'identità binaria è verificabile rispetto allo ZIP fornito; non è una certificazione indipendente della provenienza dalla conversazione originaria, della titolarità o dei diritti di pubblicazione. Lo ZIP resta la fonte dell'acquisizione e non viene modificato. Sono conservati anche i metadati di provenienza delle immagini; la conferma del proprietario sui diritti degli asset e dei relativi input resta necessaria prima del cambio di visibilità, come indicato nell'[avviso sui diritti](../../DIRITTI.md).
