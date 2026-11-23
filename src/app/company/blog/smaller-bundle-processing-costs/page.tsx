import { articleMetadata } from "@/features/company/blog/metadata";
import { bundleProcessingCostsArticle } from "@/features/company/blog/bundle-processing-costs-content";

export const metadata = articleMetadata(bundleProcessingCostsArticle);
export { BundleProcessingCostsPage as default } from "@/features/company/blog/bundle-processing-costs-page";
