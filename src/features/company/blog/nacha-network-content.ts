import type { BlogArticle } from "./content";

/** Archive G0322, adapted with current ACH governance and participant guidance. */
export const nachaNetworkArticle: BlogArticle = {
  path: "/company/blog/nacha-and-ach-network",
  title: "What does Nacha do? Rules, banks and the ACH network",
  description: "Nacha develops and administers the rules for the US ACH network. It does not process individual payments or hold their transaction records. Knowing which organization does what helps a business get the right answer when a payment is delayed, returned or questioned.",
  summary: "Understand Nacha’s role, how banks and ACH operators handle payments, and who to contact about missing transfers or payment requirements.",
  searchTitle: "What does Nacha do? Rules, banks and the ACH network",
  relatedPaths: ["/company/blog/ach-payments", "/company/blog/ach-trace-number"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "roles", title: "Separate the rules from the payment route" },
    { id: "questions", title: "Take a payment question to the right team" },
    { id: "business-responsibility", title: "Turn the requirements into a working process" },
  ],
  sources: [
    { label: "Nacha: Network governance and Operating Rules", href: "https://www.nacha.org/content/about-us" },
    { label: "Nacha: ACH participants and their responsibilities", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Federal Reserve: ACH operators and payment processing", href: "https://www.federalreserve.gov/paymentsystems/fedach_about.htm" },
    { label: "Nacha: Who can investigate individual payments", href: "https://www.nacha.org/content/consumer-faqs-ach-payments" },
    { label: "Nacha: Rule changes and effective dates", href: "https://www.nacha.org/newrules" },
  ],
};
