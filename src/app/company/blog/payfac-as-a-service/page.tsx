import { articleMetadata } from "@/features/company/blog/metadata";
import { payfacServiceArticle } from "@/features/company/blog/payfac-service-content";
export const metadata = articleMetadata(payfacServiceArticle);
export { PayfacServicePage as default } from "@/features/company/blog/payfac-service-page";
