import type { BlogArticle } from "./content";

/** Human-supplied article dated 15 November 2026. Only established Trolleys naming is normalized. */
export const gatewayPayfacArticle: BlogArticle = {
  "path": "/company/blog/payment-gateway-vs-payfac",
  "title": "A Payment Gateway Is Not a PayFac. Here Is Why It Matters to You.",
  "description": "Merchants use \"gateway\" and \"payment processor\" and \"PayFac\" as if they were the same thing, and sales teams rarely correct them. The words describe companies in different businesses, carrying different risks, and owing you different things. Knowing which one you are dealing with tells you who approved you, who can freeze your money, who answers when something breaks, and who is on the hook when it does.",
  "searchTitle": "Payment gateway vs. PayFac: why the difference matters",
  "summary": "A gateway connects your checkout. A payment facilitator takes on merchant responsibilities. Know who handles your account, payouts and risk.",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-15",
  "relatedPaths": [
    "/company/blog/reselling-payments-vs-running-a-payfac",
    "/company/blog/what-your-payment-provider-is-really-saying-yes-to"
  ],
  "sections": [
    {
      "id": "gateway-messages",
      "title": "A gateway moves messages"
    },
    {
      "id": "payfac-responsibilities",
      "title": "A PayFac moves money, and owns the consequences"
    },
    {
      "id": "risk-profiles",
      "title": "Two risk profiles"
    },
    {
      "id": "choosing-your-provider",
      "title": "Why it matters when you choose"
    }
  ],
  "sources": [
    {
      "label": "Cybersource: Payment processing and merchant accounts",
      "href": "https://developer.cybersource.com/docs/cybs/en-us/payments/developer/cardnet/so/payments.html"
    },
    {
      "label": "Visa: The payment facilitator model",
      "href": "https://usa.visa.com/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};

export const gatewayPayfacBody = {
  "sections": [
    {
      "id": "gateway-messages",
      "title": "A gateway moves messages",
      "paragraphs": [
        "A payment gateway is the pipe between your checkout and the card networks. It encrypts card data, sends the authorization request to the acquirer, returns the approve-or-decline, and tokenizes the card for next time. Authorize.net, NMI and Cybersource are gateways. So is the gateway layer inside Stripe or Adyen, though those companies also do much more.",
        "The gateway's business is software. It sells connectivity, uptime, security and integrations, priced per transaction or per month. It does not decide whether you are allowed to accept cards. That decision belongs to a merchant account you obtain separately from an acquiring bank or a facilitator. The gateway plugs into it. If the merchant account is closed, the gateway still works perfectly. It just has nowhere to send the money."
      ]
    },
    {
      "id": "payfac-responsibilities",
      "title": "A PayFac moves money, and owns the consequences",
      "paragraphs": [
        "A payment facilitator holds a master merchant account with an acquiring bank and boards you underneath it as a sub-merchant. It underwrites you, settles funds to you, splits fees, handles disputes, files the compliance reports and is the party of record to the networks for everything you process. Square, Stripe and Shopify Payments operate as PayFacs. So does Trolleys, an Etail Depot service.",
        "The PayFac's business is risk. It uses a gateway, often several, as plumbing. What it sells is the merchant account itself: the right to accept cards without going through a bank's underwriting on your own. It earns a margin on your volume in exchange for guaranteeing your behavior to the bank and the networks. That is a financial-services business with a software front end, not the other way around."
      ]
    },
    {
      "id": "risk-profiles",
      "title": "Two risk profiles",
      "paragraphs": [
        "Ask one question of each: what happens when a merchant fails?",
        "If a merchant using a standalone gateway takes $100,000 in orders and never ships, the gateway loses a customer. Its exposure is operational: breaches, downtime, bugs. It never touched the funds, so it never has to return them.",
        "If that merchant is a sub-merchant of a PayFac, the chargebacks land on the PayFac. The acquiring bank debits the facilitator's account and expects it to recover the money from the merchant, if it can. The PayFac also carries the regulatory exposure: it is the one that was supposed to know who the merchant was, monitor the activity, and report anything suspicious. Its exposure is credit risk, fraud risk and compliance risk, concentrated across every merchant on its platform, every day."
      ],
      "comparison": [
        [
          "What it sells",
          "Connectivity and security software",
          "A merchant account and the right to accept cards"
        ],
        [
          "Approves you",
          "No; needs a merchant account from someone else",
          "Yes; underwrites and boards you as a sub-merchant"
        ],
        [
          "Touches your funds",
          "No",
          "Yes; settles, splits and pays out"
        ],
        [
          "Can hold your money",
          "No",
          "Yes"
        ],
        [
          "Loses money if you fail",
          "No",
          "Yes; chargebacks and losses roll up to it"
        ],
        [
          "Regulatory exposure",
          "Data security (PCI)",
          "KYB, AML, sanctions, network rules, money transmission, PCI"
        ],
        [
          "Business model",
          "Software fees",
          "Margin on volume in exchange for carrying your risk"
        ]
      ]
    },
    {
      "id": "choosing-your-provider",
      "title": "Why it matters when you choose",
      "paragraphs": [
        "The confusion costs merchants in two directions. Some sign up with a gateway believing they have a merchant account, and discover at launch that they still need one. Others blame their gateway for a frozen payout that the gateway had no part in, while the facilitator who actually made the decision stays out of view.",
        "It also explains behavior. A gateway can afford to be hands-off because nothing you do costs it money. A facilitator cannot. When a PayFac asks about your fulfilment, your refund rate or your growth plans, it is not bureaucracy. It is the party that will pay for your mistakes trying to understand them in advance. The question to ask any provider is simple: if my customers charge back and I cannot cover it, who pays? If the answer is \"you do, to us,\" you are talking to a PayFac, and the quality of its risk team is the quality of your payments relationship.",
        "Trolleys powered by Etail Depot is a payment facilitator by choice. We use gateways, including Cybersource, as infrastructure, but we hold the merchant account, carry the risk and make the decisions. That is why we can promise what a gateway structurally cannot: a reason for every decision about your account, a date for every payout, and a person who is accountable for both."
      ]
    }
  ]
};
