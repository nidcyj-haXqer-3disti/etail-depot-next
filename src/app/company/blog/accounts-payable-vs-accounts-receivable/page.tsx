import { articleMetadata } from "@/features/company/blog/metadata";
import { payablesReceivablesArticle } from "@/features/company/blog/payables-receivables-content";

export const metadata = articleMetadata(payablesReceivablesArticle);
export { PayablesReceivablesPage as default } from "@/features/company/blog/payables-receivables-page";
