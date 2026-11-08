import { paymentRequestsArticle } from "@/features/resources/documentation/payment-requests/content";
import { DocumentationArticle } from "@/features/resources/documentation/documentation";

export { metadata } from "@/features/resources/documentation/payment-requests/metadata";
export default function Page() { return <DocumentationArticle article={paymentRequestsArticle} slug="payment-requests" />; }
