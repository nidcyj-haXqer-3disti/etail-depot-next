import { achPaymentsContent } from "@/features/services/ach-payments/content";
import { merchantAccountGuidance } from "../../shared/site/merchant-account-guidance";
import { hostedServices } from "@/shared/site/hosted-services";

export type { ServiceKind, ServiceDetailContent } from "@/features/services/shared/content-types";
import type { ServiceDetailContent } from "@/features/services/shared/content-types";

/** Service explanations and decision points. Provider features are not product entitlement. */
export const SERVICE_DETAIL_PAGES = {
  "/merchant-onboarding": {
    "kind": "onboarding",
    "label": "Merchant onboarding",
    "title": "Merchant Onboarding and Account Setup",
    "description": "Apply for a merchant account with the right business records. Understand account review, service terms and payment setup before your first sale.",
    "heading": "Apply for your merchant account.",
    "intro": "Complete your business information and check your application status in one place.",
    "action": {
      "label": "Start now",
      "href": hostedServices.payments.registrationUrl
    },
    "secondaryAction": {
      "label": "Discuss your business first",
      "href": "/contact#payment-review"
    },
    "note": `${merchantAccountGuidance.application} Account approval and setup are required.`,
    "art": {
      "title": "Trolleys merchant application portal. Continue an incomplete application and begin with Company Profile.",
      "caption": "Application portal illustration",
      "steps": []
    },
    "sections": [
      {
        "id": "application-information",
        "title": "Start with your business.",
        "items": [
          {
            "title": "Business and ownership",
            "text": "Provide company records and details of the people who own or represent the business."
          },
          {
            "title": "Sales and delivery",
            "text": "Describe what you sell, where customers pay and when they receive their purchase."
          },
          {
            "title": "Processing needs",
            "text": "Include expected volume, refund terms and any restrictions with a previous provider."
          }
        ]
      },
      {
        "id": "payment-configuration",
        "title": "Keep your account current.",
        "items": [
          {
            "title": "Outstanding requirements",
            "text": "Follow up on requested information. An incomplete review can delay account activation."
          },
          {
            "title": "Changes to your business",
            "text": "Keep ownership, sales activity, website and receiving bank information current."
          },
          {
            "title": "Your checkout connection",
            "text": "Confirm checkout and software access separately. Account approval alone does not complete an integration."
          }
        ]
      }
    ],
    "workflow": {
      "title": "A clear path to account setup.",
      "intro": "Four steps through application, review and account setup.",
      "steps": [
        {
          "title": "Apply",
          "detail": "Submit business and ownership information through Trolleys."
        },
        {
          "title": "Complete the review",
          "detail": "Provide requested records and resolve any outstanding requirements."
        },
        {
          "title": "Review the agreement",
          "detail": "Understand fees, permitted activity, payout timing and reserve conditions."
        },
        {
          "title": "Complete account setup",
          "detail": "After approval, configure payment methods, account access and the receiving bank."
        }
      ],
      "note": "Submitting an application does not enable payments. Software connections may require separate configuration."
    }
  },
  "/payment-methods": {
    "kind": "methods",
    "label": "Payment methods",
    "title": "Credit Cards, Digital Wallets and ACH Payment Methods",
    "description": "Offer credit and debit cards, Apple Pay, Google Pay and ACH through the methods enabled for your merchant account. Keep each result connected to its order.",
    "heading": "More ways to complete the purchase.",
    "intro": "Accept cards, digital wallets and ACH through the methods enabled for your account. Give customers a familiar way to pay and keep each payment connected to the order.",
    "action": {
      "label": "Explore online checkout",
      "href": "/online-businesses#customer-checkout"
    },
    "note": "Methods depend on account setup. Wallet availability also depends on the customer’s card and device.",
    "art": {
      "title": "Cards, digital wallets and ACH connect through checkout to the order record",
      "caption": "A browser return alone does not confirm payment. Follow the recorded payment status.",
      "steps": []
    },
    "sections": [
      {
        "id": "available-methods",
        "title": "Offer the methods your customers use.",
        "items": [
          {
            "title": "Credit and debit cards",
            "text": "Visa, Mastercard, American Express and Discover through your configured checkout."
          },
          {
            "title": "Apple Pay and Google Pay",
            "text": "Eligible customers can pay with a card already held in their digital wallet."
          },
          {
            "title": "ACH bank payments",
            "text": "An authorized payment from a US bank account, with its own processing and return timelines."
          }
        ]
      },
      {
        "id": "method-setup",
        "title": "A payment result your team can act on.",
        "items": [
          {
            "title": "Authorized or captured",
            "text": "A card authorization and capture are separate events. Follow the status required by your fulfillment process."
          },
          {
            "title": "Pending or interrupted",
            "text": "Check the existing payment before requesting another attempt."
          },
          {
            "title": "Declined or returned",
            "text": "Keep the unsuccessful attempt with the order and offer an appropriate next step."
          }
        ]
      }
    ],
    "workflow": {
      "title": "Connect checkout to the order.",
      "intro": "Keep the purchase reference from the first payment attempt to the final result.",
      "steps": [
        {
          "title": "Create the order",
          "detail": "Set the merchant, amount and purchase reference."
        },
        {
          "title": "Present the methods",
          "detail": "Show the options supported by the account and customer device."
        },
        {
          "title": "Check the result",
          "detail": "Use the verified payment record to confirm what happened."
        },
        {
          "title": "Update fulfillment",
          "detail": "Release, hold or follow up on the order according to the payment status."
        }
      ],
      "note": "A pending or interrupted payment needs a status check before another attempt. ACH has separate return and payout terms."
    }
  },
  "/ach-payments": achPaymentsContent,
  "/payouts-and-reconciliation": {
    "kind": "payouts",
    "label": "Payouts",
    "title": "Merchant Payouts and Bank Deposits",
    "description": "Understand what makes up your merchant payout. Follow included payments, fees, refunds and account adjustments through to the deposit in your bank.",
    "heading": "From customer payments to your bank.",
    "intro": "See the payments and adjustments behind each payout. Follow the amount from your account records to the deposit at your bank.",
    "action": {
      "label": "Discuss your payout setup",
      "href": "/contact#payment-review"
    },
    "note": "Payout schedules, reserves, reviews and bank processing depend on your account terms.",
    "art": {
      "title": "Eligible payment activity, fees and account adjustments form a payout, which is matched to the bank deposit",
      "caption": "A payout report and a posted bank deposit are separate records.",
      "steps": []
    },
    "sections": [
      {
        "id": "payouts",
        "title": "Understand the amount you receive.",
        "items": [
          {
            "title": "Included payments",
            "text": "Identify which payments are eligible for this payout and which remain for a later period."
          },
          {
            "title": "Fees and adjustments",
            "text": "Review processing fees, refunds, disputes and reserve movements against the included activity."
          },
          {
            "title": "Bank deposit",
            "text": "Use the payout amount and reference to locate the credit at your receiving bank."
          }
        ]
      },
      {
        "id": "reconciliation",
        "title": "When a payout needs attention.",
        "items": [
          {
            "title": "Not yet received",
            "text": "Check the payout status, schedule and bank holidays. Contact merchant support with the payout reference if it is overdue.",
            "href": "/contact#account-support"
          },
          {
            "title": "Failed or returned",
            "text": "Check the payout status and receiving bank details before requesting a correction through account support."
          },
          {
            "title": "A different amount",
            "text": "Compare included transactions and adjustments with the bank credit before closing the period.",
            "href": "/reconciliation"
          }
        ]
      }
    ],
    "workflow": {
      "title": "From payment to bank deposit.",
      "intro": "Card processing, payout calculation and bank receipt are separate stages.",
      "steps": [
        {
          "title": "Capture",
          "detail": "An authorized card payment is submitted for processing."
        },
        {
          "title": "Settlement",
          "detail": "Processing and settlement records establish the payment activity."
        },
        {
          "title": "Payout calculation",
          "detail": "Eligible activity is combined with fees and account adjustments."
        },
        {
          "title": "Bank deposit",
          "detail": "The receiving bank posts the deposit. Match its amount and reference."
        }
      ],
      "note": "First payouts, reviews and account conditions can affect timing. A missing payout is not a reason to charge the customer again."
    }
  },
  "/reconciliation": {
    "kind": "reconciliation",
    "label": "Reconciliation",
    "title": "Payment Reconciliation and Payout Reporting",
    "description": "Connect transaction records, payout reports and bank deposits. Understand payment reconciliation and investigate timing, fees and account differences.",
    "heading": "Know what makes up every deposit.",
    "intro": "Match payments and adjustments to the payout report, then match the payout to your bank. Separate timing differences from amounts that need investigation.",
    "action": {
      "label": "Explore reconciliation guidance",
      "href": "/docs/payouts"
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
  },
  "/refunds-and-disputes": {
    "kind": "refunds",
    "label": "Refunds",
    "title": "Merchant Refunds and Payment Reversals",
    "description": "Manage a customer refund from the original payment. Choose the permitted action, avoid duplicate returns and follow the refund record through its outcome.",
    "heading": "Manage refunds from the original payment.",
    "intro": "Find the transaction, confirm the amount still eligible to return and follow the result. Keep the refund linked to the original order.",
    "action": {
      "label": "Explore refund guidance",
      "href": "/docs/refunds-and-disputes#refund-payment"
    },
    "art": {
      "title": "A card payment status determines whether a reversal, void or refund is available",
      "caption": "Available actions depend on payment status, processor support and account permissions.",
      "steps": []
    },
    "sections": [
      {
        "id": "refunds",
        "title": "Choose the action that fits the payment.",
        "items": [
          {
            "title": "Authorization reversal",
            "text": "For an uncaptured card authorization, a supported reversal can release the reserved amount."
          },
          {
            "title": "Void",
            "text": "A supported void can cancel a captured transaction before it is sent for settlement."
          },
          {
            "title": "Refund",
            "text": "For an eligible captured or settled payment, return all or part of the amount still refundable."
          }
        ]
      },
      {
        "id": "disputes",
        "title": "Avoid duplicate refunds.",
        "items": [
          {
            "title": "Pending or unsuccessful",
            "text": "Check the existing refund’s status before submitting another request."
          },
          {
            "title": "Customer receipt",
            "text": "Share the refund amount and reference. Bank posting is separate from processing."
          },
          {
            "title": "Payment already disputed",
            "text": "Follow the dispute instructions before issuing a refund. Returning funds does not automatically close the case.",
            "href": "/disputes"
          }
        ]
      }
    ],
    "workflow": {
      "title": "A clear record from request to return.",
      "intro": "Check previous activity before sending money back.",
      "steps": [
        {
          "title": "Find the transaction",
          "detail": "Match the customer’s request to the original order and payment."
        },
        {
          "title": "Check the balance",
          "detail": "Review earlier refunds, payment status and any open dispute."
        },
        {
          "title": "Submit the return",
          "detail": "Choose the supported action and confirm the eligible amount."
        },
        {
          "title": "Track the result",
          "detail": "Keep the refund reference, status and account adjustment with the sale."
        }
      ],
      "note": "A pending refund needs a status check before another request. The customer’s bank controls when the credit appears."
    }
  },
  "/disputes": {
    "kind": "disputes",
    "label": "Disputes",
    "title": "Chargeback and Dispute Management for Merchants",
    "description": "Review a cardholder dispute, understand the response deadline and organize evidence from the original sale. Follow the case outcome and account adjustment.",
    "heading": "Manage chargebacks with a clear record.",
    "intro": "Understand the claim, decide whether to accept or challenge it, and respond before the deadline. Follow the outcome and its effect on your account.",
    "action": {
      "label": "Explore dispute guidance",
      "href": "/docs/refunds-and-disputes#dispute-case"
    },
    "art": {
      "title": "A dispute notice leads to accepting the claim or challenging it with relevant evidence before the deadline",
      "caption": "Evidence supports a response. It does not guarantee a decision in the merchant’s favor.",
      "steps": []
    },
    "sections": [
      {
        "id": "case-review",
        "title": "Know what needs a response.",
        "items": [
          {
            "title": "Claim and deadline",
            "text": "Read the reason, disputed amount and deadline on the notice."
          },
          {
            "title": "Original payment",
            "text": "Match the case to the order, transaction and customer records."
          },
          {
            "title": "Account impact",
            "text": "Follow the disputed amount, applicable fees and later adjustments."
          }
        ]
      },
      {
        "id": "evidence",
        "title": "Relevant evidence is stronger than more paperwork.",
        "items": [
          {
            "title": "The purchase",
            "text": "Use the order, receipt and terms that relate to the disputed transaction."
          },
          {
            "title": "Delivery or service",
            "text": "Provide fulfillment records that address the claim, such as proof of delivery or service completion."
          },
          {
            "title": "Communication and refunds",
            "text": "Include relevant customer correspondence and records of any funds already returned."
          }
        ]
      }
    ],
    "workflow": {
      "title": "From notice to resolution.",
      "intro": "Each response should address the specific reason for the dispute.",
      "steps": [
        {
          "title": "Review the notice",
          "detail": "Check the claim, original payment and response deadline."
        },
        {
          "title": "Choose your response",
          "detail": "Accept the dispute or challenge it with relevant supporting records."
        },
        {
          "title": "Complete the response",
          "detail": "If challenging, submit the requested evidence within the case deadline."
        },
        {
          "title": "Follow the outcome",
          "detail": "Track the decision and match the account adjustment to the original payment."
        }
      ],
      "note": "Case outcomes follow the applicable network process. Fees and response options are governed by your account terms."
    }
  }
} as const satisfies Record<string, ServiceDetailContent>;
export type ServiceDetailPath = keyof typeof SERVICE_DETAIL_PAGES;
export function isServiceDetailPath(path: string): path is ServiceDetailPath { return Object.hasOwn(SERVICE_DETAIL_PAGES, path); }
