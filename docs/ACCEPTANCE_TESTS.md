# Acceptance catalogue

> **Original requirement inventory, not current test results.** [Product and technical design](PRODUCT_TECHNICAL_DESIGN.md) and [Delivery plan](../planning/DELIVERY_PLAN.md) govern the active model and acceptance sequence. Original case IDs, three-account wording and handoff-era “not implemented / not tested” labels are retained for traceability; they neither restore the retired model nor assess today's implementation.
>
> This notice supersedes model/status authority only. Preserve the underlying security, privacy, financial, release approval and commercial obligations unless explicitly changed by an authorized decision. Current completion requires mapped, executed evidence.

All cases are required behavior for the new application. None is marked executed by this handoff. See `TEST_AND_EVIDENCE.md` for evidence requirements and `contracts/acceptance-cases.json` for the machine-readable version.

### NEW-01 — New-resource isolation
New repository/site/database/Identity/secrets have distinct verified IDs; denied targets never receive writes.

Status: **not implemented / not tested**.

### NEW-02 — Fresh database
All migrations apply to empty new PostgreSQL; no old data/compiled code imported.

Status: **not implemented / not tested**.

### NEW-03 — Target collision
Provisioner stops on wrong owner, old site ID, non-private repo or unrelated name collision.

Status: **not implemented / not tested**.

### NEW-04 — Source provenance
Original workbooks remain byte-identical; imports carry source hash, cell and policy/version references.

Status: **not implemented / not tested**.

### ACC-01 — Three types and explicit selection
Exactly PERSONAL/HOUSEHOLD/MERCHANT. The selected account persists across reload; no first-row fallback.

Status: **not implemented / not tested**.

### ACC-02 — Roles differ by account
One actor can own A and view B; modifying path/body/client state cannot grant B write access.

Status: **not implemented / not tested**.

### ACC-03 — Capabilities and stale state
Server denies/reasons/remediation agree with command policy; stale capability is not authorization.

Status: **not implemented / not tested**.

### ACC-04 — Invitations
One-use intended-recipient acceptance; expired/revoked/other-recipient tokens fail; no unintended membership charge.

Status: **not implemented / not tested**.

### ACC-05 — Privacy across contexts
Household access exposes no unrelated Personal/Merchant history, files, exports or totals.

Status: **not implemented / not tested**.

### ACC-06 — Independent adults
Adult participants can keep private Personal account history and scoped Household allocations.

Status: **not implemented / not tested**.

### ACC-07 — Minor restrictions
Guardian-funded participant cannot activate credit/Merchant or raise own limits through role/API edits.

Status: **not implemented / not tested**.

### ACC-08 — Revocation
Accepted access can be revoked; the next protected read/write is denied; own-history retention follows explicit policy.

Status: **not implemented / not tested**.

### CARD-01 — One workflow
Home/Cards/onboarding reach the same card-request route/component/command; no old/new choice or embedded legacy app.

Status: **not implemented / not tested**.

### CARD-02 — Saved prerequisites
Draft account/holder/settings survive missing verification/funding, session renewal and reload.

Status: **not implemented / not tested**.

### CARD-03 — Issuance permission
Spend alone cannot issue cards; manager alone cannot spend; responsible-party/product checks still apply to owner.

Status: **not implemented / not tested**.

### CARD-04 — Request uniqueness
Concurrent same-request submits under same/different HTTP keys create one card and stable provider operation.

Status: **not implemented / not tested**.

### CARD-05 — Intent conflict
Changed payload/version cannot replay a submitted request as a different card; return conflict.

Status: **not implemented / not tested**.

### CARD-06 — Distinct requests
Two deliberate eligible requests can create two cards without creating extra backing/cap.

Status: **not implemented / not tested**.

### CARD-07 — Provider timeout
Unknown remote outcome remains processing/reconciliation; no new provider operation ID on retry.

Status: **not implemented / not tested**.

### CARD-08 — Scoped funding
Holder and backing assignment are authorized; arbitrary cross-account facility IDs fail.

Status: **not implemented / not tested**.

### CARD-09 — Freeze/replace
Parent freeze cannot be undone on child card; replacement retains history and does not reset usage/cap.

Status: **not implemented / not tested**.

### CARD-10 — Format/controls
Virtual/physical/single-use/merchant options use one form and supported policy; no real PAN/CVV is stored.

Status: **not implemented / not tested**.

### MONEY-01 — Journal integrity
Every posted entry balances by currency; direct update/delete is rejected; reversals are append-only.

Status: **not implemented / not tested**.

### MONEY-02 — Exact values
All money/rates use exact representations; overflow/malformed/currency mismatch inputs fail.

Status: **not implemented / not tested**.

### MONEY-03 — Backing example
$100 collateral + $10 settled purchase => $100 collateral, $10 obligation, $90 available.

Status: **not implemented / not tested**.

### MONEY-04 — Concurrent auth
Separate database clients/barrier: $80 and $30 cannot both approve against $100 shared backing.

Status: **not implemented / not tested**.

### MONEY-05 — Payout versus pledge
Concurrent commercial pledge/payout/refund cannot consume identical settled available funds twice.

Status: **not implemented / not tested**.

### MONEY-06 — Limit composition
Account/person/card constraints compose; limit edits preserve usage and new cards do not increase capacity.

Status: **not implemented / not tested**.

### MONEY-07 — Holds and capture
Approve/capture/partial capture/expire/reverse retain exact backed exposure; duplicates do not double subtract.

Status: **not implemented / not tested**.

### MONEY-08 — Late events
Genuine clearing after freeze/revocation is recorded/reconciled without granting new authorization.

Status: **not implemented / not tested**.

### MONEY-09 — Repayment policies
Consumer statement vs Merchant daily full repayment preserved; supervised funded users have no credit bill.

Status: **not implemented / not tested**.

### MONEY-10 — Reconciliation
Ledger, facility exposure, Merchant payable/reserves/payouts and reward liability reconcile to exact currency totals.

Status: **not implemented / not tested**.

### SIM-01 — One practice purchase
Visible member action completes via durable provider events; no manual clear is required.

Status: **not implemented / not tested**.

### SIM-02 — Worker restart
Crash after intent/event ack recovers without duplicate effects; Pending remains truthful.

Status: **not implemented / not tested**.

### SIM-03 — Replay/reordering
Duplicate business/event IDs and out-of-order events are safe; invalid signatures fail.

Status: **not implemented / not tested**.

### SIM-04 — Narrow workers
Only bounded mock event runner enabled; calendar schedules and real providers do not activate incidentally.

Status: **not implemented / not tested**.

### SIM-05 — Readiness
Disabled/missing simulator/runner returns safe capability unavailability before promising usable purchase.

Status: **not implemented / not tested**.

### ACQ-01 — One merchant identity
Get paid and full Merchant map to same approved named merchant relationship, not anonymous Household/P2P.

Status: **not implemented / not tested**.

### ACQ-02 — Guest checkout
Guest pays without login/membership; receipt/status reveals no member/Household/operator data.

Status: **not implemented / not tested**.

### ACQ-03 — Invoice/link semantics
Partial invoice payments and reusable link independent payments persist with overpayment concurrency protection.

Status: **not implemented / not tested**.

### ACQ-04 — Settlement and reserve
Pending/reserved/disputed amounts unavailable; itemized provider fee and brand cost accounted separately.

Status: **not implemented / not tested**.

### ACQ-05 — Refund
Partial/full refund ceiling and proportional reward/fee reversal cannot be exceeded/repeated.

Status: **not implemented / not tested**.

### ACQ-06 — Payout lifecycle
Request reserves eligible backing; paid/failure/retry restores or settles once; permissions/step-up apply.

Status: **not implemented / not tested**.

### ACQ-07 — Disputes
Opened/resolved/chargeback events link original payment and preserve evidence/accounting.

Status: **not implemented / not tested**.

### ACQ-08 — Delegation
Household helper needs explicit named-Merchant permission; viewer cannot refund/change payout destination.

Status: **not implemented / not tested**.

### ECO-01 — Pricing fixture
Annual scenario equals Select $3200/Premier $2600/$600 saving; both base rates 0.50%.

Status: **not implemented / not tested**.

### ECO-02 — Shared bonus
Spending/fee-only/mixed extras share one $300 membership-year cap across accounts/cards.

Status: **not implemented / not tested**.

### ECO-03 — Lifecycle rewards
Monthly base, annual bonus, reversal, upgrade proration/no cap reset and earned credit without renewal.

Status: **not implemented / not tested**.

### ECO-04 — Cost imports
Compute supplied Planning operating costs/contributions within $0.01 from source formulas; no residual plug.

Status: **not implemented / not tested**.

### ECO-05 — Cost completeness
60 enabled/25 missing Planning lines/58.3333% completeness; missing vs zero vs disabled retained.

Status: **not implemented / not tested**.

### ECO-06 — Basis and approvals
Planning/Contracted/Actual never silently mix; locked approved versions unchanged; future rows off.

Status: **not implemented / not tested**.

### OPS-01 — Cases and privacy
Customer opens case; operator assigns/escalates/resolves/reopens; internal notes and attachments stay scoped.

Status: **not implemented / not tested**.

### OPS-02 — Independent approval
Requester cannot approve own protected action; payload edits/revocation invalidate approval.

Status: **not implemented / not tested**.

### OPS-03 — Partner separation
Direct/referral/wholesale/embedded models keep customer/partner/platform economics and access separate.

Status: **not implemented / not tested**.

### OPS-04 — Partner API
One-time scoped keys, revoke/expire, signed webhook retry/SSRF defense, reports and no cross-tenant access.

Status: **not implemented / not tested**.

### AUTH-01 — New Identity
Issuer/subject binding from new provider only; no email-only relinking/first-user admin/hosted demo bypass.

Status: **not implemented / not tested**.

### AUTH-02 — Complete sign-in
Signup/confirmation/login/expiry/reset/invite/logout work on actual hosted canonical origin.

Status: **not implemented / not tested**.

### AUTH-03 — CSRF
Valid external HTTPS origin reaches login validation; foreign/missing/null/spoofed forwarding origins fail.

Status: **not implemented / not tested**.

### AUTH-04 — Session/MFA
Secure/HttpOnly/host-only cookies where server-owned; logout/reset revoke; MFA/step-up and recovery replay limits.

Status: **not implemented / not tested**.

### AUTH-05 — Secret isolation
No provider tokens, keys, connection strings or callback tokens in browser bundle/cache/logs/screenshots.

Status: **not implemented / not tested**.

### AUTH-06 — File controls
Cross-account upload/read/export denied; allowed owner operation works; private Blob isolation across contexts.

Status: **not implemented / not tested**.

### UX-01 — Clarity
User completes card assignment, purchase and finds activity without old/new flow or internal provider vocabulary.

Status: **not implemented / not tested**.

### UX-02 — Responsive accessible
Desktop/mobile real browser; keyboard/dialog/focus/errors/contrast/zoom; no overflow at 320px.

Status: **not implemented / not tested**.

### UX-03 — Error recovery
Failed actions never show success; field values preserved; expired sessions/drafts resume safely.

Status: **not implemented / not tested**.

### UX-04 — PWA privacy
Installable public shell; never caches private APIs/account pages/documents or auth callbacks.

Status: **not implemented / not tested**.

### REL-01 — Current dependencies
Resolved versions/lockfile, real Next and Netlify builds; no guessed compatibility or fake stubs.

Status: **not implemented / not tested**.

### REL-02 — CI exact revision
Required suites execute (not skip) for reviewed SHA; detailed safe artifacts and release summary preserved.

Status: **not implemented / not tested**.

### REL-03 — New deployment
Ready actual new site/deploy ID/SHA/DB migrations observed; old projects unchanged.

Status: **not implemented / not tested**.

### REL-04 — Preview isolation
DB branch and auth/Blob/secret separation verified; protected previews do not mutate or expose main data.

Status: **not implemented / not tested**.

### REL-05 — Hosted user journey
Authorized new confirmed test account + card/funding/purchase + guest payment + reload/logout tested live.

Status: **not implemented / not tested**.

### REL-06 — Public release review
Owner approves public sandbox; Open registration with confirmation; mocks only; email caveat/operating costs disclosed.

Status: **not implemented / not tested**.

### REL-07 — Restore and rollback
Backup restore rehearsed in disposable new database; rollback preserves post-release financial events.

Status: **not implemented / not tested**.
