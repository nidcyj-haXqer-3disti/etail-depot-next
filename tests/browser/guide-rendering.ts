import { createServer } from "node:http";
import { expect, type Page, type APIRequestContext } from "@playwright/test";

/** Exercise first paint while the page is present but its final parse marker has not arrived. */
export async function expectCompleteGuidePaint(page: Page, request: APIRequestContext, baseURL: string | undefined, path: string, anchor: string, heading: string) {
 const html = await (await request.get(path)).text();
 const split = html.indexOf('<span id="public-page-ready"');
 expect(split).toBeGreaterThan(0);
 let releaseDocument = () => {};
 const remainingDocument = new Promise<void>(resolve => { releaseDocument = resolve; });
 const server = createServer(async (incoming, outgoing) => {
  try {
   const url = new URL(incoming.url ?? "/", baseURL);
   if (url.pathname === path) {
    outgoing.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    outgoing.write(html.slice(0, split));
    await remainingDocument;
    outgoing.end(html.slice(split));
   } else {
    const response = await fetch(url);
    outgoing.writeHead(response.status, { "Content-Type": response.headers.get("content-type") ?? "application/octet-stream" });
    outgoing.end(Buffer.from(await response.arrayBuffer()));
   }
  } catch {
   outgoing.writeHead(500);
   outgoing.end();
  }
 });
 await new Promise<void>(resolve => { server.listen(0, "127.0.0.1", resolve); });
 const address = server.address();
 if (!address || typeof address === "string") throw new Error("The local rendering fixture did not start");
 try {
  await page.goto(`http://127.0.0.1:${address.port}${path}${anchor}`, { waitUntil: "commit" });
  await page.locator(".public-header").waitFor({ state: "attached" });
  // Leave enough time for partially parsed content to paint if the page regresses.
  await page.waitForTimeout(400);
  const partialPaint = await page.evaluate(() => performance.getEntriesByType("paint").map(entry => entry.name));
  expect(partialPaint, "Do not paint until the final page markup has arrived").toEqual([]);
  releaseDocument();
  await page.waitForLoadState("load");
  await expect(page.locator(heading)).toBeInViewport();
  await expect.poll(() => page.evaluate(() => performance.getEntriesByType("paint").some(entry => entry.name === "first-contentful-paint"))).toBe(true);
  await page.reload();
  await expect(page.locator(heading)).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
 } finally {
  releaseDocument();
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
 }
}
