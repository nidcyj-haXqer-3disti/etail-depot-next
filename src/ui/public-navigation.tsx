"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ href: "/card-services", label: "Cards & spending" },{ href: "/payment-services", label: "Accept payments" },{ href: "/help", label: "Help" }];
export function PublicNavigation() {
  const pathname = usePathname();
  return <nav className="public-navigation" aria-label="Main navigation">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}</nav>;
}
