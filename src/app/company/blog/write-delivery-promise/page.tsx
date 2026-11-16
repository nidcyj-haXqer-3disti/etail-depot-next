import { articleMetadata } from "@/features/company/blog/metadata";
import { deliveryPromiseArticle } from "@/features/company/blog/delivery-promise-content";

export const metadata = articleMetadata(deliveryPromiseArticle);
export { DeliveryPromisePage as default } from "@/features/company/blog/delivery-promise-page";
