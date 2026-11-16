import { articleMetadata } from "@/features/company/blog/metadata";
import { achTimingArticle } from "@/features/company/blog/ach-timing-content";

export const metadata = articleMetadata(achTimingArticle);
export { AchTimingPage as default } from "@/features/company/blog/ach-timing-page";
