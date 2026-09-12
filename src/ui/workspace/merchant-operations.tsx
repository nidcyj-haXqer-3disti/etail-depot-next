"use client";
import {merchantOperationsProjectionSchema,activationProjectionSchema,merchantTestPaymentProjectionSchema,merchantSettlementReceiptSchema,testGatewayProjectionSchema,testEnrollmentProjectionSchema} from "@/shared/merchant-operation-response";

import {useServerProjection} from "./use-server-projection";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {merchantActivityReturn,merchantRecordHref} from "@/shared/merchant-activity";
import { useEffect, useState } from "react";
import {useMerchantNavigationLock} from "./merchant-navigation-state";
import type { MerchantWorkspaceProjection } from "@/modules/acquiring/contracts";
import type { ChannelActivation, MerchantOperationsProjection, MerchantTestPayment, MerchantTestPayout, MerchantSettlementReceipt, TestGateway, TestMerchantEnrollment } from "@/modules/acquiring/operations-contracts";
import { Button, EmptyState, Feedback, StatusBadge, WorkspaceCommandError, WorkspaceDialog, formatDate, formatMoney, merchantCommand } from "./primitives";
import "./merchant-operations.css";

type Notice = { kind: "success" | "error" | "info"; message: string };
type EnrollmentContinuation = { path: "/test-enrollment"; method: "PUT"; body: { commandId: string; expectedVersion: number; enabled: true }; kind: "enrollment"; setup: true };
type Attempt = { next?: EnrollmentContinuation; setup?: boolean; path: string; method: "POST" | "PUT"; body: Record<string, unknown>; kind: "gateway" | "enrollment" | "activation" | "refund" | "payout" | "reconcile" };
type Choice = { kind: "setup" } | { kind: "gateway" | "enrollment"; enabled: boolean } | { kind: "activation"; channelId: string; active: boolean; expectedChannelVersion: number } | { kind: "payment"; payment: MerchantTestPayment } | { kind: "refund"; payment: MerchantTestPayment } | { kind: "payout";retry?:MerchantTestPayout };
function depositDateTime(iso:string){const date=new Date(iso);return Number.isNaN(date.getTime())?"Date unavailable":`${formatDate(iso)} · ${date.toISOString().slice(11,19)} UTC`;}
function failure(error: unknown): string {
  const messages: Record<string, string> = {
    DEPOSIT_REVIEW_CHANGED:"New payments or refunds changed the amount ready to move. Reload payments and review the updated amount.",
    REFUND_RETURNED:"The refund could not be completed and its reserved money was returned. Reload this payment before reviewing a new refund.",
    REFUND_PROCESSING:"A refund is already processing for this payment. Reload its status before trying again.",
    REFUND_DEPOSIT_RESERVED:"This payment is in a deposit that is processing. You can refund it after processing finishes.",
    DEPOSIT_BATCH_ADJUSTED:"This batch includes a refund and cannot be retried at its original amount.",
    INSUFFICIENT_LEDGER_FUNDS: "There aren’t enough available funds for this amount. Reload the latest balance before trying again.",
    CHANNEL_ALREADY_USED: "This one-time payment request has already been paid. Its receipt is available in Payments.",
    CHANNEL_NOT_READY: "This request cannot accept a payment right now. Check its payment settings, status and expiry.",
    TEST_GATEWAY_NOT_READY: "Payment setup is not ready. Your account owner can review payment setup.",
    PAYMENT_NOT_REFUNDABLE: "This payment cannot be refunded. Reload its latest saved status.",
  };
  return error instanceof WorkspaceCommandError && error.code && messages[error.code] ? messages[error.code] : error instanceof Error ? error.message : "We couldn’t confirm the result. Retry the same request to recover it.";
}
const activationLabels: Record<ChannelActivation["state"], string> = { ACTIVE: "Ready", DISABLED: "Off", EXPIRED: "Expired", USED: "Already paid", NOT_READY: "Setup needed" };

export function MerchantOperations({ workspace: initialWorkspace, initial, section = "payments", showAdministration = true, channelId, onPendingChange, onOperationsChange, blocked = false }: { workspace: MerchantWorkspaceProjection; initial: MerchantOperationsProjection; section?: "setup" | "payments" | "channel" | "onboarding"; showAdministration?:boolean; channelId?:string; onPendingChange?:(pending:boolean)=>void; onOperationsChange?:(operations:MerchantOperationsProjection)=>void; blocked?:boolean }) {
  const [workspace, setWorkspace, workspaceChanged, isWorkspaceCurrent] = useServerProjection(initialWorkspace);
  const [operations, setOperations, operationsChanged, isOperationsCurrent] = useServerProjection(initial);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [reason, setReason] = useState("");

  const params = useSearchParams(), router = useRouter();
  const dashboardReturn=params.getAll("returnTo").length===1?merchantActivityReturn(params.get("returnTo")):null;
  const paymentHelpHref=(id:string)=>{const next=new URLSearchParams(params.toString());next.set("tab","help");next.set("new","1");next.set("payment",id);next.delete("case");next.delete("transfer");if(dashboardReturn)next.set("returnTo",dashboardReturn);else next.delete("returnTo");return `/merchants/${initialWorkspace.merchant.id}?${next}`;};
  const transferSelections=params.getAll("transfer");
  const transferId=section==="payments"&&transferSelections.length?(transferSelections.length===1&&!params.has("payment")?transferSelections[0].toLowerCase():"invalid-selection"):null;
  const selectedTransfer=transferId?operations.payouts.find(transfer=>transfer.id===transferId):undefined;
  const activity = params.get("activity") === "refunds" ? "refunds" : params.get("activity") === "transfers" ? "transfers" : "payments";
  const search = (params.get("q") ?? "").slice(0, 160);
  const requestedStatus = params.get("status") ?? "ALL";
  const status = ["APPROVED", "DECLINED", "REFUNDED"].includes(requestedStatus) ? requestedStatus : "ALL";
  const from = params.get("from") ?? "", to = params.get("to") ?? "";
  const paymentSelections = params.getAll("payment");
  const paymentId = section === "payments" && paymentSelections.length ? paymentSelections.length === 1 && paymentSelections[0] && !params.has("transfer") ? paymentSelections[0].toLowerCase() : "invalid-selection" : null;
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const isCurrent=()=>isWorkspaceCurrent()&&isOperationsCurrent();
  if(workspaceChanged||operationsChanged) {
    const readablePayment=choice&&(choice.kind==="payment"||choice.kind==="refund")?initial.payments.find(payment=>payment.id===choice.payment.id):undefined;
    const hasChannel=(id:string)=>initialWorkspace.channels.some(channel=>channel.id===id);
    const deniedChoice=choice?.kind==="payment"||choice?.kind==="refund"?!readablePayment:choice?.kind==="activation"?!hasChannel(choice.channelId):choice?.kind==="payout"?!initial.canPayout:choice?.kind==="setup"?!initial.canEnroll:choice?.kind==="gateway"?!initial.canConfigureGateway:choice?.kind==="enrollment"?!initial.canEnroll:false;
    if(deniedChoice){setChoice(null);setOpen(false);setReview(false);setReason("");}
    else if(readablePayment&&choice&&(choice.kind==="payment"||choice.kind==="refund")){
      setChoice({kind:choice.kind==="refund"&&!readablePayment.canRefund&&!attempt?"payment":choice.kind,payment:readablePayment});
    }else if(choice?.kind==="activation"&&!attempt){setChoice(null);setOpen(false);}
    setBusy(false);setStale(false);setNotice(null);
  }
  const merchant = workspace.merchant;
  const attemptVisible=!!attempt&&(attempt.kind==="reconcile"?operations.canReadPayments&&!!(operations.processingPayments?.some(payment=>payment.id===attempt.body.commandId)||operations.payments.some(payment=>payment.id===attempt.body.commandId)):attempt.kind==="payout"?operations.canPayout:attempt.kind==="refund"?workspace.ownerAccess&&operations.payments.some(payment=>payment.id===attempt.path.split("/")[2]):attempt.kind==="activation"?workspace.channels.some(channel=>channel.id===attempt.path.split("/")[2])&&operations.channels.some(channel=>channel.channelId===attempt.path.split("/")[2]):attempt.kind==="enrollment"?operations.canEnroll:operations.canConfigureGateway);
  const recoveryUnavailable=!!attempt&&!attemptVisible;
  const pending = busy || !!attempt;
  const locked = pending || stale || blocked;
  useMerchantNavigationLock(pending);
  useEffect(() => { onPendingChange?.(pending); return () => onPendingChange?.(false); }, [pending, onPendingChange]);
  const paymentsReady = merchant.status === "ACTIVE" && operations.gateway.mode === "TEST_READY" && operations.enrollment.status === "ENROLLED";
  const canStartSetup = showAdministration && merchant.status === "ACTIVE" && operations.canEnroll && operations.enrollment.status === "NOT_ENROLLED" && (operations.gateway.mode === "TEST_READY" || operations.gateway.mode === "NOT_CONFIGURED" && operations.canConfigureGateway);
  const processingPayments=(operations.processingPayments??[]).filter(payment=>!channelId||payment.channelId===channelId);
  const shownChannels = section === "channel" ? operations.channels.filter(channel => channel.channelId === channelId) : operations.channels;
  const selectedChannel = section === "channel" ? shownChannels[0] : undefined;
  const SetupHeading = section === "setup" ? "h2" : "h3";
  const selectedPayment = paymentId ? operations.payments.find(payment => payment.id === paymentId) : undefined;
  const displayChoice: Choice | null = open && choice && (choice.kind !== "refund" || choice.payment.id === paymentId) ? choice : selectedPayment && !attempt ? { kind: "payment", payment: selectedPayment } : null;
  const dialogOpen = displayChoice !== null;
  const validDate = (value: string) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  const dateError = !validDate(from) || !validDate(to) ? "Enter valid dates to filter these records." : from && to && from > to ? "The end date must be on or after the start date." : "";
  const activityRows = activity === "transfers" ? operations.payouts.map(transfer => ({ id: transfer.id, description: "Deposit", at: transfer.processedAt??transfer.createdAt, reference: transfer.testReference, amount: transfer.amount, status: transfer.status, payment: null as MerchantTestPayment | null, searchReference: transfer.testReference }))
    : operations.payments.filter(payment => activity !== "refunds" || payment.refund !== null).map(payment => ({ id: payment.id, description: payment.description, at: activity === "refunds" ? payment.refund!.createdAt : payment.createdAt, reference: activity === "refunds" ? payment.refund!.testReference : payment.testReference, amount: activity === "refunds" ? payment.refund!.amount : payment.amount, status: payment.status, payment, searchReference: `${payment.testReference} ${payment.refund?.testReference ?? ""}` }));
  const rows = activityRows.filter(row => !dateError && (activity !== "payments" || status === "ALL" || row.status === status) && (!from || row.at.slice(0, 10) >= from) && (!to || row.at.slice(0, 10) <= to) && `${row.description} ${row.searchReference}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => b.at.localeCompare(a.at) || a.id.localeCompare(b.id));
  function updateQuery(changes: Record<string, string | null>, push = false) {
    const query = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(changes)) { if (value) query.set(key, value); else query.delete(key); }
    const href = `${window.location.pathname}?${query.toString()}`;
    if (push) window.history.pushState(null, "", href); else window.history.replaceState(null, "", href);
  }
  function clearFilters() { updateQuery({ q: null, status: null, from: null, to: null, payment: null, transfer: null }); }
  function selectActivity(next: string) { updateQuery({ activity: next === "payments" ? null : next, status: null, payment: null, transfer: null }, true); }
  function backToPayments() { if (!pending) { setOpen(false); updateQuery({ payment: null }); } }
  const nameFor = (channelId: string) => workspace.channels.find(channel => channel.id === channelId)?.description ?? "Payment request";
  const amountFor = (channelId: string) => workspace.channels.find(channel => channel.id === channelId)?.amount;
  function choose(next: Choice) {
    if (locked) return;
    setReview(false); setReason("");  setNotice(null);
    if (next.kind === "payment") { setChoice(null); setOpen(false); updateQuery({ payment: next.payment.id, transfer: null }, true); }
    else { setChoice(next); setOpen(true); }
  }
  function close() { backToPayments(); }
  async function reload(showNotice = true) {
    try {
      const [response, channelResponse] = await Promise.all([fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}/operations`, { cache: "no-store", credentials: "same-origin" }), fetch(`/api/v1/merchants/${encodeURIComponent(merchant.id)}`, { cache: "no-store", credentials: "same-origin" })]);
      if(!isCurrent())return;
      if (!response.ok || !channelResponse.ok) throw new WorkspaceCommandError("This payment view is unavailable with your current access. Return to your Accept payments or retry.", !response.ok ? response.status : channelResponse.status);
      const next = await response.json() as MerchantOperationsProjection;
      const nextWorkspace = await channelResponse.json() as MerchantWorkspaceProjection;
      if(!isCurrent())return;
      setOperations(next); setWorkspace(nextWorkspace); onOperationsChange?.(next); setStale(false);
      if (choice?.kind === "activation") { setChoice(null); setOpen(false); }
      if (choice?.kind === "payment" || choice?.kind === "refund") {
        setChoice(null); setOpen(false); setReview(false);
      }
      if (showNotice) setNotice({ kind: "info", message: "Payments and available balance refreshed." });
      return { operations: next, workspace: nextWorkspace };
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && [401, 403, 404].includes(error.status ?? 0)) {
        setOperations(current => ({ ...current, channels: [], payments: [], payouts: [], settlements:[],processingPayments:[],pendingCardPayments:null, availableFunds: null, settledFunds:null,pendingDeposits:null,depositReview:null,bankFunds:null,canReadPayments: false, canConfigureGateway: false, canEnroll: false, canPayout: false }));
        setChoice(null); setOpen(false);
      }
      setStale(true); setNotice({ kind: "error", message: failure(error) });
    }
  }
  async function send(command: Attempt) {
    const retrying=attempt!==null;
    setBusy(true); setAttempt(command); setNotice(null);
    try {
      const raw=await merchantCommand<unknown>(merchant.id,command.path,command.method,command.body);
      if(command.kind==="reconcile"){
        const parsed=merchantOperationsProjectionSchema.safeParse(raw);if(!parsed.success||parsed.data.merchantUnitId!==merchant.id||parsed.data.serviceId!==merchant.merchant.serviceId||!parsed.data.payments.some(payment=>payment.id===command.body.commandId)||parsed.data.processingPayments?.some(payment=>payment.id===command.body.commandId))throw new WorkspaceCommandError("We couldn’t confirm this payment result. Check this request again.",null);
        if(!isCurrent())return;setOperations(parsed.data);onOperationsChange?.(parsed.data);setAttempt(null);setStale(false);setNotice({kind:"success",message:"Payment confirmed. Its receipt is now in Payments."});await reload(false);return;
      }
      const parsed=(command.kind==="gateway"?testGatewayProjectionSchema:command.kind==="enrollment"?testEnrollmentProjectionSchema:command.kind==="activation"?activationProjectionSchema:command.kind==="refund"?merchantTestPaymentProjectionSchema:merchantSettlementReceiptSchema).safeParse(raw);
      if(!parsed.success)throw new WorkspaceCommandError("We couldn’t confirm this payment result. Check this request again.",null);
      const result=parsed.data;
      const matches=command.kind==="gateway"?('serviceId' in result&&result.serviceId===merchant.merchant.serviceId):command.kind==="payout"?('terminalId' in result&&result.terminalId===merchant.id&&(!command.body.settlementId||('settlementId' in result&&result.settlementId===command.body.settlementId))):'merchantUnitId' in result&&result.merchantUnitId===merchant.id&&(command.kind!=="enrollment"||('serviceId' in result&&result.serviceId===merchant.merchant.serviceId))&&(command.kind!=="activation"||('channelId' in result&&result.channelId===command.path.split("/")[2]))&&(command.kind!=="refund"||('id' in result&&result.id===command.path.split("/")[2]&&'refund' in result&&!!result.refund));
      if(!matches)throw new WorkspaceCommandError("We couldn’t confirm this payment result. Check this request again.",null);
      if(!isCurrent())return;
      setAttempt(null); setStale(false);
      if (!command.next) setOpen(false);
      if (command.kind === "refund") updateQuery({ payment: null });
      setOperations(current => command.kind === "gateway" ? { ...current, gateway: result as TestGateway }
        : command.kind === "enrollment" ? { ...current, enrollment: result as TestMerchantEnrollment }
          : command.kind === "activation" ? { ...current, channels: current.channels.map(channel => channel.channelId === (result as ChannelActivation).channelId ? result as ChannelActivation : channel) }
            : command.kind === "refund" ? { ...current, payments: current.payments.map(payment => payment.id === (result as MerchantTestPayment).id ? result as MerchantTestPayment : payment) }
              : { ...current, settlements: [result as MerchantSettlementReceipt, ...current.settlements.filter(settlement => settlement.id !== (result as MerchantSettlementReceipt).id)] });
      // The second reviewed command keeps its original identifier and version. A retry
      // confirms the pending step; it never re-enables an already completed setting.
      if (command.next) {
        if (command.kind !== "gateway" || (result as TestGateway).mode !== "TEST_READY") {
          setOpen(false); setStale(true);
          setNotice({ kind: "error", message: "Payments were paused after this request. Your paused settings are preserved. Reload to review them." });
          return;
        }
        await send(command.next);
        return;
      }
      const message = command.kind === "refund" ? `Full refund saved. Reference ${(result as MerchantTestPayment).refund!.testReference}.` : command.kind === "payout" ? `Added to your payment balance. Reference ${(result as MerchantSettlementReceipt).reference}.` : "Payment setup saved. Your current settings are shown below.";
      if (!command.setup) setNotice(command.kind === "activation" ? null : { kind: "success", message });
      // A failed refresh does not turn a confirmed write into an unknown command.
      const refreshed = await reload(false);
      if (command.setup && refreshed && isCurrent()) {
        const ready = refreshed.workspace.merchant.status === "ACTIVE" && refreshed.operations.gateway.mode === "TEST_READY" && refreshed.operations.enrollment.status === "ENROLLED";
        setNotice(ready && section === "setup" ? null : { kind: ready ? "success" : "info", message: ready ? "Payments are ready. Create a payment request and share its payment link." : "Your setup request is saved. Payments are currently paused or need attention; review the latest settings below." });
      }
    } catch (error) {
      if(!isCurrent())return;
      if (error instanceof WorkspaceCommandError && !error.uncertain) { if(!retrying)setAttempt(null); setStale([401, 403, 404, 409].includes(error.status ?? 0)); }
      setNotice({ kind: "error", message: command.setup && command.kind === "enrollment" ? `Business payments are ready. We have not yet confirmed whether payments are enabled for this terminal. ${failure(error)}` : failure(error) });
    } finally { if(isCurrent())setBusy(false); }
  }
  function confirm() {
    if (!choice || locked || choice.kind === "setup" && !canStartSetup) return;
    const commandId = crypto.randomUUID();
    if (choice.kind === "gateway" || choice.kind === "setup" && operations.gateway.mode === "NOT_CONFIGURED") void send({ kind: "gateway", path: "/gateway", method: "PUT", body: { commandId, expectedVersion: operations.gateway.version, enabled: choice.kind === "setup" || choice.enabled }, ...(choice.kind === "setup" ? { setup: true, next: { kind: "enrollment", path: "/test-enrollment", method: "PUT", body: { commandId: crypto.randomUUID(), expectedVersion: operations.enrollment.version, enabled: true }, setup: true } as EnrollmentContinuation } : {}) });
    if (choice.kind === "enrollment" || choice.kind === "setup" && operations.gateway.mode === "TEST_READY") void send({ kind: "enrollment", path: "/test-enrollment", method: "PUT", body: { commandId, expectedVersion: operations.enrollment.version, enabled: choice.kind === "setup" || choice.enabled }, setup: choice.kind === "setup" });
    if (choice.kind === "activation") void send({ kind: choice.kind, path: `/channels/${choice.channelId}/activation`, method: "PUT", body: { commandId, expectedVersion: operations.channels.find(channel => channel.channelId === choice.channelId)!.version, expectedChannelVersion: choice.expectedChannelVersion, active: choice.active } });
    if (choice.kind === "refund") void send({ kind: choice.kind, path: `/payments/${choice.payment.id}/refund`, method: "POST", body: { commandId, expectedVersion: choice.payment.version, reason: reason.trim() } });
    if(choice.kind==="payout"){const current=choice.retry?.retryReview??operations.depositReview;if(current)void send({kind:choice.kind,path:"/settlements",method:"POST",body:{commandId,reviewToken:current.token,...(choice.retry?{settlementId:choice.retry.settlementId}:{})}});}
  }
  function reviewDetails() {
    if (choice?.kind === "refund" && (!reason.trim() || /[\u0000-\u001f\u007f-\u009f]/.test(reason))) { setNotice({ kind: "error", message: "Enter a plain-text reason for this full refund." }); return; }
    if(choice?.kind==="payout"&&!(choice.retry?.retryReview??operations.depositReview)){setNotice({kind:"error",message:"There are no received payments ready to move to your balance."});return;}
    setNotice(null); setReview(true);
  }
  const feedback = <>{pending && <p className="mop-notice" role="status">Keep this request open until the result is confirmed. Retry the same request here if the connection is interrupted.</p>}{recoveryUnavailable&&<div className="mop-notice" role="status"><p>Your current access no longer includes this request’s details. Its result is still unconfirmed. Retrying uses the same saved request and checks your current access.</p><p>Leaving does not cancel or confirm the request. Check your saved payment history when your access is restored.</p><Button variant="quiet" disabled={busy} onClick={()=>router.push("/merchant-services")}>Leave for now</Button></div>}{notice && <Feedback {...notice} />}{attempt && !busy && <Button variant="secondary" onClick={() => void send(attempt)}>{attempt.setup&&!recoveryUnavailable ? "Retry payment setup" : "Check request again"}</Button>}{attempt && attempt.kind!=="reconcile" && attemptVisible && !open && <Button variant="quiet" onClick={() => { if (choice?.kind === "refund") updateQuery({ payment: choice.payment.id }); setOpen(true); }}>Continue this action</Button>}{(stale||recoveryUnavailable) && <Button variant="secondary" busy={busy} onClick={() => { setBusy(true); void reload().finally(() => {if(isCurrent())setBusy(false);}); }}>Reload payment status</Button>}</>;
  const context = <dl className="mop-summary"><div><dt>Payment terminal</dt><dd>{merchant.displayName}</dd></div><div><dt>Business</dt><dd>{merchant.merchant.displayName}</dd></div></dl>;
  const receipt = (payment: MerchantTestPayment) => <dl className="mop-summary"><div><dt>Payment</dt><dd>{payment.description}</dd></div><div><dt>Amount</dt><dd>{formatMoney(payment.amount)}</dd></div>{payment.paymentMethod&&<div><dt>Payment method</dt><dd>{payment.paymentMethod}</dd></div>}<div><dt>Status</dt><dd><StatusBadge status={payment.status} /></dd></div><div><dt>Reference</dt><dd className="mop-reference">{payment.testReference}</dd></div><div><dt>Recorded</dt><dd>{formatDate(payment.createdAt)}</dd></div><div><dt>Fees</dt><dd>{payment.source==="NETWORK"?"$0.00 · sandbox rate":"Not applied"}</dd></div>{payment.refund && <><div><dt>Full refund</dt><dd>{formatMoney(payment.refund.amount)}</dd></div><div><dt>Refund reason</dt><dd>{payment.refund.reason}</dd></div><div><dt>Refund reference</dt><dd className="mop-reference">{payment.refund.testReference}</dd></div><div><dt>Refund completed</dt><dd>{formatDate(payment.refund.createdAt)}</dd></div></>}</dl>;
  const title = displayChoice?.kind === "setup" ? "Enable payments?" : displayChoice?.kind === "gateway" ? displayChoice.enabled ? "Turn on payments?" : "Turn off payments?" : displayChoice?.kind === "enrollment" ? displayChoice.enabled ? "Allow payments on this terminal?" : "Stop payments on this terminal?" : displayChoice?.kind === "activation" ? displayChoice.active ? "Allow payments for this request?" : "Stop payments for this request?" : displayChoice?.kind === "refund" ? review ? "Review full refund" : "Refund this payment" : displayChoice?.kind === "payout" ? review ? "Review received payments" : "Move received payments" : "Payment details";

  return <section className="mop-workspace" aria-label={section === "channel" ? "Payment request settings" : section === "onboarding" ? "Getting started with payments" : section === "setup" ? "Payment setup" : "Payments"}>
    {section === "payments" && dashboardReturn && <Link href={dashboardReturn}>← Back to payment activity</Link>}
    {section === "payments" && <div className="mop-heading"><div><h2>Payments</h2><p>Follow payments received through {merchant.displayName}.</p></div></div>}

    {!dialogOpen && feedback}
    {section !== "payments" ? <>
      {(section === "setup" || !paymentsReady || section === "onboarding" && !workspace.channels.length) && <article className="mop-panel mop-setup-intro"><p className="consumer-eyebrow">{paymentsReady ? "PAYMENT SETUP READY" : "START RECEIVING PAYMENTS"}</p><SetupHeading>{paymentsReady ? "Your payments are ready" : canStartSetup ? "Enable payments for this terminal" : "Payments need your attention"}</SetupHeading><p>{paymentsReady ? "Create a payment request, then share its link with a customer." : canStartSetup ? `Allow ${merchant.displayName} to receive payments. Then create a payment request and share its link.` : merchant.status !== "ACTIVE" ? "This payment terminal is paused. The account owner can review its status in Settings before restarting payments." : operations.gateway.mode !== "TEST_READY" ? `Payment processing is ${operations.gateway.mode === "DISABLED" ? "paused" : "not set up"}. ${merchant.merchant.displayName} controls this setting.` : `Payments for this terminal are ${operations.enrollment.status === "DISABLED" ? "turned off" : "not set up yet"}. The account owner can review its payment settings.`}</p>{canStartSetup && <Button disabled={locked} onClick={() => choose({ kind: "setup" })}>Enable payments</Button>}{paymentsReady && workspace.canCreateChannel && section === "setup" && <Link className="consumer-button consumer-button-primary" href={`/merchants/${merchant.id}?tab=channels&new=1`}>Create payment request</Link>}</article>}
      {section === "setup" && <details className="mop-settings"><summary>Advanced payment settings</summary><div className="mop-setup-grid"><article className="mop-panel"><p className="consumer-eyebrow">PAYMENT PROCESSING</p><h3>Payments</h3><p>{merchant.merchant.displayName}</p><StatusBadge status={operations.gateway.mode} label={operations.gateway.mode === "TEST_READY" ? "Ready" : operations.gateway.mode === "DISABLED" ? "Off" : "Not set up"} /><p>Turn payments on or off for the whole business, including every payment terminal.</p>{showAdministration && operations.canConfigureGateway ? <Button disabled={locked} variant={operations.gateway.mode === "TEST_READY" ? "secondary" : "primary"} onClick={() => choose({ kind: "gateway", enabled: operations.gateway.mode !== "TEST_READY" })}>{operations.gateway.mode === "TEST_READY" ? "Turn off payments" : "Turn on payments"}</Button> : <p className="mop-muted">Your account owner controls this setting.</p>}</article>
        <article className="mop-panel"><p className="consumer-eyebrow">THIS PAYMENT TERMINAL</p><h3>{merchant.displayName}</h3><StatusBadge status={operations.enrollment.status} label={operations.enrollment.status === "ENROLLED" ? "Connected" : operations.enrollment.status === "DISABLED" ? "Disconnected" : "Not connected"} /><p>Allow this terminal to receive payments. This setting applies only to this terminal.</p>{showAdministration && operations.canEnroll ? <Button disabled={locked || operations.gateway.mode !== "TEST_READY" && operations.enrollment.status !== "ENROLLED"} variant={operations.enrollment.status === "ENROLLED" ? "secondary" : "primary"} onClick={() => choose({ kind: "enrollment", enabled: operations.enrollment.status !== "ENROLLED" })}>{operations.enrollment.status === "ENROLLED" ? "Stop terminal payments" : "Allow terminal payments"}</Button> : <p className="mop-muted">Your account owner controls payments for this terminal.</p>}{operations.gateway.mode !== "TEST_READY" && <p className="mop-muted">Turn on business payments first.</p>}</article></div></details>}
      {section !== "onboarding" && (section === "channel" || shownChannels.length > 0) && <div className="mop-panel"><h3>{section === "channel" ? selectedChannel?.state === "ACTIVE" ? "Your request can accept payments" : selectedChannel?.state === "USED" ? "This request has been paid" : selectedChannel?.canActivate ? "Allow payments for this request" : "Payment request status" : "Your payment requests"}</h3><p>{section === "channel" ? selectedChannel?.state === "ACTIVE" ? "Create or preview the payment link below. Customers pay without an Etail Depot login. In this sandbox, they choose a sample Visa, Mastercard, American Express or Discover card." : selectedChannel?.canActivate ? "Allow payments for this request, then create a payment link to share." : selectedChannel?.state === "USED" ? "This one-time request has been paid. You can find its receipt in Payments." : "Review the current status and the actions available with your access." : "Open a payment request to manage its settings and payment link."}</p>{shownChannels.length ? <ul className="mop-channel-list">{shownChannels.map(channel => <li key={channel.channelId}><div><strong>{nameFor(channel.channelId)}</strong>{amountFor(channel.channelId) && <span>{formatMoney(amountFor(channel.channelId)!)}</span>}<StatusBadge status={channel.state} label={activationLabels[channel.state]} /></div><div className="mop-actions">{channel.canActivate && workspace.channels.some(item => item.id === channel.channelId) && <Button disabled={locked} onClick={() => choose({ kind: "activation", channelId: channel.channelId, active: true, expectedChannelVersion: workspace.channels.find(item => item.id === channel.channelId)!.version })}>Allow payments</Button>}{channel.canDisable && workspace.channels.some(item => item.id === channel.channelId) && <Button variant="quiet" disabled={locked} onClick={() => choose({ kind: "activation", channelId: channel.channelId, active: false, expectedChannelVersion: workspace.channels.find(item => item.id === channel.channelId)!.version })}>Stop payments</Button>}</div></li>)}</ul> : <EmptyState title={section === "channel" ? "Payment settings need refreshing" : "No payment requests yet"} description={section === "channel" ? "Reload this request’s payment settings to continue." : "Your saved payment requests will appear here."}>{section === "channel" && <Button variant="secondary" disabled={locked} onClick={() => void reload()}>Reload payment status</Button>}</EmptyState>}{section === "channel" && !paymentsReady && showAdministration && <Link href={merchantRecordHref(merchant.id,{tab:"verification"},dashboardReturn)}>Review payment settings</Link>}</div>}
      {section === "onboarding" && !paymentsReady && !canStartSetup && showAdministration && <Link href={merchantRecordHref(merchant.id,{tab:"verification"},dashboardReturn)}>Review payment settings</Link>}
    </> : <>
      {showAdministration&&<section className="mop-money-summary" id="available-balance" aria-label="Current available balance"><div className="mop-money-card"><p>Ready to move</p><strong>{operations.availableFunds?.formatted??"Unavailable"}</strong><span>Received payments you can move into your available balance.</span>{showAdministration&&operations.canPayout&&<Button disabled={locked||!operations.depositReview} onClick={()=>choose({kind:"payout"})}>Move to balance</Button>}</div>{operations.pendingCardPayments&&BigInt(operations.pendingCardPayments.minor)>0n&&<div className="mop-money-card"><p>Card payments processing</p><strong>{operations.pendingCardPayments.formatted}</strong><span>These payments cannot be moved or refunded until processing is complete.</span></div>}{operations.pendingDeposits&&BigInt(operations.pendingDeposits.minor)>0n&&<div className="mop-money-card"><p>Processing</p><strong>{operations.pendingDeposits?.formatted??"Unavailable"}</strong><span>Reserved for deposits in progress</span><button type="button" className="mop-money-link" disabled={locked} onClick={()=>selectActivity("transfers")}>View deposits →</button></div>}{operations.settledFunds&&BigInt(operations.settledFunds.minor)>0n&&<div className="mop-money-card"><p>Returned deposits</p><strong>{operations.settledFunds?.formatted??"Unavailable"}</strong><span>Available again after a failed deposit</span></div>}<div className="mop-money-card"><p>Payment balance</p><strong>{operations.bankFunds?.formatted??"Unavailable"}</strong><span>Available for refunds and withdrawals. Separate from your card balance.</span></div></section>}
      {operations.canReadPayments ? <div className="mop-panel mop-activity-panel">
        <nav className="mop-activity-nav" aria-label="Payment activity views">{([['payments', 'Payments'], ['refunds', 'Refunds'], ['transfers', 'Deposits']] as const).filter(([value])=>value!=="transfers"||showAdministration).map(([value, label]) => <button type="button" key={value} aria-label={label} aria-current={activity === value ? "page" : undefined} disabled={locked} onClick={() => selectActivity(value)}>{label}<span>{value === "payments" ? operations.payments.length : value === "refunds" ? operations.payments.filter(payment => payment.refund).length : operations.payouts.length}</span></button>)}</nav>
        <div className="mop-filters"><label className="mop-search">{activity === "refunds" ? "Search refunds" : activity === "transfers" ? "Search deposits" : "Search payments"}<input type="search" value={search} maxLength={160} disabled={locked} onChange={event => updateQuery({ q: event.target.value || null, payment: null })} placeholder="Description or reference" /></label>{activity === "payments" && <label>Payment status<select value={status} disabled={locked} onChange={event => updateQuery({ status: event.target.value === "ALL" ? null : event.target.value, payment: null })}><option value="ALL">All statuses</option><option value="APPROVED">Approved</option><option value="DECLINED">Declined</option><option value="REFUNDED">Refunded</option></select></label>}<label>From date (UTC)<input type="date" value={validDate(from) ? from : ""} disabled={locked} onChange={event => updateQuery({ from: event.target.value || null, payment: null })} /></label><label>To date (UTC)<input type="date" value={validDate(to) ? to : ""} disabled={locked} onChange={event => updateQuery({ to: event.target.value || null, payment: null })} /></label><Button variant="quiet" disabled={locked} onClick={() => { setBusy(true); void reload().finally(() => {if(isCurrent())setBusy(false);}); }}>Refresh payments</Button></div>
        <div className="mop-result-bar"><p aria-live="polite">{rows.length} of {activityRows.length} {activity==="transfers"?"deposits":activity} · {activity === "refunds" ? "refund date" : activity === "transfers" ? "deposit date" : "payment date"} · UTC</p>{(search || status !== "ALL" || from || to) && <Button variant="quiet" disabled={locked} onClick={clearFilters}>Clear filters</Button>}</div>
        {activity==="transfers"&&<p className="mop-muted">Deposit dates show completion or return. Deposits still processing use the request date.</p>}
        {dateError && <Feedback kind="error" message={dateError} />}
        {transferId && !selectedTransfer && <EmptyState title="This deposit is unavailable" description="Your access may have changed, or this deposit belongs to another payment terminal."><Button variant="secondary" onClick={()=>updateQuery({transfer:null})}>Back to deposits</Button></EmptyState>}
        {paymentId && !selectedPayment && <EmptyState title="This payment is unavailable" description="It may belong to another payment terminal or your access may have changed. No other payment has been opened."><Button variant="secondary" disabled={busy} onClick={backToPayments}>Back to payments</Button></EmptyState>}
        {activity==="payments"&&processingPayments.length>0&&<section aria-label="Card payments processing"><h3>Processing</h3><ul>{processingPayments.map(payment=><li key={payment.id}>{payment.description} · {payment.paymentMethod} · {payment.amount.formatted}<span> — Waiting for payment confirmation</span> <Button disabled={locked} onClick={()=>void send({kind:"reconcile",path:`/processing-payments/${payment.id}/process`,method:"POST",body:{commandId:payment.id}})}>Check payment status</Button></li>)}</ul></section>}
        {rows.length ? <table className="mop-table"><caption className="consumer-sr-only">{activity === "transfers" ? "Deposits" : activity === "refunds" ? "Refunds" : "Payments"} for {merchant.displayName}</caption><thead><tr><th scope="col">{activity === "transfers" ? "Deposit" : "Payment"}</th><th scope="col">Date (UTC)</th><th scope="col">Reference</th><th scope="col">Status</th><th scope="col" className="mop-number">Amount</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td data-label={activity === "transfers" ? "Deposit" : "Payment"}>{row.payment ? <button className="mop-payment-row" disabled={locked} onClick={() => choose({ kind: "payment", payment: row.payment! })} aria-label={`View ${row.payment.status.toLowerCase()} payment ${row.payment.description} ${row.payment.testReference}`}>{row.description}<span aria-hidden="true">↗</span></button> : <button className="mop-payment-row" disabled={locked} onClick={()=>updateQuery({transfer:row.id,payment:null})} aria-label={`View deposit ${row.reference}`}>{row.description}<span aria-hidden="true">↗</span></button>}</td><td data-label="Date (UTC)"><time dateTime={row.at}>{formatDate(row.at)}</time></td><td data-label="Reference" className="mop-reference">{row.reference}</td><td data-label="Status"><StatusBadge status={row.status} /></td><td data-label="Amount" className="mop-number">{formatMoney(row.amount)}</td></tr>)}</tbody></table> : !dateError && <EmptyState title={search || status !== "ALL" || from || to ? "No matching records" : activity === "payments" ? processingPayments.length ? "No completed payments yet" : "Your first payment starts here" : activity === "refunds" ? "No refunds yet" : "No deposits yet"} description={search || status !== "ALL" || from || to ? "Try a different reference, date range or status." : activity === "payments" ? processingPayments.length ? "Payments currently processing will appear here after confirmation." : "Create a payment request, then share its payment link with your customer." : activity === "refunds" ? "Saved refunds appear here with their original payment." : "Pending, completed and failed deposits appear here."}>{activity === "payments" && !processingPayments.length && workspace.canCreateChannel && <Link className="consumer-button consumer-button-primary" href={`/merchants/${merchant.id}?tab=${paymentsReady ? "channels&new=1" : "verification"}`}>{paymentsReady ? "Create payment request" : "Set up payments"}</Link>}</EmptyState>}
      </div> : <EmptyState title="Payments aren’t available with this access" description="Ask your account owner for payment access." />}

    </>}
    {showAdministration&&operations.settlements.length>0&&<details className="mop-panel"><summary>Payments moved to your balance</summary>{operations.settlements.map(settlement=><p key={settlement.id}>{formatDate(settlement.createdAt)} · {settlement.amount.formatted} · {settlement.reference}</p>)}</details>}
    <WorkspaceDialog open={showAdministration&&!!selectedTransfer} onClose={()=>updateQuery({transfer:null})} title="Deposit details" serviceName={merchant.displayName}>{context}{selectedTransfer&&<><dl className="mop-summary"><div><dt>Amount</dt><dd>{formatMoney(selectedTransfer.amount)}</dd></div><div><dt>Reference</dt><dd className="mop-reference">{selectedTransfer.testReference}</dd></div><div><dt>Requested</dt><dd><time dateTime={selectedTransfer.createdAt}>{depositDateTime(selectedTransfer.createdAt)}</time></dd></div>{selectedTransfer.processedAt&&selectedTransfer.status!=="PENDING"&&<div><dt>{selectedTransfer.status==="COMPLETED"?"Completed":"Returned"}</dt><dd><time dateTime={selectedTransfer.processedAt}>{depositDateTime(selectedTransfer.processedAt)}</time></dd></div>}<div><dt>Status</dt><dd>{selectedTransfer.status.toLowerCase()}</dd></div><div><dt>Destination</dt><dd>Payment balance</dd></div></dl><section><h3>Payments in this deposit</h3>{selectedTransfer.payments.map(payment=><p key={payment.id}><Link href={merchantRecordHref(merchant.id,{tab:"payments",payment:payment.id},dashboardReturn)}>{payment.description} · {payment.reference}</Link> <strong>{payment.amount.formatted}</strong>{payment.refundedAmount.minor!=="0"&&<small> · Refunded {payment.refundedAmount.formatted}</small>}</p>)}</section><div className="mop-actions">{showAdministration&&operations.canPayout&&selectedTransfer.retryReview&&<Button disabled={locked} onClick={()=>{updateQuery({transfer:null});choose({kind:"payout",retry:selectedTransfer});}}>Add returned money</Button>}{dashboardReturn?<Link href={dashboardReturn}>Back to payment activity</Link>:<Button variant="quiet" onClick={()=>updateQuery({transfer:null})}>Back to deposits</Button>}</div></>}</WorkspaceDialog>
    <WorkspaceDialog open={dialogOpen} onClose={close} title={title} serviceName={merchant.displayName}>
      {dialogOpen&&feedback}{context}
      {displayChoice?.kind === "setup" && <><p>Enable payments for {merchant.displayName}. {operations.gateway.mode === "NOT_CONFIGURED" ? "This also turns on payments for your business." : "Your business is already set up to receive payments."}</p><p>{merchant.merchant.displayName} remains responsible for all terminal payments.</p>{busy && <p role="status">{attempt?.kind === "enrollment" ? "Business payments are ready. Enabling this terminal…" : "Turning on business payments…"}</p>}</>}
      {displayChoice?.kind === "gateway" && <p>{displayChoice.enabled ? "Turn on payments for this business. You can then allow payments on its terminals and payment requests." : "Stop new payments for the whole business and every payment terminal. Payment history and refunds remain available."}</p>}
      {displayChoice?.kind === "enrollment" && <p>{displayChoice.enabled ? "Allow this terminal to receive payments. Then allow payments for a request and share its link." : "Stop new payments for this terminal. Other terminals keep their current settings."}</p>}
      {displayChoice?.kind === "activation" && <><dl className="mop-summary"><div><dt>Payment request</dt><dd>{nameFor(displayChoice.channelId)}</dd></div><div><dt>Amount</dt><dd>{amountFor(displayChoice.channelId) ? formatMoney(amountFor(displayChoice.channelId)!) : "Unavailable"}</dd></div></dl><p>{displayChoice.active ? "Allow this request to receive payments. Next, create its payment link and copy it to share with customers." : "Stop new payments for this request. Its payment history remains available."}</p></>}
      {displayChoice?.kind === "payment" && <>{receipt(displayChoice.payment)}{displayChoice.payment.refundUnavailableReason&&<p>{displayChoice.payment.refundUnavailableReason}</p>}<div className="mop-actions"><Link href={paymentHelpHref(displayChoice.payment.id)}>Get help with this payment</Link><Link href={merchantRecordHref(merchant.id,{tab:"channels",channel:displayChoice.payment.channelId},dashboardReturn)}>View payment request</Link>{dashboardReturn&&<Link href={dashboardReturn}>Back to payment activity</Link>}<Button variant="quiet" onClick={close}>Back to payments</Button>{showAdministration && displayChoice.payment.canRefund && <Button disabled={locked} variant="secondary" onClick={() => { setChoice({ kind: "refund", payment: displayChoice.payment }); setOpen(true); setReview(false); setReason(""); }}>Refund payment</Button>}</div></>}
      {displayChoice?.kind === "refund" && <>{receipt(displayChoice.payment)}{review ? <><dl className="mop-summary"><div><dt>Refund reason</dt><dd>{reason}</dd></div></dl><p>The full {formatMoney(displayChoice.payment.amount)} returns from {displayChoice.payment.refundSource==="GROUP_MONEY"?"your payment balance":"these received payments before they move to your balance"}. The original receipt stays saved.</p></> : <label className="mop-field">Reason for refund<textarea required maxLength={300} rows={3} value={reason} disabled={locked} onChange={event => setReason(event.target.value)} /></label>}</>}
      {displayChoice?.kind === "payout" && <><dl className="mop-summary"><div><dt>Amount to move</dt><dd>{(displayChoice.retry?.retryReview??operations.depositReview)?.amount.formatted??"Unavailable"}</dd></div><div><dt>Payments included</dt><dd>{(displayChoice.retry?.retryReview??operations.depositReview)?.paymentCount??0}</dd></div><div><dt>Destination</dt><dd>Payment balance</dd></div></dl><p>Move these received payments into your payment balance for refunds or withdrawals. This step is called settlement. It does not send money to a bank or add money to your card balance.</p></>}

      {displayChoice && displayChoice.kind !== "payment" && <div className="mop-actions"><Button variant="quiet" disabled={locked} onClick={() => review ? setReview(false) : close()}>{review ? "Back to details" : "Cancel"}</Button>{(displayChoice.kind === "refund" || displayChoice.kind === "payout") && !review ? <Button disabled={locked} onClick={reviewDetails}>{displayChoice.kind === "refund" ? "Review refund" : "Review received payments"}</Button> : <Button busy={busy} disabled={locked} onClick={confirm}>{displayChoice.kind === "refund" ? "Confirm full refund" : displayChoice.kind === "payout" ? "Move to balance" : displayChoice.kind === "setup" ? "Enable payments" : "Confirm setting"}</Button>}</div>}
    </WorkspaceDialog>
  </section>;
}
