import "@/shared/brand/brand-images-symbol.css";
import "@/shared/styles/site-artwork-polish.css";
import Link from "next/link";
import { AttentionHero } from "@/shared/ui/attention-hero";
import "@/shared/styles/attention-pages.css";
import "@/shared/styles/service-purpose.css";
import { Shell } from "@/shared/layout/shell";
import { PlatformIntegrationArt } from "@/features/services/overview/connected-payment-art";
import { PlatformAccountsArt } from "./platform-accounts-art";
import { PlatformJourneyArt } from "@/features/use-cases/software-platforms/platform-journey-art";
import "@/shared/styles/enterprise-pages.css";
import "@/shared/styles/connected-pilots.css";
import { PlatformUseCases } from "./platform-use-cases";
import { platformPageJsonLd } from "./metadata";

export default function Page() {
  return <Shell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: platformPageJsonLd("/use-cases/software-platforms") }} />
    <div className="enterprise-page platforms cw-pilot attention-site"><AttentionHero className="ec-platform-hero" id="partner-title" label="Software platforms"
      title={<>Merchant services{" "}<br /><em>for your software.</em></>}
      intro="Help the businesses using your software accept payments. Keep each merchant’s accounts, checkout and reporting connected."
      actions={<><Link href="/company/contact#platforms">Discuss your platform</Link><Link href="#payment-experience">See the payment journey</Link></>}
      note="Merchant approval is required. Payment methods depend on account setup."
      artwork={<PlatformAccountsArt />}
    /><section className="ec-container ec-platform-journey" aria-labelledby="platforms-section-2-title" id="payment-experience"><span className="ec-anchor" id="experience-title"></span><div className="ec-section-heading ec-split-heading"><div><span className="ec-category">The merchant journey</span><h2 id="platforms-section-2-title">From checkout to bank deposit.</h2></div><p>After account approval and setup, follow each purchase through the merchant’s payment records to the bank deposit.</p></div><PlatformJourneyArt /></section>
 <PlatformUseCases />
 <section className="ec-container ec-integration-section" id="integration" aria-labelledby="platforms-section-4-title"><span className="ec-anchor" id="integration-title"></span><div className="ec-section-copy"><span className="ec-category">Integration</span><h2 id="platforms-section-4-title">Connect your software.</h2><dl className="ec-integration-notes"><div><dt><Link href="/use-cases/software-platforms/payment-models">Account structure</Link></dt><dd>Merchant accounts and permissions for the businesses using your software.</dd></div><div><dt>Checkout and results</dt><dd>Match the payment result to the purchase. Check an unclear result before retrying.</dd></div><div><dt>Records and reporting</dt><dd>Connect payment updates and reports to the records in your software.</dd></div></dl><Link className="ec-concept-action ec-quiet" href="/company/contact#platforms">Discuss your integration</Link><p className="ec-scope">Request the specifications and access for your approved setup from our integration team.</p></div><PlatformIntegrationArt /></section>
 <span className="ec-anchor" id="partner-commercial-title" aria-hidden="true"></span><span className="ec-anchor" id="platforms-section-5-title" aria-hidden="true"></span><span className="ec-anchor" id="partner-questions-title"></span><span className="ec-anchor" id="partner-contact" aria-hidden="true"></span><span className="ec-anchor" id="contact-title" aria-hidden="true"></span></div>
  </Shell>;
}
