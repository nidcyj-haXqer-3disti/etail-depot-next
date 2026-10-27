import { serviceExample } from "@/modules/public-site/service-model";
import { Icon } from "./icon";
import "./payment-artwork.css";

/** Shared visual identity for the read-only merchant experience. */
export function PaymentArtworkHeader({ caption, icon, businessId }: { caption: string; icon: "document" | "lock" | "bank"; businessId?: string }) {
  return <div className="payment-artwork-header">
    <span className="payment-artwork-business" id={businessId}><span className="payment-artwork-monogram" aria-hidden="true"><Icon name="box" /></span>{serviceExample.business}</span>
    <span className="payment-artwork-caption"><Icon name={icon} />{caption}</span>
  </div>;
}
