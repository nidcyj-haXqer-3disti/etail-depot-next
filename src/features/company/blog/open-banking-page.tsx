import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { openBankingArticle } from "./open-banking-content";

export function OpenBankingPage() {
  return <BlogArticlePage article={openBankingArticle}>
    <p>A bank connection can make checkout feel finished before a payment has even started. The customer selects a bank, signs in and returns to your website. A confirmation appears. Everyone has completed a task, but which task?</p>
    <p>Perhaps the customer shared account details. Perhaps they authorized a particular payment. Perhaps a payment is still being processed. For a merchant deciding whether to release an order, those are very different answers.</p>
    <p>Open banking APIs are software connections used to access permitted bank services, including account information or payment initiation. The commercial value comes from the work they enable. The words “bank connected” do not, by themselves, tell you what the customer agreed to or whether you have been paid.</p>

    <section id="what-the-customer-agreed-to" aria-labelledby="what-the-customer-agreed-to-title">
      <h2 id="what-the-customer-agreed-to-title">Start with what the customer agreed to</h2>
      <p>A connection may serve a budgeting app, an account verification step or a checkout. Those uses should not be treated as one broad permission to access everything and collect money whenever the business wants.</p>
      <p>The distinction is explicit in UK guidance. The Financial Conduct Authority describes account information services and payment initiation services separately, with explicit customer consent required for each service. That is a UK framework, not a promise that every country has the same rules or bank coverage.</p>
      <p>Before buying an integration, ask the provider to explain three things in ordinary language:</p>
      <ul>
        <li><strong>Information.</strong> Which account details can your business access, for what purpose and for how long?</li>
        <li><strong>Payment permission.</strong> What has the customer agreed to pay, to whom, and is it a single payment or an ongoing arrangement?</li>
        <li><strong>Payment result.</strong> Which record tells your business what happened to the money?</li>
      </ul>
      <p>The customer may complete these steps within one well designed journey. They remain different permissions and results even when the interface makes them feel like one action.</p>
      <p>Plaid’s Auth documentation offers a useful example. The product supplies account information for payment setup, but moving money requires a payment processor. Obtaining usable account details is not the same event as collecting a payment.</p>
      <p>For US consumer ACH debits, Nacha’s guidance separately addresses authorization terms, including when the business may debit the account, the amount and how authorization can be revoked. A successful bank login alone does not establish those payment terms. Ask your provider for the authorization process required for your payment channel and account setup.</p>
    </section>

    <section id="after-the-bank-screen" aria-labelledby="after-the-bank-screen-title">
      <h2 id="after-the-bank-screen-title">The important part happens after the bank screen</h2>
      <p>Imagine a customer ordering supplies for their business. They finish the bank connection, return to checkout and close the tab. Your staff can see the linked account. They still need to know whether a payment was requested and what result the provider recorded.</p>
      <p>A connection confirmation is evidence about the connection. A payment authorization is evidence about permission. Neither should be silently relabeled as money received. Keep the order attached to the actual payment reference, rather than relying on a successful return to your website.</p>
      <p>TrueLayer’s documented payment lifecycle illustrates why the wording matters. Its <em>authorized</em> state follows customer authorization and submission to the bank. Its <em>executed</em> state means the bank accepted the submission, which it explicitly distinguishes from settlement in the recipient’s account. The available final status also depends on the receiving arrangement. These are provider-specific definitions; ask how your own service proves the outcome you need.</p>
      <p>Set the order’s next action using that evidence and your agreed risk policy. An invoice may remain awaiting payment while processing continues. A dispatch team may need a hold rather than a green tick. If the result is unclear, investigate the existing payment before asking the customer to pay again.</p>
      <p>The connection itself also needs care after setup. Plaid documents situations where consent expires or is revoked and access must be refreshed through its approved flow. Do not assume a previously connected account will remain usable indefinitely.</p>
      <p>For a product displaying account data, an unavailable refresh is not a zero balance. Show when the information was last obtained and explain when it cannot be updated. For a product collecting payments, check the payment record separately. Losing data access is not, by itself, proof that an earlier payment failed, was canceled or was refunded.</p>
    </section>

    <section id="the-payment-your-business-needs" aria-labelledby="the-payment-your-business-needs-title">
      <h2 id="the-payment-your-business-needs-title">Buy the payment outcome your business needs</h2>
      <p>If your goal is to collect an invoice, start there. Explain who pays, what they are paying for, when you deliver and whether the amount repeats. That is a better starting point than asking for an open banking API without deciding what it must accomplish.</p>
      <p>Trolleys, an Etail Depot service, offers <Link href="/services/ach-payments" prefetch={false}>ACH payments for business invoices and orders</Link>, subject to account availability and terms. The merchant workflow connects customer authorization, bank account validation, payment status and the records used to match payments to deposits. A submitted ACH payment can still be pending or returned.</p>
      <p>For a Trolleys merchant, the useful conversation is about the supported collection method and the work around it: how customers authorize the debit, what your team sees while it processes, and how a return changes the outstanding invoice. Our <Link href="/services/reconciliation" prefetch={false}>reconciliation service</Link> addresses the payment records your team needs to understand its activity.</p>
      <p>A bank data connection and an ACH payment service are not interchangeable products. Do not assume that a particular open banking integration is included with your merchant account, or that a service designed for one country can be used unchanged in another. Confirm the proposed provider, supported accounts and intended payment flow with our team.</p>
      <p>When evaluating an outside integration, ask to see an incomplete journey as well as the successful demo. What does the customer see if they stop after linking? What does your staff see if permission changes or the payment is still unresolved? Those answers tell you more about daily operations than the speed of the initial connection.</p>
      <p><Link href="/company/contact" prefetch={false}>Talk with our team about the bank payments your business needs</Link>. Bring the invoice or checkout journey, not just the name of an API. The aim is a customer who understands the payment and a merchant who can account for it.</p>
    </section>

    <p>A good bank connection removes effort. A good payment setup also makes clear what was authorized, what happened to the money and what your business should do next.</p>
  </BlogArticlePage>;
}
