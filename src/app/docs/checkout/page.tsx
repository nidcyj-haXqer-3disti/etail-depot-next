import { checkoutArticle } from "@/features/resources/documentation/checkout/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/checkout/metadata";
export default function Page() { return <DocumentationArticle article={checkoutArticle} slug="checkout" />; }
