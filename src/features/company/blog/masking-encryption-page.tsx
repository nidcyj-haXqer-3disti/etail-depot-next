import Link from "next/link";
import { BlogArticlePage } from "./article-page";
import { maskingEncryptionArticle } from "./masking-encryption-content";

export function MaskingEncryptionPage() {
  return <BlogArticlePage article={maskingEncryptionArticle}>
    <p>The payment screen shows a card brand and four ending digits. Everything else is hidden. To a business owner reviewing new software, that can look like the security question has been answered.</p>
    <p>It has answered a narrower question: what this screen shows this person.</p>
    <p>It has not told you what the software received, what it saved or what another user can export. Those are the questions that matter when payment information passes through checkout, customer support and bookkeeping.</p>
    <p>Data masking conceals part of a value when it is displayed. Encryption transforms data into a protected form that requires the appropriate cryptographic key to read. They serve different purposes, and a payment arrangement may need both. Neither can be judged from the appearance of a dashboard.</p>

    <section id="beyond-the-visible-digits" aria-labelledby="beyond-the-visible-digits-title">
      <h2 id="beyond-the-visible-digits-title">The screen can hide what the system still holds</h2>
      <p>Imagine a support page that displays only the last four card digits. The developer then discovers that the response sent to the browser contains the complete number. The page has merely hidden most of it. A diagnostic tool has also copied that response into a log.</p>
      <p>The screen looks unchanged. The data situation is very different from a system that sent only the limited details support needed.</p>
      <p>Checking the visible page is not enough. The review needs to follow the underlying data.</p>
      <p>PCI SSC makes a related distinction between masking and truncation. Masking conceals digits for display or printing while the full card number may remain stored. Truncation removes part of the stored number. Hiding a value is not the same as removing it from that copy.</p>
      <p>Ask your software team what reaches the browser, not just what appears in the interface. Then ask what the export contains and what gets recorded when something fails. The answer should cover the support role your staff actually use, not only the administrator’s demonstration.</p>
      <p>A report with hidden card digits may still contain names, addresses and other personal information. It should not become a freely shared test file simply because one column looks safer. Use the provider’s designated test values or suitable synthetic records for demonstrations and testing.</p>
    </section>

    <section id="what-encryption-does-not-decide" aria-labelledby="what-encryption-does-not-decide-title">
      <h2 id="what-encryption-does-not-decide-title">Encryption does not choose who should have access</h2>
      <p>Encryption is valuable protection. Its effectiveness depends on where it is applied, how keys are protected and which systems can decrypt the data. A storage system can be encrypted while an authorized application still returns far more information than its user needs.</p>
      <p>That is an access problem, not evidence that encryption is pointless. The two controls must work together. OWASP recommends protecting encrypted information with additional safeguards, including access controls, rather than relying on cryptography alone.</p>
      <p>The distinction is useful in a sales conversation. If a vendor says data is encrypted, ask which data and where. Does that answer cover storage, transmission and backups? Who controls decryption? Can an ordinary support account retrieve the full number, and is there a legitimate need for it to do so?</p>
      <p><strong>“Encrypted” describes a protection. It does not describe the entire payment environment.</strong></p>
      <p>PCI SSC states that encryption alone does not take cardholder data out of PCI DSS scope. Your assessment must consider the actual systems and responsibilities. Do not select a compliance questionnaire or approve an integration solely because a proposal contains the word encryption.</p>
      <p>Often, the better starting point is to reduce the data your business receives. If support needs an order reference and limited payment details, collecting the full card number adds a responsibility without necessarily helping the customer. A supported <Link href="/company/blog/credit-card-vaulting" prefetch={false}>vaulting arrangement</Link> can let your software use references while the provider manages the underlying credentials. Its scope and permissions still need review.</p>
    </section>

    <section id="make-the-answer-specific" aria-labelledby="make-the-answer-specific-title">
      <h2 id="make-the-answer-specific-title">Ask for the payment’s path, not another security slogan</h2>
      <p>You do not need to become an encryption engineer to ask for a clear explanation. Have your web team describe what happens when a customer pays, when support opens the order and when an error is investigated. For each point, establish which system receives payment data, what it keeps and who can access it.</p>
      <p>Include tools added after launch. An analytics change, support integration or debugging setting can create a new copy of information even when the checkout itself has not changed. OWASP’s logging guidance identifies payment card data, access tokens and secrets as information that should not ordinarily be written directly to logs.</p>
      <p>Useful diagnostics can identify the order, transaction, error and time without copying a complete payment request. If a review finds unnecessary sensitive data in existing records, involve the responsible security team and provider. Follow their incident and retention procedures; removing a field from tomorrow’s log does not resolve copies already made.</p>
      <p>For Trolleys, an Etail Depot service, this discussion starts with the checkout and account setup your business uses. Our <Link href="/developers/api-reference" prefetch={false}>integration guidance</Link> tells web teams to keep card data out of their own form fields, analytics and logs when using the hosted checkout. That guidance does not certify every plugin or staff tool connected to a merchant’s website.</p>
      <p>Use our <Link href="/company/security" prefetch={false}>security and service responsibilities</Link> page to identify the documents and contacts relevant to your arrangement. Trolleys merchants can ask about their account and integration; the acquiring partner or organization managing the compliance program confirms the required assessment. The website provider remains part of the conversation wherever its software handles the data.</p>
      <p>When <Link href="/company/contact" prefetch={false}>asking our team for help</Link>, describe the issue and share the requested references through the approved channel. Do not reproduce a full card number or secret to demonstrate that it was exposed. The investigation should reduce unnecessary copies, not create another one.</p>
    </section>

    <p>The reassuring answer is more specific than “we mask it” or “we encrypt it.” It explains what the business receives, what it retains and why the right people can do their jobs without seeing more than they need.</p>
  </BlogArticlePage>;
}
