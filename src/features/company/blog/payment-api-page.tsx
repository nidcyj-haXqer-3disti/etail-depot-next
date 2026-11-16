import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { paymentApiArticle } from "./payment-api-content";

export function PaymentApiPage() {
  return <BlogArticlePage article={paymentApiArticle}>
    <p>A customer asks a simple question: “Did my payment go through?” Your employee opens the order, checks another screen, searches an email and asks a colleague. The website accepts payments, but the business still has to assemble the answer by hand.</p>
    <p>A well integrated payment API can reduce that work. An API is a documented way for software to request an action or retrieve information from another system. In payments, it can connect an order to actions such as authorization, capture, a refund or a status check, within the permissions and services available to the account.</p>
    <p>The business value is the connection between those actions and the work your people already do. A working payment request is only part of that connection. Your staff also need to know which order it belongs to and what they can do next.</p>

    <section id="the-order-drives-the-payment" aria-labelledby="the-order-drives-the-payment-title">
      <h2 id="the-order-drives-the-payment-title">The order should drive the payment</h2>
      <p>Start with a purchase, not a list of API features. Your business has agreed to sell particular goods or services, for a price, in a currency, through a particular merchant account. The payment request should reflect that agreement.</p>
      <p>For a custom website, your server should establish the amount from trusted order information and select the correct account. A value sent from the customer’s browser needs validation. OWASP’s payment integration guidance makes this distinction explicit: calculate totals on the server and verify payment details before fulfilling an order.</p>
      <p>This becomes especially important when one company operates several stores or trading names. A technically valid request to the wrong account can create an operational problem even if the customer’s card is accepted. Keep the store, order and gateway account connected from the start.</p>
      <p>The action itself also needs a clear meaning. Card authorization asks for approval and can place a hold on available funds. Capture submits the authorized amount for the next stage of payment processing. Some checkout configurations request authorization and capture together; others separate them. Your developer should implement the approach approved for your account and delivery model.</p>
      <p>Cybersource’s capture documentation describes the link back to the original authorization and the need to reconcile capture requests with processor reports. Submitting a capture is not the same event as receiving a deposit in your business bank account.</p>
      <p>Ask the developer to describe the result in language your team will use: waiting for payment, authorized, captured, declined or needing review. Those labels must reflect the provider’s actual records. A request that completed without a software error is not enough, by itself, to mark the customer’s order paid.</p>
    </section>

    <section id="an-ordinary-customer-question" aria-labelledby="an-ordinary-customer-question-title">
      <h2 id="an-ordinary-customer-question-title">The real test is an ordinary customer question</h2>
      <p>Suppose a customer buys two items for a total of $240. The payment is captured. Later, they return the $60 item and your team approves a partial refund. The customer should not need to understand the gateway, and the employee should not have to recreate the payment history from memory.</p>
      <p>The integration should connect that refund to the right original payment and show its recorded result against the order. It should retain the original $240 sale and the separate $60 adjustment. Replacing the sale with a new $180 payment record would hide what actually happened.</p>
      <p>Cybersource’s linked refund service uses the original capture reference. Its documentation also calls for controlled access to refund operations through the merchant’s customer service process. A refund button should therefore represent an authorized business action, not unrestricted access for anyone who can load a page.</p>
      <p>A useful record connects your order number, the merchant account, the payment operation and any later refund. Your employee can start with the number the customer knows and find the relevant provider record. Support should not need the customer’s full card number or your private API credentials to investigate the order.</p>
      <p>Now change one detail: the original payment request timed out. Cybersource warns that a missing response can leave the transaction outcome unknown even when processing succeeded. Sending another payment immediately can create a duplicate. The connection needs a way to investigate the original attempt and follow the provider’s recovery process.</p>
      <p>That unresolved state should be visible to the people handling the order. They need to know whether to wait, investigate or take an approved next action. Neither a blank screen nor an automatic “please pay again” message gives them a reliable answer.</p>
      <p>When reviewing an integration, ask to see this complete story: the purchase, the partial refund and the investigation of an interrupted result. It tells you more about the business you can run on the connection than a demonstration of the first successful payment alone.</p>
    </section>

    <section id="choose-the-right-connection" aria-labelledby="choose-the-right-connection-title">
      <h2 id="choose-the-right-connection-title">Choose how much your business needs to build</h2>
      <p>You may need connected payments without needing a custom API project. A supported payment app or plugin can already provide much of the connection your store requires. Building another version only makes sense when it solves a business need the supported option does not meet.</p>
      <p>Trolleys, an Etail Depot service, helps merchants prepare payment acceptance for their approved accounts. Our <Link href="/developers/getting-started" prefetch={false}>Getting started information</Link> separates the store’s merchant account details, gateway access and available connection options. Shopify and WooCommerce have their own setup paths; a custom website has different development responsibilities.</p>
      <p>For a Trolleys merchant using a custom website, our <Link href="/developers/api-reference" prefetch={false}>API reference</Link> explains the Cybersource Unified Checkout connection. Your website needs a secure server to create checkout sessions and verify results. The customer’s browser displays the hosted checkout. Private API credentials stay on the server. These are the gateway’s APIs, not a separate proprietary Trolleys API.</p>
      <p>The Back Office Operations Portal serves another purpose: following merchant activity, funding and disputes. Standard merchant checkout does not require a separate API integration with that portal. Knowing this boundary helps a business avoid paying for connections it does not need.</p>
      <p>Choose the work you want to improve before commissioning the code. Perhaps staff need to find payments from an order, process permitted refunds or understand unresolved attempts. Agree which tasks the integration will support, who maintains it and what your team will see when an action cannot be completed.</p>
      <p><Link href="/company/contact" prefetch={false}>Talk with our team about your website and payment workflow</Link>. The right connection should make a customer’s payment easier to accept and easier for your business to explain afterward.</p>
    </section>

    <p>You do not need to read an API response to judge the result. Ask the person handling orders whether they can confidently answer the customer’s question.</p>
  </BlogArticlePage>;
}
