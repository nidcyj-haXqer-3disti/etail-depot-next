# Merchant hierarchy and payment-channel reference

Research date: **2026-09-09**. Public primary documentation only; no provider account, gateway, merchant identifier, message or payment was created. This is a design reference, not evidence of Etail provider eligibility or implementation. It makes no claim about Amex's private architecture.

The accepted **Etail product hierarchy** has a responsible Seller MASTER and delegated Personal/Household SUB units. The user confirmed on 9 September 2026 that the master Seller bears sales, fees, refunds and chargebacks, and that one Personal/Household host may have separate SUB units under multiple Sellers. Each SUB has one immutable master; one master/host pair has one unit. These product choices are settled. Provider terminology does not establish that a particular program supports them or that Etail is approved to process payments.

## What the provider evidence establishes

All pages below were opened on the research date. Documentation publication dates were not consistently displayed. Findings are limited to the named provider/product; country, contract and payment-method eligibility still require confirmation. Source summaries are intentionally short; design proposals follow separately.

| ID | Direct primary source and locator | Verified finding and boundary |
|---|---|---|
| H01 | [Adyen: account structure](https://docs.adyen.com/account/account-structure/), Company account / Merchant accounts / Account groups | Company accounts contain processing merchant accounts; groups organize access, while stores identify locations. These are different resources. A management hierarchy alone is not proof of a network master/submerchant relationship. |
| H02 | [Adyen: defining account structure](https://docs.adyen.com/account/define-account-structure), Legal entities / Acquiring / Getting paid | Standard merchant accounts associate with one legal entity and one acquiring region; an entity can have several merchant accounts. Settlement-bank ownership and merchant-account structure must align. This standard acquiring model must not be substituted for the distinct Platforms balance model. |
| H03 | [Adyen for Platforms: account resources](https://docs.adyen.com/platforms/account-structure-resources), Your balance platform / Balance platform resources | Processing accounts/stores are distinct from legal entities, account holders and balance accounts. The platform's liable balance can cover user shortfalls from refunds/chargebacks. A hierarchy therefore needs both processing and financial-responsibility mappings. Current Platforms guide, not the separate classic integration. |
| H04 | [Adyen: platform account structure](https://docs.adyen.com/platforms/account-structure-resources/platform-structure), Resources belonging to each user / Flow of funds | The illustrated multi-country arrangement gives users legal entities, business lines, account holders, balances and verified payout instruments, with stores under processing merchant accounts. Routing through a store and settling to a balance account are separate steps. EU/US example, not universal country coverage. |
| H05 | [Braintree: important gateway credentials](https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials), Merchant ID / Merchant account ID | `merchantId` identifies the whole gateway; `merchantAccountId` chooses a processing account within it. One gateway can contain several businesses/currencies. Omitting the processing-account ID can select the default. Sandbox and production gateway identifiers differ. This terminology is Braintree-specific. |
| H06 | [Braintree Marketplace: onboarding submerchants](https://developer.paypal.com/braintree/docs/guides/braintree-marketplace/onboarding/node/), Master merchant account ID parameter / Result handling | This product explicitly nests an onboarded submerchant under `masterMerchantAccountId`; the master receives its service fees. Creating the record can return a pending state before onboarding confirmation. The page directs new marketplace merchants to sales; it does not establish that this program is available to Etail or in the desired jurisdiction. |
| H07 | [Stripe Connect: merchant of record](https://docs.stripe.com/connect/merchant-of-record), Define the merchant of record / Clear identification | Stripe assigns merchant-of-record treatment according to the charge configuration. Direct charges and qualifying indirect charges using `on_behalf_of` identify the connected account; indirect charges without it identify the platform. Customer-facing identification must be clear. Legal responsibility cannot be inferred from an internal parent ID. |
| H08 | [Stripe Connect: charge models](https://docs.stripe.com/connect/charges), Refunds / Disputes and chargebacks | Direct-charge disputes debit the connected balance; destination and separate-charge/transfer disputes debit the platform balance. Recovery and refund behavior depend on the model. The merchant shown to the buyer and the party initially debited are not a single interchangeable field. Regional funds-flow constraints also differ. |
| H09 | [Stripe: Payment Intents](https://docs.stripe.com/payments/payment-intents), Creating a PaymentIntent / Best practices | A PaymentIntent corresponds to a cart/session, retains payment attempts and should be reused when that checkout resumes. Stable idempotency prevents duplicate creation. This supports one payment aggregate for a purchase, not one payment record for every delivery channel. |
| H10 | [Stripe: sharing payment links](https://docs.stripe.com/payment-links/share), Share your link / Generate a QR code | The same hosted link can be distributed by text, email, social media and websites; QR is another representation of that link. Deactivating the underlying link changes what its QR opens. Distribution does not itself prove payment or message delivery. |
| H11 | [Stripe: Payment Link API](https://docs.stripe.com/api/payment-link), Payment Link description | A reusable Payment Link creates a new Checkout Session when opened. It is a reusable entry point, not a single indefinitely reusable PaymentIntent. Do not infer duplicate-payment prevention across sessions merely from sharing one provider link. |
| H12 | [Stripe: invoice lifecycle](https://docs.stripe.com/invoicing/overview), Invoice lifecycle / Invoice statuses | Invoices have their own lifecycle: preparation, finalization, collection and possible unpaid outcomes. An open invoice remains open if payment fails or is incomplete. Invoice state is distinct from an email attempt or checkout-page visit. |
| H13 | [Stripe: receipts](https://docs.stripe.com/receipts), Automatically send receipts / Manually send receipts / Receipt URLs | Payment receipts are available for successful payments; refunds have their own receipts. A receipt URL refers to payment evidence. This does not make a receipt a new unpaid request or authorize another charge. |

## Recommended neutral model — Etail proposal

Keep five concepts separate rather than making one `mid` string carry all of them:

| Concept | Proposed meaning and relationship |
|---|---|
| Merchant node | An internal stable ID owned by a Seller, Personal or Household account. The requested labels can be **master MID** and **sub-MID**, with a visible distinction between an Etail identifier and an externally assigned identifier. Creation alone never means approved processing. |
| Sponsorship relationship | An explicit, versioned relationship from sub-node to named Seller master, including accepted terms, scope, status, dates and responsible-party selection. Do not silently infer sponsorship from Household membership or the first Seller account. The accepted rule permits multiple named Seller associations, with one immutable master per SUB and one unit per master/host pair. |
| Responsible-party profile | Separately identifies the contracting merchant, merchant of record, settlement recipient, refund/dispute loss bearer and authority to act. The accepted Etail model assigns sales, fees, refunds and chargeback responsibility to the master Seller. Provider-side merchant-of-record, debit routing and payout configuration must explicitly implement that choice; those external fields still need supported program evidence. A Household label is not enough to identify a legal merchant. |
| Provider connection | Provider, environment, region, contract/program and server-held credential reference. A connection may serve several merchant nodes. Members receive permission to perform allowed business actions, not the shared gateway credentials. |
| Provider binding | Versioned mapping from a merchant node to typed external resources: gateway account, processing merchant account, actual acquiring MID/submerchant ID, connected account, store, legal entity, account holder and balance account as applicable. Absence and not-required differ. Do not synthesize an external MID from an account ID. |

A gateway binding exists for each processing-enabled node, but that does **not** require a separate gateway credential or a one-to-one gateway account per node. Record any real provider parent separately from the Etail parent. Select one compatible active routing binding for a transaction and retain its version on the transaction; a later rebind must not redirect the original refund, dispute or settlement reconciliation. Never fall back to a provider default merchant when the intended binding is missing. H01–H08 motivate these distinctions; these record names and constraints are Etail proposals.

The provider adapter translates the neutral binding into exact provider parameters. It must validate environment, account ownership, currency/region, approved capabilities and parent compatibility before dispatch. An external ID or successful onboarding-request response is not sufficient evidence that acceptance and payouts are active.

## One collection flow, several ways to reach it — Etail proposal

Use a single server-owned **payable order/request** for a concrete purchase, with its exact amount/currency, responsible merchant, originating merchant node, expiry and immutable attribution. Its payment attempts and provider references belong to that aggregate. Channel records point to it:

| User-facing channel | Stored purpose; distinct completion evidence |
|---|---|
| SMS/text or email | Delivery attempt for the selected request/document; distinguish prepared, queued, provider-accepted, delivered/failed where actually reported. None means paid. |
| Social media or website/online link | Hosted collection entry point or explicit share action. Copying a link is not proof that it was posted, opened or paid. |
| QR | Encodes the same public collection route, not another payment amount or new merchant. Expiry/revocation is checked when the route resolves. |
| Invoice / unpaid bill | Itemized amount due and collection document linked to the payable request. An invoice ID is distinct from its payment attempt and channel delivery. |
| Receipt | Evidence of a recorded successful payment; show refund/correction history when relevant. Resending it shares that evidence and never creates a new amount due. Before payment, use an unpaid bill or order confirmation. |

For an individual request sent through SMS, email and QR, all three must resolve to the same payable obligation. Concurrent visits, retries and uncertain provider responses must not create duplicate business effects. Retain the stable command identity and reconcile an uncertain result before creating another attempt.

For a reusable product link or static QR serving many buyers, create a **new payable order per purchase**, with separate attempts, while reusing the channel/template. H11 means a provider's reusable link alone cannot provide Etail's one-payment-per-order guarantee. Future installments, partial payments, tips or changing amounts need explicit allocation/version rules; do not disguise them as channel variants.

Payment success, internal posting, settlement availability, payout completion and receipt delivery remain separate facts. Changing a channel must not change the merchant of record, payout binding or fee policy for an already-created payment. H09–H13 support the payment/document distinction; the cross-channel concurrency design is an Etail proposal.

## Delegated Household use — Etail proposal

Grant a named person authority on the **specific Household sub-MID**, using the existing canonical permission evaluator. An outside helper's acceptance must not expose general Household activity, Personal accounts, other sub-MIDs or gateway credentials. Separate creating a request, distributing it, viewing its payments, issuing refunds, changing payout/gateway details and granting other people access. Delegation cannot exceed the master's permitted scope or the grantor's delegation authority.

The master relationship, Household controller's delegation and invited operator's acceptance are separate evidence. A provider's onboarding/KYC or processing capability remains an additional gate. Revocation must block new commands even if a page, QR or prior invitation remains open; treatment of existing public requests must be explicitly defined rather than silently moving them to another MID. Supervised/minor eligibility and spending authority remain separate from merchant operation permission.

## Confirmed product decisions and remaining provider work

1. **Confirmed:** the master Seller is responsible for sub-MID sales, fees, refunds and chargebacks. Independent sub-merchant responsibility is outside this accepted model. Explicit buyer-facing identity and provider routing still require implementation and approval.
2. **Confirmed:** multiple Seller sponsors are allowed through distinct SUB units. Every channel/request selects one named merchant unit; no first-Seller fallback or reparenting.
3. Who may approve a Household operator, change its gateway/payout mapping, and handle old requests after suspension, departure or sponsor changes? Access grant and provider processing approval must remain distinct.
4. Which currencies, countries, goods/services and channels are supported by the actual provider agreement? The examples above do not establish onboarding availability, pricing, tax treatment, network registration or a right to aggregate unrelated merchants.

### Current local implementation boundary

The [implementation/design reconciliation](../../MERCHANT_HIERARCHY_AND_CHANNELS.md) records the actual local slice: typed MASTER/SUB units and separate host/master consent; merchant-only scope and named intended-recipient access; Household SUB helper invitations without account membership; and one canonical channel draft form with all seven presentation choices. Seller creation and fictional setup remain separate. Channel database/API status retains `CANCELED`, displayed as **Closed**; migration 7 preserves old private drafts and their IDs. These facts come from local source and migration evidence, not from provider documentation.

No external MID, gateway binding, provider review/evidence store, public checkout, delivery, document issuance, financial processing or issuing approval is established. The local `canPublish: false` boundary remains. Collector distribution and buyer checkout below are future UX, not working public journeys. Research and source existence do not prove any whole milestone or comparison percentage; the [scenario register](../../../planning/merchant-channel-verification.json) separates pending acceptance cases from recorded local evidence.

## Verification and onboarding lifecycle — additional reference

Opened **2026-09-09**. These are provider/product examples, not a universal legal checklist or a claim that Etail may onboard merchants. Exact requirements depend on country, agreement, legal form, requested capabilities and risk. Provider field names below belong to the cited API model; an adapter must pin its actual API version.

| ID | Primary source and locator | Verified finding |
|---|---|---|
| H14 | [Stripe: connected-account identity verification](https://docs.stripe.com/connect/identity-verification), Verification requirements / Onboarding flows / Business type and structure | Verification can concern the receiving individual/company, business representative, owners and controllers. US company examples include business identity, address/tax identity and information about relevant people. Country-specific structures distinguish sole proprietorship from incorporated entities. Stripe recommends provider-managed onboarding; its verification does not satisfy every independent platform obligation. |
| H15 | [Stripe: handling verification with the API](https://docs.stripe.com/connect/handling-api-verification), Determine if verification is needed / Stripe risk review requirements | `charges_enabled` and `payouts_enabled` are separate. Requirements include `currently_due`, `eventually_due`, `past_due`, `pending_verification`, `current_deadline`, `disabled_reason` and errors. Account updates can introduce new requirements. Some risk-review remediation must use hosted/embedded flows or the provider dashboard rather than the API. |
| H16 | [Adyen: determine verification requirements](https://docs.adyen.com/platforms/verification-requirements), Country/region of operation / Legal entity | Requirements depend on the user's country, legal entity and offered financial product. Sole-proprietor registration requirements differ even between countries. The application's Personal, Household and Seller labels cannot select a legal classification or fixed document checklist. Current Platforms documentation; do not import Issuing or business-account requirements into acquiring. |
| H17 | [Adyen: user capabilities](https://docs.adyen.com/platforms/verification-overview/capabilities), Capabilities / Verification status / Capability settings | Payment receipt, receipt of split funds and transfer to verified bank accounts are distinct capabilities. `requested`, `allowed`, `enabled` and verification status are distinct fields. Both allowed and enabled are required. During some subsequent reviews, `pending` or `invalid` can coexist with `allowed: true`; a single verification enum is therefore insufficient. |
| H18 | [Adyen: verification process](https://docs.adyen.com/platforms/verification-overview), When users change their data / Periodic data reviews | Changed data and periodic reviews can reopen verification. Provider deadlines and remediation may affect previously allowed capabilities. The cited account-holder update webhook covers capability changes, not every legal-entity data change; refresh/reconciliation must respect this event boundary. |

### Who is being verified — Etail proposal

The Seller master needs an identified responsible party: for example, a permitted individual/sole trader or company, with its authorized representative and additional associated people when the provider requires them. Keep declared legal form and provider classification separate from the Seller account label. A Household is an application account, not automatically a legal business.

For a sub-MID operating for the master's business, document that relationship and confirm the provider's required registration, business-line/store and operator checks. Do not infer an exemption from onboarding merely because the parent passed checks. The accepted model keeps the master Seller responsible; independently responsible sub-merchants are not the current product branch. Neither a master/submerchant label nor shared gateway credentials proves that a provider supports this arrangement. H03–H08 and H14–H16 support the need for explicit program, registration and verification evidence; they do not confer approval.

### Separate readiness dimensions — Etail proposal

| Dimension | Record and display independently |
|---|---|
| Person | Sign-in/contact verification, legal identity review and representative authority are different facts. |
| Business | Declared legal party/form, required associated people, business review and unresolved requirements. |
| Relationship | Named master sponsorship, host acceptance, provider registration and approved scope. |
| Identifier | Internal merchant unit, provider resource assignment and actual external MID assignment. |
| Processing | Current provider permission for the specific payment method/funds flow, plus Etail restrictions. |
| Funds and payout | Receipt/allocation capability, verified destination and payout permission; none follows automatically from acceptance. |
| Continuing review | Requirement state, provider deadline, next actor and remediation; retain current allowed/enabled flags separately. |

Proposed records need subject/party references, representative relationships, provider connection and namespace, country/legal-form declaration, agreement version and acceptance actor, requirement codes, review state, supplied provider deadlines, capability flags, observation time and provider event/revision references. Store restricted references to provider-hosted onboarding/evidence, not raw identity documents in general activity records. No real sensitive details are collected in this sandbox.

Present onboarding as **prepare → provide required information → provider review → action required or capability update → continuing review**, with separate timelines for each subject. These are proposed Etail presentation stages, not renamed provider states. Do not mark everything approved when an MID arrives, a person accepts an invitation or one capability activates. Display precisely who must act and what remains unavailable; never invent a review result, deadline or universal ownership/turnover threshold.

Acceptance cases must include: MID assigned but processing blocked; payments permitted but payout unavailable; missing representative requirements; re-review with provider permission temporarily retained; provider permission removed after remediation fails; and a revoked operator unable to submit changes while the underlying review remains intact. Provider permission never overrides the real-money switch or local access restrictions.
