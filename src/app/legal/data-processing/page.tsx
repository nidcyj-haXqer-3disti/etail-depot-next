import { legalPageMetadata } from "@/modules/public-site/legal-metadata";
import { LegalServiceDocument } from "@/ui/legal-service-document";
export const metadata = legalPageMetadata("/legal/data-processing");
export default function Page() { return <LegalServiceDocument slug="data-processing" />; }
