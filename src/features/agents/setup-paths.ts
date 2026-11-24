import { taskPlanFor } from "./task-plans.ts";
import { canonicalOrigin } from "../../shared/site/public-release.ts";
import type { GuidanceDependency } from "@/shared/site/guidance-source";

/** Public guidance only. Choices never establish approval or account access. */
export type SetupLink = { label: string; href: string };
export type SetupChoice = { id: string; label: string; next: string };
export type SetupQuestion = { kind: "question"; id: string; title: string; note: string; choices: readonly SetupChoice[] };
export type SetupResult = { kind: "result"; id: string; title: string; body: string; owner: string; complete: string; note: string; action: SetupLink; reference: SetupLink };
export type SetupNode = SetupQuestion | SetupResult;
export type SetupSelection = { question: string; answer: string };

const support = { label: "Contact the implementation team", href: "/company/contact#integration" };
const account = { label: "Merchant account setup", href: "/resources/merchant-account-setup" };
const access = { label: "Account details after approval", href: "/developers/getting-started#integration-access" };
const platformLabels = { shopify: "Shopify", woocommerce: "WooCommerce", custom: "A custom website", hosted: "A payment link or QR code", manual: "Enter a payment myself" } as const;
type Platform = keyof typeof platformLabels;

function result(id: string, title: string, body: string, owner: string, complete: string, note: string, action: SetupLink, reference: SetupLink): SetupResult {
  return { kind: "result", id, title, body, owner, complete, note, action, reference };
}

const results: Record<string, SetupResult> = {
  pending: result("pending", "Follow your existing application’s review.", "Check the application status and any requests from the account team. Provide the requested information through the portal before moving on to gateway setup.", "Merchant and account team", "The account is approved and you receive the store-specific welcome details.", "Submitting an application does not confirm approval. You do not need another application just because review is still in progress.", { label: "Check what happens after submission", href: "/resources/merchant-account-setup#application-submitted" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
  access: result("access", "Get the correct store’s welcome details.", "Ask the implementation team to confirm the store, processing MID and gateway account pairing, then restore any missing access.", "Merchant and implementation team", "You can open the intended gateway account using the separate details supplied for that store.", "The Back Office login and Cybersource gateway login are different. Keep passwords, codes and keys in their secure provider screens.", support, { label: "Which portal should I use?", href: "/developers/getting-started#portal-access" }),
  shopify: result("shopify", "Connect the right payment app to your store.", "Start with the Shopify guide’s prerequisites. Confirm that your gateway account is ready for the app and environment you intend to use.", "Shopify store owner", "The intended provider is active for the correct store and the agreed checkout checks have passed.", "Merchant approval alone does not confirm app readiness. Test credentials cannot be substituted into the live app.", { label: "Open the Shopify setup guide", href: "/resources/shopify-gateway-integration#before-you-start" }, { label: "Payment checks before launch", href: "/developers/testing#acceptance-tests" }),
  woocommerce: result("woocommerce", "Prepare the plugin’s two kinds of credentials.", "The REST Key ID and Shared Secret are settings values. The separate private .p12 certificate is the file transferred to protected server storage.", "Merchant and web team", "The plugin uses the correct account, environment and protected certificate path, and payment checks pass.", "This guide uses WordPress.com and the Visa Acceptance Solutions plugin without SMB in its name. The certificate password is different from the SFTP password.", { label: "Open the WooCommerce setup guide", href: "/resources/woocommerce-gateway-integration#before-you-start" }, { label: "Where each credential goes", href: "/resources/woocommerce-gateway-integration#enter-credentials" }),
  "woocommerce-other": result("woocommerce-other", "Confirm your host and plugin first.", "Give your web team the host and exact plugin name and version. Ask them to confirm its credential fields, supported environment and private certificate storage requirements.", "Web team or hosting provider", "Your team has instructions that match the installed plugin and hosting environment.", "The WordPress.com server paths and transfer steps in our illustrated guide do not apply to every host or plugin. Do not upload a private certificate to the Media Library.", { label: "Check the guide’s prerequisites", href: "/resources/woocommerce-gateway-integration#before-you-start" }, support),
  custom: result("custom", "Give your web team the checkout connection plan.", "Your server creates the checkout session and verifies the payment outcome. Cybersource hosts the payment fields. Your team also needs recovery and duplicate protection.", "Web team", "Successful, declined and interrupted payment checks pass, with the verified outcome recorded against the correct order.", "An embedded payment screen does not remove the need for secure server work. Our code fragments are not a complete payment application.", { label: "Open the integration instructions", href: "/developers/api-reference#api-credentials" }, { label: "Review the acceptance checks", href: "/developers/testing#acceptance-tests" }),
  manual: result("manual", "Check Virtual Terminal for the correct store.", "Use the store’s Business Center to confirm Virtual Terminal access, permitted payment types and your user permissions with the implementation team.", "Authorized merchant user", "The account team confirms the manual payment setup and you know how to check the resulting payment record.", "Virtual Terminal is for the merchant to enter a payment. It is separate from a customer’s payment link and does not require a Unified Checkout website integration. Enter payment details only in the approved provider screen.", { label: "Review portal payment tools", href: "/developers/developer-tools#payment-requests" }, { label: "Find the correct gateway login", href: "/developers/getting-started#portal-access" }),
  "own-sales": result("own-sales", "Start with an account for your own sales.", "Your company is selling its own software or service to the customer. Review a merchant account for those sales, with your customer terms, refund process and payment records.", "Your business and the account team", "The selling company and intended payment flow are clear, and the team has confirmed the account requirements.", "An account for your own software sales does not automatically cover sales made by businesses using your software. Recurring payment options also need confirmation for your setup.", { label: "Review merchant account setup", href: "/resources/merchant-account-setup" }, { label: "Compare platform payment roles", href: "/use-cases/software-platforms/payment-models" }),
  marketplace: result("marketplace", "Map the seller and movement of funds first.", "Identify who sells each purchase, which business the customer pays and how you intend to handle commissions or payments to sellers. Review that structure with the platform team before choosing checkout.", "Platform team and Trolleys", "The seller, account ownership, funds flow and support responsibilities have an agreed, approved structure.", "Holding funds, split payments and payments to multiple sellers are not assumed features of a checkout connection. They need a separately approved structure.", { label: "Review platform payment models", href: "/use-cases/software-platforms/payment-models" }, { label: "Discuss your platform", href: "/company/contact#platforms" }),
  "platform-role": result("platform-role", "Work out who is selling to the customer.", "Separate your own software fees from purchases made from the businesses using your software. Describe one customer purchase and which business is responsible for it.", "Platform team and Trolleys", "You can identify the seller, who receives payment and who handles customer support for each type of purchase.", "The same platform can have different roles for its own sales and its merchants’ sales. Confirm the account structure before implementing a payment flow.", { label: "Compare platform payment models", href: "/use-cases/software-platforms/payment-models" }, { label: "Discuss your platform", href: "/company/contact#platforms" }),
  hosted: result("hosted", "Confirm a hosted payment option for your account.", "Ask the implementation team whether payment links are available for your account and how to set them up. A QR code can open the confirmed hosted payment URL.", "Merchant and implementation team", "The provider confirms the available option and you have its actual checkout URL and setup instructions.", "A Business Center login does not prove Pay by Link is enabled. Virtual Terminal is a separate, merchant-entered payment option when permitted.", support, { label: "Available portal payment tools", href: "/developers/developer-tools#payment-requests" }),
  switching: result("switching", "Plan the move before closing your current account.", "Review your current contract, checkout connection, saved payment arrangements and outstanding refunds or disputes with the team.", "Merchant and implementation team", "You have an agreed migration plan, including what moves, what stays and how the new connection will be checked.", "Approval and data portability need confirmation. Do not assume saved cards or subscriptions transfer automatically.", { label: "Plan a provider change", href: "/use-cases/switch-merchant-services" }, { label: "Prepare your account application", href: "/resources/merchant-account-setup" }),
  platform: result("platform", "Start with your merchants’ payment flow.", "Describe the businesses using your software, how customers pay and who handles refunds, disputes and reporting. The team can review the account structure and available integration.", "Platform team and Trolleys", "The payment flow, approval responsibilities and integration ownership are agreed.", "A software platform arrangement is different from connecting one merchant’s store. Each business still needs the appropriate review and approval.", { label: "Review merchant account roles", href: "/use-cases/software-platforms/payment-models" }, { label: "Discuss your platform", href: "/company/contact#platforms" }),
  domain: result("domain", "Check how the new website fits your existing account.", "Ask the implementation team whether the existing DBA and MID can support the additional storefront. Have your web team check its gateway and wallet domain requirements.", "Merchant, implementation team and web team", "The team confirms the account mapping and any domain or checkout changes before launch.", "A second website does not automatically require another MID. Do not submit an additional location application solely because a domain changed.", { label: "Review another storefront under one account", href: "/company/blog/add-storefront-domain-payment-account" }, access),
  dba: result("dba", "Request the additional DBA under the same company.", "Use the additional DBA guide to prepare a + Location request. Keep the same legal company name and provide the new DBA and its business details.", "Merchant and account team", "The additional MID is approved and the welcome details correctly pair that DBA with its gateway account.", "This requests a separate merchant account for the DBA. It does not activate processing immediately or create a new legal company.", { label: "Follow the additional DBA steps", href: "/resources/merchant-account-setup#additional-mid" }, access),
  company: result("company", "Confirm the company and account structure first.", "Tell the account team whether this is a different legal company or a change to an existing one. They can confirm which application and account arrangement to use.", "Merchant and account team", "You know which company, DBA and merchant account the application should represent.", "Do not use the same-company + Location process for a different legal company without the account team’s direction.", { label: "Contact merchant support", href: "/company/contact#account-support" }, account),
  uncertain: result("uncertain", "Check the original payment before another charge.", "Find the payment in the correct gateway account and match its reference, amount and time to the order. Ask support to trace it if the outcome remains unclear.", "Merchant, with the web team if checkout timed out", "The original attempt’s authoritative outcome is established and recorded before any further payment action.", "A timeout, missing confirmation or customer screenshot does not prove that the payment failed. Do not automatically charge again.", { label: "Trace an uncertain payment", href: "/developers/api-reference#uncertain-result" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
  payout: result("payout", "Trace the payout for the correct merchant account.", "Check funding activity in the Back Office Operations Portal for the correct MID, then compare it with your agreed payout schedule and any review requirements.", "Merchant or finance team", "The payout reference and current funding status are known, or support is tracing the missing payout.", "A successful payment is not confirmation of a bank deposit. Do not ask the customer to pay again because funding has not arrived.", { label: "Understand your payout", href: "/services/payouts" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
  refund: result("refund", "Start with the original payment record.", "Check the available refund action in your connected store or gateway. Look for an existing refund or dispute before returning money again.", "Merchant or payments team", "The refund’s outcome is confirmed in its record. The customer’s bank posting can happen separately.", "Submitting a refund is not proof that the customer already received it. Keep any dispute and its deadline under review.", { label: "Review refund procedures", href: "/services/refunds" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
  dispute: result("dispute", "Open the case and check its deadline.", "In the Back Office Operations Portal, review the dispute reason, response deadline and requested evidence. Include any existing refund record.", "Merchant or disputes team", "The requested response is submitted through the case workflow and its status is being followed.", "A refund does not automatically close a dispute. Follow the actual case instructions rather than a general deadline.", { label: "Review dispute support", href: "/services/disputes" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
  reports: result("reports", "Compare matching merchant and gateway records.", "Use the corresponding merchant and gateway accounts for the same store, currency, reporting period and time zone. Match sales with sales and refunds with refunds, then investigate unmatched payment references.", "Merchant or finance team", "Differences are explained by matched activity, reporting timing or applicable fees, or identified for support to investigate.", "The merchant account report and gateway report can update at different times. They are not interchangeable records.", { label: "Compare your payment reports", href: "/services/reconciliation" }, { label: "Contact merchant support", href: "/company/contact#account-support" }),
};

const questions: Record<string, SetupQuestion> = {
  start: { kind: "question", id: "start", title: "What would you like to do?", note: "Choose your situation. We’ll point you to the next useful step.", choices: [
    { id: "setup", label: "Start or connect checkout", next: "platform" },
    { id: "location", label: "Add a store or brand", next: "location" },
    { id: "payment", label: "Get help with a payment", next: "payment" },
    { id: "software", label: "Offer payments through my software", next: "software-model" },
  ] },
  platform: { kind: "question", id: "platform", title: "How will you take payments?", note: "Choose the setup you have or plan to use.", choices: Object.entries(platformLabels).map(([id,label])=>({ id, label, next: `approval:${id}` })) },
  "software-model": { kind: "question", id: "software-model", title: "Who is selling to the customer?", note: "Your own software sales and your merchants’ sales can need different account arrangements.", choices: [
    { id: "own", label: "My company sells its own software or service", next: "result:own-sales" },
    { id: "merchants", label: "Businesses sell through my software", next: "result:platform" },
    { id: "marketplace", label: "My marketplace connects buyers and sellers", next: "result:marketplace" },
    { id: "unsure", label: "I’m not sure which applies", next: "result:platform-role" },
  ] },
  location: { kind: "question", id: "location", title: "What is changing?", note: "A website, a DBA and a legal company are different things.", choices: [
    { id: "domain", label: "Another website for the same DBA", next: "result:domain" },
    { id: "dba", label: "A new DBA under the same legal company", next: "result:dba" },
    { id: "company", label: "A different legal company", next: "result:company" },
    { id: "unsure", label: "I’m not sure which applies", next: "result:company" },
  ] },
  payment: { kind: "question", id: "payment", title: "What needs attention?", note: "Use the original payment or case record to investigate.", choices: [
    { id: "uncertain", label: "I don’t know if a payment succeeded", next: "result:uncertain" },
    { id: "payout", label: "A payout has not arrived", next: "result:payout" },
    { id: "refund", label: "A customer needs a refund", next: "result:refund" },
    { id: "dispute", label: "A customer disputed a payment", next: "result:dispute" },
    { id: "reports", label: "My payment reports do not match", next: "result:reports" },
  ] },
  "woocommerce-host": { kind: "question", id: "woocommerce-host", title: "Which WooCommerce setup do you use?", note: "The host and plugin determine the setup steps.", choices: [
    { id: "documented", label: "WordPress.com with Visa Acceptance Solutions (without SMB)", next: "result:woocommerce" },
    { id: "other", label: "Another host or plugin, or I’m not sure", next: "result:woocommerce-other" },
  ] },
  "custom-team": { kind: "question", id: "custom-team", title: "Can your web team maintain a payment server?", note: "Embedded checkout needs secure server work and payment recovery.", choices: [
    { id: "yes", label: "Yes, our web team will handle it", next: "result:custom" },
    { id: "no", label: "No, I need a hosted option", next: "result:hosted" },
  ] },
};

function nodeFor(id: string): SetupNode {
  if (id.startsWith("result:")) return results[id.slice(7)] ?? questions.start;
  const [step, platform] = id.split(":") as [string, Platform];
  if ((step === "approval" || step === "access" || step === "application") && platform in platformLabels) {
    if (step === "application") return result(id, "Prepare your merchant account application.", "Start with the business, ownership and processing information in the account setup guide. Keep your platform requirements ready for the implementation team.", "Merchant or authorized company representative", "The application is reviewed and you receive the account-specific next steps and welcome details.", "Approval is required before processing. Platform support, payment methods and any hosted payment option must be confirmed for your account.", { label: "Prepare your application", href: "/resources/merchant-account-setup" }, { label: "Explore merchant services", href: "/services/merchant-services" });
    if (step === "approval") return { kind: "question", id, title: "Where are you with your Trolleys account?", note: "Approval and checkout readiness are separate steps.", choices: [
      { id: "planning", label: "I have not applied yet", next: `application:${platform}` },
      { id: "pending", label: "My application is under review", next: "result:pending" },
      { id: "approved", label: "My account is approved", next: `access:${platform}` },
      { id: "switching", label: "I am planning to switch providers", next: "result:switching" },
    ] };
    return { kind: "question", id, title: "Do you have the correct store’s gateway access?", note: "Use the store and account pairing in your welcome email.", choices: [
      { id: "ready", label: "Yes, the details match and I can sign in", next: platform === "woocommerce" ? "woocommerce-host" : platform === "custom" ? "custom-team" : `result:${platform}` },
      { id: "missing", label: "The email or access is missing, or I’m unsure", next: "result:access" },
    ] };
  }
  return questions[id] ?? questions.start;
}

/** Invalid or obsolete choices stop at the last valid question. No URL/state input is trusted. */
export function resolveSetupPath(answers: readonly string[]): { node: SetupNode; selections: SetupSelection[]; validAnswers: string[] } {
  let node = nodeFor("start");
  const selections: SetupSelection[] = [];
  const validAnswers: string[] = [];
  for (const answer of answers) {
    if (node.kind !== "question") break;
    const choice: SetupChoice | undefined = node.choices.find(item => item.id === answer);
    if (!choice) break;
    selections.push({ question: node.title, answer: choice.label });
    validAnswers.push(answer);
    node = nodeFor(choice.next);
  }
  return { node, selections, validAnswers };
}

/** Enumerate the same finite paths used by the interactive helper for static reference. */
export function setupScenarios() {
  const scenarios: { answers: string[]; selections: SetupSelection[]; result: SetupResult }[] = [];
  function visit(answers: string[]) {
    if (answers.length > 8) throw new Error("Setup path does not terminate");
    const { node, selections } = resolveSetupPath(answers);
    if (node.kind === "result") scenarios.push({ answers, selections, result: node });
    else for (const choice of node.choices) visit([...answers, choice.id]);
  }
  visit([]);
  return scenarios;
}

/** Identifies this plan's text, not a verification of the merchant or a security token. */
export function setupPlan(outcome: SetupResult) {
  const steps = taskPlanFor(outcome);
  let revision = 2166136261;
  for (const character of JSON.stringify([outcome, steps])) {
    revision = Math.imul(revision ^ character.charCodeAt(0), 16777619) >>> 0;
  }
  return { steps, reference: `${outcome.id.replaceAll(":", "-")}-${revision.toString(16).padStart(8, "0")}` };
}

const paymentSupportResults = new Set(["uncertain", "payout", "refund", "dispute", "reports"]);
const platformResults = new Set(["platform", "own-sales", "marketplace", "platform-role"]);

export function setupHandoff(selections: readonly SetupSelection[], outcome: SetupResult): string {
  const plan = setupPlan(outcome);
  const followUp = paymentSupportResults.has(outcome.id) ? [
    "For merchant support: have the affected store, relevant payment, payout or case reference, amount and currency, date or reporting period with time zone, and observed status ready. Describe what you already checked.",
    "Keep those account and customer records in the approved support channel. Do not add them to a public issue or AI chat. This copied brief contains only the choices made on the website.",
  ] : platformResults.has(outcome.id) ? [
    "For the platform discussion: describe who sells, who receives payment, what your software does and which team handles refunds, disputes and customer support.",
    "Reopen the current guidance with the implementation team. Account permissions, payment flows and partnership terms need confirmation for your arrangement.",
  ] : [
    "For my web team or AI assistant: reopen the current guides and help me plan this step. Do not request passwords, API secrets, card details or verification codes.",
  ];
  return ["My Trolleys next step brief", "Trolleys, an Etail Depot service", "", "Based on my selections, not a verification of my account:", ...selections.map(item => `${item.question} ${item.answer}`), "", `Next step: ${outcome.title}`, outcome.body, `Owner: ${outcome.owner}`, `Completion check: ${outcome.complete}`, `Confirm: ${outcome.note}`, "", `Guide: ${canonicalOrigin}${outcome.action.href}`, `Related guidance: ${canonicalOrigin}${outcome.reference.href}`, "", `Plan reference: ${plan.reference}`, "Action plan:", ...plan.steps.flatMap((step, index) => [
    `${index + 1}. ${step.title}`, step.action, `Owner: ${step.owner}`,
    ...(step.condition ? [`Before this step: ${step.condition}`] : []),
    `Complete when: ${step.complete}`, `Source: ${canonicalOrigin}${step.source.href}`, "",
  ]), "Use the current linked guidance and start with the first unfinished step. Ask only for missing information that changes that step. Stop at an unmet approval, access or capability requirement. This plan reference identifies the text, not account readiness.", "", ...followUp, "This brief does not authorize signing in, changing accounts or running payments."].join("\n");
}

/** Source review map only; the browser does not render or load a content inventory. */
export const setupGuidanceDependencies = [
  { sourceId: "account-access", nodes: [
    "question:approval:shopify", "question:access:shopify", "result:application:shopify",
    "question:approval:woocommerce", "question:access:woocommerce", "result:application:woocommerce",
    "question:approval:custom", "question:access:custom", "result:application:custom",
    "question:approval:hosted", "question:access:hosted", "result:application:hosted",
    "question:approval:manual", "question:access:manual", "result:application:manual",
    "result:pending", "result:access",
  ] },
  { sourceId: "woocommerce-credentials", nodes: ["question:woocommerce-host", "result:woocommerce", "result:woocommerce-other"] },
  { sourceId: "additional-dba", nodes: ["question:location", "result:dba", "result:domain", "result:company"] },
] as const satisfies readonly GuidanceDependency[];
