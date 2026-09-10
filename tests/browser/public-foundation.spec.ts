import { expect, test } from "@playwright/test";

test("a new visitor can compare services before signing in", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", {level:1})).toHaveText("Your cards.Your business.All in view.");
  const mainNavigation = page.getByRole("navigation", {name:"Main navigation"});
  await mainNavigation.getByRole("link", {name:"For cardholders",exact:true}).click();
  await expect(page).toHaveURL(/\/card-services$/);
  await expect(mainNavigation.getByRole("link",{name:"For cardholders"})).toHaveAttribute("aria-current","page");
  await expect(page.getByRole("heading",{name:"Additional cardholder",exact:true})).toBeVisible();
  await mainNavigation.getByRole("link",{name:"For businesses",exact:true}).click();
  await expect(page).toHaveURL(/\/payment-services$/);
  await expect(page.getByRole("heading",{name:"Primary merchant",exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Open merchant services",exact:true}).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});

test("help topics and answers work with a keyboard without sign-in", async ({page}) => {
  await page.goto("/help");
  await page.getByRole("navigation",{name:"Help topics"}).getByRole("link",{name:"Cards & spending"}).click();
  await expect(page).toHaveURL(/\/help#cards$/);
  const question=page.locator("summary").filter({hasText:"How do I freeze a card?"});
  await question.focus();await page.keyboard.press("Enter");
  await expect(question.locator("..")).toHaveAttribute("open","");
  await expect(question.locator("..")).toContainText("Only controls available to you are shown.");
  await page.keyboard.press("Enter");
  await expect(question.locator("..")).not.toHaveAttribute("open","");
  await page.getByRole("link",{name:"Go to sign in",exact:true}).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("public pages have unique canonical metadata and no private data", async ({page,request}) => {
  const titles=new Set<string>();
  for (const route of ["/","/card-services","/payment-services","/help"]) {
    await page.goto(route);
    titles.add(await page.title());
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute("href"))!).href).toBe(`https://etail-depot-next.netlify.app${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/.{50,}/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    const data=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
    expect(data["@graph"].at(-1).url).toBe(`https://etail-depot-next.netlify.app${route}`);
    await expect(page.locator("main")).not.toContainText(/Alex Morgan|Jamie Morgan|personId|cardId|canonical|projection|idempotency/);
  }
  expect(titles.size).toBe(4);
  const sitemap=await request.get("/sitemap.xml");expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots=await request.get("/robots.txt");expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Disallow: /api/");
  await page.goto("/login");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  const image=await request.get("/opengraph-image");expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toBe("image/png");
});
