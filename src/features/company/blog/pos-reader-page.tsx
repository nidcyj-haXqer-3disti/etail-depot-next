import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { posReaderArticle } from "./pos-reader-content";

export function PosReaderPage() {
  return <BlogArticlePage article={posReaderArticle}>
    <p>You want to take a card payment at the counter. The conversation quickly becomes a choice of screens, subscriptions, inventory tools and a new dashboard. Before comparing the packages, it is worth asking how much of that work your business already has covered.</p>
    <p>Your website may already hold the order. Your booking software may already know the service and the balance due. If those records work well, adding in-person payments does not automatically justify replacing them. The missing piece might be a supported payment connection.</p>
    <p>A card reader handles the customer’s card or wallet interaction. POS software manages more of the sale, such as the basket, pricing, receipts and related records. Stripe’s explanation separates those functions while noting that software and hardware can be sold together. In practice, the product labels overlap.</p>
    <p>A small device can run substantial software. Stripe’s Apps on Devices, for instance, supports running a POS application on compatible smart readers. That requires an eligible setup and an existing Android app or the resources to build one. Buying the hardware does not by itself supply a finished retail system.</p>
    <p>That is why the size of the screen is such a poor starting point. First decide where the sale will be managed. Then decide how the customer will pay.</p>

    <section id="finish-the-existing-sale" aria-labelledby="finish-the-existing-sale-title">
      <h2 id="finish-the-existing-sale-title">An existing order needs a payment, not another order</h2>
      <p>For a business that occasionally collects payment in person, a reader connected to existing software may be enough. The useful sequence is short: staff find the order, collect the correct outstanding amount and leave a payment reference against that order. Whether a particular product can do this needs to be demonstrated.</p>
      <p>A standalone terminal offers a different arrangement. Adyen’s documented standalone flow starts with staff entering the transaction value directly on the device, then handing it to the customer. The payment can be found in Adyen’s account records afterward. The separate job of associating it with your sale still needs an owner.</p>
      <p>That can be a reasonable choice when payments are infrequent and the manual work is manageable. But be honest about what staff will do. Reading an amount from one screen, typing it into another and marking an invoice paid are operating steps. The hardware price does not show the time or corrections those steps may require.</p>
      <p>A connected reader is useful when it removes that repeated entry. Ask to see both directions: the order sends the amount to the device, and the confirmed result returns to the order. A reader that accepts the card but leaves someone to reconstruct the sale later has solved only part of the problem.</p>
      <p>The distinction also matters when something goes wrong. Staff need to find the original result if a screen closes or a connection drops. They should not have to create a replacement order just to investigate it. Our article on <Link href="/company/blog/how-a-pin-pad-terminal-works-for-card-payments" prefetch={false}>PIN pad terminals</Link> looks more closely at the handoff between the sale and the device.</p>
      <p>Confirm the specific reader, software, account and connection before buying. Stripe’s reader documentation, for example, distinguishes supported software integrations and device availability. A familiar manufacturer’s name or a contactless symbol cannot establish that a device works with the application you intend to keep.</p>
    </section>

    <section id="pay-for-work-removed" aria-labelledby="pay-for-work-removed-title">
      <h2 id="pay-for-work-removed-title">The extra system should earn its place</h2>
      <p>A fuller POS becomes easier to justify when the counter is where staff build the sale. Mixed baskets, controlled discounts, shared stock and regular returns call for more than collecting an amount. Our article on <Link href="/company/blog/point-of-sale" prefetch={false}>what a point-of-sale system does</Link> explains the records those jobs depend on.</p>
      <p>The case for an upgrade is strongest when you can name the work it will remove. Perhaps staff currently maintain the same product twice or reconcile counter payments by hand. Describe that problem to the supplier and watch the proposed setup handle it. A long feature list is less persuasive than seeing a recurring problem disappear.</p>
      <p>Compare the whole arrangement over the same period. Ask for hardware purchase or rental terms, required software subscriptions, payment charges, connections, accessories and support. Include implementation and the cost of keeping any existing software you will still need. Do not assume every offer charges for every item, or that a low device price makes the overall offer cheaper.</p>
      <p>There is an operating commitment too. Stripe’s smart readers receive software updates automatically, with instructions to keep them connected to power so updates can happen outside selling hours. Other products have their own requirements. Establish who handles updates, who replaces a failed reader and which company owns a support issue involving both the payment device and the sales app.</p>
      <p>Security claims deserve the same specificity. PCI SSC says an approved payment terminal does not, by itself, guarantee the merchant’s PCI DSS compliance or reduce its scope. Ask the provider to explain the responsibilities of the proposed configuration. A device approval and a complete merchant setup answer different questions.</p>
      <p>Finally, consider what happens if the arrangement stops fitting. Check contract terms, whether hardware can be reused with another provider, and how you retain the sales and payment records you need. Do this while the supplier is explaining the purchase, rather than discovering the limits during a move.</p>
      <p>A reader can be the right addition to an already organized business. A fuller POS can be worth paying for when it replaces fragmented work. Choose the setup that leaves your team with less retyping, fewer unresolved payments and one understandable account of each sale.</p>
    </section>
  </BlogArticlePage>;
}
