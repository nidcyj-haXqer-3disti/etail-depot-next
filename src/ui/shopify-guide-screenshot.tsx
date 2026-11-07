"use client";

import Image from "next/image";
import { useRef } from "react";
import { GuidePreviewImage } from "./guide-preview-image";
import { shopifyPreviewAssets } from "./generated/shopify-preview-assets";
import { shopifyScreenshotAssets } from "./shopify-screenshot-assets";
import styles from "./shopify-gateway-guide.module.css";
import guide from "./integration-guide.module.css";

type ScreenshotProps = { step: number; title: string; file: keyof typeof shopifyScreenshotAssets; width: number; height: number; alt: string; caption: string };

export function ShopifyGuideScreenshot({ step, title, file, width, height, alt, caption }: ScreenshotProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const src = shopifyScreenshotAssets[file];
  return <figure className={`${styles.figure} ${guide.guideScreenshot}`} style={{ maxWidth: width + 26 }}>
    <a href={`/help/shopify/${file}`} className={styles.screenshotButton} aria-label={`Enlarge screenshot for step ${step}`} aria-haspopup="dialog" onClick={event => { if (dialog.current && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); dialog.current.showModal(); } }}>
      <GuidePreviewImage preview={shopifyPreviewAssets[file][0]} alt={alt} priority={step === 1} sizes={`(max-width: 760px) min(calc(100vw - 82px), ${width}px), min(calc(100vw - 142px), ${width}px, 974px)`} />
      <span>Enlarge screenshot <span aria-hidden="true">＋</span></span>
    </a>
    <figcaption>{caption}</figcaption>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={`screenshot-title-${step}`}>
      <div className={styles.dialogHeader}>
        <h4 id={`screenshot-title-${step}`}>Step {step}: {title}</h4>
        <button type="button" onClick={() => dialog.current?.close()} autoFocus>Close</button>
      </div>
      <div className={styles.imageScroll} tabIndex={0} role="region" aria-label="Enlarged screenshot. Scroll to see the whole image.">
        <Image src={src} width={width} height={height} alt={alt} loading="lazy" unoptimized />
      </div>
      <p>{caption}</p>
    </dialog>
  </figure>;
}
