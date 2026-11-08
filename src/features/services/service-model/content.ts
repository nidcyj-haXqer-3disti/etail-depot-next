import type { CommercialPage } from "@/shared/ui/page-content-types";

export const serviceModelContent = {
    label: "Payment facilitator model", title: "What Is a Payment Facilitator? Etail’s Service Model",
    description: "Understand Etail’s payment facilitator role and how merchants, acquiring partners, card networks and issuers participate in a card payment.",
    heading: "The payment facilitator behind your merchant service.",
    intro: "Etail Depot provides merchant onboarding, payment acceptance and account support through its acquiring relationships.",
    action: { label: "Explore merchant services", href: "/payment-acceptance-service" },
    art: { title: "The merchant service relationship", caption: "Card messages and settlement follow the applicable network, acquiring and account arrangements.", steps: [
      { title: "Merchant", detail: "Sells goods or services to customers" }, { title: "Etail Depot", detail: "Payment facilitator · merchant service" }, { title: "Acquiring partner", detail: "Acquiring relationship · network rules" },
    ] },
    sections: [
      { title: "Who handles a card payment?", items: [
        { title: "Merchant and payment facilitator", text: "The merchant sells the product or service and handles customer communication and fulfillment. Etail provides account review, payment acceptance and account support under the applicable agreements." },
        { title: "Acquiring partner and network", text: "The acquiring arrangement connects merchant card acceptance to the card network. The network sets applicable participation and transaction rules. Responsibilities follow those rules and the parties’ agreements." },
        { title: "Issuer and cardholder", text: "The issuer provides the customer’s card account and participates in authorization and disputes. Etail’s merchant service role does not make Etail the card issuer or a bank." },
      ] },
      { title: "What that means for your business.", items: [
        { title: "Joining the service", text: "Your business is reviewed before payment acceptance is enabled. The merchant agreement defines the permitted activity, fees and other account conditions." },
        { title: "Accepting and managing payments", text: "Use the methods configured for your account, track payments, issue eligible refunds and respond to disputes." },
        { title: "Understanding deposits", text: "Use payment and payout records to explain fees and adjustments, then reconcile the deposit to your bank statement. Capture, settlement and bank receipt remain separate events." },
      ] },
    ],
  } as const satisfies CommercialPage;
