import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/switch-payment-providers");
export default function Page() { return <CommercialPage path="/switch-payment-providers" />; }
