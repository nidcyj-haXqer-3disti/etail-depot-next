import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { shippingTaxProcessingArticle } from "./shipping-tax-processing-content";

export function ShippingTaxProcessingPage() {
  return <BlogArticlePage article={shippingTaxProcessingArticle}>
    <p>Sales tax is money a merchant may need to remit. Shipping collected at checkout may be passed straight to a carrier. Neither necessarily becomes product margin. Both can still form part of the amount on which the payment fee is calculated.</p>
    <p>The payment service processes the captured charge. It does not reduce that amount to the merchant’s eventual profit.</p>
    <p>Under Trolleys’ <Link href="/company/legal/fees#calculation" prefetch={false}>fee calculation</Link>, the standard processing base includes tax, shipping and tips when they are part of the captured payment. Square’s published explanation similarly applies processing fees to the full transaction amount, including tax and tip. The merchant’s own agreement establishes the applicable rule.</p>
    <p>This creates a small but real distinction between collecting a cost from the customer and recovering it in full. If a store collects $10 for delivery and its illustrative percentage fee is 3%, that portion of the payment adds 30¢ to the percentage charge. There is no extra fixed payment fee in this example because the delivery charge is part of the same payment. Collecting the carrier’s exact $10 charge has still left the store with 30¢ to absorb.</p>
    <p>The merchant may willingly absorb those cents to keep a simple delivery price. That can be a reasonable use of product margin, just as subsidized shipping can be part of the offer. But it is a subsidy the order must support. Calling delivery an exact reimbursement hides that choice and can encourage prices that leave too little for packaging, handling and the cost of collecting the payment.</p>
    <p>The same distinction can explain an effective-rate surprise. Divide all processing fees by product sales excluding tax and delivery, and the result can exceed the quoted percentage applied to the larger captured total. That does not prove overbilling. It means the denominator describes a different part of the order.</p>
    <p>Keep those two views available. The captured amount is needed to check the bill. The money retained after the order’s costs is needed to judge whether selling it was worthwhile. An accurate payment statement can coexist with a weak margin.</p>
    <p>Passing an amount through the checkout does not make collecting it costless. A product can look profitable on its own line while the rest of the order quietly consumes the margin.</p>
  </BlogArticlePage>;
}
