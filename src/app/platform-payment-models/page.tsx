import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/platform-payment-models");
export default function Page() { return <CommercialPage path="/platform-payment-models" />; }
