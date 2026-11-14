import { ApiReferencePage } from "@/features/developers/api-reference/page-content";
import { developerMetadata } from "@/features/developers/metadata";

export const metadata=developerMetadata("api-reference");
export default function Page(){return <ApiReferencePage />;}
