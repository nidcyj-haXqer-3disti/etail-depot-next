import type { ServiceDetailContent } from "@/features/services/shared/content-types";

export const reconciliationContent = {
    "kind": "reconciliation",
    "label": "Reconciliation",
    "title": "Payment Reconciliation and Payout Reporting",
    "description": "Connect transaction records, payout reports and bank deposits. Understand payment reconciliation and investigate timing, fees and account differences.",
    "heading": "Know what makes up every deposit.",
    "intro": "Match payments and adjustments to the payout report, then match the payout to your bank. Separate timing differences from amounts that need investigation.",
    "action": {
      "label": "Explore reconciliation guidance",
      "href": "/developers/api-reference#payouts"
    },
    "art": {
      "title": "Match payment activity to the payout, then the payout to the bank statement; investigate remaining differences",
      "caption": "Compare the same merchant account, currency and reporting period.",
      "steps": []
    },
    "sections": [
      {
        "id": "reconciliation",
        "title": "Connect the records behind the balance.",
        "items": [
          {
            "title": "Payment activity",
            "text": "The original sale, fees, refunds and dispute adjustments."
          },
          {
            "title": "Payout report",
            "text": "The activity included in a payout and the resulting amount."
          },
          {
            "title": "Bank statement",
            "text": "The credit received, posting date and bank reference."
          }
        ]
      },
      {
        "id": "differences",
        "title": "Understand differences in your records.",
        "items": [
          {
            "title": "Different dates",
            "text": "A sale, payout and bank credit may fall in different periods. Compare the relevant dates before treating a record as missing."
          },
          {
            "title": "Changed amounts",
            "text": "Look for refunds, dispute fees, reserve movements and adjustments to earlier payments."
          },
          {
            "title": "Missing records",
            "text": "Keep the account, payment and payout references together when requesting an investigation."
          }
        ]
      }
    ],
    "workflow": {
      "title": "Match sales to your bank deposit.",
      "intro": "Start with one merchant account and currency, then follow the records through.",
      "steps": [
        {
          "title": "Choose the account and period",
          "detail": "Choose the account, currency and reporting period."
        },
        {
          "title": "Match the activity",
          "detail": "Total the payments, fees and adjustments included in the payout."
        },
        {
          "title": "Match the deposit",
          "detail": "Compare the payout amount and reference with the bank credit."
        },
        {
          "title": "Investigate differences",
          "detail": "Explain timing differences and investigate amounts that remain unmatched."
        }
      ],
      "note": "An expected payout is not proof of bank receipt. Report fields and access depend on your account configuration."
    }
  } as const satisfies ServiceDetailContent;
