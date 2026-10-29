import { Icon } from "./icon";
import { LedgixCardFace } from "./wallet-card-art";
import { productFacts } from "@/shared/product-facts";
import { formatUsdCents } from "@/modules/public-site/fee-estimate";
import "./secured-credit-art.css";

const exampleAmount = formatUsdCents(6400);
const purchaseSteps = [
  { title: "Use your card", description: "Pay through your digital wallet.", kind: "purchase" },
  { title: "Review your statement", description: "Check your purchases and the amount due.", kind: "statement" },
  { title: "Pay in full", description: "Repay the full statement balance each month.", kind: "repayment" },
] as const;

function PurchaseIllustration({kind}: {kind: (typeof purchaseSteps)[number]["kind"]}) {
  return <div className={`secured-step-art secured-step-art-${kind}`} aria-hidden="true">
    {kind === "purchase" ? <>
      <div className="secured-mini-phone"><i /><span>Wallet</span><div className="secured-mini-card"><LedgixCardFace /></div><em /></div>
      <div className="secured-purchase-tag"><Icon name="card" /><span>Purchase<strong>{exampleAmount}</strong></span></div>
    </> : kind === "statement" ? <div className="secured-statement-paper"><span>Card statement</span><strong>{exampleAmount}</strong><small>Purchase balance</small><div className="secured-paper-total"><span>Pay in full</span><Icon name="document" /></div></div>
      : <div className="secured-repayment-paper"><span className="secured-payment-check"><Icon name="check" /></span><span>Repaid in full</span><strong>{exampleAmount}</strong><div><span>Purchase balance</span><b>{formatUsdCents(0)}</b></div></div>}
  </div>;
}

/** One illustrative purchase cycle. The separate deposit never pays the purchase bill. */
export function SecuredCreditArt() {
  return <figure className="secured-credit-art" aria-label="Security deposit and card repayment explained">
    <div className="secured-credit-scene">
      <div className="secured-credit-deposit">
        <div className="secured-deposit-art" aria-hidden="true"><div className="secured-deposit-sheet"><span>Security deposit<Icon name="lock" /></span><strong>${productFacts.cards.minimumDepositDollars}</strong><small>Minimum deposit</small></div></div>
        <div className="secured-deposit-copy"><p>YOUR SECURITY DEPOSIT</p><h3>Backs your account.</h3><span>Purchases create a separate balance to repay.</span></div>
      </div>
      <div className="secured-credit-purchases">
        <div className="secured-cycle-heading"><span>Purchases &amp; repayment</span><small>One purchase, from start to finish</small></div>
        <ol className="secured-credit-purchase-flow" role="list">
          {purchaseSteps.map((step, index) => <li key={step.kind}>
            <PurchaseIllustration kind={step.kind} />
            <div className="secured-credit-step"><span className="secured-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></div>
          </li>)}
        </ol>
      </div>
    </div>
    <figcaption><Icon name="info" /><span>A {exampleAmount} purchase adds {exampleAmount} to your purchase balance. Repay that balance in full; your security deposit does not make the payment.</span></figcaption>
  </figure>;
}
