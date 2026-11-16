import type { BlogArticle } from "./content";

/** Archive G1503, adapted with current discount, cost and price comparison guidance. */
export const ecommerceDiscountsArticle: BlogArticle = {
  path: "/company/blog/ecommerce-discounts",
  title: "Ecommerce discounts: protect contribution before promoting",
  description: "An ecommerce discount reduces the price paid, but its business value depends on the additional sales and costs it creates. Before launching a promotion, calculate the contribution per order, define eligibility and decide what result would justify the offer. More orders or a larger basket do not automatically mean more profit.",
  summary: "Calculate how ecommerce discounts affect contribution, test stacking and return rules, and measure results beyond revenue before repeating an offer.",
  searchTitle: "Ecommerce discounts: costs, margins and promotion rules",
  relatedPaths: ["/company/blog/choosing-an-ecommerce-shopping-cart-for-your-store", "/company/blog/create-an-online-shop"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "objective", title: "Give the discount a clear purpose" },
    { id: "math", title: "Calculate the contribution tradeoff" },
    { id: "rules", title: "Make the rules work in the cart" },
    { id: "evaluate", title: "Measure against a useful comparison" },
  ],
  sources: [
    { label: "Stripe: Ecommerce discount objectives and measurement", href: "https://stripe.com/resources/more/ecommerce-discounts" },
    { label: "US Small Business Administration: Fixed costs, variable costs and break even", href: "https://www.sba.gov/counseling/plan-your-business/" },
    { label: "Shopify: Discount combinations and calculation order", href: "https://help.shopify.com/en/manual/discounts/discount-combinations" },
    { label: "Federal Trade Commission: Former price comparisons", href: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233/section-233.1" },
  ],
};
