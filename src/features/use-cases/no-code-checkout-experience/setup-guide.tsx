import Link from "next/link";
import { Icon } from "@/shared/ui/icon";
import classic from "@/features/services/shared/service-detail.module.css";
import s from "./checkout-experience.module.css";

const businessCenter = "https://businesscenter.cybersource.com";

export function NoCodeCheckoutSetup() {
  return <section className={s.setup} id="setup" data-integration-guide aria-labelledby="checkout-setup-title">
    <div className={classic.container}>
      <div className={classic.sectionHeading}>
        <div><p className={classic.eyebrow}>Set up your own</p><h2 id="checkout-setup-title">One link. Ready to share.</h2></div>
        <p>Start after Trolleys confirms that Pay by Link is enabled for your merchant account. <Link href="/resources/merchant-account-setup" prefetch={false}>Set up your account</Link></p>
      </div>
      <p className={s.reviewNote}>Instructions checked against Cybersource Help. The live walkthrough and screenshots are still pending.</p>
      <ol className={s.setupSteps}>
        <li id="open-pay-by-link">
          <div className={s.stepHeading}><span className={s.stepNumber} aria-hidden="true">01</span><h3>Open Pay by Link</h3></div>
          <div className={s.stepBody}>
            <a href={businessCenter} target="_blank" rel="noopener noreferrer" className={s.location}><Icon name="lock" /><span>Cybersource Business Center<small>businesscenter.cybersource.com</small></span><Icon name="external" /></a>
            <p>Sign in with your live account details. In the left menu, open <strong>Pay by Link</strong>, then <strong>Manage Links</strong>.</p>
            <p className={s.stepHelp}>No Pay by Link menu? <Link href="/company/contact#account-support" prefetch={false}>Ask Trolleys to check activation.</Link> Continue once it is available.</p>
          </div>
        </li>
        <li id="create-payment-link">
          <div className={s.stepHeading}><span className={s.stepNumber} aria-hidden="true">02</span><h3>Create your payment link</h3></div>
          <div className={s.stepBody}>
            <p>Select <strong>Create Pay by Link</strong>, then choose how the amount is set.</p>
            <dl className={s.priceOptions}>
              <div><dt>Fixed price</dt><dd>You set the price of your product or service.</dd></div>
              <div><dt>Customer-set price</dt><dd>Your customer chooses the amount. You set the minimum.</dd></div>
            </dl>
            <p>Enter an <strong>Item name</strong> customers will recognize. Fill in <strong>Price</strong> or <strong>Min amount</strong> for your chosen option.</p>
            <p>Request a shipping address only if you need to deliver something. Set an end date if the link should stop accepting payments, then select <strong>Create Pay by Link</strong> to save.</p>
          </div>
        </li>
        <li id="share-payment-link">
          <div className={s.stepHeading}><span className={s.stepNumber} aria-hidden="true">03</span><h3>Share the link or QR code</h3></div>
          <div className={s.stepBody}>
            <p>Open the link by selecting its name in <strong>Manage Links</strong>.</p>
            <ul className={s.sharingOptions}>
              <li><strong>Send a link:</strong> select <strong>Copy Link</strong>, then paste it into your message.</li>
              <li><strong>Use a QR code:</strong> select <strong>Get Code</strong>, then <strong>Download</strong>. Use the saved image on your invoice or sign.</li>
            </ul>
            <details id="add-pay-button" className={s.websiteOption}>
              <summary>Have a website? Add a Pay button.<Icon name="arrow" /></summary>
              <div><p>If your website editor supports buttons, add one called <strong>Pay online</strong>. Paste your payment link into its destination field and publish.</p><p>Open the button to check that it leads to the correct payment page.</p></div>
            </details>
          </div>
        </li>
        <li id="check-payment">
          <div className={s.stepHeading}><span className={s.stepNumber} aria-hidden="true">04</span><h3>Check the payment</h3></div>
          <div className={s.stepBody}>
            <p>Before sharing, open the link and scan the QR code. Both should show the same payment page. Check the business name, item, currency and amount.</p>
            <p>After a customer pays, open <strong>Transaction Management</strong>, then <strong>Transactions</strong> in Cybersource. Find the payment and check its status, amount and reference before fulfilling the order.</p>
          </div>
        </li>
      </ol>
      <div className={s.setupFootnote}><p>Customers enter their payment details on the Cybersource page. You do not need to build a payment server or database for this setup.</p><a href="https://developer.cybersource.com/docs/cybs/en-us/paybylink/developer/all/rest/paybylink/paybylink-ebc-intro.html" target="_blank" rel="noopener noreferrer">Cybersource setup reference<Icon name="external" /></a></div>
    </div>
  </section>;
}
