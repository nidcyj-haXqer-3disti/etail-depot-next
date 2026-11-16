import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { payfacIsoArticle } from "./payfac-iso-content";
import s from "./blog.module.css";

const comparisons = [
  ["Account relationship", "An ISO helps bring the merchant to the acquirer. Its sales role alone does not make it the processor or recipient of settlement funds.", "A PayFac may be authorized to contract with sponsored merchants on the acquirer’s behalf and may handle their settlement proceeds."],
  ["What to confirm", "Which provider supplies the account, and which questions the ISO will handle after signup.", "Which account services the programme provides, and which decisions require the acquiring partner’s involvement."],
] as const;

export function PayfacIsoPage() {
  return <BlogArticlePage article={payfacIsoArticle}>
    <p>Choosing a payment provider can start to feel like choosing a side. One proposal calls itself a payment facilitator. Another comes from an independent sales organization. Both say they can help your business accept cards.</p>
    <p>You are buying a service your business will depend on every trading day. The useful question is whether that service fits the way you sell, the records you need and the help you expect when something changes.</p>
    <p>The difference between a PayFac and an ISO is real. Treating either label as a verdict on quality is where the comparison goes wrong.</p>

    <section id="the-relationship-behind-the-brand" aria-labelledby="the-relationship-behind-the-brand-title">
      <h2 id="the-relationship-behind-the-brand-title">Understand the relationship behind the brand</h2>
      <p>An independent sales organization, or ISO, helps sell or arrange merchant services. Visa’s merchant ISO category covers activities such as referring merchants to an acquirer, onboarding assistance, customer service and selling acceptance equipment or services. The acquirer connects merchant card acceptance to the card networks under the acquiring agreement.</p>
      <p>A payment facilitator, or PayFac, occupies a different role. Mastercard describes it as a provider registered by an acquirer to facilitate transactions for submerchants. Visa distinguishes that sponsored merchant relationship from the ISO’s sales role.</p>
      <table className={s.comparison}>
        <caption>The role behind the offer</caption>
        <thead><tr><th scope="col">Compare</th><th scope="col">ISO</th><th scope="col">Payment facilitator</th></tr></thead>
        <tbody>{comparisons.map(([question, iso, payfac]) => <tr key={question}>
          <th scope="row">{question}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">ISO</span>{iso}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">Payment facilitator</span>{payfac}</td>
        </tr>)}</tbody>
      </table>
      <p>These are descriptions of roles, not complete descriptions of a company. Visa also recognizes that an entity can perform functions falling under more than one agent category. Ask which arrangement applies to your offer rather than trying to infer the entire business from the name on its website.</p>
      <p>The salesperson, gateway and acquiring partner may therefore have different names. That is a reason to understand the relationship, not by itself a reason to reject it. You should be able to identify the parties in your agreement and the team responsible for resolving an account question.</p>
    </section>

    <section id="compare-the-offer-you-will-use" aria-labelledby="compare-the-offer-you-will-use-title">
      <h2 id="compare-the-offer-you-will-use-title">Compare the account you will actually use</h2>
      <p>It is tempting to reduce the choice to a familiar story: facilitators are fast and simple, while ISOs offer personal service and more control. Neither description tells you enough to buy an account.</p>
      <p>A short application does not establish that your products, delivery schedule or expected order amounts have been approved. A named sales representative does not establish who can answer a funding question six months later. A merchant ID identifies an account within its processing arrangement; the number alone does not promise better pricing or protection from review.</p>
      <p>Put your own sales pattern into both proposals. A business collecting deposits before delivery needs a different conversation from one charging after goods ship. Explain the gap between payment and fulfillment, any recurring charges and the larger orders you expect. An offer based on an incomplete picture of your business is a poor basis for comparison.</p>
      <p>Then compare the full cost for that same activity. Include processing charges, recurring fees, gateway or equipment charges and the treatment of refunds, disputes and termination. Ask which charges belong to separate agreements. A small transaction rate can be less attractive once the services your business actually needs are included.</p>
      <p>You do not have to become a payments specialist to ask for a clear written offer. You do need to know what it covers.</p>
    </section>

    <section id="ask-about-the-next-change" aria-labelledby="ask-about-the-next-change-title">
      <h2 id="ask-about-the-next-change-title">Ask about the next change in your business</h2>
      <p>Imagine your online business adds a second storefront under a different trading name. You want customers to recognize the right name, staff to see the right account and your bookkeeper to separate the activity. A checkout demonstration for the original store will not answer all of those questions.</p>
      <p>Ask each provider how it would handle that change. Does it require another application or account? How is the legal company connected to the trading name? What access and reports would the owner receive? The answer should describe an actual account setup, not simply repeat that the provider supports growing businesses.</p>
      <p>Use the same approach for support. Ask who investigates a payout you cannot match to the payment records, who explains an account restriction and how a case moves between the sales organization and the underlying provider. A useful support contact can help you reach the right decision maker; it does not necessarily control every decision itself.</p>
      <p>If you are changing providers, establish what stays with the old account. Previous refunds, disputes, reserves and unsettled payments remain subject to the existing arrangement. Moving new sales does not automatically release held funds or move saved payment credentials.</p>
      <p>These are the moments that reveal whether the service suits your business. The category matters because it helps explain responsibilities. The delivered service matters because your staff and customers have to live with it.</p>
    </section>

    <section id="what-trolleys-offers" aria-labelledby="what-trolleys-offers-title">
      <h2 id="what-trolleys-offers-title">What that means when you consider Trolleys</h2>
      <p>Trolleys, an Etail Depot service, provides <Link href="/services/payment-facilitator" prefetch={false}>merchant services through a payment facilitator model</Link>. Our role includes merchant onboarding, payment acceptance and account support through our acquiring relationships. Your business is reviewed before payment acceptance is enabled, and the applicable agreement sets the permitted activity, fees and account conditions.</p>
      <p>For a Trolleys merchant, that conversation starts with the business itself. What do you sell? How do buyers order? When do you deliver? What is difficult about your current setup? Those answers help us discuss the account, checkout and operational support you need.</p>
      <p>We would rather discuss those details than ask you to choose Trolleys because a PayFac sounds more modern than an ISO. A good merchant service should be able to explain its value in the work it helps your company do.</p>
      <p>If you are considering a change, our <Link href="/use-cases/switch-merchant-services" prefetch={false}>switching merchant services page</Link> explains the review and transition considerations. Bring your current statement, website and any provider notices to the discussion. New account approval and setup come before moving live payments.</p>
      <p><Link href="/company/contact" prefetch={false}>Talk with our team about your merchant service needs</Link>. Choose the arrangement you can understand and operate confidently, with the responsibilities and terms clear before your customers depend on it.</p>
    </section>
  </BlogArticlePage>;
}
