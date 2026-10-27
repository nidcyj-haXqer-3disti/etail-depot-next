import Link from "next/link";
import { ISO20022_PATH, ISO20022_RELEASE, ISO20022_SETS, ISO20022_SOURCE, ISO20022_WORKBOOK, codeHeading, codePeers, codeReplacement, codeUsageRestriction, isoJsonLd, sourceDate, sourceName, type IsoCode, type IsoCodeSet } from "@/modules/public-site/iso20022-reference";
import { Shell } from "./shell";
import { PaymentStatusContext } from "./iso20022-status-context";
import "./standards-reference.css";
import "./iso20022-reference.css";

type Props = { set?: IsoCodeSet; code?: IsoCode };
function SourceLink({ children }: { children: React.ReactNode }) { return <a href={ISO20022_SOURCE} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">{children} <span aria-hidden="true">↗</span></a>; }
function Crumbs({ set, code }: Props) {
  return <nav className="sr-crumbs" aria-label="Breadcrumb"><Link href="/guides" prefetch={false}>Guides</Link><span aria-hidden="true">/</span>{set ? <Link href={ISO20022_PATH} prefetch={false}>ISO 20022</Link> : <span aria-current="page">ISO 20022</span>}{set && <><span aria-hidden="true">/</span>{code ? <Link href={set.path} prefetch={false}>{set.title}</Link> : <span aria-current="page">{set.title}</span>}</>}{code && <><span aria-hidden="true">/</span><span aria-current="page">{code.code}</span></>}</nav>;
}
function ReplacementValue({ set, code }: { set: IsoCodeSet; code: IsoCode }) {
  const replacement = codeReplacement(set, code);
  return replacement ? <Link href={replacement.path} prefetch={false}><code>{replacement.code}</code></Link> : <code>{code.replaced_by}</code>;
}
function SourceDetails({ set, code }: Props) {
  const refs = code?.source_refs ?? set?.source_refs;
  return <aside className="sr-reference" aria-label="Source and code identity"><h2>Reference details</h2><dl>
    {code && <><dt>Code</dt><dd><code>{code.code}</code></dd><dt>Published name</dt><dd><code>{code.source_name}</code></dd><dt>Source status</dt><dd>{code.source_status}</dd>{code.replaced_by && set && <><dt>Source replacement</dt><dd><ReplacementValue set={set} code={code} /></dd></>}</>}
    {set && <><dt>Exact code set</dt><dd><code>{set.collection_id}</code></dd></>}
    <dt>Source release</dt><dd>{ISO20022_RELEASE}</dd><dt>Workbook publication</dt><dd>28 August 2026</dd>
    {code && <><dt>Source created</dt><dd>{sourceDate(code.created)}</dd><dt>Source last updated</dt><dd>{sourceDate(code.last_updated)}</dd></>}
  </dl><div className="sr-source"><SourceLink>ISO 20022 external code sets</SourceLink><p>Published definitions: ISO 20022 Financial Repository. Independent reference by Etail Depot.</p><p>Workbook: <code>{ISO20022_WORKBOOK}</code></p>{refs?.filter(ref => ref.source_id.endsWith("xlsx")).map(ref => <p key={ref.locator}>Source location: <code>{ref.locator}</code></p>)}<p>Source dates describe the record and release. They do not establish when a payment system adopted the code.</p></div></aside>;
}
function Library() {
  const letters = [...new Set(ISO20022_SETS.map(set => set.title[0].toUpperCase()))];
  return <><p className="sr-kicker">Financial messaging</p><h1>ISO 20022<br />external code sets.</h1><p className="sr-lead">Look up a code’s published meaning, identify its code set and find the message versions listed in the source.</p><div className="sr-meta"><span>140 code sets</span><span>3,314 registered codes</span><span>Source release: {ISO20022_RELEASE}</span></div>
    <div className="sr-layout"><div className="sr-copy"><nav className="iso-alphabet" aria-label="Code sets by first letter">{letters.map(letter => <a key={letter} href={`#sets-${letter.toLowerCase()}`}>{letter}</a>)}</nav>
      {letters.map(letter => <section className="iso-set-group" key={letter} id={`sets-${letter.toLowerCase()}`}><h2>{letter}</h2><ul className="iso-set-list">{ISO20022_SETS.filter(set => set.title[0].toUpperCase() === letter).map(set => <li key={set.id}><Link href={set.path} prefetch={false}><span>{set.title}</span><span className="iso-count">{set.codes.length} {set.codes.length === 1 ? "code" : "codes"}<span aria-hidden="true"> →</span></span></Link></li>)}</ul></section>)}
    </div><div className="iso-sidebar"><SourceDetails /></div></div></>;
}
function MessageReferences({ set }: { set: IsoCodeSet }) {
  if (!set.messages.length) return <section id="message-usage"><h2>Message references</h2><p>No message references are listed for this set in the source workbook.</p></section>;
  return <section id="message-usage"><details className="iso-details"><summary>Message references <span>{set.messages.length.toLocaleString("en-US")}</span></summary><p className="sr-note">Versions listed in the source workbook, including older versions. This list does not establish which messages a bank, network or provider supports.</p><ul className="iso-message-list">{set.messages.map((message, i) => <li key={`${message.message_id}-${i}`}><code>{message.message_id}</code><span>{sourceName(message.message_name)}</span></li>)}</ul><p className="sr-note">Source: <code>UsageInMsgs</code> sheet in {ISO20022_WORKBOOK}.</p></details></section>;
}
function History({ set, code }: { set: IsoCodeSet; code?: IsoCode }) {
  const obsolete = set.obsolete.filter(item => !code || item.code === code.code);
  if (!obsolete.length) return null;
  return <section id="source-history"><h2>Historical source entries</h2><p>{code ? "The workbook also contains an obsolete entry with this code. Its name differs from the registered definition above." : "These workbook entries are marked Obsolete. They are excluded from the registered code list above."}</p><ul className="iso-history">{obsolete.map(item => <li key={item.locator}><code>{item.code}</code><span>{sourceName(item.source_name)}<small>Obsolete source entry · {item.locator}</small></span></li>)}</ul><p className="sr-note">An obsolete entry does not make a separate registered entry with the same code obsolete. Use the name, status and release together.</p></section>;
}
function SetPage({ set }: { set: IsoCodeSet }) {
  const letters = [...new Set(set.codes.map(code => code.code[0]))];
  return <><p className="sr-kicker">ISO 20022 · External code set</p><h1>{set.title} codes</h1><p className="sr-lead">{set.source_definition}</p><div className="sr-meta"><span>{set.codes.length} registered {set.codes.length === 1 ? "code" : "codes"}</span><span>Source release: {ISO20022_RELEASE}</span></div><div className="sr-layout"><div className="sr-copy">
    {set.codes.length > 40 && <nav className="iso-alphabet" aria-label="Codes by first character">{letters.map(letter => <a key={letter} href={`#code-${set.codes.find(code => code.code[0] === letter)!.code.toLowerCase()}`}>{letter}</a>)}</nav>}
    <table className="sr-table iso-code-table"><caption>Registered codes in <code>{set.collection_id}</code>. Select a code for its full definition and source details.</caption><thead><tr><th scope="col">Code</th><th scope="col">Published name and definition</th></tr></thead><tbody>{set.codes.map(code => <tr key={code.id} id={`code-${code.code.toLowerCase()}`}><td><Link href={code.path} prefetch={false}><code>{code.code}</code></Link></td><td><strong>{sourceName(code.source_name)}</strong><p>{code.source_definition}</p>{codeUsageRestriction(code) && <p className="iso-source-advisory"><strong>Source note: {codeUsageRestriction(code)}</strong></p>}{code.replaced_by && <p className="iso-source-advisory">Source replacement: <ReplacementValue set={set} code={code} /></p>}</td></tr>)}</tbody></table>
    <MessageReferences set={set} /><History set={set} />
  </div><SourceDetails set={set} /></div></>;
}
function CodePage({ set, code }: { set: IsoCodeSet; code: IsoCode }) {
  const peers = codePeers(code), index = set.codes.indexOf(code), adjacent = [set.codes[index - 1], set.codes[index + 1]].filter(Boolean);
  return <><p className="sr-kicker">ISO 20022 · {set.title}</p><h1><span className={`sr-code${code.code.length > 8 ? " iso-code-long" : ""}`}>{code.code}</span>{codeHeading(code)}</h1><div className="sr-meta"><span>Registered in source</span>{code.replaced_by && <span>Replacement listed</span>}<span>Source release: {ISO20022_RELEASE}</span></div><div className="sr-layout"><div className="sr-copy">
    <section id="definition" className="iso-definition"><h2>Published definition</h2><p>{code.source_definition}</p></section>
    {code.replaced_by && <section id="source-replacement" className="iso-source-replacement"><h2>Replacement listed in the source</h2><p>The workbook lists <ReplacementValue set={set} code={code} /> as the replacement for <code>{code.code}</code>. It still labels this record <strong>Registered</strong> in this release.</p><p>Read the replacement and usage notes together with the source status. Registration alone does not establish that a code should be used for a new instruction.</p></section>}
    {code.additional_information && <section id="source-notes"><h2>Additional source information</h2><p>{code.additional_information}</p></section>}
    {set.collection_id === "ExternalPaymentTransactionStatus1Code" && <PaymentStatusContext code={code.code} />}
    <section id="code-set"><h2>Code set and usage</h2><p><Link href={set.path} prefetch={false}>{set.title}</Link> contains {set.codes.length} registered {set.codes.length === 1 ? "code" : "codes"}. Its exact identifier is <code>{set.collection_id}</code>.</p><p>{set.source_definition}</p><p>Use the code with the applicable message version and implementation guide. A matching code value alone does not establish the same meaning in another set.</p>{set.messages.length > 0 && <p><Link href={`${set.path}#message-usage`} prefetch={false}>View {set.messages.length.toLocaleString("en-US")} published message {set.messages.length === 1 ? "reference" : "references"}</Link></p>}</section>
    <History set={set} code={code} />
    {peers.length > 0 && <section id="other-code-sets"><details className="iso-details"><summary>This code in other sets <span>{peers.length}</span></summary><p className="sr-note">These share the characters <code>{code.code}</code>. Their meanings belong to their respective sets.</p><ul className="iso-peer-list">{peers.map(peer => <li key={peer.code.id}><Link href={peer.code.path} prefetch={false}>{peer.set.title}<span>{sourceName(peer.code.source_name)}</span></Link></li>)}</ul></details></section>}
    <nav className="sr-related" aria-label="More in this code set"><p>Browse {set.title.toLowerCase()} codes</p>{adjacent.map(item => <Link key={item.id} href={item.path} prefetch={false}><span><code>{item.code}</code> · {sourceName(item.source_name)}</span><span aria-hidden="true">{item === set.codes[index - 1] ? "←" : "→"}</span></Link>)}<Link href={set.path} prefetch={false}><span>All {set.codes.length} {set.title.toLowerCase()} codes</span><span aria-hidden="true">→</span></Link></nav>
  </div><SourceDetails set={set} code={code} /></div></>;
}
export function Iso20022Reference({ set, code }: Props) {
  return <Shell quietAccess><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: isoJsonLd(set, code) }} /><div className="standards-reference iso-reference"><article className="sr-inner page-container"><Crumbs set={set} code={code} />{set ? code ? <CodePage set={set} code={code} /> : <SetPage set={set} /> : <Library />}</article></div></Shell>;
}
