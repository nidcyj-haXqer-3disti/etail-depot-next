/* eslint-disable @next/next/no-img-element -- Static, versioned srcsets are generated before export; no runtime image service is required. */
import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";

type Preview = { image: StaticImageData; variants: readonly StaticImageData[] };

export function GuidePreviewImage({ preview, alt, priority = false, decoding = "async", sizes, style }: {
  preview: Preview;
  alt: string;
  priority?: boolean;
  decoding?: "async" | "sync";
  sizes: string;
  style?: CSSProperties;
}) {
  const { image, variants } = preview;
  const srcSet = variants.length > 1 ? variants.map(asset => `${asset.src} ${asset.width}w`).join(", ") : undefined;
  return <>
    {priority ? <link rel="preload" as="image" href={image.src} imageSrcSet={srcSet} imageSizes={srcSet ? sizes : undefined} /> : null}
    <img src={image.src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width={image.width} height={image.height} alt={alt} loading="eager" decoding={decoding} fetchPriority={priority ? "high" : undefined} style={{ aspectRatio: `${image.width} / ${image.height}`, ...style }} />
  </>;
}
