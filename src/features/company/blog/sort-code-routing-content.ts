import type { BlogArticle } from "./content";

/** Archive G0287, adapted with current UK and US payment-detail guidance. */
export const sortCodeRoutingArticle: BlogArticle = {
  path: "/company/blog/sort-code-vs-routing-number",
  title: "Sort codes vs. routing numbers: UK and US bank details",
  description: "A UK sort code has six digits. A US routing number has nine. Both help route bank payments, but they belong to different systems and are not interchangeable. Use the details supplied for the receiving account and the payment service you intend to use.",
  summary: "Compare UK sort codes and US routing numbers, request the right international payment details and resolve forms that do not fit the recipient’s account.",
  searchTitle: "Sort codes vs. routing numbers: UK and US bank details",
  relatedPaths: ["/company/blog/routing-number", "/company/blog/ach-vs-wire-transfers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "local-details", title: "Use the details for the relevant banking system" },
    { id: "obtain", title: "Get complete instructions for the payment" },
    { id: "resolve", title: "Stop when a field does not fit" },
  ],
  sources: [
    { label: "Pay.UK: Sort code allocation and payment-system registration", href: "https://www.wearepay.uk/what-we-do/payment-systems/access-to-payment-systems/getting-started/sort-code-information/" },
    { label: "NatWest: Finding a sort code and account number", href: "https://www.natwest.com/support-centre/view-or-change-your-details/find-account-details/where-can-i-find-my-account-number-and-sort-code.html" },
    { label: "American Bankers Association: US routing numbers", href: "https://www.aba.com/about-us/routing-number" },
    { label: "Bank of America: Domestic and international wire instructions", href: "https://info.bankofamerica.com/en/digital-banking/wire-transfers" },
    { label: "NatWest: IBANs and international payment details", href: "https://www.natwest.com/business/trade-finance/online-solutions-and-tools/iban.html" },
    { label: "FBI: Verifying changes to payment instructions", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
  ],
};
