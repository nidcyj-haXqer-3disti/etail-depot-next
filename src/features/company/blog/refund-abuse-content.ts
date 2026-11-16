import type { BlogArticle } from "./content";

/** Unpublished archive G0748, adapted around targeted refund controls and legitimate customer remedies. */
export const refundAbuseArticle: BlogArticle = {
  path: "/company/blog/refund-abuse",
  title: "Before you make refunds harder for everyone",
  description: "Refund abuse can cost a business money, but a rising return count is not proof. Find the cause, control duplicate credits and keep legitimate customer remedies accessible.",
  summary: "A stricter policy can reduce the number of requests without fixing the reason customers complained. Protect the sale by checking what happened before changing how everyone is treated.",
  searchTitle: "Refund abuse: protect revenue without punishing customers",
  relatedPaths: ["/company/blog/partial-refunds", "/company/blog/friendly-fraud"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "Stripe: Refund abuse, review and legitimate customers", href: "https://stripe.com/resources/more/refund-abuse" },
    { label: "Stripe: Refund history, destinations and outcomes", href: "https://docs.stripe.com/refunds" },
    { label: "Stripe: Responding to the actual dispute claim", href: "https://docs.stripe.com/disputes/responding" },
    { label: "Etail Depot: Customer remedies, refunds and dispute responsibilities", href: "/company/legal/merchant-services" },
  ],
};
