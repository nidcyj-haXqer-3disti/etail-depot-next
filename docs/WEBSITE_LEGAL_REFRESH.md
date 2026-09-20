# D101 — website Privacy and Terms refresh

20 September 2026. The user requests removal of “Draft for review” and “This review version has not yet taken effect,” together with a review of Privacy and Terms after the move to separately hosted card and payment services.

Status: implemented and locally verified, with independent content and data-practice reviews. Production build, focused lint, TypeScript, architecture and eight legal-page browser/accessibility checks pass. This document records no deployment or legal certification.

## Public presentation

Both legal pages now use their ordinary titles, **Privacy Policy** and **Terms of Use**, and display **Last updated September 20, 2026**. The date identifies the content revision. No effective date, agreement acceptance, consent record or financial enrollment is invented.

The shared legal layout no longer accepts a review-notice prop or renders the review-status panel. Its unused notice styles are removed. The metadata helper is renamed from `legalDraftMetadata` to `legalPageMetadata`; the draft suffix is removed from page, Open Graph and Twitter titles. Descriptions now identify the website scope and the relationship to product notices.

Existing canonical URLs and independent noindex controls remain. Changing customer-facing status text does not alter search-release settings. This user decision supersedes D91 and D92's requirement to display a review label; their source audits and unresolved operational questions remain relevant history.

## Website and product scope

The documents define **website account tools** once for retained accounts and tools hosted directly on this website. That term replaces repeated references to an “existing Etail platform,” while preserving the disclosures required by the functionality and records that remain.

The website provides product information and service links. Trolleys payments are available through their hosted service; Ledgix Visa secured credit cards are forthcoming. Trolleys sign-in and account management are described as available now, while Ledgix card access is described as available when that service launches. Neither website credentials nor invitations establish access to the separate product platforms.

Product agreements and notices govern product enrollment, access, financial terms and information handling by the relevant parties. The revised language does not suggest that separate hosting removes Etail Depot's responsibilities for information it handles or obligations under applicable law and its agreements. It does not invent a provider's legal role, an issuing bank, an acquirer, a data-sharing arrangement or a shared sign-in.

The existing truthful financial boundary remains: this website does not process financial transactions or issue usable payment credentials, and its retained account tools do not represent real funds or live credentials. Product website links do not open an account, connect balances, transfer funds or guarantee approval.

## Identity and contacts preserved

| Service or purpose | Confirmed identity and destination |
| --- | --- |
| Company | Etail Depot US, Inc. · Washington, DC, United States |
| Cards | Etail Depot US, Inc. DBA Ledgix · `https://ledgix.com` · `ledgix@etaildepot.com` |
| Payments | Etail Depot US, Inc. DBA Trolleys · `https://trolleys.ai` · `trolleys@etaildepot.com` |
| Privacy, legal and compliance | `compliance@etaildepot.com` |

Ledgix and Trolleys remain trade names of the same company. The shared identity and contact components retain their exact domains and email destinations. Full operator names are no longer repeated unnecessarily within the product paragraphs. Contact details are user-confirmed display information; this task does not verify mailbox delivery or change any domain configuration.

## Privacy corrections

- The scope covers browsing, direct contact and website account tools. Product-specific notices remain separate without disclaiming the company's own responsibilities.
- Technical information explicitly includes account-access attempt records used to prevent misuse, alongside security events, request references and hosting connection information.
- Account access, records, invitations, support visibility and published-link sharing remain conditional on using the website's tools. Their permissions are not presented as the separate providers' dashboard permissions.
- Password processing remains assigned to the authentication provider; no claim is made that the website has its own password database.
- Privacy requests can concern **this website, Ledgix or Trolleys**, and continue to use the compliance contact.
- Security, retention and family-use language remain limited to known behavior. No guaranteed deletion period, complete security, child eligibility or universal set of regional rights is added.

The code-grounded cookie inventory remains intact:

| Hosted website cookie | Purpose | Maximum stated duration |
| --- | --- | --- |
| `__Host-etail_session` | Website account sign-in | Up to 8 hours |
| `__Host-etail_guest` | Guest checkout and receipt access | 24 hours |
| `__Host-etail_continue` | Invitation continuation after confirmation or recovery | 24 hours |

The notice continues to distinguish these website cookies from product-site cookies. Its HTTPS and script-access statement applies to the hosted website. Clearing cookies does not erase related records. The absence of optional application analytics, advertising pixels and session replay is distinguished from operational logs maintained by hosting and sign-in services.

The retained code evidence remains `src/modules/identity/session.ts`, `continuation.ts`, the Netlify identity adapter, account/profile services and `src/modules/acquiring/guest-service.ts`, together with the broader data inventory recorded in D91. No cookie configuration, session duration or account behavior is changed by the disclosure update.

## Terms corrections

Terms distinguish available Trolleys access from forthcoming Ledgix access, preserve the Visa secured credit description and direct financial terms to the appropriate product agreement. Payment-channel examples are expressly illustrations: their amounts, items, messages and statuses do not create payment requests or record transactions.

The content provision applies to material submitted to Etail through this website or direct contact, avoiding an unsupported implication that Etail receives every submission made within a provider platform. The external-services provision preserves Etail's own obligations. The nonwaivable-rights statement remains; unnecessary commentary listing absent arbitration, liability-cap and exclusive-court provisions is removed.

## References inspected

The following official sources were reviewed on 20 September 2026. They inform scope and clarity; no other company's policy text, product promises or legal status is adopted.

- [American Express Online Privacy Statement](https://www.americanexpress.com/us/company/privacy-center/online-privacy-disclosures/) distinguishes its online statement from additional product notices and services covered by other notices.
- [American Express website Terms of Service](https://www.americanexpress.com/us/legal-disclosures/website-rules-and-regulations.html) was inspected as the requested website-terms reference. Its contractual provisions are not copied into Etail's terms.
- [FTC Privacy and Security guidance](https://www.ftc.gov/business-guidance/privacy-security) emphasizes clear, accurate privacy representations and honoring the practices described.
- [FTC guidance on the Privacy of Consumer Financial Information Rule](https://www.ftc.gov/business-guidance/resources/how-comply-privacy-consumer-financial-information-rule-gramm-leach-bliley-act) describes notices based on actual information practices. It does not establish which obligations apply to Etail without the relevant operational facts.

The independent source review found no actionable inconsistency in the final page bodies, shared layout, metadata or updated browser assertions. This is a content and implementation consistency review, not a determination of legal sufficiency or provider compliance.

## Remaining operational and legal work

The following matters remain internal follow-up items rather than editorial warnings on customer pages:

- A confirmed full company mailing address and operational ownership of privacy, legal and support requests.
- Product agreements, the parties' contractual responsibilities, actual provider data flows, access, disclosures and processing locations.
- The geographical audience and applicable regional or financial privacy notices, rights, verification procedures, response periods and appeal processes where required.
- A category-specific retention and deletion schedule, including backups, legal holds, incident handling and provider records.
- Product eligibility and any authorized guardian process, together with the relevant financial and network program terms.
- Qualified legal review against the confirmed operations, plus any necessary notice, acceptance and version-management process.

Removing the review label does not establish that these operational items have been completed. This slice introduces no financial processing, provider integration, database change, acceptance mechanism, DNS change or deployment.

## Verification

All commands pass with exit 0 using the pinned Node 24.19.0 and pnpm 11.19.0 runtime:

- `pnpm build` — production Next build (`artifacts/d101-checks/build.log`).
- Focused ESLint on the changed TSX/TS files — `lint.log`.
- `pnpm exec tsc --noEmit` — `types.log`.
- `pnpm test:architecture` — `architecture.log`.
- Existing browser checks: `node tools/run-with-database.mjs playwright test tests/browser/public-foundation.spec.ts tests/browser/public-accessibility.spec.ts --project=desktop --project=mobile --project=accessibility --grep 'legal documents|consumer /(privacy|terms)'` — eight passed (`browser.log`).

The browser assertions cover ordinary legal titles, last-updated dates, absent review panels/draft metadata, canonical/noindex retention, company/contact destinations, public access, contents navigation and no private API reads or mutations. Accessibility checks cover both pages at 1440, 390 and 320 pixels, including mobile contents and the cookie table.

Four desktop/mobile captures in `artifacts/d101-checks/` were visually reviewed for readable text, spacing, navigation and absence of a leftover banner gap. The preserved local preview is running at http://127.0.0.1:3100/; startup verified preparation without migrating or seeding. No provider, customer-data, push or deployment change occurred.

## Related records

- [D91 — Privacy and Terms source audit](PRIVACY_TERMS_REVIEW.md)
- [D92 — Ledgix and Trolleys legal identity](LEDGIX_TROLLEYS_LEGAL.md)
- [D94 — provider-hosted public journey](PROVIDER_HOSTED_PUBLIC_JOURNEY.md)
