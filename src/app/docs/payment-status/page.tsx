import { paymentStatusArticle } from "@/features/resources/documentation/payment-status/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/payment-status/metadata";
export default function Page() { return <DocumentationArticle article={paymentStatusArticle} slug="payment-status" />; }
