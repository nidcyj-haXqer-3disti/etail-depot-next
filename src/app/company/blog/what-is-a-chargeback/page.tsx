import { articleMetadata } from "@/features/company/blog/metadata";
import { chargebackArticle } from "@/features/company/blog/chargeback-content";
export const metadata = articleMetadata(chargebackArticle);
export { ChargebackPage as default } from "@/features/company/blog/chargeback-page";
