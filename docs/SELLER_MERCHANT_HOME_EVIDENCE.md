# Seller-owned merchant services — local delivery

9 September 2026. Final application source: `ceec6e944961c0c10a3525772efde97d6d6afaee` (master-first layout), following `10791d5149fa907edac700120acdb25b1bc92656` (recovery) and `62ff48714ace39259e7e81a50f07365caa055a2a` (account context), on `feature/EDN-003-foundation`. This delivery changes account context, navigation and presentation. It does not add a provider service or change the immutable merchant ownership schema.

## Result and boundaries

Seller → Merchant services → Own merchant & Sub-MIDs is the primary administration home. Opening a master or child keeps the Seller selected through payment channels, people and verification. The same merchant components render inside authorized Personal/Household collection views. Compatibility/invitation URLs resolve only the unit's permitted responsible Seller, then its host; outside helpers remain in Shared selling access without financial-account navigation.

The account-scoped projection first checks accepted access and exact directory membership, then loads current per-unit authority. Forged account/unit pairs fail without a fallback merchant. Temporary service errors offer recovery without silently changing the account context. Historical consent is labeled “Consent recorded”; separate readiness requirements show whether current controller authority still supports it.

The existing three account types, server policy, merchant commands, one payment-channel form and one invitation lifecycle remain. Seller ownership is already enforced by immutable master/host ancestry; no database migration is required. Private channels stay creator-private, Household delegation remains explicit, and merchant access does not create financial-account membership. Provider verification, real MIDs, gateways, public payment acceptance and money movement remain unavailable.

## Verification

Environment: macOS ARM64, Node 24.19.0, pnpm 11.19.0 and native PostgreSQL 18.6. Domain/browser tests use the isolated `etail_depot_next_test` database and loopback port 3100. The separate fictional preview uses `etail_depot_next`; its saved relationships, channels and helper assignment are preserved. The same seven existing migrations remain applied.

| Check | Result | Local evidence |
|---|---|---|
| Full Vitest unit/integration/concurrency/contracts | 300 passed in 42 files, exit 0 on the `62ff487` application source; subsequent changes affect only page error handling and consent presentation | [Vitest](../artifacts/seller-merchant-home/vitest.log) |
| Production `pnpm build` | Passed, exit 0 on `10791d5` | [Build](../artifacts/seller-merchant-home/build.log) |
| `pnpm lint`, `pnpm typecheck`, `pnpm test:architecture`, `node tools/verify-security.mjs` | Passed, exit 0 on `10791d5` | [Lint](../artifacts/seller-merchant-home/lint.log), [types](../artifacts/seller-merchant-home/typecheck.log), [architecture](../artifacts/seller-merchant-home/architecture.log), [security](../artifacts/seller-merchant-home/security.log) |
| Full `node tools/run-with-database.mjs playwright test` | 95 passed, exit 0 on `10791d5`: 19 API, 32 desktop, 32 mobile, 12 accessibility | [Full browser run](../artifacts/seller-merchant-home/browser.log) |
| Final master-first layout: affected Seller desktop/mobile/accessibility cases | 17 passed, exit 0 on `ceec6e9`; production build, lint/types and architecture also passed | [Affected browser run](../artifacts/seller-merchant-home/layout-browser.log), [build](../artifacts/seller-merchant-home/layout-build.log), [lint](../artifacts/seller-merchant-home/layout-lint.log), [types](../artifacts/seller-merchant-home/layout-typecheck.log), [architecture](../artifacts/seller-merchant-home/layout-architecture.log) |
| `pnpm test:handoff` | 35 source-package helper regressions passed, exit 0 | [Handoff](../artifacts/seller-merchant-home/handoff.log) |

Seven new PostgreSQL context tests cover own master/child, wrong Seller, Personal and Household units across multiple masters, wrong host, outside helpers, revoked account access with a separately valid merchant assignment, and non-escalation of a Seller reader. Expanded browser scenarios retain channel create/edit/close/retry recovery and add nested navigation, reload, compatibility redirect, cross-Seller data denial and helper denial of forged account routes. Accessibility scans include the nested master, Seller child, Household collection and keyboard dialogs at 320 pixels.

## Preserved preview and visual review

Seven desktop/mobile screenshots were visually inspected: Seller management home, Seller-scoped Household channels and people, Household-scoped collection, mobile Seller home/channels, and the existing Seller viewer’s shared collection view. The master is shown first and spans the directory above its child collection units. [Visual result](../artifacts/seller-merchant-home/visual.json), [final visual run](../artifacts/seller-merchant-home/final-visual.log), [desktop home](../artifacts/seller-merchant-home/screenshots/desktop-seller-home.png), [mobile home](../artifacts/seller-merchant-home/screenshots/mobile-seller-home.png).

The first visual script incorrectly assumed the existing preview helper had no Seller account access. That fixture already held an accepted Seller VIEWER membership before this task, in addition to its shared Household collection grant. The script was corrected to inspect that preexisting membership and verify Household financial access remains denied. No permission was changed to satisfy the script. The separate full/affected browser suites use a fresh Seller and prove an outside helper with no Seller membership receives no financial-account shell and cannot forge Seller/Household routes. The initial failed visual log is retained separately.

The in-app browser displays [Sample shop → Merchant services](http://127.0.0.1:3100/accounts/00000000-0000-4000-8000-000000000002/get-paid). Existing preview accounts, master/children, saved channels and helper assignment are preserved; the visual script performs no merchant mutations. Final specification JSON parsing and whitespace checks passed. No dependency, hosting configuration, visitor access, external resource, push, merge or deployment changed. Offline Netlify packaging and dependency audit from the previous task remain baseline evidence, not new runs for this UI-only follow-up.
