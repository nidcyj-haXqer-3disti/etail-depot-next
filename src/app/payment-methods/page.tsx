import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/payment-methods");
export default function Page() { return <CommercialPage path="/payment-methods" />; }
