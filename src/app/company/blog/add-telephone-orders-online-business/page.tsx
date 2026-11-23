import { articleMetadata } from "@/features/company/blog/metadata";
import { telephoneChannelArticle } from "@/features/company/blog/telephone-channel-content";

export const metadata = articleMetadata(telephoneChannelArticle);
export { TelephoneChannelPage as default } from "@/features/company/blog/telephone-channel-page";
