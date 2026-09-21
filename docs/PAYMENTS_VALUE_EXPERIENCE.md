# D142 — Payments value and artwork

## Design direction

D141 removed repeated content but reduced the story too far. The user explicitly rejected that visual/value treatment. D142 preserves the coherent page sequence and concise FAQs while restoring depth through product artwork, concrete examples and clearer benefit language.

- The accepted two-step hero remains, with copy connecting payment collection to optional Dispute readiness.
- Sharing moves to a larger two-panel composition: the customer's selected channel beside card checkout, with numbered steps and a visible connection. Goods, Services and Information retain one shared purchase context; all five channels remain interactive.
- Dispute readiness becomes a full-width merchant-purchase → Order Insight → participating-bank illustration. Customer and bank views explain different contexts, rather than duplicating a receipt with a changed icon.
- The 0.4% price sits beside a concrete $0.40 Trolleys fee on $100, calculated by the existing exact-cent estimator. Vendor fees and processing remain additional. The example never enrolls or changes a payment.
- Three benefits distinguish purchase recognition, bank-inquiry context and conditional eligible fraud deflection. Pricing and FAQs retain coverage, refund and payout boundaries.

## Primary-source check

Reviewed on 21 September 2026:

- [Visa Order Insight](https://www.visa.com/en-us/products/order-insight): recognition and enhanced purchase detail for participating banking experiences.
- [Verifi dispute prevention](https://www.verifi.com/solutions-sellers/prevent-disputes.html): merchant/transaction/order context and eligible fraud-deflection use cases.
- [Verifi qualified transaction matching](https://www.verifi.com/in-the-news/compelling-evidence-3-0-301-training-qualified-transaction-matching.html): matching transaction history and required data for CE3.0 qualification.

The operator's D138 live-and-approved confirmation remains the integration provenance. This public website does not independently execute provider APIs. Recognition is not itself proof of CE3.0 qualification. No guaranteed wins, universal bank/network coverage, refund automation, legal representation or managed chargeback recovery is added. Provider-specific presentation varies; illustrated views are not a real banking response.

## Scope and verification

No schema, database, account, financial API, provider action or new collection/storage is introduced. Existing source and archived data boundaries remain. Current `planning/STATUS.md` and `artifacts/d142-checks/` record actual local verification. D140 / PR #31 remains the published release until a separate authorized publication.

Final local verification passes `pnpm verify` (86 unit, 44 browser, 24 accessibility cases and all build/security/SEO/package gates), plus 119 production-mode responsive/interaction/text-spacing scenarios. `artifacts/d142-checks/implementation.json` records the source hashes and final result. The prototype is ready for review, not published.
