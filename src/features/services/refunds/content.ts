import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const refundsContent = {
    "kind": "refunds",
    "label": "Refunds",
    "title": "Merchant Refunds and Payment Reversals",
    "description": "Manage a customer refund from the original payment. Choose the permitted action, avoid duplicate returns and follow the refund record through its outcome.",
    "heading": "Manage refunds from the original payment.",
    "intro": "Find the transaction, confirm the amount still eligible to return and follow the result. Keep the refund linked to the original order.",
    "action": {
      "label": "Explore refund guidance",
      "href": "/developers/api-reference#refund-payment"
    },
    "art": {
      "title": "A card payment status determines whether a reversal, void or refund is available",
      "caption": "Available actions depend on payment status, processor support and account permissions.",
      "steps": []
    },
    "sections": [
      {
        "id": "refunds",
        "title": "Choose the action that fits the payment.",
        "items": [
          {
            "title": "Authorization reversal",
            "text": "For an uncaptured card authorization, a supported reversal can release the reserved amount."
          },
          {
            "title": "Void",
            "text": "A supported void can cancel a captured transaction before it is sent for settlement."
          },
          {
            "title": "Refund",
            "text": "For an eligible captured or settled payment, return all or part of the amount still refundable."
          }
        ]
      },
      {
        "id": "disputes",
        "title": "Avoid duplicate refunds.",
        "items": [
          {
            "title": "Pending or unsuccessful",
            "text": "Check the existing refund’s status before submitting another request."
          },
          {
            "title": "Customer receipt",
            "text": "Share the refund amount and reference. Bank posting is separate from processing."
          },
          {
            "title": "Payment already disputed",
            "text": "Follow the dispute instructions before issuing a refund. Returning funds does not automatically close the case.",
            "href": "/services/disputes"
          }
        ]
      }
    ],
    "workflow": {
      "title": "A clear record from request to return.",
      "intro": "Check previous activity before sending money back.",
      "steps": [
        {
          "title": "Find the transaction",
          "detail": "Match the customer’s request to the original order and payment."
        },
        {
          "title": "Check the balance",
          "detail": "Review earlier refunds, payment status and any open dispute."
        },
        {
          "title": "Submit the return",
          "detail": "Choose the supported action and confirm the eligible amount."
        },
        {
          "title": "Track the result",
          "detail": "Keep the refund reference, status and account adjustment with the sale."
        }
      ],
      "note": "A pending refund needs a status check before another request. The customer’s bank controls when the credit appears."
    }
  } as const satisfies ServiceDetailContent;
