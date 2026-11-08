import { CommercialPage } from "@/shared/ui/commercial-page";
import { switchMerchantServicesContent as page } from "./content";
import Link from "next/link";
import { AttentionHero, AttentionArt } from "@/shared/ui/attention-hero";

export default function Page() {
  return <CommercialPage path="/use-cases/switch-merchant-services" page={page} hero={<AttentionHero id="provider-review-title" label="Changing payment providers"
      title={<>Declined by Stripe?{" "}<em>Let’s look at your business.</em></>}
      intro={page.intro}
      actions={<><Link href={page.action.href}>{page.action.label}</Link><Link href="#service-section-1">How switching works</Link></>}
      note={page.note}
      artwork={<AttentionArt kind="provider" />}
    />} />;
}
