import { articleMetadata } from "@/features/company/blog/metadata";
import { receivableTurnoverArticle } from "@/features/company/blog/receivable-turnover-content";

export const metadata = articleMetadata(receivableTurnoverArticle);
export { ReceivableTurnoverPage as default } from "@/features/company/blog/receivable-turnover-page";
