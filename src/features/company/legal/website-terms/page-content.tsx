import Link from "next/link";
import { legalIdentity } from "@/shared/site/legal-identity";
import { LegalDocument, type LegalSection } from "@/features/company/legal/components/legal-document";

const sections: LegalSection[] = [
  {
    id: "scope", title: "About these terms", content: <>
      <p>Etail Depot US, Inc. (“Etail Depot”, “we” or “us”) operates this website. These terms cover your use of its pages, Guides, documentation and interactive tools. References to “you” include a business you are authorized to represent.</p>
      <p>Our <Link href="/privacy">Website Privacy Policy</Link> explains how we handle information when you browse or contact us. Service agreements and policies are listed in <Link href="/legal">Legal</Link>.</p>
    </>,
  },
  {
    id: "acceptable-use", title: "Using this website", content: <>
      <p>Use this website lawfully. Do not:</p>
      <ul>
        <li>Impersonate another person or send false or misleading information.</li>
        <li>Attempt unauthorized access, bypass security controls or interfere with the website.</li>
        <li>Send unlawful content, unsolicited messages or harmful software.</li>
        <li>Collect or disclose another person’s information without authorization.</li>
      </ul>
      <p>You are responsible for the material you send us and for having permission to share it.</p>
    </>,
  },
  {
    id: "content", title: "Content and interactive tools", content: <>
      <p>Guides and documentation provide general information. They are not advice about your particular legal, tax or financial circumstances. Describing a standard or function does not mean it is available for your account. Follow the instructions and permissions that apply to your service.</p>
      <p>Website designs, text and branding belong to their respective owners. Access does not transfer ownership or authorize you to imply endorsement by Etail Depot, its service brands or a card network.</p>
      <h3>Diagrams and estimates</h3>
      <p>Onboarding, checkout and payout diagrams explain service workflows. Their amounts and statuses are not account activity. Using these tools does not submit an application, process a payment, issue a refund or transfer funds.</p>
      <p>The merchant service fee calculator estimates the displayed card processing fee for one domestic online card payment. It excludes optional services, other charges and adjustments, and does not calculate ACH fees. “After card processing” is the payment amount less the displayed card processing fee. It is not a guaranteed bank deposit or a prediction of when funds will arrive.</p>
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
    id: "payments", title: "External websites and service agreements", content: <>
      <span id="availability" />
      <p id="login">Account access and applications take place through separate service websites. Request the account agreement and privacy notice for the service you use. Following a link does not open an account, transfer an existing account or guarantee approval.</p>
      <p id="dispute-prevention">Merchant services are subject to the agreement and fee schedule accepted for your account. See <Link href="/legal/merchant-services">Merchant Services Terms</Link> and the schedules identified for your account. These website terms do not set account fees, settlement arrangements or refund and dispute procedures.</p>
      <p id="cards">Card eligibility, fees, repayment and deposit arrangements belong to the card agreement and <Link href="/credit-card-services#card-details">card service disclosures</Link>. These website terms do not create a credit facility, deposit account or deposit insurance coverage. Etail Depot is not a bank.</p>
    </>,
  },
  {
    id: "access-changes", title: "Website access and changes", content: <>
      <p>Maintenance, connectivity issues or errors may interrupt access. We may restrict access where reasonably necessary to address misuse, security risks or legal requirements.</p>
      <p>We may update these website terms, subject to applicable notice and acceptance requirements. The latest revision date appears at the top of this page.</p>
      <p>You may save or print a copy of these terms and the linked legal documents. Contact our compliance team if you need an accessible copy or cannot read a document. Updating these website terms does not change your accepted merchant agreement.</p>
    </>,
  },
  {
    id: "rights", title: "Your legal rights", content: <>
      <p>These terms do not remove rights or remedies that cannot lawfully be waived, or change our obligations under applicable law or a separate agreement with you.</p>
      <p>Viewing this website does not make you a party to the Merchant Services Terms or Software platform terms. Their business arbitration, liability and fee provisions apply only through the acceptance required for that service.</p>
    </>,
  },
  {
    id: "contact", title: "Contact us", content: <>
      <p>For questions or legal notices about this website, contact <a href={`mailto:${legalIdentity.complianceEmail}`}>{legalIdentity.complianceEmail}</a> or write to:</p>
      <address className="legal-registered-address"><strong>{legalIdentity.company}</strong>{legalIdentity.offices[0].address.map(line => <span key={line}>{line}</span>)}</address>
    </>,
  },
];

export default function TermsPage() {
  return <LegalDocument title="Website Terms of Use" description="Terms for using etaildepot.com, its content and interactive tools." updated="November 4, 2026" sections={sections} />;
}
