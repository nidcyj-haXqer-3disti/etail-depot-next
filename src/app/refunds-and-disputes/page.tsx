import { servicePageMetadata } from "@/modules/public-site/metadata";
import { ServiceDetailPage } from "@/ui/service-detail-page";

export const metadata = servicePageMetadata("/refunds-and-disputes");
export default function Page() { return <ServiceDetailPage path="/refunds-and-disputes" />; }
