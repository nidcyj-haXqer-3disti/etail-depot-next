import { BlogArticlePage } from "./article-page";
import { customOrderClockArticle } from "./custom-order-clock-content";

export function CustomOrderClockPage() {
  return <BlogArticlePage article={customOrderClockArticle}>
    <p>Four weeks sounds clear until someone asks when the clock starts.</p>
    <p>For the customer, it may start when they pay. For the maker, it may start when the design is approved. For the supplier, it may start when the materials arrive. A merchant application that simply says four weeks can conceal three different expectations.</p>

    <section id="separate-the-clocks" aria-labelledby="separate-the-clocks-title">
      <h2 id="separate-the-clocks-title">Explain the stages the customer is paying to wait through.</h2>
    <p>Describe what happens after the order: measurements, design work, proof approval, production and dispatch, where those stages apply. State which intervals the business controls and which depend on customer or supplier action.</p>
    <p>If a customer takes two weeks to approve a proof, show how that affects the expected completion date and how the revised expectation is communicated. Do not quietly describe the production interval as the entire payment-to-delivery period.</p>
    <p>For the reviewer, this detail explains why the lead time exists. For the customer, it explains when to expect progress and which decision they need to make. The same account of the process should work for both.</p>
    </section>

    <section id="credible-estimates" aria-labelledby="credible-estimates-title">
      <h2 id="credible-estimates-title">Use experience that matches the order being sold.</h2>
    <p>A standard item’s turnaround may not support a more complex commission. Even an accurate production estimate can omit the queue before production starts. If the workshop is already committed to other orders, the next customer is buying a later place in that queue, not the turnaround achieved when the bench was empty. Use experience that reflects the work and capacity available. Where the product is new, identify the estimate and its basis instead of giving it the authority of established history.</p>
    <p>For covered merchandise orders, the FTC requires a reasonable basis for the stated shipping timeframe and appropriate handling when that promise cannot be met. The rule concerns covered merchandise; it should not be used as a universal timetable for every custom service.</p>
    <p>A broad sentence saying delays may occur does not explain a particular delay. Keep the original promise, the reason for the change and the customer communication connected to the order.</p>
    </section>

    <section id="account-scope" aria-labelledby="account-scope-title">
      <h2 id="account-scope-title">Make the payment arrangement fit the work.</h2>
    <p>Tell Trolleys when you collect the deposit or balance, how long fulfillment normally takes and what happens if the specification changes or the order cannot be completed. Substantial advances and extended delivery need the required written approval. Confirm the accepted delivery period for your account instead of assuming one cutoff applies to every business.</p>
    <p>Confirm the supported authorization and capture arrangement for the account. A customer agreeing to wait does not mean a card authorization remains usable for the whole production period.</p>
    <p>Customers may be willing to wait for something made for them. They still need to know which wait they agreed to. A four-week production estimate that starts after two weeks of design approval describes a different purchase from four weeks between payment and delivery.</p>
    </section>
  </BlogArticlePage>;
}
