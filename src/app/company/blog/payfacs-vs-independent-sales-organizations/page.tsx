import { articleMetadata } from "@/features/company/blog/metadata";
import { payfacIsoArticle } from "@/features/company/blog/payfac-iso-content";
export const metadata = articleMetadata(payfacIsoArticle);
export { PayfacIsoPage as default } from "@/features/company/blog/payfac-iso-page";
