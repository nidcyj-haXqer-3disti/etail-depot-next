import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/contact");
export default function Page() { return <CommercialPage path="/contact" />; }
