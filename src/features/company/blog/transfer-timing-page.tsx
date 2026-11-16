import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { transferTimingArticle } from "./transfer-timing-content";

export function TransferTimingPage() {
  return <BlogArticlePage article={transferTimingArticle}>
    <p>Suppose a supplier will hold your production slot until Tuesday. You arrange an overseas payment on Friday afternoon and tell them it is on its way. By Monday, they are asking for a bank credit you cannot yet show.</p>
    <p>How long do cross-border payments take? There is no single delivery window. For one concrete reference, Bank of America says its international wires typically arrive in one to five business days, depending on factors such as currency, receiving-bank processing and local holidays. That is its published guidance, not a timetable for every provider or payment method.</p>
    <p>The question that matters to your business is narrower: will this payment be available to this supplier before the deadline? A general speed claim cannot answer it. Neither can the moment someone on your team clicked Send.</p>

    <section id="when-the-clock-starts" aria-labelledby="when-the-clock-starts-title">
      <h2 id="when-the-clock-starts-title">Friday afternoon can become Monday morning</h2>
      <p>Start by finding out what the quoted window covers. Does it begin when you submit the instruction, when the provider receives your funding or when the transfer is released? Does it end at the receiving bank or when the recipient can use the money? Those definitions belong beside the estimate, not in a conversation after a missed deadline.</p>
      <p>Bank of America publishes a 5 p.m. Eastern cutoff for international outbound wires and says the sender receives availability information when scheduling the transfer. A business on the West Coast should not read that as 5 p.m. local time. Check your own provider’s cutoff and time zone for the service you actually use.</p>
      <p>Here is a fictional route with a two-business-day estimate for recipient credit. Its terms say processing starts on the next eligible business day after an instruction misses the cutoff, and that first processing day counts as day one. Funding and recipient checks are already complete, and there are no relevant holidays.</p>
      <ol>
        <li><strong>Friday, after cutoff.</strong> You submit the instruction. The processing window has not started.</li>
        <li><strong>Monday.</strong> Processing day one begins.</li>
        <li><strong>Tuesday.</strong> Processing day two ends, which is the estimated credit date under these assumptions.</li>
      </ol>
      <p>If Monday is a relevant holiday on this fictional route, day one becomes Tuesday and the estimate moves to Wednesday. That single change is enough to miss the production deadline. This is an illustration of counting, not a bank schedule or a guarantee.</p>
      <p>Ask for the calendar that applies to your payment. A working day where you sit does not establish that every bank involved is open. Equally, do not assume every payment service stops at weekends. The route’s actual operating hours matter more than a rule remembered from another transfer.</p>
      <p>Funding and checks can add time before the transfer reaches the recipient’s bank. Wise’s guidance separates waiting for money, processing it and the receiving bank’s handling. It also identifies additional checks and holidays as possible delays. Its estimate is tied to the transfer being arranged; it does not turn your invoice due date into a delivery commitment.</p>
      <p>For a deadline that affects production, payroll or a reservation, leave room before the last possible processing day. Confirm which payment event satisfies your agreement with the recipient. If the funds must be usable by Tuesday morning, an estimate of credit by Tuesday evening does not meet that requirement.</p>
    </section>

    <section id="sales-to-supplier-deadline" aria-labelledby="sales-to-supplier-deadline-title">
      <h2 id="sales-to-supplier-deadline-title">Your sales may still be on their way to you</h2>
      <p>An online business may have another wait before it can even fund the overseas payment. Customers have paid, but the merchant payout has not yet reached the business’s bank. Planning the supplier transfer as though those sales are already available removes a real stage from the cash forecast.</p>
      <p>For a Trolleys merchant, a successful checkout and a bank deposit are separate events. Trolleys, an Etail Depot service, helps you follow eligible payment activity and adjustments through to your <Link href="/services/payouts" prefetch={false}>merchant payout</Link>. Your accepted <Link href="/company/legal/payouts-and-reserves#schedule" prefetch={false}>payout schedule</Link> governs availability and initiation; account conditions and bank processing can affect receipt.</p>
      <p>Use that record to plan the money coming in. Then use your bank or transfer provider’s estimate to plan the payment going out. Our current <Link href="/company/legal/payouts-and-reserves#scope" prefetch={false}>funding arrangements</Link> cover USD payouts to approved US bank accounts. They do not establish a delivery schedule for an international supplier payment.</p>
      <p>This is where an account conversation can be more useful than a faster-sounding headline. Before your next busy period, confirm the payout cutoff, first-payout conditions and any applicable reserves with the <Link href="/company/contact#account-support" prefetch={false}>Trolleys support team</Link>. We can help with the merchant records available to us. Your outgoing transfer provider remains the contact for its delivery estimate and investigation.</p>
      <p>If an estimate passes, ask about the last confirmed event rather than accepting another generic range. Is funding still outstanding? Is information needed for a review? Has the transfer reached the receiving bank? Wise advises sharing the transfer confirmation so the recipient’s bank can check when that is the remaining stage.</p>
      <p>Keep the original reference and the recipient informed. A late transfer is not proof that it failed, so do not create a replacement while the first attempt remains unresolved. Read more about <Link href="/company/blog/cross-border-payouts" prefetch={false}>handling a payout that remains unresolved</Link> before authorizing another attempt.</p>
      <p>You do not need to promise the fastest possible payment. You need a date your business can plan around, a clear distinction between an estimate and a commitment, and someone who follows up when the money is late.</p>
    </section>
  </BlogArticlePage>;
}
