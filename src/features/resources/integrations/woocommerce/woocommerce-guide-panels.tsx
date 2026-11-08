import { type WooCommerceStep } from "@/features/resources/integrations/woocommerce/woocommerce-content";
import { Icon } from "../../../../shared/ui/icon";
import styles from "../../components/integration-guide.module.css";
const destinations = {
  wordpress: { icon: "layers", name: "WordPress admin", url: "https://wordpress.com/log-in", display: "wordpress.com/log-in" },
  cybersource: { icon: "shield", name: "Cybersource Business Center", url: "https://ubc.cybersource.com/ebc2/", display: "ubc.cybersource.com" },
  hosting: { icon: "box", name: "WordPress.com file access", url: "https://my.wordpress.com/sites", display: "my.wordpress.com/sites" },
  storefront: { icon: "card", name: "Your online store", url: "https://wordpress.com/sites", display: "wordpress.com/sites" },
};
export function WooCommerceStepLocation({ step }: { step: WooCommerceStep }) {
  const items = step.location === "both" ? [destinations.wordpress, destinations.cybersource] : step.location === "hosting" ? [destinations.hosting] : step.location === "email" ? [] : [destinations[step.location]];
  return <div className={styles.location} role="group" aria-label="Where to complete this step">
    {step.location === "email" ? <div className={styles.destination}><Icon name="mail" /><div><strong>Your email inbox</strong><div className={styles.inboxLinks}><a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer">Gmail</a><a href="https://outlook.office.com/mail/" target="_blank" rel="noopener noreferrer">Outlook</a><span>or your usual email app</span></div></div></div> : items.map(item => <div key={item.name} className={styles.destination}><Icon name={item.icon} /><div><strong>{item.name}</strong><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.name === "Cybersource Business Center" ? "Open the live Business Center" : `Open ${item.name}`}>{item.display}</a></div></div>)}
    <div className={styles.menuPath}>{step.menu}</div>
  </div>;
}
