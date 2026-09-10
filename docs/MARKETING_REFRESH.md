# People-first marketing and first-time access

Decision D54, 10 September 2026. The user rejected generic dashboard-led marketing and clarified that their email had never been registered on the new site.

## Product and design

The proposition is **“Cards for your people. More ways to get paid.”** Two independent services support that proposition: give eligible adults their own cards with primary oversight, or give trusted people payment tools for a merchant with explicit responsibility and scoped records. Adult family, team and helper scenarios describe jobs, not new account types.

The homepage now uses original lifestyle photography, two product-exploration actions, concrete benefit stories and a readable sharing sequence. A keyboard-accessible seven-channel selector demonstrates the same fictional merchant request as text, email, invoice, bill, social, QR or web. It neither sends messages nor opens a live checkout. Product guides explain the recipient and primary views; the footer, navigation, search descriptions and social preview share the same proposition. Sandbox disclosures remain visible.

The direction follows freshly inspected public [Amex Additional Cards and Employee Cards marketing](research/amex/MARKETING_POSITIONING_2026_09_10.md) and [Amex/Square/Stripe merchant research](research/amex/MERCHANT_MARKETING_FIT_2026_09_10.md). It does not copy their artwork or offers, claim Amex endorsement, or establish product-market fit. Test the proposed family/team/helper jobs with customers before claiming validated demand.

## Image provenance

The original hero was created with the built-in image-generation tool, then converted to WebP for website delivery without cropping or compositional edits. Project asset: `public/marketing/people-together.webp`; no Amex or third-party lifestyle artwork is copied. The illustration is not a photograph of real customers or a testimonial.

Final prompt:

> Use case: photorealistic-natural. Asset type: original lifestyle photography for an Etail Depot consumer financial-services website hero, no American Express branding. Create one premium editorial photograph, landscape 1536x1024: three clearly adult people (a woman in her 40s with a 25-year-old adult daughter and a man in his 30s who is a teammate) working together at the light oak counter of a small independent flower and ceramics shop. A candid warm, capable moment as the daughter checks an unbranded smartphone and the teammate packs a small purchase; natural smiles, not posed at camera. Main people in central and right region; sophisticated deep forest green cabinetry, cream plaster, a little terracotta and fresh greenery, natural daylight through shop windows, tactile documentary photography with subtle film grain, realistic skin/hands. Medium-wide waist-up composition with adequate breathing room, visually clear on narrow crops, authentic editorial rather than corporate stock. No children, credit cards, text, letters, logos, legible phone screens, money, UI overlays, fake testimonials, watermarks, or exaggerated glamour. Image only; website will supply all text.

## Identity configuration observation

Only new site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` was inspected. Its existing registration was Open with email confirmation Not required. To support verified registration, only “Allow users to sign up without verifying their email address” was unchecked and saved. UI now reports Email confirmation Required; the public settings endpoint independently returned HTTP200 with `autoconfirm:false`, `disable_signup:false`, and email enabled. No external identity user was created and no email was sent by the agent. Existing project visitor access and deployment settings were untouched.

The former `/auth/login` route always returned503 and the preview had only sample personas. First-time users now have Create a login, required email confirmation, password sign-in and password recovery. The local application calls the recorded new provider; it never substitutes a fictional identity for an email address. See [email access](EMAIL_ACCESS.md) for the callback sequence, opaque sessions, persistent attempt limits and unresolved-reset handling. A new login does not automatically receive financial eligibility or a service membership; real-user service enrollment remains separate work.

The local email return needs one extra step: open the confirmation email, then paste the final Etail page address into the app's masked Confirmation link field. Never paste it into chat. The agent did not create a user, send an email or verify a real mailbox roundtrip. Hosted authentication commands remain gated.

## Database preservation and verification

Two additive migrations add hashed authentication counters and an identity-specific pending-reset barrier. A timed-out provider password change cannot silently permit a new application session. Only a definitive success for the exact reset attempt clears the barrier; unresolved writes require owner-assisted provider reconciliation. No retry, timer or ordinary password verification bypasses it.

Both owned local databases now have five migrations. The preview went from 49 tables / 196 rows to 51 tables / 198 rows: the two extra rows are migration receipts, and both new tables are empty. Hash comparison preserved all prior rows except the expected additions to the migration journal. Old databases and source recovery copies were untouched.

Final verification uses Node24.19.0, pnpm11.19.0, PostgreSQL18.6 on loopback55439 and the isolated `etail_depot_next_services_test` database. Logs are preserved under `artifacts/marketing-refresh/`; source-only handoff failures and their supported wrapper result are kept rather than hidden.

| Check | Result / evidence |
|---|---|
| Full unit, PostgreSQL integration, concurrency and adapter/API contracts | 479 passed; `domain-final.log` |
| Complete browser API, desktop, mobile and accessibility suite | 62 passed in one final run; `browser-final.log` |
| Public pages and five email modes at1440/390/320px | All27 states pass Axe and horizontal reflow, no page errors or unexpected writes; `visual/checks.json`, `visual-final.log` |
| Lint and production Next build, including TypeScript | Exit0; `lint-complete.log`, `build-complete.log` |
| Offline Netlify build, explicit new site and deploy-preview context | Exit0; `netlify-build-final.log`; no deploy |
| Architecture and static security | Exit0; `architecture-final.log`, `security-final.log`; 67 API routes inspected |
| Dependency audit | No known vulnerabilities; `dependency-audit.log` |
| Schema generation | No schema changes after migration5; email-access receipt |
| Source-only handoff wrapper | 35 passed; direct legacy commands failed on installed dependency JSON and remain recorded |

The earlier browser candidate passed 60/62: two invalid-callback assertions matched both the form alert and Next's route announcer. Restricting the locator to the main region fixed the test; both focused cases and all 62 final cases pass. Initial visual checks found three homepage contrast failures, corrected before the final browser run. Earlier logs remain available. Seven final images were manually inspected: the desktop homepage in full and above the fold, phone homepage, desktop/narrow registration, and both narrow service guides. The local network-enabled preview is restored on3100; capture performs no sign-in or email submission. These checks do not certify live email delivery, public authentication, financial providers or product-market fit.

## Publication boundary

During this work the remote platform was found to have advanced independently: PR1 was merged at `8601ccd269fabc29b2adb2c06890e41d6e1d9d31`, and Netlify reported a production deploy. This task did not perform that merge or deployment. Its new work must use a new feature PR and preserve the remote main revision. A code push does not authorize deployment or Google indexing.
