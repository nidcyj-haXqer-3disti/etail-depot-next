import { LedgixCardFace, WalletCardArt } from "./wallet-card-art";

export function CardProgramArt() {
  return <div className="bp-card-stage">
    <div className="bp-card-display" aria-hidden="true"><div className="bp-card-face"><LedgixCardFace /></div><div className="bp-card-caption"><span>Virtual Visa secured credit card</span></div></div>
    <WalletCardArt variant="preview" />
  </div>;
}
