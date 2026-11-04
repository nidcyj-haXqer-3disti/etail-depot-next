import Image from "next/image";
import { merchantAccountGuidance } from "@/modules/public-site/merchant-account-content";
import { PaymentPortalLink } from "./service-entry";
import styles from "./merchant-account-guide.module.css";

function AccountScreenshot({ screen }: { screen: "welcome" | "registration" | "blank" }) {
  const screens = {
    welcome: {
      file: "welcome.jpg", height: 812,
      alt: "Trolleys Welcome screen with an editable Email field, a Sign In button and Register below it.",
      caption: "Welcome: enter your email here, then choose Register.",
    },
    registration: {
      file: "registration.jpg", height: 903,
      alt: "Register New Account screen with the email carried forward, followed by Password, Confirm Password and Register.",
      caption: "Registration: your email is filled in automatically.",
    },
    blank: {
      file: "blank-registration.jpg", height: 903,
      alt: "Top of the registration screen showing the Sign in link above Register New Account and a blank Email field.",
      caption: "Use Sign in above the heading to return to Welcome.",
    },
  };
  const shot = screens[screen];
  return <figure className={styles.figure}>
    <div className={`${styles.screenshot} ${styles[screen]}`}>
      <Image src={`/help/merchant-account/${shot.file}`} width={1280} height={shot.height} alt={shot.alt} unoptimized loading="lazy" />
    </div>
    <figcaption>{shot.caption}</figcaption>
  </figure>;
}

export function MerchantAccountGuide({ kind }: { kind: "sign-in" | "registration" | "email-recovery" }) {
  if (kind === "sign-in") return <div className={styles.guide}>
    <p>{merchantAccountGuidance.service}</p>
    <p><PaymentPortalLink intent="sign-in" className="text-link" /></p>
    <ol className={styles.recoverySteps}>
      <li>{merchantAccountGuidance.signIn}</li>
      <li>Follow the password prompt shown for your account.</li>
      <li>For an application in progress, continue the existing application. For an approved account, use the services enabled for it.</li>
    </ol>
  </div>;

  if (kind === "email-recovery") return <div className={styles.recovery}>
    <p>{merchantAccountGuidance.registrationEmail}</p>
    <AccountScreenshot screen="blank" />
    <ol className={styles.recoverySteps}>
      <li>Choose <strong>Sign in</strong> above the Register New Account heading.</li>
      <li>On Welcome, enter the email you want to use.</li>
      <li>For a new account, choose <strong>Register</strong>. For an existing account, choose <strong>Sign In</strong>.</li>
    </ol>
    <p>Check the email shown before continuing, then follow the password instructions for that account.</p>
  </div>;

  return <div className={styles.guide}>
    <p>Your merchant account opens in Trolleys, an Etail Depot service, at merchantapp.io. Enter your email on Welcome before continuing to registration.</p>
    <ol className={styles.steps}>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">1</span><h3>Enter your email on Welcome</h3></div>
        <p>Open <strong>Start now</strong> below. Enter your own email in the Email field, then choose <strong>Register</strong> beneath the Sign In button.</p>
        <PaymentPortalLink intent="register" className="button primary">Start now</PaymentPortalLink>
        <AccountScreenshot screen="welcome" />
        <p className={styles.hint}>{merchantAccountGuidance.registeredEmail}</p>
      </li>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">2</span><h3>Check the email shown and create a password</h3></div>
        <p>On Register New Account, your email is already filled in. Enter a password in Password and repeat it in Confirm Password. Follow any requirements shown, then choose <strong>Register</strong>.</p>
        <AccountScreenshot screen="registration" />
      </li>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">3</span><h3>Continue to your business application</h3></div>
        <p>After creating your password, continue to the business application. If asked to sign in, use the same email and your new password. Review the company information and account terms before submitting.</p>
      </li>
    </ol>
    <p className={styles.approval}>{merchantAccountGuidance.approval}</p>
  </div>;
}
