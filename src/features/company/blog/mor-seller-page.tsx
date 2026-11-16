import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { morSellerArticle } from "./mor-seller-content";

export function MorSellerPage() {
  return <BlogArticlePage article={morSellerArticle}>
    <p>Your customer recognizes your store. They choose a product, enter their card details and receive an order confirmation. Later, a different name appears beside the charge. The receipt mentions another company. An email about the purchase comes from somewhere else.</p>
    <p>There may be a perfectly reasonable explanation. A trading name, a reseller or a payment arrangement can put several names around one purchase. But the customer should not need to investigate those relationships to recognize an order or ask for help.</p>
    <p>That is the practical reason to understand merchant of record and seller of record. Before choosing either label for your business, make sure you can explain who sold the order.</p>

    <section id="what-the-labels-mean" aria-labelledby="what-the-labels-mean-title">
      <h2 id="what-the-labels-mean-title">Two labels are not necessarily two companies</h2>
      <p>Merchant of record usually identifies the entity taking the merchant role for the payment transaction. Seller of record identifies the selling entity in the arrangement being described. A business selling directly can hold both roles. In other arrangements, responsibilities are divided among a platform, reseller and product supplier.</p>
      <p>Do not assume every provider draws the line in the same place. Stripe’s comparison explicitly describes both shared and separate roles. The useful question is what those words mean in the agreement for your particular sales, including the obligations your business keeps.</p>
      <p>A reseller arrangement makes the distinction concrete. Paddle’s buyer terms say the customer purchases from Paddle as an authorized reseller, while the supplier makes the product available under a separate supplier agreement. The company that built the product and the company handling the covered sale are therefore not simply interchangeable names.</p>
      <p>That example does not mean every payment provider becomes a reseller. Nor does a glossary settle a particular business’s legal or tax position. Use the purchase terms and provider agreement to establish the relationship, and obtain advice on any allocation you intend to rely on.</p>
    </section>

    <section id="names-the-buyer-sees" aria-labelledby="names-the-buyer-sees-title">
      <h2 id="names-the-buyer-sees-title">The names can differ. The explanation should not.</h2>
      <p>A business name, a DBA and a card statement description do different jobs. The U.S. Small Business Administration distinguishes a formal entity name from a DBA, the trading name under which a business may operate. Neither should be confused with the website address.</p>
      <p>The statement description is another piece of the customer experience. PayPal Braintree’s documentation explains that a descriptor is the information a customer sees beside a purchase, and that the customer’s bank ultimately determines its display. Its examples include a merchant DBA. That short line is useful for recognition, but it is not a substitute for the terms of sale.</p>
      <p>For your own store, put the order confirmation beside the checkout terms and the expected statement name. Can a customer connect them without asking your accountant? If your familiar brand trades under a different company name, explain that relationship plainly. If an authorized reseller handles the sale, make that relationship visible where the purchase is made.</p>
      <p>This does not require putting a corporate diagram on the checkout. It requires accurate seller information, a recognizable payment description within the provider’s rules, and a useful contact for the order. A change of logo alone will not fix a receipt that identifies the wrong business.</p>
    </section>

    <section id="support-after-the-sale" aria-labelledby="support-after-the-sale-title">
      <h2 id="support-after-the-sale-title">A customer question should not become a referral loop</h2>
      <p>Imagine buying a design application. You need a corrected receipt for your employer, and the application will not export your work. The receipt and the broken feature may belong with different teams. From your side, though, both questions concern the same purchase.</p>
      <p>If your business uses a reseller, agree how those requests reach the right team. Your staff should know where a billing correction goes and who owns the product problem. The first reply should help the buyer move forward, rather than send them to another company with no explanation or order reference.</p>
      <p>Ask to see the actual receipt, buyer terms and support message before changing the arrangement. A sales presentation can describe a smooth handoff; the documents show what the customer will receive. Keep the relevant purchase and payment references connected so authorized staff can find the order across the systems involved.</p>
      <p>Review this again when you add a sales channel or change providers. The team serving an earlier order may differ from the team serving a new one. Customers who bought before the change still need an understandable route for help.</p>
    </section>

    <section id="your-business-with-trolleys" aria-labelledby="your-business-with-trolleys-title">
      <h2 id="your-business-with-trolleys-title">Keep your business recognizable with Trolleys</h2>
      <p>Trolleys, an Etail Depot service, supports merchant onboarding, payment acceptance and account operations through its <Link href="/services/payment-facilitator" prefetch={false}>payment facilitator model</Link>. In the standard merchant relationship, your business sells to its customers. Trolleys does not become the reseller of your products simply because it provides the merchant service.</p>
      <p>For a Trolleys merchant operating several DBAs under one company, the distinction is especially useful. The legal company, the customer’s familiar store name and the merchant account should be connected in your records. Our <Link href="/resources/merchant-account-setup#additional-mid" prefetch={false}>additional DBA setup</Link> uses the same legal company name and a different DBA to request another merchant ID. Each account needs approval; adding a MID does not create a new legal company.</p>
      <p>The practical benefit is keeping the right checkout associated with the right account and payment activity. Give our team the legal company name, the DBA, the store address and the business activity you want to process. For an unrelated seller or a different legal company, discuss the account arrangement before connecting its sales.</p>
      <p>A software platform has the same question to answer for every participating business: who is the customer buying from? Our <Link href="/use-cases/software-platforms/payment-models" prefetch={false}>platform payment models</Link> start with that relationship. A shared interface does not automatically authorize collecting or distributing funds for other sellers.</p>
      <p>If your current checkout leaves those names disconnected, <Link href="/company/contact" prefetch={false}>talk with our team about your merchant setup</Link>. Bring the customer’s view of the sale as well as the account details. Both should tell the same story.</p>
    </section>

    <p>The buyer does not need to learn your payment terminology. They need to recognize the purchase, understand who sold it and know where to go when something needs attention.</p>
  </BlogArticlePage>;
}
