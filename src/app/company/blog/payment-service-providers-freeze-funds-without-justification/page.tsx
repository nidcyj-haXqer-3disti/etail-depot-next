import { articleMetadata } from "@/features/company/blog/metadata";
import { frozenFundsArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(frozenFundsArticle);
export { FrozenFundsPage as default } from "@/features/company/blog/frozen-funds-page";
