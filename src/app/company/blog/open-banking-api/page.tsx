import { articleMetadata } from "@/features/company/blog/metadata";
import { openBankingArticle } from "@/features/company/blog/open-banking-content";

export const metadata = articleMetadata(openBankingArticle);
export { OpenBankingPage as default } from "@/features/company/blog/open-banking-page";
