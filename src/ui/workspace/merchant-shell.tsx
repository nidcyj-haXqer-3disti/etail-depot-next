import Link from "next/link";
import { Header } from "../shell";
import { WorkspaceIcon } from "./navigation";
import "./merchant-network.css";
import "../services.css";

export type MerchantTab = "channels" | "payments" | "people" | "verification";
export function MerchantShell({ merchantId, name, kind, tab = "channels", showPeople = true, primaryAccess = false, children }: {
  merchantId?: string; name?: string; kind?: "MASTER" | "SUB"; sponsor?: string;
  tab?: MerchantTab; showPeople?: boolean; primaryAccess?: boolean; children: React.ReactNode;
}) {
  const hierarchy = kind === "MASTER" ? "Primary merchant" : kind === "SUB" ? "Submerchant" : "Merchant";
  return <div className="mn-app"><Header authenticated /><div className="mn-frame"><aside className={`mn-sidebar${merchantId ? " mn-sidebar-with-merchant" : ""}`}>
    <p className="consumer-eyebrow">MERCHANT SERVICES</p>
    <Link href="/merchant-services" className="mn-directory-link"><WorkspaceIcon name="merchant" /><span>{name ?? "Merchant overview"}<small>{name ? hierarchy : "Collections, people and payment tools"}</small></span><WorkspaceIcon name="chevron" /></Link>
    <nav aria-label="Merchant navigation"><Link href="/merchant-services" aria-current={!merchantId ? "page" : undefined}><WorkspaceIcon name="overview" />Overview</Link>{merchantId && ([
      { id: "channels", label: "Payment channels", icon: "merchant" },
      { id: "payments", label: primaryAccess ? "Payments & transfers" : "Payments", icon: "activity" },
      { id: "people", label: "People & access", icon: "people" },
      { id: "verification", label: "Payment setup", icon: "shield" },
    ] as const).filter(item => item.id !== "people" || showPeople).map(item => <Link key={item.id} href={`/merchants/${merchantId}?tab=${item.id}`} aria-current={tab === item.id ? "page" : undefined}><WorkspaceIcon name={item.icon} />{item.label}</Link>)}</nav>
    <div className="mn-privacy-note"><strong>{!merchantId?"Merchant services":primaryAccess?`You manage this ${kind==="SUB"?"submerchant":"primary merchant"}.`:"Shared merchant access"}</strong><p>{!merchantId?"Collections and people, in one place.":primaryAccess?"Manage payments, channels and people here.":`Access to this ${kind==="SUB"?"submerchant":"merchant"} only.`}</p><Link href="/services">Invitations <WorkspaceIcon name="arrow" /></Link></div>
  </aside><main id="main-content" className="mn-main">{children}<footer className="mn-footer">Sandbox · No real money or external messages</footer></main></div></div>;
}
