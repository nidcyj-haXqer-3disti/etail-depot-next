# D82 — concise service copy

16 September 2026 (Tokyo). The user is satisfied with the current experience and asks for less repetitive language in settings, payments and accounts. This is a bounded presentation pass over D81, not a new workflow or financial model.

## Changes

- Card dashboard: one page title, no generic welcome/intro repeated above it, and one Card history heading with its unfinished count and filters retained.
- Card settings: Account details and Notification preferences sit directly under the page heading. “Account status” becomes “Status”; “A total allowance for each card” becomes “Total allowance per card.” The unused-money action retains its unspent-balance restriction.
- Merchant settings: remove the repeated service eyebrow and payments-only context explanation from settings/directory pages. Keep one Business details heading, no second written network list below the network badges, and shorter terminal/access explanations. The account-wide payment switch keeps its separate terminal/link requirements and confirmation.
- Payments and money: remove the second channel introduction and “This terminal” from each row, while retaining terminal identity, channel use, status and scope. Remove the generic money-history subtitle.
- Profile: retain the name, preferred-name hint, verified sign-in email and security action; remove repeated profile/personal-details introductions. Profile remains separate from service settings.

## Boundaries

All actions, routes, API calls, capability checks, saved request identities, exact retry/recovery messages, total-allowance rules and separate card/merchant money remain unchanged. No schema migration, preview reset, authentication change or external mutation. Only four existing heading assertions are updated to the remaining accessible headings; no behavioral assertions are removed.

## Verification

- Independent read-only source review: no blocking issue or change to authority, money meaning or recovery found.
- `pnpm lint`: exit 0.
- `pnpm build`: exit 0 (production Next build, including TypeScript validation).
- Focused existing desktop/mobile and accessibility tests: exit 0, all 80 cases passed. This includes settings saves, profile concurrency, card management, payment channels, funding navigation and owner/recipient accessibility.
- Initial preserved-preview responsive capture: exit 0, all 120 states passed at 1440/390/320px, with 23 unchanged authorized projections. Visual review prompted a final reduction in repeated service/context labels and an embedded setup instruction that incorrectly sent users back to their current settings page. All 18 affected desktop/mobile cases pass on the final source. The final read-only capture also passes all 120 states, with zero accessibility/runtime/overflow failures and 23 unchanged projections. Source stayed unchanged during capture.

Verification artifacts: `artifacts/d82-copy-verification/` and `artifacts/d81-dashboard-preview-d82-copy-final/checks.json`. Final production build and scoped lint both exit 0. Manual visual review covers card settings, merchant overview/settings/channels and Profile at desktop and mobile widths.

D81 remains live. These local edits do not establish a new hosted deployment.
