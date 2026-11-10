import type { ReactNode } from "react";
import Link from "next/link";
import { TrolleysBrand } from "@/shared/brand/trolleys-brand";
import { Icon } from "@/shared/ui/icon";
import guide from "./merchant-account-guide.module.css";
import s from "./application-guide-steps.module.css";

/** Static illustrations of the observed application. No customer data or working fields. */
function Screen({ title, step, children, caption }: { title: string; step?: number; children: ReactNode; caption: string }) {
  return <figure className={s.figure} aria-label={title}>
    <div className={s.stage} aria-hidden="true">
      <div className={s.screen}>
        <div className={s.bar}><TrolleysBrand compact inverse /><span className={s.account}><Icon name="person" /></span></div>
        <div className={s.body}>
          {step && <div className={s.progress}><span>STEP {step} / 3</span><span className={s.track}><i style={{ width: `${step / 3 * 100}%` }} /></span></div>}
          <strong className={s.title}>{title}</strong>
          {children}
        </div>
      </div>
    </div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

function Field({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={s.field}><span>{label}</span><div className={emphasis ? s.amount : s.value}>{value}</div></div>;
}

function Next() { return <div className={s.actions}><span className={s.primary}>Next <span>›</span></span></div>; }

function Step({ number, id, title, children, artwork }: { number: number; id: string; title: string; children: ReactNode; artwork: ReactNode }) {
  return <li id={id}>
    <div className={guide.stepCopy}>
      <div className={guide.stepHeading}><span aria-hidden="true">{number}</span><h3>{title}</h3></div>
      {children}
    </div>
    {artwork}
  </li>;
}

export function ApplicationGuideSteps() {
  return <>
    <Step number={3} id="application-review" title="Complete your company profile" artwork={
      <Screen title="Company Profile" step={1} caption="Sales example: 200 orders at $75 each total $15,000. Use your own figures.">
        <Field label="Legal Business Name" value="Your legal business name" />
        <span className={s.exampleLabel}>Example sales figures</span>
        <Field label="Average Ticket" value="$75" emphasis />
        <Field label="Monthly Volume" value="$15,000" emphasis />
        <Field label="Estimated Highest Credit Card Order Amount" value="$500" emphasis />
        <Next />
      </Screen>
    }>
      <span id="prepare" className={guide.bookmark} aria-hidden="true" />
      <span id="platform-onboarding" className={guide.bookmark} aria-hidden="true" />
      <p>Open your application or choose <strong>Continue</strong> beside one you started. Complete <strong>Company Profile</strong> using your business records.</p>
      <dl className={s.definitions}>
        <div><dt>Average Ticket</dt><dd>The average amount of one sale. Divide your sales total by the number of sales for the same period.</dd></div>
        <div><dt>Monthly Volume</dt><dd>The total dollar amount you expect to process through this account in one month.</dd></div>
        <div><dt>Estimated Highest Credit Card Order Amount</dt><dd>The largest single credit card order you expect to accept.</dd></div>
      </dl>
      <p className={guide.hint}>Use your sales history or realistic estimates for a new business, then choose <strong>Next</strong>.</p>
      <details className={s.moreFields}><summary>Help with the other business fields</summary>
        <dl className={s.definitions}>
          <div><dt>Legal Business Name and TIN</dt><dd>Enter the legal name and tax identification number from your tax records.</dd></div>
          <div><dt>DBA Name</dt><dd>Your trading name, or the business name customers know.</dd></div>
          <div><dt>Billing descriptor</dt><dd>The name customers will see on their card statements. Use a name they recognize.</dd></div>
          <div><dt>Business details</dt><dd>Enter your address, legal structure and establishment date. Include https:// in your website address and choose the category that describes what you sell.</dd></div>
          <div><dt>Amex Direct ESA number</dt><dd>Choose Yes only if you already have the 10 digit ESA number requested. Otherwise, choose No.</dd></div>
        </dl>
      </details>
      <p className={guide.approval}>Creating a login is not approval to accept payments.</p>
    </Step>

    <Step number={4} id="owners-and-contacts" title="Add owners and contacts" artwork={
      <Screen title="Owner Information" step={2} caption="Complete the owner, control person and daily operations sections shown for your business.">
        <div className={s.question}>Are there any owners with 25% or more ownership?<div className={s.choices}><span>Yes</span><span>No</span></div></div>
        <Field label="Control Prong’s Title" value="Their role in the business" />
        <Field label="Control Prong’s Phone" value="Their 10 digit US number" />
        <Field label="Daily Operations Name" value="Your day to day contact" />
        <div className={s.note}>Phone format: area code + number<br />Do not include the country code +1.</div>
        <Next />
      </Screen>
    }>
      <p>On <strong>Owner Information</strong>, answer the ownership questions. Enter the requested identity and contact details for each person.</p>
      <dl className={s.definitions}>
        <div><dt>Owners with 25% or more</dt><dd>List each person who meets the ownership threshold shown in the form.</dd></div>
        <div><dt>Control Prong</dt><dd>The person responsible for running the business, such as its CEO. Follow the questions to identify an owner or add a separate control person.</dd></div>
        <div><dt>Daily Operations</dt><dd>The person who can answer questions about the business day to day.</dd></div>
      </dl>
      <p className={guide.hint}><strong>Phone numbers:</strong> use the contact’s actual US number as 10 digits, including the area code, without +1. Complete <strong>Control Prong’s Phone</strong> when shown, even without a required marker.</p>
      <p className={guide.hint}>Choose <strong>Next</strong>. If a field is flagged, correct it before continuing.</p>
    </Step>

    <Step number={5} id="bank-details" title="Enter your bank details" artwork={
      <Screen title="Banking Information" step={3} caption="Choose the account types that match your bank records. The numbers come from your bank.">
        <Field label="Bank Account DDA Type" value="Checking" />
        <Field label="Bank Account ACH Type" value="Business Checking" />
        <Field label="Routing Number" value="Your 9 digit ACH routing number" />
        <Field label="Account Number" value="Your bank account number" />
        <div className={s.note}>Enter both numbers again in their confirmation fields.</div>
        <Next />
      </Screen>
    }>
      <p>On <strong>Banking Information</strong>, enter the bank account for your merchant account.</p>
      <dl className={s.definitions}>
        <div><dt>Account types</dt><dd>Choose the DDA and ACH account types that match your bank records. Ask your bank or Etail if you are unsure which option applies.</dd></div>
        <div><dt>Routing Number</dt><dd>Your bank’s 9 digit US routing number for ACH payments.</dd></div>
        <div><dt>Account Number</dt><dd>Your bank account number, not your debit card number. Keep any leading zeros.</dd></div>
      </dl>
      <p>Enter each number again in its confirmation field. Check both against your bank records, then choose <strong>Next</strong>.</p>
    </Step>

    <Step number={6} id="review-and-submit" title="Review and submit" artwork={
      <Screen title="Review & accept" caption="Review your application and the agreement presented for your account before signing.">
        <div className={s.document}><Icon name="document" /><div><strong>Agreement</strong><span>Read the terms for your account.</span></div></div>
        <div className={s.reviewActions}><span>Download PDF</span><span>Review Application</span></div>
        <div className={s.note}>Review the credit inquiry authorization.</div>
        <Field label="Type your name to sign agreement" value="Your full name" />
        <span className={s.primaryWide}>Accept & Continue</span>
        <span className={s.notNow}>Not now</span>
      </Screen>
    }>
      <ol className={guide.recoverySteps}>
        <li>Choose <strong>Review Application</strong> and check your business, contact and bank details.</li>
        <li>Read the agreement and credit inquiry authorization. Use <strong>Download PDF</strong> to keep a copy.</li>
        <li>If you are authorized to sign for the business and agree to the terms, enter your full name and choose <strong>Accept & Continue</strong>.</li>
      </ol>
      <p className={guide.hint}>If something is incorrect or unclear, choose <strong>Not now</strong> and <Link href="/company/contact#account-support" prefetch={false}>contact Etail</Link> before signing.</p>
    </Step>

    <Step number={7} id="application-submitted" title="Check your application status" artwork={
      <Screen title="Application submitted." caption="Submission confirms receipt. Wait for approval and confirmation that your payment setup is ready.">
        <div className={s.submitted}><span><Icon name="check" /></span><p>Your application has been submitted and is under review.</p></div>
        <span className={s.secondary}>Merchant Dashboard</span>
        <div className={s.statusCard}><span className={s.status}>In review</span><strong>Your business application</strong><span>Processing</span></div>
      </Screen>
    }>
      <p>Choose <strong>Merchant Dashboard</strong> to check your application status and find your Agreement and Application PDF.</p>
      <dl className={s.definitions}>
        <div><dt>In review / Processing</dt><dd>Allow 1 business day for application review. Additional checks can take longer. The status may take a few minutes to update.</dd></div>
        <div><dt>Action needed</dt><dd>Respond to the request shown. If there are no instructions, contact Etail for the next step.</dd></div>
      </dl>
      <p className={guide.approval} id="account-readiness">Wait for account approval and confirmation that your payment setup is ready.</p>
      <p className={guide.hint}>Returning later? Sign in with the same email to check this application.</p>
      <p id="after-approval"><strong>After approval:</strong> follow the <Link href="/resources/shopify-gateway-integration" prefetch={false}>Shopify</Link> or <Link href="/resources/woocommerce-gateway-integration" prefetch={false}>WooCommerce</Link> guide using your account email. For another website, <Link href="/company/contact#account-support" prefetch={false}>ask Etail for setup instructions</Link>.</p>
    </Step>
  </>;
}

export function AdditionalLocationGuide() {
  return <div className={guide.guide}>
    <p>Use <strong>+ Location</strong> to request an additional merchant ID (MID) for a different DBA under the same LLC or corporation. Each approved MID keeps that checkout’s payment activity and reporting separate.</p>
    <ol className={guide.steps}>
      <Step number={1} id="choose-location" title="Choose + Location" artwork={
        <Screen title="Merchant Dashboard" caption="Find the existing application, then choose + Location beside it.">
          <div className={s.statusCard}><span className={s.status}>Existing application</span><strong>Your legal company</strong><span>Your current DBA</span><div className={s.recordLinks}><span>Agreement</span><span>Application PDF</span></div><span className={s.locationAction}>+ Location</span></div>
        </Screen>
      }>
        <p>Sign in and find the existing application on <strong>Merchant Dashboard</strong>. Choose <strong>+ Location</strong> beside it.</p>
        <p className={guide.hint}>Use this option for another DBA under the same company. For a different legal company, ask Etail which application to use.</p>
      </Step>
      <Step number={2} id="new-dba-details" title="Enter the new DBA" artwork={
        <Screen title="Company Profile" caption="Keep the same legal company. Enter the new DBA and its own business details.">
          <Field label="Legal Business Name" value="Same legal company name" />
          <Field label="DBA Name" value="Your new trading name" />
          <Field label="Billing Descriptor" value="A name customers will recognize" />
          <Field label="Business Website" value="https://your-new-store.example" />
          <Field label="Monthly Volume" value="Expected volume for this DBA" />
          <Next />
        </Screen>
      }>
        <p>Keep the same <strong>Legal Business Name</strong> and enter a different <strong>DBA Name</strong>.</p>
        <p>Complete the new DBA’s billing descriptor, address, website and monthly volume, then choose <strong>Next</strong>.</p>
      </Step>
      <Step number={3} id="review-new-location" title="Review and follow its status" artwork={
        <Screen title="Review Application" caption="Confirm the legal company and new DBA before accepting the agreement.">
          <div className={s.reviewRow}><span>Legal business</span><strong>Same legal company</strong></div>
          <div className={s.reviewRow}><span>DBA</span><strong>New trading name</strong></div>
          <div className={s.note}>Check every detail, including information carried over from the existing application.</div>
          <div className={s.statusCard}><span className={s.status}>After submission</span><strong>New DBA application</strong><span>Awaiting review</span></div>
        </Screen>
      }>
        <p>Open <strong>Review Application</strong> and check every detail, including information carried over. Read the agreement and sign only if you are authorized and agree.</p>
        <p>Return to <strong>Merchant Dashboard</strong> to check the new application under the same legal company.</p>
        <p className={guide.hint}>Wait for the additional MID to be approved and connected to the intended checkout before using it.</p>
      </Step>
    </ol>
  </div>;
}
