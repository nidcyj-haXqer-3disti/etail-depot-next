import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { isvPaymentsArticle } from "./isv-payments-content";

export function IsvPaymentsPage() {
  return <BlogArticlePage article={isvPaymentsArticle}>
    <p>The proposal promises a payment connection, help onboarding merchants and a possible share of processing revenue. It is easy to picture the feature appearing in your software.</p>
    <p>The harder question is which of your customers will actually be able to use it.</p>
    <p>An independent software vendor, or ISV, builds software that other businesses use. Those businesses may share the same product but collect money in very different ways. One delivers immediately. Another takes a deposit months before completing the work. Another bills repeatedly under an ongoing agreement.</p>
    <p>A useful payment partnership has to make sense for those businesses as well as for your product team. That is where a conversation with <Link href="/use-cases/software-platforms/partnerships" prefetch={false}>Trolleys, an Etail Depot service</Link>, should begin.</p>

    <section id="the-merchants-you-already-serve" aria-labelledby="the-merchants-you-already-serve-title">
      <h2 id="the-merchants-you-already-serve-title">Start with the customers already using your software</h2>
      <p>Before estimating payment revenue across your entire customer base, choose a small set of representative business profiles. Include the ordinary cases and the ones your sales or support team finds harder to place.</p>
      <p>Explain what each business sells, where it operates, when it delivers and how it collects payment. Include a realistic monthly processing estimate, the typical order and the largest expected order. These figures describe different aspects of the business. An average alone can hide the occasional large sale or the seasonal peak that matters to the proposed arrangement.</p>
      <p>You can begin that discussion with business profiles rather than customer credentials or card details. Ask the partner which cases appear to fit its offering, which need further review and what information a merchant would need to provide. An initial discussion of suitability is not an account approval.</p>
      <p>For Trolleys, each merchant applies and is reviewed for its own business activity. A software partnership does not automatically approve the businesses using your product. Supported payment methods, account terms and the integration are confirmed for the proposed setup.</p>
      <p>This should inform the launch message. If payment acceptance depends on application and approval, explain that before a merchant rearranges its checkout around the feature. If a business cannot use the proposed service, agree how your software will handle that outcome. A clear answer is better than an activation button that leads to a surprise.</p>
    </section>

    <section id="the-role-your-team-will-take" aria-labelledby="the-role-your-team-will-take-title">
      <h2 id="the-role-your-team-will-take-title">Choose the role your team can maintain</h2>
      <p>Being an ISV describes your software business. It does not make the company a payment facilitator or establish its authority over merchant funds.</p>
      <p>Payment partnerships can involve referring merchants, building a connection or reselling agreed services. Cybersource documents these as distinct partner models. Visa Acceptance also describes a technology partner route that lets a software company offer a payment connection without becoming a reseller or payment facilitator. Those are provider programs with their own agreements, not interchangeable names for the same responsibility.</p>
      <p>Decide which parts your company will own: the software experience, the integration, merchant communication, first response to support requests or other agreed work. If the proposed role involves payment services that require registration, confirm the requirements with the sponsoring partner. Visa maintains a separate third party agent registration process; software branding is not a substitute for it.</p>
      <p>In a Trolleys partnership, your software connects purchases to the merchant account and checkout enabled for that business. Available records, delivery methods and permissions depend on the agreed integration. Our team supplies the documentation and configuration details; your development team needs a named owner for the application connection and its maintenance.</p>
      <p>Keep the <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>account relationship</Link> explicit. Your own software subscription is one sale. Payments your customers collect from their customers belong to another relationship. Taking a commission, holding funds or splitting a payment requires its own approved arrangement.</p>
    </section>

    <section id="the-first-support-ticket" aria-labelledby="the-first-support-ticket-title">
      <h2 id="the-first-support-ticket-title">Discuss the first awkward support ticket</h2>
      <p>Suppose a merchant calls because its customer has paid, but the job in your software still shows an outstanding balance. The merchant needs an answer before asking the customer to pay again.</p>
      <p>Your software team can investigate whether the result reached the application and matched the correct job. The payment support team can help investigate the payment record. Agree who receives the request, which safe references travel with it and who keeps the merchant informed. Do not ask the merchant to carry technical messages between two teams that have never agreed how to work together.</p>
      <p>Trolleys partnership support can cover account access, payment status, refunds and payouts. The agreement defines the division between merchant support, software questions and issues with the underlying purchase. That division should be understandable to your support staff, not just to the people who negotiated the contract.</p>
      <p>Try the handoff during a controlled test. Cybersource’s partner guidance uses a merchant sandbox account and the relevant solution identification to test a connection. Follow the requirements supplied for your integration, then use our <Link href="/developers/testing" prefetch={false}>payment testing guidance</Link> to examine declines, interrupted attempts and verified results. A sandbox success tests the software; it does not approve a merchant or establish live funding terms.</p>
      <p>Give support staff an agreed escalation route and response expectations. They should know what they can resolve, what requires the provider and when to update the merchant even if an investigation is still open.</p>
    </section>

    <section id="the-commercial-case" aria-labelledby="the-commercial-case-title">
      <h2 id="the-commercial-case-title">Make the commercial case with merchants who can use it</h2>
      <p>A large subscriber count can make a payment revenue forecast look persuasive. It does not tell you how many businesses will apply, qualify, activate the connection or keep using it.</p>
      <p>Build the forecast around those separate decisions. Ask what activity earns any agreed payment income, how it is calculated and when it is paid. Confirm the treatment of refunds, adjustments, support costs, minimum commitments and termination. A proposed share of revenue means little until the agreement defines the revenue being shared.</p>
      <p>For a Trolleys partnership, processing, platform and implementation charges are confirmed in the agreement. Revenue sharing is subject to its own terms. Compare the resulting income with the work your team will perform, including integration maintenance and merchant support. Avoid counting every subscriber’s sales as immediately available processing volume.</p>
      <p>Start with a manageable group of approved merchants and follow them beyond activation. Can they find their payments? Are repeated support questions pointing to a missing explanation or a software problem? Can your team resolve an issue without losing the merchant between organizations? Use that evidence before expanding the rollout.</p>
    </section>

    <p>Bring your customer profiles, current payment workflow and the responsibilities your team wants to take on to a <Link href="/company/contact#platforms" prefetch={false}>Trolleys partnership discussion</Link>. Those details give us something concrete to evaluate together.</p>
    <p>The right payment partner should help you serve the businesses that chose your software. When those merchants can get set up, use the connection and get a clear answer when something needs attention, the partnership has a stronger reason to grow.</p>
  </BlogArticlePage>;
}
