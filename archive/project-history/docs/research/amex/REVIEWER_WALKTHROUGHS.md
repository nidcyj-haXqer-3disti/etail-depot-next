# Front-end review: creators, reviewers and current Amex screens

Checked 9 September 2026. This extends the [visually inspected reference](FRONTEND_EXPERIENCE.md). The latest request is research, architecture, Etail design, implementation and a working demonstration. Public observations do not establish access to Amex's private application or a 90% similarity score.

## What was inspected

| Reference | Actual inspection and limitations | Etail decision |
|---|---|---|
| [Magnified Money: app tutorial](https://www.youtube.com/watch?v=3BsVlemlIa4) | Root played and sampled Home around 0:57 and Account around 11:14–11:30; read the auto-caption transcript for Home, Statements/payment and Account. YouTube displayed 13 January 2022; search indexed 12 January. Historical US consumer experience; creator discloses affiliate compensation. The payment example has a zero obligation and does not complete a payment. | Selected card/account remains visible. Balance and activity lead. Transaction details stay connected to the list. Group freeze/replace separately from bank/payment settings. Treat eligibility and payment failures as real states. |
| [SimplyAndyHere: 2025 application](https://www.youtube.com/watch?v=OtxUjDP-5n8) | Root opened the video and read its complete auto-caption transcript. Sampled frame was presenter footage, so application-form visuals are **not** independently verified. Page showed nine months old on review date. Creator describes application, offer review, acceptance and a subsequent existing-account setup error. Credit-score speculation is excluded. | Separate review from submission, preserve an existing signed-in context, and show durable next steps. Do not send an existing member through duplicate registration. |
| [Pratt: Todd Wu design critique](https://ixd.prattsi.org/2023/02/design-critique-amex-iphone-app/) | 2 February 2023 student critique; article read, figures not newly inspected. Discusses a canceled-account example, offer enrollment and embedded-web continuity. | Visible status, predictable navigation and explicit confirmation; avoid a form that loses its place when help opens. |
| [Upgraded Points: adding a cardholder](https://upgradedpoints.com/credit-cards/reviews/american-express-platinum-card/adding-authorized-users/) | Updated 27 July 2026; affiliate-supported article read. Four screenshot locations identified, capture dates unknown; no new visual inspection claimed. | One selected-card context and one additional-card form. Cardholders and account managers remain separate. |
| [Experian: mobile app review](https://www.experian.com/blogs/ask-experian/best-credit-card-mobile-apps/) | 18 June 2025; advertiser-supported written review. Describes card switching, balances/activity, payments and distinct Membership/Offers/Account destinations. | Keep daily servicing prominent and separate optional benefits from account responsibilities. |
| [Bankrate: mobile app guide](https://www.bankrate.com/credit-cards/issuers/guide-to-amex-mobile-app/) | 6 August 2025; partner-supported editorial, text read. Its checking-linkage absence claim conflicts with newer official material and is excluded. | Use task layout as dated reference, not a definitive current feature inventory. |
| [Merchant Cost Consulting: merchant statement audit](https://merchantcostconsulting.com/lower-credit-card-processing-fees/amex-direct-merchant-processing-statement-audit/) | 25 August 2026 practitioner article; written workflow reviewed, not an independent portal video. Commercial pricing advice excluded. | Settlement references, date filtering and statement detail belong beside payout status. |

No full-video viewing, current signed-in Amex session, independent merchant/@ Work video walkthrough, or reviewer consensus is claimed. The indexed Amex merchant video `Vgwclyr7Io0` was private when opened; it is not usable footage evidence.

## Release correction

The [official 18 September 2025 announcement](https://www.americanexpress.com/en-us/newsroom/articles/products-and-services/new--dedicated-amex-app-experience-gives-amex-platinum-card-memb.html) describes a **US Consumer and Business Platinum** experience with benefit trackers, reminders, reservations, enrollment and light/dark presentation. [Upgraded Points' coverage](https://upgradedpoints.com/news/amex-mobile-app-updates-2025/) includes Amex-supplied illustrations; its August 2026 update date does not date a new UI release. This is not evidence that every Amex card shares the Platinum interface. Etail uses the clearer hierarchy and contextual next steps without importing Amex benefits or hiding repayment obligations.

## Merchant and administrator cross-check

The [official disputes support page](https://www.americanexpress.com/us/merchant/support-center/disputes.html) provides a public video transcript: case list, details/timeline, response choice, response entry, submit. The [official reconciliation tour](https://www.aexp-static.com/cdaas/atwork-resource-center/us-reconciliation-tour/US-American-Express-Reconciliation.html) describes account, billing-cycle and transaction detail with search/export. These corroborate the previously viewed merchant and @ Work screenshots. They do not fill the independent-reviewer gap.

## Research-to-build handoff

The resulting [experience architecture and design](../../EXPERIENCE_ARCHITECTURE.md) translates this evidence into account-scoped screens and connected actions. The local implementation uses original Etail styling and explicitly fictional historical money snapshots. Saved control/request/case state is real PostgreSQL persistence; displayed sample balances are not an implemented financial ledger. The existing milestone dependencies, open commercial decisions and 90-task benchmark remain unchanged.
