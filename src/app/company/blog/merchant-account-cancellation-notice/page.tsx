import { articleMetadata } from "@/features/company/blog/metadata";
import { cancellationDeliveryArticle } from "@/features/company/blog/cancellation-delivery-content";

export const metadata = articleMetadata(cancellationDeliveryArticle);
export { CancellationDeliveryPage as default } from "@/features/company/blog/cancellation-delivery-page";
