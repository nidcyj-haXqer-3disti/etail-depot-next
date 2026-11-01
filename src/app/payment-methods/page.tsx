import { servicePageMetadata } from "@/modules/public-site/metadata";
import { ServiceDetailPage } from "@/ui/service-detail-page";

export const metadata = servicePageMetadata("/payment-methods");
export default function Page() { return <ServiceDetailPage path="/payment-methods" />; }
