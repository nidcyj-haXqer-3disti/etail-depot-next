/** Human-authored editorial content. Preserve supplied wording unless the author
 * approves edits. Dates come from marketing; undated articles omit them during publication review.
 */
export type BlogArticle = {
  path: `/company/blog/${string}`;
  title: string;
  /** Original opening paragraph, displayed in the article without rewriting. */
  description: string;
  /** Concise listing and search copy, separate from the human-authored article. */
  summary: string;
  searchTitle: string;
  relatedPaths: readonly `/company/blog/${string}`[];
  category: string;
  author: { name: string; type: "Person" | "Organization"; url?: string };
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: string;
  cover?: { src: `/${string}`; width: number; height: number; alt: string; caption?: string };
  sources?: readonly { label: string; href: string }[];
  sections: readonly { id: string; title: string }[];
};

export const moneyStopsMovingArticle: BlogArticle = {
  "searchTitle": "When your money stops moving",
  "summary": "A merchant’s perspective on frozen funds, payment holds and the importance of clear communication from a payment provider.",
  "relatedPaths": [
    "/company/blog/payment-service-providers-holding-merchant-payouts",
    "/company/blog/how-etail-depot-handles-risk"
  ],
  "path": "/company/blog/when-your-money-stops-moving",
  "title": "When your money stops moving: The payment processor’s preference is to freeze merchant funds",
  "description": "The most damaging act a payment provider can do to its merchant is not over charge, but take the money its merchant already earned and then go silent.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Shopify merchant report: 10% reserve",
      "href": "https://www.reddit.com/r/shopify/comments/1wteprb/shopify_put_a_10_reserve_on_my_payouts/"
    },
    {
      "label": "Square merchant report: $14,000 payment",
      "href": "https://community.squareup.com/t5/Your-Square-Account-Information/Re-holding-funds/m-p/323807"
    },
    {
      "label": "Stripe: Reserves and account review",
      "href": "https://support.stripe.com/questions/reserves-frequently-asked-questions"
    },
    {
      "label": "PayPal: Reasons for payment holds",
      "href": "https://www.paypal.com/us/cshelp/article/why-is-my-payment-on-hold-or-unavailable-help126"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};

/** Body supplied by marketing. The first paragraph is the article's opening deck. */
export const moneyStopsMovingBody = {
  "opening": "It starts with an email saying that “your account is under review” and the payout you were expecting this Friday never arrives. A client dashboard reflects a balance that the merchant simply cannot touch, and a status that says “high risk”, and an estimated release date of never. For insult to injury, there’s no direct phone or contact person, no escalation path, and the merchant’s payroll is just days away.",
  "heading": "What a frozen-funds hold looks like from the merchant’s side",
  "paragraphs": [
    "Holds occur across Stripe, Square, Shopify, PayPal and other mainstream providers. They do not have to follow a chargeback; a sharp increase in sales can also trigger a review or reserve.",
    "A Shopify seller with zero chargebacks says they were put on a 10% reserve for chargeback risk. A Square merchant says they were required to refund a $14,000 payment after the review team suspected a stolen credit card, and they could not speak with the review team about it.",
    "Etail Depot has walked this path through Trolleys.ai, our global marketplace. It knows what happens behind the curtains of an honest business. This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
  ]
} as const;

export const merchantPayoutHoldsArticle: BlogArticle = {
  "searchTitle": "Payment providers holding merchant payouts",
  "summary": "How merchant payout holds affect working capital, business operations and the time spent seeking support.",
  "relatedPaths": [
    "/company/blog/when-your-payment-provider-freezes-your-funds",
    "/company/blog/how-etail-depot-handles-risk"
  ],
  "path": "/company/blog/payment-service-providers-holding-merchant-payouts",
  "title": "Payment Service Providers Holding Merchant Payouts",
  "description": "For small businesses, gig workers and contractors, a hold is not a delay, it is a liquidity event with no end date.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Hacker News: Account restoration and provider response",
      "href": "https://news.ycombinator.com/item?id=28085706"
    },
    {
      "label": "Shopify merchant report: Working capital held in reserve",
      "href": "https://community.shopify.com/t/why-is-shopify-holding-my-funds-for-120-days/246036/4"
    },
    {
      "label": "Stripe merchant report: Payouts held in reserve",
      "href": "https://www.reddit.com/r/stripe/comments/omtmlb/28000_stripe_payouts_held_in_reserve_twice/"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    }
  ]
};

export const merchantPayoutHoldsParagraphs = [
  "“That was basically my working capital” wrote a Shopify merchant. A Stripe merchant wrote that a payout hold could put them out of business. This money held by Service Providers was supposed to pay suppliers, inventory replenishment, payroll and other critical elements of a business; however, the money is sitting in someone else’s ledger, earning nothing, with a release date that moves further away or does not exist.",
  "The second major cost is time. Merchants describe calling almost every day and getting nowhere, promised callbacks within 24 hours that never happen, and countless tickets closed without an actual resolution. Business owners who should be selling spend weeks writing emails into a void.",
  "The third cost is dignity. One owner reported that their account was restored after a public thread and other outreach, and shared the provider’s email acknowledging the closure was a mistake. Is this a support process or a lottery?",
  "Etail Depot wants its merchants to go online and write amazing compliments about the support structure. To achieve that, the merchants need to know they can raise concerns and ask for review under an Etail agreement. This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
] as const;

export const frozenFundsArticle: BlogArticle = {
  "searchTitle": "Why payment providers freeze merchant funds",
  "summary": "A look at payment risk reviews, frozen funds and the need to consider a merchant’s business context.",
  "relatedPaths": [
    "/company/blog/how-etail-depot-handles-risk",
    "/company/blog/why-instant-onboarding-is-a-trap"
  ],
  "path": "/company/blog/payment-service-providers-freeze-funds-without-justification",
  "title": "Payment Service Providers Freeze Funds Without Justification",
  "description": "Merchants are not naïve about risk. They can understand the logic and still find 180 days of frozen funds abusive and absurd. The anger is not that a provider manages risk; it’s that it does it without engaging the merchant whatsoever.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Reddit: Merchant report of funds held beyond 180 days",
      "href": "https://www.reddit.com/r/stripe/comments/1g9lmcp/stripe_holding_our_aed_10288266_for_more_than_180/"
    },
    {
      "label": "Stripe: Credit account review process",
      "href": "https://support.stripe.com/questions/credit-account-review-process-frequently-asked-questions"
    },
    {
      "label": "Square: Account reviews and information requests",
      "href": "https://squareup.com/help/us/en/article/8317-manage-information-requests"
    },
    {
      "label": "PayPal: Holds, limitations and risk criteria",
      "href": "https://www.paypal.com/us/legalhub/paypal/useragreement-full"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};

export const frozenFundsParagraphs = [
  "At scale, a payment provider can start with a risk signal rather than the full picture of your business. A busy weekend, a single large order, a launch that finally works; each can show up as a spike in an automated review. Providers can ask for your invoices, your tracking numbers or your business plan to understand the context. The provider may not explain the specific pattern behind its decision. When the explanation is unclear, the merchant can be left unsure of the amount affected, the release date or where to send proof.",
  "Etail Depot reviews each business separately. With Etail Depot, the merchant holds the evidence, and the account terms identify who holds the money and who can release it. This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
] as const;

export const riskCommunicationArticle: BlogArticle = {
  "searchTitle": "Payment risk, context and communication",
  "summary": "Etail Depot’s approach to payment risk, including communication about holds, release schedules and merchant evidence.",
  "relatedPaths": [
    "/company/blog/why-instant-onboarding-is-a-trap",
    "/company/blog/when-your-payment-provider-freezes-your-funds"
  ],
  "path": "/company/blog/how-etail-depot-handles-risk",
  "title": "How Etail Depot Handles Risk: Clear Communication and Proper Context",
  "description": "Etail Depot will not promise that funds will never be held. A payment facilitator has responsibilities under its acquiring agreements and the applicable card network rules. What we DO promise is to explain the reason and available next steps where disclosure is permitted.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    }
  ]
};

export const riskCommunicationParagraphs = [
  "Where disclosure is permitted, we explain the reason for a hold, the amount affected and any available steps to resolve it.",
  "Your reserve notice explains the review and release conditions. Release estimates can change while obligations remain unresolved, and extensions are explained where disclosure is permitted.",
  "You can submit relevant evidence for review through the contact in your reserve notice. Tracking, delivery proof, signed receipts, dispute history and business documents can support a review.",
  "Growth is declared, not punished. Tell us about the launch, the Black Friday push, or the large order ahead of time, so we can review any changes needed to your approved limits.",
  "Your money should never go silent. If you have had funds frozen without explanation, you already know the problem is not the hold. It is the silence. Payments infrastructure that cannot tell you why, when, or who is not managing risk, they’re passing it to you.",
  "At Etail Depot, a score is a summary. A merchant is a business with a history and a story, a customer base and documents that prove it.  This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
] as const;

export const merchantSupportArticle: BlogArticle = {
  "searchTitle": "When funds freeze, who picks up the phone?",
  "summary": "Why access to a human contact matters when a payment provider holds merchant funds and working capital is at stake.",
  "relatedPaths": [
    "/company/blog/how-etail-depot-handles-risk",
    "/company/blog/payment-service-providers-holding-merchant-payouts"
  ],
  "path": "/company/blog/when-your-payment-provider-freezes-your-funds",
  "title": "When Your Payment Provider Freezes Your Funds, Who Picks Up the Phone?",
  "description": "Some merchants who described a bad experience with a U.S. payment provider said the same thing: there was no one to talk to. A chat agent that repeats the help center. A ticket closed without resolution. A callback promised within 24 hours that never comes. One Square seller who reported about $700 being held summed it up: \"I call almost every day & get nowhere.\"",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Square merchant report: Transfer delays and support",
      "href": "https://community.squareup.com/t5/Banking-With-Square/Transfering-funds/m-p/705638"
    },
    {
      "label": "Hacker News: Account restoration and provider response",
      "href": "https://news.ycombinator.com/item?id=28085706"
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

export const merchantSupportParagraphs = [
  "The absurd part is where merchants finally find help. Not in the product, but on Hacker News, at the CFPB, in a letter to the state attorney general or on the local news. One founder reported that their account was restored after a public thread and other outreach, and shared the provider’s email acknowledging the closure was a mistake. A support process that works best when it goes viral is not a support process.",
  "Etail Depot takes a different position: a hold on your money is a decision about your business, and you need a clear way to question it. Your account documents identify the support contact and any agreed service levels.",
  "Automation belongs in the parts of payments that should be invisible. The moment your working capital stops moving is not one of them.",
  "This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
] as const;

export const instantOnboardingArticle: BlogArticle = {
  "searchTitle": "Instant onboarding and frozen merchant funds",
  "summary": "How instant payment approval compares with upfront merchant underwriting and clear processing limits.",
  "relatedPaths": [
    "/company/blog/how-etail-depot-handles-risk",
    "/company/blog/when-your-money-stops-moving"
  ],
  "path": "/company/blog/why-instant-onboarding-is-a-trap",
  "title": "Approved in Minutes, Frozen After Your First Sale: Why Instant Onboarding Is a Trap",
  "description": "The pitch is seductive: sign up, get approved, start taking payments in five minutes. Then the first real transaction lands: one Australian Stripe merchant reported a $2,150 payment and a risk email announcing a 120-day hold. A Square merchant approved in late December reported being deactivated the day after taking their first payments, with funds held and no specific explanation. A Shopify merchant reported being told they were good to go, but still could not receive payouts.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "sections": [],
  "sources": [
    {
      "label": "Stripe merchant report: First payment hold (Harpreet S.)",
      "href": "https://www.productreview.com.au/listings/stripe#review-1b49ca44-a5cb-5d75-865f-5695f3122f94"
    },
    {
      "label": "Square merchant report: Cheryl, 7 January 2026",
      "href": "https://www.consumeraffairs.com/business/square.html?page=2#review-13885625"
    },
    {
      "label": "Shopify merchant report: Verification and payouts",
      "href": "https://www.reddit.com/r/shopify/comments/1nx9194/how_is_this_possible/"
    },
    {
      "label": "Shopify: Account holds and ongoing reviews",
      "href": "https://help.shopify.com/en/manual/payments/shopify-payments/payouts/account-holds"
    },
    {
      "label": "Stripe: Upfront and incremental verification",
      "href": "https://docs.stripe.com/connect/identity-verification#onboarding-flows"
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

export const instantOnboardingParagraphs = [
  "Fast approval does not mean the review process is finished. Aggregators can carry out initial checks and continue reviewing an account after the money arrives. The merchant can face a hold later, at the worst possible moment, with revenue they have already earned and often already spent on inventory.",
  "Etail Depot reviews your business before you process. We do the know-your-business work up front, and when you are approved you see what you were approved for: the activities, payment methods and limits set out in your account terms. Nothing about your first month of sales should be a surprise to us, and nothing about our limits should be a surprise to you.",
  "That trade costs a little speed at signup. It prioritizes the thing instant approval alone cannot promise: a payments relationship that still exists after your first good week.",
  "This is why Etail Depot’s moat is processor continuity though direct communication and proper context with its merchants. Your success is Etail’s success."
] as const;

export const riversidePaymentsArticle: BlogArticle = {
  "searchTitle": "Riverside Payments case: the cost of fine print",
  "summary": "What the Riverside Payments case reveals about processing fees, contract terms, equipment leases and cancellation.",
  "relatedPaths": [
    "/company/blog/how-etail-depot-handles-risk",
    "/company/blog/when-your-payment-provider-freezes-your-funds"
  ],
  "path": "/company/blog/riverside-payments-case-fine-print",
  "title": "The Fine Print Is the Product: What the Riverside Payments Case Says About Your Processor",
  "description": "On November 2, 2026, the Federal Trade Commission and the State of Washington filed a complaint against payment processor Riverside Payments, its equipment-leasing affiliate Cascade Equipment Leasing and their two owners. The allegations read like a checklist of everything small merchants fear about their processor.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-12",
  "sections": [
    {
      "id": "the-playbook",
      "title": "The playbook"
    },
    {
      "id": "etail-depot-approach",
      "title": "Etail Depot’s approach"
    },
    {
      "id": "the-two-models",
      "title": "The two models"
    },
    {
      "id": "before-you-sign",
      "title": "Before you sign"
    },
    {
      "id": "article-sources",
      "title": "Sources"
    }
  ]
};

/** Supplied article with approved source corrections; original citation labels retained. */
export const riversidePaymentsBody = {
  "intro": [
    "According to the complaint, Riverside's sales agents showed prospects a quote sheet promising savings of 40% to 60% over their current processor. Merchants who switched typically paid more. The quote sheet omitted activation fees, batch fees, inactive-processing fees and \"non-compliance\" fees. Buried in a 26-page electronic agreement: a three-year term that renewed automatically, a $695 early termination fee, and an equipment lease through Cascade that ran a year longer than the processing contract and renewed on its own. A \"no-risk\" guarantee promised merchants could cancel anytime, switch back and collect $500. Merchants who tried to cancel got silence, deflection, or instructions to wait for a callback that did not come.",
    "The defendants agreed to a proposed $32 million judgment, with the remainder to be suspended after a $600,000 payment because they cannot pay the rest. Washington's attorney general says more than 300 small businesses in the state would be eligible for compensation."
  ],
  "sections": [
    {
      "id": "the-playbook",
      "title": "This is not one bad actor. It is the playbook.",
      "paragraphs": [
        "Riverside is the company that got caught this month. The pattern is decades old. The FTC went after an Oregon operation in 2007 for having merchants sign third-party equipment leases while concealing pages of fine print, and against the ISO Merchant Services Direct for duping small businesses into two-to-four-year terminal leases.",
        "The script works because the economics reward it. An acquirer or payment service provider that competes on the headline rate has every incentive to hide the real cost somewhere else: in fees that appear after signing, in a term the merchant did not know they agreed to, in a cancellation process that is technically available and practically impossible. The merchant's lock-in is the product. The processing is almost incidental.",
        "What makes it corrosive is not any single fee. It is that the relationship is adversarial from the first sales call. The processor wins when the merchant does not read the fine print. The merchant finds out when they try to leave."
      ]
    },
    {
      "id": "etail-depot-approach",
      "title": "Etail Depot: we grow when you do",
      "paragraphs": [
        "Etail Depot was built on the opposite premise. A payments relationship should be a partnership in which both sides make more money when the merchant sells more, and neither side profits from the other's confusion.",
        "That starts with the price. Your charges are disclosed before they apply, including what happens to a fee on a refund and any charges that apply when you process nothing. Only charges disclosed and accepted for your account may be collected.",
        "It continues with the exit. You can leave. You can request account closure at any time through the support channel for your account. A merchant who stays with Etail Depot stays because the service is worth it, which is the only kind of retention worth having and the only kind that forces us to keep earning it.",
        "And it shows up in how we work day to day. Our merchants have a support contact identified for their account. When volume grows, we review any account changes needed to support it. When something breaks, we help investigate service issues within our control. The job is to make running payments the least stressful part of running your business, and that is only possible when your success and ours are the same number."
      ]
    }
  ],
  "comparisonTitle": "The two models, side by side",
  "comparison": [
    [
      "What you are told",
      "The trap playbook (as alleged against Riverside)",
      "The Etail Depot approach"
    ],
    [
      "Your costs",
      "A savings quote that omits activation, batch, inactivity and non-compliance fees",
      "Charges disclosed and accepted before they apply"
    ],
    [
      "Your contract",
      "Three-year term, buried in 26 pages, renews automatically",
      "Account terms supplied before acceptance"
    ],
    [
      "Leaving",
      "\"No-risk\" guarantee in the pitch, $695 fee and an unreachable cancellation line in practice",
      "Request closure at any time; provider steps may apply"
    ],
    [
      "When you need help",
      "Deflection, callbacks that never come",
      "A support contact identified for your account"
    ],
    [
      "When you grow",
      "Not their problem",
      "Growth reviewed against your approved account limits"
    ]
  ],
  "closingTitle": "Read the fine print before you sign. Or work with someone who has nothing to hide.",
  "closing": [
    "The proposed FTC order would require Riverside to disclose all material terms, get express consent for auto-renewal and offer a simple way to cancel. At Etail Depot, disclosed and accepted account terms govern charges and closure.",
    "If your current processor's savings sheet does not match your statement, if you have never seen your full contract, or if you have tried to cancel and been told to wait for a callback, you are in the pattern this case describes. Talk to us. The first conversation is about your business, not our contract."
  ],
  "sourcesTitle": "Sources",
  "sources": [
    [
      {
        "text": "FTC press release, "
      },
      {
        "text": "FTC, Washington Take Action Against Payment Processor for Deceiving Small Businesses About Costs and Cancellation Terms",
        "href": "https://www.ftc.gov/node/338677"
      },
      {
        "text": ", November 2, 2026"
      }
    ],
    [
      {
        "text": "FTC case page, "
      },
      {
        "text": "Riverside Payments, Inc., et al.",
        "href": "https://www.ftc.gov/node/338680"
      },
      {
        "text": ", Matter No. 2523018"
      }
    ],
    [
      {
        "text": "Washington Attorney General, "
      },
      {
        "text": "Riverside settlement and merchant eligibility",
        "href": "https://www.atg.wa.gov/news/news-releases/wa-ftc-reach-600k-settlement-payment-processing-company-deceptive-practices"
      },
      {
        "text": ", November 2, 2026"
      }
    ],
    [
      {
        "text": "OPB",
        "href": "https://www.opb.org/article/2026/11/06/vancouver-credit-card-processor-misleads-customers/"
      },
      {
        "text": ", November 6, 2026"
      }
    ],
    [
      {
        "text": "Payments Dive",
        "href": "https://www.paymentsdive.com/news/payment-processor-settle-ftc-alleged-deceptive-fees/873669/"
      },
      {
        "text": ", November 2026"
      }
    ],
    [
      {
        "text": "FTC, "
      },
      {
        "text": "FTC Takes Aim at Oregon Operation that Targeted Small Businesses",
        "href": "https://www.ftc.gov/news-events/news/press-releases/2007/04/ftc-takes-aim-oregon-operation-targeted-small-businesses"
      },
      {
        "text": ", 2007; "
      },
      {
        "text": "Merchant Services Direct",
        "href": "https://www.ftc.gov/node/46105"
      }
    ]
  ]
};

export const declinedProcessingArticle: BlogArticle = {
  "searchTitle": "Declined for payment processing? What comes next",
  "summary": "Why a payment processing decline may not tell the whole story, and how a fuller business review can reveal options.",
  "relatedPaths": [
    "/company/blog/why-instant-onboarding-is-a-trap",
    "/company/blog/how-etail-depot-handles-risk"
  ],
  "path": "/company/blog/declined-for-payment-processing",
  "title": "Declined for Payment Processing? Was Your Business Fully Evaluated?",
  "description": "If a payment provider has turned you down, the email probably said very little. \"Unable to support your business at this time.\" No reason, no appeal, no person to call. It is natural to read that as a verdict on your company.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-12",
  "sections": [
    {
      "id": "business-evaluation",
      "title": "Business evaluation"
    },
    {
      "id": "structured-approval",
      "title": "Structured approval"
    },
    {
      "id": "bring-us-the-decline",
      "title": "Bring us the decline"
    }
  ],
  "sources": [
    {
      "label": "Visa: Merchant underwriting and automated onboarding",
      "href": "https://rs.visa.com/dam/VCOM/download/merchants/visa-global-acquirer-risk-standards.pdf#page=20"
    },
    {
      "label": "Stripe: Credit underwriting process",
      "href": "https://support.stripe.com/questions/stripe-credit-underwriting-process"
    },
    {
      "label": "Square: Account activation and verification",
      "href": "https://squareup.com/help/us/en/article/5057-sign-up-troubleshooting"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Stripe: Credit account review process",
      "href": "https://support.stripe.com/questions/credit-account-review-process-frequently-asked-questions"
    }
  ]
};

/** Supplied article wording with approved source corrections. */
export const declinedProcessingBody = {
  "intro": "It isn't necessarily. Some applications are declined through automated underwriting rules. Your industry may be on a restricted list. Your business may have limited processing history. Your average ticket may be high, your delivery window long, you may sell across borders, or your owner's address may not match a database. Those facts can affect a provider's decision, but they do not tell the whole story of your business. A decline alone does not tell you whether those details received a full business review.",
  "sections": [
    {
      "id": "business-evaluation",
      "title": "We evaluate the business, not the application",
      "paragraphs": [
        "Etail Depot does standard underwriting, because we have to: identity, ownership, sanctions screening, financials. But we treat that as the beginning of the review, not the end of it. When a business is declined elsewhere, we review it separately against our account requirements.",
        "That means looking at the things a score cannot see. How you actually fulfil orders and what proof you keep. Your real refund and dispute history, with context, not just a ratio. How far ahead you take payment and what protects the customer in between. Where your customers are, how you reach them, and what your growth plan looks like for the next twelve months. We will ask for documents, and we will read them. We will ask questions, and the answers inform the review.",
        "The goal is not to find a reason to say yes to everyone. Some businesses carry risk we cannot absorb, and any binding restriction still applies. The goal is to make sure a decision about your livelihood is made by someone who understood your business first."
      ]
    },
    {
      "id": "structured-approval",
      "title": "A structured yes instead of a flat no",
      "paragraphs": [
        "A full evaluation can open up options a simple automated decline does not explain. A business with long delivery windows might be supported with a modest, time-limited reserve that steps down as fulfilment history builds. A fast-growing merchant might start with a stated volume ceiling that rises on a schedule we agree together. A merchant in a cautious vertical might qualify with stronger delivery evidence attached to each order. Any approved arrangement is set out in the account terms, including applicable limits and reserve review conditions.",
        "That is the difference between underwriting and support. Underwriting asks whether you fit a box. Support asks what it would take to make your account work, and then builds it."
      ]
    },
    {
      "id": "bring-us-the-decline",
      "title": "Bring us the decline",
      "paragraphs": [
        "If you have been turned down for payment processing, bring us the application and the business behind it. We will tell you what we think the other provider saw, what we see, and whether and how we can support your account. We review each business separately. A decline elsewhere does not determine our decision, and account approval is still required.",
        "A decline from a scoring model is information about the model. It is not the last word on your business."
      ]
    }
  ]
};

export const providerApprovalArticle: BlogArticle = {
  "searchTitle": "What payment provider approval really means",
  "summary": "What payment approval means for risk, responsibilities and the relationship between a merchant and its payment provider.",
  "relatedPaths": [
    "/company/blog/declined-for-payment-processing",
    "/company/blog/how-etail-depot-handles-risk"
  ],
  "path": "/company/blog/what-your-payment-provider-is-really-saying-yes-to",
  "title": "What Your Payment Provider Is Really Saying Yes To",
  "description": "When a payment facilitator approves your business, it feels like a formality. You filled in a form, uploaded a document, and a few minutes or days later you can take cards. Easy.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-12",
  "sections": [
    {
      "id": "financial-exposure",
      "title": "Financial exposure"
    },
    {
      "id": "provider-responsibilities",
      "title": "Provider responsibilities"
    },
    {
      "id": "merchant-responsibilities",
      "title": "Merchant responsibilities"
    },
    {
      "id": "etail-depot-approach",
      "title": "Etail Depot’s approach"
    }
  ],
  "sources": [
    {
      "label": "Visa: Public rules, payment facilitators and reserve responsibilities",
      "href": "https://cis.visa.com/dam/VCOM/download/about-visa/visa-rules-public.pdf"
    },
    {
      "label": "PCI SSC: Responsibilities when payment processing is outsourced",
      "href": "https://www.pcisecuritystandards.org/faqs/1092/"
    },
    {
      "label": "FinCEN: Payment processor exemption, FIN-2014-R009",
      "href": "https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/application-money-services-business/"
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

/** Supplied article wording remains verbatim. */
export const providerApprovalBody = {
  "intro": [
    "From the other side of the table, something very different just happened. A company you have never met agreed to help you accept payments and took on the responsibilities assigned to it under its acquiring arrangement. Your own obligations as a merchant remain. It does this for the fees and under the terms agreed for your account.",
    "That is not a formality. It is one of the most generous extensions of trust in commerce, and understanding it changes how you think about the relationship."
  ],
  "sections": [
    {
      "id": "financial-exposure",
      "title": "The money it puts at risk for you",
      "paragraphs": [
        "A card payment is not final when it lands in your account. The cardholder can dispute it for months. If your customer says the goods never arrived and the issuer agrees, the money goes back to the cardholder whether or not you still have it. If you cannot cover it, responsibility for the shortfall follows the applicable account and acquiring agreements.",
        "Now scale that up. A merchant takes $200,000 in pre-orders for a product that ships in ninety days. The facilitator has paid most of that out. If the product never ships, or the merchant closes, or a fraud ring used stolen cards for half the orders, those payments can become chargebacks, and losses are allocated under the applicable agreements. Across a portfolio of thousands of merchants, it carries this exposure every single day, for sales it did not make, to customers it has never spoken to, on products it has never seen.",
        "Reserves and holds exist because of this. They are among the tools used to manage exposure from a merchant's failure. Where providers go wrong is in how they communicate them, not in having them."
      ]
    },
    {
      "id": "provider-responsibilities",
      "title": "The obligations it carries alongside yours",
      "paragraphs": [
        "If you wanted to accept cards directly from a bank, you would need your own merchant account, your own underwriting review, your own PCI validation, any required network registration and the compliance arrangements that apply to your business. Requirements, timing and costs vary by provider and business.",
        "The facilitator handles the responsibilities assigned to it. The merchant’s own obligations remain. It verifies who you are and who owns your company, and keeps verifying as long as you process. It screens you and your beneficial owners against sanctions lists. It registers with Visa and Mastercard, follows their rulebooks, and answers to them when a merchant in its portfolio misbehaves. PCI DSS requirements and validation depend on the payment environment and the account. It analyzes whether the way your money flows makes it a money transmitter under state and federal law, and licenses or structures accordingly. Its monitoring and reporting duties depend on its role and applicable law.",
        "Every one of those is a cost and a liability. If a merchant turns out to be laundering money or selling something prohibited, each party remains responsible for the obligations that apply to it. When it says yes to you, it is betting its own standing with the banks on your business being what you said it is."
      ]
    },
    {
      "id": "merchant-responsibilities",
      "title": "Why the yes is special, and how to be worth it",
      "paragraphs": [
        "Seen this way, approval is not the start of a vendor relationship. It is the start of a partnership in which one side has already put its balance sheet and its reputation behind the other. The best merchants treat it that way.",
        "They keep their business description accurate, because the facilitator underwrote the business they described. They tell their provider before a launch, a seasonal spike or a large order, so growth looks like growth and not like fraud. They ship on time, keep tracking and delivery proof, and answer customer complaints before they become disputes. They respond when the risk team asks a question, because that question is usually a person trying to avoid a hold, not impose one.",
        "None of this is servility. It is the same courtesy you would extend to a partner whose responsibilities depend on your business being what you described."
      ]
    },
    {
      "id": "etail-depot-approach",
      "title": "How Etail Depot sees it",
      "paragraphs": [
        "We take on the responsibilities assigned to us, and we think the merchants we accept should know exactly what those are. In return, we owe you the same clarity: reasons where disclosure is permitted, the funding terms for your account, and a support contact when you have a question.",
        "Trust extended in one direction becomes resentment. Extended in both, it becomes the kind of payments relationship that survives a bad quarter, a fraud attack or a record-breaking Black Friday. That is the relationship we are building, one approval at a time."
      ]
    }
  ]
};

export const payfacOperationsArticle: BlogArticle = {
  "searchTitle": "Reselling payments vs. running a PayFac",
  "summary": "The risk, compliance and daily operations behind payment facilitation, and how that role differs from reselling payment services.",
  "relatedPaths": [
    "/company/blog/what-your-payment-provider-is-really-saying-yes-to",
    "/company/blog/how-etail-depot-handles-risk"
  ],
  "path": "/company/blog/reselling-payments-vs-running-a-payfac",
  "title": "Anyone Can Resell Payments. Almost No One Can Run a PayFac.",
  "description": "\"Payment processing\" sounds like a commodity. Plug in an API, take a few basis points, move on. Thousands of companies resell it that way, and from the outside a payment facilitator looks like one more of them.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-12",
  "sections": [
    {
      "id": "payfac-responsibilities",
      "title": "What a PayFac carries"
    },
    {
      "id": "operating-risks",
      "title": "Where operations fail"
    },
    {
      "id": "doing-it-properly",
      "title": "Doing it properly"
    }
  ],
  "sources": [
    {
      "label": "Visa: The payment facilitator model",
      "href": "https://usa.visa.com/dam/VCOM/global/support-legal/documents/visa-payment-facilitator-model.pdf"
    },
    {
      "label": "Visa: Public rules, payment facilitators and reserve responsibilities",
      "href": "https://cis.visa.com/dam/VCOM/download/about-visa/visa-rules-public.pdf"
    },
    {
      "label": "PCI SSC: Responsibilities when payment processing is outsourced",
      "href": "https://www.pcisecuritystandards.org/faqs/1092/"
    },
    {
      "label": "FinCEN: Payment processor exemption, FIN-2014-R009",
      "href": "https://www.fincen.gov/resources/statutes-regulations/administrative-rulings/application-money-services-business/"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    }
  ]
};

/** Supplied article wording remains verbatim. */
export const payfacOperationsBody = {
  "intro": [
    "It is not. A reseller may hand the merchant to another provider’s risk team, balance sheet and compliance program. A payment facilitator takes on responsibilities under its acquiring agreement."
  ],
  "sections": [
    {
      "id": "payfac-responsibilities",
      "title": "What a PayFac actually carries",
      "paragraphs": [
        "Every sub-merchant is a credit decision. If a merchant takes $80,000 in deposits for furniture and never ships it, responsibility for chargebacks and any shortfall follows the applicable account and acquiring agreements. Underwriting, reserves and exposure limits are not paperwork. They are the difference between a quarter and a bankruptcy.",
        "Every sub-merchant also brings compliance responsibilities. Know-your-business checks, applicable screening, card network requirements, payment-data security and any required reporting depend on the account, the provider’s role and the governing rules.",
        "Then there is the money itself. Where a facilitator receives pooled settlement, it has to split it across hundreds of merchants, net out fees, refunds, reserves and adjustments, fund each payout correctly and on time, and prove every cent of that math to the merchant, the bank, the auditor and, eventually, a regulator. Disputes arrive from issuers on their timelines, not yours, each with evidence requirements and deadlines. Multiply all of it by every day of the year."
      ]
    },
    {
      "id": "operating-risks",
      "title": "Why so many get it wrong",
      "paragraphs": [
        "The failure mode is predictable. A software company or marketplace sees the margin, licenses a PayFac-in-a-box, and treats the hard parts as a vendor's problem. Underwriting becomes a form. Risk becomes an automated score nobody on staff can explain. Reconciliation becomes a CSV someone opens at month-end. Compliance becomes a policy document written once.",
        "It works until it doesn't. The first real fraud ring, the first merchant that grows ten times in a month, the first network audit, the first chargeback wave. At that point the facilitator does what it was never built to avoid: it freezes funds across the board, goes quiet, and lets the merchants absorb the cost of its own missing capability. Most of the merchant horror stories about frozen money and unreachable support are not stories about malice. They are stories about operators who took on a liability they did not have the organization to manage."
      ]
    },
    {
      "id": "doing-it-properly",
      "title": "Doing it properly",
      "paragraphs": [
        "Running a PayFac well means building the operating layer most entrants skip: a risk function staffed by people who read the merchant's file, not just the score. Reconciliation that ties every payout to its orders every day, not at month-end. Compliance that is monitored continuously, with evidence that can be handed to a bank or a network on request. Exposure limits that are set deliberately and communicated to the merchant before they matter. And a clear, honest line between what the facilitator controls and what the networks and issuers decide.",
        "Etail Depot was built as that layer first and a payments company second. Our responsibility is to explain what we handle, what the account terms provide and who to contact when something needs attention.",
        "Payment facilitation is not a feature you add. It is an operating responsibility you take on. The merchants who depend on it deserve a provider that understood that before taking their money."
      ]
    }
  ]
};

export const merchantCancellationArticle: BlogArticle = {
  "searchTitle": "Leaving your payment provider: cancellation and fees",
  "summary": "Why payment contract exit terms matter, and Etail Depot’s approach to cancellation, transition planning and business continuity.",
  "relatedPaths": [
    "/company/blog/riverside-payments-case-fine-print",
    "/company/blog/when-your-payment-provider-freezes-your-funds"
  ],
  "path": "/company/blog/you-can-leave-that-is-the-point",
  "title": "You Can Leave. That Is the Point.",
  "description": "Ask a merchant what it took to leave their last payment provider and you will hear the same story. A three-year term they did not remember agreeing to. An early termination fee they discovered in the fine print. An equipment lease that outlived the service by a year. A cancellation line that did not exist, and a callback that never came. In the FTC's case against Riverside Payments this month, all four were alleged across the processing and leasing arrangements.",
  "category": "Merchant services",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-12",
  "sections": [
    {
      "id": "why-leaving-is-hard",
      "title": "Why leaving is hard"
    },
    {
      "id": "cancelling-with-etail-depot",
      "title": "Cancelling with Etail Depot"
    },
    {
      "id": "stay-because-it-works",
      "title": "Stay because it works"
    }
  ],
  "sources": [
    {
      "label": "FTC: Riverside Payments allegations",
      "href": "https://www.ftc.gov/news-events/news/press-releases/2026/11/ftc-washington-take-action-against-payment-processor-deceiving-small-businesses-about-costs"
    },
    {
      "label": "Etail Depot: Merchant Services Terms",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Etail Depot: Fees and billing",
      "href": "/company/legal/fees"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};

/** Supplied article wording remains verbatim. */
export const merchantCancellationBody = {
  "intro": [
    "The cost is not only the fee. It is the months of paying for a service you have already decided is wrong for you, because leaving is more expensive than staying."
  ],
  "sections": [
    {
      "id": "why-leaving-is-hard",
      "title": "Why most PSPs make leaving hard",
      "paragraphs": [
        "Lock-in is not an accident. A processor that wins customers on a headline rate has to make its money somewhere, and the easiest place is a merchant who cannot leave. Long terms, auto-renewals and termination fees turn a service relationship into a captive one. Once you are captive, the quality of the service stops mattering to the provider's revenue.",
        "That is the quiet reason support gets worse after you sign. There is no commercial penalty for it."
      ]
    },
    {
      "id": "cancelling-with-etail-depot",
      "title": "At Etail Depot, you can request closure. Directly. At any time.",
      "paragraphs": [
        "Etail Depot lets merchants request account closure at any time. You use the support channel for your account, we acknowledge the request and explain any provider steps needed to complete it. Existing obligations remain, and final payouts and reserves follow your accepted funding terms.",
        "We do this because it keeps us honest. A merchant who chooses to stay is a merchant we have to earn every month. Our revenue grows when your volume grows, so the one thing we cannot afford is a customer who stays out of obligation and resents it.",
        "It also reflects what we think a payments partner is for. We are not here to hold a contract over you. We are here to keep your business running through a busy weekend, a new product line, a new market, a bad month. Business continuity is the job. A cancellation clause that punishes you for making the right decision for your company is the opposite of continuity."
      ]
    },
    {
      "id": "stay-because-it-works",
      "title": "Stay because it works",
      "paragraphs": [
        "The best retention strategy in payments is not a termination fee. It is a service merchants would choose again tomorrow. That is the only kind we are interested in building, and the only kind worth your signature.",
        "If you are stuck in a contract you cannot get out of, talk to us anyway. We will help you understand your account’s closure requirements and plan the transition, whenever you are free to make it."
      ]
    }
  ]
};

export const blogArticles: readonly BlogArticle[] = [moneyStopsMovingArticle, merchantPayoutHoldsArticle, frozenFundsArticle, riskCommunicationArticle, merchantSupportArticle, instantOnboardingArticle, riversidePaymentsArticle, declinedProcessingArticle, providerApprovalArticle, payfacOperationsArticle, merchantCancellationArticle];

export function relatedArticles(article: BlogArticle): BlogArticle[] {
  return article.relatedPaths.flatMap(path => {
    const related = blogArticles.find(entry => entry.path === path && entry.path !== article.path);
    return related ? [related] : [];
  });
}

export function articleDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
