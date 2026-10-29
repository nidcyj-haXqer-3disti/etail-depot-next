/** Original industry workflow guidance; account eligibility and integration scope require review. */
type IndustryCase = {
  slug: string; label: string; intro: string;
  workflowTitle: string; workflow: readonly { title: string; body: string }[];
  scopeTitle: string; scope: string;
};

export const industryCases = {
  "marketplaces": {
    "slug": "commerce-marketplaces",
    "label": "Commerce marketplace platforms",
    "intro": "For ecommerce marketplaces connecting buyers with independent sellers. Keep seller identity, order details and payment records together so your team can handle returns and reconcile what was received.",
    "workflowTitle": "From seller onboarding to reconciliation.",
    "workflow": [
      {
        "title": "Define the seller model",
        "body": "Identify the sellers, products and merchant of record. Agree who handles customer support, refunds and disputes before onboarding."
      },
      {
        "title": "Connect checkout to the order",
        "body": "Keep the order and seller references with the payment. Show the amount, delivery terms and return policy before the customer pays."
      },
      {
        "title": "Follow refunds and disputes",
        "body": "Link each refund or dispute to the original payment, seller and order items. Keep the outcome with the order history."
      },
      {
        "title": "Reconcile seller activity",
        "body": "Match sales, fees, refunds and adjustments to funding reports and bank deposits under the agreed account structure."
      }
    ],
    "scopeTitle": "Agree the marketplace money flow.",
    "scope": "Seller eligibility, the merchant of record, platform fees and payout arrangements are confirmed before integration. Split payments, holding funds and transfers to sellers require a separately approved setup."
  },
  "freight": {
    "slug": "freight-platforms",
    "label": "Freight platforms",
    "intro": "For transportation management systems and freight forwarding software. Customer payments need to identify the invoice and shipment, including partial receipts and payments covering several invoices. Bank deposits alone do not explain that allocation.",
    "workflowTitle": "From customer invoice to bank deposit.",
    "workflow": [
      {
        "title": "Prepare the invoice",
        "body": "Record the customer, shipment, charges and amount due. Use the same invoice reference throughout the payment flow."
      },
      {
        "title": "Collect the payment",
        "body": "Present the amount and receiving business clearly. Use the card or ACH methods approved for the merchant account."
      },
      {
        "title": "Allocate the receipt",
        "body": "Apply the confirmed payment result to the relevant invoices. Preserve that allocation if a refund or reversal follows."
      },
      {
        "title": "Match the bank deposit",
        "body": "Reconcile receipts, processing fees and other adjustments with the funding report and bank statement."
      }
    ],
    "scopeTitle": "Begin with customer invoice payments.",
    "scope": "We review customer invoice collection for brokers, forwarders and other freight businesses. Carrier disbursements, factoring, credit and holding funds for other parties require separate arrangements."
  },
  "travel": {
    "slug": "travel-platforms",
    "label": "Travel platforms",
    "intro": "For travel advisor, tour and booking software. A planning fee pays for an advisor’s work; a booking payment may go to a different seller. Identify who collects each amount and who handles a cancellation or refund.",
    "workflowTitle": "From booking details to payment records.",
    "workflow": [
      {
        "title": "Identify the seller",
        "body": "Record the business collecting payment, the travel service and its delivery date. Clarify any supplier relationship."
      },
      {
        "title": "Confirm the payment",
        "body": "Show the amount, payment purpose and cancellation terms before authorization. Confirm who owes any refund."
      },
      {
        "title": "Track the balance",
        "body": "Keep confirmed payments and the amount still due with the booking. Preserve the original records when the itinerary changes."
      },
      {
        "title": "Reconcile the changes",
        "body": "Follow refunds and disputes through to their outcomes, then match the adjustments to the payment and deposit records."
      }
    ],
    "scopeTitle": "Confirm who collects the booking funds.",
    "scope": "Planning fees, agency collections and tour sales need their own review. Funding schedules, reserves and holds depend on the business and the time before travel. Supplier payments, escrow and supplier failure protection are outside this payment acceptance scope."
  },
  "legal": {
    "slug": "legal-software",
    "label": "Legal software",
    "intro": "For legal practice management and billing software. An earned fee, a client advance and a creditor collection have different account requirements. Identify the payment purpose and receiving account before sending the client to checkout.",
    "workflowTitle": "From client invoice to matter records.",
    "workflow": [
      {
        "title": "Classify the payment",
        "body": "Identify the firm, invoice and matter. Record whether the payment is for earned fees, an advance or another purpose."
      },
      {
        "title": "Confirm the account",
        "body": "Agree the receiving account and the handling of processing fees, refunds and dispute debits before accepting payment."
      },
      {
        "title": "Record the result",
        "body": "Match the confirmed payment result to the invoice and matter. Keep any later adjustment linked to that transaction."
      },
      {
        "title": "Reconcile the records",
        "body": "Match receipts, adjustments and bank deposits to the relevant account and matter records."
      }
    ],
    "scopeTitle": "Review specialist payment flows separately.",
    "scope": "Trust and IOLTA account support is not confirmed. Client advances, bankruptcy fees and creditor collections need specific review. The firm must apply the professional rules and account requirements that govern its jurisdiction."
  }
} as const satisfies Record<string, IndustryCase>;
