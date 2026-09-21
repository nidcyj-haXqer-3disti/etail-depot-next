> **D137 supersedes the independent paid-document model.** The active public candidate uses one optional [Trolleys Sale Records](TROLLEYS_SALE_RECORDS.md) service at 0.4% plus additional vendor charges. The prior pricing below is retained as design history, not the current offer.

# D136 — transaction details and concrete document value

21 September 2026. The user accepts Goods / Services / Information and asks the Payments page to display the underlying details for each, then explain the real value of Enhanced receipt 0.1%, Invoice 0.4% and Agreement 1%. This implements the public product presentation and examples. It does not activate provider document workflows or fees.

## Customer experience

The three choices describe what the customer buys rather than the delivery format. Information includes research, insights and advice: a briefing can have a delivery deadline, event, source cutoff, research standard and permitted use. The example is a market research briefing before a planning meeting, not a claim that regulated financial advice has been approved for the merchant program. Goods, services and information can coexist in one purchase.

Each choice displays six details, each with a plain question and a clearly identified illustrative example:

| Goods | Services | Information |
| --- | --- | --- |
| Item and specification | Scope of work | Subject and scope |
| Delivery timing | Schedule | Timing |
| Condition | Deliverables | Freshness |
| Changes and returns | Completion standard | Promised standard |
| Handover | Changes and responsibilities | Access and use |
| Delivery evidence | Performance evidence | Delivery evidence |

The source registry supplies these details to both the visible explanation and the Agreement preview. An example return window, project deadline or information-use restriction belongs to the illustrated sale, not to Trolleys' own merchant agreement. The interface identifies example terms and makes clear that no actual delivery or acceptance has been recorded. Record instructions remain distinct from affirmative buyer assent or completed performance.

Information questions explicitly cover topic/market/event/data, deadline/time zone/event trigger, freshness and corrections, coverage/methodology, continuing access and redistribution, and the exact version/recipient/time. Actual payment or receipt does not establish information accuracy, timeliness or a promised result.

## What the customer would pay for

- **Enhanced receipt:** payment/refund timeline, linked real supporting records and one downloadable transaction record. Its purpose is organization and retrieval; basic payment receipts remain included.
- **Invoice:** itemized charges, due date, payment link, reminders and paid/partial/unpaid balance tracking. Its purpose is billing and follow-up, not a paid receipt or proof of completed work.
- **Agreement:** sale-appropriate scope/terms, affirmative acceptance of the exact version, customer copy and agreed changes. Its purpose is retaining what was agreed, not verifying identity, guaranteeing enforceability or proving later fulfillment.

Each option shows its merchant fee on a $1,000 payment: $1, $4 or $10 respectively, before processing. The amounts come from the existing exact-cent fee function. Selections remain independent, with no paid defaults or hidden bundles. All three total 1.5%. The page explicitly says that a basic payment link and included receipt remain usable without any add-on.

The [value assessment](PAYMENT_ADDON_VALUE_DESIGN.md) compares official Stripe, Docusign and PandaDoc workflows and defines provider acceptance criteria. It finds that a percentage-based Agreement fee is harder to justify for large transactions. A cap, fixed charge or subscription is a recommendation for separate commercial evaluation; no pricing change or cap has been introduced.

## Implementation and boundaries

`document-example.ts` owns the three types and 18 detail definitions. `PaymentExperience` renders responsive definition lists, example terms, optional services, freely available document previews and the five sharing channels. The shared fee catalog supplies each output list and rate. The previous `digital` example key and download-based classification are removed from active payment code and tests; digital-wallet card language remains correct and untouched.

The existing public-only architecture remains: six pages, no account API or active database, no provider request, no browser persistence and no actual document generation or acceptance. Optional services are still marked coming soon. Help, Privacy, Terms and search descriptions match the broadened Information category. Historical D134 recommendations are marked as superseded rather than erased.

Verification and visual evidence are recorded in [current status](../planning/STATUS.md). This task does not authorize a push, merge or deployment. D129 / PR #30 remains the public release.
