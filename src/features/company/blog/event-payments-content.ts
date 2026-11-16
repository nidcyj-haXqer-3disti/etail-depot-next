import type { BlogArticle } from "./content";

/** Archive G0108, adapted with current event, payment recovery and refund guidance. */
export const eventPaymentsArticle: BlogArticle = {
  path: "/company/blog/event-payment-processing",
  title: "Event payment processing: plan from ticket sale to closeout",
  description: "Event payment processing covers collecting money for tickets and other event sales, confirming what each buyer may receive, and reconciling proceeds afterward. Organizers need a plan for the moments when an uncertain payment, a ticket lookup or a venue outage would otherwise become a queue at the entrance.",
  summary: "Plan event payments from ticket sale to closeout. Handle missing tickets, interrupted payments, venue outages, refunds and matching records.",
  searchTitle: "Event payment processing: tickets, refunds and closeout",
  relatedPaths: ["/company/blog/ecommerce-payment-processing", "/company/blog/payment-capture"],
  author: { name: "Etail Depot", type: "Organization", url: "/company/about" },
  sections: [
    { id: "ticket", title: "Define what a successful ticket sale creates" },
    { id: "uncertainty", title: "Rehearse an interrupted payment" },
    { id: "venue", title: "Plan the venue separately from online sales" },
    { id: "closeout", title: "Close the event using matched records" },
  ],
  sources: [
    { label: "Stripe: Planning payments before, during and after an event", href: "https://stripe.com/resources/more/event-payment-processing-how-to-make-payments-easier-to-manage-and-more-convenient-for-attendees" },
    { label: "Eventbrite: Finding tickets and contacting the organizer", href: "https://www.eventbrite.com/help/en-us/contact-us/" },
    { label: "Stripe: Payment status and recovery after an interrupted checkout", href: "https://docs.stripe.com/payments/payment-intents" },
    { label: "Stripe Terminal: Offline collection and decline risk", href: "https://docs.stripe.com/terminal/features/operate-offline/collect-card-payments" },
    { label: "Eventbrite: Full and partial refunds and ticket validity", href: "https://support.eventbrite.com/hc/en-us/articles/34864864158994-Issue-a-full-or-partial-refund" },
  ],
};
