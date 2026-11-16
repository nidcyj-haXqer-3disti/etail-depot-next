import { articleMetadata } from "@/features/company/blog/metadata";
import { settlementPayoutsArticle } from "@/features/company/blog/settlement-payouts-content";

export const metadata = articleMetadata(settlementPayoutsArticle);
export { SettlementPayoutsPage as default } from "@/features/company/blog/settlement-payouts-page";
