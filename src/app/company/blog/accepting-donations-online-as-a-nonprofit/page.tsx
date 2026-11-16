import { articleMetadata } from "@/features/company/blog/metadata";
import { nonprofitDonationsArticle } from "@/features/company/blog/nonprofit-donations-content";

export const metadata = articleMetadata(nonprofitDonationsArticle);
export { NonprofitDonationsPage as default } from "@/features/company/blog/nonprofit-donations-page";
