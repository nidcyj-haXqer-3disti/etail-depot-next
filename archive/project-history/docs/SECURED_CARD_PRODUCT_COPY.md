# D93 — Visa secured credit card product wording

20 September 2026. The user corrects the public product identity to **Visa secured credit card** and requests an audit of the landing page and product experience. This applies the D84 intended-product decision to public language; it does not certify a secured-credit financial cutover.

## Scope

`src/shared/card-product.ts` provides one product name for the homepage, card product page, shared Help/landing FAQs, search/social metadata and social image. Remove the obsolete prepaid product description and marketing instructions that imply the security deposit is spent directly. Explain the distinction between a security deposit and repayment in one FAQ. Preserve the concise non-live Visa credential notice.

Use **Card account balance** in the current settings and future card-refund activity descriptions. Actual amounts, available spending, top-up commands, receipts, existing posted records and financial calculations keep their factual meaning. No database migration, historical rewrite, new provider, interest/credit-reporting promise or live issuance claim is included. Merchant acceptance continues to cover Visa, Mastercard, American Express and Discover; it is not restricted to the issued card product.

The [official Visa explanation](https://www.visa.com/en-us/personal/cards/what-is-a-secured-credit-card), checked on 20 September 2026, distinguishes deposit-backed credit from prepaid spending. It does not establish Etail's issuing agreement, deposit-to-limit ratio, approval, fees or repayment implementation. The [D84 financial design](SECURED_CARD_EXPERIENCE_DESIGN.md) remains the separate account/ledger/billing/cutover scope. Monthly pay-in-full and optional earlier/daily repayment are confirmed product intent; the collateral policy and financial implementation remain pending.

## Verification

Existing public metadata/browser checks now reject prepaid product wording and require the secured credit card name on the relevant public pages. The existing settings journey checks the neutral account balance label. Run lint, types, architecture, production build, public metadata/social-image rendering, desktop/mobile public and settings journeys, public accessibility, and the existing atomic original-card refund test. Keep preview data intact; tests use only the isolated test database.

Final production build, full lint, TypeScript, architecture and all 18 metadata/social-image unit cases pass. All 32 targeted desktop/mobile/accessibility checks pass, as does the existing original-card refund test (seven unrelated cases intentionally unselected). The first metadata/build run caught a social-image renderer restriction on multiple text children; combining the subtitle into one string fixed it. Preserve both the initial failure and final passing logs in `artifacts/d93-checks/`.

Independent source review found no remaining explicit prepaid wording in active public/UI content and no change to Merchant network acceptance or financial behavior. Manual inspection of the refreshed local homepage confirms the updated title, hero, product description and expanded acceptance FAQ at phone width. The local preview was restored only after the test server exited; startup confirms no migration or seed writes. No deployment is included in this wording correction.
