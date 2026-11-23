import { articleMetadata } from "@/features/company/blog/metadata";
import { writtenSalesTermsArticle } from "@/features/company/blog/written-sales-terms-content";

export const metadata = articleMetadata(writtenSalesTermsArticle);
export { WrittenSalesTermsPage as default } from "@/features/company/blog/written-sales-terms-page";
