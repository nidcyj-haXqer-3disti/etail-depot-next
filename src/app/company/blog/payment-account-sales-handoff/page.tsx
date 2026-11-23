import { articleMetadata } from "@/features/company/blog/metadata";
import { accountHandoffArticle } from "@/features/company/blog/account-handoff-content";

export const metadata = articleMetadata(accountHandoffArticle);
export { AccountHandoffPage as default } from "@/features/company/blog/account-handoff-page";
