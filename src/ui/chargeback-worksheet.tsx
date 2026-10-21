"use client";

import { useRef, useState } from "react";
import "./chargeback-worksheet.css";

const worksheet = `CHARGEBACK RESPONSE WORKSHEET
Use one copy for each dispute. Follow the instructions and deadline in your payment provider’s notice.

CASE DETAILS
Payment provider:
Case reference:
Original payment and order references:
Payment date:
Disputed amount and currency:

NOTICE AND DEADLINE
Reason or code exactly as shown:
Customer’s stated concern:
Response due (date, time and time zone):
Person handling the response:

PRIOR REFUND OR RESOLUTION
Any refund, reversal or other resolution:
Amount, date, reference and current status:
Any possible overlap in returned funds:

RESPONSE DECISION
Accept or contest:
Why the records support this decision:
Decision date:

EXPLANATION AND EVIDENCE
Short dated timeline:
For each relevant record, note:
  Filename or reference:
  What it shows:
  How it answers the stated concern:
Missing information to resolve:

SUBMISSION AND FOLLOW-UP
Submitted (date, time and time zone):
Submission confirmation or reference:
Documents included:
Current case status:
Further request and deadline:
Final outcome:
Fund adjustments:
Fees (record separately):

Use references to securely held records. Do not include full card numbers, CVV, passwords or login details in this worksheet.
Submit your response through your payment provider. Submitting evidence does not guarantee that disputed funds will be returned.`;

export function ChargebackWorksheet() {
  const [status, setStatus] = useState("");
  const disclosure = useRef<HTMLDetailsElement>(null);
  const template = useRef<HTMLTextAreaElement>(null);

  async function copyWorksheet() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(worksheet);
      setStatus("Copied. Paste the worksheet into a document you keep securely.");
    } catch {
      if (disclosure.current) disclosure.current.open = true;
      setStatus("Automatic copying is unavailable. Select and copy the template below.");
    }
  }

  return <div className="chargeback-worksheet">
    <ol className="chargeback-worksheet-outline">
      <li><strong>Match the case.</strong><span>Record the payment, order, disputed amount and reason.</span></li>
      <li><strong>Check the deadline and any refund.</strong><span>Use the date, time and time zone in your notice. Check for money already returned.</span></li>
      <li><strong>Prepare your response.</strong><span>Decide whether to accept or contest. Match each record to the customer’s concern.</span></li>
      <li><strong>Keep the confirmation.</strong><span>Save what you submitted and follow the case through to its outcome.</span></li>
    </ol>
    <div className="chargeback-worksheet-actions">
      <button type="button" className="button" onClick={copyWorksheet}>Copy worksheet</button>
    </div>
    <p className="chargeback-worksheet-status" role="status">{status}</p>
    <details id="chargeback-worksheet-template" ref={disclosure}>
      <summary>View template</summary>
      <label htmlFor="chargeback-worksheet-text">Blank response worksheet</label>
      <textarea id="chargeback-worksheet-text" ref={template} readOnly value={worksheet} rows={16} spellCheck={false} />
      <button type="button" className="chargeback-worksheet-toggle" onClick={() => { template.current?.focus(); template.current?.select(); }}>Select template</button>
    </details>
  </div>;
}
