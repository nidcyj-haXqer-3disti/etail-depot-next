import { iso8583Metadata } from "@/modules/public-site/iso8583-reference";
import { Iso8583Reference } from "@/ui/iso8583-reference";
export const metadata = iso8583Metadata();
export default function ReferencePage() { return <Iso8583Reference />; }
