import type { BlogArticle } from "./content";

/** Archive G1419, adapted with current donation, acknowledgment and recordkeeping guidance. */
export const nonprofitDonationsArticle: BlogArticle = {
  path: "/company/blog/accepting-donations-online-as-a-nonprofit",
  title: "Accepting donations online as a nonprofit",
  description: "A donor gives to a named campaign, but the bank deposit combines several gifts after fees. The nonprofit still needs to know whom to thank, which restrictions apply and what to acknowledge. For a US nonprofit, an online donation process has to preserve those details as well as collect the money.",
  summary: "Plan online donations for a US nonprofit, with clear donor choices, recurring gift controls, payment records and charitable acknowledgments.",
  searchTitle: "Accepting donations online as a nonprofit",
  relatedPaths: ["/company/blog/ecommerce-payment-processing", "/company/blog/how-recurring-ach-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "define-gift", title: "Define what the donor is agreeing to" },
    { id: "follow-money", title: "Keep the gift separate from the deposit" },
    { id: "acknowledge", title: "Prepare an acknowledgment, not just a checkout message" },
    { id: "rehearse", title: "Rehearse the donor and staff journeys" },
  ],
  sources: [
    { label: "PayPal: Online donation tools and charity account setup", href: "https://www.paypal.com/us/brc/article/accepting-donations-online" },
    { label: "IRS: Check eligibility for deductible contributions", href: "https://www.irs.gov/charities-non-profits/tax-exempt-organization-search" },
    { label: "IRS: Written charitable acknowledgments", href: "https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-written-acknowledgments" },
    { label: "IRS: Payments that include goods or services", href: "https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-quid-pro-quo-contributions" },
    { label: "Stripe: Payouts, fees, refunds and transaction records", href: "https://docs.stripe.com/reports/payout-reconciliation" },
    { label: "FTC: Collecting and protecting personal information", href: "https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business" },
  ],
};
