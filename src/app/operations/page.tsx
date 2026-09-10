import { redirect, unstable_rethrow } from "next/navigation";
import { getRequestSession } from "@/platform/http/context";
import { getOperatorCase, getOperatorQueue } from "@/modules/operations/service";
import { PageNotice, Shell } from "@/ui/shell";
import { OperationsWorkspace } from "@/ui/operations-workspace";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata = { title: "Customer care" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getRequestSession();
  if (!session) redirect("/login");
  const query = await searchParams;
  let queue: Awaited<ReturnType<typeof getOperatorQueue>>;
  let selected: Awaited<ReturnType<typeof getOperatorCase>> | null;
  try {
    queue = await getOperatorQueue(session.personId);
    selected = query.case === undefined ? null : typeof query.case === "string" ? await getOperatorCase(session.personId, query.case) : null;
  } catch (error) { unstable_rethrow(error); return <PageNotice title="Support workspace unavailable" authenticated><p>This view requires an active support assignment.</p></PageNotice>; }
  if (query.case !== undefined && !selected) return <PageNotice title="This case is unavailable" authenticated><p>Choose an available case from your support queue.</p></PageNotice>;
  return <Shell authenticated><OperationsWorkspace key={selected?.id ?? "queue"} queue={queue} selected={selected}/> </Shell>;
}
