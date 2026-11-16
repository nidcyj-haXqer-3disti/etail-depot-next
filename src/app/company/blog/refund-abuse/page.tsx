import { articleMetadata } from "@/features/company/blog/metadata";
import { refundAbuseArticle } from "@/features/company/blog/refund-abuse-content";
export const metadata = articleMetadata(refundAbuseArticle);
export { RefundAbusePage as default } from "@/features/company/blog/refund-abuse-page";
