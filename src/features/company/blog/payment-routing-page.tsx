import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentRoutingArticle } from "./payment-routing-content";

export function PaymentRoutingPage() {
  return <BlogArticlePage article={paymentRoutingArticle}>
    <p>The pitch for intelligent payment routing is attractive: send each payment down the path most likely to work, at a cost the business can accept.</p>
    <p>Then the practical questions arrive. Which sales are you losing? Can the alternative account actually accept those transactions? And if the checkout tries somewhere else, will your team still know where the customer’s money went?</p>
    <p>Intelligent payment routing selects an eligible processing path using configured rules or performance signals. Depending on the product, that might mean choosing between payment processors or between available networks within a provider’s service. Those are different arrangements, with different account and integration requirements.</p>
    <p>For a business considering <Link href="/services/merchant-services" prefetch={false}>Trolleys powered by Etail Depot</Link>, begin with the merchant account, the checkout enabled for it and the problem you need to solve. Our role includes account setup, payment acceptance and support. Any proposed routing connection needs its own confirmation of compatibility and responsibilities.</p>

    <section id="the-sale-you-are-losing" aria-labelledby="the-sale-you-are-losing-title">
      <h2 id="the-sale-you-are-losing-title">Start with the sale you are losing</h2>
      <p>A customer who leaves because the checkout is difficult, a payment rejected for invalid information and an approved payment whose result never reaches your store need different fixes. Adding another processor will not automatically resolve all three.</p>
      <p>Look at the affected orders before buying an optimization promise. Find the payment method, account, response and point where the purchase stopped. Separate a confirmed decline from an unfinished authentication step or an unknown result. That investigation gives a routing proposal something specific to improve.</p>
      <p>The alternative route must then qualify for the job. Confirm merchant approval, supported currencies and methods, cardholder authentication, saved credential compatibility and the operations your business uses. A route that accepts an initial payment may still lack a feature your recurring billing or refund workflow needs.</p>
      <p>These limits are concrete. Stripe’s routing documentation, for example, distinguishes supported destination processors and integrations, while its feature matrix shows that capabilities vary between destinations. A routing product’s broad description is not enough to confirm your particular checkout.</p>
      <p>For a software platform, preserve the link between the purchase and the correct merchant account. Trolleys’ <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>platform partnerships</Link> include individual merchant review and agreed integration arrangements. Having another MID available does not make it an interchangeable destination for every business’s sales.</p>
    </section>

    <section id="approval-chart" aria-labelledby="approval-chart-title">
      <h2 id="approval-chart-title">The approval chart can flatter the wrong route</h2>
      <p>Imagine comparing a processor that receives ordinary first attempts with one that receives only payments another processor has already declined. A lower approval rate on the second route does not establish that it performs worse. It has been given a harder job.</p>
      <p>Ask for a comparison of similar eligible payments, with the assignment rules kept visible. Separate first attempts from later attempts and follow the final order outcome. If one customer makes several attempts before completing a purchase, the business has one completed sale. A report should let you see both the attempts and that sale.</p>
      <p>Choose the result worth paying for. It could be more completed orders in a particular customer group, fewer interruptions or lower total processing cost for the same successful business. Count added routing charges, processing fees and investigation work alongside the improvement. Track refunds and disputes as the transactions mature.</p>
      <p>A controlled trial should have a limited scope, an existing configuration to compare against and a clear point at which you stop it. Keep the rule version and reason for each route choice. If the headline improves while customers wait longer or support cases rise, the trial has more to explain.</p>
    </section>

    <section id="after-checkout" aria-labelledby="after-checkout-title">
      <h2 id="after-checkout-title">The route must work after checkout</h2>
      <p>The awkward moment is a missing response. The customer presses Pay, the request times out and the checkout does not know whether the payment succeeded. Sending the purchase elsewhere immediately can create a second authorization or charge.</p>
      <p>Cybersource’s timeout guidance treats that result as uncertain and calls for checking transaction status before retrying. Recovery must follow the original operation and the applicable processor guidance. There is no single retry instruction that safely covers every decline, timeout and authentication outcome.</p>
      <p>Our <Link href="/developers/testing" prefetch={false}>payment integration testing guidance</Link> includes delayed results and interrupted checkout. Carry those tests into any proposed routing arrangement. A returning browser, late notification or second click should lead your team back to the existing order and its attempts, with a clear final outcome.</p>
      <p>Keep the selected merchant account and provider reference available for refunds, disputes and reporting. A combined dashboard is useful only if the underlying records remain traceable. With Trolleys, <Link href="/services/reconciliation" prefetch={false}>merchant account and gateway reconciliation</Link> helps investigate those payment records; it does not replace the records or responsibilities of another processor.</p>
    </section>

    <p>Bring the affected transactions and your current checkout arrangement to our <Link href="/company/contact#integration" prefetch={false}>account and integration team</Link>. We can help investigate the merchant and payment side and confirm what your account supports. Your routing provider or developer must establish the separate connection and how it will be operated.</p>
    <p>Sometimes the right improvement is a corrected account setting or a reliable way to recover an existing payment. Sometimes another route has a clear business case. The useful question is what your customers and team gain after the extra connection is in place.</p>
  </BlogArticlePage>;
}
