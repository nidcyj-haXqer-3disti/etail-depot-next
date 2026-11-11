import type { ReactNode } from "react";
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
      <p>Copy <strong>Key</strong> and <strong>Shared Secret</strong>. Save both privately.</p>
      <p className={woo.essentialNote}>These are text values. Do not upload the Shared Secret download.</p>
    </PhotoAction>
    <PhotoAction title="Paste them into WooCommerce" where="WordPress admin" photo={<WooCommerceGuideScreenshot name="credentials" view="apiFields" title="Paste the API details" step="6.b" caption="The live Shared Secret field is labelled REST Shared Secret." />}>
      <p>Choose <strong>Production</strong>. Enter your <strong>Merchant ID</strong> from Trolleys, then paste the two values:</p>
      <dl className={woo.copyPairs}><div><dt>Key / Key ID</dt><dd>API Key Detail</dd></div><div><dt>Shared Secret</dt><dd>REST Shared Secret</dd></div></dl>
      <p className={woo.essentialNote}>Leave this tab open. You will save after adding the .p12 details.</p>
    </PhotoAction>
  </div>;
}
export function WooCommerceCertificateDownload() {
  return <div className={woo.photoSequence}>
    <p className={woo.sequenceNote}>If Trolleys already supplied a .p12 file and its password, use them.</p>
    <PhotoAction title="Click Download key" where="Cybersource" photo={<WooCommerceGuideScreenshot name="certificate" view="certificateDownload" title="Download the certificate" step="7.a" caption="Leave the optional box empty, then click Download key." />}>
      <p>In Key Management, choose <strong>Generate key → REST – API Response MLE → Generate key</strong>.</p>
      <p>Leave the optional certificate box empty. Click <strong>Download key</strong>.</p>
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
    <p className={woo.sequenceNote}><strong>Your .p12 is already uploaded.</strong> Fill in these fields in WordPress.</p>
    <WooCommerceGuideScreenshot name="credentials" view="certificateFields" title="Use your uploaded .p12 file" step={9} caption="Use your own filename and the password chosen when downloading the .p12." />
    <dl className={woo.fieldHelp}>
      <div><dt>Key File Path</dt><dd>Use this path with your own .p12 filename:<code className={woo.pathExample}>{wooExample.path}</code></dd></div>
      <div><dt>Key Password</dt><dd>The password you chose for the .p12, not your WordPress or SFTP password.</dd></div>
    </dl>
    <p className={woo.sequenceNote}>Turn on <strong>Enable Response MLE</strong>, then continue.</p>
  </div>;
}
