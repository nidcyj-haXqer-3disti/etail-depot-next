import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { offlinePaymentsArticle } from "./offline-payments-content";

export function OfflinePaymentsPage() {
  return <BlogArticlePage article={offlinePaymentsArticle}>
    <p>When the internet goes down during a busy trading day, an offline payment option can feel like a rescue. The reader still takes the card. The customer gets their purchase. The queue starts moving again.</p>
    <p>With a store-and-forward payment, an important part of the sale is still unfinished. The supported system stores the transaction and sends it for processing when the connection returns. The card issuer may then decline it. By that point, the goods or service may already be in the customer’s hands.</p>
    <p>Offline processing is not one uniform technology. Adyen distinguishes store and forward from offline EMV, where the chip participates in approving the payment under its issuer’s configuration. This article concerns store and forward. It is also different from an <Link href="/company/blog/card-authorization" prefetch={false}>authorized payment</Link> waiting for a later payout.</p>
    <p>Square’s US guidance puts responsibility for expired, declined or disputed offline payments on the seller. That makes enabling the feature a business decision as well as a device setting. The useful question is how much you are prepared to release before you know whether the money can be collected.</p>

    <section id="the-unpaid-queue" aria-labelledby="the-unpaid-queue-title">
      <h2 id="the-unpaid-queue-title">The queue matters more than the next sale</h2>
      <p>A small purchase can seem harmless on its own. A succession of small purchases creates a different exposure. If staff judge only the person standing in front of them, nobody may be watching the total value already handed over against payments that have not yet been processed.</p>
      <p><strong>A limit on one transaction is not a limit on the whole outage.</strong> The same applies across several readers. Each device might remain within its permitted settings while the business’s combined pending amount keeps growing.</p>
      <p>Adyen’s configuration documentation separates the maximum store-and-forward transaction amount from the maximum number of such transactions a terminal accepts offline. Those controls answer different questions. Use the controls your provider supports, then decide how the business will monitor the combined exposure across the devices in use.</p>
      <p>The provider’s maximum is not a recommendation for how much your business should risk. Consider what has already left the premises, whether delivery could wait and what an uncollected sale would mean after stock and labor have been paid for. Someone needs authority to stop offline acceptance before the terminal reaches its own limit.</p>
      <p>That decision is easier before the outage. Staff should know when to pause, whether goods can be reserved and which alternative payment route is actually available. A cellular connection that restores normal processing is a different option from storing more transactions offline. Confirm the supported connection before relying on it during a busy shift.</p>
      <p>Check the exact acceptance setup too. Square’s documented offline mode excludes Tap to Pay on iPhone and Android and manually entered card numbers. Its hardware support should not be read as support for every product bearing the same provider name. The phone or reader your team plans to use needs its own confirmation.</p>
      <p>The timing rules need equal care. Square distinguishes limits on taking offline payments from deadlines for uploading them, with hardware-specific instructions. Write down the applicable clocks and who will reconnect the device. “We will sort it out at closing” is not a recovery plan if nobody has checked when the pending payments expire.</p>
    </section>

    <section id="protect-and-resolve" aria-labelledby="protect-and-resolve-title">
      <h2 id="protect-and-resolve-title">Getting back online is only half the recovery</h2>
      <p>While the payments are still stored locally, a familiar troubleshooting habit can make the situation worse. Square warns that signing out, deleting its POS app, switching modes or locations, or factory resetting equipment can permanently lose pending offline payments. Its instructions allow a normal restart or power off, provided the device returns in time to upload. Follow the recovery rules for the actual system rather than treating every reset as equivalent.</p>
      <p>The practical lesson is to protect the pending records while restoring the connection. Staff should know where the provider shows them and which support route to use before changing the setup. Trying to make the screen look normal again is not the same as preserving the payments.</p>
      <p>After reconnection, review the results against the orders fulfilled during the outage. Square distinguishes pending offline payments from completed and declined outcomes, and explains where those states appear in its app and dashboard. A device being online again does not tell you that every customer’s payment succeeded.</p>
      <p>Give the remaining cases a clear owner. An unresolved result needs investigation; a confirmed decline needs a decision about follow-up. Do not create another charge merely because the original one is hard to find. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> explains why the response and the provider’s instructions matter before another attempt.</p>
      <p>Keep the outcome attached to the original order. A failed payment does not erase the fact that an item was supplied or a service completed. It changes what the business collected and what remains to be resolved. Clear records let the next person handle that conversation without asking the customer or cashier to reconstruct the outage.</p>
      <p>Offline acceptance can be a sensible way to keep trading. Its value comes from preserving sales the business is willing and able to carry through uncertainty. Choose that exposure deliberately, protect the stored payments and finish the review after the connection returns. The outage is over when the business knows what happened to its sales, not merely when the Wi-Fi symbol comes back.</p>
    </section>
  </BlogArticlePage>;
}
