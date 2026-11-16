import type { BlogArticle } from "./content";

/** Human-supplied invitation dated 15 November 2026. Wish-list items are requests, not a supported-feature inventory. */
export const makeAWishArticle: BlogArticle = {
  "path": "/company/blog/make-a-wish",
  "title": "Make a Wish: Tell Us What Your Payment Provider Won't Do",
  "description": "Every merchant has a list. The payout schedule you asked for and never got. The report that would save your bookkeeper a day a month. The payment method your customers keep requesting. The limit increase that would let you say yes to a big order. The question you have asked your provider three times and still have not had answered.",
  "searchTitle": "Make a wish: tell us what your payment provider won’t do",
  "summary": "Tell Trolleys, an Etail Depot service, what would make payments work better for your business. Share your wish and the problem behind it.",
  "author": {
    "name": "Etail Depot",
    "type": "Organization",
    "url": "/company/about"
  },
  "publishedAt": "2026-11-15",
  "relatedPaths": [
    "/company/blog/how-etail-depot-handles-risk",
    "/company/blog/what-your-payment-provider-is-really-saying-yes-to"
  ],
  "sections": [
    {
      "id": "what-counts-as-a-wish",
      "title": "What counts as a wish"
    },
    {
      "id": "how-it-works",
      "title": "How it works"
    },
    {
      "id": "why-we-are-asking",
      "title": "Why we are asking"
    }
  ],
  "sources": [
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

type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "ul" | "ol"; items: string[] };

type ArticleBody = {
  intro: string[];
  sections: { id: string; title: string; blocks: ArticleBlock[] }[];
};

export const makeAWishBody: ArticleBody = {
  "intro": [
    "We want that list. Send us the one thing your current payment provider will not do for you, and we will tell you, in person, whether we can."
  ],
  "sections": [
    {
      "id": "what-counts-as-a-wish",
      "title": "What counts as a wish",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Anything that would make your business run better and that payments stand in the way of. Some examples of what merchants have told us they cannot get:"
        },
        {
          "type": "ul",
          "items": [
            "Payouts that reconcile to orders, with fees and refunds shown per transaction instead of netted into one number",
            "A volume ceiling that rises on a schedule you agree in advance, so a product launch does not look like fraud",
            "A reserve that steps down automatically as your fulfilment history builds",
            "A single place to keep delivery proof so a dispute response is assembled, not scrambled",
            "Settlement in a second currency or a second country without a second provider",
            "A named person who knows your business and answers within a stated time",
            "Payment links, recurring billing or a split payout for a partner that your platform does not support"
          ]
        },
        {
          "type": "paragraph",
          "text": "If your wish is not on this list, that is the point. We are more interested in the ones we have not heard."
        }
      ]
    },
    {
      "id": "how-it-works",
      "title": "How it works",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Send your proposal to trolleys@etaildepot.com. It does not need to be formal. A few paragraphs is enough, and a one-line wish is fine if that is all it takes to describe it. The more useful ones tell us three things:"
        },
        {
          "type": "ol",
          "items": [
            "What you want to be able to do, in your own words",
            "What your current provider said, or did not say, when you asked",
            "Roughly what it costs you today in money, time or lost sales"
          ]
        },
        {
          "type": "paragraph",
          "text": "We evaluate every request we receive. Our team reads it, maps it against what we operate today and what we can build or configure, and decides whether it is achievable, achievable with conditions, or not something we can do. Then we schedule a one-on-one meeting with you to walk through that answer. If the answer is yes, we talk about how and when. If it is no, you will hear why, and what the nearest thing we can do looks like."
        },
        {
          "type": "paragraph",
          "text": "There is no obligation on either side. You do not need to be a Trolleys merchant, and sending a wish does not sign you up for anything but the conversation."
        }
      ]
    },
    {
      "id": "why-we-are-asking",
      "title": "Why we are asking",
      "blocks": [
        {
          "type": "paragraph",
          "text": "We built Etail Depot to be the operating layer merchants actually need above the payment rails, and the fastest way to find out what that means is to ask the people running the businesses. Your wish list is our roadmap. The one thing your provider will not do is very often the thing that would make you a customer for life."
        },
        {
          "type": "paragraph",
          "text": "Send it to trolleys@etaildepot.com. We will read it, and we will call."
        }
      ]
    }
  ]
};
