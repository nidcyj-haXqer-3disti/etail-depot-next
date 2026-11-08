import { refundsAndDisputesArticle } from "@/features/resources/documentation/refunds-and-disputes/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/refunds-and-disputes/metadata";
export default function Page() { return <DocumentationArticle article={refundsAndDisputesArticle} slug="refunds-and-disputes" />; }
