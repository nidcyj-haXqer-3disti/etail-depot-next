import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { tapToPayArticle } from "./tap-to-pay-content";

export function TapToPayPage() {
  return <BlogArticlePage article={tapToPayArticle}>
    <p>The appeal is easy to understand. You have the customer, the sale and a phone in your hand. Taking the payment there could save a walk to the counter or a search for a separate reader.</p>
    <p>Tap to Pay makes that possible on supported phones through a compatible payment app. A customer holds a contactless card or digital wallet near your phone, which acts as the reader. Having Apple Pay or another wallet on your own phone is different: that lets you spend money. Accepting a customer’s payment requires a merchant setup.</p>
    <p>For a business owner, the interesting question is how comfortably this fits into a normal working day. A phone is familiar to you. The payment experience still needs to be clear to the person standing opposite.</p>

    <section id="choose-the-payment-app" aria-labelledby="choose-the-payment-app-title">
      <h2 id="choose-the-payment-app-title">Start with the payment app</h2>
      <p>The app connects the phone’s payment capability to the provider that processes your sales. Apple directs merchants to a supported payment app, where they accept the relevant terms and set up the device. Check the provider’s merchant account requirements before relying on it for a day of trading.</p>
      <p>You do not need to commission an app simply to use an existing supported service. Building Tap to Pay into your own software is a separate project. Apple’s developer route involves a supported payment provider, an entitlement and app review. Those are different decisions from choosing an app for your business.</p>
      <p>Compatibility deserves a specific answer. Give the provider your phone model, operating system and country, then confirm the cards and wallets you need to accept. Stripe’s Android requirements, for example, go beyond having NFC: they include supported software, security updates and an unmodified device with a locked bootloader. A phone that works for personal payments may still be unsuitable for merchant acceptance.</p>
      <p>Then look past the tap screen. Can staff find an earlier payment, send a receipt and handle a refund with the access they should have? If you already use order or booking software, ask whether the payment attaches to that record or leaves someone to update it manually.</p>
      <p>These are good questions for a product demonstration. Ask the supplier to walk through a completed sale and its later refund in the actual app you would use. The phone removes one piece of equipment; choose software that also makes the surrounding work easier.</p>
    </section>

    <section id="customer-handoff" aria-labelledby="customer-handoff-title">
      <h2 id="customer-handoff-title">Give the customer a familiar moment</h2>
      <p>A purpose-built terminal tells people what it is before anyone speaks. With your phone, a few seconds of explanation help: show the amount, identify where to hold the card and let the customer see the result.</p>
      <p>Apple’s payment screen displays the merchant name, amount and tap position. Make sure the business name is recognizable. Hold the screen where the customer can read it, and use the app’s instructions for presenting the card or wallet.</p>
      <p>A vibration should not become the cue to hand over the goods. Stripe notes that the initial vibration can happen before the card has finished being read. Keep the card in position as instructed, then wait for the app’s payment result. A read, an authorization and a completed checkout are stages staff should be able to distinguish.</p>
      <p>PIN entry needs the same care as it would on a terminal. Let the customer enter their own PIN privately on the supported screen. Apple says the PIN is never available to the merchant. Its optional Tap to Pay Screen Lock also protects the merchant’s device while the customer enters a PIN; the merchant unlocks the phone afterward to continue.</p>
      <p>Try the physical handoff before a busy shift. Can the customer reach and read the screen? Can they enter a PIN without being watched? Can the employee keep control of the phone? These small details matter more at the counter than the novelty of accepting a card without a separate device.</p>
      <p>Consider the phone’s other jobs too. If it is also handling calls, deliveries and messages, decide how staff will keep checkout available and the battery charged. A dedicated terminal may still be useful where a shared phone would interrupt the sale.</p>
    </section>

    <section id="when-a-tap-cannot-finish" aria-labelledby="when-a-tap-cannot-finish-title">
      <h2 id="when-a-tap-cannot-finish-title">Keep another way to finish the sale</h2>
      <p>A phone has no slot for an inserted card. Stripe documents cases in which a card requires verification that its iPhone flow cannot provide, such as an offline PIN checked by the card’s chip. The customer may need another card or payment method, or a reader that supports the required interaction.</p>
      <p>That limitation is different from an issuer declining the payment. Staff should follow the actual message instead of repeatedly asking the customer to tap. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> explains why identifying the failure matters.</p>
      <p>Internet access is another point to confirm with the provider. Apple supports a configurable Store and Forward capability, but that does not mean every app offers it. Square’s US documentation explicitly excludes Tap to Pay on iPhone and Android from its offline payments. Plan around the service you have, including its restrictions, rather than the phone’s theoretical capabilities.</p>
      <p>If offline acceptance is offered, understand when a payment still needs authorization. Our article on <Link href="/company/blog/offline-credit-card-processing" prefetch={false}>offline card processing</Link> covers that exposure. If an online payment simply loses its result screen, look up the original transaction before trying to collect the same amount again.</p>
      <p>Tap to Pay can bring checkout closer to the customer. Its success is visible in an ordinary exchange: a recognizable business name, a clear amount, a private way to verify the payment and a result both people understand. Get those details right, and the phone can become an unremarkable part of a good sale.</p>
    </section>
  </BlogArticlePage>;
}
