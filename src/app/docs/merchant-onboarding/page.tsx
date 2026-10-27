import { servicePageMetadata } from "@/modules/public-site/metadata";
import { DocumentationArticle } from "@/ui/documentation";

export const metadata = servicePageMetadata("/docs/merchant-onboarding");
export default function Page() { return <DocumentationArticle slug="merchant-onboarding" />; }
