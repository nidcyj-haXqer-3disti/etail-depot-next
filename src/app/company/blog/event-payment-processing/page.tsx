import { articleMetadata } from "@/features/company/blog/metadata";
import { eventPaymentsArticle } from "@/features/company/blog/event-payments-content";

export const metadata = articleMetadata(eventPaymentsArticle);
export { EventPaymentsPage as default } from "@/features/company/blog/event-payments-page";
