import "./brand-image.css";

/** Original small artwork is carried by render-blocking CSS, once per cached stylesheet. */
export function BrandImage({ brand, alt, width, height, className }: {
  brand: "etail" | "ledgix" | "visa" | "mastercard" | "amex";
  alt: string;
  width: number;
  height: number;
  className: string;
}) {
  return <span className={`inline-brand-image brand-image-${brand} ${className}`}
    style={{ aspectRatio: `${width} / ${height}` }}
    role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} />;
}
