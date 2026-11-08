import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/checkout"];
export const metadata = servicePageMetadata("/docs/checkout", pageDetails);
