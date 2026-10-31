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
  sections: readonly { title: string; intro?: string; items: readonly { title: string; text: string; href?: string }[] }[];
}

export const COMMERCIAL_PAGES = {
  "/merchant-onboarding": {
    label: "Merchant onboarding", title: "Merchant Onboarding and Account Setup",
    description: "Prepare your merchant application, understand the account review and confirm payment methods and payout terms before accepting payments.",
    heading: "Set up your merchant account.",
    intro: "Opening an account or moving from another provider? Prepare your business information, submit your application and review the terms before accepting payments.",
    action: { label: "Apply for a merchant account", href: "https://trolleys.ai" },
    secondaryAction: { label: "Discuss your business first", href: "/contact#payment-review" },
    note: "Applications open at Trolleys, an Etail Depot service. Account approval and setup apply.",
    art: { title: "From business profile to payment setup", caption: "Approval, an accepted agreement and account configuration are required before payments can begin.", steps: [
      { title: "Business profile", detail: "Activity · ownership · sales channels" }, { title: "Account review", detail: "Information and eligibility" }, { title: "Merchant agreement", detail: "Fees · payout terms · responsibilities" }, { title: "Payment setup", detail: "Methods · access · payout account" },
    ] },
    sections: [
      { title: "What you’ll need to apply.", items: [
        { title: "Business and ownership", text: "Prepare your legal business details, contact information and ownership information. Use the secure application for the records requested during review." },
        { title: "What you sell", text: "Explain your products or services, where customers place orders and when they receive their purchase. Include your website and the refund or cancellation terms customers see." },
        { title: "How you accept payments", text: "Describe your expected payment activity and whether you need checkout, payment requests or a software connection. Include any previous processing, account restrictions and the reason for changing providers." },
      ] },
      { title: "From application to activation.", intro: "Review, agreement and activation are separate steps. Submitting business details does not automatically enable payments.", items: [
        { title: "Respond to information requests", text: "The review may require more information about the business or its activity. Respond through the requested secure channel and keep the account contact details current." },
        { title: "Read the account terms", text: "Check the fees, payout schedule, permitted activity and any reserve or hold conditions before accepting your merchant agreement. The terms for your account govern the service." },
        { title: "Payment methods and account access", text: "Once the account is approved, confirm the payment methods, checkout setup, authorized users and payout details. A platform integration may need a separate configuration before it can accept payments." },
      ] },
    ],
  },
  "/payment-methods": {
    label: "Payment methods", title: "Cards, Digital Wallets and ACH Payments",
    description: "Compare card, digital wallet and ACH acceptance, including checkout availability, payment confirmation and account setup.",
    heading: "Cards, wallets and bank payments.",
    intro: "Accept cards, digital wallets and ACH through the payment methods enabled for your merchant account.",
    action: { label: "Explore online payments", href: "/online-businesses" },
    note: "Wallet acceptance also depends on the customer’s card and device. ACH has separate pricing and payout terms.",
    art: { title: "One purchase. Different payment methods.", caption: "Methods are enabled for your account. Use the payment record to confirm the result before fulfillment.", steps: [
      { title: "Cards", detail: "Authorization → capture" }, { title: "Digital wallets", detail: "Eligible card · supported device" }, { title: "ACH", detail: "Authorization · payment status" },
    ] },
    sections: [
      { title: "Choose the methods your customers use.", items: [
        { title: "Credit and debit cards", text: "Accept supported card payments online. Authorization and capture are separate events, and a captured payment is not the same as a deposit received by your bank." },
        { title: "Apple Pay and Google Pay", text: "Offer supported wallet payment options where enabled. Availability depends on your account configuration and the customer’s eligible card, wallet and device." },
        { title: "ACH bank payments", text: "ACH is a separate bank payment method with its own authorization requirements, status handling, returns and timing. Confirm those requirements and the applicable fees for your account." },
      ] },
      { title: "One purchase. A traceable payment.", items: [
        { title: "Payment confirmation", text: "Use the payment record to establish the result. A closed browser, interrupted connection or customer screenshot alone does not determine whether a payment succeeded." },
        { title: "Refunds and returns", text: "Use the process appropriate to the original payment method. A card refund, card dispute and ACH return are different events and should be tracked separately." },
        { title: "Payment setup", text: "Our integration team provides the specifications for your account, including checkout display options, enabled payment methods and payment results." },
      ] },
    ],
  },
  "/payouts-and-reconciliation": {
    label: "Payouts and reconciliation", title: "Payouts and Payment Reconciliation",
    description: "Follow a payment through settlement, fees and adjustments to the payout report, then match the deposit to your bank statement.",
    heading: "Understand each bank deposit.",
    intro: "See which payments, fees and adjustments make up a payout. Match the report to the deposit in your bank account.",
    action: { label: "Read reconciliation documentation", href: "/docs/payouts" },
    art: { title: "From payment to bank deposit", caption: "Refunds, disputes, reserves and other account adjustments can affect a payout, including after the original sale.", steps: [
      { title: "Capture", detail: "Payment submitted for processing" }, { title: "Settlement", detail: "Processing and settlement records" }, { title: "Payout calculation", detail: "Payments · fees · adjustments" }, { title: "Bank deposit", detail: "Payout report matched to receipt" },
    ] },
    sections: [
      { title: "Match each deposit to its records.", intro: "One payout may contain several payments and adjustments. Keep the transaction, payout and bank references together.", items: [
        { title: "Start with payment activity", text: "Identify the payments included in the reporting period and their processing status. A captured or settled payment alone does not establish that the bank has received a deposit." },
        { title: "Read the payout calculation", text: "Review the included fees, refunds, chargebacks and other adjustments. Use the payout report to explain the amount rather than subtracting a processing rate from total sales." },
        { title: "Match the bank deposit", text: "Match the payout reference, amount and bank statement entry. Keep unmatched entries open until the difference is explained; a scheduled payout and a received deposit are different states." },
      ] },
      { title: "When the deposit differs from the sales total.", items: [
        { title: "Timing and reporting periods", text: "Compare the same account, currency and reporting period. Payments captured after a cutoff may appear in a later report. Your account’s payout schedule and bank processing affect receipt." },
        { title: "Later adjustments", text: "Refunds or chargebacks can relate to an earlier sale. Locate the original transaction and the adjustment entry so the change remains traceable across reporting periods." },
        { title: "Unresolved differences", text: "Collect the payment reference, payout reference, relevant dates and the unexplained amount for account support. First payouts, reviews, holds, reserves and holidays can affect timing." },
      ] },
    ],
  },
  "/refunds-and-disputes": {
    label: "Refunds and disputes", title: "Refund and Dispute Management",
    description: "Understand merchant refunds, cardholder disputes and the records needed to follow each case and its effect on payouts.",
    heading: "Refunds and disputes, connected to the sale.",
    intro: "Manage refunds and cardholder disputes with the original transaction in view. Follow each request, case and account adjustment to its outcome.",
    action: { label: "Read the operations documentation", href: "/docs/refunds-and-disputes" },
    art: { title: "Different paths from the same payment", caption: "A refund does not automatically close a dispute. Check the case instructions before taking another action.", steps: [
      { title: "Original payment", detail: "Order · transaction · customer record" }, { title: "Merchant refund", detail: "Requested amount · refund status" }, { title: "Cardholder dispute", detail: "Reason · deadline · case outcome" },
    ] },
    sections: [
      { title: "Choose the action that fits the payment.", intro: "The available action depends on the transaction’s status, the payment method and your account permissions.", items: [
        { title: "Before settlement", text: "A void or authorization reversal may be appropriate instead of a refund. Check whether the payment has been captured and which action is available before starting another request." },
        { title: "Returning a payment", text: "Confirm the original transaction and the amount to return. Track the refund status separately from the sale, and check any existing refund or dispute before submitting another instruction." },
        { title: "A dispute is received", text: "Read the reason, response deadline and requested records. Decide how to respond through the case process. The outcome depends on the case and applicable rules; submitting records does not guarantee a win." },
      ] },
      { title: "Keep the sale and the outcome together.", items: [
        { title: "Purchase and delivery records", text: "Keep the order details, terms shown to the customer, relevant customer communication and evidence of delivery or service. Select records that address the actual dispute reason." },
        { title: "Case status and deadlines", text: "Use the response deadline in the case notice. Follow the result and any further requests. Avoid issuing a separate refund during an open dispute without checking the case instructions." },
        { title: "Fees and payout impact", text: "Refunds and chargebacks can affect later payouts. Original processing and currency conversion fees are not returned on a refund. Dispute and response fees are described in the pricing schedule." },
      ] },
    ],
  },
  "/pricing": {
    label: "Pricing", title: "Credit Card Processing Fees and Pricing",
    description: "Review Etail’s credit card processing fees, estimate the cost of domestic online payments and check additional charges, ACH pricing and platform terms.",
    heading: "Know what your payments cost.",
    intro: "See the card processing rate, estimate your fees and review additional charges. ACH and software partnership pricing are confirmed separately.",
    action: { label: "Discuss your processing costs", href: "/contact#payment-review" },
    secondaryAction: { label: "Discuss platform terms", href: "/contact#platforms" },
    art: { title: "A complete view of payment costs", caption: "The card processing estimate is not a guaranteed bank deposit.", steps: [
      { title: "Card processing", detail: "Percentage plus a fixed fee" }, { title: "Other charges", detail: "Payment type · account activity" }, { title: "Account terms", detail: "ACH · platform · payout schedule" },
    ] },
    sections: [{ title: "ACH and platform pricing.", intro: "ACH payments and software partnerships have separate pricing and account terms.", items: [
      { title: "ACH payments", text: "ACH pricing and payout terms are separate. Confirm available options, authorization requirements, return handling and any associated charges for your account." },
      { title: "Software partnerships", text: "Platform access, integration scope and commercial terms are agreed before launch. Confirm any implementation costs and the division of support responsibilities for your setup." },
      { title: "Payouts and account conditions", text: "Read the payout schedule and any reserve or hold conditions in your merchant agreement. A fee estimate cannot predict when a deposit will arrive or every adjustment applied to it." },
    ] }],
  },
  "/payment-partnerships": {
    label: "Payment partnerships", title: "Payment Partnerships for Software Platforms",
    description: "Merchant services partnerships for software platforms, with account setup, credit card processing, checkout integration and payment reporting.",
    heading: "Merchant services for your platform.",
    intro: "Bring merchant accounts, checkout and reporting into your software. Work with Etail on service options for businesses your current provider cannot support.",
    action: { label: "Discuss your partnership", href: "/contact#platforms" },
    art: { title: "Your platform. Our merchant services.", caption: "Merchant accounts, integration access and commercial terms are approved for each partnership.", steps: [
      { title: "Your software", detail: "Orders · invoices · customer experience" }, { title: "Etail Depot", detail: "Merchant services · payment operations" }, { title: "Your merchants", detail: "Account setup · checkout · support" },
    ] },
    sections: [
      { title: "Merchant accounts, pricing and support.", items: [
        { title: "Merchant accounts", text: "Identify the businesses that need another provider and why. Each merchant applies and is reviewed on its own activity before it can accept payments. A platform partnership does not automatically approve every customer." },
        { title: "Operations and support", text: "Merchant account support covers access, payment status, refunds and payouts. Purchase and software questions go to the teams responsible for those services. Your partnership agreement sets out each team’s responsibilities." },
        { title: "Partnership pricing", text: "Payment methods, transaction activity and integration requirements inform the commercial terms. Processing charges and any platform or implementation fees are confirmed in your partnership agreement." },
      ] },
      { title: "Connect the purchase to the payment record.", items: [
        { title: "Checkout integration", text: "Connect your purchase flow to the checkout options enabled for each merchant. Our integration team provides the required documentation, permissions and configuration details." },
        { title: "Payment records and updates", text: "Match each payment to its merchant and order. Use payment updates and reports to follow refunds, disputes and payouts. Available records and delivery methods depend on your integration." },
        { title: "Merchant activation", text: "Merchants can accept payments after account approval and payment setup. Our team works with your developers on checkout verification, reporting and support before activation." },
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
        { title: "Merchant and payment facilitator", text: "The merchant sells the product or service and handles customer communication and fulfillment. Etail provides account review, payment acceptance and operational support under the applicable agreements." },
        { title: "Acquiring partner and network", text: "The acquiring arrangement connects merchant card acceptance to the card network. The network sets applicable participation and transaction rules. Responsibilities follow those rules and the parties’ agreements." },
        { title: "Issuer and cardholder", text: "The issuer provides the customer’s card account and participates in authorization and disputes. Etail’s merchant service role does not make Etail the card issuer or a bank." },
      ] },
      { title: "What that means for your business.", items: [
        { title: "Joining the service", text: "Your business is reviewed before payment acceptance is enabled. The merchant agreement defines the permitted activity, fees and other account conditions." },
        { title: "Accepting and managing payments", text: "Use the methods configured for your account, track payment results and handle refunds or disputes through their appropriate processes." },
        { title: "Understanding deposits", text: "Use payment and payout records to explain fees and adjustments, then reconcile the deposit to your bank statement. Capture, settlement and bank receipt remain separate events." },
      ] },
    ],
  },
  "/company": {
    label: "Company", title: "About Etail Depot",
    description: "Etail Depot provides merchant services for US businesses and software platforms, including account setup, credit card processing, checkout and reporting.",
    heading: "Merchant services for businesses and software platforms.",
    intro: "We help US businesses accept card and ACH payments and work with software platforms to connect merchant accounts, checkout and reporting.",
    action: { label: "Contact Etail Depot", href: "/contact" },
    art: { title: "Our services", caption: "Merchant services and card services have separate account relationships and terms.", steps: [
      { title: "Merchant services", detail: "Account setup · card and ACH payments" }, { title: "Software platforms", detail: "Merchant onboarding · payment integration" }, { title: "Card services", detail: "Virtual secured credit" },
    ] },
    sections: [{ title: "One company. Merchant and card services.", intro: "Etail Depot US, Inc. is a payment facilitator operating merchant services under Trolleys and card services under Ledgix. We are not a bank.", items: [
      { title: "For merchants", text: "US businesses can apply to accept cards and ACH payments in USD. Services include payment status, refunds, dispute management and payout reporting, subject to account approval and the applicable terms." },
      { title: "For software platforms", text: "We work with software platforms on merchant onboarding, checkout and payment reporting. Account structure, integration access and commercial terms are agreed for each partnership." },
      { title: "Card services", text: "Ledgix is our secured credit card service. Eligibility, credit limits and account terms apply." },
    ] }],
  },
  "/trust": {
    label: "Security and privacy", title: "Security, Privacy and Service Responsibilities",
    description: "Understand account access, payment data responsibilities and privacy at Etail Depot. Find documentation and contacts for merchant services, card services and integrations.",
    heading: "Security, privacy and service responsibilities.",
    intro: "Know who can access your account, how payment data is handled and which documents apply to your service.",
    action: { label: "Ask about your service", href: "/contact#compliance" },
    art: { title: "Know what applies to your service", caption: "Security requirements depend on how you accept payments and what data your systems handle.", steps: [
      { title: "Account access", detail: "Authorized users · account support" }, { title: "Payment data", detail: "Checkout · integration responsibilities" }, { title: "Privacy", detail: "Personal information · service notices" },
    ] },
    sections: [
      { title: "Protect account access and payment data.", items: [
        { title: "Account access", text: "Apply for or manage your merchant account through Trolleys. Keep credentials private and limit access to authorized people. Submit verification documents through the secure account service." },
        { title: "Checkout and integration", text: "Confirm where payment details are entered, which systems receive them and who can access them. Request the specifications and permissions for your account before connecting your software." },
        { title: "Payment security requirements", text: "Merchants retain responsibilities under the Payment Card Industry Data Security Standard (PCI DSS) when using a payment provider. Confirm the assessment and documentation required for your business with your acquiring partner or the organization managing your compliance program." },
      ] },
      { title: "Account agreements and security information.", items: [
        { title: "Security documentation", text: "Ask our team which security and compliance documents are available for your account or integration. Check the named company, services covered and review period." },
        { title: "Privacy and account terms", text: "Our privacy notice explains how this website handles personal information. Merchant, integration and card account services have their own notices and agreements. Review the documents for the service you use." },
        { title: "Questions and concerns", text: "Contact merchant support about account access or payment issues. Direct privacy, data rights and compliance questions to our compliance team. Use the requested secure channel when sharing sensitive records." },
      ] },
    ],
  },
  "/contact": {
    label: "Contact", title: "Contact Etail Depot",
    description: "Discuss merchant services for your business or software platform, including a change of provider. Contact Etail for account support and integration information.",
    heading: "Let’s talk about your business.",
    intro: "Start with your website and a short description of what you need. You can speak with us before beginning a merchant application.",
    action: { label: "Explore contact options", href: "#contact-options" },
    art: { title: "Contact Etail", caption: "Apply or sign in through the merchant account service. Contact our team by email for questions and account support.", steps: [
      { title: "Your business", detail: "Application · payment account" }, { title: "Your software", detail: "Partnership · integration" }, { title: "Your question", detail: "Card service · privacy · compliance" },
    ] },
    sections: [],
  },
  "/ach-payments": {
    label: "ACH payments", title: "ACH Payment Processing for Businesses",
    description: "Accept ACH bank payments through Etail merchant services. Review authorization, payment status, returns and the account terms for your business.",
    heading: "Let customers pay from their bank account.",
    intro: "Accept ACH bank payments for invoices and orders. Keep authorization, payment status and any return connected to the purchase.",
    action: { label: "Explore merchant services", href: "/payment-acceptance-service" },
    note: "Account approval and ACH setup apply. Pricing, processing limits and payout timing are confirmed for your account.",
    art: { layout: "ach", title: "Keep the payment connected to the purchase", caption: "A submitted ACH payment can still be returned. Payment status and receipt of a bank deposit are separate records.", steps: [
      { title: "Customer authorization", detail: "Permission to debit the bank account" },
      { title: "Bank processing", detail: "Submission, settlement and any return" },
      { title: "Reconciliation", detail: "Payment record matched to the deposit" },
    ] },
    sections: [
      { title: "A bank payment option for your customers.", intro: "ACH moves money through the US banking network. It can fit purchases where customers prefer to pay from an account and your business can accommodate bank processing times.", items: [
        { title: "Invoices and orders", text: "Keep the invoice or order reference with the payment. That connection helps your team identify what was paid, respond to a customer question and explain any later return." },
        { title: "Payments within software", text: "If customers pay through a software platform, agree where authorization is collected and how payment updates reach the business. Available checkout options depend on the approved integration." },
        { title: "An option alongside cards", text: "Consider the customer’s preference, the purchase and your delivery policy. Compare the agreed ACH charges and timing with your card terms before choosing how to offer each method." },
      ] },
      { title: "Know what happens after submission.", intro: "Bank payments have their own authorization, status and return handling. A successful submission does not establish that funds are available to your business.", items: [
        { title: "Collect the right authorization", text: "Confirm the authorization and account validation requirements for the payment type you will accept. Keep the required record and follow the agreed process for changes or cancellations." },
        { title: "Follow the payment status", text: "Use the payment record to distinguish a submitted payment from a settled payment or a return. Confirm the account’s processing and availability terms when setting your fulfillment policy." },
        { title: "Reconcile returns and deposits", text: "Match the payment and any return to the original purchase, then reconcile the payout report with your bank statement. Review a return reason before deciding whether another payment attempt is permitted." },
      ] },
    ],
  },
  "/switch-payment-providers": {
    label: "Switch merchant services", title: "Switch Merchant Services Providers",
    description: "Stripe application declined or account closed? Discuss merchant services and credit card processing with Etail. New accounts require review and approval.",
    heading: "Declined by Stripe? Let’s look at your business.",
    intro: "Etail offers credit card processing and ACH for US businesses seeking a new provider. Get guidance on account requirements, checkout and the steps to switch.",
    action: { label: "Discuss your business", href: "/contact#payment-review" },
    note: "New accounts require review and approval. Data transfer, account availability and launch timing must be confirmed for your setup. A new account does not release funds held by another provider. Etail Depot is independent of Stripe.",
    art: { layout: "transition", title: "Your next payment setup starts with a review.", caption: "Changing providers does not transfer an existing account, release held funds or close outstanding refunds and disputes.", steps: [
      { title: "Current provider", detail: "Existing payments and open obligations" },
      { title: "Business review", detail: "Your activity, account needs and integration" },
      { title: "Etail payment setup", detail: "New payments after approval and setup" },
    ] },
    sections: [
      { title: "Start with your business.", items: [
        { title: "Your application was declined", text: "Share your business website, what customers buy and when you deliver it. Include the reason given by the provider, if available. We review the business on its own facts; a previous decline neither guarantees nor rules out approval." },
        { title: "Your account was closed or restricted", text: "Explain the account notice, your processing history and the payments you still need to manage. A new account has its own review and terms. It does not restore the previous account or resolve a reserve, refund or dispute held there." },
        { title: "Some platform merchants cannot be supported", text: "Tell us which businesses need another provider and how they accept payments through your software. We can review those merchants for a separate arrangement. Each account and its integration require approval." },
      ] },
      { title: "Know the terms before you switch.", items: [
        { title: "Business and payment activity", text: "Describe what you sell, the customers you serve, your delivery and cancellation terms, and approximate monthly payment volume. Tell us about previous processing and the reason for changing providers." },
        { title: "Fees and payout terms", text: "Review the proposed fee schedule, payout timing and any reserve or hold conditions. Ask which card and ACH options are available for your account. A headline rate alone does not establish the full cost or account conditions." },
        { title: "Account and integration requirements", text: "Confirm the merchant application, checkout configuration and reporting your business needs. Required documents go through the secure application process. Approval and activation are separate steps; submitting an inquiry does not enable payments." },
      ] },
      { title: "Keep existing payments accounted for.", intro: "New payments use the approved Etail account. Existing refunds, disputes and other obligations remain subject to the previous provider’s agreement.", items: [
        { title: "Saved payment details", text: "Ask both providers whether payment methods and consent records can be transferred. Provider tokens and wallet credentials are not automatically portable. Any sensitive payment data transfer must use the agreed secure process between the responsible providers." },
        { title: "Open transactions and account records", text: "Identify unsettled transactions, refunds, disputes, reserves and recurring payment commitments. Keep the access and records needed to resolve that activity under the original agreement. The new account does not automatically inherit it." },
        { title: "Switching providers", text: "Choose when new payments move to the approved setup. Before switching, verify checkout, payment updates, refunds and reporting with your integration team. Keep transaction references from both providers so you can reconcile activity during the transition." },
      ] },
    ],
  },
  "/platform-payment-models": {
    label: "Platform payment models", title: "Payment Models for Software Platforms and Marketplaces",
    description: "Compare merchant account relationships for software platforms and marketplaces, including checkout, reporting and payment support.",
    heading: "Match the account to the selling business.",
    intro: "Identify who sells and who receives payment. That relationship determines the merchant account, checkout and reporting setup for your software.",
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
} as const satisfies Record<string, CommercialPage>;

export type CommercialPath = keyof typeof COMMERCIAL_PAGES;
