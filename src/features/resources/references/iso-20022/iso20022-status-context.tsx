import Link from "next/link";

export function PaymentStatusContext({ code }: { code: string }) {
  if (code === "ACSP") return <>

        <section id="acsp-meaning"><h2>What does ACSP establish?</h2><p>The reported instruction has passed checks such as technical validation and customer profile validation. The code describes acceptance for execution, rather than the final account entry.</p><p>Read ACSP alongside the transaction reference, reporting party and status time. The applicable bank or payment system guide determines which status updates you receive.</p></section>
        <section id="acsp-vs-accc"><h2>ACSP and ACCC describe different facts.</h2><div className="sr-compare"><div className="sr-compare-row"><code>ACSP</code><p><strong>Instruction accepted</strong>Preceding checks passed and the instruction was accepted for execution.</p></div><div className="sr-compare-row"><code><Link href="/guides/iso-20022/payment-transaction-status/accc" prefetch={false}>ACCC</Link></code><p><strong>Creditor account settled</strong>Settlement on the creditor’s account has completed.</p></div></div><p className="sr-note">These are definitions to compare, not a required sequence of status messages.</p></section>
        <section id="acsp-timing"><h2>Does ACSP tell you when the money will arrive?</h2><p>No. ACSP contains no arrival time or payout schedule. A delivery estimate must come from the payment service and the relevant payment route.</p></section>

</>;
  if (code === "ACCC") return <>

      <section id="accc-account"><h2>Which account does ACCC refer to?</h2><p>The creditor’s account for the reported payment. Match the status to the payment’s identifiers and reporting context before treating it as a record for a particular order or transfer.</p><p>ACCC is a transaction status. It does not contain the account balance, a merchant fee calculation or a schedule for a separate payout.</p></section>
      <section id="accc-comparison"><h2>ACCC, ACSC and ACSP</h2><div className="sr-compare"><div className="sr-compare-row"><code>ACCC</code><p><strong>Creditor account</strong>Settlement on the creditor’s account is complete.</p></div><div className="sr-compare-row"><code>ACSC</code><p><strong>Transaction account entry</strong>The source describes completed settlement and restricts use to agreed reporting arrangements.</p></div><div className="sr-compare-row"><code><Link href="/guides/iso-20022/payment-transaction-status/acsp" prefetch={false}>ACSP</Link></code><p><strong>Accepted for execution</strong>The instruction has passed preceding checks.</p></div></div><p className="sr-note">The source requires bilateral agreement for ACSC and distinguishes reporting transaction status from financial information. Do not substitute these codes solely because their names sound similar.</p></section>

</>;
  return null;
}
