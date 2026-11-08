# Public website security

The website does not authenticate merchants or hold customer account records. Merchant access is handled by the approved vendor Welcome page. No local identity provider, session cookies, credentials store or financial backend is part of this project.

## Preserve the current boundary

- Use only the repository and site in [project-targets.json](../project-targets.json). Denied projects and existing Identity, database, DNS and email resources remain protected.
- Keep vendor links fixed. Never forward visitor input, query parameters, fragments or referrers to the account service.
- Keep retirement handling read only. It must not read or forward submitted request bodies.
- Preserve security headers, the exact production indexing guard, noindex previews and empty preview sitemaps.
- Preserve the enabled Netlify Emails extension and its pinned authenticated POST handler. Do not add another server function or expose a new public caller.
- Keep credentials out of source, browser storage, public environment variables, logs, URLs and screenshots. Do not add customer-data collection during a content or structural change.

## Source and asset handling

Review public assets for unredacted account details and secrets before adding them. Preserve fictional-example labels and approved notices in existing artwork. Store original private captures and local review evidence outside Git and the deploy package. Moving a file into a public archive does not make it private.

Use the pinned lockfile, review dependency changes and run the existing credential detector, dependency audit and package checks. [File publication policy](FILE_PUBLICATION_POLICY.md) governs source-only files and prevents build-check records from becoming website downloads. A scanner pass is not proof that every sensitive datum is absent; review the actual change.

## Reporting and evidence

Report potential vulnerabilities privately to [compliance@etaildepot.com](mailto:compliance@etaildepot.com). Do not include credentials, customer records or sensitive exploit instructions in a public issue.

[TEST_AND_EVIDENCE.md](TEST_AND_EVIDENCE.md) defines check records. Local passing checks do not establish hosted behavior or security certification. The original account-platform security specification remains in [history](../archive/project-history/docs/SECURITY_AND_IDENTITY.md); it does not authorize recreating that system.
