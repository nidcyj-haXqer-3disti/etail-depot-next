import { documentationMetadata } from "@/features/resources/documentation/catalog";
import type { DocArticle } from "@/features/resources/documentation/types";

export const webhooksArticle: DocArticle = {
    "introduction": documentationMetadata["/docs/webhooks"].description,
    "prerequisites": [
      "Enabled event subscriptions for each required service",
      "The event format, verification requirements and delivery rules for your connection",
      "An HTTPS receiver, durable storage and authorized recovery lookups",
      "Separate sandbox and production merchant mappings"
    ],
    "sections": [
      {
        "id": "event-domains",
        "title": "Confirm the available event types",
        "paragraphs": [
          "Account, payment and funding events describe different records. Confirm the available notifications and their definitions for your connection."
        ],
        "table": {
          "caption": "Events and their records",
          "headers": [
            "Event family",
            "Record to resolve"
          ],
          "rows": [
            [
              "Account setup",
              "The application decision and setup status. Match the application and program, then confirm which services are enabled. Approval alone does not mean the account can accept payments."
            ],
            [
              "Checkout",
              "The configured transaction result. Match the processing account, transaction and original payment attempt."
            ],
            [
              "Funding",
              "Deposit, instruction or batch activity, where available. Read the relevant record and status definition before updating reconciliation."
            ]
          ],
          "codeColumn": false
        },
        "note": {
          "title": "Event delivery instructions",
          "text": "Ask our integration team for event types and field names, account scope, status definitions, verification or encryption requirements, acknowledgment rules, retries, replay behavior and setup instructions."
        }
      },
      {
        "id": "event-security",
        "title": "Verify the delivery",
        "paragraphs": [
          "Keep the received message available in the representation required by the verifier. Apply the authentication, signature validation or decryption required by your integration instructions, in the specified order. A parsed or reserialized JSON body is not automatically equivalent to the signed content."
        ],
        "table": {
          "caption": "Security responsibilities",
          "headers": [
            "Layer",
            "What to confirm"
          ],
          "rows": [
            [
              "Subscription access",
              "Who may configure or change event delivery. This is separate from verification of an incoming notification."
            ],
            [
              "Delivery verification",
              "The required authentication, signature or encryption checks, including key management and replay handling."
            ],
            [
              "Account and environment",
              "How the verified event is matched to an authorized merchant and the intended environment."
            ]
          ]
        },
        "details": [
          {
            "title": "Check valid and invalid event deliveries",
            "text": "Ask our integration team for the event verification instructions and required sandbox data. Reject altered content, invalid credentials and mismatched accounts according to those instructions. Use the specified signed content, timestamp tolerance and verification order."
          },
          {
            "title": "Reject unverifiable deliveries",
            "text": "Where these checks apply, reject invalid signatures, failed decryption, unknown keys and mismatched merchants before updating an order, account or funding record. Follow the subscription’s response rules and support instructions. Keep error details without sensitive information."
          }
        ]
      },
      {
        "id": "payment-event",
        "title": "Match the event to its record",
        "paragraphs": [
          "A subscription can carry many payments; a payment can receive several legitimate updates. Keep delivery identifiers separate from the business record and its state change."
        ],
        "table": {
          "caption": "Delivery and record references",
          "headers": [
            "Identity",
            "Purpose"
          ],
          "rows": [
            [
              "Subscription",
              "The configured stream of notifications. It is not a unique payment reference."
            ],
            [
              "Delivery attempt",
              "A particular delivery or retry, useful for tracing a notification."
            ],
            [
              "Merchant account",
              "The account authorized to receive the payment record."
            ],
            [
              "Payment or operation",
              "The transaction or related operation whose status is being reported."
            ],
            [
              "Order or account update",
              "The change your application may apply once, tied to the correct merchant, payment or operation and status."
            ]
          ]
        }
      },
      {
        "id": "event-handler",
        "title": "Save, acknowledge and process the event",
        "flow": "events",
        "steps": [
          {
            "title": "Verify the event and account",
            "text": "Verify the notification using your integration’s instructions, then check its environment and merchant. Unverified or mismatched data must not change business records."
          },
          {
            "title": "Store the event before acknowledging receipt",
            "text": "Durably record the receipt and work needed to resume processing, with appropriate access and retention controls. Acknowledge receipt only after the event and processing work are saved, within the subscription’s response window."
          },
          {
            "title": "Apply the update once",
            "text": "Prevent duplicate deliveries from repeating fulfillment or a financial action. Apply an atomic update identified by environment, merchant, payment or operation, and state change. A transaction ID alone may cover several legitimate updates."
          },
          {
            "title": "Resolve delayed or conflicting updates",
            "text": "Resolve delayed or conflicting updates against the current authoritative record. Arrival order or a larger timestamp alone must not overwrite a confirmed outcome."
          }
        ],
        "outcome": "Acknowledgment confirms receipt of the notification. Payment completion is established separately by the verified payment record."
      },
      {
        "id": "funding-events",
        "title": "Match funding updates to deposit records",
        "paragraphs": [
          "Use the funding definitions provided for your integration. Checkout status labels describe a different record. An instruction, batch and merchant deposit each has its own result and account scope."
        ],
        "table": {
          "caption": "Funding records and interpretation",
          "headers": [
            "Record",
            "Next check"
          ],
          "rows": [
            [
              "Instruction submission",
              "Confirm whether the request was accepted, rejected or remains unresolved. Submission does not establish bank receipt."
            ],
            [
              "Batch outcome",
              "Inspect individual merchant deposits when only part of the batch completes."
            ],
            [
              "Merchant deposit",
              "Match the deposit to its merchant and report, then reconcile the receiving bank entry."
            ]
          ]
        }
      },
      {
        "id": "recovery-cases",
        "title": "Recover missing events and delivery failures",
        "paragraphs": [
          "Follow the retry policy and subscription health checks for your integration. Delivery may stop; recover missing or uncertain activity against authoritative account and payment records."
        ],
        "table": {
          "caption": "Event delivery and recovery",
          "headers": [
            "Scenario",
            "How to handle it"
          ],
          "rows": [
            [
              "Invalid signature or encryption",
              "No business record changes. Error details identify the failed verification step without exposing sensitive information."
            ],
            [
              "Same payment, new retry trace",
              "A retry can have a different trace ID. Keep the receipts for diagnostics, match the same business update and acknowledge as specified without repeating the action."
            ],
            [
              "Two payments, one subscription",
              "Process each payment separately, even when both arrive through the same subscription."
            ],
            [
              "Old result arrives last",
              "An older event does not replace the confirmed current state. Resolve conflicting updates through the authoritative record."
            ],
            [
              "Receipt storage fails",
              "Do not acknowledge receipt until the event is stored. Follow the subscription’s recovery instructions."
            ],
            [
              "Worker interruption",
              "Resume stored work after acknowledgment. Apply changes atomically so a worker restart cannot repeat fulfillment or a financial action."
            ],
            [
              "Delivery stops",
              "Check subscription health, credentials and certificates. Reconcile records to recover missing activity."
            ]
          ],
          "codeColumn": false
        },
        "details": [
          {
            "title": "Keep useful error details",
            "text": "Keep the environment, subscription ID, delivery attempt IDs, event type, receipt time, mapped merchant and affected record reference. Distinguish a delivery failure from a failure in the worker or in business validation. Do not put decrypted payment data, tokens or private keys into ordinary logs."
          }
        ]
      }
    ]
  };
