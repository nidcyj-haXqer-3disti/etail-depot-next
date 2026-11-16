import { articleMetadata } from "@/features/company/blog/metadata";
import { achWireArticle } from "@/features/company/blog/ach-wire-content";

export const metadata = articleMetadata(achWireArticle);
export { AchWirePage as default } from "@/features/company/blog/ach-wire-page";
