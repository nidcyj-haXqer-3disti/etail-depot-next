import type { ReactNode } from "react";
import Link from "next/link";
import { wooExample } from "@/features/resources/integrations/woocommerce/woocommerce-content";
import { WooCommerceGuideScreenshot } from "./woocommerce-guide-screenshot";
import { Icon } from "../../../../shared/ui/icon";
import woo from "../../components/integration-guide.module.css";

function PhotoAction({ title, where, children, photo }: {
  title: string;
  where: "Cybersource" | "WordPress admin";
  children: ReactNode;
  photo: ReactNode;
}) {
  const isWordPress = where === "WordPress admin";
  const url = isWordPress ? "https://wordpress.com/log-in" : "https://ubc.cybersource.com/ebc2/";
  return <section className={woo.photoAction}>
    <div className={woo.photoCopy}>
      <p className={woo.photoWhere}>
        <Icon name={isWordPress ? "layers" : "document"} />
        <a href={url} target="_blank" rel="noopener noreferrer">{where}</a>
      </p>
      <h4>{title}</h4>
      {children}
    </div>
    {photo}
  </section>;
}
export function CertificateFile({ label }: { label: string }) {
  return <div className={woo.certificateFile} role="group" aria-label="Certificate file"><span className={woo.certificateFileIcon} aria-hidden="true"><Icon name="document" /><span>.p12</span></span><div><span className={woo.certificateFileLabel}>{label}</span><code>{wooExample.file}</code><p>Use your own downloaded file. Keep its name unchanged.</p></div></div>;
}
export function WooCommerceApiWalkthrough() {
  return <div className={woo.photoSequence}>
    <PhotoAction title="Copy the two values" where="Cybersource" photo={<WooCommerceGuideScreenshot name="keys" view="apiValues" title="Copy Key and Shared Secret" step="6.a" caption="Copy your Key and Shared Secret." />}>
      <p>If Trolleys supplied your Key ID and Shared Secret, use those. Otherwise, choose <strong>Generate key → REST – Shared Secret → Generate key</strong>.</p>
      <p>Use the copy button beside <strong>Key</strong> and <strong>Shared Secret</strong>. Save both privately before leaving this screen.</p>
      <p className={woo.essentialNote}>Paste these values into WordPress. There is no file to upload in this step.</p>
    </PhotoAction>
    <PhotoAction title="Paste them into WooCommerce" where="WordPress admin" photo={<WooCommerceGuideScreenshot name="credentials" view="apiFields" title="Paste the API details" step="6.b" caption="The live Shared Secret field is labelled REST Shared Secret." />}>
      <p>Choose <strong>Production</strong>. In <strong>Merchant ID</strong>, enter the <strong>Cybersource Merchant ID for this store</strong>. Use keys from that same live account.</p>
      <dl className={woo.copyPairs}><div><dt>Key / Key ID</dt><dd>API Key Detail</dd></div><div><dt>Shared Secret</dt><dd>REST Shared Secret</dd></div></dl>
      <p>The secret field may be labelled <strong>API Shared Secret Key</strong>. Leave this tab open until the .p12 details are added.</p>
      <details className={woo.smallHelp}><summary>Which Merchant ID should I use?</summary><p>Use the Cybersource gateway ID paired with this store in your Trolleys account email. Do not substitute the processing MID from the Back Office Operations Portal. <Link prefetch={false} href="/company/contact#account-support">Ask Trolleys to confirm the gateway ID</Link> if it is missing.</p></details>
    </PhotoAction>
  </div>;
}
export function WooCommerceCertificateDownload() {
  return <div className={woo.photoSequence}>
    <p className={woo.sequenceNote}>The plugin needs this file to receive payment updates. If Trolleys supplied a .p12 and its password for this store, use them.</p>
    <PhotoAction title="Click Download key" where="Cybersource" photo={<WooCommerceGuideScreenshot name="certificate" view="certificateDownload" title="Download the certificate" step="7.a" caption="Leave the optional box empty, then click Download key." />}>
      <p>In Key Management, choose <strong>Generate key → REST – API Response MLE → Generate key</strong>.</p>
      <p>Leave the optional certificate box empty. Click <strong>Download key</strong>. The box is optional; the downloaded .p12 is still needed.</p>
    </PhotoAction>
    <PhotoAction title="Choose the file’s password" where="Cybersource" photo={<WooCommerceGuideScreenshot name="certificate" view="certificatePassword" title="Choose the certificate password" step="7.b" caption="Save this password for the WooCommerce Key Password field." />}>
      <p>Enter a strong password in both boxes, then click <strong>Generate key</strong>.</p>
      <p>Save this password in your password manager. Your browser downloads the <strong>.p12 file</strong>.</p>
    </PhotoAction>
    <div className={woo.fileHandoff}><CertificateFile label="Saved on your computer" /><p>Find the <strong>.p12</strong> in Downloads. Leave it unopened. This is the one file to upload.</p></div>
  </div>;
}
export function WooCommerceCertificateSettings() {
  return <div className={woo.photoSequence} id="certificate-woocommerce-path">
    <span id="connection-fields-title" />
    <p className={woo.sequenceNote}><strong>After Cyberduck shows Upload complete, return to WordPress.</strong> Enter the file’s location and password below. There is no second upload here.</p>
    <WooCommerceGuideScreenshot name="credentials" view="certificateFields" title="Use your uploaded .p12 file" step={9} caption="Use your own filename and the password chosen when downloading the .p12." />
    <dl className={woo.fieldHelp}>
      <div><dt>Key File Path</dt><dd>For the WordPress.com folder shown, replace <strong>example_store.p12</strong> with your exact filename:<code className={woo.pathExample}>{wooExample.path}</code>Use the full server path, not a website URL or your computer’s Downloads path.</dd></div>
      <div><dt>Key Password</dt><dd>The password you chose for the .p12, not your WordPress or SFTP password.</dd></div>
    </dl>
    <p className={woo.sequenceNote}>Turn on <strong>Enable Response MLE</strong>, then continue.</p>
    <details className={woo.smallHelp}><summary>If WordPress cannot read the file</summary><p>Check the filename, server path and .p12 password. If you used a different protected folder, use its full server path. <Link prefetch={false} href="/company/contact#account-support">Contact Trolleys</Link> with the error message if it still fails. Keep the file and passwords private.</p></details>
  </div>;
}
