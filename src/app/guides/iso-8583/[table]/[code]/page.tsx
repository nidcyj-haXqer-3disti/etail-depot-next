import { notFound } from "next/navigation";
import { REFERENCE_SECTIONS, referenceSection, referenceEntries, referenceEntry, iso8583Metadata } from "@/modules/public-site/iso8583-reference";
import { Iso8583Reference } from "@/ui/iso8583-reference";
export const dynamicParams = false;
export function generateStaticParams() { return REFERENCE_SECTIONS.flatMap(section => referenceEntries(section).map(entry => ({ table: section.slug, code: entry.code }))); }
type Props = { params: Promise<{ table: string; code: string }> };
async function record(params: Props["params"]) { const values = await params, section = referenceSection(values.table); if (!section) notFound(); const entry = referenceEntry(section, values.code); if (!entry) notFound(); return { section, entry }; }
export async function generateMetadata({ params }: Props) { const { section, entry } = await record(params); return iso8583Metadata(section, entry); }
export default async function ReferencePage({ params }: Props) { const { section, entry } = await record(params); return <Iso8583Reference section={section} entry={entry} />; }
