import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { saleRecordsOffer } from "@/shared/product-facts";
import { legalIdentity } from "@/shared/legal-identity";
import { LegalDocument, type LegalSection } from "@/ui/legal-document";
import { LegalBrands, LegalContacts } from "@/ui/legal-identity";

export const metadata = legalPageMetadata("/privacy");

const sections: LegalSection[] = [
  {
    id: "scope", title: "Our company and services", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates merchant services under the name Trolleys and card services under the name Ledgix. Ledgix and Trolleys are trade names of the same company, not separate legal entities.</p>
      <LegalBrands />
      <h3>This website</h3>
      <p>This policy covers information handled when you browse this website or contact Etail Depot about merchant services, card services or a software partnership. The website provides service information, Guides, payment standards references, documentation and interactive tools. Account registration, card management and payment processing take place through the relevant product service.</p>
      <h3>Product privacy notices</h3>
      <p>Trolleys merchant services and the Ledgix credit card have separate product websites. For account records, cookies and information handled by Etail Depot and its service partners, review the privacy notices presented within the relevant product. Those notices explain its information practices. This website policy does not replace them or change our responsibilities for information we handle.</p>
      <p>Following a product link does not combine accounts or sign you in. Review the notices at your destination before providing personal or financial information.</p>
    </>,
  },
  {
    id: "information", title: "Information we handle", content: <>
      <p>The information we receive depends on how you use this website or contact us:</p>
      <ul>
        <li><strong>Contact information.</strong> When you email, call or write to us, this may include your contact details, business information, the service you ask about and the information you choose to provide.</li>
        <li><strong>Technical information.</strong> Companies that help us deliver and protect this website may process requested page addresses, IP addresses, browser details, request times, response information and other connection information.</li>
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
        <li>Respond to merchant service, card service, software partnership and company inquiries.</li>
        <li>Handle privacy, legal and support requests.</li>
        <li>Address questions about records retained from earlier website features.</li>
      </ul>
      <p>Account confirmation and recovery emails relate to the service that sent them. Using one service does not enroll you in another or authorize unrelated marketing.</p>
    </>,
  },
  {
    id: "sharing", title: "Who can see your information", content: <>
      <p><strong>Website services.</strong> Companies that help us host, deliver and protect this website may handle the technical information described above. This website does not provide customer accounts or login. Ledgix and Trolleys product notices describe the service partners involved and how information is shared within each product.</p>
      <p><strong>Support.</strong> Authorized staff can review records within their assigned support responsibilities. Include only the information needed to explain your inquiry.</p>
      <p><strong>Information you share.</strong> Email links open your email application. The message and information you send are handled by your email service and the recipient. Product links open the relevant service website; they do not pass on your earlier account details or information added to this website’s address. Links to standards sources and other technical references also take you to external websites, whose notices apply when you visit them.</p>
      <p><strong>{saleRecordsOffer.brandName}.</strong> Trolleys’ optional service uses Order Insight to share supported merchant, transaction and order details with participating banks to help customers recognize purchases and prevent eligible Visa online fraud disputes. Review the Trolleys product notices and service terms for the information involved, access, sharing and applicable permissions. This website does not collect sale records or send information to Order Insight or banks.</p>
      <p><strong>Legal and security matters.</strong> Information may need to be disclosed to comply with applicable law or valid legal process, or to investigate fraud, unauthorized access or threats to the service. Requests about these disclosures should be directed to our compliance contact.</p>
    </>,
  },
  {
    id: "cookies", title: "Cookies and website activity", content: <>
      <p>This website does not set login or payment cookies. The fee calculator, payment walkthrough and wallet guide run in your browser. Calculator amounts and walkthrough selections are not sent to us or saved by this website. The checkout artwork does not collect card or bank account details.</p>
      <p>Pages you visit, including a code reference or section within a page, may appear in the page address and your browser history. Selecting a reference or section does not create an account or enroll you in a service.</p>
      <p>The public pages do not include advertising pixels or session replay scripts. Hosting and security services may process technical information for delivery, protection and traffic measurement, including requests for pages and files. That processing is separate from the information you enter into the fee calculator.</p>
      <p>Cookies from earlier website account features may remain in your browser until they expire or you clear them. The current website does not use or renew those account cookies. Clearing cookies does not delete retained records.</p>
      <p>The Ledgix and Trolleys product websites have their own cookie practices and controls.</p>
    </>,
  },
  {
    id: "choices", title: "Your choices and privacy requests", content: <>
      <p>For an existing product account, use its privacy controls and notices. You can also contact our compliance team about this website, a product or records from earlier website features.</p>
      <p>For access, correction, deletion or other privacy requests, contact <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. Tell us whether your request concerns this website, Ledgix or Trolleys. You can also use this address if you cannot sign in.</p>
      <p>The rights available to you depend on applicable law. Identity verification and the authority to act for another person may be necessary before information can be released or changed. This policy does not limit rights you have under applicable law or promise deletion of records that must be retained.</p>
    </>,
  },
  {
    id: "security-retention", title: "Security and record retention", content: <>
      <p>We use hosting security controls and restrict access to retained information. Keep product passwords and confirmation or recovery links private. No website can guarantee complete security.</p>
      <p>Records from earlier website accounts are not automatically deleted when account access ends. Retained information is stored separately from this website and remains subject to access controls and applicable retention obligations. Each product’s notices describe how account records are retained.</p>
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
      <p>The date shown on this page identifies the version you are reading. Changes to services or information practices may require updates to this policy or a notice for a product. Applicable notice and consent requirements continue to apply to those changes.</p>
    </>,
  },
  { id: "contact", title: "Contact us", content: <LegalContacts /> },
];

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" description="How we handle information when you browse this website or contact us." updated="October 27, 2026" currentPage="privacy" sections={sections} />;
}
