import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { embeddedFinanceArticle } from "./embedded-finance-content";

export function EmbeddedFinancePage() {
  return <BlogArticlePage article={embeddedFinanceArticle}>
    <p>A merchant wants to collect payment without leaving your software. Somewhere between that request and the product presentation, the conversation becomes about embedded finance, banking as a service and a new source of revenue.</p>
    <p>Before committing to that larger product, return to the merchant’s request. What were they unable to do?</p>
    <p>If the problem is collecting an invoice, taking payment for an appointment or matching a sale to its payment record, a merchant services connection may address it. Offering an account in which the business keeps and spends money answers a different need. Both can be useful. They deserve separate decisions.</p>
    <p>That is where we would begin a conversation about <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>: the businesses using your platform, what they sell and how they need to get paid. A broad financial product label tells us less than one sale followed from the customer to the merchant.</p>

    <section id="two-terms-two-questions" aria-labelledby="two-terms-two-questions-title">
      <h2 id="two-terms-two-questions-title">Two terms that answer different questions</h2>
      <p>Embedded finance describes financial services offered within another product or business experience. Payments, lending or insurance can appear where the customer is already making a purchase. Banking as a service, often shortened to BaaS, describes arrangements through which banks make banking capabilities available through nonbank businesses, sometimes with another technology provider in between.</p>
      <p>The Federal Reserve Bank of Kansas City describes BaaS as a way to enable embedded finance. That makes them related concepts, rather than two equivalent products competing for a place on your roadmap. One describes how the customer encounters a service; the other concerns how banking services are supplied.</p>
      <p>For a software business, the practical question is what customers will be able to do. “Pay this invoice” is a specific promise. “Keep your operating funds here” is another. “Borrow against future sales” adds a credit product. Putting those buttons beside each other does not make their approvals, obligations or support arrangements interchangeable.</p>
      <p>You can evaluate the first promise on its own. Does the merchant have an approved account? Does the customer understand who is selling? Can staff find the payment, issue an appropriate refund and investigate a missing payout? Those are substantial product improvements without adding a banking feature.</p>
    </section>

    <section id="when-a-balance-becomes-a-promise" aria-labelledby="when-a-balance-becomes-a-promise-title">
      <h2 id="when-a-balance-becomes-a-promise-title">A balance on the screen changes the conversation</h2>
      <p>A sales total, an expected payout and money available in a deposit account are different things. Design can make them look almost identical. The words beside the number have to explain what the customer actually has.</p>
      <p>If you intend to offer access to a bank deposit account, establish which bank holds the deposits, who maintains the ownership records and how a customer gets help when access fails. These are questions for the product agreement and operating arrangements, before the interface is finished.</p>
      <p>Federal banking agencies’ 2024 joint statement highlighted risks when deposit services involve several organizations. Fragmented operations, recordkeeping problems and uncertainty over responsibilities can interfere with access to funds and resolution of complaints. The statement also reiterated that using a third party does not remove a bank’s responsibilities. It did not establish a new set of requirements.</p>
      <p>Deposit insurance needs equally precise language. The FDIC explains that nonbank companies are not themselves FDIC insured. Eligible deposits at an insured bank may qualify for coverage, including pass-through coverage where the necessary conditions are met. FDIC insurance does not cover the insolvency or bankruptcy of a nonbank company.</p>
      <p>There is a product lesson here beyond the disclosure. A customer can care about protection from bank failure and still need an answer about accessing money during a software outage or a provider’s failure. A bank’s name in the footer does not explain that experience.</p>
    </section>

    <section id="the-merchant-relationship-comes-first" aria-labelledby="the-merchant-relationship-comes-first-title">
      <h2 id="the-merchant-relationship-comes-first-title">Build around the merchant relationship first</h2>
      <p>Trolleys is a nonbank payment facilitator service for merchant payments. Its platform offering brings together merchant account setup, payment acceptance and operational support. It should not be presented as a bank account, a lending product or a general BaaS offering.</p>
      <p>For a platform whose users sell to their own customers, begin by identifying the selling business for each purchase. The platform’s own subscription revenue is separate from those merchants’ sales. Each Trolleys merchant applies and is reviewed on its business activity; a platform partnership does not approve every user automatically.</p>
      <p>Then agree what the software can access and do. Checkout configuration, payment records, delivery methods and account permissions depend on the approved integration. Our <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>platform payment models</Link> explain why holding funds, splitting a payment among sellers or collecting commissions requires a separately approved structure. A checkout connection alone does not authorize those actions.</p>
      <p>The commercial case should be just as specific. Identify the merchant work your connection removes, then compare that value with processing, implementation and support costs under the proposed agreement. Any revenue sharing needs its own terms. A projection built only on a percentage of every merchant’s sales leaves the actual arrangement unexplained.</p>
      <p>Finally, discuss the day the arrangement changes. Who retains the transaction history? Which records can move? How are pending refunds, disputes and payouts handled? The banking agencies’ 2023 third-party guidance includes termination alongside selection and ongoing monitoring. For a platform evaluating any financial partnership, agreeing an exit process is a useful commercial discipline too.</p>
    </section>

    <p>Bring that concrete workflow to a <Link href="/company/contact#platforms" prefetch={false}>platform partnership conversation</Link>. Your merchants may need a better way to accept payments, see what happened and get an answer when something goes wrong. Solve that well. Add an account or another financial product when there is a customer need, an approved structure and a team ready to operate it.</p>
  </BlogArticlePage>;
}
