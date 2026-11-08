type ReferenceIndexProps = {
  label: string;
  navigationLabel: string;
  items: readonly { label: string; href: string }[];
};

/** Native links stay present in HTML and usable while reading long directories. */
export function ReferenceIndex({ label, navigationLabel, items }: ReferenceIndexProps) {
  return <div className="reference-index">
    <div className="reference-index-heading"><span>{label}</span><div><a href="#reference-source">Sources</a><a href="#reference-top">Top<span aria-hidden="true"> ↑</span></a></div></div>
    <nav aria-label={navigationLabel} className="reference-index-links">{items.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
  </div>;
}
