import { SERVICE_DETAIL_PAGES, type ServiceDetailPath } from "@/modules/public-site/service-detail-content";
import { ServiceDetailLayout } from "@/features/services/shared/service-detail-layout";
import { ServiceDetailArt } from "./service-detail-art";
export { ServiceDetailHero } from "@/features/services/shared/service-detail-layout";

export function ServiceDetailPage({ path }: { path: ServiceDetailPath }) {
  const page = SERVICE_DETAIL_PAGES[path];
  return <ServiceDetailLayout path={path} page={page} artwork={<ServiceDetailArt kind={page.kind} title={page.art.title} caption={page.art.caption} />} />;
}
