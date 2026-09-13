# D79 verification — consolidated service workflows

13 September 2026. [The design contract](CONSOLIDATED_SERVICE_WORKFLOWS.md) records public sources, product decisions, route ownership and acceptance. D79 builds on deployed D78 tree `47e3ea468b8354584cba64e81014f5d4a84d7b9d`; local branch is `codex/consolidated-service-workflows`.

## Implementation

Cardholder has four destinations. Account home owns the canonical balance and Add money; Account settings contains Return unused money. Canonical money tasks retain saved amount, review, receipt, exact retry identity and owner authority; money history is subordinate. Card filters are All cards / For your use / For others, keeping existing OWN/MANAGED semantics. Nicknames and last four digits lead card lists, without changing identity or invitation binding.

Merchant has one stable Overview / Payments / Team & terminals / Channels / Settings navigation. A selected terminal has context and focused related-task links. Overview combines payments with separately labelled authorized business balances, pending payouts and an incoming-settlement disclosure. Payment and money-history filters, current receipt status and return context remain independent. Unused terminal-navigation CSS and the duplicate balance destinations are removed.

Overview reuses the current request's authorized terminal discovery and bounds parallel account reads to four. It no longer loads the full business dashboard again for each money account. Current terminal authorization and failed/empty-discovery account reauthorization remain. An explained recovery exit retains a validated investigation or selects the exact owner business/assigned-terminal directory; it neither cancels an uncertain command nor chooses another account.

No schema, migration, data reset, provider, Identity, hosted permission or real-money change is introduced. All 22 migrations were already applied to the marked test database. Local tests add isolated fictional records; preview and hosted customer records remain separate.

## Completed checks

Runtime: Node24.19.0, pnpm11.19.0, Next16.3.4, PostgreSQL18.6. Evidence below is local, under ignored `artifacts/`.

| Check | Result | Evidence |
| --- | --- | --- |
| Full lint, type generation/TypeScript and architecture | Passed, exit0 | `d79-source-checks-final.log` |
| Unit | 489 passed, including discovery reuse/current access | `d79-source-checks-final.log` |
| PostgreSQL integration / concurrency / contracts | 256 / 42 / 12 passed, exit0 | `d79-database-contracts.log` |
| Security scanner + dependency audit / handoff | Passed; no known dependency vulnerabilities; 35 handoff cases | `d79-security-handoff.log` |
| Production Next + offline Netlify package | Passed, exit0; exact bound site ID; no upload | `d79-netlify-final.log`; final copy cleanup packaged in `d79-netlify-polished.log` |

The corrected browser run passed221/222; the only remaining failure was the post-dialog visibility assertion described below. All6 related desktop/mobile service-enrollment journeys passed after its correction, covering every one of the222 distinct browser cases across the full and corrected runs. API9, accessibility30 and isolated email/session28 all passed with exit0. Evidence: `d79-browser-verified.log`, `d79-hosted-journeys-corrected.log`, `d79-api-final.log`, `d79-a11y-corrected.log`, `d79-email-final.log`. The final test/capture-tool lint and syntax checks passed. The first preserved-preview capture passed81/81 states, with zero accessibility/reflow/runtime/guard errors, exactly two fictional sign-ins and all19 authorized projections unchanged; the source hash stayed unchanged during capture. Root visual review then removed one repeated Cardholder Home explanation and its unused CSS so funding sits higher on the page. The final copy cleanup passed14 existing desktop/mobile Cardholder cases and final production/offline Netlify packaging. The polished capture also passed81/81 states at1440,390 and320px, with zero reported accessibility/reflow/runtime/guard failures, exactly two fictional sign-ins, all19 authorized projections unchanged and source hash `81845d41bc5ddb249bd32f909552f9a1738ea3d381f8465db022c56d7dd51532` unchanged across796 files during capture. Evidence: `d79-card-polished.log`, `d79-netlify-polished.log`, `d79-dashboard-preview-polished/checks.json` and its PNGs. Root and independent review inspected the final card/merchant hierarchy and mobile screenshots; no visual blocker remained. The final preview runs on3100 without re-preparation. Source peer review found no blocking account-scope, permission or recovery regression; that review does not replace execution evidence.

## Initial failures retained

The first browser audit (`d79-browser-initial.log`) was stopped after obsolete funding/terminal selectors and a real recovery-navigation delay were identified. Tests now navigate from Home into the exact canonical money account and use terminal context headings. The delay exposed repeated full-dashboard discovery in Overview; shared discovery/bounded loading and a direct scoped recovery exit correct it. Unknown-command/cardinality/privacy assertions remain.

The first final-run launch (`d79-browser-final.log`) failed before executing tests because the interrupted run left its local Next child on3100. Its PID, working directory and start time were verified before stopping that one process. No server reuse or switch to the preserved preview was used to bypass the test guard.

In the full corrected run, one post-setup action was fractionally outside the viewport. The test now focuses that action through normal keyboard behavior and retains the strict full-visibility assertion, capture and accessibility checks; it does not lower the expected viewport ratio. The corrected hosted-style journeys passed6/6. The first accessibility run passed26/30; its four failures used the removed terminal heading/menu, before reaching those screens' axe checks. Exact selected-terminal headings and current Settings navigation replaced those assertions; the full corrected accessibility suite passed30/30. Permission, focus, overflow and axe checks were retained.

## Release boundary

The user explicitly approved deployment. PR22 merged as `d52ddd6207c0b9d4b60bb60959f0877eab315947` after GitHub run `34746241573` passed all checks, including all 222 browser and 30 accessibility cases in one run. Its checked merge tree, reviewed feature tree, final main tree and the 796-file uploaded archive all match `7caeaafe48e5db7db0cf739ba088b7c99180b5c5`. Netlify deploy `6aa679ca607b79d1f6633d8c` published at 10:25:16.854 UTC on 13 September 2026 and is confirmed current on the bound site. The provider applied no migrations and created an on-publish snapshot. Visitor access is unchanged. All 96 hosted read-only checks and 38 responsive public captures passed, with zero issues. Actual password/mailbox and authenticated hosted-dashboard verification are not claimed; private workflows retain the completed local end-to-end evidence. The durable release receipt is `artifacts/d79-publication.json`.

Local fictional email/provider harnesses do not establish successful real mailbox/password or live network operation. No measured private Amex/Stripe parity or full-provider completion is claimed.
