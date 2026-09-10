# Email access reliability — 10 September 2026

The reported registration failure was reproduced on the canonical sandbox: its provider returned `external.email:true`, `disable_signup:false`, and `autoconfirm:true`, while the application correctly requires confirmation before allowing registration. The live Create login form was disabled. Required confirmation was restored on the exact owned site; read-only browser acceptance at 11:41 UTC then verified both forms enabled. The reason the external setting changed again is not established. No application source or deployment configuration was found that writes it.

The sign-in endpoint accepted a deliberately invalid synthetic login request and returned `INVALID_CREDENTIALS` without a cookie. This establishes the negative provider path only. Historical provider audit events show accepted logins, but do not prove subsequent application session creation or the user's current result. Do not describe an enabled button, provider audit event or injected application session as a successful end-to-end password sign-in.

## Focused changes

- Keep the one Identity adapter and one opaque application-session owner. A wholesale authentication rewrite is not supported by the failure evidence.
- Use a fresh document request after successful sign-in so the next page reads the new HttpOnly session cookie.
- Prevent duplicate submissions while a request or successful navigation is pending; bound network waiting without automatically retrying passwords or email requests.
- Refresh server-owned availability after relevant unavailable responses, and provide an explicit availability check.
- Correct email-link instructions: finish in the tab opened by the email. Its final address has already had the secret fragment removed.
- Explain that repeating registration does not change an existing password. Do not label the registration form as a guaranteed resend mechanism.
- Exercise enabled registration, confirmation and password-login forms against isolated provider transport, real application routes and isolated PostgreSQL persistence. Synthetic transport proves application behavior, not live delivery or a real provider credential.

## Release acceptance

Run `node tools/verify-hosted-email.mjs` after publishing every email-related change and after any provider configuration change. This read-only check is pinned to site `cbbb6c24-9dbc-43a2-9234-e4357b5b5280` and the canonical origin. It fails if sign-in is disabled, registration is closed, automatic confirmation is enabled, or the actual browser controls are disabled. It creates no user and sends no email. Passing does not establish successful mailbox delivery or accepted-password sign-in.

Keep pending password-reset barriers intact. A correct password alone cannot settle an uncertain external password update; the exact attempt requires reviewed reconciliation. No reset marker, customer account, financial data, sender configuration, visitor setting or privilege was changed in this repair.

## Validation

Production Next.js build and offline Netlify packaging passed. All 533 unit/PostgreSQL/concurrency/contract tests, all 76 existing browser/API/accessibility cases, and all 12 dedicated email cases passed. Lint, TypeScript, architecture, security/dependency audit and 35 handoff helper tests passed on Node24.19.0/pnpm11.19.0 with the marked PostgreSQL18.6 test database.

The first two email runs exposed test-observation mistakes: Chromium discards a response body after document navigation, and Playwright's abbreviated headers omit Set-Cookie. The final checks use actual dashboard reload/database persistence and the complete header API; cookie, identity, revocation and permission assertions remain intact. Both failed receipts and the final successful receipt are retained in `artifacts/auth-entry-repair/`.

The dedicated email suite is explicitly local-only; the standard GitHub CI uses a different guarded database identity and does not run it. Its provider transport is synthetic, while application commands and session persistence are real. No successful hosted password or mailbox roundtrip is claimed.

Publication is pending the exact tested feature-tree upload and owned sandbox deploy.
