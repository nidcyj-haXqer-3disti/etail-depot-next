import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { multipleGatewaysArticle } from "./multiple-gateways-content";

export function MultipleGatewaysPage() {
  return <BlogArticlePage article={multipleGatewaysArticle}>
    <p>Suppose your store changes its preferred payment gateway on Monday. New orders arrive, payments go through and the launch looks successful. On Tuesday, someone asks to return an order bought the previous week.</p>
    <p>The employee opens the new payment dashboard. The sale is not there.</p>
    <p>It should not be. Changing where the next payment goes does not move the last one. But if the store’s refund button now sends every request to the new connection, an ordinary return has become a technical investigation.</p>
    <p>This is the less glamorous side of managing multiple payment gateways. Whether you use both indefinitely or keep one during a transition, the customer sees one business. Your team needs a way to follow each payment through the account that actually handled it.</p>

    <section id="the-original-payment-still-matters" aria-labelledby="the-original-payment-still-matters-title">
      <h2 id="the-original-payment-still-matters-title">The customer should not have to solve your account map</h2>
      <p>A customer should be able to give your team an order number and get a useful answer. They should not need to identify which gateway, merchant account or checkout version processed the sale.</p>
      <p>Keep that relationship with the order. Record the gateway, the merchant account used and the provider’s transaction reference for each payment attempt. Preserve the amount, currency and outcome alongside them. If the preferred gateway changes next month, the older record should still point to the same transaction.</p>
      <p>The refund action needs to follow that history too. Cybersource’s documented follow-on refund, for example, uses the original capture request ID to link the return to the payment. The account context and original reference matter; choosing today’s default connection does not recreate an older sale.</p>
      <p>Staff should see the account they are acting in and the latest payment activity before submitting a return. An attempted refund, a pending refund and a completed refund are different records. If a response goes missing, investigate that request before sending another. Cybersource’s timeout guidance specifically warns that an unknown refund result can lead to an unintended duplicate refund.</p>
      <p>For Trolleys merchants, the same principle applies across stores and DBAs. Match the store’s Merchant ID to its gateway account using the welcome details. Several MIDs under the same company do not automatically mean several independent gateway providers. A shared portal login is an access convenience, not evidence that the underlying accounts are interchangeable.</p>
      <p>Our <Link href="/services/refunds" prefetch={false}>refund service</Link> follows the original payment and its permitted actions. When another provider handled the sale, its records and supported process still matter. Do not improvise an unrelated credit through a different account because the original transaction is inconvenient to find.</p>
    </section>

    <section id="one-sale-can-appear-in-several-reports" aria-labelledby="one-sale-can-appear-in-several-reports-title">
      <h2 id="one-sale-can-appear-in-several-reports-title">One sale can appear in several reports</h2>
      <p>A combined spreadsheet can make two gateways look manageable while quietly losing the distinctions your team needs. The problem is not the number of files. It is knowing which records describe separate payments and which describe different stages or views of the same payment.</p>
      <p>A gateway report and a merchant account report may both include the same sale. Adding their sales totals together would count it twice. An authorization followed by a capture is not two purchases either. Decide what each report represents before combining it with another.</p>
      <p>Provider reports retain that context. Adyen’s settlement details report, for example, separates the merchant account, provider reference, merchant reference, entry type and modification reference. Those fields let a team distinguish an original payment from later activity. The particular field names differ elsewhere, but flattening everything into “reference” and “amount” throws away useful information.</p>
      <p>Match the order to its payment attempts, then distinguish completed payments from unsuccessful or unresolved attempts. Match refunds and disputes back to their original transactions. Keep each provider and merchant account identifiable even when management wants one overall view.</p>
      <p>Compare the same currency, reporting period and payment status. A difference at the end of a day may come from a cutoff or a processing date rather than a missing sale. A total after fees will also differ from a gross sales total. Explain those differences instead of adjusting a spreadsheet merely to make it balance.</p>
      <p>With Trolleys, an Etail Depot service, <Link href="/services/reconciliation" prefetch={false}>reconciliation compares merchant account and gateway records</Link> for the corresponding business. The Back Office Operations Portal and Cybersource Business Center provide different views of that activity. Having those two portals is not, by itself, a multiple gateway arrangement.</p>
      <p>That support does not automatically combine another provider’s books with your Trolleys records. If your business uses a separate gateway or processor, assign someone to maintain the connection between those records and your own orders. A consolidated view should preserve the ability to investigate each underlying transaction.</p>
    </section>

    <section id="retire-a-connection-deliberately" aria-labelledby="retire-a-connection-deliberately-title">
      <h2 id="retire-a-connection-deliberately-title">Stopping new payments is different from closing an account</h2>
      <p>There is a useful middle state during a transition: the old connection receives no new checkout traffic, but authorized staff can still service earlier payments. Ask the provider how to support that state and what access, costs and obligations remain.</p>
      <p>Before closing anything, review outstanding authorizations, captures, refunds, disputes and balances with the provider. Confirm how later customer claims will be handled and what records must remain available. An empty sales report for this week does not mean last month’s business is finished.</p>
      <p>Closure can remove tools you still need. Stripe, for example, states that closing an account prevents further refunds and dispute responses through that account, while liabilities can remain. Its guidance recommends keeping the account open when further refunds or disputes are expected. Other arrangements have their own terms; get the answer for yours before removing access.</p>
      <p>A developer also needs to review the remaining connection. Payment status updates for older orders may still arrive after new sales have moved elsewhere. Decide which integrations must remain active, who monitors them and when they can be retired. Remove unnecessary privileges without breaking the work still required.</p>
      <p>Keep a clear transition date and an account owner in your operating notes. “We switched gateways” is not enough information for the employee handling a return six weeks later. They need to know where the older payment lives, what they can do and whom to contact if the normal action is unavailable.</p>
      <p>If you are moving to Trolleys, bring this history into the <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching conversation</Link>. Confirm the new account and connection while arranging continued service for earlier transactions with the previous provider. Do not assume those transactions, refund tools or disputes transfer simply because the new checkout is live.</p>
    </section>

    <p>A second gateway earns its place when the business can operate both. The customer should still receive one clear answer, even when your team has to look behind more than one payment connection to provide it.</p>
  </BlogArticlePage>;
}
