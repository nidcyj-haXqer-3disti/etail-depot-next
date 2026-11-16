import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { dunningEmailsArticle } from "./dunning-emails-content";

export function DunningEmailsPage() {
  return <BlogArticlePage article={dunningEmailsArticle}>
    <p>A subscription renewal fails, and an automated email tells the customer their account is at risk. Yesterday, they were using a service they expected to keep. Today, they are being asked to act before a deadline. The payment problem may be routine. The change in how your business speaks to them is harder to overlook.</p>
    <p>A failed attempt does not establish that someone has decided to stop paying. It tells you a payment did not complete. The reason, the action needed and the effect on the customer’s account still need to be understood.</p>
    <p>Dunning is the billing term for following up on an unpaid amount. For subscription businesses, dunning emails often begin after an automatic collection attempt fails. Their job is to help resolve that specific problem. A sequence of increasingly forceful subject lines is useful only if the instructions inside still fit the account.</p>
    <p>Before deciding how urgent the email should sound, decide what the customer can actually do.</p>

    <section id="useful-action" aria-labelledby="useful-action-title">
      <h2 id="useful-action-title">Ask for the action that can resolve it</h2>
      <p>A replacement payment method, a bank authentication step and an unpaid invoice awaiting manual payment are different situations. Stripe’s customer-email documentation distinguishes failed card payment notices from payment-confirmation requests, including payments that need 3D Secure authentication. Asking someone to replace a working card when they need to confirm a payment adds work without addressing the cause.</p>
      <p>Use the provider’s recorded outcome, not an assumption about the customer’s finances. A delayed response or an interrupted browser session is not enough to declare that a charge failed. Confirm the payment and invoice status before asking someone to pay again. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>card declines</Link> explains why different outcomes call for different responses.</p>
      <p>The message should identify your business, the subscription or invoice, the amount still due and the next action. If another collection attempt is scheduled and permitted, explain what will happen and whether the customer needs to intervene. If you need new details, direct them to the secure billing page. Do not ask them to reply with card numbers or security codes.</p>
      <p>There is a trust problem here as well as a billing problem. The FTC describes account and payment warnings as common phishing themes and advises people to verify suspicious messages through a website or contact method they already know. Give customers a way to reach Billing through their usual account, so trusting an unexpected email link is not their only route to resolution.</p>
      <p>A specific subject such as “Action needed for invoice [reference]” tells the reader more than another urgent warning. Inside, describe the required action in the terms the customer will see on the destination page. If the button says review invoice, it should lead to that invoice, rather than an account homepage where the customer must search for the problem.</p>
      <p>Explain any real service consequence with its date and conditions. Do not invent a grace period, promise uninterrupted access or threaten cancellation sooner than your actual terms and process allow. A customer who knows what happens next can make an informed decision. A countdown added solely to make the email more persuasive creates a different kind of problem.</p>
    </section>

    <section id="follow-the-outcome" aria-labelledby="follow-the-outcome-title">
      <h2 id="follow-the-outcome-title">Let the account determine the next message</h2>
      <p>Consider what happens after the customer follows the instructions. They update their card. Your system saves it. The next attempt still uses the old one.</p>
      <p>That is a configuration problem an apologetic subject line cannot solve. Stripe documents that a subscription’s default payment method takes priority over the customer’s general default. Updating only the latter can leave retries using the former. It also documents failures that cannot be retried without a new payment method. More attempts are not a universal recovery strategy.</p>
      <p>Check that the recovery page changes the details used for the relevant subscription and shows the invoice’s actual outcome. A saved card is not evidence that the balance has been paid. Our article on <Link href="/company/blog/customer-billing-portals" prefetch={false}>customer billing portals</Link> looks at what customers need to see when they finish a billing task.</p>
      <p>Follow-up needs the same current information. Stop reminders for a balance that has been paid, credited or voided. Review disputed charges and agreed payment arrangements before continuing the ordinary sequence. If the customer pays through another route while a retry is pending, make sure the billing process accounts for that payment before further collection.</p>
      <p>This is also where overlapping tools become visible to the customer. A provider notice, a subscription app and a marketing automation can each send a technically correct email while together giving conflicting instructions. Decide which system owns each message and review the combined experience, including the confirmation after resolution.</p>
      <p>Judge the result by invoices resolved and payments actually collected. Keep automatic retry recoveries distinct from customer-assisted payments where the records allow it; an email sent before payment does not prove the email caused it. Track complaints and repeated requests for help too. Recovery that leaves the customer unsure whether they were charged twice is unfinished work.</p>
      <p>Email opens are particularly weak evidence. Apple’s Mail Privacy Protection can download remote content in the background regardless of whether someone engages with a message. Even a genuine click shows only that the customer reached the next step, not that the invoice was paid.</p>
      <p>The strongest recovery email is one your billing process can stand behind. It says what happened, asks for something useful and stops asking once the problem is resolved. That gives a customer a reason to trust the next message you send.</p>
    </section>
  </BlogArticlePage>;
}
