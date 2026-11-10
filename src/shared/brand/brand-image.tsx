import type { CSSProperties } from "react";

/** Original small artwork is carried by render-blocking CSS, once per cached stylesheet. */
export function BrandImage({ brand, alt, width, height, className, style }: {
  brand: "symbol" | "etail" | "ledgix" | "visa" | "mastercard" | "amex" | "trolleys" | "apple-pay" | "google-pay" | "discover" | "trolleys-symbol";
  alt: string;
  width: number;
  height: number;
  className: string;
  style?: CSSProperties;
}) {
  return <span className={`inline-brand-image brand-image-${brand} ${className}`}
    style={{ aspectRatio: `${width} / ${height}`, ...style }}
    role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} />;
}
