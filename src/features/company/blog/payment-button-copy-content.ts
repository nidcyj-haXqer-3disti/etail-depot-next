import type { BlogArticle } from "./content";

export const paymentButtonCopyArticle: BlogArticle = {
  "path": "/company/blog/checkout-button-pay-or-review",
  "title": "Does this button buy it, or let me look at it?",
  "description": "The action on a checkout button should match what happens next. Separate review, payment approval and order confirmation so customers can commit confidently.",
  "summary": "A reassuring label becomes misleading if the next click does more than the customer expects.",
  "searchTitle": "Checkout Button Wording: Pay Now or Review Order?",
  "relatedPaths": [
    "/company/blog/payment-confirmation-pages",
    "/company/blog/wallet-buttons-checkout-design"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Google Pay: Transaction and checkout options",
      "href": "https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo"
    },
    {
      "label": "Google Pay: Purchase flow and button placement",
      "href": "https://developers.google.com/pay/api/web/guides/ux-best-practices"
    },
    {
      "label": "Trolleys: Purchase terms and payment results",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
