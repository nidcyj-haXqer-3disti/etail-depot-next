# D81 — cohesive service experience

14 September 2026 (Tokyo). Active implementation contract for the user's requested channel marketing, modern dashboards, complete settings, clean URLs and personal profile. Based on the deployed D80 tree `54445b2686b295d1010e98d26db6008e84f492f3`. This is implementation scope, not a completed or deployed claim.

## Product and presentation

- Retain exactly Cards & spending and Accept payments. Card money and merchant money remain separate. Owners manage total card allowances and flat terminals; recipients only see assigned resources. No new financial authority follows from a profile change or a URL.
- Card navigation: Account home, Cards, Activity, Account settings (Preferences for recipients). One Add money action on Home. Card details contain identity, balance, freeze/limit controls, assignment/sharing and activity. Account settings exposes the actual account identity, saved personal notification choices and the owner-only return-money entry.
- Merchant navigation: Overview, Terminals, Account settings. Overview remains a single credit/debit account statement. Each terminal contains its payment channels, access and operational controls. Business-wide acceptance belongs in exact-business settings.
- Channel journey: details, preview, share. The seven marketing presentations and working previews share one component. Text, email and social open the user's chosen application; QR is downloadable; website provides a link/button; invoice/bill presentations are printable payment requests, not an invented invoice/tax/document lifecycle. An actual checkout URL appears only after the existing publication command succeeds. No automatic message sending or unsupported live-network claims.
- Modern responsive typography, navigation and surfaces; remove conflicting superseded CSS. Preserve keyboard focus, modal isolation, 44px controls, 320px reflow and explicit recovery.

## Settings and personal identity

- Inventory real persisted settings; never render nonfunctional bank, wallet, PIN, account closure or authentication switches.
- Fix notification save/reload schema validation and exact account/person binding. An unknown result retains immutable original input and command ID; conflicts require an explicit fresh read.
- Personal profile edits the existing `people.displayName` through one authenticated, versioned personal command. This is neither the business legal name nor the card-account name. The verified sign-in email is read-only provider data. Profile editing grants no participation, service, resource or operator access. Personal sign-in/session controls remain at `/security`.
- Additive profile version and typed command receipts support concurrent edits and safe retries. Existing applied migrations and all current data remain intact.

## URLs

Use pathname segments for destinations and validated query for filters/receipt context. Keep service roots, `/profile`, `/security`, invitation and public checkout URLs. Add canonical card list/new/detail/request, terminal list/new/detail/channel and money-task paths. Existing bookmarks redirect once into shared loaders. Duplicate/conflicting resource selectors must fail closed; never choose a first available resource. API ownership and exact saved financial receipts remain unchanged. Login normalization preserves valid invitation continuation, registration mode and confirmation/recovery fragment handling.

## Public reference evidence

Reviewed 13 September 2026 UTC. These are public workflow observations, not private architecture or exact parity claims.

| Reference | Observation applied |
|---|---|
| [Amex app](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) | Prominent card context, balance/activity, direct controls and clear switching. |
| [Amex employee-card tools](https://www.americanexpress.com/en-us/business/blueprint/help-center/business-card/employee-cards/) | Group viewing, limits and freeze controls by card. |
| [Stripe Payment Links](https://stripe.com/payments/payment-links) | Explain create, share and get paid with channel-specific product demonstrations. |
| [Stripe sharing guidance](https://docs.stripe.com/payment-links/share) | One underlying payment link can be shared by message, QR and website. |
| [Stripe hosted invoice](https://docs.stripe.com/invoicing/hosted-invoice-page) | Invoice lifecycle is separate; do not call a simple payment request a complete invoice engine. |
| [Stripe Dashboard basics](https://docs.stripe.com/dashboard/basics) | Distinct personal, account and product settings. |
| [Amex contact information](https://www.americanexpress.com/us/merchant/support-center/account-services/online-account-contact-information-and-alerts.html?searchresult=D) | Personal login contact and business servicing information have separate purposes. |

## Acceptance

Verify routes, scope, profile concurrency/idempotency, settings recovery and published-link binding with meaningful tests. Run existing integration/concurrency/API/browser/accessibility, architecture/security and production builds after integration. Review desktop and mobile captures, preserve the preview database, record failed runs and corrections. The D81 request authorizes implementation; deployment follows the user's release instruction and exact reviewed source.
