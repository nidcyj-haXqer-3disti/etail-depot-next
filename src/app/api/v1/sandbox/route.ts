import {apiRoute,json,readJson} from "@/platform/http/context";
import {getSandboxOverview,startSandbox} from "@/modules/sandbox/service";
import {startSandboxSchema} from "@/modules/sandbox/contracts";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){return apiRoute(request,async session=>json(await getSandboxOverview(session!.personId)),{authenticated:true});}
export async function POST(request:Request){return apiRoute(request,async session=>json(await startSandbox(session!.personId,await readJson(request,startSandboxSchema))),{authenticated:true});}
