import { articleMetadata } from "@/features/company/blog/metadata";
import { ratePerOrderArticle } from "@/features/company/blog/rate-per-order-content";

export const metadata = articleMetadata(ratePerOrderArticle);
export { RatePerOrderPage as default } from "@/features/company/blog/rate-per-order-page";
