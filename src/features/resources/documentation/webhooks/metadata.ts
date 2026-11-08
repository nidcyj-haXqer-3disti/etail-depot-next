import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/webhooks"];
export const metadata = servicePageMetadata("/docs/webhooks", pageDetails);
