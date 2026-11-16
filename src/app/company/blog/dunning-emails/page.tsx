import { articleMetadata } from "@/features/company/blog/metadata";
import { dunningEmailsArticle } from "@/features/company/blog/dunning-emails-content";

export const metadata = articleMetadata(dunningEmailsArticle);
export { DunningEmailsPage as default } from "@/features/company/blog/dunning-emails-page";
