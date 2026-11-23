import { articleMetadata } from "@/features/company/blog/metadata";
import { woopaymentsAccountArticle } from "@/features/company/blog/woopayments-account-content";

export const metadata = articleMetadata(woopaymentsAccountArticle);
export { WoopaymentsAccountPage as default } from "@/features/company/blog/woopayments-account-page";
