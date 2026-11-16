import { articleMetadata } from "@/features/company/blog/metadata";
import { cardDataStorageArticle } from "@/features/company/blog/card-data-storage-content";
export const metadata = articleMetadata(cardDataStorageArticle);
export { CardDataStoragePage as default } from "@/features/company/blog/card-data-storage-page";
