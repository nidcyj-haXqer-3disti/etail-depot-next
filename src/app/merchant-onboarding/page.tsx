import { servicePageMetadata } from "@/modules/public-site/metadata";
import { CommercialPage } from "@/ui/commercial-page";

export const metadata = servicePageMetadata("/merchant-onboarding");
export default function Page() { return <CommercialPage path="/merchant-onboarding" />; }
