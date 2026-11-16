import { articleMetadata } from "@/features/company/blog/metadata";
import { creditNotesArticle } from "@/features/company/blog/credit-notes-content";

export const metadata = articleMetadata(creditNotesArticle);
export { CreditNotesPage as default } from "@/features/company/blog/credit-notes-page";
