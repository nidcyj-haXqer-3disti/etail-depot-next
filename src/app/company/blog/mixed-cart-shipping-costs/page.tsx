import { articleMetadata } from "@/features/company/blog/metadata";
import { splitShippingPriceArticle } from "@/features/company/blog/split-shipping-price-content";

export const metadata = articleMetadata(splitShippingPriceArticle);
export { SplitShippingPricePage as default } from "@/features/company/blog/split-shipping-price-page";
