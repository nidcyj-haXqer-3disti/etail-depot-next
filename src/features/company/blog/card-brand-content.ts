import type { BlogArticle } from "./content";

// Human-supplied draft. Factual review notes are private; author wording is preserved.
export const cardBrandArticle: BlogArticle = {
  "path": "/company/blog/visa-vs-mastercard-for-merchants",
  "title": "Visa or Mastercard: Does Your Customers' Card Brand Actually Matter?",
  "description": "Merchants sometimes look at their card mix, see that two-thirds of their customers pay with Visa, and wonder whether that should change anything about how they run payments. The short answer: at the checkout, almost nothing. Behind the checkout, in disputes, monitoring and international reach, more than you would expect. And the split that really moves your costs is not Visa versus Mastercard at all.",
  "searchTitle": "Visa vs Mastercard: does card brand matter to merchants?",
  "summary": "What your Visa and Mastercard mix can reveal about payment costs, disputes and customers, and why debit, credit and issuing country deserve a closer look.",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-15",
  "relatedPaths": [
    "/company/blog/interchange-fees",
    "/company/blog/average-chargeback-rate"
  ],
  "sections": [
    {
      "id": "where-it-barely-matters",
      "title": "Where it barely matters"
    },
    {
      "id": "where-it-does-matter",
      "title": "Where it does matter"
    },
    {
      "id": "what-matters-more-than-the-logo",
      "title": "What matters more than the logo"
    },
    {
      "id": "what-to-do-with-your-mix",
      "title": "What to do with your mix"
    }
  ],
  "sources": [
    {
      "label": "Visa: Interchange fees and merchant pricing",
      "href": "https://www.visa.com/en-us/support/business/regulation-fees"
    },
    {
      "label": "Mastercard: Interchange rates and qualifying criteria",
      "href": "https://www.mastercard.com/us/en/business/support/merchant-interchange-rates.html"
    },
    {
      "label": "Federal Reserve: Regulated debit interchange",
      "href": "https://www.federalreserve.gov/paymentsystems/regii-average-interchange-fee.htm"
    },
    {
      "label": "Visa: Acquirer Monitoring Program",
      "href": "https://corporate.visa.com/content/dam/VCOM/corporate/visa-perspectives/security-and-trust/documents/visa-acquirer-monitoring-program-fact-sheet-2025.pdf"
    },
    {
      "label": "Visa: Compelling Evidence 3.0",
      "href": "https://corporate.visa.com/content/dam/VCOM/regional/na/us/support-legal/documents/evolution-of-compelling-evidence-merchant-faqs-mar2023.pdf"
    },
    {
      "label": "Mastercard: Rules and compliance programs",
      "href": "https://www.mastercard.com/us/en/business/support/rules.html"
    }
  ]
};

type ArticleText = { text: string; lead: string };
type ArticleBlock =
  | ({ type: "paragraph" } & ArticleText)
  | { type: "ul" | "ol"; items: ArticleText[] };
type ArticleBody = { sections: { id: string; title: string; blocks: ArticleBlock[] }[] };

export const cardBrandBody: ArticleBody = {
  "sections": [
    {
      "id": "where-it-barely-matters",
      "title": "Where it barely matters",
      "blocks": [
        {
          "type": "paragraph",
          "text": "For a typical online business, the two networks are close substitutes. Both are accepted almost everywhere you would want to sell. Both are priced through interchange tables that, for comparable card types, land within a few basis points of each other. If your provider charges a blended rate, the brand difference disappears entirely into the average. If you are on interchange-plus, you will see it on the statement, but a merchant who shifted customers from one brand to the other would struggle to notice the change in margin.",
          "lead": ""
        },
        {
          "type": "paragraph",
          "text": "The technology is converging too. Network tokenization, 3-D Secure and account updater services exist on both, with slightly different names and slightly different rollouts. A checkout built properly for one works for the other.",
          "lead": ""
        }
      ]
    },
    {
      "id": "where-it-does-matter",
      "title": "Where it does matter",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Disputes. Visa and Mastercard run separate dispute systems with their own reason codes, evidence rules, response windows and fees. A merchant whose volume leans heavily to one network should know that network's rulebook well, because a response that would win under one set of rules can lose under the other. Visa's compelling-evidence framework for \"fraud\" disputes, for instance, rewards merchants who can show prior undisputed transactions from the same customer, which only helps if you keep that history.",
          "lead": "Disputes."
        },
        {
          "type": "paragraph",
          "text": "Monitoring programs. Each network runs its own fraud and chargeback monitoring programs, with their own thresholds and penalty schedules. Because they count ratios per network, not across your whole book, a concentrated mix changes your exposure. If 70% of your volume is Visa and a fraud spike hits, you can trip Visa's threshold while your Mastercard numbers look fine. A balanced mix dilutes a problem; a skewed mix concentrates it.",
          "lead": "Monitoring programs."
        },
        {
          "type": "paragraph",
          "text": "Regional reach. Outside the United States the two brands are not equally strong, and in some markets neither is the local default. In Japan, JCB share is material. In mainland China, UnionPay dominates. Across much of Europe, domestic debit schemes still carry a large share of everyday spend. A merchant whose international customers skew to one brand has learned something about where their customers are, and that should shape which local methods to add next.",
          "lead": "Regional reach."
        }
      ]
    },
    {
      "id": "what-matters-more-than-the-logo",
      "title": "What matters more than the logo",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Three other splits in your card data move cost and risk far more than brand:",
          "lead": ""
        },
        {
          "type": "ul",
          "items": [
            {
              "text": "Debit versus credit. In the U.S., regulated debit interchange is capped by law and is a fraction of what a credit card costs. A business with a heavy debit mix has a structurally lower cost of acceptance regardless of brand.",
              "lead": "Debit versus credit."
            },
            {
              "text": "Card type within credit. Premium rewards cards cost materially more to accept than basic consumer credit, and commercial cards more still. A luxury retailer and a discount grocer with the same Visa share pay very different rates.",
              "lead": "Card type within credit."
            },
            {
              "text": "Domestic versus cross-border. A card issued abroad carries cross-border fees and, often, currency conversion. A 10% shift from domestic to foreign cards will show up on your statement far more clearly than a 10% shift from Mastercard to Visa.",
              "lead": "Domestic versus cross-border."
            }
          ]
        },
        {
          "type": "paragraph",
          "text": "If you want to understand your cost of acceptance, these three columns tell the story. Brand is a footnote.",
          "lead": ""
        }
      ]
    },
    {
      "id": "what-to-do-with-your-mix",
      "title": "What to do with your mix",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Do not try to steer customers between Visa and Mastercard; the networks' rules limit it and the gain is negligible. Do know your mix, because it tells you which dispute rulebook to master, which monitoring thresholds to watch and where your customers are. And do look past it to the splits that actually set your price.",
          "lead": ""
        },
        {
          "type": "paragraph",
          "text": "The practical obstacle is that most providers report a single blended fee and a single chargeback ratio, which hides all of this. Trolleys reports your volume, fees, disputes and ratios by network, by card type and by issuing country, per transaction, in the ledger and the export. The question of whether your brand mix matters is easy to answer when you can actually see it.",
          "lead": ""
        }
      ]
    }
  ]
};
