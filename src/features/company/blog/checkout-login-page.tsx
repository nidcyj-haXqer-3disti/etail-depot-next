import { BlogArticlePage } from "./article-page";
import { checkoutLoginArticle } from "./checkout-login-content";

export function CheckoutLoginPage() {
  return <BlogArticlePage article={checkoutLoginArticle}>
    <p>A customer returns for the same item they bought last spring. They remember the product, the size and why they liked it. They do not remember the password.</p>
    <p>The store now has a choice. It can help them place another order, or send them into their inbox to recover a relationship they were already willing to renew.</p>
    <p>There are purchases that genuinely require an account, including access to an existing subscription or a restricted business ordering arrangement. But when an ordinary order can be completed as a guest, making sign-in look compulsory creates a problem of the merchant’s own making.</p>

    <section id="buying-and-signing-in" aria-labelledby="buying-and-signing-in-title">
      <h2 id="buying-and-signing-in-title">Give sign-in a job worth doing.</h2>
    <p>Saved addresses, order history and an agreed business price can make an account useful. Explain the relevant benefit beside the sign-in choice. A returning shopper should be able to recognize why they might want it, without mistaking it for permission to buy.</p>
    <p>Baymard’s guest-checkout research describes customers overlooking a guest route when account choices dominate the page. The lesson is about prominence and comprehension. Merely having a guest link somewhere does not mean customers understand that they may use it.</p>
    <p>For a store that supports guest purchases, a clear route such as “Continue as guest” can sit beside optional sign-in. Sending a recognized email into a compulsory password step creates a peculiar penalty: the person who bought before has more work to do than the person who has never visited. Recognition is useful when it offers saved details after verification. It works against the purchase when it removes a route that was available a moment earlier.</p>
    <p>If a customer does choose account recovery, preserve the basket where the platform safely supports it and provide a clear way back. Recovery may require another tab, an email application or a different device. The customer should not need to reconstruct which item, quantity or delivery choice they had selected.</p>
    <p>Do not automatically attach a guest order to an existing account based only on a matching email. Follow the platform’s verified account-linking process. A helpful shortcut must not expose somebody else’s purchases.</p>
    </section>

    <section id="after-the-order" aria-labelledby="after-the-order-title">
      <h2 id="after-the-order-title">Offer an account after confirming the order.</h2>
    <p>An optional account invitation belongs where its value is obvious. After a confirmed order, the customer may want to follow delivery or make the next purchase easier. State what creating the account will provide and let them decline without hiding their order confirmation.</p>
    <p>That confirmation still needs to stand on its own: what was ordered, the actual payment or order status, the reference and how updates will arrive. “Finish setting up your account” must not look like an unfinished payment when the order is already complete.</p>
    <p>The same distinction applies to the merchant’s measures of success. An account invitation may serve future purchases, and a separate marketing choice may serve future contact. Neither should make the completed order feel conditional on joining. The customer came back because the previous purchase was worth repeating; the account is a way to support that relationship, not its only evidence.</p>
    <p>Judge the change at the purchase level. Are customers completing the order, finding confirmation and accessing the help they need? More account registrations alone would not prove a better checkout. A returning customer who buys comfortably as a guest has still returned.</p>
    </section>
  </BlogArticlePage>;
}
