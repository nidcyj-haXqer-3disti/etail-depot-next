# Account control: 360-degree business review

Research date: 2026-09-08. Scope: who may join, spend, approve, administer, view, pay, dispute and leave across consumer, Household and Seller journeys. This is a business/product review. It does not change Etail's financial responsibility, membership economics or approved account types.

**The largest omission in the earlier comparison is the complete exit journey.** Removing a manager, cancelling a card, stopping scheduled reports, transferring open work and settling remaining obligations are different outcomes. The earlier ninety tasks mention several of them separately, but do not establish that a person's departure has been fully handled.

The [25 review checks](account-control-360-checks.json) cover the normal path, exceptions and handoffs to issuing and merchant operations. Nine have a documented core Amex task, fourteen have partial evidence and two remain gaps. These labels describe reference coverage, not implemented Etail features or passed acceptance tests. Each check maps to relevant existing AX rows; an empty mapping identifies absent coverage. The [23-source register](account-control-360-sources.json) records program, country and limitations.

## Keep the people and responsibilities distinct

| Business concept | What the reviewer needs to know |
|---|---|
| Acting person | Who is doing this task now, and for which account? |
| Responsible payer | Who has the approved obligation to repay? This is not determined solely by login, job title or possession of a card. |
| Funder | Whose permitted funds or approved capacity support the spending? |
| Administrator | Which particular people, controls, records and servicing tasks may this person manage? |
| Cardholder | Which card or allocation may this person use, and under what restrictions? |
| Approver | What precisely may this person approve, and are they independent where required? |
| Merchant representative | For which named Seller, location and acquiring tasks may this person act? |

Amex's US Additional Card FAQ distinguishes holder access from Basic Card Member responsibility and separate manager authority. Its July 2026 corporate description offers different approved liability structures. Neither makes “administrator” synonymous with the person responsible for payment. [C01 — Additional Cards](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/); [C19 — corporate program responsibility](https://www.americanexpress.com/en-us/business/trends-and-insights/articles/how-amex-corporate-helps-organizations-navigate-growing-financial-complexity/).

Etail must retain its own model: Personal activity remains private; Household sharing is explicit; supervised participants are guardian-funded; Seller responsibility is named. A consumer repayment delegate is not a merchant payout delegate. A manager is not automatically a cardholder, issuer approver or borrower.

## Amex actor × action matrices

**Allowed** means the reviewed source expressly supports the task for that program. **Limited** means supported only within the stated assignment, access level, product or channel. **Not established** is not a declaration that Amex forbids it; the reviewed material does not establish the permission. These are separate program matrices, not a universal Amex role ladder.

### US consumer/business Account Manager program

Full Access is listed for consumer/business; Limited Access also covers corporate card members. This is different from corporate @ Work administration. The matrix summarizes task availability without promising the same online/phone channel for each cell. [C02 — manager terms](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/account-managers/terms-conditions.pdf).

| Action | Additional holder | Full Access manager | Limited Access manager |
|---|---|---|---|
| Review account activity | Limited: own | Allowed | Allowed |
| Schedule payment | Limited | Allowed | Allowed |
| Add bank information | Limited: own payment setup | Limited | Not established |
| Add another holder | Not established | Limited | Not established |
| Request dispute assistance | Limited: documented BCP example | Limited | Limited |
| Spend using a card solely because of manager status | Not established | Not established | Not established |

Holder-payment/visibility context: [C20 — young additional-holder guide](https://www.americanexpress.com/us/explore/additional-card-member-guide.html). Product-specific dispute assistance: [C23 — Blue Cash Preferred additional holder](https://www.americanexpress.com/en-us/account/get-started/additional-card-member//bcp). Manager actions: [C02 — role tables](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/account-managers/terms-conditions.pdf).

A removal ambiguity must remain visible: the short FAQ says only the Basic member removes managers, while the detailed terms allow Full managers to remove Limited managers. Do not silently generalize either statement across all channels. [C03 — removal FAQ](https://www.americanexpress.com/us/customer-service/faq.add-remove-account-manager.html); [C02 — terms](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/account-managers/terms-conditions.pdf).

### Corporate @ Work

| Action | Program Owner | Designated Main PA | Other PA | Cardholder only |
|---|---|---|---|---|
| Designate access oversight | Allowed | Limited | Not established | Not established |
| Change PA authorizations | Not established from title alone | Allowed within scope | Not established | Not established |
| Review access reports | Not established from title alone | Allowed within scope | Not established | Not established |
| Manage company cards | Not established from title alone | Limited | Limited | Not established |
| Complete own card servicing | Not established from title alone | Not established from title alone | Not established from title alone | Allowed after enrollment |

The Access Center distinguishes Program Owner, designated Main PA and PA, with specified control-account/country scope. Cardholder setup separately covers own statements, payments, expenses, alerts and disputes. [C06 — Access Center](https://www.americanexpress.com/en-us/business/resource-center/atwork-access-center/index.html); [C11 — cardholder setup](https://www.americanexpress.com/en-us/business/card-member/activate-my-card/). Corporate administrator enrollment also calls for authorized signatures, with local approvals for relevant non-US markets. [C07 — PA enrollment](https://www.americanexpress.com/en-us/business/resource-center/program-management/support-category-articles/enroll-manage-pa-access/).

The matrix does not infer that a PA can approve their own financial request, change company liability or perform every dispute action. Those need program-specific authority.

### US merchant portal

| Action | Email User | Merchant User | Bank User |
|---|---|---|---|
| Financial payment/statement information | Not established | Not established | Limited |
| Dispute-management features | Not established | Not established | Limited |
| Account-services features | Not established | Not established | Limited |
| Select own features | Limited: Flexible level | Limited: Flexible level | Limited: Flexible level |
| Release a payout solely from this role label | Not established | Not established | Not established |

Here “Bank User” is a portal role. Limited versus Flexible access separately controls feature selection within that role. It does not make the user a bank or establish unrestricted fund movement. The terms assign merchant responsibility for authorized users. [C12 — merchant access terms, sections 4–6](https://www.americanexpress.com/content/dam/amex/us/merchant/pdf/terms-and-conditions.pdf).

Do not confuse this formal access level with the incomplete-registration message “I'll do this later.” That path leaves setup limited until verification is completed. [C21 — deferred merchant verification](https://www.americanexpress.com/us/merchant/support-center/registration/do-later.html). Nor should a profile's “User Role” edit label become a promise that staff may grant themselves sensitive authority. [C14 — profile/contact guide](https://www.americanexpress.com/us/merchant/support-center/account-services/online-account-contact-information-and-alerts.html).

## The complete operational journey

### Joining and approving — CTL360-01–08

For Etail, the owner should be able to explain the invitation before sending it: intended person, account, tasks, information visible, spending assignment, responsible payer and approver. The invitee needs a clear acceptance or rejection path and must not become a member of unrelated accounts.

Keep an application invitation, management appointment and card assignment distinct. The applicant may need to complete details; an authorized person may need to review them; the issuer makes a separate decision. A saved request must survive ordinary interruption without becoming a second application.

Amex GAFC separates applicant work and administrator review, with country-dependent routes; its applicant guide includes expiry and save/resume behavior. Those exact time windows and routing choices are not Etail defaults. [C09 — administrator FAQ](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-program-administrator/); [C10 — applicant FAQ](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-card-applicant/).

The business review must cover wrong email, missing invitation, expired or withdrawn invitation, unavailable approver, returned corrections, a changed holder or amount after approval, and a person holding multiple roles. Show which person must act next. If an approval is no longer valid, explain why before requesting it again.

A quarterly or departure-triggered access review is a proposed Etail operating practice, not an observed Amex requirement. It should include pending invitations, reporting recipients and sensitive payment permissions, as well as active people.

### Everyday control — CTL360-11–16

**A spending limit must explain what it does.** Amex's employee program distinguishes limits, category alerts, pause/resume and monitoring. [C04 — employee controls](https://www.americanexpress.com/en-us/business/employee-credit-cards/). Its separate limit terms describe earlier-period spending exclusions when limits change and delayed refresh. Etail intentionally retains already-used amounts across edits. [C05 — limit terms](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/emp-controls-spending-limits-terms-and-conditions.pdf).

For Etail, display the permitted amount, current use, funding relationship, effective period and who may change it. Explain why a purchase can still be unavailable below the displayed limit. An alert must not be described as a restriction that blocks spending.

**Temporary restriction is not cancellation.** Amex's consumer freeze has exceptions and automatic expiry; Etail's required hierarchical restriction remains until authorized removal. [C16 — freeze FAQ](https://www.americanexpress.com/us/customer-service/faq.what-happens-when-i-freeze-my-card.html). The business acceptance case is straightforward: a holder cannot undo the responsible account's restriction, and genuine earlier activity still receives an understandable outcome.

**Activity, statements and notifications must agree on visibility.** Shared participation is not permission to read another person's private history. Etail's Household view must reveal only the agreed shared activity and necessary allocation. Amex's additional-holder total-balance visibility is not adopted. [C01 — holder visibility](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/).

Payment delegation also needs a precise explanation. “May pay this bill” must not imply “may add a bank,” “may transfer responsibility,” or “may change a merchant payout destination.” A supervised participant has no independent Etail credit bill, regardless of the young-holder payment example used by Amex.

### Merchant responsibilities — CTL360-17–21

A merchant user needs a named Seller and location scope, then separate decisions for financial reports, case evidence, refunds, bank changes and payouts. Removing a location from a person's view must not be presented as closing the merchant location or ending its obligations.

Amex's bank-change guide requires selected destinations and identity verification. It does not establish every staff member's right to release a payout. [C13 — bank changes](https://www.americanexpress.com/us/merchant/support-center/account-services/edit-bank-information.html). Etail should show the affected business and destination, the authorized requester and approver, the result and any unresolved condition.

Dispute enrollment can change where notices arrive: Amex describes moving from mailed letters to online cases, with optional email alerts. [C15 — dispute enrollment](https://www.americanexpress.com/us/merchant/support-center/disputes/logging-in-and-enrolling.html). The business implication is a named case owner and backup, regular review of deadlines, and explicit transfer when staff leave. Receiving an alert, preparing evidence, accepting a claim and issuing a refund are different permissions.

Card-side inquiry is separate from merchant response. Amex distinguishes pending monitoring, a posted-charge dispute, status and withdrawal; the reviewed guide does not establish every administrator's authority. [C22 — card dispute stages](https://www.americanexpress.com/en-us/business/resource-center/program-management/support-category-articles/dispute-fee/index.html). Etail should show which side of the case the actor represents and prevent them from acting for both parties merely because they have access to more than one account.

### Revocation and staff exit — CTL360-09–10

Amex's Access Center says cancellation stops portal/phone access immediately but Reporting removal may take 10–14 days, with scheduled emails continuing to the profile address. [C06 — cancellation and reporting FAQ](https://www.americanexpress.com/en-us/business/resource-center/atwork-access-center/index.html). Its corporate-card cancellation FAQ separately describes card cancellation and tracking. [C08 — cancel an employee card](https://www.americanexpress.com/us/customer-service/faq.cancel-employee-corporate-card.html). The GAFC guide calls for reassigning application notifications when a PA leaves. [C09 — administrator continuity](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-program-administrator/).

Etail should use one departure review covering:

1. Invitations, management grants, approvals and access to records.
2. Assigned cards and permitted spending.
3. Scheduled reports, alerts and operational contact addresses.
4. Open applications, disputes, refunds, expenses and repayment work.
5. A replacement responsible person and confirmation of what remains unresolved.

A person may have several of these relationships. Finishing one item cannot mark the whole departure complete. Already downloaded records cannot be recalled, but future access and deliveries can be stopped. Existing charges and valid later refunds still require handling without restoring the departed employee's authority.

### Death, incapacity, supervised transitions and closure — CTL360-22–25

The US deceased-member page distinguishes reporting a death from discussing the account, cancellation and possible approved takeover. It gives separate corporate directions. [C17 — US bereavement guidance](https://www.americanexpress.com/us/help/deceased-cardmembers.html). The UK life-events page separates third-party discussion, power-of-attorney support and bereavement. It is not a US authority checklist. [C18 — UK assistance routes](https://www.americanexpress.com/en-gb/customer-service/challenging-times/life-events/).

For Etail, family relationship or manager status must not automatically transfer control or debt. A specialist case should establish the affected person, business, cards and permitted representative before disclosing private records or deciding continuity. Use fictional evidence in the sandbox; this study does not select legal-document standards or inherit Amex liability terms.

Supervised adulthood and guardian change remain a business gap. A birthday, invitation or role edit must not automatically create borrowing, Seller ownership or visibility into another adult's history. Define the review, responsible-party decision, treatment of existing funds and the participant's explanation.

Ordinary closure also needs more than “cancel card.” Review unpaid obligations, pending purchases, refunds, payouts, disputes, earned benefits and access to final statements. Explain whether new activity is stopped, closure is awaiting resolution or closure is complete. Membership cancellation, card cancellation and closing an account are separate decisions under Etail's existing rules.

## Actionable Etail permission decisions

This is a review of Etail's stated rules, not a proposal to copy Amex access packages.

| Actor | Permitted basis | Must not follow automatically |
|---|---|---|
| Account Owner | Approved governance and explicitly authorized product actions | Unlimited spending, arbitrary liability changes or another person's private history |
| Manager | Exact granted administration, reporting or control tasks | Card issuance, spending, refunds, payouts or bank changes |
| Cardholder | Assigned active card and permitted allocation | New-card approval, inviting managers or raising parent restrictions |
| Viewer | Specified read scope | Any money movement, approval, recovery or control change |
| Guardian | Approved supervised funding and supervision | Independent borrowing by the child or automatic access to another adult's Personal account |
| Merchant case worker | Assigned case information and evidence tasks | Accepting loss, refunding or releasing funds without the corresponding authority |
| Payment/bank/payout delegate | The separately named action and scope | Either of the other actions, broader account visibility or transferred liability |
| Representative in a life-event case | Verified case-specific authority | Automatic ownership, unrestricted disclosure or debt assumption |

Before the next business walkthrough, resolve the unanswered product choices: complete staff exit, scheduled-report cleanup, replacement approvers, exact sensitive-action approval rules, guardian changes, specialist life-event authority and ordinary closure. These are refinements to the existing ninety-task comparison, not a new percentage claiming that Amex or Etail has been fully reproduced.

## Coverage and evidence limits

The checks deliberately retain gaps. “Documented” means an official public task is described for the cited program, not that every exception or role is known. Most pages are undated; dated terms and country-specific pages are identified in the register. No private portal was used and no live permission, invitation, cancellation or money action was performed.

Earlier research remains the source for already-described details; this report keeps repeated Amex summaries short. The checks' normal flows, exceptions and acceptance scenarios are proposed Etail business review exercises. Their usefulness is whether an owner, holder, guardian, employee and merchant operator can each complete the whole job and understand who is responsible afterward.
