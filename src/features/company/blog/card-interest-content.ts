import type { BlogArticle } from "./content";

/** Retired archive G1819, adapted around timely payments and the continuing cost of borrowing. */
export const cardInterestArticle: BlogArticle = {
  path: "/company/blog/credit-card-interest",
  title: "Credit card interest: paying on time can still cost you",
  description: "You can meet every payment deadline and still pay interest. The difference lies in how much you repay, whether purchases qualify for a grace period and what happens between statements.",
  summary: "Understand how credit card interest works, why minimum payments differ from paying in full, and how grace periods and daily balances affect borrowing costs.",
  searchTitle: "Credit card interest: why paying on time may not be enough",
  relatedPaths: ["/company/blog/b2b-payment-methods", "/company/blog/gross-vs-net-profit"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "grace-period", title: "The minimum payment and the interest bill" },
    { id: "daily-cost", title: "The cost can keep running between statements" },
  ],
  sources: [
    { label: "FTC: Minimum payments and borrowing costs", href: "https://consumer.ftc.gov/articles/using-credit-cards-and-disputing-charges" },
    { label: "CFPB: Purchase grace periods", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/" },
    { label: "CFPB: Daily interest rates and compounding", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-daily-periodic-rate-on-a-credit-card-en-46/" },
    { label: "CFPB: Balances, rates and payment timing", href: "https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/" },
    { label: "OCC: Residual interest after paying a statement balance", href: "https://www.helpwithmybank.gov/help-topics/credit-cards/fees-terms/fees/fees-closed-account.html" },
    { label: "CFPB: Regulation Z and business purpose credit", href: "https://www.consumerfinance.gov/rules-policy/regulations/1026/3/" },
  ],
};
