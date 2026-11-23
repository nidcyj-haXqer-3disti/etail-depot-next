import { BlogArticlePage } from "./article-page";
import { productWalletArticle } from "./product-wallet-content";

export function ProductWalletPage() {
  return <BlogArticlePage article={productWalletArticle}>
    <p>A shopper puts a desk lamp in the basket, then keeps browsing. On a different product page, they choose a notebook and press the wallet button. They wanted the notebook now. Was the lamp part of that decision?</p>
    <p>The merchant may see one customer and one basket. The customer sees two different intentions: something considered earlier and something they have just chosen to buy.</p>
    <p>The shortcut skips the cart, which is also where the shopper might have noticed that the lamp was included. Removing that review makes clarity about the purchase more important. The product page has to carry the meaning of “buy this” before it can make buying faster.</p>

    <section id="one-purchase" aria-labelledby="one-purchase-title">
      <h2 id="one-purchase-title">Decide what this button is buying.</h2>
    <p>Apple’s guidance treats a product-page Apple Pay purchase as the individual item, excluding other items already in the cart. Google Pay’s product-page guidance makes the same separation. A cart-level checkout has a different scope: the items the shopper has collected there.</p>
    <p>Make that distinction visible before the payment sheet opens. The product, selected variant, quantity and applicable price should be recognizable on the page. A shortcut should not quietly restore yesterday’s basket or substitute a default option for the one the customer just chose.</p>
    <p>Product configuration is part of the purchase, not an inconvenience to route around. A size, subscription choice or personalization can determine what the merchant must deliver. If required information is missing, help the customer complete it through the supported integration. Apple specifically advises keeping its button available and explaining missing selections when it is pressed, rather than making the button disappear.</p>
    <p>Optional additions need a deliberate choice too. Gift wrap may add a charge; a gift message may change what goes into the package. Collect those choices where the buyer can understand them, and carry the accepted selections into the order. Include any selected paid option in the amount the customer approves. Do not add its charge to that payment afterward without further customer authorization.</p>
    <p>The shortcut also inherits the offer on the product page. If a discount or delivery promise helped persuade the customer to buy, bypassing the cart should not make it disappear. A payment sheet can show a valid amount while the order has lost the option or promise that made that amount acceptable. The installed theme or plugin has to carry the actual choice, not merely an item identifier and a price.</p>
    </section>

    <section id="basket-afterward" aria-labelledby="basket-afterward-title">
      <h2 id="basket-afterward-title">Finish this order without erasing the next one.</h2>
    <p>After a successful notebook purchase, the lamp should still be there. It represents an undecided purchase, not debris left over from this one. The purchased notebook needs different treatment: leaving it in the basket as though nothing happened can invite a second order. The distinction belongs in the platform’s behavior, not in the customer’s memory.</p>
    <p>Before changing the basket, establish the order result. Opening a wallet, selecting a card or returning to the product page does not by itself establish a completed purchase. If the attempt was interrupted after submission, resolve the existing result before clearing items or inviting another payment.</p>
    <p>An empty-basket demonstration misses this distinction. It can show that the notebook was paid for without revealing whether an unrelated lamp would be bought or erased. The meaningful outcome includes both the completed order and the unfinished shopping the customer still expects to find.</p>
    <p>A good product-page button closes one clear sale. It does not make the customer audit everything they touched before it.</p>
    </section>
  </BlogArticlePage>;
}
