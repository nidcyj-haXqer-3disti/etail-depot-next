import type { BlogArticle } from "./content";

/** Archive G0279, adapted with current ACH and instant-payment guidance. */
export const instantAchArticle: BlogArticle = {
  path: "/company/blog/real-time-payments-vs-ach",
  title: "Real-time payments vs. ACH: choosing the right workflow",
  description: "US instant payment services and ACH solve different business needs. FedNow and RTP operate around the clock through participating financial institutions. ACH supports scheduled transfers and authorized debit collections. The right choice depends on who starts the payment, when the money is needed and what the bank account supports.",
  summary: "Compare ACH and instant payments for scheduled collections, urgent transfers, bank access and recovery when a payment goes wrong.",
  searchTitle: "Real-time payments vs. ACH for businesses",
  relatedPaths: ["/company/blog/fednow-vs-rtp", "/company/blog/how-recurring-ach-payments-work"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "direction-and-time", title: "Compare direction as well as speed" },
    { id: "operations", title: "Plan around the payment your business needs" },
    { id: "exceptions", title: "Compare recovery and operating cost" },
  ],
  sources: [
    { label: "Nacha: ACH credits, debits and authorization", href: "https://achdevguide.nacha.org/how-ach-works" },
    { label: "Nacha: ACH processing and settlement days", href: "https://www.nacha.org/content/abcs-ach" },
    { label: "Federal Reserve: FedNow access and service features", href: "https://www.federalreserve.gov/paymentsystems/fednow-additional-questions-and-answers.htm" },
    { label: "The Clearing House: RTP payment direction and finality", href: "https://www.theclearinghouse.org/payment-systems/rtp/institution" },
    { label: "Nacha: Permitted ACH reversals and their limits", href: "https://www.nacha.org/news/second-chance-understanding-ach-reversals" },
    { label: "Etail Depot: ACH availability, processing and returns", href: "/services/ach-payments" },
  ],
};
