# Testing and evidence

[Acceptance criteria](ACCEPTANCE_TESTS.md) define the public behaviors to preserve. This document explains how to validate a candidate and record its limits. It does not restore the retired platform's database, financial or identity test suites.

## Commands

Use pinned Node and pnpm, the frozen lockfile and the existing Playwright configuration. Keep ports 3100 and 3101 free.

| Command | Scope |
| --- | --- |
| `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` | Source quality, types and behavioral units |
| `pnpm test:architecture`, `pnpm test:publication` | Allowed runtime, dependencies and source/asset placement |
| `pnpm build` then `pnpm test:e2e` | Current static preview with Chromium desktop/mobile journeys |
| `pnpm test:a11y` | Existing automated accessibility suite |
| `pnpm test:security` | Credential/exposure checks and dependency audit |
| `pnpm test:seo:production` | Exact approved indexing context, sitemap and negative hosting contexts |
| `pnpm package:netlify`, `pnpm verify:package` | Local package, source identity and exact deployment boundary |

For release candidates run, in order: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify`, `pnpm verify:package`. `pnpm verify` is their combined entry point. None publishes. GitHub uses the same required sequence.

Use additional WebKit and responsive/loading checks when the changed behavior needs them. WebKit is additional local coverage, not part of the current Chromium CI projects. Do not describe it as an actual iPhone or Safari-device test. The [paint standard](PAGE_PAINT_STANDARDS.md) specifies cold visits, refresh, delayed assets, split document delivery, early clicks and saved links.

For documentation-only edits, check file destinations, linked paths, code examples and formatting. For moves, compare the original bytes, every active consumer and the resulting import/reference graph. Run broader application checks when tooling or packaging inputs change.

## Record what happened

Record the exact branch/commit or source fingerprint, commands, exit statuses, failures, corrections, reruns, test counts and skips. Include routes, viewport widths, browser engine and network conditions for UI work. Keep unredacted captures and detailed local artifacts out of Git. A sanitized source receipt can record hashes and results without embedding private originals.

Preserve the distinction between static checks over all generated URLs and browser checks over selected routes. A screenshot after load does not prove first-paint behavior. Automated accessibility does not establish complete accessibility; a simulated walkthrough is not human user research. Laboratory timings are not field performance.

Do not count older evidence as a new run, hide failures with blanket skips, or weaken a reproduced regression. A previous green CI run does not verify changed source. A PR merge, package or ready deployment does not establish merchant activation, successful payments or account-term acceptance.

Hosted checks follow an authorized [manual release](NETLIFY_DEPLOYMENT.md) and are reported separately. The former platform test specification is retained in [history](../archive/project-history/docs/TEST_AND_EVIDENCE.md).
