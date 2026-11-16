import { articleMetadata } from "@/features/company/blog/metadata";
import { cardLifecycleArticle } from "@/features/company/blog/card-lifecycle-content";

export const metadata = articleMetadata(cardLifecycleArticle);
export { CardLifecyclePage as default } from "@/features/company/blog/card-lifecycle-page";
