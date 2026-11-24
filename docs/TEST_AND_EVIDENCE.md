# Testing and evidence

[Acceptance criteria](ACCEPTANCE_TESTS.md) define the public behaviors to preserve. This document explains how to validate a candidate and record its limits. It does not restore the retired platform's database, financial or identity test suites.

## Commands

Use pinned Node and pnpm, the frozen lockfile and the existing Playwright configuration. Keep ports 3100 and 3101 free.

| Command | Scope |
| --- | --- |
| `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` | Source quality, types and behavioral units |
| `pnpm test:architecture`, `pnpm test:publication` | Allowed runtime, dependencies and source/asset placement |
| `pnpm build` then `pnpm test:e2e` | Current static preview with Chromium desktop/mobile journeys and mobile WebKit Blog regressions |
| `pnpm test:a11y` | Existing automated accessibility suite |
| `pnpm test:security` | Credential/exposure checks and dependency audit |
| `pnpm test:seo:production` | Exact approved indexing context, sitemap and negative hosting contexts |
| `pnpm package:netlify`, `pnpm verify:package` | Local package, source identity and exact deployment boundary |

For release candidates run, in order: `pnpm verify:public`, `pnpm test:seo:production`, `pnpm package:netlify`, `pnpm verify:package`. `pnpm verify` is their combined entry point. None publishes. GitHub uses the same required sequence.

The Blog WebKit project runs in local and CI verification. Use additional WebKit and responsive/loading checks for other pages when the changed behavior needs them. These are browser-engine checks, not tests on a physical iPhone or Safari device. The [paint standard](PAGE_PAINT_STANDARDS.md) specifies cold visits, refresh, delayed assets, split document delivery, early clicks and saved links.

The static page inventory in `public-boundary.spec.ts` waits for pending network work to settle after its explicit UI and image assertions, before forcing another full document load. It caches rendered section IDs so each bookmark does not cause a new reload. This settlement is an audit teardown barrier, not proof of application readiness or a performance requirement. Keep it out of interaction and timing tests. Keep full browser error names/stacks and all error assertions. For a WebKit access-control diagnostic, correlate document replacement, request type, native errors/rejections and server responses before classifying it; never ignore errors just because their wording mentions access control. The [upstream WebKit investigation](https://github.com/microsoft/playwright/issues/43120) explains why cancellation can carry that wording.

For documentation-only edits, check file destinations, linked paths, code examples and formatting. For moves, compare the original bytes, every active consumer and the resulting import/reference graph. Run broader application checks when tooling or packaging inputs change.

## Shared guidance scenarios

After a fresh `pnpm build`, run `pnpm exec playwright test tests/browser/guidance-journeys.spec.ts --project=desktop --project=mobile` for the account-access, WooCommerce and additional-DBA pilots. The suite follows Agents choices, checks the copied brief, opens its human guide and verifies the conditions and next action. It also checks Help's distinct website and DBA routes and all declared guide section anchors. Task-plan coverage verifies every step citation against the export, static-reference access with JavaScript disabled, keyboard disclosures and identical visible/copied/downloaded plans. Unit checks exercise prerequisite boundaries, all reachable outcomes, plan identity and source-change review coverage. Expected scenario conditions are explicit, not generated from the implementation being tested.

Review the actual wording alongside these checks. Run `pnpm review:guidance` for reference validation; use its optional `--skill-dir` only for a local private-skill review. Browser tests cannot establish that a merchant is approved, credentials work or a payment completed. Add responsive, WebKit and accessibility coverage for affected controls. This focused suite does not replace the release gates.

## Record what happened

Record the exact branch/commit or source fingerprint, commands, exit statuses, failures, corrections, reruns, test counts and skips. Include routes, viewport widths, browser engine and network conditions for UI work. Keep unredacted captures and detailed local artifacts out of Git. A sanitized source receipt can record hashes and results without embedding private originals.

Preserve the distinction between static checks over all generated URLs and browser checks over selected routes. A screenshot after load does not prove first-paint behavior. Automated accessibility does not establish complete accessibility; a simulated walkthrough is not human user research. Laboratory timings are not field performance.

Do not count older evidence as a new run, hide failures with blanket skips, or weaken a reproduced regression. A previous green CI run does not verify changed source. A PR merge, package or ready deployment does not establish merchant activation, successful payments or account-term acceptance.

Hosted HTTP checks use the separate health and boundary modes in the [Netlify runbook](NETLIFY_DEPLOYMENT.md#hosted-verification-and-netlify-error-reporting). Record the exact User-Agent/run ID and UTC window, expected 404/410 responses and unexpected failures separately. A matched HTTP status with missing security headers is still a failure. Keep exhaustive negative checks local; production error-rate totals must be investigated by request rather than presented as visitor failure percentages.

Hosted checks follow an authorized [manual release](NETLIFY_DEPLOYMENT.md) and are reported separately. The former platform test specification is retained in [history](../archive/project-history/docs/TEST_AND_EVIDENCE.md).
