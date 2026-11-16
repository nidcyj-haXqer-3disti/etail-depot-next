import type { BlogArticle } from "./content";

/** Archive G0129, adapted around the gap between verifying a PIN and charging the correct order amount. */
export const pinPadArticle: BlogArticle = {
  path: "/company/blog/how-a-pin-pad-terminal-works-for-card-payments",
  title: "The PIN can be right and the amount wrong",
  description: "How a PIN pad works, why an approved payment can still have the wrong amount, and what merchants should check when connecting a terminal to their checkout.",
  summary: "The customer enters the right PIN. The payment is approved. Neither tells you whether the amount keyed into the terminal matched the order.",
  searchTitle: "How a PIN pad works, and what it cannot check",
  relatedPaths: ["/company/blog/credit-card-swipes", "/company/blog/contactless-payments"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: PIN pads and the connection to checkout software", href: "https://stripe.com/resources/more/pin-pad-terminal-features-and-integration-explained" },
    { label: "Adyen: Online and offline PIN verification", href: "https://docs.adyen.com/point-of-sale/cardholder-verification-methods/" },
    { label: "Adyen: Standalone terminals and manual reconciliation", href: "https://docs.adyen.com/point-of-sale/standalone/" },
    { label: "Adyen: Entering payment amounts and correcting transactions", href: "https://docs.adyen.com/point-of-sale/standalone/standalone-use/" },
    { label: "PCI SSC: What device approval means for merchant security", href: "https://www.pcisecuritystandards.org/faqs/1301/" },
  ],
};
