# D92 — Ledgix and Trolleys legal identity

20 September 2026. The user confirms the following public company and service identity and requests polished, production-style legal copy:

| Purpose | Operator / website | Contact |
| --- | --- | --- |
| Cards | Etail Depot US, Inc. DBA Ledgix · https://ledgix.com | ledgix@etaildepot.com |
| Payments | Etail Depot US, Inc. DBA Trolleys · https://trolleys.ai | trolleys@etaildepot.com |
| Privacy, legal and other compliance | Etail Depot US, Inc. · Washington, DC | compliance@etaildepot.com |

These are user-supplied public contact destinations. They supersede D91's proposed mailbox names and unconfirmed domain. Listing the addresses does not claim a mailbox delivery test. Product website links do not provision domains, change DNS, deploy another website or establish cross-domain sign-in. The existing isolated repository, database, Netlify site and denied mutation targets remain unchanged. No message was sent to any contact.

## One company, two service names

Keep one corporate Privacy Policy and one set of website Terms, with explicit Ledgix and Trolleys sections. The company remains the operator under each trade name. Do not invent separate legal entities, affiliated financial institutions, an issuing bank, acquiring provider, licenses, network sponsorship or deposit insurance.

The policy covers the Etail Depot platform and operator-controlled branded services that display or link to it; merely listing a domain does not claim an audit of that site's cookies or infrastructure. The cookie inventory and hosting disclosures remain expressly platform-specific. Common ownership does not merge service enrollment, balances, resource permissions or records, nor create consent to unrelated cross-service marketing.

## Customer language and implementation

`src/shared/legal-identity.ts` stores the confirmed public identity/contact destinations. `src/ui/legal-identity.tsx` renders matching brand and contact sections on both legal pages. The shared public footer identifies Ledgix and Trolleys as the company's trade names. Contact links use only the three supplied addresses. The canonical site remains the bound Netlify origin.

The policy and terms bodies use finished customer language. Remove repeated demo, sandbox, simulated, fictional, proposed-mailbox and editorial work-in-progress descriptions. Move unresolved business/legal implementation details to this internal record. The website Terms describe stable service responsibilities; account funding, credit, repayment, provider and financial protections belong in their applicable product agreements rather than speculative website terms.

Preserve one concise **Service availability** statement that financial transactions and usable network credentials are not enabled in this environment. `ENABLE_REAL_MONEY=false` and existing product safeguards remain. The global Sandbox badge is unchanged. A polished writing style does not establish a live financial program.

The single review notice remains concise and explicit that the pages have not taken effect. Metadata keeps the review status and noindex/nofollow independently of any marketing search release. No acceptance form, effective date or consent record is added. Future practices or laws can require policy updates; the user’s wish to avoid repeated copy changes is not a promise that these documents will never need revision.

## Reference check

Read official [District of Columbia trade-name guidance](https://dlcp.dc.gov/node/1619191) and [FTC Privacy and Security guidance](https://www.ftc.gov/business-guidance/privacy-security) on 20 September 2026. DC distinguishes the entity's corporate name from trade names used by that business; FTC guidance says privacy claims must be honored. These support accurate identification and code-grounded disclosures, not a legal opinion or a finding that a particular registration/licensing requirement is satisfied. No registration search is claimed. D91's Amex organizational references and application data audit remain valid.

A separate read-only review of the final text found no actionable factual or unsupported-policy findings. It verified operator/brand identity, the five supplied domain/email strings, limited policy scope, independent balances/access, platform-specific cookies and the absence of invented live-product, guaranteed response/deletion or cross-domain functionality claims.

## Remaining operational/legal work

The supplied emails resolve public contact naming. The full mailing address, actual request-handling process and ownership, retention/deletion schedule, vendor regions/contracts/transfers/backups, applicable regional rights, children’s eligibility and financial-program agreements still require confirmation before final legal publication. Qualified legal review remains necessary. These matters are tracked here rather than displayed as editorial todos in customer copy. Mailbox provisioning, jurisdiction-specific notices, agreements and acceptance records are not implemented by this presentation change.

## Verification

Run production build, source checks, metadata tests and the existing public/account-menu desktop/mobile/accessibility suite. The legal journey checks exact brand-to-domain and contact-to-email associations, no editorial demo wording, footer and contents navigation, visible review status, noindex and canonical binding, no acceptance form and no private API reads or mutations. Do not send emails or navigate to the external sites to exercise these links.

Production Next build, full lint, TypeScript and all 18 public metadata unit tests pass. All 48 targeted public/account-menu desktop/mobile/accessibility cases pass. The architecture check initially rejected UI imports of the new constant from a server module directory. Move the public display constants to `src/shared/legal-identity.ts`; do not weaken the boundary check. Final architecture, focused lint and production build pass, followed by all eight affected legal-page journey/accessibility checks. Logs, including the initial failure, are retained in `artifacts/d92-checks/`.

Manual browser inspection confirms the side-by-side desktop operator cards, stacked mobile contact rows, correct rendered mailto/website destinations and visible keyboard focus. The viewport override was reset and the updated Terms page was left open in the existing local tab. Preview startup verifies the preserved database without migrations or seed writes (`preview-final.log`). No deployment is included.
