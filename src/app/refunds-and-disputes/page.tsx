import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/refunds-and-disputes");
export default function Page() { return <CommercialPage path="/refunds-and-disputes" />; }
