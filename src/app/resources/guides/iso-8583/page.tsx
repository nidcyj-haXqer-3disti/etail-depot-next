import { iso8583Metadata } from "@/features/resources/references/iso-8583/reference";
import { Iso8583Reference } from "@/features/resources/references/iso-8583/iso8583-reference";
export const metadata = iso8583Metadata();
export default function ReferencePage() { return <Iso8583Reference />; }
