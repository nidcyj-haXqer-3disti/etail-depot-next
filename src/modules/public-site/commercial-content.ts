import { hostedServices } from "@/shared/hosted-services";
import { SERVICE_DETAIL_PAGES } from "./service-detail-content";
/** Public decision pages. Account specifications remain in the assigned integration documentation. */
export interface CommercialPage {
  label: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  action: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  note?: string;
  art: { layout?: "ach" | "transition" | "platform"; title: string; caption: string; steps: readonly { title: string; detail: string }[] };
  sections: readonly { id?: string; title: string; intro?: string; layout?: "steps" | "methods"; records?: readonly { label: string; detail: string }[]; items: readonly { id?: string; title: string; text: string; href?: string }[] }[];
}

export const COMMERCIAL_PAGES = {
  "/merchant-onboarding": SERVICE_DETAIL_PAGES["/merchant-onboarding"],
  "/payment-methods": SERVICE_DETAIL_PAGES["/payment-methods"],
  "/payouts-and-reconciliation": SERVICE_DETAIL_PAGES["/payouts-and-reconciliation"],
  "/refunds-and-disputes": SERVICE_DETAIL_PAGES["/refunds-and-disputes"],
  "/pricing": {
    label: "Pricing", title: "Credit Card Processing Fees and Pricing",
    description: "Review Etail’s credit card processing fees, estimate the cost of domestic online payments and check additional charges, ACH pricing and platform terms.",
    heading: "Clear pricing for card processing.",
    intro: "Review card processing rates, estimate fees and check additional charges. ACH and platform terms are confirmed separately.",
    action: { label: "Start now", href: hostedServices.payments.registrationUrl },
    secondaryAction: { label: "Discuss your processing costs", href: "/contact#payment-review" },
    art: { title: "A complete view of payment costs", caption: "The card processing estimate is not a guaranteed bank deposit.", steps: [
      { title: "Card processing", detail: "Percentage plus a fixed fee" }, { title: "Other charges", detail: "Payment type · account activity" }, { title: "Account terms", detail: "ACH · platform · payout schedule" },
    ] },
    sections: [{ title: "ACH and platform pricing.", intro: "ACH payments and software partnerships have separate pricing and account terms.", items: [
      { title: "ACH payments", text: "Confirm your ACH pricing, payout terms, authorization requirements, return handling and other charges. Available options depend on your account." },
      { title: "Software partnerships", href: "/contact#platforms", text: "Platform pricing reflects your integration, implementation costs and support responsibilities. Access and commercial terms are confirmed before launch." },
      { title: "Payouts and account conditions", text: "Read the payout schedule and any reserve or hold conditions in your merchant agreement. A fee estimate cannot predict when a deposit will arrive or every adjustment applied to it." },
    ] }],
  },
  "/payment-partnerships": {
    label: "Payment partnerships", title: "Payment Partnerships for Software Platforms",
    description: "Merchant services partnerships for software platforms, with account setup, credit card processing, checkout integration and payment reporting.",
    heading: "Merchant services for your platform.",
    intro: "Connect merchant accounts, checkout and reporting to your software, including options for businesses your current provider cannot support.",
    action: { label: "Discuss your partnership", href: "/contact#platforms" },
    art: { title: "Your platform. Our merchant services.", caption: "Merchant accounts, integration access and commercial terms are approved for each partnership.", steps: [
      { title: "Your software", detail: "Orders · invoices · customer experience" }, { title: "Etail Depot", detail: "Merchant services · payment operations" }, { title: "Your merchants", detail: "Account setup · checkout · support" },
    ] },
    sections: [
      { title: "Merchant accounts, pricing and support.", items: [
        { title: "Merchant accounts", text: "Each merchant applies and is reviewed on its own business activity before accepting payments. A platform partnership does not automatically approve your customers." },
        { title: "Operations and support", text: "Get help with account access, payment status, refunds and payouts. Your agreement defines who handles merchant support, software questions and purchase issues." },
        { title: "Partnership pricing", text: "Payment methods, transaction activity and integration needs shape your pricing. Processing, platform and implementation charges are confirmed in the partnership agreement." },
      ] },
      { title: "Connect the purchase to the payment record.", items: [
        { title: "Checkout integration", text: "Connect purchases to the checkout enabled for each merchant. Our integration team supplies the documentation, permissions and configuration details." },
        { title: "Payment records and updates", text: "Follow payments, refunds, disputes and payouts using merchant and order references. Available records and delivery methods depend on your integration." },
        { title: "Merchant activation", text: "Merchants can accept payments after approval and setup. Our team helps your developers verify checkout, reporting and support before activation." },
      ] },
    ],
  },
  "/payment-facilitator": {
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
  },
  "/company": {
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
  },
  "/trust": {
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
        { title: "Account access", text: "Use Sign in to access your merchant account. Keep credentials private and limit access to authorized people. Submit verification documents through the secure account service." },
        { title: "Checkout and integration", text: "Confirm where payment details are entered, which systems receive them and who can access them. Request the specifications and permissions for your account before connecting your software." },
        { title: "Payment security requirements", text: "Merchants retain responsibilities under the Payment Card Industry Data Security Standard (PCI DSS) when using a payment provider. Confirm the assessment and documentation required for your business with your acquiring partner or the organization managing your compliance program." },
      ] },
      { title: "Account agreements and security information.", items: [
        { title: "Security documentation", text: "Request the security and compliance documents available for your service. Check the named provider, services covered and review period." },
        { title: "Privacy and account terms", text: "Our Website Privacy Policy covers browsing and contacting us. Request the account agreement and privacy notice for the merchant, integration or card service you use." },
        { title: "Questions and concerns", text: "Contact merchant support about account access or payment issues. Direct privacy, data rights and compliance questions to our compliance team. Use the requested secure channel when sharing sensitive records." },
      ] },
    ],
  },
  "/contact": {
    label: "Contact", title: "Contact Etail Depot",
    description: "Discuss merchant services for your business or software platform, including a change of provider. Contact Etail for account support and integration information.",
    heading: "Contact Etail Depot.",
    intro: "Merchant services, platform integrations and account support.",
    action: { label: "Explore contact options", href: "#contact-options" },
    art: { title: "Contact Etail", caption: "Apply or sign in through the merchant account service. Contact our team by email for questions and account support.", steps: [
      { title: "Your business", detail: "Application · payment account" }, { title: "Your software", detail: "Partnership · integration" }, { title: "Your question", detail: "Card service · privacy · compliance" },
    ] },
    sections: [],
  },
  "/ach-payments": SERVICE_DETAIL_PAGES["/ach-payments"],
  "/switch-payment-providers": {
    label: "Switch merchant services", title: "Switch Merchant Services Providers",
    description: "Stripe application declined or account closed? Discuss merchant services and credit card processing with Etail. New accounts require review and approval.",
    heading: "Declined by Stripe? Let’s look at your business.",
    intro: "Merchant services for businesses declined, restricted or no longer supported by their provider.",
    action: { label: "Discuss your business", href: "/contact#payment-review" },
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
  },
  "/platform-payment-models": {
    label: "Platform payment models", title: "Payment Models for Software Platforms and Marketplaces",
    description: "Compare merchant account relationships for software platforms and marketplaces, including checkout, reporting and payment support.",
    heading: "Match the account to the selling business.",
    intro: "Connect each sale to the right business, merchant account and payment records. Start with who sells and who receives payment.",
    action: { label: "Discuss your platform", href: "/contact#platforms" },
    note: "Account structure, supported payment flows and commercial terms are agreed for each partnership.",
    art: { layout: "platform", title: "Your software and the merchant account.", caption: "A software connection does not by itself authorize the platform to hold, split or distribute customer funds.", steps: [
      { title: "The selling business", detail: "Customer agreement and merchant account" },
      { title: "Merchant services", detail: "Payment acceptance and account operations" },
      { title: "Your software", detail: "Purchase context and connected records" },
    ] },
    sections: [
      { title: "Who is the customer paying?", intro: "Start with the seller named in the purchase and the business receiving payment. A platform can have different roles for its own software fees and its merchants’ sales.", items: [
        { title: "You sell your own software or service", text: "Your business is selling directly to the customer. Review a merchant account for those sales, with your own customer terms, refund process and payment records. This does not automatically cover sales made by your users." },
        { title: "Merchants sell through your software", text: "Each business receiving payment needs a merchant account and an approved payment setup. Your software connects the purchase to that business, with access limited to the account permissions provided for your integration." },
        { title: "Your marketplace connects buyers and sellers", text: "Identify the seller for each purchase, the customer’s agreement and the intended movement of funds. Multiple sellers, commissions, split payments and holding funds need a separately approved structure; they are not assumed features of a checkout integration." },
      ] },
      { title: "Merchant accounts, support and reporting.", items: [
        { title: "Merchant onboarding and ownership", text: "Each merchant applies for its account and accepts the merchant agreement. Your platform’s access to account information and payment actions depends on the permissions approved for your integration." },
        { title: "Customer experience and support", text: "Customers should know which business they are paying and where to ask for help. Connect checkout to the purchase, and make it clear which team handles order questions, refunds and disputes." },
        { title: "Reporting and commercial terms", href: "/payment-partnerships", text: "Keep merchant, order and payment references together in your reports. Your agreement sets out processing charges, any platform fees and responsibility for adjustments. Revenue sharing, funds control and data portability require their own terms." },
      ] },
    ],
  },
  "/reconciliation": SERVICE_DETAIL_PAGES["/reconciliation"],
  "/disputes": SERVICE_DETAIL_PAGES["/disputes"],
} as const satisfies Record<string, CommercialPage>;

export type CommercialPath = keyof typeof COMMERCIAL_PAGES;
