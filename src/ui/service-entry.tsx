import { hostedServices } from "@/shared/hosted-services";

export function PaymentPortalLink({ className = "button primary", children = "Open Trolleys" }: { className?: string; children?: React.ReactNode }) {
  return <a className={className} href={hostedServices.payments.portalUrl} referrerPolicy="no-referrer" rel="external noreferrer">{children}</a>;
}
