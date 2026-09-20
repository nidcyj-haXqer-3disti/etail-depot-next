# D90 — public footer navigation

20 September 2026. The user requests a more conventional financial-services footer. Supersede the D86/D87 requirement to repeat the header layout in the footer, while preserving Etail branding, colors and page gutters.

## Presentation

One public footer: brand and a short product description, grouped Services / Support / Account links, then a quiet copyright row. Every link uses an existing destination. Keep personal profile and dashboard navigation out of the footer; authenticated pages retain no footer. Preserve the header and the single Sandbox badge.

The user will provide approved Privacy Policy and Terms URLs. Add them to the lower row when supplied. Do not invent legal policies, company information, contact details, certifications, social destinations or nonfunctional cookie controls to fill space. The lower row supports links without changing the main grid.

## References

Reviewed the public [Stripe homepage](https://stripe.com/en-jp) and [American Express homepage](https://www.americanexpress.com/en-us/) on 20 September 2026 for service/support organization. Their extracted pages do not expose complete footers. The [Stripe marketplace](https://marketplace.stripe.com/apps/make) exposes separate support and terms/privacy resources; adapt the grouping principle to Etail's available content, without claiming exact footer parity or importing another company's policy text.

## Acceptance

Verify production build, lint, existing public browser/accessibility checks, responsive footer spacing and target sizes, working destinations and keyboard focus. Check the actual refreshed local page. No financial, identity, database, provider or hosted change is included. Preserve D87–D89 and the published D86 baseline.

## Local verification

Production build and focused lint pass with exit 0. All 40 existing public desktop/mobile/accessibility and account-menu checks pass, including the absence of footers on authenticated pages. Logs: `artifacts/d90-checks/{build,lint,browser}.log`. No existing tests were weakened or new tests added for static presentation alone.

Reviewed the refreshed local browser footer at 1440, 800, 520, 390 and 320 pixels. All seven links (brand plus six navigation links) remain inside the viewport with 44-pixel target height; no horizontal overflow. Keyboard focus remains visible and follows the displayed navigation. Desktop and phone screenshots confirm the grouped layout and matching page gutters. The temporary viewport override was reset and the existing landing tab refreshed for the user.

The completed layout is local. Approved Privacy Policy and Terms links remain pending from the user; existing account information, application behavior and the D86 deployment are unchanged.
