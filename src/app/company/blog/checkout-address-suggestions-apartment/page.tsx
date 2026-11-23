import { articleMetadata } from "@/features/company/blog/metadata";
import { addressSuggestionArticle } from "@/features/company/blog/address-suggestion-content";

export const metadata = articleMetadata(addressSuggestionArticle);
export { AddressSuggestionPage as default } from "@/features/company/blog/address-suggestion-page";
