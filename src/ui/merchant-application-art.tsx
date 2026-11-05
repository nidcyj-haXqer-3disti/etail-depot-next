import { TrolleysBrand } from "./trolleys-brand";
import { Icon } from "./icon";
import s from "./merchant-application-art.module.css";

/** Static illustration of the observed portal. No merchant records or working controls. */
export function MerchantApplicationArt({ title, caption }: { title: string; caption: string }) {
  return <figure className={s.art} data-service-workflow="onboarding" aria-label={title}>
    <div className={s.stage} aria-hidden="true">
      <div className={s.portal}>
        <div className={s.top}>
          <TrolleysBrand compact inverse />
          <span className={s.account}><Icon name="person" /></span>
        </div>
        <div className={s.body}>
          <div className={s.heading}><strong>Merchant applications</strong><span className={s.add}>+</span></div>
          <div className={s.statuses}>
            <span><i className={s.amber} />Action needed</span>
            <span><i className={s.blue} />In review</span>
            <span><i className={s.green} />Approved</span>
          </div>
          <div className={s.application}>
            <div className={s.applicationDetails}>
              <span className={s.document}><Icon name="document" /></span>
              <div><strong>Merchant application</strong><span className={s.incomplete}><i />Incomplete</span></div>
            </div>
            <div className={s.applicationAction}><span className={s.continue}>Continue <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m8 5 5 5-5 5" /></svg></span></div>
          </div>
        </div>
      </div>
      <div className={s.profile}>
        <div className={s.step}><span>STEP 1 / 3</span><span className={s.progress}><i /></span></div>
        <strong className={s.profileTitle}>Company Profile</strong>
        <div className={s.field}><span>Legal Business Name</span><div className={s.blank}><i /></div></div>
        <div className={s.field}><span>Business Website</span><div className={s.blank}><i /></div></div>
      </div>
    </div>
    <figcaption>{caption}</figcaption>
  </figure>;
}
