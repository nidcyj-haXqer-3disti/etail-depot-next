import { articleMetadata } from "@/features/company/blog/metadata";
import { payableEntriesArticle } from "@/features/company/blog/payable-entries-content";

export const metadata = articleMetadata(payableEntriesArticle);
export { PayableEntriesPage as default } from "@/features/company/blog/payable-entries-page";
