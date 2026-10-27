import Link from "next/link";
import { ResponsiveContentsFocus } from "./responsive-contents-focus";
import { documentationPages, documentationPaths, documentationPath, type DocumentationSlug } from "@/modules/public-site/documentation-catalog";
import { documentationArticles, type DocSection } from "@/modules/public-site/documentation-content";
import { Shell } from "./shell";
import { Icon } from "./icon";
import { PaymentPortalLink } from "./service-entry";
import { DocumentationNavigation } from "./documentation-navigation";
import { DocumentationFlow } from "./documentation-diagrams";
import "./documentation.css";

function DocumentationLink({href,label}:{href:string;label:string}){
 if(href==="portal")return <div className="docs-account-entry"><PaymentPortalLink className="button primary">{label}</PaymentPortalLink><p>Trolleys is the account service for Etail Depot merchant services.</p></div>;
 return <Link className="docs-text-link" href={href}>{label}<Icon name="arrow"/></Link>;
}

function ArticleSection({section}:{section:DocSection}){
 return <section className="docs-section" id={section.id} aria-labelledby={`${section.id}-title`}>
  <h2 id={`${section.id}-title`}>{section.title}</h2>
  {section.paragraphs?.map(p=><p key={p}>{p}</p>)}
  {section.flow&&<DocumentationFlow kind={section.flow}/>}
  {section.steps&&<ol className="docs-steps">{section.steps.map((step,i)=><li key={step.title}><span className="docs-step-number" aria-hidden="true">{i+1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>}
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

export function DocumentationArticle({slug}:{slug:DocumentationSlug}){
 const page=documentationPages.find(p=>p.slug===slug)!;
 const group=documentationPaths.find(path=>path.title===page.group)!;
 const article=documentationArticles[slug];
 return <Shell quietAccess><div className="documentation-page"><div className="docs-workspace page-container">
  <DocumentationNavigation current={slug}/>
  <ResponsiveContentsFocus rootSelector=".docs-workspace" desktopSelector=".docs-toc" mobileSelector=".docs-mobile-toc" breakpoint={1250} />
  <article className="docs-article">
   <header className="docs-article-heading"><nav aria-label="Breadcrumb"><Link href="/docs">Documentation</Link><span aria-hidden="true">/</span><Link href={`/docs#${group.id}`}>{page.group}</Link></nav><h1>{page.title}</h1><p>{article.introduction}</p><span className="docs-audience">{page.audience}</span></header>
   <div className="docs-prerequisites"><h2>Before you begin</h2><ul>{article.prerequisites.map(p=><li key={p}><Icon name="check"/>{p}</li>)}</ul></div>
   <details className="docs-mobile-toc"><summary>On this page <span aria-hidden="true">⌄</span></summary><nav aria-label="Page sections">{article.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav></details>
   {article.sections.map(section=><ArticleSection key={section.id} section={section}/>)}
   <span className="docs-legacy-anchor" id="documentation-support" aria-hidden="true"/>
  </article>
  <aside className="docs-toc"><nav aria-label="On this page"><p>On this page</p>{article.sections.map(s=><a key={s.id} href={`#${s.id}`}>{s.title}</a>)}</nav></aside>
 </div></div></Shell>;
}

export function DocumentationHome(){
 return <Shell quietAccess><div className="documentation-page"><div className="docs-workspace docs-workspace-home page-container">
  <DocumentationNavigation/>
  <div className="docs-hub">
   <header className="docs-hub-heading"><h1>Payment documentation</h1><p>Set up merchant accounts, integrate checkout, and manage payments through reconciliation.</p></header>
   <div className="docs-task-paths">
    {documentationPaths.map(path => <section className="docs-task-path" key={path.id} id={path.id} aria-labelledby={`${path.id}-title`}>
     <header className="docs-task-path-heading"><Icon name={path.icon}/><h2 id={`${path.id}-title`}>{path.title}</h2><p>{path.description}</p></header>
     <ul>{path.tasks.map(task => <li key={task.title} id={task.anchor} className="docs-task">
      {task.links.length === 1 ? <>
       <h3><Link href={documentationPath(task.links[0].slug)}>{task.title}<Icon name="arrow"/></Link></h3>
       {task.description && <p>{task.description}</p>}
      </> : <>
       <h3>{task.title}</h3>
       <div className="docs-task-destinations">{task.links.map(link => <span key={link.label} id={link.anchor}><Link href={`${documentationPath(link.slug)}${link.section ? `#${link.section}` : ""}`}>{link.label}<Icon name="arrow"/></Link></span>)}</div>
      </>}
     </li>)}</ul>
    </section>)}
   </div>
  </div>
 </div></div></Shell>;
}
