# D94 — separate provider-hosted product journeys

20 September 2026. Design response to the user's new operating model. Cards and payments each use a different third-party provider for sign-in, dashboard and service delivery. The payment provider is ready; the card provider is coming soon. Etail Depot US, Inc. remains the user-confirmed operator under DBA Ledgix and DBA Trolleys. Hosting alone does not establish the providers' issuing, acquiring or legal roles.

Status: the public journey is implemented locally. The user confirms **ledgix.com** (final correction), **trolleys.ai**, card inquiries at **ledgix@etaildepot.com**, the payment capabilities listed below, and providers **i2c** for cards and **Infinicept** for payments (the latter matched from the user's spelling to the official company name). No provider login path, callback contract, customer migration or single sign-on has been invented.

Use the approved branded Trolleys root as the service entrance, labeled **Open Trolleys** or **Continue to Trolleys**. Registration and sign-in continue there; this change does not validate an actual provider account session. The user also describes future vendor hosting at `etaildepot.com/card-services` and `etaildepot.com/payment-service`. This task configures neither those routes nor that domain. The separate branded-domain option is used here; future path-based hosting needs a deliberate routing contract because the existing card product-information path would otherwise overlap the vendor application. Existing new-project bindings/canonical origin and denied external mutation targets remain unchanged.

## Product ownership

| Area | Etail Depot website | Ledgix or Trolleys provider |
| --- | --- | --- |
| Discovery | Product positioning, availability, verified benefits and service links | Product details and eligibility disclosures as applicable |
| Enrollment and sign-in | Clearly labeled outbound destination | Registration, verification, password recovery and sessions |
| Account operation | Service-specific help/contact links | Dashboard, cards or payments, permissions, invitations and records |
| Financial operations | No transaction or account-data entry | Provider's actual funding, billing, checkout, settlement and payout workflows |
| Privacy and terms | Website practices, corporate identity and accurate handoff explanation | Applicable provider/product disclosures; exact roles still to be confirmed |

No shared login, automatic account linking, shared balance, SSO, embedded provider dashboard or backend integration is implied. The local secured-card ledger proposal is no longer a prerequisite to this public website direction; do not extend it as if it were the third party's product. Existing prototype data and code are retained until a separate, explicit retirement/migration scope is agreed.

## Public structure

Keep stable paths `/`, `/payment-services`, `/card-services`, `/help`, `/privacy` and `/terms`. Use one shared header and footer. Header: Payments, Cards, Help center and **Open Trolleys**. The retained local `/login` recovery page alone keeps its own Sign in navigation; marketing pages never link to it.

### Homepage

1. Lead with available payments. Implemented headline: **Payments for your business. Cards for what’s next.** Short supporting line: **Explore payments with Trolleys. Visa secured credit cards from Ledgix are coming soon.**
2. Primary action **Explore payments** leads to `/payment-services`; secondary **Discover Ledgix** leads to `/card-services`. The Trolleys service entrance remains convenient in the header. Do not require creating an Etail Depot login first.
3. Two distinct product cards: **Trolleys · Payments · Available now** and **Ledgix · Visa secured credit cards · Coming soon**. A provider being ready does not guarantee an applicant's approval or every feature.
4. Replace the interactive local account demonstration with product artwork and, if supplied, approved current provider screenshots. Do not present invented balances, local controls or the existing prototype dashboard as the vendor's interface.
5. Retain the seven payment-sharing presentations based on the user's confirmation of payment links, QR codes, invoices, team access and major card networks. These are customer-facing ways to share a payment request, not assertions about seven particular vendor API endpoints.
6. Explain service access once: each product has its own sign-in and dashboard. End with one payment action and a restrained cards-coming-soon link. Remove “one login,” global registration and repeated account-opening CTAs.

### Payment product page

Introduce Trolleys and the user-confirmed payment methods/channels and team access. Both new and existing customers use the one **Continue to Trolleys** action to `https://trolleys.ai`. Do not guess separate registration or sign-in paths.

Customer journey: **Explore payments → Continue to Trolleys → Provider registration/sign-in → Provider dashboard.** A short adjacent line says sign-in and account management continue on Trolleys' service website. Do not insert an extra confirmation modal, pass login/email/customer data in the URL, or embed the portal in an iframe. Plain allowlisted HTTPS links are sufficient unless the vendor explicitly requires an integration.

Visa/Mastercard/Amex/Discover acceptance and broad channel/team capability are user-confirmed. Do not infer exact terminal roles, settlement actions, refund permissions, fees or payout timing from the old local implementation. Support contact: `trolleys@etaildepot.com`.

### Card product page

Present **Ledgix · Visa secured credit cards · Coming soon** prominently. Explain the intended product without offering current application, sign-in, card creation or funding. Do not advertise an unconfirmed launch date, limit, fee, APR, credit-reporting practice or exact third-party invitation flow.

Keep a polished card illustration; product controls and visuals should not masquerade as a ready provider dashboard. Offer the user-selected **Contact Ledgix** mail link. Do not create a waitlist form or imply subscription/delivery without the associated storage, consent and operations. Contact: `ledgix@etaildepot.com`.

### Help, navigation and legal pages

Help becomes a public product-support directory, independent of local session/database reads. Payment sign-in/recovery/invitations point to the relevant provider's instructions; card inquiries explain launch availability. Preserve service-specific contacts and `compliance@etaildepot.com` for remaining privacy/legal matters. The footer groups product, support and legal links without local dashboard/profile/registration links.

Privacy/Terms must distinguish this discovery website from separately hosted service processing. Do not claim Etail's Netlify Identity cookies, database, invitation roles or dispute workflow describe the providers. Provider technology names are now supplied, but exact contractual roles, data-sharing arrangements and product notices remain unconfirmed. Existing review/noindex status remains; the new business description does not approve a legally effective policy or a live financial launch.

## Implementation map and preservation

- Public shell/header/footer: remove the local-account entry points from the marketing journey without changing authenticated sandbox authorization.
- Homepage, card/payment pages, shared FAQ and metadata: update availability, product positioning, provider handoff and service-specific support together.
- `ServiceDashboardPreview` and `ProductPreview`: replace the customer-facing local dashboard simulation; retain only appropriate product artwork or approved provider material.
- `PaymentChannelPreview`: align advertised capabilities and its final CTA with the actual payment product. Do not reuse the local terminal's behavior as a vendor contract.
- Help: remove local account setup, balance, settlement and terminal-permission instructions from the public provider journey.
- Centralize reviewed public service destinations and availability, keeping authentication URLs separate from brand websites. Do not implement an arbitrary query-parameter redirect endpoint.
- Preserve email confirmation/recovery handling and exact legacy receipt/invitation paths while deciding their retirement. In particular, the homepage's `EmailCallbackBridge` processes existing Netlify links; do not remove it casually or forward its codes to a provider.
- Keep old provider/sandbox credentials, customer data and financial state out of the public website change. No database migration, reset, DNS changes or deployment is included in this implementation.

## Acceptance for the implementation

Anonymous visitors can identify the available payment product and upcoming card product immediately. Public CTAs use reviewed destinations, preserve query privacy and do not enter a local dashboard or imply a unified account. The card page contains no active application/funding CTA. Help, FAQ, metadata, header/footer and legal scope agree with the model.

Verify desktop and narrow-phone layout, keyboard focus, touch targets, no overflow, exact outbound-link bindings, availability states, no public private-API reads, retained callback recovery and no unintended changes to current sandbox authorization. Update obsolete tests rather than hiding old assertions. Actual provider login/onboarding needs its own authorized acceptance; a working outbound link does not prove those flows.

## Research limits

Initial read-only checks of the branded domains yielded no usable feature/authentication documentation. The user subsequently confirmed capabilities, providers and destinations. Reviewed [Infinicept Payops](https://www.infinicept.com/payops/) and [i2c credit issuer processing](https://www.i2cinc.com/what-we-do/issuer-processing/credit/) on 20 September 2026. These identify merchant operations and secured/charge-card processing capabilities at the technology level; they do not prove Etail-specific activation, underwriting, issuer/acquirer identity or contractual terms. Customer pages keep the Ledgix and Trolleys brands rather than exposing unnecessary infrastructure jargon.

## Implementation and verification record

The homepage leads with payments and separate product availability, replacing the local dashboard simulation with brand artwork. Both product pages, shared FAQ, Help, public navigation/footer and metadata agree with the new journey. Payment-channel marketing remains interactive and points to the hosted Trolleys entrance. All external service links suppress referrer information and carry no customer parameters. The card product page offers only contact/help, with applications explicitly not open.

Help now renders a public shell without session/database reads. Privacy/Terms distinguish website practices and retained Etail platform data/cookies from separately hosted provider services, while preserving their review status. Existing local login and emailed callbacks remain available for saved links, with an accurate separate-account introduction; they do not create or authenticate vendor accounts. No financial command, permission rule, schema or customer data was changed.

Deleted the unused simulated dashboard component/styles, obsolete product-preview exports/styles and unused credential-disclosure constant; truthful product availability and website financial limits remain in the relevant pages. Independent source review found no blocking issues. Verification logs are retained under `artifacts/d94-checks/`; initial failures are preserved rather than overwritten.

### Final acceptance — 20 September 2026

- Full lint, typecheck, architecture guard and production Next build pass. The final stylesheet correction is included in `build-visual-final.log`.
- All 18 public metadata cases pass, including generation of the social PNG (`metadata.log`).
- All 48 distinct targeted browser/accessibility cases have passing evidence: 30 desktop/mobile journey, channel, callback and account-menu cases (`journeys.log`) plus 18 public accessibility cases (`accessibility-account.log`, with its unrelated obsolete Help-menu failures corrected in the later journey run). All 28 presentation cases pass again after unused-style removal (`presentation-final.log`).
- A final manual review found a shared heading rule removed alongside dead preview styles. Restored it, rebuilt, and reran all 11 affected homepage/channel/browser/accessibility checks successfully (`homepage-visual-final.log`).
- The obsolete account-menu assertion expected Help to use private dashboard navigation. Its replacement verifies the public Help header/footer, then returns to Profile and confirms the existing account session remains usable. No authorization logic was relaxed.
- Browser tests intercept outgoing provider navigation locally. They verify the exact fixed HTTPS root, GET navigation, absence of customer query/hash/referrer data and correct contact links; they do not contact or authenticate with the provider. Existing emailed confirmation/recovery test coverage is retained.
- Manual visual review covers homepage/card/payment desktop layouts, the payment channel illustration on phone, and homepage/cards at 320px. Product availability, actions, spacing and responsive header are clear; no overflow observed. The corrected homepage section typography is verified visually.
- Independent final source audit found no incorrect `legix.com` domain, public local-account link or blocking shared-shell regression.
- The local preview starts through the existing read-only preparation path with preserved data (`preview-final.log`). No migration, reset, domain/mailbox/DNS change, provider account action, push or deployment occurred. D86 remains the published baseline.
