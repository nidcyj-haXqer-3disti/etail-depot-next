"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ServiceNavigation() {
  const pathname = usePathname();
  const merchant = pathname.startsWith("/merchant");
  const cardholder = pathname.startsWith("/cardholder-services") || pathname.startsWith("/services/");
  return <nav className="service-header-nav" aria-label="Services">
    <Link href="/cardholder-services" aria-current={cardholder ? "page" : undefined}>Cardholder services</Link>
    <Link href="/merchant-services" aria-current={merchant ? "page" : undefined}>Merchant services</Link>
  </nav>;
}
