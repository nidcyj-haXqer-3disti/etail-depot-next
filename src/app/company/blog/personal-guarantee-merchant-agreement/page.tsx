import { articleMetadata } from "@/features/company/blog/metadata";
import { merchantGuaranteeArticle } from "@/features/company/blog/merchant-guarantee-content";

export const metadata = articleMetadata(merchantGuaranteeArticle);
export { MerchantGuaranteePage as default } from "@/features/company/blog/merchant-guarantee-page";
