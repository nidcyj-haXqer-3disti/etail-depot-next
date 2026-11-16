import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { cardVaultingArticle } from "./card-vaulting-content";
import s from "./blog.module.css";

const accessQuestions = [
  ["Recognize a saved card", "Support can identify the payment method from limited details, such as brand and last four digits.", "Does that role also allow charging, changing or exporting it?"],
  ["Use it for a payment", "An authorized billing system submits a permitted payment using the saved reference.", "Which account, customer agreement and staff permissions govern that use?"],
  ["Move it to another provider", "An approved transfer process moves eligible credentials to a suitable receiving provider.", "Who approves the transfer, what can move and how will new references match your customers?"],
] as const;

export function CardVaultingPage() {
  return <BlogArticlePage article={cardVaultingArticle}>
    <p>A returning customer has already decided to buy again. Asking them to find their wallet and type the same card number can turn a familiar purchase into another task. Saving the payment method removes some of that work.</p>
    <p>For the business, though, the useful question goes beyond whether the checkout remembers a card. Who can use it? What did the customer agree to? And if the business changes payment providers, does that convenience come with it?</p>
    <p>Credit card vaulting places payment credentials in a controlled storage system. In a tokenized arrangement, the merchant’s software can refer to the stored credentials through a token rather than routinely keeping the full card number. The vault holds the sensitive data; your checkout or billing system uses the supported reference.</p>
    <p>That is a sensible separation. It is not the end of the decision.</p>

    <section id="what-a-saved-card-represents" aria-labelledby="what-a-saved-card-represents-title">
      <h2 id="what-a-saved-card-represents-title">The card on the screen is only the visible part</h2>
      <p>A card brand and four ending digits help a customer recognize a payment method. They are not enough to make the next payment. Behind that display, your software needs the correct provider reference, the right customer association and permission to use it.</p>
      <p>A vault reference and a network payment token are also different things. Cybersource’s Token Management Service can return references representing stored payment information and can also create network tokens. The word “token” alone does not tell you which kind you have.</p>
      <p>EMV network tokens replace card numbers within the payment process and can be restricted to a particular merchant, device or payment scenario. A provider’s own vault reference has its own supported uses. Neither should be assumed to work with every processor or across every account your company operates.</p>
      <p>For a business with several stores or DBAs, this distinction matters before the second checkout goes live. Ask which approved accounts can use a saved method, whether customers need to save it separately and how each payment remains tied to the correct seller. One company login does not establish shared payment permissions.</p>
      <p>Nor does a saved card establish that a new charge succeeded. Each purchase still needs a payment result. Treat storage, customer agreement and payment approval as separate records, even if the customer sees one simple checkout.</p>
    </section>

    <section id="separate-access-from-authority" aria-labelledby="separate-access-from-authority-title">
      <h2 id="separate-access-from-authority-title">Who can see it is not the same as who can charge it</h2>
      <p>A support agent may need to identify the card a customer means. A billing system may need to collect an agreed renewal. A migration team may need to arrange a transfer. These are different jobs, and the access should reflect that.</p>
      <table className={s.comparison}>
        <caption>Three permissions worth discussing separately</caption>
        <thead><tr><th scope="col">The task</th><th scope="col">What it involves</th><th scope="col">What to clarify</th></tr></thead>
        <tbody>{accessQuestions.map(([task, meaning, question]) => <tr key={task}>
          <th scope="row">{task}</th>
          <td><span className={s.comparisonLabel} aria-hidden="true">What it involves</span>{meaning}</td>
          <td><span className={s.comparisonLabel} aria-hidden="true">What to clarify</span>{question}</td>
        </tr>)}</tbody>
      </table>
      <p>The table is a way to review access, not a claim that every provider offers those exact roles. Look at the permissions in the service you actually use, including access held by connected software. Hiding the full card number does not make an account harmless if it can still initiate charges.</p>
      <p>Customer authority is a separate limit. Saving a card for a future purchase does not, by itself, authorize a subscription. The agreed use must match the later payment. Our <Link href="/company/blog/card-on-file" prefetch={false}>card-on-file article</Link> explains that distinction and how to keep billing instructions clear.</p>
      <p>There is no reason to keep the card security code alongside a saved reference. PCI DSS prohibits retaining it after authorization, even in encrypted form. Customer permission does not override that restriction. A support note or spreadsheet is not an exception.</p>
      <p>Outsourcing storage can reduce the card data your systems handle, but it does not erase your responsibilities. PCI SSC says merchants still need to confirm the provider’s compliance for the service used, understand shared duties and validate their own compliance as required. Have the actual checkout and billing arrangement reviewed rather than treating a security badge as the whole answer.</p>
    </section>

    <section id="keep-an-exit-plan" aria-labelledby="keep-an-exit-plan-title">
      <h2 id="keep-an-exit-plan-title">Find out what can move before you need to move it</h2>
      <p>A customer list is not a transferable vault. You might export names and saved-payment references successfully, then discover the new provider cannot use those references. The spreadsheet looks complete while the next renewal still has no usable payment method.</p>
      <p>Secure migration is a separate provider process. Stripe’s export documentation, for example, describes an encrypted transfer to an eligible receiving processor. It also excludes some credentials and separates card data from subscriptions and payment history. That illustrates why “we support exports” is not enough detail for a decision.</p>
      <p>Ask your provider what can transfer, which destinations it supports, who approves the request and what timing or charges apply. Establish how old references will map to new ones and which billing records need separate work. If some methods cannot move, plan a secure way for those customers to enter them again.</p>
      <p>For Trolleys, an Etail Depot service, that conversation belongs before launch or a provider change. Stored credentials and recurring payments apply when enabled for the approved account. Our team can discuss your <Link href="/use-cases/switch-merchant-services" prefetch={false}>existing payment setup and transition needs</Link>; a new merchant account does not automatically transfer saved methods, consent records or earlier obligations.</p>
      <p>Tell us which provider holds the credentials, which software uses them and whether customers make individual purchases or pay under a continuing agreement. <Link href="/company/contact" prefetch={false}>Discuss the arrangement with our team</Link> using system names and account references. Do not send full card numbers, security codes or API secrets in an ordinary message.</p>
      <p>Keep the customer’s instructions intact through any change. Moving a technical credential does not expand permission to charge it. Confirm the supported transfer, customer mapping and billing behavior before relying on the new setup, and preserve an agreed route for earlier refunds and disputes.</p>
    </section>

    <p>The best saved-card experience is quiet: the customer recognizes the method, chooses how to use it and completes the purchase. Behind that simplicity, your business should know who holds the data, who may act on it and what happens if the arrangement changes.</p>
  </BlogArticlePage>;
}
