import { integrationAccessArticle } from "@/features/resources/documentation/integration-access/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/integration-access/metadata";
export default function Page() { return <DocumentationArticle article={integrationAccessArticle} slug="integration-access" />; }
