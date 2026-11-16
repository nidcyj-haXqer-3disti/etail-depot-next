import { articleMetadata } from "@/features/company/blog/metadata";
import { payableForecastArticle } from "@/features/company/blog/payable-forecast-content";

export const metadata = articleMetadata(payableForecastArticle);
export { PayableForecastPage as default } from "@/features/company/blog/payable-forecast-page";
