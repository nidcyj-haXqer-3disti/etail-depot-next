import { articleMetadata } from "@/features/company/blog/metadata";
import { balanceSheetArticle } from "@/features/company/blog/balance-sheet-content";

export const metadata = articleMetadata(balanceSheetArticle);
export { BalanceSheetPage as default } from "@/features/company/blog/balance-sheet-page";
