import { articleMetadata } from "@/features/company/blog/metadata";
import { payableControlsArticle } from "@/features/company/blog/payable-controls-content";

export const metadata = articleMetadata(payableControlsArticle);
export { PayableControlsPage as default } from "@/features/company/blog/payable-controls-page";
