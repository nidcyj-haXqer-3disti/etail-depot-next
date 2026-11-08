import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const payoutsArticle: DocArticle = {
    "introduction": "Match payments, fees and adjustments to the payout report, then confirm the deposit on your bank statement.",
    "prerequisites": [
      "Merchant transaction and funding report access",
      "The account’s payout terms, cutoff and reporting time zone",
      "The receiving bank’s statement or posted transaction record"
    ],
    "sections": [
      {
        "id": "payment-to-deposit",
        "title": "Follow the payment to bank deposit",
        "flow": "payouts",
        "note": {
          "title": "Funding submission is not bank receipt",
          "text": "Submission for funding is not confirmation of bank receipt. Check the funding result and the receiving bank’s record before marking reconciliation complete."
        },
        "steps": [
          {
            "title": "Capture",
            "text": "Keep the accepted capture or sale reference with the original order. Authorization alone is not an amount received by the business."
          },
          {
            "title": "Settlement",
            "text": "Identify the processed activity included in the relevant settlement or funding report. Do not assume every capture appears in the next payout."
          },
          {
            "title": "Payout calculation",
            "text": "Read the included activity and the report’s fees, refunds, dispute adjustments, reserves and credits. Check whether charges are netted or billed separately."
          },
          {
            "title": "Bank deposit",
            "text": "Match the final funding amount, currency and reference to the bank’s posted entry. Keep any unmatched difference open for investigation."
          }
        ]
      },
      {
        "id": "reconcile",
        "title": "Reconcile the payout amount",
        "steps": [
          {
            "title": "Select the merchant deposit",
            "text": "Confirm the merchant, currency, deposit reference, period and expected destination. A batch for the platform can contain several merchant deposits."
          },
          {
            "title": "Match its included activity",
            "text": "Use the payments and adjustments listed in that report. Preserve their references and recorded signs, including corrections relating to earlier periods."
          },
          {
            "title": "Calculate the amount once",
            "text": "Separate netted deductions, credits and amounts held. Do not subtract a fee again if it is already included in a net total, or deduct a separately billed fee from this deposit."
          },
          {
            "title": "Match the bank entry",
            "text": "Compare the reported funding amount with the posted bank credit and reference. Record the match, or record the difference and who will follow up."
          }
        ]
      },
      {
        "id": "funding-status",
        "title": "Read batch and deposit results separately",
        "paragraphs": [
          "A funding batch and an individual merchant deposit can have different outcomes. Match the record and merchant before applying its reported status."
        ],
        "table": {
          "caption": "Batch, deposit and bank records",
          "headers": [
            "Record",
            "What to check"
          ],
          "rows": [
            [
              "Funding batch",
              "The outcome of the group of deposits. A partial rejection does not mean every merchant deposit failed."
            ],
            [
              "Merchant deposit",
              "The outcome and any rejection or return affecting that merchant’s deposit."
            ],
            [
              "Bank entry",
              "The posted amount and reference that establish receipt in the bank account."
            ]
          ]
        },
        "details": [
          {
            "title": "For integrations: match the batch and merchant",
            "text": "Keep the batch reference, each merchant deposit reference and the account mapping together. Do not apply a batch result to every merchant without checking its deposit."
          },
          {
            "title": "A funded notification arrives again",
            "text": "Record delivery separately from the funding result. A repeated event is not a second bank deposit and must not duplicate a reconciliation entry."
          }
        ],
        "note": {
          "title": "Request payout reporting documentation",
          "text": "Our integration team can confirm the report fields, event definitions, status meanings and account references used by your integration."
        }
      },
      {
        "id": "payout-help",
        "title": "Investigate a missing or different deposit",
        "details": [
          {
            "title": "The payout is less than the sales total",
            "text": "Compare the included period, cutoff and time zone first. Then account for refunds, fees, disputes, reserves, credits and separately billed charges. Do not subtract a deduction twice."
          },
          {
            "title": "The report says funded but no bank credit appears",
            "text": "Check the current merchant deposit status, expected timing under the account terms, receiving account and any rejection or return. Ask support to trace the existing deposit when the expected timing has passed."
          },
          {
            "title": "Only part of a batch was rejected",
            "text": "Inspect the individual merchant deposits and their causes. Reconcile successful deposits separately and leave the rejected or unresolved items open."
          },
          {
            "title": "The bank entry is different or was returned",
            "text": "Keep the bank reference, amount, date and currency with the original deposit. Check for later adjustments or returns and ask merchant support to investigate any amount you cannot match."
          }
        ],
        "rows": [
          {
            "title": "References",
            "text": "Merchant, individual deposit, any funding batch and the report period."
          },
          {
            "title": "Difference",
            "text": "Reported amount and currency, bank amount and reference, observed status and any later adjustment."
          },
          {
            "title": "Next action",
            "text": "The unmatched amount, who is following up and the next step. Use a masked destination reference when contacting support."
          }
        ]
      },
      {
        "id": "funding-instructions",
        "title": "For integrations: funding instructions",
        "paragraphs": [
          "Only submit funding instructions when your account permits it. Reporting access does not grant this permission. Request the supported operations and recovery procedure from our integration team; track each instruction separately from its funding result."
        ],
        "table": {
          "caption": "Keep instruction and result separate",
          "headers": [
            "Record",
            "What it establishes"
          ],
          "rows": [
            [
              "Instruction",
              "A request for a permitted funding action and its submission outcome."
            ],
            [
              "Funding result",
              "The later processing result for the relevant batch or merchant deposit."
            ],
            [
              "Bank record",
              "The posted receipt or return in the receiving account."
            ]
          ]
        },
        "note": {
          "title": "Resubmission is not a new confirmed deposit",
          "text": "An instruction resubmission can generate another notification. Resolve the instruction and funding records before taking any further action; a missing bank credit is not a reason to send the instruction again."
        }
      }
    ]
  };
