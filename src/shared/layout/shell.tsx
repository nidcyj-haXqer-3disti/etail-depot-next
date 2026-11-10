import { initialArtworkState } from "../ui/initial-artwork-state";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import "../styles/public-theme.css";
import "./public-chrome.css";

export function Shell({ children }: { children: React.ReactNode }) {
  return <><link rel="expect" href="#public-page-ready" blocking="render" /><PublicHeader /><main id="main-content" className="public-main">{children}<script dangerouslySetInnerHTML={{ __html: initialArtworkState }} /></main><PublicFooter /><span id="public-page-ready" hidden aria-hidden="true" /></>;
}
