import { publicPageMetadata, publicPageJsonLd } from "@/modules/public-site/metadata";
import { GuideDirectory } from "@/ui/guide-directory";
import { Shell } from "@/shared/layout/shell";

export const metadata = publicPageMetadata("/guides");

export default function GuidesPage() {
  return <Shell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: publicPageJsonLd("/guides") }} />
    <GuideDirectory />
  </Shell>;
}
