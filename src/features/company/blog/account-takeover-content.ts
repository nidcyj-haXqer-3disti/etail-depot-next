import type { BlogArticle } from "./content";

/** Retired archive G0622, adapted around misplaced trust in an existing login. */
export const accountTakeoverArticle: BlogArticle = {
  path: "/company/blog/account-takeover-fraud",
  title: "Account takeover fraud hides behind a familiar login",
  description: "An existing customer account can be used by someone else. Recognize account takeover warning signs, protect recovery and connect affected orders with payment records.",
  summary: "The name, order history and saved details look familiar. The person using them may have changed. That is why account access deserves attention before the next payment.",
  searchTitle: "Account takeover fraud: warning signs and merchant response",
  relatedPaths: ["/company/blog/how-3d-secure-works", "/company/blog/what-is-a-chargeback"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [],
  sources: [
    { label: "New York Attorney General: Credential stuffing and customer reports", href: "https://ag.ny.gov/publications/business-guide-credential-stuffing-attacks" },
    { label: "OWASP: Authentication and sensitive account changes", href: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
    { label: "OWASP: Recovering an account after suspected compromise", href: "https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" },
    { label: "FBI IC3: Account takeover prevention and incident response", href: "https://www.ic3.gov/CrimeInfo/AccountTakeover" },
  ],
};
