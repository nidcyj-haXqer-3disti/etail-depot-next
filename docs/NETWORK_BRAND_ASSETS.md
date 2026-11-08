# Brand asset provenance

20 September 2026. The user requests real card-network marks in place of text approximations. This presentation change uses artwork published by the networks and served from `public/brand/networks/`. Original source bytes are copied without redrawing, recoloring, tracing, filtering or changing the artwork’s proportions. Blue and white Visa marks are separate official variants.

## Provenance

### Visa

Official reference pages: [Visa brand resources](https://corporate.visa.com/en/about-visa/brand.html) and [Visa Brand Mark downloads](https://globalclient.visa.com/brand-mark-ty).

Source archive: [Visa Brand Mark DIGITAL 2025](https://usa.visa.com/content/dam/VCOM/Brand/visa-brand-mark-digital-2025.zip).

| Local asset | Exact archive member | SVG viewBox |
| --- | --- | --- |
| `public/brand/networks/visa-blue.svg` | `Visa Brand Mark DIGITAL 2025/Visa Brand Mark DIGITAL/VBM_digital_2025/blue/VBM_bluRGB_2025.svg` | `0 0 278.075 169.374` |
| `public/brand/networks/visa-white.svg` | `Visa Brand Mark DIGITAL 2025/Visa Brand Mark DIGITAL/VBM_digital_2025/white/VBM_whtRGB_2025.svg` | `0 0 278.075 169.374` |

Keep the supplied canvas and clear space. The white variant is used on dark card artwork; it is not a CSS color conversion of the blue mark.

### Mastercard

Source page: [Mastercard Developers](https://developer.mastercard.com/). Its developer-site JavaScript at the recorded review references the [official Mastercard circles SVG](https://developer.mastercard.com/img/logo_mastercard_circles.svg).

Local asset: `public/brand/networks/mastercard.svg`, viewBox `0 0 126 82.8`. The transparent SVG preserves the original colored symbol and replaces the initially considered 114-pixel developer-site PNG. The PNG is not the final application asset.

### American Express

Source page: [American Express Technology](https://americanexpress.io/). Its HTML references the [American Express Blue Box SVG](https://www.aexp-static.com/cdaas/one/statics/axp-dls/5.11.3/package/dist/img/dls_logos/dls-logo-bluebox-solid.svg).

Local asset: `public/brand/networks/american-express.svg`, source dimensions `45 × 45`, viewBox `0 0 45 45`. Preserve the blue square and white lettering together. The network’s [communication guidelines](https://secure.americanexpress.com.bh/merchants/website-assets/downloads/American_Express_Guidelines.pdf) describe a 40-pixel minimum for the small primary Blue Box; the shared component displays it at 40 pixels or larger with surrounding space. The PDF’s indexed official text was available during research; direct retrieval was unavailable.

### Discover

Source page: [Discover acceptance marks and logos](https://www.discoversignage.com/free-signage-logos), linked by the official [Discover Network acceptance page](https://www.discoverglobalnetwork.com/our-network/reach-and-acceptance/).

Original file: [Discover primary full-color horizontal acceptance mark](https://www.discoversignage.com/uploads/DGN_AcceptanceMark_FC_Hrz_RGB.jpg). Local asset: `public/brand/networks/discover.jpg`, dimensions `521 × 342`, 44,163 bytes. This is the complete acceptance mark, not the corporate Discover Global Network wordmark or a multiple-network strip.

The official page lists digital EPS, JPG and PNG downloads. The download metadata endpoint returned HTTP 403, so no alternate download was inferred. No public primary SVG was verified. The directly published high-resolution JPG is used unchanged; it is not retraced or represented as a vector.

The [Discover brand guidelines](https://www.discoversignage.com/uploads/09-12-21_03%3A59_DGN_BG_10052021_AccMk.pdf), pages 22–25, prefer the horizontal acceptance mark, require preserving the complete artwork, and describe clear space equal to two Discover “O” diameters. The original canvas and aspect ratio are retained; placement review must consider the visible mark and its surrounding space.

## Final application asset checksums

SHA-256 values of the copied files:

```text
733ef827287b926d3bd37907787859f810ef44ad9fc09f0252661d58c44e22c1  visa-blue.svg
c06c40f5cf35db969561ecf666a1fb6cca23dd32b828b4eab1270eed62bb516b  visa-white.svg
fe9a054d50d922d5cee163ddb34b83f1916bb37d47d4e0578422038e6cfefbe8  mastercard.svg
c54acb431126b02f6f21433f327386a4cd637ef846267cc2cad712c47d3ce162  american-express.svg
58b4e184ad6f0cb180124a62eaf94ff9d692a1939b65532d8c5e265e3486bebc  discover.jpg
```

Public assets are served locally rather than hotlinked, so displaying a mark does not request the visitor’s browser to contact a network website. Original research captures are local evidence, not required repository inputs.

## Current implementation

Shared marks live in [network-brands.tsx](../src/shared/brand/network-brands.tsx), [brand-image.tsx](../src/shared/brand/brand-image.tsx) and their styles in `src/shared/brand/`. [The brand generator](../tools/generate-inline-brand-images.mjs) maintains embedded assets. Preserve exact bytes and aspect ratios, including fractional SVG view boxes. Follow [the page paint standard](PAGE_PAINT_STANDARDS.md).

Etail logo originals were supplied by the user and are preserved with their [original note](../archive/retired-platform/assets/brand/README.md). Current approved public copies remain in `public/brand/`; shared component assets remain in `src/shared/brand/assets/`. Trolleys attribution uses the shared brand component. No new brand artwork or permission is established by this reorganization.

Network provenance does not establish Etail sponsorship, program activation or approval. Public capability wording comes from approved company facts, not from displaying a logo. The earlier asset-verification results are preserved in [the dated record](../archive/project-history/docs/NETWORK_BRAND_ASSETS.md); they are not new verification results.
