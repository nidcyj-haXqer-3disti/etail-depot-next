import type { CommercialPage } from "@/shared/ui/page-content-types";

export const trustContent = {
    label: "Security and privacy", title: "Security, Privacy and Service Responsibilities",
    description: "Understand account access, payment data responsibilities and privacy at Etail Depot. Find documentation and contacts for merchant services, card services and integrations.",
    heading: "Security and privacy.",
    intro: "Understand account access, payment data responsibilities and the documents that apply to your service.",
    action: { label: "Contact compliance", href: "/contact#compliance" },
    art: { title: "Know what applies to your service", caption: "Security requirements depend on how you accept payments and what data your systems handle.", steps: [
      { title: "Account access", detail: "Authorized users · account support" }, { title: "Payment data", detail: "Checkout · integration responsibilities" }, { title: "Privacy", detail: "Personal information · service notices" },
    ] },
    sections: [
      { title: "Protect account access and payment data.", items: [
        { title: "Account access", text: "Choose Sign in to Trolleys. Keep credentials private and limit access to authorized people. Submit verification documents through your account." },
        { title: "Checkout and integration", text: "Confirm where payment details are entered, which systems receive them and who can access them. Request the specifications and permissions for your account before connecting your software." },
        { title: "Payment security requirements", text: "Merchants retain responsibilities under the Payment Card Industry Data Security Standard (PCI DSS) when using a payment provider. Confirm the assessment and documentation required for your business with your acquiring partner or the organization managing your compliance program." },
      ] },
      { title: "Account agreements and security information.", items: [
        { title: "Security documentation", text: "Request the security and compliance documents available for your service. Check the named provider, services covered and review period." },
        { title: "Privacy and account terms", text: "Our Website Privacy Policy covers browsing and contacting us. Request the account agreement and privacy notice for the merchant, integration or card service you use." },
        { title: "Questions and concerns", text: "Contact merchant support about account access or payment issues. Direct privacy, data rights and compliance questions to our compliance team. Use the requested secure channel when sharing sensitive records." },
      ] },
    ],
  } as const satisfies CommercialPage;
