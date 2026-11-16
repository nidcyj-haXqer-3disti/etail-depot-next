import type { BlogArticle } from "./content";

// Supplied human-written draft. Proposed factual qualifications remain in the private review.
export const mccApprovalArticle: BlogArticle = {
  "path": "/company/blog/merchant-category-code-approval",
  "title": "Four Digits That Decide Whether You Get a Merchant Account",
  "description": "Every merchant account carries a four-digit Merchant Category Code. It was invented so the card networks and the tax authorities could sort transactions by type of business: 5812 for restaurants, 5945 for hobby and toy shops, 7995 for gambling. Most merchants never see theirs.",
  "searchTitle": "How your MCC affects merchant account approval",
  "summary": "Your merchant category code can affect approval, network requirements and account conditions. Understand who assigns it and what to ask before applying.",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-15",
  "relatedPaths": [
    "/company/blog/merchant-category-codes",
    "/company/blog/declined-for-payment-processing"
  ],
  "sections": [
    {
      "id": "why-four-digits-carry-weight",
      "title": "Why four digits carry so much weight"
    },
    {
      "id": "same-business-different-codes",
      "title": "The same business, two different codes"
    },
    {
      "id": "what-you-can-do",
      "title": "What you can do, and how we do it"
    }
  ],
  "sources": [
    {
      "label": "Visa: Merchant Data Standards Manual",
      "href": "https://corporate.visa.com/content/dam/VCOM/download/merchants/visa-merchant-data-standards-manual.pdf"
    },
    {
      "label": "Mastercard: Merchant classification and payment facilitator rules",
      "href": "https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/mastercard-rules.pdf"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    }
  ]
};

export const mccApprovalBody = {
  "intro": [
    {
      "text": "Yet before a payment provider looks at your financials, your fulfilment or your founders, it looks at that code. For a large share of applications, the MCC decides the outcome on its own. Understanding why makes a decline less mysterious, and makes it possible to do something about it.",
      "lead": ""
    }
  ],
  "sections": [
    {
      "id": "why-four-digits-carry-weight",
      "title": "Why four digits carry so much weight",
      "paragraphs": [
        {
          "text": "The MCC is not a label. It is a key into three sets of rules that sit above the provider.",
          "lead": ""
        },
        {
          "text": "Network rules. Visa and Mastercard attach obligations to specific codes. Some require the acquirer to register the merchant with the network and pay an annual fee, with the acquirer taking on added liability. Some carry extra monitoring. Some are prohibited outright in a given country. A provider that boards a merchant under a registration-required code without registering it faces network fines, so many simply refuse the whole category.",
          "lead": "Network rules."
        },
        {
          "text": "Acquirer appetite. Every payment facilitator operates under a sponsoring bank, and that bank hands it a list of codes it may board, codes it may board with conditions, and codes it may not touch. The list reflects the bank's regulators, its own loss history and its reputational tolerance. A provider cannot override its sponsor. If your MCC is on the bank's prohibited list, the provider's answer is no before a human reads your application.",
          "lead": "Acquirer appetite."
        },
        {
          "text": "Loss history. Across the industry, chargeback and fraud rates cluster by category. Travel, ticketing, nutraceuticals, subscription boxes, digital goods and anything with a long gap between payment and delivery run higher. Underwriters price and limit by code because the code is the most reliable predictor they have before they know anything about you specifically. Your business may be the exception, but the code says you are the rule.",
          "lead": "Loss history."
        }
      ]
    },
    {
      "id": "same-business-different-codes",
      "title": "The same business, two different codes",
      "paragraphs": [
        {
          "text": "Here is the part that frustrates merchants most: the code is assigned by the provider, and real businesses rarely fit one box. A company that sells fitness equipment and also a coaching subscription could be coded as sporting goods or as a membership service. One is routine. The other draws recurring-billing scrutiny. A marketplace that collects payment on behalf of sellers can be coded as the goods it lists or as a payment aggregator, which is a different conversation entirely.",
          "lead": ""
        },
        {
          "text": "Some providers resolve this by picking whatever code their automated onboarding guesses from your website, and declining if it lands on their restricted list. Others, under pressure to keep approval fast, pick the easiest code to board and leave the merchant exposed. If the network later decides the code was wrong, the merchant can be reclassified, re-priced or terminated for something they never chose.",
          "lead": ""
        },
        {
          "text": "The code should reflect what you actually sell and how you sell it. Getting that right at the start is worth more than a fast approval under a code that will not survive an audit.",
          "lead": ""
        }
      ]
    },
    {
      "id": "what-you-can-do",
      "title": "What you can do, and how we do it",
      "paragraphs": [
        {
          "text": "Ask any provider three things before you apply: which code they intend to assign you, whether that code is on their sponsor's restricted list, and what registration, reserve or limit comes with it. If they cannot answer, they are guessing, and the guess will be made by software.",
          "lead": ""
        },
        {
          "text": "At Trolleys, an Etail Depot service, MCC assignment is part of the evaluation, not a side effect of it. We review how your business actually operates, identify the code that describes it accurately, and tell you what that code means under our sponsor's program and the networks' rules before you sign. If the accurate code carries registration or conditions, we say so and explain what supporting it requires. If it is one we cannot board, we tell you that plainly and why, rather than approving you under a code that will not hold.",
          "lead": ""
        },
        {
          "text": "Four digits should not be a mystery to the business they describe. Knowing yours, and knowing why it was chosen, is the first step to a merchant account that stays open.",
          "lead": ""
        }
      ]
    }
  ]
};
