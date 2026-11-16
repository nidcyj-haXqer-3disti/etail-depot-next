import { articleMetadata } from "@/features/company/blog/metadata";
import { offlinePaymentsArticle } from "@/features/company/blog/offline-payments-content";

export const metadata = articleMetadata(offlinePaymentsArticle);
export { OfflinePaymentsPage as default } from "@/features/company/blog/offline-payments-page";
