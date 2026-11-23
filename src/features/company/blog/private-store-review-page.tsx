import { BlogArticlePage } from "./article-page";
import { privateStoreReviewArticle } from "./private-store-review-content";

export function PrivateStoreReviewPage() {
  return <BlogArticlePage article={privateStoreReviewArticle}>
    <p>The homepage looks polished. The products are behind a login. Pricing appears after account approval, and the actual order is placed inside a customer workspace.</p>
    <p>A reviewer opening the public URL sees almost none of the business being proposed.</p>
    <p>That does not make the private selling model illegitimate. It means the application needs a way to show the actual buying journey without handing over access to customer data or privileged staff controls.</p>

    <section id="show-the-offer" aria-labelledby="show-the-offer-title">
      <h2 id="show-the-offer-title">Explain what the public page leaves out.</h2>
    <p>Describe who becomes a customer, how access is approved and what a buyer can purchase after signing in. Include how prices are established, which terms appear before payment and what confirmation the buyer receives.</p>
    <p>In a negotiated-price store, the important step may happen before the buyer reaches the payment screen. If an approved quote sets the price, showing only the final total hides how the parties arrived at it. A useful demonstration connects a clearly labeled sample quote to the corresponding order and terms. A product tour can show what the software does while still leaving the actual purchase unexplained.</p>
    <p>Ask the implementation contact what demonstration or evidence the reviewer can accept. A controlled demonstration account, representative screen captures or a supervised walkthrough may be proposed, but none should be assumed to substitute automatically for the required website review.</p>
    </section>

    <section id="protect-real-accounts" aria-labelledby="protect-real-accounts-title">
      <h2 id="protect-real-accounts-title">Keep the demonstration separate from customer access.</h2>
    <p>Do not provide a real customer’s login or an administrator credential just because it is the quickest way to show the page. Use an approved process with the minimum necessary access, and identify any simulated data clearly in the review material.</p>
    <p>If a demonstration involves a payment screen, make clear whether it is a noncharging environment. Showing the interface does not authorize a test charge or establish live processing approval.</p>
    <p>Provider rules differ. Stripe’s website activation guidance requires an accessible page without a password; a Trolleys merchant needs its own review instructions. Opening real customer areas to satisfy a rule read elsewhere would solve the wrong problem.</p>
    </section>

    <section id="same-journey" aria-labelledby="same-journey-title">
      <h2 id="same-journey-title">Show the same commercial journey the customer will use.</h2>
    <p>A simplified demonstration should preserve the material terms. Do not omit the automatic renewal, refundable deposit or later balance merely to make the presentation easier. Explain where customer agreement is collected and how the buyer gets help afterward.</p>
    <p>Trolleys requires accurate website and activity information. Give the reviewer a clear map of what is public, what is restricted and what the customer sees before being charged. If the commercial journey changes after approval, assess whether the account scope must change too.</p>
    <p>The reviewer needs to understand the purchase. They do not need to become an existing customer to see it. The demonstration should make that separation possible.</p>
    </section>
  </BlogArticlePage>;
}
