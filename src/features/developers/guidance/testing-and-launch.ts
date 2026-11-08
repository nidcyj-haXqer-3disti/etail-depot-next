import type { DocArticle } from "@/shared/ui/reading-guide/types";

export const testingAndLaunchArticle: DocArticle = {
    "introduction": "Check account access, checkout and reporting before accepting live payments.",
    "prerequisites": [
      "The connection settings and services you plan to use",
      "Sandbox accounts, credentials and data supplied by our integration team",
      "Contacts for integration setup, launch and ongoing support"
    ],
    "sections": [
      { "id": "testing-and-launch-specifications", "title": "Request your account specifications", "paragraphs": ["The environment access and scenarios available for your integration.", "Production configuration, activation requirements and support contacts."], "link": { "label": "Contact the integration team", "href": "/company/contact#integration" } },
      {
        "id": "test-environment",
        "title": "Configure sandbox access",
        "paragraphs": [
          "Keep the account references, documentation version, website origins, payment settings and event subscriptions together. Sandbox credentials, receivers and records must stay separate from production. Use the sandbox data supplied by our integration team."
        ],
        "flow": "launch",
        "note": {
          "title": "Check the services enabled for your account",
          "text": "A feature described in an API reference may need separate account setup. Confirm the payment methods and functions enabled for your account before using them."
        }
      },
      {
        "id": "acceptance-tests",
        "title": "Confirm payment behavior",
        "paragraphs": [
          "For each enabled method, compare the customer’s result with the payment record. Keep the account settings, expected and actual results, payment references and any unresolved issues with your launch records. Remove sensitive details from retained diagnostics."
        ],
        "table": {
          "caption": "Payment checks",
          "headers": [
            "Scenario",
            "Result to confirm"
          ],
          "rows": [
            [
              "Merchant setup",
              "An incomplete or partially configured account cannot use the affected processing function. Keep the application reference, review result and required service results."
            ],
            [
              "Account permissions",
              "Changing an account ID supplied by the browser cannot retrieve or change another merchant’s records. Keep the rejected request reference and permission decision."
            ],
            [
              "Approved payment",
              "One intended payment operation matches the order, amount, currency and merchant. Keep the attempt, transaction and verified operation status."
            ],
            [
              "Decline or authentication cancellation",
              "The order is not fulfilled and the customer has a usable next step. Keep the processing result and outcome shown to the customer."
            ],
            [
              "Lost response or concurrent submission",
              "The original attempt is resolved before a retry. Refreshes and concurrent tabs do not duplicate a charge or fulfillment. Keep the request and recovery references."
            ],
            [
              "Invalid, repeated or delayed event",
              "Invalid data cannot change state. Repeated delivery applies each payment or order update only once. An older event cannot overwrite a confirmed result. Keep receipt and processing evidence."
            ],
            [
              "Refund or dispute operation",
              "Use only the permissions granted to the account. A refund beyond the remaining refundable amount is refused, and a permitted action retains its own reference and outcome."
            ],
            [
              "Funding and reconciliation",
              "Trace activity and adjustments into the reported deposit. Distinguish submitted instructions, rejected items and confirmed funding states. Keep reconciliation references."
            ],
            [
              "Configured methods and devices",
              "Check enabled wallets on eligible devices, authentication paths and outcomes specific to ACH where available. Confirm each enabled method rather than inferring it from a successful card entry."
            ]
          ],
          "codeColumn": false
        }
      },
      {
        "id": "customer-journey",
        "title": "Run the journey as a customer",
        "paragraphs": [
          "Follow the same order through checkout, operations and funding. The customer and your team should be able to identify its current state and next action."
        ],
        "steps": [
          {
            "title": "Confirm your account setup",
            "text": "Use the correct business and configured merchant mapping. Check that incomplete setup is distinguished from an approved and usable processing connection."
          },
          {
            "title": "Complete checkout and interruption paths",
            "text": "Check desktop and mobile checkout, including a completed payment, a decline and an interrupted response. Keep an uncertain attempt open for investigation before asking the customer to pay again."
          },
          {
            "title": "Find the same transaction in operations",
            "text": "Trace the order to the processing record. Check permitted refunds and dispute actions with their own references, permissions and recorded outcomes."
          },
          {
            "title": "Reconcile the funding record",
            "text": "Explain the reported amount from payments and adjustments. A sandbox funding record does not confirm bank receipt. Confirm bank receipt during the live checks agreed with your account team."
          }
        ],
        "details": [
          {
            "title": "When the interface and records disagree",
            "text": "Record the customer message, payment state and relevant references. Resolve the discrepancy before confirming that the checkout setup is ready."
          }
        ]
      },
      {
        "id": "technical-review",
        "title": "Complete the integration review",
        "paragraphs": [
          "Review account setup, checkout, events, reporting and recovery with our integration team. Complete any required certification for the configuration you will use. Resolve issues and repeat the affected checks before enabling that method or connection."
        ],
        "table": {
          "caption": "Before accepting live payments",
          "headers": [
            "Decision",
            "What to confirm"
          ],
          "rows": [
            [
              "Ready for live checks",
              "Checkout, payment recovery and account permissions work as documented. Outstanding issues are resolved and the required integration review or certification is recorded."
            ],
            [
              "Not ready",
              "Account permissions, payment verification, recovery or a required operation still needs confirmation. Keep that function disabled until it is ready."
            ],
            [
              "The integration has changed",
              "Adding a payment method or changing a connection or processing setting requires the relevant checks and any required certification again."
            ]
          ],
          "codeColumn": false
        },
        "note": {
          "title": "Sandbox access does not activate live processing",
          "text": "Production requires separate access, configuration and account approval. Sandbox results do not establish that live processing or funding is ready."
        }
      },
      {
        "id": "production-readiness",
        "title": "Validate the production setup and launch",
        "steps": [
          {
            "title": "Compare the production configuration",
            "text": "Confirm production account references, credentials, website origins, payment methods, capture settings and event subscriptions with our integration team. Keep sandbox credentials separate from production."
          },
          {
            "title": "Plan the live payment checks",
            "text": "Confirm with your account team who will perform the live checks, which actions and amounts are permitted, and when to stop."
          },
          {
            "title": "Confirm reporting and receipt",
            "text": "Trace the authorized activity into merchant records, events and funding reports. Where the validation includes a bank deposit, confirm actual bank receipt separately from a submitted or funded service status."
          },
          {
            "title": "Confirm who will support the service",
            "text": "Assign monitoring and support for payment uncertainty, refunds, disputes, credential incidents and reconciliation. Record who can pause new activity if an unexplained result appears."
          }
        ],
        "details": [
          {
            "title": "If a live check fails",
            "text": "Pause new activity for the affected connection or method. Preserve pending attempts and continue the authorized recovery and reconciliation process. A software rollback does not reverse a financial operation already accepted."
          },
          {
            "title": "What to monitor first",
            "text": "Watch unresolved attempts, verification failures, receiver and worker failures, delayed reports and unexplained reconciliation differences. Follow the agreed alert thresholds and contact the person responsible for each issue."
          }
        ]
      },
      {
        "id": "ongoing-support",
        "title": "Support the service after launch",
        "paragraphs": [
          "Keep the documentation version, configuration, launch approval and support contacts together. Review the affected flow before changing a connection or adding a payment method."
        ],
        "rows": [
          {
            "title": "For a support request",
            "text": "Include the environment, affected merchant, record and attempt references, timestamp with time zone, expected outcome and observed result. Remove sensitive information and use the support channel provided for your account."
          },
          {
            "title": "For an incident",
            "text": "Identify whether the problem is access, payment processing, delivery, worker execution or reconciliation. Assign someone to investigate and resolve uncertain attempts before retrying."
          }
        ]
      }
    ]
  };
