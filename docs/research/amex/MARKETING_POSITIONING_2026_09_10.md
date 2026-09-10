# Amex marketing reference for Etail

Research date: **10 September 2026**. Scope: current public US consumer and small-business pages. Publication dates are generally unstated. This supplements [the dashboard-role research](CARDHOLDER_DASHBOARD_ROLES.md); it does not import Amex’s private architecture or validate product-market fit.

## What Amex actually sells

**Documented:** The [Additional Cards page](https://www.americanexpress.com/en-us/benefits/additional-card/learn-more/) leads with sharing membership, then explains three benefits: combining eligible rewards, easier oversight and convenience for another person. It provides separate actions for adding a card and confirming one already received, repeats the addition action after explaining benefits, and later addresses the additional holder directly. This is a relationship proposition before it is a feature catalogue.

**Documented:** The [Employee Cards page](https://www.americanexpress.com/en-us/business/employee-credit-cards/) connects employee autonomy with employer control. Concrete proof follows: individual spending limits, alerts, pause/resume and per-employee activity. A separate [employee welcome page](https://www.americanexpress.com/en-us/business/employee-credit-cards/welcome/) speaks to the recipient’s own experience rather than treating them only as someone the business monitors. Benefits and restrictions vary by product; Amex’s limit is not a guarantee of purchase approval.

**Documented:** The [Additional Card FAQ](https://www.americanexpress.com/en-us/support/additional-card-member/faqs/) explains separate logins, itemized spending and Basic-member responsibility. Additional holders see their own purchases **and the total account balance**. Etail’s own-only secondary privacy is deliberately stricter. “Family” does not establish a separate family account tier, and a card does not establish merchant collection authority.

## Screen and layout evidence

The following public screens were personally captured and visually inspected in a new, unsigned-in browser. These are marketing pages, not signed-in dashboards.

| Observed screen | Actual visible structure | Etail design implication — recommendation |
|---|---|---|
| Additional Cards, 1440 px | White global navigation; sign-in separate from product exploration. Wide photograph of two adults together, left-aligned benefit headline and explanation, filled primary action and secondary confirmation action. Three pale benefit panels with blue outline icons follow. | Show people and the reason to share a card before showing administration. Pair one primary action with a clearly different returning-user action. |
| Additional Cards, 390 px | Compact menu, brand, search and login header. Centered headline and description above two wide stacked actions; the people photograph remains prominent underneath. | Keep the proposition and action legible on mobile; do not squeeze a desktop dashboard illustration into the hero. |
| Employee Cards, 1440 px | A large workplace photograph dominates the opening. A broad blue panel contains the headline and a short employee-benefit/employer-control explanation. | Use a concrete team situation and explain what each side gains; avoid generic claims about “clarity” alone. |

Sources: [Additional Cards](https://www.americanexpress.com/en-us/benefits/additional-card/learn-more/), [Employee Cards](https://www.americanexpress.com/en-us/business/employee-credit-cards/). Local screenshots and read-only capture receipts are in `artifacts/amex-marketing-research/`. The first Additional screenshot had unfinished imagery; the `*-loaded.png` captures are the useful references. No image assets are proposed for copying into Etail.

The [US homepage](https://www.americanexpress.com/en-us/) exposes product-oriented navigation, a distinct login and contextual exploration actions. The [card catalogue](https://www.americanexpress.com/us/credit-cards/) returned no readable body through the web reader; no current catalogue arrangement or offer is inferred from that result. Homepage and catalogue captures still showed loading indicators; their unfinished areas are not design evidence. These observations do not prove conversion performance.

## Recommended Etail positioning

**Hero:** “Cards for your people. More ways to get paid.”

**Supporting copy:** “Give family, teammates and trusted helpers a card of their own. Separately share the payment tools they need—by text, email, invoice, QR code and more—while keeping each person’s access clear.”

Keep **Sandbox** and “Try it with demo people and money. No real payments are made” beside the action. This describes a demonstrable experience, not an available live financial product.

**Navigation:** Cards for your people · Get paid together · How it works · Help. Keep Sign in separate. **Primary CTA:** Try the experience. **Secondary CTA:** See how sharing works. Product actions inside the signed-in app retain their actual names.

| Audience job — proposed, not validated demand | Explain the value | Show working proof |
|---|---|---|
| Adult family member running an errand | Give them their own card; review spending without sharing a login. | Primary invites → recipient accepts → primary adds a card; each sees the appropriate activity. |
| Teammate buying supplies | Let the named person make purchases while the primary retains oversight. | Starting sandbox balance, purchase, remaining funds and freeze confirmation. |
| Trusted helper collecting for a store, stall or event | Share a collection workspace for their assigned merchant. | Separate merchant invitation, channel creation and permitted payment history. |
| Person who needs both | One login can hold a card and separately help a merchant collect. | Two independent service views; no automatic sharing of card data or collection authority. |

Follow the hero with these situations, then concrete controls, then the seven collection presentations: text/SMS, email, invoice, bill, social, QR and website link. Explain the recipient’s experience as well as the primary’s. A bill/invoice preview requests payment; a receipt records a completed sandbox payment.

## Claim boundaries

- Current card eligibility is adult demo users only. Do not promise children’s cards or a working guardian programme.
- No live issuance, usable external card numbers, physical delivery, credit building, borrowing or real-money processing.
- Do not borrow Amex fees, rewards, protection promises, numerical limits or acceptance claims. Etail’s starting sandbox balance is not Amex’s adjustable billing-period limit.
- Collection presentations are previews, not SMS/email delivery, social publishing, tax invoices or bank transfers. Payment setup and channel activation precede a simulated payment.
- Giving someone a card does not give them collection tools. Merchant access requires its own accepted invitation and permissions; refund/transfer authority is not automatic.
- Family/team examples are hypotheses to test with users. Neither visual resemblance nor this competitor comparison demonstrates product-market fit, conversion uplift or Amex endorsement.
