import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { maskingTokenizationArticle } from "./masking-tokenization-content";

export function MaskingTokenizationPage() {
  return <BlogArticlePage article={maskingTokenizationArticle}>
    <p>A returning customer reaches checkout, recognizes the card ending in 4821 and chooses it. No wallet to find. No card number to type again. This is the convenience a saved payment method is supposed to provide.</p>
    <p>The customer has made a simple choice. Your software has a more exact job: find the payment reference belonging to that customer, use it through the right merchant account and request the purchase they just agreed to.</p>
    <p>Masking and tokenization serve different parts of that experience. Masking conceals digits in a display. Tokenization substitutes another value for sensitive payment data within a defined system. The first helps someone recognize a card without showing the whole number. The second can let authorized software use a payment reference instead of handling that number directly.</p>
    <p>Buying both features is not enough if the connection between them is wrong.</p>

    <section id="four-digits-are-a-label" aria-labelledby="four-digits-are-a-label-title">
      <h2 id="four-digits-are-a-label-title">Four digits are a label</h2>
      <p>Two different cards can end in 4821. A customer can even hold more than one card with the same ending. Those digits are useful confirmation, but they are not a unique payment identifier.</p>
      <p>Imagine a support agent finding a customer’s old order and being asked to use the same card for a new purchase. Searching every saved method for a matching ending would be the wrong approach. The software needs the specific customer record and its associated payment method, with the appropriate permission to use it.</p>
      <p>The problem is not fixed by showing more digits. It is fixed by keeping the relationship between the customer and the saved method intact. Staff should be able to recognize that method without reconstructing a full card number or guessing which record it belongs to.</p>
      <p>PCI SSC also makes clear that display masking can coexist with storage of the complete number elsewhere. A masked screen does not prove that the merchant’s systems never received card data. Our article on <Link href="/company/blog/data-masking-vs-encryption" prefetch={false}>masking and encryption</Link> examines that separate question.</p>
    </section>

    <section id="know-which-reference-you-have" aria-labelledby="know-which-reference-you-have-title">
      <h2 id="know-which-reference-you-have-title">The word “token” is not the specification</h2>
      <p>A provider may issue a reference to a saved customer, a payment method or another record. Cybersource’s Token Management Service distinguishes several token types, including customer tokens, payment instrument tokens and network tokens. They have different jobs.</p>
      <p>A network payment token is not simply a provider’s customer ID. EMVCo describes network tokens as substitutes for card numbers whose use can be limited to a particular merchant, device or payment scenario. A provider’s vault reference follows the rules of that provider’s system.</p>
      <p>Before relying on a saved reference, ask what it identifies and where it can be used. Is it reusable for the intended payment? Which merchant account can use it? What happens when the customer changes their saved method? These answers matter more than whether the value looks like a card number or a long string of letters.</p>
      <p>For a company operating several stores or DBAs, keep this question tied to the seller. Do not assume that a card saved with one store can be charged by another because both appear under the same back office login. Confirm the supported account arrangement and the customer agreement before offering that convenience.</p>
    </section>

    <section id="permission-survives-tokenization" aria-labelledby="permission-survives-tokenization-title">
      <h2 id="permission-survives-tokenization-title">A usable reference still needs permission</h2>
      <p>Replacing a card number does not remove the need to control who can act on it. A checkout must check that the signed-in customer may use the selected saved method. A staff account needs permission for the action it is taking. Knowing a reference should not be enough.</p>
      <p>OWASP identifies failures to check access to individual records as a common API security problem. The practical implication here is straightforward: a valid login and a valid payment reference do not, by themselves, prove that the two belong together.</p>
      <p>Customer agreement is another part of the same purchase. Permission to remember a card for the next visit does not create a subscription. Cybersource’s stored credential guidance requires disclosure of the intended use and consent to storage. Later payments need the applicable agreement and the correct transaction treatment.</p>
      <p><strong>The customer chose a payment method. The business still needs permission for this payment.</strong></p>
      <p>This is why a saved card, a recurring billing instruction and a successful charge should not be treated as the same status. Our <Link href="/company/blog/card-on-file" prefetch={false}>card-on-file article</Link> explains the different customer choices. Each new purchase still needs its own verified payment result.</p>
    </section>

    <section id="make-the-return-visit-work" aria-labelledby="make-the-return-visit-work-title">
      <h2 id="make-the-return-visit-work-title">Make the return visit work</h2>
      <p>For Trolleys, an Etail Depot service, the useful starting point is how your customers buy again. Do they return and choose a saved method themselves? Do you collect an agreed subscription? Do several stores need distinct payment arrangements? Tell us that before treating “tokenization supported” as the finished answer.</p>
      <p>Recurring payments and stored credentials apply when enabled for the approved account. Trolleys merchants can <Link href="/company/contact" prefetch={false}>discuss the required setup with our team</Link>, including the gateway account and the software using it. A merchant account approval does not automatically configure every plugin, subscription or store.</p>
      <p>Have the web team demonstrate the return visit in the provider’s test environment. Include a changed saved method, two cards with the same ending and an attempt to use a reference outside the customer’s permitted records. The expected result includes refusing the wrong selection, not just accepting the right one. Our <Link href="/developers/testing" prefetch={false}>testing guidance</Link> gives the broader payment checks to complete before launch.</p>
      <p>Tokenization can reduce the card data your software handles. It does not make a PCI assessment unnecessary. PCI SSC says merchants who outsource processing still have responsibilities for their providers and shared duties. Confirm the requirements for your actual setup with the organization managing your compliance program.</p>
    </section>

    <p>A repeat customer should not have to understand any of this. They should recognize their card, choose it with confidence and get a clear payment result. The work behind that familiar row of digits is what makes the convenience worth offering.</p>
  </BlogArticlePage>;
}
