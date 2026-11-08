import type { ReactNode } from "react";
import { WooCommerceGuideScreenshot } from "./woocommerce-guide-screenshot";
import { CertificateFile } from "./woocommerce-connection-walkthrough";
import woo from "../../components/integration-guide.module.css";
function TransferAction({ number, id, title, where, children, photo }: { number: number; id: string; title: string; where: "WordPress.com" | "Your browser" | "Cyberduck"; children: ReactNode; photo?: ReactNode }) {
  return <details id={id} name="woo-transfer" open={number===1} className={woo.transferStep}>
    <summary><span className={woo.transferNumber}>8.{number}</span><h4 id={`${id}-title`}>{title}</h4><span className={woo.disclosureIcon} aria-hidden="true">+</span></summary>
    <div className={woo.transferBody}><div className={woo.photoCopy}><p className={woo.photoWhere}>{where}</p>{children}</div>{photo}
    </div>
  </details>;
}
export function WooCommerceFileTransfer() {
  return <div className={woo.photoSequence}>
    <div className={woo.fileHandoff}><CertificateFile label="Move this file to your store" /><p>Computer → Cyberduck → Your store. The pictures show Mac; Windows uses the same fields.</p></div>
    <TransferAction number={1} id="wordpress-file-access" title="Get your file access details" where="WordPress.com" photo={<WooCommerceGuideScreenshot name="storage" title="Get file access details" step="8.1" caption="Use the server, port, username and password for your own store." />}>
      <p>Select your store, then <strong>Settings → SFTP/SSH</strong>.</p><p>Click <strong>Create credentials</strong> if shown. Save the password and leave this tab open. SSH can stay disabled.</p><p className={woo.essentialNote}>This is the file access password, separate from your WordPress sign in.</p>
    </TransferAction>
    <TransferAction number={2} id="download-cyberduck" title="Open Cyberduck" where="Your browser" photo={<WooCommerceGuideScreenshot name="duckDownload" title="Download Cyberduck" step="8.2" caption="Use the download for your computer. A paid edition is not needed." />}>
      <p>Download Cyberduck from <a href="https://cyberduck.io/download/" target="_blank" rel="noopener noreferrer">cyberduck.io/download</a>.</p><p><strong>Mac:</strong> Open the .zip, move Cyberduck to Applications and open it.</p><p><strong>Windows:</strong> Open the installer, finish installation and open Cyberduck.</p>
    </TransferAction>
    <TransferAction number={3} id="connect-cyberduck" title="Connect to your store" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckConnect" title="Connect Cyberduck" step="8.3" caption="Copy the SFTP details from your open WordPress.com tab, then click Connect." />}>
      <p>Click <strong>Open Connection</strong> and choose <strong>SFTP</strong>.</p><dl className={woo.connectionValues}><div><dt>Server</dt><dd>sftp.wp.com</dd></div><div><dt>Port</dt><dd>22</dd></div><div><dt>Username</dt><dd>Your WordPress.com SFTP username</dd></div><div><dt>Password</dt><dd>Your file access password</dd></div><div><dt>Path</dt><dd>/htdocs/</dd></div></dl><p>Open <strong>More Options</strong> if Path is hidden. Click <strong>Connect</strong>.</p>
      <p className={woo.essentialNote}>Use the SFTP password here, not the .p12 password.</p>
      <details className={woo.smallHelp}><summary>If a fingerprint message appears</summary><p>For the first connection, check that the server is sftp.wp.com, then select Allow. If a saved fingerprint has changed, stop and check with WordPress.com.</p></details>
    </TransferAction>
    <TransferAction number={4} id="certificate-folder" title="Create a folder for your .p12" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckFolders" title="Open wp-content" step="8.4" caption="Open wp-content, then create the certificate folder inside it." />}>
      <p>Open <strong>htdocs → wp-content</strong>. You may already be inside htdocs.</p><p>Select <strong>View → Show Hidden Files</strong>, then <strong>File → New Folder</strong>.</p><p>Name the folder <code>.certificates</code>, including the first dot. Click <strong>Create</strong>, or open it if it already exists. This is a folder you create, not another file to download.</p>
      <p id="check-certificate-folder" className={`${woo.essentialNote} ${woo.storageNote}`}>The folder must block public downloads before you upload the .p12. A dot in its name or file permissions alone does not guarantee this. If unsure, contact Trolleys.</p>
    </TransferAction>
    <TransferAction number={5} id="certificate-folder-permissions" title="Set the folder permissions" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckFolderPermissions" title="Set folder permissions" step="8.5" caption="Set the folder to 700. Keep Apply changes recursively unselected." />}>
      <p>Select the <strong>.certificates</strong> folder, then <strong>File → Info → Permissions</strong>.</p><p>Enter <strong>700</strong> and press Tab. Close and reopen Info to check that 700 remains.</p>
    </TransferAction>
    <TransferAction number={6} id="upload-certificate-cyberduck" title="Upload the .p12 from your computer" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckSelectFile" title="Select your .p12 file" step="8.6" caption="Select your .p12, then click Upload. Two close views of the same screen; tap to see the full screenshot." />}>
      <p>Open the <strong>.certificates</strong> folder. If clicking only expands it, choose <strong>Go → Inside</strong>.</p><p>Select <strong>File → Upload</strong>. Open <strong>Downloads</strong>, or the folder where your browser saved the file.</p><p>Select your <strong>.p12 file</strong> and click <strong>Upload</strong>.</p><p className={woo.essentialNote}>Upload only your .p12 file, not the Shared Secret record.</p>
    </TransferAction>
    <TransferAction number={7} id="confirm-certificate-upload" title="Wait for Upload complete" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckComplete" title="Confirm the upload" step="8.7" caption="The upload is finished when Cyberduck shows Upload complete." />}>
      <p>Look for <strong>Upload complete</strong> in the Transfers window.</p><p>If the window is hidden, select <strong>Window → Transfers</strong>. Do not continue while the upload is running or failed.</p>
    </TransferAction>
    <TransferAction number={8} id="certificate-file-permissions" title="Protect the uploaded .p12" where="Cyberduck" photo={<WooCommerceGuideScreenshot name="duckFilePermissions" title="Set file permissions" step="8.8" caption="600 is for the .p12 file. The folder uses 700." />}>
      <p>Select the uploaded <strong>.p12</strong>, then <strong>File → Info → Permissions</strong>.</p><p>Enter <strong>600</strong> and press Tab. Close and reopen Info to check that 600 remains.</p><p className={woo.essentialNote}>Do not upload the certificate to the WordPress Media Library.</p>
    </TransferAction>
  </div>;
}
