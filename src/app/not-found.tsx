import Link from "next/link";
import { Shell } from "@/ui/shell";
import { Icon } from "@/ui/icon";

export default function NotFound() {
  return <Shell><section className="page-container notice-page"><span className="large-icon"><Icon name="info" /></span><h1>Page not found</h1><p className="muted notice-copy">This address may have changed. Return home to explore payment acceptance, the Ledgix credit card or help.</p><Link href="/" className="button primary">Back to home<Icon name="arrow" /></Link></section></Shell>;
}
