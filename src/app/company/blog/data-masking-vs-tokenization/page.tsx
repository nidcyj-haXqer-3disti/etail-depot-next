import { articleMetadata } from "@/features/company/blog/metadata";
import { maskingTokenizationArticle } from "@/features/company/blog/masking-tokenization-content";
export const metadata = articleMetadata(maskingTokenizationArticle);
export { MaskingTokenizationPage as default } from "@/features/company/blog/masking-tokenization-page";
