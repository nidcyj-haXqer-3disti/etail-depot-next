import { articleMetadata } from "@/features/company/blog/metadata";
import { fulfillmentStoryArticle } from "@/features/company/blog/fulfillment-story-content";

export const metadata = articleMetadata(fulfillmentStoryArticle);
export { FulfillmentStoryPage as default } from "@/features/company/blog/fulfillment-story-page";
