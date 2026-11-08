import { pageJsonLd } from "@/features/resources/guides/metadata";
import { GuideDirectory } from "@/features/resources/guides/guide-directory";
import { Shell } from "@/shared/layout/shell";

export { metadata } from "@/features/resources/guides/metadata";

export default function GuidesPage() {
  return <Shell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageJsonLd() }} />
    <GuideDirectory />
  </Shell>;
}
