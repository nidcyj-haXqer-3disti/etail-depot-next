import type { DocumentationSlug } from "./documentation-catalog";

export type DocRow = { title: string; text: string };
export type DocTable = { caption: string; headers: string[]; rows: string[][]; codeColumn?: boolean; breakCodeWords?: boolean };
export type DocSection = {
  id: string; title: string; paragraphs?: string[]; steps?: DocRow[]; rows?: DocRow[];
  note?: { title: string; text: string };
  flow?: "onboarding" | "checkout" | "records" | "payouts" | "events" | "requests" | "access" | "launch" | "recovery" | "disputes";
  table?: DocTable; outcome?: string;
  details?: DocRow[]; link?: { label: string; href: string };
};
type DocArticle = { introduction: string; prerequisites: string[]; sections: DocSection[] };

// Public task documentation. Vendor provenance lives in the local research record;
// assigned API contracts are requested through the integration team, not simulated here.
export const documentationArticles: Record<DocumentationSlug, DocArticle> = {
  "merchant-onboarding": {
    "introduction": "Prepare your application, follow the review and confirm your account is ready to accept payments.",
    "prerequisites": [
      "An authorized representative of the business",
      "Business, ownership and payout account information",
      "Your website, products and expected processing activity"
    ],
    "sections": [
      {
        "id": "prepare",
        "title": "Prepare the business information",
        "paragraphs": [
          "Use the legal business name and the trading name customers recognize. Have the requested information ready before opening or resuming the application. Provide documents and bank details through the secure account service."
        ],
        "rows": [
          {
            "title": "Business",
            "text": "Legal entity, tax information, business address, website and customer support contact. Make sure the trading name and website describe the same business."
          },
          {
            "title": "Ownership and authority",
            "text": "The owners, people with control of the business and authorized representative requested by the application, together with the documents needed for verification."
          },
          {
            "title": "Sales and fulfillment",
            "text": "What you sell, expected processing volume, typical order amount and how long customers wait for delivery or access. Include your cancellation and refund terms."
          },
          {
            "title": "Payout account",
            "text": "The receiving bank account and any documents requested to verify it. Confirm that the information belongs to the business applying."
          }
        ],
        "link": {
          "label": "Continue to Trolleys",
          "href": "portal"
        }
      },
      {
        "id": "application-review",
        "title": "Complete the application review",
        "flow": "onboarding",
        "steps": [
          {
            "title": "Submit one complete application",
            "text": "Review the business information and agreements, then submit. Keep the application reference with the submitted business identity."
          },
          {
            "title": "Resolve outstanding requests",
            "text": "Return to the same application when information is requested. Supply missing or corrected details through the secure account service."
          },
          {
            "title": "Read the review decision",
            "text": "Read the recorded decision. Submitting an application or providing documents is not approval."
          },
          {
            "title": "Confirm service setup",
            "text": "After approval, confirm payment methods, team access and reporting are configured before using the account."
          }
        ],
        "note": {
          "title": "Approval and activation are separate",
          "text": "An approval decision does not confirm that every connection is ready. Resolve any setup issue before sending customers to checkout."
        },
        "details": [
          {
            "title": "The submission response is missing",
            "text": "Find or resume the existing application before submitting again. Give support the business and application reference so an uncertain response does not become a duplicate application."
          },
          {
            "title": "The application needs correction",
            "text": "Read the returned field or document request. Update the existing application so the review history stays together."
          }
        ]
      },
      {
        "id": "account-readiness",
        "title": "Confirm account readiness",
        "table": {
          "caption": "Account readiness",
          "headers": [
            "Record",
            "What to check"
          ],
          "rows": [
            [
              "Merchant identity",
              "The approved business is connected to the correct processing and reporting accounts. A portal user is not the same identifier as the merchant account."
            ],
            [
              "Payment configuration",
              "The required checkout connection and payment methods are configured for the account. Confirm any separate setup needed for wallets, ACH or payment requests."
            ],
            [
              "Fees and payouts",
              "Your team can find the agreed fee schedule, payout terms, cutoff and time zone, and any reserve or hold conditions."
            ],
            [
              "Team access",
              "Each person has the permissions needed for their role. Viewing a transaction does not automatically permit a refund, adjustment or bank account change."
            ],
            [
              "Customer and support journey",
              "The customer can reach the intended checkout, and your team knows where to find the resulting payment and request help."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        }
      },
      {
        "id": "platform-onboarding",
        "title": "For software platforms: connect the application",
        "paragraphs": [
          "Connect each application to the business in your platform. Keep the application decision separate from the services enabled for that merchant."
        ],
        "table": {
          "caption": "Application and service records",
          "headers": [
            "Record",
            "What to keep connected"
          ],
          "rows": [
            [
              "Your business reference",
              "The business in your platform and the application submitted for it."
            ],
            [
              "Application reference",
              "The application, review decision and any outstanding information request."
            ],
            [
              "Processing account",
              "The merchant account assigned after review and the services configured for it."
            ],
            [
              "Service readiness",
              "The result for each required service. Approval alone does not confirm that checkout or reporting is ready."
            ]
          ]
        },
        "note": {
          "title": "Request account setup documentation",
          "text": "Ask our integration team how to connect the merchant application to your platform, including supported prefill options, account references and application statuses."
        },
        "details": [
          {
            "title": "A response arrives but setup is incomplete",
            "text": "Check the application decision and each required service result. Receipt or acceptance of a request does not establish processing readiness."
          },
          {
            "title": "Handle records with care",
            "text": "Store the necessary account mapping and safe diagnostics. Keep verification documents, personal information and credentials out of general application logs."
          }
        ]
      },
      {
        "id": "account-changes",
        "title": "Keep the account current",
        "details": [
          {
            "title": "Business or bank information changes",
            "text": "Use the approved process for updating your account. A change can require review; a saved change to bank details is not evidence that the next payout will use it. Confirm its effective status."
          },
          {
            "title": "A team member leaves",
            "text": "Remove access that is no longer needed. Review administrative and financial permissions, and rotate affected integration credentials through the authorized process."
          },
          {
            "title": "The next step is unclear",
            "text": "Contact support with the application reference, the outstanding request and the step you cannot complete. Keep verification documents in the secure account channel."
          }
        ]
      }
    ]
  },
  "integration-access": {
    "introduction": "Map your merchant accounts, set permissions and obtain the connection details your developers need.",
    "prerequisites": [
      "The services and operations your integration needs",
      "The business and account references already available to your team",
      "Contacts for engineering and payment operations"
    ],
    "sections": [
      {
        "id": "connection-map",
        "title": "Map your connections",
        "paragraphs": [
          "A portal login does not grant API access. Confirm which services and operations your business needs; reporting access alone does not permit refunds, adjustments or funding instructions."
        ],
        "flow": "access"
      },
      {
        "id": "account-mapping",
        "title": "Keep account identities distinct",
        "paragraphs": [
          "Map your business record to the identifiers assigned for the application, processing and reporting services. Store sandbox and production mappings separately."
        ],
        "table": {
          "caption": "Account mapping",
          "headers": [
            "Record",
            "How to use it"
          ],
          "rows": [
            [
              "Your business ID",
              "Your stable identifier for the business using your platform. On your server, check whether the user who is signed in has access to it."
            ],
            [
              "Application and program",
              "The application reference and any program identifier assigned to it. Keep the review decision and setup results with that application."
            ],
            [
              "Processing account",
              "The merchant or organization identifiers assigned for processing. Keep distinct identifiers separate where the integration requires more than one."
            ],
            [
              "Reporting account",
              "The account or tenant that controls reporting access and the merchant whose records may be read. Confirm the account references in your integration documentation."
            ],
            [
              "Environment",
              "Keep a separate mapping for sandbox and production. A matching label or identifier is not evidence that the two environments are interchangeable."
            ]
          ],
          "codeColumn": false
        },
        "steps": [
          {
            "title": "Resolve access on your server",
            "text": "Start from the authenticated user and your own business record. Determine the permitted merchant and operation before making an external request."
          },
          {
            "title": "Check the returned account",
            "text": "Compare the response with the expected merchant mapping. Do not display a record from a different merchant, even when the API request itself succeeded."
          }
        ],
        "outcome": "Changing a merchant ID in a browser request cannot change which account that user is authorized to access."
      },
      {
        "id": "credentials",
        "title": "Protect credentials and permissions",
        "paragraphs": [
          "Store secrets in your backend’s protected configuration. Keep them out of browser bundles, URLs, analytics and application logs. Use credentials only for their assigned service and environment."
        ],
        "details": [
          {
            "title": "Rotate or revoke a key",
            "text": "Use the authorized process for managing keys. Verify the replacement in the correct environment before retiring an uncompromised old key. If a secret is exposed, restrict affected access and follow the incident procedure. Send only the key identifier in a support request, never its secret value."
          },
          {
            "title": "Keep webhook security separate",
            "text": "Incoming events may use separate verification keys or encryption settings. Follow the event documentation; an outbound API credential does not authenticate an incoming notification."
          }
        ]
      },
      {
        "id": "verify-access",
        "title": "Verify access before changing records",
        "paragraphs": [
          "Begin with the documented account lookup without changing records. Confirm both the intended merchant and refused access to other merchants. An HTTP status alone does not establish a payment result or application decision."
        ],
        "table": {
          "caption": "Verify access and outcomes",
          "headers": [
            "Check",
            "What to establish"
          ],
          "rows": [
            [
              "Identity",
              "The connection returns the records for the intended merchant and environment."
            ],
            [
              "Permissions",
              "Access outside the assigned merchant or permitted operation is refused."
            ],
            [
              "Request acceptance",
              "A successful connection or accepted request is distinguished from the application decision or payment result."
            ],
            [
              "Uncertain operation",
              "An operation with an uncertain result can be traced using its original reference before another attempt."
            ]
          ]
        },
        "note": {
          "title": "Resolve an uncertain operation before retrying",
          "text": "Authentication failure, validation failure and a lost response need different recovery. If the service may have accepted the operation, recover its result before submitting another one."
        }
      },
      {
        "id": "implementation-handoff",
        "title": "Request the connection specifications",
        "rows": [
          {
            "title": "Access and authentication",
            "text": "Credential format, authentication procedure, key rotation and revocation, permitted operations and separate environment settings."
          },
          {
            "title": "Accounts and checkout",
            "text": "Merchant mappings, website origins, enabled methods, submission and capture responsibilities, and the authoritative payment lookup."
          },
          {
            "title": "Events and recovery",
            "text": "Event field and status definitions, delivery verification or encryption, acknowledgment, retry rules, reporting availability and rate limits."
          },
          {
            "title": "Operational contacts",
            "text": "Named contacts for access incidents, unresolved payments, refunds, disputes and funding questions. Update this record when the connection changes."
          }
        ],
        "paragraphs": [
          "Ask our integration team for the specifications assigned to your account. Keep the approved version and configuration with the connection."
        ]
      }
    ]
  },
  "checkout": {
    "introduction": "Connect your orders to checkout provided through your merchant account service. Verify each payment before updating the order.",
    "prerequisites": [
      "The checkout connection and instructions assigned to your merchant account",
      "Your order, amount, currency and references for each payment attempt",
      "The payment methods and capture policy confirmed for your setup",
      "Instructions for verifying results and recovering transactions"
    ],
    "sections": [
      {
        "id": "checkout-flow",
        "title": "The checkout flow",
        "flow": "checkout",
        "note": {
          "title": "Checkout, payment and bank receipt",
          "text": "Opening checkout is not payment approval. Authorization and capture have different meanings, and neither confirms receipt in the merchant’s bank account."
        }
      },
      {
        "id": "completion-policy",
        "title": "Confirm processing responsibilities",
        "paragraphs": [
          "Agree on one payment submission path. Repeated clicks, callbacks and notifications must resolve to the existing attempt rather than trigger another charge."
        ],
        "table": {
          "caption": "Responsibilities to confirm",
          "headers": [
            "Responsibility",
            "Decision"
          ],
          "rows": [
            [
              "Payment submission",
              "Which service submits the payment, and when it is permitted to do so."
            ],
            [
              "Authorization and capture",
              "Whether capture follows authorization separately or is included in the configured sale flow."
            ],
            [
              "Payment verification",
              "How your application obtains and verifies the result for the original attempt."
            ],
            [
              "Repeated interaction",
              "How repeated clicks, reloads and notifications resolve to the existing attempt."
            ]
          ]
        }
      },
      {
        "id": "server-setup",
        "title": "Prepare the order and payment attempt",
        "steps": [
          {
            "title": "Load the order from your server",
            "text": "Confirm that the customer may pay this order and that the order remains payable. Read the merchant, amount and currency from your stored record, not from totals supplied by the browser."
          },
          {
            "title": "Track the payment attempt",
            "text": "Keep a reference for each attempt to pay the order. Connect it to the order and merchant account, and check for an unresolved attempt when the customer refreshes or opens another tab."
          },
          {
            "title": "Use the assigned checkout connection",
            "text": "Follow the setup instructions provided through your merchant account service. Keep account credentials on your server and use the environment provided for sandbox or production."
          }
        ],
        "details": [
          {
            "title": "What if the order changes?",
            "text": "Recalculate the payable total on your server and check the existing attempt before starting a new checkout. Do not associate an existing attempt with a different merchant, currency or order total."
          }
        ],
        "note": {
          "title": "Request checkout setup instructions",
          "text": "Ask our integration team for checkout setup instructions, supported website origins, payment methods and access requirements."
        }
      },
      {
        "id": "customer-interface",
        "title": "Present the checkout page",
        "paragraphs": [
          "Show purchase details from the stored order within the checkout presentation supported by your connection. Check desktop and mobile, including cancellation, return to the order and interrupted loading."
        ],
        "details": [
          {
            "title": "Display and return behavior",
            "text": "Confirm the supported display options, website setup and return behavior with our integration team. Follow the supplied instructions rather than assuming an embedded form or a redirect is available."
          },
          {
            "title": "Closing or reopening checkout",
            "text": "Closing the interface does not cancel a payment already submitted. Check the original attempt before opening another payment flow."
          },
          {
            "title": "Wallets and bank payments",
            "text": "Use only the methods configured for the account. Confirm the domain, device and account requirements for wallets. ACH has its own authorization, completion and return process; do not apply card authorization or capture labels to it."
          }
        ]
      },
      {
        "id": "complete-payment",
        "title": "Verify and update the order",
        "steps": [
          {
            "title": "Verify the payment result",
            "text": "Use the assigned verification or lookup procedure for the original attempt. A callback, redirect or HTTP success is not payment approval. Keep an unverifiable result unresolved and follow the recovery procedure."
          },
          {
            "title": "Match the payment to the attempt",
            "text": "Check the processing account, order or reference mapping, amount, currency, transaction ID and actual operation. Resolve any fields absent from the result through the authoritative payment record. Reject a mismatch instead of attaching the payment to another order."
          },
          {
            "title": "Update the original order once",
            "text": "Save the verified transaction reference and result in an atomic update to the original attempt. Repeated callbacks and notifications must not create another charge or repeat fulfillment. Authorization, capture and fulfillment remain separate decisions."
          }
        ],
        "table": {
          "caption": "Decide from the verified outcome",
          "headers": [
            "Outcome",
            "Order handling"
          ],
          "rows": [
            [
              "Authorization approved",
              "Record the authorization reference. Follow the merchant’s capture and fulfillment policy; do not label the payment captured."
            ],
            [
              "Capture accepted",
              "Record the capture operation and its status. Settlement and bank receipt remain later events."
            ],
            [
              "Payment declined",
              "Leave the order unpaid. Offer another permitted attempt only after the decline is confirmed."
            ],
            [
              "Pending or unknown",
              "Keep the attempt unresolved and recover its status. Do not mark the order paid or automatically create another charge."
            ]
          ]
        },
        "note": {
          "title": "Do not fulfill from a browser redirect",
          "text": "A return page or a closed checkout does not prove payment. Show the order state saved from verified payment evidence, and retain an unresolved state until the original attempt is reconciled."
        }
      },
      {
        "id": "checkout-recovery",
        "title": "Recover interrupted attempts",
        "paragraphs": [
          "Start with the original order, attempt and transaction references. A timeout or closed page is not proof that processing stopped."
        ],
        "table": {
          "caption": "Interrupted checkout and recovery",
          "headers": [
            "Situation",
            "Next action"
          ],
          "rows": [
            [
              "Checkout cannot open",
              "Check the assigned environment and configuration. Request the relevant error definitions if the cause is unclear."
            ],
            [
              "Customer clicks or reloads again",
              "Resolve the original attempt before permitting another payment."
            ],
            [
              "Response is missing",
              "Look up the original payment through the assigned recovery path; an immediate empty result is not proof of failure."
            ],
            [
              "Payment is confirmed declined",
              "Retain the declined attempt and follow the permitted retry process."
            ],
            [
              "Payment is confirmed successful",
              "Update the original order once and retain the verified transaction reference."
            ]
          ]
        },
        "details": [
          {
            "title": "The browser closes or the result never arrives",
            "text": "Use the assigned transaction lookup and verified events. If no transaction ID reached the browser, recover using the server’s stored attempt and supported references. An empty lookup is not proof of failure. Keep the attempt unresolved and escalate if the recovery procedure cannot establish its outcome."
          },
          {
            "title": "Authentication is canceled or fails",
            "text": "Separate a confirmed authentication failure or cancellation from a communication failure. Resolve any uncertain processing state before offering the customer another permitted action. Do not resubmit automatically."
          },
          {
            "title": "What to record for support",
            "text": "Record the environment, integration version, order and attempt references, available transaction ID, reported error and time. Share the original error information through the support channel without including payment credentials or tokens."
          }
        ]
      },
      {
        "id": "checkout-validation",
        "title": "Prepare for launch",
        "paragraphs": [
          "Run these checks with your assigned sandbox and configured payment methods. Keep the request references, payment result and order state together."
        ],
        "rows": [
          {
            "title": "A successful payment",
            "text": "The verified merchant, amount, currency and operation match the order. The payment produces only the intended order update."
          },
          {
            "title": "An altered order or result",
            "text": "A changed browser total, wrong account, modified result or reused result from another order is rejected."
          },
          {
            "title": "Refresh and concurrent tabs",
            "text": "Both views resolve the same active attempt. A second submission cannot create a duplicate charge or fulfillment."
          },
          {
            "title": "An interrupted response",
            "text": "Close the browser after submission or interrupt the connection. Recover the original result before offering another attempt."
          },
          {
            "title": "Declines and authentication",
            "text": "Confirm the customer can recover from a decline or canceled authentication without an automatic retry."
          },
          {
            "title": "Checkout and device behavior",
            "text": "Check opening, closing and returning to checkout, including partial loading and interrupted connections. Use enabled wallets on eligible devices and ACH separately where configured."
          }
        ]
      }
    ]
  },
  "payment-requests": {
    "introduction": "Create and share a payment request, then match each payment to its order.",
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
            "text": "Confirm the business identity, purchase details, total and payment methods at the generated destination. Check the mobile view and customer terms."
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
        },
        "details": [
          {
            "title": "The customer says they paid",
            "text": "Search using the order or request references, amount and time. Check unresolved attempts before sending a new request or asking for another payment."
          },
          {
            "title": "The request is unpaid or expired",
            "text": "Verify its current state and any payment already attempted. Use the supported reminder or replacement process, keeping the relationship to the original purchase."
          },
          {
            "title": "Two payments look like duplicates",
            "text": "Compare the order and transaction references. Determine whether they are separate purchases or an unintended duplicate before taking a refund action."
          }
        ]
      }
    ]
  },
  "payment-status": {
    "introduction": "Find the original payment, check its current status and resolve an uncertain result before taking action.",
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
          "Read the recorded operation as well as its status. Use these distinctions alongside the status definitions assigned to your connection."
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
          "Use the assigned lookup for ongoing status monitoring. Follow its rate limits and recovery rules; repeatedly running broad transaction searches is not a substitute for a defined recovery process."
        ],
        "note": {
          "title": "Request reporting documentation",
          "text": "Ask our integration team for the assigned lookup endpoints, response and status definitions, reporting timing, rate limits and recovery procedure."
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
            "text": "Observed result, expected outcome, owner and next action. Share redacted diagnostics through the approved support channel."
          }
        ]
      }
    ]
  },
  "refunds-and-disputes": {
    "introduction": "Refund the right payment, respond to a dispute and track the resulting account adjustments.",
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
              "Check whether a void remains available for that operation. Eligibility depends on its current processing stage and the assigned connection."
            ],
            [
              "Captured payment",
              "Check whether a linked refund is permitted. Use the capture or sale reference and the remaining refundable amount."
            ],
            [
              "Open dispute",
              "Read the case instructions and check earlier refunds before taking a parallel action. Coordinate the response so the customer is not credited twice."
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
            "text": "Confirm the original capture or sale, currency, earlier refunds, unresolved requests and any dispute. Agree which purchase and amount the refund addresses."
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
            "text": "Keep its original reference. Check the assigned processing record or contact support. A successful submission response does not by itself establish final completion or customer receipt."
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
            "text": "Check the record of the response submitted for the case or contact the case team before the deadline. Keep the case open until the receipt or required next action is confirmed."
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
              "Use the actual report membership. A later refund or case adjustment may affect a different payout from the original sale."
            ]
          ],
          "codeColumn": false,
          "breakCodeWords": false
        }
      }
    ]
  },
  "payouts": {
    "introduction": "Match the payments and adjustments in a funding report to the amount received in your bank account.",
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
            "text": "Compare the reported funding amount with the posted bank credit and reference. Record the match, or retain the difference with an investigation owner."
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
          "text": "Our integration team can confirm the report fields, event definitions, status meanings and account mappings assigned to your connection."
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
            "text": "Keep the bank reference, amount, date and currency with the original deposit. Check for later adjustments or returns and ask the responsible team to resolve the difference rather than forcing a match."
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
            "text": "The unresolved amount, investigation owner and next check. Use a masked destination reference when contacting support."
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
  },
  "webhooks": {
    "introduction": "Verify incoming notifications, apply each change once and recover updates that arrive late or go missing.",
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
              "Application review and required setup results. Match the application and program; approval and processing readiness are separate checks."
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
            "text": "Where these checks apply, reject invalid signatures, failed decryption, unknown keys and mismatched merchants before updating an order, account or funding record. Use the response and escalation behavior defined for that subscription, retaining only safe diagnostics."
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
            "text": "Verify the notification using the assigned instructions, then check its environment and merchant. Unverified or mismatched data must not change business records."
          },
          {
            "title": "Save work before acknowledging receipt",
            "text": "Durably record the receipt and work needed to resume processing, with appropriate access and retention controls. Acknowledge durable acceptance within the subscription’s response window."
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
          "Use the assigned funding definitions, not checkout status labels. An instruction, batch and merchant deposit each has its own result and account scope."
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
          "Follow the assigned retry policy and subscription health checks. Delivery may stop; recover missing or uncertain activity against authoritative account and payment records."
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
              "No business record changes. Safe diagnostics identify the failed verification step."
            ],
            [
              "Same payment, new retry trace",
              "A retry can have a different trace ID. Keep the receipts for diagnostics, match the same business update and acknowledge as specified without repeating the action."
            ],
            [
              "Two payments, one subscription",
              "Both legitimate transactions are processed. Subscription identity does not suppress the second payment."
            ],
            [
              "Old result arrives last",
              "An older event does not replace the confirmed current state. Resolve conflicting updates through the authoritative record."
            ],
            [
              "Receipt storage fails",
              "The receiver does not falsely acknowledge durable acceptance. Recovery follows the subscription instructions."
            ],
            [
              "Worker interruption",
              "Resume stored work after acknowledgment. Apply changes atomically so a worker restart cannot repeat fulfillment or a financial action."
            ],
            [
              "Delivery stops",
              "Subscription health, credentials and certificates are checked; missing activity is recovered through reconciliation."
            ]
          ],
          "codeColumn": false
        },
        "details": [
          {
            "title": "Capture useful diagnostics",
            "text": "Keep the environment, subscription ID, delivery attempt IDs, event type, receipt time, mapped merchant and affected record reference. Distinguish a delivery failure from a failure in the worker or in business validation. Do not put decrypted payment data, tokens or private keys into ordinary logs."
          }
        ]
      }
    ]
  },
  "testing-and-launch": {
    "introduction": "Confirm the payment journey in sandbox, review the integration and prepare the production account for launch.",
    "prerequisites": [
      "The connection settings and services you plan to use",
      "Sandbox accounts, credentials and data supplied by our integration team",
      "Contacts for integration setup, launch and ongoing support"
    ],
    "sections": [
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
          "For each enabled method, compare the customer’s result with the payment record. Record the configuration, expected and observed result, references, reviewer and unresolved issues. Remove sensitive details from retained diagnostics."
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
              "Invalid data cannot change state. Repeated delivery has one business effect, and an older event cannot regress a confirmed result. Keep receipt and processing evidence."
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
            "title": "Confirm account readiness",
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
            "text": "Explain the reported amount from payments and adjustments. A sandbox funding record does not confirm bank receipt; live bank receipt needs a separate, authorized check."
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
          "Review account setup, checkout, events, reporting and recovery with our integration team. Record required certification and its configuration. Resolve issues and repeat the affected checks before enabling that method or connection."
        ],
        "table": {
          "caption": "Launch readiness",
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
          "text": "Production uses separate access, configuration and operational approval. Sandbox results do not establish that live processing or funding is ready."
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
            "title": "Agree the live payment checks",
            "text": "Agree who will perform the checks, which actions are permitted, the limits and when to stop with the account team. Any live application, transaction, refund or movement of funds requires that separate procedure."
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
            "text": "Include the environment, affected merchant, record and attempt references, timestamp with time zone, expected outcome and observed result. Share redacted diagnostics through the approved channel."
          },
          {
            "title": "For an incident",
            "text": "Identify whether the problem is access, payment processing, delivery, worker execution or reconciliation. Assign someone to investigate and resolve uncertain attempts before retrying."
          }
        ]
      }
    ]
  }
};
