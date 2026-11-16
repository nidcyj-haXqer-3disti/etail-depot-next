import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentSecurityArticle } from "./payment-security-content";

export function PaymentSecurityPage() {
  return <BlogArticlePage article={paymentSecurityArticle}>
    <p>Imagine a message arriving just before the end of the day. It appears to come from the business owner: the company has changed banks, and future merchant deposits need to go to a new account. A colleague has access to the portal and wants to get it done.</p>
    <p>The connection may be encrypted. The login may work. Neither fact, by itself, establishes that the owner sent the request or authorized the change.</p>
    <p>This is a useful place to begin a conversation about digital payment security. Protecting card details matters. So does controlling the instructions that affect your account after the customer has paid. A reassuring badge on a checkout page cannot answer both questions.</p>

    <section id="follow-the-sensitive-change" aria-labelledby="follow-the-sensitive-change-title">
      <h2 id="follow-the-sensitive-change-title">Follow the request past the login</h2>
      <p>Ask a prospective provider to explain how a bank destination change works for the service you would actually use. Who can request it? What establishes that person’s authority? How is the request verified, and which records show what was approved?</p>
      <p>Use a demonstration with fictional records. The review should not change a live bank destination or move money. The aim is to understand the process, including the point where an unsupported instruction would be stopped.</p>
      <blockquote><p>Show me what happens when the person requesting the change is not allowed to make it.</p></blockquote>
      <p>That question tests more than whether a button exists. Can someone who only needs reports also alter account settings? If a second approval is required, can the approver see what changed? If verification happens through support, what prevents a convincing email from substituting for the approved process?</p>
      <p>These are questions to investigate, not features to assume every provider offers. A service may use a controlled support procedure rather than a self-service setting. What matters is that the actual route, authority checks and responsibilities are clear enough for your staff to follow.</p>
      <p>In the hypothetical request, replying to the same message is weak verification. An attacker who controls the conversation can answer it. Confirm a payment instruction change through an independently trusted channel, using contact details already known to be valid rather than a new number supplied in the request.</p>
      <p>The review should also cover the people who no longer work for you. Ask how their access is removed and how connected software permissions are reviewed. A shared login makes it harder to distinguish individual actions. Removing one employee from a mailing list is not the same as removing account access.</p>
      <p>Then bring the question back inside your own business. Who is allowed to ask for the change? Who verifies it? Who notices an unexpected confirmation? A provider’s process cannot compensate for a team that treats every urgent instruction as already approved.</p>
    </section>

    <section id="ask-for-evidence-you-can-use" aria-labelledby="ask-for-evidence-you-can-use-title">
      <h2 id="ask-for-evidence-you-can-use-title">Ask for evidence you can use after the sales call</h2>
      <p>A demonstration makes the process easier to understand. Written responsibilities make it possible to rely on the same understanding later. The FTC recommends evaluating service providers, putting security expectations into contracts and checking that the commitments are followed.</p>
      <p>Keep the request specific. A description of the relevant access roles, the approved procedure for sensitive changes and the available account records is more useful than a collection of claims about how seriously a company takes security. Ask which responsibilities belong to the provider, your business and any software company connecting the two.</p>
      <p>For payment data, confirm where customers enter card details, which systems receive them and what your own website or staff can access. An assurance about one hosted product does not automatically describe a different integration. Your payment setup should match the service covered by the evidence.</p>
      <p>PCI documentation needs that same attention. A service provider’s Attestation of Compliance should be relevant to the services you rely on and the applicable requirements. Where a provider does not have its own assessment, PCI SSC describes an expectation for specific supporting evidence. A decorative certificate is not a substitute for the official validation documents. Our article on <Link href="/company/blog/how-pci-attestation-of-compliance-works" prefetch={false}>reading an Attestation of Compliance</Link> explains what to look for.</p>
      <p>Do not expect that document to settle every account-control question. You still need to understand the bank-change procedure, staff permissions and your own operating duties. Nor does using a payment provider remove your merchant responsibilities under PCI DSS.</p>
      <p>Ask how an unexpected change would be handled. Which contact should staff use? What can be restricted or paused, by whom, and at what stage? Which records are available to investigate? If funds have already moved, what action can be requested and what remains uncertain? Establish the route before an incident, without treating a support promise as a guarantee of recovery.</p>
      <p>If you suspect a fraudulent transfer, contact the relevant financial institution or payment provider immediately through a trusted channel. Preserve the messages and account references. Prompt reporting matters; it does not ensure the money can be recovered.</p>
    </section>

    <p>For a Trolleys merchant, bank changes and sensitive documents belong in the secure account service. Keep access limited to authorized people and report suspected unauthorized access promptly. Trolleys, an Etail Depot service, provides <Link href="/company/security" prefetch={false}>security and service responsibility information</Link>, with account-specific documentation available to review. A valid credential alone does not establish that every instruction was authorized.</p>
    <p><Link href="/company/contact#payment-review" prefetch={false}>Contact merchant support</Link> about account access or a payment concern. Direct questions about security documentation, privacy and responsibilities to our <Link href="/company/contact#compliance" prefetch={false}>compliance team</Link>. Use the requested secure channel for sensitive records, and confirm which controls apply to your account rather than assuming a demonstration describes every service.</p>
    <p>If an essential control is missing or still unexplained, treat that as an unresolved decision before relying on the service. Where your team must supply a verification step, give someone responsibility for it and check that staff can actually carry it out.</p>
    <p>A good security conversation ends with a process your business understands: who can act, what must be verified and where to turn when something is wrong. That is more valuable than another badge nobody can explain.</p>
  </BlogArticlePage>;
}
