import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { pciAttestationArticle } from "./pci-attestation-content";

export function PciAttestationPage() {
  return <BlogArticlePage article={pciAttestationArticle}>
    <p>The launch meeting is nearly over. Someone asks whether the payment provider has supplied its PCI paperwork. There is a signed PDF in the project folder, so the item gets marked complete.</p>
    <p>One question is still missing: does that document cover the service and payment flow the business is actually going to use?</p>
    <p>A PCI Attestation of Compliance, usually called an AOC, records the outcome of a PCI Data Security Standard assessment using an official form. The assessed organization, services, scope and dates give that statement its meaning. It is useful evidence, but it is not a promise that an incident can never happen or that every system connected to the provider has been assessed.</p>
    <p>That distinction matters commercially. Discovering a gap before launch gives the business a chance to resolve it. Discovering it when a customer, acquirer or assessor asks for the evidence can turn a routine request into a search through contracts, old emails and a checkout nobody has fully mapped.</p>

    <section id="match-the-actual-checkout" aria-labelledby="match-the-actual-checkout-title">
      <h2 id="match-the-actual-checkout-title">One provider document, two different checkouts</h2>
      <p>Imagine a merchant using a provider’s hosted payment service. The provider supplies an AOC for that service. The merchant’s web team then proposes a separate custom form that receives payment details in the merchant’s application before forwarding them to the provider.</p>
      <p>The provider’s document has not changed. The merchant’s payment flow has. The hosted service may still be within the provider’s assessed scope, but that does not establish that the separate application was assessed. If that application also copies payment information into logs or support tools, those copies do not become covered merely because the final transaction reaches the same gateway.</p>
      <p>This is why the conversation should begin with what each system receives and does. Where does the customer enter payment information? Which systems can access it? What does the merchant retain? Who operates those systems? A simple explanation from the web team is more useful here than a collection of security logos.</p>
      <p>The PCI Security Standards Council expects a third-party provider’s evidence to address the services relevant to its customer and the applicable requirements. An AOC for another product or entity does not answer that question. Nor does a provider’s merchant-only SAQ A attestation establish compliance for the services it supplies to other merchants.</p>
      <p>There are three things worth reading before filing the document away:</p>
      <ul>
        <li><strong>The organization and service.</strong> Match the named entity and assessed service to the arrangement your business uses.</li>
        <li><strong>The scope and division of work.</strong> Establish what the assessment covers and which security responsibilities remain with your business or another supplier.</li>
        <li><strong>The assessment and dates.</strong> Identify the assessment behind the attestation, its reported outcome and whether the recipient accepts that evidence for the current arrangement.</li>
      </ul>
      <p>Dates deserve more than a glance at the signature. For an assessment documented in a Report on Compliance, or ROC, PCI SSC identifies the Date of Report as the completion date. A later signature acknowledges the report; it does not create a new assessment date. Questions about acceptable timing belong with the organization receiving the evidence.</p>
      <p>Also check what kind of document you received. PCI SSC recognizes its official reporting forms for validation. An unofficial compliance certificate or a badge in a sales presentation is not a substitute. Ask for the appropriate official evidence rather than trying to infer assurance from the artwork.</p>
    </section>

    <section id="make-the-handoff-clear" aria-labelledby="make-the-handoff-clear-title">
      <h2 id="make-the-handoff-clear-title">Give the paperwork an owner and a purpose</h2>
      <p>A provider’s validation and the merchant’s own validation are related, but separate. Outsourcing processing can reduce the requirements that apply directly to the merchant’s environment. It does not remove the duty to understand shared responsibilities and confirm that the outsourced service protects account data appropriately.</p>
      <p>For your own validation, do not choose a Self-Assessment Questionnaire, or SAQ, simply because it is short or another business uses it. The eligibility criteria depend on the actual environment. Confirm the required route with your acquirer or payment brand, involving a qualified assessor where needed. A different integration can change the answer even if sales volume stays the same.</p>
      <p>If a provider does not have an AOC because it has not undergone its own assessment, PCI SSC describes another evidence path: the provider must supply specific evidence for the relevant requirements so the customer or its assessor can evaluate them. That is additional assessment work, not permission to replace the missing document with a marketing certificate.</p>
      <p>For a Trolleys merchant, start with the account and connection you intend to use. Trolleys, an Etail Depot service, provides <Link href="/developers/getting-started" prefetch={false}>account and integration guidance</Link> to help your team identify the correct service and setup. When requesting security evidence, name that service and explain the payment flow so the request concerns the right scope.</p>
      <p>Our <Link href="/company/legal/security-policy" prefetch={false}>security policy</Link> preserves each party’s responsibilities for the systems it controls. Account approval or a working payment does not determine your PCI validation route. <Link href="/company/contact#payment-review" prefetch={false}>Ask our team about the relevant account documentation and support contact</Link>; confirm the required validation route with your acquirer or payment brand, with a qualified assessor’s help where needed.</p>
      <p>Keep the answer with the document: what service was reviewed, who checked it, what remains your responsibility and when it needs another review. PCI SSC calls for merchants to monitor their providers’ compliance status at least annually. Changes to your integration also deserve attention when they happen, rather than waiting for a calendar reminder.</p>
    </section>

    <p>The useful result is a clear explanation of your checkout and its responsibilities, supported by the right evidence. A PDF in a folder is only one part of that result. The next person responsible for the business should be able to understand what it covers without reopening the whole launch project.</p>
  </BlogArticlePage>;
}
