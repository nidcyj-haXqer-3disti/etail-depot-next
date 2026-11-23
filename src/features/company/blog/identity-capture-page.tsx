import { BlogArticlePage } from "./article-page";
import { identityCaptureArticle } from "./identity-capture-content";

export function IdentityCapturePage() {
  return <BlogArticlePage article={identityCaptureArticle}>
    <p>A phone camera produces a sharp portrait and a barely readable document number. A finger covers a corner. A protective sleeve catches the light across the expiry date.</p>
    <p>To the owner, the upload clearly shows their ID. To the person or system reviewing it, a required detail may be missing.</p>
    <p>You recognize the document because it is yours. The reviewer has to assess what the submitted record actually shows. Resending it does not supply the detail you can read on the original but left out of the image.</p>

    <section id="image-or-record" aria-labelledby="image-or-record-title">
      <h2 id="image-or-record-title">Read the reason before taking another picture.</h2>
    <p>A blurry image calls for a new capture. An unsupported document calls for a different accepted record. An expired ID calls for attention to validity. A mismatch in the application calls for checking the underlying details. Better lighting cannot solve all four.</p>
    <p>Stripe’s published ID guidance, for instance, calls for a valid document, visible edges and a clear image without obstruction or alteration. Its accepted documents depend on the relevant country. Use the requirements in your own application rather than assuming another provider’s format or document list applies.</p>
    <p>When a new capture is appropriate, inspect the actual file at a readable size before uploading it. Check the details the application asks to see and include the required sides or pages. A picture that looks fine as a small thumbnail may become unreadable when enlarged.</p>
    </section>

    <section id="expiry" aria-labelledby="expiry-title">
      <h2 id="expiry-title">A document can become a problem while the application is open.</h2>
    <p>An ID nearing expiration creates a timing question even if today’s photograph is excellent. The reviewer’s process determines whether it remains acceptable and when a replacement is needed; there is no single remaining-validity period that applies to every merchant application.</p>
    <p>If a renewal receipt is all you have, confirm whether that record is accepted. Do not assume it carries the same purpose as the renewed identity document. Keep the application contact informed if the document changes during review.</p>
    <p>This is also a reason to avoid building a permanent folder of reusable owner ID attachments in ordinary email. The copy may become outdated while remaining easy to forward.</p>
    </section>

    <section id="resubmit-with-a-purpose" aria-labelledby="resubmit-with-a-purpose-title">
      <h2 id="resubmit-with-a-purpose-title">Make the next attempt answer the actual request.</h2>
    <p>For a Trolleys application, report the error or document question through the agreed support channel and submit sensitive records through the approved secure process. A description of the problem can start the conversation without attaching the ID to it.</p>
    <p>A fresh photograph that removes glare from a date reveals information already on the original. Retouching that date or reconstructing missing information changes the evidence instead. Keep the correction tied to the reason given, and ask for clarification if that reason remains unclear.</p>
    <p>The goal is a genuine record the reviewer can assess. Once you know what prevented that assessment, the next upload has a reason to be different.</p>
    </section>
  </BlogArticlePage>;
}
