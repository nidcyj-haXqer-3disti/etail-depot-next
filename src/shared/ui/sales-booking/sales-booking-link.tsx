"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { hostedServices } from "../../site/hosted-services";
import { salesBookingUrl } from "../../site/sales-booking-url";
import { Icon } from "../icon";
import { BrandImage } from "../../brand/brand-image";
import "../../brand/brand-images-etail.css";
import styles from "./sales-booking.module.css";

type TriggerProps = {
  children?: ReactNode;
  className?: string;
  onOpen?: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export function SalesContactLink({ href = "/company/contact#payment-review", ...props }: TriggerProps & { href?: string }) {
  const url = salesBookingUrl(hostedServices.sales.bookingUrl);
  return url ? <SalesBookingLink url={url} {...props} className={props.className ?? ""} /> : <Link prefetch={false} href={href} className={props.className} onClick={props.onOpen}>{props.children ?? "Contact sales"}</Link>;
}

export function SalesBookingLink({ url, children = "Book a call", className = styles.button, onOpen, returnFocusRef }: TriggerProps & { url: string }) {
  const [embedHost, setEmbedHost] = useState("");
  const embedUrl = `${url}?embed_domain=${encodeURIComponent(embedHost)}&embed_type=Inline&hide_event_type_details=1&background_color=ffffff&text_color=193c33&primary_color=193c33`;
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);

  useEffect(() => {
    if (!open || !dialog.current) return;
    dialog.current.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  return <>
    <a ref={trigger} href={url} className={className} aria-haspopup="dialog" rel="noreferrer" referrerPolicy="no-referrer" onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof HTMLDialogElement === "undefined" || typeof HTMLDialogElement.prototype.showModal !== "function") return;
      event.preventDefault();
      onOpen?.();
      setEmbedHost(window.location.host);
      setFrameLoaded(false);
      setOpen(true);
    }}>{children}</a>
    {open && createPortal(<dialog ref={dialog} className={`${styles.dialog} public-booking`} aria-labelledby={titleId} onClose={() => {
      setOpen(false);
      const target = trigger.current?.getClientRects().length ? trigger.current : returnFocusRef?.current;
      if (target?.getClientRects().length) target.focus({ preventScroll: true });
    }}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <BrandImage brand="etail" alt="Etail Depot" width={800} height={150} className={styles.logo} />
          <h2 id={titleId} className={styles.accessibleTitle}>Book a call</h2>
          <p>{hostedServices.sales.durationMinutes} minutes with {hostedServices.sales.hostName}</p>
        </div>
        <button type="button" className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close" autoFocus><Icon name="close" /></button>
      </div>
      <div className={styles.frameArea}>
        {!frameLoaded && <p className={styles.loading} role="status">Loading available times…</p>}
        <iframe src={embedUrl} title="Book a call with Etail Depot" className={styles.frame} referrerPolicy="no-referrer" onLoad={() => setFrameLoaded(true)} />
      </div>
      <div className={styles.footer}>
        <a href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open booking in a new tab<Icon name="external" /></a>
      </div>
    </dialog>, document.body)}
  </>;
}
