import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import "./public-theme.css";
import "./public-chrome.css";

export function Shell({ children }: { children: React.ReactNode }) {
  return <><PublicHeader /><main id="main-content" className="public-main">{children}</main><PublicFooter /></>;
}
