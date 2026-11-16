import { articleMetadata } from "@/features/company/blog/metadata";
import { guestCheckoutArticle } from "@/features/company/blog/guest-checkout-content";

export const metadata = articleMetadata(guestCheckoutArticle);
export { GuestCheckoutPage as default } from "@/features/company/blog/guest-checkout-page";
