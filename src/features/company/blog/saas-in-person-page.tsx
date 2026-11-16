import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { saasInPersonArticle } from "./saas-in-person-content";

export function SaasInPersonPage() {
  return <BlogArticlePage article={saasInPersonArticle}>
    <p>A broken card reader can become your software company’s support ticket. The merchant opened your app, selected a job and tried to take a payment. From their side of the counter, the distinction between your software and someone else’s device is not much help.</p>
    <p>That is a significant change for a SaaS business. Adding in-person payments brings part of the merchant’s working day into your product: the customer waiting to leave, the employee trying another reader, the owner asking whether a payment went through. The first successful integration is only the beginning of that relationship.</p>
    <p>There is a good reason to take it on. Software that already manages the appointment, purchase or service job can put payment in the right context. The merchant should be able to finish the work and collect what is due without rebuilding the sale somewhere else. But that benefit depends on what happens around the card reader as much as what happens inside it.</p>

    <section id="merchant-and-device" aria-labelledby="merchant-and-device-title">
      <h2 id="merchant-and-device-title">A reader has to belong somewhere</h2>
      <p>For a platform serving several businesses, discovering a nearby device is not enough. The app needs to know which merchant and location it is working for, which order is being paid and which staff member can start the transaction. These relationships need to survive a staff change, a new location and a replacement device.</p>
      <p>Adyen’s terminal documentation makes the distinction concrete: before accepting payments, a terminal must be assigned to a store or a merchant account representing a store, then the physical terminal must be activated through its boarding process. Device assignment also has its own access permissions. A reader arriving in a box is not the same thing as a merchant being ready to trade.</p>
      <p>Keep those states understandable in your product. Account approval, device delivery, assignment and readiness answer different questions. If something is incomplete, the merchant needs to see what remains and who can resolve it. A single “connected” label is not useful if it hides a step that still prevents payment.</p>
      <p>The order connection matters just as much. An online deposit and a balance collected after service should remain traceable to the same job, with separate payment records. Our article on <Link href="/company/blog/accept-payments-online-and-in-person" prefetch={false}>accepting payments across online and in-person channels</Link> explores that handoff. Adding a terminal should make the merchant’s records easier to understand.</p>
    </section>

    <section id="payment-recovery" aria-labelledby="payment-recovery-title">
      <h2 id="payment-recovery-title">The first failure is part of the product</h2>
      <p>Consider a technician collecting the balance on a completed job. The customer presents a card, but the app never receives the result. The technician is standing in front of the customer with a question the product must help answer: was the payment taken?</p>
      <p>Adyen documents this exact kind of uncertainty. Its recovery flow checks the original transaction when the response is missing, then retrieves the payment outcome. A status check reporting that a transaction was processed can still lead to an approved, cancelled or declined result. The application needs the actual outcome before deciding what to show or do next.</p>
      <p>Give the merchant an understandable recovery path instead of leaving them to guess whether to collect again. Keep the job, merchant, device and payment references available to the support team. An employee should be able to report the problem without copying card details or asking a customer for their PIN.</p>
      <p>This is where a limited pilot earns its place. Test the ordinary job when a reader cannot be reached, a result is delayed or a device has been assigned incorrectly. Follow a later <Link href="/services/refunds" prefetch={false}>refund</Link> back to the original payment. Let the people who normally answer support calls handle the exercise. An engineer finding the answer in a log does not establish that a merchant can get help during a shift.</p>
    </section>

    <section id="after-the-launch" aria-labelledby="after-the-launch-title">
      <h2 id="after-the-launch-title">The work continues after you ship</h2>
      <p>Stripe’s guide to adding in-person payments describes work beyond the integration: selecting hardware, getting it to merchants, configuring it and maintaining service. You can obtain much of that capability from a provider. The commercial arrangement still needs to say who owns each task and what your team must do when a merchant calls.</p>
      <p>Replacement terms are worth reading before launch. Adyen, for example, distinguishes returning a faulty terminal from a replacement service with its own agreement, coverage and fees. “The provider handles hardware” is too vague to tell a merchant when they can take payments again. Ask how a replacement is requested, who configures it and what the merchant can do while waiting.</p>
      <p>Software maintenance continues on the device too. Adyen publishes separate automatic and manual terminal update arrangements, with different scheduling and monitoring responsibilities. Your team needs to understand the chosen arrangement and how changes are tested with your application. A working launch version is not a plan for the next release.</p>
      <p>Using a phone can remove a separate reader from some workflows, but it does not remove the payment integration. Apple requires developers adding Tap to Pay on iPhone to work with a supported payment service provider, obtain the relevant entitlement, integrate the required interfaces and submit the app for review. Those are app developer responsibilities, not steps every merchant must perform. An existing online checkout alone does not provide phone acceptance.</p>
      <p>Build the business case around the service you can sustain. During a pilot, record the time spent activating merchants, answering payment questions, replacing equipment and maintaining the connection. Put those costs beside any expected payment revenue. Another platform’s reported growth or launch time is not a forecast for yours.</p>
      <p>The opportunity is strongest when payment completes a job your software already does well. Choose the provider and operating arrangement that let your team preserve that advantage. The merchant needs the appointment, service or sale to finish reliably, including on the day a reader stops working.</p>
    </section>
  </BlogArticlePage>;
}
