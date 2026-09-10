import { afterEach, describe, expect, it, vi } from "vitest";
import { WorkspaceCommandError, workspaceCommand } from "../../src/ui/workspace/primitives";

afterEach(() => vi.unstubAllGlobals());
const serviceId = "00000000-0000-4000-8000-000000000001";

describe("command response certainty", () => {
  it("treats a lost network response as uncertain so the original request can be retried", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Network response lost")));
    await expect(workspaceCommand(serviceId, "/card-requests", "POST", { commandId: "original-id", nickname: "Practice card" })).rejects.toMatchObject({ name: "WorkspaceCommandError", status: null, uncertain: true });
  });
  it("retains a known stale-version code without exposing server message contents", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: { code: "STALE_VERSION", message: "Private server diagnostic" } }, { status: 409 })));
    const error = await workspaceCommand(serviceId, "/card-requests/example", "PATCH", {}).catch(value => value);
    expect(error).toBeInstanceOf(WorkspaceCommandError);
    if (!(error instanceof WorkspaceCommandError)) throw new Error("Expected a typed workspace command error");
    expect(error).toMatchObject({ status: 409, code: "STALE_VERSION", uncertain: false });
    expect(error.message).not.toContain("Private server diagnostic");
  });
  it("keeps server failure outcomes uncertain rather than permitting a new creation attempt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ error: { code: "SERVICE_UNAVAILABLE" } }, { status: 503 })));
    await expect(workspaceCommand(serviceId, "/card-requests", "POST", {})).rejects.toMatchObject({ status: 503, uncertain: true });
  });
  it("treats an unreadable success response as uncertain because the write may have committed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("incomplete JSON", { status: 200 })));
    await expect(workspaceCommand(serviceId, "/card-requests", "POST", {})).rejects.toMatchObject({ status: null, uncertain: true });
  });
  it("returns a confirmed entity without rewriting the scoped command payload", async () => {
    const body = { commandId: "original-id", nickname: "Practice card" };
    const response = { serviceId, status: "DRAFT" };
    const fetch = vi.fn().mockResolvedValue(Response.json(response)); vi.stubGlobal("fetch", fetch);
    expect(await workspaceCommand(serviceId, "/card-requests", "POST", body)).toEqual(response);
    expect(fetch).toHaveBeenCalledWith(`/api/v1/cardholder-services/${serviceId}/card-requests`, expect.objectContaining({ method: "POST", credentials: "same-origin", body: JSON.stringify(body) }));
  });
});
