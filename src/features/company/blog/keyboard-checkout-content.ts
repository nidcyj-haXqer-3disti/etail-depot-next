import type { BlogArticle } from "./content";

export const keyboardCheckoutArticle: BlogArticle = {
  "path": "/company/blog/mobile-checkout-keyboard-errors",
  "title": "Does your checkout still work when the keyboard opens?",
  "description": "Mobile checkout needs to work while a customer is typing, correcting an error and reaching the next action. A narrow desktop preview cannot prove that.",
  "summary": "The important mobile layout is the one customers see with the keyboard open.",
  "searchTitle": "Mobile Checkout Keyboards: Errors, Postal Codes and Layout",
  "relatedPaths": [
    "/company/blog/optimize-your-mobile-checkout-experience",
    "/company/blog/checkout-text-zoom"
  ],
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [
    {
      "id": "typing-layout",
      "title": "Design for the space left after typing begins."
    },
    {
      "id": "postal-entry",
      "title": "A convenient keyboard must still contain the characters needed."
    }
  ],
  "sources": [
    {
      "label": "Chrome: Onscreen keyboards and viewport behavior",
      "href": "https://developer.chrome.com/blog/viewport-resize-behavior"
    },
    {
      "label": "WHATWG HTML: Why postal codes are not number inputs",
      "href": "https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number)"
    },
    {
      "label": "Google: Testing forms across devices",
      "href": "https://web.dev/learn/forms/cross-platform-testing"
    },
    {
      "label": "W3C WAI: Form notifications",
      "href": "https://www.w3.org/WAI/tutorials/forms/notifications/"
    }
  ]
};
