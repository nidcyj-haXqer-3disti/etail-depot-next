import type { BlogArticle } from "./content";

export const oldPaymentLinksArticle: BlogArticle = {
  "path": "/company/blog/payment-links-after-processor-switch",
  "title": "Your old payment links can keep selling after you have moved on",
  "description": "Changing the main checkout does not replace the links already sitting in a customer’s inbox or on a printed QR code.",
  "summary": "Payment links in invoices, messages and QR codes can outlive a processor switch. Plan which remain valid, how customers receive replacements and how duplicate payment is prevented.",
  "searchTitle": "What happens to payment links when you switch processors?",
  "relatedPaths": [
    "/company/blog/how-to-create-a-payment-link",
    "/company/blog/switch-payment-processors"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "follow-the-link",
      "title": "Follow the customer’s copy"
    },
    {
      "id": "preserve-one-payment",
      "title": "Give the invoice one payment outcome"
    }
  ],
  "sources": [
    {
      "label": "Stripe: Sharing payment links and QR codes",
      "href": "https://docs.stripe.com/payment-links/share"
    },
    {
      "label": "Trolleys: Ending the service",
      "href": "/company/legal/merchant-services#termination"
    }
  ]
};
