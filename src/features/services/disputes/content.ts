import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const disputesContent = {
    "kind": "disputes",
    "label": "Disputes",
    "title": "Chargeback and Dispute Management for Merchants",
    "description": "Review a cardholder dispute, understand the response deadline and organize evidence from the original sale. Follow the case outcome and account adjustment.",
    "heading": "Manage chargebacks with a clear record.",
    "intro": "Keep the claim, deadline and supporting records with the original payment. Review your response and follow the case through its outcome.",
    "action": {
      "label": "Talk with our team",
      "href": "/company/contact#payment-review"
    },
    "art": {
      "title": "Example dispute D1046: $240 for order 1046, product not received, response due 18 November 2026. Supporting records are collected but not submitted.",
      "caption": "Example case. Follow the deadline in your actual notice. Evidence does not guarantee a decision in your favor.",
      "steps": []
    },
    "sections": [
      {
        "id": "case-review",
        "title": "Know what needs a response.",
        "items": [
          {
            "title": "Claim and deadline",
            "text": "Read the reason, disputed amount and deadline on the notice."
          },
          {
            "title": "Original payment",
            "text": "Match the case to the order, transaction and customer records."
          },
          {
            "title": "Account impact",
            "text": "Follow the disputed amount, applicable fees and later adjustments."
          }
        ]
      },
      {
        "id": "evidence",
        "title": "Relevant evidence is stronger than more paperwork.",
        "items": [
          {
            "title": "The purchase",
            "text": "Use the order, receipt and terms that relate to the disputed transaction."
          },
          {
            "title": "Delivery or service",
            "text": "Provide fulfillment records that address the claim, such as proof of delivery or service completion."
          },
          {
            "title": "Communication and refunds",
            "text": "Include relevant customer correspondence and records of any funds already returned."
          }
        ]
      }
    ],
    "workflow": {
      "title": "From notice to resolution.",
      "intro": "Each response should address the specific reason for the dispute.",
      "steps": [
        {
          "title": "Review the notice",
          "detail": "Check the claim, original payment and response deadline."
        },
        {
          "title": "Choose your response",
          "detail": "Accept the dispute or challenge it with relevant supporting records."
        },
        {
          "title": "Complete the response",
          "detail": "If challenging, submit the requested evidence within the case deadline."
        },
        {
          "title": "Follow the outcome",
          "detail": "Track the decision and match the account adjustment to the original payment."
        }
      ],
      "note": "Case outcomes follow the applicable network process. Fees and response options are governed by your account terms."
    }
  } as const satisfies ServiceDetailContent;
