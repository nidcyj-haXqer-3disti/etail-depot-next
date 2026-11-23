import { BlogArticlePage } from "./article-page";
import { telephoneChannelArticle } from "./telephone-channel-content";

export function TelephoneChannelPage() {
  return <BlogArticlePage article={telephoneChannelArticle}>
    <p>A customer cannot finish the online order and calls for help. The employee offers to take the card number over the phone.</p>
    <p>It feels like good service. It may also put payment details into a recorded call, a handwritten note or a customer-service ticket that the online checkout never touched.</p>
    <p>The decision point comes before the customer starts reading out the number. Until then, the employee is helping with a purchase. Once the employee collects the details, the business has introduced a different path for payment information, whether or not it planned to offer telephone orders.</p>

    <section id="conversation-or-collection" aria-labelledby="conversation-or-collection-title">
      <h2 id="conversation-or-collection-title">Helping the customer buy is different from collecting their card details.</h2>
    <p>A staff member can explain the product while the customer enters payment information into the approved customer checkout. Alternatively, the business may want staff to receive card details and submit the payment through an approved telephone-order process. These are different workflows with different access and data-handling questions.</p>
    <p>Do not use an employee’s browser session in the ordinary online checkout as an improvised substitute for an approved manual-entry method. Ask Trolleys which channels and tools are supported for the account, what must be enabled and which staff can use them.</p>
    <p>If a hosted payment option is offered for the account, confirm its actual setup and permissions. Sending a customer somewhere to pay does not require the employee to copy their card details into a message first.</p>
    </section>

    <section id="recording" aria-labelledby="recording-title">
      <h2 id="recording-title">Consider everything that listens to the call.</h2>
    <p>A business may record calls for quality checks, generate transcripts, capture support screens or summarize conversations automatically. The employee’s intent does not determine what those systems retain. Map them before introducing card collection: a number spoken once can otherwise end up in several places that staff do not think of as payment storage. Deleting a handwritten note would not address a separate recording or transcript.</p>
    <p>PCI Security Standards Council guidance prohibits retaining card security codes after authorization, including in digital audio recordings, even if encrypted. Its guidance says recording should be prevented where possible. The right telephone-payment controls need to be designed for the actual environment; a staff reminder to be careful is not a complete solution.</p>
    <p>Use the provider’s approved process and confirm the applicable security assessment with the responsible payment or PCI adviser. Do not put complete card details or security codes in order notes, email or support tickets. Keep the business record useful through order and transaction references instead.</p>
    </section>

    <section id="customer-record" aria-labelledby="customer-record-title">
      <h2 id="customer-record-title">The caller still needs a clear purchase record.</h2>
    <p>Explain the seller, purchase, total, delivery and cancellation or refund terms before completing the approved payment process. Give the customer a receipt through the permitted channel and make the order findable by support.</p>
    <p>Train staff on uncertain outcomes. If a request times out, check the transaction through the approved recovery procedure before trying again. A caller asking whether the payment worked should not become the reason the same sale is submitted twice.</p>
    <p>Give staff a usable answer for the moment the caller offers card details, including what to do when the approved route is unavailable. Otherwise the pressure to finish the sale invites improvisation at precisely the point where the payment path needs to be clear. Good telephone service lets an employee help without having to design the process during the call.</p>
    </section>
  </BlogArticlePage>;
}
