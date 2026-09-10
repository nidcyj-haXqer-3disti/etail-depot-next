# Operations, economics and partners — required later milestones

These remain part of the complete build. A simplified member interface is not permission to remove them; implement them behind scoped operator/partner entry points using the same financial commands and account policy.

## Operations and cases

Implement a small coherent operator console with queues for onboarding requirements, payment/issuing exceptions, disputes, payouts, reconciliation, worker failures and support. Cases have lifecycle/status transition guards, owner/assignment, SLA deadlines, waiting states, escalation, resolution/reopen and immutable history. Customer messages/attachments are separate from internal notes. Searching/exporting cases requires the same account/partner/privacy restrictions as detail views.

Maintain source-mapped service catalog/offerings, activation requirements, lifecycle playbooks and capabilities. The catalog is operational metadata, not a second generic transaction engine. A playbook points to canonical commands; it cannot bypass their controls.

Privileged actions require explicit permissions and reason codes; high-value/setting changes can require independent two-person approval. Bind approvals to payload digest, resource/account, requester and policy version. No direct edit of settled payments, credited rewards, posted journals or completed payouts. Use adjustment/reversal commands. Support cannot silently become finance/admin.

## Cost/economics engine

Import the original management workbook with formula/row provenance. Store driver definitions, plan quantities, rate-card versions, cost-center/vendor/service dimensions, enabled state, active basis, effective dates and actual values. There are Planning, Contracted and Actual bases; no silent fallback between them. Distinguish missing, zero, disabled and not applicable.

Annual modeled line cost is quantity × applicable rate with source-preserved unit/rate basis conversion. Roll up by plan, engine, center, value stream, cost group, account context, service, vendor and period. Show enabled count, missing count, basis counts and completeness. Disabled future capacity rows contribute nothing until explicitly enabled. Retain model version, approval/locking, sensitivity scenarios and comparison; no editing a previously approved source version in place.

Reproduce the supplied $100,000-sales fixture and within-cent operating-cost/contribution values. Do not set an “adjustment” equal to the difference solely to force a regression. If source extraction/formula dependencies conflict, report exact workbook/sheet/cell and resolve against the original master. Planning costs are not actual supplier invoices and missing contracted rates are not confirmed free services.

## Partner programs

Required models: Direct, Referral/distribution, Wholesale reseller, Embedded/co-branded. Program records state brand, billing/onboarding/support/risk/reward/pricing ownership; available plans/services; jurisdiction/customer scope; membership and PayFac pricing; revenue-share basis, commissions/minimums, settlement/statement schedule, API scopes, webhook endpoints, effective dates and approval history.

Explicit revenue-share bases distinguish membership fee, gross provider fee, net provider fee after processor costs, gross issuer income, net issuer income received by platform, per-active-member/Seller fees, fixed implementation and support fees. Customer, partner and platform economics are separate views on the same activity—never independent copies that double count costs.

Portal: onboarding/due-diligence checklist, program settings, brand preview, authorized customer list/onboarding status, economics, monthly statement/invoice/amount due, cases, API keys, outbound webhook subscriptions, bounded partner simulation and CSV export. Keys cannot access another program/partner/member/operator scope. Show secrets once, store hashes, expire/revoke, and test signed webhook replay/SSRF defenses.

## Worker families

Separate simulation event completion from calendar jobs: membership renewal/bonus posting, monthly base cashback, Seller daily repayment, allowances/recurring mock payments, invoice reminders and partner statements. Every scheduled effect has an idempotent period/account identity and injectable clock tests. No later period resets a past liability or re-credits a reward. Bounded retries and dead-letter UI make failure visible.

## Final acceptance

A customer creates a case and sees only customer-visible notes; an authorized operator resolves/reopens it with history. A finance operator changes cost basis and sees missing-rate completeness and correct source regression. A partner operator views only its program/customer economics, creates a scoped key, receives a signed test event and downloads a matching statement. Every relevant journal reconciles. These must be working flows, not static console screenshots.
