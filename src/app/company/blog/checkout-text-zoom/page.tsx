import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutZoomArticle } from "@/features/company/blog/checkout-zoom-content";

export const metadata = articleMetadata(checkoutZoomArticle);
export { CheckoutZoomPage as default } from "@/features/company/blog/checkout-zoom-page";
