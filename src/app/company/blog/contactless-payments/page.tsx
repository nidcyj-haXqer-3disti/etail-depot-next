import { articleMetadata } from "@/features/company/blog/metadata";
import { contactlessArticle } from "@/features/company/blog/contactless-content";

export const metadata = articleMetadata(contactlessArticle);
export { ContactlessPage as default } from "@/features/company/blog/contactless-page";
