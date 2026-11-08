import { notFound } from "next/navigation";
import { ISO20022_SETS, isoCodeSet, isoMetadata } from "@/features/resources/references/iso-20022/reference";
import { Iso20022Reference } from "@/features/resources/references/iso-20022/iso20022-reference";
export const dynamicParams = false;
export function generateStaticParams() { return ISO20022_SETS.map(set => ({ set: set.slug })); }
type Props = { params: Promise<{ set: string }> };
export async function generateMetadata({ params }: Props) {
  const set = isoCodeSet((await params).set); if (!set) notFound(); return isoMetadata(set);
}
export default async function ReferencePage({ params }: Props) {
  const set = isoCodeSet((await params).set); if (!set) notFound(); return <Iso20022Reference set={set} />;
}
