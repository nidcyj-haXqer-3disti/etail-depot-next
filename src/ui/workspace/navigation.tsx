import type { SVGProps } from "react";

export type WorkspaceIconName = "overview" | "cards" | "activity" | "merchant" | "people" | "settings" | "help" | "chevron" | "arrow" | "bell" | "shield" | "download" | "plus" | "check" | "search" | "reports";
const paths: Record<WorkspaceIconName, React.ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  cards: <><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M3 10h18M6 15h4"/></>,
  activity: <><path d="M4 5h16M4 12h16M4 19h10"/><circle cx="19" cy="19" r="2"/></>,
  merchant: <><path d="M3 10V7l2-4h14l2 4v3M4 11v10h16V11M9 21v-7h6v7"/><path d="M3 7h18M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></>,
  people: <><circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 4v3"/></>,
  settings: <><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/></>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 17h.01"/></>,
  chevron: <path d="m8 10 4 4 4-4"/>,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 9h18c0-1-3-1-3-9M10 21h4"/></>,
  shield: <><path d="m12 2 8 3v6c0 5-8 10-8 10S4 16 4 11V5zM8 11l3 3 5-5"/></>,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>,
  plus: <path d="M12 5v14M5 12h14"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  reports: <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/></>,
};
export function WorkspaceIcon({name,...props}: SVGProps<SVGSVGElement>&{name:WorkspaceIconName}) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
