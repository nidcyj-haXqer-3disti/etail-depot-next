# Email journey regression

Run after a successful production build, with ports 3101 and 3102 unused:

```sh
pnpm test:email-e2e
```

This dedicated Playwright suite runs registration, default root confirmation callback,
password sign-in, authenticated services and reload on desktop and mobile. It also
checks incorrect/unconfirmed credentials, confirmation-setting drift after page render,
recovery/reset with old-session revocation and a new password sign-in, duplicate registration without changing the original password, and duplicate-submit/timeout recovery without automatic email retries.

The browser uses the actual application HTTP routes. The existing provider adapter,
identity binding, password throttle/lock, reset marker, opaque session issuance and
session reads run unchanged against the marked disposable PostgreSQL database.
No session is injected and fixture login is disabled.

Only provider transport is simulated: the test-only preload forwards an exact allowlist
under the recorded Identity endpoint to an isolated loopback provider. Unrecognized
provider requests and other external fetches fail closed. The fixture accepts only
synthetic `email-e2e-…@example.test` accounts. Password digests and provider tokens stay
in fixture process memory; it sends no emails. Requests record method and path only.
Playwright traces, screenshots and videos are disabled. No fixture or preload is
imported by application source or included in the production deployment.

The launcher verifies the exact local test URL and database ownership marker. It
refuses the preview database, CI roles and hosted environment markers. Each test
clears only the disposable database's authentication throttle; other records remain.
The launcher closes its fixture listener when Next exits or the test runner stops it.

**Scope:** this proves the application email/session journey with an isolated transport.
It does not prove live email delivery, a customer's provider credentials, HTTPS cookie
delivery on Netlify, or the hosted database's serverless HTTP/WebSocket transports.
Live readiness is checked separately by `pnpm verify:hosted-email`.

**CI:** this suite is currently local-only. The existing CI database uses a different
guarded role/port, and local email configuration intentionally rejects CI. Do not
weaken application guards or add this command to that workflow as a false green check.
A separately isolated runtime with the same verified local database target is needed
before this suite can run in CI.
