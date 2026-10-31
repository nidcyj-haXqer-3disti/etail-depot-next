import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "./icon";
import styles from "./attention-system.module.css";

type HeroProps = {
  id: string;
  label: string;
  title: ReactNode;
  intro: string;
  actions: ReactNode;
  note: ReactNode;
  artwork: ReactNode;
  className?: string;
};

export function AttentionHero({ id, label, title, intro, actions, note, artwork, className = "" }: HeroProps) {
  return <section className={`${styles.hero} ${className}`} aria-labelledby={id}>
    <div className={styles.layout}>
      <div className={styles.copy} data-attention-copy>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title} id={id}>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        <div className={`${styles.actions} ec-hero-actions commercial-action`}>{actions}</div>
        <p className={styles.note}>{note}</p>
      </div>
      <div className={styles.visual}>{artwork}</div>
    </div>
  </section>;
}

function Mark() {
  return <span className={styles.mark}><Image src="/brand/symbol.png" alt="" width={56} height={56} unoptimized /></span>;
}

export function AttentionArt({ kind }: { kind: "business" | "platform" | "provider" }) {
  const labels = {
    business: "Business review begins with what you sell, how customers pay and when you deliver. Account options follow review, not automatic approval.",
    platform: "Commerce, freight, travel and legal software connect their business records to merchant account setup, checkout and reporting. Access and account structure depend on the approved integration.",
    provider: "A previous provider’s account decision is separate from Etail’s new business review. Existing payments and obligations remain with the previous provider. New payments require account approval and setup.",
  };
  return <figure className={`${styles.art} ${styles[kind]}`} data-attention-art={kind} role="img" aria-label={labels[kind]}>
    <div className={styles.decor} aria-hidden="true"><div className={styles.orbit} /></div>
    {kind === "business" && <div className={styles.scene} aria-hidden="true">
      <div className={styles.sheet} data-art-record>
        <span className={styles.caption}>Your business, in view</span>
        {["What you sell", "How customers pay", "When you deliver"].map((text, index) => <div className={styles.businessLine} key={text}><span>{String(index + 1).padStart(2, "0")}</span><strong>{text}</strong><span className={styles.subjectIcon}><Icon name={["box", "card", "document"][index]} /></span></div>)}
      </div>
      <div className={styles.anchor} data-art-record><Mark /><div><small>Start with the business</small><strong>Review your payment options.</strong></div></div>
      <div className={styles.legend}>Account terms · Checkout · Payment records</div>
    </div>}
    {kind === "platform" && <div className={styles.scene} aria-hidden="true">
      <div className={`${styles.sheet} ${styles.platformSheet}`} data-art-record><span className={styles.caption}>Your software</span>
        {[["Commerce", "Order"], ["Freight", "Invoice"], ["Travel", "Booking"], ["Legal", "Matter"]].map(([name, record]) => <div className={styles.platformLine} key={name}><strong>{name}</strong><span>{record}</span></div>)}
      </div>
      <div className={styles.platformReview} data-art-record><Mark /><small>Etail Depot</small><strong>Merchant<br />services</strong><p>Account setup<br />Checkout<br />Reporting</p></div>
    </div>}
    {kind === "provider" && <div className={styles.scene} aria-hidden="true">
      <div className={styles.previous} data-art-record><span className={styles.caption}>Previous provider</span><strong>Account decision</strong><p>Existing payments<br />and obligations remain.</p></div>
      <div className={styles.next} data-art-record><Mark /><span className={styles.caption}>Your next step</span><strong>A new<br />business review.</strong><div>Business activity</div><div>Payment history</div><div>Account requirements</div></div>
      <div className={styles.legend}>New payments begin after approval and setup.</div>
    </div>}
  </figure>;
}
