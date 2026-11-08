import { ServiceDetailLayout } from "../shared/service-detail-layout";
import { achPaymentsContent } from "./content";
import { AchPaymentsArt } from "./artwork";

export function AchPaymentsPage() {
  return <ServiceDetailLayout path="/ach-payments" page={achPaymentsContent} artwork={<AchPaymentsArt title={achPaymentsContent.art.title} caption={achPaymentsContent.art.caption} />} />;
}
