"use client";
import Link from "next/link";
import { serviceLabels } from "@/shared/service-language";
import { usePathname } from "next/navigation";

const links = [
  { href: "/payment-acceptance-service", label: serviceLabels.payments },
  { href: "/credit-card-services", label: serviceLabels.cards },
  { href: "/guides", label: "Guides" },
];

export function PublicNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav className="public-navigation" aria-label="Main navigation">
    {links.map(link => <Link key={link.href} href={link.href} onClick={onNavigate} aria-current={pathname === link.href ? "page" : link.href === "/guides" && pathname.startsWith("/guides/") ? "location" : undefined}>{link.label}</Link>)}
  </nav>;
}
