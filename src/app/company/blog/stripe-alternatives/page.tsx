import { articleMetadata } from "@/features/company/blog/metadata";
import { stripeAlternativesArticle } from "@/features/company/blog/stripe-alternatives-content";

export const metadata = articleMetadata(stripeAlternativesArticle);
export { StripeAlternativesPage as default } from "@/features/company/blog/stripe-alternatives-page";
