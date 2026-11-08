import { webhooksArticle } from "@/features/resources/documentation/webhooks/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/webhooks/metadata";
export default function Page() { return <DocumentationArticle article={webhooksArticle} slug="webhooks" />; }
