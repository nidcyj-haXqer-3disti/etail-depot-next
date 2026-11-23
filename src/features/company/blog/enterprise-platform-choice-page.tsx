import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { enterprisePlatformChoiceArticle } from "./enterprise-platform-choice-content";

export function EnterprisePlatformChoicePage() {
  return <BlogArticlePage article={enterprisePlatformChoiceArticle}>
    <p>A software business puts PayPal Enterprise Payments and a payment facilitator partnership on the same shortlist. The labels sound like competing answers to the same question.</p>
    <p>They describe different dimensions of the decision. One names a provider’s product offering. The other describes a relationship through which merchants receive payment services. A platform has to define the intended relationship before it can compare the products that might support it.</p>

    <section id="start-with-the-seller" aria-labelledby="start-with-the-seller-title">
      <h2 id="start-with-the-seller-title">Start with the seller, then the service</h2>
    <p>Imagine a software business that charges merchants a monthly software fee and also wants to help them accept payments from shoppers. The two payments may appear inside one product, but they raise different account questions. Who sells the software subscription, and who sells the shopper’s purchase? Which legal business receives each approved account, and who is responsible for each customer obligation?</p>
    <p>Those answers shape onboarding, permissions, records and support. The software fee cannot stand in for the merchant sales when describing the intended arrangement. A platform selling its own software has a different need from a marketplace connecting buyers to many sellers, and a business doing both needs to make both visible in the proposal. A feature list cannot resolve that distinction.</p>
    <p>PayPal identifies Braintree as PayPal Enterprise Payments and separately documents its multiparty platform offering. That platform offering requires approval before live use. It is therefore misleading to assume that an ordinary enterprise checkout arrangement automatically includes every marketplace or platform capability.</p>
    </section>

    <section id="responsibilities-before-features" aria-labelledby="responsibilities-before-features-title">
      <h2 id="responsibilities-before-features-title">Write the responsibilities before the revenue model</h2>
    <p>For a Trolleys partnership, the <Link href="/company/legal/software-platforms#platform-order" prefetch={false}>Platform Service Order</Link> defines the approved model, integration, responsibilities and commercial terms. The program covers the US merchant accounts and activities expressly approved. A platform relationship does not approve every merchant or authorize the platform to hold funds, deduct charges or act as seller for other businesses.</p>
    <p>The commercial proposal should follow that account model. Any platform compensation or collection arrangement needs its own accepted basis and permissions. A technical connection alone does not establish a right to payment revenue or to debit a merchant’s funds.</p>
    <p>Compare providers on the arrangement each is actually offering: eligible businesses, onboarding responsibility, integration work, reporting access and ownership of support issues. Distinguish features available elsewhere in the provider’s catalogue from those included in the proposed approval.</p>
    <p>The platform eventually has to turn the proposal into promises its merchants can understand. Who provides the account? What can the software company actually do when an issue arises, and what must go to another party? If those answers remain vague, the uncertainty will travel from the sales discussion into the product’s support experience. Settling them early gives the platform a service it can describe accurately, as well as a connection it can build.</p>
    </section>
  </BlogArticlePage>;
}
