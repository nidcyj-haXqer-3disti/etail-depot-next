import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { arbitrationArticle } from "./arbitration-content";

export function ArbitrationPage() {
  return <BlogArticlePage article={arbitrationArticle}>
    <p>You fulfilled the order. You answered the dispute. The customer’s bank still disagrees. At that point, continuing can feel less like a business decision and more like refusing to let someone take advantage of you.</p>
    <p>That reaction is understandable. It is also an expensive basis for deciding what happens next.</p>
    <p>Chargeback arbitration is a card network’s process for deciding liability in an escalated payment dispute between network participants. A merchant normally works through its acquirer or payment provider. It is separate from taking a customer to court or invoking an arbitration clause in a sales contract.</p>
    <p>The question is not simply whether you believe the customer owes you. It is whether the available dispute process, the evidence already on record and the financial exposure justify going further.</p>

    <section id="know-the-next-decision" aria-labelledby="know-the-next-decision-title">
      <h2 id="know-the-next-decision-title">First, find out what you are being asked to decide</h2>
      <p>A notice mentioning pre-arbitration does not mean the card network has already ruled on the case. Nor does it mean every merchant has another appeal available.</p>
      <p>A response to the original chargeback, a later pre-arbitration exchange and a network arbitration decision are different events. The sequence depends on the card network and dispute condition. The issuer is the customer’s bank; the acquirer represents the merchant side of the card transaction. Which participant can take the next action depends on the applicable process.</p>
      <p>Ask your provider to explain the current case in plain language: what the other side is asserting, what response is available, what happens if you accept or reject it, and when your answer must arrive. Use the deadline in your case instructions. A general network timetable is not a substitute for the time your provider needs to receive and process your response.</p>
      <p>Availability matters as much as terminology. A network may provide an escalation route that your provider does not offer for your account or case. Visa directs merchants to their acquirer or processor for dispute rules and practices. Start there before spending another afternoon assembling a submission nobody can send.</p>
      <p>Also ask what the account balance is telling you. Some dispute flows return the money while the issuer is still reviewing the defense. A credit in your account can therefore precede final resolution. Confirm the case status before treating that money as permanently recovered.</p>
    </section>

    <section id="evidence-that-changes-the-case" aria-labelledby="evidence-that-changes-the-case-title">
      <h2 id="evidence-that-changes-the-case-title">A stronger case is not a larger attachment</h2>
      <p>Imagine a customer says an order never arrived. The merchant’s response contains the invoice, the payment receipt and several messages saying the order was dispatched. Those records may establish a purchase and shipment. They do not necessarily establish delivery.</p>
      <p>Now imagine the original response included a delivery record, but the case concerns a different address or a different shipment. The useful work is to resolve that mismatch. Sending the same documents again with a more forceful cover letter leaves the central question unanswered.</p>
      <p>Before approving escalation, ask which specific rule or fact supports your position. Then identify the record that proves it and check when it was submitted. This turns “we did nothing wrong” into an argument somebody else can assess.</p>
      <p><strong>Arbitration is not a fresh opportunity to rebuild a weak response from scratch.</strong></p>
      <p>Mastercard’s merchant guide restricts the use of information at arbitration that should have been supplied at an earlier required stage. Do not assume a newly found document will be considered. Have the provider confirm whether it is admissible in this case before treating it as the reason to continue.</p>
      <p>This is why the first response deserves care, even when the disputed amount seems modest. Keep the purchase, fulfillment records, customer correspondence and any refund linked to the same transaction. A clear <Link href="/company/blog/write-delivery-promise" prefetch={false}>delivery promise</Link> and a record of what actually happened are more useful than a long explanation written after the deadline.</p>
      <p>Sometimes the review reveals a genuine weakness in your own records. That is uncomfortable, but useful. Correcting it for the next hundred orders may be worth more than defending this one out of frustration.</p>
    </section>

    <section id="cost-of-continuing" aria-labelledby="cost-of-continuing-title">
      <h2 id="cost-of-continuing-title">Know what continuing could cost before saying yes</h2>
      <p>The disputed sale is only one part of the decision. Further action can bring network charges, provider fees and staff time. Some costs may depend on the outcome; others may remain payable even if you recover the payment. Your applicable terms determine the actual exposure.</p>
      <p>Ask for a written explanation of what is payable to proceed, what is payable if you lose and what is recoverable if you win. Keep fees already incurred separate from the additional cost of continuing. Money already spent does not make the next step more likely to succeed.</p>
      <p>You do not need a made-up success percentage to make that comparison. Start with what you know: the amount still at stake, the strength of the permitted evidence and the costs under each possible outcome. If the best outcome leaves little after fees and time, the commercial case needs to be especially convincing.</p>
      <p>For Trolleys merchants, our <Link href="/services/disputes" prefetch={false}>dispute management service</Link> focuses on the claim, response deadline, original payment and supporting records. Trolleys, an Etail Depot service, helps merchants follow cases and account adjustments. Escalation options and fees depend on your account terms and the applicable network process; support is not a promise of an arbitration route or a favorable ruling.</p>
      <p><Link href="/company/contact" prefetch={false}>Contact our team</Link> with the case reference, the latest notice and the evidence already submitted. Ask for the decision you need to make now, rather than simply requesting that the case be “fought harder.” Make clear who in your business can authorize additional charges.</p>
      <p>Once you decide, retain the approval, the submitted response and its confirmation. Match the eventual result to the payment and any fee or adjustment. Chargeback reporting distinguishes case identifiers, disputed amounts, fees and financial impact for a reason: a status label alone does not explain everything that happened to your money.</p>
    </section>

    <p>A justified escalation can protect revenue. Declining one can protect it too. The useful standard is whether the next action makes sense on the evidence and terms available, not how strongly you want the last decision to be wrong.</p>
  </BlogArticlePage>;
}
