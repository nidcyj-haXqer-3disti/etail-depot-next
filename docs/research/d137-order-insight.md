# D137 — Order Insight research and Trolleys packaging

Research date: **21 September 2026**. Primary public Visa/Verifi sources only. This brief supports a local public-page rebuild; it does not establish a Trolleys contract, integration, enrollment, approved co-marketing relationship or operational service.

## Decision and commercial boundary

The accepted direction replaces D133–D136's three independent paid document options with **one optional Trolleys service**, presented as coming soon: **+0.4% of eligible successful-payment volume, plus applicable vendor charges**. Processing charges remain separate. The 0.4% is the user's approved Trolleys markup, **not a published Visa/Verifi tariff and not an inclusive price**. Basic receipts remain included. Free document illustrations and Goods / Services / Information guidance may remain educational; they must not appear to buy CE3.0 eligibility.

Use this arithmetic without inventing vendor rates:

`processing charges + (eligible successful-payment volume × 0.004) + applicable vendor charges`

On $1,000 of eligible successful-payment volume, the Trolleys service fee is **$4**, in addition to processing and applicable vendor charges. A calculator may show the known processing estimate and $4 component, but must call their sum a **subtotal before vendor charges**, not total cost or final proceeds. Unquoted vendor charges are **not zero**. This price is volume-based; it is not 0.4% of recovered funds or a success fee per prevented dispute. Billing eligibility and CE3.0 case eligibility are different concepts.

Define coverage, successful-payment events, eligible volume, refunds/reversals, partial payments, currencies, rounding, taxes, billing periods, minimums and cancellation in the future merchant agreement before charging. No wholesale amount or reseller-contract leak is used here.

## What the products actually do

| Product / capability | Actual purpose | Boundary for this page |
| --- | --- | --- |
| **Order Insight** | Shares enhanced purchase information when customers or issuers inquire about a transaction. Its digital experience can display a receipt in participating issuers' banking experiences; issuer staff can also access details. | Explain purchase recognition and issuer data sharing. Do not promise the same receipt layout in every bank. |
| **Systematic Dispute Deflection / CE3.0** | Uses qualifying historical transaction evidence to prevent eligible Visa card-not-present fraud disputes before chargeback processing. | Describe it conditionally as an Order Insight capability requiring supported enrollment, data and current rule eligibility. |
| **RDR** | Uses merchant-defined rules to resolve eligible Visa pre-disputes with a cardholder credit. | A separate refund/credit-resolution service, not an included benefit of buying Order Insight. |
| **CDRN** | Gives participating merchants up to 72 hours to initiate a credit for eligible Visa or non-Visa pre-disputes. | Separate participation and operational responsibilities; not an Order Insight response deadline. |
| **Representment / recovery** | Challenges a dispute after it exists, using the applicable acquirer/network process. | Outside this proposed add-on unless separately contracted. An Order Insight connection is not an automatic recovery service. |

Sources: [Verifi Order Insight seller page](https://www.verifi.com/solutions-sellers/prevent-disputes.html) (undated; accessed 21 September 2026); [Visa Acceptance Solutions dispute-management explanation](https://www.visaacceptance.com/en-us/blog/article/2026/reduce-chargebacks-by-optimizing-your-dispute-management.html) (**8 May 2026**); [Verifi referral product catalogue](https://www.verifi.com/partners/referral.html) (undated; accessed 21 September 2026).

Visa's **1 April 2026** announcement also describes new or enhanced products with different rollout states, including Dispute Resolution Network and Dispute Recovery Manager. Those are not evidence that Trolleys has an Order Insight integration, an AI recovery product or any entitlement to their future features. The announcement's April Order Insight enhancement does not bring every future CE3.0 rule into effect early. [Visa announcement](https://corporate.visa.com/en/sites/visa-perspectives/newsroom/dispute-resolution-services.html).

## Real workflow and necessary data

The operational pattern is an **inquiry and response**, not uploading an agreement PDF at checkout. In the documented pre-dispute workflow, Visa selects candidate prior transactions; the enrolled merchant's provider returns corresponding data through Order Insight; Verifi validates the response and Visa evaluates the qualifying rule. A qualifying case can be blocked before a chargeback. A case that does not qualify continues through its applicable dispute path. The documented post-dispute route instead runs through the merchant's acquirer and VROL. [Verifi pre-dispute / pre-arbitration explanation](https://www.verifi.com/in-the-news/compelling-evidence-3-0-ce3-0-in-the-pre-dispute-and-pre-arbitration-environments.html) (undated page describing the April 2023 rule; accessed 21 September 2026).

For a future provider implementation, separate three kinds of records:

| Record group | Useful fields / evidence | Why it matters |
| --- | --- | --- |
| Purchase recognition | Merchant/store identity and contact, product/service description, date, amount, order details and receipt information. | Helps a customer understand the charge. |
| CE3.0 qualification | Transaction linkage and qualifying historical records; matching IP or device information plus another permitted element, such as recognizable account/login identity or delivery address where applicable. | A different evidentiary requirement from making an attractive receipt. |
| Fulfillment / customer service | Actual dispatch or delivery, completed service milestones, information access/delivery, terms, cancellations, credits and correspondence. | Supports complaint-specific handling; does not automatically make a CE3.0 case. |

The first row follows [Order Insight Digital](https://www.verifi.com/issuers/enrich.html) (undated; accessed 21 September 2026). Verifi's [qualified-transaction training](https://www.verifi.com/in-the-news/compelling-evidence-3-0-301-training-qualified-transaction-matching.html) (undated public page; accessed 21 September 2026) identifies product description, store/merchant names, URL and contact phone alongside the additional matching fields. The final row is a product-design recommendation, consistent with the separate complaint/evidence treatment in [D134's network brief](d134-network-evidence.md); it is not a claim that every record is an Order Insight API field.

The **May 2023 Merchant FAQ** describes real-time API participation, candidate historical lookups, operationally accessible history and response SLAs. It also documents outcome/review notifications and failure cases. This means the future provider needs reliable order-to-payment matching, historical retrieval, monitoring and reconciliation, not simply a new checkout checkbox. The public website should not collect device fingerprints, payment credentials or transaction histories to simulate that integration. The published FAQ is historical integration guidance, not a substitute for the current contracted API specification. [Verifi FAQ, questions 2, 12, 29–30 and 38](https://www.verifi.com/_assets/Visa-CE3.0-FAQ.pdf) (**May 2023** heading; document footers also say February 2023).

## Eligibility and limitations as of this research date

The controlling public rules located are the **18 April 2026** Visa edition. For the ordinary CE3.0 historical-purchase route currently in effect, two qualifying prior transactions and the required matching data are needed; the ordinary age window is **more than 120 and no more than 365 days** before dispute processing. Required descriptions, fraud-reporting conditions and field-format rules also apply. Original Credit Transactions have a stated age exception. The **24 October 2026** expansion to multi-merchant history is future-effective on this research date; do not advertise it as already available. See **§11.7.5.3, Table 11-28, printed pp. 701–705** and the change notice on **p. 48**. [Visa public rules](https://usa.visa.com/content/dam/VCOM/download/about-visa/visa-rules-public.pdf).

Do not promise that a first-time buyer, an invoice, a signature, an IP address alone or proof of payment automatically qualifies. CE3.0 fraud deflection does not settle whether goods arrived, a service met its description or a cancellation was honored. Verifi explicitly describes possible subsequent non-fraud disputes and review/reversal of deflection decisions. [May 2023 Merchant FAQ, questions 21, 28 and 30](https://www.verifi.com/_assets/Visa-CE3.0-FAQ.pdf).

No source establishes a Trolleys success rate, coverage percentage, bank list, guaranteed liability protection, guaranteed VAMP outcome or refund immunity. Avoid borrowing vendor aggregate performance numbers for the Trolleys offer. Confirm current geographical, merchant, transaction and issuer applicability with the actual provider.

## Possible commercial routes; none verified for Trolleys

| Route | Publicly described arrangement | Trolleys decision still needed |
| --- | --- | --- |
| Authorized reseller | Negotiated vendor buy rate; reseller markup. | Contract authority, product scope, enrollment, billing and integration ownership. |
| Enablement partner | Technology integration; the client contracts directly with Verifi. | Whether the +0.4% is an independently disclosed Trolleys service fee and who invoices vendor usage. |
| Referral partner | Introduces clients under an agreed commission arrangement. | Referral alone cannot substantiate Trolleys-operated data sharing or a reseller claim. |
| Acquirer-supported route | Verifi describes acquirer distribution of pre-dispute solutions. | Obtain the specific Trolleys processor/acquirer capability and agreement. |

[Verifi partner FAQ](https://www.verifi.com/partners/faq.html), [enablement](https://www.verifi.com/partners/enablement.html), [referral](https://www.verifi.com/partners/referral.html) and [acquirer](https://www.verifi.com/partners/acquirers.html) pages are undated and were accessed **21 September 2026**.

The FAQ also says sub-resellers and white labeling are not permitted, public statements about Verifi solutions require its review/approval, and reseller billing can be based on cases, alerts or units with negotiated minimums. Therefore the public page must not invent a reseller chain, imply an approved partnership, display an authorization badge or present unknown vendor costs as included. Public evidence does not resolve Trolleys' exact rights or price. This is a publication/activation dependency, not a reason to stop preparing the authorized local candidate. [Verifi partner FAQ](https://www.verifi.com/partners/faq.html).

The general [reseller page](https://www.verifi.com/partners/resellers.html) describes API, batch and portal participation options across the product suite; that does **not** mean real-time CE3.0 responses can use any of those interchangeably. [Order Insight Express](https://www.verifi.com/order-insight-express.html) describes supported e-commerce-platform activation and a SellerID; it does not establish support for this Next.js website or Trolleys. Both pages are undated; accessed **21 September 2026**. No vendor contact, enrollment or external submission was made during this research.

## Recommended public presentation

Use one compact, optional service card; leave it unselected by default. The following is proposed copy, grounded in the documented product but explicitly limited to the planned Trolleys offer:

> **Order details, ready when questions arise.**  
> Planned optional service · Coming soon  
> Trolleys plans to connect eligible payment records to Verifi's Order Insight, helping participating banks and customers recognize purchases. Where supported and qualified, Visa CE3.0 evidence can help prevent eligible fraud disputes before they become chargebacks.  
> **Trolleys service fee: +0.4% of eligible successful-payment volume, plus applicable vendor charges. Processing fees also apply.**  
> On $1,000 of eligible volume, the Trolleys service fee is $4. Vendor charges are additional. Coverage, enrollment and final service terms must be confirmed before activation.

Keep the detailed limitation near the explanation: **“Eligibility depends on the transaction, available records and supported provider connection. Dispute prevention is not guaranteed.”** Use a descriptive link or a local price-preview control, never an “Activate protection” control. Keep the standard **Open Trolleys** handoff fixed at `https://trolleys.ai`, without forwarded parameters, fragments or referrers.

For the diagram, show only **three short steps**:

1. **Keep the order details** — what was sold, to whom, for how much, with actual fulfillment records.
2. **Answer a purchase inquiry** — eligible records are shared through the planned provider connection.
3. **Help the bank resolve it** — purchase recognition; qualifying CE3.0 fraud cases may be deflected.

Label the diagram **“Planned service workflow”**. A small branch can say **“If unresolved: the usual dispute process continues.”** Avoid shield/checkmark outcomes saying “Protected,” “Won” or “Guaranteed”; do not draw refunds or recovery as included outputs. The diagram is explanatory HTML/CSS/SVG, with no API, upload, enrollment or financial action.

## Promise / readiness classification

| Claim or capability | Status for this local candidate |
| --- | --- |
| Public information, sale examples, price illustration and fixed Trolleys link | Implementable in the current public-only application. |
| Optional +0.4% Trolleys fee **plus** vendor charges; old three fees retired | User-approved packaging; not live billing or a vendor quotation. |
| Order Insight's documented data-sharing and conditional CE3.0 capabilities | Established vendor product facts; describe their scope accurately. |
| Trolleys enrollment, API connection, supported banks/merchants and complete fee lifecycle | Planned / unverified. Must not be represented as active. |
| Automatic PDF generation, e-signatures, reminders, dispatch, evidence submission, refunds or representment | Not established by Order Insight research and not implemented here. |
| Verifi authorized-partner status, approved marketing and future October rule support | Unverified / future-dependent; no badges or present-tense entitlement claims. |

This research authorizes no infrastructure, account, database, payment, deployment or domain change. The active application's D108 boundary remains intact.
