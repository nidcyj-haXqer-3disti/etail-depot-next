import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/integration-access"];
export const metadata = servicePageMetadata("/docs/integration-access", pageDetails);
