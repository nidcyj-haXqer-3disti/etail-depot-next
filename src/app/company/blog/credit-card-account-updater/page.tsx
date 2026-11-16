import { articleMetadata } from "@/features/company/blog/metadata";
import { accountUpdaterArticle } from "@/features/company/blog/account-updater-content";

export const metadata = articleMetadata(accountUpdaterArticle);
export { AccountUpdaterPage as default } from "@/features/company/blog/account-updater-page";
