import { articleMetadata } from "@/features/company/blog/metadata";
import { retainedShoppingCartArticle } from "@/features/company/blog/retained-shopping-cart-content";

export const metadata = articleMetadata(retainedShoppingCartArticle);
export { RetainedShoppingCartPage as default } from "@/features/company/blog/retained-shopping-cart-page";
