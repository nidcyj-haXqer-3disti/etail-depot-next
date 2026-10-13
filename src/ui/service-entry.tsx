import Image from "next/image";
import { hostedServices } from "@/shared/hosted-services";
import { Icon } from "./icon";
import "./service-entry.css";

export function ServiceStatus({ service }: { service: "cards" | "payments" }) {
  return <span className={`service-availability service-availability-${service}`}><span aria-hidden="true" />{hostedServices[service].status}</span>;
}

export function PaymentPortalLink({ className = "button primary", children = "Open Trolleys" }: { className?: string; children?: React.ReactNode }) {
  return <a className={className} href={hostedServices.payments.portalUrl} referrerPolicy="no-referrer" rel="external noreferrer">{children}<Icon name="external" /></a>;
}

export function CardContactLink({ className = "button primary" }: { className?: string }) {
  return <a className={className} href={hostedServices.cards.contactHref}>Contact Ledgix<Icon name="mail" /></a>;
}

/** The homepage's business photograph; product interfaces have their own illustrations. */
export function PaymentArtwork() {
  return <figure className="consumer-hero-visual">
    <Image src="/marketing/business-handoff-v1.webp" alt="A homeware business owner handing a customer their purchase" fill preload sizes="(max-width: 360px) calc(100vw - 36px), (max-width: 680px) calc(100vw - 48px), (max-width: 1100px) 46vw, (max-width: 1248px) 44vw, 550px" />
  </figure>;
}
