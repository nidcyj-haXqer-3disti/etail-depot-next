import type { BlogArticle } from "./content";

/** Archive G0001, adapted for the Company Blog. Account enablement is a separate step. */
export const paymentLinkArticle: BlogArticle = {
  path: "/company/blog/how-to-create-a-payment-link",
  title: "How to create and share a payment link",
  description: "Agree on the purchase and amount, create a payment link, then send it to your customer. They open the payment page and enter their payment details there.",
  summary: "What to prepare before sending a payment link, how to share it by message or QR code, and how to confirm the payment afterward.",
  searchTitle: "How to create and share a payment link",
  relatedPaths: [
    "/company/blog/what-your-payment-provider-is-really-saying-yes-to",
    "/company/blog/how-etail-depot-handles-risk",
  ],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "before-you-begin", title: "Before you begin" },
    { id: "create-the-request", title: "Create the request" },
    { id: "check-before-sending", title: "Check the payment page" },
    { id: "share-the-link", title: "Share the link or QR code" },
    { id: "confirm-the-payment", title: "Confirm the payment" },
    { id: "payment-link-fees", title: "Check the fees" },
  ],
  sources: [
    { label: "Cybersource: Pay by Link requirements", href: "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-intro.html" },
    { label: "Cybersource: Using the Business Center", href: "https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-ebc-intro.html" },
    { label: "Etail Depot: Pricing and additional fees", href: "/pricing" },
    { label: "Etail Depot: Payouts and reserves", href: "/company/legal/payouts-and-reserves" },
  ],
};
