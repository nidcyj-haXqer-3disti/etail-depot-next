import { articleMetadata } from "@/features/company/blog/metadata";
import { fednowRtpArticle } from "@/features/company/blog/fednow-rtp-content";

export const metadata = articleMetadata(fednowRtpArticle);
export { FednowRtpPage as default } from "@/features/company/blog/fednow-rtp-page";
