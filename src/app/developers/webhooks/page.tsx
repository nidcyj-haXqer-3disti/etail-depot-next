import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";
import { webhooksArticle } from "@/features/developers/guidance/webhooks";

export const metadata=developerMetadata("webhooks");
export default function Page(){return <DeveloperPage slug="webhooks" topics={[{id:"webhooks",title:"Payment updates",article:webhooksArticle}]}/>;}
