import { servicePageMetadata } from "@/modules/public-site/metadata";
import { DocumentationArticle } from "@/ui/documentation";

export const metadata = servicePageMetadata("/docs/payment-requests");
export default function Page() { return <DocumentationArticle slug="payment-requests" />; }
