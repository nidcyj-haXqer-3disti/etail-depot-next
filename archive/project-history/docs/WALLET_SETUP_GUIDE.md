# Ledgix wallet setup guide

D119 · 20 September 2026

The user wants the artwork to explain adding the virtual card to Apple Wallet or Google Wallet, rather than depict a large card in front of a generic phone. They supply the Ledgix logo at `/Users/yu/Downloads/logo 2.png`. Use that exact logo in the card artwork; do not replace the shared Etail Depot header identity.

## Official setup references

[Apple's setup guide](https://support.apple.com/en-us/108398), published 6 July 2026 and accessed 20 September 2026, distinguishes adding an eligible card in Wallet from issuer-specific app integrations. For a virtual card, show the manual route: open Wallet, use the add-card option, choose the debit/credit category, continue and enter the card's details. Follow any additional authentication requested by the issuer. Apple Pay also requires a compatible device, an Apple Account, device authentication and a supported card/region. Do not show photographing or tapping a physical card as the required virtual-card flow.

[Google's card setup guide](https://support.google.com/wallet/answer/12058983?hl=en), accessed 20 September 2026, shows adding a new payment card from Google Wallet, entering details, saving, reviewing issuer terms and completing verification if requested. [Google's verification guidance](https://support.google.com/wallet/answer/12098871?hl=en) makes verification issuer-dependent. [Contactless requirements](https://support.google.com/wallet/answer/12060043?hl=en) include a compatible NFC device, screen lock and supported payment configuration. A stored card is not by itself evidence that contactless setup is complete.

Confirmed Apple/Google support does not prove that a particular Ledgix portal has an in-app provisioning button. Google explicitly separates wallet-app setup from banking-app setup; Apple's issuer-app integration requires [the relevant entitlement](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/EntitlementKeyReference/ApplePayandPassKitEntitlements/ApplePayandPassKitEntitlements.html). This guide illustrates the documented wallet-app flow and does not invent a Ledgix portal integration or an issuer approval mechanism.

## Presentation and behavior

One reusable component serves the homepage and Cards page. Platform tabs select Apple Wallet or Google Wallet; three step controls explain **Add card**, **Verify** and **Use wallet**. The phone screen and adjacent instructions respond together. The third step is explicitly conditional on completed setup. Original illustrative screens are not provider screenshots and contain no card numbers, names, CVCs or verification codes.

Use the supplied blue/black logo unchanged on a light virtual-card face with the existing official Visa mark. Remove the preceding oversized foreground card, generic wordmark, decorative contour rendering and inactive styles. The new composition explains an action rather than suggesting an issued card.

The platform selector supports arrow keys, Home/End and roving focus. Step buttons have explicit show-step labels and pressed state. The panel is labelled by its selected platform, and changing instructions are announced politely. Illustrated controls inside the phone are noninteractive and hidden from assistive technology; real guide controls remain accessible. Nothing navigates to a wallet app, submits financial data, creates an account or persists state.

Cards remain coming soon, with Apple Wallet and Google Wallet only. Visa secured credit, collateral/repayment separation, existing inquiries, payment marketing, site chrome and provider boundaries remain.

## Brand asset provenance

- Source: user-supplied `logo 2.png`, PNG RGBA, 512 × 182.
- Website copy: `public/brand/ledgix-logo.png`; copied byte-for-byte without recoloring, cropping or regeneration.
- Both SHA-256 hashes: `3fb7074bbcb4c1a09c72862533749a91bc2e0313ffa8c2575551f0cb899a1c76`.

The artwork uses HTML/CSS/SVG with this supplied raster logo. No image generation, wallet provisioning, vendor configuration or deployment occurs. Actual validation and visual review are recorded in current status.

## D120 — official wallet payment marks

20 September 2026. The user requests Apple Pay and Google Pay logos inside the wallet illustration. Use the official, unchanged SVG acceptance marks in the selected phone, below the Ledgix card, in each guide state. Keep Apple Wallet / Google Wallet as the app-selector labels; the Pay marks identify payment capability and are not provisioning buttons. Replace the generic circular card/lock/tap decoration without changing the documented instructions or interactions.

| Asset | Official source and archive entry | SHA-256 |
| --- | --- | --- |
| `public/brand/wallets/apple-pay.svg` | [Apple marketing archive](https://developer.apple.com/apple-pay/marketing/Apple-Pay-Mark.zip), `Apple Pay Mark/SVG/Apple_Pay_Mark_RGB_041619.svg` | `66baf110b86c1f1ae01a0e28985970d3827465e6aba6be54d5142a6d1eaa803c` |
| `public/brand/wallets/google-pay.svg` | [Google acceptance archive](https://developers.google.com/static/pay-wallet/products/api/download-assets/Google-Pay-Acceptance.zip), `Google-Pay-Acceptance/Google-Pay-Acceptance/Google Pay Mark/google-pay-mark_800.svg` | `9ddde73a0e3e8b16e7c518f00380c542c96dbec8b0f80363d5037d905f0bba9d` |

Both assets were retrieved from the links in [Apple's marketing guidance](https://developer.apple.com/apple-pay/marketing/) and [Google's brand guidelines](https://developers.google.com/pay-wallet/products/api/web/guides/best-practices/brand-guidelines). Preserve their colors, borders and aspect ratios. Both visible marks are 32px high: Google's source has built-in clear space, so its SVG element is 59.36px high. A 60px layout slot preserves the built-in Google space and gives Apple 14px above/below, exceeding Apple's one-quarter-height marketing clearance. Neither mark receives a filter, recolor, shadow or click action. This marketing artwork remains conditional on the forthcoming card service and does not establish activation or issuer artwork approval.

## D124 — prevent the previous wallet logo flashing during a switch

21 September 2026. The user reports Apple Pay appearing briefly after selecting Google Wallet. The shared guide reused a single image while changing its source and sizing. Keep two stable, eagerly loaded image elements and hide the inactive one using the same wallet state as the tabs and instructions. Each decoded image remains associated with its own wallet, so a slow replacement cannot retain the other wallet's pixels. Preserve the existing 60px slot, official assets, keyboard behavior, step reset and both page layouts. No timers, transitions, provider requests or additional state are introduced.

The regression covers the homepage and Cards on desktop and mobile. It intercepts and explicitly holds Google's initial asset request, verifies the selected logo is incomplete and does not reuse the decoded Apple element, switches back to Apple before releasing Google, and repeats warm switches. The image-identity assertion fails against the old build. A preliminary Chromium `currentSrc`-only assertion did not expose the transient visual issue; image identity is also checked to cover browsers retaining the prior bitmap. The final four wallet browser cases and six affected accessibility cases pass. Lint, TypeScript and production build pass; the Google state was also visually checked in the local in-app browser. Evidence: `artifacts/d124-checks/`.

The local preview runs on port 3100. This bug fix does not change database, account behavior, product copy or the current D122 deployment; publication is separate.
