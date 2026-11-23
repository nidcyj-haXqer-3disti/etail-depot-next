import { articleMetadata } from "@/features/company/blog/metadata";
import { approvalRecordArticle } from "@/features/company/blog/approval-record-content";

export const metadata = articleMetadata(approvalRecordArticle);
export { ApprovalRecordPage as default } from "@/features/company/blog/approval-record-page";
