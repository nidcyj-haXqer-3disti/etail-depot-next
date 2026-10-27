import { notFound } from "next/navigation";
import { ISO20022_SETS, isoCode, isoCodeSet, isoMetadata } from "@/modules/public-site/iso20022-reference";
import { Iso20022Reference } from "@/ui/iso20022-reference";
export const dynamicParams = false;
export function generateStaticParams() { return ISO20022_SETS.flatMap(set => set.codes.map(code => ({ set: set.slug, code: code.path.split("/").at(-1)! }))); }
type Props = { params: Promise<{ set: string; code: string }> };
async function record(params: Props["params"]) {
  const values = await params, set = isoCodeSet(values.set); if (!set) notFound();
  const code = isoCode(set, values.code); if (!code) notFound(); return { set, code };
}
export async function generateMetadata({ params }: Props) { const { set, code } = await record(params); return isoMetadata(set, code); }
export default async function ReferencePage({ params }: Props) { const { set, code } = await record(params); return <Iso20022Reference set={set} code={code} />; }
