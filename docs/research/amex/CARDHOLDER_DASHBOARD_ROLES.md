# Cardholder dashboards and roles

Etail’s Cardholder service should open on cards and the people connected to them. A primary cardholder should immediately see the cards they manage; a secondary cardholder should immediately see their own cards. Selecting a legacy Personal, Household or Merchant container should not be the prerequisite for understanding or using this service.

This recommendation replaces the account-type-led card experience in [THREE_ACCOUNT_CARD_EXPERIENCE.md](THREE_ACCOUNT_CARD_EXPERIENCE.md) and the earlier account-selector recommendations in [FRONTEND_EXPERIENCE.md](FRONTEND_EXPERIENCE.md). Those documents remain historical research. It does not require deleting existing records, merging financial obligations or inferring new authority from a renamed screen.

## Evidence and limits

The official pages below were refreshed on **9 September 2026**. Five publicly published interface illustrations were also visually inspected: the US app product selector, US transaction detail, US corporate Card Profile, US corporate access editor, and Canadian freeze control. These are publisher-provided examples, not authenticated accounts or an exercised production Amex session. Most have no publication date. A date or amount inside a sample screen does not establish its release date.

The consumer, small-business and corporate programs must remain distinguishable. An Amex Basic Card Member, an Additional Card Member, an Account Manager and an @ Work administrator are not interchangeable roles. No public source establishes Amex’s entire private permission model or architecture. Exact current Additional-user dashboard layout was not independently verified; its visibility rules are documented in the official FAQ. The proposed Etail screens below are recommendations, not claims that they already exist or that an Amex-similarity percentage has been measured.

| Evidence label | Meaning |
|---|---|
| **Documented** | Current public official text states the task, relationship or restriction. |
| **Observed illustration** | A specific published screen image was opened and visually inspected during this refresh. Interaction, loading and error behavior are not thereby proven. |
| **Historical walkthrough** | A dated independent video or prior observation helps explain a former interface; it does not establish current entitlements. |
| **Etail recommendation** | A design choice for the two-service product and its stricter privacy requirements. |

## The relationship model supported by Amex

The US Additional Card FAQ describes a separate login and card number for the additional holder. The Basic member can inspect itemized spending across connected cards and remains responsible for their charges. The Additional member can inspect their own purchases and the total account balance; other account information is restricted unless separate Account Manager access is granted. **Etail deliberately goes further: secondary cardholders must not receive primary totals or other holders’ records.**[^D01]

An Account Manager uses a separate login for delegated tasks. Amex’s Limited option includes payments, statements, activity and disputes; Full adds listed card-management and reward functions. Therefore, “Limited” cannot be mapped to Etail’s read-only permission, and an Additional card must not automatically confer management access.[^D03]

Small-business Employee Cards provide an oversight reference: per-employee activity, configurable limits, pause/resume and alerts. The published terms distinguish a configured limit from actual ability to spend, and qualify transaction exceptions. These are useful control-design lessons, not authorization to import Amex’s credit, age, fee or numerical-limit rules.[^D04]

Corporate @ Work separates the Program Owner, the designated Main Program Administrator and other Program Administrators. Its Access Center restricts administration of administrators to designated MPAs and organizes authorizations by the permitted program geography. A company operator’s authority is thus separate from an employee’s own card use.[^D06]

| Person or relationship | Amex reference | Recommended Etail interpretation |
|---|---|---|
| Primary cardholder | Basic member oversight of connected additional cards. | Named person responsible for this Cardholder relationship. Show all cards and card activity within that actual responsibility, subject to current grants. |
| Secondary cardholder | Additional member’s separate identity and own purchases. | Own cards, own available practice funds, own activity, own reports and own support context only. Do not expose a parent total. |
| Person helping administer cards | Separately appointed Account Manager; corporate administration is another program. | Explicit card-service permissions. Helping with cards does not create purchase authority or any Merchant role. |
| Employee cardholder | Employee Card and corporate Card Member are product-specific roles. | A card can belong to a named secondary holder without giving them authority over others. Avoid labeling every shared card as a corporate card. |
| Merchant operator | A separate commercial service, not consumer additional-card authority. | Separate navigation and grants. Changing Cardholder access must preserve independent Merchant access and obligations. |

The table’s Etail column is a product recommendation. It does not assign legal payment liability through presentation copy. Any future real product would need its own contracts and approval lifecycle.

## What the published screens actually show

### Consumer app selector and card recognition

The US app hero shows a phone with a highlights entry and compact product rows. Card thumbnails, masked endings and short labels distinguish two cards; checking and savings occupy separate groups. **This is a product selector, not a diagram of Basic and Additional holders.** The surrounding tour documents swipe-based product switching, freeze entry from Home or Account, and search spanning transactions, help and support.[^D02]

![Official US app product selector](https://www.americanexpress.com/content/dam/amex/en-us/support/digital/amex-mobile-app/Amex--Mobile-app-refresh/amex-app-hero.png)

**Etail recommendation:** preserve immediate card recognition, but remove the old product-container tile wall. Put the selected card or primary relationship inside a working Cardholder dashboard. A change of selected card must update activity and controls together. The screen should not offer a Personal/Household/Merchant choice as if those were three kinds of cardholder responsibility.

### Transaction detail

The US Send & Split illustration has a back affordance, masked card context, merchant/title, prominent amount, date, status and a short explanation. Its contextual action sits below this summary. The example contains a November 2025 date; the image’s publication date is unstated. It depicts an eligible consumer feature, not a permission available to every card product or Additional holder.[^D13]

![Official US transaction-detail illustration](https://www.americanexpress.com/content/dam/amex/en-us/services/send-and-split/img-ux-split-1.png)

**Etail recommendation:** activity should open into a focused detail view with the same card and holder context. The primary may change the holder filter before opening a row; a secondary cannot discover other holders through filters, URLs, search or exports. A relevant support action belongs in the detail view. Do not add a splitting or repayment button merely because it appears in the reference.

### Focused card control

The Canadian freeze illustration keeps a back action, masked card context, help entry and card image above a prominent switch. The visible text explains the temporary state and automatic-unfreeze behavior. This is explicitly Canadian guidance; the sample is undated, and its timing is not an Etail rule.[^D12]

![Official Canadian freeze-control illustration](https://www.americanexpress.com/content/dam/amex/ca/en/customer-service/digital/App-Feature-Tutorials/Freeze-your-Card/R.png)

**Etail recommendation:** open controls from the selected card. Confirm the cardholder, card ending and actual effect, then show the returned state. A secondary can act on their own card only where permitted. Frozen state, access revocation and closing a card are distinct. A control must not appear successful before the server accepts it, and a retry must resolve the same operation.

### Corporate card profile

The US @ Work Card Profile illustration shows persistent program navigation and search, then the employee’s identity, masked card and status. Payment information and balance information occupy adjacent panels; relevant actions sit at the bottom of each. The displayed example period is in 2023. Current public enhancement text describes combined transaction/statement access and reorganized card-management tasks, but still uses rollout language.[^D05]

![Official US corporate card-profile illustration](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/uplifted-card-profile/Picture1.png)

**Etail recommendation:** a connected secondary-card row should open a useful cardholder profile with their permitted cards and activity. It should not send the primary through unrelated container settings. Copy the information hierarchy, not the corporate financial metrics: current sandbox funds belong beside the card; an official bill, credit exposure and live payment actions must not be fabricated.

### Corporate permission editor

The Access Center illustration shows a person and active status above a tabbed profile. The selected authorization tab contains a country selector, grouped checkboxes, explanatory space and separated cancel/save controls. Another tab exposes history; navigation back to the user list remains visible. Some illustration content is intentionally placeholder text. This is an administrator profile, not an Additional-holder dashboard.[^D06]

![Official US administrator authorization illustration](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/atwork-access-center/Screen3.png)

**Etail recommendation:** keep the named recipient, current card access, exact allowed tasks and change history together. Permission review should explicitly say it affects Cardholder access only. Never show Merchant grants in this editor, never change the shared Merchant role indirectly, and never treat a saved invitation as an accepted relationship.

## A service-first Cardholder dashboard

The following layout is a proposed Etail design, informed by the references rather than a reproduction of any single Amex screen.

### Primary experience

The heading is **Cardholder services**. Lead with a brief responsibility statement and the primary person’s own card or cards, with current server-projected practice funds and status. Directly below, **Secondary cards** shows connected holders and cards as usable rows: holder name, card nickname, ending, state, and the permitted next action. Distinguish two cards held by the same person; a name alone is not a sufficient card identifier.

Place **Add card** beside this card-management surface. A nearby **Invitations & requests** area exposes saved drafts, pending invitations, blocked prerequisites and the next actor. It should not compete with a second creation flow. **Recent activity** includes a holder/card filter and links to complete activity. Useful attention items include a frozen card, a saved request, an invitation awaiting acceptance, or access that needs review. Do not invent credit-risk alerts from sample data.

| Primary dashboard area | Information | Connected action |
|---|---|---|
| Your cards | Recognizable art, masked ending, active/frozen state, available practice funds when supported. | Open card, review activity, permitted card controls. |
| Secondary cards | Named holder and exact card; current state and funds within the primary’s authorized responsibility. | Open that holder/card profile; filter its activity. |
| Invitations & requests | Recipient/holder, status, saved time, missing requirement or next actor. | Resume existing draft, review invitation, resolve a supported pending task. |
| Recent activity | Explicit card/holder attribution, amount, date and posting state. | Open transaction; preserve filter and return path. |
| Cardholder access | Current accepted people, permitted tasks, invitation state and change history. | Invite, edit or revoke only within this Cardholder service. |

A person can be primary in more than one existing responsibility context, and secondary in another. Show those relationships accurately without recreating legacy account-type categories. If selecting a responsibility context is necessary for an action, place the selector inside that task and label it with recognizable cards and the named relationship. Do not sum unrelated obligations or choose a funding source simply because two records appear on one dashboard.

The current named-primary service binding is a relationship with people and cards. It is not necessarily a stored physical parent-card link. If several cards belong to the primary, the UI must not arbitrarily claim that all secondary cards descend from whichever primary card happened to be first in a query. Either present the named primary’s connected cards together, or establish an explicit parent-card relationship before showing a literal card-to-card tree.

### Secondary experience

The same service opens directly on **Your cards** and **Your activity**. One card can open as the initial selected card; multiple permitted own cards need a compact card selector. The secondary sees their own status and available practice funds, plus only those controls actually authorized. There is no primary total, other-holder list, card-administration navigation, or account-type tile wall.

An unavailable card is not replaced with someone else’s default card. If access was revoked, clear the selected card and cached detail, explain that Cardholder access is unavailable, and retain a route to the person’s other authorized service. Independent Merchant access remains available. A pending invitation supplies the recipient’s review step without exposing card data before acceptance.

### Navigation and responsive behavior

Use a stable service navigation such as **Overview**, **Cards**, **Activity**, **Statements & reports**, and **Help**. Primary-only access administration can sit beside the connected-card list and in a clearly named **Cardholder access** destination. The secondary navigation omits it. A separate service switch returns to Merchant services; Merchant balances, settlements and disputes are absent from the Cardholder shell.

On a small screen, keep selected card identity and the next useful action above secondary information. A filter can collapse to a sheet, but its current value must remain visible. A primary’s connected-card list should remain a readable list, not a miniature desktop administration table. Search must distinguish task results from transaction results and preserve the selected permitted context.

## Connected task sequences

Amex’s corporate guides are especially useful for task continuity: search leads to a card profile; actions have tracking/history; application completion is distinct from company review and issuer approval.[^D07][^D10][^D11] Etail can adopt that clarity without importing corporate programs or requiring a second card workflow.

| Journey | Recommended sequence | Required boundary or recovery |
|---|---|---|
| Primary reviews a secondary card | Dashboard → named card row → card/holder detail → own attributed transactions or controls → return to the same selection. | Authorize the exact current relationship; never infer visibility from Merchant management. |
| Primary adds a card | Existing Add card → choose eligible self or accepted secondary holder → card details and practice allocation → review → existing submit command → issued sandbox card or explicit unmet prerequisite. | One saved request and one issuance effect. Invitation acceptance and card creation remain separate. |
| Person accepts card access | Named invitation inbox → review primary relationship and permitted tasks → accept/decline → appropriate own-card view. | Recipient-only response; saved invite confers no access. Acceptance cannot revive a separately revoked shared membership. |
| Primary changes access | Named holder profile → current card-only tasks → proposed change → confirm → updated service state/history. | Independent card-access version; stale change requires refresh. Preserve Merchant membership/grants. |
| Secondary uses card controls | Own card → permitted freeze/unfreeze → review card/effect → returned state. | Cannot use a guessed other-card ID, nor remove an unsupported higher-level restriction. |
| Secondary tries a sandbox purchase | Own funded card → exact amount/description → submit → resulting purchase and remaining practice funds. | Current holder, explicit purchase permission, active card and sufficient funds checked atomically; unknown result retries the same command. |
| Activity investigation | Permitted activity → search/date/status/card selection → row detail → support if needed → back to unchanged filter. | Primary-only rows cannot leak through search hints, detail routes, support links or downloads. |
| Statements and reports | Choose period and permitted card(s) → preview itemized records → download or save named filters. | Distinguish activity reports from an official bill; rerun saved filters against current authorization. |
| Revoked or suspended access | Refresh or next protected request → clear old card data → explain current access → other authorized service or intended-recipient inbox. | Do not substitute a different holder’s card or retain old report data. Historical records remain stored. |

The Amex statement help distinguishes sortable/downloadable transaction history from period statement PDFs. AutoPay enrollment is restricted to the Basic member and does not necessarily cover the current cycle.[^D08][^D09] These references reinforce separate activity, statement, payment and payment-setting states. Etail’s present historical report must remain labeled nonbilling; a future payment feature must not be represented by a working-looking button before it exists.

## Historical video cross-check

The [Magnified Money tutorial](https://www.youtube.com/watch?v=3BsVlemlIa4) is a roughly fourteen-minute January 2022 walkthrough. **Actual footage was newly sampled at 0:57**, after playback loaded; the initial thumbnail was not counted as footage. It shows a selected card above balance and payment-due information, a payment action, pending transactions, a processing-payment row and persistent bottom navigation. The dark presentation is historical, not a current universal theme.[^D14]

Review [Home at 0:57](https://www.youtube.com/watch?v=3BsVlemlIa4&t=57s). [Account at 11:14](https://www.youtube.com/watch?v=3BsVlemlIa4&t=674s) is a previously sampled locator documented in [REVIEWER_WALKTHROUGHS.md](REVIEWER_WALKTHROUGHS.md), not newly verified footage. These examples support continuity of card context, not current Additional-user permissions or a completed payment.

## Acceptance criteria for the redesigned front door

These are proposed design and verification criteria, not a report of executed browser tests.

1. Opening Cardholder services presents cards and primary/secondary relationships without requiring a Personal, Household or Merchant choice.
2. A primary sees their own and connected secondary cards with unambiguous holder/card identity; a secondary receives only their own cards and data.
3. No inaccessible primary totals, card endings, identities, transactions, report figures or search suggestions occur in secondary server responses or rendered markup.
4. A card selection survives reload/back/forward only while authorized. Closing a detail restores the opener and its filters; revoked access clears it.
5. The dashboard contains one Add card entry into the canonical saved request. Pending invitations, saved requests and issued cards have distinct statuses and next steps.
6. A person who holds several cards remains distinguishable by card nickname/ending. The interface does not invent a physical parent-card relationship absent from authoritative data.
7. Cardholder permission edit/revoke/reinvite preserves independent Merchant membership, role, version, grants and membership-dependent access.
8. Practice funds, historical amounts, configured limits and any future amount due remain visibly distinct. Totals never broaden the permitted row set.
9. The primary can complete a connected-card task without detouring through a legacy container dashboard. The secondary has no irrelevant administration shell.
10. Keyboard, focus return, loading, empty results, denied access, stale versions and unknown-response retries work at 320 pixels as well as desktop.

## Sources

Unless stated otherwise, these are undated official pages refreshed on 9 September 2026. “Observed” describes public illustrations only. No source supplies Amex’s private architecture or a current full signed-in Additional-user session.

[^D01]: American Express US, [Additional Card Member FAQs](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/). **Documented**, US consumer Additional cards. Relevant sections: app login, Basic responsibility, itemized charges, account-information access and separate card number. No age, fee, count or credit rule is imported.
[^D02]: American Express US, [American Express Mobile App](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/). **Documented + observed illustration**. Image: [product selector](https://www.americanexpress.com/content/dam/amex/en-us/support/digital/amex-mobile-app/Amex--Mobile-app-refresh/amex-app-hero.png). Eligible US products; banking examples do not establish cardholder role hierarchy.
[^D03]: American Express US, [Account Manager options](https://www.americanexpress.com/us/credit-cards/features-benefits/account-management/account-manager.html). **Documented**, consumer/business comparison with product qualifications. Full/Limited are Amex delegation options, not Etail role definitions.
[^D04]: American Express US, [Employee credit cards](https://www.americanexpress.com/en-us/business/employee-credit-cards/). **Documented**, small-business Employee Cards. Oversight and control descriptions; no signed-in graphs inspected during this refresh.
[^D05]: American Express US, [@ Work digital enhancements](https://www.americanexpress.com/en-us/business/resource-center/atwork-digital-enhancements/index.html) and [Uplifted Card Profile](https://www.americanexpress.com/en-us/business/resource-center/uplifted-card-profile/). **Documented + observed illustration**: [Card Profile](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/uplifted-card-profile/Picture1.png). Corporate administrator example; sample dates in 2023, rollout completion not established.
[^D06]: American Express US, [@ Work Access Center](https://www.americanexpress.com/en-us/business/resource-center/atwork-access-center/index.html). **Documented + observed illustration**: [authorizations editor](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/atwork-access-center/Screen3.png). Corporate MPA/PA roles; not a consumer family-card permissions screen. The public guide separately qualifies reporting propagation, so this is not proof of uniform instantaneous revocation across Amex systems.
[^D07]: American Express US, [@ Work Guide](https://www.americanexpress.com/content/atwork/us/guide.html/1000). **Documented historical guide**, revision date unknown. Search, card-profile continuity and status tracking are useful patterns. Its older navigation and operational timing are not treated as current universal behavior.
[^D08]: American Express US, [Transaction history and billing statements](https://www.americanexpress.com/us/customer-service/faq.transaction-billing-statements-history.html). **Documented**; history export and statement retrieval are distinct. Retention and archive-delivery promises are not copied.
[^D09]: American Express US, [AutoPay enrollment](https://www.americanexpress.com/us/customer-service/faq.autopay.html). **Documented**; Basic-member authority and current-cycle caveat. No real repayment function is inferred for Etail.
[^D10]: American Express US, [Global Apply for Card: applicant FAQs](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-card-applicant/). **Documented**, corporate application save/resume, validation, review and submission. No identity questions, delivery deadlines or eligibility rules are adopted.
[^D11]: American Express US, [Global Apply for Card: Program Administrator FAQs](https://www.americanexpress.com/en-us/business/resource-center/card-management/faq-program-administrator/). **Documented**, authorized-control-account tracking and route-dependent review; market differences are explicit. A company approval is not issuer approval.
[^D12]: American Express Canada, [Amex App tutorials](https://www.americanexpress.com/en-ca/support/customer-service/digital/amex-mobile-app/index.shtml). **Documented + observed illustration**: [freeze control](https://www.americanexpress.com/content/dam/amex/ca/en/customer-service/digital/App-Feature-Tutorials/Freeze-your-Card/R.png). Regional, undated. Its automatic-unfreeze period is not an Etail rule.
[^D13]: American Express US, [Send & Split](https://www.americanexpress.com/en-us/services/send-and-split/). **Observed illustration**: [transaction detail](https://www.americanexpress.com/content/dam/amex/en-us/services/send-and-split/img-ux-split-1.png). Sample transaction dated November 2025. Used for detail-page hierarchy only, not universal feature eligibility.
[^D14]: Magnified Money, [American Express Mobile App Step-by-Step Tutorial](https://www.youtube.com/watch?v=3BsVlemlIa4). **Historical independent footage**, Home sampled at 57 seconds on 9 September 2026. Prior review records 13 January 2022, with a one-day search-index discrepancy. Affiliate-supported; not an official Amex permission contract.
