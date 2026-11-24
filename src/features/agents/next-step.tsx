"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useClientReady } from "@/shared/ui/use-client-ready";
import { resolveSetupPath, setupHandoff, setupPlan } from "./setup-paths";
import { TaskPlan } from "./task-plan";
import styles from "./next-step.module.css";

export function NextStep() {
  const ready = useClientReady();
  const [answers, setAnswers] = useState<string[]>([]);
  const [copyState, setCopyState] = useState("");
  const [showBrief, setShowBrief] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  const revision = useRef(0);
  const downloadUrl = useRef<string | null>(null);
  useEffect(() => () => { if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current); }, []);
  const { node, selections, validAnswers } = resolveSetupPath(answers);
  const brief = node.kind === "result" ? setupHandoff(selections, node) : "";

  useEffect(() => {
    if (focusNext.current) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
      focusNext.current = false;
    }
  }, [answers]);

  function change(next: string[]) {
    revision.current += 1;
    focusNext.current = true;
    setCopyState(""); setShowBrief(false); setAnswers(next);
  }

  async function copyBrief() {
    const current = revision.current;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(brief);
      if (current === revision.current) setCopyState("Copied. Your brief is ready to share.");
    } catch {
      if (current === revision.current) { setShowBrief(true); setCopyState("Select and copy the brief below."); }
    }
  }

  function saveBrief() {
    if (node.kind !== "result") return;
    try {
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
      downloadUrl.current = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = downloadUrl.current;
      link.download = `trolleys-${node.id.replaceAll(":", "-")}-plan.txt`;
      document.body.append(link); link.click(); link.remove();
      setCopyState("Download started. Keep your brief with your project notes.");
    } catch {
      setShowBrief(true); setCopyState("Select and copy the brief below.");
    }
  }

  return <section id="next-step" className={styles.helper} aria-labelledby="next-step-title">
    <div className={styles.intro}>
      <h1 id="next-step-title">Trolleys for Agents</h1>
      <p>Choose a merchant task and prepare a plan for your assistant or team, with steps and links to the relevant guides.</p>
      <p className={styles.privacy}>No account details needed. Your choices stay in your browser until you copy or save your brief.</p>
      <nav className={styles.direct} aria-label="Browse guidance">
        <span>Go straight to a guide</span>
        <Link prefetch={false} href="/resources/merchant-account-setup">Account setup</Link>
        <Link prefetch={false} href="/resources/shopify-gateway-integration">Shopify</Link>
        <Link prefetch={false} href="/resources/woocommerce-gateway-integration">WooCommerce</Link>
        <Link prefetch={false} href="/developers/getting-started">Developers</Link>
        <Link prefetch={false} href="/resources/help#payments">Payment questions</Link>
        <Link prefetch={false} href="/use-cases/software-platforms/payment-models">Platform payment models</Link>
      </nav>
      <a className={styles.reference} href="#task-reference">Browse the task reference</a>
    </div>
    <div className={styles.panel} data-setup-ready={ready ? "true" : "false"}>
      {selections.length > 0 && <div className={styles.context} role="group" aria-label="Your selections">
        <p>{selections.map(item => item.answer).join(" · ")}</p>
        <div className={styles.history}><button type="button" onClick={() => change(validAnswers.slice(0, -1))}>Back</button><button type="button" onClick={() => change([])}>Start again</button></div>
      </div>}
      <h2 key={node.id} ref={heading} tabIndex={-1} className={styles.question}>{node.title}</h2>
      {node.kind === "question" ? <>
        <p className={styles.note}>{node.note}</p>
        <div className={styles.choices}>{node.choices.map(choice => <button type="button" key={choice.id} disabled={!ready} onClick={() => change([...validAnswers, choice.id])}>{choice.label}</button>)}</div>
        <noscript><p>Use the guide links or task reference to continue without JavaScript.</p></noscript>
      </> : <>
        <p className={styles.body}>{node.body}</p>
        <Link prefetch={false} className={styles.action} href={node.action.href}>{node.action.label}</Link>
        <dl className={styles.details}><div><dt>Who handles it</dt><dd>{node.owner}</dd></div><div><dt>You’re ready to move on when</dt><dd>{node.complete}</dd></div></dl>
        <p className={styles.caution}>{node.note}</p>
        <Link prefetch={false} className={styles.reference} href={node.reference.href}>{node.reference.label}</Link>
        <details key={node.id} className={styles.planDisclosure}>
          <summary><h3>View your action plan</h3></summary>
          <TaskPlan steps={setupPlan(node).steps} />
        </details>
        <div className={styles.share}><button type="button" onClick={() => setShowBrief(!showBrief)} aria-expanded={showBrief} aria-controls="setup-brief">{showBrief ? "Hide your brief" : "View your brief"}</button><button type="button" onClick={copyBrief}>Copy brief</button><button type="button" onClick={saveBrief}>Save brief</button></div>
        <p className={styles.copyStatus} role="status">{copyState}</p>
        {showBrief && <div className={styles.brief} id="setup-brief"><label htmlFor="setup-brief-text">Your next step brief</label><textarea id="setup-brief-text" readOnly value={brief} rows={12} spellCheck={false} /></div>}
      </>}
    </div>
  </section>;
}
