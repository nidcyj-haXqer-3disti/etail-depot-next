import { articleMetadata } from "@/features/company/blog/metadata";
import { mccApprovalArticle } from "@/features/company/blog/mcc-approval-content";

export const metadata = articleMetadata(mccApprovalArticle);
export { MccApprovalPage as default } from "@/features/company/blog/mcc-approval-page";
