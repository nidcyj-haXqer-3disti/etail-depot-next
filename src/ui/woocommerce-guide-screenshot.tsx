"use client";
import Image from "next/image";
import { useRef } from "react";
import { GuidePreviewImage } from "./guide-preview-image";
import { woocommercePreviewAssets } from "./generated/woocommerce-preview-assets";
import store from "./assets/woo-store.webp";
import plugin from "./assets/woo-plugin.webp";
import payments from "./assets/woo-payments.webp";
import login from "./assets/woo-login.webp";
import keys from "./assets/woo-keys.webp";
import certificate from "./assets/woo-certificate.webp";
import credentials from "./assets/woo-credentials.webp";
import settings from "./assets/woo-settings.webp";
import storage from "./assets/woo-storage.webp";
import checkout from "./assets/woo-checkout.webp";
import records from "./assets/woo-records.webp";
import refund from "./assets/woo-refund.webp";
import duckDownload from "./assets/woo-cyberduck-download.webp";
import duckConnect from "./assets/woo-cyberduck-connect.webp";
import duckFolders from "./assets/woo-cyberduck-folders.webp";
import duckFolderPermissions from "./assets/woo-cyberduck-folder-permissions.webp";
import duckSelectFile from "./assets/woo-cyberduck-select-file.webp";
import duckComplete from "./assets/woo-cyberduck-complete.webp";
import duckFilePermissions from "./assets/woo-cyberduck-file-permissions.webp";
import styles from "./shopify-gateway-guide.module.css";
import woo from "./integration-guide.module.css";
const images = { store, plugin, payments, login, keys, certificate, credentials, settings, storage, checkout, records, refund, duckDownload, duckConnect, duckFolders, duckFolderPermissions, duckSelectFile, duckComplete, duckFilePermissions };
const focusPoints = {
  duckDownload: [610, 110], duckConnect: [430, 300], duckFolders: [230, 345], duckFolderPermissions: [370, 90], duckSelectFile: [630, 210], duckComplete: [330, 195], duckFilePermissions: [370, 215],
  store: [255, 364], plugin: [313, 250], payments: [1150, 520],
  login: [640, 400], keys: [240, 390], certificate: [1160, 450], credentials: [625, 1040],
  settings: [250, 2055], storage: [750, 390], checkout: [430, 605], records: [170, 240], refund: [755, 644],
} as const;
const descriptions = {
  duckDownload: "Cyberduck’s official download area. Red arrows point to the Windows and macOS downloads.",
  duckConnect: "Cyberduck Open Connection with SFTP selected, server sftp.wp.com, port 22 and path /htdocs/. The username is fictional and the password field is blank. An arrow points to Connect.",
  duckFolders: "Cyberduck inside /htdocs. An arrow points to the wp-content folder. The account name is fictional.",
  duckFolderPermissions: "Cyberduck folder permissions set to 700. Only the owner has read, write and execute permission.",
  duckSelectFile: "Cyberduck’s file picker on Mac with a fictional example_store.p12 file selected. An arrow points to Upload. This example file is not a working certificate.",
  duckComplete: "Cyberduck Transfers showing Upload complete. The certificate filename has been replaced with example_store.p12.",
  duckFilePermissions: "Cyberduck certificate permissions set to 600. Only the owner has read and write permission. The filename is fictional.",
  store: "WordPress Installed Plugins with the full navigation visible. A red arrow points to WooCommerce Settings.",
  plugin: "WordPress plugin list with a red arrow pointing to Configure Payment Settings beneath Visa Acceptance Solutions.",
  payments: "WooCommerce Payments screen with the provider list visible. A red arrow points to Manage beside Visa Acceptance Solutions.",
  login: "Live Cybersource Business Center sign in page with blank Organization ID, Username and Password fields. Red arrows mark each field and the Log in button.",
  keys: "Cybersource Key Generation result with a visible fictional Key ID and Shared Secret. A red arrow points to Download key.",
  certificate: "Two Cybersource screens: Download key for REST API Response MLE, followed by Set a Password. A fictional password is shown in both confirmation fields.",
  credentials: "Production configuration example in the real WooCommerce form. Arrows mark Production, live credential fields and protected certificate details. Fictional example values replace private credentials.",
  settings: "Complete Production configuration example with arrows marking Enable the gateway and Save changes. Credential fields contain fictional example values.",
  storage: "Full WordPress.com SFTP screen. The connection details area is marked. The public WordPress.com SFTP host is shown with a fictional username.",
  checkout: "Example checkout in the real WooCommerce interface. An arrow points to Checkout with card. Personal and product details are replaced with example labels.",
  records: "Business Center transaction example with arrows marking the Request ID, merchant reference and amount. Identifiers are replaced with fictional values.",
  refund: "WooCommerce order screen with a red arrow highlighting one dollar refunded and zero net payment. Private order details are hidden.",
};
type ScreenshotView = "apiValues" | "apiFields" | "certificateDownload" | "certificatePassword" | "certificateFields";
export function WooCommerceGuideScreenshot({ name, title, step, caption, view }: { name: keyof typeof images; title: string; step: number | string; caption: string; view?: ScreenshotView }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const scrollport = useRef<HTMLDivElement>(null);
  const src = images[name];
  const previewKey = view ?? name;
  const frames = previewKey in woocommercePreviewAssets
    ? woocommercePreviewAssets[previewKey as keyof typeof woocommercePreviewAssets]
    : [{ image: src, variants: [src], frame: null }];
  const crop = frames[0].frame;
  const focus = crop ? [crop[0] + crop[2] / 2, crop[1] + crop[3] / 2] : focusPoints[name];
  return <figure className={`${styles.figure} ${name === "login" ? woo.loginFigure : ""}`}>
    <a href={src.src} className={`${styles.screenshotButton} ${woo.fullScreenshot}`} aria-label={`Enlarge screenshot for step ${step}`} aria-haspopup="dialog" onClick={event => { if(dialog.current && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey){event.preventDefault();dialog.current.showModal();const frame = scrollport.current;if(frame){const [x,y] = focus;frame.scrollLeft = Math.max(0,x - frame.clientWidth / 2);frame.scrollTop = Math.max(0,y - frame.clientHeight / 2);}} }}>
      <span className={woo.photoViews}>{frames.map((preview, index) => <span key={index} data-woo-photo className={woo.photoFrame} style={{display:"block",position:"relative",overflow:"hidden",aspectRatio:`${preview.image.width} / ${preview.image.height}`}}><GuidePreviewImage preview={preview} alt={name === "duckSelectFile" ? index === 0 ? "The downloaded .p12 file selected in Cyberduck’s file picker. The filename is a fictional example." : "The Upload button in the same file picker." : descriptions[name]} priority={step === 1} sizes="(max-width: 760px) calc(100vw - 78px), (max-width: 1120px) calc(100vw - 138px), 982px" style={{position:"absolute",maxWidth:"none",width:"100%",height:"100%",inset:0}} /></span>)}</span>
      <span>Enlarge screenshot <span aria-hidden="true">＋</span></span>
    </a>
    <figcaption>{caption}</figcaption>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby={`woo-screenshot-${step}`}>
      <div className={styles.dialogHeader}><h4 id={`woo-screenshot-${step}`}>Step {step}: {title}</h4><button type="button" onClick={() => dialog.current?.close()} autoFocus>Close</button></div>
      <div ref={scrollport} className={styles.imageScroll} tabIndex={0} role="region" aria-label="Enlarged screenshot. Scroll to see the whole image."><Image src={src} alt={descriptions[name]} loading="lazy" unoptimized /></div>
      <p>{caption}</p>
    </dialog>
  </figure>;
}
