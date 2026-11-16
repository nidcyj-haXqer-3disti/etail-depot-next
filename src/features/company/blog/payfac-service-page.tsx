import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payfacServiceArticle } from "./payfac-service-content";

export function PayfacServicePage() {
  return <BlogArticlePage article={payfacServiceArticle}>
    <p>The most attractive part of PayFac as a service is the work you hope your company will never have to build. Your software can offer payments without first becoming a payments operation of its own. For a platform with customers waiting, that is a compelling proposition.</p>
    <p>Then comes the less comfortable question: which work has actually left your desk?</p>
    <p>PayFac as a service generally describes an arrangement where a provider supplies payment infrastructure and services instead of the platform building and operating everything itself. Stripe uses the term in that outsourcing sense. It is a useful starting point, but the product name does not tell you who approves a merchant, who can restrict an account or who pays when money is owed.</p>
    <p>Those answers determine what you are buying. They also determine what you can honestly promise your customers.</p>

    <section id="work-decisions-and-responsibility" aria-labelledby="work-decisions-and-responsibility-title">
      <h2 id="work-decisions-and-responsibility-title">Doing the work is different from owning the decision</h2>
      <p>A provider might collect an application, check documents and deliver an account status to your platform. That does not necessarily give your team authority to approve the business. A beautifully integrated application can still lead to a decision made outside your company.</p>
      <p>The formal role matters too. Mastercard describes a payment facilitator as a provider registered by an acquirer to facilitate transactions for submerchants. Buying something called PayFac as a service does not, by that name alone, establish that your software company holds that registration. Ask which entity occupies the payment facilitator role and what your agreement appoints your company to do.</p>
      <p>Take a hypothetical software company serving businesses that sell equipment. Its sales team wants to tell every new customer that payments come with the subscription. Its payment partner needs to review each merchant’s activity. Both teams can be working correctly while the sales promise is still wrong.</p>
      <p>The platform can sell access to its software. It should describe merchant account approval according to the actual review process. Otherwise, an outsourced decision becomes a broken promise under the platform’s own name.</p>
      <p>This distinction continues after launch. Adyen’s platform documentation, for example, describes further verification when user information changes and restrictions on capabilities when verification issues remain unresolved. That is one provider’s operating model, not a description of every partnership. It illustrates why initial acceptance is not the end of account management.</p>
      <p>Ask the provider to walk through a merchant who needs to supply more information. Who requests it? Who explains the effect on payments? Who can change the decision? Your team needs an answer it can use with a worried customer, not just a status in a dashboard.</p>
    </section>

    <section id="what-the-price-leaves-with-you" aria-labelledby="what-the-price-leaves-with-you-title">
      <h2 id="what-the-price-leaves-with-you-title">The price includes more than the processing rate</h2>
      <p>Outsourcing can remove substantial work. It can also leave your business with integration maintenance, customer communication and financial obligations that do not appear in the headline price.</p>
      <p>Start with refunds and disputes. A provider can operate the machinery that moves a refund or records a chargeback without agreeing to absorb the loss. Adyen’s platform account documentation makes that distinction concrete: the platform’s liable balance account, which holds the platform’s own funds, can be used to cover users’ negative balances arising from refunds and chargebacks. Those are Adyen’s terms for that structure, not Trolleys’ terms or a rule that every platform has the same exposure.</p>
      <p>Before accepting a proposal, get a written explanation of whose funds are used, when recovery can occur and what happens if the merchant cannot pay. A promise to “manage risk” is not enough to establish who bears the financial loss.</p>
      <p>Now consider the work your own people will still perform. Someone has to connect payment records to the software’s orders. Someone has to maintain the integration when requirements change. Someone has to distinguish a software problem from a merchant account issue before sending the customer to another team.</p>
      <p>Count that work alongside processing charges, platform fees, implementation costs and any agreed revenue share. Do not compare a provider’s full operating service with another provider’s transaction price alone. Equally, do not pay for an elaborate programme when the customer need is simply an approved merchant account connected to your software.</p>
      <p>Control deserves the same attention as cost. If your company wants to set merchant pricing, deduct a commission or direct money between businesses, identify the contractual permission for each action. A payment connection does not automatically grant all three.</p>
      <p>Ask about leaving before you sign. Find out which records you can obtain, who handles open disputes and refunds, and what your merchants would need to do to move. An export of customer names is not the same as a working payment migration.</p>
    </section>

    <section id="the-partnership-your-platform-needs" aria-labelledby="the-partnership-your-platform-needs-title">
      <h2 id="the-partnership-your-platform-needs-title">Start with the partnership your customers need</h2>
      <p>If you want your software customers to accept payments, you do not need to begin by deciding that your company must become a payment facilitator. Begin with the customer: what they sell, who pays them and what your software should make easier.</p>
      <p>Trolleys, an Etail Depot service, works with <Link href="/use-cases/software-platforms" prefetch={false}>software platforms on merchant services partnerships</Link>. Each merchant applies and is reviewed for its own business activity. The partnership discussion covers payment setup, account support and how the merchant’s payment workflow connects with the platform.</p>
      <p>For a Trolleys merchant, the useful result is an account suited to the business, a supported way to accept payments and a clear place to go for account questions. For the platform, it is knowing which responsibilities belong to its own team and which belong to the agreed merchant services arrangement.</p>
      <p>Bring a real customer journey to that conversation. Show where a merchant signs up, where a buyer pays, which payment information the software needs and where support requests arrive. We can discuss the intended setup and the work required without treating a payment industry label as the product specification.</p>
      <p>Commercial terms, implementation responsibilities and available reporting need to be confirmed in the agreement. Commissions, split payments or holding and distributing merchant funds require a separately approved structure. Do not assume those capabilities are included in an ordinary checkout connection.</p>
      <p><Link href="/company/contact" prefetch={false}>Talk with our team about the role payments should play in your platform</Link>. The right arrangement should leave you able to explain what your merchants receive, what your company is responsible for and what happens when an account needs attention.</p>
    </section>

    <p>A good payment partnership gives your business fewer unresolved responsibilities, not just fewer tasks. That is the difference worth buying.</p>
  </BlogArticlePage>;
}
