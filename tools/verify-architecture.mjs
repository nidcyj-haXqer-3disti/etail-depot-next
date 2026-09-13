#!/usr/bin/env node
/** Dependency and local workspace source ownership guards; not financial lifecycle certification. */
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipped = new Set(["node_modules", ".git", ".local", ".next", ".netlify", "coverage", "test-results", "playwright-report"]);
const errors = [];
const relative = (filename) => path.relative(root, filename).split(path.sep).join("/");
const codeFile = (filename) => /\.(?:ts|tsx|js|jsx|mjs|cjs)$/.test(filename) && !filename.endsWith(".d.ts");

async function walk(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (skipped.has(entry.name) || entry.isSymbolicLink()) continue;
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(filename));
    else if (entry.isFile() && codeFile(filename)) result.push(filename);
  }
  return result;
}

function inspectSource(filename, text) {
  const tree = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, filename.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const imports = [];
  const calls = [];
  const declarations = [];
  const first = tree.statements[0];
  const client = first && ts.isExpressionStatement(first) && ts.isStringLiteral(first.expression) && first.expression.text === "use client";
  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause;
      const named = clause?.namedBindings;
      const onlyTypes = clause?.isTypeOnly || (!clause?.name && named && ts.isNamedImports(named) && named.elements.every((entry) => entry.isTypeOnly));
      if (!onlyTypes) imports.push({ specifier: node.moduleSpecifier.text, node });
    } else if (ts.isExportDeclaration(node) && !node.isTypeOnly && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const onlyTypes = node.exportClause && ts.isNamedExports(node.exportClause) && node.exportClause.elements.every((entry) => entry.isTypeOnly);
      if (!onlyTypes) imports.push({ specifier: node.moduleSpecifier.text, node });
    } else if (ts.isCallExpression(node)) {
      calls.push(node);
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require")) {
        imports.push({ specifier: node.arguments[0] && ts.isStringLiteralLike(node.arguments[0]) ? node.arguments[0].text : null, node });
      }
    } else if (ts.isFunctionDeclaration(node) && node.name) declarations.push(node.name.text);
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return { filename, text, tree, imports, calls, declarations, client: Boolean(client) };
}

function report(file, node, code, message) {
  const line = node ? file.tree.getLineAndCharacterOfPosition(node.getStart(file.tree)).line + 1 : 1;
  errors.push(`${relative(file.filename)}:${line} ${code}: ${message}`);
}

function isForbiddenClientDependency(specifier, resolved) {
  return /^(?:node:|pg$|pg\/|drizzle-orm(?:\/|$)|@netlify\/(?:identity|database|blobs)(?:\/|$)|server-only$)/.test(specifier)
    || Boolean(resolved && /\/src\/(?:modules|platform)\//.test(resolved));
}

const workspaceOwner = "src/modules/workspace/service.ts";
const cardUiOwner = "src/ui/workspace/cards.tsx";
const channelUiOwner = "src/ui/workspace/merchant-channels.tsx";
const channelOwner = "src/modules/acquiring/service.ts";
const operationsOwner = "src/modules/acquiring/operations-service.ts";
const ledgerOwner = "src/modules/ledger/service.ts";
const guestOwner = "src/modules/acquiring/guest-service.ts";
const operationUiOwner = "src/ui/workspace/merchant-operations.tsx";
const checkoutOwner = "src/modules/acquiring/card-checkout-service.ts";
const checkoutUiOwner = "src/ui/card-checkout.tsx";
const fundingUiOwner = "src/ui/cardholder-funds.tsx";
const cardLimitUiOwner = "src/ui/workspace/card-limit-control.tsx";
const depositUiOwner = "src/ui/deposit-processing.tsx";
const moneyOwner = "src/modules/money/service.ts";
const moneyUiOwner = "src/ui/money-account.tsx";
const withdrawalUiOwner = "src/ui/money-withdrawal-processing.tsx";
const disputeOwner = "src/modules/disputes/service.ts";
const disputeUiOwner = "src/ui/workspace/merchant-disputes.tsx";
const networkOwner="src/modules/acquiring/network-service.ts";
const networkUiOwner="src/ui/network-checkout.tsx";
const cardInvitationUiOwner="src/ui/card-invitation-manager.tsx";
const resourceInvitationUiOwner="src/ui/resource-invitation.tsx";
const terminalAccessOwner = "src/modules/access/merchant-service.ts";
const peopleUiOwner = "src/ui/workspace/people.tsx";
const terminalPeopleUiOwner = "src/ui/workspace/merchant-people.tsx";
const connectedRoutes = [
  ["src/modules/access/service.ts", "src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/invitations/route.ts", "POST", "createCardInvitation"],
  [networkOwner,"src/app/api/v1/merchants/[merchantId]/processing-payments/[operationId]/process/route.ts","POST","processMerchantNetworkCheckout"],
  [networkOwner,"src/app/api/v1/guest/publications/[publicationId]/payments/route.ts","POST","startNetworkCheckout"],
  [networkOwner,"src/app/api/v1/guest/publications/[publicationId]/payments/[operationId]/route.ts","GET","getNetworkCheckout"],
  [networkOwner,"src/app/api/v1/guest/publications/[publicationId]/payments/[operationId]/process/route.ts","POST","processNetworkCheckout"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/funds/route.ts", "GET", "getCardholderFunds"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/funds/top-ups/[topupId]/route.ts", "GET", "getCardholderTopup"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/funds/intents/route.ts", "POST", "prepareCardholderFunding"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/funds/intents/[intentId]/route.ts", "GET", "getCardholderFundingIntent"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/funds/intents/[intentId]/route.ts", "POST", "confirmCardholderFunding"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/spending-limit/route.ts", "GET", "getCardSpending"],
  [workspaceOwner, "src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/spending-limit/route.ts", "PUT", "setCardSpendingLimit"],
  [checkoutOwner, "src/app/api/v1/checkout/[publicationId]/card/[attemptId]/route.ts", "GET", "getCardCheckoutReview"],
  [checkoutOwner, "src/app/api/v1/checkout/[publicationId]/card/[attemptId]/route.ts", "POST", "confirmCardCheckout"],
  [moneyOwner, "src/app/api/v1/money-accounts/route.ts", "GET", "listOwnedMoneyAccounts"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/route.ts", "GET", "getMoneyAccountOverview"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/funding/intents/route.ts", "POST", "prepareMoneyFunding"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/funding/intents/[intentId]/route.ts", "GET", "getMoneyFundingIntent"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/funding/intents/[intentId]/route.ts", "POST", "confirmMoneyFunding"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/withdrawals/intents/route.ts", "POST", "prepareMoneyWithdrawal"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/withdrawals/intents/[intentId]/route.ts", "GET", "getMoneyWithdrawalIntent"],
  [moneyOwner, "src/app/api/v1/money-accounts/[moneyAccountId]/withdrawals/intents/[intentId]/route.ts", "POST", "confirmMoneyWithdrawal"],
  [moneyOwner, "src/app/api/v1/operations/money-withdrawals/[withdrawalId]/route.ts", "POST", "processMoneyWithdrawal"],
  [disputeOwner, "src/app/api/v1/payments/[paymentId]/dispute/route.ts", "GET", "getPayerDispute"],
  [disputeOwner, "src/app/api/v1/payments/[paymentId]/dispute/route.ts", "POST", "openPaymentDispute"],
  [disputeOwner, "src/app/api/v1/merchants/[merchantId]/disputes/route.ts", "GET", "listTerminalDisputes"],
  [disputeOwner, "src/app/api/v1/merchants/[merchantId]/disputes/[disputeId]/respond/route.ts", "POST", "respondToTerminalDispute"],
  [disputeOwner, "src/app/api/v1/operations/disputes/route.ts", "GET", "getOperatorDisputes"],
  [disputeOwner, "src/app/api/v1/operations/disputes/[disputeId]/route.ts", "POST", "resolveMerchantDispute"],
  [channelOwner, "src/app/api/v1/merchants/[merchantId]/terminals/route.ts", "POST", "createTerminal"],
];
const retiredMutationRoutes = new Set([
  "src/app/api/v1/checkout/[publicationId]/card/route.ts",
  "src/app/api/v1/merchants/[merchantId]/submerchants/route.ts",
  "src/app/api/v1/merchants/[merchantId]/payouts/route.ts",
  "src/app/api/v1/cardholder-services/[serviceId]/cardholders/[holderId]/spending-limit/route.ts",
  "src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/purchase/route.ts",
  "src/app/api/v1/cardholder-services/[serviceId]/funds/top-ups/route.ts",
  "src/app/api/v1/merchants/[merchantId]/channels/[channelId]/test-payments/route.ts",
  "src/app/api/v1/cardholder-services/[serviceId]/invitations/route.ts",
  "src/app/api/v1/guest/publications/[publicationId]/orders/route.ts",
  "src/app/api/v1/guest/orders/[orderId]/attempts/route.ts",
  "src/app/api/v1/guest/orders/[orderId]/attempts/[attemptId]/confirm/route.ts",
]);
const fundingUiStages = new Map([
  ["/funds/intents/:id", ["CardholderFundsWorkspace/confirm", "POST", fundingUiOwner]],
  ["/cards/:id/spending-limit", ["CardLimitControl/save", "PUT", cardLimitUiOwner]],
]);
const operationUiPaths = new Map([
  ["/processing-payments/:id/process",["POST"]],
  ["/gateway", ["PUT"]], ["/test-enrollment", ["PUT"]],
  ["/channels/:id/activation", ["PUT"]], ["/payments/:id/refund", ["POST"]], ["/settlements", ["POST"]],
]);
const workspaceTransport = "src/ui/workspace/primitives.tsx";
const fixtureOwner = "src/modules/workspace/fixtures.ts";
const cardRoutes = new Map([
  ["card-requests/route.ts", ["POST", "startCardRequest"]],
  ["card-requests/[requestId]/route.ts", ["PATCH", "updateCardRequest"]],
  ["card-requests/[requestId]/submit/route.ts", ["POST", "submitCardRequest"]],
  ["card-requests/[requestId]/cancel/route.ts", ["POST", "cancelCardRequest"]],
  ["cards/[cardId]/control/route.ts", ["POST", "controlCard"]],
  ["cards/[cardId]/recipient/revoke/route.ts", ["POST", "revokeCardRecipient"]],
]);
const operationRoutes = new Map([
  ["src/app/api/v1/operations/deposits/[depositId]/route.ts", ["POST", "processMerchantDeposit"]],
  ["src/app/api/v1/merchants/[merchantId]/gateway/route.ts", ["PUT", "configureTestGateway"]],
  ["src/app/api/v1/merchants/[merchantId]/test-enrollment/route.ts", ["PUT", "enrollTestMerchant"]],
  ["src/app/api/v1/merchants/[merchantId]/channels/[channelId]/activation/route.ts", ["PUT", "setChannelActivation"]],
  ["src/app/api/v1/merchants/[merchantId]/payments/[paymentId]/refund/route.ts", ["POST", "refundMerchantPayment"]],
  ["src/app/api/v1/merchants/[merchantId]/settlements/route.ts", ["POST", "createMerchantSettlement"]],
  ["src/app/api/v1/merchants/[merchantId]/operations/route.ts", ["GET", "getMerchantOperations"]],
]);
const operationWriters = {
  testGateways: { insert: ["configureTestGateway"], update: ["configureTestGateway"] },
  testMerchantEnrollments: { insert: ["enrollTestMerchant"], update: ["enrollTestMerchant"] },
  channelActivations: { insert: ["setChannelActivation"], update: ["setChannelActivation"] },
  merchantTestPayments: { insert: ["recordMerchantSandboxPayment","recordMerchantNetworkPayment"] },
  merchantTestRefunds: { insert: ["refundMerchantPayment","recordMerchantNetworkRefund"] },
  merchantTestPayouts: {}, // Historical schema only; no runtime writer.
  merchantOperationCommands: { insert: ["finish"] },
};
const fundingWriters = {
  cardholderTopups: {}, // Historical receipts only; canonical money module owns new funding.
  cardholderFundingIntents: {},
  cardholderSpendingLimits: {}, // Person limits were retired by the reviewed cutover.
  cardholderLimitChanges: {},
  cardSpendingLimits: { insert: ["writeCardLimit"], update: ["writeCardLimit"] },
  cardLimitChanges: { insert: ["writeCardLimit"] },
};
const checkoutWriters = { cardCheckoutAttempts: { insert: ["prepareCardCheckout"] } };
const settlementWriters = {
  merchantSettlements: { insert: ["createMerchantSettlement"] },
  merchantSettlementItems: { insert: ["createMerchantSettlement"] },
  merchantSettlementCredits: { insert: ["createMerchantSettlement"] },
  merchantDeposits: {}, // Only historical reservations can finish processing.
  merchantDepositItems: {},
  merchantDepositEvents: { insert: ["processMerchantDeposit"] },
};
const moneyWriters = {
  moneyAccounts: { insert: ["attachServiceMoneyAccount"] },
  moneyAccountServices: { insert: ["attachServiceMoneyAccount"] },
  moneyCommands: { insert: ["claimCommand"] },
  moneyFundingIntents: { insert: ["prepareMoneyFunding"] },
  moneyTopups: { insert: ["addFunds"] },
  moneyWithdrawalIntents: { insert: ["prepareMoneyWithdrawal"] },
  moneyWithdrawals: { insert: ["confirmMoneyWithdrawal"] },
  moneyWithdrawalEvents: { insert: ["processMoneyWithdrawal"] },
  moneyCutoverTransfers: {},
};
const disputeWriters = {
  merchantDisputes: { insert: ["openPaymentDispute"], update: ["respondToTerminalDispute", "resolveMerchantDispute"] },
  merchantDisputeMessages: { insert: ["openPaymentDispute", "respondToTerminalDispute", "resolveMerchantDispute"] },
  merchantDisputeCommands: { insert: ["openPaymentDispute", "respondToTerminalDispute", "resolveMerchantDispute"] },
};
const terminalWriters = {
  merchantTerminals: { insert: ["initializeMerchantTerminal", "createTerminal"], update: ["merchantStatusCommand"] },
  merchantUnitCommands: { insert: ["createTerminal", "merchantStatusCommand"] },
  merchantUnitEvents: { insert: ["createTerminal", "merchantStatusCommand"] },
};
const terminalAccessWriters = {
  terminalAssignments: { insert: ["decideMerchantInvitation"], update: ["decideMerchantInvitation", "revokeMerchantAccess"] },
  terminalInvitationTerms: { insert: ["createMerchantInvitation"] },
};
const ledgerWriters = { ledgerJournals: { insert: ["postJournal"] }, ledgerEntries: { insert: ["postJournal"] } };
const guestWriters = {
  guestPublications:{insert:["publishGuestChannel"],update:["publishGuestChannel","revokeGuestPublication"]},
  guestPublicationCommands:{insert:["publishGuestChannel","revokeGuestPublication"]},
  guestSessions:{insert:["ensureGuestSession"]},guestOrders:{},guestAttempts:{}, // Historical order/attempt receipts are read-only.
  guestRequestBudgets:{insert:["consumeBudget","consumeGuestBudget"],update:["consumeBudget","consumeGuestBudget"],delete:["consumeBudget","consumeGuestBudget"]},
};
const writerOwners = {
  workspaceBalances: {}, serviceActivity: { insert: ["purchaseCardInTransaction"] }, settlements: {},
  cards: { insert: ["submitCardRequest"], update: ["controlCard", "purchaseCardInTransaction","bindCreatedCardRecipient","revokeCreatedCardRecipient"] },
  cardRequests: { insert: ["startCardRequest"], update: ["updateCardRequest", "submitCardRequest", "cancelCardRequest"] },
  disputes: {},
  disputeTimeline: {},
  notificationPreferences: { insert: ["saveNotificationPreferences"], update: ["saveNotificationPreferences"] },
  workspaceCommands: { insert: ["commandInTransaction"] },
};
const canonicalCommands = ["bindCreatedCardRecipient","revokeCreatedCardRecipient","revokeCardRecipient","controlCard", "startCardRequest", "updateCardRequest", "submitCardRequest", "cancelCardRequest", "purchaseCard", "purchaseCardInTransaction", "addCardholderFunds", "prepareCardholderFunding", "confirmCardholderFunding", "setCardSpendingLimit", "writeCardLimit", "saveNotificationPreferences"];

function functionChain(node) {
  const names = [];
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (ts.isFunctionDeclaration(parent) && parent.name) names.unshift(parent.name.text);
    else if ((ts.isArrowFunction(parent) || ts.isFunctionExpression(parent)) && ts.isVariableDeclaration(parent.parent) && ts.isIdentifier(parent.parent.name)) names.unshift(parent.parent.name.text);
  }
  return names;
}
function visitNodes(tree, predicate) {
  const matches = [];
  function visit(node) { if (predicate(node)) matches.push(node); ts.forEachChild(node, visit); }
  visit(tree); return matches;
}
function importBindings(file) {
  const bindings = new Map();
  for (const { node, specifier } of file.imports) {
    if (!ts.isImportDeclaration(node)) continue;
    const named = node.importClause?.namedBindings;
    if (named && ts.isNamedImports(named)) for (const entry of named.elements) bindings.set(entry.name.text, { imported: entry.propertyName?.text ?? entry.name.text, specifier });
    else if (named && ts.isNamespaceImport(named)) bindings.set(named.name.text, { imported: "*", specifier });
  }
  return bindings;
}
function sourceModule(file, specifier) {
  if (!specifier) return null;
  const filename = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(file.filename), specifier) : null;
  return filename ? relative(filename).replace(/\.[cm]?[jt]sx?$/, "") : specifier;
}
function scopeContains(declaration, usage) {
  const scope = declaration.parent;
  for (let node = usage; node; node = node.parent) if (node === scope) return true;
  // A variable declaration's immediate parent is a declaration list, not its lexical scope.
  if (ts.isVariableDeclaration(declaration)) {
    let container = declaration.parent;
    while (container && !ts.isBlock(container) && !ts.isSourceFile(container) && !ts.isForOfStatement(container) && !ts.isForStatement(container)) container = container.parent;
    for (let node = usage; node; node = node.parent) if (node === container) return true;
  }
  return false;
}
function localDeclaration(file, identifier) {
  return visitNodes(file.tree, node => (ts.isVariableDeclaration(node) || ts.isParameter(node)) && ts.isIdentifier(node.name) && node.name.text === identifier.text && scopeContains(node, identifier))
    .sort((a, b) => functionChain(b).length - functionChain(a).length || b.pos - a.pos)[0];
}
/** Resolve finite local URL expressions, preserving opaque resource IDs without guessing routes. */
function stringValues(file, node, seen = new Set()) {
  if (!node || seen.has(node)) return ["?"];
  const next = new Set(seen).add(node);
  if (ts.isStringLiteralLike(node)) return [node.text];
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) return stringValues(file, node.expression, next);
  if (ts.isConditionalExpression(node)) return [...new Set([...stringValues(file, node.whenTrue, next), ...stringValues(file, node.whenFalse, next)])];
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "encodeURIComponent") return [":id"];
  if (ts.isPropertyAccessExpression(node) && /^(?:id|serviceId|requestId|cardId|merchantId|merchantUnitId|terminalId|moneyAccountId|withdrawalId|disputeId|channelId|paymentId|publicationId|orderId|attemptId|intentId|depositId|personId|holderId)$/.test(node.name.text)) return [":id"];
  if (ts.isIdentifier(node)) {
    // Destructured component inputs may supply an opaque ID, never an arbitrary path.
    if(/^(?:serviceId|cardId|terminalId|moneyAccountId|withdrawalId|disputeId|paymentId)$/.test(node.text)){
      const parameter=visitNodes(file.tree,item=>ts.isParameter(item)&&ts.isObjectBindingPattern(item.name)&&item.name.elements.some(element=>ts.isIdentifier(element.name)&&element.name.text===node.text)&&scopeContains(item,node));
      if(parameter.length)return [":id"];
    }
    const declaration = localDeclaration(file, node);
    if (declaration?.initializer) return stringValues(file, declaration.initializer, next);
    if (declaration && ts.isParameter(declaration) && declaration.type) {
      const types = ts.isUnionTypeNode(declaration.type) ? declaration.type.types : [declaration.type];
      if (types.every(type => ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal))) return types.map(type => type.literal.text);
    }
    return ["?"];
  }
  const combine = (left, right) => left.flatMap(a => right.map(b => a + b)).slice(0, 32);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) return combine(stringValues(file, node.left, next), stringValues(file, node.right, next));
  if (ts.isTemplateExpression(node)) {
    let result = [node.head.text];
    for (const span of node.templateSpans) result = combine(result, stringValues(file, span.expression, next).map(value => value + span.literal.text));
    return result;
  }
  return ["?"];
}
function boundName(file, expression, bindings, seen = new Set()) {
  if (!expression || seen.has(expression)) return null;
  const next = new Set(seen).add(expression);
  if (ts.isIdentifier(expression)) {
    if (bindings.has(expression.text)) return bindings.get(expression.text);
    const declaration = localDeclaration(file, expression);
    if (declaration?.initializer) return boundName(file, declaration.initializer, bindings, next);
    const destructured = visitNodes(file.tree, node => ts.isVariableDeclaration(node) && ts.isObjectBindingPattern(node.name) && scopeContains(node, expression) && node.name.elements.some(entry => ts.isIdentifier(entry.name) && entry.name.text === expression.text))[0];
    if (destructured?.initializer) {
      const source = boundName(file, destructured.initializer, bindings, next);
      const entry = destructured.name.elements.find(entry => ts.isIdentifier(entry.name) && entry.name.text === expression.text);
      if (source?.imported === "*" && entry) return { ...source, imported: entry.propertyName?.getText(file.tree) ?? expression.text };
    }
  }
  if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.expression)) {
    const namespace = bindings.get(expression.expression.text);
    if (namespace?.imported === "*") return { ...namespace, imported: expression.name.text };
  }
  return null;
}
function namedCallee(call) { return ts.isIdentifier(call.expression) ? call.expression.text : ts.isPropertyAccessExpression(call.expression) ? call.expression.name.text : null; }
function identifierIs(node, value) { return Boolean(node && ts.isIdentifier(node) && node.text === value); }
function propertyValue(object, name) {
  const property = object && ts.isObjectLiteralExpression(object) ? object.properties.find(item => item.name?.getText() === name) : null;
  return property && ts.isPropertyAssignment(property) ? property.initializer : null;
}
function statusAssigned(call) {
  const set = call.parent?.parent;
  return set && ts.isCallExpression(set) && namedCallee(set) === "set" ? propertyValue(set.arguments[0], "status") : null;
}
function isBlockedOrIssuedBranch(sites) {
  if (sites.length !== 2) return false;
  const blocked = sites.find(site => ts.isStringLiteralLike(statusAssigned(site.call) ?? {}) && statusAssigned(site.call).text === "BLOCKED");
  const issued = sites.find(site => ts.isStringLiteralLike(statusAssigned(site.call) ?? {}) && statusAssigned(site.call).text === "ISSUED");
  if (!blocked || !issued) return false;
  for (let parent = blocked.call.parent; parent; parent = parent.parent) {
    if (ts.isIfStatement(parent) && ts.isBlock(parent.thenStatement) && ts.isReturnStatement(parent.thenStatement.statements.at(-1) ?? {}) && !parent.elseStatement) {
      return issued.call.pos > parent.end && functionChain(blocked.call).join("/") === functionChain(issued.call).join("/");
    }
  }
  return false;
}

function inspectWorkspaceOwnership(files, emit, requirePresence = true) {
  const counts = { requestUiCalls: 0, requestRouteCalls: 0, guardedWriters: 0, operationRouteCalls: 0, purchaseUiCalls: 0 };
  const uiStages = new Map();
  const routeStages = new Map();
  const writerSites = new Map();
  const operationStages = new Map();
  const operationUiStages = new Map();
  const connectedRouteStages = new Map();
  const connectedUiStages = new Map();
  const fundingStages = new Map();
  const moneyUiStages = new Map();
  const disputeUiStages = new Map();
  const accessUiStages = new Map();
  let depositUiCalls = 0;
  for (const file of files.values()) {
    const name = relative(file.filename);
    const bindings = importBindings(file);
    // A combined setup may continue only to the exact enrollment command that
    // was captured inside its reviewed gateway attempt, using the same transport.
    const continuations = name === operationUiOwner ? visitNodes(file.tree, node => ts.isPropertyAssignment(node) && node.name.getText(file.tree) === "next") : [];
    const fixedEnrollmentContinuation = continuations.length === 1 && continuations.every(node => {
      const value = ts.isAsExpression(node.initializer) ? node.initializer.expression : node.initializer;
      const body = propertyValue(value, "body");
      const keys = value && ts.isObjectLiteralExpression(value) ? value.properties.map(property => property.name?.getText(file.tree)).sort().join(",") : "";
      const bodyKeys = body && ts.isObjectLiteralExpression(body) ? body.properties.map(property => property.name?.getText(file.tree)).sort().join(",") : "";
      let caller=node.parent;while(caller&&!ts.isCallExpression(caller))caller=caller.parent;
      const id = propertyValue(body, "commandId"), version = propertyValue(body, "expectedVersion");
      return functionChain(node).join("/") === "MerchantOperations/confirm" && keys === "body,kind,method,path,setup" && bodyKeys === "commandId,enabled,expectedVersion"
        && stringValues(file, propertyValue(value, "path")).join() === "/test-enrollment" && stringValues(file, propertyValue(value, "method")).join() === "PUT"
        && stringValues(file, propertyValue(value, "kind")).join() === "enrollment" && propertyValue(value, "setup")?.kind === ts.SyntaxKind.TrueKeyword && propertyValue(body, "enabled")?.kind === ts.SyntaxKind.TrueKeyword
        && id && ts.isCallExpression(id) && id.arguments.length === 0 && id.expression.getText(file.tree) === "crypto.randomUUID"
        && version?.getText(file.tree) === "operations.enrollment.version" && caller && namedCallee(caller) === "send" && stringValues(file, propertyValue(caller.arguments[0], "path")).join() === "/gateway";
    });
    if(continuations.length&&!fixedEnrollmentContinuation)emit(file,continuations[0],"OPERATION_SETUP_CONTINUATION","The reviewed gateway may capture only a fixed enabled enrollment step with its own original identifier and version.");
    const isUi = file.client || name.startsWith("src/ui/");
    if (retiredMutationRoutes.has(name)) emit(file, null, "RETIRED_SIMULATOR_ROUTE", "Retired purchase, direct top-up and guest simulator HTTP entry points must be removed, not redirected to another mutation.");
    if (/^src\/app\/pay\//.test(name)) emit(file, null, "RETIRED_SIMULATOR_PAGE", "Raw channel checkout is retired; customer payment starts from a published connected Cardholder checkout.");
    if (isUi) for (const label of visitNodes(file.tree, node => ts.isJsxText(node) || ts.isStringLiteralLike(node))) {
      const value = ts.isJsxText(label) ? label.getText(file.tree) : label.text;
      if (/\b(?:try (?:a )?purchase|try a practice purchase|pay with test funds|try declined payment)\b/i.test(value)) emit(file, label, "RETIRED_SIMULATOR_COPY", "Customer actions must describe connected payments, not an outcome or direct purchase simulator.");
    }
    for (const literal of visitNodes(file.tree, node => ts.isStringLiteralLike(node) || ts.isTemplateExpression(node))) {
      const value = ts.isTemplateExpression(literal) ? literal.head.text : literal.text;
      if (/^(?:https?:\/\/[^/]+)?\/pay\//.test(value)) emit(file, literal, "RETIRED_CHANNEL_CHECKOUT_LINK", "Raw channel locators cannot become customer checkout links; use the canonical published payment request.");
    }
    const retiredTables = new Set(["disputes", "disputeTimeline", "settlements", "workspaceBalances"]);
    for (const node of visitNodes(file.tree, node => ts.isIdentifier(node) || ts.isPropertyAccessExpression(node))) {
      const binding = boundName(file, node, bindings);
      if (binding && sourceModule(file, binding.specifier) === "src/platform/database/schema" && retiredTables.has(binding.imported)) emit(file, node, "RETIRED_WORKSPACE_TABLE", "Retired dispute and illustrative balance/settlement records are not part of the service runtime.");
    }
    for (const dependency of file.imports) {
      const importedModule = sourceModule(file, dependency.specifier);
      if (name !== fixtureOwner && importedModule === fixtureOwner.slice(0, -3)) emit(file, dependency.node, "FIXTURE_RUNTIME_IMPORT", "Application source must not import the explicit local fixture seeder.");
      if (importedModule === "src/modules/acquiring/fixtures" && name !== "src/modules/acquiring/fixtures.ts") emit(file, dependency.node, "FIXTURE_RUNTIME_IMPORT", "Merchant fixture approval is confined to explicit fixture preparation.");
      if (ts.isExportDeclaration(dependency.node) && importedModule === workspaceOwner.slice(0, -3)) emit(file, dependency.node, "WORKSPACE_COMMAND_REEXPORT", "Keep workspace service commands directly inspectable; do not add a parallel re-export entry point.");
      if (ts.isExportDeclaration(dependency.node) && importedModule === "src/platform/database/schema") emit(file, dependency.node, "WORKSPACE_TABLE_REEXPORT", "Import the canonical database schema directly so protected table writers remain inspectable.");
      if (ts.isExportDeclaration(dependency.node) && ["src/modules/ledger/schema", "src/modules/acquiring/operations-schema", "src/modules/acquiring/settlement-schema", "src/modules/acquiring/card-checkout-schema", "src/modules/workspace/funding-schema", "src/modules/money/schema", "src/modules/disputes/schema", "src/modules/access/schema", "src/modules/acquiring/schema"].includes(importedModule)) emit(file, dependency.node, "FINANCIAL_TABLE_REEXPORT", "Financial and authority tables must be imported directly from their inspected schema owner.");
      if (ts.isExportDeclaration(dependency.node) && [moneyOwner,disputeOwner,terminalAccessOwner].some(owner=>importedModule===owner.slice(0,-3))) emit(file,dependency.node,"DOMAIN_COMMAND_REEXPORT","Money, disputes and terminal access commands remain directly inspectable in their canonical owner.");
      if (ts.isExportDeclaration(dependency.node) && importedModule === checkoutOwner.slice(0, -3)) emit(file, dependency.node, "CHECKOUT_COMMAND_REEXPORT", "Connected checkout commands have one directly inspected owner.");
      if (ts.isExportDeclaration(dependency.node) && importedModule === operationsOwner.slice(0, -3)) emit(file, dependency.node, "OPERATION_COMMAND_REEXPORT", "Operation commands remain directly inspectable in their single owner.");
      if (ts.isExportDeclaration(dependency.node) && importedModule === ledgerOwner.slice(0, -3) && name !== "src/modules/ledger/index.ts") emit(file, dependency.node, "LEDGER_COMMAND_REEXPORT", "Only the ledger's own entry point may re-export its posting API.");
    }
    const apiPrefix = "src/app/api/v1/cardholder-services/[serviceId]/";
    if (name.startsWith(apiPrefix) && /^(?:cards|card-requests)\//.test(name.slice(apiPrefix.length))) {
      const route = name.slice(apiPrefix.length);
      const allowedMethod = cardRoutes.get(route)?.[0] ?? connectedRoutes.find(([,path,,command])=>path===name&&["setCardSpendingLimit","createCardInvitation"].includes(command))?.[2] ?? null;
      for (const statement of file.tree.statements) {
        if (!statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
        const names = ts.isFunctionDeclaration(statement) && statement.name ? [statement.name.text] : ts.isVariableStatement(statement) ? statement.declarationList.declarations.filter(node => ts.isIdentifier(node.name)).map(node => node.name.text) : [];
        for (const method of names) if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && method !== allowedMethod) emit(file, statement, "PARALLEL_CARD_MUTATION_ROUTE", "Card writes use only canonical saved requests and card controls; purchases use the connected checkout owner.");
      }
    }
    if (name.startsWith("src/app/api/v1/checkout/") || name.startsWith("src/app/api/v1/money-accounts/") || /^src\/app\/api\/v1\/(?:operations\/(?:money-withdrawals|disputes)|payments\/[^/]+\/dispute|merchants\/[^/]+\/(?:terminals|disputes))\//.test(name) || name.startsWith(apiPrefix) && /^(?:funds\/|cards\/[^/]+\/spending-limit\/)/.test(name.slice(apiPrefix.length))) {
      const expectedMethods = connectedRoutes.filter(([, route]) => route === name).map(([, , method]) => method);
      for (const statement of file.tree.statements) {
        if (!statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
        const exported = ts.isFunctionDeclaration(statement) && statement.name ? [statement.name.text] : ts.isVariableStatement(statement) ? statement.declarationList.declarations.filter(node => ts.isIdentifier(node.name)).map(node => node.name.text) : [];
        for (const method of exported) if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && !expectedMethods.includes(method)) emit(file, statement, "PARALLEL_CONNECTED_MUTATION_ROUTE", "Funding, per-card allowances and connected checkout use only the exact reviewed mutation routes.");
      }
    }
    for (const declaration of visitNodes(file.tree, node => ts.isFunctionDeclaration(node) && Boolean(node.name))) {
      const symbol = declaration.name.text;
      if (canonicalCommands.includes(symbol) && name !== workspaceOwner && declaration.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) emit(file, declaration, "DUPLICATE_WORKSPACE_COMMAND", "The implemented workspace command has one owning service.");
      if ([...operationRoutes.values()].some(([, command]) => command === symbol) && name !== operationsOwner && declaration.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) emit(file, declaration, "DUPLICATE_OPERATION_COMMAND", "Merchant operations have one canonical service.");
      if (symbol === "postJournal" && name !== ledgerOwner) emit(file, declaration, "DUPLICATE_LEDGER_COMMAND", "There is exactly one ledger posting owner.");
      for(const owner of [moneyOwner,disputeOwner]) if(connectedRoutes.some(([declaredOwner,,,command])=>declaredOwner===owner&&command===symbol)&&name!==owner)emit(file,declaration,"DUPLICATE_DOMAIN_COMMAND","Money and dispute commands each have one owning service.");
      const serviceCommandOwner={createCardholderService:"src/modules/services/service.ts",createPrimaryMerchant:"src/modules/services/create-merchant.ts",createTerminal:channelOwner,pauseMerchant:channelOwner,resumeMerchant:channelOwner,respondToCase:"src/modules/operations/service.ts"}[symbol];
      if(serviceCommandOwner&&name!==serviceCommandOwner&&declaration.modifiers?.some(modifier=>modifier.kind===ts.SyntaxKind.ExportKeyword))emit(file,declaration,"DUPLICATE_SERVICE_COMMAND","Service enrollment, merchant hierarchy and assigned support responses each have one owning command.");
      if (symbol === "getMerchantCheckout") emit(file, declaration, "RETIRED_CHANNEL_CHECKOUT_OWNER", "The retired raw-channel preview owner must not be recreated; publication owns the customer link.");
      if (["CardPurchaseForm", "MerchantCheckout", "guestRequest"].includes(symbol)) emit(file, declaration, "RETIRED_SIMULATOR_UI", "Customer purchase and outcome simulator forms are retired; use the connected checkout.");
      const connectedUiOwner = { NetworkCheckout:networkUiOwner,ResourceInvitation:resourceInvitationUiOwner,CardInvitationManager:cardInvitationUiOwner,CardCheckout: checkoutUiOwner, CardholderFundsWorkspace: fundingUiOwner, CardLimitControl: cardLimitUiOwner, DepositProcessing: depositUiOwner, DepositRow: depositUiOwner, MoneyAccountWorkspace:moneyUiOwner, moneyRequest:moneyUiOwner, MoneyWithdrawalProcessing:withdrawalUiOwner, WithdrawalRow:withdrawalUiOwner, PayerDispute:disputeUiOwner, MerchantDisputes:disputeUiOwner, DisputeRecord:disputeUiOwner }[symbol];
      if (connectedUiOwner && name !== connectedUiOwner) emit(file, declaration, "DUPLICATE_CONNECTED_UI", "Funding, spending limits, connected checkout and assigned deposit processing each have one UI owner.");
      if (["prepareCardCheckout", "confirmCardCheckout", "getCardCheckoutReview"].includes(symbol) && name !== checkoutOwner) emit(file, declaration, "DUPLICATE_CHECKOUT_COMMAND", "One service owns connected checkout review and confirmation.");
      if (symbol === "MerchantOperations" && name !== operationUiOwner) emit(file, declaration, "DUPLICATE_OPERATION_UI", "Merchant setup/payment commands and checkout have their canonical operation UI owner.");
      if(["GuestOffer","GuestOrder","guestRequest"].includes(symbol)&&name!=="src/ui/guest-checkout.tsx")emit(file,declaration,"DUPLICATE_GUEST_UI","The public guest offer and private order use one reviewed checkout UI.");
      if(symbol==="recordMerchantSandboxPayment"&&name!==operationsOwner)emit(file,declaration,"DUPLICATE_PAYMENT_PERSISTENCE","Merchant and guest orders share the sole existing payment persistence owner.");
      if (symbol === "MerchantChannels" && name !== channelUiOwner) emit(file, declaration, "DUPLICATE_CHANNEL_FORM", "Payment channels have one canonical form for all seven presentations.");
      if (["createChannel", "updateChannel", "cancelChannel", "channelCommand"].includes(symbol) && name !== channelOwner) emit(file, declaration, "DUPLICATE_CHANNEL_COMMAND", "Channel mutations belong to the canonical acquiring command.");
      if (["CardsWorkspace", "CardRequestForm"].includes(symbol) && name !== cardUiOwner) emit(file, declaration, "DUPLICATE_CARD_FORM", "Saved card requests belong only to the canonical Cards workspace.");
    }
    for (const jsx of visitNodes(file.tree, node => ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node))) {
      if (["CardPurchaseForm", "MerchantCheckout"].includes(jsx.tagName.getText(file.tree))) emit(file, jsx, "RETIRED_SIMULATOR_UI", "Retired customer simulator forms must not be rendered.");
      if (jsx.tagName.getText(file.tree) === "CardRequestForm" && (name !== cardUiOwner || functionChain(jsx).join("/") !== "CardsWorkspace")) emit(file, jsx, "PARALLEL_CARD_FORM", "Only CardsWorkspace may render the saved card-request form.");
    }
    for (const call of file.calls) {
      const chain = functionChain(call);
      const callee = namedCallee(call);
      const bound = boundName(file, call.expression, bindings);
      const savedAccessOwner=name===peopleUiOwner?{component:"PeopleWorkspace",sender:"run",argument:"next",prefix:"/api/v1/cardholder-services/:id"}:name===terminalPeopleUiOwner?{component:"MerchantPeople",sender:"send",argument:"command",prefix:""}:null;
      if(savedAccessOwner&&chain[0]===savedAccessOwner.component){
        if(callee===savedAccessOwner.sender){
          const input=call.arguments[0];
          if(input&&ts.isObjectLiteralExpression(input)){
            const paths=stringValues(file,propertyValue(input,"path"));
            for(const value of paths){
              const suffix=value.slice(savedAccessOwner.prefix.length);
              if(!value.startsWith(savedAccessOwner.prefix)||!["/invitations","/invitations/:id/revoke","/people/:id/revoke"].includes(suffix))emit(file,call,"ACCESS_ATTEMPT_ROUTE","Access attempts use only fixed invitations and revocation routes.");
              else {const key=`${name}:${suffix}`;accessUiStages.set(key,(accessUiStages.get(key)??0)+1);}
            }
          }else if(!identifierIs(input,"attempt"))emit(file,call,"ACCESS_ATTEMPT_SOURCE","Access retries must reuse the unchanged saved attempt.");
        }
        if(callee==="setAttempt"&&call.arguments[0]?.kind!==ts.SyntaxKind.NullKeyword&&!(chain.join("/")===`${savedAccessOwner.component}/${savedAccessOwner.sender}`&&identifierIs(call.arguments[0],savedAccessOwner.argument)))emit(file,call,"ACCESS_ATTEMPT_SOURCE","Only the reviewed access attempt may populate retry state.");
      }
      if (name === operationUiOwner && chain[0] === "MerchantOperations") {
        if (callee === "send") {
          const argument = call.arguments[0];
          if (argument && ts.isObjectLiteralExpression(argument)) {
            const paths = stringValues(file, propertyValue(argument, "path"));
            const methods = stringValues(file, propertyValue(argument, "method"));
            const hasTarget = propertyValue(argument, "target") !== null;
            const expected = paths.length === 1 ? operationUiPaths.get(paths[0]) : null;
            const reconciliation=paths.join()==="/processing-payments/:id/process"&&chain.join("/")==="MerchantOperations"&&stringValues(file,propertyValue(argument,"kind")).join()==="reconcile"&&propertyValue(propertyValue(argument,"body"),"commandId")?.getText(file.tree)==="payment.id";
            if ((!reconciliation&&chain.join("/") !== "MerchantOperations/confirm") || !expected || hasTarget || methods.length !== 1 || methods[0] !== expected[0]) emit(file, call, "OPERATION_UI_ROUTE", "A reviewed operation attempt must select one finite owning route, target and HTTP method.");
            else operationUiStages.set(paths[0], (operationUiStages.get(paths[0]) ?? 0) + 1);
          } else if (!identifierIs(argument, "attempt") && !(fixedEnrollmentContinuation && chain.join("/") === "MerchantOperations/send" && argument && ts.isPropertyAccessExpression(argument) && identifierIs(argument.expression,"command") && argument.name.text === "next")) emit(file, call, "OPERATION_ATTEMPT_SOURCE", "Operation retries must reuse the unchanged saved attempt or its exact reviewed enrollment continuation.");
        }
        if (callee === "setAttempt" && call.arguments[0]?.kind !== ts.SyntaxKind.NullKeyword && !(chain.join("/") === "MerchantOperations/send" && identifierIs(call.arguments[0], "command"))) emit(file, call, "OPERATION_ATTEMPT_SOURCE", "Only the reviewed command may populate an operation retry attempt.");
      }
      if (["insert", "update", "delete"].includes(callee)) {
        const table = boundName(file, call.arguments[0], bindings);
        const tableModule=table && sourceModule(file,table.specifier);
        for (const [module, owner, definitions, code] of [["src/modules/ledger/schema", ledgerOwner, ledgerWriters, "LEDGER_WRITER_OWNERSHIP"], ["src/modules/acquiring/operations-schema", operationsOwner, operationWriters, "OPERATION_WRITER_OWNERSHIP"], ["src/modules/workspace/funding-schema", workspaceOwner, fundingWriters, "FUNDING_WRITER_OWNERSHIP"], ["src/modules/acquiring/card-checkout-schema", checkoutOwner, checkoutWriters, "CHECKOUT_WRITER_OWNERSHIP"], ["src/modules/acquiring/settlement-schema", operationsOwner, settlementWriters, "SETTLEMENT_WRITER_OWNERSHIP"], ["src/modules/money/schema",moneyOwner,moneyWriters,"MONEY_WRITER_OWNERSHIP"], ["src/modules/disputes/schema",disputeOwner,disputeWriters,"DISPUTE_WRITER_OWNERSHIP"], ["src/modules/acquiring/schema",channelOwner,terminalWriters,"TERMINAL_WRITER_OWNERSHIP"], ["src/modules/access/schema",terminalAccessOwner,terminalAccessWriters,"TERMINAL_ACCESS_WRITER_OWNERSHIP"]]) {
          if (tableModule !== module) continue;
          if([terminalWriters,terminalAccessWriters].includes(definitions)&&!Object.hasOwn(definitions,table.imported))continue;
          counts.guardedWriters++;
          const allowed = name === owner && definitions[table.imported]?.[callee]?.includes(chain[0]);
          if (!allowed) emit(file, call, code, `${table.imported}.${callee} belongs only to its finite canonical posting/operation function.`);
          else {
            const key = `${table.imported}.${callee}:${chain[0]}`;
            writerSites.set(key, [...(writerSites.get(key) ?? []), { file, call }]);
          }
        }
        if(tableModule === "src/modules/acquiring/network-schema") {
          const rules={networkPaymentOperations:{insert:[networkOwner,"prepareNetworkPayment"]},networkEvents:{insert:[networkOwner,"reconcileNetworkEvent"]},networkEventEffects:{insert:[networkOwner,"reconcileNetworkEvent"]},networkRefundOperations:{insert:[operationsOwner,"prepareMerchantNetworkRefund"]}};
          const expected=rules[table.imported]?.[callee];if(!expected||name!==expected[0]||chain[0]!==expected[1])emit(file,call,"NETWORK_WRITER_OWNERSHIP","Durable instructions and verified event effects have finite canonical writers; they cannot be edited or removed.");
        }
        if(tableModule === "src/modules/acquiring/guest-schema") {
          if(name !== guestOwner || !guestWriters[table.imported]?.[callee]?.includes(chain[0]))emit(file,call,"GUEST_WRITER_OWNERSHIP","Publications, guest authority, orders and attempts have finite owning commands; snapshots cannot be edited or removed.");
        }
        if(tableModule === "src/modules/acquiring/schema" && !(name === "src/modules/acquiring/service.ts" || (name === "src/modules/acquiring/fixtures.ts" && callee === "insert"))) emit(file,call,"ACQUIRING_WRITER_OWNERSHIP","Merchant setup and payment channels have one owning service; fixture preparation may only insert fictional references.");
        if (tableModule === "src/modules/acquiring/schema" && ["paymentChannels", "paymentChannelCommands"].includes(table.imported) && (name !== channelOwner || chain[0] !== "channelCommand")) emit(file,call,"CHANNEL_WRITER_OWNERSHIP","All channel writes and retry receipts belong to channelCommand.");
        if(tableModule === "src/platform/database/schema" && ["services","cardholderCreationCommands"].includes(table.imported)) {
          const primaryOwner=name === "src/modules/services/service.ts" && chain[0] === "createCardholderService";
          const merchantOwner=table.imported === "services" && name === "src/modules/services/create-merchant.ts" && chain[0] === "createPrimaryMerchant";
          if(callee !== "insert" || !(primaryOwner || merchantOwner)) emit(file,call,"SERVICE_RESPONSIBILITY_OWNER","Services and primary responsibility are created only by their canonical enrollment command; no arbitrary reassignment writer.");
        }
        if(tableModule === "src/platform/database/schema" && table.imported === "serviceMembers") {
          const creation=callee === "insert" && ((name === "src/modules/services/service.ts" && chain[0] === "createCardholderService") || (name === "src/modules/services/create-merchant.ts" && chain[0] === "createPrimaryMerchant"));
          const access=name === "src/modules/access/service.ts" && ((callee === "insert" && ["decideInvitation","decideCardInvitation"].includes(chain[0])) || (callee === "update" && ["decideInvitation","decideCardInvitation","updateMemberAccess","revokeMemberAccess"].includes(chain[0])));
          if(!creation&&!access)emit(file,call,"SERVICE_MEMBERSHIP_OWNER","Membership comes from canonical primary enrollment or accepted service access lifecycle; merchant helpers use their assignments.");
        }
        if(tableModule === "src/modules/sandbox/schema" && !(name === "src/modules/sandbox/service.ts" && table.imported === "sandboxParticipants" && callee === "insert" && chain[0] === "startSandbox"))emit(file,call,"SANDBOX_ENROLLMENT_OWNER","Explicit sandbox participation is written only by startSandbox; login, reads and fixtures do not enroll provider members.");
        if(tableModule === "src/modules/cases/schema") {
          const customer=name === "src/modules/cases/service.ts" && ({supportCases:{insert:["createCase"],update:["updateCase"]},supportCaseMessages:{insert:["createCase","updateCase"]},supportCaseCommands:{insert:["execute"]}})[table.imported]?.[callee]?.includes(chain[0]);
          const operator=name === "src/modules/operations/service.ts" && chain[0] === "respondToCase" && ((table.imported === "supportCases" && callee === "update") || (table.imported === "supportCaseMessages" && callee === "insert"));
          if(!customer&&!operator)emit(file,call,"SUPPORT_WRITER_OWNERSHIP","Customer cases and explicit operator responses have finite owning commands; no separate financial authority is granted.");
        }
        if(tableModule === "src/modules/operations/schema" && !(name === "src/modules/operations/service.ts" && chain[0] === "respondToCase" && table.imported === "operatorCommands" && callee === "insert"))emit(file,call,"OPERATOR_WRITER_OWNERSHIP","Operator grants are explicit preparation only; the response owner may insert its immutable command receipt.");
        if(tableModule === "src/modules/services/schema" && table.imported === "merchantServiceCommands" && !(name === "src/modules/services/create-merchant.ts" && callee === "insert" && chain[0] === "createPrimaryMerchant")) emit(file,call,"MERCHANT_CREATION_OWNERSHIP","Merchant service creation receipts belong to the one canonical creation command.");
        if(tableModule === "src/modules/services/schema" && table.imported === "merchantSetupEligibility" && !(name === "src/modules/acquiring/fixtures.ts" && callee === "insert")) emit(file,call,"MERCHANT_PERSONA_OWNERSHIP","Fictional applicant eligibility is seeded explicitly and cannot be edited by an application command.");
        if (table && sourceModule(file, table.specifier) === "src/platform/database/schema" && Object.hasOwn(writerOwners, table.imported)) {
          counts.guardedWriters++;
          const allowedFixture = name === fixtureOwner && callee === "insert" && chain[0] === "seedWorkspaceService";
          const refundActivity = name === operationsOwner && table.imported === "serviceActivity" && callee === "insert" && chain[0] === "refundMerchantPayment";
          const allowedCommand = refundActivity || name === workspaceOwner && writerOwners[table.imported][callee]?.includes(chain[0]);
          if (!allowedFixture && !allowedCommand) emit(file, call, "WORKSPACE_WRITER_OWNERSHIP", `${table.imported}.${callee} is outside its permitted fixture or canonical command owner.`);
          if (allowedCommand) {
            const key = `${table.imported}.${callee}:${chain[0]}`;
            writerSites.set(key, [...(writerSites.get(key) ?? []), { file, call }]);
          }
        }
      }
      // Inspect executable SQL argument nodes, not comments, display strings or entire-file text.
      if (["execute", "query", "unsafe"].includes(callee)) {
        const argument = call.arguments[0];
        const expression = argument && ts.isTaggedTemplateExpression(argument) ? argument.template : argument;
        const sqlTexts = stringValues(file, expression);
        if (sqlTexts.some(value => /\b(?:from|join|into|update|table)\s+(?:"?\w+"?\.)?["']?(?:disputes|dispute_timeline|settlements|workspace_balance_snapshots)\b/i.test(value))) emit(file, call, "RETIRED_WORKSPACE_TABLE", "Retired illustrative and dispute tables cannot be read or recreated by runtime SQL.");
        if (sqlTexts.some(value => /\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?)\s+(?:"?\w+"?\.)?["']?(?:services|service_members|cardholder_creation_commands|workspace_balance_snapshots|service_activity|settlements|cards|card_requests|disputes|dispute_timeline|notification_preferences|workspace_command_receipts)\b/i.test(value))) emit(file, call, "RAW_WORKSPACE_WRITE", "Workspace record writes must use the inspected typed canonical writers; raw SQL writes bypass ownership checks.");
        if (sqlTexts.some(value => /\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?)\s+(?:"?\w+"?\.)?["']?(?:ledger_journals|ledger_entries|merchant_test_gateways|merchant_test_enrollments|merchant_channel_activations|merchant_test_payments|merchant_test_refunds|merchant_test_payouts|merchant_operation_commands|cardholder_topups|cardholder_funding_intents|cardholder_spending_limits|cardholder_limit_changes|card_spending_limits|card_limit_changes|card_checkout_attempts|merchant_settlements|merchant_settlement_items|merchant_deposits|merchant_deposit_items|merchant_deposit_events|prepaid_cutover)\b/i.test(value))) emit(file, call, "RAW_FINANCIAL_WRITE", "Ledger and operation writes must use their finite typed owners; migration SQL is reviewed separately.");
        if(sqlTexts.some(value=>/\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?)\s+(?:"?\w+"?\.)?["']?(?:money_\w+|merchant_settlement_credits|merchant_terminals|terminal_assignments|terminal_invitation_terms|merchant_disputes|merchant_dispute_messages|merchant_dispute_commands)\b/i.test(value)))emit(file,call,"RAW_MONEY_TERMINAL_WRITE","Money, terminal authority and dispute records must use their finite typed command owners.");
        if (sqlTexts.some(value => /\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?)\s+(?:"?\w+"?\.)?["']?(?:support_cases|support_case_messages|support_case_commands|operator_service_access|operator_command_receipts)\b/i.test(value))) emit(file, call, "RAW_SUPPORT_WRITE", "Support writes use their typed customer or assigned-operator command; raw SQL cannot grant support authority.");
        if(sqlTexts.some(value=>/\b(?:insert\s+into|update|delete\s+from|truncate(?:\s+table)?)\s+(?:"?\w+"?\.)?["']?merchant_guest_\w+/i.test(value)))emit(file,call,"RAW_GUEST_WRITE","Guest records use their typed owning commands, never raw SQL writes.");
      }
      if(bound?.imported === "createCardholderService" && sourceModule(file,bound.specifier)==="src/modules/services/service" && (name !== "src/app/api/v1/cardholder-services/route.ts" || chain[0] !== "POST")) emit(file,call,"PARALLEL_CARDHOLDER_CREATION_ROUTE","Cardholder enrollment uses its one explicit service entry route.");
      const merchantUnitRoutes={pauseMerchant:["pause","POST"],resumeMerchant:["resume","POST"]};
      if(bound && sourceModule(file,bound.specifier)===channelOwner.slice(0,-3) && Object.hasOwn(merchantUnitRoutes,bound.imported) && name.startsWith("src/app/api/")) {
        const [suffix,method]=merchantUnitRoutes[bound.imported];
        if(name!==`src/app/api/v1/merchants/[merchantId]/${suffix}/route.ts`||chain[0]!==method)emit(file,call,"PARALLEL_MERCHANT_UNIT_ROUTE","Submerchant creation and pause/resume use exact unit commands and routes.");
      }
      if(bound && sourceModule(file,bound.specifier)==="src/modules/operations/service" && ["getOperatorQueue","getOperatorCase","respondToCase"].includes(bound.imported) && name.startsWith("src/app/api/")) {
        const expected={getOperatorQueue:["src/app/api/v1/operations/cases/route.ts","GET"],getOperatorCase:["src/app/api/v1/operations/cases/[caseId]/route.ts","GET"],respondToCase:["src/app/api/v1/operations/cases/[caseId]/responses/route.ts","POST"]}[bound.imported];
        if(name!==expected[0]||chain[0]!==expected[1])emit(file,call,"PARALLEL_OPERATOR_ROUTE","Assigned support reads and responses use their exact canonical routes.");
      }
      if(bound && sourceModule(file,bound.specifier)===guestOwner.slice(0,-3)&&name.startsWith("src/app/api/")) {
        const prefix="src/app/api/v1/",publication="merchants/[merchantId]/channels/[channelId]/publication";
        const expected={ensureGuestSession:["guest/session/route.ts","POST"],getGuestPublicationManagement:[`${publication}/route.ts`,"GET"],publishGuestChannel:[`${publication}/route.ts`,"POST"],revokeGuestPublication:[`${publication}/[publicationId]/revoke/route.ts`,"POST"],getPublicGuestRequest:["guest/publications/[publicationId]/route.ts","GET"],getGuestOrder:["guest/orders/[orderId]/route.ts","GET"]}[bound.imported];
        const publishedQr=bound.imported==="getPublicGuestRequest"&&name===prefix+"guest/publications/[publicationId]/qr/route.ts"&&chain[0]==="GET";
        if(!publishedQr&&(!expected||name!==prefix+expected[0]||chain[0]!==expected[1]))emit(file,call,"PARALLEL_GUEST_ROUTE","Guest authority and order commands use exact reviewed HTTP routes and methods.");
      }
      if (bound && name.startsWith("src/app/") && (["purchaseCard", "simulateMerchantPayment", "createGuestOrder", "prepareGuestAttempt", "confirmGuestAttempt"].includes(bound.imported)) && [workspaceOwner, operationsOwner, guestOwner].some(owner => sourceModule(file, bound.specifier) === owner.slice(0, -3))) emit(file, call, "RETIRED_SIMULATOR_COMMAND", "Application routes and pages cannot invoke test-only purchase or guest outcome helpers.");
      if (bound?.imported === "prepareCardCheckout" && sourceModule(file,bound.specifier) === checkoutOwner.slice(0,-3) && name.startsWith("src/app/")) emit(file,call,"RETIRED_SIMULATOR_COMMAND","New internal card reviews are domain-fixture preparation only; customer payments use network checkout.");
      const directFunding = callee === "addCardholderFunds" || bound?.imported === "addCardholderFunds";
      if (directFunding && !(name === workspaceOwner && chain[0] === "confirmCardholderFunding")) emit(file, call, "FUNDING_CONFIRMATION_BOUNDARY", "Only confirmation of a saved funding intent may invoke the group-funding writer.");
      if(callee === "writeCardLimit" && !(name === workspaceOwner && ["setCardSpendingLimit","submitCardRequest"].includes(chain[0]))) emit(file,call,"CARD_ALLOWANCE_COMMAND_BOUNDARY","Only owner allowance changes and canonical issuance may set a card allowance.");
      if((callee==="addMoneyFunds"||bound?.imported==="addMoneyFunds")&&!(name===workspaceOwner&&chain[0]==="addCardholderFunds"))emit(file,call,"DIRECT_MONEY_FUNDING_BOUNDARY","Direct funding is a domain preparation primitive; customer funding must confirm a saved intent.");
      if(name===moneyOwner&&callee==="addFunds"&&!["addMoneyFunds","confirmMoneyFunding"].includes(chain[0]))emit(file,call,"MONEY_FUNDING_WRITER_BOUNDARY","Only saved funding confirmation or its explicit preparation wrapper calls the single funding writer.");
      if(bound?.imported==="attachServiceMoneyAccount"&&sourceModule(file,bound.specifier)===moneyOwner.slice(0,-3)&&!((name==="src/modules/services/service.ts"&&chain[0]==="createCardholderService")||(name==="src/modules/services/create-merchant.ts"&&chain[0]==="createPrimaryMerchant")))emit(file,call,"MONEY_ACCOUNT_ENROLLMENT_BOUNDARY","Money account attachment belongs only to canonical service enrollment.");
      if(bound?.imported==="initializeMerchantTerminal"&&sourceModule(file,bound.specifier)===channelOwner.slice(0,-3)&&!(name==="src/modules/services/create-merchant.ts"&&chain[0]==="createPrimaryMerchant"))emit(file,call,"TERMINAL_ENROLLMENT_BOUNDARY","The initial terminal is created only by canonical merchant enrollment.");
      const cardDebit = callee === "purchaseCardInTransaction" || bound?.imported === "purchaseCardInTransaction";
      if (cardDebit && !((name === workspaceOwner && chain[0] === "purchaseCard") || (name === checkoutOwner && chain[0] === "confirmCardCheckout" && sourceModule(file, bound?.specifier) === workspaceOwner.slice(0, -3)))) emit(file, call, "CONNECTED_CARD_DEBIT_BOUNDARY", "The card debit belongs only to connected checkout confirmation and its domain-test wrapper.");
      if (bound && name.startsWith("src/app/api/")) {
        const expected = connectedRoutes.find(([owner, , , command]) => sourceModule(file, bound.specifier) === owner.slice(0, -3) && command === bound.imported);
        if (expected) {
          if (name !== expected[1] || chain[0] !== expected[2]) emit(file, call, "PARALLEL_CONNECTED_ROUTE", "Funding and connected checkout commands use their exact review/read/confirmation route and method.");
          else connectedRouteStages.set(bound.imported, (connectedRouteStages.get(bound.imported) ?? 0) + 1);
        }
      }
      const importedCardCommand = bound && sourceModule(file, bound.specifier) === workspaceOwner.slice(0, -3) && [...cardRoutes.values()].some(([, command]) => command === bound.imported);
      if(bound?.imported === "createPrimaryMerchant" && sourceModule(file,bound.specifier)==="src/modules/services/create-merchant" && (name !== "src/app/api/v1/merchants/route.ts" || chain[0] !== "POST")) emit(file,call,"PARALLEL_MERCHANT_CREATION_ROUTE","Merchant creation must use its single service entry route.");
      if (importedCardCommand) {
        const expected = [...cardRoutes].find(([, [, command]]) => command === bound.imported);
        const expectedPath = `src/app/api/v1/cardholder-services/[serviceId]/${expected[0]}`;
        if (name !== expectedPath || chain[0] !== expected[1][0]) emit(file, call, "PARALLEL_CARD_COMMAND_ROUTE", "Saved card-request commands may be invoked only by their one canonical HTTP route.");
        else { counts.requestRouteCalls++; routeStages.set(bound.imported, (routeStages.get(bound.imported) ?? 0) + 1); }
      }
      const importedOperation = bound && sourceModule(file, bound.specifier) === operationsOwner.slice(0, -3) && [...operationRoutes.values()].some(([, command]) => command === bound.imported);
      if (importedOperation && name.startsWith("src/app/api/")) {
        const expected = [...operationRoutes].find(([, [, command]]) => command === bound.imported);
        if (name !== expected[0] || chain[0] !== expected[1][0]) emit(file, call, "PARALLEL_OPERATION_ROUTE", "Each Merchant operation has one exact route and HTTP method.");
        else { counts.operationRouteCalls++; operationStages.set(bound.imported, (operationStages.get(bound.imported) ?? 0) + 1); }
      }
      if(bound&&["recordMerchantNetworkPayment","recordMerchantNetworkRefund"].includes(bound.imported)&&sourceModule(file,bound.specifier)===operationsOwner.slice(0,-3)&&!(name===networkOwner&&chain[0]==="reconcileNetworkEvent"))emit(file,call,"NETWORK_EFFECT_BOUNDARY","Only verified provider event reconciliation calls the canonical network economic writer.");
      if (bound?.imported === "postJournal" && ["src/modules/ledger", "src/modules/ledger/index", "src/modules/ledger/service"].includes(sourceModule(file, bound.specifier))) {
        const allowed = (name === workspaceOwner && chain[0] === "purchaseCardInTransaction") || (name === operationsOwner && ["recordMerchantSandboxPayment", "refundMerchantPayment", "createMerchantSettlement", "processMerchantDeposit","recordMerchantNetworkPayment","prepareMerchantNetworkRefund","recordMerchantNetworkRefund"].includes(chain[0])) || (name===networkOwner&&chain[0]==="reconcileNetworkEvent") || (name===moneyOwner&&["addFunds","confirmMoneyWithdrawal","processMoneyWithdrawal"].includes(chain[0]));
        if (!allowed) emit(file, call, "LEDGER_POSTING_BOUNDARY", "Only the reviewed card and Merchant economic commands post journals.");
      }
      if (bound && sourceModule(file, bound.specifier) === "src/modules/issuing/sandbox-adapter" && !(name === workspaceOwner && chain[0] === "submitCardRequest" && bound.imported === "issueSandboxCard")) emit(file, call, "ISSUING_ADAPTER_BOUNDARY", "Only canonical request submission invokes the sandbox issuer.");
      if (bound && sourceModule(file, bound.specifier) === "src/modules/acquiring/adapters/sandbox") {
        const owner = { testPayment: "recordMerchantSandboxPayment", testRefund: "refundMerchantPayment" }[bound.imported];
        if (name !== operationsOwner || !owner || chain[0] !== owner) emit(file, call, "ACQUIRING_ADAPTER_BOUNDARY", "Only its canonical operation invokes each sandbox acquiring adapter.");
      }
      if(callee === "recordMerchantSandboxPayment" || bound?.imported === "recordMerchantSandboxPayment") {
        const allowed = name === checkoutOwner && chain[0] === "confirmCardCheckout" && sourceModule(file,bound?.specifier) === operationsOwner.slice(0,-3);
        if(!allowed)emit(file,call,"PAYMENT_PERSISTENCE_BOUNDARY","Only connected Cardholder checkout confirmation calls the sole payment persistence owner.");
      }
      if (!isUi) continue;
      const workspaceCall = bound?.imported === "workspaceCommand" && sourceModule(file, bound.specifier) === workspaceTransport.slice(0, -4);
      const merchantCall = bound?.imported === "merchantCommand" && sourceModule(file, bound.specifier) === workspaceTransport.slice(0, -4);
      const ownerWrapper = name === cardUiOwner && callee === "command";
      const localCommandCall = callee === "command";
      const fetchCall = callee === "fetch";
      const moneyCall = callee === "moneyRequest" && name === moneyUiOwner || bound?.imported === "moneyRequest" && sourceModule(file,bound.specifier) === moneyUiOwner.slice(0,-4);
      const networkCall=name===networkUiOwner&&callee==="request";
      const accessCall = bound?.imported === "accessFetch" && sourceModule(file,bound.specifier)==="src/ui/workspace/access-client";
      if (!workspaceCall && !merchantCall && !localCommandCall && !fetchCall && !accessCall && !moneyCall && !networkCall) continue;
      const target = call.arguments[workspaceCall || merchantCall ? 1 : 0];
      const paths = stringValues(file, target);
      const allowedGeneric = (name===networkUiOwner&&chain.join("/")==="NetworkCheckout/request"&&fetchCall) || (name === workspaceTransport && ["workspaceCommand", "merchantCommand"].includes(chain.join("/")) && fetchCall)
        || (name === cardUiOwner && chain.join("/") === "CardsWorkspace/command" && workspaceCall)
        || (name === "src/ui/workspace/merchant-entry.tsx" && chain.join("/") === "MerchantBusinessDetails/command" && merchantCall)
        || (name === "src/ui/workspace/merchant-channels.tsx" && chain.join("/") === "MerchantChannels/send" && merchantCall)
        || (name === "src/ui/workspace/merchant-people.tsx" && chain.join("/") === "MerchantPeople/send" && merchantCall)
        || (name === operationUiOwner && chain.join("/") === "MerchantOperations/send" && merchantCall)
        || (name === "src/ui/workspace/access-client.ts" && chain.join("/") === "accessFetch" && fetchCall)
        || (name === peopleUiOwner && chain.join("/") === "PeopleWorkspace/run" && accessCall)
        || (name === terminalPeopleUiOwner && chain.join("/") === "MerchantPeople/send" && fetchCall)
        || (name === moneyUiOwner && chain.join("/") === "moneyRequest" && fetchCall)
        || (name === disputeUiOwner && chain.join("/") === "command" && fetchCall)
        || (name === "src/ui/login-form.tsx" && chain.join("/") === "LoginForm/submit" && fetchCall);
      if (allowedGeneric) {
        if(name===networkUiOwner){
          if(!identifierIs(target,"path")||propertyValue(call.arguments[1],"body")?.getText(file.tree)!=="body===undefined?undefined:JSON.stringify(body)")emit(file,call,"NETWORK_TRANSPORT_REWRITE","Forward the exact reviewed checkout path and payload.");
        } else if (name === workspaceTransport) {
          const merchantTransport = chain.join("/") === "merchantCommand";
          const spans = target && ts.isTemplateExpression(target) ? target.templateSpans : [];
          const selector=spans[0]?.expression;
          const scopedMerchant=merchantTransport&&target&&ts.isTemplateExpression(target)&&target.head.text==="/api/v1/";
          const validSelector=selector&&ts.isConditionalExpression(selector)&&ts.isBinaryExpression(selector.condition)&&selector.condition.operatorToken.kind===ts.SyntaxKind.EqualsEqualsEqualsToken&&identifierIs(selector.condition.left,"scope")&&ts.isStringLiteral(selector.condition.right)&&selector.condition.right.text==="SERVICE"&&ts.isStringLiteral(selector.whenTrue)&&selector.whenTrue.text==="merchant-services"&&ts.isStringLiteral(selector.whenFalse)&&selector.whenFalse.text==="merchants";
          const offset=scopedMerchant?1:0;
          const service = spans[offset]?.expression;
          const validService = service && ts.isCallExpression(service) && identifierIs(service.expression, "encodeURIComponent") && identifierIs(service.arguments[0], merchantTransport ? "merchantId" : "serviceId");
          const validPath = spans[offset+1] && ts.isIdentifier(spans[offset+1].expression) && spans[offset+1].expression.text === "path";
          const options = call.arguments[1];
          const method = options && ts.isObjectLiteralExpression(options) ? options.properties.find(property => property.name?.getText(file.tree) === "method") : null;
          const forwardsMethod = method && ((ts.isShorthandPropertyAssignment(method) && method.name.text === "method") || (ts.isPropertyAssignment(method) && ts.isIdentifier(method.initializer) && method.initializer.text === "method"));
          const validPrefix=scopedMerchant?validSelector&&spans.length===3&&spans[0].literal.text==="/"&&spans.slice(1).every(span=>span.literal.text===""):target&&ts.isTemplateExpression(target)&&target.head.text===(merchantTransport?"/api/v1/merchants/":"/api/v1/cardholder-services/")&&spans.length===2&&spans.every(span=>span.literal.text==="");
          if (!validPrefix || !validService || !validPath || !forwardsMethod) emit(file, call, "WORKSPACE_TRANSPORT_REWRITE", "The shared transport must forward the encoded selected service or merchant, requested path and method unchanged.");
        } else if (name === cardUiOwner && (!identifierIs(call.arguments[1], "path") || !identifierIs(call.arguments[2], "method"))) emit(file, call, "CARD_COMMAND_FORWARDING", "The canonical card UI wrapper must forward the requested path and method to the shared transport.");
        else if (name === operationUiOwner) {
          const forward = (argument, field) => argument && ts.isPropertyAccessExpression(argument) && identifierIs(argument.expression, "command") && argument.name.text === field;
          const resource = call.arguments[0];
          const correctResource = merchantCall && resource && ts.isPropertyAccessExpression(resource) && identifierIs(resource.expression, "merchant") && resource.name.text === "id";
          if (!correctResource || !forward(call.arguments[1], "path") || !forward(call.arguments[2], "method") || !forward(call.arguments[3], "body")) emit(file, call, "OPERATION_COMMAND_FORWARDING", "Forward the exact reviewed attempt to its merchant transport without rewriting merchant identity, path, method or body.");
        }
        else if (name === "src/ui/workspace/merchant-entry.tsx" && (!identifierIs(call.arguments[1],"path") || !identifierIs(call.arguments[2],"method"))) emit(file,call,"MERCHANT_COMMAND_FORWARDING","The merchant setup wrapper must forward its statically inspected caller paths and methods to the shared transport.");
        else if (merchantCall && ["src/ui/workspace/merchant-channels.tsx", "src/ui/workspace/merchant-people.tsx"].includes(name)) {
          const forwarded = (argument, field) => argument && ts.isPropertyAccessExpression(argument) && identifierIs(argument.expression, "command") && argument.name.text === field;
          const methodValid = name.endsWith("merchant-people.tsx") ? stringValues(file, call.arguments[2]).every(value => value === "POST") : forwarded(call.arguments[2], "method");
          if (!forwarded(call.arguments[1], "path") || !methodValid || !forwarded(call.arguments[3], "body")) emit(file, call, "MERCHANT_COMMAND_FORWARDING", "The canonical merchant form must forward the reviewed saved attempt unchanged.");
        }
        else if(name === "src/ui/workspace/access-client.ts" && !identifierIs(call.arguments[0],"path"))emit(file,call,"ACCESS_TRANSPORT_REWRITE","The reviewed access transport must forward the validated finite access path.");
        else if(name === peopleUiOwner){
          if(call.arguments[0]?.getText(file.tree)!=="next.path"||stringValues(file,call.arguments[1]).join()!=="POST"||call.arguments[2]?.getText(file.tree)!=="next.body")emit(file,call,"ACCESS_TRANSPORT_REWRITE","Forward the exact saved access path and body using POST.");
        }
        else if([moneyUiOwner,disputeUiOwner,terminalPeopleUiOwner].includes(name)){
          const options=call.arguments[1],body=propertyValue(options,"body");
          const validPath=name===terminalPeopleUiOwner?target?.getText(file.tree)==="`/api/v1/merchants/${access.terminalId}${command.path}`":identifierIs(target,"path");
          const expectedBody=name===terminalPeopleUiOwner?"JSON.stringify(command.body)":"JSON.stringify(body)";
          if(!validPath||stringValues(file,propertyValue(options,"method")).join()!=="POST"||body?.getText(file.tree)!==expectedBody)emit(file,call,"REVIEWED_TRANSPORT_REWRITE","The reviewed transport must forward its exact inspected path, POST method and saved body unchanged.");
        }
        continue;
      }
      const options = fetchCall ? call.arguments[1] : null;
      const explicitMethod = options && ts.isObjectLiteralExpression(options) ? options.properties.find(property => property.name?.getText(file.tree) === "method") : null;
      const readOnly = fetchCall && (!options || (ts.isObjectLiteralExpression(options) && (!explicitMethod || (ts.isPropertyAssignment(explicitMethod) && stringValues(file,explicitMethod.initializer).every(value=>value==="GET")))));
      const reviewedQuery = readOnly && ((name === "src/ui/workspace/reports.tsx" && paths.every(value=>/^\/api\/v1\/cardholder-services\/:id\/reports(?:\/export)?\?/.test(value))) || (name === "src/ui/workspace/cases.tsx" && paths.every(value=>/^\/api\/v1\/(?:cardholder-services|merchants)\/:id\/cases\?/.test(value))) || (name === "src/ui/workspace/member-code-picker.tsx" && paths.every(value=>value === "/api/v1/sandbox/recipient?code=:id")));
      if (paths.some(value => value.includes("?")) && !reviewedQuery) emit(file, call, "UNINSPECTABLE_UI_COMMAND_PATH", "The UI command path must resolve to a reviewed route; add an explicit inspected adapter for dynamic routing.");
      for (const targetPath of paths) {
        if(moneyCall||/^\/api\/v1\/(?:money-accounts|operations\/money-withdrawals)\//.test(targetPath)&&!readOnly){
          const expected=/^\/api\/v1\/money-accounts\/:id\/(?:funding|withdrawals)\/intents$/.test(targetPath)?[moneyUiOwner,"MoneyAccountWorkspace/prepare"]:/^\/api\/v1\/money-accounts\/:id\/(?:funding|withdrawals)\/intents\/:id$/.test(targetPath)?[moneyUiOwner,"MoneyAccountWorkspace/confirm"]:targetPath==="/api/v1/operations/money-withdrawals/:id"?[withdrawalUiOwner,"WithdrawalRow/confirm"]:null;
          if(!moneyCall||!expected||name!==expected[0]||chain.join("/")!==expected[1])emit(file,call,"PARALLEL_MONEY_UI","Money funding, withdrawal and assigned outcomes use exact saved-review UI owners.");
          else moneyUiStages.set(targetPath,(moneyUiStages.get(targetPath)??0)+1);
        }
        if(/\/(?:disputes?|respond)(?:\/|$)/.test(targetPath)&&!readOnly){
          const expected=targetPath==="/api/v1/payments/:id/dispute"?"PayerDispute/send":["/api/v1/operations/disputes/:id","/api/v1/merchants/:id/disputes/:id/respond"].includes(targetPath)?"DisputeRecord/send":null;
          if(name!==disputeUiOwner||!localCommandCall||chain.join("/")!==expected)emit(file,call,"PARALLEL_DISPUTE_UI","Payer reports, terminal responses and operator reviews use their one finite dispute UI.");
          else disputeUiStages.set(targetPath,(disputeUiStages.get(targetPath)??0)+1);
        }
        if(targetPath.startsWith("/api/v1/guest/")&&(!readOnly||networkCall)){
          const validSession=name===networkUiOwner&&chain.join("/")==="NetworkCheckout/submit"&&targetPath==="/api/v1/guest/session";
          const validPayment=networkCall&&chain.join("/")==="NetworkCheckout/submit"&&["/api/v1/guest/publications/:id/payments","/api/v1/guest/publications/:id/payments/:id/process"].includes(targetPath);
          if(!validSession&&!validPayment)emit(file,call,"RETIRED_GUEST_SIMULATOR_UI","Guest payments use only the network checkout instruction and processing routes; outcome simulators remain retired.");
        }
        if(networkCall&&!/^\/api\/v1\/guest\/publications\/:id\/payments(?:\/:id\/process)?$/.test(targetPath))emit(file,call,"NETWORK_UI_ROUTE","The payment transport has only two exact mutation callers.");
        if(/^\/channels\/:id\/publication(?:\/:id\/revoke)?$/.test(targetPath)&&(!merchantCall||name!=="src/ui/workspace/merchant-channel-publication.tsx"||chain.join("/")!=="MerchantChannelPublication/send"||stringValues(file,call.arguments[2]).join()!=="POST"))emit(file,call,"PARALLEL_PUBLICATION_UI","Public link publication and revocation use the explicit reviewed channel controls.");
        if (/\/cards\/[^/]+\/purchase$/.test(targetPath)) {
          emit(file, call, "PARALLEL_CARD_PURCHASE_UI", "Customer purchases must use connected merchant checkout; direct card purchase simulators are retired.");
        }
        if (/(?:^|\/)(?:gateway|test-gateway|test-enrollment|payouts|settlements)$|\/channels\/[^/]+\/(?:activation|test-payments)$|\/payments\/[^/]+\/refund$/.test(targetPath)) {
          emit(file, call, "PARALLEL_OPERATION_UI", "Merchant operations use only their reviewed saved-attempt owner; the old test-payment checkout is retired.");
        }
        if (/^\/api\/v1\/checkout\//.test(targetPath) && !readOnly) {
          const valid = name === checkoutUiOwner && chain.join("/") === "CardCheckout/submit" && fetchCall && targetPath === "/api/v1/checkout/:id/card/:id" && stringValues(file, propertyValue(options, "method")).join() === "POST";
          if (!valid) emit(file, call, "PARALLEL_CONNECTED_CHECKOUT_UI", "Saved card payment confirmation has exactly one finite UI owner; new payments use the public network checkout.");
          else { connectedUiStages.set(targetPath, (connectedUiStages.get(targetPath) ?? 0) + 1); counts.purchaseUiCalls++; }
        }
        if (/(?:^|\/)funds(?:\/|$)|\/spending-limit$/.test(targetPath) && !readOnly) {
          const expected = fundingUiStages.get(targetPath);
          if (!expected || name !== expected[2] || chain.join("/") !== expected[0] || !workspaceCall || stringValues(file, call.arguments[2]).join() !== expected[1]) emit(file, call, "PARALLEL_FUNDING_UI", "Funding uses saved intent review and confirmation; per-card allowances use their single reviewed form.");
          else fundingStages.set(targetPath, (fundingStages.get(targetPath) ?? 0) + 1);
        }
        if (/^\/api\/v1\/operations\/deposits\//.test(targetPath) && !readOnly) {
          if (name !== depositUiOwner || chain.join("/") !== "DepositRow/submit" || !fetchCall || targetPath !== "/api/v1/operations/deposits/:id" || stringValues(file, propertyValue(options, "method")).join() !== "POST") emit(file, call, "PARALLEL_DEPOSIT_PROCESSING_UI", "Only the separately assigned deposit-processing UI records sandbox outcomes.");
          else depositUiCalls++;
        }
        if (!/(?:^|\/)card-requests(?:\/|$)/.test(targetPath)) continue;
        counts.requestUiCalls++;
        const stage = targetPath === "/card-requests" ? "start" : targetPath === "/card-requests/:id" ? "update" : targetPath === "/card-requests/:id/submit" ? "submit" : targetPath === "/card-requests/:id/cancel" ? "cancel" : null;
        const expectedChain = "CardRequestForm/execute";
        const method = stringValues(file, call.arguments[ownerWrapper ? 1 : 2]);
        const expectedMethod = stage === "update" ? "PATCH" : "POST";
        if (!stage || !ownerWrapper || chain.join("/") !== expectedChain || method.length !== 1 || method[0] !== expectedMethod) emit(file, call, "PARALLEL_CARD_REQUEST_UI", "Start, update, submit and cancel must use the one saved CardsWorkspace request component and canonical command routes.");
        else uiStages.set(stage, (uiStages.get(stage) ?? 0) + 1);
      }
    }
  }
  for (const [key, sites] of writerSites) if (sites.length > 1 && !(key === "cardRequests.update:submitCardRequest" && isBlockedOrIssuedBranch(sites))) emit(sites[1].file, sites[1].call, "DUPLICATE_CANONICAL_WRITER", `${key} has ${sites.length} write sites; only the explicit early-return BLOCKED/ISSUED request branches may have alternative sites.`);
  if (requirePresence) {
    const ui = [...files.values()].find(file => relative(file.filename) === cardUiOwner);
    const owner = [...files.values()].find(file => relative(file.filename) === workspaceOwner);
    if (!ui || !owner) throw new Error("The current workspace ownership guards require the canonical UI and service files.");
    const channelUi = [...files.values()].find(file => relative(file.filename) === channelUiOwner);
    const channelService = [...files.values()].find(file => relative(file.filename) === channelOwner);
    if (!channelUi || channelUi.declarations.filter(symbol => symbol === "MerchantChannels").length !== 1) emit(ui, null, "CHANNEL_FORM_OWNER_MISSING", "Expected one canonical MerchantChannels form.");
    for (const command of ["createChannel", "updateChannel", "cancelChannel", "channelCommand"]) if (!channelService || channelService.declarations.filter(symbol => symbol === command).length !== 1) emit(owner,null,"CHANNEL_COMMAND_CARDINALITY", `Expected exactly one ${command} owner.`);
    for (const name of ["CardsWorkspace", "CardRequestForm"]) if (ui.declarations.filter(symbol => symbol === name).length !== 1) emit(ui, null, "CARD_FORM_OWNER_MISSING", `Expected exactly one ${name} declaration in the canonical card UI.`);
    for (const route of ["/api/v1/checkout/:id/card/:id"]) if (connectedUiStages.get(route) !== 1) emit(ui, null, "CONNECTED_CHECKOUT_UI_CARDINALITY", `Expected exactly one connected checkout stage ${route}; found ${connectedUiStages.get(route) ?? 0}.`);
    for (const route of fundingUiStages.keys()) if (fundingStages.get(route) !== 1) emit(ui, null, "FUNDING_UI_CARDINALITY", `Expected exactly one funding/limit UI stage ${route}; found ${fundingStages.get(route) ?? 0}.`);
    for(const route of ["/api/v1/money-accounts/:id/funding/intents","/api/v1/money-accounts/:id/withdrawals/intents","/api/v1/money-accounts/:id/funding/intents/:id","/api/v1/money-accounts/:id/withdrawals/intents/:id","/api/v1/operations/money-withdrawals/:id"])if(moneyUiStages.get(route)!==1)emit(ui,null,"MONEY_UI_CARDINALITY",`Expected one money review/confirmation/outcome stage ${route}; found ${moneyUiStages.get(route)??0}.`);
    for(const route of ["/api/v1/payments/:id/dispute","/api/v1/operations/disputes/:id","/api/v1/merchants/:id/disputes/:id/respond"])if(disputeUiStages.get(route)!==1)emit(ui,null,"DISPUTE_UI_CARDINALITY",`Expected one dispute stage ${route}; found ${disputeUiStages.get(route)??0}.`);
    for(const file of [peopleUiOwner,terminalPeopleUiOwner])for(const suffix of (file===peopleUiOwner?["/invitations/:id/revoke","/people/:id/revoke"]:["/invitations","/invitations/:id/revoke","/people/:id/revoke"])){const key=`${file}:${suffix}`;if(accessUiStages.get(key)!==1)emit(ui,null,"ACCESS_UI_CARDINALITY",`Expected one reviewed access attempt ${key}; found ${accessUiStages.get(key)??0}.`);}
    if (depositUiCalls !== 1) emit(ui, null, "DEPOSIT_UI_CARDINALITY", `Expected one assigned deposit-processing UI; found ${depositUiCalls}.`);
    for (const [, , , command] of connectedRoutes) if (connectedRouteStages.get(command) !== 1) emit(owner, null, "CONNECTED_ROUTE_CARDINALITY", `Expected exactly one HTTP invocation of ${command}; found ${connectedRouteStages.get(command) ?? 0}.`);
    const connectedOwnerFile = [...files.values()].find(file => relative(file.filename) === checkoutOwner);
    for (const command of ["prepareCardCheckout", "getCardCheckoutReview", "confirmCardCheckout"]) if (connectedOwnerFile?.declarations.filter(symbol => symbol === command).length !== 1) emit(owner, null, "CHECKOUT_COMMAND_CARDINALITY", `Expected one ${command} owner.`);
    if (!writerSites.has("serviceActivity.insert:refundMerchantPayment")) emit(owner, null, "FINANCIAL_WRITER_MISSING", "The paired card-refund activity writer is absent from its canonical refund command.");
    for (const route of operationUiPaths.keys()) if (operationUiStages.get(route) !== 1) emit(ui, null, "OPERATION_UI_CARDINALITY", `Expected one reviewed operation UI route ${route}; found ${operationUiStages.get(route) ?? 0}.`);
    for (const stage of ["start", "update", "submit", "cancel"]) if (uiStages.get(stage) !== 1) emit(ui, null, "CARD_UI_STAGE_CARDINALITY", `Expected one canonical UI ${stage} command call; found ${uiStages.get(stage) ?? 0}.`);
    for (const [, command] of cardRoutes.values()) if (routeStages.get(command) !== 1) emit(owner, null, "CARD_ROUTE_CARDINALITY", `Expected one canonical HTTP invocation of ${command}; found ${routeStages.get(command) ?? 0}.`);
    for (const [, command] of operationRoutes.values()) if (operationStages.get(command) !== 1) emit(owner, null, "OPERATION_ROUTE_CARDINALITY", `Expected one canonical HTTP invocation of ${command}; found ${operationStages.get(command) ?? 0}.`);
    for (const command of canonicalCommands) if (owner.declarations.filter(symbol => symbol === command).length !== 1) emit(owner, null, "WORKSPACE_COMMAND_CARDINALITY", `Expected exactly one ${command} owner.`);
    for (const [table, operations] of Object.entries(writerOwners)) for (const [operation, owners] of Object.entries(operations)) for (const command of owners) {
      const key = `${table}.${operation}:${command}`;
      if (!writerSites.has(key)) emit(owner, null, "WORKSPACE_WRITER_MISSING", `The currently implemented ${key} writer is absent from the inspected owning command.`);
    }
    for (const definitions of [ledgerWriters, operationWriters, fundingWriters, checkoutWriters, settlementWriters, moneyWriters,disputeWriters,terminalWriters,terminalAccessWriters]) for (const [table, operations] of Object.entries(definitions)) for (const [operation, commands] of Object.entries(operations)) for (const command of commands) {
      const key = `${table}.${operation}:${command}`;
      if (!writerSites.has(key)) emit(owner, null, "FINANCIAL_WRITER_MISSING", `The implemented ${key} writer is absent from its canonical owner.`);
    }
  }
  return counts;
}

function selfTest() {
  const code = inspectSource("component.tsx", '"use client"; import type { DTO } from "@/modules/services/types"; export { gateway } from "./bridge"; import("@/platform/database");');
  assert.equal(code.client, true);
  assert.deepEqual(code.imports.map((entry) => entry.specifier), ["./bridge", "@/platform/database"]);
  assert.equal(isForbiddenClientDependency("pg"), true);
  assert.equal(isForbiddenClientDependency("./bridge", "/project/src/platform/database.ts"), true);
  assert.equal(isForbiddenClientDependency("react"), false);
  assert.equal(inspectSource("a.ts", '// import "pg";\nconst text = "import pg";').imports.length, 0);
  assert.equal(inspectSource("a.ts", "import(providerPath)").imports[0].specifier, null);
  const probe = (filename, source) => {
    const file = inspectSource(path.join(root, filename), source);
    const findings = [];
    inspectWorkspaceOwnership(new Map([[file.filename, file]]), (_file, _node, code) => findings.push(code), false);
    return findings;
  };
  assert.ok(probe("src/modules/other/service.ts", 'import {networkPaymentOperations} from "@/modules/acquiring/network-schema";function startNetworkCheckout(){tx.insert(networkPaymentOperations).values({});}').includes("NETWORK_WRITER_OWNERSHIP"));
  assert.ok(probe(networkOwner, 'import {networkEvents} from "./network-schema";function reconcileNetworkEvent(){tx.update(networkEvents).set({});}').includes("NETWORK_WRITER_OWNERSHIP"));
  assert.ok(probe("src/ui/second.tsx", '"use client"; function submit(){fetch("/api/v1/guest/session",{method:"POST"});}').includes("RETIRED_GUEST_SIMULATOR_UI"));
  assert.ok(probe("src/modules/other/service.ts", 'import {recordMerchantNetworkPayment} from "@/modules/acquiring/operations-service";function fake(){recordMerchantNetworkPayment(tx,payment,now);}').includes("NETWORK_EFFECT_BOUNDARY"));
  const moneyWrite='import {moneyTopups as receipts} from "@/modules/money/schema"; function addFunds(){tx.insert(receipts).values({});}';
  assert.deepEqual(probe(moneyOwner,moneyWrite),[]);
  assert.ok(probe(workspaceOwner,moneyWrite).includes("MONEY_WRITER_OWNERSHIP"));
  assert.ok(probe(moneyOwner,moneyWrite.replace("function addFunds","function other")).includes("MONEY_WRITER_OWNERSHIP"));
  assert.ok(probe(moneyOwner,moneyWrite.replace("tx.insert","tx.update")).includes("MONEY_WRITER_OWNERSHIP"));
  assert.ok(probe(moneyOwner,'function unsafe(){tx.execute(sql`UPDATE money_accounts SET service_kind=MERCHANT`);}').includes("RAW_MONEY_TERMINAL_WRITE"));
  assert.ok(probe(disputeOwner,'import {postJournal} from "../ledger/service";function resolveMerchantDispute(){postJournal(tx,input);}').includes("LEDGER_POSTING_BOUNDARY"));
  assert.ok(probe(terminalAccessOwner,'import {terminalAssignments} from "./schema";function createMerchantInvitation(){tx.insert(terminalAssignments).values({});}').includes("TERMINAL_ACCESS_WRITER_OWNERSHIP"));
  const moneyRoute='import {confirmMoneyFunding} from "@/modules/money/service";export function POST(){return confirmMoneyFunding();}';
  assert.deepEqual(probe("src/app/api/v1/money-accounts/[moneyAccountId]/funding/intents/[intentId]/route.ts",moneyRoute),[]);
  assert.ok(probe("src/app/api/v1/money-accounts/[moneyAccountId]/direct/route.ts",moneyRoute).includes("PARALLEL_CONNECTED_ROUTE"));
  const moneyTransport='"use client";function moneyRequest(path,body){return fetch(path,{method:"POST",body:JSON.stringify(body)});}';
  assert.deepEqual(probe(moneyUiOwner,moneyTransport),[]);
  assert.ok(probe(moneyUiOwner,moneyTransport.replace('method:"POST"','method:"PUT"')).includes("REVIEWED_TRANSPORT_REWRITE"));
  const canonicalUi = `"use client";
    function CardsWorkspace() { return <CardRequestForm/>; }
    function CardRequestForm() {
      async function execute(attempt) {
        await command("/card-requests", "POST");
        await command(\`/card-requests/\${encodeURIComponent(attempt.request.id)}\`, "PATCH");
        const action = attempt.kind === "submit" ? "submit" : "cancel";
        await command(\`/card-requests/\${encodeURIComponent(attempt.request.id)}/\${action}\`, "POST");
      }
    }`;
  assert.deepEqual(probe(cardUiOwner, canonicalUi), []);
  assert.ok(probe("src/ui/second-card-flow.tsx", canonicalUi).includes("PARALLEL_CARD_REQUEST_UI"), "A copied, mutated second Add card workflow must be rejected.");
  assert.ok(probe(cardUiOwner, canonicalUi + '\nfunction SecondForm() { return <CardRequestForm/>; }').includes("PARALLEL_CARD_FORM"));
  assert.ok(probe(cardUiOwner, canonicalUi + '\nfunction bypass() { fetch("/api/v1/cardholder-services/x/card-requests", {method:"POST"}); }').includes("PARALLEL_CARD_REQUEST_UI"));
  assert.ok(probe(cardUiOwner, canonicalUi.replace('const action = attempt.kind === "submit" ? "submit" : "cancel";', 'const action = attempt.kind;')).includes("UNINSPECTABLE_UI_COMMAND_PATH"), "Unbounded request actions must not pass the canonical form guard.");
  assert.ok(probe(cardUiOwner, canonicalUi.replace('async function execute(attempt)', 'async function secondRequestEngine(attempt)')).includes("PARALLEL_CARD_REQUEST_UI"), "All request stages belong to the one explicit attempt executor.");
  assert.deepEqual(probe("src/ui/workspace/member-code-picker.tsx", '"use client"; function find(code) { fetch(`/api/v1/sandbox/recipient?code=${encodeURIComponent(code)}`,{cache:"no-store"}); }'), []);
  assert.ok(probe("src/ui/workspace/member-code-picker.tsx", '"use client"; function find(code) { fetch(`/api/v1/sandbox/recipient?code=${encodeURIComponent(code)}`,{method:"POST"}); }').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.ok(probe("src/modules/other/service.ts", 'import {sandboxParticipants} from "@/modules/sandbox/schema"; function grant(){tx.insert(sandboxParticipants).values({});}').includes("SANDBOX_ENROLLMENT_OWNER"));
  assert.ok(probe("src/ui/second.tsx", '"use client"; function x(url:string) { fetch(url,{method:"POST"}); }').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.deepEqual(probe("src/ui/workspace/reports.tsx", '"use client"; function report(id,query) { fetch(`/api/v1/cardholder-services/${encodeURIComponent(id)}/reports?${query}`,{cache:"no-store"}); }'), []);
  assert.ok(probe("src/ui/workspace/reports.tsx", '"use client"; function report(id,query) { fetch(`/api/v1/cardholder-services/${encodeURIComponent(id)}/reports?${query}`,{method:"POST"}); }').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.ok(probe("src/ui/workspace/reports.tsx", '"use client"; function report(id,path) { fetch(`/api/v1/cardholder-services/${encodeURIComponent(id)}/${path}`,{method:"GET"}); }').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.deepEqual(probe("src/ui/workspace/merchant-entry.tsx", '"use client"; function reload(id){fetch(`/api/v1/merchants/${encodeURIComponent(id)}/business-details`,{cache:"no-store"});}'),[]);
  assert.ok(probe("src/ui/workspace/merchant-entry.tsx", '"use client"; function reload(id,query){fetch(`/api/v1/cardholder-services/${encodeURIComponent(id)}/acquiring?${query}`,{method:"POST"});}').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.ok(probe("src/ui/workspace/merchant-entry.tsx", '"use client"; import {merchantCommand} from "./primitives"; function MerchantBusinessDetails(){function command(path,method){return merchantCommand(id,"/bypass",method,{});}}').includes("MERCHANT_COMMAND_FORWARDING"));
  assert.ok(probe(workspaceTransport, '"use client"; function workspaceCommand(serviceId,path,method) { return fetch(`/api/v1/cardholder-services/${encodeURIComponent(serviceId)}/legacy-create`,{method}); }').includes("WORKSPACE_TRANSPORT_REWRITE"));
  assert.ok(probe(cardUiOwner, '"use client"; import {workspaceCommand} from "./primitives"; function CardsWorkspace() { function command(path,method) { return workspaceCommand(id,"/legacy-create",method,{}); } }').includes("CARD_COMMAND_FORWARDING"));
  assert.deepEqual(probe("src/ui/comment.tsx", '"use client"; // tx.update(workspaceBalances);\nconst description="/card-requests";'), []);
  const writerImport = 'import {cardRequests as drafts} from "@/platform/database/schema";';
  assert.ok(probe("src/modules/other/service.ts", 'import {services} from "@/platform/database/schema"; function bypass(){tx.update(services).set({primaryPersonId:"other"});}').includes("SERVICE_RESPONSIBILITY_OWNER"));
  const validWriter = writerImport + 'export async function startCardRequest() { await tx.insert(drafts).values({}); }';
  assert.deepEqual(probe(workspaceOwner, validWriter), []);
  assert.ok(probe(workspaceOwner, validWriter.replace('await tx.insert(drafts).values({});', 'await tx.insert(drafts).values({}); await tx.insert(drafts).values({});')).includes("DUPLICATE_CANONICAL_WRITER"), "A duplicate write inserted into the actual canonical owner shape must be rejected.");
  assert.ok(probe("src/modules/other/service.ts", validWriter).includes("WORKSPACE_WRITER_OWNERSHIP"));
  assert.ok(probe("src/app/api/alternate/route.ts", 'import {workspaceBalances as balances} from "@/platform/database/schema"; function POST() { const copy=balances; return tx.update(copy).set({amountMinor:42n}); }').includes("WORKSPACE_WRITER_OWNERSHIP"));
  assert.ok(probe("src/modules/provider/adapters/mock.ts", 'import * as schema from "@/platform/database/schema"; function post() { tx.insert(schema.settlements).values({}); }').includes("WORKSPACE_WRITER_OWNERSHIP"));
  assert.ok(probe("src/modules/provider/adapters/mock.ts", 'import * as schema from "../../../platform/database/schema"; function post() { const {settlements:rows}=schema; tx.insert(rows).values({}); }').includes("WORKSPACE_WRITER_OWNERSHIP"));
  assert.ok(probe(workspaceOwner, 'async function sideDoor() { await tx.execute(sql`UPDATE "public"."workspace_balance_snapshots" SET "amountMinor"=5`); }').includes("RAW_WORKSPACE_WRITE"));
  const route = 'import {startCardRequest as begin} from "@/modules/workspace/service"; export async function POST() { return begin(); }';
  assert.deepEqual(probe("src/app/api/v1/cardholder-services/[serviceId]/card-requests/route.ts", route), []);
  assert.ok(probe("src/app/api/v1/cardholder-services/[serviceId]/legacy-create/route.ts", route).includes("PARALLEL_CARD_COMMAND_ROUTE"));
  assert.ok(probe("src/app/api/v1/cardholder-services/[serviceId]/cards/create/route.ts", 'export const POST=()=>new Response("created");').includes("PARALLEL_CARD_MUTATION_ROUTE"));
  assert.ok(probe("src/app/api/seed/route.ts", 'import {seedWorkspaceService} from "@/modules/workspace/fixtures";').includes("FIXTURE_RUNTIME_IMPORT"));
  assert.ok(probe("src/modules/other/service.ts", 'import {merchantProfiles} from "@/modules/acquiring/schema"; function bypass(){tx.insert(merchantProfiles).values({});}').includes("ACQUIRING_WRITER_OWNERSHIP"));
  assert.deepEqual(probe("src/modules/acquiring/service.ts", 'import {merchantProfiles} from "./schema"; function setup(){tx.insert(merchantProfiles).values({});}'),[]);
  assert.ok(probe("src/app/api/approve/route.ts", 'import {seedAcquiringFixtures} from "@/modules/acquiring/fixtures";').includes("FIXTURE_RUNTIME_IMPORT"));
  assert.ok(probe("src/modules/services/create-merchant.ts", 'import {merchantSetupEligibility as eligibility} from "./schema"; function bypass(){tx.update(eligibility).set({personaKind:"FICTIONAL_ADULT"});}').includes("MERCHANT_PERSONA_OWNERSHIP"));
  const merchantRoute='import {createPrimaryMerchant as begin} from "@/modules/services/create-merchant"; export async function POST(){return begin();}';
  const reviewedSetup='function MerchantOperations(){async function send(command){await send(command.next);}function confirm(){send({path:"/gateway",method:"PUT",next:{kind:"enrollment",path:"/test-enrollment",method:"PUT",body:{commandId:crypto.randomUUID(),expectedVersion:operations.enrollment.version,enabled:true},setup:true}});}}';
  assert.deepEqual(probe(operationUiOwner,reviewedSetup),[]);
  assert.ok(probe(operationUiOwner,reviewedSetup.replace('path:"/test-enrollment"','path:"/payouts"')).includes("OPERATION_SETUP_CONTINUATION"));
  assert.ok(probe(operationUiOwner,reviewedSetup.replace('enabled:true','enabled:false')).includes("OPERATION_SETUP_CONTINUATION"));
  assert.ok(probe(operationUiOwner,reviewedSetup.replace('await send(command.next)','await send({...command.next})')).includes("OPERATION_UI_ROUTE"));
  assert.ok(probe(operationUiOwner,'function MerchantOperations(){function send(command){send(command.next);}}').includes("OPERATION_ATTEMPT_SOURCE"));
  assert.deepEqual(probe("src/app/api/v1/merchants/route.ts",merchantRoute),[]);
  assert.ok(probe("src/app/api/quick-sell/route.ts",merchantRoute).includes("PARALLEL_MERCHANT_CREATION_ROUTE"));
  assert.deepEqual(probe(workspaceTransport, '"use client"; function merchantCommand(merchantId,path,method) { return fetch(`/api/v1/merchants/${encodeURIComponent(merchantId)}${path}`,{method}); }'),[]);
  assert.ok(probe(workspaceTransport, '"use client"; function merchantCommand(merchantId,path,method) { return fetch(`/api/v1/merchants/${encodeURIComponent(otherMerchant)}${path}`,{method}); }').includes("WORKSPACE_TRANSPORT_REWRITE"));
  const scopedMerchantTransport='"use client"; function merchantCommand(merchantId,path,method,body,scope="TERMINAL") { return fetch(`/api/v1/${scope==="SERVICE"?"merchant-services":"merchants"}/${encodeURIComponent(merchantId)}${path}`,{method}); }';
  assert.deepEqual(probe(workspaceTransport,scopedMerchantTransport),[]);
  for(const [before,after] of [['"merchant-services"','"other-service"'],['"merchants"','"other-terminal"'],['scope===','arbitraryScope==='],['encodeURIComponent(merchantId)','encodeURIComponent(otherMerchant)'],['encodeURIComponent(merchantId)','merchantId'],['${path}','/bypass']])assert.ok(probe(workspaceTransport,scopedMerchantTransport.replace(before,after)).includes("WORKSPACE_TRANSPORT_REWRITE"));
  assert.ok(probe("src/ui/workspace/merchant-channels.tsx", '"use client"; import {merchantCommand} from "./primitives"; function MerchantChannels(){function send(command){return merchantCommand(id,"/bypass",command.method,command.body);}}').includes("MERCHANT_COMMAND_FORWARDING"));
  assert.ok(probe("src/ui/qr-channel.tsx", '"use client"; export function MerchantChannels(){return <form/>;}').includes("DUPLICATE_CHANNEL_FORM"));
  assert.ok(probe(channelOwner, 'import {paymentChannels} from "./schema"; function anotherCommand(){tx.update(paymentChannels).set({});}').includes("CHANNEL_WRITER_OWNERSHIP"));
  assert.deepEqual(probe(channelOwner, 'import {paymentChannels} from "./schema"; function channelCommand(){tx.update(paymentChannels).set({});}'),[]);
  assert.ok(probe("src/ui/workspace/merchant-directory.tsx", '"use client"; function reload(source){const query=source ? `?serviceId=${encodeURIComponent(source.id)}` : "";fetch(`/api/v1/merchants${query}`,{cache:"no-store"});}').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.ok(probe("src/ui/workspace/merchant-directory.tsx", '"use client"; function reload(query){fetch(`/api/v1/merchants?${query}`,{method:"POST"});}').includes("UNINSPECTABLE_UI_COMMAND_PATH"));
  assert.ok(probe("src/ui/other-checkout.tsx", '"use client"; function pay(){fetch("/api/v1/checkout/x/card",{method:"POST"});}').includes("PARALLEL_CONNECTED_CHECKOUT_UI"));
  assert.ok(probe(cardUiOwner, 'function CardPurchaseForm(){return <form/>;}').includes("RETIRED_SIMULATOR_UI"));
  assert.ok(probe("src/ui/guest-checkout.tsx", '"use client"; function submit(){fetch("/api/v1/guest/orders/x/attempts",{method:"POST"});}').includes("RETIRED_GUEST_SIMULATOR_UI"));
  assert.ok(probe("src/app/api/v1/cardholder-services/[serviceId]/funds/top-ups/route.ts", 'export async function POST(){}').includes("RETIRED_SIMULATOR_ROUTE"));
  assert.ok(probe("src/modules/other/service.ts", 'import {cardholderTopups} from "@/modules/workspace/funding-schema"; function bypass(){tx.insert(cardholderTopups).values({});}').includes("FUNDING_WRITER_OWNERSHIP"));
  assert.ok(probe(workspaceOwner, 'import {postJournal} from "@/modules/ledger"; function submitCardRequest(){postJournal({});}').includes("LEDGER_POSTING_BOUNDARY"), "Issuing a card cannot create money.");
  assert.ok(probe(workspaceOwner, 'function sideDoor(){writeCardLimit();}').includes("CARD_ALLOWANCE_COMMAND_BOUNDARY"));
  assert.ok(probe("src/modules/other/service.ts", 'import {cardSpendingLimits} from "@/modules/workspace/funding-schema"; function bypass(){tx.insert(cardSpendingLimits).values({});}').includes("FUNDING_WRITER_OWNERSHIP"));
  assert.deepEqual(probe(cardLimitUiOwner, '"use client"; import {workspaceCommand} from "./primitives"; function CardLimitControl(){function save(){workspaceCommand(id,`/cards/${input.cardId}/spending-limit`,"PUT",{});}}'), []);
  assert.ok(probe("src/app/api/add-money/route.ts", 'import {addCardholderFunds} from "@/modules/workspace/service"; function POST(){addCardholderFunds();}').includes("FUNDING_CONFIRMATION_BOUNDARY"));
  assert.ok(probe("src/app/api/v1/checkout/[publicationId]/card/route.ts", 'export async function POST(){}').includes("RETIRED_SIMULATOR_ROUTE"));
  assert.ok(probe(checkoutUiOwner, '"use client"; function CardCheckout(){async function submit(){fetch(`/api/v1/checkout/${publication.id}/card`,{method:"POST"});}}').includes("PARALLEL_CONNECTED_CHECKOUT_UI"));
  assert.ok(probe("src/modules/other/service.ts", 'import {cardCheckoutAttempts} from "@/modules/acquiring/card-checkout-schema"; function bypass(){tx.insert(cardCheckoutAttempts).values({});}').includes("CHECKOUT_WRITER_OWNERSHIP"));
  assert.ok(probe("src/modules/other/service.ts", 'import {merchantDeposits} from "@/modules/acquiring/settlement-schema"; function bypass(){tx.insert(merchantDeposits).values({});}').includes("SETTLEMENT_WRITER_OWNERSHIP"));
  assert.ok(probe("src/modules/other/service.ts", 'import {purchaseCardInTransaction} from "@/modules/workspace/service"; function pay(){purchaseCardInTransaction();}').includes("CONNECTED_CARD_DEBIT_BOUNDARY"));
  assert.deepEqual(probe(checkoutUiOwner, '"use client"; function CardCheckout(){async function submit(){fetch(`/api/v1/checkout/${review.publicationId}/card/${review.id}`,{method:"POST"});}}'), []);
  assert.ok(probe(fundingUiOwner, '"use client"; import {workspaceCommand} from "./workspace/primitives"; function CardholderFundsWorkspace(){function prepare(){workspaceCommand(id,"/funds/intents","POST",{});}}').includes("PARALLEL_FUNDING_UI"));
  assert.deepEqual(probe(fundingUiOwner, '"use client"; import {workspaceCommand} from "./workspace/primitives"; function CardholderFundsWorkspace(){function confirm(){workspaceCommand(id,`/funds/intents/${intent.id}`,"POST",{});}}'), []);
  assert.ok(probe("src/modules/acquiring/operations-service.ts", 'function legacy(){return {previewHref:`/pay/${row.id}`};}').includes("RETIRED_CHANNEL_CHECKOUT_LINK"));
  assert.ok(probe("src/modules/acquiring/operations-service.ts", 'export function getMerchantCheckout(){}').includes("RETIRED_CHANNEL_CHECKOUT_OWNER"));
  console.log("Architecture detector self-tests passed (dependency boundaries, finite template routes, aliased imports, duplicate Add card flow/writer mutations, raw SQL, fixture and API ownership).");
}

/** Pure detector entry point for mutation probes; it never scans or changes the repository. */
export function inspectArchitectureSource(filename, source) {
  const file = inspectSource(path.join(root, filename), source);
  const findings = [];
  inspectWorkspaceOwnership(new Map([[file.filename, file]]), (_file, _node, code) => findings.push(code), false);
  return findings;
}

const runningAsCommand = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (runningAsCommand) selfTest();
if (runningAsCommand && !process.argv.includes("--self-test")) {
  const filenames = await walk(path.join(root, "src"));
  const files = new Map(await Promise.all(filenames.map(async (filename) => [filename, inspectSource(filename, await fs.readFile(filename, "utf8"))])));
  function resolveImport(from, specifier) {
    const stem = specifier.startsWith("@/") ? path.join(root, "src", specifier.slice(2)) : specifier.startsWith(".") ? path.resolve(path.dirname(from), specifier) : null;
    if (!stem) return null;
    const withoutExtension = stem.replace(/\.(?:js|mjs|cjs)$/, "");
    return [stem, ...[".ts", ".tsx", ".js", ".jsx", ".mjs"].map((ext) => withoutExtension + ext), ...[".ts", ".tsx", ".js"].map((ext) => path.join(stem, "index" + ext))].find((candidate) => files.has(candidate)) ?? null;
  }
  const clientRoots = [...files.values()].filter((file) => file.client || relative(file.filename).startsWith("src/ui/"));
  const visited = new Set();
  function inspectClient(file) {
    if (visited.has(file.filename)) return;
    visited.add(file.filename);
    for (const dependency of file.imports) {
      if (!dependency.specifier) {
        report(file, dependency.node, "CLIENT_DYNAMIC_IMPORT", "Client code cannot select an uninspectable module at runtime.");
        continue;
      }
      const resolved = resolveImport(file.filename, dependency.specifier);
      if (isForbiddenClientDependency(dependency.specifier, resolved)) {
        report(file, dependency.node, "CLIENT_SERVER_DEPENDENCY", "Client code must consume API projections and commands; server modules and providers are forbidden.");
      } else if (resolved) inspectClient(files.get(resolved));
      else if (/^(?:@\/|\.)/.test(dependency.specifier) && !/\.(?:css|svg|png|jpg|woff2?)$/.test(dependency.specifier)) {
        report(file, dependency.node, "UNRESOLVED_CLIENT_DEPENDENCY", "A local client dependency could not be inspected.");
      }
    }
    for (const call of file.calls) {
      if (/\b(?:postJournal|postLedger|issueCard|evaluatePolicy|authorizeService)\b/.test(call.expression.getText(file.tree))) {
        report(file, call, "CLIENT_BUSINESS_COMMAND", "Client code must invoke the HTTP command, not an owning-module writer or policy evaluator.");
      }
    }
  }
  clientRoots.forEach(inspectClient);

  const routes = [];
  let providerImports = 0;
  for (const file of files.values()) {
    const name = relative(file.filename);
    const adapter = /\/adapters\//.test(name);
    for (const dependency of file.imports) {
      if (dependency.specifier === "@netlify/identity" || dependency.specifier?.startsWith("@netlify/identity/")) {
        providerImports++;
        if (!adapter) report(file, dependency.node, "IDENTITY_PROVIDER_BOUNDARY", "Only an Identity adapter may import the provider SDK at runtime.");
      }
      if (/^(?:gotrue-js|netlify-identity-widget)(?:\/|$)/.test(dependency.specifier ?? "")) {
        report(file, dependency.node, "LEGACY_IDENTITY_SDK", "Application source must use the reviewed @netlify/identity adapter.");
      }
    }
    if (!adapter) {
      for (const call of file.calls) {
        if (/(?:^|\.)(?:fetch|fetcher|request|post|get)$/.test(call.expression.getText(file.tree)) && (call.arguments[0]?.getText(file.tree).includes("/.netlify/identity") || file.text.includes("/.netlify/identity"))) {
          report(file, call, "IDENTITY_NETWORK_BOUNDARY", "Identity HTTP requests belong only in the provider adapter.");
        }
      }
    }
    if (/^src\/app\/api\/.*\/route\.[tj]s$/.test(name)) {
      routes.push(file);
      const contextImports = file.imports.filter(({ specifier }) => specifier && /(?:platform\/http|platform\/.*context)/.test(specifier));
      const wrappers = contextImports.flatMap(({ node }) => ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)
        ? node.importClause.namedBindings.elements.filter((entry) => (entry.propertyName?.text ?? entry.name.text) === "apiRoute").map((entry) => entry.name.text) : []);
      if (!file.calls.some((call) => ts.isIdentifier(call.expression) && wrappers.includes(call.expression.text))) {
        report(file, null, "ROUTE_CONTEXT_REQUIRED", "API routes must invoke the imported shared apiRoute wrapper.");
      }
      for (const dependency of file.imports) {
        if (/(?:@netlify\/|^pg$|drizzle-orm|\/adapters\/|platform\/(?:database|db)(?:\/|$))/.test(dependency.specifier ?? "")) {
          report(file, dependency.node, "ROUTE_IO_BOUNDARY", "Route handlers must invoke shared services rather than database/provider IO.");
        }
      }
    }
  }
  const policy = files.get(path.join(root, "src/modules/policy/evaluate.ts"));
  if (!policy?.declarations.includes("evaluate")) errors.push("src/modules/policy/evaluate.ts:1 POLICY_SCOPE_MISSING: The canonical M0 evaluator is absent.");
  const servicePolicyConsumers = [...files.values()].filter((file) => relative(file.filename).startsWith("src/modules/services/") && file.imports.some(({ specifier }) => specifier && resolveImport(file.filename, specifier) === policy?.filename) && file.calls.some((call) => ts.isIdentifier(call.expression) && call.expression.text === "evaluate"));
  if (!servicePolicyConsumers.length) errors.push("src/modules/services:1 POLICY_CONSUMER_MISSING: No service service invokes the canonical policy evaluator.");
  if (!clientRoots.length) errors.push("src/ui:1 CLIENT_SCOPE_MISSING: No client/UI modules were available to inspect.");
  if (!routes.length) errors.push("src/app/api:1 ROUTE_SCOPE_MISSING: No implemented API routes were available to inspect.");
  if (!providerImports) errors.push("src/modules/identity:1 PROVIDER_SCOPE_MISSING: No actual Identity SDK adapter import was found.");

  const workspaceScope = inspectWorkspaceOwnership(files, report);
  console.log(`Architecture source scope: ${files.size} files, ${clientRoots.length} UI/client roots, ${visited.size} client dependency files, ${routes.length} API routes, ${providerImports} Identity SDK import(s), ${servicePolicyConsumers.length} service policy consumer(s).`);
  console.log(`Local ownership scope: ${workspaceScope.requestUiCalls} saved-request UI stages, ${workspaceScope.purchaseUiCalls} connected purchase UI stages, ${workspaceScope.requestRouteCalls} canonical card routes, ${workspaceScope.operationRouteCalls} Merchant operation routes, ${workspaceScope.guardedWriters} typed fixture/command write sites.`);
  console.log("Guards cover canonical card/channel/operation forms and routes, the sole ledger posting owner, finite typed writers, sandbox adapter boundaries and protected snapshots. They do not certify runtime authorization, retry behavior, financial correctness or production readiness; database and browser tests remain required.");
  if (errors.length) {
    errors.forEach((error) => console.error(error));
    process.exitCode = 1;
  } else console.log("Dependency and local workspace source ownership checks passed.");
}
