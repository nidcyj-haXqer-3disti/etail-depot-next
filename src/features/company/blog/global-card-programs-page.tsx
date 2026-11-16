import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { globalCardProgramsArticle } from "./global-card-programs-content";

export function GlobalCardProgramsPage() {
  return <BlogArticlePage article={globalCardProgramsArticle}>
    <p>Imagine a US business whose employees already use company cards on trips to the UK. It hires someone who lives there permanently and wants to give them the same card. From the employer’s perspective, that feels like adding a person to a system that already works.</p>
    <p>For the card program, it is a question that still needs answering. Successful purchases in another country establish that the card could be used there. They do not establish whether the program can enroll that employee.</p>
    <p>Global card issuance means making cards available to eligible account holders across countries. International acceptance concerns where an existing card can be used. A provider’s country coverage needs to be read with that distinction in mind, before a business promises the same experience to everyone on its team.</p>
    <p>Stripe, for example, distinguishes local issuing arrangements from programs that support eligible international issuance. Local programs generally align the issuer, platform, connected account and cardholder within a region. Other arrangements can support multinational businesses across borders. The right arrangement depends on the actual customer and program; expansion does not always require a separate program in every country.</p>
    <p>The company and the person using its card also need to be identified separately. Adyen explains that a company can be the cardholder while an employee is an authorized card user. The company’s verification and the checks on that individual are different parts of the relationship. A familiar business name on the account does not make the employee’s details irrelevant.</p>
    <p>That gives the provider a more useful starting point than “we need global cards”: the contracting company, where the proposed users live, what they will buy and how the account will be funded. Get confirmation for that arrangement before inviting people to enroll. Applicable legal and disclosure responsibilities also need review for the intended markets; working <Link href="/company/blog/card-issuing-apis" prefetch={false}>card APIs</Link> do not resolve them.</p>
    <section id="currency-records" aria-labelledby="currency-records-title">
      <h2 id="currency-records-title">The receipt tells only part of the currency story</h2>
      <p>An employee may recognize the amount on a receipt while the finance team sees a different amount leaving the account. The purchase currency and the funding currency can differ.</p>
      <p>Airwallex documents one way this works: for supported direct billing currencies, a purchase can draw from a matching currency wallet when funds are available. Otherwise, configured automatic conversion can use the designated primary currency. Other transaction currencies follow different funding rules. Its conversion includes an applicable markup, so a card being accepted says little about the final cost.</p>
      <p>Timing matters too. In that provider’s conversion flow, the amount reserved at authorization can differ from the final debit because the exchange rate is recalculated at clearing. Its refund treatment also depends on whether the refund is linked to the original purchase. Preserve the purchase and refund records, including the posted amounts and currencies, rather than assuming that reversing the sale recreates the original balance exactly.</p>
      <p>The useful report connects each purchase to the amount actually debited. Keeping both currencies visible helps the finance team investigate a difference.</p>
    </section>
    <section id="local-experience" aria-labelledby="local-experience-title">
      <h2 id="local-experience-title">Follow the first employee through the whole experience</h2>
      <p>Return to the person hired abroad. Before announcing that they can use the company’s card program, follow what they will actually have to do: provide the required information, receive or access the card, activate it where needed and make an intended purchase. If the product promises a <Link href="/company/blog/credit-cards-and-digital-wallets" prefetch={false}>digital wallet</Link>, confirm that the specific card and region support it.</p>
      <p>Airwallex’s program documentation illustrates why that detail matters. Available combinations depend on region, purpose, card type and funding source. Physical cards, virtual cards and wallet access are not interchangeable features of every combination. A country appearing on a coverage page is the beginning of that conversation.</p>
      <p>The employee also needs a clear route to help if enrollment stops, a purchase is declined or a card goes missing. Decide which team owns that response, when it is available and how the employee reaches it. A single company brand should make support easier to find, even when different regional arrangements sit behind the service.</p>
      <p>A good expansion review can follow one person from invitation to a purchase the finance team can explain. It can also show how that person gets help and how their access ends when they leave. That is a more useful definition of coverage than a map filled with countries.</p>
    </section>
  </BlogArticlePage>;
}
