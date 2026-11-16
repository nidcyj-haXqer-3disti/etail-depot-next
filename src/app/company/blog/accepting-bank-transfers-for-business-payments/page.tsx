import { articleMetadata } from "@/features/company/blog/metadata";
import { bankTransfersArticle } from "@/features/company/blog/bank-transfers-content";

export const metadata = articleMetadata(bankTransfersArticle);
export { BankTransfersPage as default } from "@/features/company/blog/bank-transfers-page";
