"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ServiceNavigation() {
  const pathname = usePathname();
  const merchant = pathname.startsWith("/merchant");
  const cardholder = pathname.startsWith("/cardholder-services") || pathname.startsWith("/services/");
  return <nav className="service-header-nav" aria-label="Services">
    <Link href="/cardholder-services" aria-current={cardholder ? "page" : undefined}>Cards & spending</Link>
    <Link href="/merchant-services" aria-current={merchant ? "page" : undefined}>Accept payments</Link>
  </nav>;
}
