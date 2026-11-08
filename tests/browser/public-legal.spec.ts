import { expect, test } from "@playwright/test";
import { LEGAL_CENTER_PATHS, LEGAL_DOCUMENT_PATHS, RETIRED_LEGAL_PATHS } from "../../src/shared/site/legal-paths";
import { legalDocuments } from "../../src/features/company/legal/legal-center/content";
import { openFooterGroup } from "./public-footer";

test("merchant legal center connects every document without retired marketplace contracts or inherited source material", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const company = await openFooterGroup(page, "Company");
  await company.getByRole("link", { name: "Legal", exact: true }).click();
  await expect(page).toHaveURL(/\/legal$/);
  await expect(page.getByRole("region", { name: "Merchant services", exact: true }).getByRole("link")).toHaveCount(6);
  await expect(page.getByRole("region", { name: "Privacy and security", exact: true }).getByRole("link")).toHaveCount(3);
  const destinations = await page.locator(".legal-center-links > a").evaluateAll(links => links.map(link => link.getAttribute("href")));
  expect(destinations.sort()).toEqual(LEGAL_DOCUMENT_PATHS.filter(path => path !== "/legal").sort());
  for (const route of LEGAL_DOCUMENT_PATHS) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("main nav, main .legal-document-contents-mobile")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://etaildepot.com${route}`);
    await expect(page.locator('main [data-source-document], main .legal-source, main a[href*="trolleys.ai"], main form')).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/Trolleys|marketplace (?:agreement|terms|conditions)|seller agreement|buyer protection (?:policy|terms)|CARE AI|retained documents|source document|for review only|not effective/i);
    for (const retired of RETIRED_LEGAL_PATHS) await expect(page.locator(`a[href^="${retired}"]`)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test("merchant terms require acceptance and retain financial and legal boundaries", async ({ page }) => {
  await page.goto("/legal/merchant-services");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Merchant Services Terms");
  await expect(page.locator("#scope + div")).toContainText("does not accept this merchant agreement or activate processing");
  await expect(page.locator("#scope + div a")).toHaveAttribute("href", "#business-disputes");
  await expect(page.locator("#account-documents + div")).toContainText("do not amend a bank’s contract");
  await expect(page.locator("#website-service-disclosures + div")).toContainText("2.9% + $0.30");
  await expect(page.locator("#approval + div")).toContainText("Account approval and setup are required");
  await expect(page.locator("#liability + div")).toContainText("gross negligence");
  const businessDisputes = page.locator("#business-disputes + div");
  await expect(businessDisputes).toContainText("The substantive law of the District of Columbia governs this agreement");
  await expect(businessDisputes).toContainText("The Federal Arbitration Act governs arbitration where applicable");
  await expect(businessDisputes).toContainText("The seat of arbitration is Washington, DC");
  await expect(businessDisputes).toContainText("the Superior Court of the District of Columbia or the United States District Court for the District of Columbia, where jurisdiction exists");
  await expect(businessDisputes).not.toContainText(/California|San Francisco|San Mateo/);
  await expect(businessDisputes).toContainText("only business parties that expressly accept it");
  await expect(page.locator("#retailer-agreement")).toHaveCount(1);
  await expect(page.locator("#dispute-prevention")).toHaveCount(1);
  await expect(page.locator('#website-service-disclosures + div a[href="/legal/fees"]')).toBeVisible();
  await page.goto("/legal/software-platforms");
  const platformGeneralTerms = page.locator("#general-terms + div");
  await expect(platformGeneralTerms).toContainText("District of Columbia law, arbitration in Washington, DC");
  await expect(platformGeneralTerms).toContainText("using the version supplied with the accepted Platform Service Order");
  await platformGeneralTerms.getByRole("link", { name: "Business dispute provisions", exact: true }).click();
  await expect(page).toHaveURL(/\/legal\/merchant-services#business-disputes$/);
  await expect(page.locator("#business-disputes")).toBeInViewport();
});

test("fee and funding schedules distinguish approved prices from conditional account timing", async ({ page }) => {
  await page.goto("/legal/fees");
  await expect(page.locator(".legal-rate-list > div")).toHaveCount(9);
  await expect(page.locator(".legal-rate-list")).toContainText("2.9% + 30¢");
  await expect(page.locator(".legal-rate-list")).toContainText("$35");
  await expect(page.locator(".legal-rate-list")).toContainText("$15");
  await expect(page.locator("#optional-service + div")).toContainText("0.4%");
  await expect(page.locator("main")).not.toContainText(/2\.95%|7\.99|0\.025/);
  await expect(page.locator("#refund-treatment + div")).toContainText("not returned");
  await expect(page.locator("#other-methods + div")).toContainText("ACH and other enabled methods have separate fees");
  await expect(page.locator("#statements + div")).toContainText("statement period, availability date and delivery method");
  await expect(page.locator("#statements + div")).not.toContainText("You receive a calendar month statement");
  await page.goto("/legal/payouts-and-reserves");
  await expect(page.locator("#scope + div")).toContainText("confirmed by the responsible funding provider");
  await expect(page.locator(".legal-rate-list > div")).toHaveCount(5);
  await expect(page.locator("#schedule + div")).toContainText("Your accepted account terms identify");
  await expect(page.locator(".legal-rate-list")).not.toContainText(/Normally two business days|Normally four business days|Seven to fourteen calendar days/);

  await expect(page.locator("#reserves + div")).toContainText("Reserve percentages and holding periods are specified in the applicable reserve notice");
  await expect(page.locator("#recovery + div")).toContainText("requires its own valid instrument and authority");
});

test("privacy, data and acquirer documents describe their distinct responsibilities", async ({ page }) => {
  await page.goto("/legal/merchant-privacy");
  await expect(page.locator("#information + div")).toContainText("application documents, owner identity information and bank information");
  await expect(page.locator("#rights + div")).toContainText("without signing in");
  await expect(page.locator("#sharing + div")).toContainText("may handle information independently under their own privacy notices");
  await page.goto("/legal/data-processing");
  await expect(page.locator("#scope + div")).toContainText("expressly incorporates them into an accepted Service Order");
  await expect(page.locator("#providers + div")).toContainText("must identify the countries in which information may be stored or accessed");
  await expect(page.locator("#security + div")).toContainText("without undue delay");
  await page.goto("/legal/acquirer-disclosure");
  await expect(page.locator("main")).toContainText("Fifth Third Bank");
  await expect(page.locator("#provider-terms + div")).toContainText("it is not the bank’s contract");
  await page.goto("/legal/security-policy");
  await expect(page.locator("#payment-data + div")).toContainText("after authorization, even if encrypted");
  await expect(page.locator("main")).not.toContainText("PCI DSS 3.2.1");
});

test("retired marketplace legal routes are absent and remain outside search discovery", async ({ request }) => {
  for (const route of RETIRED_LEGAL_PATHS) {
    for (const suffix of ["", "/", ".html", ".txt", "/index.html"]) {
      const response = await request.get(route + suffix);
      expect(response.status()).toBe(404);
    }
    expect((await request.post(route, { data: "must-not-be-processed" })).status()).toBeGreaterThanOrEqual(400);
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).not.toContain("<loc>");
  expect(LEGAL_CENTER_PATHS).toHaveLength(10);
});

test.describe("legal documents without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("read every document and follow the fee and arbitration sections", async ({ page }) => {
    for (const document of legalDocuments) {
      await page.goto(`/legal/${document.slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(document.title);
      const sections = page.locator(".legal-document-section > h2");
      const targets = await sections.evaluateAll(headings => headings.map(heading => heading.id));
      expect(targets.length).toBeGreaterThan(3);
      expect(new Set(targets).size).toBe(targets.length);
      for (const target of targets) await expect(page.locator(`#${target}`)).toHaveCount(1);
      await sections.last().scrollIntoViewIfNeeded();
      await expect(page.getByRole("heading", { name: "Notices and contact", exact: true })).toBeInViewport();
      await page.getByRole("link", { name: "Back to top", exact: true }).click();
      await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    }
    await page.goto("/legal/merchant-services");
    await page.getByRole("link", { name: "Business dispute provisions", exact: true }).click();
    await expect(page.getByRole("heading", { name: "16. Business disputes and arbitration", exact: true })).toBeInViewport();
    const company = page.getByRole("navigation", { name: "Footer company" });
    const group = company.locator("details");
    if (await group.count() && await group.getAttribute("open") === null) await group.locator("summary").click();
    await company.getByRole("link", { name: "Legal", exact: true }).click();
    await page.locator('.legal-center-links a[href="/legal/fees"]').click();
    await expect(page.locator(".legal-rate-list")).toBeVisible();
  });
});


test("account records remain readable without application fields", async ({ page }) => {
  const records = [
    ["/legal/merchant-services", "service-order"],
    ["/legal/fees", "billing-record"],
    ["/legal/payouts-and-reserves", "funding-record"],
    ["/legal/payouts-and-reserves", "reserve-notice"],
    ["/legal/software-platforms", "merchant-authorization"],
    ["/legal/software-platforms", "platform-order"],
    ["/legal/data-processing", "processing-record"],
    ["/legal/merchant-privacy", "collection"],
  ];
  for (const [route, section] of records) {
    await page.goto(`${route}#${section}`);
    const record = page.locator(`#${section} + div .legal-record-list`);
    await expect(record).toBeVisible();
    expect(await record.locator("dt").count()).toBeGreaterThan(3);
    expect(await record.locator("dt").count()).toBe(await record.locator("dd").count());
    await expect(record).not.toContainText(/\[[^\]]+\]|TODO|TBD/);
    await expect(page.locator("main form, main input, main textarea")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
