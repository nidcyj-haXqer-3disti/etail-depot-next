import { documentationMetadata } from "@/features/resources/documentation/catalog";
import { servicePageMetadata } from "@/shared/seo/metadata";

export const pageDetails = documentationMetadata["/docs/testing-and-launch"];
export const metadata = servicePageMetadata("/docs/testing-and-launch", pageDetails);
