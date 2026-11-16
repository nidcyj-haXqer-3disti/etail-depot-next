import { articleMetadata } from "@/features/company/blog/metadata";
import { tapToPayArticle } from "@/features/company/blog/tap-to-pay-content";

export const metadata = articleMetadata(tapToPayArticle);
export { TapToPayPage as default } from "@/features/company/blog/tap-to-pay-page";
