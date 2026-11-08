import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { disputesContent } from "./content";
import { DisputesArt } from "./artwork";

export function DisputesPage() {
  return <ServiceDetailLayout path="/services/disputes" page={disputesContent} artwork={<DisputesArt title={disputesContent.art.title} caption={disputesContent.art.caption} />} />;
}
