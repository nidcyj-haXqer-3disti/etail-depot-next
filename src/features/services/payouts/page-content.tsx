import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { payoutsContent } from "./content";
import { PayoutsArt } from "./artwork";

export function PayoutsPage() {
  return <ServiceDetailLayout path="/payouts-and-reconciliation" page={payoutsContent} artwork={<PayoutsArt title={payoutsContent.art.title} caption={payoutsContent.art.caption} />} />;
}
