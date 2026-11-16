import { articleMetadata } from "@/features/company/blog/metadata";
import { bankAccountNumberArticle } from "@/features/company/blog/bank-account-number-content";

export const metadata = articleMetadata(bankAccountNumberArticle);
export { BankAccountNumberPage as default } from "@/features/company/blog/bank-account-number-page";
