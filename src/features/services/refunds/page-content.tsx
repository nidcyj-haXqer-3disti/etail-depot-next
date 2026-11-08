import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { refundsContent } from "./content";
import { RefundsArt } from "./artwork";

export function RefundsPage() {
  return <ServiceDetailLayout path="/refunds-and-disputes" page={refundsContent} artwork={<RefundsArt title={refundsContent.art.title} caption={refundsContent.art.caption} />} />;
}
