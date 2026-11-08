import { payoutsArticle } from "@/features/resources/documentation/payouts/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/payouts/metadata";
export default function Page() { return <DocumentationArticle article={payoutsArticle} slug="payouts" />; }
