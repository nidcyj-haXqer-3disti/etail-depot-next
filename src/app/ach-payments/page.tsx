import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/ach-payments");
export default function Page() { return <CommercialPage path="/ach-payments" />; }
