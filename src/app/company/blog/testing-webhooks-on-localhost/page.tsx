import { articleMetadata } from "@/features/company/blog/metadata";
import { localWebhooksArticle } from "@/features/company/blog/local-webhooks-content";

export const metadata = articleMetadata(localWebhooksArticle);
export { LocalWebhooksPage as default } from "@/features/company/blog/local-webhooks-page";
