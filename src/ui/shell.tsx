import { PublicNavigationHistory } from "./public-navigation-history";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import "./public-theme.css";
import "./public-chrome.css";

export function Shell({ children, quietAccess = true }: { children: React.ReactNode; quietAccess?: boolean }) {
  return <><PublicNavigationHistory /><PublicHeader quietAccess={quietAccess} /><main id="main-content" className="public-main">{children}</main><PublicFooter /></>;
}
