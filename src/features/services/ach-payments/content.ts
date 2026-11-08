import type { ServiceDetailContent } from "../shared/content-types";

export const achPaymentsContent = {
    "kind": "ach",
    "label": "ACH payments",
    "title": "ACH Payments for Business Invoices and Orders",
    "description": "Accept authorized US bank payments for invoices and orders. Follow ACH processing, returns and the records needed to match payments to deposits.",
    "heading": "Accept payments from US bank accounts.",
    "intro": "Offer ACH for invoices and orders. Connect customer authorization, bank account validation and payment status to the amount being collected.",
    "action": {
      "label": "Discuss ACH for your business",
      "href": "/company/contact#payment-review"
    },
    "note": "ACH availability, fees, limits and payout terms depend on your account.",
    "art": {
      "title": "ACH authorization and bank validation lead to processing, with separate completion and return outcomes",
      "caption": "A submitted bank payment can still be pending or returned. Follow its recorded status.",
      "steps": []
    },
    "sections": [
      {
        "id": "ach-use-cases",
        "title": "Bank payments with a clear record.",
        "items": [
          {
            "title": "Payment authorization",
            "text": "Record customer permission for the amount, purpose and payment arrangement."
          },
          {
            "title": "Account validation",
            "text": "Complete the bank account checks required for your payment channel and account setup."
          },
          {
            "title": "Invoice reference",
            "text": "Keep the payment connected to the invoice or order it is intended to cover."
          }
        ]
      },
      {
        "id": "ach-returns",
        "title": "Track bank payments after submission.",
        "items": [
          {
            "title": "Processing",
            "text": "A submitted payment is not a guarantee of funds. Set fulfillment and invoice updates accordingly."
          },
          {
            "title": "Returned payment",
            "text": "Read the return reason before retrying. Another attempt may require corrected details or new authorization."
          },
          {
            "title": "Deposit and reporting",
            "text": "Match the payment and later adjustments to the payout report, then check the bank deposit."
          }
        ]
      }
    ],
    "workflow": {
      "title": "From authorization to payment status.",
      "intro": "Bank payments continue processing after the customer leaves checkout.",
      "steps": [
        {
          "title": "Get authorization",
          "detail": "Retain the customer’s permission for the debit."
        },
        {
          "title": "Validate the account",
          "detail": "Use the required validation method before submission."
        },
        {
          "title": "Submit the payment",
          "detail": "Keep its reference with the invoice and authorization."
        },
        {
          "title": "Follow the result",
          "detail": "Track processing, completion and any later return or payout adjustment."
        }
      ],
      "note": "For consumer debits authorized online, account validation applies to first use of an account number and subsequent changes. Ask the integration team for the method required for your setup."
    }
  } as const satisfies ServiceDetailContent;
