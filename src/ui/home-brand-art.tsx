import Image from "next/image";
import { serviceLabels } from "@/shared/service-language";

/** Original brand mark presented as a decorative relief. */
export function HomeBrandArt() {
  return <figure className="home-brand-art" aria-label="Etail Depot">
    <div className="home-brand-art-field" aria-hidden="true">
      <div className="home-brand-art-relief">
        <span className="home-brand-art-shadow"><span /></span>
        <span className="home-brand-art-depth home-brand-art-depth-back" />
        <span className="home-brand-art-depth home-brand-art-depth-middle" />
        <span className="home-brand-art-depth home-brand-art-depth-front" />
        <Image unoptimized src="/brand/symbol.png" alt="" width={800} height={484}
          loading="eager" fetchPriority="high" decoding="sync" />
      </div>
    </div>
    <figcaption><span><strong>{serviceLabels.payments}</strong><span>Accept and manage payments</span></span><span><strong>{serviceLabels.cards}</strong><span>Secured credit for your wallet</span></span></figcaption>
  </figure>;
}
