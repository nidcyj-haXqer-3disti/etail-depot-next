import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import Link from "next/link";
import { legalIdentity } from "@/shared/legal-identity";
import { LegalDocument, type LegalSection } from "@/ui/legal-document";
import { LegalContacts } from "@/ui/legal-identity";

export const metadata = legalPageMetadata("/privacy");

const sections: LegalSection[] = [
  {
    id: "scope", title: "Our company and services", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates etaildepot.com. This policy explains how we handle information about visitors and people who contact us.</p>
      <h3>This website</h3>
      <p>This policy covers information handled when you browse this website or contact Etail Depot about merchant services, card services or a software partnership. The website provides service information, Guides, payment standards references, documentation and interactive tools. Account registration, card management and payment processing take place through the relevant product service.</p>
      <h3>Privacy for your account</h3>
      <p>Merchant applications, identity verification, payment transactions and card account records are outside the scope of this website policy. Request the privacy notice for the relevant service before providing personal or financial information. See our <Link href="/legal/merchant-privacy">Merchant privacy notice</Link> for information handled in that service. This website policy does not replace a service privacy notice or change our responsibilities for information we handle.</p>
    </>,
  },
  {
    id: "information", title: "Information we handle", content: <>
      <p>The information we receive depends on how you use this website or contact us:</p>
      <ul>
        <li><strong>Contact information.</strong> When you email, call or write to us, this may include your contact details, business information, the service you ask about and the information you choose to provide.</li>
        <li><strong>Technical information.</strong> Companies that help us deliver and protect this website may process requested page addresses, IP addresses, browser details, request times, response information and other connection information.</li>
        <li><strong>Previous accounts on this website.</strong> If you previously held an account directly on this website, we may still retain related identity, access, activity and support records with restricted access. Those account services are no longer available here.</li>
      </ul>
      <p>Do not include passwords, complete card or bank account numbers, government identification or other sensitive information in a contact message.</p>
    </>,
  },
  {
    id: "use", title: "How we use information", content: <>
      <ul>
        <li>Provide and protect this website and investigate errors or misuse.</li>
        <li>Respond to merchant service, card service, software partnership and company inquiries.</li>
        <li>Handle privacy, legal and support requests.</li>
        <li>Answer questions about records retained from previous accounts on this website.</li>
      </ul>
      <p>Account confirmation and recovery emails relate to the service that sent them. Using one service does not enroll you in another or authorize unrelated marketing.</p>
    </>,
  },
  {
    id: "sharing", title: "Who can see your information", content: <>
      <p><strong>Website services.</strong> Companies that help us host, deliver and protect this website may handle the technical information described above. Account access takes place on separate service websites. For information about sharing within a merchant or card account, request the privacy notice for that service.</p>
      <p><strong>Support.</strong> Our team can access the information needed to answer your inquiry and handle your request.</p>
      <p><strong>Information you share.</strong> Email links open your email application. The message and information you send are handled by your email service and the recipient. Account service links open a separate website without forwarding your previous account details or information included in this website’s page address. Links to standards sources and other technical references also take you to external websites, whose notices apply when you visit them.</p>
      <p><strong>Legal and security matters.</strong> Information may need to be disclosed to comply with applicable law or valid legal process, or to investigate fraud, unauthorized access or threats to the service. Requests about these disclosures should be directed to our compliance contact.</p>
    </>,
  },
  {
    id: "cookies", title: "Cookies and website activity", content: <>
      <p>This website does not set login or payment cookies. The fee calculator, payment walkthrough and wallet guide run in your browser. Calculator amounts and walkthrough selections are not sent to us or saved by this website. The checkout artwork does not collect card or bank account details.</p>
      <p>Pages you visit, including a code reference or section within a page, may appear in the page address and your browser history.</p>
      <p>This website does not include advertising pixels or session replay scripts. Hosting and security services may process technical information for delivery, protection and traffic measurement, including requests for pages and files. That processing is separate from the information you enter into the fee calculator.</p>
      <p>Cookies from previous accounts on this website may remain in your browser until they expire or you clear them. This website no longer uses or renews those account cookies. Clearing cookies does not delete retained account records.</p>
      <p>Separate account service websites have their own cookie practices and controls.</p>
    </>,
  },
  {
    id: "choices", title: "Your choices and privacy requests", content: <>
      <p>For information about an existing account, read the privacy notice for that service or contact our compliance team. We also handle questions about this website and records retained from previous website accounts.</p>
      <p>For access, correction, deletion or other privacy requests, contact <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a>. Tell us whether your request concerns this website, a merchant account or a card account. You can also use this address if you cannot sign in.</p>
      <p>Depending on applicable law, you may request confirmation, access, a portable copy, correction, deletion or limits on sensitive information use. Rights concerning sale, advertising or profiling apply where the relevant law and activity apply. You may withdraw consent where we rely on it, without affecting earlier lawful processing.</p>
      <p>An authorized agent may act where permitted. We may verify identity and authority using information reasonably necessary for the request. We will arrange a secure channel if documents are needed. Do not send sensitive documents in your initial email.</p>
      <p>We will respond within the applicable legal period and explain any permitted extension or refusal. To seek a review or an available appeal, email our compliance team with the subject Privacy appeal and your original request reference. We will explain the outcome and any available external complaint route. We will not unlawfully discriminate against you for exercising privacy rights.</p>
      <p>We may need to retain some records to meet legal obligations after a request. This policy does not remove privacy rights or remedies that cannot lawfully be waived.</p>
    </>,
  },
  {
    id: "security-retention", title: "Security and record retention", content: <>
      <p>We use hosting security controls and restrict access to retained information. Keep product passwords and confirmation or recovery links private. No website can guarantee complete security.</p>
      <p>Records from previous accounts on this website are not automatically deleted when account access ends. Retained information is stored separately from this website and remains subject to access controls and applicable retention obligations. For retention information about a merchant or card account, request the notice for that service.</p>
      <p>For information about a record’s retention or to request its deletion, contact our compliance team. Relevant considerations include the record type, account relationships, security needs, unresolved requests and applicable legal obligations. No single retention period applies to every record.</p>
    </>,
  },
  {
    id: "family-access", title: "Children’s information", content: <>
      <p>This website provides business and service information. Do not send children’s personal information through its contact channels.</p>
      <p>If you believe a child’s information has been submitted without appropriate authorization, contact our compliance team and identify the service involved. Do not include sensitive documents in your initial email.</p>
    </>,
  },
  {
    id: "updates", title: "Changes to this policy", content: <>
      <p>We will update this policy when our services or information practices change. The latest revision date appears at the top of this page. We will provide notice and obtain consent where applicable law requires.</p>
    </>,
  },
  { id: "contact", title: "Contact us", content: <LegalContacts /> },
];

export default function PrivacyPage() {
  return <LegalDocument title="Website Privacy Policy" description="How we handle information when you browse this website or contact us." updated="November 4, 2026" sections={sections} />;
}
