import type { CommercialPage } from "@/shared/ui/page-content-types";

export const aboutContent = {
    label: "About", title: "About Etail Depot",
    description: "Etail Depot provides merchant services for US businesses and software platforms, from account setup and card and ACH acceptance to everyday account operations.",
    heading: "About Etail Depot",
    intro: "Etail Depot provides merchant services for US businesses and the software platforms they use.",
    action: { label: "Contact our team", href: "/contact" },
    art: { title: "Connected services", caption: "", steps: [] },
    sections: [{ title: "Our company", items: [
      { title: "Purpose", text: "Accepting a payment is one part of running a business. Merchants also need an account that fits their activity, a checkout that works for their customers and clear records of what happened after a sale." },
      { title: "Services", text: "We bring those parts together through merchant onboarding, card and ACH acceptance, refunds, disputes, payouts and reconciliation. Our team supports businesses directly and works with software platforms on merchant accounts, checkout and reporting." },
      { title: "Approach", text: "Our work starts with understanding what a business sells, how it fulfills an order and what it needs from its provider. That matters when a business is opening an account, changing providers or adding merchant services to its software." },
      { title: "Ongoing support", text: "The work continues after account setup. We help businesses understand payment records, handle account questions and manage the everyday details of accepting payments. We also offer secured card services under separate account terms." },
    ] }],
  } as const satisfies CommercialPage;
