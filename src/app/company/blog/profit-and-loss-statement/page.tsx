import { articleMetadata } from "@/features/company/blog/metadata";
import { profitLossArticle } from "@/features/company/blog/profit-loss-content";

export const metadata = articleMetadata(profitLossArticle);
export { ProfitLossPage as default } from "@/features/company/blog/profit-loss-page";
