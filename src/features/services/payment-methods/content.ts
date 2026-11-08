import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const paymentMethodsContent = {
    "kind": "methods",
    "label": "Payment methods",
    "title": "Credit Cards, Digital Wallets and ACH Payment Methods",
    "description": "Offer credit and debit cards, Apple Pay, Google Pay and ACH through the methods enabled for your merchant account. Keep each result connected to its order.",
    "heading": "More ways to complete the purchase.",
    "intro": "Accept cards, digital wallets and ACH through the methods enabled for your account. Give customers a familiar way to pay and keep each payment connected to the order.",
    "action": {
      "label": "Explore online checkout",
      "href": "/online-businesses#customer-checkout"
    },
    "note": "Methods depend on account setup. Wallet availability also depends on the customer’s card and device.",
    "art": {
      "title": "Cards, digital wallets and ACH connect through checkout to the order record",
      "caption": "A browser return alone does not confirm payment. Follow the recorded payment status.",
      "steps": []
    },
    "sections": [
      {
        "id": "available-methods",
        "title": "Offer the methods your customers use.",
        "items": [
          {
            "title": "Credit and debit cards",
            "text": "Visa, Mastercard, American Express and Discover through your configured checkout."
          },
          {
            "title": "Apple Pay and Google Pay",
            "text": "Eligible customers can pay with a card already held in their digital wallet."
          },
          {
            "title": "ACH bank payments",
            "text": "An authorized payment from a US bank account, with its own processing and return timelines."
          }
        ]
      },
      {
        "id": "method-setup",
        "title": "A payment result your team can act on.",
        "items": [
          {
            "title": "Authorized or captured",
            "text": "A card authorization and capture are separate events. Follow the status required by your fulfillment process."
          },
          {
            "title": "Pending or interrupted",
            "text": "Check the existing payment before requesting another attempt."
          },
          {
            "title": "Declined or returned",
            "text": "Keep the unsuccessful attempt with the order and offer an appropriate next step."
          }
        ]
      }
    ],
    "workflow": {
      "title": "Connect checkout to the order.",
      "intro": "Keep the purchase reference from the first payment attempt to the final result.",
      "steps": [
        {
          "title": "Create the order",
          "detail": "Set the merchant, amount and purchase reference."
        },
        {
          "title": "Present the methods",
          "detail": "Show the options supported by the account and customer device."
        },
        {
          "title": "Check the result",
          "detail": "Use the verified payment record to confirm what happened."
        },
        {
          "title": "Update fulfillment",
          "detail": "Release, hold or follow up on the order according to the payment status."
        }
      ],
      "note": "A pending or interrupted payment needs a status check before another attempt. ACH has separate return and payout terms."
    }
  } as const satisfies ServiceDetailContent;
