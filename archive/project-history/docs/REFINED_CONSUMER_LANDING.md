# D87 — refined consumer landing

19 September 2026. The user accepts the existing content and matching header/footer, but asks for a substantially more polished landing page. This is a visual rebuild of `/`, not another product or financial redesign.

## Presentation contract

- Retain the existing message, service destinations, registration/sign-in paths and all seven payment channels. Keep the explicit network-credential disclosure and single Sandbox badge.
- Use a clear editorial hierarchy, warm neutral surfaces, evergreen accents and a focused product illustration. Distinct card and payment artwork should explain the two services without introducing new claims.
- Give the channel demonstration enough room to show the relationship between a shared request and card checkout. Preserve keyboard selection, touch targets and the existing inert illustrations.
- Retain the shared public header/footer. Scope the new style to the landing page; authenticated dashboards, profile/settings, commands and database do not change.
- Support narrow phones, intermediate widths and desktop without clipped text, horizontal scrolling or decorative elements intercepting actions. Use existing local assets and system fonts; do not add third-party page requests or animation dependencies.

## References and interpretation

Read the public [American Express homepage](https://www.americanexpress.com/) and [Stripe homepage](https://stripe.com/en-jp) on 19 September 2026. Their product hierarchy and distinct service destinations inform this layout. This is an original Etail design using its existing artwork/content, not a claim of private dashboard access or measured parity. Dynamic content and regional differences limit comparison.

## Implementation and acceptance

The owning files are `src/app/page.tsx` and `src/ui/consumer-home.css`. Shared interactive preview components continue to own selection and accessible semantics. Decorative product artwork is hidden from assistive technology; no card, terminal or payment command is added. No dependency, schema, financial model, seed, authentication or provider-setting change is required.

Acceptance requires lint, TypeScript and a production build, the existing public journey and accessibility tests, and actual responsive screenshot review including both service previews and all payment channels. Record failures/corrections and final evidence below. D86 remains the deployed revision; this task does not itself establish a new publication.

## Completed local verification

The final candidate passes the following checks on the pinned Node24.19.0 / pnpm11.19.0 runtime. Commands use the prepared local PostgreSQL test/preview environments; preview startup verifies preparation without migrating or seeding.

| Check | Result / evidence |
| --- | --- |
| `pnpm lint` | Exit0; `artifacts/d87-checks/lint.log` |
| `pnpm typecheck` | Exit0; `artifacts/d87-checks/typecheck.log` |
| `pnpm test:architecture` | Exit0; `artifacts/d87-checks/architecture.log` |
| `pnpm build` | Exit0; `artifacts/d87-checks/build-verified.log` |
| Existing `public-foundation.spec.ts` and `public-accessibility.spec.ts`, desktop/mobile/accessibility projects | All30 pass; `artifacts/d87-checks/browser-verified.log` |
| Guarded public capture | All27 states /42 screenshots pass at1440,390,320px, no accessibility, overflow or runtime errors, unchanged source during capture; `artifacts/d87-public-verified/visual/checks.json` |
| Both service previews and all7 channels at11 widths | All77 channel/layout states pass, including21 accessibility scans and35 screenshots; `artifacts/d87-checks/channel-verified/checks.json` |

Visual review covered the full desktop/mobile page, both service illustrations, product artwork, every channel on desktop, narrow phone presentations and the tablet breakpoints. It corrected the shared grid alignment, an inherited centered paragraph at680px, and focus-ring contrast on dark sections. The earlier passing runs/screenshots remain in `artifacts/d87-public-initial` and `artifacts/d87-checks/channel-review`; final evidence above follows those corrections. No tests were weakened or skipped to pass the redesign.

The production preview is available at `http://127.0.0.1:3100/`. Source identity is recorded in `artifacts/d87-review-source.json`. No hosted deployment, schema change, customer-data reset, financial command or authentication change is included. Full private financial integration and provider testing were not rerun for this homepage-only change. D86 remains the published revision.
