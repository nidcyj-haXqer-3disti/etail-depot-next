import type { BlogArticle } from "./content";

/** Archive G0275, adapted around buying the missing checkout capability without duplicating existing software. */
export const posReaderArticle: BlogArticle = {
  path: "/company/blog/pos-vs-card-readers",
  title: "Before you buy a POS system, count what you already have",
  description: "POS system or card reader? Start with the software you already use, then compare payment connections, compatibility and the full cost of running checkout.",
  summary: "A new way to take cards does not always require a new way to run the business. Find the missing capability before buying another system.",
  searchTitle: "POS system vs. card reader: what does your business need?",
  relatedPaths: ["/company/blog/accept-payments-online-and-in-person", "/company/blog/switch-payment-processors"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: POS software and card reader functions", href: "https://stripe.com/resources/more/pos-vs-card-readers" },
    { label: "Adyen: Taking payments on a standalone terminal", href: "https://docs.adyen.com/point-of-sale/standalone/standalone-use" },
    { label: "Stripe: Running POS apps on smart readers", href: "https://docs.stripe.com/terminal/features/apps-on-devices/overview" },
    { label: "Stripe: Reader compatibility and software updates", href: "https://docs.stripe.com/terminal/smart-readers" },
    { label: "PCI SSC: Terminal approval and merchant compliance", href: "https://www.pcisecuritystandards.org/faqs/1301/" },
  ],
};
