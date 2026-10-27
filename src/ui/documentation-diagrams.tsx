import { Icon } from "./icon";

const diagrams = {
  onboarding: {
    title: "Application to account readiness", caption: "Keep the application, review decision and account setup connected. Confirm the required services before accepting payments.",
    nodes: [
      ["01 · Application", "Submit the application", "Business details and agreements", "business"],
      ["02 · Review", "Complete the review", "Information requests and decision", "document"],
      ["03 · Configuration", "Configure the account", "Payment methods and team access", "layers"],
      ["04 · Verification", "Confirm readiness", "Account, checkout and reporting checks", "check"],
    ],
  },
  records: {
    title: "From order to payment record", caption: "The order, processing operations and funding report answer different questions. Keep the references that connect them.",
    nodes: [
      ["Purchase", "Your order", "Amount, currency and attempt references", "business"],
      ["Processing", "Payment and related operations", "Authorization, capture, reversal and refund references", "card"],
      ["Reporting", "Account activity and payout", "Settlement, adjustments and deposit references", "document"],
    ],
  },
  payouts: {
    title: "From payment to bank deposit", caption: "Use the funding report to reconcile the payout amount. Confirm receipt with the bank’s posted record.",
    nodes: [
      ["01 · Capture", "Check the capture result", "Order and capture or sale reference", "card"],
      ["02 · Settlement", "Read the settled activity", "Processed items in the reporting period", "document"],
      ["03 · Payout calculation", "Check the payout amount", "Included activity and adjustments", "layers"],
      ["04 · Bank deposit", "Match the bank deposit", "Amount, currency and bank reference", "bank"],
    ],
  },
  recovery: {
    title: "Resolve the attempt before acting", caption: "A missing response or report row does not establish the payment outcome. Resolve the original attempt before taking another payment.",
    nodes: [
      ["Outcome confirmed", "Record the verified state", "Follow the permitted next action for that operation", "check"],
      ["Outcome uncertain", "Keep the investigation open", "Resolve the original attempt before another payment", "document"],
    ],
  },
  disputes: {
    title: "A dispute has its own record", caption: "A saved evidence file, a submitted response and a case decision are distinct milestones. Retain the acknowledgment and any financial adjustment.",
    nodes: [
      ["01 · Notice", "Identify the case", "Payment, reason and deadline", "document"],
      ["02 · Review", "Check the purchase", "Relevant evidence and prior refunds", "layers"],
      ["03 · Response", "Confirm submission", "Case response acknowledgment", "shield"],
      ["04 · Outcome", "Track the decision", "Further requests and account adjustments", "check"],
    ],
  },
  access: {
    title: "Account and integration responsibilities", caption: "Confirm the connections assigned through the merchant account service. Keep server credentials out of the customer interface.",
    nodes: [
      ["Account service", "Application access", "Program and environment", "business"],
      ["Checkout service", "Payment access", "Processing account and environment", "card"],
      ["Reporting service", "Record access", "Account access and permissions", "document"],
    ],
  },
  events: {
    title: "From delivery to a verified update", caption: "Verify the event, save the receipt and acknowledge it as specified for your connection. Resume interrupted processing without repeating the order or account update.",
    nodes: [
      ["01 · Receiver", "Verify the delivery", "Authentication, environment and account", "shield"],
      ["02 · Storage", "Save, then acknowledge", "Retain the receipt and processing state", "document"],
      ["03 · Worker", "Apply the update once", "Match the record and current state", "layers"],
      ["04 · Reconciliation", "Recover missing activity", "Check the account or payment record", "check"],
    ],
  },
  launch: {
    title: "From sandbox to production", caption: "Keep sandbox access, integration review and production approval separate. Confirm the account configuration at each stage.",
    nodes: [
      ["01 · Configuration", "Confirm the setup", "Accounts, versions and methods", "layers"],
      ["02 · Payments", "Confirm payment results", "Completed, declined and interrupted payments", "document"],
      ["03 · Review", "Complete the review", "Configuration and outstanding questions", "shield"],
      ["04 · Production", "Confirm the live setup", "Production access and support contacts", "check"],
    ],
  },
} as const;


function PaymentRequestSequence() {
  return <figure className="docs-sequence docs-request-sequence" aria-label="One shared request can produce separate purchases">
    <div className="docs-diagram-heading"><Icon name="layers"/><span>One shared request, separate purchases</span></div>
    <ol>
      <li><span className="docs-sequence-number" aria-hidden="true">1</span><div><strong>Define the offer</strong><p>Purchase details, total, currency and terms</p></div></li>
      <li><span className="docs-sequence-number" aria-hidden="true">2</span><div><strong>Share the payment request</strong><p>Payment link, button or QR code</p></div></li>
      <li><span className="docs-sequence-number" aria-hidden="true">3</span><div><strong>Match each purchase separately</strong><div className="docs-request-purchases">
        <div><span>Customer A</span><Icon name="document"/><strong>Order and payment</strong><p>Its own transaction reference and verified result</p></div>
        <div><span>Customer B</span><Icon name="document"/><strong>Order and payment</strong><p>A different transaction reference and verified result</p></div>
      </div></div></li>
    </ol>
    <figcaption>Do not use a reusable request as the unique payment identifier. Each buyer’s purchase keeps its own order and transaction records.</figcaption>
  </figure>;
}

function CheckoutSequence() {
  const exchanges = [
    ["Your order", "Merchant account service", "Prepare checkout", "Keep the order, amount, currency and payment attempt together."],
    ["Merchant account service", "Customer checkout", "Present the checkout page", "Present the purchase and methods configured for the merchant account."],
    ["Customer checkout", "Payment processing", "Process the payment", "The customer submits payment through the configured checkout flow."],
    ["Payment record", "Your application", "Verify and match", "Match the verified payment to its original order and attempt."],
    ["Your application", "Your order", "Update the order once", "Record the confirmed result once. Investigate an unresolved attempt before retrying."],
  ];
  return <figure className="docs-sequence docs-checkout-sequence" aria-label="Checkout journey from order to verified payment">
    <div className="docs-diagram-heading"><Icon name="layers"/><span>From order to verified result</span></div>
    <ol>{exchanges.map(([from,to,title,detail], i) => <li key={title}>
      <span className="docs-sequence-number" aria-hidden="true">{i+1}</span>
      <div className="docs-sequence-transfer"><span>{from}</span><Icon name="arrow"/><span>{to}</span></div>
      <div className="docs-sequence-action"><strong>{title}</strong><p>{detail}</p></div>
    </li>)}</ol>
    <figcaption>Use the checkout instructions supplied through your merchant account service. A closed page or a browser redirect does not confirm the payment.</figcaption>
  </figure>;
}

export function DocumentationFlow({kind}:{kind:keyof typeof diagrams | "checkout" | "requests"}) {
  if (kind === "checkout") return <CheckoutSequence/>;
  if (kind === "requests") return <PaymentRequestSequence/>;
  const diagram = diagrams[kind];
  return <figure className={`docs-diagram docs-diagram-${kind}`} aria-label={diagram.title}>
    <div className="docs-diagram-heading"><Icon name={kind === "payouts" ? "bank" : "layers"}/><span>{diagram.title}</span></div>
    <ol>{diagram.nodes.map(([owner,title,record,icon]) => <li key={owner}>
      <span className="docs-diagram-owner">{owner}</span><Icon name={icon}/>
      <strong>{title}</strong><span className="docs-diagram-record">{record}</span>
    </li>)}</ol>
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}
