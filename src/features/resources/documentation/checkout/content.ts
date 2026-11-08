import { documentationMetadata } from "@/features/resources/documentation/catalog";
import type { DocArticle } from "@/features/resources/documentation/types";

export const checkoutArticle: DocArticle = {
    "introduction": documentationMetadata["/docs/checkout"].description,
    "prerequisites": [
      "The checkout connection and instructions provided for your merchant account",
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
            "title": "Use your account’s checkout connection",
            "text": "Follow the setup instructions provided through your merchant account service. Keep account credentials on your server and use the environment provided for sandbox or production."
          }
        ],
        "details": [
          {
            "title": "Order changes",
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
            "text": "Follow the payment verification or lookup instructions for your integration to check the original attempt. A callback, redirect or HTTP success is not payment approval. Keep an unverifiable result unresolved and follow the recovery procedure."
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
              "Check the environment and checkout settings for your account. Request the relevant error definitions if the cause is unclear."
            ],
            [
              "Customer clicks or reloads again",
              "Resolve the original attempt before permitting another payment."
            ],
            [
              "Response is missing",
              "Look up the original payment using the recovery procedure for your integration; an immediate empty result is not proof of failure."
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
            "text": "Use the transaction lookup and verified events supported by your integration. If no transaction ID reached the browser, recover using the server’s stored attempt and supported references. An empty lookup is not proof of failure. Keep the attempt unresolved and contact our integration team if you cannot confirm the result."
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
          "Use your sandbox account and enabled payment methods for these checks. Keep the request references, payment result and order state together."
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
  };
