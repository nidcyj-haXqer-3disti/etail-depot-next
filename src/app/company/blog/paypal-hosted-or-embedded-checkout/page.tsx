import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutPlacementArticle } from "@/features/company/blog/checkout-placement-content";

export const metadata = articleMetadata(checkoutPlacementArticle);
export { CheckoutPlacementPage as default } from "@/features/company/blog/checkout-placement-page";
