import { articleMetadata } from "@/features/company/blog/metadata";
import { consumingWebhooksArticle } from "@/features/company/blog/consuming-webhooks-content";

export const metadata = articleMetadata(consumingWebhooksArticle);
export { ConsumingWebhooksPage as default } from "@/features/company/blog/consuming-webhooks-page";
