import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const payoutsContent = {
    "kind": "payouts",
    "label": "Payouts",
    "title": "Merchant Payouts and Bank Deposits",
    "description": "Understand what makes up your merchant payout. Follow included payments, fees, refunds and account adjustments through to the deposit in your bank.",
    "heading": "From customer payments to your bank.",
    "intro": "See the payments and adjustments behind each payout. Follow the amount from your account records to the deposit at your bank.",
    "action": {
      "label": "Discuss your payout setup",
      "href": "/company/contact#payment-review"
    },
    "note": "Payout schedules, reserves, reviews and bank processing depend on your account terms.",
    "art": {
      "title": "Example payout: three card sales total $432.00, less $13.43 in processing fees and no other adjustments, leaving $418.57. The bank record shows the same $418.57 credit and reference P1048.",
      "caption": "Fees and bank details are examples. Confirm the credit with your bank.",
      "steps": []
    },
    "sections": [
      {
        "id": "payouts",
        "title": "Understand the amount you receive.",
        "items": [
          {
            "title": "Included payments",
            "text": "Identify which payments are eligible for this payout and which remain for a later period."
          },
          {
            "title": "Fees and adjustments",
            "text": "Review processing fees, refunds, disputes and reserve movements against the included activity."
          },
          {
            "title": "Bank deposit",
            "text": "Use the payout amount and reference to locate the credit at your receiving bank."
          }
        ]
      },
      {
        "id": "reconciliation",
        "title": "When a payout needs attention.",
        "items": [
          {
            "title": "Not yet received",
            "text": "Check the payout status, schedule and bank holidays. Contact merchant support with the payout reference if it is overdue.",
            "href": "/company/contact#account-support"
          },
          {
            "title": "Failed or returned",
            "text": "Check the payout status and receiving bank details before requesting a correction through account support."
          },
          {
            "title": "A different amount",
            "text": "Compare included transactions and adjustments with the bank credit before closing the period.",
            "href": "/services/reconciliation"
          }
        ]
      }
    ],
    "workflow": {
      "title": "From payment to bank deposit.",
      "intro": "Card processing, payout calculation and bank receipt are separate stages.",
      "steps": [
        {
          "title": "Capture",
          "detail": "An authorized card payment is submitted for processing."
        },
        {
          "title": "Settlement",
          "detail": "Processing and settlement records establish the payment activity."
        },
        {
          "title": "Payout calculation",
          "detail": "Eligible activity is combined with fees and account adjustments."
        },
        {
          "title": "Bank deposit",
          "detail": "The receiving bank posts the deposit. Match its amount and reference."
        }
      ],
      "note": "First payouts, reviews and account conditions can affect timing. A missing payout is not a reason to charge the customer again."
    }
  } as const satisfies ServiceDetailContent;
