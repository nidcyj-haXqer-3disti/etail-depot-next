# Hosted email deployment — 10 September 2026

The user's “push and deploy” request authorized publication to the owned new site. The corrected release is live at [Etail Depot](https://etail-depot-next.netlify.app), with [email sign-in and registration](https://etail-depot-next.netlify.app/login) enabled.

## Exact release

- Repository: `nidcyj-haXqer-3disti/etail-depot-next`, private repository ID `1361184741`.
- Feature: `feature/hosted-email-deploy`; [draft PR3](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/3) remains open. No feature merge or main write was performed.
- Deployed GitHub commit: `3aa28d28532fd3790f1c51f87cbc7913fe585814`.
- Tested local application commit: `0143e2749f8bc99ba38a2eddc22dadbca2f6efc8`.
- Both have the exact tree `4fc2d4e6d101d65399697de51801c99cc1a03426`.
- Netlify site: `cbbb6c24-9dbc-43a2-9234-e4357b5b5280`.
- [Deploy receipt](https://app.netlify.com/projects/etail-depot-next/deploys/6aa23e2b077dc331492708b5): `ready`, production context, production database branch, no deployment error; published `2026-09-10T05:21:24.835Z`.

The site's production branch was temporarily set to the tested feature for this explicit deployment, then verified restored to `main`. Branch deploys remain production-only, PR preview settings and visitor access remain unchanged, and the existing automatic-build ignore command remains. No DNS, plan, legacy site, database connection import, data seed or real-money operation occurred. The local preview was restored on port3100 without migration or seed writes.

## Verification and correction

The first deployment of `740690f5174dd88b18121ea5b7ea793f3f42efad` passed local and GitHub checks but failed actual email acceptance with `HOSTED_IDENTITY_NOT_READY`. The guard incorrectly expected build-only `NETLIFY` and `CONTEXT` variables inside Functions. The final version uses the official `@netlify/functions`6.0.0 request context to verify the actual site and production context on each command. Matching environment values alone do not allow branch/preview authentication. The failed receipt is retained under `artifacts/hosted-email-deploy/live-acceptance-initial-failed.json`.

On the corrected application revision, all513 unit/database/concurrency/contract tests and all62 API/desktop/mobile/accessibility browser cases passed. Lint, TypeScript, architecture, security/dependency audit, production Next/offline Netlify packaging and35 source-only handoff helper tests passed. Commands, exits and logs are retained under `artifacts/hosted-email-deploy/runtime-correction/`. Independent source review found no blocker. The corrected revision's [GitHub workflow34440631939](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/actions/runs/34440631939) was still running when last inspected; this record does not claim remote CI completion.

Actual hosted acceptance passed:

- Fresh `/login` returned200 without the disabled notice. The live browser showed enabled sign-in and first-time registration controls, without fixture-persona buttons.
- Provider settings returned email enabled, required email confirmation and open registration.
- Across all five email endpoints, ten missing/foreign-Origin requests returned403 and five canonical-origin invalid bodies returned422. All omitted session cookies and retained private/no-store caching.
- One synthetic negative sign-in reached the production database lock/throttle and the bound Identity provider, then returned401 `INVALID_CREDENTIALS`, without creating a user, session or outbound email. The final acceptance receipt is `artifacts/hosted-email-deploy/live-acceptance-final.json`.

An actual user-owned registration, mailbox delivery, confirmation and successful sign-in roundtrip has not been exercised. New email users receive no automatic card, merchant, operator or service eligibility. This remains a financial sandbox. See [email access](EMAIL_ACCESS.md) for the eight-hour application-session limit, external provider lifecycle limitations and enrollment scope.
