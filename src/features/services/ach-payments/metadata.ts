import { servicePageMetadata } from "@/shared/seo/metadata";
import { achPaymentsContent } from "./content";

export const pageDetails = achPaymentsContent;
export const metadata = servicePageMetadata("/ach-payments", pageDetails);
