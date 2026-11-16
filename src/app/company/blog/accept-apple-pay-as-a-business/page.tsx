import { articleMetadata } from "@/features/company/blog/metadata";
import { applePayArticle } from "@/features/company/blog/apple-pay-content";

export const metadata = articleMetadata(applePayArticle);
export { ApplePayPage as default } from "@/features/company/blog/apple-pay-page";
