import { servicePageMetadata } from "@/modules/public-site/metadata";
import { DocumentationArticle } from "@/ui/documentation";

export const metadata = servicePageMetadata("/docs/testing-and-launch");
export default function Page() { return <DocumentationArticle slug="testing-and-launch" />; }
