# Amex front-end experience: screens and interactions

> **Dated research evidence; earlier Etail design instructions superseded.** Use [Product and technical design](../../PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../../../planning/DELIVERY_PLAN.md) for the current model, scope and acceptance. The inspected Amex images and limitations below retain their original provenance; references to three Etail account types, the original 90% ambition and the next implementation step are historical, not active instructions.
>
> The current target is 100% of the retained public-workflow inventory, without any parity awarded by this research. Security, privacy, financial meaning, release approval and commercial obligations remain unchanged. Public illustrations are not verified current signed-in journeys or evidence that Etail implements them.

Inspected 2026-09-08. **Latest user correction: the target is Amex's front-end experience—what people see, where they click, and how the interface responds.** This is the current starting reference for interface work. Earlier business and technical studies remain supporting material.

The references below are official Amex screenshots and public tours. Root visually inspected 15 published images, including the US app hero within its public page. They are illustrations of the interface, not an exercised signed-in session. Image publication dates are generally unstated; examples can represent different releases. The Canadian and International Currency examples are labelled explicitly.

## The three interface families

| Experience | Visible organizing pattern | Etail front-end direction |
|---|---|---|
| Consumer/cardholder | Selected product, recognizable card, focused detail pages, short action lists and mobile navigation | Establish account/card context first, then put activity, payment and card controls where the person is already looking. |
| Company administrator: @ Work | Search-led home, program summaries, cardholder profile, task buttons, administration tabs and application status lists | Make people and cards findable; open a useful profile instead of sending every task through an unrelated settings page. |
| Merchant | Stable top navigation, section tabs, location/date filters, dense tables, expandable details and focused response forms | Make payments and disputes easy to inspect and act on while preserving the selected merchant and filters. |

These directions are design interpretations of the viewed screens. Etail keeps its own branding, three account types and product terms. The different Amex programs are not one interchangeable interface.

## Consumer/cardholder screens

**US transaction detail — visually inspected.** The page uses a back affordance and masked card context above the merchant description, a prominent amount, date, status and short status explanation. A relevant action appears within the transaction, before further detail. [Official Send & Split tour](https://www.americanexpress.com/en-us/services/send-and-split/).

![Official Amex US transaction detail screenshot](https://www.americanexpress.com/content/dam/amex/en-us/services/send-and-split/img-ux-split-1.png)

| Screen/reference | What was actually visible | Interaction evidence |
|---|---|---|
| [US product switcher](https://www.americanexpress.com/content/dam/amex/en-us/support/digital/amex-mobile-app/Amex--Mobile-app-refresh/amex-app-hero.png) | Product groups, compact rows with amount/name/masked identifier, card thumbnail, and a highlights entry | The [public app tour](https://www.americanexpress.com/en-us/support/digital/amex-mobile-app/) describes swiping between accounts. Hero visually viewed; full switching animation not watched. |
| [Canada Account menu](https://www.americanexpress.com/content/dam/amex/ca/en/customer-service/digital/App-Feature-Tutorials/Freeze-your-Card/A3.png) | Grouped icon-and-chevron rows for card servicing and settings; bottom navigation with the current section highlighted | The [Canadian tutorial](https://www.americanexpress.com/en-ca/support/customer-service/digital/amex-mobile-app/index.shtml) supplies the illustrated sequence. |
| [Canada freeze detail](https://www.americanexpress.com/content/dam/amex/ca/en/customer-service/digital/App-Feature-Tutorials/Freeze-your-Card/R.png) | Back action, card context, FAQ entry, card image, switch and immediate explanation of the displayed state | Published screenshot only; the Canadian automatic-unfreeze wording is not an Etail policy. |
| [Canada transaction detail](https://www.americanexpress.com/content/dam/amex/ca/en/customer-service/digital/App-Feature-Tutorials/Use-points-for-purchases/N.png) | Amount and date lead; the available points action sits in its own section | Supplementary regional example; visible sample transaction date is 2020, not proof of the current US layout. |
| [US login illustration](https://www.americanexpress.com/content/dam/amex/en-us/resources/make-a-payment/module1_phone_image2x-2.png) | Greeting, credentials, main sign-in button, biometric sign-in and recovery | Although linked from the [payment guide](https://www.americanexpress.com/en-us/resources/how-to-make-a-payment/), this image shows login, not the payment form. |

**Etail screen sequence to design:** account/card selection → selected-card overview → transaction list → transaction detail → relevant action and result. Card servicing uses a short menu → focused control/detail → visible changed state. This is a proposed front-end mapping, not a claim that all Amex controls were clicked.

## Administrator screens

**US @ Work Card Profile — visually inspected.** The identity/status area stays above the actions. Payment and account-balance summaries sit side by side, with actions placed beside the information they affect. The shell retains search and program navigation. [Official Card Profile guide](https://www.americanexpress.com/en-us/business/resource-center/uplifted-card-profile/).

![Official Amex US Card Profile screenshot](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/uplifted-card-profile/Picture1.png)

| Screen/reference | What was actually visible | Interaction evidence |
|---|---|---|
| [Refreshed @ Work home](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/atwork-digital-enhancements/refreshed-homepage.png) | Wide search near the top; program summary, payment-status and application panels; direct routes into work | [Official enhancement page](https://www.americanexpress.com/en-us/business/resource-center/atwork-digital-enhancements/index.html) describes a rollout. Universal availability is not established. |
| [User profile authorizations](https://www.americanexpress.com/content/dam/amex/en-us/business/resource-center/atwork-access-center/Screen3.png) | Person/status panel; tabs for details, accounts, authorizations and history; country selector; grouped permission checkboxes; separated cancel/save actions | Visually inspected illustration from the [Access Center guide](https://www.americanexpress.com/en-us/business/resource-center/atwork-access-center/index.html). |
| [International Currency application dashboard](https://www.americanexpress.com/content/dam/amex/en-iec/business/resource-centre/online-card-applications/global-apply-for-card-quick-start-guide/GAFC-image-2.png) | Country selector; three application-distribution panels; status counts at right; expandable access-key section below | Visually inspected; [IEC guide](https://www.americanexpress.com/en-iec/business/resource-centre/online-card-applications/global-apply-for-card-quick-start-guide/) describes application and approval paths. This is a distinct regional/program reference. |

**Etail screen sequence to design:** search/person list → person/card profile → contextual action → focused form → review/result. Applications need a visible status list and a resumable detail page. A profile's controls should not disappear into a separate general administration tool.

## Merchant screens

**US disputes list — visually inspected.** The shell preserves the main merchant sections. A left-hand list separates cases by stage; the selected view has merchant and amount/type filters, configuration/download controls, clickable case identifiers and a conspicuous expiry column. [Official disputes guide](https://www.americanexpress.com/us/merchant/support-center/disputes/disputes-summary-table.html).

![Official Amex US merchant disputes screenshot](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-disputes/us-disputes-summary-1.png)

| Screen/reference | What was actually visible | Interaction evidence |
|---|---|---|
| [Payments navigation](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-Payments/explore_default_view_payments.png) | Main merchant navigation, secondary payment tabs and an overflow menu | [Default-view guide](https://www.americanexpress.com/us/merchant/support-center/payments/explore-payments-default-view.html). |
| [Settlements table](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-Payments/viewing_settlements_a.png) | Search, location and date controls above the data; pending/posted groups; row disclosure arrows; download | [Settlement guide](https://www.americanexpress.com/us/merchant/support-center/payments/viewing-your-settlements.html) describes drilling into breakdowns and transactions. Static image viewed; expand/collapse behavior not exercised. |
| [Dispute response dialog](https://www.americanexpress.com/content/dam/amex/us/merchant/Support-Center-disputes/disputes-managingadisputecase-4.png) | Clear question, two radio choices, short explanatory text, close control, secondary cancel and primary continue | [Case guide](https://www.americanexpress.com/us/merchant/support-center/disputes/managing-a-disputes-case.html) explains how a case leads to the response. |
| [Bank-change first step](https://www.americanexpress.com/content/dam/amex/us/merchant/support-center-account-services/Bank-Step1-SingleMID.png) | Four-stage progress indicator, affected-account checkboxes, masked context, explanatory text and separated cancel/continue actions | [Bank-change guide](https://www.americanexpress.com/us/merchant/support-center/account-services/edit-bank-information.html) provides the subsequent steps. Only the first-step image was visually inspected here. |

**Etail screen sequence to design:** merchant overview → payment/dispute list → filtered results → expanded row or detail page → contextual form/dialog → confirmation and updated item. Preserve the location, dates and return path throughout.

## What to reproduce in the front end

For each chosen screen, compare the reference and Etail side by side: overall page structure; selected account/card/merchant context; navigation and active state; information hierarchy; controls and their placement; fields and steps; detail views; loading/empty/error/success feedback; desktop and mobile behavior.

The first useful deliverable is a connected visual prototype of the account/card overview, card servicing, administrator profile, merchant payments and dispute detail/response, using Etail branding and fictional data. It should allow the reviewer to click between these screens and judge the experience directly. The user's 90%+ target applies to this screen and interaction review; no similarity score is awarded by the source inventory.

## Still missing visual evidence

Current US consumer application/additional-card form interiors, ordinary payment-entry screens, live inline validation, loading/empty/error states and authenticated responsive behavior were not inspected. Public video captions and still frames are not a completed video walkthrough. The formal report/hierarchy and application-approval images located by the researchers were not visually inspected by root in this pass and are not counted among the 15.

No product interface was implemented or changed in this research pass. No Amex account was used. The reference images are linked to their official hosts; they are not copied into Etail assets or fixtures. Documentation links and changed paths are checked locally; application tests are not rerun for these documentation-only edits.
