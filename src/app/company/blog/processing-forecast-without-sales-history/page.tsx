import { articleMetadata } from "@/features/company/blog/metadata";
import { honestProcessingForecastArticle } from "@/features/company/blog/honest-processing-forecast-content";

export const metadata = articleMetadata(honestProcessingForecastArticle);
export { HonestProcessingForecastPage as default } from "@/features/company/blog/honest-processing-forecast-page";
