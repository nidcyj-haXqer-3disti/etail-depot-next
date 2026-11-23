import { articleMetadata } from "@/features/company/blog/metadata";
import { mixedOfferArticle } from "@/features/company/blog/mixed-offer-content";

export const metadata = articleMetadata(mixedOfferArticle);
export { MixedOfferPage as default } from "@/features/company/blog/mixed-offer-page";
