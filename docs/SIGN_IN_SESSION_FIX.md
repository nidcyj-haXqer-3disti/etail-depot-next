# Sign-in session reader correction — 10 September 2026

The user reported that registration worked but sign-in did not. The owned Identity provider's audit recorded successful logins. The application then needed to load the opaque session it had stored. Local preview provider-binding counts were zero, so local fixture tests did not establish that the hosted session reader worked.

## Reproduced failure

The installed Drizzle Netlify adapter called the HTTP client with a SQL string. The installed Neon client accepts that form only through `.query()`. Transaction writes used the WebSocket pool and could succeed, while subsequent session lookup used the HTTP path and failed before sending a query. This explains why earlier negative-password acceptance and native PostgreSQL tests missed the defect.

The failure was reproduced with the actual installed Netlify/Drizzle/Neon libraries and a synthetic `.invalid` connection, without network access. Independently, the deployed session endpoint returned503 `SERVICE_UNAVAILABLE` for a syntactically valid but unknown synthetic session cookie. That request should perform a database lookup and return401 without creating or accessing a user session. The sanitized receipt is `artifacts/sign-in-session-read/hosted-before.json`.

## Correction and boundaries

The shared database client now adapts plain SQL calls to the existing HTTP client's `.query()` method. It retains Netlify's refreshing proxy, tagged templates, explicit queries, batching, parameter binding and the same WebSocket pool. No installed dependency, database migration, user record, password, confirmation requirement, session authority or service permission changes.

New regression tests use the actual installed serverless stack with synthetic HTTP transport to verify session authentication, timestamp mapping, raw results, parameter binding, batching and refreshed connection handling. A separate native PostgreSQL test now combines the outer authentication lock, real throttle, binding and HTTPS session repository, with only provider verification stubbed. That test also verifies no automatic service grants and successful logout.

Full checks and the published revision are recorded in the task status and `artifacts/sign-in-session-read/`. The existing push/deploy authorization applies to this repair on the owned new site. PR3 was independently merged before this task; `feature/sign-in-session-read` preserves that main tree and uses a separate review PR. No feature merge is performed by the agent.

Verification passed517 domain/database/contract cases and62 browser cases, production Next/offline Netlify packaging, lint/types, architecture, security/dependency audit and35 handoff helper cases. The initial security check rejected password-bearing synthetic `.invalid` test URLs; their unnecessary fictional passwords were removed, then all3 affected adapter tests and the unchanged security detector/audit passed. Initial and corrected receipts are preserved; no check was disabled.

## Published acceptance

Deployed GitHub `492540419174ad39aecf457026cbfdc00a47699d` and tested local `2bb84fcda4e23e3db21b88726bcd9656a41550a4` share tree `ab90f9b31406887e1737d9072d4330446e02a981`. [Netlify deploy](https://app.netlify.com/projects/etail-depot-next/deploys/6aa24b81694a49133db31916) is ready in production, published `2026-09-10T06:18:19.361Z`, with no error. The same unknown synthetic session-cookie lookup now returns401 `AUTHENTICATION_REQUIRED`, no Set-Cookie and private/no-store caching. The live login page returns200 with enabled email/sign-in controls; an unauthenticated browser opening `/services` redirects normally to `/login`. The final receipt is `artifacts/sign-in-session-read/hosted-after.json`.

Production branch configuration was verified restored to `main`; the existing visitor/preview/build-hold settings remain. The local preview restarted on3100 without migration or seed writes. [Draft PR4](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/pull/4) contains the fix and remains unmerged by the agent; workflow34444502620 was running when last inspected. A successful sign-in using the user's own credentials has not been performed by the agent and remains a user retry. The preceding evidence proves the specific hosted reader defect is fixed; it does not invent a completed user roundtrip.
