# D85 — simpler service dashboards

## Requested outcome

- A verified Cardholder Add money confirmation returns to Account home. Original saved receipt URLs still work; denied, mismatched and uncertain results do not redirect.
- Cards uses one Add card action, one purpose filter row and concise search. Cardholders/history remain accessible below the list. The total-limit editor separates the amount, guidance and review/cancel controls.
- Merchant uses a cleaner Money in / Money out statement, retaining status, original references, exact receipts, filtered totals and restricted terminal scope. Terminals use compact rows and one scoped creation action.
- Landing removes “adult” from marketing and replaces the illustration with a lighter account view, purpose-named cards and payments labelled by their channel. The illustration stays independent of private records and cannot create financial effects.

## Boundaries

This is local presentation/navigation work on `codex/secured-card-experience`. Existing D83 publication and D84 changes are preserved. No database migration, provider configuration, authorization/eligibility change or hosted deployment. The live financial runtime is still prepaid; monthly pay-in-full is confirmed as a future design, while the deposit-to-limit policy is pending. Removing an age word from marketing does not remove age/guardian protections.

## Verification

Commands run with Node24.19.0, pnpm11.19.0 and the isolated local test database. The preserved preview database is never reseeded by these checks.

- Initial lint, architecture and production build passed. The first affected browser run passed10 cases, then exposed a missing Add card action on Card history. Its log/report/results remain in `artifacts/d85-checks/browser*`; the run was interrupted to correct the application.
- Restored one scoped header Add card action on Cards, Cardholders and Card history. No duplicate tab row was restored. Independent source review also corrected terminal-scope wording for owner-selected terminal views and removed the remaining adult word from the Cards marketing page.
- Final lint passes. The corrected production build and all128 affected desktop/mobile/accessibility cases pass (`browser-final.log`,53 desktop +53 mobile +22 accessibility). A final production preview build includes the small mobile heading-wrap adjustment. All4 focused desktop/mobile directory rechecks also pass (`directory-final.log`); final responsive capture follows that build.
- The dashboard capture helper retains source/projection/request guards and adds the limit editor and Card history at1440/390/320 (126 base states rather than120). Independent review confirmed the added interactions only open local UI and navigate; it also corrected the expected screen count before running. The public illustration keyboard/privacy test now uses purpose-based card names and the shorter balance labels.
- Source review verifies completed receipt schemas and exact saved receipt/account/amount checks before navigation, preserved direct receipt routes, scoped limit retry state, exact Merchant accounting links/amounts and anonymous illustrations with no private reads or financial commands.

- Initial final captures pass126 dashboard states (23 unchanged authorized projections) and27 public states/42 images with no runtime, accessibility or overflow errors. Manual review found the limit editor could lose keyboard focus when its Change button was replaced. An explicit field-focus effect corrects the actual workflow; final production build and all4 limit recovery/focus checks pass. The final dashboard capture will verify that focused editor at all3 widths. Merchant screenshots at1440/390/320 show no clipping/overlap, and holder screens exclude account balances/payouts.

## Final result

Local implementation is verified. Final build (`build-focus-final.log`), lint, architecture,128 distinct affected browser/accessibility cases,4 directory reruns and4 final limit recovery/focus reruns pass. The final126-state dashboard capture (`artifacts/d81-dashboard-preview-d85-focused/checks.json`) passes with23 unchanged authorized projections, unchanged source during capture, and zero runtime/guard/accessibility/overflow failures. Public capture passes27 states/42 screenshots; two additional read-only320px captures verify the complete Cards/Payments illustration on the final build. Manual review verifies card lists/limit field and Merchant statement/terminals at desktop and phone widths. The preview remains running at http://127.0.0.1:3100 using the preserved marked database. No deployment or database migration occurred. Machine-readable local receipt: `artifacts/d85-local-verification.json`.

## Publication authorization

17 September2026: the user explicitly requested deployment of the completed local version. Publish the D84 marketing/style and D85 dashboard cleanup through the existing bound repository/site after exact-source CI and packaging checks. Preserve account data and site access. The secured charge-card research/design is documentation only; no financial cutover is included. Hosted deployment and verification results will be recorded separately.

## Release-check correction

GitHub run `35178966719` on the first PR27 candidate passed lint, types, unit, PostgreSQL integration/concurrency, contracts, architecture, production build and API checks. Desktop/mobile finished258 passing and2 failing cases: the email-member journey read the funding response body after the new successful return to Account home had already navigated away. Both failures are the same Playwright response-lifetime race in the shared test helper. Publication remains gated on a corrected exact-source run; no application or financial guard is relaxed. The original failed run and release receipt are retained.

The reviewed helper correction checks the confirmed POST200, then loads the exact saved intent via authenticated APIRequestContext after Account home navigation. Strict intent/account/receipt/amount/status checks are retained. All14 affected desktop/mobile journeys pass in `artifacts/d85-checks/browser-funding-response-recovery.log`, including the previously failing email-member journey, Merchant onboarding and funding/recovery/settlement flows. No production application code changed for this correction. Full corrected CI remains required before publication.

The second run `35180340747` passed all funding journeys and259/260 desktop/mobile cases. One desktop notification-preferences test wrote its competing version before the preceding successful save’s background refresh had completed. If that refresh read the competing version, the next edit was legitimately current, contradicting the test’s intended stale snapshot. Independent source review confirmed the ordering race. The correction explicitly reloads the version2 settings before writing version3, then verifies the next submitted expectedVersion2 receives409 and does not add a command. It preserves the disabled/reload controls and final version3 assertions. No application or conflict guard change is required; the original run is retained and full exact-source CI remains the publication gate.
