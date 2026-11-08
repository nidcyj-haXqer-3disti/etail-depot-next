# Public website acceptance criteria

These criteria apply to the active public website. They describe required behavior, not a claim that a particular candidate passed. Results belong in [current status](CURRENT_WORK_CONTEXT.md) and the exact candidate receipt. The old account-platform case catalogue remains in [history](../archive/project-history/docs/ACCEPTANCE_TESTS.md).

| Area | Required outcome | Existing coverage |
| --- | --- | --- |
| Routes and search | Exact approved page inventory, canonical URLs, structured data, sitemap and noindex legal/preview behavior | Route/SEO unit checks, production SEO verifier and artifact checks |
| Shared navigation | One header/footer; correct destinations; keyboard focus, responsive menu and browser Back work | Site structure, public history and accessibility suites |
| Artwork and loading | Stable first paint, refresh and saved-step loading; no missing visible images or hydration layout shifts | Site paint, documentation and integration-guide suites |
| Merchant access | Only the fixed Welcome handoff; no forwarded visitor input/referrer or local account workflow | Merchant account, public boundary and security checks |
| Services and pricing | Approved wording, fees, qualifications and local illustrative interactions remain consistent | Service model, commercial page and fee-estimate checks |
| Guides | Instructions, disclosures, keyboard enlargement and bookmarked steps stay usable on phone and desktop | Documentation, Shopify and WooCommerce suites |
| Legal and references | Approved provisions, exact sources and licence notices; excluded tables never reappear | Legal, standards and reference-release checks |
| Public/private file boundary | Only approved website assets and runtime outputs are packaged; raw source/build records remain unavailable | Publication classifier, boundary and package checks |
| Runtime | No local account, payment, API or database runtime; only the approved Edge boundary and protected Emails handler | Architecture, security and package checks |

Follow [PAGE_PAINT_STANDARDS.md](PAGE_PAINT_STANDARDS.md) for responsive and loading observations. Test the affected behaviors rather than mirroring implementation details. A change to shared code may affect several feature families.

Use [TEST_AND_EVIDENCE.md](TEST_AND_EVIDENCE.md) for commands and result reporting. Provider account flows, live payments, legal approval and actual visitor performance are separate checks and cannot be inferred from these tests.
