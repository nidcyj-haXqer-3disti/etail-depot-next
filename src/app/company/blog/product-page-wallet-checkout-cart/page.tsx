import { articleMetadata } from "@/features/company/blog/metadata";
import { productWalletArticle } from "@/features/company/blog/product-wallet-content";

export const metadata = articleMetadata(productWalletArticle);
export { ProductWalletPage as default } from "@/features/company/blog/product-wallet-page";
