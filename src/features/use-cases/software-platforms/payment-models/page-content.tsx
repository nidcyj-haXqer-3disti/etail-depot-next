import { CommercialPage } from "@/shared/ui/commercial-page";
import { paymentModelsContent as page } from "./content";
import { PaymentDecisionArt } from "@/features/use-cases/switch-merchant-services/payment-decision-art";

export default function Page() {
  return <CommercialPage path="/platform-payment-models" page={page} artwork={<PaymentDecisionArt art={page.art} />} />;
}
