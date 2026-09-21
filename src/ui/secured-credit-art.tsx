import { Icon } from "./icon";
import "./secured-credit-art.css";

const purchaseSteps = [
  { title: "Purchases", description: "Create an amount owed.", icon: "card" },
  { title: "Statement", description: "Shows what to repay.", icon: "document" },
  { title: "Repayment", description: "From your payment source.", icon: "arrow" },
] as const;

/** Explains collateral separately from the purchase bill; it contains no account controls. */
export function SecuredCreditArt() {
  return <figure className="secured-credit-art" aria-label="Security deposit and card repayment explained">
    <div className="secured-credit-lane secured-credit-deposit">
      <div className="secured-credit-lane-heading"><Icon name="lock" /><h3>Security deposit</h3></div>
      <div className="secured-credit-deposit-flow">
        <p className="secured-credit-deposit-node">Deposit held</p>
        <div className="secured-credit-backing"><span>backs</span><Icon name="arrow" /></div>
        <p className="secured-credit-deposit-node">Card account</p>
      </div>
    </div>
    <div className="secured-credit-lane secured-credit-purchases">
      <h3>Purchases &amp; repayment</h3>
      <ol className="secured-credit-purchase-flow" role="list">
        {purchaseSteps.map((step, index) => <li key={step.title}>
          <div className="secured-credit-step">
            <span className="secured-credit-step-icon"><Icon name={step.icon} /></span>
            <div><h4>{step.title}</h4><p>{step.description}</p></div>
          </div>
          {index < purchaseSteps.length - 1 && <span className="secured-credit-flow-arrow"><Icon name="arrow" /></span>}
        </li>)}
      </ol>
    </div>
    <figcaption>Your security deposit does not pay your purchase bill.</figcaption>
  </figure>;
}
