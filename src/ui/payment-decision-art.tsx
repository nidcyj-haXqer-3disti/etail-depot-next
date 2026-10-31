import type { CommercialPage } from "@/modules/public-site/commercial-content";
import { Icon } from "./icon";
import { BankPaymentArt } from "./service-workflow-art";
import { PlatformAccountArt } from "./platform-account-art";
import "./payment-decision-art.css";

type Artwork = CommercialPage["art"];

export function PaymentDecisionArt({ art }: { art: Artwork }) {
  if (art.layout === "ach") return <BankPaymentArt art={art} />;
  if (art.layout === "platform") return <PlatformAccountArt title={art.title} caption={art.caption} />;

  return <figure className={`payment-decision-art decision-${art.layout}`}>
    <div className="decision-art-heading"><span aria-hidden="true"><Icon name={art.layout === "transition" ? "arrow" : "layers"} /></span><strong>{art.title}</strong></div>
    {art.layout === "transition" && <div className="transition-art-body">
      <div className="transition-track"><div className="transition-account"><span className="decision-small-label">Existing activity</span><Icon name="document" /><strong>{art.steps[0].title}</strong><p>{art.steps[0].detail}</p><div className="transition-record"><span>Refunds and disputes</span><span>Account records</span></div></div>
        <div className="transition-gate"><span className="decision-gate-icon"><Icon name="layers" /></span><strong>{art.steps[1].title}</strong><p>{art.steps[1].detail}</p><span className="transition-check">Account and integration review</span></div>
        <div className="transition-account is-new"><span className="decision-small-label">New payments</span><Icon name="business" /><strong>{art.steps[2].title}</strong><p>{art.steps[2].detail}</p><div className="transition-record"><span>Checkout and results</span><span>Payment reporting</span></div></div>
      </div><div className="transition-continuity"><Icon name="link" /><p>Keep access to the original records while outstanding activity is resolved.</p></div>
    </div>}
    <figcaption>{art.caption}</figcaption>
  </figure>;
}
