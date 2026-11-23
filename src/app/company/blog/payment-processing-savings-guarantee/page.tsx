import { articleMetadata } from "@/features/company/blog/metadata";
import { savingsGuaranteeArticle } from "@/features/company/blog/savings-guarantee-content";

export const metadata = articleMetadata(savingsGuaranteeArticle);
export { SavingsGuaranteePage as default } from "@/features/company/blog/savings-guarantee-page";
