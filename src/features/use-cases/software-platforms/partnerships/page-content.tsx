import { CommercialPage } from "@/shared/ui/commercial-page";
import { partnershipsContent as page } from "./content";
import { ServiceWorkflowArt } from "@/features/services/components/service-workflow-art";

export default function Page() {
  return <CommercialPage path="/payment-partnerships" page={page} artwork={<ServiceWorkflowArt path="/payment-partnerships" art={page.art} />} />;
}
