import { articleMetadata } from "@/features/company/blog/metadata";
import { makeAWishArticle } from "@/features/company/blog/make-a-wish-content";

export const metadata = articleMetadata(makeAWishArticle);
export { MakeAWishPage as default } from "@/features/company/blog/make-a-wish-page";
