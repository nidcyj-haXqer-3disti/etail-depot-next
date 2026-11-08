import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";
import { integrationAccessArticle } from "@/features/developers/guidance/integration-access";
import { checkoutArticle } from "@/features/developers/guidance/checkout";

export const metadata=developerMetadata("getting-started");
export default function Page(){return <DeveloperPage slug="getting-started" topics={[{id:"integration-access",title:"Integration requirements",article:integrationAccessArticle},{id:"checkout",title:"Checkout integration",article:checkoutArticle}]}/>;}
