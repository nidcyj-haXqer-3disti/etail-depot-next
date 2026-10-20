import type { ReactNode } from "react";
import "./payment-guide.css";

export function GuideSourceLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} rel="external noreferrer" referrerPolicy="no-referrer">{children}</a>;
}

export function GuideTable({ caption, headings, rows }: {
  caption: string;
  headings: string[];
  rows: ReactNode[][];
}) {
  return <div className="payment-guide-table-wrap">
    <p className="payment-guide-table-hint">Scroll the table sideways to compare all columns.</p>
    <div className="payment-guide-table-scroll" role="region" aria-label={caption} tabIndex={0}>
    <table>
      <caption><span>{caption}</span></caption>
      <thead><tr>{headings.map(heading => <th scope="col" key={heading}>{heading}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => cellIndex === 0
        ? <th scope="row" key={cellIndex}>{cell}</th>
        : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
    </table>
    </div>
  </div>;
}
