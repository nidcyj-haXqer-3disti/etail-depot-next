"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/payment-acceptance-service", label: "Payment acceptance" },
  { href: "/credit-card-services", label: "Credit cards" },
  { href: "/help", label: "Help" },
];

export function PublicNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className="public-navigation" aria-label="Main navigation">
    {links.map(link => <Link key={link.href} href={link.href} onClick={onNavigate} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
  </nav>;
}
