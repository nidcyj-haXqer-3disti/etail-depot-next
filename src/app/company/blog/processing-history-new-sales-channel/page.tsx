import { articleMetadata } from "@/features/company/blog/metadata";
import { channelHistoryArticle } from "@/features/company/blog/channel-history-content";

export const metadata = articleMetadata(channelHistoryArticle);
export { ChannelHistoryPage as default } from "@/features/company/blog/channel-history-page";
