import { servicePageMetadata } from "@/modules/public-site/metadata";
import { DocumentationArticle } from "@/ui/documentation";

export const metadata = servicePageMetadata("/docs/checkout");
export default function Page() { return <DocumentationArticle slug="checkout" />; }
