import { articleMetadata } from "@/features/company/blog/metadata";
import { pinPadArticle } from "@/features/company/blog/pin-pad-content";

export const metadata = articleMetadata(pinPadArticle);
export { PinPadPage as default } from "@/features/company/blog/pin-pad-page";
