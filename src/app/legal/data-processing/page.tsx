import { legalPageMetadata } from "@/features/company/legal/metadata";
import { LegalServiceDocument } from "@/features/company/legal/components/legal-service-document";
export const metadata = legalPageMetadata("/legal/data-processing");
export default function Page() { return <LegalServiceDocument slug="data-processing" />; }
