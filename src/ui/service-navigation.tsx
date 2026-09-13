"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ServiceNavigation({activeService}: {activeService?: "CARDHOLDER" | "MERCHANT"}) {
  const pathname = usePathname();
  const merchant = activeService === "MERCHANT" || (!activeService && pathname.startsWith("/merchant"));
  const cardholder = activeService === "CARDHOLDER" || (!activeService && (pathname.startsWith("/cardholder-services") || pathname.startsWith("/services/") || pathname.startsWith("/cards/")));
  return <nav className="service-header-nav" aria-label="Services">
    <Link href="/cardholder-services" aria-current={cardholder ? "page" : undefined}>Cards & spending</Link>
    <Link href="/merchant-services" aria-current={merchant ? "page" : undefined}>Accept payments</Link>
  </nav>;
}
