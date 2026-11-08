# D84 — family/business copy and matching service styling

17 September 2026 (Tokyo). Local presentation changes on `codex/secured-card-experience`, based on D83 source commit `fde0ae8a447efe177391da68f4c281429922648c`. D83 release closeout notes already present at task start are preserved separately from these changes.

## Delivered locally

- Landing and related public pages name family, business and team use directly. The hero reads “For your family or business.” Confusing invitations to “trusted help” become clear team access to collect payments. Public metadata/social-image/footer wording follows the same language.
- Merchant navigation, light surfaces, typography, controls, spacing and responsive layout follow the existing Cardholder dashboard. Overview still owns its statement/payouts; terminals still own channels and assigned people. The change uses eight Merchant stylesheets and changes no financial or permission commands.
- Visual review identified a clipped button at the bottom of an embedded Business details panel. A scoped wrapper rule removes that clipping while retaining the outer panel's rounded border.
- Existing truthful network/test-credential disclosures remain. No program, credit line, financial availability or consumer eligibility is invented by the marketing pass.

## Financial redesign status

The user confirmed monthly pay-in-full with optional earlier/manual daily repayment. The security-deposit/credit-limit choice remains pending. [Secured-card design](SECURED_CARD_EXPERIENCE_DESIGN.md) and [primary-source research](research/d84-secured-card-reference.md) define separate collateral, debt, authorization reservations, statements, payments and customer credits, with one existing ledger/policy owner and an explicit prepaid cutover.

Independent design review added reservation against both account and card allowance, late capture reconciliation after freeze, owner repayment access when spending is restricted, and current-period refunds without rewriting statements. Historical prepaid purchases must not become opening debt. The database and runtime financial model remain unchanged and prepaid; the secured-card program is not implemented by this presentation change.

## Verification

Environment: Node24.19.0, pnpm11.19.0, Next16.3.4; existing marked local PostgreSQL preview/test databases; real money disabled. No hosted calls, release, provider changes or data reset.

| Check | Outcome |
| --- | --- |
| Public metadata/social-image tests | 18/18 pass |
| Full lint and source architecture | Exit0 |
| Initial and final production build | Exit0 |
| Targeted public/merchant desktop/mobile/accessibility | 84/84 pass:31 desktop,31 mobile,22 accessibility |
| Initial preserved dashboard capture | 120/120 states pass at1440/390/320px;23 authorized projections unchanged; no accessibility/reflow/runtime/guard failures |
| Settings clipping correction | CSS parse and final production build pass;4 final settings desktop/mobile and4 Merchant accessibility cases pass. Final120-state capture confirms the button is fully visible at all three widths. |
| Public capture helper | Original run stops before capture on obsolete D71 accessible names. Corrected labels reach3 passing states before an old blanket environment-copy rule rejects a required current network disclosure. Both failed receipts remain. The helper now uses the same exact per-path required disclosures as the existing public browser tests, preserving all other language, origin, mutation, runtime, accessibility, overflow and source-hash guards. Independent review approved the correction. Final capture passes27/27 states with42 screenshots, zero accessibility/reflow/runtime/guard errors and unchanged source. |

Logs and browser report: `artifacts/d84-checks/`. Initial dashboard receipt: `artifacts/d81-dashboard-preview-d84-merchant-style/checks.json`. Initial public attempts: `artifacts/d84-public-preview/visual/checks.json` and `artifacts/d84-public-preview-verified/visual/checks.json`. Capture helper corrections do not change application behavior or financial disclosures.

Final dashboard capture passes120/120 states with23 unchanged authorized projections and source hash `72dc2b373ca208aa99f487550a57cb62ef6a157638ae58ada9c7d04c0b0a8004`. Final public capture passes27/27 states with42 screenshots and source hash `729da9fe8b9acb09f7ed31f24d1fbfac13e84592665b5f192ef19f3b77743871` (public helper hashes application source only). Both capture scopes preserve source before/after. Manual desktop/phone inspection confirms clear hero wording, matching service surfaces and the corrected settings button. Final receipts: `artifacts/d81-dashboard-preview-d84-merchant-final/checks.json`, `artifacts/d84-public-preview-final/visual/checks.json`, and `artifacts/d84-local-verification.json`. The completed local preview is running at http://127.0.0.1:3100. No new hosted deployment is claimed; D83 remains the published release.
