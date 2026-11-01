import Link from "next/link";
import type { ReactNode } from "react";
import { SERVICE_DETAIL_PAGES, type ServiceDetailContent, type ServiceDetailPath } from "@/modules/public-site/service-detail-content";
import { canonicalOrigin } from "@/shared/public-release";
import { publicPageModified } from "@/shared/public-page-revisions";
import { Shell } from "./shell";
import { serviceBreadcrumb } from "./service-context";
import { PaymentPortalLink } from "./service-entry";
import { Icon } from "./icon";
import { ServiceDetailArt } from "./service-detail-art";
import s from "./service-detail.module.css";

export function ServiceDetailHero({ label, title, intro, actions, note, artwork }: { label: string; title: ReactNode; intro: ReactNode; actions: ReactNode; note?: ReactNode; artwork: ReactNode }) {
  return <section className={s.hero}><div className={s.container}><div className={s.heroCopy}><p className={s.eyebrow}>{label}</p><h1>{title}</h1><p className={s.intro}>{intro}</p><div className={s.actions} data-service-actions>{actions}</div>{note && <p className={s.note} data-service-note>{note}</p>}</div><div className={s.heroArt}>{artwork}</div></div></section>;
}

export function ServiceDetailPage({ path }: { path: ServiceDetailPath }) {
  const page: ServiceDetailContent = SERVICE_DETAIL_PAGES[path];
  const url = canonicalOrigin + path;
  const structured = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    serviceBreadcrumb(path),
  ] };
  const [overview, detail] = page.sections;
  const featureIcons = {
    onboarding: ["business", "box", "card"], methods: ["card", "card", "bank"],
    ach: ["document", "shield", "link"], payouts: ["card", "layers", "bank"],
    reconciliation: ["card", "document", "bank"], refunds: ["card", "arrow", "card"],
    disputes: ["document", "link", "layers"],
  }[page.kind];
  return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} /><div className={s.page} data-service-page={page.kind}>
    <ServiceDetailHero label={page.label} title={page.heading} intro={page.intro} note={page.note} actions={<>
      {page.action.href === "https://trolleys.ai" ? <PaymentPortalLink className={s.primary}>{page.action.label}</PaymentPortalLink> : <Link className={s.primary} href={page.action.href}>{page.action.label}</Link>}
      {page.secondaryAction && <Link className={s.secondary} href={page.secondaryAction.href}>{page.secondaryAction.label}</Link>}
    </>} artwork={<ServiceDetailArt kind={page.kind} title={page.art.title} caption={page.art.caption} />} />
    <section id={overview.id} className={s.overview} aria-labelledby="service-section-1"><div className={s.container}>
      <div className={s.sectionHeading}><h2 id="service-section-1">{overview.title}</h2>{overview.intro && <p>{overview.intro}</p>}</div>
      <dl className={s.benefits}>{overview.items.map((item, i) => <div key={item.title}><dt><span className={s.featureIcon}><Icon name={featureIcons[i]} /></span>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    </div></section>
    <section className={s.workflow} id={page.kind === "onboarding" ? "account-activation" : "service-workflow"} aria-labelledby="service-workflow-title"><div className={s.container}>
      <div className={s.sectionHeading}><div><p className={s.eyebrow}>How it works</p><h2 id="service-workflow-title">{page.workflow.title}</h2></div><p>{page.workflow.intro}</p></div>
      <ol className={s.flowSteps}>{page.workflow.steps.map((step, i) => <li key={step.title}><span className={s.flowNumber} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.detail}</p></li>)}</ol>
      <p className={s.workflowNote}>{page.workflow.note}</p>
    </div></section>
    <section className={s.detail} id={detail.id} aria-labelledby="service-section-2"><div className={s.container}><h2 id="service-section-2">{detail.title}</h2><dl>{detail.items.map(item => <div key={item.title}><dt>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</dt><dd>{item.text}</dd></div>)}</dl></div></section>
  </div></Shell>;
}
