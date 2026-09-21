import Link from "next/link";
import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { cardProduct } from "@/shared/card-product";
import { saleRecordsOffer } from "@/shared/product-facts";
import { LegalDocument, type LegalSection } from "@/ui/legal-document";
import { LegalBrands, LegalContacts } from "@/ui/legal-identity";

export const metadata = legalPageMetadata("/terms");

const sections: LegalSection[] = [
  {
    id: "scope", title: "Our company and these terms", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates Ledgix for cards and Trolleys for payments. Both are trade names of Etail Depot US, Inc.; the company remains the operator under each name.</p>
      <LegalBrands />
      <p>These Terms of Use cover this informational website and its links to product services. References to “you” include the person using the website and, where applicable, a business they are authorized to represent.</p>
      <p>Trolleys payments and the forthcoming Ledgix card service have separate product websites. Each product has its own agreements and notices covering its use, eligibility requirements and the responsibilities of Etail Depot and the companies involved in delivering that service. These website terms do not replace those agreements.</p>
      <p>Our <Link href="/privacy">Privacy Policy</Link> explains information handling on this website. Visiting a product page or following a link does not open a financial account, transfer an existing account or guarantee approval.</p>
    </>,
  },
  {
    id: "availability", title: "Service availability", content: <>
      <p>This website provides product information and links to our product services. It does not register customer accounts, process financial transactions or issue payment credentials. Card and payment account actions take place on the relevant product’s website.</p>
      <p>Trolleys payments are available through its website. Ledgix {cardProduct.name}, a virtual {cardProduct.creditType}, is coming soon. Availability does not guarantee eligibility or approval, and product features are governed by the applicable service agreement.</p>
      <p>Review each product’s disclosures for the companies responsible for your account, fees, funds arrangements and financial protections. Brand names, website access and network logos do not establish those arrangements.</p>
      <p>Nothing in these website terms creates a credit facility, deposit account, deposit-insurance coverage or guarantee that a card or payment will be accepted.</p>
    </>,
  },
  {
    id: "login", title: "Service access and responsibilities", content: <>
      <p>Trolleys provides sign-in and account management through its website. Ledgix card access will be available when the card service launches. Earlier Etail Depot website accounts and invitations no longer provide access here and do not sign you in to either product. Follow the enrollment and recovery instructions for the service you use.</p>
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
    id: "cards", title: `Ledgix · ${cardProduct.name}`, content: <>
      <p>Ledgix {cardProduct.name} is a forthcoming virtual {cardProduct.creditType} for compatible digital wallets. This website does not currently offer a card application, security-deposit payment or card account sign-in for that service.</p>
      <p>Eligible cards can be added to Apple Wallet or Google Wallet. Availability depends on card, device and regional compatibility and the applicable service’s terms.</p>
      <p>The wallet setup guide explains typical steps. It does not collect card details, add a card to a wallet or confirm eligibility. Follow the instructions in your wallet app and from your card issuer.</p>
      <p>A security deposit backs the credit account. Purchases create a balance that must be repaid separately from the security deposit.</p>
      <p>The <Link href="/card-services#card-details">card details</Link> describe the published deposit, fee and repayment offer. The card agreement and disclosures provided before enrollment will govern eligibility, credit limits, all charges, repayment, deposit return, cardholder access and available controls. Review them before opening an account. This website does not establish a credit account.</p>
      <p>Contacting Ledgix with an inquiry does not submit a card application, reserve approval or enroll you in a mailing list.</p>
    </>,
  },
  {
    id: "payments", title: "Trolleys · Payments", content: <>
      <p>Continue to Trolleys for enrollment, sign-in and payment account management.</p>
      <p>The <Link href="/payment-services#fees">payment pricing</Link> section describes the published standard pricing and its scope. Review the merchant agreement and disclosures before enrollment for the terms that apply to your account, including accepted payment methods, account permissions, all fees, refunds, disputes, settlement and payouts. This website does not perform those account actions.</p>
      <p>Payment examples on this website illustrate ways to request payment for goods, services and information. Information can include research, insights or advice delivered as a report, briefing or consultation. Example amounts, items, messages and payment statuses are illustrative and do not create a payment request or record a transaction.</p>
      <p>Trolleys’ optional {saleRecordsOffer.name} service uses its live Order Insight integration to share supported merchant, transaction and order details with participating banks. It helps customers recognize purchases and can prevent eligible Visa fraud disputes when the required transaction history and data qualify. Basic transaction receipts remain included without this service.</p>
      <p>The Trolleys service fee is {saleRecordsOffer.rateLabel} {saleRecordsOffer.feeBasis}. Payment processing is separate. Applicable charges and service terms are disclosed before enrollment. Review the service agreement for transaction coverage, billing, refund treatment and information sharing. Selecting or previewing {saleRecordsOffer.name} on this website does not enroll you, accept a contract or create a charge.</p>
      <p>The website examples use fixed illustrative information. They do not collect actual sale records, generate or deliver documents, collect a signature, establish customer consent, share records with banks or submit dispute evidence. Payment and fulfillment are separate events that require accurate records; payment alone does not establish delivery, quality or a promised result.</p>
      <p>{saleRecordsOffer.name} does not cover every bank, payment or dispute reason and does not guarantee an outcome. Refund programs and managed responses to existing chargebacks are separate services. Merchants remain responsible for accurate records, appropriate terms, fulfillment and timely responses. Website examples are not legal advice.</p>
      <p>The fee calculator estimates only the displayed processing fee and the Trolleys {saleRecordsOffer.name} fee if selected. The remaining amount excludes any other applicable charges; it is not a guaranteed settlement amount or a prediction of when funds will reach your bank. Check your service agreement and account records for an actual payment’s charges and status.</p>
      <p>Use the service’s recorded statuses and instructions to confirm an action’s outcome. A link to Trolleys does not enroll you in Ledgix, connect account balances or transfer funds between the two products.</p>
    </>,
  },
  {
    id: "acceptable-use", title: "Responsible use", content: <>
      <p>Use this website lawfully. Do not:</p>
      <ul>
        <li>Impersonate another person or access cards, terminals or records without authorization.</li>
        <li>Bypass security controls, misuse recovery links or interfere with the service.</li>
        <li>Send deceptive payment requests, unlawful content, unsolicited invitations or harmful software.</li>
        <li>Collect another person’s information without permission or expose private records through public links.</li>
        <li>Misrepresent a transaction’s status, the availability of funds or the approval of a financial product.</li>
      </ul>
    </>,
  },
  {
    id: "content", title: "Your content and external services", content: <>
      <p>You are responsible for material you send when contacting us, including descriptions, business names and messages, and for having permission to share it. We handle that material for the purposes described in our Privacy Policy.</p>
      <p>Website designs, text and branding remain the property of their respective owners. Access does not transfer ownership or authorize you to imply endorsement by Etail Depot, Ledgix, Trolleys or a card network.</p>
      <p>Product services, external websites and the apps you select for email, text or social sharing may have additional terms and privacy notices. Review them and the information you share before continuing. Using a separate product website does not change Etail Depot’s obligations under applicable law or the agreements it enters into with you.</p>
    </>,
  },
  {
    id: "access-changes", title: "Service changes and access", content: <>
      <p>Maintenance, connectivity issues or errors can interrupt access. For actions within a product, check its recorded status and follow its instructions before trying again.</p>
      <p>Access to this website may be restricted where reasonably necessary to address misuse, security risks or applicable legal requirements. Earlier website account tools are no longer available; retained records can be addressed through our compliance contact. Ending access does not automatically delete historical records. Product-specific terms govern access to each service.</p>
      <p>Product-specific agreements govern financial account closure, outstanding obligations and any return of funds. Changes to these website terms remain subject to applicable notice and acceptance requirements.</p>
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
  return <LegalDocument title="Terms of Use" description="Using the Etail Depot website and accessing our product services." updated="September 21, 2026" currentPage="terms" sections={sections} />;
}
