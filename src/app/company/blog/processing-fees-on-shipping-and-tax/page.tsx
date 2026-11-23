import { articleMetadata } from "@/features/company/blog/metadata";
import { shippingTaxProcessingArticle } from "@/features/company/blog/shipping-tax-processing-content";

export const metadata = articleMetadata(shippingTaxProcessingArticle);
export { ShippingTaxProcessingPage as default } from "@/features/company/blog/shipping-tax-processing-page";
