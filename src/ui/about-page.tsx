import { Shell } from "./shell";
import { CommercialStructuredData } from "./commercial-structured-data";
import Link from "next/link";
import { COMMERCIAL_PAGES, type CommercialPage } from "@/modules/public-site/commercial-content";
import { legalIdentity } from "@/shared/legal-identity";
import styles from "./about-page.module.css";

function CompanyIllustration() {
  return <div className={styles.illustration} aria-hidden="true">
    <svg viewBox="0 0 420 260" fill="none" focusable="false" strokeLinecap="round" strokeLinejoin="round">
      <path d="M37 184 213 91 389 184 213 239Z" fill="#f0f4ec" />
      <g stroke="#c4d4c8" strokeWidth=".8">
        {[0,1,2,3,4,5].map(i => <path key={i} d={`M${59+i*22} ${172-i*11.5} ${235+i*22} ${227-i*6.9}`} />)}
        {[0,1,2,3,4,5].map(i => <path key={i} d={`M${59+i*22} ${191+i*6.9} ${235+i*22} ${103+i*11.5}`} />)}
      </g>
      <path d="M90 186V75l61-32 61 32v111l-61 32Z" fill="#fbfcf9" stroke="#4c7063" strokeWidth="1.2" />
      <path d="M151 218V107L90 75m61 32 61-32M151 43v64" stroke="#86a595" />
      <path d="M106 181V99l30 16v82Z" fill="#e4ede2" stroke="#91ac9a" />
      <path d="m151 61 43 23-43 23-43-23Z" fill="#edf3e9" />
      <path d="m165 119 32-17v81l-32 17Z" fill="#fff" stroke="#91ac9a" />
      <path d="M232 186V75l61-32 61 32v111l-61 32Z" fill="#fbfcf9" stroke="#4c7063" strokeWidth="1.2" />
      <path d="M293 218V107l-61-32m61 32 61-32M293 43v64" stroke="#86a595" />
      <path d="M248 181V99l30 16v82Z" fill="#e4ede2" stroke="#91ac9a" />
      <path d="m293 61 43 23-43 23-43-23Z" fill="#edf3e9" />
      <path d="m307 119 32-17v81l-32 17Z" fill="#fff" stroke="#91ac9a" />
      <path d="m172 132 59-31 39 21-59 31Z" fill="#d6e6d5" stroke="#547b69" strokeWidth="1.2" />
      <path d="m172 132 39 21v14l-39-21Zm39 21 59-31v14l-59 31Z" fill="#edf3e8" stroke="#547b69" strokeWidth="1.2" />
      <path d="m184 126 39 21m-27-27 39 21m-27-27 39 21m-27-27 39 21" stroke="#a1bba5" />
    </svg>
  </div>;
}

export function AboutPageContent({ page }: { page: CommercialPage }) {
  return <article className={styles.page}>
    <div className={styles.reading}>
      <CompanyIllustration />
      <header className={styles.intro}><h1>{page.heading}</h1><p>{page.intro}</p></header>
      <div className={styles.story}>{page.sections[0].items.map(item => <p key={item.title}>{item.text}</p>)}</div>
      <section className={styles.identity} aria-label="Company and account information">
        <p>{legalIdentity.company} operates as a <Link href="/payment-facilitator">nonbank payment facilitator</Link>. We are not a bank. Merchant accounts require review and approval. Card services have separate eligibility requirements, credit limits and account terms.</p>
      </section>
      <div className={styles.contact}><p>For business and partnership inquiries, <Link href={page.action.href}>{page.action.label.toLowerCase()}</Link>.</p></div>
    </div>
  </article>;
}

export function AboutPage() {
  return <Shell><CommercialStructuredData path="/company" /><AboutPageContent page={COMMERCIAL_PAGES["/company"]} /></Shell>;
}
