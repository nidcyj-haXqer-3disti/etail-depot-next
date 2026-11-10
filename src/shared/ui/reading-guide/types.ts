export type DocRow = { title: string; text: string };
export type DocTable = { caption: string; headers: string[]; rows: string[][]; codeColumn?: boolean; breakCodeWords?: boolean };
export type DocSection = {
 prerequisites?:string[];
 aliases?:string[];
  id: string; title: string; paragraphs?: string[]; steps?: DocRow[]; rows?: DocRow[];
  note?: { title: string; text: string };
  flow?: "onboarding" | "checkout" | "records" | "payouts" | "events" | "requests" | "access" | "launch" | "recovery" | "disputes";
  table?: DocTable; outcome?: string;
  illustratedGuide?: "sign-in" | "registration" | "email-recovery" | "additional-location";
  details?: DocRow[]; link?: { label: string; href: string };
};
export type DocArticle = { introduction: string; prerequisites: string[]; sections: DocSection[] };
