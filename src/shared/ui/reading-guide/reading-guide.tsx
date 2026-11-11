import type { ReactNode } from "react";
import Link from "next/link";
import { Shell } from "@/shared/layout/shell";
import { Icon } from "@/shared/ui/icon";
import { ResponsiveContentsFocus } from "@/shared/ui/responsive-contents-focus";
import { DocumentationFlow } from "./documentation-diagrams";
import type { DocArticle, DocSection } from "./types";
import "./site-artwork-polish-documentation.css";
import "./documentation.css";
import "./enterprise-support-documentation.css";
import "./connected-resources-documentation.css";
import "./documentation-craft.css";
import "./reading-guide.css";

function DocumentationLink({href,label}:{href:string;label:string}){
 return <Link prefetch={false} className="docs-text-link" href={href}>{label}</Link>;
}

function ArticleSection({section,illustration}:{section:DocSection;illustration?:ReactNode}){
 const integratedSteps = section.steps && (section.flow === "onboarding" || section.flow === "events" || section.flow === "disputes" || section.flow === "payouts") ? section.steps : undefined;
 return <section className="docs-section" id={section.id} aria-labelledby={`${section.id}-title`}>
  {section.aliases?.map(id=><span className="docs-legacy-anchor" key={id} id={id} aria-hidden="true"/>)}
  <h2 id={`${section.id}-title`}>{section.title}</h2>
  {section.paragraphs?.map(p=><p key={p}>{p}</p>)}
  {section.prerequisites&&section.prerequisites.length>0&&<div className="docs-prerequisites"><h3>Before you begin</h3><ul>{section.prerequisites.map(text=><li key={text}><Icon name="check"/>{text}</li>)}</ul></div>}
  {illustration}
  {section.flow&&<DocumentationFlow kind={section.flow} steps={integratedSteps}/>}
  {section.steps&&!integratedSteps&&<ol className="docs-steps">{section.steps.map((step,i)=><li key={step.title}><span className="docs-step-number" aria-hidden="true">{i+1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>}
  {section.rows&&<dl className="docs-facts">{section.rows.map(row=><div key={row.title}><dt>{row.title}</dt><dd>{row.text}</dd></div>)}</dl>}
  {section.table&&<div className="docs-table-scroll" role="region" aria-label={`${section.table.caption}. Scroll horizontally if needed.`} tabIndex={0}>
   <table className="docs-table"><caption>{section.table.caption}</caption><thead><tr>{section.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead>
    <tbody>{section.table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{section.table!.codeColumn?<code>{cell.split(section.table!.breakCodeWords ? /(?<=[._/])|(?<=[a-z])(?=[A-Z])/ : /(?<=[._/])/).map((part,index)=><span key={index}>{part}<wbr/></span>)}</code>:cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody>
   </table>
  </div>}
  {section.note&&<aside className="docs-note" aria-label={section.note.title}><Icon name="info"/><div><strong>{section.note.title}</strong><p>{section.note.text}</p></div></aside>}
  {section.details&&<div className="docs-details">{section.details.map(item=><details key={item.title}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.text}</p></details>)}</div>}
  {section.outcome&&<div className="docs-outcome"><Icon name="check"/><div><strong>What to confirm</strong><p>{section.outcome}</p></div></div>}
  {section.link&&<DocumentationLink {...section.link}/>}
 </section>;
}

export function ReadingGuide({title,article,jsonLd,navigation,heading,notice,illustrations,contents}: {
 title:string;article:DocArticle;jsonLd:string;navigation?:ReactNode;heading?:ReactNode;notice?:ReactNode;
 illustrations?:Partial<Record<NonNullable<DocSection["illustratedGuide"]>,ReactNode>>;
 contents?:{id:string;title:string}[];
}){
 const links=contents??article.sections;
 const sections=<>{links.map(section=><a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</>;
 return <Shell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd}}/><div className="documentation-page cw-docs"><div className={`docs-workspace page-container${navigation?"":" docs-workspace-resource"}`}>
  {navigation}
  <article className="docs-article">
   <header className="docs-article-heading"><h1 tabIndex={-1}>{title}</h1>{heading}<p>{article.introduction}</p>{notice}</header>
   {links.length>0&&<details className="docs-mobile-toc"><summary>On this page <span aria-hidden="true">⌄</span></summary><nav aria-label="Page sections">{sections}</nav></details>}
   {article.prerequisites.length>0&&<div className="docs-prerequisites"><h2>Before you begin</h2><ul>{article.prerequisites.map(p=><li key={p}><Icon name="check"/>{p}</li>)}</ul></div>}
   {article.sections.map(section=><ArticleSection key={section.id} section={section} illustration={section.illustratedGuide?illustrations?.[section.illustratedGuide]:undefined}/>)}
   <span className="docs-legacy-anchor" id="documentation-support" aria-hidden="true"/>
  </article>
  {links.length>0&&<aside className="docs-toc"><nav aria-label="On this page"><p>On this page</p>{sections}</nav></aside>}
  <ResponsiveContentsFocus rootSelector=".docs-workspace" desktopSelector=".docs-toc" mobileSelector=".docs-mobile-toc" breakpoint={1250}/>
 </div></div></Shell>;
}
