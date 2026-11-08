import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const paymentStatusArticle: DocArticle = {
    "introduction": "Check authorization, capture and uncertain results before fulfilling an order or starting another payment.",
    "prerequisites": [
      "Access to the merchant account that received the payment",
      "The order and transaction references, if available",
      "The amount, currency and transaction time with its time zone"
    ],
    "sections": [
      {
        "id": "find-payment",
        "title": "Find the original payment",
        "flow": "records",
        "steps": [
          {
            "title": "Start with the returned transaction ID",
            "text": "Search the merchant account and environment used for the payment. If no transaction ID was returned, use the original order or merchant reference and a narrow time range."
          },
          {
            "title": "Match the purchase",
            "text": "Match the merchant, amount and currency. Retain the separate identifiers for the order, authorization, capture, reversal and refund."
          },
          {
            "title": "Open the related activity",
            "text": "Read the linked operations before acting. A capture and refund on one order are separate operations, not separate purchases."
          }
        ],
        "note": {
          "title": "A missing report row is not a decline",
          "text": "Check the account, filters and reporting availability. Search or reporting data may appear later than the processing result; an empty result alone does not establish that a payment failed."
        }
      },
      {
        "id": "read-status",
        "title": "Read the status before taking action",
        "paragraphs": [
          "Read the recorded operation as well as its status. Use these distinctions alongside the status definitions provided for your integration."
        ],
        "table": {
          "caption": "Payment state and next action",
          "headers": [
            "Observed state",
            "Meaning and next check"
          ],
          "rows": [
            [
              "Authorized",
              "An authorization was approved. Check the configured capture and fulfillment policy. An authorization is not a bank deposit."
            ],
            [
              "Capture accepted",
              "A capture has entered processing. Follow its result and settlement; do not capture again because the payout has not arrived."
            ],
            [
              "Declined",
              "The recorded attempt was not approved. Follow the returned reason and permitted retry rules. If there was an earlier uncertain attempt, resolve it separately."
            ],
            [
              "Pending or unknown",
              "The outcome is not yet established. Keep the order under investigation and recover the original attempt before taking another payment action."
            ],
            [
              "Voided or refunded",
              "Check whether the void or refund completed. An accepted refund request and the customer’s bank posting are different events."
            ],
            [
              "ACH submitted",
              "A bank payment instruction was submitted. Follow its own completion and return states; card authorization/capture labels do not describe the ACH lifecycle."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        }
      },
      {
        "id": "uncertain-result",
        "title": "Resolve an uncertain result",
        "steps": [
          {
            "title": "Preserve the original attempt",
            "text": "Keep the original order, merchant, amount, time and any returned transaction or correlation reference. Tell the customer the result is being checked rather than declaring an unverified failure."
          },
          {
            "title": "Check the payment record",
            "text": "Use the account’s payment lookup or ask merchant support to trace the original attempt. Compare related operations and verified notifications. A communication error does not show how far processing progressed."
          },
          {
            "title": "Record the resolution",
            "text": "Update the order from the confirmed result. If it remains unclear, assign someone to follow up and retain the unresolved attempt instead of submitting a new charge."
          }
        ],
        "details": [
          {
            "title": "Two transactions have the same amount",
            "text": "Compare the operation types, references and the orders they belong to. Two similar rows can be different purchases, separate operations or duplicate attempts; the amount alone does not decide."
          },
          {
            "title": "The checkout message and account record disagree",
            "text": "Retain both references and the time observed. Resolve the current processing record before changing fulfillment or sending the customer through another payment."
          }
        ]
      },
      {
        "id": "reporting-results",
        "title": "For integrations: interpret a lookup result",
        "table": {
          "caption": "Distinguish the request from the payment",
          "headers": [
            "Result to interpret",
            "Next check"
          ],
          "rows": [
            [
              "Empty lookup",
              "Confirm the identifiers, account scope and reporting availability. An empty result is not a payment decline."
            ],
            [
              "Request accepted",
              "Determine whether the requested action completed or remains pending. Trace the original operation before retrying."
            ],
            [
              "Payment update received",
              "Verify its source, account and operation before applying it. A repeated notification must not repeat a business action."
            ]
          ]
        },
        "paragraphs": [
          "Use the payment lookup specified for your integration to monitor status. Follow its rate limits and recovery rules; repeatedly running broad transaction searches is not a substitute for a defined recovery process."
        ],
        "note": {
          "title": "Request reporting documentation",
          "text": "Ask our integration team for your account’s lookup endpoints, response and status definitions, reporting timing, rate limits and recovery procedure."
        }
      },
      {
        "id": "support-reference",
        "title": "Keep the details needed for investigation",
        "rows": [
          {
            "title": "Account and purchase",
            "text": "Merchant account, environment, order and original attempt references."
          },
          {
            "title": "Payment and operation",
            "text": "Available transaction and operation references, amount, currency and time zone."
          },
          {
            "title": "Investigation",
            "text": "What happened, what you expected, who is following up and the next step. Remove sensitive information before sharing error details with support."
          }
        ]
      }
    ]
  };
