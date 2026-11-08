# UX contract: one context, one task, one workflow — historical specification

> **Superseded for active experience design — 11 September 2026.** Use [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) for the current journeys, scope and acceptance sequence. The retained text describes earlier design stages. References to account compatibility routes, legacy scopes and the earlier 90% target do not govern new work.
>
> Keep the documented privacy, financial meaning and accessibility obligations where they remain compatible with the current design. Proposed tasks and historical screenshots are not evidence that the current customer can complete them.

Earlier design references: [Service dashboard design](SERVICE_DASHBOARD_DESIGN.md) and [two-service privacy rules](TWO_SERVICE_DESIGN.md).

**Historical target UX requirements with a local implementation.** At this document's assessment, the application used direct Cardholder and Merchant dashboards, independent access and canonical card/channel workflows. Local test gateways and financial practice commands were implemented; real provider MIDs, public checkout and external delivery remained unavailable. [Earlier evidence](SERVICE_DASHBOARD_EVIDENCE.md) distinguishes that stage's executed behavior from the broader requirements below.

## Goal
The customer should understand which card or merchant they are using, what the relevant money amounts mean, who can act, and what happens next—without understanding internal financial containers or provider choreography. Passing tests is not proof of ease of use; include user acceptance.

## Information architecture

Persistent service navigation opens **Cardholder services** or **Merchant services**. Cardholder services opens directly on cards and primary/secondary relationships; Merchant services opens on collections and permitted primary/submerchant work. Selections, reviews and confirmations name the exact card/holder or merchant. Persist only validated resource selections; revoked or missing selection must not jump to another resource. Existing financial scopes remain server-owned provenance, not account-type choices.

The current Cardholder dashboard exposes cards, recent activity, saved requests and primary-only secondary-cardholder review. Exact card/request/transaction links reuse the existing components and commands. Reports, settings, support and People compatibility tasks keep their actual stored scope; a global cardholder review does not silently grant or revoke access across every legacy scope. Membership/rewards can retain person-level attribution without inventing another service or financial balance.

A primary cardholder sees permitted connected cards; a secondary sees only their own cards and card-linked activity, never primary totals or other holders' data. Merchant access and Cardholder access remain independent. Operator/partner entry points and projections remain separately authorized. No screen combines unrelated obligations or permissions into an ambiguous wallet.

## Merchant context and access

Merchant overview has a compact selector for all permitted work, an authorized primary network or one merchant. It retains merchant identity, responsibility, readiness and restricted metrics. A submerchant displays its responsible primary without exposing that primary's or siblings' private records. Show an external MID only after provider assignment; internal IDs remain internal identifiers.

`/merchant-services` opens the dashboard; `/merchants/{merchantId}?tab=...` opens the exact permitted merchant. Current destinations are **Payment channels**, **Payments** or **Payments & payouts**, **People & access**, and **Payment setup**, filtered by capability. Existing account URLs remain compatibility routes through the same authorization and commands; they are not prerequisite navigation. Outside helpers use their permitted merchant view without joining a financial account. Search and recent lists disclose their bounds.

Inviting a named merchant user uses the existing intended-recipient invitation lifecycle with an exact merchant target. Review states the merchant, responsible primary, actions, expiry and any recorded membership dependency. Acceptance grants merchant access only and lands in that merchant's permitted tasks; decline, expiry and revocation preserve that boundary. Cardholder invitations separately identify their primary relationship and permitted own-card tasks.

Empty states distinguish no merchant, a relationship awaiting consent, missing verification/payment setup, no channels and no permission. The current creation flow can create multiple named submerchants with the same controller under one responsible primary; separately authorized connections remain possible. Display the named responsible primary and actual missing requirements without inventing an external MID or funds destination. Merchant readiness and commercial spending readiness remain separate.

## One payment-channel and collection experience

One **New payment channel** form owns creation across all entry points: permitted merchant → purpose and one-time/reusable rules → amount/currency/expiry → presentation types → audience/access → review exact merchant and prerequisites → save Draft or activate when permitted. SMS/text, email, invoice/bill, social, QR and website links are presentations or distribution of the same underlying request/order. A receipt is a post-payment document, not an unpaid activation choice. Enter recipients at distribution time; do not require a recipient to create a reusable channel.

A collector without channel-creation permission sees **Use channel** on assigned active channels: choose channel → enter only permitted request details within server-provided limits → select an allowed distribution mode and recipient where needed → review merchant/payee, amount and message/document → create the canonical order and distribute → follow its separate delivery and payment states. Sending an existing invoice by email and SMS or showing its QR must reference the same payable obligation. Reusable channels create distinct orders for deliberate purchases.

Guest payers open a public opaque-token URL, separate from `/merchants/{merchantId}` management routes. Before payment, show the confirmed merchant of record/payee, support contact, amount/currency, purpose and applicable invoice remaining amount. Do not expose internal grants, master oversight, host-account records or private draft data. Expired, paused, closed and unavailable requests provide truthful outcomes without silently selecting another merchant or gateway. Payment submission has a review and durable result; a browser return, sent message or scanned QR cannot claim payment success. Display Pending while confirmation is unresolved; produce a receipt only from authoritative payment evidence. Guests need no platform membership.

Channel, delivery and payment statuses remain visibly distinct. Unknown dispatch/payment results support retry or reconciliation of the same operation identity. Back/Forward, reload, revoked access and support links preserve only valid context. Stored draft visibility and history are preserved, with responsible-primary oversight under the current policy; a migration never implies public publication or external delivery.

## Single card flow

All Add card entry links lead to the same saved request route and component. Use one name: **card**. Do not use “spending access”, “credential”, “test card engine”, “guided mode”, “classic mode”, “advanced application” as alternate products. Internal opaque provider tokens are not a customer concept.

Use a short stepper, server-supplied prerequisites, saved progress, review screen and the actual durable result. Pending is appropriate only while an operation remains pending. A help tip may explain collateral; it does not create a second funding or issuing form. Optional settings expand in the same form. Card management keeps supported controls and activity together; future Limits and Replace must use the same permission-aware task structure when implemented.

Do not embed a complete older screen inside `<details>`. Do not implement `GuidedPlatform extends Platform`. Shared primitives and feature components compose normally. The uniqueness test should inspect route-to-command/form ownership and public UI paths, not only grep a button label.

## Money language

| Internal meaning | Clear label | Avoid |
|---|---|---|
| Consumer refundable collateral | Refundable security deposit (collateral), with explanation | Wallet cash available for withdrawal |
| Consumer usable capacity | Available to spend | Account balance with no definition |
| Issuing obligation | Purchases to repay | Funds remaining |
| Pending approved exposure | Pending purchases / reserved amount | Completed expense |
| Settled eligible merchant payable | Available for payout | All sales including pending/reserved amounts |
| Supervised funded amount | Available funded balance | Credit limit / repayment due |
| Provider processing fee | Provider fee, shown separately from brand costs | Interchange when not actually interchange |

Example explanation: “Your $100 security deposit still backs this account. You have $10 in purchases to repay and $90 available to spend.” A single purchase page should not suggest that the collateral itself fell to $90.

## Feedback and recovery

Action success states name the action/account and result, not “Account request svg”. Inline form validation names the field and leaves values intact. Technical reference IDs are expandable support details; plain-language recovery is primary. Distinguish blocked prerequisite, declined transaction, temporary service issue, expired session and permission denial. Never convert an error payload into a green success toast.

Disable repeated submission while pending but rely on server uniqueness, not the button state, for correctness. Refresh/poll a durable result. A reload or back button must not repeat a payment. Long provider work shows truthful Pending and a status link; customers are not told to finish manual clearing.

## Visual system

Use provided `assets/brand/logo.png` and `symbol.png`, preserving aspect ratios and transparent background. Establish a small typography/spacing/control token set using system or properly licensed web fonts obtained during implementation. No font binaries are included in this handoff. Use teal/dark brand tones from supplied assets with contrast-tested text. Do not copy Amex trademarks, card artwork, marketing claims or layout wholesale.

Use intentional whitespace, short headings, restrained cards, readable forms, clear tabs and zero horizontal scroll at 320px. Optimize first-use and returning-member paths separately via the same state/projection, not competing implementations. Avoid giant landing-page tutorials on every authenticated screen.

## Accessibility and mobile

Target WCAG 2.2 AA patterns; test accessible names, focus order, form errors, contrast, zoom/reflow, dialog focus trap/return, reduced motion, screen-reader status changes and touch targets. Automated tools complement manual keyboard and assistive checks; do not claim certification. Navigation and confirmation must work at mobile widths and on a real production framework build.

## User acceptance tasks

Without coaching: open the intended service; identify the selected card/holder or merchant; add a card for an eligible holder; identify who may spend; change a supported control; make one practice purchase and find its persisted result; invite read-only card access without granting spend; select the intended primary/submerchant; invite an outside collector without sharing Cardholder data. Future acceptance tasks additionally cover collateral/obligation explanations, permitted limit changes, guest checkout, external delivery and settlement availability when those capabilities exist. Record actual observations, misunderstandings and recovery—not invented time/percentage improvements. Target tasks do not establish current capability.

## American Express research boundary

American Express is the primary reference for task structure, account controls, issuing, consumer servicing, merchant operations and management depth. The user requested 90%+ similarity on 2026-09-08. Use [the detailed research](research/amex/README.md) and [comparison catalog](research/amex/COMPARISON_CATALOG.md) to assess outcome, role/data scope, interaction/navigation, status/recovery and desktop/mobile/accessibility. The proposed score requires actual implementation evidence; no private Amex architecture, pixel-copying or regulated-product equivalence is inferred. Retain original Etail branding and the product's explicit economic/privacy rules.
