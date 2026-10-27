import Link from "next/link";
import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { serviceLabels } from "@/shared/service-language";
import { cardProduct } from "@/shared/card-product";
import { productFacts, saleRecordsOffer } from "@/shared/product-facts";
import { LegalDocument, type LegalSection } from "@/ui/legal-document";
import { LegalBrands, LegalContacts } from "@/ui/legal-identity";

export const metadata = legalPageMetadata("/terms");

const sections: LegalSection[] = [
  {
    id: "scope", title: "Our company and these terms", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates merchant services under the name Trolleys and card services under the name Ledgix. Ledgix and Trolleys are trade names of Etail Depot US, Inc.; the company remains the operator under each name.</p>
      <LegalBrands />
      <h3>This website</h3>
      <p>These Terms of Use cover this website, including service information, use cases, Guides, payment standards references, documentation, interactive tools and links to product services. References to “you” include the person using the website and, where applicable, a business they are authorized to represent.</p>
      <p>Our <Link href="/privacy">Privacy Policy</Link> explains information handling on this website. Visiting a product page or following a link does not open a financial account, transfer an existing account or guarantee approval.</p>
      <h3>Product agreements</h3>
      <p>Trolleys merchant services and the Ledgix credit card have separate product websites. Each product has its own agreements and notices covering its use, eligibility requirements and the responsibilities of Etail Depot and the companies involved in delivering that service. These website terms do not replace those agreements.</p>
    </>,
  },
  {
    id: "availability", title: "Service availability", content: <>
      <p>Etail Depot is not a bank. This website does not register customer accounts, process financial transactions or issue payment credentials. Merchant and credit card account actions take place on the relevant product’s website.</p>
      <p>Trolleys merchant services are available through its website. Applications for the {cardProduct.name}, a virtual {cardProduct.creditType}, are not open yet. Availability does not guarantee eligibility or approval, and product features are governed by the applicable service agreement.</p>
      <p>Review each product’s disclosures for the companies responsible for your account, fees, funds arrangements and financial protections. Brand names, website access and network logos do not establish those arrangements.</p>
      <p>Nothing in these website terms creates a credit facility, deposit account, deposit insurance coverage or guarantee that a card or payment will be accepted.</p>
    </>,
  },
  {
    id: "login", title: "Service access and responsibilities", content: <>
      <p>To sign in to Trolleys or manage your account, follow the access instructions supplied with your account. If you are new to the service, visit Trolleys to apply. Ledgix credit card account access will be available when the service launches. Earlier Etail Depot website accounts and invitations no longer provide access here and do not sign you in to either product.</p>
      <ul>
        <li>Use an email address you control and complete any required confirmation.</li>
        <li>Keep passwords, confirmation links and recovery links private. Each person must use their own login.</li>
        <li>Act only for yourself or an account or business you are authorized to manage.</li>
        <li>Provide only the information requested and follow the instructions for the service you are using.</li>
        <li>Review the destination, requested information and applicable terms before continuing to a product service.</li>
      </ul>
      <p>Creating a login for one service does not enroll you in another. An invitation does not waive eligibility requirements. Do not create a child’s login unless the service expressly provides an eligible, authorized guardian process.</p>
    </>,
  },
  {
    id: "cards", title: `Ledgix · ${serviceLabels.cards}`, content: <>
      <p>The {cardProduct.name} is a virtual {cardProduct.creditType} for compatible digital wallets. This website does not currently offer a card application, security deposit payment or credit card account access for that service.</p>
      <p>Eligible cards can be added to Apple Wallet or Google Wallet. Availability depends on card, device and regional compatibility and the applicable service’s terms.</p>
      <p>The <Link href="/credit-card-services#wallets">wallet guide</Link> explains typical steps. It does not collect card details, add a card to a wallet or confirm eligibility. Follow the instructions in your wallet app and from your card issuer.</p>
      <h3>Security deposit and card agreement</h3>
      <p>A security deposit backs the credit account. Purchases create a balance that must be repaid separately from the security deposit.</p>
      <p>The <Link href="/credit-card-services#card-details">card details</Link> describe the deposit, fees and repayment requirements. The card agreement and disclosures provided before enrollment will govern eligibility, credit limits, all charges, repayment, deposit return, cardholder access and available controls. Review them before opening an account. This website does not establish a credit account.</p>
      <p>Contacting Ledgix with an inquiry does not submit a card application, guarantee approval or enroll you in a mailing list.</p>
    </>,
  },
  {
    id: "payments", title: `Trolleys · ${serviceLabels.payments}`, content: <>
      <p>Visit Trolleys to apply. Existing customers should follow the instructions for signing in supplied with their account.</p>
      <h3>Payment pricing and your agreement</h3>
      <p>Payment request creation and sharing are included in the published payment fee for {productFacts.payments.offerName}, with no monthly fee. The <Link href="/payment-acceptance-service#fees">card processing fees</Link> section describes the rate and its scope. Review the merchant agreement and disclosures before enrollment for the terms that apply to your account, including accepted payment methods, account permissions, all fees, refunds, disputes, settlement and payouts. This website does not perform those account actions.</p>
      <p>The website’s onboarding, checkout, payment record and payout diagrams explain how the service works. The amounts and statuses shown are not account activity. These diagrams do not create payment requests, record transactions, issue refunds or move funds. An application shown as submitted is not an approval, and a payment confirmation is not confirmation of a bank deposit.</p>
      <h3>Software partnerships</h3>
      <p>Software partnership inquiries do not open merchant accounts or grant access to payment systems. Integration scope, account permissions, support responsibilities and commercial terms must be agreed separately. Each merchant remains subject to the applicable account approval and service requirements.</p>
      <h3 id="dispute-prevention">Optional {saleRecordsOffer.name}</h3>
      <p>Trolleys’ optional {saleRecordsOffer.name} service uses Order Insight to share supported merchant, transaction and order details with participating banks. It helps customers recognize purchases and can prevent eligible Visa online fraud disputes when the required transaction history and data qualify. Basic transaction receipts remain included without this service.</p>
      <p>The Trolleys service fee is {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Payment processing is separate. Applicable charges and service terms are disclosed before enrollment. Review the service agreement for transaction coverage, billing, refund treatment and information sharing. Exploring {saleRecordsOffer.name} on this website does not enroll you, accept a contract or create a charge.</p>
      <p>This website does not collect sale records, share information with banks or submit dispute evidence. It does not collect signatures or establish customer consent. Payment and fulfillment are separate events; payment alone does not establish delivery, quality or a promised result.</p>
      <p>{saleRecordsOffer.brandName} does not cover every bank, payment or dispute reason and does not guarantee an outcome. Refund programs and services that respond to existing chargebacks for you are separate services. Merchants remain responsible for accurate records, appropriate terms, fulfillment and timely responses. Website content is not legal advice.</p>
      <h3>Estimates and account records</h3>
      <p>The fee calculator estimates the displayed processing fee for one domestic online card payment. It excludes optional services and other applicable charges. It does not calculate ACH fees. The amount labeled “After card processing” is the payment amount less the displayed card processing fee. It excludes other applicable charges and adjustments; it is not a guaranteed bank deposit or a prediction of when funds will arrive. Check your service agreement and account records for an actual payment’s charges and status.</p>
      <p>Use the service’s recorded statuses and instructions to confirm an action’s outcome. A link to Trolleys does not enroll you in Ledgix, connect account balances or transfer funds between the two products.</p>
    </>,
  },
  {
    id: "acceptable-use", title: "Responsible use", content: <>
      <p>Use this website lawfully. Do not:</p>
      <ul>
        <li>Impersonate another person or submit false or misleading information when contacting us.</li>
        <li>Attempt unauthorized access, bypass security controls or interfere with this website.</li>
        <li>Send unlawful content, unsolicited messages or harmful software.</li>
        <li>Collect or disclose another person’s information without authorization.</li>
      </ul>
    </>,
  },
  {
    id: "content", title: "Website content and external services", content: <>
      <h3>Guides and documentation</h3>
      <p>Guides and documentation provide reference information and general explanations. They are not advice about your particular legal, tax or financial circumstances. Describing a payment standard, network or technical function does not establish that it is supported or enabled for your account.</p>
      <p>Confirm the instructions, permissions and implementation requirements for your account before using them in your business. Documentation does not issue credentials, enable account functions or authorize financial actions. The applicable product agreement and instructions govern those actions.</p>
      <h3>Information you provide</h3>
      <p>You are responsible for material you send when contacting us, including descriptions, business names and messages, and for having permission to share it. We handle that material for the purposes described in our Privacy Policy.</p>
      <h3>Ownership and external links</h3>
      <p>Website designs, text and branding remain the property of their respective owners. Access does not transfer ownership or authorize you to imply endorsement by Etail Depot, Ledgix, Trolleys or a card network.</p>
      <p>Linked product services and external references have their own terms and privacy notices. Email and telephone links open the application you choose on your device. Review the destination and the information you share before continuing. Using a separate product website does not change Etail Depot’s obligations under applicable law or the agreements it enters into with you.</p>
    </>,
  },
  {
    id: "standards", title: "Payment standards references", content: <>
      <p>The Guides library includes independent references to ISO 20022 and ISO 8583. Etail Depot is not a standards body or registration authority. These references do not certify an implementation or establish approval by ISO, a card network, a bank or a payment provider.</p>
      <p>Read a code together with its code set or table, standard edition and source release. The same value can have different meanings in different contexts. A source release date does not establish when a bank, network or provider adopted a value. Confirm the version and implementation rules that apply to your connection.</p>
      <p>This is not the official ISO 20022 website. The official source of current ISO 20022 message standards and Repository information is <a href="https://www.iso20022.org/" rel="external noreferrer" referrerPolicy="no-referrer">iso20022.org</a>. Use the source links on each reference page to check the relevant release. The ISO 8583 implementation reference uses identified open source libraries with their respective licences and attribution. It does not reproduce the ISO 8583:2023 tables. Consult the applicable standard and the implementation specification supplied for your connection.</p>
      <p>Standards text, definitions and source materials remain subject to their rights holders’ terms. Access to this website does not grant additional rights to reproduce, redistribute or use material from third parties in automated systems. Review the applicable source license and obtain any required permission.</p>
      <p>If you find an error, contact us with the page address, code or message identifier and source edition. Do not include payment credentials or customer records in a correction request.</p>
    </>,
  },
  {
    id: "access-changes", title: "Service changes and access", content: <>
      <p>Maintenance, connectivity issues or errors can interrupt access. For actions within a product, check its recorded status and follow its instructions before trying again.</p>
      <p>Access to this website may be restricted where reasonably necessary to address misuse, security risks or applicable legal requirements. Earlier website account tools are no longer available; retained records can be addressed through our compliance contact. Ending access does not automatically delete historical records. Each product’s terms govern access to each service.</p>
      <p>Each product’s agreement governs financial account closure, outstanding obligations and any return of funds. Changes to these website terms remain subject to applicable notice and acceptance requirements.</p>
    </>,
  },
  {
    id: "rights", title: "Your legal rights", content: <>
      <p>These website terms do not remove rights or remedies that cannot lawfully be waived.</p>
      <p>Card and payment disputes follow the applicable product’s process. A service outcome does not replace any rights under applicable law or a separate product agreement.</p>
      <p>Direct legal notices, privacy requests and other compliance matters to the company’s compliance contact below. Product support is available through the respective Ledgix or Trolleys contact.</p>
    </>,
  },
  { id: "contact", title: "Contact us", content: <LegalContacts /> },
];

export default function TermsPage() {
  return <LegalDocument title="Terms of Use" description="Terms for using this informational website and its links to product services." updated="October 27, 2026" currentPage="terms" sections={sections} />;
}
