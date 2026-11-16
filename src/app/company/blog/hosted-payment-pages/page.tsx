import { articleMetadata } from "@/features/company/blog/metadata";
import { hostedPaymentsArticle } from "@/features/company/blog/hosted-payments-content";

export const metadata = articleMetadata(hostedPaymentsArticle);
export { HostedPaymentsPage as default } from "@/features/company/blog/hosted-payments-page";
