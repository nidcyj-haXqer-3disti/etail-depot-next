import type { CommercialPage } from "@/shared/ui/page-content-types";

export const contactContent = {
    label: "Contact", title: "Contact Etail Depot",
    description: "Contact Etail Depot about card and ACH payments, processing costs or software partnerships. Get help with an existing merchant account or store integration.",
    heading: "Contact Etail Depot.",
    intro: "Talk with sales about your business, or get help with an existing account.",
    action: { label: "Explore contact options", href: "#contact-options" },
    art: { title: "Contact Etail", caption: "Apply or sign in through Trolleys. Contact our team by email for questions and account support.", steps: [
      { title: "Your business", detail: "Application · payment account" }, { title: "Your software", detail: "Partnership · integration" }, { title: "Your question", detail: "Card service · privacy · compliance" },
    ] },
    sections: [],
  } as const satisfies CommercialPage;
