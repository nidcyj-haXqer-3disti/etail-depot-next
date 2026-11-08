import { DeveloperPage } from "@/features/developers/page-content";
import { developerMetadata } from "@/features/developers/metadata";

export const metadata=developerMetadata("changelog");
export default function Page(){return <DeveloperPage slug="changelog" topics={[]}/>;}
