import { articleMetadata } from "@/features/company/blog/metadata";
import { maskingEncryptionArticle } from "@/features/company/blog/masking-encryption-content";
export const metadata = articleMetadata(maskingEncryptionArticle);
export { MaskingEncryptionPage as default } from "@/features/company/blog/masking-encryption-page";
