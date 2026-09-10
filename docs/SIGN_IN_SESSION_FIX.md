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
