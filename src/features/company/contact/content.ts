import type { CommercialPage } from "@/shared/ui/page-content-types";

export const contactContent = {
    label: "Contact", title: "Contact Etail Depot",
    description: "Discuss merchant services for your business or software platform, including a change of provider. Contact Etail for account support and integration information.",
    heading: "Contact Etail Depot.",
    intro: "Merchant services, platform integrations and account support.",
    action: { label: "Explore contact options", href: "#contact-options" },
    art: { title: "Contact Etail", caption: "Apply or sign in through Trolleys. Contact our team by email for questions and account support.", steps: [
      { title: "Your business", detail: "Application · payment account" }, { title: "Your software", detail: "Partnership · integration" }, { title: "Your question", detail: "Card service · privacy · compliance" },
    ] },
    sections: [],
  } as const satisfies CommercialPage;
