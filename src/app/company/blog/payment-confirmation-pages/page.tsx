import { articleMetadata } from "@/features/company/blog/metadata";
import { confirmationArticle } from "@/features/company/blog/confirmation-content";

export const metadata = articleMetadata(confirmationArticle);
export { ConfirmationPage as default } from "@/features/company/blog/confirmation-page";
