import { articleMetadata } from "@/features/company/blog/metadata";
import { moneyStopsMovingArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(moneyStopsMovingArticle);
export { MoneyStopsMovingPage as default } from "@/features/company/blog/money-stops-moving-page";
