import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardSwipesArticle } from "./card-swipes-content";

export function CardSwipesPage() {
  return <BlogArticlePage article={cardSwipesArticle}>
    <p>“Try swiping it” sounds helpful. A card has not worked, the customer wants to finish and the reader has another slot. At a busy counter, changing the way the card is presented can feel like ordinary troubleshooting.</p>
    <p>Sometimes it is. Sometimes the chip was read perfectly well and the payment was declined. Those two situations should not receive the same answer.</p>
    <p>A credit card swipe reads the information stored on the card’s magnetic stripe. It can still have a place in a supported acceptance setup, including certain cases where a chip cannot be read. But it is a different entry method with different security characteristics. Cybersource’s retail documentation notes that magnetic stripe data is easier to copy or compromise than chip data. The fact that the same piece of plastic is in front of the employee does not make the two methods equivalent.</p>

    <section id="reading-or-decision" aria-labelledby="reading-or-decision-title">
      <h2 id="reading-or-decision-title">First, understand what did not work</h2>
      <p>A read error concerns obtaining information from the card. A payment declined after the chip was read presents a different question: why was the request refused, and what does the response allow next? Asking only whether the payment “worked” hides that difference.</p>
      <p>Visa’s device guidance describes fallback as a response to a chip or chip reader that is not working. Its merchant training guidance separately warns that a declined chip transaction is not a candidate for retrying through the magnetic stripe. Switching interfaces is not a general permission to bypass the decision.</p>
      <p>For a genuine reading problem, let the terminal and your provider’s instructions determine the next step. They may call for another attempt to read the chip before offering a permitted fallback. Do not force that route by intentionally presenting the card incorrectly or choosing an unrelated entry mode. Local rules and the supported acceptance configuration still matter.</p>
      <p>For a declined payment, follow the provider’s response guidance and offer an appropriate alternative. Avoid guessing aloud that the customer lacks funds or that the card is fraudulent. Staff can explain what the checkout is asking for without claiming to know the customer’s account situation. Our article on <Link href="/company/blog/credit-card-declines" prefetch={false}>credit card declines</Link> looks at those different causes.</p>
      <p>An unclear result needs its own treatment too. If the application has not confirmed the outcome, check the original payment through the provider’s supported process before collecting again. Changing from chip to swipe does not resolve whether the earlier attempt succeeded. The <Link href="/company/blog/contactless-payments" prefetch={false}>contactless checkout article</Link> explores that moment of uncertainty.</p>
    </section>

    <section id="supported-fallback" aria-labelledby="supported-fallback-title">
      <h2 id="supported-fallback-title">A fallback needs to remain recognizable as one</h2>
      <p>The purpose of the supported fallback flow is more than getting the reader to accept a card. It also preserves information about how the payment was taken. Visa’s device guide requires fallback transactions to use online authorization and the correct transaction data. A cashier should not have to manufacture those details by switching settings.</p>
      <p>Ask your provider to explain what staff will see when fallback is available, how it appears in the payment record and what happens when it is not allowed. The answer should describe the equipment and application actually in use. A swipe slot on the side of a reader is not an acceptance policy.</p>
      <p>Nor should “approved” be stretched into a promise that every fraud or dispute risk has disappeared. Cybersource says the usual risk controls still apply to magnetic stripe transactions. Confirm the responsibilities attached to your own acceptance arrangement instead of assuming that taking a card in person settles every question.</p>
      <p>That is why the useful staff instruction is specific: follow the displayed flow, keep the order connected to its payment record and know when to ask for help. A workaround remembered from a previous employer may have belonged to a different terminal, provider or configuration.</p>
    </section>

    <section id="repeated-errors" aria-labelledby="repeated-errors-title">
      <h2 id="repeated-errors-title">When the exception becomes the routine</h2>
      <p>One card failing to read is a different support conversation from a reader struggling with card after card. Bank of America’s troubleshooting guidance makes that distinction: if other cards read successfully, the original card may be the problem; persistent errors across cards can point to equipment needing repair or replacement.</p>
      <p>If staff have started telling everyone to swipe because “the chip slot never works,” the business has acquired an equipment problem and an unofficial operating policy. Finishing today’s sales can make it easy to overlook both. Record which reader is affected, the error shown and whether the problem occurs across cards, then use the provider’s maintenance or support process.</p>
      <p>Routine maintenance is different from suspicious changes. PCI SSC calls for an inventory of payment devices, periodic inspections for tampering or unauthorized substitution, and staff training to recognize those problems. These controls cover devices used for taps and chip payments as well as swipes. Buying a newer reader does not remove the need to know which device should be on the counter.</p>
      <p>If a reader appears altered or has been replaced unexpectedly, stop using it and contact the responsible support or security team through a known route. Staff should not be expected to decide whether an unfamiliar attachment is harmless while continuing to take customers’ cards.</p>
      <p>Employees should be comfortable using a supported swipe and confident about when to stop. Give them a reliable answer when the normal payment route fails. A clear instruction from the provider protects the sale better than a habit nobody remembers approving.</p>
    </section>
  </BlogArticlePage>;
}
