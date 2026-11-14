import { WebhooksPage } from "@/features/developers/webhooks/page-content";
import { developerMetadata } from "@/features/developers/metadata";

export const metadata=developerMetadata("webhooks");
export default function Page(){return <WebhooksPage />;}
