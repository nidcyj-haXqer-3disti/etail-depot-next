# D88 — simple service workspaces

19 September 2026. User requests a Stripe-style layout for both Cardholder and Merchant dashboards: simple, clean and easy to use. D87's locally completed landing redesign remains part of the candidate; D86 is still published.

## Contract

- One shared workspace layout and visual scale: neutral surfaces, compact account header, left navigation on desktop, clear page heading and consistent actions. Phone navigation retains every authorized destination without a hidden task hierarchy.
- Cardholder keeps Account home, Cards, Activity and Account settings/Preferences. Merchant keeps Overview, Terminals and owner-only Account settings. No extra product categories or duplicated funding/creation actions.
- Cardholder account money and Merchant payout money lead their respective home views. The Merchant statement retains every authorized credit, debit, status, exact record link, scope restriction, filter and disclosure. Payout moves above the statement so it remains easy to find.
- Resource details, creation, sharing, settings and recovery keep the existing owners, routes, capabilities and request identities. Personal profile/help remain in the existing account menu, separate from service settings.
- No financial model, schema, seed, provider, customer record, permission, authentication or external message change. Keep real-money execution disabled and actual pending outcomes intact.

## Reference

Stripe's public [Web Dashboard guide](https://docs.stripe.com/dashboard/basics), read 19 September 2026, describes sidebar navigation for primary resources and separate personal, account and product settings. Adapt those principles to Etail's two existing services. Do not reproduce Stripe's full product menu, invent analytics, or claim access to private Stripe accounts or visual parity.

## Implementation and acceptance

`src/ui/service-workspace.css` owns the shared frame and presentation. Existing Cardholder and Merchant shells opt into it. The common authenticated header uses the same compact treatment; the public landing/header/footer remain separate.

Verify lint, types, architecture and a production build, existing desktop/mobile/accessibility journeys, preserved-data dashboard captures and actual screenshots for owners and recipients. Inspect account home, lists, details, creation/sharing, settings and money tasks. Record source/evidence and corrected failures here before local handoff. Deployment is separate.

Local verification is complete. The completed D87 landing and D88 dashboards are ready for review at `http://127.0.0.1:3100/`; D86 remains published.

Initial preserved-preview review completed126 states with unchanged source and data projections. Two terminal-creation screenshots failed text-contrast checks; the notice now has an explicit higher-contrast color. Visual review also separated statement descriptions from terminal/status metadata and made shared control styling independent of CSS load order. Preserve the initial receipt at `artifacts/d81-dashboard-preview-d88-initial/checks.json`; final validation follows these corrections.

The first full browser run passed 288 of 292 cases. Two cases found the newly aligned desktop profile menu covering the task-search trigger; two Merchant accessibility cases found undersized statement record links. Task search now sits beside the page heading while Add card stays at the right, and record links have explicit minimum target sizes. The full-run build identity is preserved in `artifacts/d88-checks/pre-menu-fix-source.json`. All 30 affected account-menu, card-task and service accessibility cases passed after rebuilding. These are layout corrections, not forced clicks or weakened tests.

## Final local evidence

- Pinned Node 24.19.0 and pnpm 11.19.0; isolated `etail_depot_next_services_test` for browser writes, preserved `etail_depot_next_services_preview` for visual review. No migrations, seed resets or hosted changes.
- Lint, TypeScript and architecture checks passed with exit 0. Final production build passed with exit 0. Logs: `artifacts/d88-checks/{lint-verified,typecheck-verified,architecture-reviewed,build-reviewed}.log`.
- All 292 distinct existing desktop/mobile/accessibility cases have passing evidence across the complete run and corrected affected run; not claimed as a single clean full run. Logs: `browser.log` (288 pass, four failures retained) and `affected-browser.log` (30 pass).
- Guarded final review: `artifacts/d81-dashboard-preview-d88-reviewed/checks.json` passes all 126 owner/recipient states at 1440, 390 and 320 pixels, with zero accessibility, overflow or runtime/guard failures. All 23 authorized projections and the source digest remain unchanged during capture. Anonymous real-money/provider actions and hosted private account access are not claimed.
- Additional responsive review passes 48 states across eight widths from 600 to 1180 pixels, including both sides of the 980/981 sidebar transition. All navigation targets and accessibility checks pass, and all three sampled projections remain unchanged. Receipt: `artifacts/d88-checks/breakpoints/checks.json`. This review precedes the final, under-540-pixel spacing correction and is unaffected by it.
- Final screenshot review covers both account homes, card/terminal lists and details, settings, menus, and the desktop/tablet transition. One last phone correction removes the old icon indent from activity amounts; its rebuilt result is covered by the final 126-state review above. Preserve the earlier passing `d81-dashboard-preview-d88-final` review as history.
- Local source/commit receipt: `artifacts/d88-review-source.json`. Review and deployment remain separate; no push, merge or publication occurred for D88.
