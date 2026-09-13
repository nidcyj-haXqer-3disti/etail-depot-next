import { afterEach, describe, expect, it, vi } from "vitest";
import { merchantCommand, WorkspaceCommandError, workspaceCommand } from "../../src/ui/workspace/primitives";

afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
const serviceId = "00000000-0000-4000-8000-000000000001";

describe.each([
  { name: "cardholder", command: workspaceCommand, route: `/api/v1/cardholder-services/${serviceId}` },
  { name: "merchant", command: merchantCommand, route: `/api/v1/merchants/${serviceId}` },
  { name: "merchant account", command: (...args:Parameters<typeof workspaceCommand>)=>merchantCommand(...args,"SERVICE"), route: `/api/v1/merchant-services/${serviceId}` },
])("$name command response certainty", ({ command, route }) => {
  it("treats a lost network response as uncertain so the original request can be retried", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Network response lost")));
    await expect(command(serviceId, "/card-requests", "POST", { commandId: "original-id", nickname: "Practice card" })).rejects.toMatchObject({ name: "WorkspaceCommandError", status: null, uncertain: true });
  });
  it("retains a known stale-version code without exposing server message contents", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: { code: "STALE_VERSION", message: "Private server diagnostic" } }, { status: 409 })));
    const error = await command(serviceId, "/card-requests/example", "PATCH", {}).catch(value => value);
    expect(error).toBeInstanceOf(WorkspaceCommandError);
    if (!(error instanceof WorkspaceCommandError)) throw new Error("Expected a typed workspace command error");
    expect(error).toMatchObject({ status: 409, code: "STALE_VERSION", uncertain: false });
    expect(error.message).not.toContain("Private server diagnostic");
  });
  it("keeps server failure outcomes uncertain rather than permitting a new creation attempt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: { code: "SERVICE_UNAVAILABLE" } }, { status: 503 })));
    await expect(command(serviceId, "/card-requests", "POST", {})).rejects.toMatchObject({ status: 503, uncertain: true });
  });
  it("treats an unreadable success response as uncertain because the write may have committed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("incomplete JSON", { status: 200 })));
    await expect(command(serviceId, "/card-requests", "POST", {})).rejects.toMatchObject({ status: null, uncertain: true });
  });
  it("returns a confirmed entity without rewriting the scoped command payload", async () => {
    const body = { commandId: "original-id", nickname: "Practice card" };
    const response = { serviceId, status: "DRAFT" };
    const fetch = vi.fn().mockResolvedValue(Response.json(response)); vi.stubGlobal("fetch", fetch);
    vi.useFakeTimers();
    expect(await command(serviceId, "/card-requests", "POST", body)).toEqual(response);
    expect(fetch).toHaveBeenCalledWith(`${route}/card-requests`, expect.objectContaining({ method: "POST", credentials: "same-origin", body: JSON.stringify(body), signal: expect.any(AbortSignal) }));
    expect(vi.getTimerCount()).toBe(0);
  });
  it("bounds a stalled request without automatically dispatching another command", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>((_url, init) => new Promise<Response>((_resolve, reject) => {
      const signal = init?.signal;
      if (!signal) throw new Error("A bounded command requires an abort signal.");
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    }));
    vi.stubGlobal("fetch", fetcher);
    let settled = false;
    const outcome = command(serviceId, "/card-requests", "POST", { commandId: "original-id" }).catch(error => { settled = true; return error; });
    await vi.advanceTimersByTimeAsync(29_999);
    expect(settled).toBe(false); expect(fetcher).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(await outcome).toMatchObject({ name: "WorkspaceCommandError", status: null, uncertain: true });
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([200, 409])("bounds a stalled %i response body and preserves uncertainty", async status => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>(async (_url, init) => {
      const signal = init?.signal;
      if (!signal) throw new Error("A bounded command requires an abort signal.");
      return new Response(new ReadableStream<Uint8Array>({
        start(controller) { signal.addEventListener("abort", () => controller.error(signal.reason), { once: true }); },
      }), { status, headers: { "Content-Type": "application/json" } });
    });
    vi.stubGlobal("fetch", fetcher);
    let settled = false;
    const outcome = command(serviceId, "/card-requests", "POST", { commandId: "original-id" }).catch(error => { settled = true; return error; });
    await vi.advanceTimersByTimeAsync(29_999);
    expect(settled).toBe(false); expect(fetcher).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(await outcome).toMatchObject({ name: "WorkspaceCommandError", status: null, uncertain: true });
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

it("encodes the exact selected service id in Merchant account commands",async()=>{
 const fetcher=vi.fn().mockResolvedValue(Response.json({saved:true}));vi.stubGlobal("fetch",fetcher);
 await merchantCommand("selected/id?scope=other","/business-details/application","POST",{commandId:"same-request"},"SERVICE");
 expect(fetcher).toHaveBeenCalledWith("/api/v1/merchant-services/selected%2Fid%3Fscope%3Dother/business-details/application",expect.objectContaining({method:"POST",body:JSON.stringify({commandId:"same-request"})}));
});
