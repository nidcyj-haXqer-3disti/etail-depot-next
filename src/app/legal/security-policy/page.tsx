import { legalPageMetadata } from "@/features/company/legal/metadata";
import { LegalServiceDocument } from "@/features/company/legal/components/legal-service-document";
export const metadata = legalPageMetadata("/legal/security-policy");
export default function Page() { return <LegalServiceDocument slug="security-policy" />; }
