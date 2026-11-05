import { initialArtworkState } from "./initial-artwork-state";
import { PublicNavigationHistory } from "./public-navigation-history";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import "./public-theme.css";
import "./public-chrome.css";
import "./site-artwork-polish.css";

export function Shell({ children }: { children: React.ReactNode }) {
  return <><link rel="expect" href="#public-page-ready" blocking="render" /><PublicNavigationHistory /><PublicHeader /><main id="main-content" className="public-main">{children}<script dangerouslySetInnerHTML={{ __html: initialArtworkState }} /></main><PublicFooter /><span id="public-page-ready" hidden aria-hidden="true" /></>;
}
