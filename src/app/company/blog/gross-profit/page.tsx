import { articleMetadata } from "@/features/company/blog/metadata";
import { grossProfitArticle } from "@/features/company/blog/gross-profit-content";

export const metadata = articleMetadata(grossProfitArticle);
export { GrossProfitPage as default } from "@/features/company/blog/gross-profit-page";
