import { articleMetadata } from "@/features/company/blog/metadata";
import { canceledOrderFeesArticle } from "@/features/company/blog/canceled-order-fees-content";

export const metadata = articleMetadata(canceledOrderFeesArticle);
export { CanceledOrderFeesPage as default } from "@/features/company/blog/canceled-order-fees-page";
