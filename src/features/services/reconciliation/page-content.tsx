import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { reconciliationContent } from "./content";
import { ReconciliationArt } from "./artwork";

export function ReconciliationPage() {
  return <ServiceDetailLayout path="/reconciliation" page={reconciliationContent} artwork={<ReconciliationArt title={reconciliationContent.art.title} caption={reconciliationContent.art.caption} />} />;
}
