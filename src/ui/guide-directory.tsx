import { StandardsCollections } from "./standards-collections";
import "./guide-directory.css";
import "./enterprise-support.css";
import { ResourceBreadcrumb } from "./resource-context";
import "./connected-resources.css";

export function GuideDirectory() {
  return <div className="guides-directory page-container cw-guides">
    <ResourceBreadcrumb items={[{name:"Etail Depot",href:"/"},{name:"Guides",href:"/guides"}]} />
    <header className="guides-directory-heading"><h1>Guides</h1><p className="guides-directory-intro">Look up ISO 20022 external codes and independent ISO 8583 message and field explanations.</p></header>
    <StandardsCollections />
  </div>;
}
