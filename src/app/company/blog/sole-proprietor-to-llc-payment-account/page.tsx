import { articleMetadata } from "@/features/company/blog/metadata";
import { entityTransitionArticle } from "@/features/company/blog/entity-transition-content";

export const metadata = articleMetadata(entityTransitionArticle);
export { EntityTransitionPage as default } from "@/features/company/blog/entity-transition-page";
