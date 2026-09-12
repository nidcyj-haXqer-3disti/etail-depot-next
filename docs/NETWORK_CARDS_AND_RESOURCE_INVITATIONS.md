# D76 — Visa cards, recipient invitations and public card checkout

12 September 2026. The user approves the dashboard layout but corrects the product model and the journeys connecting people and payments. This contract supersedes the internal-Etail-only checkout and person-first card invitation decisions. Implementation and provider availability are separate facts, recorded in `planning/STATUS.md`.

## Product and preserved rules

Etail's intended issuing product is a Visa network card, funded from its owner's shared card balance. Merchant checkout accepts the networks supported by its acquiring provider; the customer does not need an Etail account. Etail is the program/application brand, not a separate card-acceptance network. Remove FAQ and marketing language that defines the product as usable only inside Etail.

Keep two services, the existing dashboard hierarchy, one card-money owner, one merchant with flat terminals, separate card and merchant balances, and total per-card allowances without monthly resets. Invited holders see only their own cards and records. Invited terminal users see only their assigned terminal records and operational tasks; money, refunds, withdrawals and access management remain owner-controlled. Invitation acceptance and card creation never mint funds.

The current repository has only deterministic sandbox issuing/acquiring adapters. No Visa issuer, external acquiring account or SMS/email delivery transport is configured in active code. `ENABLE_REAL_MONEY=false` stays enforced. The user has been asked which providers are available. Implement the complete sandbox interaction and provider boundaries while that answer is pending; do not describe fictional identifiers as live Visa credentials or copy/share actions as confirmed message delivery.

## Card journey

1. The owner creates a card with its name and total spending limit through the existing saved request, review and issuance command. Creating for another person requires no member code, prior service membership or recipient login.
2. The created card appears on its own page, awaiting a cardholder. The owner selects **Invite cardholder** there. Explicit own-card creation remains available; it does not create a second card type.
3. The invitation identifies the intended recipient by verified email (or a previously established exact person). Email, text, social sharing and copying carry the same invitation. SMS/social transport does not broaden who may accept it.
4. The recipient opens the link, signs in or creates and confirms their login, returns to the exact invitation, reviews the card/owner/limit and accepts.
5. Acceptance binds one recipient once and opens that card directly. Network activation follows the issuer's actual prerequisites. The sandbox models this state without generating real credentials.

Card assignment is independent of freezing: `UNASSIGNED`, `ACCEPTED`, `REVOKED`. An unassigned card has no holder and cannot spend or expose credentials. A revoked card retains its original holder for immutable historical attribution. An accepted card cannot be transferred to another person; create a new card instead. Acceptance preserves owner freezes, limits and all financial history. Accepting a second card cannot restore access to a previously revoked card.

## Terminal journey

Create terminal → invite from that terminal → share with the intended recipient → sign in/confirm if needed → review and accept → open that terminal. Reuse the fixed terminal-assignment permissions and current owner authority. Acceptance creates neither another merchant nor a Cardholder service. Invite status and operational access status remain separate.

## Invitation and identity contract

Extend the existing access/invitation lifecycle, command receipts, expiry/version checks and history. A `CARD` target has an exact card/service binding; a `MERCHANT_TERMINAL` target has its existing exact terminal binding. One pending card invitation is allowed. Recipient contact and optional known person are server-owned invitation terms. New contact-based invitations do not require a recipient row before registration.

A public `/invitations/{uuid}` is a locator, never bearer permission. Public reads and previews disclose no private card/terminal data and perform no acceptance. A forwarded link cannot be accepted by the wrong login. Acceptance requires the authenticated recipient's trusted provider-verified contact or exact prebound person, current invitation terms, current owner authority and explicit consent. Browser-entered email, user-editable profile metadata and generic identity confirmation are not independent proof of contact ownership.

Extend the strict sign-in continuation allowlist for the exact invitation path. Preserve it through registration and emailed callbacks using server-owned continuation; never persist provider/claim tokens in browser storage or allow arbitrary redirects. Existing identity, session, CSRF and password recovery guarantees remain intact. Contact verification must use documented provider assertions; do not force password resets merely to implement ordinary invitation navigation.

In-app pending invitations are discoverable only for the matching recipient, within the relevant service. Do not restore an obligatory global invitation service. Distinguish invitation created, copied, composer opened, delivery accepted, delivered, and invitation accepted. Actual automated delivery requires a configured transport and delivery receipt. No development test sends external messages to real people.

## Public checkout and money flow

Payment channel → public order summary → card payment → any required provider authentication → processing/receipt. Merchant identity, description, amount, currency and receiving terminal come from the saved publication. Show the configured provider's supported networks. Etail login is unnecessary for a customer's external-card payment.

Reserve one durable payable obligation and stable provider operation before dispatch, including for one-time links. The browser does not select the payment outcome, amount, merchant account or receiving balance. Network calls occur outside database transactions. A timeout keeps the same operation and immutable payload; retrieval/retry must not create a second remote charge.

A terminal user or owner with current payment-read permission can check a pending payment from that exact terminal. This retrieves the original saved operation, without accepting an amount or outcome and without granting refund or withdrawal permission. It also recovers processing after the customer closes their browser.

Provider events require verified mode/account/object/amount/currency binding and exactly-once effects. Reconciliation uses the original immutable binding, including after publisher revocation or link expiry. Current publication readiness controls new attempts; it must not discard a late genuine result. A return URL or rendered receipt cannot declare payment success.

External payment capture, provider availability, fees and net settlement are separate facts. External capture does not debit an Etail card balance. External refunds return through the original processor/payment source; they never credit an unrelated card group. Pending money is unavailable for withdrawal. The deterministic sandbox adapter supplies explicit zero-fee test quotes and recorded capture/availability events; these are not live pricing assumptions. Keep one canonical merchant payment/ledger owner and preserve historical internal-card payment/refund provenance. Retire the former internal-card chooser and new-review HTTP route; existing saved reviews and receipts retain their original authorized recovery path, and domain fixtures keep their accounting regressions.

The sandbox checkout uses non-sensitive test instruments representing supported networks. It accepts no real PAN/CVC and offers no approved/declined outcome selector. A future provider-hosted test checkout must keep raw credentials outside Etail requests, storage, logs and screenshots. Do not claim Stripe is connected without an authenticated test account and verified integration.

## Data and implementation ownership

- Cards/requests: nullable pending holder, immutable accepted attribution, assignment timestamps/state and explicit network metadata. Existing IDs, holds, limits and posted history are preserved by additive migration.
- Identity: trusted current contact proof bound to provider issuer/subject and application person; no automatic cross-person merge by matching email.
- Access: extend the same invitation/receipt/history owners with exact card targets and contact-bound terms. Existing service-wide pending offers are retired as new card access paths.
- Acquiring: durable operation/event handling and source-aware payment/refund effects; preserved publication and terminal ownership.
- UI: keep the reviewed dashboards. Add card/terminal invitation entry, direct acceptance landing, truthful sharing state and familiar public checkout. Update marketing/FAQ from the same capability model.

## Evidence and acceptance

Public references inspected during D76:

- [Stripe Create a card](https://docs.stripe.com/api/issuing/cards/create): cardholder association is required; activation and card creation are distinct and issuer requirements can block activation.
- [Stripe Checkout](https://docs.stripe.com/payments/checkout): provider-hosted/embedded payment collection, separate from application login.
- [Stripe Checkout lifecycle](https://docs.stripe.com/payments/checkout/how-checkout-works): saved checkout session, customer payment and server event handling.
- [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment): verified server results/webhooks, not the return page alone, determine completion and require idempotency.
- [Visa prepaid overview](https://usa.visa.com/dam/VCOM/download/corporate/media/prepaid-reloadable-card-fact-sheet.pdf): prepaid network acceptance differs from a closed application balance; this older fact sheet is background, not evidence of Etail enrollment or current program terms.

The Stripe expanded `.md` variant URLs failed the web fetcher's safety resolution during this pass; the main API page and indexed official Checkout text were available. No private provider dashboard, video inspection or actual external network connection is claimed.

Before release, verify new/existing/wrong recipient, first-time confirmation continuation, forwarded/expired/revoked links, concurrent and replayed acceptance, no reassignment/history leakage, card-specific revocation, independent service scope, no spending before acceptance, owner freezes and allowance preservation. Verify public guest checkout, one-time reservation races, unknown provider results, duplicate/reordered events, original-source refunds and funds availability. Exercise mobile share cancellation/copy, keyboard/accessibility and exact return destinations. Bind migrations, test results, reviewed source and deployment to the final source tree; record failures and unsupported external connections plainly.
