import Image from "next/image";
import welcome from "./assets/welcome.jpg";
import registration from "./assets/registration.jpg";
import blankRegistration from "./assets/blank-registration.jpg";
import { merchantAccountGuidance } from "@/shared/site/merchant-account-guidance";
import { ApplicationGuideSteps } from "./application-guide-steps";
import { PaymentPortalLink } from "../../../shared/ui/merchant-portal-link";
import styles from "./merchant-account-guide.module.css";

function AccountScreenshot({ screen }: { screen: "welcome" | "registration" | "blank" }) {
  const screens = {
    welcome: {
      src: welcome, height: 812,
      alt: "Trolleys Welcome screen with an editable Email field, a Sign In button and Register below it.",
      caption: "Welcome: enter your email before choosing Register or Sign In.",
    },
    registration: {
      src: registration, height: 903,
      alt: "Register New Account screen with the email carried forward, followed by Password, Confirm Password and Register.",
      caption: "Registration: your email is filled in automatically.",
    },
    blank: {
      src: blankRegistration, height: 903,
      alt: "Top of the registration screen showing the Sign in link above Register New Account and a blank Email field.",
      caption: "Use Sign in above the heading to return to Welcome.",
    },
  };
  const shot = screens[screen];
  return <figure className={styles.figure}>
    <div className={`${styles.screenshot} ${styles[screen]}`}>
      <Image src={shot.src} width={1280} height={shot.height} alt={shot.alt} unoptimized decoding="sync" preload={screen === "welcome"} loading={screen === "welcome" ? undefined : "eager"} />
    </div>
    <figcaption>{shot.caption}</figcaption>
  </figure>;
}

export function MerchantAccountGuide({ kind }: { kind: "sign-in" | "registration" | "email-recovery" }) {
  if (kind === "sign-in") return <div className={styles.guide}>
    <ol className={styles.recoverySteps}>
      <li>Open <strong>Sign in to Trolleys</strong> below. Enter your registered email on <strong>Welcome</strong>, then choose <strong>Sign In</strong>.</li>
      <li>Follow the password prompt. If asked to create a password, finish that step for the same email.</li>
      <li id="account-changes">Once signed in, continue the existing application or open your approved account.</li>
    </ol>
    <PaymentPortalLink intent="sign-in" className="text-link" />
  </div>;

  if (kind === "email-recovery") return <div className={styles.recovery}>
    <div className={styles.recoveryCopy}>
      <p>The Email field on <strong>Register New Account</strong> cannot be edited. It uses the address entered on Welcome.</p>
      <ol className={styles.recoverySteps}>
        <li>Choose <strong>Sign in</strong> above the Register New Account heading.</li>
        <li>On <strong>Welcome</strong>, enter the correct email.</li>
        <li>For a new account, choose <strong>Register</strong>. For an existing account, choose <strong>Sign In</strong>.</li>
      </ol>
    </div>
    <AccountScreenshot screen="blank" />
  </div>;

  return <div className={styles.guide}>
    <ol className={styles.steps}>
      <li>
        <div className={styles.stepCopy}>
          <div className={styles.stepHeading}><span aria-hidden="true">1</span><h3>Enter your email on Welcome</h3></div>
          <p>Open <strong>Start now</strong>. Enter your email in the <strong>Email</strong> field, then choose <strong>Register</strong> beneath the Sign In button.</p>
          <PaymentPortalLink intent="register" className="button primary">Start now</PaymentPortalLink>
          <p className={styles.hint}>{merchantAccountGuidance.registeredEmail}</p>
        </div>
        <AccountScreenshot screen="welcome" />
      </li>
      <li>
        <div className={styles.stepCopy}>
          <div className={styles.stepHeading}><span aria-hidden="true">2</span><h3>Create your password</h3></div>
          <p>On <strong>Register New Account</strong>, check the email carried over from Welcome. Enter and confirm your password, follow the requirements shown, then choose <strong>Register</strong>.</p>
          <p className={styles.hint}>Email blank or wrong? <a href="#registration-email">Return to Welcome to correct it.</a></p>
        </div>
        <AccountScreenshot screen="registration" />
      </li>
      <ApplicationGuideSteps />
    </ol>
  </div>;
}
