import type { ReactNode } from "react";
import { Icon } from "@/shared/ui/icon";
import s from "./service-detail.module.css";

export function Label({ icon, children }: { icon: string; children: ReactNode }) {
  return <span className={s.artLabel}><Icon name={icon} />{children}</span>;
}
export function Node({ icon, title, detail }: { icon: string; title: string; detail?: string }) {
  return <div className={s.node}><span className={s.nodeIcon}><Icon name={icon} /></span><div><strong>{title}</strong>{detail && <span>{detail}</span>}</div></div>;
}
export function Connector() { return <span className={s.connector} aria-hidden="true"><Icon name="arrow" /></span>; }
