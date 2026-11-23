import { productWalletArticle } from "./product-wallet-content";
import { pickupWalletArticle } from "./pickup-wallet-content";
import { paymentButtonCopyArticle } from "./payment-button-copy-content";
import { walletButtonDesignArticle } from "./wallet-button-design-content";
import { walletCardChangeArticle } from "./wallet-card-change-content";

/** Tenth local expansion batch. These articles remain in the single Blog collection. */
export const walletExperienceArticles = [
  productWalletArticle,
  pickupWalletArticle,
  paymentButtonCopyArticle,
  walletButtonDesignArticle,
  walletCardChangeArticle,
] as const;
