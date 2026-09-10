# Identity, security and known hosted failure prevention

## New identity boundary

Provision a new Identity configuration belonging only to the new Netlify project. Never point to `etail-depot-member-commerce` or reuse its encryption/session secrets. The final public sandbox goal is Open registration with required email confirmation; keep deployment access protected until its release review. Netlify's project visitor protection and application Identity are different layers. [N4]

Use a server-side Identity adapter following current official documentation; verify installed SDK behavior in the actual Next/Netlify runtime. Choose one session owner and document it: provider-managed server cookies or an application-managed opaque session with server-side provider credentials. Do not run both models in parallel. A provider token or arbitrary browser-stored `user` object is not application authorization.

Application identity binding is `(issuer, subject)`. Do not merge accounts or attach permissions solely by email; re-registration/email change must not inherit a previous user's access. Passwords are never persisted or logged by the application. Use minimum 12 characters, allow password managers/paste and do not trim meaningful password whitespace. Hosted tests use an authorized new test account without placing credentials in code or artifacts.

## Complete auth lifecycle

Implement signup, resend confirmation with rate limits, confirmation callback, login, expiry/refresh behavior, logout/revocation, recovery/reset, invitation acceptance and email-change behavior. Callback tokens must be consumed safely, removed from location/history, and never logged/analytically captured or put in referrers. No secret URL captured by screenshots. Handle expired/used links clearly and prevent account enumeration. Verify all token types are bound to their intended action.

Session cookies: Secure on HTTPS, HttpOnly when server-owned, deliberate SameSite policy, host-only scope, bounded expiry, rotation after privilege/session transition and revocation on reset/logout. Use provider verification and server relationship checks; do not reauthenticate every request in a way that unintentionally depends on an inaccessible protected frontend.

MFA enrollment/recovery must include confirmation, one-use recovery codes stored as hashes, replay-resistant TOTP/step-up, account-bound attempt limits and session revocation. A person with enabled sign-in MFA does not gain a fully authorized session before it completes. Step-up-sensitive operations additionally require fresh authentication; do not use a “confirm test MFA” button in the public hosted app.

## Exact-origin protection without the earlier deployment bug

Unsafe browser routes—including signup, login and logout—need CSRF protection. Derive the expected external HTTPS origin from server-controlled configuration for the verified deploy context, not from `Origin`, arbitrary `Host`, `Forwarded`, or `X-Forwarded-*`. An internal Next/serverless URL must not cause valid public requests to fail. [N5]

Use one tested origin/callback implementation. Canonical production sandbox origin is a new-site HTTPS address stored in `ETAIL_PUBLIC_ORIGIN`; preview origin is that specific preview's verified URL. Do not allow `*.netlify.app`, multiple unrelated production aliases, or trust client headers to select the allowed host. Reject foreign, null, malformed and missing browser origins as appropriate. Add token-based CSRF protection where required by the chosen auth protocol; never remove same-origin checks to make a test pass.

Account API responses are `Cache-Control: no-store, private`; no authenticated PWA cache. Webhooks and narrowly scoped machine API clients use separate signature/bearer auth with explicit routes and permissions, not a generic origin exemption.

## Readiness before exposing signup

Verify environment presence/scopes, canonical origin, new site ID, new Identity reachability/settings, database migrations, secret versions, private Blob namespace, simulator capability and event-runner readiness. Public readiness reports only safe capability/status booleans, never secrets or connection strings. Protected diagnostics can report missing configuration names and operator remediation.

Prevent the previous sequence of avoidable failures: missing Identity URL → absent encryption key → same-origin 403 → disabled simulator → no clearing runner. A signup/purchase form should not be advertised ready while required backend configuration is absent.

## Mail delivery

Netlify Identity supports confirmation/recovery/invite emails and eligible custom SMTP configuration. [N6] Require ownership verification; do not turn off email confirmation because a test email went to Junk. Inbox placement must be tested with the user's chosen test inbox, and cannot be guaranteed. Use the default sender only as an explicitly documented sandbox limitation until an email provider is selected.

For a branded sender, request the provider choice and approved domain/subdomain, obtain SMTP credentials through a secret store, and use that provider's verified SPF/DKIM/DMARC instructions. Do not invent records, duplicate SPF records, alter production mail routing, or claim deliverability from a successful API response. DNS/SMTP purchases or modifications require separate approval and are not authorized by this build handoff.

## Files, API keys and workers

Private uploads require authenticated account/resource access at upload and download, MIME/size validation, safe key generation, malware/quarantine policy for real files, and no direct public Blob URLs. Namespace by new site, deploy context, account and document; namespace alone is not authorization. Clear signed URL/caching semantics must be tested across identities. [N7]

Partner API keys are hashed at rest, scoped, expiring/revocable and shown once. Outbound webhook endpoints have explicit allowed destinations, SSRF protection, HMAC signatures, bounded retry and safe logs. No generic open proxy. Privileged workers get narrow signing credentials and operation scope, not member cookies or owner access.

Protect all secret values from bundle exposure and never include them in `NEXT_PUBLIC_*`. Read runtime variables per request using the supported Netlify runtime access; do not freeze context at build import. `.env.example` contains names and safe defaults only. Preview forks/unknown contexts fail closed.

## Threat cases required in tests

Login CSRF, confirmation replay, stale session after logout, stolen invitation for another recipient, email identity relinking, role self-escalation, cross-account IDs in path/body, owner bypass of product restrictions, shared Household leakage, partner cross-tenant access, forged/duplicated/out-of-order provider events, event poisoning, replay-created cards, SSRF, unbounded webhook/worker batches, privileged cache leaks, secret exposure and source-map/client debug output. No certification is claimed.

[N4] https://docs.netlify.com/manage/security/secure-access-to-sites/identity/registration-login/
[N5] https://docs.netlify.com/manage/security/secure-access-to-sites/identity/use-identity-in-functions/
[N6] https://docs.netlify.com/manage/security/secure-access-to-sites/identity/identity-generated-emails/
[N7] https://docs.netlify.com/build/data-and-storage/netlify-blobs/
