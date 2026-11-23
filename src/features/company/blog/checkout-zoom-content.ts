import type { BlogArticle } from "./content";

export const checkoutZoomArticle: BlogArticle = {
  "path": "/company/blog/checkout-text-zoom",
  "title": "Checkout should still work when customers enlarge the text.",
  "description": "When customers enlarge checkout text, keep the price, field meaning and purchase action usable. Space can change without removing what the buyer needs.",
  "summary": "If enlarging checkout hides the total or clips a field label, the design has lost information, not just space.",
  "searchTitle": "Checkout Text Zoom: Keep Prices and Controls Usable",
  "relatedPaths": [
    "/company/blog/mobile-checkout-keyboard-errors",
    "/company/blog/screen-reader-payment-options"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "content-can-move",
      "title": "Let the layout change before the meaning does."
    },
    {
      "id": "read-and-complete",
      "title": "Review a purchase, not an isolated heading."
    }
  ],
  "sources": [
    {
      "label": "W3C: Understanding Resize Text",
      "href": "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html"
    },
    {
      "label": "W3C: Understanding Reflow",
      "href": "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html"
    },
    {
      "label": "Trolleys: Clear purchase details before payment",
      "href": "/company/legal/merchant-services#acceptance"
    }
  ]
};
