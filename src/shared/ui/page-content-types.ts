export interface CommercialPage {
  label: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  action: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  note?: string;
  art: { layout?: "ach" | "transition" | "platform"; title: string; caption: string; steps: readonly { title: string; detail: string }[] };
  sections: readonly { id?: string; title: string; intro?: string; layout?: "steps" | "methods"; records?: readonly { label: string; detail: string }[]; items: readonly { id?: string; title: string; text: string; href?: string }[] }[];
}
