import type { BlogArticle } from "./content";

// Human-supplied editorial draft; scoring qualifications are recorded in private review notes.
export const riskQuestionsArticle: BlogArticle = {
  "path": "/company/blog/merchant-risk-questions-before-applying",
  "title": "Before You Apply: Ten Questions That Tell You How a Risk Team Will See Your Business",
  "description": "Risk teams do not think about your business the way you do. You see a product, customers and a plan. They see a set of attributes that predict chargebacks, fraud and regulatory trouble. The attributes are not secret. Any merchant can run the same assessment on themselves in ten minutes, and the ones who do apply to the right providers, prepare the right documents and are far less often surprised by a decline or a reserve.",
  "searchTitle": "Merchant account application: ten risk questions",
  "summary": "Ten questions to help you prepare details about your business, delivery, billing and processing history before applying for a merchant account.",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-15",
  "relatedPaths": [
    "/company/blog/merchant-category-code-approval",
    "/company/blog/declined-for-payment-processing"
  ],
  "sections": [
    {
      "id": "ten-questions",
      "title": "The ten questions"
    },
    {
      "id": "what-your-tier-should-expect",
      "title": "What your tier should expect"
    },
    {
      "id": "how-trolleys-evaluates",
      "title": "How Trolleys uses the same questions"
    }
  ],
  "sources": [
    {
      "label": "OCC: Merchant Processing handbook",
      "href": "https://occ.gov/publications-and-resources/publications/comptrollers-handbook/files/merchant-processing/pub-ch-merchant-processing.pdf"
    },
    {
      "label": "Visa: Acquirer Monitoring Program",
      "href": "https://corporate.visa.com/content/dam/VCOM/corporate/visa-perspectives/security-and-trust/documents/visa-acquirer-monitoring-program-fact-sheet-2025.pdf"
    },
    {
      "label": "Mastercard: Merchant screening and monitoring rules",
      "href": "https://www.mastercard.com/content/dam/mccom/shared/business/support/rules-pdfs/SPME-Manual.pdf"
    },
    {
      "label": "Etail Depot: Merchant eligibility and approval",
      "href": "/company/legal/merchant-services"
    },
    {
      "label": "Etail Depot: Payouts and reserves",
      "href": "/company/legal/payouts-and-reserves"
    }
  ]
};

type Paragraph = { type: "paragraph"; text: string; lead: string };
type Comparison = { type: "table"; headers: string[]; rows: string[][] };
type ArticleBody = {
  intro: Paragraph[];
  sections: { id: string; title: string; blocks: (Paragraph | Comparison)[] }[];
};

export const riskQuestionsBody: ArticleBody = {
  "intro": [
    {
      "type": "paragraph",
      "text": "Answer the ten questions below as the risk team would, not as the founder would. Count how many answers land in each column.",
      "lead": ""
    }
  ],
  "sections": [
    {
      "id": "ten-questions",
      "title": "The ten questions",
      "blocks": [
        {
          "type": "table",
          "headers": [
            "#",
            "Ask yourself",
            "Low risk",
            "Moderate risk",
            "High risk"
          ],
          "rows": [
            [
              "1",
              "How long between payment and delivery?",
              "Same day, or goods ship within days",
              "One to four weeks (made-to-order, pre-order)",
              "More than 30 days; events or travel booked months out"
            ],
            [
              "2",
              "What am I selling?",
              "Physical goods or services with no network restrictions",
              "Digital goods, software, consulting, memberships",
              "Nutraceuticals, CBD, gambling, adult, firearms, crypto, debt or credit repair, MLM"
            ],
            [
              "3",
              "How do I bill?",
              "One-time purchases",
              "Recurring billing with clear terms and easy cancellation",
              "Free trials converting to paid, negative-option billing"
            ],
            [
              "4",
              "What is my average ticket?",
              "Under about $100",
              "$100 to $1,000",
              "Over $1,000, or a few very large orders"
            ],
            [
              "5",
              "What is my dispute history?",
              "Chargebacks well under 0.5% of transactions",
              "Approaching 0.5% to 0.9%, or no history yet",
              "At or above 1%, or a previously terminated merchant account"
            ],
            [
              "6",
              "Where are my customers?",
              "Mostly domestic",
              "Meaningful share in a few stable foreign markets",
              "Majority cross-border, or markets with high fraud rates"
            ],
            [
              "7",
              "How old is the business and how clean is the paper trail?",
              "Two or more years, filed accounts, owners verifiable",
              "Under two years with real bank statements and a trading history",
              "Brand new, owners hard to verify, or a prior regulatory issue"
            ],
            [
              "8",
              "Can I prove delivery?",
              "Tracking, signatures or usage logs on every order",
              "Proof on most orders",
              "Little or no proof retained"
            ],
            [
              "9",
              "How predictable is my volume?",
              "Steady, with explainable seasonality",
              "Growing fast but with a plan you can show",
              "Spiky, launch-driven, or unknown"
            ],
            [
              "10",
              "How exposed is my model to fraud?",
              "Verified customers, modest tickets, no resale value",
              "Guest checkout, digital goods, some promo abuse",
              "Gift cards, electronics, anything easily resold, or payouts to third parties"
            ]
          ]
        },
        {
          "type": "paragraph",
          "text": "Most answers in the left column: a risk team will see you as low risk. A cluster in the middle: moderate. Three or more on the right, or any one answer in the right column on questions 2, 5 or 7: expect to be treated as high risk, even if everything else is clean.",
          "lead": ""
        }
      ]
    },
    {
      "id": "what-your-tier-should-expect",
      "title": "What your tier should expect",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Low risk. Almost any provider will take you, so choose on service, reporting and exit terms rather than on approval. You should see no reserve, standard payout timing and a limit well above your current volume. If a provider offers you less, that is about them, not you.",
          "lead": "Low risk."
        },
        {
          "type": "paragraph",
          "text": "Moderate risk. This is where most real online businesses sit, and where provider quality matters most. Expect questions, and expect to be asked for documents. A reasonable provider will approve you with a structure around it: a volume ceiling, perhaps a modest reserve that steps down as history builds, and conditions that are written down. An unreasonable one will approve you instantly and freeze you at the first spike. The questions you were asked at onboarding are the best predictor of which one you have.",
          "lead": "Moderate risk."
        },
        {
          "type": "paragraph",
          "text": "High risk. Many mainstream providers will decline you outright because of their sponsor bank's rules, not because of anything you did. Do not waste weeks applying to them. Look for providers whose sponsor permits your category, expect a rolling reserve and higher pricing, and come prepared with the evidence that moves individual answers leftward: delivery proof, a clean dispute history, verifiable owners, a documented growth plan. The category is fixed. Your execution within it is not, and good underwriters price the difference.",
          "lead": "High risk."
        }
      ]
    },
    {
      "id": "how-trolleys-evaluates",
      "title": "How Trolleys uses the same questions",
      "blocks": [
        {
          "type": "paragraph",
          "text": "These are, with little variation, the questions our own evaluation asks. The difference is that we ask them of you, in a conversation, rather than guessing the answers from your website and letting a model decide. Where an answer lands in the right-hand column, we want the context: why delivery takes six weeks, what happened with the prior account, how you plan to handle the launch. Context is what turns a category into a business, and a business is something we can actually underwrite.",
          "lead": ""
        },
        {
          "type": "paragraph",
          "text": "Run the ten questions. Then bring us your answers, including the uncomfortable ones. That conversation is the whole point.",
          "lead": ""
        }
      ]
    }
  ]
};
