import { servicePageMetadata } from "@/shared/seo/metadata";
import { trustContent } from "./content";

export const pageDetails = trustContent;
export const metadata = servicePageMetadata("/company/security", pageDetails);
