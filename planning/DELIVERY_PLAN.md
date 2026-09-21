# D144 — prepare the release candidate

Freeze D141–D143, record exact local and remote source identity, open the review pull request and verify CI. Build a pristine source archive and Netlify package without modifying the live preview or publishing. Preserve the D143 full-suite and visual evidence when source hashes match; run the complete remote checks on the candidate. Record readiness and any remaining release step in [status](STATUS.md).

# D143 — harmonize the three public product pages

Review Home, Payments and Cards together across desktop, tablet and phone sizes; preserve each page’s purpose and D142’s richer artwork. Apply targeted shared typography/control/spacing fixes, clear audience-consistent wording and aligned product/support labels. Verify all public routes, keyboard flows, links, accessibility and production packaging; record actual results in [status](STATUS.md). Publication remains separate.

# D142 — show the value of payments and Dispute readiness

Rebuild the Payments product story with more substantial sharing artwork and a connected merchant-to-bank illustration. Explain what the optional 0.4% buys and show an exact monetary example without presenting vendor fees as included. Recheck synchronized examples, keyboard/touch controls, responsive framing, text spacing, accessibility and package boundaries. Keep D140 live pending a separate release. [Design and evidence](../docs/PAYMENTS_VALUE_EXPERIENCE.md).

# D141 — focused Payments-page refinement

Shorten repeated marketing copy, consolidate payout guidance into four practical FAQs and simplify pricing and artwork. Preserve interactive examples, commercial disclosures, existing anchors and public-only boundaries. Remove retired component styles, verify desktop/mobile/accessibility behavior and inspect the final responsive layout. Record actual results in [status](STATUS.md); D140 remains live until a subsequent authorized release.

# D140 — publish the reviewed public website

Release the accepted D139 candidate through a reviewed PR, exact-source CI and the bound Netlify site. Verify hosted pages, interactions, metadata, headers and retirement routes without executing vendor or database operations. Preserve the existing access/search configuration and record the deployment result.

# D139 — final review before deployment

Review all public pages and shared chrome, correct concrete copy/interaction/responsive issues, verify public-only backend and archived-data preservation, and refresh current maintainer runbooks. Run full local release gates on the polished candidate, inspect responsive artwork/headers/footers and record exact evidence. Keep vendor-hosted services outside this runtime and publish only on the user’s subsequent release instruction. [Status](STATUS.md); [release review](../docs/RELEASE_READINESS_REVIEW.md).

# D138 — available Dispute readiness and coordinated marketing

Rebuild the public Payments page around getting paid, recognizable purchases and optional dispute readiness; polish Home and Cards in the existing design system. Remove the retired document catalog and reflect the operator-confirmed live approved Order Insight integration in product facts and policies. Preserve supported coverage, additional vendor charges, exact local estimates and public-only data boundaries. Verify browser behavior, accessibility, responsive layout, metadata and production packaging. [Implementation](../docs/DISPUTE_READINESS_MARKETING.md); [verification status](STATUS.md). Deployment remains a separate step.

# D137 — optional Sale Records journey completed locally

The user-approved Order Insight research and payment-page rebuild are complete. Follow [the implementation](../docs/TROLLEYS_SALE_RECORDS.md), [product-line research](../docs/research/d137-order-insight.md) and the verified [status](STATUS.md). One optional 0.4% Trolleys fee plus separately quoted vendor charges replaces D133–D136's three independent document fees. Integrated verification and responsive review pass. The public-only website, fixed handoffs and preserved archived records remain the architecture. Actual provider enrollment/integration, price lifecycle and supplier requirements remain future service work; publication is separate.

## D136 — explain the transaction and the work each add-on handles

Replace the digital-content category with Information across examples, policies and tests. Display six underlying detail questions and illustrative terms for all three sale types; carry those same terms into the Agreement preview. Explain concrete recordkeeping, billing and acceptance outputs, show fee amounts without changing approved rates, and preserve included receipts and independent choices. Verify copy consistency, type switching, mobile/text-spacing layout, accessible descriptions, no provider effects and deployment packaging. [Implementation](../docs/PAYMENT_TRANSACTION_DETAILS.md).

## D135 — implement the fulfillment-aware payment page

Apply the accepted D134 research to the public Payments page: three sale types, three document previews, five channels, independent fees and relevant delivery records. Remove the duplicate scenario control, preserve compact mobile artwork and shared chrome, align Help/Privacy/Terms, and verify cross-control consistency, accessibility, responsive layout and the public-only build package. Keep provider integration and publication separate. [Implementation report](../docs/PAYMENT_PAGE_REBUILD.md).

## D133 — optional documents and five delivery channels

Deliver independent document selection, stacked exact-cent estimates, truthful pre-payment and post-payment previews, and five channels with shared scenario facts. Prepare original templates, a dispute evidence matrix and a vendor handoff contract. Update Help/Privacy/Terms and verify all public, responsive, accessibility and package boundaries. Keep basic receipts included and mark add-ons coming soon until the hosted service is integrated and reviewed. No document delivery, signature collection, billing or database runtime is activated. [Implementation report](../docs/PAYMENT_DOCUMENTS_IMPLEMENTATION.md).

## D132 — implement the accepted advanced public-product plan

Deliver the approved offer explanation and local fee estimator, coherent seven-format scenarios, payment aftermath, secured-credit artwork, compact wallet guide and aligned Help/Privacy/Terms. Preserve the accepted header/footer and public-only runtime. Validate interactions, accessibility, responsive artwork, exact currency estimates, metadata and deployment packaging. Keep unverified provider facts and optional notification setup visible as dependencies; do not invent live email collection. Customer-task validation is needed before claiming a measured 9/10 score. See [implementation report](../docs/PRODUCT_CONFIDENCE_IMPLEMENTATION.md).

## D128 — final public-page detail review

Preserve D127’s accepted three-page design and review all six public pages, shared chrome, copy and policy consistency. Correct responsive/text-spacing issues and redundant language; keep service boundaries and records intact. Local checks and preview are complete; [status](STATUS.md) records evidence. Publication remains separate.

## D127 — implement the accepted three-page proposal

Apply [D126](../docs/PUBLIC_PRODUCT_PROPOSAL.md) in the existing public components: clear discovery and next steps, an accessible two-step payment example selector, concise service questions and secured-credit explanation before wallet setup. Retain accepted chrome/assets and D124's stable wallet image identities; remove sections/components made redundant by the new flow. Check supported pages, mobile/desktop interactions, accessibility, guarded provider links, search metadata, source boundaries and the local production package. Record actual evidence in STATUS. Provider onboarding, commercial-term approval, customer research and deployment remain separate from this public UI implementation.

## D121 — final public release preparation

Preserve the accepted three-page design and shared chrome. Complete a detailed responsive, accessibility, copy, link, legal, backend and archive review; correct concrete findings. Verify the complete test/build sequence and a freshly generated Netlify package for the exact bound site, with archived/private source excluded. Align wording with the observed vendor destination and the user's confirmation that no separate sign-in URL exists. Record source/artifact evidence and remaining external limits in [the release review](../docs/RELEASE_READINESS_REVIEW.md). Leave publication and indexing unchanged.

## D120 — wallet marks and service navigation

Use official Apple Pay and Google Pay SVG marks inside the existing wallet guide with unchanged brand artwork and balanced visible size. Remove the duplicate Cards email sentence without an empty layout spacer. Use Payments / Cards in shared header navigation, matching the footer while keeping product brands in content. Verify shared navigation, wallet behavior and desktop/mobile presentation; record actual results in current status. No deployment or provider change.

## D119 — wallet setup illustration

Use the supplied Ledgix logo and replace the static card rendering with an accessible Apple/Google wallet setup guide on the homepage and Cards. Show adding the virtual card, issuer verification and use after completed setup; keep illustrated controls separate from real guide controls. Follow [official-source setup guidance](../docs/WALLET_SETUP_GUIDE.md), preserve public-only boundaries and verify keyboard/state behavior, no external/API effects, supplied-logo loading and all responsive states. Record actual validation in current status. Publication is separate.

## D118 — Ledgix card presentation and wallet scope

Replace the generic card illustration with a detailed reusable Ledgix virtual-card design and remove its caption. Restrict public wallet marketing to Apple Wallet and Google Wallet, remove the WeChat/mainland-China use case, and align the homepage, Cards, FAQ, Help and targeted Terms wording. Keep coming-soon cards, secured-credit rules and existing payment pages/chrome. Verify the public checks and inspect both card-art sizes across mobile/tablet/desktop. Current status records actual evidence; no publication or financial activation is included.

## D117 — researched use cases and coordinated product artwork

Apply the [marketing research and design](../docs/PRODUCT_MARKETING_USE_CASES.md) to all three public marketing pages. Preserve accepted hero headings, shared company chrome, two-step payment and wallet artwork. Introduce practical use-case vignettes on the homepage, one product detail link per service, and editorial photo/use-case sections on Payments and Cards. Refresh all seven channel narratives; remove the unused homepage photo and presentation styles. Keep fixed provider handoffs, upcoming cards, secured-credit and wallet conditions, public-only architecture and search visibility. Verify existing public checks and visually inspect the three pages at mobile/tablet/desktop widths. Record actual results in current status; deployment is separate.

## D116 — Digital Wallet Card

Rebuild the Cards marketing page around the virtual Digital Wallet Card, its three operator-confirmed wallet options and a clear secured-credit explanation. Use a reusable phone/card illustration on the product page and existing homepage card section. Align FAQ, Help, metadata and targeted Terms wording; remove physical-card presentation code. Preserve D115 payment artwork and the accepted shared header/footer. [Design and evidence boundaries](../docs/DIGITAL_WALLET_CARD.md). Verification and preview status are recorded in current status; publication remains separate.

## D115 — illustrated payment journey

Replace only the Payments hero's three prose steps with the selected two-step artwork: create/share a request, then customer checkout. Retain the earlier page copy and all other accepted pages. Remove unused prose-list styles and verify the artwork in the restored layout across phone, tablet and desktop. Current status records evidence; publication remains separate.

## D114 — restore the earlier pages; focus future artwork on the homepage

The user explicitly selects the earlier Payments and Cards pages and requests the earlier homepage back. Active source/tests are restored exactly to `da7cc4f`. Preserve those product pages and the shared company header/footer. The [homepage artwork brief](../docs/MARKETING_ARTWORK_DIRECTION.md) proposes one human business exchange within the accepted composition; no new artwork is integrated. Current status records completed verification and preview refresh. Publication remains separate.

## D112 — one company header

Apply the homepage's Etail Depot logo, navigation and action to every public route. Remove product identity branches and unused styles while retaining mobile interactions, product-focused bodies and the accepted footer. This supersedes D111's product branding variation. Local validation and preview refresh are recorded in current status; publication remains separate.

## D111 — clear product identities in the header

Keep Etail Depot on general pages; use Trolleys and Ledgix with by Etail Depot on their respective product pages. Center desktop navigation and provide a compact mobile menu with keyboard and dismissal behavior. Preserve the accepted footer and fixed product destinations. All 83 unit/browser/accessibility tests and 70 responsive header states pass, along with the full build/security/package pipeline. [Design and evidence](../docs/PRODUCT_HEADER_DESIGN.md). Preview refreshed; publication remains separate.

## D110 — concise homepage navigation

Remove repeated homepage service action rows, availability sentences and the closing payment CTA. Keep badges and use shared header/footer navigation; retain product-page actions. Lint, types, build, 38 browser/accessibility cases and four responsive captures pass. Evidence is recorded in current status. Publication remains separate.

## D109 — consistent header/footer alignment

Preserve shared content and public-only scope while aligning visible logo edges, navigation, footer groups and legal text across all pages. The complete public verification pipeline and 91 responsive alignment checks pass; visual review is complete. [Details](../docs/PUBLIC_CHROME_ALIGNMENT.md). Local preview is refreshed; publication is separate.

## D108 — public website and vendor links only

The user explicitly chose a public-only release. Remove the internal account application and backend; preserve existing database records and immutable migration/schema history outside deployment. Maintain the six public pages, shared design, fixed service handoffs and privacy/legal disclosures. Old account bookmarks resolve to local information; retired APIs and transaction links return Gone. Local lint, types, 43 unit, 38 browser/accessibility, security, 28 visual states and offline Netlify packaging pass. See [current architecture](../docs/PUBLIC_SITE_ARCHITECTURE.md) and [status](STATUS.md) for scope, evidence and hosted-resource limits. Publication remains separate.

## D107 — one consistent public footer

All public routes use the same footer, neutral service/contact labels and copyright/legal row. D105's per-product footer variations are retired; product headers and bodies retain their existing focus. Build, lint, 28 browser/accessibility cases and 21 footer consistency/target-size checks pass. Preview refreshed; deployment remains separate.

## D106 — a clear payment discovery journey

The homepage introduces the services and the Payments page explains the seven channel options. “How payments work” opens the explanation; every “Open Trolleys” action opens the approved payment website directly. [Scope and evidence](../docs/PUBLIC_PAYMENT_JOURNEY.md). Build, lint, types, architecture, 42 browser/accessibility cases and eight responsive states pass. Independent review is complete and the local preview is refreshed. Deployment remains separate.

## D105 — focused product pages

Each product page focuses on its own brand and action, with scoped header/footer content and neutral shared navigation. [Scope and evidence](../docs/FOCUSED_PRODUCT_PAGES.md). Build, lint, types, architecture, 48 browser/accessibility cases, eight final affected cases and eight responsive states pass. Local preview is refreshed; deployment remains separate.

## D104 — footer detail refinement

The compact footer now has aligned desktop legal text, balanced mobile navigation tracks and deliberate company-name wrapping. [Verification](../docs/PUBLIC_FOOTER_MICRO_REVIEW.md) covers all public routes and key breakpoints. Preserve the content, destinations, header and absence of authenticated footers. Local preview is refreshed; deployment remains separate.

## D103 — coherent public typography and artwork

Keep the accepted content and direction, while narrowing the type scale, improving small-text readability, aligning section rhythm and balancing the photo/card/channel illustrations. Apply shared refinements to the homepage and both product pages to preserve visual continuity. [Scope and evidence](../docs/PUBLIC_VISUAL_BALANCE.md). Build, lint, types, 42 browser/accessibility checks and 74 responsive states pass. Independent visual review is complete; preview refreshed. Deployment remains separate.

## D102 — payment-network strip proportions

Homepage and Payments now share larger, direct acceptance copy and a more compact logo row. Build, focused lint and ten responsive/accessibility checks pass. Preserve original artwork and separate channel-preview sizing. Local preview is refreshed; deployment is separate.

## D101 — Privacy and Terms refresh

Remove public draft notices and align both legal documents with the separately hosted Trolleys and forthcoming Ledgix services. Preserve the confirmed operator/contacts, accurate website data and cookie disclosures, and applicable product agreements. [Scope and evidence](../docs/WEBSITE_LEGAL_REFRESH.md). Production build, lint, types, architecture and all eight affected browser/accessibility checks pass. The local preview is refreshed; no deployment is included.

## D100 — focused homepage hero

The duplicate Ledgix teaser is removed from the payment hero. Keep card discovery in the Cards navigation and dedicated Ledgix section. Locally verified; deployment is separate.

## D99 — standardized public chrome and detail polish

The [public detail refinement](../docs/PUBLIC_DETAIL_POLISH.md) is implemented and locally verified. Preserve the shared public theme, compact light header/footer, readable links and concrete payment examples. Authenticated workspaces retain their own theme. D94 provider separation, D97 original marks and D98 product framing remain; deployment is separate.

## D98 — coordinated public product pages

The [shared landing/product design](../docs/COHESIVE_PUBLIC_PRODUCTS.md) is implemented and locally verified. Preserve one public visual system and shared hero/closing components across discovery, Trolleys and Ledgix. D94 provider separation/availability and D97 original network assets remain. Deployment is separate.

## D97 — authentic card-network artwork

Use the networks’ original artwork in a shared local component, replacing text/CSS imitations across acceptance and card illustrations. Preserve original artwork, accessible labels and responsive placement. [D97 evidence](../docs/NETWORK_BRAND_ASSETS.md). No financial, provider or deployment change.

## D96 — compact footer

The user's footer-density refinement is implemented and locally verified. Preserve the compact labeled mobile rows, retained legal/service links and accessible touch targets. [D96 evidence](../docs/PUBLIC_EXPERIENCE_REFINEMENT.md#d96--compact-footer-follow-up). D95's remaining public design and D94 provider separation are unchanged; deployment remains separate.

## D95 — refined public experience

The [landing and public-chrome refinement](../docs/PUBLIC_EXPERIENCE_REFINEMENT.md) is implemented and locally verified. Keep the D94 separate provider destinations and availability, the distinct activity-based channel illustrations and the explicit removal of the shared Sandbox badge. Current financial guards, existing local recovery, account data and legal/noindex boundaries are unchanged. The final candidate is ready for review; deployment remains separate.

## D94 — provider-hosted public journey

The [provider-hosted public journey](../docs/PROVIDER_HOSTED_PUBLIC_JOURNEY.md) is implemented and locally verified. Public discovery leads to Trolleys at its approved root; Ledgix is coming soon with a card contact action. The user confirmed the final **ledgix.com** domain, i2c card provider, Infinicept payment provider and broad payment capabilities. Landing, products, Help, navigation, metadata and legal scope agree; existing local recovery and account data remain intact. No new in-house secured ledger is required for this marketing/handoff direction. Actual provider account acceptance, any future path-based hosting, retirement of the retained local application, legal effectiveness and deployment remain separate work.

## D93 — Visa secured credit card wording

The [product copy correction](../docs/SECURED_CARD_PRODUCT_COPY.md) is implemented and locally verified across marketing, FAQs, metadata, settings and future refund text. Preserve the current financial behavior and historical records; the separate D84 secured-credit ledger, deposit and repayment cutover remains unfinished. This copy update adds no activation or deployment.

## D92 — Ledgix and Trolleys legal identity

The [confirmed DBA/contact structure](../docs/LEDGIX_TROLLEYS_LEGAL.md) and production-style legal wording are implemented and locally verified. Public identity is informational only; no external domain, email, authentication or financial activation. Keep the policy review/release boundary and internal unresolved operational/legal decisions explicit.

## D91 — Privacy and Terms review pages

The [legal-page drafts](../docs/PRIVACY_TERMS_REVIEW.md) implement the user's requested American Express-informed organization using original copy and audited Etail behavior. Local build, source, browser, accessibility and visual checks pass. Company contact details, operational privacy decisions and qualified legal review remain prerequisites for effective policy publication; no acceptance or live-product agreement is inferred. Preserve prior local work and the D86 hosted baseline.

## D90 — grouped public footer

The [public footer refinement](../docs/PUBLIC_FOOTER_DESIGN.md) is implemented and locally verified. Services, Support and Account links use existing destinations; the user will provide approved Privacy/Terms URLs for the lower row. D87–D89 remain in the local candidate. D86 remains published until a separately authorized release.

## D88 — simple service workspaces

The [shared dashboard layout](../docs/SIMPLE_SERVICE_WORKSPACES.md) for Cardholder and Merchant is implemented and locally verified, including owner/recipient desktop/mobile journeys and accessible controls. All 292 distinct browser/accessibility cases have passing evidence across the full and corrected runs, and 174 responsive capture states pass. D87's completed landing is retained. The complete local candidate is ready for review before separately authorized publication.

## D87 — refined consumer landing

The [refined consumer landing](../docs/REFINED_CONSUMER_LANDING.md) is implemented and locally verified. Existing public tests, source checks and production build pass; responsive review covers27 public states plus77 channel states across11 widths. The completed local preview is ready for user review. Existing financial work and publication remain separately scoped; D86 is still the published revision.

## D86 published — minimal service overviews complete

The user’s [presentation contract](../docs/MINIMAL_SERVICE_OVERVIEWS.md) is published through reviewed PR28 and Netlify deploy `6aae8c43b7fae63bdf4df26e`. Exact-source CI and isolated Netlify packaging pass. All189 live checks and47 public screenshots pass; current deployment and unchanged access are verified after acceptance. No migration, reset or financial-model cutover. Preserve D85 release history and the separately recorded local dashboard evidence.

## D85 published — presentation cleanup complete

The requested D84–D85 copy, styling and dashboard simplification is published through reviewed PR27 and Netlify deploy `6aab7282e2d64d0f3e1b7337`. Full exact-source CI and isolated packaging pass;186 final hosted checks and44 responsive captures pass. No migrations, data reset or access-setting changes. [Release evidence](../docs/SIMPLER_DASHBOARD_EVIDENCE.md) records both corrected test races and exact source identity. D84 secured-card financial design remains pending the collateral-to-limit decision; current runtime is prepaid.

# Etail Depot — active delivery plan

> **D84 active assignment — 17 September 2026 (Tokyo):** [Secured-card design](../docs/SECURED_CARD_EXPERIENCE_DESIGN.md) records the user-confirmed monthly pay-in-full/optional early repayment direction. Deposit/limit terms remain pending; current runtime money is prepaid until an implemented, verified cutover. Complete the independently requested family/business copy and Merchant visual alignment now, preserving D73 ownership, separate service money and total card allowances. [Status](STATUS.md) distinguishes local changes from published D83.

> **D83 publication update — 17 September 2026 (Tokyo):** D82–D83 presentation cleanup is published through reviewed PR26 and exact-source Netlify deploy `6aaabc9ab5e2833789718dc1`. GitHub checks and offline packaging passed; all186 final hosted checks and44 responsive public captures pass. The exact current deploy and unchanged access were reverified after acceptance. [Current status](STATUS.md) and [whole-site evidence](../docs/ALL_PAGES_PRESENTATION_REVIEW.md) supersede the historical pre-publication status below. No schema, financial behavior or authority model changed.

> **D81 active override — 14 September 2026 (Tokyo):** [Cohesive service experience](../docs/COHESIVE_SERVICE_EXPERIENCE.md) governs channel marketing and sharing, modern dashboards, actual service settings, clean customer paths and versioned personal profile editing. D73 authority/money, D76 exact invitations and D80 unified card/terminal workspaces remain. Implementation and local verification are complete; see D81 delivery evidence. Review/publication remains separate, and no D81 deployment is claimed.

> **D80 active override — 13 September 2026:** [Unified resource workspaces](../docs/UNIFIED_RESOURCE_WORKSPACES.md) makes cards and terminals follow the same create-for-self/others, detail, controls and sharing pattern. Card details contain their own controls and invitations; Merchant Overview is one credit/debit statement, with Terminals owning channels and assigned people. Personal profile/login and service account settings remain separate. D73 money/authority and D76 contact-bound invitations remain.

> **D79 active override — 13 September 2026:** [Consolidated service workflows](../docs/CONSOLIDATED_SERVICE_WORKFLOWS.md) puts card Add money on Account home and Return unused money in owner settings; card filters describe use rather than names. Merchant has one Overview / Payments / Team & terminals / Channels / Settings menu, with balance and payouts on Overview and terminal context inside the same workspace. Existing financial, permission and recovery rules remain.

> **D78 active override — 13 September 2026:** [Clear service workspaces](../docs/SERVICE_DASHBOARD_CLARITY.md) makes Amex the Cardholder reference and Stripe the Merchant reference. Separate account overview from named-card detail; use one personal account menu with no authenticated footer. Merchant collection, settlement and payouts have distinct views; routine merchant top-ups are retired server-side while posted receipts remain recoverable. D73 money/permissions and D76 invitations/checkout remain.

> **D77 navigation override — 13 September2026:** [Service menu hierarchy](../docs/SERVICE_MENU_HIERARCHY.md) separates account home, cards/payments, resource management, account balance and settings. New top-ups use one money-account workspace; historical funding reviews retain recovery. D76 invitations/network checkout and D73 money/permission rules are unchanged.

> **D76 active override — 12 September 2026:** [Network cards and resource invitations](../docs/NETWORK_CARDS_AND_RESOURCE_INVITATIONS.md) governs Visa product intent, create-card-first recipient assignment, exact terminal invitations and public external-card checkout. It supersedes the internal-Etail-only payment path and person-first/member-code invitation requirements. D73 separate balances, total card allowances and owner/holder/terminal isolation remain in force. Historical text below is dated context.

> **D73 active override — 12 September 2026:** [Owner, cards and terminals](../docs/OWNER_CARDS_TERMINALS_DESIGN.md) governs the current rebuild. The user explicitly chose **separate card and merchant money** and **per-card total allowances with no monthly reset**. Owners manage cards and one merchant’s flat terminals; invited holders/users have only their own resource access. Primary/secondary customer tiers, per-person monthly limits, submerchant responsibility and shared card/merchant balances are superseded. The text below retains the dated D69–D72 baseline for migration and review history; it does not override D73.


12 September 2026 · D72: the user accepted D71 and requests customer-copy/dead-code cleanup, full verification and deployment. Follow [D72 release evidence](../docs/PRODUCTION_UI_CLEANUP.md) for the exact candidate. Preserve current schema, saved data, two-service permissions and disabled real-money controls.

12 September 2026 · D71 experience refinement: [simpler consumer entry and dashboards](../docs/CONSUMER_ENTRY_REDESIGN.md) are implemented and locally verified on the existing prepaid slice. Review the revised desktop/mobile customer experience next; the financial contract and remaining release/product sequence below remain in force. D71 changes no schema or hosted resource and does not constitute a deployment.

12 September 2026 · D69 · **Current stage: review the locally verified prepaid replacement and its connected customer/operator journey.** The working candidate replaces starting allocations, customer-authored purchase simulators, guest payment mutations and instant transfers. Both old local generations are preserved offline; active generations use `fresh-services-d69`. D69 tests, 33 visual views and offline packaging pass; [evidence](../docs/PREPAID_REBUILD_EVIDENCE.md) separates these results from hosted release acceptance.

[FRESH_PREPAID_REBUILD.md](../docs/FRESH_PREPAID_REBUILD.md) is the active replacement contract, consolidated in [the product design](../docs/PRODUCT_TECHNICAL_DESIGN.md) and [project prompt](../02_MASTER_BUILD_PROMPT.md). [Status](STATUS.md) holds actual evidence. D65–D68 and their draft reviews remain history, not competing execution instructions. [M0–M7](backlog.json) retains original requirements and stable IDs without restoring retired account types.

## Current sequence

1. Complete and freeze the prepaid slice: primary funding, group/person limits, one issuance flow, own-card checkout, linked Merchant payment/refund and genuine saved settlement/deposit states. Remove customer simulator routes, global invitation entry and obsolete active copy; retain service-related invitations and access boundaries.
2. Verify each current role and money boundary on the new canonical test generation. Migrate obsolete test assumptions to the real connected flow; preserve permission, replay, concurrency, exact-money and immutable-history assertions. Retired mutation routes must return 404 without effects.
3. Correct any confirmed candidate failures through the existing owners. Verify malformed success shapes, later denied retries, hidden private context, durable funding/payment review URLs and independent operator outcome processing. Then run final source, database, browser/accessibility and packaging gates for the exact candidate.
4. Show the complete desktop/mobile experience using the new marked preview. Preserve before/after projection and source evidence during read-only visual capture. Record usability and remaining scope; do not restore rejected sample records to make a screenshot look complete.
5. Record the exact source/tree/schema and release evidence. Push/review/deploy only within current authorization and existing project rules. Hosted lifecycle and persisted customer tasks remain separate from local provider harnesses and earlier hosted sign-in evidence.
6. Continue remaining P5/P6 work as separately reviewed slices. A prepaid sandbox delivery does not complete external rails, provider reconciliation, partial refunds/disputes, membership billing/rewards or the 100% comparison inventory.

## Retained dependency map

| ID | Outcome | Dependencies and exit gate | D69 status |
|---|---|---|---|
| P0 | One current brief, roles, money model, architecture and gap register | User decisions reflected without conflicting active instructions | D69 prepaid override replaces the earlier allocation/charge interpretation. |
| P1 | Clear desktop/mobile journeys for four customer roles and operators | First use, normal use, waiting, denied, stale and recovery states; observed task acceptance | Earlier walkthrough retained; D69 candidate needs its own final visual/customer acceptance. |
| P2 | Reliable hosted entry and operating runbook | Authorized mailbox confirmation/login/recovery/reload/logout and persisted scoped service tasks | Prior user sign-in report and D68 evidence retained; current-revision hosted acceptance remains separate. |
| P3 | Accepted prepaid Cardholder experience | Explicit funding and per-person limits, one zero-funding issuance path, own-card payment, management/privacy and recovery | Implemented and locally verified for the D69 scope; hosted acceptance remains. |
| P4 | Accepted Merchant experience | Exact merchant/date scope, customer publications, linked payments/full refunds, genuine deposit records, access and support | D69 connected money/deposit model and customer language replace simulator/instant-transfer behavior; local acceptance passes, hosted acceptance remains. |
| P5 | Complete payment distribution and exception lifecycle | Independent delivery, durable processing/reconciliation, partial refunds, disputes/reserves and reliable settlement/deposit effects | Customer publication + signed-in checkout + full refund + explicit operator deposit outcomes are the active slice. Automatic provider processing/delivery and broader exceptions remain. |
| P6 | Remaining issuing, commercial and operating product | Relevant P3–P5 dependencies and D14–D17 for affected money | Retain replacement/closure, facilities if resumed, billing/rewards/calendar, actual source costs, partner/API, notifications/files/PWA and broader operations. |
| P7 | Release review and demonstration | Exact revision/schema, appropriate CI/package, desktop/mobile/privacy/recovery and actual hosted acceptance | D69 release evidence to be filled from final runs; no completed release claimed here. |

P3 and P4 share the explicit connected payment contract; neither may invent a second financial owner. P5's automatic processing, external delivery and broader exceptions each require their own states, data invariants and acceptance. Independent nonfinancial work can proceed while unresolved commercial decisions block only affected writes.

## Connected acceptance scripts

| Actor | Task | Required negative/recovery proof |
|---|---|---|
| New member | Sign in or confirm/register; choose one of the two services; reload and sign out | No automatic service/operator grant; no global invitation requirement; existing email/session failure cases retained. |
| Primary Cardholder | Create group; add money via saved review; set person limit; issue a card without funding; use own card at a published merchant checkout | Funding/limit/issuance remain distinct; malformed/replayed requests create one effect; cannot spend as another holder. |
| Secondary | Accept service-related access; understand no-card waiting; use own eligible card; find receipt/activity/help | Other people's cards, group funding/history and management remain hidden; primary freeze and current grants enforced. |
| Primary Merchant | Select network/unit and dates; publish collection; match customer payment; full refund; review full settlement/deposit batch | Scope survives detail/back; stale batch fails; pending funds/refunds are protected; no arbitrary instant transfer or customer completion control. |
| Merchant delegate | Accept exact-unit access; create/share permitted channels; follow own unit's payments and support | Siblings/other primaries denied; no implied refund, deposit, processing or Cardholder rights; publication is not message delivery. |
| Payer | Public request → sign in → own eligible card → saved review → confirm → exact receipt/refund | Current card/readiness/funds/limit checks; foreign card denied; same saved identity after loss/denial; one-time use once. |
| Support operator | Read assigned private case and permitted payment context; reply/resolve | Separate assignment, no impersonation or money mutation; support-only access cannot process deposits. |
| Deposit operator | Read assigned pending batch; explicitly record COMPLETED or FAILED; recover identical result | One terminal event; conflicting result/command denied; returned-batch review excludes later payments and retains old item history. |

For every script record source/tree, environment, actor, starting records, steps, persisted results, errors, assistance and desktop/mobile result. Keep failures and corrected reruns. Automated totals do not replace these task proofs or actual hosted acceptance.

## Local generation and preservation gate

The user-authorized D69 replacement covers both fixed local preview and test generations. Preserve their original database OIDs/rows under `_retired_d69` with `ALLOW_CONNECTIONS=false`; use fresh `fresh-services-d69` markers on the fixed active names. Do not connect the application to a retained database, copy old rows or reset hosted Database/Identity. Canonical seeding explicitly funds, limits, issues, checks out, refunds and processes a deposit. Startup verifies completed preparation without writes. Follow [tools/README.md](../tools/README.md) for exact targets and private preservation receipts.

## Per-slice and release discipline

Each implementation change names the task, role/resource, state contract, existing owner, any schema change, command identity, current authority, money effects, operator recovery and tests. Preserve one policy, issuance lifecycle and ledger writer. A new abstract engine is not a substitute for finishing a bounded journey.

The final candidate needs relevant lint/types, domain and PostgreSQL integration, adapter/replay/concurrency, API contracts, architecture/security/dependency review, desktop/mobile/accessibility, production Next and Netlify packaging, migration/seed isolation and actual release evidence. Record running or failed checks accurately, bind logs to exact code/schema, and retain historical results without borrowing them as D69 proof.

## Remaining requirements and decisions

Keep original M0–M7 IDs and the 90-task `amex-public-v2` inventory. The denominator/gates do not shrink when a feature is deferred. Plans, source economics and the shared Premier annual cap are separate from services/cards. D69 resolves active prepaid group funding and UTC person spending limits; it does not resolve broader fee rounding, membership-year, sponsor attribution or supervised/facility economics. Real rails, licensing/verification, external delivery and public release keep their existing boundaries.
## D113 — coordinated public product presentation

Replace repetitive page framing with a two-service homepage, a product-led Payments page and a focused forthcoming Cards page. Use original code-native artwork, practical copy and the existing accessible channel journey. Keep the shared company header/footer, approved service entrances and public-only scope. [Design](../docs/PUBLIC_PRODUCT_STORYTELLING.md); current status records the completed checks. Publication remains separate.
