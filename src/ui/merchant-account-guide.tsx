import Image from "next/image";
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

export function MerchantAccountGuide({ kind }: { kind: "registration" | "email-recovery" }) {
  if (kind === "email-recovery") return <div className={styles.recovery}>
    <p>The Email field on Register New Account cannot be edited. It uses the address entered on Welcome. Opening the registration page directly can leave it blank.</p>
    <AccountScreenshot screen="blank" />
    <ol className={styles.recoverySteps}>
      <li>Choose <strong>Sign in</strong> above the Register New Account heading.</li>
      <li>On Welcome, enter the email you want to use.</li>
      <li>Choose <strong>Register</strong>. Check that your email appears before setting a password.</li>
    </ol>
    <p>Use the same steps if the email shown is incorrect.</p>
  </div>;

  return <div className={styles.guide}>
    <p>Your merchant account opens in Trolleys, an Etail Depot service, at merchantapp.io. Enter your email on Welcome before continuing to registration.</p>
    <ol className={styles.steps}>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">1</span><h3>Enter your email on Welcome</h3></div>
        <p>Open <strong>Start now</strong> below. Enter your own email in the Email field, then choose <strong>Register</strong> beneath the Sign In button.</p>
        <PaymentPortalLink intent="register" className="button primary">Start now</PaymentPortalLink>
        <AccountScreenshot screen="welcome" />
        <p className={styles.hint}>Already have an account? Enter your email on Welcome and choose Sign In.</p>
      </li>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">2</span><h3>Check your email and create a password</h3></div>
        <p>On Register New Account, your email is already filled in. Enter a password in Password and repeat it in Confirm Password. Follow any requirements shown, then choose <strong>Register</strong>.</p>
        <AccountScreenshot screen="registration" />
      </li>
      <li>
        <div className={styles.stepHeading}><span aria-hidden="true">3</span><h3>Sign in with your new password</h3></div>
        <p>The registration screen explains that you will be asked to sign in after creating your account. Use the same email and your new password, then follow the account instructions.</p>
      </li>
    </ol>
    <p className={styles.approval}>Creating a login does not approve or activate merchant services. Your business application and account approval are separate.</p>
  </div>;
}
