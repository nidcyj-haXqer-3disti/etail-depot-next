import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const paymentRequestsArticle: DocArticle = {
    "introduction": "Create a hosted payment request, share it with the customer and match the result to the sale.",
    "prerequisites": [
      "A configured merchant account with access to payment request tools",
      "The purchase details, total and currency",
      "The order or invoice reference and terms shown to the customer"
    ],
    "sections": [
      {
        "id": "choose-request",
        "title": "Choose a request for the sale",
        "table": {
          "caption": "Match the request to the purchase",
          "headers": [
            "Sale",
            "Request to use"
          ],
          "rows": [
            [
              "A shared offer",
              "Use a payment link, checkout button or QR code for an offer that several customers can buy. Each purchase still needs its own order and transaction record."
            ],
            [
              "An individual invoice",
              "Use an invoice when you need itemized charges and payment terms for a particular purchase. Keep its reference and current balance with the order."
            ],
            [
              "Scheduled billing",
              "If recurring billing is available for your account, use its separate setup and authorization process. Paying a request once does not establish a recurring agreement."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        },
        "note": {
          "title": "Check the tools available in your account",
          "text": "Payment request tools and payment methods need to be configured for your account. Contact the account team if a required option is missing."
        }
      },
      {
        "id": "create-share",
        "title": "Create, review and share",
        "steps": [
          {
            "title": "Create the request",
            "text": "Enter the purchase, total, currency and reference. Check tax, shipping, delivery, expiry and reuse settings available in your account."
          },
          {
            "title": "Review the checkout page",
            "text": "Confirm the business identity, purchase details, total and payment methods on the payment page. Check the mobile view and customer terms."
          },
          {
            "title": "Share the payment request",
            "text": "Use the link, QR code or button supplied by the request tool. Keep it tied to the purchase; never include card details or credentials in its URL."
          }
        ],
        "details": [
          {
            "title": "Use purchase details in request fields",
            "text": "Use descriptions and reference fields for purchase information. Do not put card numbers, verification codes, bank credentials or identity documents into invoice fields that accept free text."
          },
          {
            "title": "An offer changes after sharing",
            "text": "Review the supported edit, cancellation or replacement process. Confirm what the customer’s existing link now shows. Changing a request does not rewrite a payment already processed."
          }
        ]
      },
      {
        "id": "request-result",
        "title": "Match the payment to the order",
        "paragraphs": [
          "Opening a link, scanning a QR code or viewing an invoice does not prove payment. Match the transaction’s merchant, amount, currency and verified state to the order before fulfillment or reminders."
        ],
        "rows": [
          {
            "title": "One order, several attempts",
            "text": "Keep the attempt references together. Check whether an earlier payment remains unresolved before asking the customer to try again."
          },
          {
            "title": "Invoice and transaction status",
            "text": "A sent or canceled invoice is an invoice event. Use the payment record to determine what was authorized, captured or refunded, including any pending action."
          }
        ],
        "flow": "requests"
      },
      {
        "id": "request-follow-up",
        "title": "Follow up on an unpaid or uncertain request",
        "table": {
          "caption": "Keep these references connected",
          "headers": [
            "Record",
            "What to check"
          ],
          "rows": [
            [
              "Order or invoice",
              "The purchase, amount owed and current payment terms."
            ],
            [
              "Payment request",
              "The hosted destination and its expiry, cancellation or reuse settings, where supported."
            ],
            [
              "Payment and operation",
              "Each transaction and any related capture, reversal or refund."
            ],
            [
              "Amount, currency and time",
              "The values needed to match the result and investigate an uncertain attempt."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        }
      }
    ]
  };
