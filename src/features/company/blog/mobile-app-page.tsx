import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { mobileAppArticle } from "./mobile-app-content";

export function MobileAppPage() {
  return <BlogArticlePage article={mobileAppArticle}>
    <p>Consider a customer ordering a replacement part through your app. They choose the item, confirm delivery and begin paying. Their bank asks them to approve the purchase elsewhere on the phone. By the time they return, your app has reopened at the home screen.</p>
    <p>Now they have a question your checkout design should already have answered: did the order go through?</p>
    <p>A fresh cart leaves them to guess. Another Pay button asks them to risk paying twice. An order they can reopen, with a clear payment status and a useful reference, gives them something to trust.</p>
    <p>This is the business problem behind mobile app payment integration. The payment interface connects to a gateway, but the purchase also has to remain understandable to the customer and to the people who deliver it. For <Link href="/services/merchant-services" prefetch={false}>Trolleys, an Etail Depot service</Link>, that starts with the approved merchant account and a supported checkout arrangement. Your app team has to carry that arrangement through the rest of the purchase.</p>

    <section id="what-the-app-sells" aria-labelledby="what-the-app-sells-title">
      <h2 id="what-the-app-sells-title">What you sell decides part of the integration</h2>
      <p>A shopping app selling a physical part and an app selling access to a premium feature do not necessarily have the same payment choices. Decide which purchase you are building before committing to a checkout component.</p>
      <p>Apple’s rules require payment methods other than its in-app purchase system for physical goods or services consumed outside the app. Google Play likewise excludes purchases primarily of physical goods or physical services from its billing system. A merchant gateway can be relevant to those purchases, subject to account approval and integration support.</p>
      <p>Digital content, subscriptions and features used inside apps distributed through Apple’s App Store or Google Play generally require the store’s billing system unless an applicable exception permits another purchase flow. Storefront, distribution channel and the applicable programs affect the permitted flow. Apple’s United States storefront rules allow external purchase links without the corresponding entitlement; Google Play provides regional exceptions and programs with their own conditions. Permission to send a customer to a website does not automatically approve any embedded card form.</p>
      <p>Give the developer and payment team the same description of what the customer buys, where they use it and where the app will be distributed. That is a more useful starting point than asking whether a gateway “works on mobile.”</p>
    </section>

    <section id="more-than-a-small-website" aria-labelledby="more-than-a-small-website-title">
      <h2 id="more-than-a-small-website-title">A smaller website is not the whole app experience</h2>
      <p>Reusing a working website checkout can be a sensible choice. It can also hide work that only becomes visible on a real phone: a keyboard covers the next action, a wallet does not appear in the embedded browser, or a bank authentication step has no reliable route back.</p>
      <p>Cybersource describes Unified Checkout as primarily built for web pages and says it can be integrated into mobile applications through a WebView, an embedded browser inside the app. It also identifies other mobile acceptance options. That gives your developer approaches to evaluate, not a promise that every app, wallet and device combination will behave identically.</p>
      <p>Ask to see the proposed purchase on the actual iOS and Android environments you intend to support. Confirm the payment methods, wallet setup and authentication flow for that implementation. An Apple Pay button working on your website does not establish that the app’s wallet configuration is finished.</p>
      <p>The app should not contain your secret gateway credentials or decide the payable amount from an unverified value on the phone. Your server or supported commerce platform should validate the order, calculate its total and use the correct merchant account. Etail’s <Link href="/developers/api-reference" prefetch={false}>checkout integration guidance</Link> explains that separation for the website flow; the app implementation needs its own supported connection and return handling.</p>
    </section>

    <section id="return-to-the-purchase" aria-labelledby="return-to-the-purchase-title">
      <h2 id="return-to-the-purchase-title">Bring the customer back to the purchase</h2>
      <p>In the replacement-part purchase, the important thing to recover is the existing order. The app may have forgotten which screen was open. The business should still be able to retrieve the order and establish what happened to its payment.</p>
      <p>A return link helps the customer find their way back. It is not payment evidence. The order system needs a verified provider result, obtained through the supported server flow or authenticated notification, before confirming the relevant payment state. If the result is still unknown, say that the payment is being checked and provide a way to revisit the order.</p>
      <p>Cybersource’s timeout guidance calls for checking the original transaction rather than assuming that a missing response means failure. Reopening the app should not automatically start a second charge. Keep the original attempt available for investigation and follow the provider’s recovery instructions.</p>
      <p>This should work even if the customer’s app session expires. After the appropriate identity check, return them to their own purchase. Keep the order reference, receipt and support route accessible. A customer should not have to remember the screen they were on to ask about money they may have paid.</p>
      <p>For a Trolleys merchant, the gateway reference also connects that customer conversation to the relevant account records. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> concerns the merchant account and gateway records. Your order system supplies the purchase context. Keeping both references makes the payment easier to trace without asking the customer for card details.</p>
    </section>

    <section id="before-customers-rely-on-it" aria-labelledby="before-customers-rely-on-it-title">
      <h2 id="before-customers-rely-on-it-title">Watch someone come back, not just someone pay</h2>
      <p>Before launch, watch the interrupted purchase as closely as the successful demonstration. Close the app during authentication. Lose the connection after submission. Return while signed out. Check what a customer using a screen reader hears when the status changes. The useful question is whether each person can understand the outcome and find their order.</p>
      <p>Then follow a confirmed payment into the work your team does next. Can support locate it from the order reference? Can the correct account handle a refund? Does the app distinguish an accepted order from an item that has actually shipped? These are ordinary customer expectations, even when several systems sit behind them.</p>
      <p>Use our <Link href="/developers/testing" prefetch={false}>integration testing guidance</Link> with the app developer’s device tests. Bring the app’s purchase flow and intended payment methods to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link> so we can confirm the merchant and gateway requirements. App development and store approval remain separate responsibilities.</p>
    </section>

    <p>The customer came to buy something. A good mobile payment integration lets them leave the screen without losing track of that purchase, and lets your business answer when they come back.</p>
  </BlogArticlePage>;
}
