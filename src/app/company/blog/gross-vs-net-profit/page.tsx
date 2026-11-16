import { articleMetadata } from "@/features/company/blog/metadata";
import { grossNetProfitArticle } from "@/features/company/blog/gross-net-profit-content";

export const metadata = articleMetadata(grossNetProfitArticle);
export { GrossNetProfitPage as default } from "@/features/company/blog/gross-net-profit-page";
