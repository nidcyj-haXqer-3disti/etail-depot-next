import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";

export const metadata=developerMetadata("api-status");
export default function Page(){return <DeveloperPage slug="api-status" topics={[]}/>;}
