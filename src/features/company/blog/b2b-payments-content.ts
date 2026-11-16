import type { BlogArticle } from "./content";

/** Archive G0049, adapted with current payment network and business record guidance. */
export const b2bPaymentsArticle: BlogArticle = {
  path: "/company/blog/b2b-payment-methods",
  title: "B2B payment methods: choosing how to pay and get paid",
  description: "B2B payments move money between businesses. Choose a method both sides can use, then agree on the amount, due date and invoice references. This article covers US business payments; requirements for international payments depend on the countries and providers involved.",
  summary: "Compare ACH, wires, cards and checks for business payments. Connect each payment to its invoices, verify changed instructions and plan for exceptions.",
  searchTitle: "B2B payment methods: ACH, wires, cards and checks",
  relatedPaths: ["/company/blog/ach-vs-wire-transfers", "/company/blog/customer-reference-in-credit-transfers"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "method-workflow", title: "Connect the payment to the invoice" },
    { id: "compare", title: "Compare the methods you can use" },
    { id: "example", title: "Match one payment to two invoices" },
    { id: "controls", title: "Verify changed payment instructions" },
    { id: "automation", title: "Test automation with a payment that goes wrong" },
  ],
  sources: [
    { label: "Nacha: ACH credits, debits and business payment information", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Federal Reserve: How Fedwire transfers work", href: "https://www.federalreserve.gov/paymentsystems/fedfunds_about.htm" },
    { label: "Visa: Virtual cards for business payments", href: "https://www.visa.com/en-us/business/cards/virtual-card" },
    { label: "FBI: Verify payment requests and account changes", href: "https://www.fbi.gov/how-we-can-help-you/common-frauds-and-scams/business-email-compromise" },
    { label: "IRS: Supporting records for business transactions", href: "https://www.irs.gov/businesses/small-businesses-self-employed/what-kind-of-records-should-i-keep" },
  ],
};
