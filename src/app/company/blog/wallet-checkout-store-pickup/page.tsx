import { articleMetadata } from "@/features/company/blog/metadata";
import { pickupWalletArticle } from "@/features/company/blog/pickup-wallet-content";

export const metadata = articleMetadata(pickupWalletArticle);
export { PickupWalletPage as default } from "@/features/company/blog/pickup-wallet-page";
