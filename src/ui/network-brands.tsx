import Image from "next/image";
import { BrandImage } from "./brand-image";
import "./brand-images-networks.css";
import "./network-brands.css";

const networks = {
  visa: { name: "Visa", width: 278.075, height: 169.374 },
  mastercard: { name: "Mastercard", width: 126, height: 82.8 },
  amex: { name: "American Express", width: 45, height: 45 },
  discover: { name: "Discover", src: "/brand/networks/discover.jpg", width: 521, height: 342 },
} as const;

type Network = keyof typeof networks;

/** Original network artwork: small vectors travel with the styles, larger raster artwork stays separate. */
export function NetworkMark({ network, decorative = false }: { network: Network; decorative?: boolean }) {
  const mark = networks[network];
  const alt = decorative ? "" : mark.name;
  const className = `network-mark network-mark-${network}`;
  return network === "discover"
    ? <Image unoptimized loading="eager" decoding="sync" className={className} src={networks.discover.src} alt={alt} width={mark.width} height={mark.height} />
    : <BrandImage brand={network} alt={alt} className={className} width={mark.width} height={mark.height} />;
}

export function NetworkBrands({ variant = "compact", label = "Card networks" }: { variant?: "compact" | "accepted"; label?: string }) {
  return <div className={`network-brands network-brands-${variant}`} role="group" aria-label={label}>
    {(Object.keys(networks) as Network[]).map(network => <span className="network-brand-slot" key={network}><NetworkMark network={network} /></span>)}
  </div>;
}
