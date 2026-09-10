# Email member dashboard correction — 10 September 2026

The user could sign in but both service dashboards returned their generic load-error notice. The sign-in session fix was working; dashboard and invitation readers still required the isolated demo issuer and explicitly rejected hosted execution. Earlier browser cases only signed in as demo people, so they did not cover this first-provider-login path.

## Change

A shared service reader now accepts an existing person bound to this project's recorded Netlify Identity issuer. Isolated demo identities still require the original local/test runtime gate. Reads never bind an identity, create a service, assign cards, change permissions or add eligibility. Cardholder and merchant resource reads retain their exact service/holder/assignment policy checks; mutation loaders retain the demo-only boundary.

Cardholder services, Merchant services and the invitation inbox now load for a new email member with no assignments. A server capability controls primary-service setup buttons. Empty dashboards explain the absence of assigned services, and the empty card selector is hidden. No sample data, balance or financial access is substituted for missing enrollment.

## Validation and limits

Three new native PostgreSQL regressions exercise the real application sign-in/session flow with only provider verification substituted, then both dashboards and the inbox under production runtime policy. They also reject unknown, unbound, unrelated-provider and hosted demo identities; verify foreign cards/merchants and enrollment commands remain unavailable; and check protected records and grants are unchanged. A new desktop/mobile browser journey uses a synthetic provider-bound application session in the isolated test database and navigates through all three pages. No hosted user, mailbox, password or provider token is used.

The full domain/database/contract suite passed520 tests. Typecheck, lint, architecture, security/dependency audit,35 source-only handoff helpers and production Next/offline Netlify packaging passed. Browser results and final publication evidence are recorded in planning/STATUS.md and ignored artifacts/provider-service-dashboards/. The initial offline build could not write the CLI's local configuration, and the initial audit could not reach npm from the sandbox; scoped retries passed. The first browser run found a missing Node JSON import attribute before executing tests; the import was corrected and the rebuilt application retested. Failed receipts are retained.

This correction makes first-time email users' empty dashboards usable. Email sign-in still grants no service eligibility. New cardholder/merchant enrollment and sandbox financial/invitation mutations remain restricted to eligible isolated demo identities. Fully operating a hosted service as an email user needs a separately implemented enrollment and servicing lifecycle; the release does not claim that functionality. No database migration, Identity configuration change, visitor-access change, DNS change or real-money operation is included.

## Publication

[PR6](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/6) contains the repair. GitHub849af76ddf960bc11f04cde31e95984a37b28f39 shares the tested locald036816ad99a17e9c17980631839de891ce635aa tree9e2f84d2542bc547dd901ec04f31bfa5fcbd9cd5. Netlify production6aa25bad98a26eeb15ab7f0f is ready, published07:27:22.192UTC. Home/login return200, protected dashboards redirect unauthenticated visitors to login, and session/Cardholder/Merchant APIs return401 for an unknown synthetic cookie. These seven live checks do not claim an authenticated hosted user roundtrip. The first-provider-member desktop/mobile journeys passed locally. Normal production branchmain, visitor access and the build hold remain. Local preview3100 is restored. GitHub CI34449830937 was still running after its backend checks passed when last observed.
