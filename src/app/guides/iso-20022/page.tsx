import { isoMetadata } from "@/features/resources/references/iso-20022/reference";
import { Iso20022Reference } from "@/features/resources/references/iso-20022/iso20022-reference";
export const metadata = isoMetadata();
export default function ReferencePage() { return <Iso20022Reference />; }
