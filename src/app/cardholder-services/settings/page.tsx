import { renderCardholderTask, type CardholderTaskQuery } from "../task-loader";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Settings · Cardholder services" };
export default function Page({ searchParams }: { searchParams: Promise<CardholderTaskQuery> }) { return renderCardholderTask("settings", searchParams); }
