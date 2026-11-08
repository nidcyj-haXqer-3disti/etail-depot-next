import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { payoutsContent } from "./content";
import { PayoutsArt } from "./artwork";

export function PayoutsPage() {
  return <ServiceDetailLayout path="/services/payouts" page={payoutsContent} artwork={<PayoutsArt title={payoutsContent.art.title} caption={payoutsContent.art.caption} />} />;
}
