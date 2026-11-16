import { articleMetadata } from "@/features/company/blog/metadata";
import { posReaderArticle } from "@/features/company/blog/pos-reader-content";

export const metadata = articleMetadata(posReaderArticle);
export { PosReaderPage as default } from "@/features/company/blog/pos-reader-page";
