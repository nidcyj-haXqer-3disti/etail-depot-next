import { articleMetadata } from "@/features/company/blog/metadata";
import { fundingPremiumArticle } from "@/features/company/blog/funding-premium-content";

export const metadata = articleMetadata(fundingPremiumArticle);
export { FundingPremiumPage as default } from "@/features/company/blog/funding-premium-page";
