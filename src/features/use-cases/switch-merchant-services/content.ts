import type { CommercialPage } from "@/shared/ui/page-content-types";

export const switchMerchantServicesContent = {
    label: "Switch merchant services", title: "Switch Merchant Services Providers",
    description: "Stripe application declined or account closed? Discuss merchant services and credit card processing with Etail. New accounts require review and approval.",
    heading: "Declined by Stripe? Let’s look at your business.",
    intro: "Merchant services for businesses declined, restricted or no longer supported by their provider.",
    action: { label: "Discuss your business", href: "/company/contact#payment-review" },
    note: "New accounts require review and approval. Etail Depot is independent of Stripe.",
    art: { layout: "transition", title: "Your next payment setup starts with a review.", caption: "Changing providers does not transfer an existing account, release held funds or close outstanding refunds and disputes.", steps: [
      { title: "Current provider", detail: "Existing payments and open obligations" },
      { title: "Business review", detail: "Your activity, account needs and integration" },
      { title: "Etail payment setup", detail: "New payments after approval and setup" },
    ] },
    sections: [
      { title: "Before you switch.", items: [
        { title: "Your business", text: "Share your website, delivery terms, monthly volume, processing history and any provider notice." },
        { title: "Account terms", text: "Confirm account eligibility, card and ACH options, fees, payout timing, reserves and holds." },
        { title: "Your setup", text: "Confirm checkout, reporting, access and launch timing. Submit application documents securely." },
      ] },
      { id: "service-section-3", title: "New payments. Existing obligations.", items: [
        { title: "Saved payment methods", text: "Ask both providers about secure transfers. Tokens, wallet credentials and consent records do not move automatically." },
        { title: "Existing payments", text: "Previous provider terms still apply to refunds, disputes, reserves and unsettled payments. A new account does not release funds held by another provider." },
        { title: "Start with your new account", text: "After approval, verify checkout, payment updates, refunds and recurring payments. Keep both providers’ records for reconciliation." },
      ] },
    ],
  } as const satisfies CommercialPage;
