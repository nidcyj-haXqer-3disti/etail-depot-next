import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { paymentMethodsContent } from "./content";
import { PaymentMethodsArt } from "./artwork";

export function PaymentMethodsPage() {
  return <ServiceDetailLayout path="/payment-methods" page={paymentMethodsContent} artwork={<PaymentMethodsArt title={paymentMethodsContent.art.title} caption={paymentMethodsContent.art.caption} />} />;
}
