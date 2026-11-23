import { articleMetadata } from "@/features/company/blog/metadata";
import { networkFeeNoticesArticle } from "@/features/company/blog/network-fee-notices-content";

export const metadata = articleMetadata(networkFeeNoticesArticle);
export { NetworkFeeNoticesPage as default } from "@/features/company/blog/network-fee-notices-page";
