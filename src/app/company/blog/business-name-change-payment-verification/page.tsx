import { articleMetadata } from "@/features/company/blog/metadata";
import { nameHistoryArticle } from "@/features/company/blog/name-history-content";

export const metadata = articleMetadata(nameHistoryArticle);
export { NameHistoryPage as default } from "@/features/company/blog/name-history-page";
