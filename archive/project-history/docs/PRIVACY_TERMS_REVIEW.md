# D91 — Privacy and Terms review pages

> **D92 update:** [Ledgix and Trolleys legal identity](LEDGIX_TROLLEYS_LEGAL.md) supersedes the proposed mailboxes and generic operator presentation below. The user supplies DBA names, product domains and exact service/compliance emails. D91's audit and verification remain historical evidence; its wording about unconfirmed email destinations is no longer current.

20 September 2026. The user requests American Express-like Privacy and Terms pages and confirms **Etail Depot US, Inc.**, **Washington, DC**. They authorize choosing appropriate mailbox names. They have not supplied a street address or confirmed a company email domain or monitored mailbox. Use `privacy` and `legal` as proposed mailbox names only; do not create or link an unverified address.

## Delivered scope

Original, Etail-specific drafts at `/privacy` and `/terms`, a shared public reading layout, section navigation, cookie table, and footer links. Footer copyright uses the user-confirmed company name. Responsive styles preserve the existing header, public brand and authenticated dashboard layout.

The documents visibly say **Draft for review**, use a draft date rather than an effective date, and make no claim to be accepted agreements. No registration consent, acceptance record, privacy-request endpoint, provider configuration, database migration, email provisioning or financial behavior changes are included. Both routes are static, public and independent of identity or account reads. Their metadata independently requires noindex/nofollow and does not add them to the approved marketing-page search inventory or sitemap. Noindex is not access control; these are review documents, not confidential material.

The D90 wait for supplied external policy URLs is superseded by the user's explicit request to write the pages. Final legal approval and working contact information are not inferred from that instruction. This slice is local and does not authorize deployment.

## Reference and adaptation

Reviewed the official US [American Express Online Privacy Statement](https://www.americanexpress.com/us/company/privacy-center/online-privacy-disclosures/) and [Terms of Service](https://www.americanexpress.com/us/legal-disclosures/website-rules-and-regulations.html) on 20 September 2026. The privacy statement shows an effective date of 26 March 2026; the website terms show 1 March 2019. Their topic organization informs a readable progression through scope, information use, sharing, controls and website responsibilities. The reference is organizational only. Text is newly written from Etail's implemented behavior; Amex's product agreements, advertising practices, liability clauses, arbitration, rights notices and financial status are not imported.

## Implementation evidence behind the disclosures

| Subject | Actual source and boundary |
| --- | --- |
| Login/profile | `src/modules/identity/adapters/netlify.ts`, `profile-service.ts`, `contact-schema.ts`, `src/platform/database/schema.ts`. The app receives email/password and forwards authentication to Netlify Identity. No application password database. Verified email, display name and identity binding are stored. |
| Session cookies | `src/modules/identity/session.ts`: hosted `__Host-etail_session`, up to 8 hours, HttpOnly/Secure/SameSite Strict. `continuation.ts`: `__Host-etail_continue`, 24 hours, SameSite Lax. `src/modules/acquiring/guest-service.ts`: `__Host-etail_guest`, 24 hours, SameSite Strict. Cookie expiration does not erase records. |
| Cards/invitations | `src/modules/access/schema.ts`, `src/ui/resource-invitation.tsx`, `src/modules/workspace/funding-schema.ts`. Resource/contact-bound assignments, invitation recipient email, history, card names and total allowances. Shared invitation content can include the email and resource name. |
| Merchant/publication | `src/modules/acquiring/{schema,network-schema,network-contracts,guest-service}.ts`, `src/ui/workspace/merchant-channel-publication.tsx`. Business/terminal information, simulated financial records, guest session/test instrument. Published link exposes safe business/terminal/amount/description/expiry information. Selected messaging apps receive sharing content; publication does not send messages. |
| Support/disputes | `src/modules/cases/{schema,service}.ts`, `src/modules/disputes/schema.ts`. Text messages, reasons and linked activity; requester-scoped support and separately authorized staff, scoped dispute participants/reviewers. Free text may contain personal information. |
| Preferences/activity | `src/modules/workspace/service.ts`, `src/modules/reports/service.ts`, `src/modules/acquiring/activity-service.ts`. Notification choices are saved, not delivered automatically. Scoped activity CSVs are not full personal-data exports. Saved-report removal does not erase source history. |
| Controls | `src/modules/identity/{profile-service,security}.ts`. Display-name editing, password recovery, session listing/revocation. No verified full account deletion/export workflow. |
| Providers/tracking | `src/platform/database/client.ts`, identity adapter, HTTP context. Netlify hosting/database/authentication. No app analytics, ad SDK, replay or browser-storage integration found. Infrastructure logs, regions, backups and vendor contracts were not audited; no absolute no-tracking/no-logging claim. |
| Financial boundary | `src/platform/config.ts`, `src/modules/issuing/sandbox-adapter.ts`, `src/modules/acquiring/adapters/network-sandbox.ts`. Real money disabled; no live cards/network processing. D84 secured charge-card proposal remains unimplemented; draft terms describe actual prepaid behavior. |

A second read-only review checked the implemented text against this inventory and found no actionable factual or privacy issues. This is a code/disclosure consistency check, not a legal opinion.

## Remaining decisions before effective publication

- Full business mailing address, company email domain, and activated/monitored privacy/legal mailboxes with a request owner.
- Applicable geographical audience and laws, age/guardian rules, lawful grounds where required, privacy rights, identity checks, request response/appeal procedures and deadlines.
- Category-specific retention/deletion schedule, backup treatment, hosting/authentication processing regions, vendor contracts, transfers and security-incident procedures.
- Approved sharing/sale/advertising position and any necessary regional or financial-product notices.
- Terms covering eligibility, changes/closure, availability commitments, governing law, remedies, any permitted limitations and the acceptance/versioning process.
- Qualified legal review and a separately authorized publication. The draft does not promise live financial services or adopt Amex's legal status.

## Verification

Verification is recorded in `artifacts/d91-checks/`. The new public journey verifies footer access, cross-document navigation, section anchors, visible draft status, noindex, canonical URLs, sitemap exclusion, no premature mailto/acceptance forms, and absence of private API reads or mutations. Existing public/accessibility checks include both legal pages and retain the private dashboard footer checks.

Production Next build, full lint, TypeScript, architecture checks and all 18 existing public-metadata unit cases pass (exit 0). All 48 targeted public/account-menu desktop, mobile and accessibility cases pass. After refining mobile contents into a collapsed native disclosure, the final production build, focused lint and all eight affected legal-page journey/accessibility cases pass again. Accessibility covers 1440, 390 and 320 pixels, including the expanded mobile contents and cookie table, with no page overflow.

The first final-layout accessibility run tried to click a desktop-hidden mobile disclosure and timed out. The shared public-page test now opens only visible `summary` elements; all assertions and accessibility tags remain. The failed/interrupted run and corrected successful run are both retained. A preview restart attempted before the test server exited returned `EADDRINUSE`; the later restart succeeds after the test server exits. No preview preparation, migration or seed replay was needed.

Manual browser review confirmed the public footer links, desktop reading layout, phone Privacy/Terms pages and working native mobile contents toggle. The temporary viewport override was reset, and Terms is open in the user's existing local browser tab. `artifacts/d91-checks/preview-ready.log` records the preserved preview running on port 3100. No hosted, provider or database configuration changed; D86 remains the published baseline.
