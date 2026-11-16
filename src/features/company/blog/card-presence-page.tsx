import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardPresenceArticle } from "./card-presence-content";

export function CardPresencePage() {
  return <BlogArticlePage article={cardPresenceArticle}>
    <p>A customer is standing at your counter, looking at their phone. They open your website, pay for an item and show you the confirmation. You hand over the purchase. From the shop floor, the whole sale happened in person. From the payment system’s point of view, the card payment happened online.</p>
    <p>That distinction is easy to miss because “card present” sounds like a description of where somebody is standing. It is really about how the payment is accepted. A chip or contactless payment at a compatible reader is different from entering card details into a web checkout. Moving that checkout into a shop does not turn it into a terminal transaction.</p>
    <p>For a business selling through both a website and a counter, the useful question is not simply where the order came from. It is what happened when the customer paid, and whether your records preserve that story.</p>

    <section id="same-phone" aria-labelledby="same-phone-title">
      <h2 id="same-phone-title">The same phone, two ways to pay</h2>
      <p>A customer can tap their phone at your reader without taking out a plastic card. That can be a card-present payment. The same customer can select Apple Pay on your website and make an online payment. The wallet’s name has stayed the same; the way the business accepts the payment has changed.</p>
      <p>Apple’s own instructions separate paying near a contactless reader from paying in an app or on the web. For staff, that is a more useful distinction than “they used their phone.” Our article on <Link href="/company/blog/credit-cards-and-digital-wallets" prefetch={false}>cards and digital wallets</Link> looks more closely at what the wallet changes.</p>
      <p>EMVCo explains that contactless chip payments generate a security code for each transaction. A web checkout does not become that kind of contactless transaction just because somebody scans a QR code to open it. The code is a route to the page. The payment still uses the checkout reached through that page.</p>
      <p>Typing a card number beside the customer is another situation to check with your provider. Do not assume manual entry has the same classification, price or protections as a successful chip or tap. Ask how that entry method appears in your transaction report and how it is priced under your agreement.</p>
      <p>This matters when choosing equipment, but it also matters on a busy afternoon when the usual payment method is unavailable. Staff need a supported alternative and a clear way to recognize it in the records afterward. “Taken in store” is too broad a description to answer either question.</p>
    </section>

    <section id="one-order" aria-labelledby="one-order-title">
      <h2 id="one-order-title">One order can contain both</h2>
      <p>Consider the difference between paying online for collection and reserving something online to pay when you arrive. In the first case, collection completes the handover. It does not change the earlier payment. In the second, a tap at collection can be the first payment for that order.</p>
      <p>A deposit creates a third possibility. The customer pays part online and the balance at the counter. The order is one purchase, but there are two payment records. The later tap does not change how the deposit was accepted, and the deposit must still reduce what the customer owes.</p>
      <p>The practical risk is a disconnected till. If staff start a fresh sale for the full price without seeing the deposit, a smooth collection can become a duplicate payment complaint. A useful order view shows the agreed total, payments already collected and the balance left to pay before staff request another payment.</p>
      <p>Shopify POS, for example, supports taking partial payments and returning to the order to collect its outstanding balance when the required options are enabled. Its instructions also flag a limitation: editing, refunding or exchanging an item on an order paid in multiple payments prevents further payments on that order. That is a reason to test the actual platform workflow, not assume every checkout behaves alike.</p>
      <p>Keep each payment reference attached to the order. If the customer later returns the purchase, staff need to find the payments that funded it and follow the provider’s refund process for those transactions. A note saying “paid at pickup” should not erase the earlier deposit. The customer should be able to understand the receipts without explaining the purchase to your team again.</p>
    </section>

    <section id="handover" aria-labelledby="handover-title">
      <h2 id="handover-title">The payment record cannot tell the whole story</h2>
      <p>A successful chip or tap is useful payment evidence. It does not, by itself, describe which goods left the shop or prove that the agreed service was delivered. Payment security and fulfillment answer different questions.</p>
      <p>Square’s guidance for disputes about goods not received makes this distinction concrete. For collection, it asks for records identifying the goods, location and time of pickup, along with customer acknowledgement or applicable verification evidence. The exact evidence required depends on the dispute and provider; no single receipt guarantees the outcome.</p>
      <p>It is worth deciding how you will record collection before the first customer arrives. A named employee can mark the order collected, connect that action to the correct purchase and retain the acknowledgement required by your process. That small handover record may be more useful later than another screenshot showing only that payment succeeded.</p>
      <p>A business can offer online checkout and local collection without making the customer think about payment categories. Behind the counter, however, the distinction should remain visible. The customer sees one purchase. Your team needs to see how it was paid and how it was completed.</p>
    </section>
  </BlogArticlePage>;
}
