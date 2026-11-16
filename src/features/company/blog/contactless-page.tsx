import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { contactlessArticle } from "./contactless-content";

export function ContactlessPage() {
  return <BlogArticlePage article={contactlessArticle}>
    <p>A customer taps their card and starts putting it away. The reader has reacted, but the person behind the counter is still watching the screen. For a moment, neither knows whether the sale is finished. That small pause is where the promise of a quick checkout gets tested.</p>
    <p>Contactless payment makes presenting a card easier. A good checkout also makes the result clear. The customer should know when to hold still, when another action is needed and when they can leave with their purchase. Speed without that confidence can turn into a second tap and a worried question about being charged twice.</p>
    <p>The technology behind the tap is near-field communication, usually shortened to NFC. A compatible card, phone or wearable exchanges payment information with a nearby acceptance device. EMV contactless chip transactions generate a security code for each payment rather than relying only on fixed card information. The gesture is simple because the devices handle that exchange.</p>
    <p>This describes a tap at a reader. Selecting a wallet on a website is a different acceptance flow, even if the customer uses the same phone. Our article on <Link href="/company/blog/card-present-vs-card-not-present" prefetch={false}>card-present and online payments</Link> explains why location alone does not tell you which kind of payment took place.</p>

    <section id="clear-result" aria-labelledby="clear-result-title">
      <h2 id="clear-result-title">A quick checkout needs a clear ending</h2>
      <p>A request for a PIN or another action is not necessarily a failure. Verification depends on the card, device, market and terminal configuration. Adyen’s documentation distinguishes the amount above which verification is required from a reader limit that can require inserting a card. Those settings are different. A single advertised “contactless limit” cannot explain every card and wallet a customer might present.</p>
      <p>For staff, the useful habit is to follow the payment application’s instructions and explain the next action calmly. An extra prompt should not become an improvised workaround. If the reader asks for a supported verification step, give the customer time to complete it. If the method cannot be used, follow the provider’s alternative payment procedure.</p>
      <p>A missing result is a different problem. The reader may have responded while the sales application lost the message containing the outcome. That does not establish that the card was declined. Nor does a sound or animation, considered on its own, give staff enough information to decide what to do next.</p>
      <p>Adyen documents this situation directly: an integration should request the status of the original transaction when a communication problem leaves the result unknown. Its status response distinguishes a completed attempt from one still in progress or one not found. Even “processed” requires reading the original response to learn whether the payment was approved, canceled or declined.</p>
      <p>The merchant does not need to memorize that API. The checkout provider should supply a way to resolve the original attempt, and staff should know where to find it. Use that process before collecting another payment. An uncertain outcome and a confirmed decline need different responses; our <Link href="/company/blog/card-authorization" prefetch={false}>payment authorization article</Link> explains the distinction.</p>
      <p>There is a customer service decision here as well. “I’m checking the payment you just made” is more helpful than asking somebody to keep tapping while the line grows. Preserve the order and its payment reference, explain what is being checked and avoid making the customer diagnose the connection. The recovery should belong to the business.</p>
    </section>

    <section id="comfortable-counter" aria-labelledby="comfortable-counter-title">
      <h2 id="comfortable-counter-title">The counter is part of the payment experience</h2>
      <p>A reader can support contactless payments and still be awkward to use. It may face the employee, sit beyond comfortable reach or leave the customer guessing where to hold a watch. These are checkout design problems worth noticing before buying a faster device.</p>
      <p>Try the interaction from the customer’s side. Make the amount and instructions readable, keep the tapping area visible and allow room to bring a card or device close. Give people enough time to respond to the screen. A checkout that is quick for one person should still be comfortable for somebody who needs a little longer.</p>
      <p>Phone-based acceptance needs the same attention. Apple’s Tap to Pay on iPhone requires a supported payment app; having a phone that can use a wallet does not by itself set up merchant acceptance. Its merchant instructions show where customers should hold cards and devices. Confirm that your provider supports the particular setup and payment methods before treating a phone as a replacement for the counter reader.</p>
      <p>Apple also documents accessibility options for PIN entry, including guided ways to enter a PIN on the screen. Staff should know how to offer the supported assistance while letting the customer enter their own PIN privately. Knowing that the feature exists is different from discovering how to use it while a customer waits.</p>
      <p>The same principle applies to the receipt and the final confirmation. Close the interaction clearly. A customer should not have to turn back from the door to ask whether the payment worked, and the employee should not have to guess from a fleeting animation.</p>
      <p>The useful measure of a contactless checkout is more than how quickly it reads a card. Notice how often customers have to ask what to do, how staff handle an unclear result and whether the payment can be found afterward. The best improvement may be a clearer screen, a better reader position or a confident explanation. The tap can stay brief because the business has thought about everything around it.</p>
    </section>
  </BlogArticlePage>;
}
