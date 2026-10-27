import { notFound } from "next/navigation";
import { REFERENCE_SECTIONS, referenceSection, iso8583Metadata } from "@/modules/public-site/iso8583-reference";
import { Iso8583Reference } from "@/ui/iso8583-reference";
export const dynamicParams = false;
export function generateStaticParams() { return REFERENCE_SECTIONS.map(section => ({ table: section.slug })); }
type Props = { params: Promise<{ table: string }> };
async function record(params: Props["params"]) { const values = await params, section = referenceSection(values.table); if (!section) notFound(); return section; }
export async function generateMetadata({ params }: Props) { return iso8583Metadata(await record(params)); }
export default async function ReferencePage({ params }: Props) { return <Iso8583Reference section={await record(params)} />; }
