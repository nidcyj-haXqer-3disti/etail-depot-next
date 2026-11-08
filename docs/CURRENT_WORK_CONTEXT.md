# Current work context

This is the single current status record. Update this document for active scope and release status; retain detailed evidence in the relevant receipt. Historical logs are in [archive/project-history](../archive/project-history/).

## Repository restructure

Updated 8 November 2026. The user authorized a further audit of all five stages of the [five-stage plan](plans/repository-restructure.json). This is local preparation only. No push, merge, deployment or remote settings change is authorized for this restructure.

| Stage | State | Record |
| --- | --- | --- |
| 1. Baseline and migration map | Complete | [File map](plans/repository-file-map.json), [URL map](plans/repository-route-map.json) |
| 2. Shared foundation and ACH pilot | Complete | [Stage 2 receipt](plans/repository-stage2.json) |
| 3. Remaining business features | Complete | [Stage 3 receipt](plans/repository-stage3.json) |
| 4. Engineering instructions and reviewed history | Complete | [Stage 4 receipt](plans/repository-stage4.json) |
| 5. Combined verification and release preparation | Complete locally | [Stage 5 receipt](plans/repository-stage5.json) |

The active branch is `codex/association-review-20261108`, based on the completed audit commit `a7f4d1f706a9d54dfad6c83683b9dc87db79fd10`. The last published baseline verified in Stage 1 is commit `e9e44fbebfde0f0ae6a7b5383c3400dfa632b1a5`, Netlify deploy `6aef58f5c8e79bce7be0b5b3`. Stage 5 read-only GitHub and Netlify checks confirmed that both main and the current published deploy still point to this baseline. No remote settings were changed.

The earlier working copy, including the unpublished future Developers feature, remains separate and unchanged. Do not copy it wholesale into this migration.

## Active website

- Exact scope: 3,752 content pages and 3,740 search-eligible URLs, recorded in [the release manifest](../tools/reference-release.json). The 12 legal/policy pages remain noindex and excluded from the sitemap.
- Page routes, content, pricing, eligibility, artwork, reference data, source notices and merchant handoffs remain unchanged by the restructure.
- Existing public areas are Home, Services, Use cases, Developers navigation, Resources, Pricing and Company. Vendor integration guidance currently belongs to Resources. Future Etail developer products require their own approval.
- Only the public website and approved vendor links run here. No merchant authentication, account application, payment processing, API, KYC, ledger or database runtime may be added.
- Sign in and registration use the fixed Welcome URL in [hosted services](../src/shared/site/hosted-services.ts), without forwarded input or referrers. Card applications remain closed.

## Current association review

The [folder, URL and ownership review](plans/repository-association-review.json) is complete locally. The current [repository guide](REPOSITORY_GUIDE.md) maps business areas to addresses and actual implementation folders.

One existing navigation mismatch was corrected: `/docs/merchant-onboarding` is listed under Resources, but the broader `/docs` match highlighted Developers. The header now uses the most specific matching destination. Menu labels, public URLs, content and artwork remain unchanged. Six empty retired source directories were removed locally; no tracked files were deleted.

All 3,752 public URLs map to 52 current route modules and their feature owners. The scan checked 156,211 internal link occurrences, 11,830 distinct local destinations including anchors, and 114 referenced local assets without missing targets. Shared merchant legal content and generated references do not require a separate source folder or file for every URL. Existing Developers navigation still leads to vendor documentation under Resources; future Etail APIs/SDKs remain outside this scope.

## Verification state

All four release commands passed on this follow-up: 452 unit checks, 322 Chromium desktop/mobile checks, 156 accessibility checks, production SEO, packaging and package verification. One existing desktop skip covers a mobile-only scenario. Two focused WebKit checks passed. The corrected menu was verified at 320, 390, 768, 1024 and 1280 pixels, including refresh. The dependency audit reported no known vulnerabilities. The first supplementary WebKit run used the wrong build context; its unchanged preview assertion passed after rebuilding the preview. Production SEO and packaging were then restored and verified again, with the initial failure retained in the receipt.

The targeted unit checks reproduced the old mismatch before the correction. All 3,752 page outputs retain their content, semantic structure, metadata, links and anchors; compiled classes/scripts are excluded from that comparison, and the intentional menu highlight change is checked separately. The import graph has 1,016 resolved local edges, no unexpected missing imports and no runtime cycles. Current documentation links and shared tool/CI/Netlify connections resolve.

Source, build and package fingerprint: `a436d2c137503ef8536f6154579af41e754e50fa5be18af92b7a71a45c96542d`. Production retains 3,740 sitemap URLs, 12 noindex legal/policy pages and 18,945 packaged static files, one public Edge boundary and the existing protected Emails handler. No push, PR, merge or deployment occurred.

The earlier [five-stage audit](plans/repository-audit.json) and Stage 5 visual comparisons remain evidence for their recorded pre-fix candidate. They are not presented as new visual tests of this follow-up. External provider operation and hosted behavior of the next deployment remain separate checks.

## Next work

The five local restructure stages and the association follow-up are complete. The updated local PR description and release procedure are ready for publication authorization. After authorization, use the exact reviewed candidate, pass upstream CI, review/merge and manually deploy through the existing Netlify Git build. Recheck hosted behavior after publication; local checks do not replace it.

The older SEO plans, product research and platform backlogs are historical. Search performance must be assessed from current evidence if requested. Magento/Adobe Commerce, custom-site integration guides, new APIs/SDKs and the unpublished Developers feature are separate future scopes; no completion or publication is implied here.

## Operating instructions

Use [source precedence](SOURCE_PRECEDENCE.md), [architecture](PUBLIC_SITE_ARCHITECTURE.md), [contributor workflow](../CONTRIBUTING.md), [page paint rules](PAGE_PAINT_STANDARDS.md), [file publication policy](FILE_PUBLICATION_POLICY.md) and the [Netlify runbook](NETLIFY_DEPLOYMENT.md). Exact allowed and denied targets remain in [project-targets.json](../project-targets.json).
