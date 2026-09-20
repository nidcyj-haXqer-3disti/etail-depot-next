# Public product storytelling

> **Superseded by D114:** The user rejected this redesign and requested the D112 website back. This document preserves the rejected approach as review history. [Current artwork direction](MARKETING_ARTWORK_DIRECTION.md) is separate from the restored website.

> **D115 selective reuse:** The user subsequently selected only the two-step `PaymentJourneyArt` for the earlier Payments page. The remainder of this redesign stays superseded.

D113 · 20 September 2026

The user accepts the clean public pages but asks for a stronger presentation comparable to Stripe and American Express, then authorizes the coordinated redesign. Keep D112's company header, the accepted footer, restrained palette and public-only provider handoffs. Improve the product narrative and original artwork rather than add unconfirmed features, testimonials or service claims.

## Page roles

- **Homepage:** introduce both services together. A wide editorial heading sits above business photography and a separate Ledgix product composition. Photography has one message instead of overlapping branding, slogans and channel chips. Trolleys remains available now; Ledgix remains coming soon. A compact payment-use section and practical FAQs support discovery. The homepage retains D110's absence of duplicate action rows.
- **Payments:** lead with an illustrative request/share-to-checkout journey. One fixed studio-booking example explains the product without becoming a live form or claiming to reproduce a vendor screen. Seven accessible channel tabs remain, with more direct headings, a lighter frame and compact authentic network marks. A distinct account-management section explains payments, team access and support. All entry actions still use the approved Trolleys root with no referrer or forwarded user data.
- **Cards:** a single dark-green card composition replaces the generic stack and rings. Original linework, a detailed chip and the existing authentic Visa asset provide visual depth without card numbers, names or invented features. Explain the security deposit, purchase balance and upcoming account simply; keep availability and unconfirmed program details explicit. Contact goes to the approved Ledgix email.

The homepage uses a different composition from the two product pages. Type sizes, body line lengths, spacing, artwork color and compact closing sections keep them coherent without repeating the same large italic slogan and three-column grid throughout.

## Implementation

`consumer-site.css` owns these three page layouts. `PaymentJourneyArt` and `LedgixCardArt` own their static, responsive HTML/SVG artwork and scoped styles. The existing channel component owns its seven examples and keyboard state. Existing network artwork is reused without redrawing marks. Removed the old `ServiceArtwork` branch, stacked-card/ring CSS, photo overlays, three-step prose hero and obsolete layout props/styles. No new runtime dependency, data model, API, form, checkout or account workflow is introduced.

The accepted shared header and footer source and styling are unchanged. Help, Privacy and Terms retain their current bodies, metadata and legal scope. Existing databases, archived schema history, hosted identity and provider settings are untouched.

## Reference principles

The prior-turn review consulted [Stripe Payments](https://stripe.com/payments), [Stripe Payment Links](https://stripe.com/payments/payment-links) and [American Express Blue Cash Everyday](https://www.americanexpress.com/us/credit-cards/card/blue-cash-everyday/?refresh=1.0). The applicable principles are concrete product examples, clear customer outcomes, distinctive product artwork and accurate product detail. These are design references, not claims of feature parity, private architecture access or provider-interface verification.

## Verification

See the D113 entry in `planning/STATUS.md` for final executed checks, results and limits. Local evidence is in `artifacts/d113-checks/`. Website and illustration checks do not exercise vendor accounts or financial processing. Publication remains separate.
