import { isoMetadata } from "@/modules/public-site/iso20022-reference";
import { Iso20022Reference } from "@/ui/iso20022-reference";
export const metadata = isoMetadata();
export default function ReferencePage() { return <Iso20022Reference />; }
