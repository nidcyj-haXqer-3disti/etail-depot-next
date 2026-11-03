import { hostedServices } from "@/shared/hosted-services";
import styles from "./service-entry.module.css";

/** Account handoffs use fixed destinations without visitor input or a referrer. */
export function PaymentPortalLink({ intent, className = "button primary", children, showArrow = intent === "register" }: { intent: "sign-in" | "register"; className?: string; children?: React.ReactNode; showArrow?: boolean }) {
  const registration = intent === "register";
  const href = registration ? hostedServices.payments.registrationUrl : hostedServices.payments.signInUrl;
  const arrow = showArrow && <svg className={styles.arrow} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path className={styles.shaft} d="M3 8h9" />
    <path className={styles.tip} d="m6 4 4 4-4 4" />
  </svg>;
  return <a className={showArrow ? `${className} ${styles.action}` : className} href={href} aria-description={registration ? "Enter your email on the Trolleys welcome page, then choose Register. Account approval is required." : "Trolleys is an Etail Depot service. Enter your email on the welcome page to access your merchant account."} referrerPolicy="no-referrer" rel="external noreferrer">
    {registration ? <>{children ?? "Start now"}{arrow}</> : <><span className={styles.label}>{children ?? "Sign in"} to {hostedServices.payments.name}</span>{arrow}</>}
  </a>;
}
