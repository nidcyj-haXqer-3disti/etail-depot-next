import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { saleRecordsOffer } from "@/shared/product-facts";
import { legalIdentity } from "@/shared/legal-identity";
import { LegalDocument, type LegalSection } from "@/ui/legal-document";
import { LegalBrands, LegalContacts } from "@/ui/legal-identity";

export const metadata = legalPageMetadata("/privacy");

const sections: LegalSection[] = [
  {
    id: "scope", title: "Our company and services", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates under the names Ledgix for its credit card service and Trolleys for payment acceptance. Ledgix and Trolleys are trade names of the same company, not separate legal entities.</p>
      <LegalBrands />
      <h3>This website</h3>
      <p>This policy explains how we handle information when you browse this website or contact us. This website provides product information and links; it does not offer account registration, card management or payment processing.</p>
      <h3>Product privacy notices</h3>
      <p>Trolleys payment acceptance and the Ledgix credit card have separate product websites. For account records, cookies and information handling by Etail Depot and its service partners, review the privacy notices presented within that product when it is available. This website policy does not replace those notices or change our responsibilities for information we handle.</p>
      <p>Following a product link does not combine accounts or sign you in. Review the notices at your destination before providing personal or financial information.</p>
    </>,
  },
  {
    id: "information", title: "Information we handle", content: <>
      <p>The information we receive depends on how you use this website or contact us:</p>
      <ul>
        <li><strong>Contact information.</strong> Your email address, the service you ask about, messages and other information you choose to send us.</li>
        <li><strong>Technical information.</strong> Companies that help us deliver and protect this website may process IP addresses, browser details, request times and other connection information.</li>
        <li><strong>Earlier website records.</strong> If you previously used account features hosted on this website, related identity, access, activity and support records may remain in restricted storage. Those features are no longer available here.</li>
      </ul>
      <p>Opening a service link does not send records from earlier website accounts to the product you visit. Information you provide on a product’s website is handled under the notices presented there.</p>
      <p>Do not include passwords, complete card or bank account numbers, government identification or other sensitive information in a contact message.</p>
    </>,
  },
  {
    id: "use", title: "How we use information", content: <>
      <ul>
        <li>Provide and protect this website and investigate errors or misuse.</li>
        <li>Respond to inquiries about Ledgix, Trolleys and the company.</li>
        <li>Handle privacy, legal and support requests.</li>
        <li>Address questions about records retained from earlier website features.</li>
      </ul>
      <p>Account confirmation and recovery emails relate to the service that sent them. Using one service does not enroll you in another or authorize unrelated marketing.</p>
    </>,
  },
  {
    id: "sharing", title: "Who can see your information", content: <>
      <p><strong>Website services.</strong> Companies that help us host, deliver and protect this website may handle the technical information described above. This website does not provide customer accounts or sign-in. Ledgix and Trolleys product notices describe the service partners involved and how information is shared within each product.</p>
      <p><strong>Support.</strong> Authorized staff can review records within their assigned support responsibilities. Include only the information needed to explain your inquiry.</p>
      <p><strong>Information you share.</strong> Email links open your email application. The message and information you send are handled by your email service and the recipient. Product links open the relevant service website; they do not pass on your earlier account details or information added to this website’s address.</p>
      <p><strong>{saleRecordsOffer.brandName}.</strong> Trolleys’ optional service uses Order Insight to share supported merchant, transaction and order details with participating banks to help customers recognize purchases and prevent eligible Visa online fraud disputes. Review the Trolleys product notices and service terms for the information involved, access, sharing and applicable permissions. This website does not collect sale records or send example information to Order Insight or banks.</p>
      <p><strong>Legal and security matters.</strong> Information may need to be disclosed to comply with applicable law or valid legal process, or to investigate fraud, unauthorized access or threats to the service. Requests about these disclosures should be directed to our compliance contact.</p>
    </>,
  },
  {
    id: "cookies", title: "Cookies and website activity", content: <>
      <p>This website does not set sign-in or payment cookies. Its payment and {saleRecordsOffer.name} examples, fee calculator and wallet preview do not collect card details or store customer information. Example selections and calculator amounts stay in your browser and are not sent to us or saved by this website.</p>
      <p>The examples use sample information; they do not track delivery or purchase access, record customer acceptance, send documents or enroll you in a service.</p>
      <p>The companies supporting this website may process technical information for delivery, security and traffic measurement.</p>
      <p>Cookies from earlier website account features may remain in your browser until they expire or you clear them. The current website does not use or renew those account cookies. Clearing cookies does not delete retained records.</p>
      <p>The Ledgix and Trolleys product websites have their own cookie practices and controls.</p>
    </>,
  },
  {
    id: "choices", title: "Your choices and privacy requests", content: <>
      <p>For Ledgix or Trolleys account details, access settings and privacy choices, use the relevant product’s controls and notices. For records from earlier website features, contact our compliance team.</p>
      <p>For access, correction, deletion or other privacy requests, contact <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. Tell us whether your request concerns this website, Ledgix or Trolleys. You can also use this address if you cannot sign in.</p>
      <p>The rights available to you depend on applicable law. Identity verification and the authority to act for another person may be necessary before information can be released or changed. This policy does not limit rights you have under applicable law or promise deletion of records that must be retained.</p>
    </>,
  },
  {
    id: "security-retention", title: "Security and record retention", content: <>
      <p>We use hosting security controls and restrict access to retained information. Keep product passwords and confirmation or recovery links private. No website can guarantee complete security.</p>
      <p>Records from earlier website accounts are not automatically deleted when account access ends. Retained information is stored separately from this website and remains subject to access controls and applicable retention obligations. Product-specific notices describe how account records are retained.</p>
      <p>For information about a record’s retention or to request its deletion, contact our compliance team. Relevant considerations include the record type, account relationships, security needs, unresolved requests and applicable legal obligations. No single retention period applies to every record.</p>
    </>,
  },
  {
    id: "family-access", title: "Children’s information", content: <>
      <p>Do not submit a child’s personal information unless the relevant service expressly provides an eligible, authorized guardian process.</p>
      <p>If you believe a child’s information has been submitted without appropriate authorization, contact our compliance team and identify the service involved. Do not include sensitive documents in your initial email.</p>
    </>,
  },
  {
    id: "updates", title: "Changes to this policy", content: <>
      <p>The date shown on this page identifies the version you are reading. Changes to services or information practices may require updates to this policy or a product-specific notice. Applicable notice and consent requirements continue to apply to those changes.</p>
    </>,
  },
  { id: "contact", title: "Contact us", content: <LegalContacts /> },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" description="How we handle information when you browse this website or contact us." updated="October 19, 2026" currentPage="privacy" sections={sections} />;
}
