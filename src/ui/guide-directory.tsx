import { StandardsCollections } from "./standards-collections";
import "./guide-directory.css";
import "./enterprise-support.css";
import "./connected-resources.css";

export function GuideDirectory() {
  return <div className="guides-directory page-container cw-guides">
    <header className="guides-directory-heading"><h1>Guides</h1><p className="guides-directory-intro">Code definitions, message types and field formats for financial messaging and card processing.</p></header>
    <StandardsCollections />
  </div>;
}
