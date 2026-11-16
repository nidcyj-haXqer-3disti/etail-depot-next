import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { websiteGatewayArticle } from "./website-gateway-content";

export function WebsiteGatewayPage() {
  return <BlogArticlePage article={websiteGatewayArticle}>
    <p>Imagine the handoff meeting for a new website. The developer opens checkout on a phone, completes a test purchase and shows you the confirmation. It looks good. You approve the work.</p>
    <p>A month later, a customer asks about a payment you cannot find in the order list. Your employee can open the website dashboard but not the gateway. The only person who knows how the two connect has moved on to another project.</p>
    <p>Nothing about the original demonstration was necessarily false. It just answered a smaller question than your business needed to ask.</p>
    <p>Integrating a payment gateway into a website should leave you with a checkout your business can operate. The connection, the records and the responsibility for keeping them working all belong in the scope before the build starts.</p>

    <section id="choose-what-you-can-maintain" aria-labelledby="choose-what-you-can-maintain-title">
      <h2 id="choose-what-you-can-maintain-title">Buy the connection you can maintain</h2>
      <p>A custom website does not automatically need a custom payment system. Start with what your existing store platform already supports. A maintained connector may cover your checkout, payment status and refunds without commissioning those features again.</p>
      <p>Check the particular connector, account and platform version together. Ask where refunds are issued, which payment methods are supported and who fixes a compatibility problem after an update. A logo on a plugin listing does not answer those questions.</p>
      <p>A provider hosted payment page can be another option where available for your account. It moves more of the payment screen to the provider. It does not necessarily connect the result to your inventory, booking or order system. If someone must manually match the payment to the order, include that work in the decision.</p>
      <p>Embedded checkout gives you another arrangement: the provider supplies payment components within your website, while your application still has work to do around them. For Cybersource Unified Checkout, the documented setup includes account enablement, an authenticated server request and browser components. It is more than pasting a permanent frame into a page.</p>
      <p>The sensible choice is the one that fits both the sale and the people who will maintain it. A small store should not have to commission a software project to replace a connection its platform already supports. A business with a specialized ordering process should not assume that a payment link will manage that process for it.</p>
    </section>

    <section id="keep-the-order-in-control" aria-labelledby="keep-the-order-in-control-title">
      <h2 id="keep-the-order-in-control-title">Your order system has to remain in control</h2>
      <p>A shopper can change a quantity, apply a promotion or choose a delivery option. The website has to turn those choices into an amount it can stand behind. That calculation should come from trusted product and pricing records on the server, not an amount the browser asks the gateway to charge.</p>
      <p>The return journey matters just as much. Before treating an order as paid, the application needs to verify the payment result and match it to the expected order, amount and currency. A success message in the browser is not sufficient evidence. OWASP’s integration guidance also calls for authenticated notifications and protection against fulfilling the same order more than once.</p>
      <p>For a business owner, the useful question is concrete: if the customer closes the tab immediately after paying, how will my team know whether to send the order? Ask the developer to demonstrate that situation in the test environment and explain where an uncertain result appears.</p>
      <p>Keep the gateway transaction reference beside the order reference. That relationship lets customer service start with the customer’s order and find the corresponding payment without guessing from a name or a similar amount. It also gives the person investigating a missing update something useful to search.</p>
      <p>These details are worth resolving before choosing the shape of the Pay button. They determine whether your staff can trust the records after the first busy day.</p>
    </section>

    <section id="a-handoff-that-survives-the-project" aria-labelledby="a-handoff-that-survives-the-project-title">
      <h2 id="a-handoff-that-survives-the-project-title">The handoff should survive the project</h2>
      <p>Your business should retain appropriate administrative access to its store, hosting and payment accounts. Give developers the access their work requires, with separate users where supported. Agree who can replace credentials and remove old access without taking checkout offline.</p>
      <p>That does not mean putting secret keys into a handover email. Keep production secrets in protected server settings, outside public source and browser code. The handoff should identify where they are managed, who is authorized to manage them and how to recover access.</p>
      <p>Have the developer show an employee how to locate an order, find its gateway record and follow the supported refund process. If the employee has to ask the developer for a special command every time, either the operating process or the support agreement needs more work.</p>
      <p>Also name the person responsible for changes after launch. A new domain, store update or checkout extension can affect the connection. Unified Checkout sessions, for example, specify the website origins allowed to load checkout. A domain change should prompt a configuration review rather than an assumption that the old connection will follow it.</p>
      <p>Using provider payment fields does not remove every security responsibility. PCI SSC distinguishes embedded forms from redirects for a specific SAQ A script security eligibility condition. Work with your payment provider and the entity accepting your compliance assessment to determine what applies to the actual setup. Treat that as part of ongoing ownership, not a badge the developer adds at launch.</p>
      <p>A useful handoff leaves a short record of the installed integration, the accounts it uses, the person responsible for updates and where staff go when an order and a payment disagree. It should still make sense to the next person hired.</p>
    </section>

    <section id="connect-the-right-trolleys-account" aria-labelledby="connect-the-right-trolleys-account-title">
      <h2 id="connect-the-right-trolleys-account-title">Start with the right Trolleys account</h2>
      <p>With Trolleys, an Etail Depot service, start from the approved store details in your welcome email. Match the store name or DBA and Merchant ID to the gateway Organization ID before your web team creates credentials or connects checkout. Where a company has several stores or merchant accounts, this mapping deserves an explicit check.</p>
      <p>The Back Office Operations Portal supports merchant account activity and funding records. Cybersource Business Center handles the store’s gateway access and payment tools. They serve different purposes; a login to one is not a substitute for the other. The standard merchant setup does not require your developer to integrate the Back Office Operations Portal API.</p>
      <p>Our <Link href="/developers/getting-started" prefetch={false}>approved account setup guidance</Link> explains that handoff and the available connection routes. If a supported Shopify or WooCommerce connection fits your store, follow its specific setup. For a custom website, give your developer the <Link href="/developers/api-reference" prefetch={false}>Unified Checkout integration reference</Link> and confirm account enablement and payment methods before implementation.</p>
      <p>Bring your website platform, selling process and support expectations to a <Link href="/company/contact" prefetch={false}>Trolleys merchant services conversation</Link>. Confirm the supported connection and responsibilities before buying development work. Your web team owns the website implementation; the merchant account and gateway setup need to match it.</p>
    </section>

    <p>The best handoff is not a video of a successful payment. It is a business that can answer its next customer, with the right access and someone accountable for keeping checkout working.</p>
  </BlogArticlePage>;
}
