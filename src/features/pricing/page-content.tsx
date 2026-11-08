import { PaymentOffer } from "./payment-offer";
import { CommercialPage } from "@/shared/ui/commercial-page";
import { pricingContent as page } from "./content";

export default function Page() {
  return <CommercialPage path="/pricing" page={page} offer={<PaymentOffer />} />;
}
