import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { accountTakeoverArticle } from "./account-takeover-content";

export function AccountTakeoverPage() {
  return <BlogArticlePage article={accountTakeoverArticle}>
    <p>A returning customer is usually welcome news. Their account already has a name, purchase history and perhaps a saved payment method. Your staff have fewer questions because the relationship appears to be established.</p>
    <p>Account takeover fraud exploits that familiarity. Someone gains unauthorized access to an existing account and uses the access for their own purposes. The account history can be genuine even when the person placing the next order is not its owner.</p>
    <p>The important question becomes what changed after the login. A payment review that starts only when the buyer presses Pay can miss the account changes that made the purchase possible.</p>

    <section id="listen-to-the-customer-report" aria-labelledby="listen-to-the-customer-report-title">
      <h2 id="listen-to-the-customer-report-title">A customer complaint may be the first useful signal</h2>
      <p>One route into an account is a password reused elsewhere. Criminals try credentials exposed at another service against existing accounts, a practice known as credential stuffing. Phishing and stolen access can also put an account under someone else’s control. An unauthorized login does not, on its own, tell you where the compromise began.</p>
      <p>The customer may notice the consequences first: an order they did not place, an unfamiliar delivery address or a missing stored balance. New York’s Attorney General advises businesses to connect these reports with security monitoring rather than treating each as an isolated customer service problem.</p>
      <p>That connection needs a person and a process. If support hears that the customer cannot access their account, who checks the recent changes? If fulfillment sees a suspicious order, who can determine whether the customer has already reported a problem? Separate teams can each hold half the explanation.</p>
      <p>Read events together. A new device may simply be a new phone. A changed address may be a move or a gift. An unexpected recovery change followed by an unfamiliar order deserves closer attention, but no single signal should become an automatic accusation.</p>
      <p>For the customer, the first useful response is acknowledgment and a safe way to investigate. Saying “the order came from your account” merely restates the problem they are reporting.</p>
    </section>

    <section id="recover-control-of-the-account" aria-labelledby="recover-control-of-the-account-title">
      <h2 id="recover-control-of-the-account-title">Recover control, not just the password</h2>
      <p>A password reset can feel like the end of the incident. It may leave important work unfinished. OWASP’s recovery guidance explains that an attacker can retain an active session or change the email address, phone number or authentication methods used to recover access.</p>
      <p>Use the account provider’s established recovery process to verify the owner. Do not rely solely on contact details that were just changed, and do not automatically restore an older address that may itself be compromised. The recovery evidence needs to be independently trustworthy.</p>
      <p>With the verified owner and the team responsible for the system, review recovery settings and remove unauthorized changes. Address compromised authenticators, active sessions and outstanding recovery links or codes. The objective is to restore control and close the routes that could let the attacker back in.</p>
      <p>Meanwhile, someone needs to own the affected orders. Where your authority and provider process permit it, restrict risky pending actions while the incident is investigated. Preserve relevant timestamps, order references and account changes. Deleting suspicious activity can remove the explanation you will need later.</p>
      <p>Account recovery and payment recovery are separate pieces of work. Restoring a customer’s login does not cancel an order, reverse a payment or settle a dispute. Check what actually happened to each affected transaction before deciding what action is available.</p>
      <p>This is where a clear handoff matters. The person restoring access should be able to tell the payment team which orders need attention. The payment team should return a verified outcome, not leave customer service to infer it from a password reset.</p>
    </section>

    <section id="protect-your-merchant-access" aria-labelledby="protect-your-merchant-access-title">
      <h2 id="protect-your-merchant-access-title">Your own merchant login needs a separate response</h2>
      <p>A customer’s account on your store and your business’s account with a payment provider serve different purposes. Your website or commerce platform manages the shopper’s login. Your payment provider manages merchant portal access. An incident needs to reach the organization that can actually secure the affected account.</p>
      <p>If your team sees an unexpected merchant user, recovery change or financial instruction, open the provider through a known address and contact its established support route. Do not follow a supposed security alert into an unfamiliar login page. The FBI warns that criminals use convincing sites and search advertisements to capture account credentials.</p>
      <p>For a Trolleys merchant, identify the store, merchant account or gateway account involved when contacting our <Link href="/company/contact" prefetch={false}>account support team</Link>. Trolleys, an Etail Depot service, helps merchants with their account and payment connection. Your website team remains responsible for the shopper accounts it operates.</p>
      <p>Use the approved channel to share event times, references and the changes you did not authorize. Our <Link href="/developers/developer-tools#support-handoff" prefetch={false}>support guidance</Link> explains what to include and what to remove from diagnostics. Passwords, card details, API secrets and sign in codes do not belong in the report.</p>
      <p>If money has already moved without authorization, contact the relevant provider and financial institution promptly. Record whether the action is still pending or completed and what recovery has actually been requested. A request to stop or recover funds is not confirmation that the money has been returned.</p>
    </section>

    <section id="protect-the-next-sensitive-change" aria-labelledby="protect-the-next-sensitive-change-title">
      <h2 id="protect-the-next-sensitive-change-title">Make the next attempt harder</h2>
      <p>Strong sign in protection matters, but the controls after sign in matter too. OWASP recommends renewed authentication for sensitive actions and risk events. Changing recovery details or payment information should receive more scrutiny than browsing an order history.</p>
      <p>Use unique credentials and available multifactor authentication for business accounts. Review who can add users, change financial settings or perform payment actions. When responsibilities change, update access instead of allowing yesterday’s permissions to become permanent.</p>
      <p>Ask your website provider how it detects repeated login attempts, notifies customers of sensitive changes and handles a report that an account has been taken over. Test the recovery path as carefully as the login screen. A customer who loses a phone needs a workable process; an impostor should not get control simply by asking support to remove a security step.</p>
      <p>Payment authentication has a role too, but it addresses a different question. <Link href="/company/blog/how-3d-secure-works" prefetch={false}>3D Secure</Link> helps authenticate a cardholder during supported payment flows. It does not restore ownership of a compromised store account or undo changes already made there.</p>
    </section>

    <p>Keep the customer relationship worth trusting. That means helping the real owner regain control, following the affected money and making sure the next person using the account is entitled to be there.</p>
  </BlogArticlePage>;
}
