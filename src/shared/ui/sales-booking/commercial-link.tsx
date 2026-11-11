import Link from "next/link";
import type { ReactNode } from "react";
import { SalesContactLink } from "./sales-booking-link";

/** Only the two established sales destinations open booking. Support stays separate. */
export function CommercialLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return href === "/company/contact#payment-review" || href === "/company/contact#platforms"
    ? <SalesContactLink href={href} className={className}>{children}</SalesContactLink>
    : <Link href={href} className={className}>{children}</Link>;
}
