import { StandardsCollections } from "../references/components/standards-collections";
import "./guide-directory.css";
import "./enterprise-support-guides.css";
import "./connected-resources-guides.css";

export function GuideDirectory() {
  return <div className="guides-directory page-container cw-guides">
    <header className="guides-directory-heading"><h1>Guides</h1><p className="guides-directory-intro">Look up payment codes, message types and field definitions.</p></header>
    <StandardsCollections />
  </div>;
}
