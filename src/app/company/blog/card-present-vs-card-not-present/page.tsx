import { articleMetadata } from "@/features/company/blog/metadata";
import { cardPresenceArticle } from "@/features/company/blog/card-presence-content";

export const metadata = articleMetadata(cardPresenceArticle);
export { CardPresencePage as default } from "@/features/company/blog/card-presence-page";
