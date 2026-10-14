import Image from "next/image";
import "./network-brands.css";

const networks = {
  visa: { name: "Visa", src: "/brand/networks/visa-blue.svg", width: 278.075, height: 169.374 },
  mastercard: { name: "Mastercard", src: "/brand/networks/mastercard.svg", width: 126, height: 82.8 },
  amex: { name: "American Express", src: "/brand/networks/american-express.svg", width: 45, height: 45 },
  discover: { name: "Discover", src: "/brand/networks/discover.jpg", width: 521, height: 342 },
} as const;

type Network = keyof typeof networks;

/** Original network artwork, served locally without redrawing or color filters. */
export function NetworkMark({ network, decorative = false, loading = "lazy" }: { network: Network; decorative?: boolean; loading?: "eager" | "lazy" }) {
  const mark = networks[network];
  return <Image unoptimized loading={loading} className={`network-mark network-mark-${network}`} src={mark.src} alt={decorative ? "" : mark.name} width={mark.width} height={mark.height} />;
}

export function NetworkBrands({ variant = "compact", label = "Card networks", loading = "lazy" }: { variant?: "compact" | "accepted"; label?: string; loading?: "eager" | "lazy" }) {
  return <div className={`network-brands network-brands-${variant}`} role="group" aria-label={label}>
    {(Object.keys(networks) as Network[]).map(network => <span className="network-brand-slot" key={network}><NetworkMark network={network} loading={loading} /></span>)}
  </div>;
}
