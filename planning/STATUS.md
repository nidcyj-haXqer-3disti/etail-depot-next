# Current project status

## D333 — production integration and deployment in progress

21 October 2026 JST. User authorization: “lets deploy it.” PR #52 integrates the accepted D331 twenty-guide/ten-section website into the existing public application. The inactive review bundle remains recoverable in commit f826e469617b996b1df26df960133a6177013c06. No additional content batch is included.

The candidate has27 exact pages and25 production-gated discovery URLs. New articles receive canonical/social metadata and factual WebPage/Breadcrumb schema. Significant guide/hub revision dates use actual UTC2026-10-20. Local/preview, legal, navigation payload,404 and retired-route protections remain. The library remains browse-only, with all20 ordinary article links rendered without JavaScript.

### Verification record

- Independent source review: all20 article bodies,26 accepted CSS files and15 original public assets match the accepted source.45 protected product/configuration/dependency files remain unchanged. No API, database or dynamic route was introduced.
- Rendered parity: all27 page bodies and16 image responses match the accepted D331 preview; desktop/mobile release screenshots captured. No browser exceptions.
- Initial release attempts recorded: pnpm's candidate-relative store path needed a local cache link; then five outdated four-guide unit assertions required the already planned test update. A new image-check test needed an HTMLImageElement type guard. Browser tests exposed an obsolete search-input assertion and a navigation assertion that did not wait for the URL. These are test/setup corrections; article bodies and artwork were not changed.
- Final local gates passed: lint, lint-tooling checks, TypeScript, 362 unit tests, architecture/build, 115 browser passes with one pre-existing intentional skip, 87 accessibility cases, source security and dependency audit with zero known vulnerabilities. The four corrected browser cases passed on rerun; the remaining 111 had already passed. Production SEO validates 25 eligible URLs and all preview/legal/retirement protections. Packaging verifies 27 static pages, 192 static files, one Edge boundary and only the protected platform email handler.
- Rendered screenshots confirm the restored homepage photograph, clean library at 390px and readable article layout at 320px. These are browser viewport tests, not physical-device testing.
- GitHub exact-head CI, review and hosted acceptance remain required before publication. The release source/tree and final hosted outcome will be recorded in the PR and local release receipt.

### Publication boundary

The verified prior production deploy is6ad7328696e3c17590534f57 at source2097a2da9660cb537ee061d25aeac6e9816ea419. It remains live until the new manual Git build is verified. No direct-to-main work, force-push, DNS change, database/Identity change or email-extension setting change is included. Publication is not a guarantee of search indexing/ranking.

Detailed local evidence: artifacts/d333-release/independent-source-review.json, parity.json and verification logs. Generated evidence is not deployed. Earlier records remain in Git history and docs/DECISIONS.md.

[Previous detailed status history](https://github.com/nidcyj-haXqer-3disti/etail-depot-next/blob/2097a2da9660cb537ee061d25aeac6e9816ea419/planning/STATUS.md)
