import type { BlogArticle } from "./content";

/** Archive G0309, adapted with current account-updater and saved-payment guidance. */
export const accountUpdaterArticle: BlogArticle = {
  path: "/company/blog/credit-card-account-updater",
  title: "How card account updater services work",
  description: "A card account updater helps keep saved payment details current when an eligible card number or expiry date changes. Participating issuers supply updates through payment networks and providers. An update can reduce avoidable billing interruptions, but it does not guarantee approval or give a business new permission to charge.",
  summary: "Learn how card account updaters handle changed details, closed accounts and customer action. Check coverage, billing permissions and actual payment outcomes.",
  searchTitle: "How card account updater services work",
  relatedPaths: ["/company/blog/card-on-file", "/company/blog/credit-card-declines"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "understand-the-response", title: "An updater can return more than replacement details" },
    { id: "keep-the-agreement-separate", title: "Use an update only within the existing permission" },
    { id: "review-the-operating-setup", title: "Make update outcomes visible to the right team" },
    { id: "measure-useful-outcomes", title: "Count resolved problems, not just updates" },
  ],
  sources: [
    { label: "Visa: Account Updater questions and response types", href: "https://developer.visa.com/docs/vau/vau-faq" },
    { label: "Cybersource: Account Updater developer guide", href: "https://developer.cybersource.com/content/dam/docs/cybs/en-us/account-updater/developer/all/rest/account-updater.pdf" },
    { label: "Cybersource: Account Updater coverage and participation", href: "https://www.cybersource.com/en-us/solutions/additional-services.html" },
    { label: "Stripe: Consent and terms for saved payment methods", href: "https://docs.stripe.com/payments/save-and-reuse" },
    { label: "Etail Depot: Merchant Services Terms", href: "/company/legal/merchant-services" },
  ],
};
