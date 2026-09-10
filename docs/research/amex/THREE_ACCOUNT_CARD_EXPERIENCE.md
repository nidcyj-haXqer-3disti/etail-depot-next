# Three account card experience — Amex reference and Etail proposal

Research refreshed **9 September 2026**. Proposed target: exactly **PERSONAL, HOUSEHOLD, MERCHANT**, replacing the former SELLER name and repositioning Merchant as the sandbox payment-facilitator/gateway management account. This document implements no rename, migration, entitlement or financial service. The latest user direction governs this proposal; older Seller-based research is historical context.

**Recommendation:** Personal keeps an owner's everyday card tasks simple. Household adds explicitly shared card management and collections. Merchant manages connected collection accounts and gateway readiness. Account type chooses the product surface; a current, resource-specific permission and applicable product approval determine each action. Merchant administration never grants access to a host's private cards, balances or spending.

## Refreshed primary evidence

The nine official sources below were opened and read on **2026-09-09**. The HTML pages do not display a reliable revision date; availability today does not prove that every signed-in screen has the same layout. Findings are U.S. consumer/business/corporate as marked. No private account, signed-in Amex interface, application or financial action was accessed. This is public task/permission evidence, not Amex's private architecture or an assertion of Etail product eligibility.

| ID / official source | Scope and date | Bounded finding | Design conclusion |
|---|---|---|---|
| C01 — [Additional Card Member FAQs](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) | U.S. additional cards; undated, refreshed 2026-09-09. Prior I01. | Additional holders have their own login and card number, see their own purchases and the account total; the primary member sees itemized holder charges and remains responsible. Management access is separate. | Separate holder identity, responsibility and shared visibility. Do **not** copy automatic visibility of the account total into Etail Household. |
| C02 — [Account Manager options](https://www.americanexpress.com/us/credit-cards/features-benefits/account-management/account-manager.html) | U.S. consumer/business, with employee/product qualifications; undated, refreshed 2026-09-09. | Both Full and Limited include payments, activity, statements and disputes. Full adds listed employee-card/limit, replacement and reward tasks. Managers use a distinct login. | Do not equate Limited with Viewer or Full with unrestricted Owner. Offer understandable, separately selected permissions. This public comparison is not a complete channel-by-channel entitlement contract. |
| C03 — [Employee Cards](https://www.americanexpress.com/en-us/business/employee-credit-cards/) | U.S. Business Cards; undated, refreshed 2026-09-09. Prior I03. | Per-employee limits, pause/resume, activity graphs and category alerts are described. The limit does not guarantee spending capacity; some transactions are exceptions. Merchant-category alerts reflect merchant classification. | Show whose card, which period and whether a setting blocks or only alerts. A card limit never creates funds or credit. Business controls inform Household UX; they do not make Household a business credit product. |
| C04 — [Additional Card Spending Limits terms](https://www.americanexpress.com/content/dam/amex/us/customer-service/account-management/additional-card-member/custom-limit-terms-conditions.pdf) | U.S.; **last modified 2017-03-17**, still publicly served on 2026-09-09. One-page PDF. | Terms qualify limits, timing of changes, treatment of credits and delayed/exception transactions. | Treat this as a dated example of why effective timing and exception text matter, not a current universal rule. Do not adopt its reset timing, exclusions or credit treatment as Etail policy. |
| C05 — [Freeze my Card FAQ](https://www.americanexpress.com/us/customer-service/faq.what-happens-when-i-freeze-my-card.html) | U.S.; undated, refreshed 2026-09-09. Prior I08. | Freeze has recurring, wallet, some stored-card, offline and delayed-authorization exceptions. The page describes automatic unfreeze after seven days. | Explain the actual effect and duration. Etail's existing parent restrictions and authorized manual removal remain a deliberate difference; no claim that freeze prevents every eventual posting. |
| C06 — [Transaction history and statements](https://www.americanexpress.com/us/customer-service/faq.transaction-billing-statements-history.html) | U.S.; undated, refreshed 2026-09-09. Prior I11. | Online history supports sort/filter/download. Period PDF statements are separate; archived retrieval can be asynchronous. | Keep Activity and Statements distinct. Search, totals, download and document retrieval must all follow the same permitted row scope. |
| C07 — [AutoPay enrollment](https://www.americanexpress.com/us/customer-service/faq.autopay.html) | U.S.; undated, refreshed 2026-09-09. Prior I12. | The user selects a card; only the Basic Card Member can enroll. Enrollment can begin after the current billing cycle without changing the due date. | Separate one-off payment authority, repayment responsibility and AutoPay management. Show the effective start and current obligation; never imply that enrollment paid a bill. |
| C08 — [Corporate Program Administrator FAQ](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-program-administrator/) | U.S. Global Apply for Card, with explicit regional variants; undated, refreshed 2026-09-09. Prior I05. | Application initiation, applicant completion, any company review and Amex decision are distinct. Administrators track only authorized control accounts; review routing varies by initiation method and market. | A Household card request can have a named approver and clear next actor through one request lifecycle. Household approval does not equal issuer approval. Do not copy corporate access keys or regional rules. |
| C09 — [Corporate Card Applicant FAQ](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-card-applicant/) | U.S. corporate applicant; undated, refreshed 2026-09-09. Prior I06. | Save/resume, labeled errors, review/terms and submission confirmation are described. Submitted applications are not editable; notifications distinguish company review from issuer submission. | Preserve one draft, an explicit review and a submitted snapshot. Resume/retry must not create another request. Do not copy sensitive challenge questions, deadlines or delivery promises. |

These sources support a recognizable experience, not the three Etail account types themselves. “Family” is a relationship between named people and cards in this reference; it does not establish a separate Amex Household account product. Amex's fees, age thresholds, card-count limits, interest, benefit rules and numerical spending thresholds are not imported.

## Simple account experience matrix

Everything in this matrix is **proposed product scope**, not a permission automatically awarded at account creation or proof that a provider feature is implemented. “Available” means the server may expose it after current authority and prerequisites are satisfied. Personal's “limited” service means fewer management tasks and a private scope, not an invented amount or card-count cap.

| Task | Personal | Household | Merchant |
|---|---|---|---|
| See cards | **My cards** for the owner; identify the funding account on every card. | **Household cards**: own assigned cards; other cards only with shared card-view permission. | No host cards through gateway access. Any separately supported own-business card view needs its own issuing entitlement. |
| Request a card | Request for self through the existing single Add card form. | Same form; authorized requester chooses an eligible accepted holder and funding assignment. | No request for a host card through merchant authority. Separate own-business issuing remains a distinct product decision. |
| Use a card | Named holder plus explicit use permission and approved/funded product. | Named holder plus explicit allocation; supervised use remains guardian-funded. | Merchant ownership or gateway administration grants no card use or borrowing. |
| Freeze a card | Own assigned card if permitted; show why unfreeze may remain blocked. | Own card or named managed cards within explicit control scope; permitted account-wide restriction is separate. | May restrict collection services when authorized, but cannot freeze a host card through that permission. |
| Change a card limit | View own effective control; request change only if the product supports it. | Authorized card manager changes a named card's control within its parent ceiling. Holder cannot raise their own allowance by default. | Collection limits are not card limits. Host issuing controls remain outside merchant administration. |
| View activity | Owner's account activity, with card filter. | **My spending** by default for a cardholder; **Shared spending** only with an explicit shared-view grant. | Collection activity for permitted connected accounts; no host purchase activity, even where a name or account is linked. |
| Statements and exports | Own permitted records. | Own activity report; full Household statement/account totals only for authorized viewers or responsible payer. | Merchant collection reports only; no automatic Household or Personal statement access. |
| Repayment and AutoPay | Responsible payer with valid payment authority and funding mandate when the financial service exists. | Explicit payer authority for the exact obligation. Cardholder or card manager alone is insufficient. | No repayment of host card bills through gateway authority; collection settlement and card repayment remain separate. |
| Invite or manage people | Personal financial account stays owner-only. Use Household for shared card management. | Named invitations for the specific card-management, shared-view or collection tasks; no blanket spending or payment powers. | Staff manage permitted connected collection accounts and gateway setup; onboarding an account grants no host financial membership. |
| Merchant services | Simple **Get paid**: own accepted collection account and allowed channel drafts. | **Collections**: shared permitted collection accounts, channel drafts and named helpers. | **Merchant services**: connected Personal/Household collection accounts, current readiness and gateway configuration where implemented. |

A person can have different access in each account. Personal/Household collection relationships may connect to more than one Merchant, but every collection account retains its one named responsible Merchant. Switching the selected Merchant changes the collection context, not the host's card funding, shared totals or issuing rights. Existing records must survive the SELLER→MERCHANT redesign; a label change is not approval, expanded access or deletion of old business-card history.

## Permissions shown as tasks, not broad titles

Use these as review labels over the existing single server policy engine. They are not new account types or automatic role bundles. A permission review names the account, person, affected cards/collection account, expiry and whether the holder can pass any permission onward.

| Simple label | What it may allow when explicitly granted | What it does not imply |
|---|---|---|
| **Cardholder** | See and use the assigned card; see own transactions; own freeze if separately permitted. | Add cards, raise limits, see everybody's spending, pay the full account bill or invite managers. |
| **Manage cards** | Review assigned cards, request a card for an eligible holder, or change allowed controls as individually selected. | Spending, repayment, full statements or issuing-provider approval. |
| **View shared spending** | Read specifically shared activity, totals and corresponding reports. | Change controls, move money or see unrelated Personal accounts. |
| **Manage repayments** | Review and manage the specified bill/payment instructions when supported and separately authorized. | Use a card, choose another person's bank mandate or take collection funds. AutoPay setup remains its own action. |
| **Help with collections** | Prepare/use assigned collection tools according to explicit channel permissions. | Host card access, gateway secrets, payout/refund authority or onward delegation by default. |
| **Manage merchant services** | Manage permitted connected collection accounts, staff access and supported gateway setup. | See host statements, approve consumer credit, issue host cards or bypass payment-readiness checks. |

For any action, recheck the actor, exact target, current grant/dependency, product eligibility, parent restrictions and operation state. A control command also requires enough read access to review its target. Revocation must remove current operation and replay access; it must not erase legitimate historical financial events. Money and available capacity remain server-owned exact values. No numerical cap is invented to distinguish the account tiers.

## Concrete screens and language

**Personal:** account selector → **Cards** → selected card with nickname, holder, masked ending, status and only permitted controls. Activity opens with that card's context. **Get paid** stays a small separate service; it never shares Personal card history with a connected Merchant.

**Household:** account selector → **Cards** with **My cards / Shared cards** filters, visible only where useful and permitted. A cardholder sees their own spending; a manager can choose a named person/card and view the period, current limit and parent restriction. One **Add card** button starts the same saved request used elsewhere. Review identifies the holder, responsible funding account, requested controls, required approver and next step. A pending review is never rendered as an issued card. This is an Etail proposal informed by C01, C03, C08 and C09 above.

**Merchant:** account selector → **Merchant services** → **Connected accounts**, **Payment channels**, **People & access**, **Gateway setup**. A Personal/Household member opens only the collection service they are entitled to use. An outside helper sees a limited collection page with the responsible Merchant named; no inaccessible host account sidebar or financial data is loaded. Card management does not become a gateway function.

| Avoid in everyday UI | Prefer |
|---|---|
| Entitlement / capability | What you can do / Permission |
| Principal / actor | Person / Requested by |
| Scope / resource | This account / This card / This collection account |
| Grant lineage | Who shared this access |
| Host / sponsored unit | Personal or Household account / Connected collection account |
| MASTER/SUB IDs as the main customer label | Responsible Merchant / Collection account; show MID details only in setup |
| Facility / backing in a card control dialog | Funding account / Funds available, with exact server explanation |
| Effective restriction intersection | Why this card is unavailable |
| Payfac approval | Payment setup status; use payment-facilitator terminology only where an operator needs it |

Keep **limit**, **available funds**, **amount due**, **pending payment** and **collection balance** distinct. A configured limit is not money available. A filtered history report is not an official bill. The current sandbox continues to label historical reports as fictional/nonbilling and keeps real repayment, card issuance and payment processing unavailable until their own lifecycle is implemented.

For a freeze, confirm the exact card and actual effect, then show the result and any continuing account restriction. Do not copy Amex's seven-day automatic unfreeze into Etail. For a future repayment, distinguish **Scheduled**, **Processing**, **Paid** and **Returned**, and show the next due obligation from authoritative state. These are proposed Etail labels, not a claim that the current application processes money.

## Design checks before implementation is called complete

- Same cardholder in two contexts sees only the authorized card and records; changing a URL, search, export or statement ID cannot reveal another account.
- Household card manager without spending or payer permission can perform only reviewed management tasks. Cardholder without shared-view permission cannot see Household totals.
- A Merchant operator and outside collection helper remain denied host card/statement/payment endpoints, even after accepting a collection invitation.
- A holder cannot remove a Household/guardian freeze or create funding by editing a limit. Late legitimate posting still follows reconciliation.
- Add card has one draft, review and command owner; stale review and lost-response retry preserve a single request. Both additional-card consent and issuer approval remain explicit.
- Saved repayment settings never show a bill as paid; no future schedule or payment button is enabled before the provider/ledger/mandate prerequisites exist.
- Account, selected card/collection account, tab and return path survive reload/back only while currently authorized; keyboard focus, labels and 320-pixel layout remain usable.

These checks are a proposed acceptance set, **not executed tests**. The source refresh does not measure a similarity percentage or prove Amex-equivalent issuing, acquiring, risk, financial or regulatory operation.
