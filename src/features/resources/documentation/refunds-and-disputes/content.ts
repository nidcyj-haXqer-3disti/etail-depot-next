import { documentationMetadata } from "@/features/resources/documentation/catalog";
import type { DocArticle } from "@/features/resources/documentation/types";

export const refundsAndDisputesArticle: DocArticle = {
    "introduction": documentationMetadata["/docs/refunds-and-disputes"].description,
    "prerequisites": [
      "The original payment and related operation references",
      "Permission for the action you need to take",
      "The customer request, remaining refundable amount and any open dispute"
    ],
    "sections": [
      {
        "id": "choose-action",
        "title": "Choose the action for the payment stage",
        "table": {
          "caption": "Action by processing stage",
          "headers": [
            "Current position",
            "Action to check"
          ],
          "rows": [
            [
              "Open authorization",
              "Check whether an authorization reversal is supported for the current authorization. A reversal and a refund have different purposes."
            ],
            [
              "Capture or credit awaiting processing",
              "Check whether a void remains available for that operation. Eligibility depends on its current processing stage and your integration."
            ],
            [
              "Captured payment",
              "Check whether a linked refund is permitted. Use the capture or sale reference and the remaining refundable amount."
            ],
            [
              "Open dispute",
              "Read the case instructions and check earlier refunds before issuing a refund. Coordinate the response so the customer is not credited twice."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        },
        "note": {
          "title": "Check permissions and current state",
          "text": "Viewing a payment does not grant permission to change it. Confirm the operation is supported for the account and your role before submitting it."
        },
        "details": [
          {
            "title": "A void is no longer available",
            "text": "Recheck the current operation and which actions are allowed next. Do not repeatedly submit a void after processing has moved beyond the eligible stage."
          },
          {
            "title": "A hold remains after a void",
            "text": "Voiding a capture does not necessarily release the authorization hold. Check whether a separate authorization reversal is required and supported before describing the funds as released."
          }
        ]
      },
      {
        "id": "refund-payment",
        "title": "Track a refund through its result",
        "steps": [
          {
            "title": "Review the payment and case history",
            "text": "Confirm the original capture or sale, currency, earlier refunds, unresolved requests and any dispute. Confirm which purchase and amount are being refunded."
          },
          {
            "title": "Check the amount still available",
            "text": "Check the account’s confirmed refundable amount and limits. Include completed refunds and pending, uncertain or reserved amounts so the same remainder cannot be used twice."
          },
          {
            "title": "Submit one permitted action",
            "text": "Use the linked payment reference and authorized account access. Keep the returned refund or operation ID, requested amount and submission time."
          },
          {
            "title": "Confirm and communicate the result",
            "text": "Record whether the refund completed, failed or remains pending. If the response is lost, investigate that operation before repeating it. Give the customer the verified status and only the posting timeframe confirmed for the account."
          }
        ],
        "details": [
          {
            "title": "For platforms handling concurrent refunds",
            "text": "Reserve pending amounts atomically before submission so concurrent requests cannot use the same remainder. Resolve uncertain outcomes before releasing a reservation. This is an application safeguard, not a balance held by the payment service. Investigate a negative remainder instead of setting it to zero."
          },
          {
            "title": "A refund is still pending",
            "text": "Keep its original reference. Check the original processing record or contact support. A successful submission response does not by itself establish final completion or customer receipt."
          }
        ]
      },
      {
        "id": "dispute-case",
        "title": "Respond to the dispute notice",
        "flow": "disputes",
        "steps": [
          {
            "title": "Read the case notice",
            "text": "Match the case to its payment. Record the reason, stage, deadline and time zone, and the action requested."
          },
          {
            "title": "Review the purchase and prior credits",
            "text": "Check the order, delivery or access records, customer communications and earlier refunds. Respond according to the case instructions."
          },
          {
            "title": "Submit the relevant response",
            "text": "Address the stated reason in the required format. Confirm submission and retain its acknowledgment; an uploaded or saved file is not proof of submission."
          },
          {
            "title": "Follow the case to its outcome",
            "text": "Track further requests, the decision and each account adjustment. Keep later debits and credits connected to the case and reporting period."
          }
        ],
        "note": {
          "title": "Use the deadline in the case notice",
          "text": "Network, processor and case requirements vary. Use the deadline and instructions for that notice; do not substitute a general number of days or assume that evidence guarantees a favorable outcome."
        },
        "details": [
          {
            "title": "The purchase has already been refunded",
            "text": "Retain the refund reference, amount and confirmed result with the case. Follow the notice and support instructions before issuing any further credit."
          },
          {
            "title": "The response receipt is missing",
            "text": "Check the record of the response submitted for the case or contact the case team before the deadline. Follow up until submission is confirmed or you know the next action required."
          }
        ]
      },
      {
        "id": "financial-impact",
        "title": "Match refunds and disputes to account adjustments",
        "table": {
          "caption": "Connect the action to the account",
          "headers": [
            "Record",
            "What to check"
          ],
          "rows": [
            [
              "Refund",
              "Match its operation reference, amount and result to the original payment and the report where it is deducted."
            ],
            [
              "Dispute debit or credit",
              "Keep the case reference with each financial adjustment. A case decision and its accounting entry may arrive separately."
            ],
            [
              "Funding period",
              "Check which payout includes the adjustment. A later refund or case adjustment may affect a different payout from the original sale."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        }
      }
    ]
  };
