# Documentazione di Blueprint

I documenti qui raccolti descrivono **l'architettura e le decisioni del progetto corrente**. Usare i percorsi relativi alla radice del repository.

- [**Preparazione e pubblicazione**](architecture/public-preparation.md) — repository ufficiale pubblico, cronologia indipendente, CI verificata e governance di `main`.
- [**Consultazione e diritti riservati**](../DIRITTI.md) — nessuna licenza generale sui materiali originali; componenti di terzi e diritti UX/UI distinti.
- [**Architettura**](architecture/README.md) — mappa dei moduli, dipendenze e limiti implementativi.
- [**UX**](ux/README.md) — principi d'interazione e specifiche UX approvate.
- [**Decisioni**](decisions/README.md) — registro delle scelte progettuali approvate.

Le istruzioni per avvio, test, roadmap e requisiti linguistici sono nel [README principale](../README.md). Le regole per gli agenti sono in [AGENTS.md](../AGENTS.md).

I risultati dei test si ricavano dal codice attuale, con `npm test` e `npm run build`, e dalle verifiche automatiche GitHub Actions.
