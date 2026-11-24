import { describe, expect, it } from "vitest";
import { resolveSetupPath, setupHandoff, type SetupResult } from "../../src/features/agents/setup-paths";
import { PUBLIC_CONTENT_PATHS } from "../../src/shared/site/public-page-inventory";

function outcome(path: string[]): SetupResult {
  const { node } = resolveSetupPath(path);
  expect(node.kind).toBe("result");
  if (node.kind !== "result") throw new Error("Expected a result");
  return node;
}

describe("merchant guidance decisions", () => {
  it("distinguishes pending review from a new application and blocks setup without gateway access", () => {
    for (const platform of ["shopify", "woocommerce", "custom", "hosted", "manual"]) {
      expect(outcome(["setup", platform, "pending"]).action.href).toBe("/resources/merchant-account-setup#application-submitted");
      expect(outcome(["setup", platform, "planning"]).id).toBe(`application:${platform}`);
      expect(outcome(["setup", platform, "approved", "missing"]).action.href).toBe("/company/contact#integration");
      expect(outcome(["setup", platform, "switching"]).id).toBe("switching");
    }
  });
  it("does not give WordPress.com procedures to other hosts or a server integration to a merchant without one", () => {
    expect(outcome(["setup", "woocommerce", "approved", "ready", "other"]).id).toBe("woocommerce-other");
    expect(outcome(["setup", "woocommerce", "approved", "ready", "documented"]).id).toBe("woocommerce");
    expect(outcome(["setup", "custom", "approved", "ready", "yes"]).id).toBe("custom");
    expect(outcome(["setup", "custom", "approved", "ready", "no"]).id).toBe("hosted");
  });
  it("keeps a new domain, DBA and different legal entity distinct", () => {
    expect(outcome(["location", "domain"]).id).toBe("domain");
    expect(outcome(["location", "dba"]).action.href).toBe("/resources/merchant-account-setup#additional-mid");
    for (const choice of ["company", "unsure"]) expect(outcome(["location", choice]).action.href).toBe("/company/contact#account-support");
  });
  it("routes an uncertain charge to original-attempt recovery instead of payout or retry guidance", () => {
    expect(outcome(["payment", "uncertain"]).action.href).toBe("/developers/api-reference#uncertain-result");
    expect(outcome(["payment", "payout"]).action.href).toBe("/services/payouts");
    expect(outcome(["payment", "refund"]).action.href).toBe("/services/refunds");
    expect(outcome(["payment", "dispute"]).action.href).toBe("/services/disputes");
    expect(outcome(["payment", "reports"]).action.href).toBe("/services/reconciliation");
  });
  it("terminates every available path with an existing public destination", () => {
    const terminal: string[][] = [];
    function visit(answers: string[]) {
      expect(answers.length).toBeLessThanOrEqual(5);
      const { node } = resolveSetupPath(answers);
      if (node.kind === "question") {
        expect(new Set(node.choices.map(choice => choice.id)).size).toBe(node.choices.length);
        for (const choice of node.choices) visit([...answers, choice.id]);
      } else {
        terminal.push(answers);
        for (const link of [node.action, node.reference]) {
          expect(PUBLIC_CONTENT_PATHS).toContain(link.href.split("#")[0]);
          expect(link.href).not.toContain("?");
        }
      }
    }
    visit([]);
    expect(new Set(terminal.map(path => path[0]))).toEqual(new Set(["setup", "location", "payment", "software"]));
  });
  it("does not interpret arbitrary input or keep stale downstream choices", () => {
    const r = resolveSetupPath(["setup", "shopify", "<script>", "ready"]);
    expect(r.validAnswers).toEqual(["setup", "shopify"]);
    expect(r.selections).toHaveLength(2);
    expect(r.node.id).toBe("approval:shopify");
    expect(resolveSetupPath(["payment", "uncertain", "ignored"]).selections).toHaveLength(2);
    expect(resolveSetupPath([]).node.id).toBe("start");
  });
  it("builds a portable planning brief from only the selected categories and approved public sources", () => {
    const r=resolveSetupPath(["setup", "woocommerce", "approved", "ready", "other"]);
    if(r.node.kind !== "result") throw new Error("No handoff");
    const brief=setupHandoff(r.selections,r.node);
    expect(brief).toContain("Another host or plugin");
    expect(brief).toContain("not a verification of my account");
    expect(brief).toContain("https://etaildepot.com/resources/woocommerce-gateway-integration#before-you-start");
    expect(brief).toContain("does not authorize signing in");
    expect(brief).not.toMatch(/merchantapp\.io|calendly\.com|localhost|\.local\//);
  });
  it("separates authorized manual entry from a customer hosted checkout", () => {
    const manual=outcome(["setup","manual","approved","ready"]);
    expect(manual.id).toBe("manual");
    expect(manual.action.href).toBe("/developers/developer-tools#payment-requests");
    expect(manual.body).toContain("permitted payment types and your user permissions");
    expect(manual.note).toContain("does not require a Unified Checkout website integration");
    expect(outcome(["setup","hosted","approved","ready"]).id).toBe("hosted");
  });
  it("does not route a software seller into an assumed multi-merchant or funds-control arrangement", () => {
    const own=outcome(["software","own"]);
    expect(own.action.href).toBe("/resources/merchant-account-setup");
    expect(own.note).toContain("does not automatically cover sales");
    expect(outcome(["software","merchants"]).action.href).toBe("/use-cases/software-platforms/payment-models");
    expect(outcome(["software","marketplace"]).note).toContain("separately approved structure");
    expect(outcome(["software","unsure"]).id).toBe("platform-role");
  });
  it("directs payment support details to the approved channel instead of an AI chat", () => {
    const resolved=resolveSetupPath(["payment","uncertain"]);
    if(resolved.node.kind !== "result") throw new Error("No handoff");
    const brief=setupHandoff(resolved.selections,resolved.node);
    expect(brief).toContain("My Trolleys next step brief");
    expect(brief).toContain("For merchant support:");
    expect(brief).toContain("date or reporting period with time zone");
    expect(brief).toContain("approved support channel");
    expect(brief).toContain("Do not add them to a public issue or AI chat");
    expect(brief).not.toContain("For my web team or AI assistant");
  });

});
