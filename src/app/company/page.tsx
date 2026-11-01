import { servicePageMetadata } from "@/modules/public-site/metadata";
import { AboutPage } from "@/ui/about-page";

export const metadata = servicePageMetadata("/company");
export default function Page() { return <AboutPage />; }
