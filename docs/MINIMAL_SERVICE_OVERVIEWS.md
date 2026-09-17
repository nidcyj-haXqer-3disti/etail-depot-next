# D86 — minimal service overviews

17 September 2026. The user requests removal of the repeated Cardholder home identity block, a Merchant overview containing Credit/Debit records and one Payout area, and a more consistent landing-page layout.

## Experience contract

- Cardholder Home starts with the existing account balance and its actions. Remove the visible “Your card account”, account display-name heading and owner-name introduction. Keep account/owner facts in Account settings, and preserve the recipient’s resource-specific context.
- Merchant Overview has the financial statement and one owner-only Payout area. Every record retains its status, date, exact receipt and actual posted Credit/Debit effects. Pending, failed and internal events do not invent posted money. Put search, date and authorized terminal scope in one optional Filters disclosure. Keep necessary incoming-settlement access within the Payout area; multiple businesses remain individually identified and never summed. Shared terminal users see no owner funds. Terminals and Account settings remain in service navigation.
- Public header and footer share the same logo asset, navigation labels, content width, gutters, link and sign-in treatment. Keep exactly one global Sandbox badge and no authenticated footer. Shorter landing service cards and consistent section spacing make the two offerings easier to scan. Existing callback, registration, real service destinations and seven payment-channel interactions remain.

## Boundaries

Presentation only, on `codex/minimal-service-overviews`. No migration, financial-model change, permission change, provider connection, data reset or new dependency. D85 remains the published release until a separately requested deployment. The secured charge-card design remains pending; the executable financial model remains prepaid. Preserve D85 release records and existing preview data.

## Verification

Implemented and locally verified on Node24.19.0/pnpm11.19.0, based on local commit `59504c302ef3242619474962b3096d5e38f520a0` (D85 source). No deployment or hosted authenticated execution is claimed.

- `pnpm lint`, `pnpm test:architecture`, `pnpm typecheck`, production `pnpm build`, syntax and diff checks pass. Logs: `artifacts/d86-checks/`.
- The full existing desktop/mobile/accessibility run passes292 cases:262 desktop/mobile and30 accessibility. It includes exact Credit/Debit and receipt checks, filtered scopes, pending/refund behavior, multi-business payout separation, card funding/recovery and recipient exclusions. The first sandboxed database invocation could not connect; the authorized local run against the isolated test database passes with exit0. Neither invocation changed the preserved preview.
- After the public header breakpoint correction,30 affected public desktop/mobile/accessibility cases pass. Final production rebuild also passes after the one-space mobile FAQ text correction. The initial741px screenshot exposed a wrapped Sign in label despite passing automated geometry; explicit nowrap and the800px stacked-header breakpoint correct it.
- Guarded dashboard review passes126 owner/recipient states at1440,390 and320px, with zero runtime, accessibility or overflow failures;23 authorized projections and all source files remain unchanged during that capture. Evidence: `artifacts/d81-dashboard-preview-d86-final/checks.json`. This dashboard capture precedes only the unrelated one-space public FAQ correction.
- Final public review passes27 states and42 screenshots, including registration/recovery forms and both illustrative dashboard previews. Header/footer geometry, accessibility and FAQ whitespace pass at320,390,740,741,800,801,850,1000,1001 and1440px. Evidence: `artifacts/d86-public-complete/visual/checks.json` and `artifacts/d86-checks/chrome-complete/checks.json`.
- Independent source review found no blockers. Visual review confirms the owner home has no leftover heading gap; the recipient keeps private card context without money controls. Merchant statement and Payout remain readable on desktop/mobile. Public header/footer branding, gutters and navigation match. Local production preview is restored at `http://127.0.0.1:3100` through read-only startup; no migration or seed replay occurred.

D85 publication notes remain preserved. This task does not execute a secured-card cutover, connect a live payment provider, deploy to Netlify or alter existing customer data.

## Release authorization

The user explicitly requested “deploy after done” after reviewing this completed slice. D86 is authorized for the established reviewed-PR and publication workflow on the bound GitHub repository and Netlify site, preserving visitor access and current data. Exact-source GitHub checks, isolated Netlify packaging, merge identity and live acceptance will be recorded before publication is marked complete.
