import { PublicNavigationHistory } from "./public-navigation-history";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import "./public-theme.css";
import "./public-chrome.css";
import "./site-artwork-polish.css";

export function Shell({ children }: { children: React.ReactNode }) {
  return <><PublicNavigationHistory /><PublicHeader /><main id="main-content" className="public-main">{children}</main><PublicFooter /></>;
}
