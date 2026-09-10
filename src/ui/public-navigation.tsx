"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [{ href: "/card-services", label: "Cards for your people" },{ href: "/payment-services", label: "Get paid together" },{ href: "/help", label: "Help" }];
export function PublicNavigation() {
  const pathname = usePathname();
  return <nav className="public-navigation" aria-label="Main navigation">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?"page":undefined}>{link.label}</Link>)}</nav>;
}
