import { articleMetadata } from "@/features/company/blog/metadata";
import { achTraceArticle } from "@/features/company/blog/ach-trace-content";

export const metadata = articleMetadata(achTraceArticle);
export { AchTracePage as default } from "@/features/company/blog/ach-trace-page";
