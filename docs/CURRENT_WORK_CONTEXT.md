# Current work context

This is the single current status record. Update this document for active scope and release status; retain detailed evidence in the relevant receipt. Historical logs are in [archive/project-history](../archive/project-history/).

## Repository restructure

Updated 8 November 2026. The user authorized Stage 4 of the [five-stage plan](plans/repository-restructure.json). This is local preparation only. No push, merge, deployment or remote settings change is authorized for this restructure.

| Stage | State | Record |
| --- | --- | --- |
| 1. Baseline and migration map | Complete | [File map](plans/repository-file-map.json), [URL map](plans/repository-route-map.json) |
| 2. Shared foundation and ACH pilot | Complete | [Stage 2 receipt](plans/repository-stage2.json) |
| 3. Remaining business features | Complete | [Stage 3 receipt](plans/repository-stage3.json) |
| 4. Engineering instructions and reviewed history | Complete | [Stage 4 receipt](plans/repository-stage4.json) |
| 5. Combined verification and release preparation | Pending | [Plan](plans/repository-restructure.json) |

The active branch is `codex/restructure-stage4-20261108`, based on Stage 3 commit `c5b665269de561ff3b544f60f13e40d875c5e208`. The last published baseline verified in Stage 1 is commit `e9e44fbebfde0f0ae6a7b5383c3400dfa632b1a5`, Netlify deploy `6aef58f5c8e79bce7be0b5b3`. This is a recorded baseline, not a claim that the live service was rechecked today.

The earlier working copy, including the unpublished future Developers feature, remains separate and unchanged. Do not copy it wholesale into this migration.

## Active website

- Exact scope: 3,752 content pages and 3,740 search-eligible URLs, recorded in [the release manifest](../tools/reference-release.json). The 12 legal/policy pages remain noindex and excluded from the sitemap.
- Page routes, content, pricing, eligibility, artwork, reference data, source notices and merchant handoffs remain unchanged by the restructure.
- Existing public areas are Home, Services, Use cases, Developers navigation, Resources, Pricing and Company. Vendor integration guidance currently belongs to Resources. Future Etail developer products require their own approval.
- Only the public website and approved vendor links run here. No merchant authentication, account application, payment processing, API, KYC, ledger or database runtime may be added.
- Sign in and registration use the fixed Welcome URL in [hosted services](../src/shared/site/hosted-services.ts), without forwarded input or referrers. Card applications remain closed.

## Verification state

Stage 3 passed all four release commands, 449 unit checks, 322 desktop/mobile journeys, 156 accessibility checks and 76 additional WebKit checks. One existing desktop skip covers a mobile-only scenario. All 3,752 generated page outputs matched the previous baseline; 86 captured views were pixel-identical. These are Stage 3 results, not Stage 4 or hosted verification.

Stage 4 is complete locally. All four required release commands passed, including 449 unit checks, 322 Chromium desktop/mobile journeys, 156 accessibility checks and production SEO for 3,740 sitemap URLs. One existing desktop skip covers a mobile-only case. All 3,752 generated page outputs match the prior baseline. All 246 moved or snapshotted files preserve their original bytes, including the grouped generator data; all 74 database-history files and 484 website/configuration inputs remain unchanged. All 138 active Markdown links resolve, and the guide generator reproduces 53 preview entries. Current top-level engineering documents were consolidated from 138 to 16. Source, build and package fingerprint: `870ca5d021acc29ded6360937f6c9927223e678712d5d410f960e2d45348c3d7`. The Stage 4 receipt records exact moves, checks and limits. This does not publish the restructure.

## Next work

Start Stage 5 only when requested. Stage 5 reviews the combined diff, runs final release checks and prepares a reviewable release. Push, merge and manual Netlify publication require applicable authorization separately.

The older SEO plans, product research and platform backlogs are historical. Search performance must be assessed from current evidence if requested. Magento/Adobe Commerce, custom-site integration guides, new APIs/SDKs and the unpublished Developers feature are separate future scopes; no completion or publication is implied here.

## Operating instructions

Use [source precedence](SOURCE_PRECEDENCE.md), [architecture](PUBLIC_SITE_ARCHITECTURE.md), [contributor workflow](../CONTRIBUTING.md), [page paint rules](PAGE_PAINT_STANDARDS.md), [file publication policy](FILE_PUBLICATION_POLICY.md) and the [Netlify runbook](NETLIFY_DEPLOYMENT.md). Exact allowed and denied targets remain in [project-targets.json](../project-targets.json).
